# 📚 Documentación Frontend - Movilis Certificados

## Resumen del Proyecto

**Movilis Certificados** es una aplicación web que permite a los usuarios consultar y descargar sus certificados digitales (laborales, de ingresos, capacitación, etc.) mediante autenticación con número de cédula.

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.2.0 | Framework UI |
| TypeScript | 5.2.2 | Tipado estático |
| Vite | 5.0.0 | Bundler y dev server |
| React Router DOM | 6.20.0 | Navegación SPA |
| Formik | 2.4.9 | Manejo de formularios |
| Yup | 1.7.1 | Validación de formularios |
| Lucide React | 0.294.0 | Iconos |
| pdf-lib | 1.17.1 | Generación de PDFs |
| date-fns | 2.30.0 | Formateo de fechas |

---

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   └── images/             # Logos e imágenes (logo movilis.png, movilis.png)
├── components/
│   ├── layout/             
│   │   ├── Header/         # Componente Header con logo y navegación
│   │   └── MainLayout/      # Layout principal que envuelve las páginas
│   └── ui/                 
│       ├── Badge/          # Badge para estados y tipos
│       ├── Button/         # Botón reutilizable
│       ├── Card/           # Tarjeta contenedora
│       ├── Input/          # Input de formulario
│       └── Spinner/        # Indicador de carga
├── config/                 
│   └── constants.ts        # Constantes: API_CONFIG, ROUTES, MESSAGES, CERTIFICADO_CONFIG
├── features/
│   ├── auth/               
│   │   ├── components/     
│   │   │   └── LoginForm/  # Formulario de login con validación
│   │   ├── context/        
│   │   │   └── AuthContext.tsx  # Contexto de autenticación (user, login, logout)
│   │   ├── hooks/          
│   │   │   └── useAuth.ts  # Hook para acceder al contexto de auth
│   │   └── services/       
│   │       └── authService.ts  # Servicio de autenticación (login, logout, verifyToken)
│   └── certificados/       
│       ├── components/     
│       │   ├── CertificadoCard/  # Tarjeta individual de certificado
│       │   └── CertificadosList/ # Lista de certificados con filtros
│       ├── hooks/          
│       │   └── useCertificados.ts  # Hook para gestionar certificados
│       ├── services/       
│       │   └── certificadosService.ts  # Servicio de certificados (get, download, verify)
│       ├── templates/      
│       │   └── certificado.pdf  # Plantilla base para PDFs
│       └── utils/          
│           └── pdfGenerator.ts  # Generador de PDFs usando pdf-lib
├── pages/                  
│   ├── LoginPage/          # Página de login
│   └── DashboardPage/      # Página principal con lista de certificados
├── styles/                 
│   └── globals.css         # Estilos globales de la aplicación
├── types/                  
│   └── index.ts            # Tipos TypeScript: User, Certificado, AuthResponse, etc.
└── utils/                  
    └── helpers.ts          # Funciones utilitarias (delay, formatters, etc.)
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login
1. Usuario ingresa su **número de cédula** (10-12 dígitos, solo números)
2. Frontend valida el formato de la cédula (Yup schema: mínimo 10, máximo 12 caracteres)
3. Frontend limpia la cédula (elimina puntos, espacios, guiones) antes de enviarla
4. Se envía petición `POST /auth/login` al backend con la cédula limpia
5. Backend consulta el Registro Civil de Ecuador y retorna datos del usuario
6. Backend genera un token JWT que incluye la cédula del usuario en el payload
7. Frontend almacena **solo el objeto `user`** en `localStorage` (key: `movilis_user`)
8. **El token NO se almacena en localStorage** actualmente (se debe implementar almacenamiento en memoria o sessionStorage)
9. Frontend redirige automáticamente a `/dashboard`

**⚠️ Estado Actual:** El frontend está en **modo demo** (`demoMode: true` en `authService.ts`). Para producción, cambiar a `demoMode: false` y configurar `VITE_API_URL`.

**🔧 Implementación del Token en Producción:**
- El frontend recibirá el token en la respuesta de login (`POST /auth/login`)
- El token se almacenará en `sessionStorage` con la key `movilis_token` (implementación pendiente)
- El token se incluirá en el header `Authorization: Bearer <token>` en todas las peticiones autenticadas
- Si el token expira o es inválido (401), el frontend redirigirá automáticamente al login
- **Nota:** Actualmente en modo demo, el token se genera como `token_${Date.now()}` pero no se almacena ni se usa en requests

**📝 Nota Importante sobre el Endpoint de Login:**
- El endpoint correcto es `POST /auth/login` (según `API_CONFIG.ENDPOINTS.AUTH.LOGIN`)
- El frontend enviará la cédula en el body: `{ "cedula": "1234567890" }`
- El backend debe retornar el formato `AuthResponse` con `success`, `user`, `token` y `message`

### Datos de Usuario que se esperan del Backend

```typescript
interface User {
  cedula: string;           // Número de cédula del usuario
  nombreCompleto: string;   // Nombre completo formateado
  primerNombre: string;     // Primer nombre
  segundoNombre?: string;   // Segundo nombre (opcional)
  primerApellido: string;   // Primer apellido
  segundoApellido?: string; // Segundo apellido (opcional)
  email?: string;           // Email del usuario (opcional)
  telefono?: string;        // Teléfono del usuario (opcional)
}
```

---

## 📄 Sistema de Certificados

### Tipos de Certificado

| Tipo | Descripción | Icono |
|------|-------------|-------|
| `laboral` | Certificado de vinculación laboral | Maletín |
| `ingresos` | Certificado de ingresos y retenciones | Dólar |
| `capacitacion` | Certificado de cursos completados | Gorro de graduación |
| `participacion` | Certificado de eventos/congresos | Premio |
| `competencia` | Certificación de competencias | Trofeo |
| `otro` | Otros certificados | Documento |

### Estados de Certificado

| Estado | Descripción | Color |
|--------|-------------|-------|
| `vigente` | Certificado válido y activo | Verde (#10B981) |
| `vencido` | Certificado expirado | Rojo (#EF4444) |
| `revocado` | Certificado anulado | Gris (#6B7280) |
| `pendiente` | En proceso de emisión | Amarillo (#F59E0B) |

### Modelo de Certificado

```typescript
interface Certificado {
  id: string;                    // ID único del certificado
  tipo: CertificadoTipo;         // Tipo de certificado
  titulo: string;                // Título del certificado
  descripcion?: string;          // Descripción detallada
  fechaEmision: string;          // Fecha de emisión (ISO 8601: YYYY-MM-DD)
  fechaVencimiento?: string;     // Fecha de vencimiento (ISO 8601: YYYY-MM-DD)
  estado: CertificadoEstado;     // Estado actual
  entidadEmisora: string;        // Entidad que emitió el certificado
  codigoVerificacion: string;    // Código único de verificación
  urlDescarga?: string;          // URL de descarga (opcional)
  firmado: boolean;              // Si tiene firma electrónica
  metadata?: Record<string, unknown>; // Datos adicionales (JSON)
}
```

### Tipos TypeScript Completos

```typescript
// Tipos de Certificado
type CertificadoTipo = 
  | 'laboral' 
  | 'ingresos' 
  | 'capacitacion' 
  | 'participacion' 
  | 'competencia'
  | 'otro';

type CertificadoEstado = 'vigente' | 'vencido' | 'revocado' | 'pendiente';

// Respuestas de API
interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface CertificadosResponse {
  success: boolean;
  certificados: Certificado[];
  total: number;
  message?: string;
}

// Estados de carga
interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
```

---

## 🌐 APIs Requeridas del Backend

### Variables de Entorno

El frontend espera estas variables de entorno (archivo `.env` en la raíz del proyecto):

```env
# URL base del backend API (REQUERIDO para producción)
VITE_API_URL=https://tu-api.com/api

# API Key (OPCIONAL - solo si el backend lo requiere)
VITE_API_KEY=tu-api-key
```

**Nota Importante:**
- Las variables de entorno en Vite deben comenzar con `VITE_` para ser accesibles en el código
- El frontend usa `import.meta.env.VITE_API_URL` para acceder a estas variables
- Si `VITE_API_URL` no está definida, el frontend usará `http://localhost:3001/api` como valor por defecto
- El frontend está configurado para usar `API_CONFIG.BASE_URL` que se obtiene de `import.meta.env.VITE_API_URL`

---

## 📡 Endpoints Requeridos

### 1. Autenticación

#### `POST /auth/login`

Inicia sesión consultando la cédula en el Registro Civil de Ecuador.

**URL:** `{VITE_API_URL}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "cedula": "1234567890"
}
```

**Nota:** El frontend limpia la cédula antes de enviarla (elimina puntos, espacios, guiones). El backend debe aceptar cédulas con o sin formato.

**Response Exitosa (200 OK):**
```json
{
  "success": true,
  "user": {
    "cedula": "1234567890",
    "nombreCompleto": "Juan Carlos Pérez Rodríguez",
    "primerNombre": "Juan",
    "segundoNombre": "Carlos",
    "primerApellido": "Pérez",
    "segundoApellido": "Rodríguez",
    "email": "juan.perez@email.com",
    "telefono": "+593 99 123 4567"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjZWR1bGEiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzM0NTY3ODkwfQ...",
  "message": "Inicio de sesión exitoso"
}
```

**Requisitos del Token JWT:**
- El token debe ser un JWT válido
- El payload del token **DEBE incluir** al menos el campo `cedula` para identificar al usuario
- Ejemplo de payload mínimo: `{ "cedula": "1234567890", "iat": 1734567890, "exp": 1734654290 }`
- Tiempo de expiración recomendado: 24 horas (configurable)

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Cédula inválida"
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Cédula no encontrada"
}
```

**Response Error (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Error al consultar el Registro Civil"
}
```

**Comportamiento del Frontend:**
- Si `success: true`, el frontend almacena `user` en `localStorage` (key: `movilis_user`)
- El token se recibe y se almacenará en `sessionStorage` o en memoria (implementación pendiente)
- El frontend redirige automáticamente a `/dashboard`
- Si `success: false`, muestra el mensaje de error en el formulario

**Implementación de Petición HTTP (Producción):**
```typescript
// El frontend hará una petición POST así (ubicado en src/features/auth/services/authService.ts):
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const cleanedCedula = cedula.replace(/[.\s]/g, ''); // Limpia puntos y espacios

const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Si se requiere API Key (opcional):
    // 'X-API-Key': import.meta.env.VITE_API_KEY || '',
  },
  body: JSON.stringify({ cedula: cleanedCedula }),
});

// Manejo de errores HTTP:
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ 
    message: 'Error al iniciar sesión' 
  }));
  throw new Error(errorData.message || 'Error al iniciar sesión');
}

const data: AuthResponse = await response.json();

// Validación de respuesta:
if (!data.success || !data.user || !data.token) {
  throw new Error(data.message || 'Error al iniciar sesión');
}

// El frontend almacenará:
// - user en localStorage: localStorage.setItem('movilis_user', JSON.stringify(data.user))
// - token en sessionStorage: sessionStorage.setItem('movilis_token', data.token)

// Retornar respuesta:
return {
  success: true,
  user: data.user,
  token: data.token,
  message: data.message || 'Inicio de sesión exitoso'
};
```

**⚠️ Códigos HTTP y Manejo de Errores:**
- `200 OK`: Login exitoso → Retornar `{ success: true, user: {...}, token: "..." }`
- `400 Bad Request`: Cédula inválida → Retornar `{ success: false, message: "Cédula inválida" }`
- `404 Not Found`: Cédula no encontrada → Retornar `{ success: false, message: "Cédula no encontrada" }`
- `401 Unauthorized`: No autorizado → Retornar `{ success: false, message: "No autorizado" }`
- `500 Internal Server Error`: Error del servidor → Retornar `{ success: false, message: "Error del servidor" }`
- `Network Error`: Error de conexión → El frontend mostrará "Error de conexión. Verifica tu conexión a internet."

---

#### `POST /auth/logout`

Cierra la sesión actual e invalida el token en el servidor.

**URL:** `{VITE_API_URL}/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (vacío o puede incluir token para invalidar)

**Response Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

**Nota:** Este endpoint es **opcional**. El frontend puede funcionar sin él, ya que limpia `localStorage` localmente. Sin embargo, es recomendable implementarlo para invalidar tokens en el servidor.

---

#### `GET /auth/verify`

Verifica si el token actual es válido.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "valid": true
}
```

---

### 2. Certificados

#### `GET /certificados`

Obtiene todos los certificados del usuario autenticado. El backend debe identificar al usuario mediante el token JWT.

**URL:** `{VITE_API_URL}/certificados`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters (opcionales):**
- `tipo`: Filtrar por tipo de certificado (`laboral`, `ingresos`, `capacitacion`, `participacion`, `competencia`, `otro`)
- `estado`: Filtrar por estado (`vigente`, `vencido`, `revocado`, `pendiente`)

**Ejemplo de Request:**
```
GET /certificados?tipo=laboral&estado=vigente
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Identificación del Usuario:**
1. El backend debe extraer el token del header `Authorization`
2. Validar y decodificar el token JWT
3. Obtener la `cedula` del payload del token
4. Buscar los certificados asociados a esa cédula en la base de datos
5. **NO es necesario** que el frontend envíe la cédula en el body o query params

**Response Exitosa (200):**
```json
{
  "success": true,
  "certificados": [
    {
      "id": "cert-001",
      "tipo": "laboral",
      "titulo": "Certificado Laboral",
      "descripcion": "Certifica la vinculación laboral con la empresa desde el 15 de enero de 2020.",
      "fechaEmision": "2024-01-15",
      "fechaVencimiento": "2025-01-15",
      "estado": "vigente",
      "entidadEmisora": "Movilis S.A.S",
      "codigoVerificacion": "MOV-2024-001-XYZ",
      "urlDescarga": null,
      "firmado": true,
      "metadata": null
    },
    {
      "id": "cert-002",
      "tipo": "ingresos",
      "titulo": "Certificado de Ingresos y Retenciones",
      "descripcion": "Certificado de ingresos y retenciones del año fiscal 2023.",
      "fechaEmision": "2024-02-28",
      "fechaVencimiento": null,
      "estado": "vigente",
      "entidadEmisora": "Movilis S.A.S",
      "codigoVerificacion": "MOV-2024-002-ABC",
      "urlDescarga": null,
      "firmado": true,
      "metadata": null
    }
  ],
  "total": 2,
  "message": null
}
```

**Response Error (401 - No autenticado):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

**Response Error (404 - Sin certificados):**
```json
{
  "success": true,
  "certificados": [],
  "total": 0,
  "message": null
}
```

**Comportamiento del Frontend:**
- El frontend obtiene la cédula del usuario desde `localStorage.getItem('movilis_user')` solo para uso interno
- El frontend **NO envía la cédula** en el body o query params de este endpoint
- El frontend **SÍ envía el token** en el header `Authorization: Bearer <token>`
- El backend debe extraer la cédula del payload del token JWT para identificar al usuario
- Si el token es inválido o expirado, el backend debe retornar 401
- El frontend manejará el 401 limpiando `localStorage` y `sessionStorage` y redirigiendo a `/login`

**Implementación de Petición HTTP (Producción):**
```typescript
// El frontend hará una petición GET así (ubicado en src/features/certificados/services/certificadosService.ts):
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const token = sessionStorage.getItem('movilis_token');

// Construir query params (opcionales)
const queryParams = new URLSearchParams();
if (tipo) queryParams.append('tipo', tipo);
if (estado) queryParams.append('estado', estado);
const queryString = queryParams.toString();
const url = `${API_URL}/certificados${queryString ? `?${queryString}` : ''}`;

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

// Si el token es inválido (401), el frontend redirigirá al login
if (response.status === 401) {
  localStorage.removeItem('movilis_user');
  sessionStorage.removeItem('movilis_token');
  // El AuthContext manejará la redirección automáticamente
  window.location.href = '/login';
  throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
}

if (!response.ok) {
  const errorData = await response.json().catch(() => ({ 
    message: 'Error al cargar certificados' 
  }));
  throw new Error(errorData.message || 'Error al cargar certificados');
}

const data: CertificadosResponse = await response.json();

// Validación de respuesta:
if (!data.success) {
  throw new Error(data.message || 'Error al cargar certificados');
}

// Retornar respuesta:
return {
  success: true,
  certificados: data.certificados || [],
  total: data.total || 0,
  message: data.message
};
```

**⚠️ Códigos HTTP y Manejo de Errores:**
- `200 OK`: Certificados obtenidos → Retornar `{ success: true, certificados: [...], total: N }`
- `401 Unauthorized`: Token inválido/expirado → Frontend redirige a login automáticamente
- `404 Not Found`: Sin certificados → Retornar `{ success: true, certificados: [], total: 0 }` (no es error)
- `500 Internal Server Error`: Error del servidor → Retornar `{ success: false, message: "Error del servidor" }`

**Nota Importante:** 
- El frontend almacenará el token en `sessionStorage` con la key `movilis_token` cuando se implemente la integración completa
- Para requests autenticados, el frontend incluirá el token en el header `Authorization: Bearer <token>`
- Si el token no está disponible o es inválido (401), el frontend redirigirá automáticamente al login
- El backend **NO debe esperar** que el frontend envíe la cédula en el body o query params de requests autenticados
- El backend debe extraer la cédula del payload del token JWT para identificar al usuario

---

#### `GET /certificados/:id`

Obtiene un certificado específico por su ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "certificado": {
    "id": "cert-001",
    "tipo": "laboral",
    "titulo": "Certificado Laboral",
    "descripcion": "Certifica la vinculación laboral...",
    "fechaEmision": "2024-01-15",
    "fechaVencimiento": "2025-01-15",
    "estado": "vigente",
    "entidadEmisora": "Movilis S.A.S",
    "codigoVerificacion": "MOV-2024-001-XYZ",
    "firmado": true,
    "metadata": {
      "cargo": "Desarrollador Senior",
      "salario": 5000000,
      "tipoContrato": "Indefinido"
    }
  }
}
```

---

#### `GET /certificados/download/:id`

Descarga el PDF de un certificado. **Este endpoint es opcional** ya que actualmente el frontend genera los PDFs localmente.

**URL:** `{VITE_API_URL}/certificados/download/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Ejemplo de Request:**
```
GET /certificados/download/cert-001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Exitosa (200 OK):**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="Certificado_Laboral_MOV-2024-001-XYZ.pdf"`
- **Body:** Archivo PDF binario

**Formato del nombre de archivo:**
- El nombre debe ser: `{titulo}_{codigoVerificacion}.pdf`
- Ejemplo: `Certificado_Laboral_MOV-2024-001-XYZ.pdf`
- Los espacios en el título deben reemplazarse por guiones bajos o eliminarse

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Certificado no encontrado"
}
```

**Nota Importante:** 
- Actualmente el frontend genera el PDF localmente usando `pdf-lib` con una plantilla base
- Si el backend puede generar PDFs con firma electrónica real, sería **altamente recomendable** usar este endpoint
- El frontend puede adaptarse para usar este endpoint si está disponible
- El PDF generado por el backend debe incluir:
  - Datos del usuario (nombre completo, cédula)
  - Datos del certificado (título, descripción, fechas)
  - Código de verificación
  - Firma electrónica (si aplica)
  - Logo de la entidad emisora (opcional)

**Implementación de Petición HTTP (Producción):**
```typescript
// El frontend hará una petición GET así (ubicado en src/features/certificados/services/certificadosService.ts):
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const token = sessionStorage.getItem('movilis_token');

const response = await fetch(`${API_URL}/certificados/download/${certificadoId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// Si el token es inválido (401), el frontend redirigirá al login
if (response.status === 401) {
  localStorage.removeItem('movilis_user');
  sessionStorage.removeItem('movilis_token');
  window.location.href = '/login';
  throw new Error('Sesión expirada');
}

if (!response.ok) {
  throw new Error('Error al descargar el certificado');
}

// Obtener el blob del PDF
const blob = await response.blob();

// Crear URL temporal y descargar
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `${certificado.titulo.replace(/\s+/g, '_')}_${certificado.codigoVerificacion}.pdf`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);
```

---

#### `GET /certificados/verify/:codigo`

Verifica la autenticidad de un certificado usando su código de verificación.

**Request (público, no requiere auth):**
```
GET /certificados/verify/MOV-2024-001-XYZ
```

**Response (200):**
```json
{
  "success": true,
  "valid": true,
  "certificado": {
    "titulo": "Certificado Laboral",
    "titular": "Juan Carlos Pérez Rodríguez",
    "fechaEmision": "2024-01-15",
    "entidadEmisora": "Movilis S.A.S",
    "estado": "vigente"
  }
}
```

---

### 3. Usuarios (Opcional)

#### `GET /users/profile`

Obtiene el perfil completo del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "cedula": "1234567890",
    "nombreCompleto": "Juan Carlos Pérez Rodríguez",
    "primerNombre": "Juan",
    "segundoNombre": "Carlos",
    "primerApellido": "Pérez",
    "segundoApellido": "Rodríguez",
    "email": "juan.perez@email.com",
    "telefono": "+57 300 123 4567"
  }
}
```

---

## 🔄 Flujos de Usuario y Estados de la Aplicación

### Estados de la Aplicación

**Estado de Autenticación:**
- `user: null` → Usuario no autenticado (redirige a `/login`)
- `user: User` → Usuario autenticado (acceso a `/dashboard`)
- `isLoading: boolean` → Estado de carga durante operaciones
- `error: string | null` → Mensajes de error

**Estado de Certificados:**
- `certificados: Certificado[]` → Lista de certificados del usuario
- `isLoading: boolean` → Cargando certificados
- `downloadingId: string | null` → ID del certificado siendo descargado
- `error: string | null` → Errores al cargar/descargar

### Flujo 1: Login con Cédula

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│   Frontend  │────▶│   Backend   │────▶│  Registro   │
│   ingresa   │     │   valida    │     │  consulta   │     │   Civil     │
│   cédula    │     │   formato   │     │   cédula    │     │   Ecuador   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           │                   ▼
                           │           ┌─────────────┐
                           │           │  Responde   │
                           │           │  con datos  │
                           │           │  del usuario│
                           │           └─────────────┘
                           │                   │
                           ▼                   │
                    ┌─────────────┐            │
                    │  Guarda en  │◀───────────┘
                    │ localStorage│
                    │  + navega   │
                    └─────────────┘
```

### Flujo 2: Carga de Certificados

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │     │   Frontend  │────▶│   Backend   │
│  accede a   │────▶│  obtiene    │     │  valida     │
│  Dashboard  │     │  cédula de  │     │  token JWT  │
└─────────────┘     │  localStorage│     │  y retorna  │
                    └─────────────┘     │  certificados│
                           │            └─────────────┘
                           │                   │
                           │                   ▼
                           │           ┌─────────────┐
                           │           │  Retorna    │
                           │           │  array de   │
                           │           │  certificados│
                           │           └─────────────┘
                           │                   │
                           ▼                   │
                    ┌─────────────┐            │
                    │  Muestra    │◀───────────┘
                    │  lista de   │
                    │  certificados│
                    └─────────────┘
```

### Flujo 3: Descarga de Certificado

**Opción A: Frontend genera PDF (Actual)**
```
┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│   Frontend  │
│   click en  │     │   genera    │
│  "Descargar"│     │   PDF con   │
└─────────────┘     │   pdf-lib   │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Descarga   │
                    │  automática │
                    │  del PDF    │
                    └─────────────┘
```

**Opción B: Backend genera PDF (Recomendado)**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│   Frontend  │────▶│   Backend   │
│   click en  │     │   solicita  │     │   genera    │
│  "Descargar"│     │   PDF       │     │   PDF con   │
└─────────────┘     └─────────────┘     │   firma     │
                           │            └─────────────┘
                           │                   │
                           │                   ▼
                           │           ┌─────────────┐
                           │           │  Retorna    │
                           │           │  archivo    │
                           │           │  PDF        │
                           │           └─────────────┘
                           │                   │
                           ▼                   │
                    ┌─────────────┐            │
                    │  Descarga   │◀───────────┘
                    │  automática │
                    │  del PDF    │
                    └─────────────┘
```

---

## 🖼 Páginas de la Aplicación

### 1. LoginPage (`/login`)

**Descripción:** Página de inicio de sesión con formulario de cédula.

**Funcionalidades:**
- Validación en tiempo real (solo números, 10-12 dígitos)
- Indicador de carga durante autenticación
- Mensajes de error claros
- Redirección automática al Dashboard si login exitoso

---

### 2. DashboardPage (`/dashboard`)

**Descripción:** Página principal con lista de certificados del usuario.

**Funcionalidades:**
- Muestra saludo personalizado con nombre del usuario
- Lista de certificados con filtros
- Tarjetas con información detallada de cada certificado
- Botón de descarga PDF por certificado
- Indicador de estado (vigente, vencido, etc.)
- Botón de cerrar sesión

---

## 📋 Rutas de la Aplicación

| Ruta | Componente | Autenticación | Descripción |
|------|------------|---------------|-------------|
| `/` | Redirect a `/login` | No | Redirección automática |
| `/login` | LoginPage | No | Página de inicio de sesión |
| `/dashboard` | DashboardPage | Sí | Dashboard principal con lista de certificados |
| `*` (cualquier otra) | Redirect a `/login` | No | Rutas no definidas redirigen a login |

### Protección de Rutas

- Las rutas protegidas verifican si existe `user` en `localStorage`
- Si no hay usuario autenticado, se redirige automáticamente a `/login`
- El componente `DashboardPage` verifica `isAuthenticated` y redirige si es necesario

---

## 🔒 Manejo de Sesión

### Almacenamiento Local

**Datos Almacenados:**
- **Key:** `movilis_user` en `localStorage`
- **Contenido:** Objeto JSON con los datos del usuario (`User`)
- **Formato:** `JSON.stringify(user)`
- **Persistencia:** La sesión se mantiene al recargar la página
- **Verificación:** Al cargar la app, el `AuthContext` verifica si existe `movilis_user` en `localStorage` y restaura la sesión automáticamente
- **Ubicación del código:** `src/features/auth/context/AuthContext.tsx` (líneas 27-36)

**Ejemplo de datos almacenados:**
```json
{
  "cedula": "1234567890",
  "nombreCompleto": "Juan Carlos Pérez Rodríguez",
  "primerNombre": "Juan",
  "segundoNombre": "Carlos",
  "primerApellido": "Pérez",
  "segundoApellido": "Rodríguez",
  "email": "juan.perez@email.com",
  "telefono": "+593 99 123 4567"
}
```

### Token de Autenticación

**Almacenamiento del Token:**
- El token se recibe en la respuesta de `POST /auth/login` en el campo `token`
- **Estado Actual (Modo Demo):** El token se genera como `token_${Date.now()}` pero **NO se almacena** ni se usa en requests
- **Implementación en Producción:** El token se almacenará en `sessionStorage` con la key `movilis_token`
- **Ubicación del código:** `src/features/auth/services/authService.ts` (línea 126)
- **Implementación pendiente:** Almacenar token en `sessionStorage` y usarlo en headers de requests autenticados

**Código de Implementación del Token (Pendiente):**
```typescript
// En src/features/auth/services/authService.ts - función login():
if (response.success && response.user && response.token) {
  // Almacenar usuario en localStorage
  localStorage.setItem('movilis_user', JSON.stringify(response.user));
  
  // Almacenar token en sessionStorage
  sessionStorage.setItem('movilis_token', response.token);
  
  return {
    success: true,
    user: response.user,
    token: response.token,
    message: response.message || 'Inicio de sesión exitoso'
  };
}

// En src/features/certificados/services/certificadosService.ts - función getCertificados():
const token = sessionStorage.getItem('movilis_token');
if (!token) {
  throw new Error('No hay token de autenticación');
}

const response = await fetch(`${API_URL}/certificados`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});
```

**Uso del Token:**
- El token debe enviarse en el header `Authorization: Bearer <token>` en todas las peticiones autenticadas
- El formato del header es: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- El backend debe validar el token en cada request protegido

**Expiración:**
- El backend debe manejar la expiración del token y retornar 401 cuando expire
- Tiempo de expiración recomendado: 24 horas (configurable)
- Si el token expira, el frontend debe redirigir al login

**Validación:**
- El frontend puede usar el endpoint `GET /auth/verify` para validar el token antes de hacer requests
- Si el token es inválido, el frontend debe limpiar `localStorage` y redirigir al login

### Cierre de Sesión

**Proceso de Logout:**
1. Frontend limpia `localStorage.removeItem('movilis_user')`
2. Frontend elimina el token de `sessionStorage.removeItem('movilis_token')` (cuando se implemente)
3. Frontend puede llamar opcionalmente a `POST /auth/logout` para invalidar el token en el servidor
4. Frontend redirige automáticamente a `/login`
5. **Ubicación del código:** `src/features/auth/context/AuthContext.tsx` (función `logout`, líneas 62-65)

**Implementación actual:**
```typescript
// En src/features/auth/context/AuthContext.tsx
const logout = useCallback(() => {
  setUser(null);
  localStorage.removeItem('movilis_user');
  // TODO: sessionStorage.removeItem('movilis_token');
  // TODO: Llamar a POST /auth/logout si está disponible
}, []);
```

**Implementación en Producción (Pendiente):**
```typescript
// En src/features/auth/context/AuthContext.tsx
const logout = useCallback(async () => {
  const token = sessionStorage.getItem('movilis_token');
  
  // Opcional: Llamar al endpoint de logout del backend
  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Ignorar errores de logout en el servidor
      console.error('Error al cerrar sesión en el servidor:', error);
    }
  }
  
  // Limpiar datos locales
  setUser(null);
  localStorage.removeItem('movilis_user');
  sessionStorage.removeItem('movilis_token');
}, []);
```

**Recomendación:**
- Es recomendable que el backend invalide el token en el servidor al hacer logout
- Esto previene el uso de tokens robados después del logout

---

## ⚠️ Validaciones del Frontend

### Validación de Cédula

**Reglas de Validación (Yup Schema):**
- Solo números (0-9) - se filtran automáticamente caracteres no numéricos en el input
- Mínimo 10 caracteres (validación en el formulario)
- Máximo 12 caracteres
- Campo requerido
- Validación en tiempo real (onChange y onBlur)
- Patrón regex: `/^[0-9]+$/`
- El frontend limpia automáticamente la cédula antes de enviarla (elimina puntos, espacios, guiones)

**Código de Validación (LoginForm.tsx):**
```typescript
// Esquema de validación Yup
const validationSchema = Yup.object({
  cedula: Yup.string()
    .matches(/^[0-9]*$/, 'Solo se permiten números')
    .min(10, 'La cédula debe tener mínimo 10 caracteres')
    .max(12, 'La cédula no puede tener más de 12 caracteres')
    .required('La cédula es requerida'),
});

// Filtrado de caracteres no numéricos en tiempo real
const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
  formik.setFieldValue('cedula', value);
};

// Limpieza antes de enviar (en authService.ts)
const cleanedCedula = cedula.replace(/[.\s]/g, ''); // Elimina puntos y espacios
```

**Nota Importante:** El backend debe aceptar cédulas con o sin formato (con puntos, espacios, guiones), ya que el frontend las limpia antes de enviarlas. Sin embargo, es recomendable que el backend también valide y limpie la cédula recibida.

**Mensajes de Error del Formulario:**

| Validación | Mensaje |
|------------|---------|
| Campo vacío | "La cédula es requerida" |
| Contiene letras/símbolos | "Solo se permiten números" |
| Menos de 10 caracteres | "La cédula debe tener mínimo 10 caracteres" |
| Más de 12 caracteres | "La cédula no puede tener más de 12 caracteres" |

**Comportamiento del Input:**
- El input filtra automáticamente caracteres no numéricos mientras el usuario escribe
- Solo acepta números (0-9)
- Máximo 12 caracteres
- `inputMode="numeric"` para mostrar teclado numérico en móviles

**Mensajes de Error del Backend:**

| Código HTTP | Mensaje Esperado | Acción del Frontend |
|-------------|------------------|---------------------|
| 200 | `{ "success": false, "message": "..." }` | Muestra mensaje de error en el formulario |
| 400 | `{ "success": false, "message": "Cédula inválida" }` | Muestra mensaje de error en el formulario |
| 404 | `{ "success": false, "message": "Cédula no encontrada" }` | Muestra mensaje de error en el formulario |
| 401 | `{ "success": false, "message": "No autorizado" }` | Muestra mensaje de error en el formulario |
| 500 | `{ "success": false, "message": "Error del servidor" }` | Muestra mensaje genérico de error |
| Network Error | (excepción de red) | Muestra mensaje "Error de conexión. Verifica tu conexión a internet." |

**Manejo de Errores en el Frontend:**
- Todos los errores se muestran en el formulario de login
- Los mensajes de error se obtienen del campo `message` de la respuesta
- Si no hay `message`, se muestra un mensaje genérico: "Error al iniciar sesión. Verifica tu cédula."
- Los errores de red (timeout, CORS, etc.) se capturan y se muestran como "Error de conexión"

### Validación de Certificados

- El frontend valida que los certificados tengan todos los campos requeridos
- Si falta algún campo requerido, se muestra un error genérico
- Los estados y tipos deben coincidir con los valores ENUM definidos

---

## 📊 Resumen de APIs Necesarias

### Prioridad Alta (Necesarias para funcionamiento básico)

| Método | Endpoint | Descripción | Estado Actual | Autenticación |
|--------|----------|-------------|---------------|---------------|
| `POST` | `/auth/login` | Login con cédula | ✅ **REQUERIDO** | No |
| `GET` | `/certificados` | Lista de certificados del usuario | ✅ **REQUERIDO** | Sí (JWT) |

**Nota:** Estos dos endpoints son **absolutamente necesarios** para que la aplicación funcione.

**Requisitos Mínimos:**
1. `POST /auth/login` debe:
   - Recibir cédula en el body
   - Consultar Registro Civil de Ecuador
   - Retornar datos del usuario en formato `User`
   - Generar token JWT con `cedula` en el payload
   - Retornar token en la respuesta

2. `GET /certificados` debe:
   - Validar token JWT del header `Authorization`
   - Extraer `cedula` del payload del token
   - Retornar array de certificados del usuario
   - Retornar formato `CertificadosResponse`

### Prioridad Media (Funcionalidades adicionales)

| Método | Endpoint | Descripción | Estado Actual |
|--------|----------|-------------|---------------|
| `GET` | `/certificados/download/:id` | Descarga PDF (si backend genera) | ⚠️ Opcional (frontend genera PDFs localmente) |
| `POST` | `/auth/logout` | Cerrar sesión | ⚠️ Opcional (frontend limpia localStorage) |
| `GET` | `/auth/verify` | Verificar token válido | ⚠️ Opcional (no implementado en frontend aún) |

### Prioridad Baja (Futuro)

| Método | Endpoint | Descripción | Estado Actual |
|--------|----------|-------------|---------------|
| `GET` | `/certificados/:id` | Detalle de certificado | 🔵 No implementado |
| `GET` | `/certificados/verify/:codigo` | Verificar autenticidad (público) | 🔵 No implementado |
| `GET` | `/users/profile` | Perfil de usuario | 🔵 No implementado |

### Implementación Actual vs Backend

**Endpoints que el Frontend Llama Actualmente:**
- `POST /auth/login` - ✅ Implementado (modo demo activo)
- `GET /certificados` - ✅ Implementado (modo demo activo)

**Endpoints que el Frontend Puede Usar (si están disponibles):**
- `GET /certificados/download/:id` - El frontend puede adaptarse para usar este endpoint
- `POST /auth/logout` - El frontend puede llamar este endpoint al cerrar sesión

**Configuración de API:**
- El frontend usa `VITE_API_URL` para la URL base del backend
- El frontend usa `VITE_API_KEY` si se requiere autenticación de API (opcional)
- Actualmente está en modo demo (`demoMode: true` en `authService.ts`)
- Para producción, cambiar `demoMode: false` en `src/features/auth/services/authService.ts`

**Endpoints Configurados en el Frontend:**
```typescript
// src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 segundos
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
    },
    CERTIFICADOS: {
      LIST: '/certificados',
      DOWNLOAD: '/certificados/download',
      VERIFY: '/certificados/verify',
    },
    USERS: {
      PROFILE: '/users/profile',
    },
  },
};
```

**URLs Completas que el Frontend Construirá:**
- Login: `{VITE_API_URL}/auth/login` → Ejemplo: `https://api.movilis.com/api/auth/login`
- Certificados: `{VITE_API_URL}/certificados` → Ejemplo: `https://api.movilis.com/api/certificados`
- Descarga: `{VITE_API_URL}/certificados/download/:id` → Ejemplo: `https://api.movilis.com/api/certificados/download/cert-001`
- Verificación de certificado: `{VITE_API_URL}/certificados/verify/:codigo` → Ejemplo: `https://api.movilis.com/api/certificados/verify/MOV-2024-001-XYZ`
- Perfil de usuario: `{VITE_API_URL}/users/profile` → Ejemplo: `https://api.movilis.com/api/users/profile`
- Verificar token: `{VITE_API_URL}/auth/verify` → Ejemplo: `https://api.movilis.com/api/auth/verify`
- Logout: `{VITE_API_URL}/auth/logout` → Ejemplo: `https://api.movilis.com/api/auth/logout`


---

## 📝 Notas Importantes para el Backend

### ⚠️ Resumen Ejecutivo para el Backend

**Endpoints Críticos (Prioridad Alta - REQUERIDOS):**
1. `POST /auth/login` - **OBLIGATORIO** - Login con cédula, retorna usuario y token JWT
2. `GET /certificados` - **OBLIGATORIO** - Lista de certificados del usuario autenticado

**Requisitos Mínimos:**
- El backend debe consultar el Registro Civil de Ecuador para validar cédulas
- El token JWT debe incluir `cedula` en el payload
- El backend debe extraer la cédula del token para identificar al usuario en endpoints protegidos
- Todas las respuestas deben seguir el formato especificado en esta documentación
- CORS debe estar configurado para permitir requests desde el dominio del frontend

**Formato de Respuestas:**
- Todas las respuestas exitosas: `{ success: true, data: {...} }`
- Todas las respuestas de error: `{ success: false, message: "..." }`
- Códigos HTTP: 200 (éxito), 400 (bad request), 401 (no autorizado), 404 (no encontrado), 500 (error servidor)

---

### 1. Consulta al Registro Civil de Ecuador

El endpoint `POST /auth/login` debe:

**Proceso:**
1. Recibir la cédula en el body: `{ "cedula": "1234567890" }`
2. Validar que la cédula tenga formato correcto (solo números, 6-12 dígitos)
3. Consultar el Registro Civil de Ecuador para validar la cédula
4. Si la cédula existe, obtener los datos del ciudadano:
   - Nombres (primer nombre, segundo nombre si existe)
   - Apellidos (primer apellido, segundo apellido si existe)
   - Email (si está disponible en el registro)
   - Teléfono (si está disponible en el registro)
5. Formatear el nombre completo: `{primerNombre} {segundoNombre} {primerApellido} {segundoApellido}`
6. Generar un token JWT que contenga al menos: `{ "cedula": "1234567890", "iat": timestamp, "exp": timestamp }`
7. Retornar los datos en el formato `User` especificado

**Respuestas:**
- Si la cédula existe: `200 OK` con `{ "success": true, "user": {...}, "token": "..." }`
- Si la cédula no existe: `404 Not Found` con `{ "success": false, "message": "Cédula no encontrada" }`
- Si hay error en la consulta: `500 Internal Server Error` con `{ "success": false, "message": "Error al consultar el Registro Civil" }`

**Nota sobre el Registro Civil:**
- El backend debe tener acceso a una API del Registro Civil de Ecuador
- Puede ser a través de un servicio gubernamental oficial o un proveedor de terceros
- El backend debe manejar errores de conexión y timeouts

### 2. Generación de PDFs

**Situación Actual:**
- El frontend genera PDFs localmente usando `pdf-lib` (versión 1.17.1) con una plantilla base
- Los PDFs se generan con los datos del certificado y del usuario obtenidos de `localStorage`
- No tienen firma electrónica real
- El frontend usa una plantilla PDF base ubicada en `src/features/certificados/templates/certificado.pdf`

**Proceso Actual del Frontend:**
1. Usuario hace clic en "Descargar" en un certificado
2. Frontend obtiene datos del certificado y del usuario
3. Frontend llama a `generateCertificadoPDF(certificado, user)` que:
   - Carga la plantilla PDF base
   - Rellena los campos con los datos del certificado y usuario
   - Genera el PDF usando `pdf-lib`
4. Frontend descarga el PDF con nombre: `{titulo}_{codigoVerificacion}.pdf`

**Recomendación para el Backend:**
- Si el backend puede generar PDFs con firma electrónica real, implementar `GET /certificados/download/:id`
- El frontend puede adaptarse fácilmente para usar este endpoint
- El PDF debe incluir:
  - Datos del usuario (nombre completo, cédula)
  - Datos del certificado (título, descripción, tipo, fechas)
  - Código de verificación
  - Fecha de emisión
  - Firma electrónica (si aplica)
  - Logo de la entidad emisora (opcional)
  - QR code con código de verificación (opcional, recomendado)

**Ventajas de Generación en Backend:**
- Firma electrónica real y válida
- Mayor seguridad (el PDF no se genera en el cliente)
- Consistencia en el formato
- Posibilidad de incluir elementos avanzados (QR codes, sellos, etc.)

### 3. Códigos de Verificación

- Cada certificado debe tener un código único de verificación (ej: `MOV-2024-001-XYZ`)
- El formato recomendado: `{PREFIJO}-{AÑO}-{NUMERO}-{SUFIJO}`
- Este código permite verificar la autenticidad del certificado públicamente
- El endpoint `GET /certificados/verify/:codigo` debe ser público (no requiere autenticación)

### 4. Configuración CORS

- El backend debe permitir requests desde el dominio del frontend
- Headers CORS requeridos:
  ```
  Access-Control-Allow-Origin: <dominio-frontend>
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Allow-Credentials: true (si se usan cookies)
  ```

### 5. Formato de Fechas

- **Todas las fechas** deben usar formato ISO 8601: `YYYY-MM-DD`
- Ejemplos: `"2024-01-15"`, `"2024-12-31"`
- No usar timestamps Unix ni otros formatos
- Las fechas opcionales pueden ser `null` o no incluirse en la respuesta

### 6. Estructura de Respuestas

**Formato Estándar:**
```json
{
  "success": boolean,
  "data" | "user" | "certificados" | "certificado": object | array,
  "message": string | null,
  "token"?: string,  // Solo en login
  "total"?: number   // Solo en listas
}
```

**Ejemplos:**
- Login exitoso: `{ "success": true, "user": {...}, "token": "...", "message": "..." }`
- Lista de certificados: `{ "success": true, "certificados": [...], "total": 2 }`
- Error: `{ "success": false, "message": "Error descriptivo" }`

### 7. Autenticación con JWT

**Estructura del Token:**
- El token JWT debe incluir al menos: `{ "cedula": "1234567890", "iat": timestamp, "exp": timestamp }`
- Campos adicionales opcionales: `userId`, `email`, `role`, etc.
- El token debe ser firmado con un secreto seguro

**Uso del Token:**
- El token debe enviarse en el header: `Authorization: Bearer <token>`
- El backend debe validar el token en cada request protegido
- El backend debe verificar:
  1. Firma del token (JWT signature)
  2. Expiración del token (`exp` claim)
  3. Formato válido del token

**Respuestas de Error:**
- Si el token es inválido o expirado: `401 Unauthorized` con `{ "success": false, "message": "Token inválido o expirado" }`
- Si el token no se proporciona: `401 Unauthorized` con `{ "success": false, "message": "Token no proporcionado" }`
- Si el token no tiene `cedula` en el payload: `401 Unauthorized` con `{ "success": false, "message": "Token inválido" }`

**Tiempo de Expiración:**
- Tiempo de expiración recomendado: 24 horas (configurable)
- El frontend debe manejar la expiración redirigiendo al login cuando reciba 401

**Ejemplo de Payload del Token:**
```json
{
  "cedula": "1234567890",
  "iat": 1734567890,
  "exp": 1734654290
}
```

### 8. Identificación del Usuario en Endpoints Protegidos

- En endpoints como `GET /certificados`, el backend debe:
  1. Extraer el token del header `Authorization`
  2. Validar y decodificar el token JWT
  3. Obtener la cédula del payload del token
  4. Buscar los certificados asociados a esa cédula
- **No es necesario** enviar la cédula en el body o query params de requests autenticados

### 9. Manejo de Errores

**Códigos HTTP y Respuestas:**
- `200 OK`: Operación exitosa
- `400 Bad Request`: Datos inválidos → `{ "success": false, "message": "Descripción del error" }`
- `401 Unauthorized`: Token inválido/expirado → `{ "success": false, "message": "Token inválido o expirado" }`
- `404 Not Found`: Recurso no encontrado → `{ "success": false, "message": "Cédula no encontrada" }`
- `500 Internal Server Error`: Error del servidor → `{ "success": false, "message": "Error del servidor" }`

### 10. Performance y Optimización

- El endpoint `GET /certificados` debe retornar solo los certificados del usuario autenticado
- Considerar paginación si hay muchos certificados (no implementado en frontend aún)
- Los certificados deben ordenarse por `fechaEmision DESC` (más recientes primero)
- Considerar caché de consultas al Registro Civil (evitar consultas repetidas innecesarias)
- El backend debe validar y limpiar la cédula recibida (eliminar puntos, espacios, guiones)

### 11. Formato de Respuestas Consistente

**Respuestas Consistentes:** Todas las respuestas deben seguir el formato:
   ```json
   {
     "success": boolean,
     "data" | "user" | "certificados" | "certificado": object | array,
     "message": string | null,
     "token"?: string,  // Solo en login
     "total"?: number   // Solo en listas
   }
   ```

### 12. Manejo de Errores HTTP

   - `200 OK`: Operación exitosa → `{ success: true, ... }`
   - `400 Bad Request`: Datos inválidos en el request → `{ success: false, message: "..." }`
   - `401 Unauthorized`: Token inválido, expirado o no proporcionado → `{ success: false, message: "Token inválido o expirado" }`
   - `404 Not Found`: Recurso no encontrado (cédula, certificado, etc.) → `{ success: false, message: "..." }`
   - `500 Internal Server Error`: Error del servidor → `{ success: false, message: "Error del servidor" }`
   - Todas las respuestas de error deben incluir `success: false` y un `message` descriptivo
   - El frontend espera que el body de las respuestas de error sea JSON válido

### 13. Headers Requeridos

   - `Content-Type: application/json` en requests POST/PUT (frontend lo envía)
   - `Authorization: Bearer <token>` en endpoints protegidos (frontend lo envía)
   - El frontend espera que el backend acepte CORS desde el dominio del frontend
   - Headers CORS requeridos:
     ```
     Access-Control-Allow-Origin: <dominio-frontend> o *
     Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
     Access-Control-Allow-Headers: Content-Type, Authorization
     Access-Control-Allow-Credentials: true (si se usan cookies)
     ```

### 14. Identificación del Usuario

   - En endpoints protegidos, el backend debe extraer la cédula del token JWT
   - El token debe contener al menos: `{ cedula: string, iat: number, exp: number }`
   - No es necesario enviar la cédula en el body de requests autenticados
   - El frontend **NO enviará** la cédula en el body o query params de endpoints protegidos
   - Ejemplo de decodificación del token:
     ```javascript
     // Pseudocódigo
     const token = req.headers.authorization.replace('Bearer ', '');
     const decoded = jwt.verify(token, SECRET_KEY);
     const cedula = decoded.cedula; // Usar esta cédula para buscar certificados
     ```

### 15. Generación de PDFs

   - Actualmente el frontend genera PDFs localmente con `pdf-lib`
   - Si el backend implementa generación de PDFs con firma electrónica, el frontend puede adaptarse
   - El PDF debe incluir: datos del usuario, datos del certificado, código de verificación, fecha de emisión
   - El endpoint `GET /certificados/download/:id` debe retornar el PDF como `application/pdf`
   - El nombre del archivo debe ser: `{titulo}_{codigoVerificacion}.pdf` (sin espacios en el título)

---

## 🗄️ Esquema de Base de Datos

A continuación se presenta el esquema de tablas sugerido para soportar las funcionalidades del frontend.

### Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│    usuarios     │       │    certificados     │       │  entidades_emisoras  │
├─────────────────┤       ├─────────────────────┤       ├──────────────────────┤
│ id (PK)         │──────<│ usuario_id (FK)     │       │ id (PK)              │
│ cedula (UNIQUE) │       │ id (PK)             │>──────│ nombre               │
│ primer_nombre   │       │ entidad_emisora_id  │       │ direccion            │
│ segundo_nombre  │       │ tipo                │       │ telefono             │
│ primer_apellido │       │ titulo              │       │ email                │
│ segundo_apellido│       │ descripcion         │       │ activo               │
│ email           │       │ fecha_emision       │       └──────────────────────┘
│ telefono        │       │ fecha_vencimiento   │
│ activo          │       │ estado              │       ┌──────────────────────┐
│ created_at      │       │ codigo_verificacion │       │      sesiones        │
│ updated_at      │       │ firmado             │       ├──────────────────────┤
└─────────────────┘       │ url_descarga        │       │ id (PK)              │
                          │ metadata            │       │ usuario_id (FK)      │
                          │ created_at          │       │ token                │
                          │ updated_at          │       │ ip_address           │
                          └─────────────────────┘       │ user_agent           │
                                                        │ expires_at           │
                                                        │ created_at           │
                                                        └──────────────────────┘
```

---

### Tabla: `usuarios`

Almacena la información de los usuarios que acceden al sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `cedula` | VARCHAR(12) | NOT NULL, UNIQUE, INDEX | Número de cédula (sin puntos) |
| `primer_nombre` | VARCHAR(100) | NOT NULL | Primer nombre |
| `segundo_nombre` | VARCHAR(100) | NULL | Segundo nombre (opcional) |
| `primer_apellido` | VARCHAR(100) | NOT NULL | Primer apellido |
| `segundo_apellido` | VARCHAR(100) | NULL | Segundo apellido (opcional) |
| `nombre_completo` | VARCHAR(400) | NOT NULL | Nombre completo concatenado |
| `email` | VARCHAR(255) | NULL | Correo electrónico |
| `telefono` | VARCHAR(20) | NULL | Número de teléfono |
| `activo` | BOOLEAN | DEFAULT TRUE | Si el usuario está activo |
| `ultimo_acceso` | TIMESTAMP | NULL | Fecha/hora del último login |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Fecha de actualización |

**SQL (MySQL/PostgreSQL):**

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(12) NOT NULL UNIQUE,
    primer_nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    nombre_completo VARCHAR(400) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_cedula ON usuarios(cedula);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
```

---

### Tabla: `entidades_emisoras`

Catálogo de entidades que pueden emitir certificados.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | VARCHAR(200) | NOT NULL | Nombre de la entidad |
| `codigo` | VARCHAR(20) | NOT NULL, UNIQUE | Código corto (ej: MOV, SENA) |
| `direccion` | VARCHAR(500) | NULL | Dirección física |
| `telefono` | VARCHAR(20) | NULL | Teléfono de contacto |
| `email` | VARCHAR(255) | NULL | Email de contacto |
| `logo_url` | VARCHAR(500) | NULL | URL del logo |
| `activo` | BOOLEAN | DEFAULT TRUE | Si la entidad está activa |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Fecha de actualización |

**SQL:**

```sql
CREATE TABLE entidades_emisoras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    email VARCHAR(255),
    logo_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO entidades_emisoras (nombre, codigo) VALUES 
    ('Movilis S.A.S', 'MOV'),
    ('SENA', 'SENA'),
    ('Instituto de Seguridad Industrial', 'ISI'),
    ('Asociación Colombiana de Tecnología', 'ACT');
```

---

### Tabla: `certificados`

Almacena todos los certificados emitidos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `usuario_id` | INT / UUID | FK → usuarios.id, NOT NULL | Usuario propietario |
| `entidad_emisora_id` | INT / UUID | FK → entidades_emisoras.id | Entidad que emitió |
| `tipo` | ENUM | NOT NULL | Tipo de certificado |
| `titulo` | VARCHAR(200) | NOT NULL | Título del certificado |
| `descripcion` | TEXT | NULL | Descripción detallada |
| `fecha_emision` | DATE | NOT NULL | Fecha de emisión |
| `fecha_vencimiento` | DATE | NULL | Fecha de vencimiento |
| `estado` | ENUM | NOT NULL, DEFAULT 'vigente' | Estado actual |
| `codigo_verificacion` | VARCHAR(50) | NOT NULL, UNIQUE | Código único de verificación |
| `url_descarga` | VARCHAR(500) | NULL | URL del archivo PDF |
| `firmado` | BOOLEAN | DEFAULT FALSE | Si tiene firma electrónica |
| `metadata` | JSON | NULL | Datos adicionales |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Fecha de actualización |

**Valores ENUM para `tipo`:**
- `laboral`
- `ingresos`
- `capacitacion`
- `participacion`
- `competencia`
- `otro`

**Valores ENUM para `estado`:**
- `vigente`
- `vencido`
- `revocado`
- `pendiente`

**SQL:**

```sql
-- Crear tipos ENUM (PostgreSQL)
CREATE TYPE certificado_tipo AS ENUM (
    'laboral', 
    'ingresos', 
    'capacitacion', 
    'participacion', 
    'competencia', 
    'otro'
);

CREATE TYPE certificado_estado AS ENUM (
    'vigente', 
    'vencido', 
    'revocado', 
    'pendiente'
);

CREATE TABLE certificados (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidad_emisora_id INT REFERENCES entidades_emisoras(id),
    tipo certificado_tipo NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    estado certificado_estado NOT NULL DEFAULT 'vigente',
    codigo_verificacion VARCHAR(50) NOT NULL UNIQUE,
    url_descarga VARCHAR(500),
    firmado BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificados_usuario ON certificados(usuario_id);
CREATE INDEX idx_certificados_estado ON certificados(estado);
CREATE INDEX idx_certificados_tipo ON certificados(tipo);
CREATE INDEX idx_certificados_codigo ON certificados(codigo_verificacion);
CREATE INDEX idx_certificados_fecha_emision ON certificados(fecha_emision);
```

---

### Tabla: `sesiones`

Maneja los tokens de sesión de los usuarios.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `usuario_id` | INT / UUID | FK → usuarios.id, NOT NULL | Usuario de la sesión |
| `token` | VARCHAR(500) | NOT NULL, UNIQUE | Token JWT o de sesión |
| `ip_address` | VARCHAR(45) | NULL | IP desde donde se conectó |
| `user_agent` | VARCHAR(500) | NULL | Navegador/dispositivo |
| `expires_at` | TIMESTAMP | NOT NULL | Fecha de expiración |
| `revocado` | BOOLEAN | DEFAULT FALSE | Si el token fue revocado |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**SQL:**

```sql
CREATE TABLE sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    expires_at TIMESTAMP NOT NULL,
    revocado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_token ON sesiones(token);
CREATE INDEX idx_sesiones_expires ON sesiones(expires_at);
```

---

### Tabla: `auditoria` (Opcional)

Registro de acciones para auditoría y seguridad.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `usuario_id` | INT / UUID | FK → usuarios.id | Usuario que realizó la acción |
| `accion` | VARCHAR(50) | NOT NULL | Tipo de acción |
| `entidad` | VARCHAR(50) | NOT NULL | Tabla/entidad afectada |
| `entidad_id` | VARCHAR(50) | NULL | ID del registro afectado |
| `datos_anteriores` | JSON | NULL | Estado anterior (para updates) |
| `datos_nuevos` | JSON | NULL | Estado nuevo |
| `ip_address` | VARCHAR(45) | NULL | IP del usuario |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha/hora de la acción |

**Valores para `accion`:**
- `LOGIN` - Inicio de sesión
- `LOGOUT` - Cierre de sesión
- `VIEW_CERTIFICADOS` - Consulta de certificados
- `DOWNLOAD_CERTIFICADO` - Descarga de certificado
- `VERIFY_CERTIFICADO` - Verificación de certificado

**SQL:**

```sql
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(50),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);
CREATE INDEX idx_auditoria_fecha ON auditoria(created_at);
```

---

### Tabla: `certificados_metadata` (Opcional)

Para certificados laborales que requieren datos adicionales estructurados.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT / UUID | PK, AUTO_INCREMENT | Identificador único |
| `certificado_id` | INT / UUID | FK → certificados.id, UNIQUE | Certificado relacionado |
| `cargo` | VARCHAR(200) | NULL | Cargo del empleado |
| `departamento` | VARCHAR(200) | NULL | Departamento |
| `salario` | DECIMAL(15,2) | NULL | Salario (si aplica) |
| `tipo_contrato` | VARCHAR(50) | NULL | Tipo de contrato |
| `fecha_ingreso` | DATE | NULL | Fecha de ingreso |
| `fecha_retiro` | DATE | NULL | Fecha de retiro (si aplica) |
| `jefe_inmediato` | VARCHAR(200) | NULL | Nombre del jefe |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**SQL:**

```sql
CREATE TABLE certificados_metadata (
    id SERIAL PRIMARY KEY,
    certificado_id INT NOT NULL UNIQUE REFERENCES certificados(id) ON DELETE CASCADE,
    cargo VARCHAR(200),
    departamento VARCHAR(200),
    salario DECIMAL(15,2),
    tipo_contrato VARCHAR(50),
    fecha_ingreso DATE,
    fecha_retiro DATE,
    jefe_inmediato VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cert_metadata_certificado ON certificados_metadata(certificado_id);
```

---

### Resumen de Tablas

| Tabla | Prioridad | Descripción |
|-------|-----------|-------------|
| `usuarios` | 🔴 Alta | Información de usuarios (requerida) |
| `certificados` | 🔴 Alta | Certificados digitales (requerida) |
| `entidades_emisoras` | 🟡 Media | Catálogo de entidades emisoras |
| `sesiones` | 🟡 Media | Tokens de sesión (si no usan JWT stateless) |
| `auditoria` | 🟢 Baja | Logs de auditoría (recomendado) |
| `certificados_metadata` | 🟢 Baja | Datos adicionales de certificados |

---

### Relaciones entre Tablas

```
usuarios (1) ─────────< (N) certificados
usuarios (1) ─────────< (N) sesiones
usuarios (1) ─────────< (N) auditoria
entidades_emisoras (1) ────< (N) certificados
certificados (1) ─────────── (1) certificados_metadata
```

---

### Queries de Ejemplo

**1. Obtener certificados de un usuario por cédula:**
```sql
SELECT c.*, e.nombre as entidad_nombre
FROM certificados c
LEFT JOIN entidades_emisoras e ON c.entidad_emisora_id = e.id
JOIN usuarios u ON c.usuario_id = u.id
WHERE u.cedula = '1234567890'
AND c.estado IN ('vigente', 'pendiente')
ORDER BY c.fecha_emision DESC;
```

**2. Verificar un certificado por código:**
```sql
SELECT 
    c.titulo,
    c.estado,
    c.fecha_emision,
    c.firmado,
    u.nombre_completo as titular,
    e.nombre as entidad_emisora
FROM certificados c
JOIN usuarios u ON c.usuario_id = u.id
LEFT JOIN entidades_emisoras e ON c.entidad_emisora_id = e.id
WHERE c.codigo_verificacion = 'MOV-2024-001-XYZ';
```

**3. Login y crear sesión:**
```sql
-- Buscar usuario
SELECT * FROM usuarios WHERE cedula = '1234567890' AND activo = TRUE;

-- Actualizar último acceso
UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?;

-- Crear sesión
INSERT INTO sesiones (usuario_id, token, ip_address, user_agent, expires_at)
VALUES (?, 'jwt-token', '192.168.1.1', 'Mozilla/5.0...', NOW() + INTERVAL '24 hours');
```

**4. Registrar acción en auditoría:**
```sql
INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, ip_address)
VALUES (1, 'DOWNLOAD_CERTIFICADO', 'certificados', 'cert-001', '192.168.1.1');
```

---

## 🚀 Configuración de Desarrollo

### Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de build de producción
npm run preview

# Linter
npm run lint
```

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# URL base del backend API
VITE_API_URL=http://localhost:3001/api

# API Key (si el backend lo requiere)
VITE_API_KEY=tu-api-key-aqui
```

**Nota:** Las variables de entorno en Vite deben comenzar con `VITE_` para ser accesibles en el código.

### Configuración del Backend

Para conectar el frontend con el backend:

1. Actualizar `VITE_API_URL` en `.env` con la URL real del backend
2. En `src/features/auth/services/authService.ts`, cambiar `demoMode: false`
3. Asegurarse de que el backend esté corriendo y accesible
4. Verificar que CORS esté configurado correctamente en el backend

### Estructura de Alias (Path Mapping)

El proyecto usa alias para imports más limpios:

```typescript
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { API_CONFIG } from '@/config';
```

**Alias configurados en `vite.config.ts`:**
- `@` → `./src`
- `@components` → `./src/components`
- `@features` → `./src/features`
- `@config` → `./src/config`
- `@types` → `./src/types`
- `@utils` → `./src/utils`
- `@assets` → `./src/assets`

---

## 📦 Dependencias Principales

### Producción

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | ^18.2.0 | Framework UI |
| `react-dom` | ^18.2.0 | Renderizado React |
| `react-router-dom` | ^6.20.0 | Navegación SPA |
| `formik` | ^2.4.9 | Manejo de formularios |
| `yup` | ^1.7.1 | Validación de esquemas |
| `lucide-react` | ^0.294.0 | Iconos SVG |
| `pdf-lib` | ^1.17.1 | Generación de PDFs |
| `date-fns` | ^2.30.0 | Formateo de fechas |

### Desarrollo

| Paquete | Versión | Uso |
|---------|---------|-----|
| `typescript` | ^5.2.2 | Tipado estático |
| `vite` | ^5.0.0 | Bundler y dev server |
| `@vitejs/plugin-react` | ^4.2.0 | Plugin React para Vite |

---

## 🔍 Testing y Debugging

### Modo Demo

El frontend incluye un modo demo para desarrollo sin backend:

- **Activar:** `demoMode: true` en `src/features/auth/services/authService.ts`
- **Cédulas demo:** `1234567890`, `9876543210`, `1122334455`, `1728963594`
- **Datos:** Se usan datos mock almacenados en el código

### Debugging

- Abrir DevTools del navegador (F12)
- Revisar `localStorage` para ver datos de usuario almacenados
- Revisar Network tab para ver requests al backend
- Los errores se muestran en consola y en la UI

---

## 📋 Checklist para Integración con Backend

Antes de conectar el frontend con el backend, verificar:

- [ ] Backend implementa `POST /auth/login` con formato correcto
- [ ] Backend implementa `GET /certificados` con autenticación JWT
- [ ] Backend retorna datos en formato `User` y `Certificado` especificados
- [ ] CORS configurado correctamente en backend
- [ ] Token JWT incluye `cedula` en el payload
- [ ] Variables de entorno configuradas (`.env`)
- [ ] `demoMode: false` en `authService.ts`
- [ ] Backend accesible desde el dominio del frontend

---

---

## ✅ Checklist de Implementación para el Backend

### Endpoints Críticos (Prioridad Alta - OBLIGATORIOS)

- [ ] **POST /auth/login**
  - [ ] Recibe cédula en el body: `{ "cedula": "1234567890" }`
  - [ ] Consulta el Registro Civil de Ecuador
  - [ ] Retorna formato `AuthResponse` con `success`, `user`, `token`, `message`
  - [ ] Genera token JWT con `cedula` en el payload
  - [ ] Maneja errores: 400 (cédula inválida), 404 (no encontrada), 500 (error servidor)

- [ ] **GET /certificados**
  - [ ] Valida token JWT del header `Authorization: Bearer <token>`
  - [ ] Extrae `cedula` del payload del token
  - [ ] Retorna formato `CertificadosResponse` con `success`, `certificados`, `total`
  - [ ] Soporta query params opcionales: `?tipo=laboral&estado=vigente`
  - [ ] Maneja error 401 (token inválido/expirado)

### Endpoints Opcionales (Prioridad Media)

- [ ] **GET /certificados/download/:id**
  - [ ] Valida token JWT
  - [ ] Retorna PDF como `application/pdf`
  - [ ] Headers: `Content-Disposition: attachment; filename="..."`

- [ ] **POST /auth/logout**
  - [ ] Valida token JWT
  - [ ] Invalida token en el servidor (opcional)
  - [ ] Retorna `{ success: true, message: "..." }`

- [ ] **GET /auth/verify**
  - [ ] Valida token JWT
  - [ ] Retorna `{ success: true, valid: true }`

### Configuración Técnica

- [ ] CORS configurado para permitir requests desde el dominio del frontend
- [ ] Headers CORS: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`
- [ ] Todas las respuestas siguen el formato: `{ success: boolean, ... }`
- [ ] Manejo de errores HTTP con códigos correctos (200, 400, 401, 404, 500)
- [ ] Validación y limpieza de cédula recibida (eliminar puntos, espacios, guiones)
- [ ] Token JWT incluye `cedula` en el payload: `{ cedula: string, iat: number, exp: number }`
- [ ] Tiempo de expiración del token: 24 horas (configurable)

### Base de Datos

- [ ] Tabla `usuarios` creada con campos requeridos
- [ ] Tabla `certificados` creada con campos requeridos
- [ ] Tabla `entidades_emisoras` creada (opcional)
- [ ] Índices creados en campos clave (cedula, codigo_verificacion, etc.)
- [ ] Relaciones entre tablas configuradas correctamente

### Integración con Registro Civil

- [ ] Integración con API del Registro Civil de Ecuador implementada
- [ ] Manejo de errores de conexión y timeouts
- [ ] Mapeo de datos del Registro Civil al formato `User` requerido
- [ ] Caché de consultas (opcional, recomendado)

---

## 📞 Contacto y Soporte

Para dudas sobre la implementación del frontend o la integración con el backend, consultar esta documentación completa.

**Información del Proyecto:**
- **Nombre:** Movilis Certificados
- **Versión Frontend:** 1.0.0
- **Stack:** React 18.2.0 + TypeScript 5.2.2 + Vite 5.0.0
- **Fecha de documentación:** Diciembre 2024
- **Última actualización:** Diciembre 2024

---

**Fecha de documentación:** Diciembre 2024  
**Versión del Frontend:** 1.0.0  
**Última actualización:** Diciembre 2024

