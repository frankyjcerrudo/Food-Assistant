# Recon map: Samsung Food (Web / Mobile PWA)

Scope: Gestor de recetas (importador web y redes sociales), Planificador semanal, Lista de la compra por pasillos, y Asistente IA Gemini integrado (planificación automática y creación de recetas). Excluye feed social y electrodomésticos Samsung.
For: Usuario particular y familiar que busca organizar sus comidas semanales sin fricción manual, aprovechando sus recetas guardadas y la inteligencia de Gemini.
Date: 2026-10-20

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Google Play Store | https://play.google.com/store/apps/details?id=com.foodient.whisk | App original (Whisk / Samsung Food), 10M+ descargas, 4.7★ |
| 2 | Sitio oficial | https://samsungfood.com | Funcionalidades de Samsung Food y Samsung Food+ |
| 3 | Análisis y Reseñas de usuarios | Review aggregator / Play Store feedback | Alabado por el importador y lista por pasillos; criticado por la planificación manual tediosa en la versión gratuita y exceso de ruido social |

## Core loop

> **Guardar recetas limpias desde cualquier web o red social, dejar que Gemini diseñe el menú semanal equilibrado a partir de ellas y convertirlo en un clic en la lista de la compra organizada por pasillos.**

---

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| **S01** | Inicio / Dashboard | `/` (Tab Inicio) | Vista rápida de las comidas de hoy, accesos directos al plan, lista de la compra y Gemini Copilot | MealTodayCard, QuickActionButtons, UpcomingPlanWidget | empty (sin comidas hoy), filled |
| **S02** | Mis Recetas (Recipe Box) | `/recipes` (Tab Recetas) | Biblioteca de recetas guardadas, buscador, etiquetas y filtros | SearchBar, TagFilterChips, RecipeGrid, RecipeCard, FloatingAddButton | empty (sin recetas), loading, filtered, filled |
| **S03** | Importador de Recetas | Modal o `/recipes/import` | Pegar enlace (web, Instagram, TikTok, YouTube) o texto para extraer ingredientes e instrucciones limpias | UrlInputField, PreviewRecipeCard, JsonLdStatusIndicator, ActionButtons | empty, parsing/loading, success preview, parse-error |
| **S04** | Detalle de Receta | `/recipes/:id` | Ver receta, escalar porciones, modo cocina y enviar ingredientes a la lista de la compra | HeroImage, ServingsScaler, IngredientChecklist, StepInstructionList, CookModeToggle, AddToListButton | view mode, cooking mode (fullscreen / step-by-step) |
| **S05** | Planificador Semanal | `/planner` (Tab Planificador) | Calendario 7 días (Desayuno, Almuerzo, Cena, Snacks) para organizar la semana | WeekDatePicker, CalendarDayColumn, MealSlotCard, RecipePickerDrawer, AskGeminiBanner | empty slots, filled slots, past days |
| **S06** | Lista de la Compra Inteligente | `/shopping-list` (Tab Compra) | Ingredientes necesarios agrupados por pasillo de supermercado con casillas de verificación | AisleSectionHeader, GroceryItemRow, QuickAddItemBar, ClearCompletedButton, ShareButton | empty, partially checked, all checked |
| **S07** | Gemini Chef Copilot | `/ai-assistant` (Tab Asistente o Botón flotante) | Interfaz conversacional con Gemini para pedir planes semanales, recetas con sobras de la nevera o sugerencias dietéticas | ChatStream, SuggestedPromptChips, RecipeSuggestionCard, ApplyToPlanButton | idle, typing/streaming response, error (API key) |
| **S08** | Ajustes y Preferencias | `/settings` | Configuración de dietas (keto, vegetariano, etc.), alergias, porciones familiares y clave de API de Gemini | PreferenceToggles, ServingsInput, ApiKeyField, ExportImportData | default, saved |

---

## Flows

```
F01 Importar receta desde URL o Red Social
    S02 -> S03 (pegar URL) -> S03 (extracción automática JSON-LD / LLM) -> S04 (revisión y guardado)
    happy path clicks: 3 (Pegar -> Importar -> Guardar)
    edge: web sin microdatos (actúa extractor Gemini), paywall o enlace roto (edición manual de campos)

F02 Planificación semanal inteligente con Gemini (Killer Feature)
    S05 -> S07 (clic en "Generar plan semanal con IA") -> Gemini analiza recetas guardadas + preferencias -> Devuelve propuesta completa Lunes-Domingo -> S07 (clic en "Aplicar al planificador") -> S05 actualizado
    happy path clicks: 2 clicks (Pedir a Gemini -> Aplicar propuesta)
    edge: no hay recetas suficientes (Gemini genera 2-3 recetas nuevas y propone guardarlas), restricciones dietéticas activadas

F03 De la Planificación a la Lista de la Compra
    S05 -> Clic en "Enviar ingredientes al supermercado" -> Modal de selección (elegir días o recetas) -> S06 lista de la compra generada y clasificada por pasillos
    happy path clicks: 2 (Generar lista -> Confirmar)
    edge: ingredientes que ya tienes en la despensa (posibilidad de desmarcar antes de añadir), ingredientes duplicados unificados en cantidad

F04 Compra en el supermercado
    S06 -> Marcar artículos mientras se recorren los pasillos -> Filtro dinámico / tachado automático
    happy path clicks: 1 tap por artículo comprado
    edge: sin conexión en el supermercado (PWA con persistencia offline en LocalStorage / IndexedDB)

F05 Modo Cocina
    S04 -> Clic en "Empezar a cocinar" -> Pantalla completa, texto de tamaño grande, paso a paso con temporizadores automáticos
    happy path clicks: 1
    edge: pantalla no debe apagarse (Wake Lock API)
```

---

## Components

| Componente | Variantes | Estados | Utilizado en |
| :--- | :--- | :--- | :--- |
| **RecipeCard** | Grid card, List compact card, Mini card | default, hover, selected | S01, S02, S05, S07 |
| **MealSlotCard** | Desayuno, Almuerzo, Cena, Snack | empty, filled, draggable | S01, S05 |
| **GroceryItemRow** | Normal, Checked/Tachado | unchecked, checked, editing | S06 |
| **AisleSection** | Frutas/Verduras, Carnicería, Lácteos, Despensa, Especias, Congelados, Otros | expanded, collapsed | S06 |
| **ServingsScaler** | Contador con botones -/+ | normal, min limit | S04 |
| **ChatBubble** | Usuario, Gemini AI (con tarjetas de recetas interactivas) | sending, streaming, done | S07 |
| **PromptChip** | Píldora de sugerencia rápida | default, active, disabled | S07 |
| **UrlImportBar** | Campo de texto con detección automática de portapapeles | idle, parsing, valid, error | S03 |

---

## Inferred data model

```
Recipe
  id: string (uuid)
  title: string
  description: string
  sourceUrl: string?
  sourcePlatform: 'web' | 'instagram' | 'tiktok' | 'youtube' | 'manual'
  imageUrl: string?
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  tags: string[] (ej: 'cena rápida', 'baja en carbos', 'pasta')
  ingredients: [
    {
      id: string,
      rawText: string,
      name: string,
      amount: number?,
      unit: string?,
      aisle: 'produce' | 'dairy' | 'meat' | 'bakery' | 'pantry' | 'spices' | 'frozen' | 'other'
    }
  ]
  instructions: [
    {
      step: number,
      text: string,
      timerMinutes: number?
    }
  ]
  nutritionSummary: { calories: number?, protein: number?, carbs: number?, fat: number? }?
  createdAt: timestamp
  evidence: S03, S04, microdatos schema.org/Recipe
  confidence: high

MealPlanSlot
  id: string (uuid)
  date: string (YYYY-MM-DD)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: string? (foreign key -> Recipe.id)
  customTitle: string? (por si anota algo sin receta: ej. "Cena fuera")
  servingsOverride: number?
  evidence: S05
  confidence: high

ShoppingListItem
  id: string (uuid)
  name: string
  amount: number?
  unit: string?
  aisle: 'produce' | 'dairy' | 'meat' | 'bakery' | 'pantry' | 'spices' | 'frozen' | 'other'
  isChecked: boolean
  recipeId: string? (referencia opcional a qué receta lo originó)
  evidence: S06
  confidence: high

UserPreferences
  dietaryRestrictions: string[] (ej: 'vegetariano', 'sin gluten', 'sin lactosa')
  dislikedIngredients: string[]
  defaultServings: number (default: 2 o 4)
  geminiApiKey: string?
  geminiModel: string (ej: 'gemini-2.5-flash')
  evidence: S08
  confidence: high
```

Relaciones:
- `Recipe` 1-N `MealPlanSlot`
- `Recipe` 1-N `ShoppingListItem` (vía agregación de ingredientes)
- `MealPlanSlot` N-1 `Recipe`

---

## Feature matrix

Ver `features.csv`.
- Must: 11
- Should: 6
- Could: 3
- Skip: 3 (Feed social, comentarios comunitarios, sincronización SmartThings de hornos/neveras Samsung).

---

## Out of scope (Clean-room exclusions)

- **Comunidad y Red Social**: No se clonan los perfiles públicos de usuarios, feed de fotos sociales, seguidores ni comentarios públicos de Samsung Food.
- **Hardware Propietario Samsung**: No se incluye integración de hardware SmartThings para hornos o frigoríficos Family Hub.
- **Alianzas comerciales con supermercados**: Enlaces de compra directa a Walmart/Kroger específicos de EEUU (se mantiene la lista inteligente agnóstica para cualquier supermercado local).

---

## Size & Complexity

- **Pantallas**: 8
- **Flujos principales**: 5
- **Entidades clave**: 4
- **Partes complejas**:
  1. *Scraper & Parser universal*: extraer recetas mediante Schema.org/Recipe (JSON-LD) y fallback con Gemini API para URLs complejas/redes sociales.
  2. *Gemini Meal Planner Agent*: orquestar la selección balanceada de recetas del usuario, asignación al calendario y creación de recetas estructuradas en formato JSON.
  3. *Unificación y categorización de ingredientes*: agrupar cantidades (ej: 200g + 100g = 300g de harina) y clasificar automáticamente en pasillos de supermercado.
- **Tamaño**: **M** (Construcción rápida con arquitectura limpia PWA + Gemini API).
