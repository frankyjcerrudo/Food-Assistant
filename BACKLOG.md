# 📋 Backlog del Producto - Food Assistant

> **Metodología**: Kanban / MoSCoW (Must, Should, Could, Won't)  
> **Estado**: Activo  
> **Última actualización**: Octubre 2026  

---

## 🧭 Leyenda de Prioridades y Estados
* **Prioridad**: 🔴 `Alta / Must Have` | 🟡 `Media / Should Have` | 🟢 `Baja / Could Have`
* **Estado**: `Backlog` | `Ready for Dev` | `In Progress` | `QA / Review` | `Done`

---

## 🥗 Épica 1: Gestión Nutricional y Macro-Nutrientes

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-01** | Contador de Calorías y Macronutrientes por plato | 🔴 Alta | `Backlog` | • Mostrar desglose de Kcal, Proteínas, Carbohidratos y Grasas en la ficha de cada receta.<br>• Actualización dinámica al cambiar las porciones.<br>• Resumen diario de macros en la vista "Hoy". |
| **US-02** | Filtros dietéticos avanzados (Keto, Vegano, Sin Gluten) | 🟡 Media | `Backlog` | • Etiquetas específicas en recetas.<br>• Selector múltiple en el catálogo de recetas.<br>• Advertencias automáticas si un plato asignado incumple el filtro. |
| **US-03** | Objetivos nutricionales diarios del usuario | 🟢 Baja | `Backlog` | • En Ajustes, configurar meta diaria de Kcal y Proteína.<br>• Barra de progreso en vista "Hoy" con porcentaje de cumplimiento. |

---

## 📅 Épica 2: Planificador Semanal y Organización

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-04** | Duplicar o copiar plan de semana anterior | 🔴 Alta | `Backlog` | • Botón "Copiar semana anterior" en el planificador.<br>• Confirmación de sobreescritura con modal seguro.<br>• Respeto de los momentos de comida personalizados. |
| **US-05** | Planificación mensual / Calendario expandido | 🟡 Media | `Backlog` | • Vista mensual o navegación entre semanas (+1 / -1 semana).<br>• Persistencia por claves de fecha ISO `YYYY-MM-DD`. |
| **US-06** | Generador de Batch Cooking | 🟢 Baja | `Backlog` | • Gemini sugiere cómo cocinar 3 platos simultáneamente el domingo para toda la semana ahorrando tiempo y energía. |
| **US-14** | Comidas flexibles en planificador (Desayunos, meriendas, snacks) | 🔴 Alta | `Done` | • Soporte configurable para personas que comen >3 veces al día.<br>• Habilitar/deshabilitar Desayuno, Media Mañana, Almuerzo, Merienda, Cena, Post-entreno.<br>• Interfaz responsiva que acomode las nuevas filas sin scroll horizontal roto. |
| **US-19** | Mover recetas por la semana y cambiar momentos | 🟡 Media | `Backlog` | • Drag & drop táctil o menú contextual "Mover a..." en cada tarjeta.<br>• Permitir mover de un día a otro o de almuerzo a cena sin tener que borrar y buscar de nuevo. |
| **US-22** | Semana estandarizada de Lunes a Domingo | 🔴 Alta | `Backlog` | • El calendario semanal empieza siempre en Lunes (ISO 8601).<br>• Fin de semana (Sábado y Domingo) claramente agrupado al final. |

---

## 🛒 Épica 3: Lista de la Compra y Despensa Inteligente

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-07** | Control de Despensa / Stock doméstico | 🟡 Media | `Backlog` | • Pestaña o sección de "Mi Despensa".<br>• Al enviar ingredientes a la compra, desmarcar automáticamente los que ya tengamos en casa.<br>• Alerta de ingredientes próximos a caducar. |
| **US-08** | Compartir lista en tiempo real por enlace o WhatsApp | 🔴 Alta | `Backlog` | • Formateo enriquecido para WhatsApp o mensajería agrupado por categorías.<br>• Sincronización colaborativa compartida en Supabase con familiares/pareja. |
| **US-09** | Estimación aproximada de coste de la compra | 🟢 Baja | `Backlog` | • Campo opcional de precio aproximado por ingrediente.<br>• Totalizador estimado en la cabecera de la lista. |
| **US-13** | Previsualización y edición de ingredientes antes de añadir a la compra | 🔴 Alta | `Done` | • Al pulsar "Añadir a lista de la compra" (desde el planificador o receta), abrir un modal previo.<br>• Desglose visual separado por receta.<br>• Checkbox por ingrediente para desmarcar lo que no se quiera añadir.<br>• Ajuste de porciones y cantidades antes de confirmar el volcado final. |
| **US-20** | Autocompletado inteligente de ingredientes y categoría automática | 🟡 Media | `Backlog` | • Sugerencias predictivas al tipear el nombre del ingrediente.<br>• Clasificación automática en pasillo/categoría (Verdulería, Carnicería, Lácteos, Despensa).<br>• Icono visual distintivo por ingrediente o grupo. |
| **US-33** | Alternancia de Vistas en Lista de la Compra: Por Pasillo vs Por Receta (Estilo ReciMe) | 🟡 Media | `Backlog` | • Selector o toggle en la cabecera de la lista de la compra.<br>• **Vista Por Pasillos**: Agrupación por sección de supermercado (Frutas, Carnicería, Lácteos, Despensa, etc.).<br>• **Vista Por Receta**: Agrupación por plato para saber exactamente qué ingredientes corresponden a cada comida planificada.<br>• Unificación automática de cantidades en ambas vistas para evitar duplicados. |
| **US-34** | Buscador Inverso "¿Qué cocino hoy con lo que tengo en la nevera?" | 🔴 Alta | `Backlog` | • Interfaz rápida para marcar o tipear 2-3 ingredientes que el usuario tiene disponibles en casa.<br>• Filtro dinámico en el catálogo de recetas ordenando por porcentaje de coincidencia de ingredientes.<br>• Indicador visual en cada tarjeta (ej: *"Tienes 4 de 5 ingredientes"*).<br>• Resuelve la principal queja y demanda no atendida en apps competidoras como ReciMe. |

---

## 🍳 Épica 4: Catálogo de Recetas, UX y Experiencia de Usuario

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-10** | Instalación PWA guiada (Botón de instalar en app) | 🔴 Alta | `Backlog` | • Capturar evento `beforeinstallprompt`.<br>• Botón nativo "Instalar App en tu pantalla de inicio" en Ajustes. |
| **US-11** | Modo Cocina con reconocimiento de voz (manos libres) | 🟢 Baja | `Backlog` | • Web Speech API para decir "Siguiente" o "Pausar" sin tocar la pantalla con las manos manchadas. |
| **US-12** | Soporte Multilenguaje (i18n ES / EN) | 🟡 Media | `Backlog` | • Diccionario de cadenas para alternar entre Español e Inglés en Ajustes. |
| **US-15** | Importador de recetas Universal (Sin IA): Schema.org + Proxy Local + Fuente Original | 🔴 Alta | `In Progress` | • **Modo estándar cero-coste**: Extractor de JSON-LD (`schema.org/Recipe`) desde URL de cocina con soporte para grafos `@graph`.<br>• **Transporte robusto**: Endpoint `/api/fetch` en servidor local para descarga directa sin bloqueos de CORS ni Cloudflare.<br>• **Atribución de Fuente**: Guardar `sourceUrl` y dominio origen (`sourceDomain`) y mostrarlos en tarjetas y modal de detalle con enlace directo a la web original.<br>• **Modo texto/notas**: Parser de texto estructurado de recetas (ingredientes y pasos).<br>• Previsualización en vivo antes de guardar.<br>• *(Modo IA desacoplado en US-30 para monetización Premium)*.<br>• *Estado actual: Implementado en local, pendiente de pruebas y validación por parte del usuario.* |
| **US-16** | Gestión flexible de imágenes de recetas | 🟡 Media | `Backlog` | • Imagen opcional: Si no se añade, mostrar avatar/patrón gráfico elegante de comida.<br>• Soporte para subir foto propia desde archivo o cámara.<br>• Campo para pegar URL externa limpia.<br>• Botón opcional de generar foto con IA. |
| **US-18** | Sistema de diálogos y popups propios (Material 3) | 🔴 Alta | `Backlog` | • Reemplazar los feos `alert()`, `confirm()` y `prompt()` del navegador.<br>• Componente modal accesible con backdrop blur, botones de acción claros y animaciones suaves. |
| **US-21** | Selector de etiquetas por Chips interactivos | 🟢 Baja | `Backlog` | • Sustituir el input de texto libre por chips seleccionables.<br>• Categorías predefinidas (Keto, Rápida, Horno, Tupper, etc.).<br>• Capacidad de crear y guardar nuevas etiquetas personalizadas. |
| **US-28** | Rediseño enfocado de la pantalla "Hoy" (Zero Clutter) | 🔴 Alta | `Ready for Dev` | • **Eliminar la tarjeta "Hoy"**: Suprimir el bloque hero y las estadísticas redundantes (Recetas, En Menú, Por Comprar) para aprovechar al máximo el espacio en pantalla.<br>• **Retirar Acciones Frecuentes**: Quitar los accesos directos a "Lista de la Compra" y "Asistente Gemini" por ser redundantes con la barra de navegación inferior.<br>• **Foco en Comidas Planificadas**: Cabecera limpia con fecha del día y presentación clara de las comidas asignadas (Desayuno, Almuerzo, Merienda, Cena).<br>• **Añadir otra comida**: Botón accesible y visible para añadir momentos de comida extra (snacks, post-entreno) o asignar platos rápidamente.<br>• **Optimización móvil**: Experiencia directa sin ruido visual (*above the fold*) en dispositivos móviles. |
| **US-31** | Colecciones y Libros de Recetas Personalizados (Cookbooks / Carpetas) | 🟡 Media | `Backlog` | • Crear carpetas temáticas ilimitadas (ej: "Favoritas de Mamá", "Cenas Rápidas", "Postres", "Airfryer", "Chef X").<br>• Asignar una receta a una o múltiples colecciones.<br>• Selector de libro en la cabecera del catálogo para navegar entre carpetas con 1 toque (el patrón visual más elogiado en ReciMe). |
| **US-32** | Notas Personales y Ajustes Caseros en Ficha de Receta | 🟡 Media | `Backlog` | • Sección editable de "Mis notas y trucos" en el detalle de la receta (ej: *"Poner 30g menos de azúcar"*, *"Hornear 5 min más"*).<br>• Persistencia local y en la nube sin sobreescribir los datos originales de la receta importada.<br>• Visualización destacada en el Modo Cocina para no olvidar los ajustes al cocinar. |

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
| **US-23** | Sistema de Micro-interacciones y Feedback Táctil (Filosofía Emil Kowalski) | 🔴 Alta | `Backlog` | • Curvas de animación custom en CSS (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`).<br>• Efecto táctil `:active { transform: scale(0.97); }` en todos los botones, tarjetas, tabs y chips.<br>• Eliminación de `transition: all` para evitar repaints innecesarios y asegurar 60/120fps fluido.<br>• Apertura de modales y drawers iniciados en `scale(0.95)` y opacidad progresiva (nunca `scale(0)`). |
| **US-24** | Sistema de Tokens, Bordes Translúcidos y Sombras Multicapa (Estándar Web Design Eng / Linear) | 🟡 Media | `Backlog` | • Bordes sutiles alfa translúcidos (`border: 1px solid rgba(255, 255, 255, 0.08)`) para dar aspecto pulido.<br>• Sombras compuestas en 2 capas (luz ambiental + foco directo) para una elevación visual realista.<br>• Escala tipográfica con ratio 2.5× y `letter-spacing: -0.02em` en cabeceras editoriales.<br>• Espaciado en múltiplos estrictos de 8px (8pt grid). |
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

## 🐛 Historial y Registro de Defectos (Bugs)

| ID | Defecto | Severidad | Estado | Resolución |
| :--- | :--- | :---: | :---: | :--- |
| **BUG-01** | Truncado de nombre de usuario en login móvil | 🔴 Alta | `Done` | Reducido a primer nombre/alias con ellipsis en header móvil (`v2`). |
| **BUG-02** | Descuadre de tarjeta en plan semanal con títulos largos | 🔴 Alta | `Done` | Implementado `minmax(0, 1fr)` y clamp de 2 líneas (`v3`). |
| **BUG-03** | Lista de compra cortada en parte inferior con scroll | 🔴 Alta | `Done` | Corregido padding con `env(safe-area-inset-bottom)` y `100dvh` (`v4`). |
| **BUG-04** | Botón Limpiar lista de la compra no comunicaba al usuario | 🟡 Media | `Done` | Añadida confirmación y feedback contextual (`v5`). |
| **BUG-05** | Faltaban desayunos y meriendas para planes de >3 comidas | 🔴 Alta | `Done` | Expandido a 4 momentos estándar + momentos dinámicos ilimitados (`v8`). |

---

## 📝 Guía para añadir nuevas tareas al Backlog
1. Asigna un identificador consecutivo (`US-XX` para features o `BUG-XX` para incidencias).
2. Define claramente los **Criterios de Aceptación** bajo el formato *Given / When / Then* o puntos de verificación.
3. Asigna la prioridad inicial (**Alta / Media / Baja**).
