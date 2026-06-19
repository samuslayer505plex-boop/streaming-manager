<template>
  <div class="page">
    <h1>🎵 Módulo Música - Dashboard</h1>
    <p>Panel principal de gestión de música, estudiantes y clases</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>👨‍🎓 Estudiantes</h3>
        <p class="stat-number">0</p>
      </div>
      <div class="stat-card">
        <h3>🎵 Clases</h3>
        <p class="stat-number">0</p>
      </div>
      <div class="stat-card">
        <h3>💰 Pagos Totales</h3>
        <p class="stat-number">$0</p>
      </div>
      <div class="stat-card">
        <h3>📈 Ingresos Mes</h3>
        <p class="stat-number">$0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
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
