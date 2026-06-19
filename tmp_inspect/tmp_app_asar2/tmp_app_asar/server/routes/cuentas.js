const express = require('express')
const router = express.Router()
const db = require('../db')
const writer = require('../writer')

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM cuentas ORDER BY id DESC')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { servicio, correo, password, perfiles, ocupados, disponibles, renovacion, tipo } = req.body
  const info = await db.run('INSERT INTO cuentas (servicio, correo, password, perfiles, ocupados, disponibles, renovacion, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [servicio, correo, password, perfiles || 0, ocupados || 0, disponibles || 0, renovacion || null, tipo || 'personal'])
  const cuenta = { id: info.lastID, servicio, correo, password, perfiles, ocupados, disponibles, renovacion, tipo }
  res.json({ id: info.lastID })
  try { writer.writeCuenta(cuenta, 'create') } catch (e) { console.error('cuentas: writer failed', e) }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('UPDATE cuentas SET servicio = ?, correo = ?, password = ?, perfiles = ?, ocupados = ?, disponibles = ?, renovacion = ?, tipo = ? WHERE id = ?', [req.body.servicio, req.body.correo, req.body.password, req.body.perfiles, req.body.ocupados, req.body.disponibles, req.body.renovacion, req.body.tipo || 'personal', id])
  res.json({ ok: true })
  try { writer.writeCuenta({ id: Number(id), ...req.body }, 'update') } catch (e) { console.error('cuentas: writer failed', e) }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await db.run('DELETE FROM cuentas WHERE id = ?', [id])
  res.json({ ok: true })
  try { writer.writeCuenta({ id: Number(id) }, 'delete') } catch (e) { console.error('cuentas: writer failed', e) }
})

module.exports = router
