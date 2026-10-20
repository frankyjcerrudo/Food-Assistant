# Component Specifications (replica-design)

## 1. RecipeCard
- **Propósito**: Mostrar una receta en catálogo o resultados del asistente.
- **Variantes**:
  - `GridCard`: Imagen arriba (16:9), badge de tiempo (ej. 25 min), título en 2 líneas máx, tags en chips suaves.
  - `CompactCard`: Imagen cuadrada (64x64) a la izquierda, título y calorías/tiempo al lado.
- **Estados**: Default, Hover (sutil scale 1.02 + elevación de sombra), Selected (borde acento).

## 2. MealSlotCard
- **Propósito**: Ranura de comida en el planificador semanal (Desayuno, Almuerzo, Cena, Snack).
- **Variantes**:
  - `EmptySlot`: Borde discontinuo, botón "+" centrado para asignar receta o pedir a Gemini.
  - `FilledSlot`: Miniatura, nombre del plato, tiempo de preparación, botón rápido de cambiar o eliminar.
- **Estados**: Vacío, Ocupado, Hover de arrastre/swap.

## 3. GroceryItemRow
- **Propósito**: Fila interactiva de ingrediente en la lista de la compra.
- **Estructura**:
  - Casilla de verificación redondeada a la izquierda.
  - Nombre del ingrediente con cantidad en negrita (ej. "350g").
  - Subtexto opcional: De qué receta proviene (ej. "Para: Pasta Pesto").
- **Estados**:
  - `Unchecked`: Texto visible, cantidad resaltada.
  - `Checked`: Tachado, opacidad al 50%, animación suave de desplazamiento al bloque de completados.

## 4. AisleSection
- **Propósito**: Agrupar artículos por pasillo (Frutas/Verduras, Carnicería, Lácteos, Despensa, etc.).
- **Estructura**: Icono temático del pasillo, nombre de la sección y contador de pendientes (ej. "Lácteos (3)").
- **Estados**: Desplegado por defecto, colapsable con un toque.

## 5. GeminiChatBar & CopilotDrawer
- **Propósito**: Asistente de IA para interactuar, pedir menús o recetas según la despensa.
- **Estructura**:
  - Barra inferior con prompts rápidos en píldoras (chips) ("Planifica mi semana", "Cena rápida con pollo", "Receta sin horno").
  - Drawer deslizante con historial de chat y tarjetas de recetas clicables que permiten añadir al plan con un toque.
