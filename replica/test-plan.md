# Test Plan: Food Assistant (replica-test)

Build: 3cad0ce  Date: 2026-10-20  Env: Local Web Browser / PWA (Standalone / Offline)

| Case ID | Flow | Type | Steps | Expected | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F01-H1** | Importar Receta | Happy | Clic en "Importar", pegar texto/URL, clic en "Extraer con Gemini" | Receta parseada con título, porciones, ingredientes por pasillo y guardada en Mis Recetas | PASS |
| **F01-E1** | Importar Receta | Edge: Input vacío | Abrir modal de importar y hacer clic en Extraer sin ingresar texto ni URL | Alerta de validación impidiendo la extracción | PASS |
| **F01-E2** | Importar Receta | Edge: Sin clave API | Extraer receta sin haber configurado clave de Gemini en Ajustes | Fallback a modo demo con simulación estructurada sin romper la UI | PASS |
| **F02-H1** | Planificación Semanal | Happy | Clic en "Autoplanificar Semana" en Plan o pedirlo al Chef IA | Asigna automáticamente recetas equilibradas a Almuerzos y Cenas de Lunes a Domingo | PASS |
| **F02-E1** | Planificación Semanal | Edge: Asignación manual | Tocar ranura vacía, seleccionar plato del catálogo | Ranura actualizada con título y miniatura de la receta elegida | PASS |
| **F02-E2** | Planificación Semanal | Edge: Quitar plato | Clic en el botón "✕" de una ranura ocupada | Ranura vuelve a estado vacío con botón "+ Asignar receta" | PASS |
| **F03-H1** | Generar Lista Compra | Happy | Clic en "Generar Lista" en el planificador semanal | Todos los ingredientes de las recetas planificadas se agrupan en sus pasillos correspondientes | PASS |
| **F03-E1** | Generar Lista Compra | Edge: Ingredientes duplicados | Dos recetas usan "Cebolla" o "Aceite de oliva" | Las cantidades se suman automáticamente en un solo ítem | PASS |
| **F03-E2** | Generar Lista Compra | Edge: Plan vacío | Clic en "Generar Lista" sin recetas en el calendario | Mensaje informativo indicando que no hay recetas planificadas | PASS |
| **F04-H1** | Compra en Supermercado | Happy | Tocar casilla de verificación de un ingrediente | El artículo se tacha, se atenúa visualmente y el contador se reduce | PASS |
| **F04-E1** | Compra en Supermercado | Edge: Añadir ítem manual | Escribir "Leche desnatada 1L" y pulsar Enter | Se clasifica automáticamente en el pasillo "Lácteos y Huevos" | PASS |
| **F04-E2** | Compra en Supermercado | Edge: Copiar lista | Clic en "📋 Copiar" | Formato limpio con iconos de pasillos y casillas copiado al portapapeles | PASS |
| **F05-H1** | Modo Cocina | Happy | Abrir receta, clic en "Empezar Modo Cocina Paso a Paso" | Vista a pantalla completa, texto grande, navegación Anterior/Siguiente | PASS |
| **F05-E1** | Modo Cocina | Edge: Temporizador sonoro | Paso con tiempo (ej. 9 min) -> Clic en Iniciar | Cuenta atrás en vivo y chime sonoro al llegar a cero vía Web Audio API | PASS |
| **F05-E2** | Modo Cocina | Edge: Escalar raciones | Cambiar comensales de 2 a 4 en la ficha de receta | Cantidades de ingredientes recalculadas proporcionalmente (x2) | PASS |
| **F06-H1** | Ajustes y Persistencia | Happy | Guardar clave de Gemini, recargar la página | La clave y estado persisten en LocalStorage | PASS |
| **F06-E1** | Ajustes y Persistencia | Edge: Exportar / Importar | Exportar backup JSON, restablecer demo, importar archivo | Catálogo y planes restaurados íntegramente | PASS |
