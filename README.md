# Movilis - Sistema de Certificados

Sistema web para consulta y descarga de certificados con firma electrónica.

## 🚀 Características

- ✅ Login con número de cédula
- ✅ Visualización de certificados del usuario
- ✅ Descarga de certificados en PDF con firma electrónica
- ✅ Interfaz moderna y responsiva
- ✅ Arquitectura modular y escalable

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes, fuentes, archivos estáticos
├── components/      # Componentes reutilizables
│   ├── ui/          # Componentes UI (Button, Input, Card, etc.)
│   └── layout/      # Componentes de layout (Header, MainLayout)
├── config/          # Configuración y constantes
├── features/        # Módulos por funcionalidad
│   ├── auth/        # Autenticación (login, contexto, servicios)
│   └── certificados/# Certificados (listado, descarga)
├── hooks/           # Custom hooks globales
├── pages/           # Páginas/Vistas principales
├── services/        # Servicios de API
├── styles/          # Estilos globales
├── types/           # Tipos TypeScript
└── utils/           # Funciones utilitarias
```

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router** - Navegación
- **CSS Modules** - Estilos encapsulados
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd movilis-certificado

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Preview de la build de producción
npm run lint     # Ejecuta el linter
```

## 🎨 Arquitectura Modular

### Features (Módulos)
Cada feature contiene todo lo necesario para funcionar de forma independiente:

```
features/
└── auth/
    ├── components/    # Componentes específicos del módulo
    ├── context/       # Estado y contexto React
    ├── hooks/         # Hooks del módulo
    ├── services/      # Servicios/API del módulo
    └── index.ts       # Exportaciones públicas
```

### Componentes UI
Componentes reutilizables y genéricos:

- `Button` - Botón con variantes y estados
- `Input` - Campo de entrada con validación
- `Card` - Contenedor con estilos
- `Badge` - Etiquetas de estado
- `Spinner` - Indicador de carga

## 🔐 Usuarios de Prueba

| Cédula | Nombre |
|--------|--------|
| 1234567890 | Juan Carlos Pérez Rodríguez |
| 9876543210 | María Fernanda López García |
| 1122334455 | Carlos Andrés Martínez Silva |

*Cualquier otra cédula válida (6-12 dígitos) creará un usuario demo.*

## 🔄 Flujo de la Aplicación

1. **Login** → Usuario ingresa su cédula
2. **Validación** → Se valida el formato de la cédula
3. **Autenticación** → Se consulta al servicio de auth
4. **Dashboard** → Se muestran los certificados del usuario
5. **Descarga** → Usuario puede descargar certificados en PDF

## 📄 Licencia

MIT

