import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Cargar app.js en el entorno global
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  StateStore,
  state,
  FoodAssistantApp,
  cleanRecipeImageUrl,
  getRecipeTheme,
  getRecipePlaceholderSvg,
  getRecipePlaceholderHtml,
  escapeHtml
} = window;

describe('US-16: Gestión Flexible de Imágenes de Recetas y Avatares Gráficos Elegantes (v1.12)', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <section id="view-recipes" class="view-panel active">
        <div id="recipes-container"></div>
      </section>
      <div id="recipe-modal-body"></div>
      <dialog id="modal-recipe-detail" class="modal-overlay"></dialog>
      <dialog id="modal-recipe-edit" class="modal-overlay">
        <h3 id="recipe-edit-modal-title"></h3>
        <input type="hidden" id="edit-recipe-id">
        <input type="text" id="edit-recipe-title">
        <textarea id="edit-recipe-desc"></textarea>
        <input type="number" id="edit-recipe-prep" value="10">
        <input type="number" id="edit-recipe-cook" value="15">
        <input type="number" id="edit-recipe-servings" value="2">
        <input type="text" id="edit-recipe-tags">
        <div id="editor-selected-tags-container"></div>
        <div id="editor-dietary-chips"></div>
        <div id="editor-occasion-chips"></div>
        <div id="editor-practical-chips"></div>
        <div id="edit-ingredients-container"></div>
        <div id="edit-steps-container"></div>
        <input type="number" id="edit-recipe-calories">
        <input type="number" id="edit-recipe-protein">
        <input type="number" id="edit-recipe-carbs">
        <input type="number" id="edit-recipe-fat">

        <!-- US-16 Image Editor Elements -->
        <div id="recipe-editor-image-preview-container">
          <div id="recipe-editor-image-preview-content"></div>
        </div>
        <input type="file" id="edit-recipe-file-input">
        <button id="btn-edit-recipe-upload-file"></button>
        <button id="btn-edit-recipe-ai-image"></button>
        <button id="btn-edit-recipe-remove-image"></button>
        <input type="url" id="edit-recipe-image">
      </dialog>
      <div id="toast" class="toast"></div>
    `;

    appInstance = new FoodAssistantApp();
    window.app = appInstance;
  });

  // ========================================================================
  // 1. Limpieza y saneamiento de URLs (cleanRecipeImageUrl)
  // ========================================================================
  describe('Limpieza y Saneamiento de URLs de Imágenes (cleanRecipeImageUrl)', () => {
    it('elimina comillas, backticks y corchetes angulares accidentales', () => {
      const urlWithQuotes = '"https://images.unsplash.com/photo-test?w=800"';
      expect(cleanRecipeImageUrl(urlWithQuotes)).toBe('https://images.unsplash.com/photo-test?w=800');

      const urlWithSingleQuotes = "'https://cdn.cocina.com/foto.jpg'";
      expect(cleanRecipeImageUrl(urlWithSingleQuotes)).toBe('https://cdn.cocina.com/foto.jpg');

      const urlWithBrackets = '<https://sitio.com/receta.png>';
      expect(cleanRecipeImageUrl(urlWithBrackets)).toBe('https://sitio.com/receta.png');
    });

    it('elimina parámetros de tracking y analítica (utm_*, fbclid, gclid, _ga, etc.) preservando parámetros funcionales', () => {
      const trackingUrl = 'https://images.unsplash.com/photo-12345?w=800&fit=crop&utm_source=instagram&utm_medium=social&utm_campaign=summer&fbclid=IwAR2345&gclid=Cj0KCQ&_ga=GA1.2.123';
      const cleaned = cleanRecipeImageUrl(trackingUrl);

      expect(cleaned).toContain('w=800');
      expect(cleaned).toContain('fit=crop');
      expect(cleaned).not.toContain('utm_source');
      expect(cleaned).not.toContain('utm_medium');
      expect(cleaned).not.toContain('utm_campaign');
      expect(cleaned).not.toContain('fbclid');
      expect(cleaned).not.toContain('gclid');
      expect(cleaned).not.toContain('_ga');
    });

    it('preserva data URLs en base64 de fotos subidas por el usuario', () => {
      const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      expect(cleanRecipeImageUrl(dataUrl)).toBe(dataUrl);
    });

    it('devuelve cadena vacía si el valor es nulo, indefinido o espacios', () => {
      expect(cleanRecipeImageUrl('')).toBe('');
      expect(cleanRecipeImageUrl('   ')).toBe('');
      expect(cleanRecipeImageUrl(null)).toBe('');
      expect(cleanRecipeImageUrl(undefined)).toBe('');
    });
  });

  // ========================================================================
  // 2. Detección Ampliada de Temas y Paletas Gastronómicas (getRecipeTheme)
  // ========================================================================
  describe('Clasificación Temática Gastronómica Ampliada (getRecipeTheme)', () => {
    it('clasifica pescados (set_meal, teal)', () => {
      const theme = getRecipeTheme('Salmón al horno con patatas');
      expect(theme.type).toBe('fish');
      expect(theme.icon).toBe('set_meal');
    });

    it('clasifica mariscos y crustáceos (phishing, ocean blue)', () => {
      const theme = getRecipeTheme('Gambas al ajillo');
      expect(theme.type).toBe('seafood');
      expect(theme.icon).toBe('phishing');
    });

    it('clasifica pastas y fideos (ramen_dining, terracotta)', () => {
      const theme = getRecipeTheme('Espaguetis al pesto casero');
      expect(theme.type).toBe('pasta');
      expect(theme.icon).toBe('ramen_dining');
    });

    it('clasifica arroces y paellas (rice_bowl, saffron)', () => {
      const theme = getRecipeTheme('Paella valenciana tradicional');
      expect(theme.type).toBe('rice');
      expect(theme.icon).toBe('rice_bowl');
    });

    it('clasifica pizzas y masas (local_pizza, brick red)', () => {
      const theme = getRecipeTheme('Pizza artesana margarita');
      expect(theme.type).toBe('pizza');
      expect(theme.icon).toBe('local_pizza');
    });

    it('clasifica hamburguesas y barbacoa (lunch_dining, maroon)', () => {
      const theme = getRecipeTheme('Hamburguesa de buey con queso');
      expect(theme.type).toBe('burger');
      expect(theme.icon).toBe('lunch_dining');
    });

    it('clasifica aves y pollo (skillet, amber)', () => {
      const theme = getRecipeTheme('Pechugas de pollo al limón');
      expect(theme.type).toBe('poultry');
      expect(theme.icon).toBe('skillet');
    });

    it('clasifica carnes rojas y solomillo (kebab_dining, deep warm)', () => {
      const theme = getRecipeTheme('Solomillo de cerdo a la pimienta');
      expect(theme.type).toBe('meat');
      expect(theme.icon).toBe('kebab_dining');
    });

    it('clasifica sopas, purés y legumbres (soup_kitchen, ochre)', () => {
      const theme = getRecipeTheme('Lentejas estofadas con verduras');
      expect(theme.type).toBe('soup');
      expect(theme.icon).toBe('soup_kitchen');
    });

    it('clasifica huevos y tortillas (egg, golden yellow)', () => {
      const theme = getRecipeTheme('Tortilla de patatas con cebolla');
      expect(theme.type).toBe('egg');
      expect(theme.icon).toBe('egg');
    });

    it('clasifica bocadillos, tacos y wraps (breakfast_dining, orange)', () => {
      const theme = getRecipeTheme('Tacos de ternera con guacamole');
      expect(theme.type).toBe('sandwich');
      expect(theme.icon).toBe('breakfast_dining');
    });

    it('clasifica ensaladas y frescos (nutrition, green)', () => {
      const theme = getRecipeTheme('Ensalada fresca de garbanzos');
      expect(theme.type).toBe('salad');
      expect(theme.icon).toBe('nutrition');
    });

    it('clasifica verduras y huerta (eco, emerald)', () => {
      const theme = getRecipeTheme('Pisto manchego con calabacín');
      expect(theme.type).toBe('vegetable');
      expect(theme.icon).toBe('eco');
    });

    it('clasifica avena y cereales (grain, oat sand)', () => {
      const theme = getRecipeTheme('Porridge de avena con chía');
      expect(theme.type).toBe('oats');
      expect(theme.icon).toBe('grain');
    });

    it('clasifica panadería y bollería (bakery_dining, bronze)', () => {
      const theme = getRecipeTheme('Pan casero de masa madre');
      expect(theme.type).toBe('bakery');
      expect(theme.icon).toBe('bakery_dining');
    });

    it('clasifica postres y dulces (cake, pink/berry)', () => {
      const theme = getRecipeTheme('Tarta de queso al horno');
      expect(theme.type).toBe('dessert');
      expect(theme.icon).toBe('cake');
    });

    it('clasifica bebidas y batidos (emoji_food_beverage, violet)', () => {
      const theme = getRecipeTheme('Batido de proteínas de fresa');
      expect(theme.type).toBe('beverage');
      expect(theme.icon).toBe('emoji_food_beverage');
    });

    it('clasifica aperitivos y snacks (cookie, caramel)', () => {
      const theme = getRecipeTheme('Snack de nueces y almendras');
      expect(theme.type).toBe('snack');
      expect(theme.icon).toBe('cookie');
    });

    it('aplica tema default con icono restaurant para platos genéricos', () => {
      const theme = getRecipeTheme('Plato sorpresa casero');
      expect(theme.type).toBe('default');
      expect(theme.icon).toBe('restaurant');
    });
  });

  // ========================================================================
  // 3. Generación Limpia sin Textos Innecesarios en Placeholders
  // ========================================================================
  describe('Generación Limpia sin Texto en Fotos (getRecipePlaceholderSvg & getRecipePlaceholderHtml)', () => {
    it('getRecipePlaceholderSvg NO incluye etiquetas de texto en la imagen', () => {
      const svgUri = getRecipePlaceholderSvg('Salmón al Horno', 'card');
      const decoded = decodeURIComponent(svgUri);

      expect(decoded).toContain('<svg');
      expect(decoded).toContain('linearGradient');
      // No debe contener textos en la imagen
      expect(decoded).not.toContain('<text');
      expect(decoded).not.toContain('PESCADO');
      expect(decoded).not.toContain('CARNES');
      // Conserva el arte decorativo y avatar vajilla
      expect(decoded).toContain('stroke');
    });

    it('getRecipePlaceholderHtml NO incluye etiquetas de texto de categoría en el placeholder', () => {
      const html = getRecipePlaceholderHtml({ title: 'Risotto de Setas', tags: ['Italiana'] }, 'card');
      expect(html).toContain('recipe-placeholder-art');
      expect(html).toContain('recipe-placeholder-avatar');
      expect(html).toContain('material-symbols-outlined');
      expect(html).toContain('rice_bowl');
      // Sin badge de texto visible en la foto
      expect(html).not.toContain('recipe-placeholder-label');
      expect(html).not.toContain('Arroces');
    });

    it('getRecipePlaceholderHtml soporta tamaño detail con avatar limpio', () => {
      const html = getRecipePlaceholderHtml('Sepia estofada', 'detail');
      expect(html).toContain('size-detail');
      expect(html).not.toContain('recipe-placeholder-label');
    });
  });

  // ========================================================================
  // 4. Integración en Catálogo y Ficha de Detalle
  // ========================================================================
  describe('Renderizado de Tarjetas y Modal Detalle con Fallback Elegante', () => {
    it('renderSingleRecipeCardHtml muestra avatar gráfico limpio si la receta no tiene imagen', () => {
      const recipeSinFoto = {
        id: 'rec-sin-foto',
        title: 'Lentejas Caseras',
        description: 'Deliciosas lentejas sin foto',
        imageUrl: '',
        prepTimeMinutes: 10,
        cookTimeMinutes: 30,
        tags: ['Guiso']
      };

      const cardHtml = appInstance.renderSingleRecipeCardHtml(recipeSinFoto, false);
      expect(cardHtml).toContain('recipe-placeholder-art');
      expect(cardHtml).toContain('soup_kitchen');
      expect(cardHtml).not.toContain('<img class="recipe-img" src=""');
      expect(cardHtml).not.toContain('recipe-placeholder-label');
    });

    it('renderSingleRecipeCardHtml incluye onerror inteligente para rescatar imágenes rotas', () => {
      const recipeFotoRota = {
        id: 'rec-foto-rota',
        title: 'Pollo Asado',
        description: 'Pollo jugoso',
        imageUrl: 'https://servidor-caido.com/foto-rota.jpg',
        prepTimeMinutes: 10,
        cookTimeMinutes: 30,
        tags: ['Pollo']
      };

      const cardHtml = appInstance.renderSingleRecipeCardHtml(recipeFotoRota, false);
      expect(cardHtml).toContain('onerror="this.onerror=null; this.parentElement.innerHTML=app.getRecipePlaceholderHtml');
    });

    it('renderRecipeModalContent muestra avatar de cabecera limpio si la receta carece de imagen', () => {
      appInstance.activeRecipe = {
        id: 'rec-modal-sin-foto',
        title: 'Tortilla Española',
        description: 'Plato tradicional',
        imageUrl: '',
        servings: 4,
        prepTimeMinutes: 15,
        cookTimeMinutes: 20,
        tags: ['Huevos']
      };
      appInstance.activeServings = 4;

      appInstance.renderRecipeModalContent();
      const modalBody = document.getElementById('recipe-modal-body');
      expect(modalBody.innerHTML).toContain('recipe-placeholder-art');
      expect(modalBody.innerHTML).toContain('size-detail');
      expect(modalBody.innerHTML).toContain('egg');
      expect(modalBody.innerHTML).not.toContain('recipe-placeholder-label');
    });
  });

  // ========================================================================
  // 5. Gestión de Imágenes en el Editor de Recetas (Subida, URL, IA y Quitar)
  // ========================================================================
  describe('Editor de Recetas: Previsualización, Subida, URL Limpia y Generación IA', () => {
    it('openCreateRecipeModal inicializa preview en modo avatar gráfico elegante sin foto ni texto', () => {
      appInstance.openCreateRecipeModal();
      const preview = document.getElementById('recipe-editor-image-preview-content');
      const removeBtn = document.getElementById('btn-edit-recipe-remove-image');

      expect(preview.innerHTML).toContain('recipe-placeholder-art');
      expect(removeBtn.style.display).toBe('none');
    });

    it('openEditRecipeModal carga foto existente y muestra badge correspondiente', () => {
      const recipeConFoto = {
        id: 'rec-test-edit',
        title: 'Salmón Teriyaki',
        description: 'Salmón con salsa dulce',
        imageUrl: 'https://images.unsplash.com/photo-salmon?w=800',
        servings: 2,
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        tags: ['Pescado']
      };

      appInstance.openEditRecipeModal(recipeConFoto);
      const preview = document.getElementById('recipe-editor-image-preview-content');
      const removeBtn = document.getElementById('btn-edit-recipe-remove-image');

      expect(preview.innerHTML).toContain('<img src="https://images.unsplash.com/photo-salmon?w=800"');
      expect(preview.innerHTML).toContain('URL Externa');
      expect(removeBtn.style.display).toBe('inline-flex');
    });

    it('removeRecipeImage limpia la foto, restaura avatar elegante y avisa al usuario', () => {
      document.getElementById('edit-recipe-image').value = 'https://ejemplo.com/foto.jpg';
      appInstance.updateRecipeEditorImagePreview();

      appInstance.removeRecipeImage();
      expect(document.getElementById('edit-recipe-image').value).toBe('');
      const preview = document.getElementById('recipe-editor-image-preview-content');
      expect(preview.innerHTML).toContain('recipe-placeholder-art');
    });

    it('handleRecipeImageFileUpload comprime el archivo y asigna el Data URL', async () => {
      const fakeFile = new Blob(['fake image content'], { type: 'image/jpeg' });
      vi.spyOn(appInstance, 'compressImageToBase64').mockResolvedValue({
        dataUrl: 'data:image/jpeg;base64,OPTIMIZED_BASE64_DATA',
        base64Data: 'OPTIMIZED_BASE64_DATA',
        mimeType: 'image/jpeg'
      });

      await appInstance.handleRecipeImageFileUpload(fakeFile);
      expect(document.getElementById('edit-recipe-image').value).toBe('data:image/jpeg;base64,OPTIMIZED_BASE64_DATA');

      const preview = document.getElementById('recipe-editor-image-preview-content');
      expect(preview.innerHTML).toContain('Foto propia');
    });

    it('generateRecipeImageWithAi alerta si el título está vacío', async () => {
      document.getElementById('edit-recipe-title').value = '';
      const toastSpy = vi.spyOn(appInstance, 'showToast');

      await appInstance.generateRecipeImageWithAi();
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('introduce el título del plato'), 'error');
    });

    it('generateRecipeImageWithAi crea fotografía gastronómica con IA cuando hay título', async () => {
      document.getElementById('edit-recipe-title').value = 'Risotto de Setas Silvestres';
      document.getElementById('edit-recipe-desc').value = 'Cremoso arroz con boletus y parmesano';
      appInstance.editorSelectedTags = new Set(['Cena', 'Italiana']);

      await appInstance.generateRecipeImageWithAi();
      const generatedUrl = document.getElementById('edit-recipe-image').value;

      expect(generatedUrl).toContain('image.pollinations.ai/prompt/');
      expect(generatedUrl).toContain('Risotto%20de%20Setas%20Silvestres');
      expect(generatedUrl).toContain('width=800');

      const preview = document.getElementById('recipe-editor-image-preview-content');
      expect(preview.innerHTML).toContain('Generada con IA');
    });

    it('saveRecipeEdit guarda la URL saneada en la receta sin parámetros de tracking', () => {
      document.getElementById('edit-recipe-id').value = 'rec-save-test';
      document.getElementById('edit-recipe-title').value = 'Pasta Carbonara Auténtica';
      document.getElementById('edit-recipe-desc').value = 'Con guanciale y pecorino';
      document.getElementById('edit-recipe-prep').value = '10';
      document.getElementById('edit-recipe-cook').value = '15';
      document.getElementById('edit-recipe-servings').value = '2';
      document.getElementById('edit-recipe-image').value = 'https://images.unsplash.com/carbonara?w=800&utm_source=twitter&fbclid=123';

      appInstance.saveRecipeEdit();

      const saved = state.recipes.find(r => r.id === 'rec-save-test');
      expect(saved).toBeDefined();
      expect(saved.imageUrl).toBe('https://images.unsplash.com/carbonara?w=800');
      expect(saved.imageUrl).not.toContain('utm_source');
      expect(saved.imageUrl).not.toContain('fbclid');
    });
  });
});
