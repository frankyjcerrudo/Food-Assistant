# 📋 Backlog del Producto - Food Assistant

> **Metodología**: Kanban / MoSCoW (Must, Should, Could, Won't)  
> **Estado**: Activo  
> **Versión Actual**: v0.52  
> **Última actualización**: Octubre 2026 (implementación US-01: tabla de valores nutricionales en tarjetas de recetas del catálogo v0.52)  

---

## 🧭 Leyenda de Prioridades y Estados
* **Prioridad**: 🔴 `Alta / Must Have` | 🟡 `Media / Should Have` | 🟢 `Baja / Could Have`
* **Estado**: `Backlog` | `Ready for Dev` | `In Progress` | `QA / Review` | `Done`

---

## 🥗 Épica 1: Gestión Nutricional y Macro-Nutrientes

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-01** | Contador de Calorías y Macronutrientes por plato | 🔴 Alta | `In Progress` | • Mostrar desglose de Kcal, Proteínas, Carbohidratos y Grasas por ración individual en la ficha de cada receta.<br>• Selector de porciones para ajustar cantidades de ingredientes en cocina/compra sin alterar el aporte por persona.<br>• Tabla compacta de valores nutricionales en cada tarjeta de receta en el catálogo de Recetas.<br>• Resumen diario de macros personal en la vista "Hoy".<br>• Detección flexible de "Alta en Proteínas" (>=20g o >=25% de kcal proteicas o batidos/suplementos). |
| **US-02** | Filtros dietéticos y selector de etiquetas por Chips interactivos | 🟡 Media | `Done` | • Sustituir el input de texto libre por selector de chips interactivos en recetas y catálogo.<br>• Categorías y etiquetas dietéticas predefinidas (Keto, Vegano, Sin Gluten, Rápida, Horno, Tupper) y creación de etiquetas personalizadas.<br>• Filtro múltiple combinado con el buscador de recetas.<br>• Advertencias automáticas si un plato asignado al plan incumple el filtro dietético activo.<br>• **Auto-etiquetado inteligente**: Botón en Ajustes para analizar recetas guardadas y asignar chips oportunos (dietéticos, prácticos y momentos) según ingredientes y preparación.<br>• *Consolida US-21.*<br>• *Estado: Completado, probado y aprobado por Franky (v0.45-v0.49): chips interactivos, emojis solo en etiquetas dietéticas, `Alta en Proteínas`, inferencia de `Almuerzo`/`Cena` y suite completa en `test.html`.* |
| **US-03** | Objetivos nutricionales diarios del usuario | 🟢 Baja | `Backlog` | • En Ajustes, configurar meta diaria de Kcal y Proteína.<br>• Barra de progreso en vista "Hoy" con porcentaje de cumplimiento. |

---

## 📅 Épica 2: Planificador Semanal y Organización

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-04** | Duplicar o copiar plan de semana anterior | 🔴 Alta | `Backlog` | • Botón "Copiar semana anterior" en el planificador.<br>• Confirmación de sobreescritura con modal seguro.<br>• Respeto de los momentos de comida personalizados. |
| **US-05** | Motor de Calendario Semanal ISO 8601 con navegación entre semanas | 🔴 Alta | `Done` | • El calendario semanal empieza siempre en Lunes (ISO 8601) con fin de semana claramente agrupado al final.<br>• Navegación fluida entre semanas (+1 / -1 semana) manteniendo la fecha actual identificada.<br>• Persistencia dinámica por claves de fecha ISO `YYYY-MM-DD` (creando días bajo demanda sin duplicados ni slots desordenados).<br>• *Estado: Completado y validado en v0.24-v0.25. Consolida US-22. Relacionado: BUG-07, BUG-08, BUG-17.* |
| **US-14** | Comidas flexibles en planificador (Desayunos, meriendas, snacks) | 🔴 Alta | `Done` | • Soporte configurable para personas que comen >3 veces al día.<br>• Habilitar/deshabilitar Desayuno, Media Mañana, Almuerzo, Merienda, Cena, Post-entreno.<br>• Interfaz responsiva que acomode las nuevas filas sin scroll horizontal roto. |
| **US-19** | Mover recetas por la semana y cambiar momentos | 🟡 Media | `Backlog` | • Drag & drop táctil o menú contextual "Mover a..." en cada tarjeta.<br>• Permitir mover de un día a otro o de almuerzo a cena sin tener que borrar y buscar de nuevo. |
| **US-65** | Planificación eficiente: Modo "Sobras" (cocinar x2) y Batch Cooking | 🟢 Baja | `Backlog` | • **Modo Sobras**: Opción "Cocinar ración doble" al asignar un plato, rellenando automáticamente un slot posterior con la misma receta marcada como "Sobras" sin duplicar la compra.<br>• **Sugerencias Batch Cooking**: Propuesta inteligente (con o sin IA) para preparar bases o cocinar 2-3 platos en paralelo optimizando tiempo y energía.<br>• *Consolida US-06.* |
| **US-66** | Sugerencias de productos de temporada | 🟢 Baja | `Backlog` | • Tabla estática de frutas y verduras por mes.<br>• Indicador "De temporada" en recetas que las usan.<br>• Sugerencia opcional en el planificador. |

---

## 🛒 Épica 3: Lista de la Compra y Despensa Inteligente

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-07** | Control de Despensa / Stock doméstico | 🟡 Media | `Backlog` | • Pestaña o sección de "Mi Despensa".<br>• Al enviar ingredientes a la compra, desmarcar automáticamente los que ya tengamos en casa.<br>• Alerta de ingredientes próximos a caducar. |
| **US-08** | Compartir lista en tiempo real por enlace o WhatsApp | 🔴 Alta | `Backlog` | • Formateo enriquecido para WhatsApp o mensajería agrupado por categorías.<br>• Sincronización colaborativa compartida en Supabase con familiares/pareja. |
| **US-09** | Estimación aproximada de coste de la compra | 🟢 Baja | `Backlog` | • Campo opcional de precio aproximado por ingrediente.<br>• Totalizador estimado en la cabecera de la lista. |
| **US-13** | Previsualización y edición de ingredientes antes de añadir a la compra | 🔴 Alta | `Done` | • Al pulsar "Añadir a lista de la compra" (desde el planificador o receta), abrir un modal previo.<br>• Desglose visual separado por receta.<br>• Checkbox por ingrediente para desmarcar lo que no se quiera añadir.<br>• Ajuste de porciones y cantidades antes de confirmar el volcado final. |
| **US-20** | Autocompletado inteligente de ingredientes y categoría automática | 🟡 Media | `Done` | • Sugerencias predictivas al tipear el nombre del ingrediente.<br>• Clasificación automática en pasillo/categoría (Verdulería, Carnicería, Lácteos, Despensa).<br>• Icono visual distintivo por ingrediente o grupo.<br>• *Estado: Completado y validado en v0.44.* |
| **US-33** | Alternancia de Vistas en Lista de la Compra (Por Pasillo vs Receta) con Normalización de Unidades | 🔴 Alta | `Backlog` | • Selector o toggle en la cabecera de la lista de la compra: **Vista Por Pasillos** (supermercado) vs **Vista Por Receta** (por plato planificado).<br>• **Conversión y normalización de unidades**: Sumar cantidades compatibles (500 g + 1 kg = 1,5 kg; ml/cl/l) y mostrar la unidad más legible (1500 g → 1,5 kg).<br>• **Fusión inteligente de texto**: Unificar singular/plural y acentos al fusionar ("Tomate" = "Tomates") para evitar duplicados en ambas vistas.<br>• *Consolida US-64.* |
| **US-34** | Buscador Inverso "¿Qué cocino hoy con lo que tengo en la nevera?" | 🔴 Alta | `Backlog` | • Interfaz rápida para marcar o tipear 2-3 ingredientes que el usuario tiene disponibles en casa.<br>• Filtro dinámico en el catálogo de recetas ordenando por porcentaje de coincidencia de ingredientes.<br>• Indicador visual en cada tarjeta (ej: *"Tienes 4 de 5 ingredientes"*).<br>• Resuelve la principal queja y demanda no atendida en apps competidoras como ReciMe. |

---

## 🍳 Épica 4: Catálogo de Recetas, UX y Experiencia de Usuario

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-10** | Instalación PWA Completa (Manifiesto, Iconos de marca y Guía de instalación) | 🔴 Alta | `Backlog` | • Configurar `manifest.json` completo con iconos PNG de 192 y 512 px + versión `maskable`.<br>• Coherencia de marca con `theme-color` igual en HTML y manifest, y favicon oficial.<br>• Capturar evento `beforeinstallprompt` y ofrecer botón nativo "Instalar App en tu pantalla de inicio" en Ajustes.<br>• *Consolida US-56. Prerrequisito para US-26 y US-59. Relacionado: BUG-06.* |
| **US-11** | Modo Cocina con reconocimiento de voz (manos libres) | 🟢 Baja | `Backlog` | • Web Speech API para decir "Siguiente" o "Pausar" sin tocar la pantalla con las manos manchadas. |
| **US-12** | Soporte Multilenguaje (i18n ES / EN) | 🟡 Media | `Backlog` | • Diccionario de cadenas para alternar entre Español e Inglés en Ajustes. |
| **US-15** | Importador de recetas Universal (Sin IA): Schema.org + Proxy Local + Fuente Original | 🔴 Alta | `Done` | • **Modo estándar cero-coste**: Extractor de JSON-LD (`schema.org/Recipe`) desde URL de cocina con soporte para grafos `@graph`.<br>• **Transporte robusto**: Endpoint `/api/fetch` en servidor local para descarga directa sin bloqueos de CORS ni Cloudflare.<br>• **Atribución de Fuente**: Guardar `sourceUrl` y dominio origen (`sourceDomain`) y mostrarlos en tarjetas y modal de detalle con enlace directo a la web original.<br>• **Modo texto/notas**: Parser de texto estructurado de recetas (ingredientes y pasos).<br>• Previsualización en vivo antes de guardar.<br>• *(Modo IA desacoplado en US-30 para monetización Premium)*.<br>• *Estado: Completado y validado en v0.22. Auditoría exhaustiva en 9 portales gastronómicos (18 recetas), extracción OpenGraph/Twitter Cards, soporte Thermomix/Robot y asistencia de portapapeles.* |
| **US-16** | Gestión flexible de imágenes de recetas | 🟡 Media | `Backlog` | • Imagen opcional: Si no se añade, mostrar avatar/patrón gráfico elegante de comida.<br>• Soporte para subir foto propia desde archivo o cámara.<br>• Campo para pegar URL externa limpia.<br>• Botón opcional de generar foto con IA. |
| **US-18** | Sistema de diálogos y modales accesibles con `<dialog>` nativo (Material 3) | 🔴 Alta | `Backlog` | • Reemplazar los feos `alert()`, `confirm()` y `prompt()` del navegador.<br>• Migración a elemento `<dialog>` nativo con `showModal()`, backdrop blur, cierre por tecla Esc y foco atrapado/devuelto al disparador.<br>• Botones de acción claros, accesibilidad (ARIA) y animaciones suaves con elevación visual.<br>• *Consolida US-55.* |
| **US-28** | Rediseño enfocado de la pantalla "Hoy" (Zero Clutter) | 🔴 Alta | `Done` | • **Eliminar la tarjeta "Hoy"**: Suprimir el bloque hero y las estadísticas redundantes (Recetas, En Menú, Por Comprar) para aprovechar al máximo el espacio en pantalla.<br>• **Retirar Acciones Frecuentes**: Quitar los accesos directos a "Lista de la Compra" y "Asistente Gemini" por ser redundantes con la barra de navegación inferior.<br>• **Foco en Comidas Planificadas**: Cabecera limpia con fecha del día y presentación clara de las comidas asignadas (Desayuno, Almuerzo, Merienda, Cena).<br>• **Añadir otra comida**: Botón accesible y visible para añadir momentos de comida extra (snacks, post-entreno) o asignar platos rápidamente.<br>• **Optimización móvil**: Experiencia directa sin ruido visual (*above the fold*) en dispositivos móviles.<br>• *Estado: Completado y validado en v0.23.* |
| **US-31** | Colecciones y Libros de Recetas Personalizados (Cookbooks / Carpetas) | 🟡 Media | `Backlog` | • Crear carpetas temáticas ilimitadas (ej: "Favoritas de Mamá", "Cenas Rápidas", "Postres", "Airfryer", "Chef X").<br>• Asignar una receta a una o múltiples colecciones.<br>• Selector de libro en la cabecera del catálogo para navegar entre carpetas con 1 toque (el patrón visual más elogiado en ReciMe). |
| **US-32** | Notas Personales y Ajustes Caseros en Ficha de Receta | 🟡 Media | `Backlog` | • Sección editable de "Mis notas y trucos" en el detalle de la receta (ej: *"Poner 30g menos de azúcar"*, *"Hornear 5 min más"*).<br>• Persistencia local y en la nube sin sobreescribir los datos originales de la receta importada.<br>• Visualización destacada en el Modo Cocina para no olvidar los ajustes al cocinar. |
| **US-58** | Previsualización editable al importar y revisión completa previa al guardado | 🔴 Alta | `Done` | • Al extraer una receta (web o texto), se abre directamente la pantalla completa de la receta en Modo Revisión (Borrador).<br>• Permite revisar foto, porciones, tiempos, ingredientes agrupados por pasillo, pasos y fuente original antes de guardar.<br>• Acciones claras: "Guardar en Recetas", "Editar receta" (permite modificar o corregir cualquier campo en borrador) o "Cancelar importación" (descarta el borrador sin tocar la colección).<br>• *Relacionado: US-15.* |
| **US-59** | Compartir enlaces a la app (Web Share Target) | 🟡 Media | `Backlog` | • `share_target` en `manifest.json`.<br>• Al compartir una URL desde Chrome/Instagram/TikTok, la app abre el importador con el enlace ya rellenado.<br>• Requiere la PWA instalada (depende de BUG-06 y US-10). |
| **US-60** | Pantalla siempre encendida en Modo Cocina (Wake Lock) | 🟢 Baja | `Backlog` | • Solicitar `navigator.wakeLock.request('screen')` al entrar en Modo Cocina.<br>• Liberar al salir y readquirir al volver a la pestaña (`visibilitychange`).<br>• Degradación silenciosa si el navegador no lo soporta. |
| **US-61** | Varios temporizadores simultáneos con aviso | 🟢 Baja | `Backlog` | • Lanzar más de un temporizador a la vez (horno + sartén).<br>• Cálculo por marca de tiempo de fin (no se retrasa con la pantalla bloqueada).<br>• Aviso por sonido, vibración y notificación aunque la app esté en segundo plano. |
| **US-62** | Escalado de raciones dentro del Modo Cocina | 🟢 Baja | `Backlog` | • Selector de raciones en el Modo Cocina.<br>• Las cantidades mostradas en ingredientes y pasos se ajustan al valor elegido. |
| **US-63** | Historial "Cocinado X veces" y valoración personal | 🟢 Baja | `Backlog` | • Registrar cada vez que se completa el Modo Cocina.<br>• Valoración de 1-5 estrellas en la ficha.<br>• Ordenar por favoritas o "hace tiempo que no la cocinas". |
| **US-67** | Importador Masivo de Colecciones y Migración de Recetas (Samsung Food / JSON Backup) | 🟡 Media | `Backlog` | • Selector de archivo JSON en Ajustes o Catálogo para importar copias de seguridad masivas (ej. exportaciones de Samsung Food / Whisk).<br>• Modal de previsualización y resumen previo: muestra total de recetas a importar, detección inteligente de duplicados por título o URL, y advertencias (sin pasos o con pocos ingredientes).<br>• Procesamiento por lotes desatendido con barra de progreso: normalización automática de ingredientes (`RecipeParser.parseIngredientLine`) y asignación de pasillos de supermercado (`categorizeIngredientAisle`).<br>• Filtro opcional para desmarcar recetas no deseadas antes de confirmar la importación.<br>• Soporte de imágenes remotas y preservación de fuentes originales (Instagram, blogs gastronómicos).<br>• *Relacionado: US-15, US-20.* |

---

## 🤖 Épica 5: Ecosistema de Inteligencia Artificial & Control Total

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-17** | Asistente IA Conversacional con Function Calling (Control total) | 🟡 Media | `Backlog` | • Interfaz conversacional (Chat/Voz accesible globalmente en la app).<br>• Capacidad de ejecutar acciones reales en la app mediante Function Calling:<br>  - Crear, editar o borrar recetas.<br>  - Reorganizar el plan semanal ("ponme ensalada el martes y mueve el pollo al jueves").<br>  - Añadir o tachar ingredientes de la lista de la compra.<br>  - Consultar inventario de despensa.<br>• Arquitectura desacoplada: Iniciar con Gemini (`@google/genai`) y permitir conectar otros proveedores (OpenAI, Claude, Ollama) a petición del usuario. |
| **US-30** | Importador Inteligente Multimodal con IA (Nivel Premium ⭐) | 🟡 Media | `Backlog` | • **OCR y Digitalización Fotográfica**: Escaneo de recetas de revistas, libros de cocina o manuscritos mediante cámara/foto procesada con Gemini multimodal.<br>• **Extracción en Redes Sociales sin texto**: Transcripción de audio (Speech-to-Text) o análisis visual en Reels / TikToks / YouTube cuando el creador no incluye ingredientes en la descripción.<br>• **Reestructuración y Limpieza Gastronómica**: Detección inteligente de alérgenos, escalado adaptativo y corrección de instrucciones confusas en recetas no estándar.<br>• **Monetización**: Módulo exclusivo para usuarios de pago (Premium) para rentabilizar el consumo de tokens y garantizar la viabilidad económica del proyecto. |

---

## ✨ Épica 6: Ingeniería de Diseño, Micro-interacciones & Motion

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-23** | Design System Moderno: Tokens, Sombras Multicapa, Tipografía y Micro-interacciones Táctiles | 🔴 Alta | `Backlog` | • **Tokens y Estructura**: Bordes sutiles alfa translúcidos (`border: 1px solid rgba(255, 255, 255, 0.08)`), escala tipográfica editorial con ratio 2.5× (`letter-spacing: -0.02em`) y espaciado en múltiplos estrictos de 8px (8pt grid).<br>• **Profundidad Visual**: Sombras compuestas en 2 capas (luz ambiental + foco directo) para una elevación visual realista.<br>• **Micro-interacciones y Motion (Emil Kowalski)**: Curvas de animación CSS cubic-bezier personalizadas, efecto táctil `:active { transform: scale(0.97); }` en botones, tarjetas y chips, apertura fluida de modales/drawers (`scale(0.95)` a `scale(1)`) y eliminación de `transition: all` para garantizar 60/120 fps.<br>• *Consolida US-24. Relacionado: US-49.* |
| **US-25** | Placeholders artísticos y estados vacíos ilustrados (Meng To / Honest Assets) | 🟡 Media | `Backlog` | • Fallback elegante para recetas sin imagen (patrón visual SVG gastronómico con gradiente suave).<br>• Ilustraciones en SVG minimalista para estados vacíos de Despensa, Lista de compra y Plan semanal.<br>• Carga progresiva suave para evitar saltos de layout (*CLS - Cumulative Layout Shift*) al cargar fotos. |

---

## 📱 Épica 7: Ecosistema Móvil Android & Distribución

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-26** | Publicación en Google Play Store (TWA / Capacitor AAB) | 🟢 Baja | `Backlog` | • Configurar empaquetado nativo para Android (Trusted Web Activity / Bubblewrap o Capacitor).<br>• Generar paquete `.aab` (Android App Bundle) firmado con keystore de producción.<br>• Configurar `assetlinks.json` en el dominio para verificar propiedad y navegación a pantalla completa.<br>• Cumplir políticas de Google Play Store (icono adaptativo 512×512, capturas y política de privacidad). |
| **US-27** | Widget de Android para Pantalla de Inicio (Plan del día y Lista rápida) | 🟢 Baja | `Backlog` | • Widget para el escritorio de Android con diseño nativo (Material You / Glance).<br>• Mostrar en tiempo real las comidas programadas para el día de hoy ("Hoy toca...").<br>• Botón de acceso directo para abrir la receta actual o añadir a la lista de la compra.<br>• Sincronización en segundo plano con el almacenamiento local / Supabase. |

---

## 👥 Épica 8: Comunidad y Recetas Compartidas (Social Hub)

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-29** | Hub de Recetas Comunitarias (Explorar, publicar y guardar recetas de otros usuarios) | 🟡 Media | `Backlog` | • **Pestaña / Sección Comunidad**: Acceso dentro de la app para explorar recetas compartidas públicamente por otros usuarios y cocineros.<br>• **Publicar receta propia**: Acción en la ficha o menú de cada receta personal para "Compartir en la comunidad" (publicando alias del autor, título, foto, tiempos, ingredientes y pasos).<br>• **Guardar en mis recetas**: Botón de 1 clic para clonar/guardar cualquier receta comunitaria directamente en la biblioteca privada y editable del usuario.<br>• **Interacciones sociales ligeras**: Contador de "Me gusta" (❤️) o guardados, buscador por ingredientes o etiquetas populares, y enlace directo para compartir recetas vía web/redes.<br>• **Backend y Seguridad (Supabase)**: Tabla pública `community_recipes` con políticas Row Level Security (RLS) para permitir lectura global y publicación/edición solo por el autor autenticado. |
---

## ☁️ épica 9: Sincronización en la Nube y Cuenta Multi-Dispositivo

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-35** | Sincronización Total y Transparente Multi-Dispositivo con Supabase | 🔴 Alta | `Done` | • **Descarga y Fusión Automática**: Al iniciar sesión o abrir la app con sesión activa en cualquier dispositivo, descarga y fusiona en segundo plano las recetas del usuario (`recipes`), el planificador semanal (`meal_plans`) y la lista de la compra (`shopping_items`).<br>• **Sincronización en Tiempo Real al Mutar**: Subida instantánea (`upsert`) a Supabase al crear/editar/importar recetas (con `sourceUrl` y dominio), cambiar el plan semanal o modificar/tachar ingredientes en la lista.<br>• **Experiencia Transparente e Inadvertida**: Cambiar de teléfono a PC o tablet muestra exactamente los mismos datos sin necesidad de exportaciones ni importaciones manuales.<br>• **Resiliencia Local-First (Offline)**: Si el dispositivo no tiene red, sigue operando al 100% en `localStorage` y envía automáticamente los cambios pendientes a Supabase al recuperar la conexión.<br>• **Indicador Visual Discreto**: Feedback sutil del estado de sincronización en la barra superior o ajustes.<br>• *Estado: Completado y validado en v0.38 con subidas en lote, fallback dinámico de esquema y propagación bidireccional de borrados. Consolida y resuelve BUG-21, BUG-22, BUG-23, BUG-24 y US-45.* |

> **Bloqueantes de US-35 resueltos**: BUG-21, BUG-22, BUG-23 y BUG-24 (completados y verificados en v0.38).

---

## 🔒 Épica 10: Seguridad

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-36** | Escapado de HTML y validación de URLs (XSS almacenado) | 🔴 Alta | `Backlog` | • Función `escapeHtml()` aplicada a toda interpolación en plantillas `innerHTML` (título, descripción, ingredientes, etiquetas, compra, slots, editor).<br>• `imageUrl` y `sourceUrl` solo se aceptan si `new URL()` devuelve protocolo `http:`/`https:` (bloquea `javascript:`).<br>• Validar la estructura de los backups JSON antes de importarlos.<br>• Tests con cargas XSS conocidas. |
| **US-37** | Sanear la salida de Gemini y los mensajes de error | 🔴 Alta | `Backlog` | • Escapar la respuesta antes de aplicar el formato markdown mínimo (negritas, saltos).<br>• `err.message` mostrado con `textContent`.<br>• Prueba con prompt injection en títulos de recetas. |
| **US-38** | Eliminar el login simulado y datos personales en el código | 🟡 Media | `Backlog` | • Sin cliente Supabase, no se muestra "cuenta conectada" (o se etiqueta claramente como "Demo").<br>• Eliminar el email personal escrito en `handleGoogleAuth`. |
| **US-39** | Proteger la clave de Gemini | 🟡 Media | `Backlog` | • Enviar la clave en la cabecera `x-goog-api-key`, no en la URL.<br>• A medio plazo: proxy en Supabase Edge Function para no exponer la clave en el cliente.<br>• *Relacionado: US-30 (Premium).* |
| **US-40** | Endurecer el servidor local (`server.ps1`) | 🟡 Media | `Backlog` | • `Access-Control-Allow-Origin` limitado a `http://localhost:3000`.<br>• `/api/fetch` rechaza destinos en IPs privadas/`localhost` (SSRF).<br>• Comprobar que la ruta de archivo resuelta está dentro de `$root` (path traversal).<br>• Reutilizar un único `HttpClient`; añadir MIME de `.webmanifest`, `.ico`, `.jpg`, `.webp`. |
| **US-41** | Fijar versión y SRI de dependencias CDN | 🟢 Baja | `Backlog` | • Script de Supabase con versión exacta (no `@2`) y atributo `integrity`. |

---

## 🧱 Épica 11: Calidad Técnica y Arquitectura

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-42** | Dividir `app.js` en módulos ES | 🟡 Media | `Backlog` | • Módulos separados: `parser.js`, `store.js`, `sync.js`, `ai.js`, `views/*.js`.<br>• Los tests usan `import` en lugar de `new Function(appCode)()`.<br>• CI en verde sin cambios funcionales. |
| **US-43** | Delegación de eventos en lugar de `onclick="app.…"` | 🟡 Media | `Backlog` | • Atributos `data-action` + un listener por contenedor.<br>• Sin dependencia de `window.app` global.<br>• Permite una Content Security Policy sin `unsafe-inline`. |
| **US-44** | Renderizado selectivo | 🟢 Baja | `Backlog` | • `render()` solo pinta la vista activa y las afectadas por el cambio. |
| **US-45** | Identificadores únicos con `crypto.randomUUID()` | 🟡 Media | `Done` | • Sustituir `Date.now()` y `Math.random().substr()` en recetas, ingredientes, slots y artículos de la compra.<br>• Los artículos de la compra pasan a tener `id` (requisito del esquema).<br>• Migración transparente de los datos existentes.<br>• *Estado: Completado y validado en v0.38 con `generateId(prefix)` y migración automática de colecciones locales.* |
| **US-46** | Migrar el almacenamiento local a IndexedDB | 🟡 Media | `Backlog` | • Sustituir `localStorage` (síncrono, ~5 MB) por IndexedDB.<br>• Migración automática de las claves `fa_*`.<br>• Prepara US-16 (fotos propias) y la cola offline de US-35. |
| **US-47** | Versión centralizada | 🟢 Baja | `Backlog` | • Una sola fuente de versión (constante o script de bump) para `sw.js`, `index.html`, `test.html` y `package.json`.<br>• `package.json` en formato `0.x` según AGENTS.md. |
| **US-48** | Lint real en CI | 🟢 Baja | `Backlog` | • ESLint + Prettier configurados; `npm run lint` deja de ser un `echo`.<br>• Paso de lint en el workflow `CI & Quality Gate`. |
| **US-49** | Mover estilos en línea a clases CSS | 🟢 Baja | `Backlog` | • Eliminar los `style="…"` de las plantillas JS en favor de clases de `styles.css`.<br>• *Relacionado: US-23.* |
| **US-50** | Arquitectura y Cobertura Ampliada de Tests Unitarios | 🟡 Media | `Backlog` | • **Arquitectura de pruebas**: Evaluar arnés en navegador (`test.html`) vs ejecución unificada con Vitest/Node para CI robusto.<br>• Tests de cálculo de fechas locales y motor de semana ISO (BUG-07, BUG-08).<br>• Tests de escalado de la compra y normalización de unidades (BUG-12, US-33).<br>• Tests de seguridad y escapado HTML (US-36).<br>• Tests de sincronización con cliente Supabase simulado (US-35).<br>• *Consolida US-51.* |
| **US-52** | Proxy de importación propio (Supabase Edge Function) | 🟡 Media | `Backlog` | • Sustituir r.jina.ai / codetabs / corsproxy por un endpoint propio.<br>• Funciona en producción HTTPS (no solo con `server.ps1` local).<br>• Límite de tamaño, timeout y bloqueo de IPs privadas.<br>• *Relacionado: US-15.* |

---

## ♿ Épica 12: Accesibilidad y PWA

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-53** | Permitir zoom | 🟡 Media | `Backlog` | • Eliminar `maximum-scale=1, user-scalable=no` del viewport (WCAG 1.4.4). |
| **US-54** | Elementos interactivos accesibles por teclado | 🟡 Media | `Backlog` | • Slots, tarjetas de receta y filas del selector pasan a `<button>` o tienen `role="button"`, `tabindex="0"` y soporte de Enter/Espacio.<br>• Foco visible. |
| **US-57** | Optimizar la carga de Material Symbols | 🟢 Baja | `Backlog` | • Fijar ejes (`opsz`, `wght`, `FILL`, `GRAD`) o usar `icon_names=` para reducir el peso de la fuente. |

---

## 🐛 Historial y Registro de Defectos (Bugs)

| ID | Defecto | Severidad | Estado | Resolución |
| :--- | :--- | :---: | :---: | :--- |
| **BUG-01** | Truncado de nombre de usuario en login móvil | 🔴 Alta | `Done` | Reducido a primer nombre/alias con ellipsis en header móvil (`v2`). |
| **BUG-02** | Descuadre de tarjeta en plan semanal con títulos largos | 🔴 Alta | `Done` | Implementado `minmax(0, 1fr)` y clamp de 2 líneas (`v3`). |
| **BUG-03** | Lista de compra cortada en parte inferior con scroll | 🔴 Alta | `Done` | Corregido padding con `env(safe-area-inset-bottom)` y `100dvh` (`v4`). |
| **BUG-04** | Botón Limpiar lista de la compra no comunicaba al usuario | 🟡 Media | `Done` | Añadida confirmación y feedback contextual (`v5`). |
| **BUG-05** | Faltaban desayunos y meriendas para planes de >3 comidas | 🔴 Alta | `Done` | Expandido a 4 momentos estándar + momentos dinámicos ilimitados (`v8`). |
| **BUG-06** | El Service Worker nunca se registra: la app no funciona offline | 🔴 Alta | `Backlog` | Registrar `sw.js` en `index.html` y precachear fuentes de iconos y script de Supabase. *Relacionado: US-10.* |
| **BUG-07** | Las fechas se calculan en UTC: entre 00:00 y 02:00 "hoy" es ayer | 🔴 Alta | `Done` | Sustituido `toISOString().split('T')[0]` por la función `toLocalDateKey()` en todos los usos (`v0.24`). |
| **BUG-08** | El plan semanal se queda congelado en la primera semana y "Hoy" muestra comidas inventadas | 🔴 Alta | `Done` | Semana calculada en tiempo real a partir de la fecha actual; días creados bajo demanda; "Hoy" sin plan muestra slots vacíos (`v0.24`). *Relacionado: US-05.* |
| **BUG-09** | Editar una receta importada borra `sourceUrl` y `sourceDomain` | 🔴 Alta | `Backlog` | Fusionar con la receta existente (`{ ...existing, ...editados }`) en `saveRecipeEdit`. *Relacionado: US-15.* |
| **BUG-10** | Las recetas de ejemplo borradas reaparecen al recargar; el reset comparte referencia con `SEED_RECIPES` | 🔴 Alta | `Done` | Persistencia de borrados en `fa_deleted_records`; clonación por valor con `structuredClone` en `resetDemoData` e inicialización (`v0.37`-`v0.38`). |
| **BUG-11** | Temporizador del Modo Cocina: el primer toque tras cambiar de paso pausa en vez de iniciar; recetas sin pasos rompen el Modo Cocina | 🔴 Alta | `Backlog` | Poner `timerInterval = null` al limpiar, reiniciar el texto del botón por paso y bloquear el Modo Cocina si no hay pasos. |
| **BUG-12** | Escalado incoherente de raciones en la compra desde el plan (salta de 0,5× a 1,5×) | 🟡 Media | `Backlog` | Guardar las raciones base por grupo y escalar con `baseAmount * nuevas / group.baseServings`. |
| **BUG-13** | Recetas importadas: tiempo total inflado (`totalTime` usado como cocción) y 15 min inventados si no hay dato | 🟡 Media | `Backlog` | Restar `prepTime` de `totalTime` cuando falte `cookTime`; dejar 0 o vacío si no hay dato. |
| **BUG-14** | Clasificación de pasillo errónea ("chocolate"/"filete" → Bebidas, "salsa" → Especias, aceites desincronizados) y dos clasificadores distintos | 🟡 Media | `Done` | Un único diccionario con límites de palabra (`\b`), normalización de acentos, aceites y vinagres en Especias y Aceites, licores en Bebidas, guisantes en Verduras, y resolución online en segundo plano con caché persistente (`v0.43`-`v0.44`). *Relacionado: US-20.* |
| **BUG-15** | "Aplicar este menú al Planificador" ignora la propuesta de Gemini y reparte recetas en rotación | 🟡 Media | `Backlog` | Pedir a Gemini salida estructurada (JSON Schema con IDs de receta por día/slot) y aplicar exactamente esa respuesta; corregir los filtros por etiqueta. *Relacionado: US-17.* |
| **BUG-16** | Importar dos veces la misma URL crea recetas duplicadas | 🟢 Baja | `Backlog` | Detectar `sourceUrl` existente y ofrecer "Abrir existente" o "Guardar copia". |
| **BUG-17** | Días creados al añadir una comida fuera del plan quedan sin nombre y el planificador no ordena las fechas | 🟢 Baja | `Done` | `dayName` calculado automáticamente en español y días creados bajo demanda mediante `getDayPlan` (`v0.24`). |
| **BUG-18** | Búsqueda y chips de etiqueta no se combinan; la búsqueda no incluye ingredientes | 🟢 Baja | `Backlog` | Estado de filtro único (texto + etiqueta) y búsqueda también por nombre de ingrediente. |
| **BUG-19** | Copiar la lista de la compra falla en silencio si el portapapeles no está disponible | 🟢 Baja | `Backlog` | Gestionar el rechazo de `navigator.clipboard` con mensaje y alternativa. *Relacionado: US-08.* |
| **BUG-20** | Login: la contraseña se recorta con `trim()` y el registro marca al usuario como conectado aunque falte confirmar el email | 🟡 Media | `Backlog` | No recortar la contraseña; si `data.session` es `null`, mostrar "Revisa tu correo para confirmar la cuenta". |
| **BUG-21** | Sincronización: los errores de Supabase se ignoran y se muestra "Sincronizado" aunque falle o no haya sesión | 🔴 Alta | `Done` | Validación rigurosa de errores de Supabase sin falsos positivos de sincronizado; control de estado y feedback visual contextual (`v0.38`). |
| **BUG-22** | Los IDs de las recetas de ejemplo colisionan entre usuarios en Supabase (RLS rechaza al segundo usuario) | 🔴 Alta | `Done` | Estrategia de upsert compatible con clave primaria `(user_id, id)` y generación de IDs únicos UUID (`v0.38`). |
| **BUG-23** | El esquema de Supabase no coincide con el modelo y los borrados no se propagan | 🔴 Alta | `Done` | Esquema alineado con `replica/schema.sql`, fallback dinámico en runtime y propagación de borrados locales/remotos mediante `fa_deleted_records` (`v0.38`). |
| **BUG-24** | Cada acción lanza N peticiones secuenciales (una por receta) aunque solo cambie un artículo de la compra | 🟡 Media | `Done` | Subida optimizada por lotes (batch upsert) y debounce de sincronización en segundo plano (`v0.38`). |

---

## 📝 Guía para añadir nuevas tareas al Backlog
1. Asigna un identificador consecutivo (`US-XX` para features o `BUG-XX` para incidencias).
2. Define claramente los **Criterios de Aceptación** bajo el formato *Given / When / Then* o puntos de verificación.
3. Asigna la prioridad inicial (**Alta / Media / Baja**).
