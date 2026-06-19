# Streaming Manager — Empaquetado con Electron

Este repositorio contiene una versión de la app preparada para empaquetar como aplicación de escritorio Windows usando Electron y electron-builder.

Pasos para ejecutar en tu PC Windows:

1. Instalar dependencias:

```powershell
cd C:\ruta\a\streaming-manager
npm install
```

2. Ejecutar en modo desarrollo (abre la app en una ventana de Electron):

```powershell
npm run electron:dev
```

Si Electron falla con el error "Electron failed to install correctly", prueba:

```powershell
npm rebuild --update-binary
# o
rm -rf node_modules\electron
npm install electron --save
npm run electron:dev
```

3. Generar instalador (EXE):

- Coloca un icono Windows en `build/icon.ico` (opcional). Si no existe, el build usará icono por defecto.
 - Coloca un icono Windows válido en `build/icon.ico`. Actualmente hay un placeholder en `build/icon.ico` — reemplázalo por un `.ico` real antes de ejecutar el build.
	 Puedes convertir una imagen PNG a ICO con sitios como https://icoconvert.com/ o usando ImageMagick:

```powershell
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
```
- Ejecuta:

```powershell
npm run electron:build
```

El instalador/EXE resultante quedará en la carpeta `dist`.

Notas importantes:
- La aplicación corre el acceso a la base de datos SQLite desde el proceso principal de Electron (no expone un servidor HTTP abierto).
- El renderer (frontend) se comunica con el proceso principal mediante `window.api.cuentas` (métodos: `get`, `create`, `update`, `delete`).
- Si quieres personalizar el instalador (firma, iconos, targets) edita la sección `build` en `package.json`.

Si quieres, yo puedo:
- Añadir un `icon.ico` de ejemplo (requiere una imagen fuente) y configurar más opciones de `electron-builder`.
- Generar el EXE aquí y pasártelo (requiere permisos/entorno de build apropiado).