# 📸 Plan Detallado — Fase 2: Creación, Importación Multimodal con IA, Nevera y Batch Cooking

> **Historias cubiertas**: `US-30` (🔴 Alta), `US-34` (🔴 Alta), `US-65` (🔴 Alta)  
> **Objetivo**: Integrar capacidades generativas y multimodales de Gemini directamente en los flujos de **Recetas, Importador, Buscador de Nevera y Planificador**, permitiendo:
> 1. Digitalizar recetas desde **fotos/cámara** (libros, revistas, notas manuscritas o capturas de pantalla).
> 2. Extraer recetas limpias desde **textos desestructurados de redes sociales** (Instagram Reels, TikTok, YouTube) o webs sin Schema.org.
> 3. **Generar recetas a medida con IA** desde cero y revisarlas en el Modo Borrador (`US-58`) antes de guardarlas.
> 4. **Buscador Inverso "¿Qué cocino hoy con lo que tengo en la nevera?"** (`US-34`) combinando filtro por porcentaje de coincidencia y generación de receta de aprovechamiento con IA.
> 5. **Modo "Sobras (Cocinar x2)" y Batch Cooking** (`US-65`) tanto manual en el planificador como asistido por IA.

---

## 1. Contexto Técnico Actual en el Código (`v0.66`)

- **Modal de Importación (`#modal-recipe-import` en [`index.html`](../index.html) y [`app.js`](../app.js) líneas `7471-7790`)**:
  - Actualmente tiene 2 pestañas (`tab-import-url` y `tab-import-text`).
  - Cuando extrae una receta (`extractedRecipe`), la guarda en `this.pendingImportRecipe` y abre la pantalla de revisión previa al guardado con `this.openImportReview(extractedRecipe)` (`US-58`).
- **Vista de Recetas (`#view-recipes` en [`index.html`](../index.html) líneas `76-112`)**:
  - Tiene buscador `#recipes-search-input`, barra de chips `#recipes-tag-filters` y botón `#btn-open-create-recipe`.

---

## 2. Paso a Paso de Implementación

### Paso 2.1: Esquema JSON Estándar de Receta para Gemini (`RECIPE_RESPONSE_SCHEMA`)

Definir en `app.js` el esquema JSON estructurado (`responseMimeType: "application/json"`, `responseSchema`) para cuando Gemini extraiga o invente una receta individual:

```javascript
const GEMINI_RECIPE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    description: { type: "STRING" },
    prepTimeMinutes: { type: "INTEGER" },
    cookTimeMinutes: { type: "INTEGER" },
    servings: { type: "INTEGER" },
    tags: { type: "ARRAY", items: { type: "STRING" } },
    ingredients: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          amount: { type: "NUMBER" },
          unit: { type: "STRING" }
        },
        required: ["name", "amount", "unit"]
      }
    },
    instructions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          step: { type: "INTEGER" },
          text: { type: "STRING" },
          timerMinutes: { type: "INTEGER" }
        },
        required: ["step", "text"]
      }
    }
  },
  required: ["title", "ingredients", "instructions"]
};
```

Crear la función normalizadora `normalizeAiExtractedRecipe(rawJson, sourceUrl = '')` que:
1. Garantiza que cada ingrediente tenga `id: generateId('ing-')`, `unit: RecipeParser.normalizeUnit(ing.unit)` y `aisle: categorizeIngredientAisle(ing.name)`.
2. Garantiza que cada paso tenga `timerMinutes` (usando `RecipeParser.extractTimerMinutes(step.text)` si Gemini devolvió `0` o `null`).
3. Calcula los macronutrientes con `estimateRecipeNutrition(recipe)` y las etiquetas con `analyzeAndInferRecipeTags(recipe)`.
4. Conserva `sourceUrl` y `sourceDomain` si procede de una web/red social.

---

### Paso 2.2: Importador Multimodal en `#modal-recipe-import` (`US-30`)

1. **Ampliar las pestañas de `#modal-recipe-import` en `index.html`**:
   - Añadir una 3ª pestaña: **`✨ Foto / IA`** (`id="tab-import-ai"`, `section-import-ai`).
   - Dentro de `section-import-ai`, ofrecer 2 modos claros:
     - **📸 Escanear Foto de Receta (Libro, Revista, Manuscrito o Captura)**:
       - Botón/zona de subida `<input type="file" id="import-image-input" accept="image/*">` (compatible con cámara trasera en móvil y galería en escritorio).
       - Previsualización en miniatura de la foto seleccionada (`#import-image-preview`).
       - Función `compressImageToBase64(file, maxWidth = 1280, quality = 0.8)` usando un `<canvas>` en memoria para reducir fotos de cámara de 12MB a ~180KB antes de enviar a Gemini (`inlineData: { mimeType: 'image/jpeg', data: base64 }`).
     - **🪄 Crear o Extraer con IA por Descripción / Texto de Redes (Instagram / TikTok)**:
       - Campo de texto `#import-ai-prompt-input` donde el usuario puede:
         - Pegar el pie de foto desordenado de un Reel de Instagram/TikTok o transcripción de vídeo.
         - O escribir una petición creativa: *"Créame una lasaña de calabacín keto alta en proteínas para 2 personas"*.

2. **Fallback Inteligente con IA en las pestañas URL y Texto (`handleRecipeImport`)**:
   - Si el usuario intenta importar desde `URL` o `Texto / Notas` y el parser clásico (`RecipeParser`) falla porque la web no tiene `schema.org/Recipe` o el texto no tiene estructura estándar:
     - Si hay `state.settings.geminiApiKey` configurada, antes de lanzar error, invocar automáticamente `this.extractRecipeWithGemini({ text: htmlOrText, sourceUrl: cleanUrl })` mostrando en el indicador: *"Analizando y estructurando receta con Gemini IA..."*.
     - Al obtener el JSON estructurado, abrir directamente el **Modo Revisión de Borrador (`this.openImportReview(extractedRecipe)`)** (`US-58`).

---

### Paso 2.3: Buscador Inverso "¿Qué cocino hoy con mi nevera?" (`US-34`)

1. **Interfaz en la vista de Recetas (`#view-recipes` en `index.html`)**:
   - Añadir un chip o barra desplegable **"🧊 ¿Qué hay en tu nevera?"** (`#fridge-reverse-search-panel`) junto al buscador de recetas.
   - Permite añadir 1 a 6 ingredientes que el usuario tiene en casa (ej. `Pollo`, `Calabacín`, `Huevos`) con chips eliminables (`state.fridgeIngredients = []`).
2. **Motor de Coincidencia en `applyRecipeFilters()` (`app.js`)**:
   - Cuando `state.fridgeIngredients.length > 0`:
     - Calcular para cada receta de `state.recipes` cuántos de los ingredientes de la nevera están presentes en `recipe.ingredients` (comparación normalizada sin acentos mediante `normalizeIngredientText`) y qué porcentaje del total de ingredientes de la receta cubren.
     - Ordenar las tarjetas de mayor a menor coincidencia.
     - Mostrar un badge en cada tarjeta de receta: **`✓ Tienes X de Y ingredientes`** (o `Coincide con: Pollo, Calabacín`).
   - Mostrar al final del panel un botón directo: **`✨ Inventar receta con estos ingredientes (IA)`** que llama al generador de recetas con IA usando exactamente esos ingredientes + las preferencias dietéticas del usuario, y abre el borrador en `openImportReview()`.

---

### Paso 2.4: Modo "Sobras (Cocinar x2)" y Batch Cooking (`US-65`)

1. **Modo Sobras en el Selector de Receta del Planificador**:
   - En el modal de asignar receta a un día/momento (`#modal-select-recipe`), añadir un switch o checkbox opcional:
     - **`🍱 Cocinar doble para sobras (rellenar también el día siguiente)`**.
   - Cuando está marcado al asignar una receta (por ejemplo, en la Cena del Lunes o Almuerzo del Martes):
     - Asigna la receta al slot seleccionado y automáticamente la asigna también al siguiente slot lógico del día siguiente (ej. Almuerzo del día siguiente), guardando en el día una marca de metadatos `leftoverSlots: ['lunch']` para mostrar el distintivo **`🍱 Sobras (Ya cocinado)`** en la tarjeta del planificador y en Hoy, y **evitar duplicar sus ingredientes** al enviar la semana a la Lista de la Compra (o escalando correctamente x2 una sola vez).
2. **Atajo de Batch Cooking en el Asistente IA**:
   - Añadir chip rápido en `#view-ai` y opción en *"Autoplanificar con Gemini"*: **`🍱 Planificar modo Batch Cooking / Tuppers`** para que la IA organice la semana reutilizando 3-4 cocciones dobles a lo largo de los 7 días.

---

## 3. Plan de Pruebas y Criterios de Cierre (CI = Verde)

1. **Tests unitarios en `tests/unit.test.js` y `test.html`**:
   - **Test `US-30` (Normalizador de Receta IA + Fallback)**: Verificar que `normalizeAiExtractedRecipe()` convierte un JSON de Gemini en una receta válida de Food Assistant con pasillos (`categorizeIngredientAisle`), unidades normalizadas, temporizadores por paso y macros estimados, abriendo `openImportReview()`.
   - **Test `US-34` (Buscador Inverso de Nevera)**: Verificar que al pasar `['pollo', 'limón']` al buscador inverso, la receta *"Pechugas de Pollo al Limón"* aparece en primera posición con su contador de ingredientes coincidentes.
   - **Test `US-65` (Modo Sobras)**: Verificar que asignar una receta con `cookDoubleForLeftovers = true` rellena el slot correspondiente del día siguiente con distintivo de sobras.
2. **Incrementar versión**: Subir versión en todos los archivos según `AGENTS.md` y validar que CI (`34+ tests`) termina en `success`.

