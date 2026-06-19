<template>
  <div class="page">
    <div class="page-header">
      <h1>💰 Capital - Heladerías</h1>
      <button class="btn-add" @click="showForm = !showForm">+ Registrar Capital</button>
    </div>

    <div v-if="showForm" class="form-container">
      <input v-model="form.descripcion" type="text" placeholder="Descripción" />
      <input v-model="form.monto" type="number" placeholder="Monto inicial" />
      <input v-model="form.gasto" type="number" placeholder="Gasto" />
      <input v-model="form.fecha" type="date" />
      <button @click="addCapital">Guardar</button>
      <button @click="showForm = false" class="btn-cancel">Cancelar</button>
    </div>

    <div class="stats">
      <div class="stat">
        <h3>Capital Total</h3>
        <p class="amount">${{ totalCapital.toLocaleString() }}</p>
      </div>
      <div class="stat">
        <h3>Total Gastos</h3>
        <p class="amount">${{ totalGastos.toLocaleString() }}</p>
      </div>
      <div class="stat">
        <h3>Saldo Neto</h3>
        <p class="amount">${{ (totalCapital - totalGastos).toLocaleString() }}</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Capital Inicial</th>
            <th>Gastos</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cap, idx) in capital" :key="idx">
            <td>{{ cap.descripcion }}</td>
            <td>${{ cap.monto.toLocaleString() }}</td>
            <td>${{ cap.gasto.toLocaleString() }}</td>
            <td>{{ cap.fecha }}</td>
            <td>
              <button @click="deleteCapital(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="capital.length === 0">
            <td colspan="5" class="no-data">No hay registros de capital</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const capital = ref([])
const showForm = ref(false)
const form = ref({
  descripcion: '',
  monto: '',
  gasto: '',
  fecha: new Date().toISOString().split('T')[0]
})

const totalCapital = computed(() => {
  return capital.value.reduce((sum, c) => sum + (parseInt(c.monto) || 0), 0)
})

const totalGastos = computed(() => {
  return capital.value.reduce((sum, c) => sum + (parseInt(c.gasto) || 0), 0)
})

onMounted(() => {
  const saved = localStorage.getItem('helados_capital')
  if (saved) {
    capital.value = JSON.parse(saved)
  }
})

const addCapital = () => {
  if (form.value.descripcion && (form.value.monto || form.value.gasto)) {
    capital.value.push({ 
      ...form.value,
      monto: parseInt(form.value.monto) || 0,
      gasto: parseInt(form.value.gasto) || 0
    })
    form.value = { descripcion: '', monto: '', gasto: '', fecha: new Date().toISOString().split('T')[0] }
    showForm.value = false
    guardarDatos()
  }
}

const deleteCapital = (idx) => {
  capital.value.splice(idx, 1)
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('helados_capital', JSON.stringify(capital.value))
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
  background: #fce7f3;
  border: 2px solid #ec4899;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.form-container input {
  padding: 10px;
  border: 1px solid #fbcfe8;
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
  background: #ec4899;
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
  color: #ec4899;
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
