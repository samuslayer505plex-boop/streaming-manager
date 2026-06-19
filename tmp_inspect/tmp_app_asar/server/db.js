const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const DB_FILE = path.join(__dirname, 'data.sqlite')

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
  // create tables
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // ensure 'tipo' column exists (e.g. 'personal' or 'empresa')
  try {
    const cols = await all("PRAGMA table_info(cuentas);")
    const hasTipo = cols && cols.find && cols.find(c => c.name === 'tipo')
    if (!hasTipo) {
      await run("ALTER TABLE cuentas ADD COLUMN tipo TEXT DEFAULT 'personal';")
    }
  } catch (err) {
    // ignore if table doesn't exist yet or PRAGMA fails
  }

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
}

module.exports = { run, all, get, init, db }
