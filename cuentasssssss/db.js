// ... Todo tu código anterior se queda exactamente igual ...

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
    const data = readJSON()
    return null
  }

  async function init() {
    readJSON()
  }

  module.exports = { run, all, get, init, jsonFile: JSON_FILE }
}

// ========================================================
// 🚀 AGREGA ESTE BLOQUE JUSTO AQUÍ AL FINAL (FUERA DEL ELSE)
// ========================================================
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de Sampix Tec corriendo en Render 🚀')
})

// Inicializar la base de datos y encender el servidor Express
init().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando correctamente en el puerto ${PORT}`)
  })
}).catch(err => {
  console.error('Error al inicializar las tablas de la BD:', err)
})