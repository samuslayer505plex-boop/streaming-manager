import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Clientes.vue'
import Ventas from '../views/Ventas.vue'
import Cuentas from '../views/Cuentas.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    component: Clientes,
    meta: { requiresAuth: true }
  },
  {
    path: '/cuentas',
    component: Cuentas,
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas',
    component: Ventas,
    meta: { requiresAuth: true }
  }
  ,
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// simple guard reading localStorage so it works before Pinia is active
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta && to.meta.requiresAuth
  const user = localStorage.getItem('user')

  console.log('[router.guard] to:', to.path, 'requiresAuth:', requiresAuth, 'localUser:', !!user)

  // redirect to login when required
  if (requiresAuth && !user) {
    next('/login')
    return
  }

  // prevent accessing login when already authenticated
  if (to.path === '/login' && user) {
    next('/')
    return
  }

  next()
})

export default router
