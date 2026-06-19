/**
 * Sistema de Recordatorios Automáticos para Clases
 * Verifica cada minuto si hay clases próximas y envía recordatorios
 */

let reminderInterval = null
const sentReminders = new Set() // Para evitar enviar múltiples recordatorios

export const startReminders = () => {
  if (reminderInterval) return // Ya está activo
  
  console.log('🔔 Sistema de recordatorios iniciado')
  
  reminderInterval = setInterval(checkForUpcomingClasses, 60000) // Verificar cada minuto
  
  // Primera verificación inmediata
  checkForUpcomingClasses()
}

export const stopReminders = () => {
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
    console.log('🔔 Sistema de recordatorios detenido')
  }
}

const checkForUpcomingClasses = async () => {
  try {
    const clases = getClassesFromStorage()
    if (clases.length === 0) return

    const now = new Date()
    const currentHour = String(now.getHours()).padStart(2, '0')
    const currentMinute = String(now.getMinutes()).padStart(2, '0')
    const currentTime = `${currentHour}:${currentMinute}`
    
    const dayName = getDayName(now.getDay())

    for (const clase of clases) {
      // Verificar si es hoy y en 15 minutos
      if (clase.dia && clase.dia.toLowerCase() === dayName.toLowerCase()) {
        if (isTimeInRange(clase.hora, currentTime)) {
          const reminderId = `${clase.nombre}-${clase.hora}`
          
          if (!sentReminders.has(reminderId)) {
            await sendReminder(clase)
            sentReminders.add(reminderId)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking for classes:', error)
  }
}

const getClassesFromStorage = () => {
  try {
    const saved = localStorage.getItem('musica_clases')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const getDayName = (dayIndex) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[dayIndex]
}

const isTimeInRange = (classTime, currentTime) => {
  // Enviar recordatorio 15 minutos antes
  const [classHour, classMin] = classTime.split(':').map(Number)
  const [curHour, curMin] = currentTime.split(':').map(Number)
  
  const classTimeInMinutes = classHour * 60 + classMin
  const currentTimeInMinutes = curHour * 60 + curMin
  
  // Si faltan entre 15 y 0 minutos
  return currentTimeInMinutes >= classTimeInMinutes - 15 && 
         currentTimeInMinutes < classTimeInMinutes
}

const sendReminder = async (clase) => {
  try {
    const mensaje = `🎵 Recordatorio de clase:\n\n📚 ${clase.nombre}\n👨‍🏫 Profesor: ${clase.profesor}\n📅 ${clase.dia}\n⏰ ${clase.hora}\n👥 Capacidad: ${clase.estudiantes} estudiantes\n\n¡No olvides asistir!`
    
    // Notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎵 ¡Tu clase empieza en 15 minutos!', {
        body: `${clase.nombre} a las ${clase.hora}`,
        icon: '🎵',
        tag: `reminder-${clase.nombre}`,
        requireInteraction: true
      })
    }
    
    // Enviar a WhatsApp
    console.log(`📱 Enviando recordatorio de ${clase.nombre} a WhatsApp...`)
    
    // Obtener número del usuario desde localStorage
    let telefono = localStorage.getItem('musica_telefono_guardado') || ''
    if (!telefono) {
      console.warn('⚠️ No hay número de teléfono guardado')
      return
    }
    
    // Asegurar que tiene formato correcto
    if (!telefono.startsWith('+')) {
      if (telefono.startsWith('3')) {
        telefono = '+57' + telefono
      } else {
        telefono = '+' + telefono
      }
    }
    
    const response = await fetch('http://localhost:3000/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: telefono,
        message: mensaje
      })
    })
    
    const data = await response.json()
    if (data.success) {
      console.log(`✅ Recordatorio enviado: ${clase.nombre}`)
    }
  } catch (error) {
    console.error('Error sending reminder:', error)
  }
}

// Pedir permiso para notificaciones
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    console.log(`Notification permission: ${permission}`)
    return permission === 'granted'
  }
  return Notification.permission === 'granted'
}
