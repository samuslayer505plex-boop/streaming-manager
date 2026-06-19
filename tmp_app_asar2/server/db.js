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
      const path = require('path')
      const fs = require('fs')
      const os = require('os')
      require('dotenv').config()

      let dataDir
      try { const { app } = require('electron'); dataDir = app && app.getPath ? app.getPath('userData') : path.join(os.homedir(), '.sampix') } catch (e) { dataDir = path.join(os.homedir(), '.sampix') }
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

      let sqliteAvailable = false
      let sqlite3 = null
      try { sqlite3 = require('sqlite3').verbose(); sqliteAvailable = true } catch (e) { sqliteAvailable = false }

      const DB_FILE = path.join(dataDir, 'data.sqlite')
      const JSON_FILE = path.join(dataDir, 'data.json')

      if (sqliteAvailable) {
        const db = new sqlite3.Database(DB_FILE)
        function run(sql, params = []) { return new Promise((resolve, reject) => { db.run(sql, params, function (err) { if (err) return reject(err); resolve({ lastID: this.lastID, changes: this.changes }) }) }) }
        function all(sql, params = []) { return new Promise((resolve, reject) => { db.all(sql, params, (err, rows) => { if (err) return reject(err); resolve(rows) }) }) }
        function get(sql, params = []) { return new Promise((resolve, reject) => { db.get(sql, params, (err, row) => { if (err) return reject(err); resolve(row) }) }) }
        async function init() { await run(`CREATE TABLE IF NOT EXISTS cuentas (id INTEGER PRIMARY KEY AUTOINCREMENT, servicio TEXT, correo TEXT, password TEXT, perfiles INTEGER, ocupados INTEGER, disponibles INTEGER, renovacion TEXT, tipo TEXT DEFAULT 'personal', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`) }
        module.exports = { run, all, get, init, db }
      } else {
        function readJSON() { try { if (!fs.existsSync(JSON_FILE)) { fs.writeFileSync(JSON_FILE, JSON.stringify({ cuentas: [], nextId: 1 })) } return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')) } catch (e) { return { cuentas: [], nextId: 1 } } }
        function writeJSON(data) { fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2)) }
        async function run(sql, params = []) { return { lastID: null, changes: 0 } }
        async function all(sql, params = []) { const data = readJSON(); if (/FROM\s+cuentas/i.test(sql)) return data.cuentas.slice().reverse(); return [] }
        async function get(sql, params = []) { return null }
        async function init() { readJSON() }
        module.exports = { run, all, get, init, jsonFile: JSON_FILE }
      }
      servicio TEXT,
