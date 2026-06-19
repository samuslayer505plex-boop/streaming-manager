<template>
  <div class="page">
    <h1>📈 Reportes - Heladerías</h1>
    
    <div class="reports-grid">
      <div class="report-card">
        <h3>Total Ventas</h3>
        <p class="report-number">$0</p>
        <p class="report-subtitle">Ingresos totales</p>
      </div>
      <div class="report-card">
        <h3>Total Capital</h3>
        <p class="report-number">$0</p>
        <p class="report-subtitle">Disponible</p>
      </div>
      <div class="report-card">
        <h3>Items en Inventario</h3>
        <p class="report-number">0</p>
        <p class="report-subtitle">Productos registrados</p>
      </div>
      <div class="report-card">
        <h3>Ganancia Neta</h3>
        <p class="report-number">$0</p>
        <p class="report-subtitle">Ventas - Gastos</p>
      </div>
    </div>

    <div class="info-box">
      <p>Los reportes se generan automáticamente basados en los datos registrados en Ventas, Capital e Inventario.</p>
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
  margin-bottom: 30px;
  color: #333;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.report-card {
  background: white;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.report-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.report-card h3 {
  margin: 0 0 15px 0;
  color: #f59e0b;
  font-size: 0.95rem;
  font-weight: bold;
}

.report-number {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: #0f172a;
}

.report-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.info-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
  padding: 20px;
  color: #333;
}

.info-box p {
  margin: 0;
  line-height: 1.6;
}
</style>
