const path = require('path')
const fs = require('fs')
const os = require('os')
require('dotenv').config()

// Determine writable folder for data
let dataDir
try {
  const { app } = require('electron')
  dataDir = app && app.getPath ? app.getPath('userData') : path.join(os.homedir(), '.sampix')
} catch (e) {
  dataDir = path.join(os.homedir(), '.sampix')
}
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

// Prefer sqlite3 if available, otherwise use a simple JSON fallback
let sqliteAvailable = false
let sqlite3 = null
try {
  sqlite3 = require('sqlite3').verbose()
  sqliteAvailable = true
} catch (e) {
  sqliteAvailable = false
}

const DB_FILE = path.join(dataDir, 'data.sqlite')
const JSON_FILE = path.join(dataDir, 'data.json')

const bcrypt = require('bcryptjs')

if (sqliteAvailable) {
  const db = new sqlite3.Database(DB_FILE)

  function run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err)
        resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }

  function all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })
  }

  function get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  }

  async function init() {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    try {
      const existing = await all('SELECT email FROM users')
      const emails = (existing || []).map(e => e.email)
      const defaults = [
        { name: 'Samuel', email: 'samuel', pass: 'samuel' },
        { name: 'Alex', email: 'alex', pass: 'alex' },
        { name: 'Paula', email: 'paula', pass: 'paula' }
      ]
      for (const u of defaults) {
        if (!emails.includes(u.email)) {
          const hashed = await bcrypt.hash(u.pass, 10)
          await run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [u.name, u.email, hashed])
        }
      }
    } catch (e) { }

    await run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        servicio TEXT,
        vencimiento TEXT,
        estado TEXT,
        valor TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS cuentas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        servicio TEXT,
        correo TEXT,
        password TEXT,
        perfiles INTEGER,
        ocupados INTEGER,
        disponibles INTEGER,
        renovacion TEXT,
        tipo TEXT DEFAULT 'personal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    try {
      const cols = await all("PRAGMA table_info(cuentas);")
      const hasTipo = cols && cols.find && cols.find(c => c.name === 'tipo')
      if (!hasTipo) {
        await run("ALTER TABLE cuentas ADD COLUMN tipo TEXT DEFAULT 'personal';")
      }
    } catch (err) {}

    await run(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT,
        servicio TEXT,
        valor REAL DEFAULT 0,
        metodo TEXT,
        fecha DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        documento TEXT,
        email TEXT,
        telefono TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS clases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER,
        materia TEXT,
        fecha_inicio DATETIME,
        fecha_fin DATETIME,
        mensual BOOLEAN DEFAULT 1,
        precio REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS pagos_musica (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER,
        monto REAL,
        moneda TEXT DEFAULT 'COP',
        fecha DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS helados_ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto TEXT,
        cantidad INTEGER,
        valor_unitario REAL,
        total REAL,
        fecha DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS helados_capital (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descripcion TEXT,
        monto REAL,
        fecha DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  module.exports = { run, all, get, init, db }

} else {
  // JSON fallback
  function readJSON() {
    try {
      if (!fs.existsSync(JSON_FILE)) {
        fs.writeFileSync(JSON_FILE, JSON.stringify({ cuentas: [], nextId: 1 }))
      }
      return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'))
    } catch (e) {
      return { cuentas: [], nextId: 1 }
    }
  }

  function writeJSON(data) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2))
  }

  async function run(sql, params = []) {
    return { lastID: null, changes: 0 }
  }

  async function all(sql, params = []) {
    const data = readJSON()
    if (/FROM\s+cuentas/i.test(sql)) return data.cuentas.slice().reverse()
    return []
  }

  async function get(sql, params = []) {
    return null
  }

  async function init() {
    readJSON()
  }

  module.exports = { run, all, get, init, jsonFile: JSON_FILE }
}

// ========================================================
// 🚀 SERVIDOR EXPRESS INTEGRADO PARA DESPLIEGUE EN RENDER
// ========================================================
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.send('Servidor de Sampix Tec corriendo correctamente en Render 🚀')
})

// Inicializar base de datos y levantar el puerto de escucha
init().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor activo y escuchando en el puerto ${PORT}`)
  })
}).catch(err => {
  console.error('Error al inicializar las tablas de la BD:', err)
})