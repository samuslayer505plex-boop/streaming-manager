const express = require('express')
const router = express.Router()
const twilio = require('twilio')

// Configuración Twilio
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE

let twilioClient = null

// Inicializar cliente Twilio si está configurado
if (twilioAccountSid && twilioAuthToken) {
  twilioClient = twilio(twilioAccountSid, twilioAuthToken)
  console.log('✅ Twilio cliente inicializado correctamente')
} else {
  console.warn('⚠️ Twilio NO configurado - Los mensajes serán simulados')
}

router.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body

    // Validar entrada
    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone and message are required'
      })
    }

    // Si Twilio está configurado, enviar mensaje real
    if (twilioClient && twilioPhone) {
      try {
        const result = await twilioClient.messages.create({
          from: `whatsapp:${twilioPhone}`,
          to: `whatsapp:${phone}`,
          body: message
        })

        console.log('\n✅ WhatsApp ENVIADO EXITOSAMENTE')
        console.log(`📞 To: ${phone}`)
        console.log(`💬 Message: ${message}`)
        console.log(`📊 SID: ${result.sid}`)
        console.log(`⏰ Time: ${new Date().toLocaleString('es-ES')}\n`)

        return res.json({
          success: true,
          message: 'WhatsApp sent successfully',
          phone: phone,
          messageSid: result.sid,
          timestamp: new Date().toISOString(),
          platform: 'whatsapp_real'
        })
      } catch (twilioError) {
        console.error('\n❌ Error enviando WhatsApp:')
        console.error(`   ${twilioError.message}\n`)
        
        // Aún así devolver sucesso para no bloquear la UI
        return res.json({
          success: false,
          error: twilioError.message,
          phone: phone,
          timestamp: new Date().toISOString(),
          platform: 'whatsapp_failed'
        })
      }
    }

    // Si NO está configurado, simular el envío
    console.log('\n📱 [SIMULADO] WhatsApp NO configurado - Mensaje registrado:')
    console.log(`📞 To: ${phone}`)
    console.log(`💬 Message: ${message}`)
    console.log(`⏰ Time: ${new Date().toLocaleString('es-ES')}`)
    console.log(`⚠️  Para enviar mensajes REALES, configura Twilio en .env\n`)

    res.json({
      success: true,
      message: 'Message logged (Twilio not configured - simulated)',
      phone: phone,
      timestamp: new Date().toISOString(),
      simulated: true,
      platform: 'whatsapp_simulated'
    })

  } catch (error) {
    console.error('\n❌ Error general:', error.message, '\n')
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Endpoint para test/verificación
router.get('/test', (req, res) => {
  const configured = !!(twilioClient && twilioPhone)
  
  res.json({
    status: configured ? '✅ Twilio configurado y listo' : '❌ Twilio NO configurado',
    configured: configured,
    note: configured 
      ? 'WhatsApp está listo para enviar mensajes reales' 
      : 'Para usar WhatsApp real: configura TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE en .env',
    platform: 'whatsapp',
    twilioPhone: configured ? twilioPhone : 'No configurado'
  })
})

module.exports = router
