# PsicoConecta Frontend

Frontend en React + Vite para autenticacion y reservas.

## Variables de entorno

Usa `.env.example` como referencia:

```bash
VITE_API_URL=http://localhost:3000
```

- En desarrollo puedes usar `http://localhost:3000`.
- En produccion (Render) debes configurar `VITE_API_URL` con la URL publica de tu backend, por ejemplo: `https://tu-backend.onrender.com`.
- El frontend ya no usa `localhost` como fallback en produccion.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Endpoints esperados por el frontend

- `POST /api/register`
- `POST /api/login`
- `POST /api/reservas`

Si las reservas no quedan en PostgreSQL, el problema esta en el backend desplegado (variables de entorno y conexion a DB), no en este frontend.
prueba clave admin