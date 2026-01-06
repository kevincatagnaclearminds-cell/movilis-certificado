# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar la aplicación Movilis Certificados en Vercel.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub, GitLab o Bitbucket
- Backend API desplegado y accesible

## 🔧 Configuración Paso a Paso

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Variables de Entorno

Antes de desplegar, necesitas configurar las variables de entorno en Vercel:

#### Variables Requeridas:

- `VITE_API_URL`: URL base de tu backend API
  - Ejemplo desarrollo: `http://localhost:3000/api`
  - Ejemplo producción: `https://api.movilis.com/api`

#### Variables Opcionales:

- `VITE_API_KEY`: Si tu backend requiere una API key

### 3. Desplegar en Vercel

#### Opción A: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio desde GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configura las variables de entorno:
   - Ve a **Settings > Environment Variables**
   - Agrega `VITE_API_URL` con la URL de tu backend
6. Haz clic en **"Deploy"**

#### Opción B: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

### 4. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings > Environment Variables**
3. Agrega las siguientes variables:

```
VITE_API_URL = https://tu-backend-api.com/api
```

4. Selecciona los ambientes donde aplicará (Production, Preview, Development)
5. Guarda los cambios
6. Vuelve a desplegar para que los cambios surtan efecto

### 5. Verificar el Despliegue

Una vez desplegado:

1. Vercel te proporcionará una URL (ej: `movilis-certificado.vercel.app`)
2. Visita la URL y verifica que la aplicación carga correctamente
3. Prueba el login y las funcionalidades principales
4. Verifica que las llamadas al API funcionan correctamente

## 🔍 Solución de Problemas

### Error: "Failed to fetch" o problemas de CORS

**Problema:** El backend no permite peticiones desde el dominio de Vercel.

**Solución:** Configura CORS en tu backend para permitir el dominio de Vercel:

```javascript
// Ejemplo en Express
app.use(cors({
  origin: [
    'https://tu-app.vercel.app',
    'https://movilis-certificado.vercel.app'
  ]
}));
```

### Error: Variables de entorno no funcionan

**Problema:** Las variables no se están cargando correctamente.

**Solución:**
1. Verifica que las variables comienzan con `VITE_`
2. Asegúrate de haber vuelto a desplegar después de agregar las variables
3. Verifica en la consola del navegador que `import.meta.env.VITE_API_URL` tiene el valor correcto

### Error: Rutas no funcionan al recargar

**Problema:** Al recargar una ruta como `/dashboard`, aparece un 404.

**Solución:** El archivo `vercel.json` ya está configurado con rewrites para manejar esto. Si persiste, verifica que el archivo esté en la raíz del proyecto.

### Build falla

**Problema:** El build falla durante el despliegue.

**Solución:**
1. Verifica que `npm run build` funciona localmente
2. Revisa los logs de build en Vercel
3. Asegúrate de que todas las dependencias estén en `package.json`
4. Verifica que no haya errores de TypeScript (`npm run build` localmente)

## 📝 Configuración Actual

### Archivos de Configuración

- **`vercel.json`**: Configuración de Vercel (rewrites, headers, cache)
- **`vite.config.ts`**: Configuración de Vite (build, alias, optimizaciones)
- **`package.json`**: Scripts y dependencias

### Estructura de Build

- **Directorio de salida**: `dist/`
- **Comando de build**: `npm run build`
- **Framework**: Vite + React

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación después del despliegue inicial:

1. Haz cambios en tu código local
2. Haz commit y push a tu repositorio
3. Vercel detectará automáticamente los cambios y desplegará una nueva versión
4. O manualmente: `vercel --prod`

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite para Producción](https://vitejs.dev/guide/build.html)
- [Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)

## ✅ Checklist de Despliegue

- [ ] Código en repositorio Git
- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend API desplegado y accesible
- [ ] CORS configurado en el backend
- [ ] Build local funciona (`npm run build`)
- [ ] Proyecto desplegado en Vercel
- [ ] URL de producción verificada
- [ ] Funcionalidades principales probadas
- [ ] Variables de entorno funcionando correctamente

---

**¿Necesitas ayuda?** Revisa los logs de despliegue en el dashboard de Vercel o consulta la documentación oficial.

