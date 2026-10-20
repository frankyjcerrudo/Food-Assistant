# Build Log: Food Assistant (replica-build)

## Hito 1: Vertical Slice & Core Loop
- **App Shell & Navegación**: Barra superior con marca y badge de Gemini, barra de navegación inferior móvil para pantallas (Hoy, Recetas, Plan, Compra, Chef IA, Ajustes).
- **Mis Recetas**: Catálogo precargado de recetas variadas (pasta, carnes, pescados, legumbres) con imágenes de alta calidad, buscador en vivo y filtros por etiquetas.
- **Detalle y Escalado de Porciones**: Modal completo de receta con recálculo dinámico de cantidades según número de comensales.
- **Modo Cocina Paso a Paso**: Interfaz inmersiva a pantalla completa con texto grande para cocinar cómodamente y temporizadores con aviso sonoro Web Audio API.
- **Planificador Semanal**: Vista de 7 días (Lunes a Domingo) con asignación rápida de recetas para comidas y cenas.
- **Lista de la Compra Inteligente por Pasillos**: Agregación de ingredientes desde el planificador semanal o recetas individuales, unificación de cantidades y clasificación automática en 9 pasillos de supermercado (Frutas/Verduras, Carnicería, Lácteos, etc.).
- **Asistente Gemini Chef Copilot**: Chat integrado con Google Gemini API (`gemini-2.5-flash`), con soporte para planificación automática semanal y creación de recetas según ingredientes de la nevera.
- **Importador Universal**: Modal para pegar enlaces o textos y convertirlos en recetas limpias.
- **PWA Offline**: `manifest.json` y `sw.js` para instalación y uso sin cobertura.
