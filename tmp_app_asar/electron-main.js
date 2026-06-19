import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import fs from 'fs'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const db = require('./server/db')

function writeMainLog(line) {
  try {
    const p = path.join(os.tmpdir(), 'sampix_main.log')
    fs.appendFileSync(p, `[${new Date().toISOString()}] ${line}\n`)
  } catch (e) { console.error('cannot write main log', e) }
}

async function createWindow() {
  try { await db.init() } catch (e) { writeMainLog('db.init error: ' + (e && e.stack ? e.stack : String(e))) }
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  // load local index.html (for packaged app)
  // Usar la build de Vite en build/renderer cuando esté empaquetada
  const indexPath = path.join(__dirname, 'build', 'renderer', 'index.html')
  if (require('fs').existsSync(indexPath)) {
    await win.loadFile(indexPath)
  } else {
    // fallback a index.html en root (si se copió allí)
    await win.loadFile(path.join(__dirname, 'index.html'))
  }
  // Abrir DevTools para diagnosticar el renderer empaquetado
  try { win.webContents.openDevTools({ mode: 'detach' }) } catch (e) { /* no bloquear */ }
}

ipcMain.handle('cuentas:get', async () => {
  return await db.all('SELECT * FROM cuentas ORDER BY id DESC')
})

ipcMain.handle('cuentas:create', async (event, payload) => {
  const info = await db.run('INSERT INTO cuentas (servicio, correo, password, perfiles, ocupados, disponibles, renovacion, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [payload.servicio, payload.correo, payload.password, payload.perfiles || 0, payload.ocupados || 0, payload.disponibles || 0, payload.renovacion || null, payload.tipo || 'personal'])
  return { id: info.lastID }
})

ipcMain.handle('cuentas:update', async (event, id, payload) => {
  await db.run('UPDATE cuentas SET servicio = ?, correo = ?, password = ?, perfiles = ?, ocupados = ?, disponibles = ?, renovacion = ?, tipo = ? WHERE id = ?', [payload.servicio, payload.correo, payload.password, payload.perfiles || 0, payload.ocupados || 0, payload.disponibles || 0, payload.renovacion || null, payload.tipo || 'personal', id])
  return { ok: true }
})

ipcMain.handle('cuentas:delete', async (event, id) => {
  await db.run('DELETE FROM cuentas WHERE id = ?', [id])
  return { ok: true }
})

app.whenReady().then(() => { try { return createWindow() } catch (e) { writeMainLog('createWindow threw: ' + (e && e.stack ? e.stack : String(e))) } })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
