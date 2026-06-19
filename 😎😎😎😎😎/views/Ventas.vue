<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVentasStore } from '../stores/ventas'

const store = useVentasStore()

onMounted(() => {
  store.fetchAll()
})

const servicio = ref('')
const empresa = ref('Mayorista')
const valor_empresa = ref('')
const valor_yo = ref('')

const editingIndex = ref(-1)
const editingField = ref(null)

const getNextId = () => {
  if (store.ventas.length === 0) return 1
  return Math.max(...store.ventas.map(v => v.id_servicio || 0)) + 1
}

const startEditar = (i, field) => {
  const v = store.ventas[i]
  if (!v) return
  editingIndex.value = i
  editingField.value = field
}

const guardarEditar = (i) => {
  const v = store.ventas[i]
  if (!v) return
  
  const updateData = {
    id_servicio: v.id_servicio || 0,
    servicio: v.servicio || '',
    empresa: v.empresa || 'Mayorista',
    valor_empresa: Number(v.valor_empresa) || 0,
    valor_yo: Number(v.valor_yo) || 0
  }
  
  store.actualizar(i, updateData)
  editingIndex.value = -1
  editingField.value = null
}

const cancelarEditar = () => {
  editingIndex.value = -1
  editingField.value = null
}

const agregarVenta = () => {
  if (!servicio.value || !valor_empresa.value || !valor_yo.value) {
    alert('Completa todos los campos')
    return
  }
  
  store.agregar({
    id_servicio: getNextId(),
    servicio: servicio.value,
    empresa: empresa.value,
    valor_empresa: Number(valor_empresa.value) || 0,
    valor_yo: Number(valor_yo.value) || 0,
    fecha: new Date().toISOString()
  })

  servicio.value = ''
  empresa.value = 'Mayorista'
  valor_empresa.value = ''
  valor_yo.value = ''
}

const calcularGanancia = (empresa, yo) => {
  return Math.abs((Number(empresa) || 0) - (Number(yo) || 0))
}

const formatearNumero = (num) => {
  return Number(num).toLocaleString('es-CO', { maximumFractionDigits: 0 })
}

const calcularTotal = (empresa, ganancia) => {
  return (Number(empresa) || 0) + (Number(ganancia) || 0)
}

const eliminarVenta = (i) => {
  if (confirm('¿Eliminar venta?')) store.eliminarByIndex(i)
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
    <h1>💰 Streaming Ventas</h1>

    <div class="formulario">
      <input v-model="servicio" placeholder="Servicio" />
      <select v-model="empresa" class="select-empresa">
        <option value="Mayorista">Mayorista</option>
        <option value="AcostaPremium">AcostaPremium</option>
      </select>
      <input v-model="valor_empresa" placeholder="Valor Empresa" type="number" />
      <input v-model="valor_yo" placeholder="Valor (Yo)" type="number" />
      <button @click="agregarVenta">Registrar Venta</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Servicio</th>
          <th>Empresa</th>
          <th>Valor Empresa</th>
          <th>Valor (Yo)</th>
          <th>Ganancia</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in store.ventas" :key="index">
          <td class="id-cell">
            {{ venta.id_servicio }}
          </td>
          <td>
            <span v-if="editingIndex !== index || editingField !== 'servicio'" @click="startEditar(index, 'servicio')" class="editable">
              {{ venta.servicio }}
            </span>
            <input v-else v-model="venta.servicio" @blur="guardarEditar(index)" @keyup.enter="guardarEditar(index)" autofocus />
          </td>
          <td>
            <span v-if="editingIndex !== index || editingField !== 'empresa'" @click="startEditar(index, 'empresa')" class="editable">
              {{ venta.empresa }}
            </span>
            <select v-else v-model="venta.empresa" @blur="guardarEditar(index)" @keyup.enter="guardarEditar(index)" autofocus class="select-edit">
              <option value="Mayorista">Mayorista</option>
              <option value="AcostaPremium">AcostaPremium</option>
            </select>
          </td>
          <td>
            <span v-if="editingIndex !== index || editingField !== 'valor_empresa'" @click="startEditar(index, 'valor_empresa')" class="editable">
              ${{ formatearNumero(venta.valor_empresa || 0) }}
            </span>
            <input v-else v-model.number="venta.valor_empresa" type="number" @blur="guardarEditar(index)" @keyup.enter="guardarEditar(index)" autofocus />
          </td>
          <td>
            <span v-if="editingIndex !== index || editingField !== 'valor_yo'" @click="startEditar(index, 'valor_yo')" class="editable">
              ${{ formatearNumero(venta.valor_yo || 0) }}
            </span>
            <input v-else v-model.number="venta.valor_yo" type="number" @blur="guardarEditar(index)" @keyup.enter="guardarEditar(index)" autofocus />
          </td>
          <td class="ganancia-cell">
            ${{ formatearNumero(calcularGanancia(venta.valor_empresa, venta.valor_yo)) }}
          </td>
          <td>
            <button @click="eliminarVenta(index)" class="btn-delete">Eliminar</button>
          </td>
          <td class="total-cell">
            ${{ formatearNumero(Number(venta.valor_empresa || 0) + calcularGanancia(venta.valor_empresa, venta.valor_yo)) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="row-empty">
          <td colspan="8"></td>
        </tr>
        <tr class="row-total">
          <td class="subtotal-label"><strong>TOTAL:</strong></td>
          <td></td>
          <td></td>
          <td class="total-cell"><strong>${{ formatearNumero(store.ventas.reduce((acc, v) => acc + (Number(v.valor_empresa) || 0), 0)) }}</strong></td>
          <td class="total-cell"><strong>${{ formatearNumero(store.ventas.reduce((acc, v) => acc + (Number(v.valor_yo) || 0), 0)) }}</strong></td>
          <td><strong>${{ formatearNumero(store.ventas.reduce((acc, v) => acc + calcularGanancia(v.valor_empresa, v.valor_yo), 0)) }}</strong></td>
          <td class="total-cell"><strong>${{ formatearNumero(store.ventas.reduce((acc, v) => acc + (Number(v.valor_empresa) || 0) + calcularGanancia(v.valor_empresa, v.valor_yo), 0)) }}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.ventas {
  padding: 30px;
  max-height: 100vh;
  overflow-y: auto;
  position: relative;
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
  border-radius: 4px;
  font-size: 14px;
}

.formulario select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.formulario button {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
}

.formulario button:hover {
  background: #059669;
}

table {
  width: 100%;
  background: #f8f9fa;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  table-layout: fixed;
}

thead {
  background: #f3f4f6;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 9;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

td.editable {
  cursor: pointer;
  background: #f0fdf4;
  padding: 8px 10px;
}

td.editable:hover {
  background: #dcfce7;
}

td input {
  width: 100%;
  border: 2px solid #3b82f6;
  padding: 6px;
  border-radius: 4px;
  font-size: 14px;
}

.select-edit {
  width: 100%;
  border: 2px solid #3b82f6;
  padding: 6px;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.select-empresa {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

td.total-cell {
  background: #cfe9f7;
  font-weight: bold;
}

td.ganancia-cell {
  background: white;
  font-weight: bold;
}

.id-cell {
  text-align: center;
}

tbody tr:hover {
  background: #948e8e;
}

tbody tr:hover td.ganancia-cell {
  background: #948e8e;
}

tfoot tr.row-empty {
  background: white;
  height: 20px;
}

tfoot tr.row-empty td {
  border: none;
  padding: 0;
}

tfoot {
  position: relative;
}

tfoot tr.row-total {
  background: linear-gradient(180deg, #cfe9f7 0%, #a8d8f0 100%);
  font-weight: bold;
  box-shadow: 
    0 -8px 15px rgba(79, 130, 180, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 15px;
  border-top: 3px solid #3b82f6;
}

tfoot tr.row-total::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(
    to bottom,
    rgba(207, 233, 247, 0.8) 0%,
    rgba(207, 233, 247, 0.4) 50%,
    rgba(207, 233, 247, 0) 100%
  );
  pointer-events: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.subtotal-label {
  background: #cfe9f7;
  text-align: left;
  font-weight: bold;
}

th:first-child,
td:first-child {
  width: 60px;
  min-width: 60px;
}

th:nth-child(2),
td:nth-child(2) {
  width: 140px;
  min-width: 140px;
}

th:nth-child(3),
td:nth-child(3) {
  width: 130px;
  min-width: 130px;
}

th:nth-child(4),
td:nth-child(4) {
  width: 140px;
  min-width: 140px;
}

th:nth-child(5),
td:nth-child(5) {
  width: 140px;
  min-width: 140px;
}

th:nth-child(6),
td:nth-child(6) {
  width: 140px;
  min-width: 140px;
}

th:nth-child(7),
td:nth-child(7) {
  width: 100px;
  min-width: 100px;
  text-align: center;
}

th:last-child,
td:last-child {
  width: 140px;
  min-width: 140px;
}

tfoot tr.row-total-final {
  background: #fcd34d;
  font-weight: bold;
}

.total-cell-final {
  background: #fbbf24 !important;
  font-weight: bold;
  padding: 12px 15px;
  border: 2px solid #f59e0b;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  margin: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: inline-block;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

h1 {
  color: #1f2937;
  margin-bottom: 20px;
}
</style>
