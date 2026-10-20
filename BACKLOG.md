# 📋 Backlog del Producto - Food Assistant

> **Metodología**: Kanban / MoSCoW (Must, Should, Could, Won't)  
> **Estado**: Activo  
> **Última actualización**: Octubre 2026  

---

## 🚦 Leyenda de Prioridades y Estados
* **Prioridad**: 🔴 `Alta / Must Have` | 🟡 `Media / Should Have` | 🟢 `Baja / Could Have`
* **Estado**: `Backlog` | `Ready for Dev` | `In Progress` | `QA / Review` | `Done`

---

## 🎯 Épica 1: Gestión Nutricional y Macro-Nutrientes

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-01** | Contador de Calorías y Macronutrientes por plato | 🔴 Alta | `Backlog` | • Mostrar desglose de Kcal, Proteínas, Carbohidratos y Grasas en la ficha de cada receta.<br>• Actualización dinámica al cambiar las porciones.<br>• Resumen diario de macros en la vista "Hoy". |
| **US-02** | Filtros dietéticos avanzados (Keto, Vegano, Sin Gluten) | 🟡 Media | `Backlog` | • Etiquetas específicas en recetas.<br>• Selector múltiple en el catálogo de recetas.<br>• Advertencias automáticas si un plato asignado incumple el filtro. |
| **US-03** | Objetivos nutricionales diarios del usuario | 🟢 Baja | `Backlog` | • En Ajustes, configurar meta diaria de Kcal y Proteína.<br>• Barra de progreso en vista "Hoy" con porcentaje de cumplimiento. |

---

## 🎯 Épica 2: Planificador Inteligente y Automatización

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-04** | Duplicar o copiar plan de semana anterior | 🔴 Alta | `Backlog` | • Botón "Copiar semana anterior" en el planificador.<br>• Confirmación de sobreescritura con modal seguro.<br>• Respeto de los momentos de comida personalizados. |
| **US-05** | Planificación mensual / Calendario expandido | 🟡 Media | `Backlog` | • Vista mensual o navegación entre semanas (+1 / -1 semana).<br>• Persistencia por claves de fecha ISO `YYYY-MM-DD`. |
| **US-06** | Generador de Batch Cooking | 🟢 Baja | `Backlog` | • Gemini sugiere cómo cocinar 3 platos simultáneamente el domingo para toda la semana ahorrando tiempo y energía. |

---

## 🎯 Épica 3: Lista de la Compra y Despensa Inteligente

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-07** | Control de Despensa / Stock doméstico | 🔴 Alta | `Backlog` | • Pestaña o sección de "Mi Despensa".<br>• Al enviar ingredientes a la compra, desmarcar automáticamente los que ya tengamos en casa.<br>• Alerta de ingredientes próximos a caducar. |
| **US-08** | Compartir lista en tiempo real por enlace o WhatsApp | 🟡 Media | `Backlog` | • Formateo enriquecido para WhatsApp o mensajería.<br>• Sincronización colaborativa compartida en Supabase con familiares/pareja. |
| **US-09** | Estimación aproximada de coste de la compra | 🟢 Baja | `Backlog` | • Campo opcional de precio aproximado por ingrediente.<br>• Totalizador estimado en la cabecera de la lista. |

---

## 🎯 Épica 4: Experiencia de Usuario, PWA y Offline

| ID | Historia de Usuario / Feature | Prioridad | Estado | Criterios de Aceptación (DoD) |
| :--- | :--- | :---: | :---: | :--- |
| **US-10** | Instalación PWA guiada (Botón de instalar en app) | 🟡 Media | `Backlog` | • Capturar evento `beforeinstallprompt`.<br>• Botón nativo "Instalar App en tu pantalla de inicio" en Ajustes. |
| **US-11** | Modo Cocina con reconocimiento de voz (manos libres) | 🟢 Baja | `Backlog` | • Web Speech API para decir "Siguiente" o "Pausar" sin tocar la pantalla con las manos manchadas. |
| **US-12** | Soporte Multilenguaje (i18n ES / EN) | 🟢 Baja | `Backlog` | • Diccionario de cadenas para alternar entre Español e Inglés. |

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

## 📌 Guía para añadir nuevas tareas al Backlog
1. Asigna un identificador consecutivo (`US-XX` para features o `BUG-XX` para incidencias).
2. Define claramente los **Criterios de Aceptación** bajo el formato *Given / When / Then* o puntos de verificación.
3. Asigna la prioridad inicial (**Alta / Media / Baja**).
