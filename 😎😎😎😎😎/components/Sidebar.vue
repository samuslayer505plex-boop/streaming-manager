<template>
  <div class="sidebar">
    <h2>{{ panelTitle }}</h2>
    <ul>
      <template v-if="panelType === 'streaming'">
        <li><router-link to="/">📊 Dashboard</router-link></li>
        <li><router-link to="/clientes">👥 Clientes</router-link></li>
        <li><router-link to="/cuentas">🎟️ Cuentas</router-link></li>
        <li><router-link to="/ventas">💰 Ventas</router-link></li>
        <li><router-link to="/configuracion">⚙️ Configuración</router-link></li>
      </template>

      <template v-else-if="panelType === 'musica'">
        <li><router-link to="/musica">📊 Dashboard</router-link></li>
        <li><router-link to="/musica/estudiantes">👨‍🎓 Estudiantes</router-link></li>
        <li><router-link to="/musica/clases">🎵 Clases</router-link></li>
        <li><router-link to="/musica/pagos">💰 Pagos</router-link></li>
        <li><router-link to="/musica/reportes">📈 Reportes</router-link></li>
      </template>

      <template v-else-if="panelType === 'helados'">
        <li><router-link to="/helados">🍦 Dashboard</router-link></li>
        <li><router-link to="/helados/ventas">💵 Ventas</router-link></li>
        <li><router-link to="/helados/capital">💰 Capital</router-link></li>
        <li><router-link to="/helados/inventario">📦 Inventario</router-link></li>
        <li><router-link to="/helados/reportes">📈 Reportes</router-link></li>
      </template>
    </ul>

    <div class="logout-btn">
      <button @click="handleLogout">🚪 Cerrar Sesión</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const panelType = computed(() => auth.panelType)

const panelTitle = computed(() => {
  if (panelType.value === 'streaming') return '🎬 Streaming'
  if (panelType.value === 'musica') return '🎵 Música'
  if (panelType.value === 'helados') return '🍦 Helados'
  return 'Panel'
})

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #0f172a;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

ul {
  list-style: none;
  padding: 0;
  flex: 1;
}

li {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

li:hover {
  background: rgba(255, 255, 255, 0.1);
}

a {
  color: inherit;
  text-decoration: none;
  display: block;
}

a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: bold;
  padding-left: 16px;
}

.logout-btn {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn button {
  width: 100%;
  padding: 10px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.logout-btn button:hover {
  background: #b91c1c;
}
</style>