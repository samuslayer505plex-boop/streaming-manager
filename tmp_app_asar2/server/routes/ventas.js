const express = require('express')
const router = express.Router()
const db = require('../db')
const writer = require('../writer')

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM ventas ORDER BY fecha DESC, id DESC')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { cliente, servicio, valor, metodo, fecha, users } = req.body
  const info = await db.run('INSERT INTO ventas (cliente, servicio, valor, metodo, fecha) VALUES (?, ?, ?, ?, ?)', [cliente, servicio, valor || 0, metodo, fecha || null])
  const ventaRecord = { id: info.lastID, cliente, servicio, valor: valor || 0, metodo, fecha: fecha || null, users: users || [] }
  res.json({ id: info.lastID })
  try {
    writer.writeVenta(ventaRecord)
  } catch (e) {
    console.error('ventas: writer failed', e)
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('UPDATE ventas SET cliente = ?, servicio = ?, valor = ?, metodo = ?, fecha = ? WHERE id = ?', [req.body.cliente, req.body.servicio, req.body.valor, req.body.metodo, req.body.fecha, id])
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('DELETE FROM ventas WHERE id = ?', [id])
  res.json({ ok: true })
})

module.exports = router
