<template>
  <div class="page">
    <div class="page-header">
      <h1>💰 Pagos - Módulo Música</h1>
      <button class="btn-add" @click="showForm = !showForm">+ Registrar Pago</button>
    </div>

    <div v-if="showForm" class="form-container">
      <input v-model="form.estudiante" type="text" placeholder="Nombre del estudiante" />
      <input v-model="form.monto" type="number" placeholder="Monto (COP)" />
      <input v-model="form.fecha" type="date" />
      <input v-model="form.concepto" type="text" placeholder="Concepto (clase, mensualidad, etc)" />
      <button @click="addPago">Guardar</button>
      <button @click="showForm = false" class="btn-cancel">Cancelar</button>
    </div>

    <div class="stats">
      <div class="stat">
        <h3>Total de Pagos</h3>
        <p class="amount">${{ totalPagos.toLocaleString() }}</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pago, idx) in pagos" :key="idx">
            <td>{{ pago.estudiante }}</td>
            <td>${{ pago.monto.toLocaleString() }}</td>
            <td>{{ pago.fecha }}</td>
            <td>{{ pago.concepto }}</td>
            <td>
              <button @click="deletePago(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="pagos.length === 0">
            <td colspan="5" class="no-data">No hay pagos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const pagos = ref([])
const showForm = ref(false)
const form = ref({
  estudiante: '',
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
  concepto: ''
})

const totalPagos = computed(() => {
  return pagos.value.reduce((sum, p) => sum + (parseInt(p.monto) || 0), 0)
})

onMounted(() => {
  const saved = localStorage.getItem('musica_pagos')
  if (saved) {
    pagos.value = JSON.parse(saved)
  }
})

const addPago = () => {
  if (form.value.estudiante && form.value.monto) {
    pagos.value.push({ ...form.value })
    form.value = { estudiante: '', monto: '', fecha: new Date().toISOString().split('T')[0], concepto: '' }
    showForm.value = false
    guardarDatos()
  }
}

const deletePago = (idx) => {
  pagos.value.splice(idx, 1)
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('musica_pagos', JSON.stringify(pagos.value))
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
  color: #10b981;
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
