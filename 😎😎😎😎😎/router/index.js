import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Clientes.vue'
import Ventas from '../views/Ventas.vue'
import Cuentas from '../views/Cuentas.vue'
import Login from '../views/Login.vue'
import Musica from '../views/Musica.vue'
import Helados from '../views/Helados.vue'

// Música views
import MusicaDashboard from '../views/MusicaDashboard.vue'
import MusicaEstudiantes from '../views/MusicaEstudiantes.vue'
import MusicaClases from '../views/MusicaClases.vue'
import MusicaPagos from '../views/MusicaPagos.vue'
import MusicaReportes from '../views/MusicaReportes.vue'

// Helados views
import HeladosDashboard from '../views/HeladosDashboard.vue'
import HeladosVentas from '../views/HeladosVentas.vue'
import HeladosCapital from '../views/HeladosCapital.vue'
import HeladosInventario from '../views/HeladosInventario.vue'
import HeladosReportes from '../views/HeladosReportes.vue'

const routes = [
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true, panel: 'streaming' }
  },
  {
    path: '/clientes',
    component: Clientes,
    meta: { requiresAuth: true, panel: 'streaming' }
  },
  {
    path: '/cuentas',
    component: Cuentas,
    meta: { requiresAuth: true, panel: 'streaming' }
  },
  {
    path: '/ventas',
    component: Ventas,
    meta: { requiresAuth: true, panel: 'streaming' }
  },
  {
    path: '/musica',
    component: MusicaDashboard,
    meta: { requiresAuth: true, panel: 'musica' }
  },
  {
    path: '/musica/estudiantes',
    component: MusicaEstudiantes,
    meta: { requiresAuth: true, panel: 'musica' }
  },
  {
    path: '/musica/clases',
    component: MusicaClases,
    meta: { requiresAuth: true, panel: 'musica' }
  },
  {
    path: '/musica/pagos',
    component: MusicaPagos,
    meta: { requiresAuth: true, panel: 'musica' }
  },
  {
    path: '/musica/reportes',
    component: MusicaReportes,
    meta: { requiresAuth: true, panel: 'musica' }
  },
  {
    path: '/helados',
    component: HeladosDashboard,
    meta: { requiresAuth: true, panel: 'helados' }
  },
  {
    path: '/helados/ventas',
    component: HeladosVentas,
    meta: { requiresAuth: true, panel: 'helados' }
  },
  {
    path: '/helados/capital',
    component: HeladosCapital,
    meta: { requiresAuth: true, panel: 'helados' }
  },
  {
    path: '/helados/inventario',
    component: HeladosInventario,
    meta: { requiresAuth: true, panel: 'helados' }
  },
  {
    path: '/helados/reportes',
    component: HeladosReportes,
    meta: { requiresAuth: true, panel: 'helados' }
  },
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
