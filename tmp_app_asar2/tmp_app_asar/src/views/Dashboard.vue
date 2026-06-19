<template>
  <div class="dashboard-content">
        <h1>📊 Dashboard</h1>

        <div class="cards">
          <div class="card">
            <h3>Total Clientes</h3>
            <p>{{ totalClientes }}</p>
          </div>

          <div class="card">
            <h3>Clientes Activos</h3>
            <p>{{ clientesActivos }}</p>
          </div>

          <div class="card">
            <h3>Clientes Vencidos</h3>
            <p>{{ clientesVencidos }}</p>
          </div>

          <div class="card">
            <h3>Ingresos del Mes</h3>
            <p>${{ ingresosMensuales }}</p>
          </div>
        </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useClientesStore } from '../stores/clientes'
import { useVentasStore } from '../stores/ventas'
import { useCuentasStore } from '../stores/cuentas'

export default {
  name: 'Dashboard',
  setup() {
    const clientesStore = useClientesStore()
    const ventasStore = useVentasStore()
    const cuentasStore = useCuentasStore()

    const totalClientes = computed(() => clientesStore.clientes.length)
    const clientesActivos = computed(() => clientesStore.clientes.filter(c => c && (c.activo === true || (c.estado && String(c.estado).toLowerCase().includes('activo')))).length)
    const clientesVencidos = computed(() => clientesStore.clientes.length - clientesActivos.value)
    const ingresosMensuales = computed(() => ventasStore.totalIngresos)

    console.log('Dashboard setup: clientesStore', JSON.parse(JSON.stringify(clientesStore.clientes)))
    console.log('Dashboard setup: ventasStore', JSON.parse(JSON.stringify(ventasStore.ventas)))
    console.log('Dashboard setup: cuentasStore', JSON.parse(JSON.stringify(cuentasStore.cuentas)))

    return { totalClientes, clientesActivos, clientesVencidos, ingresosMensuales, cuentasStore }
  }
}
</script>

<style scoped>
.dashboard-content { padding: 30px; }

h1 {
  margin-bottom: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,.1);
}

.card h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.card p {
  font-size: 24px;
  font-weight: bold;
}
</style>
