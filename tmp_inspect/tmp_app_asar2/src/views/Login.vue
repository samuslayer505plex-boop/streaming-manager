<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🎬 Streaming Manager</h1>
      <p>Panel de Administración</p>
        <input v-model="email" type="text" placeholder="Usuario" />
        <input v-model="password" type="password" placeholder="Contraseña" />
        <button type="button" @click="handleLogin">Iniciar Sesión</button>
        <button type="button" @click="seedDemo" style="margin-top:8px; background:#3b82f6">Cargar demo</button>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'

  const email = ref('')
  const password = ref('')

  const router = useRouter()
  const auth = useAuthStore()

  const handleLogin = async () => {
    // demo login: validate fields minimal
    if (!email.value) {
      alert('Por favor ingresa el usuario')
      return
    }

    try {
      const result = await auth.loginWithApi(email.value, password.value)
      console.log('Login success', result)
      alert('Inicio de sesión correcto')
      router.replace('/').catch(() => (window.location.href = '/'))
    } catch (err) {
      console.error('Login error', err)
      alert('Error al iniciar sesión: ' + (err.message || err))
    }
  }

  const seedDemo = () => {
    const demoUser = { email: 'demo@demo.com', name: 'Usuario Demo' }
    console.log('Seed: iniciando sesión demo', demoUser)
    auth.login(demoUser)
    alert('Demo cargada. Entrando...')
    router.replace('/').catch(() => (window.location.href = '/'))
  }
  </script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
}

.login-card {
  width: 380px;
  background: white;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,.2);
}

h1 {
  text-align: center;
  color: #0f172a;
  margin-bottom: 10px;
}

p {
  text-align: center;
  color: #64748b;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
}

button {
  width: 100%;
  padding: 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  opacity: 0.9;
}
</style>
