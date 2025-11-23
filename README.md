# Loyalty Test Next (Supabase + Bootstrap)

## Setup
1) `npm i`
2) Crear `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```
3) `npm run dev` y abre http://localhost:3000

## Flujos
- /seed: crea perfiles, admin+sucursal, empleado, cliente+fidelización (usa service role local)
- /: login empleado/cliente, sumar puntos, ver saldos
