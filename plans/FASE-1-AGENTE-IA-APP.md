# 🧠 Plan Detallado — Fase 1: Motor de Herramientas IA y Agente con Control Total en la App

> **Historias y Bugs cubiertos**: `US-17` (🔴 Alta), `BUG-15` (🔴 Alta), `US-37` (🔴 Alta), `US-39` (🔴 Alta)  
> **Objetivo**: Convertir el chat actual de Gemini en `app.js` en un **Agente con Function Calling real** capaz de leer automáticamente las preferencias dietéticas, los objetivos de macronutrientes y el recetario del usuario, crear recetas nuevas si hacen falta, aplicar el menú semanal exacto al calendario (resolviendo `BUG-15`) y gestionar la lista de la compra, cumpliendo además con la seguridad de clave (`US-39`) y saneamiento XSS (`US-37`).

---

## 1. Contexto Técnico Actual en el Código (`v0.66`)

- **Archivo principal**: [`app.js`](../app.js)
  - `callGeminiApi(prompt, systemInstruction)` se encuentra en las líneas `7326-7356`. Actualmente pasa `?key=${apiKey}` en la URL (incumple `US-39`) y solo devuelve texto plano (`data.candidates?.[0]?.content?.parts?.[0]?.text`).
  - `handleAiChatSubmit()` se encuentra en las líneas `7392-7433`. Interpola `aiResponse` con `.replace(/\n/g, '<br>')` directo en `innerHTML` sin escapar HTML previo (incumple `US-37`).
  - `applySampleAiPlan()` se encuentra en las líneas `7435-7457`. Ignora por completo la respuesta de Gemini y reparte las recetas guardadas en rotación matemática (`i % recipes.length`), lo cual constituye el bug `BUG-15`.
- **Estado del usuario (`StateStore` en `app.js`, líneas `1200-1436`)**:
  - `state.recipes`: Array de recetas (`id`, `title`, `description`, `prepTimeMinutes`, `cookTimeMinutes`, `servings`, `tags`, `ingredients`, `instructions`, `nutrition`).
  - `state.mealPlan`: Diccionario indexado por fecha ISO local `YYYY-MM-DD` (`breakfast`, `lunch`, `snack`, `dinner`, `customSlots: [{ id, label, recipeId }]`).
  - `state.shoppingList`: Array de artículos (`id`, `name`, `amount`, `unit`, `aisle`, `isChecked`, `recipeOrigin`).
  - `state.dietaryPreferences`: Array de chips dietéticos activos (ej. `["Vegano", "Sin Gluten", "Alta en Proteínas"]`).
  - `state.settings.nutritionGoals`: `{ enabled, calories, protein, carbs, fat }`.
  - `state.settings.geminiModel`: `'gemini-3.8-flash'` (por defecto).

---

## 2. Paso a Paso de Implementación

### Paso 1.1: Seguridad de Clave API (`US-39`) y Saneamiento XSS (`US-37`)

1. **Crear función utilitaria `formatSafeAiMarkdown(rawText)` en `app.js`**:
   - Primero escapa todos los caracteres HTML peligrosos (`&`, `<`, `>`, `"`, `'`).
   - Después aplica formato ligero seguro sobre el texto ya escapado:
     - `**texto**` → `<strong>texto</strong>`
     - Líneas que empiezan por `- ` o `* ` → viñetas limpias
     - `\n` → `<br>`
   - En los bloques `catch (err)` de `handleAiChatSubmit()`, mostrar el error usando `textContent` o texto escapado, nunca `innerHTML` crudo con `err.message`.

2. **Actualizar `callGeminiApi()` en `app.js` (`US-39`)**:
   - Eliminar `?key=${apiKey}` de la URL del endpoint:
     ```javascript
     const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
     ```
   - Enviar la clave en las cabeceras HTTP:
     ```javascript
     headers: {
       "Content-Type": "application/json",
       "x-goog-api-key": apiKey
     }
     ```
   - Preparar soporte multi-proveedor en `state.settings`:
     - `aiProvider`: `'gemini'` (por defecto), dejando estructura lista para `'openai'` o `'claude'`.

---

### Paso 1.2: Constructor de Contexto Silencioso del Usuario (`buildAiSystemInstruction()`)

Crear el método `buildAiSystemInstruction()` en `FoodAssistantApp` (`app.js`) para que la IA conozca todo el contexto del usuario sin que este tenga que repetirlo:

```javascript
buildAiSystemInstruction() {
  const todayKey = toLocalDateKey(new Date());
  const weekDays = this.getPlannerWeekDates(); // Lunes a Domingo de la semana activa
  const prefs = (state.dietaryPreferences || []).join(', ') || 'Ninguna restricción específica';
  const goals = state.settings?.nutritionGoals?.enabled
    ? `${state.settings.nutritionGoals.calories} kcal, ${state.settings.nutritionGoals.protein}g Proteínas, ${state.settings.nutritionGoals.carbs}g Carbos, ${state.settings.nutritionGoals.fat}g Grasas`
    : 'Sin metas numéricas estrictas activas';

  const recipesCatalog = (state.recipes || []).map(r => {
    const nut = getRecipeNutrition(r);
    return `- ID: "${r.id}" | Título: "${r.title}" | Tags: [${(r.tags || []).join(', ')}] | Tiempo: ${(r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0)} min | Macros/ración: ${nut.calories} kcal, P:${nut.protein}g, C:${nut.carbs}g, G:${nut.fat}g`;
  }).join('\n');

  const currentPlanSummary = weekDays.map(d => {
    const dayPlan = state.getDayPlan(d.dateKey, d.dayName);
    return `- ${d.dayName} (${d.dateKey}): Desayuno=${dayPlan.breakfast || 'vacío'}, Almuerzo=${dayPlan.lunch || 'vacío'}, Merienda=${dayPlan.snack || 'vacío'}, Cena=${dayPlan.dinner || 'vacío'}`;
  }).join('\n');

  return `Eres el Agente Gastronómico Inteligente de Food Assistant.
Fecha actual: ${todayKey}.
Raciones por defecto en casa: ${state.settings?.defaultServings || 2}.
Preferencias dietéticas del usuario (RESPETAR SIEMPRE): ${prefs}.
Objetivos nutricionales diarios del usuario: ${goals}.

CATÁLOGO DE RECETAS DEL USUARIO:
${recipesCatalog || '(Sin recetas guardadas)'}

PLAN SEMANAL ACTUAL (Semana visible):
${currentPlanSummary}

INSTRUCCIONES DE CONTROL (FUNCTION CALLING):
1. Cuando el usuario pida crear o modificar su menú semanal, USA las herramientas disponibles.
2. Si faltan recetas adecuadas para cumplir sus preferencias dietéticas o sus gustos en algún día, primero llama a "create_and_save_recipe" para crear las recetas nuevas necesarias y luego asígnalas en "set_weekly_plan".
3. En "set_weekly_plan", usa siempre los dateKey exactos de la semana (${weekDays.map(w => `${w.dayName}=${w.dateKey}`).join(', ')}) y los IDs reales de las recetas.
4. Si el usuario pide añadir cosas a la lista de la compra, usa "manage_shopping_list".
5. Responde siempre en español de forma cercana, clara y concisa.`;
}
```

---

### Paso 1.3: Declaración de Herramientas (`AI_TOOLS_DECLARATIONS`) para Gemini Function Calling

Definir la constante global `AI_TOOLS_DECLARATIONS` en `app.js` con el formato oficial de `tools: [{ functionDeclarations: [...] }]` de la API de Gemini:

1. **`create_and_save_recipe`**:
   - **Descripción**: Crea una nueva receta completa en el catálogo del usuario cuando no existe una adecuada o cuando el usuario pide inventar/guardar una receta.
   - **Parámetros (`OBJECT`)**:
     - `id` (`STRING`, opcional, ej. `"rec-ai-salmon-teriyaki"` — si no se pasa o colisiona, se normaliza/genera con `generateId('rec-')`).
     - `title` (`STRING`, requerido)
     - `description` (`STRING`)
     - `prepTimeMinutes` (`INTEGER`)
     - `cookTimeMinutes` (`INTEGER`)
     - `servings` (`INTEGER`)
     - `tags` (`ARRAY` de `STRING`)
     - `ingredients` (`ARRAY` de `{ name: STRING, amount: NUMBER, unit: STRING }`)
     - `instructions` (`ARRAY` de `{ step: INTEGER, text: STRING, timerMinutes: INTEGER }`)
     - `nutrition` (`OBJECT` opcional `{ calories, protein, carbs, fat }`)

2. **`set_weekly_plan`**:
   - **Descripción**: Asigna o actualiza el menú semanal del usuario en el Planificador (`meal_plans`). Resuelve `BUG-15`.
   - **Parámetros (`OBJECT`)**:
     - `mode` (`STRING`: `'replace'` para sobreescribir los slots indicados o `'merge'` para rellenar solo huecos vacíos).
     - `days` (`ARRAY` de objetos `{ dateKey: STRING, dayName: STRING, breakfast: STRING, lunch: STRING, snack: STRING, dinner: STRING }`, donde cada slot contiene el `id` exacto de una receta del catálogo o de una receta recién creada en la misma llamada).

3. **`manage_shopping_list`**:
   - **Descripción**: Añade, marca como comprados o elimina artículos de la lista de la compra, o vuelca los ingredientes de las recetas del plan semanal a la compra.
   - **Parámetros (`OBJECT`)**:
     - `action` (`STRING`: `'add'`, `'check'`, `'remove'`, `'add_from_current_plan'`)
     - `items` (`ARRAY` de `{ name: STRING, amount: NUMBER, unit: STRING }`)

---

### Paso 1.4: Motor de Ejecución de Herramientas (`executeAiToolCall(functionCall)`)

Implementar en `FoodAssistantApp` (`app.js`) el ejecutor determinista que procesa cada `functionCall` devuelto por Gemini (o por el modo simulado si no hay API Key):

1. **Al ejecutar `create_and_save_recipe(args)`**:
   - Normalizar cada ingrediente usando `RecipeParser.normalizeUnit(ing.unit)` y clasificar su pasillo con `categorizeIngredientAisle(ing.name)`.
   - Inferir etiquetas automáticamente con `analyzeAndInferRecipeTags(recipe)` y calcular nutrición con `estimateRecipeNutrition(recipe)` si no viene informada.
   - Guardar en `state.recipes`, persistir con `state.save('fa_recipes', state.recipes)` y encolar subida a Supabase con `this.scheduleSyncWithCloud()`.
   - Devolver `{ status: 'ok', recipeId: newRecipe.id, title: newRecipe.title }`.

2. **Al ejecutar `set_weekly_plan(args)` (`BUG-15`)**:
   - Recorrer `args.days`. Para cada día, obtener el registro con `state.getDayPlan(d.dateKey, d.dayName)`.
   - Resolver cada receta asignada (`breakfast`, `lunch`, `snack`, `dinner`) tanto por `id` exacto como por coincidencia de título insensible a mayúsculas/acentos (por si el modelo envía el título o un ID temporal creado en el mismo turno).
   - Si `args.mode === 'merge'`, solo escribir en los slots que estén vacíos (`!dayPlan[slot]`). Si es `'replace'` (por defecto), asignar los slots indicados.
   - Guardar con `state.save('fa_mealplan', state.mealPlan)`, llamar a `this.scheduleSyncWithCloud()` y `this.render()`.
   - Guardar también `this.lastAiProposedPlan = args` por si el usuario prefiere aplicar o deshacer con 1 clic desde la burbuja del chat.

3. **Al ejecutar `manage_shopping_list(args)`**:
   - Si `action === 'add'`, insertar cada artículo con `id: generateId('shop-')`, `aisle: categorizeIngredientAisle(item.name)`, `amount: Number(item.amount) || 1`, `unit: RecipeParser.normalizeUnit(item.unit)`, `isChecked: false`.
   - Si `action === 'check'`, buscar por nombre normalizado y marcar `isChecked = true`.
   - Si `action === 'remove'`, eliminar de `state.shoppingList` y registrar en `state.trackDeletion('shoppingItems', item.id)`.
   - Si `action === 'add_from_current_plan'`, volcar los ingredientes de la semana actual a la compra.
   - Persistir en `fa_shopping`, sincronizar con la nube y refrescar la vista.

---

### Paso 1.5: UI de Tarjetas de Acción Ejecutadas en el Chat (`#chat-history-container`)

Cuando `handleAiChatSubmit()` procese una respuesta con `functionCalls`:
- Mostrar debajo del mensaje de texto de Gemini **chips o tarjetas resumen interactivas** (Material 3):
  - 📅 *"Menú semanal actualizado (7 días aplicados)"* → Botón **"Ver en Planificador"** (`app.switchView('view-planner')`).
  - 🍳 *"Receta creada: [Título]"* → Botón **"Abrir Receta"** (`app.openRecipeDetail(id)`).
  - 🛒 *"X artículos añadidos a la Lista de la Compra"* → Botón **"Ver Compra"** (`app.switchView('view-shopping')`).

---

## 3. Plan de Pruebas y Criterios de Cierre (CI = Verde)

1. **Añadir suite en `tests/unit.test.js` y `test.html`**:
   - **Test `US-39`**: Verificar con espía sobre `fetch` que `callGeminiApi` NO incluye `?key=` en la URL y envía la cabecera `x-goog-api-key`.
   - **Test `US-37`**: Verificar que `formatSafeAiMarkdown('<script>alert(1)</script> **Hola**')` escapa el `<script>` y conserva `<strong>Hola</strong>`.
   - **Test `BUG-15`**: Verificar que al recibir un plan estructurado de IA para lunes a domingo con IDs concretos, `executeAiToolCall({ name: 'set_weekly_plan', args: ... })` asigna exactamente esos IDs en cada fecha y slot sin usar rotación arbitraria ni ignorar la propuesta.
   - **Test `US-17` (Creación de receta + Compra por IA)**: Verificar que `create_and_save_recipe` crea la receta con pasillos categorizados y macros, y que `manage_shopping_list` añade los artículos solicitados a `state.shoppingList`.
2. **Incrementar versión**: Subir versión en `package.json`, `index.html`, `sw.js`, `app.js` y tests siguiendo `AGENTS.md`.
3. **Verificar CI**: Comprobar que `npm test` y el workflow `CI & Quality Gate` en GitHub Actions terminan en `success`.

