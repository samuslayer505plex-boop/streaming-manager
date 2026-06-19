<template>
  <div class="page">
    <div class="page-header">
      <h1>👨‍🎓 Estudiantes</h1>
      <div class="header-actions">
        <div class="telefono-guardado">
          📱 Tel. Guardado:
          <input 
            v-model="telefonoGuardado" 
            type="tel" 
            placeholder="Tu teléfono"
            @blur="guardarTelefonoGuardado"
            class="input-telefono-guardado"
          />
        </div>
        <button class="btn-add" @click="showForm = !showForm">+ Agregar Estudiante</button>
      </div>
    </div>

    <div v-if="showForm" class="form-container">
      <input v-model="form.nombre" type="text" placeholder="Nombre" />
      <input v-model="form.telefono" type="tel" placeholder="Teléfono" />
      <input v-model="form.instrumento" type="text" placeholder="Instrumento" />
      <input v-model="form.fechaInicio" type="date" placeholder="Fecha de Inicio" />
      <input v-model="form.fechaFin" type="date" placeholder="Fecha de Fin" />
      <button @click="addEstudiante">Guardar</button>
      <button @click="showForm = false" class="btn-cancel">Cancelar</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Instrumento</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(est, idx) in estudiantes" :key="idx">
            <td>{{ est.nombre }}</td>
            <td>{{ est.telefono }}</td>
            <td>{{ est.instrumento }}</td>
            <td>{{ formatearFecha(est.fechaInicio) }}</td>
            <td>{{ formatearFecha(est.fechaFin) }}</td>
            <td>
              <button @click="deleteEstudiante(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="estudiantes.length === 0">
            <td colspan="6" class="no-data">No hay estudiantes registrados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const estudiantes = ref([])
const showForm = ref(false)
const telefonoGuardado = ref('3212456936')
const form = ref({
  nombre: '',
  telefono: '3212456936',
  instrumento: '',
  fechaInicio: '',
  fechaFin: ''
})

onMounted(() => {
  const saved = localStorage.getItem('musica_estudiantes')
  if (saved) {
    estudiantes.value = JSON.parse(saved)
  }
  
  // Cargar teléfono guardado
  const telefonoSaved = localStorage.getItem('musica_telefono_guardado')
  if (telefonoSaved) {
    telefonoGuardado.value = telefonoSaved
    form.value.telefono = telefonoSaved
  }
})

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}

const addEstudiante = async () => {
  if (form.value.nombre && form.value.fechaInicio) {
    const nuevoEstudiante = { ...form.value }
    estudiantes.value.push(nuevoEstudiante)
    
    // Guardar el teléfono para futuro uso
    if (form.value.telefono) {
      telefonoGuardado.value = form.value.telefono
      localStorage.setItem('musica_telefono_guardado', form.value.telefono)
    }
    
    // Enviar notificación por WhatsApp con el teléfono guardado
    if (form.value.telefono) {
      await enviarNotificacionWhatsApp(nuevoEstudiante)
    }
    
    form.value = { nombre: '', telefono: telefonoGuardado.value, instrumento: '', fechaInicio: '', fechaFin: '' }
    showForm.value = false
    guardarDatos()
  }
}

const enviarNotificacionWhatsApp = async (estudiante) => {
  try {
    // Formatear teléfono si no tiene +
    let telefono = estudiante.telefono.trim().replace(/\s|-/g, '')
    if (!telefono.startsWith('+')) {
      // Si es colombiano, agregar +57
      if (telefono.startsWith('3')) {
        telefono = '+57' + telefono
      } else {
        telefono = '+' + telefono
      }
    }

    const mensaje = `¡Bienvenido a nuestras clases de música! 🎵\n\nNombre: ${estudiante.nombre}\nInstrumento: ${estudiante.instrumento || 'No especificado'}\nFecha de inicio: ${new Date(estudiante.fechaInicio).toLocaleDateString('es-ES')}\n\nEstamos emocionados de comenzar contigo.`

    const response = await fetch('/api/whatsapp/send', {
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
      console.log('✅ Notificación enviada por WhatsApp:', estudiante.nombre)
    } else {
      console.warn('⚠️ Error al enviar WhatsApp:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error enviando notificación:', error)
  }
}

const deleteEstudiante = (idx) => {
  estudiantes.value.splice(idx, 1)
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('musica_estudiantes', JSON.stringify(estudiantes.value))
}

const guardarTelefonoGuardado = () => {
  localStorage.setItem('musica_telefono_guardado', telefonoGuardado.value)
  form.value.telefono = telefonoGuardado.value
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
  flex-wrap: wrap;
  gap: 15px;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.telefono-guardado {
  background: #dbeafe;
  border: 2px solid #0284c7;
  padding: 8px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #0284c7;
  font-size: 0.95rem;
}

.input-telefono-guardado {
  padding: 5px 10px;
  border: 1px solid #0284c7;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 130px;
  background: white;
  color: #0284c7;
  font-weight: bold;
}

.input-telefono-guardado:focus {
  outline: none;
  background: #ffffff;
  box-shadow: 0 0 4px #0284c7;
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
</style>
