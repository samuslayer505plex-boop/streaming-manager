const express = require('express')
const router = express.Router()
const db = require('../db')

// estudiantes
router.get('/estudiantes', async (req, res) => {
  const rows = await db.all('SELECT * FROM estudiantes ORDER BY id DESC')
  res.json(rows)
})

router.post('/estudiantes', async (req, res) => {
  const { nombre, documento, email, telefono } = req.body
  const info = await db.run('INSERT INTO estudiantes (nombre, documento, email, telefono) VALUES (?, ?, ?, ?)', [nombre, documento, email, telefono])
  res.json({ id: info.lastID })
})

// clases
router.get('/clases', async (req, res) => {
  const rows = await db.all('SELECT * FROM clases ORDER BY id DESC')
  res.json(rows)
})

router.post('/clases', async (req, res) => {
  const { estudiante_id, materia, fecha_inicio, fecha_fin, mensual, precio } = req.body
  const info = await db.run('INSERT INTO clases (estudiante_id, materia, fecha_inicio, fecha_fin, mensual, precio) VALUES (?, ?, ?, ?, ?, ?)', [estudiante_id, materia, fecha_inicio, fecha_fin, mensual ? 1 : 0, precio || 0])
  res.json({ id: info.lastID })
})

// pagos
router.get('/pagos', async (req, res) => {
  const rows = await db.all('SELECT * FROM pagos_musica ORDER BY id DESC')
  res.json(rows)
})

router.post('/pagos', async (req, res) => {
  const { estudiante_id, monto, moneda, fecha } = req.body
  const info = await db.run('INSERT INTO pagos_musica (estudiante_id, monto, moneda, fecha) VALUES (?, ?, ?, ?)', [estudiante_id, monto, moneda || 'COP', fecha])
  res.json({ id: info.lastID })
})

module.exports = router
