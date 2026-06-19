const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { init } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/productos', require('./routes/productos'))
app.use('/api/clientes', require('./routes/clientes'))
app.use('/api/ventas', require('./routes/ventas'))
app.use('/api/cuentas', require('./routes/cuentas'))
app.use('/api/music', require('./routes/music'))
app.use('/api/helados', require('./routes/helados'))
app.use('/api/whatsapp', require('./routes/whatsapp'))

const port = process.env.PORT || 3000

init().then(() => {
  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}).catch(err => {
  console.error('DB init error', err)
  process.exit(1)
})
