const { contextBridge, ipcRenderer } = require('electron')

;(function attachLogger() {
  try {
    const send = (level, args) => {
      try { const safe = args.map((a) => { try { return typeof a === 'string' ? a : JSON.stringify(a) } catch (e) { return String(a) } }); ipcRenderer.send('renderer-log', { level, args: safe }) } catch (e) {}
    }
    ;['log','info','warn','error'].forEach(m => { const orig = console[m]; console[m] = (...args) => { send(m,args); try { orig.apply(console,args) } catch (e) {} } })
    window.addEventListener('error', (ev) => send('error', [ev.message, ev.filename, ev.lineno, ev.colno, (ev.error && ev.error.stack) || null]))
    window.addEventListener('unhandledrejection', (ev) => send('error', ['unhandledrejection', (ev.reason && ev.reason.stack) || ev.reason]))
  } catch (e) {}
})()

contextBridge.exposeInMainWorld('api', {
  cuentas: {
    get: () => ipcRenderer.invoke('cuentas:get'),
    create: (data) => ipcRenderer.invoke('cuentas:create', data),
    update: (id, data) => ipcRenderer.invoke('cuentas:update', id, data),
    delete: (id) => ipcRenderer.invoke('cuentas:delete', id)
  }
})
