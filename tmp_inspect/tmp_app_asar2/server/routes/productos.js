const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM productos ORDER BY id DESC')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { nombre, precio, stock } = req.body
  const info = await db.run('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio || 0, stock || 0])
  res.json({ id: info.lastID, nombre, precio, stock })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [req.body.nombre, req.body.precio, req.body.stock, id])
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('DELETE FROM productos WHERE id = ?', [id])
  res.json({ ok: true })
})

module.exports = router
