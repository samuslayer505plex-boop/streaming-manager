```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useCuentasStore } from '../stores/cuentas'

const store = useCuentasStore()

onMounted(() => {
  if (store.load) store.load()
})

const nuevoServicio = ref('')
const nuevaEmpresa = ref('Aliada')

const agregarCuenta = () => {
  if (!nuevoServicio.value.trim()) return

  store.agregar({
    idUsuario: String(store.cuentas.length + 1).padStart(3, '0'),
    servicio: nuevoServicio.value,
    empresa: nuevaEmpresa.value,
    estado: 'Activo',
    renovacion: '',
    correo: '',
    password: ''
  })

  nuevoServicio.value = ''
  nuevaEmpresa.value = 'Aliada'
}

const editar = (i, campo, valor) => {
  store.actualizar(i, {
    [campo]: valor
  })
}

const editarCuenta = (i) => {
  const cuenta = store.cuentas[i]

  const servicio = prompt('Servicio', cuenta.servicio || '')
  if (servicio === null) return

  const empresa = prompt('Empresa', cuenta.empresa || '')
  if (empresa === null) return

  const estado = prompt(
    'Estado (Activo/Inactivo)',
    cuenta.estado || 'Activo'
  )
  if (estado === null) return

  const renovacion = prompt(
    'Fecha de renovación',
    cuenta.renovacion || ''
  )
  if (renovacion === null) return

  const correo = prompt('Correo', cuenta.correo || '')
  if (correo === null) return

  const password = prompt('Contraseña', cuenta.password || '')
  if (password === null) return

  store.actualizar(i, {
    servicio,
    empresa,
    estado,
    renovacion,
    correo,
    password
  })
}

const eliminarCuenta = (i) => {
  if (confirm('¿Deseas eliminar esta cuenta?')) {
    store.cuentas.splice(i, 1)

    if (store.save) {
      store.save()
    }
  }
}
</script>

<template>
  <div class="cuentas">
    <h1>🎟️ Cuentas</h1>

    <div class="add">
      <input
        v-model="nuevoServicio"
        placeholder="Servicio"
      />

      <select v-model="nuevaEmpresa">
        <option>Aliada</option>
        <option>Mayoristas</option>
        <option>AccostaPremium</option>
        <option>Personal</option>
      </select>

      <button @click="agregarCuenta">
        Agregar Cuenta
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Servicio</th>
          <th>Empresa</th>
          <th>Estado</th>
          <th>Renovación</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(c, i) in store.cuentas"
          :key="i"
        >
          <td>{{ c.idUsuario || String(i + 1).padStart(3, '0') }}</td>

          <td>{{ c.servicio }}</td>

          <td>
            <select
              :value="c.empresa"
              @change="e => editar(i,'empresa',e.target.value)"
            >
              <option>Aliada</option>
              <option>Mayoristas</option>
              <option>AccostaPremium</option>
              <option>Personal</option>
            </select>
          </td>

          <td>
            <select
              :value="c.estado || 'Activo'"
              @change="e => editar(i,'estado',e.target.value)"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </td>

          <td>
            <input
              type="date"
              :value="c.renovacion"
              @input="e => editar(i,'renovacion',e.target.value)"
            />
          </td>

          <td class="acciones">
            <button
              class="btn-edit"
              @click="editarCuenta(i)"
            >
              ✏️ Editar
            </button>

            <button
              class="btn-delete"
              @click="eliminarCuenta(i)"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cuentas {
  padding: 30px;
}

h1 {
  margin-bottom: 20px;
}

.add {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.add input,
.add select {
  padding: 8px;
}

button {
  background: #000;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  opacity: .9;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

td select,
td input {
  padding: 6px;
}

.acciones {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit {
  background: #000;
}

.btn-delete {
  background: #dc3545;
}
</style>
```
