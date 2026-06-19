const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/ventas', async (req, res) => {
  const rows = await db.all('SELECT * FROM helados_ventas ORDER BY id DESC')
  res.json(rows)
})

router.post('/ventas', async (req, res) => {
  const { producto, cantidad, valor_unitario, total, fecha } = req.body
  const info = await db.run('INSERT INTO helados_ventas (producto, cantidad, valor_unitario, total, fecha) VALUES (?, ?, ?, ?, ?)', [producto, cantidad, valor_unitario, total, fecha])
  res.json({ id: info.lastID })
})

router.get('/capital', async (req, res) => {
  const rows = await db.all('SELECT * FROM helados_capital ORDER BY id DESC')
  res.json(rows)
})

router.post('/capital', async (req, res) => {
  const { descripcion, monto, fecha } = req.body
  const info = await db.run('INSERT INTO helados_capital (descripcion, monto, fecha) VALUES (?, ?, ?)', [descripcion, monto, fecha])
  res.json({ id: info.lastID })
})

module.exports = router
