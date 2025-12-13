# Sistema de Rotación Continua de Guardias

## Descripción

Este sistema mantiene la continuidad de la rotación de guardias entre meses, evitando que se reinicie el ciclo cada vez que cambias de mes.

## Cómo funciona

### 1. **Estado Persistente**

- El sistema guarda en `localStorage` el estado de la última asignación de cada mes
- Guarda: última persona asignada, tipo de día (day1/day2/complete), y total de días asignados

### 2. **Continuidad entre Meses**

Cuando generas el calendario de un nuevo mes:

- **Si es el primer mes**: Inicia desde el principio del `rotationOrder`
- **Si es un mes consecutivo**:
  - Si el mes anterior terminó con ciclo completo → empieza con la siguiente persona
  - Si terminó con `day1` → empieza con `day2` de la misma persona
  - Si terminó con `day2` → empieza con la siguiente persona (ciclo completo)
- **Si hay un salto de meses**: Reinicia desde el principio

### 3. **Ejemplo Práctico**

Supongamos el equipo: `["gc", "rv", "mb", "mc", "mp", "fv"]`

**Diciembre 2025 (20 días laborables):**

```cmd
Día 1-2:  gc (day1, day2)
Día 3-4:  rv (day1, day2)
Día 5-6:  mb (day1, day2)
Día 7-8:  mc (day1, day2)
Día 9-10: mp (day1, day2)
Día 11-12: fv (day1, day2)
Día 13-14: gc (day1, day2)
Día 15-16: rv (day1, day2)
Día 17-18: mb (day1, day2)
Día 19-20: mc (day1, day2) ✅ Termina con ciclo completo
```

**Enero 2026 (21 días laborables):**

```cmd
Día 1-2:  mp (day1, day2) ← Continúa con mp (siguiente a mc)
Día 3-4:  fv (day1, day2)
Día 5-6:  gc (day1, day2)
...
```

**Si Diciembre hubiera terminado en 19 días:**

```cmd
Día 19: mc (day1) ✅ Termina solo con day1
```

**Entonces Enero comenzaría:**

```cmd
Día 1:  mc (day2) ← Completa el ciclo de mc
Día 2-3: mp (day1, day2) ← Siguiente persona
...
```

## Componentes del Sistema

### Archivos Creados

1. **`lib/rotationState.ts`**
   - Gestión de localStorage para persistir estado
   - `loadRotationState()`: Carga el estado guardado
   - `saveRotationState()`: Guarda el estado actual
   - `calculateStartingPoint()`: Calcula dónde iniciar el nuevo mes
   - `updateRotationState()`: Actualiza después de generar el schedule

2. **`hooks/useRotationControl.ts`**
   - Hook React para controlar la rotación
   - `resetRotation()`: Reinicia la rotación desde cero
   - `refreshState()`: Recarga el estado actual

3. **`components/RotationControl.tsx`**
   - UI para ver y controlar la rotación
   - Muestra estado actual (último mes, días asignados, ciclo)
   - Botón para reiniciar la rotación

### Archivos Modificados

1. **`lib/scheduleGenerator.ts`**
   - Función `generateBaseAssignments` modificada para:
     - Recibir `year` y `month` como parámetros
     - Calcular punto de inicio desde el estado anterior
     - Manejar ciclos incompletos del mes anterior
     - Guardar el nuevo estado al finalizar

2. **`components/Calendar.tsx`**
   - Agregado listener para evento `rotation-reset`
   - `resetKey` para forzar re-render al resetear

3. **`app/page.tsx`**
   - Incluye `<RotationControl />` en la UI

## Uso

### Navegación Normal

Simplemente navega entre meses con los botones ◀ ▶. El sistema automáticamente:

- Detecta si es un mes consecutivo
- Continúa la rotación desde donde quedó
- Guarda el estado para el próximo mes

### Reiniciar Rotación

Si necesitas empezar desde cero:

1. Click en el botón "Reiniciar Rotación"
2. El sistema borra el estado guardado
3. El próximo mes que generes empezará desde `rotationOrder[0]`

### Ver Estado Actual

El panel `RotationControl` muestra:

- **Último mes procesado**: Ej. "2025-12"
- **Días asignados**: Total de días en el último mes
- **Ciclo**: Si terminó completo, en day1, o en day2

## Ventajas

✅ **Equidad**: Garantiza distribución justa a largo plazo
✅ **Continuidad**: No se pierde el contexto al cambiar de mes
✅ **Flexible**: Permite resetear cuando sea necesario
✅ **Automático**: No requiere configuración manual
✅ **Persistente**: Sobrevive a recargas de página

## Limitaciones

⚠️ El estado se guarda en localStorage:

- Solo disponible en el navegador del usuario
- Si cambias de dispositivo/navegador, se reinicia
- Si borras datos del navegador, se pierde el estado

## Próximos Pasos Potenciales

- [ ] Sincronizar estado en base de datos
- [ ] Compartir estado entre múltiples usuarios
- [ ] Historial de rotaciones pasadas
- [ ] Exportar/importar estado de rotación
