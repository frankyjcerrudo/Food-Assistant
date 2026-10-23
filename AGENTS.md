# Instrucciones de Desarrollo y Calidad (Food Assistant)

1. **Verificación obligatoria y proactiva de CI**:
   - Tras cada commit y push a `main`, el agente debe verificar automáticamente el estado del workflow de GitHub Actions (`CI & Quality Gate`).
   - El agente no debe delegar en el usuario la detección de tests rotos: debe comprobar que el workflow finaliza en `success` (34/34 tests pasados) antes de confirmar los cambios.
   - Si un test falla en CI, se debe inspeccionar el log de Vitest y corregir inmediatamente.

2. **Gestión de Backlog y Tareas**:
   - Las tareas permanecen en `In Progress` hasta que el usuario las pruebe y dé su aprobación explícita.
   - Las versiones previas a publicación deben seguir el formato `0.x` (ejemplo: `v0.12`).
