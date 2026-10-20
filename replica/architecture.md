# Architecture: Food Assistant & Meal Planner (Clean-Room Samsung Food Replica)

## Stack

| Capa | Elección | Por qué |
| :--- | :--- | :--- |
| **Frontend / App** | **PWA Mobile-First (HTML5 + Vanilla CSS3 + Modern ES Modules)** | Cero fricción de compilación, 100% reactivo, instalación nativa en Android/iOS, funcionamiento offline instantáneo en el supermercado y cocina. |
| **Almacenamiento Local** | **IndexedDB / LocalStorage** | Persistencia offline total sin depender de conexión para ver la lista de la compra o cocinar. |
| **Backend / DB Cloud (Opcional)** | **Postgres en Supabase (o API Serverless)** | Esquema relacional con Row-Level Security (RLS) para sincronización entre dispositivos o copia de seguridad. |
| **Motor IA** | **Google Gemini API (`gemini-2.5-flash` / `gemini-2.5-flash-lite`)** | Ultra rápido, soporta Structured Outputs (JSON Schema nativo) para planificar semanas y extraer recetas sin fallos de formato. |
| **Extracción de Recetas** | **JSON-LD Schema.org parser + Fallback Gemini Multimodal** | Extrae ingredientes, pasos y fotos de blogs automáticamente; procesa textos o enlaces de Instagram/TikTok con IA cuando no hay microdatos. |
| **Alojamiento** | **GitHub Pages / Vercel / Netlify** | Despliegue estático gratuito, CDN global y SSL automático. |

---

## Schema

Tablas: **4** (`users`, `recipes`, `meal_plan_slots`, `shopping_items`). Reglas de acceso: **Row Level Security (RLS)** en Postgres / aislamiento de clave de usuario en almacenamiento local.

Ver archivo completo: [schema.sql](file:///c:/Users/fjcer/OneDrive/Apps/Designer/Praga/food-assistant/replica/schema.sql).

### Entidades y restricciones clave:
1. `recipes`: Almacena `ingredients` y `instructions` como JSONB estructurado con control de porciones y etiquetas.
2. `meal_plan_slots`: Índice único compuesto `(user_id, plan_date, meal_type, recipe_id)` para evitar duplicidad accidental del mismo plato en la misma comida.
3. `shopping_items`: Categorización forzada por enumerado de pasillos (`produce`, `meat`, `dairy`, `bakery`, `pantry`, `spices`, `frozen`, `beverages`, `other`) para ordenar automáticamente la visita al supermercado.

---

## API & Endpoints

| Método / Función | Qué hace | Quién | Entrada | Salida | Flujo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST /api/extract/url` | Scrapea la web y extrae microdatos Schema.org | Usuario | `{ url }` | `{ recipe: RecipeObject }` | F01 (Importar) |
| `POST /api/extract/ai` | Fallback para texto libre o enlaces de redes sociales | Usuario | `{ rawText, url? }` | `{ recipe: RecipeObject }` | F01 (Importar) |
| `POST /api/ai/plan-week` | Envía el catálogo de recetas a Gemini para generar menú 7 días | Usuario | `{ recipes: [], preferences, days: 7 }` | `{ plan: MealPlanSchedule, newRecipes?: Recipe[] }` | F02 (Planificación IA) |
| `POST /api/shopping/aggregate` | Agrupa ingredientes de recetas seleccionadas y suma cantidades | Usuario | `{ recipeIds: [], dates: [] }` | `{ itemsByAisle: {} }` | F03 (Generar Compra) |

---

## The parts that bite (Los puntos críticos de fricción)

- **Unificación de ingredientes y medidas**: "1 cebolla picada" + "2 cebollas medianas" -> debe consolidarse en "3 cebollas" en la lista de la compra. Solución: Normalizador heurístico en cliente con soporte de unidades métricas comunes (g, kg, ml, l, uds, cucharadas).
- **Offline en el supermercado**: Los supermercados suelen tener mala cobertura. Solución: Service Worker con estrategia Cache-First y sincronización en segundo plano con IndexedDB; la lista de la compra debe funcionar siempre aunque no haya internet.
- **Límites de tokens y coste en Gemini**: Enviar cientos de recetas completas a la IA consumiría contexto innecesario. Solución: El asistente de planificación solo recibe el resumen compacto del catálogo (`id`, `title`, `tags`, `prepTimeMinutes`, `mainIngredients`), no las instrucciones completas paso a paso.
- **Páginas web bloqueadas o redes sociales sin microdatos**: Instagram y TikTok bloquean scrapers básicos. Solución: Entrada dual donde el usuario puede pegar la URL o copiar y pegar el texto del pie de foto/vídeo para que Gemini lo estructure al vuelo.

---

## Build Order (Orden de Construcción)

1. **Vertical Slice (Bucle mínimo funcional)**:
   - Pantalla S02 (Catálogo de recetas base precargadas) + S05 (Planificador semanal interactivo) + S06 (Generación de lista de la compra agrupada por pasillos con casillas de verificación).
2. **Must-haves**:
   - Módulo S07: Integración con Gemini API para planificación semanal inteligente automática ("Diseña mi semana a partir de mis recetas").
   - Módulo S03: Importador de recetas con extractor JSON-LD y conversor de texto libre con Gemini.
   - PWA Service Worker + Manifest para instalación móvil y soporte offline.
3. **Should-haves**:
   - Modo cocina paso a paso con temporizadores automáticos integrados en pantalla completa (S04).
   - Generación de recetas nuevas por Gemini cuando faltan platos o para aprovechar sobras de la nevera.
   - Escalado de ingredientes dinámico por raciones (1x, 2x, 4x).
4. **Fixes de producto (Mejoras competitivas sobre Samsung Food)**:
   - Eliminación total del feed social y distracciones.
   - IA de planificación 100% abierta y accesible con clave propia de Gemini, sin suscripciones mensuales de $6.99.
