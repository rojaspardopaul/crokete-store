# Despliegue — Store (Next.js en Vercel)

El store se despliega automáticamente en Vercel cada vez que haces `git push` a `main`. Esta guía cubre el **setup inicial** (una sola vez).

---

## Prerequisito

Necesitas primero tener desplegado el backend y conocer su URL pública (ej: `https://backend-service-xxx-uc.a.run.app`).

---

## Paso 1 — Crear cuenta y proyecto en Vercel

1. Ir a https://vercel.com → **Sign Up** con tu cuenta GitHub
2. Clic en **"Add New Project"**
3. Importar el repositorio `crokete-store`
4. Vercel detecta Next.js automáticamente — no cambies nada en la config de build

---

## Paso 2 — Configurar variables de entorno

En Vercel: **Settings → Environment Variables** → Agrega cada una:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://TU-BACKEND-URL/v1` |
| `NEXT_PUBLIC_API_SOCKET_URL` | `https://TU-BACKEND-URL` |
| `NEXT_PUBLIC_CLOUDINARY_URL` | `https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Tu upload preset de Cloudinary |
| `NEXT_PUBLIC_STORE_DOMAIN` | `https://tu-store.vercel.app/` |
| `NEXTAUTH_URL` | `https://tu-store.vercel.app` |
| `NEXTAUTH_SECRET` | El mismo valor que el backend usa (debe coincidir) |

> Para el valor de `NEXTAUTH_SECRET`: genera uno con `openssl rand -base64 32`

---

## Paso 3 — Primer despliegue

Después de configurar las variables, haz clic en **"Deploy"** en Vercel.

O desde terminal:
```bash
git push origin main
```

---

## Paso 4 — Dominio personalizado (opcional)

En Vercel: **Settings → Domains** → Agrega tu dominio.

Vercel genera automáticamente el certificado SSL.

Después de agregar el dominio:
1. Actualiza `NEXT_PUBLIC_STORE_DOMAIN` y `NEXTAUTH_URL` con el dominio real
2. Actualiza el secret `store-url-secret` en GCP Secret Manager con la nueva URL
3. Redespliega el backend con `git push` en `crokete-backend`

---

## Despliegues futuros

Solo haz `git push origin main`. Vercel despliega automáticamente en ~1-2 min.

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

Monitorea en: https://vercel.com/dashboard
