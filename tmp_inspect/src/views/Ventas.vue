<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVentasStore } from '../stores/ventas'

const store = useVentasStore()

onMounted(() => {
  store.fetchAll()
})

const cliente = ref('')
const servicio = ref('')
const valor = ref('')
const metodo = ref('')
const fecha = ref('')

const editingIndex = ref(-1)

const startEditar = (i) => {
  const v = store.ventas[i]
  if (!v) return
  editingIndex.value = i
  cliente.value = v.cliente || ''
  servicio.value = v.servicio || ''
  valor.value = v.valor || ''
  metodo.value = v.metodo || ''
  fecha.value = v.fecha ? v.fecha.slice(0, 10) : ''
}

const guardarEditar = () => {
  if (editingIndex.value < 0) return
  store.actualizar(editingIndex.value, { cliente: cliente.value, servicio: servicio.value, valor: Number(valor.value) || 0, metodo: metodo.value, fecha: fecha.value ? new Date(fecha.value).toISOString() : new Date().toISOString() })
  cancelarEditar()
}

const cancelarEditar = () => {
  editingIndex.value = -1
  cliente.value = ''
  servicio.value = ''
  valor.value = ''
  metodo.value = ''
  fecha.value = ''
}

const agregarVenta = () => {
  store.agregar({
    cliente: cliente.value,
    servicio: servicio.value,
    valor: valor.value,
    metodo: metodo.value,
    fecha: fecha.value ? new Date(fecha.value).toISOString() : new Date().toISOString()
  })

  cliente.value = ''
  servicio.value = ''
  valor.value = ''
  metodo.value = ''
  fecha.value = ''
}

const eliminarVenta = (i) => {
  if (confirm('Eliminar venta?')) store.eliminarByIndex(i)
}

// filtros por fecha
const filterStart = ref('')
const filterEnd = ref('')

const ventasFiltradas = computed(() => {
  const start = filterStart.value ? new Date(filterStart.value) : null
  const end = filterEnd.value ? new Date(filterEnd.value) : null
  return store.ventas.filter(v => {
    if (!v.fecha) return true
    const d = new Date(v.fecha)
    if (start && d < start) return false
    if (end) {
      // include whole day
      const endDay = new Date(end)
      endDay.setHours(23,59,59,999)
      if (d > endDay) return false
    }
    return true
  })
})

const clearFilters = () => {
  filterStart.value = ''
  filterEnd.value = ''
}

</script>

<template>
  <div class="ventas">
    <h1>💰 Ventas</h1>

    <div class="formulario">
      <input v-model="cliente" placeholder="Cliente" />
      <input v-model="servicio" placeholder="Servicio" />
      <input v-model="valor" placeholder="Valor" />
      <input v-model="metodo" placeholder="Método de pago" />
      <input type="date" v-model="fecha" />
      <div style="display:flex; gap:8px;">
        <button v-if="editingIndex === -1" @click="agregarVenta">Registrar Venta</button>
        <button v-else @click="guardarEditar">Guardar</button>
        <button v-if="editingIndex !== -1" @click="cancelarEditar">Cancelar</button>
      </div>
    </div>

    <div class="filtros" style="display:flex; gap:8px; align-items:center; margin-bottom:12px;">
      <label>Desde: <input type="date" v-model="filterStart" /></label>
      <label>Hasta: <input type="date" v-model="filterEnd" /></label>
      <button @click="clearFilters">Limpiar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Servicio</th>
          <th>Valor</th>
          <th>Método</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventasFiltradas" :key="index">
          <td>{{ venta.cliente }}</td>
          <td>{{ venta.servicio }}</td>
          <td>${{ venta.valor }}</td>
          <td>{{ venta.metodo }}</td>
          <td>{{ venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-' }}</td>
          <td>
            <button @click="startEditar(index)">Editar</button>
            <button @click="eliminarVenta(index)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ventas {
  padding: 30px;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.formulario input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.formulario button {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
}

table {
  width: 100%;
  background: white;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
</style>
