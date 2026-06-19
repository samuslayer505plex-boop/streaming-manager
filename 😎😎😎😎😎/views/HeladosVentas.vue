<template>
  <div class="page">
    <div class="page-header">
      <h1>💵 Ventas - Heladerías</h1>
      <button class="btn-add" @click="showForm = !showForm">+ Nueva Venta</button>
    </div>

    <div v-if="showForm" class="form-container">
      <input v-model="form.descripcion" type="text" placeholder="Descripción del producto" />
      <input v-model="form.monto" type="number" placeholder="Monto de la venta" />
      <input v-model="form.cantidad" type="number" placeholder="Cantidad" />
      <input v-model="form.fecha" type="date" />
      <button @click="addVenta">Guardar</button>
      <button @click="showForm = false" class="btn-cancel">Cancelar</button>
    </div>

    <div class="stats">
      <div class="stat">
        <h3>Total Ventas</h3>
        <p class="amount">${{ totalVentas.toLocaleString() }}</p>
      </div>
      <div class="stat">
        <h3>Número de Ventas</h3>
        <p class="amount">{{ ventas.length }}</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(venta, idx) in ventas" :key="idx">
            <td>{{ venta.descripcion }}</td>
            <td>{{ venta.cantidad }}</td>
            <td>${{ venta.monto.toLocaleString() }}</td>
            <td>{{ venta.fecha }}</td>
            <td>
              <button @click="deleteVenta(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="ventas.length === 0">
            <td colspan="5" class="no-data">No hay ventas registradas</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const ventas = ref([])
const showForm = ref(false)
const form = ref({
  descripcion: '',
  monto: '',
  cantidad: '',
  fecha: new Date().toISOString().split('T')[0]
})

const totalVentas = computed(() => {
  return ventas.value.reduce((sum, v) => sum + (parseInt(v.monto) || 0), 0)
})

onMounted(() => {
  const saved = localStorage.getItem('helados_ventas')
  if (saved) {
    ventas.value = JSON.parse(saved)
  }
})

const addVenta = () => {
  if (form.value.descripcion && form.value.monto) {
    ventas.value.push({ ...form.value })
    form.value = { descripcion: '', monto: '', cantidad: '', fecha: new Date().toISOString().split('T')[0] }
    showForm.value = false
    guardarDatos()
  }
}

const deleteVenta = (idx) => {
  ventas.value.splice(idx, 1)
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('helados_ventas', JSON.stringify(ventas.value))
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
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.form-container input {
  padding: 10px;
  border: 1px solid #fcd34d;
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
  background: #f59e0b;
  color: white;
}

.btn-cancel {
  background: #e2e8f0;
  color: #333;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.amount {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #f59e0b;
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
