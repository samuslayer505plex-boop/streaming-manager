<template>
  <div class="sidebar">
    <h2>🎬 Streaming</h2>
    <ul>
      <li><router-link to="/">📊 Dashboard</router-link></li>
      <li><router-link to="/clientes">👥 Clientes</router-link></li>
      <li><router-link to="/cuentas">🎟️ Cuentas</router-link></li>
      <li><router-link to="/ventas">💰 Ventas</router-link></li>
      <li><router-link to="/configuracion">⚙️ Configuración</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #0f172a;
  color: white;
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
}

a {
  color: inherit;
  text-decoration: none;
  display: block;
}

a.router-link-active {
  background: rgba(255,255,255,0.08);
}
</style>