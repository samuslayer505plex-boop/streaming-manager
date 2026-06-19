<template>
  <div class="page">
    <div class="page-header">
      <h1>📦 Inventario - Heladerías</h1>
      <button class="btn-add" @click="showForm = !showForm">+ Agregar Item</button>
    </div>

    <div v-if="showForm" class="form-container">
      <input v-model="form.nombre" type="text" placeholder="Nombre del producto" />
      <input v-model="form.cantidad" type="number" placeholder="Cantidad" />
      <input v-model="form.precio" type="number" placeholder="Precio unitario" />
      <input v-model="form.proveedor" type="text" placeholder="Proveedor" />
      <button @click="addItem">Guardar</button>
      <button @click="showForm = false" class="btn-cancel">Cancelar</button>
    </div>

    <div class="stats">
      <div class="stat">
        <h3>Total Items</h3>
        <p class="amount">{{ inventario.length }}</p>
      </div>
      <div class="stat">
        <h3>Valor Total Inventario</h3>
        <p class="amount">${{ valorTotalInventario.toLocaleString() }}</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in inventario" :key="idx">
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ item.precio.toLocaleString() }}</td>
            <td>${{ (item.cantidad * item.precio).toLocaleString() }}</td>
            <td>{{ item.proveedor }}</td>
            <td>
              <button @click="deleteItem(idx)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="inventario.length === 0">
            <td colspan="6" class="no-data">No hay items en el inventario</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const inventario = ref([])
const showForm = ref(false)
const form = ref({
  nombre: '',
  cantidad: '',
  precio: '',
  proveedor: ''
})

const valorTotalInventario = computed(() => {
  return inventario.value.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
})

onMounted(() => {
  const saved = localStorage.getItem('helados_inventario')
  if (saved) {
    inventario.value = JSON.parse(saved)
  }
})

const addItem = () => {
  if (form.value.nombre && form.value.cantidad && form.value.precio) {
    inventario.value.push({ 
      ...form.value,
      cantidad: parseInt(form.value.cantidad),
      precio: parseInt(form.value.precio)
    })
    form.value = { nombre: '', cantidad: '', precio: '', proveedor: '' }
    showForm.value = false
    guardarDatos()
  }
}

const deleteItem = (idx) => {
  inventario.value.splice(idx, 1)
  guardarDatos()
}

const guardarDatos = () => {
  localStorage.setItem('helados_inventario', JSON.stringify(inventario.value))
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
  background: #f3e8ff;
  border: 2px solid #a855f7;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.form-container input {
  padding: 10px;
  border: 1px solid #e9d5ff;
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
  background: #a855f7;
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
  color: #a855f7;
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
