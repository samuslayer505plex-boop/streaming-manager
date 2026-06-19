const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
require('dotenv').config()
const writer = require('../writer')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing' })
  const hashed = await bcrypt.hash(password, 10)
  try {
    const info = await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name || '', email, hashed])
    res.json({ id: info.lastID, email })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password, module } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing' })
  // optional module enforcement: streaming->samuel, musica->alex, helados->paula
  if (module) {
    const map = { streaming: 'samuel', musica: 'alex', helados: 'paula' }
    const expected = map[module]
    if (!expected) return res.status(400).json({ error: 'Invalid module' })
    if (email !== expected) return res.status(401).json({ error: 'Invalid credentials for module' })
  }
  try {
    const rows = await db.all('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    const user = rows && rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    const outUser = { id: user.id, email: user.email, name: user.name }
    res.json({ token, user: outUser })
    try {
      writer.writeLogin(outUser)
    } catch (e) {
      console.error('auth: writer failed', e)
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
