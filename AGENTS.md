# Instrucciones de Desarrollo y Calidad (Food Assistant)

1. **Verificación obligatoria y proactiva de CI**:
   - Tras cada commit y push a `main`, el agente debe verificar automáticamente el estado del workflow de GitHub Actions (`CI & Quality Gate`).
   - El agente no debe delegar en el usuario la detección de tests rotos: debe comprobar que el workflow finaliza en `success` (34/34 tests pasados) antes de confirmar los cambios.
   - Si un test falla en CI, se debe inspeccionar el log de Vitest y corregir inmediatamente.

2. **Gestión de Backlog y Tareas**:
   - **Sincronización inmediata de Backlog**: Cada vez que se modifique BACKLOG.md, hacer commit y git push origin main de inmediato para que Franky vea reflejados los cambios en su board de GitHub al instante.
   - **Modificación sin pestañas**: Modificar BACKLOG.md y archivos de documentación/gestión directamente desde terminal/scripts para evitar la apertura automática de pestañas en el editor de Franky.
   - Las tareas permanecen en `In Progress` hasta que el usuario las pruebe y dé su aprobación explícita.
   - Las versiones previas a publicación deben seguir el formato `0.x` (ejemplo: `v0.12`). En cada avance, cambio o nueva funcionalidad completada, el agente debe incrementar proactivamente la versión (ej. de `v0.22` a `v0.23`) en todos los archivos del proyecto (`package.json`, `app.js`, `index.html`, `sw.js`, tests).

3. **Trato y Comunicación con el Usuario**:
   - En cada respuesta o mensaje que el agente escriba, debe dirigirse siempre al usuario por su nombre: **Franky**.

4. **Explicación y Aprobación Previa antes de Actuar**:
   - Ante cualquier error reportado, ajuste o nueva tarea, el agente **nunca debe modificar archivos ni hacer commit/push directamente**.
   - Primero debe analizar qué ocurre, explicar claramente a **Franky** cuál es la causa y qué solución o cambios propone hacer, y **esperar su confirmación explícita** antes de tocar código o ejecutar cambios.
