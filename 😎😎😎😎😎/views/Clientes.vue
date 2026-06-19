<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useClientesStore } from '../stores/clientes'

const store = useClientesStore()

onMounted(() => {
  store.fetchAll()
})

const q = ref('')
const nombre = ref('')
const servicio = ref('')
const vencimiento = ref('')
const valor = ref('')
const fileInput = ref(null)

const agregarCliente = () => {
  if (!nombre.value) return
  store.agregar({ nombre: nombre.value, servicio: servicio.value || 'Otros', vencimiento: vencimiento.value, estado: 'Activo', valor: `$${valor.value}` })
  nombre.value = ''
  servicio.value = ''
  vencimiento.value = ''
  valor.value = ''
}

const eliminarCliente = (index) => {
  if (confirm('Eliminar cliente?')) store.eliminarByIndex(index)
}

const exportarClientes = () => {
  const dataStr = JSON.stringify(store.clientes, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'clientes.json'
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleImport = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result)
      if (Array.isArray(parsed)) {
        // replace store contents
        store.clientes = parsed
        localStorage.setItem('clientes', JSON.stringify(parsed))
      } else {
        alert('El archivo no contiene una lista de clientes válida')
      }
    } catch (err) {
      alert('Error al leer el archivo: ' + err.message)
    }
  }
  reader.readAsText(file)
  e.target.value = null
}

const filtered = computed(() => {
  const term = q.value.toLowerCase().trim()
  if (!term) return store.clientes
  return store.clientes.filter(c => (c.nombre || '').toLowerCase().includes(term))
})
</script>

<template>
  <div class="clientes">
    <div class="header">
      <h1>👥 Clientes</h1>
      <div style="display:flex; gap:10px; align-items:center">
        <button @click="exportarClientes" class="btn-secondary">Exportar JSON</button>
        <button @click="triggerImport" class="btn-secondary">Importar JSON</button>
        <input ref="fileInput" type="file" accept="application/json" @change="handleImport" style="display:none" />
        <button @click="agregarCliente">+ Nuevo Cliente</button>
      </div>
    </div>

    <div class="formulario">
      <input v-model="nombre" placeholder="Nombre" />
      <input v-model="servicio" placeholder="Servicio" />
      <input v-model="vencimiento" placeholder="Vencimiento (DD/MM/YYYY)" />
      <input v-model="valor" placeholder="Valor" />
      <button @click="agregarCliente">Guardar Cliente</button>
    </div>

    <input v-model="q" class="buscador" placeholder="Buscar cliente..." />

    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Vencimiento</th>
          <th>Estado</th>
          <th>Valor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, i) in filtered" :key="i">
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.servicio }}</td>
          <td>{{ cliente.vencimiento }}</td>
          <td :class="cliente.estado === 'Activo' ? 'activo' : 'vencido'">{{ cliente.estado }}</td>
          <td>{{ cliente.valor }}</td>
          <td>
            <button class="btn-eliminar" @click="eliminarCliente(i)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.clientes {
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

button {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.formulario input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.buscador {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.activo {
  color: green;
  font-weight: bold;
}

.vencido {
  color: red;
  font-weight: bold;
}

.btn-eliminar {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-eliminar:hover {
  opacity: .9;
}

.btn-secondary {
  background: #475569;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary:hover { opacity: .9 }
</style>
