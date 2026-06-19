<template>
  <div class="auth-card">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AuthCard'
}
</script>

<style scoped>
.auth-card { max-width: 420px; margin: 4rem auto; padding: 2rem; border-radius: 12px; background: #0b1220; color: #fff; box-shadow: 0 8px 24px rgba(2,6,23,0.6); }
</style>
