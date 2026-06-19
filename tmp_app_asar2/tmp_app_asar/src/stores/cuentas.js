import { defineStore } from 'pinia'

export const useCuentasStore = defineStore('cuentas', {
  state: () => ({
    cuentas: JSON.parse(localStorage.getItem('cuentas')) || [
      { servicio: 'Netflix', correo: '', password: '', perfiles: 5, ocupados: 0, disponibles: 5, renovacion: '', tipo: 'personal' },
      { servicio: 'Spotify', correo: '', password: '', perfiles: 1, ocupados: 0, disponibles: 1, renovacion: '', tipo: 'mayoristas' },
      { servicio: 'Disney+', correo: '', password: '', perfiles: 4, ocupados: 0, disponibles: 4, renovacion: '', tipo: 'accostapremium' }
    ]
  }),

  actions: {
    async load() {
      if (window.api && window.api.cuentas && window.api.cuentas.get) {
        try {
          const rows = await window.api.cuentas.get()
          this.cuentas = rows.map(r => ({ id: r.id, servicio: r.servicio, correo: r.correo, password: r.password, perfiles: r.perfiles || 0, ocupados: r.ocupados || 0, disponibles: r.disponibles || 0, renovacion: r.renovacion || '', tipo: r.tipo || 'personal' }))
          localStorage.setItem('cuentas', JSON.stringify(this.cuentas))
          return
        } catch (e) {
          console.error('load cuentas failed', e)
        }
      }
      // fallback already uses localStorage defaults
    },
    agregar(cuenta) {
      // ensure tipo defaults to 'personal' when missing
      const withTipo = { tipo: 'personal', ...cuenta }
      if (window.api && window.api.cuentas && window.api.cuentas.create) {
        try {
          return window.api.cuentas.create(withTipo).then(res => {
            this.cuentas.push({ id: res.id, ...withTipo })
            localStorage.setItem('cuentas', JSON.stringify(this.cuentas))
          })
        } catch (e) {
          console.error('create cuenta failed', e)
        }
      }
      this.cuentas.push(withTipo)
      localStorage.setItem('cuentas', JSON.stringify(this.cuentas))
    },
    async actualizar(index, data) {
      const updated = { ...this.cuentas[index], ...data }
      this.cuentas[index] = updated
      if (window.api && window.api.cuentas && window.api.cuentas.update && updated.id) {
        try {
          await window.api.cuentas.update(updated.id, updated)
        } catch (e) {
          console.error('update cuenta failed', e)
        }
      }
      localStorage.setItem('cuentas', JSON.stringify(this.cuentas))
    },
    clear() {
      this.cuentas = []
      localStorage.removeItem('cuentas')
    }
  },

  getters: {
    cuentasDisponibles: (state) => state.cuentas.reduce((acc, c) => acc + (c.disponibles || 0), 0)
  }
})

export default useCuentasStore
