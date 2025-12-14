# SmartCloud Guard - Progressive Web App

Sistema de gestión de guardias rotativas para equipos de desarrollo. Aplicación web moderna construida con **Next.js 16**, **TypeScript** y **Tailwind CSS**.

## 🚀 Características

- ✅ **Rotación automática** de guardias entre 6 desarrolladores
- ✅ **Sistema de 2 días consecutivos** por persona
- ✅ **Solo días laborables** (lunes a viernes)
- ✅ **Sistema de reemplazos** con registro de motivos
- ✅ **Calendario visual** con colores distintivos
- ✅ **Interfaz responsive** y moderna
- ✅ **Navegación por meses** con vista actual resaltada
- ✅ **TypeScript** para seguridad de tipos
- ✅ **Web PWA** mayor flexibilidad de acceso para el usario.
- ✅ **Deploy fácil en Vercel**

## 📊 Configuración de Datos

El calendario muestra:

- 🟢 **Verde claro**: Primer día de guardia
- 🟢 **Verde oscuro**: Segundo día de guardia
- ⚠️ **Indicador naranja**: Reemplazos activos
- 🔵 **Borde azul**: Día actual

## 📋 Equipos

1. **Matías Lombardi** (ML) - Color: #3B82F6 (Azul)
2. **Soledad Cabrera** (SC) - Color: #EF4444 (Rojo)
3. **Gonzalo Muñoz** (GM) - Color: #10B981 (Verde)
4. **Carolina Calbulahue** (CC) - Color: #F59E0B (Naranja)
5. **Claudio Aranda** (CA) - Color: #8B5CF6 (Púrpura)
6. **Mariela Leiva** (ML2) - Color: #EC4899 (Rosa)

### (data/team.json)

```json
{
  "team": [
    {
      "id": "ml",
      "name": "Matías Lombardi",
      "initials": "ML",
      "color": "#3B82F6"
    }
  ],
  "rotationOrder": ["ml", "sc", "gm", "cc", "ca", "ml2"],
  "config": {
    "daysPerGuard": 2,
    "startDate": "2026-01-01",
    "workDaysOnly": true
  }
}
```

### 🔄 Orden de Rotación

ML → SC → GM → CC → CA → ML2 → ML (ciclo infinito)

## Reemplazos

### (data/replacements.json)

```json
{
  "replacements": [
    {
      "id": "repl-001",
      "originalPersonId": "ml",
      "replacementPersonId": "sc",
      "startDate": "2025-12-15",
      "endDate": "2025-12-20",
      "reason": "Vacaciones",
      "status": "active"
    }
  ]
}
```

## Feriados ajustables

```json
{
  "holidays": [
        {
      "date": "2025-12-25",
      "name": "Navidad",
      "type": "public",
      "icon": "🎄"
    }
  ]
}
```

## PWA Features

Esta aplicación es una Progressive Web App completamente funcional con las siguientes características:

### ✅ Instalable

- Se puede instalar en dispositivos móviles (Android/iOS) y escritorio (Windows/macOS/Linux)
- Proporciona una experiencia similar a una aplicación nativa cuando está instalada
- Aparece en el cajón de aplicaciones/pantalla de inicio

### ✅ Soporte sin Conexión

- Funciona sin conexión con contenido almacenado en caché
- Página de respaldo personalizada para modo sin conexión
- Service worker para almacenamiento en caché inteligente

### ✅ Estrategias de Caché Optimizadas

- **Google Fonts**: Cache First (365 días)
- **Imágenes**: Cache First (30 días)
- **Recursos Estáticos (JS/CSS)**: Stale While Revalidate (24 horas)
- **Respuestas API**: Network First con timeout de 10s (24 horas)
- **Páginas**: Network First con timeout de 10s (24 horas)

### ✅ Manifiesto Completo

- Múltiples tamaños de iconos (72x72 a 512x512)
- Iconos enmascarables para iconos adaptativos de Android
- Iconos Apple touch para iOS
- Modo de visualización independiente para experiencia de aplicación nativa

### ✅ SEO y Compartir en Redes Sociales

- Etiquetas Open Graph para compartir en redes sociales
- Soporte para Twitter Card
- Metadatos completos para motores de búsqueda

## Getting Started

Primero, debes ejecutar el server en desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## PWA Configuration

La configuración de PWA se detalla en el documento [Implementacion PWA](./PWA_IMPLEMENTATION.md)

## 🎯 Lógica de Negocio

### Algoritmo de Rotación

1. **Inicio del mes**: Comienza con el primer desarrollador segun `startDate`.
2. **Asignación**: 2 días consecutivos laborables.
3. **Rotación**: Cumple el funcionamiento de [Rotación](./ROTACION_STARTDATE.md).
4. **Ciclo**: Vuelve al inicio al terminar la lista.
5. **Reemplazos**: Se aplican sobre las asignaciones base.
