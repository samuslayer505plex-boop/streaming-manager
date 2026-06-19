<template>
  <button class="btn-primary" v-bind="$attrs"><slot /></button>
</template>

<script>
export default {
  name: 'ButtonPrimary'
}
</script>

<style scoped>
.btn-primary { display: inline-block; padding: 0.75rem 1.2rem; border-radius: 8px; background: linear-gradient(90deg,#ff6b6b,#ff8e53); color: #042028; font-weight: 700; border: none; cursor: pointer; }
</style>
