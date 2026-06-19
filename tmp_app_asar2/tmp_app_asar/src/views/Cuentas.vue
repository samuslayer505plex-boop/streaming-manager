<script setup>
import { ref, onMounted } from 'vue'
import { useCuentasStore } from '../stores/cuentas'

const store = useCuentasStore()

onMounted(() => {
  if (store.load) store.load()
})

const nuevoServicio = ref('')
const nuevaDisponibles = ref(1)
const nuevoTipo = ref('personal')

const agregarCuenta = () => {
  if (!nuevoServicio.value) return
  store.agregar({ servicio: nuevoServicio.value, correo: '', password: '', perfiles: 1, ocupados: 0, disponibles: Number(nuevaDisponibles.value), renovacion: '', tipo: nuevoTipo.value })
  nuevoServicio.value = ''
  nuevaDisponibles.value = 1
  nuevoTipo.value = 'personal'
}

const editar = (i, field, value) => {
  store.actualizar(i, { [field]: value })
}

const editarCuenta = (i) => {
  const cuenta = store.cuentas[i]
  const nuevoCorreo = prompt('Editar correo', cuenta.correo || '')
  if (nuevoCorreo !== null) {
    store.actualizar(i, { correo: nuevoCorreo })
  }
}
</script>

<template>
  <div class="cuentas">
    <h1>🎟️ Cuentas</h1>

    <div class="add">
      <input v-model="nuevoServicio" placeholder="Servicio" />
      <input type="number" v-model.number="nuevaDisponibles" min="1" />
      <select v-model="nuevoTipo">
        <option value="personal">Personal</option>
        <option value="accostapremium">accostapremium</option>
        <option value="mayoristas">mayoristas</option>
        <option value="otra_empresa">Otra empresa</option>
      </select>
      <button @click="agregarCuenta">Agregar Cuenta</button>
    </div>

    <table>
      <thead>
        <tr><th>Servicio</th><th>Disponibles</th><th>Ocupados</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr v-for="(c, i) in store.cuentas" :key="i">
          <td>
            {{ c.servicio }} <small v-if="c.tipo" :class="['tipo', { empresa: c.tipo !== 'personal' }]">({{ c.tipo.replace(/_/g, ' ') }})</small>
          </td>
          <td><input type="number" :value="c.disponibles" @input="e => editar(i,'disponibles', Number(e.target.value))" /></td>
          <td>{{ c.ocupados }}</td>
          <td><button @click="editarCuenta(i)">Editar</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cuentas { padding: 30px; display: flex; flex-direction: column; align-items: center; }
.add { display:flex; gap:8px; align-items:center; margin-bottom:12px; justify-content:center; }
input { padding:8px }
select { padding:8px }
button { padding:8px 10px }
table { width:90%; max-width:980px; background:white; border-collapse:collapse; margin: 0 auto; }
th,td { padding:12px; border-bottom:1px solid #eee; text-align:center; }

.add input[type="number"], .add input[type="text"], .add select { width: 140px }

.tipo { display:inline-block; font-size:0.8rem; padding:2px 8px; border-radius:12px; margin-left:8px; background:#f0f0f0; color:#222; text-transform:capitalize; }
.tipo.empresa { background: linear-gradient(90deg, #ffd54f, #ff8a65); color:#3b1f00; font-weight:700; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

input[type="number"] { width:80px; text-align:center }
</style>