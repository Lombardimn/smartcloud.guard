# 📚 SISTEMA DE ROTACIÓN - DOCUMENTACIÓN TÉCNICA

## 🎯 Resumen Ejecutivo

**Sistema rediseñado** para gestionar guardias con **datos históricos inmutables** y **cálculo dinámico del futuro**.

---

## 🏗️ Arquitectura del Sistema

### **Filosofía de Diseño**

| LÍNEA DE TIEMPO | |
| :--- | :--- |
| **PASADO (< HOY)** | **FUTURO (>= HOY)** |
| ✅ **INMUTABLE** | 🔄 **CALCULADO** |
|`localStorage` No se recalcula | desde `startDate` Se recalcula siempre |

### **Componentes Clave**

#### 1️⃣ **rotationState.ts** - Gestión de Estado

- **Función**: Guardar y recuperar asignaciones históricas
- **Storage**: localStorage con estructura optimizada
- **Hash de configuración**: Detecta cambios en startDate o rotationOrder

#### 2️⃣ **scheduleGenerator.ts** - Generación de Guardias

- **Para días pasados**: Usa datos guardados (inmutables)
- **Para días futuros**: Calcula desde startDate
- **Auto-persistencia**: Guarda automáticamente asignaciones pasadas

#### 3️⃣ **RotationControl.tsx** - Panel de Control

- **Información objetiva**: Días guardados, última sincronización
- **Alertas inteligentes**: Detecta cambios en configuración
- **Control seguro**: Confirmación antes de eliminar historial

---

## 📊 Flujo de Datos

### **Generación de Calendario**

```typescript
1. Usuario navega a un mes
   ↓
2. scheduleGenerator recibe (year, month)
   ↓
3. Para cada día laborable:
   
   ┌─ ¿Es día pasado?
   │   ├─ SÍ → Buscar en localStorage
   │   │        ├─ ¿Existe? → Usar dato guardado ✅
   │   │        └─ No existe → Calcular desde startDate
   │   │
   │   └─ NO (futuro) → Calcular desde startDate
   ↓
4. Guardar automáticamente días pasados en localStorage
   ↓
5. Retornar asignaciones completas
```

### **Cálculo desde startDate**

```typescript
calculateStartingPoint(targetDate, rotationOrderLength)
│
├─ Contar días laborables desde startDate hasta targetDate
├─ Aplicar fórmula: totalCycles = días / 2
├─ Calcular personIndex = totalCycles % rotationOrderLength
└─ Determinar dayType ('day1' | 'day2')
```

---

## 🔍 ¿Cuándo Revisar y Recalcular?

### **El Usuario NO Necesita Revisar**

El sistema funciona **automáticamente**:

- ✅ Días pasados se guardan automáticamente
- ✅ Días futuros se calculan correctamente
- ✅ Navegación entre meses es transparente

### **El Usuario DEBE Recalcular Cuando:**

| Situación | Indicador Visual | Acción Requerida |
|-----------|------------------|------------------|
| **Cambió startDate en config** | ⚠️ Alerta amarilla: "La configuración cambió" | Clic en "Recalcular ahora" |
| **Cambió rotationOrder** | ⚠️ Alerta amarilla | Clic en "Recalcular ahora" |
| **Quiere empezar desde cero** | - | Clic en "Reiniciar historial" |

### **Información Mostrada al Usuario**

#### Estado Inicial (Sin datos guardados)

```txt
Sistema inicializado
Calculando guardias desde: 2026-01-01
⚡ Las asignaciones pasadas se guardarán automáticamente
```

#### Estado Normal (Con historial)

```txt
✅ Historial guardado: 47 días
📅 Última sincronización: 15 dic 2024, 14:30
🎯 Fecha de referencia: 2026-01-01
```

#### Estado con Cambios Detectados

```txt
✅ Historial guardado: 47 días
...
⚠️ La configuración cambió. Se recomienda recalcular para 
   actualizar asignaciones futuras.

[Recalcular ahora]  ← Botón destacado
```

---

## 💾 Gestión de localStorage

### **Estructura de Datos**

```typescript
interface RotationState {
  configHash: string;                           // "2026-01-01|gc,rv,mb,mc,mp,fv"
  lastSync: string;                             // "2024-12-15T14:30:00.000Z"
  historicalAssignments: Record<string, Assignment>;  
  // {
  //   "2026-01-02": { date: "2026-01-02", personId: "gc", dayType: "day1", ... },
  //   "2026-01-03": { date: "2026-01-03", personId: "gc", dayType: "day2", ... },
  //   ...
  // }
  totalHistoricalDays: number;                  // 47
}
```

### **Ventajas de Esta Estructura**

✅ **Búsqueda O(1)**: Acceso directo por fecha  
✅ **Inmutabilidad**: Datos pasados nunca cambian  
✅ **Detección de cambios**: Hash permite validar configuración  
✅ **Auditoría**: Timestamp de última sincronización  
✅ **Eficiencia**: Solo guarda lo necesario (días pasados)  

### **Seguridad y Validación**

```typescript
// ✅ CORRECTO: Solo guardar días pasados
if (assignmentDate < today) {
  saveHistoricalAssignment(assignment);
}

// ✅ CORRECTO: Detectar cambios en configuración
const currentHash = `${startDate}|${rotationOrder.join(',')}`;
if (storedHash !== currentHash) {
  // Mostrar alerta al usuario
}

// ✅ CORRECTO: Confirmar antes de eliminar
if (confirm(`Esto eliminará ${stats.totalDays} días`)) {
  clearRotationState();
}
```

---

## 🎨 Diseño UX/UI

### **Principios de Diseño**

1. **Información Objetiva**: Mostrar datos reales, no estimaciones
2. **Claridad Visual**: Estados diferenciados por color
3. **Acción Contextual**: Botones cambian según el contexto
4. **Confirmaciones**: Acciones destructivas requieren confirmación

### **Estados Visuales**

| Estado | Color | Icono | Mensaje |
|--------|-------|-------|---------|
| Inicializado | Violeta/Púrpura | `Database` | Sistema inicializado |
| Normal | Verde/Teal | `CheckCircle2` | Historial guardado: X días |
| Cambio detectado | Amarillo/Amber | `AlertTriangle` | La configuración cambió |

---

## 🔧 Casos de Uso

### **Caso 1: Primer Uso**

```txt
1. Usuario abre la app por primera vez
   → Ve: "Sistema inicializado"
   → No hay datos en localStorage

2. Usuario navega a enero 2026
   → Sistema calcula desde startDate (2026-01-01)
   → NO guarda nada (días futuros)

3. Llega el 2 de enero 2026
   → Sistema guarda automáticamente día 1/01
   → localStorage: 1 día guardado
```

### **Caso 2: Uso Continuo**

```txt
1. Usuario revisa febrero 2026
   → Días de enero (pasados) se cargan desde localStorage
   → Días de febrero se calculan desde startDate
   → Total guardados: 20 días

2. Usuario navega meses futuros
   → Todo se calcula dinámicamente
   → Nada se guarda aún (días futuros)
```

### **Caso 3: Cambio de Configuración**

```txt
1. Admin cambia startDate de "2026-01-01" a "2026-02-01"
   → configHash cambia
   → Sistema detecta discrepancia

2. Usuario ve alerta:
   "⚠️ La configuración cambió"
   [Recalcular ahora]

3. Usuario hace clic en "Recalcular ahora"
   → Confirma: "Esto eliminará 47 días"
   → localStorage se limpia
   → Todo se recalcula desde nuevo startDate
```

---

## ⚡ Optimizaciones

### **Performance**

- ✅ **Caché de estadísticas**: `statsCache` en hook
- ✅ **Búsqueda O(1)**: Record en lugar de Array.find
- ✅ **Batch saves**: `saveHistoricalAssignments` para múltiples días
- ✅ **Memoización**: useMemo en Calendar para evitar recálculos

### **UX**

- ✅ **Hidratación SSR**: Evita flash de contenido
- ✅ **Confirmaciones**: Previene pérdida accidental de datos
- ✅ **Feedback visual**: Estados claros y diferenciados
- ✅ **Responsive**: Textos adaptativos según tamaño de pantalla

---

## 🚨 Errores Corregidos del Sistema Anterior

### ❌ **Problema 1: localStorage Muerto**

**Antes**: Se guardaba estado pero nunca se leía  
**Ahora**: Se lee y usa para días históricos

### ❌ **Problema 2: Información Falsa**

**Antes**: "Rotación continua calculada desde..." (pero se recalculaba todo)  
**Ahora**: "Historial guardado: X días" (información real)

### ❌ **Problema 3: Botón Sin Sentido**

**Antes**: "Recalcular" no hacía nada diferente  
**Ahora**: "Reiniciar historial" o "Recalcular ahora" según contexto

### ❌ **Problema 4: startDate Sin Propósito**

**Antes**: Recalculaba todo desde startDate cada vez  
**Ahora**: startDate es punto de referencia, pasado es inmutable

### ❌ **Problema 5: Sin Detección de Cambios**

**Antes**: No sabías si la configuración cambió  
**Ahora**: Hash detecta cambios y alerta al usuario

---

## 📝 Conclusión

Este sistema ahora cumple con:

✅ **Profesionalismo**: Código limpio, documentado, con propósito claro  
✅ **Seguridad**: Datos históricos protegidos, confirmaciones antes de borrar  
✅ **Claridad**: Usuario sabe exactamente qué está pasando  
✅ **Eficiencia**: localStorage usado correctamente, no código muerto  
✅ **Inmutabilidad**: Pasado no cambia, futuro se adapta  
✅ **Transparencia**: Información objetiva, no engañosa  

El usuario ahora puede **confiar** en que las asignaciones son correctas y sabe **cuándo y por qué** debe recalcular.
