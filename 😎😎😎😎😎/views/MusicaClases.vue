<template>
  <div class="page">
    <div class="page-header">
      <h1>🎵 Clases</h1>
      <button class="btn-add" @click="toggleForm">+ Nueva Clase</button>
    </div>

    <div class="info-banner">
      <p>🔔 Los recordatorios se enviarán automáticamente 10 minutos antes de cada clase</p>
      <p>📱 Se usará el teléfono: <strong>{{ telefonoGuardado }}</strong></p>
    </div>

    <div v-if="showForm" class="form-container">
      <h3>{{ editingIdx !== null ? '✏️ Editar Clase' : '➕ Nueva Clase' }}</h3>
      <input v-model="form.nombre" type="text" placeholder="Nombre de la clase" />
      <input v-model="form.profesor" type="text" placeholder="Profesor" />
      <div class="horario-group">
        <input v-model="form.dia" type="text" placeholder="Día (ej: Lunes)" />
        <input v-model="form.hora" type="time" placeholder="Hora" />
      </div>
      <input v-model="form.estudiantes" type="number" placeholder="Capacidad (estudiantes)" />
      <button @click="saveClase" class="btn-save">{{ editingIdx !== null ? 'Actualizar' : 'Guardar' }}</button>
      <button @click="cancelEdit" class="btn-cancel">Cancelar</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Clase</th>
            <th>Profesor</th>
            <th>Día</th>
            <th>Hora</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(clase, idx) in clases" :key="idx">
            <td>{{ clase.nombre }}</td>
            <td>{{ clase.profesor }}</td>
            <td>{{ clase.dia }}</td>
            <td>{{ clase.hora }}</td>
            <td>{{ clase.estudiantes }}</td>
            <td>
              <button @click="recordarAhora(clase)" class="btn-remind">📱 Recordar</button>
              <button @click="editClase(idx)" class="btn-edit">✏️ Editar</button>
              <button @click="deleteClase(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="clases.length === 0">
            <td colspan="6" class="no-data">No hay clases registradas</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const clases = ref([])
const showForm = ref(false)
const telefonoGuardado = ref('3212456936')
const recordatoriosEnviados = ref(new Set())
const editingIdx = ref(null)
let intervaloChequeo = null

const form = ref({
  nombre: '',
  profesor: '',
  dia: '',
  hora: '',
  estudiantes: ''
})

onMounted(() => {
  const saved = localStorage.getItem('musica_clases')
  if (saved) {
    clases.value = JSON.parse(saved)
  }
  
  // Cargar teléfono guardado
  const telefonoSaved = localStorage.getItem('musica_telefono_guardado')
  if (telefonoSaved) {
    telefonoGuardado.value = telefonoSaved
  }
  
  // Cargar recordatorios ya enviados
  const recordSaved = localStorage.getItem('musica_recordatorios_enviados')
  if (recordSaved) {
    recordatoriosEnviados.value = new Set(JSON.parse(recordSaved))
  }
  
  // Solicitar permiso para notificaciones
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Iniciar chequeo de clases cada 5 minutos
  iniciarChequeoClases()
})

onUnmounted(() => {
  if (intervaloChequeo) {
    clearInterval(intervaloChequeo)
  }
})

const iniciarChequeoClases = () => {
  intervaloChequeo = setInterval(() => {
    chequearClasesProximas()
  }, 5 * 60 * 1000) // Cada 5 minutos
  
  // También chequear inmediatamente al montar
  chequearClasesProximas()
}

const chequearClasesProximas = () => {
  const ahora = new Date()
  const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                     ahora.getMinutes().toString().padStart(2, '0')
  
  const diaActual = obtenerDiaActual()
  
  clases.value.forEach((clase, idx) => {
    // Solo chequear si es hoy
    if (clase.dia.toLowerCase() === diaActual.toLowerCase()) {
      const [horaClase, minClase] = clase.hora.split(':')
      const minutosClase = parseInt(horaClase) * 60 + parseInt(minClase)
      const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()
      
      // Si falta entre 10 y 9 minutos para la clase
      const diferencia = minutosClase - minutosAhora
      const idRecordatorio = `${idx}-${clase.hora}`
      
      if (diferencia >= 9 && diferencia <= 10 && !recordatoriosEnviados.value.has(idRecordatorio)) {
        // Mostrar notificación del navegador
        mostrarNotificacion(clase, diferencia)
        
        // Enviar a WhatsApp/Telegram
        enviarRecordatorioClase(clase)
        
        recordatoriosEnviados.value.add(idRecordatorio)
        guardarRecordatoriosEnviados()
        console.log(`⏰ Recordatorio automático enviado para: ${clase.nombre}`)
      }
    }
  })
}

const mostrarNotificacion = (clase, minutos) => {
  // Notificación del navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('🎵 RECORDATORIO DE CLASE', {
      body: `${clase.nombre} - ${clase.hora}\n¡En ${minutos} minutos!`,
      icon: '🎵',
      tag: `clase-${clase.hora}`,
      requireInteraction: true
    })
    
    // Sonido de notificación
    reproducirSonido()
  }
  
  // Alert visual como backup
  console.warn(`
╔════════════════════════════════════════╗
║     ⏰ RECORDATORIO DE CLASE EN 10 MIN  ║
║════════════════════════════════════════║
║  🎵 ${clase.alumnos.padEnd(33)} ║
║  👨‍🏫 ${clase.profesor.padEnd(31)} ║
║  📅 ${clase.dia.padEnd(34)} ║
║  ⏰ ${clase.hora.padEnd(34)} ║
║  👥 ${clase.estudiantes} estudiantes${' '.repeat(21)} ║
╚════════════════════════════════════════╝
  `)
}

const reproducirSonido = () => {
  // Crear sonido de notificación con Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscilador = audioContext.createOscillator()
  const ganancia = audioContext.createGain()
  
  oscilador.connect(ganancia)
  ganancia.connect(audioContext.destination)
  
  oscilador.frequency.value = 800 // Frecuencia en Hz
  oscilador.type = 'sine'
  
  ganancia.gain.setValueAtTime(0.3, audioContext.currentTime)
  ganancia.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscilador.start(audioContext.currentTime)
  oscilador.stop(audioContext.currentTime + 0.5)
}

const obtenerDiaActual = () => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const hoy = new Date()
  return dias[hoy.getDay()]
}

const saveClase = async () => {
  if (!form.value.nombre) {
    alert('❌ Por favor ingresa el nombre de la clase')
    return
  }
  if (!form.value.hora) {
    alert('❌ Por favor ingresa la hora de la clase')
    return
  }
  
  if (editingIdx.value !== null) {
    // Actualizar clase existente
    clases.value[editingIdx.value] = { ...form.value }
    alert('✅ Clase actualizada')
  } else {
    // Crear nueva clase
    const nuevaClase = { ...form.value }
    clases.value.push(nuevaClase)
    alert('✅ Clase creada. Recibirás un recordatorio 10 minutos antes de iniciar.')
  }
  
  form.value = { nombre: '', profesor: '', dia: '', hora: '', estudiantes: '' }
  editingIdx.value = null
  showForm.value = false
  guardarDatos()
}

const editClase = (idx) => {
  editingIdx.value = idx
  form.value = { ...clases.value[idx] }
  showForm.value = true
}

const cancelEdit = () => {
  editingIdx.value = null
  form.value = { nombre: '', profesor: '', dia: '', hora: '', estudiantes: '' }
  showForm.value = false
}

const toggleForm = () => {
  if (showForm.value) {
    // Si el formulario está abierto, ciérralo
    showForm.value = false
  } else {
    // Si está cerrado, abre uno nuevo (limpio)
    editingIdx.value = null
    form.value = { nombre: '', profesor: '', dia: '', hora: '', estudiantes: '' }
    showForm.value = true
  }
}

const enviarRecordatorioClase = async (clase) => {
  try {
    let telefono = telefonoGuardado.value.trim().replace(/\s|-/g, '')
    if (!telefono.startsWith('+')) {
      if (telefono.startsWith('3')) {
        telefono = '+57' + telefono
      } else {
        telefono = '+' + telefono
      }
    }

    const mensaje = `🎵 RECORDATORIO DE CLASE EN 10 MINUTOS ⏰\n\n📚 ${clase.nombre}\n👨‍🏫 Profesor: ${clase.profesor}\n📅 ${clase.dia}\n⏰ ${clase.hora}\n👥 Capacidad: ${clase.estudiantes} estudiantes\n\n¡Prepárate para la clase!`

   const response = await fetch('http://localhost:3000/api/whatsapp/send',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: telefono,
        message: mensaje
      })
    })

    if (response.ok) {
      console.log('✅ Recordatorio de clase enviado a WhatsApp')
    } else {
      console.warn('⚠️ Error al enviar recordatorio')
    }
  } catch (error) {
    console.error('❌ Error enviando recordatorio:', error)
  }
}

const recordarAhora = async (clase) => {
  await enviarRecordatorioClase(clase)
  alert('✅ Recordatorio enviado a tu WhatsApp')
}

const deleteClase = (idx) => {
  clases.value.splice(idx, 1)
  // Limpiar recordatorios de esta clase
  const keysToDelete = Array.from(recordatoriosEnviados.value).filter(key => key.startsWith(idx + '-'))
  keysToDelete.forEach(key => recordatoriosEnviados.value.delete(key))
  guardarRecordatoriosEnviados()
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('musica_clases', JSON.stringify(clases.value))
}

const guardarRecordatoriosEnviados = () => {
  localStorage.setItem('musica_recordatorios_enviados', JSON.stringify(Array.from(recordatoriosEnviados.value)))
}
</script>

<style scoped>
.page { 
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-banner p {
  margin: 8px 0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-banner strong {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-add {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-add:hover {
  background: #059669;
}

.form-container {
  background: #f0f9ff;
  border: 2px solid #0284c7;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.form-container input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.95rem;
}

.horario-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.horario-group input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.95rem;
}

.form-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.form-container button:first-of-type {
  background: #0284c7;
  color: white;
}

.btn-cancel {
  background: #e2e8f0;
  color: #333;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

th {
  padding: 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
}

td {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
}

tr:hover {
  background: #f8fafc;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px !important;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-delete:hover {
  background: #dc2626;
}

.btn-remind {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-right: 5px;
}

.btn-remind:hover {
  background: #2563eb;
}

.btn-edit {
  background: #000000;
  color: white;
  border: none;
  height: 32px;
  padding: 9px 22px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-right: 15px; /* separación horizontal */
}

.btn-edit:hover {
  background: #000000;
}
.btn {
  margin-left: 10px;
}
</style>
