Backend (Node + Express) para Streaming Manager

Instrucciones rápidas:

1. Copia `.env.example` a `.env` y ajusta las credenciales de MySQL.

2. Instala dependencias:

```bash
cd server
npm install
```

3. Ejecuta en modo desarrollo:

```bash
npm run dev
```

Rutas principales:
- `POST /api/auth/register` {name,email,password}
- `POST /api/auth/login` {email,password}
- `GET/POST/PUT/DELETE /api/productos`
- `GET/POST/PUT/DELETE /api/clientes`
- `GET/POST/PUT/DELETE /api/ventas`
