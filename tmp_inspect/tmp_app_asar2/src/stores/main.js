import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    clientes: [],
    cuentas: [],
    ventas: []
  }),
  getters: {
    totalClientes: (state) => state.clientes.length,
    clientesActivos: (state) => state.clientes.filter(c => c.activo).length,
    clientesVencidos: (state) => state.clientes.length - state.clientes.filter(c => c.activo).length,
    ingresosMensuales: (state) => state.ventas.reduce((sum, v) => sum + (Number(v.valor) || 0), 0)
  },
  actions: {
    addCliente(cliente) {
      this.clientes.push(cliente)
    },
    addCuenta(cuenta) {
      this.cuentas.push(cuenta)
    },
    addVenta(venta) {
      // ensure valor is a number
      venta.valor = Number(venta.valor) || 0
      this.ventas.push(venta)
    }
  }
})

export default useMainStore
