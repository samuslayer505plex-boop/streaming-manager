<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🎬 Sampix Tec Program</h1>
      <p>Selecciona tu panel de control</p>

      <div v-if="!selected" class="options-container">
        <button class="opt streaming" @click="select('streaming')">
          <span class="icon">🎬</span>
          <span class="label">Panel Sampix Tec</span>
          <span class="desc">Gestión de streaming</span>
        </button>
        <button class="opt musica" @click="select('musica')">
          <span class="icon">🎵</span>
          <span class="label">Panel Música</span>
          <span class="desc">Estudiantes, clases y pagos</span>
        </button>
        <button class="opt helados" @click="select('helados')">
          <span class="icon">🍦</span>
          <span class="label">Panel Helados</span>
          <span class="desc">Ventas e inventario</span>
        </button>
      </div>

      <div v-else class="form">
        <p>Accediendo a: <strong>{{ selectedLabel }}</strong></p>
        
        <!-- Tabs para cambiar entre métodos de autenticación -->
        <div class="auth-tabs">
          <button 
            v-for="tab in authTabs" 
            :key="tab"
            @click="authMethod = tab"
            :class="{ active: authMethod === tab }"
            class="tab-btn"
          >
            {{ tab === 'password' ? '🔐 Usuario' : '👆 Huella' }}
          </button>
        </div>

        <!-- Autenticación por Usuario/Contraseña -->
        <div v-if="authMethod === 'password'" class="auth-content">
          <input v-model="email" :disabled="loading" type="text" placeholder="Usuario" />
          <input v-model="password" :disabled="loading" type="password" placeholder="Contraseña (opcional)" />
          <button 
            v-if="biometricAvailable && !fingerprintRegistered"
            @click="registerFingerprint"
            :disabled="loading"
            class="register-fingerprint"
          >
            👆 Coloca tu Huella Digital
          </button>
        </div>

        <!-- Autenticación por Huella Digital -->
        <div v-if="authMethod === 'biometric'" class="auth-content">
          <div v-if="!fingerprintRegistered" class="info-box">
            <p>⚠️ No tienes huella registrada en este dispositivo.</p>
            <p>Cambia a "Usuario" y registra tu huella digital.</p>
          </div>
          <div v-else class="fingerprint-prompt">
            <p class="fingerprint-text">Coloca tu dedo en el lector de huellas</p>
            <div class="fingerprint-icon">👆</div>
            <p class="fingerprint-subtitle">o haz clic abajo para autenticar</p>
          </div>
        </div>

        <div class="actions">
          <button class="primary" :disabled="loading" type="button" @click="handleLogin">
            <span v-if="loading" class="spinner">⏳</span>
            <span v-else>{{ authMethod === 'password' ? 'Entrar' : 'Autenticar' }}</span>
          </button>
          <button class="back" type="button" :disabled="loading" @click="clearSelection">Volver</button>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BiometricAuth from '../utils/biometric'

const email = ref('')
const password = ref('')
const selected = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const authMethod = ref('password')
const biometricAvailable = ref(false)
const fingerprintRegistered = ref(false)

const router = useRouter()
const auth = useAuthStore()

const selectedLabel = computed(() => {
  if (selected.value === 'streaming') return 'Streaming'
  if (selected.value === 'musica') return 'Música'
  if (selected.value === 'helados') return 'Helados'
  return ''
})

const authTabs = computed(() => {
  const tabs = ['password']
  if (biometricAvailable.value) {
    tabs.push('biometric')
  }
  return tabs
})

onMounted(async () => {
  const available = await BiometricAuth.isAvailable()
  biometricAvailable.value = available
})

const checkFingerprintStatus = () => {
  if (!email.value) return
  const fingerprints = BiometricAuth.getRegisteredFingerprints(email.value)
  fingerprintRegistered.value = fingerprints.length > 0
}

const registerFingerprint = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa el usuario'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await BiometricAuth.registerFingerprint(email.value)
    if (result.success) {
      fingerprintRegistered.value = true
      success.value = '✅ Huella registrada correctamente. Ya puedes autenticarte con ella.'
      setTimeout(() => {
        success.value = ''
        authMethod.value = 'biometric'
      }, 2000)
    } else {
      error.value = result.error || 'Error al registrar huella'
    }
  } catch (err) {
    console.error('Register fingerprint error:', err)
    error.value = err.message || 'Error al registrar huella'
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''

  if (authMethod.value === 'password') {
    if (!email.value) {
      error.value = 'Por favor ingresa el usuario'
      return
    }

    loading.value = true
    try {
      const demoUser = {
        email: email.value,
        name: `${email.value} (${selected.value})`,
        module: selected.value
      }
      
      auth.user = demoUser
      auth.token = `demo-token-${Date.now()}`
      auth.panelType = selected.value
      auth.isAuthenticated = true
      
      localStorage.setItem('user', JSON.stringify(demoUser))
      localStorage.setItem('token', auth.token)
      localStorage.setItem('panelType', selected.value)

      console.log('Login success:', demoUser)
      
      if (selected.value === 'musica') {
        router.replace('/musica')
      } else if (selected.value === 'helados') {
        router.replace('/helados')
      } else {
        router.replace('/')
      }
    } catch (err) {
      console.error('Login error', err)
      error.value = err.message || 'Error al iniciar sesión'
    } finally {
      loading.value = false
    }
  } else if (authMethod.value === 'biometric') {
    if (!fingerprintRegistered.value) {
      error.value = 'No tienes huella registrada'
      return
    }

    loading.value = true
    try {
      const result = await BiometricAuth.authenticate(email.value)
      if (result.success) {
        const demoUser = {
          email: result.userName,
          name: `${result.userName} (${selected.value})`,
          module: selected.value,
          authMethod: 'biometric'
        }
        
        auth.user = demoUser
        auth.token = `bio-token-${Date.now()}`
        auth.panelType = selected.value
        auth.isAuthenticated = true
        
        localStorage.setItem('user', JSON.stringify(demoUser))
        localStorage.setItem('token', auth.token)
        localStorage.setItem('panelType', selected.value)

        console.log('Biometric login success:', demoUser)
        success.value = '✅ Autenticación biométrica exitosa'
        
        setTimeout(() => {
          if (selected.value === 'musica') {
            router.replace('/musica')
          } else if (selected.value === 'helados') {
            router.replace('/helados')
          } else {
            router.replace('/')
          }
        }, 1000)
      } else {
        error.value = result.error || 'Error en la autenticación biométrica'
      }
    } catch (err) {
      console.error('Biometric auth error', err)
      error.value = err.message || 'Error en la autenticación biométrica'
    } finally {
      loading.value = false
    }
  }
}

const select = (which) => {
  // Validar entrada por seguridad
  const validPanels = ['streaming', 'musica', 'helados']
  if (!validPanels.includes(which)) {
    console.warn('⚠️ Intento de acceso no autorizado a panel:', which)
    error.value = 'Panel no válido'
    return
  }

  // Limpiar estado anterior
  clearSelection()
  
  selected.value = which
  
  // Asignar usuario según panel
  const userMap = {
    'streaming': 'samuel',
    'musica': 'alex',
    'helados': 'paula'
  }
  
  email.value = userMap[which] || ''
  password.value = ''
  authMethod.value = 'password'
  
  // Verificar huella digital registrada
  if (email.value) {
    checkFingerprintStatus()
  }
}

const clearSelection = () => {
  selected.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
  success.value = ''
  authMethod.value = 'password'
  fingerprintRegistered.value = false
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #0f172a;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

p {
  text-align: center;
  color: #64748b;
  margin: 0 0 40px 0;
  font-size: 1.1rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  gap: 10px;
}

.opt:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.opt.streaming,
.opt.musica {
  border-color: #0284c7;
  background: linear-gradient(135deg, #f0f9ff 0%, white 100%);
}

.opt.streaming:hover,
.opt.musica:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, white 100%);
  border-color: #0264b8;
}

.opt.helados {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, white 100%);
}

.opt.helados:hover {
  background: linear-gradient(135deg, #fef3c7 0%, white 100%);
  border-color: #f49e0a;
}

.opt .icon {
  font-size: 3rem;
}

.opt .label {
  font-size: 1.2rem;
  color: #0f172a;
}

.opt .desc {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: normal;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form p {
  margin: 0 0 10px 0;
  font-size: 1rem;
}

.auth-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: bold;
  color: #64748b;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #0284c7;
  border-bottom-color: #0284c7;
}

.tab-btn:hover {
  color: #0284c7;
}

.auth-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.fingerprint-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: #f0f9ff;
  border-radius: 12px;
  border: 2px solid #0284c7;
}

.fingerprint-text {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
  font-weight: bold;
}

.fingerprint-icon {
  font-size: 4rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.fingerprint-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.info-box {
  padding: 20px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin: 10px 0;
}

.info-box p {
  margin: 8px 0;
  font-size: 0.95rem;
  color: #333;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}

.register-fingerprint {
  padding: 12px;
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.register-fingerprint:hover:not(:disabled) {
  background: #0891b2;
}

.register-fingerprint:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
}

.primary {
  background: #10b981;
  color: white;
}

.primary:hover:not(:disabled) {
  background: #059669;
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.back {
  background: #e2e8f0;
  color: #333;
}

.back:hover:not(:disabled) {
  background: #cbd5e1;
}

.back:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
  font-size: 0.95rem;
  margin-top: 10px;
}

.success {
  background: #dcfce7;
  color: #16a34a;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #16a34a;
  font-size: 0.95rem;
  margin-top: 10px;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #0f172a;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

p {
  text-align: center;
  color: #64748b;
  margin: 0 0 40px 0;
  font-size: 1.1rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  gap: 10px;
}

.opt:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.opt.streaming {
  border-color: #0284c7;
  background: linear-gradient(135deg, #f0f9ff 0%, white 100%);
}

.opt.streaming:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, white 100%);
  border-color: #0264b8;
}

.opt.musica {
  border-color: #0284c7;
  background: linear-gradient(135deg, #f0f9ff 0%, white 100%);
}

.opt.musica:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, white 100%);
  border-color: #0264b8;
}

.opt.helados {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, white 100%);
}

.opt.helados:hover {
  background: linear-gradient(135deg, #fef3c7 0%, white 100%);
  border-color: #f49e0a;
}

.opt .icon {
  font-size: 3rem;
}

.opt .label {
  font-size: 1.2rem;
  color: #0f172a;
}

.opt .desc {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: normal;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form p {
  margin: 0 0 10px 0;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
}

.primary {
  background: #10b981;
  color: white;
}

.primary:hover:not(:disabled) {
  background: #059669;
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.back {
  background: #e2e8f0;
  color: #333;
}

.back:hover:not(:disabled) {
  background: #cbd5e1;
}

.back:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
  font-size: 0.95rem;
  margin-top: 10px;
}
</style>
