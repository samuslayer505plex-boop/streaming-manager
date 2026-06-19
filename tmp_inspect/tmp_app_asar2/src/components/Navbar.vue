<template>
  <nav class="navbar">
    <div class="brand">Streaming Manager</div>
    <div class="user-area">
      <div class="user-info">
        <span class="user">👤 {{ userName }}</span>
        <small v-if="auth.user" class="email">{{ auth.user.email }}</small>
      </div>
      <button class="logout" @click="handleLogout">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const userName = computed(() => auth.user ? auth.user.name : 'Invitado')

// expose auth to template for email
const authRef = auth

function handleLogout() {
  auth.logout()
  // redirigir al login
  router.replace('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user {
  font-weight: bold;
}

.logout {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .email { display: none; }
  .logout { padding: 4px 8px; font-size: 12px; }
}
</style>
