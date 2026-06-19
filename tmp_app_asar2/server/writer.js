const fs = require('fs')
const path = require('path')

// Ruta por defecto (Windows) — puede sobrescribirse con env ONE_DRIVE_PATH
const DIR = process.env.ONE_DRIVE_PATH || 'C:\\Users\\USUARIO\\OneDrive\\Desktop\\SAMPIX.TEC'

function ensureDir() {
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR, { recursive: true })
  }
}

function writeJson(prefix, obj) {
  ensureDir()
  const filename = `${prefix}-${Date.now()}.json`
  const full = path.join(DIR, filename)
  fs.writeFileSync(full, JSON.stringify(obj, null, 2), 'utf8')
  return full
}

function writeLogin(user) {
  const payload = { event: 'login', at: new Date().toISOString(), user }
  try {
    return writeJson('login', payload)
  } catch (err) {
    console.error('writer: failed to write login', err)
  }
}

function writeVenta(venta) {
  const payload = { event: 'venta', at: new Date().toISOString(), venta }
  try {
    return writeJson('venta', payload)
  } catch (err) {
    console.error('writer: failed to write venta', err)
  }
}

function writeCliente(cliente, action = 'create') {
  const payload = { event: 'cliente', action, at: new Date().toISOString(), cliente }
  try {
    return writeJson('cliente', payload)
  } catch (err) {
    console.error('writer: failed to write cliente', err)
  }
}

function writeCuenta(cuenta, action = 'create') {
  const payload = { event: 'cuenta', action, at: new Date().toISOString(), cuenta }
  try {
    return writeJson('cuenta', payload)
  } catch (err) {
    console.error('writer: failed to write cuenta', err)
  }
}

module.exports = { writeLogin, writeVenta, writeCliente, writeCuenta }
