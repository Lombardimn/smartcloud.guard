# Sistema de Rotación Continua con StartDate

## Descripción

El sistema calcula automáticamente la rotación de guardias usando la fecha `startDate` configurada en `team.json` como punto de referencia matemático. **No depende de meses anteriores** - siempre calcula desde la fecha de inicio.

## Configuración

En `data/team.json`:
```json
{
  "rotationOrder": ["gc", "rv", "mb", "mc", "mp", "fv"],
  "config": {
    "daysPerGuard": 2,
    "workDaysOnly": true,
    "startDate": "2026-01-01"  ← Fecha donde comienza gc (rotationOrder[0])
  }
}
```

## Cómo Funciona

### 1. Cálculo Matemático desde StartDate

Para **cualquier mes**, el sistema:

1. **Cuenta días laborables** desde `startDate` hasta el primer día del mes solicitado
2. **Calcula ciclos completos**: `días ÷ 2` (cada persona tiene 2 días)
3. **Determina la persona**: `ciclos % cantidad_personas`
4. **Determina el tipo de día**: `días % 2` (0=completo, 1=day2 pendiente)

```typescript
// Ejemplo: Ver marzo 2026
startDate = "2026-01-01"
Días laborables desde 2026-01-01 hasta 2026-03-01 = 41 días

Ciclos completos = 41 ÷ 2 = 20 ciclos + 1 día restante
Persona = 20 % 6 = 2 → mb (índice 2 en rotationOrder)
Tipo = 1 día restante → mb debe completar con day2

// Resultado: Marzo comienza con mb (day2)
```

### 2. Ventajas de Este Método

✅ **Determinístico**: El mismo mes siempre da el mismo resultado
✅ **Sin dependencias**: No necesita datos de meses anteriores
✅ **Flexible**: Puedes ver cualquier mes (pasado o futuro)
✅ **Consistente**: Resetear solo recalcula desde startDate
✅ **Preciso**: Respeta feriados y fines de semana

### 3. Ejemplo Completo

**Configuración:**
- `startDate`: "2026-01-01" (jueves)
- `rotationOrder`: ["gc", "rv", "mb", "mc", "mp", "fv"] (6 personas)
- Cada persona: 2 días consecutivos

**Enero 2026:**
```
Días laborables desde startDate = 0
Empieza: gc (índice 0)

01 Ene (Jue) - gc day1
02 Ene (Vie) - gc day2
05 Ene (Lun) - rv day1
06 Ene (Mar) - rv day2
07 Ene (Mié) - mb day1
08 Ene (Jue) - mb day2
09 Ene (Vie) - mc day1
12 Ene (Lun) - mc day2
...
Total: 21 días laborables
```

**Febrero 2026:**
```
Días laborables desde startDate = 21
Ciclos = 21 ÷ 2 = 10 completos + 1 restante
Persona = 10 % 6 = 4 → mp (índice 4)
Pero hay 1 día restante = mc (índice 3) debe completar day2

02 Feb (Lun) - mc day2  ← Completa ciclo de enero
03 Feb (Mar) - mp day1
04 Feb (Mié) - mp day2
05 Feb (Jue) - fv day1
06 Feb (Vie) - fv day2
...
```

**Marzo 2026:**
```
Días laborables desde startDate = 41 (21 ene + 20 feb)
Ciclos = 41 ÷ 2 = 20 completos + 1 restante
Persona = 20 % 6 = 2 → mb (índice 2)
Resto = 1 día → mb debe hacer day2

02 Mar (Lun) - mb day2  ← Completa el ciclo
03 Mar (Mar) - mc day1
04 Mar (Mié) - mc day2
...
```

**Julio 2026 (sin ver meses anteriores):**
```
Días laborables desde 2026-01-01 hasta 2026-07-01 = 126 días
Ciclos = 126 ÷ 2 = 63 completos
Persona = 63 % 6 = 3 → mc (índice 3)
Resto = 0 → Ciclo completo

01 Jul (Mié) - mc day1  ← El sistema sabe exactamente dónde está
02 Jul (Jue) - mc day2
...
```

## Componentes del Sistema

### Archivos Principales

#### `lib/rotationState.ts`
Función clave: `calculateStartingPoint(year, month, rotationOrderLength)`

```typescript
// Calcula días laborables desde startDate
const workdaysSinceStart = calculateWorkdaysSinceStart(startDate, year, month);

// Determina persona y tipo de día
const totalCycles = Math.floor(workdaysSinceStart / 2);
const personIndex = totalCycles % rotationOrderLength;
const remainderDays = workdaysSinceStart % 2;
```

#### `lib/scheduleGenerator.ts`
Usa `calculateStartingPoint()` para saber desde dónde iniciar cada mes.

#### `components/RotationControl.tsx`
Muestra la fecha de inicio configurada y permite recalcular.

### Función de Reset

Al presionar "Recalcular":
1. Limpia el localStorage (estado guardado)
2. Fuerza re-cálculo desde `startDate`
3. **No cambia la lógica** - simplemente recalcula

## Uso

### Navegación Normal
- Cambia de mes libremente con ◀ ▶
- El sistema siempre calcula desde `startDate`
- Puedes ir a cualquier mes (pasado o futuro)

### Ver Información
El panel superior muestra:
- **"Rotación calculada desde: 2026-01-01"** cuando no hay estado guardado
- **"Rotación Continua (desde 2026-01-01)"** con detalles del último mes procesado

### Cambiar Fecha de Inicio
Para usar una fecha diferente:
1. Edita `data/team.json` → `config.startDate`
2. Presiona "Recalcular" en la UI
3. Todo se recalcula desde la nueva fecha

## Casos de Uso

### ✅ Ver mes futuro
```
Hoy: Diciembre 2025
Quiero ver: Julio 2026
Resultado: El sistema calcula automáticamente desde startDate
```

### ✅ Ver mes pasado
```
Hoy: Diciembre 2025
startDate: Enero 2026
Quiero ver: Octubre 2025
Resultado: Como es antes de startDate, inicia desde rotationOrder[0]
```

### ✅ Cambiar startDate
```
Antes: "2026-01-01"
Después: "2025-12-01"
Acción: Editar team.json + "Recalcular"
Resultado: Todo se recalcula desde diciembre 2025
```

## Ventajas vs. Sistema Anterior

| Característica | Sistema Anterior | Sistema con StartDate |
|----------------|------------------|----------------------|
| **Cálculo** | Depende del mes anterior | Calcula desde fecha fija |
| **Navegación** | Solo meses consecutivos | Cualquier mes |
| **Precisión** | Se pierde al saltar meses | Siempre preciso |
| **Reset** | Vuelve a rotationOrder[0] | Recalcula desde startDate |
| **Consistencia** | Varía según localStorage | Siempre igual para misma fecha |

## Detalles Técnicos

### Manejo de Días Laborables
```typescript
function calculateWorkdaysSinceStart(startDate, targetYear, targetMonth) {
  let workDays = 0;
  let current = new Date(startDate);
  let target = new Date(targetYear, targetMonth, 1);
  
  while (current < target) {
    if (isWeekday(current) && !isHoliday(current)) {
      workDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workDays;
}
```

- Excluye sábados y domingos
- Excluye feriados de `holidays.json`
- Cuenta solo días laborables reales

### localStorage (Opcional)
El sistema aún guarda estado en localStorage para:
- Mostrar info del último mes procesado
- Optimización (evita recalcular el mismo mes)
- **No afecta el cálculo** si está vacío

## Preguntas Frecuentes

**Q: ¿Qué pasa si cambio startDate?**  
A: Presiona "Recalcular" y todo se ajusta a la nueva fecha de referencia.

**Q: ¿Puedo ver meses antes de startDate?**  
A: Sí, el sistema inicia desde rotationOrder[0] para fechas anteriores.

**Q: ¿Qué hace "Recalcular"?**  
A: Limpia el cache y fuerza recálculo desde startDate. Útil si cambias configuración.

**Q: ¿Necesito ver todos los meses en orden?**  
A: No, puedes saltar directamente a cualquier mes. El cálculo es independiente.

**Q: ¿Respeta feriados?**  
A: Sí, usa `holidays.json` para excluirlos del conteo de días laborables.
