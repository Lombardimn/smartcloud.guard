# 📅 Schedule Guard System

Sistema de gestión de guardias rotativas para equipos de desarrollo. Aplicación web moderna construida con **Next.js 14**, **TypeScript** y **Tailwind CSS**.

## 🚀 Características

- ✅ **Rotación automática** de guardias entre 6 desarrolladores
- ✅ **Sistema de 2 días consecutivos** por persona
- ✅ **Solo días laborables** (lunes a viernes)
- ✅ **Sistema de reemplazos** con registro de motivos
- ✅ **Calendario visual** con colores distintivos
- ✅ **Interfaz responsive** y moderna
- ✅ **Navegación por meses** con vista actual resaltada
- ✅ **TypeScript** para seguridad de tipos
- ✅ **Deploy fácil en Vercel**

## 🎨 Capturas de Pantalla

El calendario muestra:
- 🟢 **Verde claro**: Primer día de guardia
- 🟢 **Verde oscuro**: Segundo día de guardia
- ⚠️ **Indicador naranja**: Reemplazos activos
- 🔵 **Borde azul**: Día actual

## 📋 Equipo de Desarrollo

1. **Matías Lombardi** (ML) - Color: #3B82F6 (Azul)
2. **Soledad Cabrera** (SC) - Color: #EF4444 (Rojo)
3. **Gonzalo Muñoz** (GM) - Color: #10B981 (Verde)
4. **Carolina Calbulahue** (CC) - Color: #F59E0B (Naranja)
5. **Claudio Aranda** (CA) - Color: #8B5CF6 (Púrpura)
6. **Mariela Leiva** (ML2) - Color: #EC4899 (Rosa)

### 🔄 Orden de Rotación
ML → SC → GM → CC → CA → ML2 → ML (ciclo infinito)

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 3
- **Despliegue**: Vercel
- **Node**: 18.x o superior

## 📦 Instalación

### Prerrequisitos

```bash
node --version  # v18.0.0 o superior
npm --version   # v9.0.0 o superior
```

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Lombardimn/schedule-guard-system.git
cd schedule-guard-system
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
schedule-guard-system/
├── app/
│   ├── layout.tsx          # Layout principal de Next.js
│   ├── page.tsx            # Página principal con calendario
│   └── globals.css         # Estilos globales con Tailwind
├── components/
│   ├── Calendar.tsx        # Componente del calendario mensual
│   ├── DayCell.tsx         # Celda individual de cada día
│   ├── MonthSelector.tsx   # Navegación entre meses
│   └── Legend.tsx          # Leyenda de colores y equipo
├── lib/
│   ├── dateUtils.ts        # Utilidades de fechas
│   └── scheduleGenerator.ts # Lógica de generación de guardias
├── types/
│   └── index.ts            # Tipos TypeScript
├── data/
│   ├── team.json           # Configuración del equipo
│   └── replacements.json   # Registro de reemplazos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 📊 Configuración de Datos

### Equipo (data/team.json)

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
    "workDaysOnly": true
  }
}
```

### Reemplazos (data/replacements.json)

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

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🚀 Deploy en Vercel

### Deploy Automático

1. **Push a GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar con Vercel**

- Ve a vercel.com
- Click en "New Project"
- Importa tu repositorio de GitHub
- Click en "Deploy"

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Tu aplicación estará disponible en: https://schedule-guard-system.vercel.app

## 📝 Uso del Sistema

### Agregar un Reemplazo

Edita data/replacements.json:

```json
{
  "id": "repl-002",
  "originalPersonId": "gm",
  "replacementPersonId": "ca",
  "startDate": "2026-01-10",
  "endDate": "2026-01-15",
  "reason": "Licencia médica",
  "status": "active"
}
```

### Modificar el Equipo

Edita data/team.json para:
- Agregar/eliminar miembros
- Cambiar colores
- Modificar orden de rotación

### Cambiar Días de Guardia

En data/team.json, modifica:

```json
"config": {
  "daysPerGuard": 3,
  "workDaysOnly": true
}
```

## 🎯 Lógica de Negocio

### Algoritmo de Rotación

1. **Inicio del mes**: Comienza con el primer desarrollador
2. **Asignación**: 2 días consecutivos laborables
3. **Rotación**: Siguiente desarrollador en la lista
4. **Ciclo**: Vuelve al inicio al terminar la lista
5. **Reemplazos**: Se aplican sobre las asignaciones base

### Ejemplo de Rotación (Diciembre 2025)

```
Lun 1-2: ML (Día 1 y 2)
Mié 3-4: SC (Día 1 y 2)
Vie 5: GM (Día 1)
Lun 8: GM (Día 2)
Mar 9-10: CC (Día 1 y 2)
...
```

## 🐛 Troubleshooting

### Error: Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript

```bash
npm run lint
```

### Problemas de Tailwind

Verifica que tailwind.config.ts esté correctamente configurado.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (git checkout -b feature/nueva-funcionalidad)
3. Commit tus cambios (git commit -m 'Agrega nueva funcionalidad')
4. Push a la rama (git push origin feature/nueva-funcionalidad)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Matías Lombardi**
- GitHub: @Lombardimn
- Repositorio: https://github.com/Lombardimn/schedule-guard-system

## 🙏 Agradecimientos

- Equipo de desarrollo por su colaboración
- Next.js y Vercel por las herramientas
- Tailwind CSS por los estilos

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!