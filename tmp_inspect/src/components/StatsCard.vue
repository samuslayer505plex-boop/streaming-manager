<template>
  <div class="stats-card">
    <h4>{{ title }}</h4>
    <p class="value"><slot>{{ value }}</slot></p>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], default: '' }
  }
}
</script>

<style scoped>
.stats-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

.stats-card h4 {
  color: #64748b;
  margin-bottom: 8px;
}

.stats-card .value {
  font-size: 22px;
  font-weight: bold;
}
</style>
