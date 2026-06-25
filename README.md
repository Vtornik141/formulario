# Ceiba Visual — Formulario de proyecto

App standalone con el brief multi-paso de Ceiba Visual, pensada para enviarse directo a clientes (sin pasar por la web principal) y desplegarse de forma independiente en Vercel.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y define:

```
RESEND_API_KEY=tu_api_key_de_resend
```

La dirección de destino de los correos se configura en `app/api/brief/route.ts` (`DESTINATION_EMAIL`).
