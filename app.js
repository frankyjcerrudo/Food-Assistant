/**
 * Food Assistant - Application Core Logic
 * Google Material 3 Design & Full Recipe Editor
 */

const SEED_RECIPES = [
  {
    id: "rec-pesto-pasta",
    title: "Pasta al Pesto Genovés con Tomates Cherry",
    description: "Espaguetis al dente con salsa de albahaca fresca casera, piñones tostados, queso parmesano y tomates cherry salteados.",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 2,
    tags: ["Pasta", "Rápida", "Cena", "Saludable"],
    ingredients: [
      { id: "i1", name: "Espaguetis o Tagliatelle", amount: 200, unit: "g", aisle: "pantry" },
      { id: "i2", name: "Albahaca fresca", amount: 50, unit: "g", aisle: "produce" },
      { id: "i3", name: "Queso Parmesano rallado", amount: 60, unit: "g", aisle: "dairy" },
      { id: "i4", name: "Piñones", amount: 30, unit: "g", aisle: "pantry" },
      { id: "i5", name: "Dientes de ajo", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i6", name: "Aceite de oliva virgen extra", amount: 60, unit: "ml", aisle: "pantry" },
      { id: "i7", name: "Tomates cherry", amount: 150, unit: "g", aisle: "produce" }
    ],
    instructions: [
      { step: 1, text: "Pon una olla grande con agua abundante y sal a hervir a fuego vivo.", timerMinutes: 5 },
      { step: 2, text: "En un mortero o batidora, tritura la albahaca, los piñones tostados, el ajo y el parmesano. Añade el aceite poco a poco.", timerMinutes: 0 },
      { step: 3, text: "Cuece la pasta durante 9-10 minutos hasta que esté al dente.", timerMinutes: 9 },
      { step: 4, text: "En una sartén saltea los tomates cherry 3 minutos con un chorrito de aceite.", timerMinutes: 3 },
      { step: 5, text: "Mezcla la pasta caliente con el pesto fresco y los tomates salteados. ¡Listo!", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-lemon-chicken",
    title: "Pechugas de Pollo al Limón con Patatas Asadas",
    description: "Pechugas jugosas marinadas con limón, ajo y romero fresco, acompañadas de patatas doradas al horno.",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 2,
    tags: ["Pollo", "Almuerzo", "Cena", "Saludable"],
    ingredients: [
      { id: "i8", name: "Pechugas de pollo", amount: 400, unit: "g", aisle: "meat" },
      { id: "i9", name: "Limón (zumo y ralladura)", amount: 2, unit: "ud", aisle: "produce" },
      { id: "i10", name: "Patatas medianas", amount: 3, unit: "ud", aisle: "produce" },
      { id: "i11", name: "Romero fresco", amount: 2, unit: "ramas", aisle: "produce" },
      { id: "i12", name: "Aceite de oliva", amount: 30, unit: "ml", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Precalienta el horno a 200°C.", timerMinutes: 10 },
      { step: 2, text: "Corta las patatas en gajos con aceite, sal y romero. Hornea 15 minutos.", timerMinutes: 15 },
      { step: 3, text: "Dora las pechugas en la sartén 3 minutos por lado con limón y ajo.", timerMinutes: 6 },
      { step: 4, text: "Añade el pollo a la bandeja del horno con las patatas y hornea 15 minutos más.", timerMinutes: 15 }
    ]
  },
  {
    id: "rec-salmon-bowl",
    title: "Salmón a la Plancha con Espárragos y Arroz",
    description: "Lomos de salmón fresco con piel crujiente, espárragos trigueros salteados y base de arroz aromático.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    tags: ["Pescado", "Cena", "Saludable", "Rápida"],
    ingredients: [
      { id: "i13", name: "Lomos de salmón fresco", amount: 300, unit: "g", aisle: "meat" },
      { id: "i14", name: "Espárragos trigueros", amount: 1, unit: "manojo", aisle: "produce" },
      { id: "i15", name: "Arroz basmati", amount: 150, unit: "g", aisle: "pantry" },
      { id: "i16", name: "Salsa de soja baja en sal", amount: 20, unit: "ml", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Cuece el arroz basmati en agua con sal durante 12 minutos y escurre.", timerMinutes: 12 },
      { step: 2, text: "Saltea los espárragos 5 minutos en sartén muy caliente con unas gotas de aceite.", timerMinutes: 5 },
      { step: 3, text: "Marca el salmón por la piel 4 minutos, voltea y cocina 2 minutos más.", timerMinutes: 6 },
      { step: 4, text: "Sirve en cuencos con arroz, salmón y espárragos aliñados con salsa de soja.", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-chickpea-salad",
    title: "Ensalada Mediterránea de Garbanzos y Queso Feta",
    description: "Ensalada fresca, saciante y nutritiva con garbanzos cocidos, queso feta, pepino y vinagreta de orégano.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 2,
    tags: ["Saludable", "Rápida", "Almuerzo", "Vegetariano"],
    ingredients: [
      { id: "i17", name: "Garbanzos cocidos en tarro", amount: 400, unit: "g", aisle: "pantry" },
      { id: "i18", name: "Queso Feta", amount: 100, unit: "g", aisle: "dairy" },
      { id: "i19", name: "Pepino", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i20", name: "Tomates de ensalada", amount: 2, unit: "ud", aisle: "produce" },
      { id: "i21", name: "Aceitunas negras", amount: 50, unit: "g", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Enjuaga y escurre los garbanzos cocidos.", timerMinutes: 0 },
      { step: 2, text: "Corta los tomates y el pepino en dados pequeños. Pica las aceitunas negras.", timerMinutes: 0 },
      { step: 3, text: "En un bol grande combina los garbanzos, verduras y queso feta desmenuzado.", timerMinutes: 0 },
      { step: 4, text: "Aliña con aceite de oliva virgen extra, vinagre, orégano y sal al gusto.", timerMinutes: 0 }
    ]
  }
];

const AISLE_METADATA = {
  produce: { label: "Frutas y Verduras", icon: "🍏" },
  meat: { label: "Carnes y Pescados", icon: "🥩" },
  dairy: { label: "Lácteos y Huevos", icon: "🧀" },
  bakery: { label: "Panadería y Masas", icon: "🥖" },
  pantry: { label: "Despensa y Cereales", icon: "🌾" },
  spices: { label: "Especias y Aceites", icon: "🧂" },
  frozen: { label: "Congelados", icon: "❄️" },
  beverages: { label: "Bebidas", icon: "🧃" },
  other: { label: "Otros y Limpieza", icon: "📦" }
};

class StateManager {
  constructor() {
    this.recipes = this.load('fa_recipes', SEED_RECIPES);
    this.mealPlan = this.load('fa_mealplan', this.getDefaultMealPlan());
    this.shoppingList = this.load('fa_shopping', []);
    this.settings = this.load('fa_settings', {
      geminiApiKey: '',
      geminiModel: 'gemini-2.5-flash',
      defaultServings: 2
    });
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  getDefaultMealPlan() {
    const today = new Date();
    const currentDay = today.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const plan = {};
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const sampleRecipes = ['rec-pesto-pasta', 'rec-lemon-chicken', 'rec-salmon-bowl', 'rec-chickpea-salad'];

    days.forEach((day, index) => {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + index);
      const dateStr = dateObj.toISOString().split('T')[0];

      plan[dateStr] = {
        dayName: day,
        lunch: sampleRecipes[index % sampleRecipes.length] || null,
        dinner: sampleRecipes[(index + 1) % sampleRecipes.length] || null
      };
    });

    return plan;
  }
}

const state = new StateManager();

class FoodAssistantApp {
  constructor() {
    this.currentView = 'view-today';
    this.activeRecipe = null;
    this.activeServings = 2;
    this.cookStepIndex = 0;
    this.timerInterval = null;
    this.timerSecondsLeft = 0;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.views = document.querySelectorAll('.view-panel');
    this.navItems = document.querySelectorAll('.nav-item');
    this.modalRecipeDetail = document.getElementById('modal-recipe-detail');
    this.modalRecipeEdit = document.getElementById('modal-recipe-edit');
    this.modalRecipeImport = document.getElementById('modal-recipe-import');
    this.modalRecipePicker = document.getElementById('modal-recipe-picker');
    this.cookModeOverlay = document.getElementById('cook-mode-overlay');
  }

  bindEvents() {
    this.navItems.forEach(item => {
      item.addEventListener('click', () => this.switchView(item.dataset.view));
    });

    document.getElementById('btn-goto-planner')?.addEventListener('click', () => this.switchView('view-planner'));
    document.getElementById('btn-quick-shopping')?.addEventListener('click', () => this.switchView('view-shopping'));
    document.getElementById('btn-quick-ai-plan')?.addEventListener('click', () => this.switchView('view-ai'));
    document.getElementById('btn-header-settings')?.addEventListener('click', () => this.switchView('view-settings'));

    // Recipe Import Modal
    document.getElementById('btn-quick-import')?.addEventListener('click', () => this.openImportModal());
    document.getElementById('btn-close-import-modal')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-cancel-import')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-execute-import')?.addEventListener('click', () => this.handleRecipeImport());

    // Recipe Create & Edit Modal
    document.getElementById('btn-open-create-recipe')?.addEventListener('click', () => this.openCreateRecipeModal());
    document.getElementById('btn-detail-edit-recipe')?.addEventListener('click', () => {
      if (this.activeRecipe) {
        this.closeRecipeModal();
        this.openEditRecipeModal(this.activeRecipe.id);
      }
    });
    document.getElementById('btn-detail-delete-recipe')?.addEventListener('click', () => this.deleteCurrentRecipe());
    document.getElementById('btn-close-recipe-edit')?.addEventListener('click', () => this.closeEditModal());
    document.getElementById('btn-cancel-recipe-edit')?.addEventListener('click', () => this.closeEditModal());
    document.getElementById('btn-save-recipe-edit')?.addEventListener('click', () => this.saveRecipeEdit());
    document.getElementById('btn-add-ingredient-row')?.addEventListener('click', () => this.addIngredientRow());
    document.getElementById('btn-add-step-row')?.addEventListener('click', () => this.addStepRow());

    // Recipe Search & Tags
    document.getElementById('recipes-search-input')?.addEventListener('input', (e) => this.filterRecipes(e.target.value));
    document.querySelectorAll('#recipes-tag-filters .m3-filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#recipes-tag-filters .m3-filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterRecipesByTag(btn.dataset.tag);
      });
    });

    // Shopping List
    document.getElementById('btn-add-grocery')?.addEventListener('click', () => this.handleManualAddGrocery());
    document.getElementById('input-quick-grocery')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleManualAddGrocery();
    });
    document.getElementById('btn-clear-completed')?.addEventListener('click', () => this.clearCompletedGroceries());
    document.getElementById('btn-copy-shopping')?.addEventListener('click', () => this.copyShoppingList());
    document.getElementById('btn-send-plan-to-shopping')?.addEventListener('click', () => this.generateShoppingFromPlan());

    // Planner AI
    document.getElementById('btn-planner-ai-auto')?.addEventListener('click', () => this.triggerGeminiAutoPlan());

    // Settings
    document.getElementById('btn-save-gemini-key')?.addEventListener('click', () => this.saveGeminiKey());
    document.getElementById('btn-export-backup')?.addEventListener('click', () => this.exportBackup());
    document.getElementById('input-import-backup')?.addEventListener('change', (e) => this.importBackup(e));
    document.getElementById('btn-reset-demo')?.addEventListener('click', () => this.resetDemoData());

    // Modals Close
    document.getElementById('btn-close-recipe-modal')?.addEventListener('click', () => this.closeRecipeModal());
    document.getElementById('btn-close-picker-modal')?.addEventListener('click', () => this.closePickerModal());
    document.getElementById('btn-exit-cook-mode')?.addEventListener('click', () => this.exitCookMode());
    document.getElementById('btn-cook-next-step')?.addEventListener('click', () => this.nextCookStep());
    document.getElementById('btn-cook-prev-step')?.addEventListener('click', () => this.prevCookStep());

    // Chat AI Prompts
    document.querySelectorAll('.chips-scroll-container .m3-filter-chip[data-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('ai-chat-input');
        if (input) {
          input.value = chip.dataset.prompt;
          this.handleAiChatSubmit();
        }
      });
    });
    document.getElementById('btn-send-ai-chat')?.addEventListener('click', () => this.handleAiChatSubmit());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleAiChatSubmit();
    });
  }

  switchView(viewId) {
    this.currentView = viewId;
    this.views.forEach(v => v.classList.remove('active'));
    document.getElementById(viewId)?.classList.add('active');

    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    this.renderTodayView();
    this.renderRecipesGrid(state.recipes);
    this.renderPlanner();
    this.renderShoppingList();
    this.renderSettings();
  }

  renderTodayView() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayPlan = state.mealPlan[todayStr] || {
      lunch: state.recipes[0]?.id || null,
      dinner: state.recipes[1]?.id || null
    };

    document.getElementById('stat-total-recipes').textContent = state.recipes.length;
    
    let plannedCount = 0;
    Object.values(state.mealPlan).forEach(day => {
      if (day.lunch) plannedCount++;
      if (day.dinner) plannedCount++;
    });
    document.getElementById('stat-planned-meals').textContent = plannedCount;

    const pendingItems = state.shoppingList.filter(i => !i.isChecked).length;
    document.getElementById('stat-shopping-items').textContent = pendingItems;

    const container = document.getElementById('today-slots-container');
    if (!container) return;

    const slots = [
      { key: 'lunch', label: '☀️ Almuerzo' },
      { key: 'dinner', label: '🌙 Cena' }
    ];

    container.innerHTML = slots.map(s => {
      const recId = todayPlan[s.key];
      const recipe = state.recipes.find(r => r.id === recId);

      if (recipe) {
        return `
          <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')">
            <span class="slot-label">${s.label}</span>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
              <img src="${recipe.imageUrl}" alt="" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
              <div style="flex: 1;">
                <div class="slot-recipe-name">${recipe.title}</div>
                <div style="font-size: 11px; color: var(--m3-on-surface-variant); margin-top: 2px;">
                  ⏱️ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="meal-slot" onclick="app.openPickerModal('${todayStr}', '${s.key}')">
            <span class="slot-label">${s.label}</span>
            <div class="slot-action-text">+ Asignar plato para hoy</div>
          </div>
        `;
      }
    }).join('');
  }

  renderRecipesGrid(recipesList) {
    const grid = document.getElementById('recipes-cards-grid');
    if (!grid) return;

    if (!recipesList.length) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 16px; color: var(--m3-on-surface-variant);">
          <div style="font-size: 36px; margin-bottom: 8px;">📖</div>
          <h3>No se encontraron recetas</h3>
        </div>
      `;
      return;
    }

    grid.innerHTML = recipesList.map(rec => `
      <article class="recipe-card" onclick="app.openRecipeDetail('${rec.id}')">
        <div class="recipe-image-wrap">
          <img class="recipe-img" src="${rec.imageUrl}" alt="${rec.title}" loading="lazy">
          <div class="recipe-time-badge">
            ⏱️ ${rec.prepTimeMinutes + rec.cookTimeMinutes} min
          </div>
        </div>
        <div class="recipe-body">
          <h3 class="recipe-title">${rec.title}</h3>
          <p class="recipe-desc">${rec.description}</p>
          <div class="recipe-tags">
            ${rec.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');
  }

  filterRecipes(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.renderRecipesGrid(state.recipes);
      return;
    }
    const filtered = state.recipes.filter(r => 
      r.title.toLowerCase().includes(term) ||
      r.tags.some(t => t.toLowerCase().includes(term))
    );
    this.renderRecipesGrid(filtered);
  }

  filterRecipesByTag(tag) {
    if (!tag || tag === 'all') {
      this.renderRecipesGrid(state.recipes);
      return;
    }
    const filtered = state.recipes.filter(r => r.tags.includes(tag));
    this.renderRecipesGrid(filtered);
  }

  // RECIPE DETAIL MODAL
  openRecipeDetail(recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    this.activeRecipe = recipe;
    this.activeServings = recipe.servings;
    this.renderRecipeModalContent();
    this.modalRecipeDetail.classList.add('active');
  }

  closeRecipeModal() {
    this.modalRecipeDetail.classList.remove('active');
  }

  adjustServings(delta) {
    this.activeServings = Math.max(1, this.activeServings + delta);
    this.renderRecipeModalContent();
  }

  renderRecipeModalContent() {
    const r = this.activeRecipe;
    const body = document.getElementById('recipe-modal-body');
    if (!body || !r) return;

    const scale = this.activeServings / r.servings;

    body.innerHTML = `
      <div style="position: relative; height: 220px; background: #000; overflow: hidden;">
        <img src="${r.imageUrl}" alt="${r.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      
      <div style="padding: 18px;">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
          ${r.tags.map(t => `<span class="tag-chip" style="background: var(--m3-primary-container); color: var(--m3-on-primary-container); font-weight: 700;">${t}</span>`).join('')}
        </div>
        
        <h2 style="font-size: 20px; font-weight: 500; line-height: 1.3; margin-bottom: 6px;">${r.title}</h2>
        <p style="font-size: 13px; color: var(--m3-on-surface-variant); line-height: 1.45; margin-bottom: 16px;">${r.description}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--m3-surface-container); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--m3-on-surface-variant);">Tiempo Total</div>
            <div style="font-size: 14px; font-weight: 500;">⏱️ ${r.prepTimeMinutes + r.cookTimeMinutes} min</div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--m3-on-surface-variant);">Porciones</div>
              <div style="font-weight: 500; font-size: 13px;">👥 ${this.activeServings} personas</div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-secondary btn-sm" onclick="app.adjustServings(-1)" style="width: 28px; height: 28px; padding: 0;">-</button>
              <button class="btn btn-secondary btn-sm" onclick="app.adjustServings(1)" style="width: 28px; height: 28px; padding: 0;">+</button>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="font-size: 15px; font-weight: 500;">Ingredientes</h3>
            <button class="btn btn-tonal btn-sm" onclick="app.addRecipeIngredientsToShopping('${r.id}')">
              <span>🛒</span> Enviar a la Compra
            </button>
          </div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
            ${r.ingredients.map(ing => {
              const adjustedAmount = ing.amount ? Math.round((ing.amount * scale) * 10) / 10 : null;
              return `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--m3-surface-container-low); border: 1px solid var(--m3-outline-variant); border-radius: var(--radius-sm); font-size: 13px;">
                  <span>${ing.name}</span>
                  <strong style="color: var(--m3-primary);">${adjustedAmount !== null ? `${adjustedAmount} ${ing.unit || ''}` : ''}</strong>
                </li>
              `;
            }).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 18px;">
          <h3 style="font-size: 15px; font-weight: 500; margin-bottom: 10px;">Instrucciones</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${r.instructions.map(inst => `
              <div style="display: flex; gap: 10px;">
                <div style="width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--m3-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0;">
                  ${inst.step}
                </div>
                <div style="flex: 1; font-size: 13px; line-height: 1.45;">
                  ${inst.text}
                  ${inst.timerMinutes > 0 ? `
                    <div style="margin-top: 4px; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: var(--m3-primary); background: var(--m3-primary-container); padding: 2px 6px; border-radius: var(--radius-full);">
                      ⏱️ ${inst.timerMinutes} minutos
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px;" onclick="app.startCookMode()">
          <span>🍳</span> Empezar Modo Cocina Paso a Paso
        </button>
      </div>
    `;
  }

  deleteCurrentRecipe() {
    if (!this.activeRecipe) return;
    if (confirm(`¿Eliminar la receta "${this.activeRecipe.title}"?`)) {
      state.recipes = state.recipes.filter(r => r.id !== this.activeRecipe.id);
      state.save('fa_recipes', state.recipes);
      this.closeRecipeModal();
      this.render();
    }
  }

  // RECIPE EDITOR (CREATE & EDIT)
  openCreateRecipeModal() {
    document.getElementById('recipe-edit-modal-title').textContent = "Nueva Receta";
    document.getElementById('edit-recipe-id').value = "";
    document.getElementById('edit-recipe-title').value = "";
    document.getElementById('edit-recipe-desc').value = "";
    document.getElementById('edit-recipe-prep').value = "15";
    document.getElementById('edit-recipe-cook').value = "20";
    document.getElementById('edit-recipe-servings').value = state.settings.defaultServings || "2";
    document.getElementById('edit-recipe-image').value = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";
    document.getElementById('edit-recipe-tags').value = "Cena, Saludable";

    document.getElementById('edit-ingredients-container').innerHTML = "";
    document.getElementById('edit-steps-container').innerHTML = "";

    this.addIngredientRow({ name: "", amount: "", unit: "", aisle: "produce" });
    this.addStepRow({ step: 1, text: "", timerMinutes: 0 });

    this.modalRecipeEdit.classList.add('active');
  }

  openEditRecipeModal(recipeId) {
    const r = state.recipes.find(rec => rec.id === recipeId);
    if (!r) return;

    document.getElementById('recipe-edit-modal-title').textContent = "Editar Receta";
    document.getElementById('edit-recipe-id').value = r.id;
    document.getElementById('edit-recipe-title').value = r.title;
    document.getElementById('edit-recipe-desc').value = r.description || "";
    document.getElementById('edit-recipe-prep').value = r.prepTimeMinutes || 0;
    document.getElementById('edit-recipe-cook').value = r.cookTimeMinutes || 0;
    document.getElementById('edit-recipe-servings').value = r.servings || 2;
    document.getElementById('edit-recipe-image').value = r.imageUrl || "";
    document.getElementById('edit-recipe-tags').value = r.tags.join(', ');

    const ingContainer = document.getElementById('edit-ingredients-container');
    ingContainer.innerHTML = "";
    r.ingredients.forEach(ing => this.addIngredientRow(ing));

    const stepContainer = document.getElementById('edit-steps-container');
    stepContainer.innerHTML = "";
    r.instructions.forEach(step => this.addStepRow(step));

    this.modalRecipeEdit.classList.add('active');
  }

  closeEditModal() {
    this.modalRecipeEdit.classList.remove('active');
  }

  addIngredientRow(data = {}) {
    const container = document.getElementById('edit-ingredients-container');
    const row = document.createElement('div');
    row.className = 'edit-ing-row';
    row.style = 'display: grid; grid-template-columns: 2fr 1fr 1fr 2fr 32px; gap: 6px; align-items: center;';

    row.innerHTML = `
      <input type="text" class="form-input ing-name" placeholder="Ingrediente (ej. Pollo)" value="${data.name || ''}">
      <input type="number" class="form-input ing-amount" placeholder="Cant." value="${data.amount !== null && data.amount !== undefined ? data.amount : ''}">
      <input type="text" class="form-input ing-unit" placeholder="g / ud" value="${data.unit || ''}">
      <select class="form-select ing-aisle">
        <option value="produce" ${data.aisle === 'produce' ? 'selected' : ''}>🍏 Verduras</option>
        <option value="meat" ${data.aisle === 'meat' ? 'selected' : ''}>🥩 Carnes</option>
        <option value="dairy" ${data.aisle === 'dairy' ? 'selected' : ''}>🧀 Lácteos</option>
        <option value="bakery" ${data.aisle === 'bakery' ? 'selected' : ''}>🥖 Panadería</option>
        <option value="pantry" ${data.aisle === 'pantry' ? 'selected' : ''}>🌾 Despensa</option>
        <option value="spices" ${data.aisle === 'spices' ? 'selected' : ''}>🧂 Especias</option>
        <option value="frozen" ${data.aisle === 'frozen' ? 'selected' : ''}>❄️ Congelados</option>
        <option value="beverages" ${data.aisle === 'beverages' ? 'selected' : ''}>🧃 Bebidas</option>
        <option value="other" ${data.aisle === 'other' ? 'selected' : ''}>📦 Otros</option>
      </select>
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="padding: 0; color: var(--m3-error);" title="Eliminar">✕</button>
    `;
    container.appendChild(row);
  }

  addStepRow(data = {}) {
    const container = document.getElementById('edit-steps-container');
    const currentStepNum = container.children.length + 1;
    const row = document.createElement('div');
    row.className = 'edit-step-row';
    row.style = 'display: flex; gap: 8px; align-items: flex-start;';

    row.innerHTML = `
      <div style="width: 24px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: var(--m3-on-surface-variant); flex-shrink: 0;">
        ${currentStepNum}
      </div>
      <textarea class="form-textarea step-text" rows="2" placeholder="Instrucción del paso..." style="flex: 1;">${data.text || ''}</textarea>
      <div style="width: 80px; flex-shrink: 0;">
        <input type="number" class="form-input step-timer" placeholder="Min" title="Temporizador en minutos" value="${data.timerMinutes || 0}">
      </div>
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="padding: 6px 8px; color: var(--m3-error);" title="Eliminar">✕</button>
    `;
    container.appendChild(row);
  }

  saveRecipeEdit() {
    const title = document.getElementById('edit-recipe-title').value.trim();
    if (!title) {
      alert("Por favor, introduce el título de la receta.");
      return;
    }

    const id = document.getElementById('edit-recipe-id').value || ('rec-' + Date.now());
    const description = document.getElementById('edit-recipe-desc').value.trim();
    const prepTimeMinutes = parseInt(document.getElementById('edit-recipe-prep').value, 10) || 0;
    const cookTimeMinutes = parseInt(document.getElementById('edit-recipe-cook').value, 10) || 0;
    const servings = parseInt(document.getElementById('edit-recipe-servings').value, 10) || 2;
    const imageUrl = document.getElementById('edit-recipe-image').value.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";
    const tagsStr = document.getElementById('edit-recipe-tags').value.trim();
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ["General"];

    // Collect Ingredients
    const ingredients = [];
    document.querySelectorAll('#edit-ingredients-container .edit-ing-row').forEach(row => {
      const name = row.querySelector('.ing-name').value.trim();
      const amountVal = row.querySelector('.ing-amount').value;
      const unit = row.querySelector('.ing-unit').value.trim();
      const aisle = row.querySelector('.ing-aisle').value;

      if (name) {
        ingredients.push({
          id: 'i-' + Math.random().toString(36).substr(2, 6),
          name: name,
          amount: amountVal !== "" ? parseFloat(amountVal) : null,
          unit: unit,
          aisle: aisle
        });
      }
    });

    // Collect Instructions
    const instructions = [];
    let stepCount = 1;
    document.querySelectorAll('#edit-steps-container .edit-step-row').forEach(row => {
      const text = row.querySelector('.step-text').value.trim();
      const timerMinutes = parseInt(row.querySelector('.step-timer').value, 10) || 0;
      if (text) {
        instructions.push({
          step: stepCount++,
          text: text,
          timerMinutes: timerMinutes
        });
      }
    });

    const updatedRecipe = {
      id,
      title,
      description,
      imageUrl,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      tags,
      ingredients,
      instructions
    };

    const existingIdx = state.recipes.findIndex(r => r.id === id);
    if (existingIdx >= 0) {
      state.recipes[existingIdx] = updatedRecipe;
    } else {
      state.recipes.unshift(updatedRecipe);
    }

    state.save('fa_recipes', state.recipes);
    this.closeEditModal();
    this.render();
    this.openRecipeDetail(id);
    alert("¡Receta guardada con éxito! ✨");
  }

  // COOK MODE
  startCookMode() {
    this.closeRecipeModal();
    this.cookStepIndex = 0;
    this.cookModeOverlay.classList.add('active');
    this.renderCookStep();
  }

  exitCookMode() {
    clearInterval(this.timerInterval);
    this.cookModeOverlay.classList.remove('active');
  }

  nextCookStep() {
    if (this.cookStepIndex < this.activeRecipe.instructions.length - 1) {
      this.cookStepIndex++;
      this.renderCookStep();
    } else {
      alert("¡Enhorabuena! Has completado todos los pasos de la receta. ¡A disfrutar! 🎉");
      this.exitCookMode();
    }
  }

  prevCookStep() {
    if (this.cookStepIndex > 0) {
      this.cookStepIndex--;
      this.renderCookStep();
    }
  }

  renderCookStep() {
    const r = this.activeRecipe;
    const step = r.instructions[this.cookStepIndex];
    
    document.getElementById('cook-recipe-title').textContent = r.title;
    document.getElementById('cook-step-indicator').textContent = `Paso ${step.step} de ${r.instructions.length}`;
    document.getElementById('cook-step-text').textContent = step.text;

    const timerBox = document.getElementById('cook-timer-box');
    clearInterval(this.timerInterval);

    if (step.timerMinutes > 0) {
      timerBox.style.display = 'block';
      this.timerSecondsLeft = step.timerMinutes * 60;
      this.updateTimerDisplay();

      document.getElementById('btn-timer-start').onclick = () => this.toggleCookTimer();
      document.getElementById('btn-timer-reset').onclick = () => {
        clearInterval(this.timerInterval);
        this.timerSecondsLeft = step.timerMinutes * 60;
        this.updateTimerDisplay();
        document.getElementById('btn-timer-start').textContent = 'Iniciar';
      };
    } else {
      timerBox.style.display = 'none';
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerSecondsLeft / 60);
    const secs = this.timerSecondsLeft % 60;
    document.getElementById('cook-timer-digits').textContent = 
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  toggleCookTimer() {
    const btn = document.getElementById('btn-timer-start');
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      btn.textContent = 'Reanudar';
    } else {
      btn.textContent = 'Pausar';
      this.timerInterval = setInterval(() => {
        if (this.timerSecondsLeft > 0) {
          this.timerSecondsLeft--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          btn.textContent = '¡Completado!';
          this.playTimerChime();
        }
      }, 1000);
    }
  }

  playTimerChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {}
  }

  // PLANNER
  renderPlanner() {
    const container = document.getElementById('planner-days-container');
    if (!container) return;

    const daysEntries = Object.entries(state.mealPlan);

    container.innerHTML = daysEntries.map(([dateStr, dayData]) => {
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      return `
        <div class="day-card">
          <div class="day-header">
            <div class="day-name">
              <span>${dayData.dayName}</span>
              <span style="font-size: 13px; font-weight: 500; color: var(--m3-on-surface-variant);">${dateStr}</span>
              ${isToday ? `<span class="day-badge-today">HOY</span>` : ''}
            </div>
          </div>

          <div class="slots-grid">
            ${this.renderSlotCard(dateStr, 'lunch', '☀️ Almuerzo', dayData.lunch)}
            ${this.renderSlotCard(dateStr, 'dinner', '🌙 Cena', dayData.dinner)}
          </div>
        </div>
      `;
    }).join('');
  }

  renderSlotCard(dateStr, slotType, slotLabel, recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);

    if (recipe) {
      return `
        <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="slot-label">${slotLabel}</span>
            <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.clearSlot('${dateStr}', '${slotType}')" title="Quitar">✕</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <img src="${recipe.imageUrl}" alt="" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;">
            <div style="flex: 1; overflow: hidden;">
              <div class="slot-recipe-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${recipe.title}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="meal-slot" onclick="app.openPickerModal('${dateStr}', '${slotType}')">
          <span class="slot-label">${slotLabel}</span>
          <div class="slot-action-text">+ Asignar plato</div>
        </div>
      `;
    }
  }

  clearSlot(dateStr, slotType) {
    if (state.mealPlan[dateStr]) {
      state.mealPlan[dateStr][slotType] = null;
      state.save('fa_mealplan', state.mealPlan);
      this.render();
    }
  }

  openPickerModal(dateStr, slotType) {
    this.pickerTarget = { dateStr, slotType };
    const list = document.getElementById('picker-recipes-list');
    document.getElementById('picker-modal-title').textContent = `Elegir plato para ${slotType.toUpperCase()}`;
    
    list.innerHTML = state.recipes.map(r => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--m3-surface-container-low); border: 1px solid var(--m3-outline-variant); border-radius: var(--radius-md); cursor: pointer;"
           onclick="app.selectRecipeForSlot('${r.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${r.imageUrl}" alt="" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
          <div>
            <strong style="font-size: 13px; color: var(--m3-on-surface);">${r.title}</strong>
            <div style="font-size: 11px; color: var(--m3-on-surface-variant);">⏱️ ${r.prepTimeMinutes + r.cookTimeMinutes} min</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm">Elegir</button>
      </div>
    `).join('');

    this.modalRecipePicker.classList.add('active');
  }

  closePickerModal() {
    this.modalRecipePicker.classList.remove('active');
  }

  selectRecipeForSlot(recipeId) {
    if (this.pickerTarget) {
      if (!state.mealPlan[this.pickerTarget.dateStr]) state.mealPlan[this.pickerTarget.dateStr] = { lunch: null, dinner: null };
      state.mealPlan[this.pickerTarget.dateStr][this.pickerTarget.slotType] = recipeId;
      state.save('fa_mealplan', state.mealPlan);
      this.closePickerModal();
      this.render();
    }
  }

  // SHOPPING LIST
  renderShoppingList() {
    const container = document.getElementById('shopping-aisles-container');
    if (!container) return;

    const pendingCount = state.shoppingList.filter(i => !i.isChecked).length;
    document.getElementById('shopping-summary-text').textContent = 
      `${pendingCount} artículo${pendingCount === 1 ? '' : 's'} pendiente${pendingCount === 1 ? '' : 's'}`;

    if (!state.shoppingList.length) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px 16px; color: var(--m3-on-surface-variant);">
          <div style="font-size: 36px; margin-bottom: 6px;">🛒</div>
          <h3 style="color: var(--m3-on-surface); font-size: 16px;">Lista de la compra vacía</h3>
          <p style="font-size: 13px; margin: 4px 0 16px 0;">
            Genera la lista desde tu plan semanal con un clic o añade artículos manualmente.
          </p>
          <button class="btn btn-primary btn-sm" onclick="app.generateShoppingFromPlan()">
            Generar desde el Plan
          </button>
        </div>
      `;
      return;
    }

    const grouped = {};
    state.shoppingList.forEach((item, index) => {
      const aisle = item.aisle || 'other';
      if (!grouped[aisle]) grouped[aisle] = [];
      grouped[aisle].push({ ...item, originalIndex: index });
    });

    container.innerHTML = Object.entries(grouped).map(([aisleKey, items]) => {
      const meta = AISLE_METADATA[aisleKey] || AISLE_METADATA.other;
      const pendingInAisle = items.filter(i => !i.isChecked).length;

      return `
        <div class="aisle-card">
          <div class="aisle-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${meta.icon}</span>
              <span>${meta.label}</span>
            </div>
            <span style="font-size: 11px; color: var(--m3-on-surface-variant);">${pendingInAisle} pendientes</span>
          </div>

          <div>
            ${items.map(item => `
              <div class="grocery-item-row ${item.isChecked ? 'checked' : ''}">
                <div class="grocery-left" onclick="app.toggleGroceryCheck(${item.originalIndex})">
                  <input type="checkbox" class="grocery-checkbox" ${item.isChecked ? 'checked' : ''} onclick="event.stopPropagation(); app.toggleGroceryCheck(${item.originalIndex})">
                  <div>
                    <div class="grocery-name">${item.name}</div>
                    ${item.recipeOrigin ? `<div style="font-size: 11px; color: var(--m3-on-surface-variant);">Para: ${item.recipeOrigin}</div>` : ''}
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${item.amount ? `<span class="grocery-amount">${item.amount} ${item.unit || ''}</span>` : ''}
                  <button class="btn-ghost btn-sm" onclick="app.deleteGroceryItem(${item.originalIndex})" title="Eliminar">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  toggleGroceryCheck(index) {
    if (state.shoppingList[index]) {
      state.shoppingList[index].isChecked = !state.shoppingList[index].isChecked;
      state.save('fa_shopping', state.shoppingList);
      this.render();
    }
  }

  deleteGroceryItem(index) {
    state.shoppingList.splice(index, 1);
    state.save('fa_shopping', state.shoppingList);
    this.render();
  }

  clearCompletedGroceries() {
    state.shoppingList = state.shoppingList.filter(i => !i.isChecked);
    state.save('fa_shopping', state.shoppingList);
    this.render();
  }

  handleManualAddGrocery() {
    const input = document.getElementById('input-quick-grocery');
    const text = input.value.trim();
    if (!text) return;

    let aisle = 'other';
    const lower = text.toLowerCase();
    if (/manzana|platano|plátano|limon|limón|cebolla|patata|tomate|lechuga|zanahoria|ajo|aguacate|espinaca/.test(lower)) aisle = 'produce';
    else if (/pollo|ternera|cerdo|salmon|salmón|pescado|atun|atún|jamon|jamón|carne/.test(lower)) aisle = 'meat';
    else if (/leche|queso|yogur|mantequilla|huevo/.test(lower)) aisle = 'dairy';
    else if (/pan|tortilla|galleta|harina|bollo/.test(lower)) aisle = 'bakery';
    else if (/arroz|pasta|lenteja|garbanzo|aceite|vinagre|azucar|azúcar|cafe|café|sal/.test(lower)) aisle = 'pantry';
    else if (/pimienta|oregano|orégano|romero|comino|curry|canela/.test(lower)) aisle = 'spices';
    else if (/helado|guisante|pizza/.test(lower)) aisle = 'frozen';

    state.shoppingList.push({
      name: text,
      amount: null,
      unit: '',
      aisle: aisle,
      isChecked: false,
      recipeOrigin: null
    });

    state.save('fa_shopping', state.shoppingList);
    input.value = '';
    this.render();
  }

  addRecipeIngredientsToShopping(recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const scale = this.activeServings / recipe.servings;

    recipe.ingredients.forEach(ing => {
      const calculatedAmount = ing.amount ? Math.round((ing.amount * scale) * 10) / 10 : null;
      const existing = state.shoppingList.find(i => i.name.toLowerCase() === ing.name.toLowerCase() && i.unit === ing.unit);

      if (existing && existing.amount && calculatedAmount) {
        existing.amount = Math.round((existing.amount + calculatedAmount) * 10) / 10;
        existing.isChecked = false;
      } else {
        state.shoppingList.push({
          name: ing.name,
          amount: calculatedAmount,
          unit: ing.unit || '',
          aisle: ing.aisle || 'other',
          isChecked: false,
          recipeOrigin: recipe.title
        });
      }
    });

    state.save('fa_shopping', state.shoppingList);
    this.render();
    alert(`¡${recipe.ingredients.length} ingredientes añadidos a la lista de la compra! 🛒`);
  }

  generateShoppingFromPlan() {
    let count = 0;
    const addedMap = new Map();

    Object.values(state.mealPlan).forEach(day => {
      ['lunch', 'dinner'].forEach(slot => {
        const rId = day[slot];
        if (rId) {
          const recipe = state.recipes.find(r => r.id === rId);
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              const key = `${ing.name.toLowerCase()}_${ing.unit || ''}`;
              if (addedMap.has(key)) {
                const item = addedMap.get(key);
                if (item.amount && ing.amount) {
                  item.amount = Math.round((item.amount + ing.amount) * 10) / 10;
                }
              } else {
                addedMap.set(key, {
                  name: ing.name,
                  amount: ing.amount,
                  unit: ing.unit || '',
                  aisle: ing.aisle || 'other',
                  isChecked: false,
                  recipeOrigin: recipe.title
                });
                count++;
              }
            });
          }
        }
      });
    });

    if (count === 0) {
      alert("No hay recetas asignadas en el plan semanal para generar la lista.");
      return;
    }

    state.shoppingList = Array.from(addedMap.values());
    state.save('fa_shopping', state.shoppingList);
    this.switchView('view-shopping');
    alert(`¡Lista generada con éxito con ${state.shoppingList.length} artículos por pasillos! 🛒`);
  }

  copyShoppingList() {
    if (!state.shoppingList.length) return;

    let text = "🛒 LISTA DE LA COMPRA\n\n";
    const grouped = {};
    state.shoppingList.forEach(i => {
      const aisle = i.aisle || 'other';
      if (!grouped[aisle]) grouped[aisle] = [];
      grouped[aisle].push(i);
    });

    Object.entries(grouped).forEach(([aisleKey, items]) => {
      const meta = AISLE_METADATA[aisleKey] || AISLE_METADATA.other;
      text += `${meta.icon} ${meta.label.toUpperCase()}\n`;
      items.forEach(item => {
        text += `${item.isChecked ? '✓' : '•'} ${item.name} ${item.amount ? `(${item.amount} ${item.unit || ''})` : ''}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
      alert("¡Lista copiada al portapapeles!");
    });
  }

  // GEMINI AI INTEGRATION
  async callGeminiApi(prompt, systemInstruction = "") {
    const apiKey = state.settings.geminiApiKey?.trim();
    if (!apiKey) {
      return this.simulateGeminiDemoResponse(prompt);
    }

    const model = state.settings.geminiModel || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Error al conectar con Gemini API");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  simulateGeminiDemoResponse(prompt) {
    const lower = prompt.toLowerCase();
    
    if (lower.includes('planifica') || lower.includes('semana') || lower.includes('menú')) {
      return `¡He analizado tus recetas guardadas y he preparado un menú semanal balanceado para ti!

📅 **Lunes**: Pasta al Pesto Genovés (Almuerzo) / Salmón a la Plancha (Cena)
📅 **Martes**: Pechugas al Limón (Almuerzo) / Ensalada Mediterránea (Cena)
📅 **Miércoles**: Ensalada de Garbanzos (Almuerzo) / Pasta al Pesto (Cena)
📅 **Jueves**: Pechugas al Limón (Almuerzo) / Salmón con Espárragos (Cena)
📅 **Viernes**: Salmón a la Plancha (Almuerzo) / Pechugas al Limón (Cena)
📅 **Sábado**: Pasta al Pesto (Almuerzo) / Cena Ligera
📅 **Domingo**: Pollo Asado con Patatas (Almuerzo Familiar)`;
    }

    if (lower.includes('pollo') || lower.includes('nevera') || lower.includes('tengo')) {
      return `Con el pollo, calabacín y patatas te sugiero preparar unas **Pechugas Salteadas con Dados de Patata y Calabacín al Romero**:

⏱️ **Tiempo**: 25 min | 👥 **Porciones**: 2
📝 **Ingredientes**:
• 350g de pechugas de pollo en dados
• 2 patatas medianas en cubos
• 1 calabacín en rodajas
• Aceite de oliva, romero y ajo

👨‍🍳 **Paso a paso**:
1. Dora las patatas en una sartén con aceite durante 10 min a fuego medio-alto.
2. Añade el pollo en dados y cocina 5 min hasta dorar.
3. Incorpora el calabacín y romero, saltea 5 min más y sirve caliente.`;
    }

    return `He tomado nota de tu consulta. Puedes configurar tu clave de API gratuita de Gemini en la pestaña de Ajustes ⚙️ para obtener respuestas 100% personalizadas en tiempo real.`;
  }

  async handleAiChatSubmit() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;

    const history = document.getElementById('chat-history-container');
    
    const userBubble = document.createElement('div');
    userBubble.style = 'background-color: var(--m3-primary); color: white; padding: 10px 14px; border-radius: var(--radius-lg); font-size: 13px; line-height: 1.45; align-self: flex-end; max-width: 85%;';
    userBubble.textContent = text;
    history.appendChild(userBubble);
    input.value = '';
    history.scrollTop = history.scrollHeight;

    const aiBubble = document.createElement('div');
    aiBubble.style = 'background-color: var(--m3-surface-container); padding: 12px 14px; border-radius: var(--radius-lg); font-size: 13px; line-height: 1.45; align-self: flex-start; max-width: 88%;';
    aiBubble.innerHTML = '<em>Consultando a Gemini... ✨</em>';
    history.appendChild(aiBubble);
    history.scrollTop = history.scrollHeight;

    try {
      const recipeSummary = state.recipes.map(r => `- ${r.title} (${r.tags.join(', ')})`).join('\n');
      const systemPrompt = `Eres el asistente gastronómico de Food Assistant. El usuario tiene guardadas estas recetas:\n${recipeSummary}\nResponde en español de forma minimalista, clara y directa.`;

      const aiResponse = await this.callGeminiApi(text, systemPrompt);
      aiBubble.innerHTML = aiResponse.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      if (text.toLowerCase().includes('planifica') || text.toLowerCase().includes('semana')) {
        const applyBtn = document.createElement('button');
        applyBtn.className = 'btn btn-primary btn-sm';
        applyBtn.style.marginTop = '10px';
        applyBtn.innerHTML = '📅 Aplicar este menú al Planificador';
        applyBtn.onclick = () => this.applySampleAiPlan();
        aiBubble.appendChild(document.createElement('br'));
        aiBubble.appendChild(applyBtn);
      }
    } catch (err) {
      aiBubble.innerHTML = `<span style="color: var(--m3-error);">⚠️ Error: ${err.message}</span>`;
    }

    history.scrollTop = history.scrollHeight;
  }

  applySampleAiPlan() {
    const sampleKeys = state.recipes.map(r => r.id);
    let i = 0;
    Object.keys(state.mealPlan).forEach(dateKey => {
      state.mealPlan[dateKey].lunch = sampleKeys[i % sampleKeys.length];
      state.mealPlan[dateKey].dinner = sampleKeys[(i + 1) % sampleKeys.length];
      i++;
    });
    state.save('fa_mealplan', state.mealPlan);
    this.render();
    alert("¡Menú asignado con éxito a tu calendario! 📅");
    this.switchView('view-planner');
  }

  triggerGeminiAutoPlan() {
    this.switchView('view-ai');
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = "Planifica mi menú semanal equilibrado de lunes a domingo con mis recetas guardadas.";
      this.handleAiChatSubmit();
    }
  }

  // IMPORTER
  openImportModal() {
    document.getElementById('import-status-indicator').style.display = 'none';
    this.modalRecipeImport.classList.add('active');
  }

  closeImportModal() {
    this.modalRecipeImport.classList.remove('active');
  }

  async handleRecipeImport() {
    const url = document.getElementById('import-url-input').value.trim();
    const rawText = document.getElementById('import-text-input').value.trim();
    const status = document.getElementById('import-status-indicator');

    if (!url && !rawText) {
      alert("Por favor, introduce una URL o pega el texto de la receta.");
      return;
    }

    status.style.display = 'block';
    status.style.color = 'var(--m3-primary)';
    status.innerHTML = '✨ Extrayendo y estructurando receta con Gemini...';

    try {
      let parsed = null;
      if (!state.settings.geminiApiKey) {
        parsed = {
          title: "Pollo Rustido con Verduras",
          description: "Receta limpia extraída: pechugas doradas y jugosas con verduras salteadas.",
          prepTimeMinutes: 10,
          cookTimeMinutes: 25,
          servings: 2,
          tags: ["Pollo", "Cena", "Saludable"],
          ingredients: [
            { name: "Pechugas de pollo", amount: 400, unit: "g", aisle: "meat" },
            { name: "Pimiento rojo", amount: 1, unit: "ud", aisle: "produce" },
            { name: "Calabacín", amount: 1, unit: "ud", aisle: "produce" },
            { name: "Hierbas provenzales", amount: 1, unit: "cda", aisle: "spices" }
          ],
          instructions: [
            { step: 1, text: "Corta las verduras y el pollo en dados medianos.", timerMinutes: 0 },
            { step: 2, text: "Cocina todo en una sartén o bandeja de horno 20 min a fuego medio.", timerMinutes: 20 }
          ]
        };
      } else {
        const prompt = `Analiza la receta (URL: ${url || 'N/A'}, Texto: ${rawText || 'N/A'}).
Devuelve ÚNICAMENTE un JSON válido con:
{
  "title": "Nombre",
  "description": "Descripción",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 20,
  "servings": 2,
  "tags": ["Cena", "Rápida"],
  "ingredients": [{ "name": "Ingrediente", "amount": 200, "unit": "g", "aisle": "produce" }],
  "instructions": [{ "step": 1, "text": "Paso...", "timerMinutes": 5 }]
}
Donde aisle debe ser uno de: produce, meat, dairy, bakery, pantry, spices, frozen, other.`;
        const raw = await this.callGeminiApi(prompt);
        parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
      }

      parsed.id = 'rec-import-' + Date.now();
      parsed.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";

      state.recipes.unshift(parsed);
      state.save('fa_recipes', state.recipes);

      status.style.color = 'var(--color-brand)';
      status.innerHTML = '✅ ¡Receta importada y guardada!';
      
      setTimeout(() => {
        this.closeImportModal();
        this.switchView('view-recipes');
        this.openRecipeDetail(parsed.id);
      }, 800);

    } catch (e) {
      status.style.color = 'var(--m3-error)';
      status.innerHTML = `⚠️ Error al extraer receta: ${e.message}`;
    }
  }

  // SETTINGS
  renderSettings() {
    const inputKey = document.getElementById('input-gemini-key');
    const status = document.getElementById('gemini-key-status');
    const selectServings = document.getElementById('select-default-servings');

    if (inputKey) inputKey.value = state.settings.geminiApiKey || '';
    if (selectServings) selectServings.value = state.settings.defaultServings || 2;

    if (status) {
      if (state.settings.geminiApiKey) {
        status.innerHTML = '<span style="color: var(--color-brand); font-weight: 500;">✓ Clave configurada y activa</span>';
      } else {
        status.innerHTML = '<span style="color: var(--m3-on-surface-variant);">Modo Demo activo</span>';
      }
    }
  }

  saveGeminiKey() {
    const key = document.getElementById('input-gemini-key').value.trim();
    state.settings.geminiApiKey = key;
    state.save('fa_settings', state.settings);
    this.renderSettings();
    alert("¡Clave de Google Gemini guardada!");
  }

  exportBackup() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      recipes: state.recipes,
      mealPlan: state.mealPlan,
      shoppingList: state.shoppingList
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.recipes) state.recipes = imported.recipes;
        if (imported.mealPlan) state.mealPlan = imported.mealPlan;
        if (imported.shoppingList) state.shoppingList = imported.shoppingList;

        state.save('fa_recipes', state.recipes);
        state.save('fa_mealplan', state.mealPlan);
        state.save('fa_shopping', state.shoppingList);

        this.render();
        alert("¡Copia de seguridad restaurada!");
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  }

  resetDemoData() {
    if (confirm("¿Restablecer todas las recetas y planes a los valores iniciales?")) {
      localStorage.clear();
      location.reload();
    }
  }
}

let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new FoodAssistantApp();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
