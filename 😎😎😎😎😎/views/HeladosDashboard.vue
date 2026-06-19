<template>
  <div class="page">
    <h1>🍦 Módulo Helados - Dashboard</h1>
    <p>Panel principal de gestión de heladerías</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>💵 Ventas Totales</h3>
        <p class="stat-number">${{ totalVentas.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>💰 Capital Disponible</h3>
        <p class="stat-number">${{ capitalDisponible.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>📦 Items Inventario</h3>
        <p class="stat-number">0</p>
      </div>
      <div class="stat-card">
        <h3>📈 Ganancia Neta</h3>
        <p class="stat-number">${{ gananciaNeta.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const ventas = ref([])
const capital = ref([])

const totalVentas = computed(() => {
  return ventas.value.reduce((sum, v) => sum + (parseInt(v.monto) || 0), 0)
})

const capitalDisponible = computed(() => {
  return capital.value.reduce((sum, c) => sum + (parseInt(c.monto) || 0), 0)
})

const gananciaNeta = computed(() => {
  return totalVentas.value - (capital.value.reduce((sum, c) => sum + (parseInt(c.gasto) || 0), 0))
})

onMounted(() => {
  const savedVentas = localStorage.getItem('helados_ventas')
  const savedCapital = localStorage.getItem('helados_capital')
  if (savedVentas) ventas.value = JSON.parse(savedVentas)
  if (savedCapital) capital.value = JSON.parse(savedCapital)
})
</script>

<style scoped>
.page { 
  padding: 20px;
}

h1 {
  margin-bottom: 10px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 0.95rem;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #0f172a;
}
</style>
