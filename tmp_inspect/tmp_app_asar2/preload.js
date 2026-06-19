import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  cuentas: {
    get: () => ipcRenderer.invoke('cuentas:get'),
    create: (data) => ipcRenderer.invoke('cuentas:create', data),
    update: (id, data) => ipcRenderer.invoke('cuentas:update', id, data),
    delete: (id) => ipcRenderer.invoke('cuentas:delete', id)
  }
})
