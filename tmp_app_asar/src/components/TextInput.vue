<template>
  <label class="text-input">
    <slot name="label"></slot>
    <input v-bind="$attrs" />
  </label>
</template>

<script>
export default {
  name: 'TextInput'
}
</script>

<style scoped>
.text-input { display: block; margin-bottom: 1rem; }
.text-input input { width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #213043; background: #07111a; color: #e6eef6; }
</style>
