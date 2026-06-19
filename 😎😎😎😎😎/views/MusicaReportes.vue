<template>
  <div class="page">
    <h1>📈 Reportes - Módulo Música</h1>
    
    <div class="reports-grid">
      <div class="report-card">
        <h3>Total Estudiantes</h3>
        <p class="report-number">0</p>
        <p class="report-subtitle">Estudiantes activos</p>
      </div>
      <div class="report-card">
        <h3>Total Clases</h3>
        <p class="report-number">0</p>
        <p class="report-subtitle">Clases disponibles</p>
      </div>
      <div class="report-card">
        <h3>Ingresos Totales</h3>
        <p class="report-number">$0</p>
        <p class="report-subtitle">En moneda COP</p>
      </div>
      <div class="report-card">
        <h3>Tasa de Pago</h3>
        <p class="report-number">0%</p>
        <p class="report-subtitle">Estudiantes pagados</p>
      </div>
    </div>

    <div class="info-box">
      <p>Los reportes se generan automáticamente basados en los datos registrados en Estudiantes, Clases y Pagos.</p>
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
  border: 2px solid #0284c7;
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
  color: #0284c7;
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
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
  border-radius: 4px;
  padding: 20px;
  color: #333;
}

.info-box p {
  margin: 0;
  line-height: 1.6;
}
</style>
