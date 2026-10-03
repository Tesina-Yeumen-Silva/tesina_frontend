# Mendoza Reporta - Panel de Control Web (Frontend)

Este repositorio aloja la interfaz administrativa e institucional para el sistema **Mendoza Reporta**. Se trata de un *Dashboard* diseñado para funcionarios públicos, operadores del centro de monitoreo municipal y administradores que requieren una vista global de los incidentes urbanos.

## 🚀 Tecnologías Principales

- **Framework**: [Next.js](https://nextjs.org/)
- **Librería UI**: [React](https://reactjs.org/) con [Tailwind CSS](https://tailwindcss.com/)
- **Mapas y Geoposicionamiento**: Mapbox GL JS / React Map GL
- **Visualización de Datos**: Recharts (para métricas y tableros estadísticos)
- **Control de Estado**: React Hooks nativos y Context API

## 🧩 Funcionalidades Clave

- **Tablero de Métricas (Dashboard)**: Visualización analítica del estado de la infraestructura municipal, filtrado temporal, gráficos de tendencias y segmentación de reportes.
- **Vista de Mapa**: Interfaz geoespacial con clústeres para visualizar zonas de calor y focos de densidad de incidentes en el territorio.
- **Gestión de Reportes**: Tabla interactiva con filtros avanzados, búsqueda difusa y soporte para paginación profunda impulsada desde el servidor.
- **Auditoría IA (Piloto)**: Visibilidad de los estados y determinaciones automáticas logradas por el motor de validación multimodal.

## 📋 Requisitos Previos

- **Node.js** v18 o superior.
- Una instancia activa de la API Core (Node.js) de Mendoza Reporta.

## ⚙️ Configuración del Entorno

1. Clonar el repositorio y copiar el archivo de configuración base:
   ```bash
   cp .env.example .env
   ```
2. Asegurar que la variable `NEXT_PUBLIC_API_URL` apunte a la ruta de despliegue o instancia local del backend principal.

## 🛠️ Instalación y Uso Local

1. Instalar las dependencias de Next.js:
   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

3. Navegar a `http://localhost:3000` en el explorador web. Para generar una versión compilada optimizada para producción, se puede utilizar el comando `npm run build`.

## 🤝 Estilo y Patrones

El desarrollo en este repositorio exige seguir las pautas de uso de `use client` en componentes que necesiten interactividad del lado del usuario y mantener desacoplada la capa de conexión HTTP en `src/services/` de la capa de vista de los componentes (`src/views/`).
