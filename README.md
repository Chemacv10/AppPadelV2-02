# Escuela de Pádel — PWA v1-14

## Cambios v1-14

### Selector custom con ✕ integrado
- **Nivel** (alumnos, grupos, ejercicios): sustituido el `<select>` nativo por selector custom con radio buttons, ✕ para eliminar opciones y campo para añadir nuevas, sin botón "Gestionar" separado.
- **Pistas** (grupos, clases): mismo selector custom; las pistas eliminadas se sincronizan con Supabase al instante.
- **Monitores** (grupos): ídem.
- **Categoría ejercicio**: ahora gestionable con el mismo selector custom.
- **Tipo ejercicio**: selector custom (antes tenía botón "✕ Gestionar" separado).
- **Tipo de clase** (clases): selector custom con ✕ y añadir inline.

### Cobros desde ficha de alumno
- Se oculta el KPI "Alumnos" cuando se accede a cobros filtrado por un alumno concreto (ya estamos en su ficha, no tiene sentido).
- Los chips de tipo de cobro (Mensual, Particular…) en el formulario se han convertido en un `<select>` desplegable limpio.

### Ejercicios — bug activo corregido
- Al guardar un ejercicio editado ya no se resetea el campo `activo` a `true`. Se preserva el valor actual: si el ejercicio estaba marcado como "No usar", sigue inactivo tras guardar.

### Clases — filtros reorganizados en 2 filas
- Fila 1: **Día de la semana** / **Mes** / **Año**
- Fila 2: **Estado** / **Grupo**
- El filtro de Año se rellena automáticamente con los años que hay en la base de datos.

### Stats — ranking por ratio V/PJ
- El ranking global de jugadores ordena ahora por **% de victorias** (victorias / partidos jugados × 100), en lugar de puntos acumulados.
- En caso de empate en ratio, desempata por número de victorias.
- Cada jugador muestra su ratio (ej: 75%) y el detalle (ej: 9V/12PJ).

## Stack
- Frontend: Vanilla JS + HTML/CSS (GitHub Pages)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- PWA: manifest.json + service worker

## Módulos
index · alumnos · grupos · clases · ejercicios · cobros · torneos · pistas-interior · stats
