<template>
  <div class="app-container">
    <div v-if="isLoginPage" class="login-layout">
      <router-view />
    </div>
    <div v-else class="app-layout">
      <Sidebar />
      <div class="main">
        <Navbar />
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import { startReminders, stopReminders, requestNotificationPermission } from './utils/reminders.js'

const route = useRoute()
const auth = useAuthStore()

const isLoginPage = computed(() => {
  return route.path === '/login'
})

onMounted(async () => {
  // Iniciar recordatorios si el usuario está autenticado
  if (auth.isAuthenticated && auth.panelType === 'musica') {
    await requestNotificationPermission()
    startReminders()
  }
})

onUnmounted(() => {
  stopReminders()
})
</script>

<style>
.login-layout {
  width: 100%;
  height: 100vh;
}

.app-layout { 
  display: flex; 
  min-height: 100vh; 
}

.main { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
}

.content { 
  padding: 20px; 
  background: #f8fafc; 
  flex: 1;
  overflow-y: auto;
}

/* make router-view content scrollable without moving sidebar */
body, #app { 
  height: 100%; 
  margin: 0;
  padding: 0;
}
.app-container {
  width: 100%;
  height: 100vh;
}
</style>
