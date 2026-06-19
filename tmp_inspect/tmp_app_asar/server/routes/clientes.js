const express = require('express')
const router = express.Router()
const db = require('../db')
const writer = require('../writer')

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM clientes ORDER BY id DESC')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { nombre, servicio, vencimiento, estado, valor } = req.body
  const info = await db.run('INSERT INTO clientes (nombre, servicio, vencimiento, estado, valor) VALUES (?, ?, ?, ?, ?)', [nombre, servicio, vencimiento, estado, valor])
  const cliente = { id: info.lastID, nombre, servicio, vencimiento, estado, valor }
  res.json({ id: info.lastID })
  try { writer.writeCliente(cliente, 'create') } catch (e) { console.error('clientes: writer failed', e) }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('UPDATE clientes SET nombre = ?, servicio = ?, vencimiento = ?, estado = ?, valor = ? WHERE id = ?', [req.body.nombre, req.body.servicio, req.body.vencimiento, req.body.estado, req.body.valor, id])
  res.json({ ok: true })
  try { writer.writeCliente({ id: Number(id), ...req.body }, 'update') } catch (e) { console.error('clientes: writer failed', e) }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('DELETE FROM clientes WHERE id = ?', [id])
  res.json({ ok: true })
  try { writer.writeCliente({ id: Number(id) }, 'delete') } catch (e) { console.error('clientes: writer failed', e) }
})

module.exports = router
