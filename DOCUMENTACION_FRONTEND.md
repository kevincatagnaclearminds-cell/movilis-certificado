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
├── assets/images/          # Logos e imágenes
├── components/
│   ├── layout/             # Header, MainLayout
│   └── ui/                 # Badge, Button, Card, Input, Spinner
├── config/                 # Constantes y configuración
├── features/
│   ├── auth/               # Autenticación (login, context, hooks, services)
│   └── certificados/       # Certificados (componentes, hooks, services, utils)
├── pages/                  # LoginPage, DashboardPage
├── styles/                 # CSS global
├── types/                  # Tipos TypeScript globales
└── utils/                  # Funciones utilitarias
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login
1. Usuario ingresa su **número de cédula** (10-12 dígitos)
2. Frontend valida el formato de la cédula
3. Se envía petición al backend para consultar la cédula
4. Backend consulta el Registro Civil y retorna datos del usuario
5. Se almacena la sesión en `localStorage` y se genera un token

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
  fechaEmision: string;          // Fecha de emisión (ISO 8601)
  fechaVencimiento?: string;     // Fecha de vencimiento (ISO 8601)
  estado: CertificadoEstado;     // Estado actual
  entidadEmisora: string;        // Entidad que emitió el certificado
  codigoVerificacion: string;    // Código único de verificación
  urlDescarga?: string;          // URL de descarga (opcional)
  firmado: boolean;              // Si tiene firma electrónica
  metadata?: Record<string, unknown>; // Datos adicionales
}
```

---

## 🌐 APIs Requeridas del Backend

### Variables de Entorno

El frontend espera estas variables de entorno:

```env
VITE_API_URL=https://tu-api.com/api    # URL base del backend
VITE_API_KEY=tu-api-key                 # API Key (si aplica)
```

---

## 📡 Endpoints Requeridos

### 1. Autenticación

#### `POST /auth/login`

Inicia sesión consultando la cédula en el Registro Civil.

**Request:**
```json
{
  "cedula": "1234567890"
}
```

**Response Exitosa (200):**
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
    "email": "juan.perez@email.com"
  },
  "token": "jwt-token-aqui",
  "message": "Inicio de sesión exitoso"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Cédula no encontrada"
}
```

---

#### `POST /auth/logout`

Cierra la sesión actual e invalida el token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

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

Obtiene todos los certificados del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (opcionales):**
- `tipo`: Filtrar por tipo de certificado
- `estado`: Filtrar por estado

**Response (200):**
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
      "firmado": true
    },
    {
      "id": "cert-002",
      "tipo": "ingresos",
      "titulo": "Certificado de Ingresos y Retenciones",
      "descripcion": "Certificado de ingresos y retenciones del año fiscal 2023.",
      "fechaEmision": "2024-02-28",
      "estado": "vigente",
      "entidadEmisora": "Movilis S.A.S",
      "codigoVerificacion": "MOV-2024-002-ABC",
      "firmado": true
    }
  ],
  "total": 2,
  "message": null
}
```

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

Descarga el PDF de un certificado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
- Content-Type: `application/pdf`
- Body: Archivo PDF binario

**Nota:** Actualmente el frontend genera el PDF localmente usando `pdf-lib` con una plantilla. Si el backend puede generar los PDFs con firma electrónica, sería preferible usar este endpoint.

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

## 🔄 Flujos de Usuario

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

### Flujo 2: Descarga de Certificado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│   Frontend  │────▶│   Backend   │
│   click en  │     │   solicita  │     │   genera    │
│  "Descargar"│     │   PDF       │     │   PDF       │
└─────────────┘     └─────────────┘     └─────────────┘
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

| Ruta | Componente | Autenticación |
|------|------------|---------------|
| `/` | Redirect a `/login` | No |
| `/login` | LoginPage | No |
| `/dashboard` | DashboardPage | Sí |
| `/certificados` | (Futuro) | Sí |
| `/certificados/:id` | (Futuro) | Sí |

---

## 🔒 Manejo de Sesión

- **Almacenamiento:** `localStorage` con key `movilis_user`
- **Token:** Se almacena en la respuesta de login
- **Expiración:** El backend debe manejar la expiración del token
- **Cierre de sesión:** Limpia `localStorage` y redirige a `/login`

---

## ⚠️ Validaciones del Frontend

### Cédula
- Solo números (0-9)
- Mínimo 10 caracteres
- Máximo 12 caracteres
- Se limpian automáticamente puntos y espacios

### Mensajes de Error

| Código | Mensaje |
|--------|---------|
| CEDULA_REQUIRED | "La cédula es requerida" |
| CEDULA_INVALID | "Solo se permiten números" |
| CEDULA_MIN_LENGTH | "La cédula debe tener mínimo 10 caracteres" |
| CEDULA_MAX_LENGTH | "La cédula no puede tener más de 12 caracteres" |
| CEDULA_NOT_FOUND | "Cédula no encontrada" |
| LOGIN_ERROR | "Error al iniciar sesión" |
| DOWNLOAD_ERROR | "Error al descargar el certificado" |

---

## 📊 Resumen de APIs Necesarias

### Prioridad Alta (Necesarias para funcionamiento básico)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login con cédula |
| `GET` | `/certificados` | Lista de certificados del usuario |

### Prioridad Media (Funcionalidades adicionales)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/certificados/download/:id` | Descarga PDF (si backend genera) |
| `POST` | `/auth/logout` | Cerrar sesión |
| `GET` | `/auth/verify` | Verificar token válido |

### Prioridad Baja (Futuro)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/certificados/:id` | Detalle de certificado |
| `GET` | `/certificados/verify/:codigo` | Verificar autenticidad |
| `GET` | `/users/profile` | Perfil de usuario |

---

## 📝 Notas para el Backend

1. **Consulta al Registro Civil:** El login debe consultar el Registro Civil de Ecuador para validar la cédula y obtener los datos del ciudadano.

2. **Generación de PDFs:** Actualmente el frontend genera los PDFs usando una plantilla local. Si el backend puede generar PDFs con firma electrónica real, sería preferible usar ese endpoint.

3. **Códigos de Verificación:** Cada certificado tiene un código único (ej: `MOV-2024-001-XYZ`) que permite verificar su autenticidad.

4. **CORS:** Asegurar que el backend permita requests desde el dominio del frontend.

5. **Formato de Fechas:** Usar formato ISO 8601 (YYYY-MM-DD) para todas las fechas.

6. **Respuestas Consistentes:** Todas las respuestas deben seguir el formato:
   ```json
   {
     "success": boolean,
     "data": object | array,
     "message": string | null
   }
   ```

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

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Variables de entorno (.env)
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=tu-api-key
```

---

**Fecha de documentación:** Diciembre 2024  
**Versión del Frontend:** 1.0.0

