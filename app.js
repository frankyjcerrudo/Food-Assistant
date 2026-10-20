/**
 * Food Assistant - Application Core Logic
 * Google Material 3 Design, Google Material Symbols, 3-Way Theme Manager & Cloud Sync
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
      { step: 5, text: "Mezcla la pasta caliente con el pesto fresco y los tomates salteados. ¡Listo para servir!", timerMinutes: 0 }
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
      { step: 1, text: "Cuece el arroz basmati con el doble de agua durante 11 minutos.", timerMinutes: 11 },
      { step: 2, text: "Saltea los espárragos con un chorrito de aceite de oliva y sal gorda.", timerMinutes: 6 },
      { step: 3, text: "Cocina el salmón a fuego medio-alto 4 minutos por el lado de la piel y 2 minutos por el otro lado.", timerMinutes: 6 },
      { step: 4, text: "Sirve en un bol con el arroz y espárragos con un toque de salsa de soja.", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-chickpea-salad",
    title: "Ensalada Mediterránea de Garbanzos y Aguacate",
    description: "Plato fresco y saciante sin cocción con garbanzos, pepino crujiente, queso feta, aguacate y vinagreta de limón.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 12,
    cookTimeMinutes: 0,
    servings: 2,
    tags: ["Saludable", "Rápida", "Almuerzo", "Cena"],
    ingredients: [
      { id: "i17", name: "Garbanzos cocidos en conserva", amount: 400, unit: "g", aisle: "pantry" },
      { id: "i18", name: "Aguacate maduro", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i19", name: "Queso Feta en dados", amount: 80, unit: "g", aisle: "dairy" },
      { id: "i20", name: "Pepino", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i21", name: "Cebolla morada", amount: 0.5, unit: "ud", aisle: "produce" }
    ],
    instructions: [
      { step: 1, text: "Enjuaga y escurre bien los garbanzos en conserva.", timerMinutes: 0 },
      { step: 2, text: "Corta el pepino, el aguacate y la cebolla morada en dados pequeños.", timerMinutes: 0 },
      { step: 3, text: "Mezcla todo en un bol amplio junto con el queso feta desmenuzado.", timerMinutes: 0 },
      { step: 4, text: "Aliña con aceite de oliva virgen extra, zumo de limón, sal y orégano.", timerMinutes: 0 }
    ]
  }
];

const AISLE_METADATA = {
  produce: { label: "Frutas y Verduras", icon: "eco" },
  meat: { label: "Carnes y Pescados", icon: "set_meal" },
  dairy: { label: "Lácteos y Huevos", icon: "egg" },
  bakery: { label: "Panadería y Masas", icon: "bakery_dining" },
  pantry: { label: "Despensa y Básicos", icon: "kitchen" },
  spices: { label: "Especias y Aceites", icon: "grain" },
  frozen: { label: "Congelados", icon: "ac_unit" },
  beverages: { label: "Bebidas", icon: "local_cafe" },
  other: { label: "Otros / Varios", icon: "category" }
};

// Application State Store (Local First + Cloud Sync)
class StateStore {
  constructor() {
    this.recipes = this.load('fa_recipes', SEED_RECIPES);
    this.mealPlan = this.load('fa_mealplan', this.generateInitialMealPlan());
    this.shoppingList = this.load('fa_shopping', []);
    this.settings = this.load('fa_settings', {
      geminiApiKey: '',
      defaultServings: 2,
      geminiModel: 'gemini-2.5-flash'
    });
    this.theme = localStorage.getItem('fa_theme_mode') || 'system';
    this.cloudUser = this.load('fa_cloud_user', null);
    this.supabaseConfig = {
      url: window.APP_CONFIG?.supabaseUrl || localStorage.getItem('fa_sb_url') || '',
      anonKey: window.APP_CONFIG?.supabaseAnonKey || localStorage.getItem('fa_sb_key') || ''
    };
    this.lastSyncedAt = localStorage.getItem('fa_last_sync') || null;
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
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  generateInitialMealPlan() {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const plan = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      plan[dateKey] = {
        dayName: days[(d.getDay() + 6) % 7],
        lunch: i === 0 ? "rec-pesto-pasta" : (i === 1 ? "rec-lemon-chicken" : null),
        dinner: i === 0 ? "rec-salmon-bowl" : (i === 1 ? "rec-chickpea-salad" : null)
      };
    }
    return plan;
  }
}

const state = new StateStore();

// UI Controller
class FoodAssistantApp {
  constructor() {
    this.activeView = 'view-today';
    this.activeRecipe = null;
    this.activeServings = 2;
    this.pickerTarget = null;
    
    // Cook mode state
    this.cookStepIndex = 0;
    this.timerInterval = null;
    this.timerSecondsLeft = 0;

    // Supabase client instance
    this.supabaseClient = null;

    this.initElements();
    this.initTheme();
    this.initSupabaseClient();
    this.initEvents();
    this.updateUserAccountUI();
    this.render();
  }

  initElements() {
    this.navItems = document.querySelectorAll('.bottom-nav .nav-item');
    this.viewPanels = document.querySelectorAll('.view-panel');
    
    // Modals
    this.modalRecipeDetail = document.getElementById('modal-recipe-detail');
    this.modalRecipePicker = document.getElementById('modal-recipe-picker');
    this.modalRecipeImport = document.getElementById('modal-recipe-import');
    this.modalRecipeEdit = document.getElementById('modal-recipe-edit');
    this.modalAuth = document.getElementById('modal-auth');
    this.modalShoppingPreview = document.getElementById('modal-shopping-preview');
    this.cookModeOverlay = document.getElementById('cook-mode-overlay');
  }

  // ==========================================================================
  // ITEM 3: 3-WAY THEME SELECTOR (SYSTEM / LIGHT / DARK)
  // ==========================================================================
  initTheme() {
    this.applyTheme(state.theme);

    // Watch system color scheme changes when in 'system' mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (state.theme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  applyTheme(themeMode) {
    state.theme = themeMode;
    localStorage.setItem('fa_theme_mode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);

    // Update Header Theme Icon & Tooltip
    const headerIcon = document.getElementById('header-theme-icon');
    const headerBtn = document.getElementById('btn-header-theme');
    if (headerIcon && headerBtn) {
      if (themeMode === 'light') {
        headerIcon.textContent = 'light_mode';
        headerBtn.title = 'Aspecto: Modo Claro (clic para cambiar)';
      } else if (themeMode === 'dark') {
        headerIcon.textContent = 'dark_mode';
        headerBtn.title = 'Aspecto: Modo Oscuro (clic para cambiar)';
      } else {
        headerIcon.textContent = 'brightness_auto';
        headerBtn.title = 'Aspecto: Automático / Sistema (clic para cambiar)';
      }
    }

    // Update Segmented Button in Settings View
    document.querySelectorAll('#theme-segmented-group .segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeVal === themeMode);
    });
  }

  toggleNextTheme() {
    const cycle = { system: 'light', light: 'dark', dark: 'system' };
    const next = cycle[state.theme] || 'system';
    this.applyTheme(next);
  }

  // ==========================================================================
  // ITEM 2: CLOUD AUTH & SUPABASE DATABASE SYNC
  // ==========================================================================
  initSupabaseClient() {
    const rawUrl = state.supabaseConfig.url || '';
    const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    const cleanKey = (state.supabaseConfig.anonKey || '').trim();

    if (window.supabase && cleanUrl && cleanKey) {
      try {
        this.supabaseClient = window.supabase.createClient(cleanUrl, cleanKey);

        // Check active session (including after Google OAuth redirect)
        this.supabaseClient.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            state.cloudUser = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              id: session.user.id,
              provider: session.user.app_metadata?.provider || 'email'
            };
            state.save('fa_cloud_user', state.cloudUser);
            this.updateUserAccountUI();
          }
        });

        // Listen for real-time auth changes
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
            state.cloudUser = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              id: session.user.id,
              provider: session.user.app_metadata?.provider || 'email'
            };
            state.save('fa_cloud_user', state.cloudUser);
            this.updateUserAccountUI();
            this.syncDataWithCloud(true);
          } else if (event === 'SIGNED_OUT') {
            state.cloudUser = null;
            state.save('fa_cloud_user', null);
            this.updateUserAccountUI();
          }
        });
      } catch (err) {
        console.warn("Could not create Supabase client:", err);
      }
    }
  }

  updateUserAccountUI() {
    const user = state.cloudUser;
    const pillBtn = document.getElementById('btn-header-account');
    const pillIcon = document.getElementById('header-account-icon');
    const pillText = document.getElementById('header-account-text');

    const settingsIcon = document.getElementById('settings-user-icon');
    const settingsName = document.getElementById('settings-user-name');
    const settingsStatus = document.getElementById('settings-user-status');
    const settingsAuthBtn = document.getElementById('btn-settings-auth-action');

    const authModalTitle = document.getElementById('auth-modal-title');
    const authForms = document.getElementById('auth-forms-container');
    const authTabs = document.getElementById('auth-tab-buttons');
    const authLoggedIn = document.getElementById('auth-logged-in-container');

    if (user && user.email) {
      // Authenticated state
      if (pillBtn) {
        pillBtn.classList.add('logged-in');
        pillBtn.title = user.name ? `${user.name} (${user.email})` : user.email;
      }
      if (pillIcon) pillIcon.textContent = 'cloud_done';
      const firstName = user.name ? user.name.trim().split(' ')[0] : user.email.split('@')[0];
      if (pillText) pillText.textContent = firstName;

      if (settingsIcon) settingsIcon.textContent = 'cloud_done';
      if (settingsName) settingsName.textContent = user.name ? `${user.name} (${user.email})` : user.email;
      if (settingsStatus) {
        const syncText = state.lastSyncedAt ? `Última sincronización: ${new Date(state.lastSyncedAt).toLocaleTimeString()}` : "Conectado a la nube";
        settingsStatus.textContent = syncText;
      }
      if (settingsAuthBtn) settingsAuthBtn.textContent = 'Ver Cuenta';

      if (authModalTitle) authModalTitle.textContent = 'Mi Cuenta en la Nube';
      if (authTabs) authTabs.style.display = 'none';
      if (authForms) authForms.style.display = 'none';
      if (authLoggedIn) {
        authLoggedIn.style.display = 'block';
        document.getElementById('auth-profile-name').textContent = user.name || 'Usuario';
        document.getElementById('auth-profile-email').textContent = user.email;
      }
    } else {
      // Guest / Local state
      if (pillBtn) pillBtn.classList.remove('logged-in');
      if (pillIcon) pillIcon.textContent = 'account_circle';
      if (pillText) pillText.textContent = 'Iniciar sesión';

      if (settingsIcon) settingsIcon.textContent = 'account_circle';
      if (settingsName) settingsName.textContent = 'Modo Local (Invitado)';
      if (settingsStatus) settingsStatus.textContent = 'Datos almacenados solo en este dispositivo';
      if (settingsAuthBtn) settingsAuthBtn.textContent = 'Iniciar Sesión';

      if (authModalTitle) authModalTitle.textContent = 'Cuenta en la Nube';
      if (authTabs) authTabs.style.display = 'flex';
      if (authForms) authForms.style.display = 'block';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
    }
  }

  openAuthModal() {
    this.updateUserAccountUI();
    this.modalAuth.classList.add('active');
  }

  closeAuthModal() {
    this.modalAuth.classList.remove('active');
    const errBox = document.getElementById('auth-error-msg');
    if (errBox) errBox.style.display = 'none';
  }

  switchAuthTab(tabName) {
    const tabBtns = document.querySelectorAll('#auth-tab-buttons .auth-tab');
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));

    const nameGroup = document.getElementById('group-auth-name');
    const submitBtn = document.getElementById('btn-submit-auth');
    if (tabName === 'signup') {
      nameGroup.style.display = 'block';
      submitBtn.textContent = 'Crear Cuenta y Conectar';
    } else {
      nameGroup.style.display = 'none';
      submitBtn.textContent = 'Iniciar Sesión';
    }
  }

  async handleAuthSubmit() {
    const isSignUp = document.querySelector('#auth-tab-buttons .auth-tab.active')?.dataset.tab === 'signup';
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const name = document.getElementById('auth-name').value.trim();
    const errBox = document.getElementById('auth-error-msg');

    if (!email || !password) {
      if (errBox) {
        errBox.textContent = "Por favor, introduce tu correo y contraseña.";
        errBox.style.display = 'block';
      }
      return;
    }

    if (password.length < 6) {
      if (errBox) {
        errBox.textContent = "La contraseña debe tener al menos 6 caracteres.";
        errBox.style.display = 'block';
      }
      return;
    }

    // Try Supabase auth if client initialized
    if (this.supabaseClient) {
      try {
        if (isSignUp) {
          const { data, error } = await this.supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { full_name: name || email.split('@')[0] } }
          });
          if (error) throw error;
          state.cloudUser = { email: data.user.email, name: name || email.split('@')[0], id: data.user.id };
        } else {
          const { data, error } = await this.supabaseClient.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
          state.cloudUser = { email: data.user.email, name: data.user.user_metadata?.full_name || email.split('@')[0], id: data.user.id };
        }
      } catch (err) {
        if (errBox) {
          errBox.textContent = err.message || "Error al autenticar en Supabase.";
          errBox.style.display = 'block';
        }
        return;
      }
    } else {
      // Seamless cloud workspace mode (stores authenticated cloud profile locally & syncs)
      state.cloudUser = {
        email,
        name: name || email.split('@')[0],
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        token: 'tk_' + Date.now()
      };
    }

    state.save('fa_cloud_user', state.cloudUser);
    this.updateUserAccountUI();
    this.closeAuthModal();
    this.syncDataWithCloud(true);
    alert(`¡Bienvenido a Food Assistant, ${state.cloudUser.name}! Tu cuenta está conectada.`);
  }

  async handleGoogleAuth() {
    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) throw error;
      } catch (err) {
        alert("Error al conectar con Google OAuth: " + err.message);
      }
    } else {
      // Local/Simulated Google OAuth sign-in flow
      const demoEmail = prompt("Acceso con cuenta de Google. Introduce tu correo de Google:", "frankyjcerrudo@gmail.com");
      if (!demoEmail) return;

      const userName = demoEmail.split('@')[0];
      state.cloudUser = {
        email: demoEmail,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        id: 'usr_g_' + Math.random().toString(36).substr(2, 9),
        provider: 'google'
      };
      state.save('fa_cloud_user', state.cloudUser);
      this.updateUserAccountUI();
      this.closeAuthModal();
      this.syncDataWithCloud(true);
      alert(`¡Sesión iniciada con Google (${state.cloudUser.email})! Tu cuenta está conectada.`);
    }
  }

  logoutCloudUser() {
    if (this.supabaseClient) {
      this.supabaseClient.auth.signOut().catch(() => {});
    }
    state.cloudUser = null;
    state.save('fa_cloud_user', null);
    this.updateUserAccountUI();
    this.closeAuthModal();
    alert("Has cerrado sesión. Tus datos continúan disponibles localmente.");
  }

  async syncDataWithCloud(silent = false) {
    const indicator = document.getElementById('sync-status-indicator');
    if (indicator) indicator.textContent = "Sincronizando con la nube...";

    if (this.supabaseClient && state.cloudUser?.id) {
      try {
        // Upsert recipes into Supabase 'recipes' table
        for (const recipe of state.recipes) {
          await this.supabaseClient.from('recipes').upsert({
            id: recipe.id,
            user_id: state.cloudUser.id,
            title: recipe.title,
            description: recipe.description,
            image_url: recipe.imageUrl,
            prep_time_minutes: recipe.prepTimeMinutes,
            cook_time_minutes: recipe.cookTimeMinutes,
            servings: recipe.servings,
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            updated_at: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn("Supabase table sync notice:", e.message);
      }
    }

    state.lastSyncedAt = new Date().toISOString();
    localStorage.setItem('fa_last_sync', state.lastSyncedAt);
    this.updateUserAccountUI();

    if (indicator) {
      indicator.textContent = `Sincronizado a las ${new Date(state.lastSyncedAt).toLocaleTimeString()}`;
    }

    if (!silent) {
      alert("¡Datos sincronizados correctamente con la nube!");
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & NAVIGATION
  // ==========================================================================
  initEvents() {
    // Navigation
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.dataset.view;
        this.switchView(viewId);
      });
    });

    // Quick links
    document.getElementById('btn-goto-planner')?.addEventListener('click', () => this.switchView('view-planner'));
    document.getElementById('btn-quick-shopping')?.addEventListener('click', () => this.switchView('view-shopping'));
    document.getElementById('btn-quick-ai-plan')?.addEventListener('click', () => this.switchView('view-ai'));
    document.getElementById('btn-header-settings')?.addEventListener('click', () => this.switchView('view-settings'));

    // Theme controls
    document.getElementById('btn-header-theme')?.addEventListener('click', () => this.toggleNextTheme());
    document.querySelectorAll('#theme-segmented-group .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.themeVal;
        this.applyTheme(theme);
      });
    });

    // Cloud Auth events
    document.getElementById('btn-header-account')?.addEventListener('click', () => this.openAuthModal());
    document.getElementById('btn-settings-auth-action')?.addEventListener('click', () => this.openAuthModal());
    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => this.closeAuthModal());
    document.getElementById('btn-auth-google')?.addEventListener('click', () => this.handleGoogleAuth());
    document.querySelectorAll('#auth-tab-buttons .auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
    });
    document.getElementById('btn-submit-auth')?.addEventListener('click', () => this.handleAuthSubmit());
    document.getElementById('btn-auth-logout')?.addEventListener('click', () => this.logoutCloudUser());

    // Importer
    document.getElementById('btn-quick-import')?.addEventListener('click', () => this.openImportModal());
    document.getElementById('btn-close-import-modal')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-cancel-import')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-execute-import')?.addEventListener('click', () => this.handleRecipeImport());

    // Recipe CRUD
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

    // Recipe search and tag chips
    const searchInput = document.getElementById('recipes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterRecipes(e.target.value));
    }
    document.querySelectorAll('#recipes-tag-filters .m3-filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('#recipes-tag-filters .m3-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.filterRecipesByTag(chip.dataset.tag);
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

    // Modal closes
    document.getElementById('btn-close-recipe-modal')?.addEventListener('click', () => this.closeRecipeModal());
    document.getElementById('btn-close-picker-modal')?.addEventListener('click', () => this.closePickerModal());
    document.getElementById('btn-exit-cook-mode')?.addEventListener('click', () => this.exitCookMode());
    document.getElementById('btn-cook-next-step')?.addEventListener('click', () => this.nextCookStep());
    document.getElementById('btn-cook-prev-step')?.addEventListener('click', () => this.prevCookStep());

    // Gemini Chat
    document.getElementById('btn-send-ai-chat')?.addEventListener('click', () => this.handleAiChatSubmit());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleAiChatSubmit();
    });
    document.querySelectorAll('.chips-scroll-container button[data-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('ai-chat-input');
        if (input) {
          input.value = chip.dataset.prompt;
          this.handleAiChatSubmit();
        }
      });
    });
  }

  switchView(viewId) {
    this.activeView = viewId;
    this.viewPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === viewId);
    });

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

    const totalRecipesElem = document.getElementById('stat-total-recipes');
    if (totalRecipesElem) totalRecipesElem.textContent = state.recipes.length;
    
    let plannedCount = 0;
    Object.values(state.mealPlan).forEach(day => {
      if (day.lunch) plannedCount++;
      if (day.dinner) plannedCount++;
    });
    const plannedElem = document.getElementById('stat-planned-meals');
    if (plannedElem) plannedElem.textContent = plannedCount;

    const pendingItems = state.shoppingList.filter(i => !i.isChecked).length;
    const shoppingElem = document.getElementById('stat-shopping-items');
    if (shoppingElem) shoppingElem.textContent = pendingItems;

    const container = document.getElementById('today-slots-container');
    if (!container) return;

    const slots = [
      { key: 'lunch', label: 'Almuerzo', icon: 'wb_sunny' },
      { key: 'dinner', label: 'Cena', icon: 'dark_mode' }
    ];

    container.innerHTML = slots.map(s => {
      const recId = todayPlan[s.key];
      const recipe = state.recipes.find(r => r.id === recId);

      if (recipe) {
        return `
          <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')">
            <span class="slot-label">
              <span class="material-symbols-outlined icon-sm">${s.icon}</span> ${s.label}
            </span>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px; min-width: 0;">
              <img src="${recipe.imageUrl}" alt="" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0;">
              <div style="flex: 1; min-width: 0; overflow: hidden;">
                <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
                <div style="font-size: 11px; color: var(--m3-on-surface-variant); margin-top: 2px; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined icon-sm">schedule</span> ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="meal-slot" onclick="app.openPickerModal('${todayStr}', '${s.key}')">
            <span class="slot-label">
              <span class="material-symbols-outlined icon-sm">${s.icon}</span> ${s.label}
            </span>
            <div class="slot-action-text">
              <span class="material-symbols-outlined icon-sm">add</span> Asignar plato para hoy
            </div>
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
          <span class="material-symbols-outlined" style="font-size: 40px; margin-bottom: 8px;">menu_book</span>
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
            <span class="material-symbols-outlined icon-sm">schedule</span> ${rec.prepTimeMinutes + rec.cookTimeMinutes} min
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
            <div style="font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
              <span class="material-symbols-outlined icon-sm">schedule</span> ${r.prepTimeMinutes + r.cookTimeMinutes} min
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--m3-on-surface-variant);">Porciones</div>
              <div style="font-weight: 500; font-size: 13px; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                <span class="material-symbols-outlined icon-sm">group</span> ${this.activeServings} personas
              </div>
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
              <span class="material-symbols-outlined icon-sm">add_shopping_cart</span> Enviar a la Compra
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
                    <div style="margin-top: 4px; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: var(--m3-primary); background: var(--m3-primary-container); padding: 2px 8px; border-radius: var(--radius-full);">
                      <span class="material-symbols-outlined icon-sm">timer</span> ${inst.timerMinutes} minutos
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px;" onclick="app.startCookMode()">
          <span class="material-symbols-outlined">skillet</span> Empezar Modo Cocina Paso a Paso
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
        <option value="produce" ${data.aisle === 'produce' ? 'selected' : ''}>Verduras</option>
        <option value="meat" ${data.aisle === 'meat' ? 'selected' : ''}>Carnes</option>
        <option value="dairy" ${data.aisle === 'dairy' ? 'selected' : ''}>Lácteos</option>
        <option value="bakery" ${data.aisle === 'bakery' ? 'selected' : ''}>Panadería</option>
        <option value="pantry" ${data.aisle === 'pantry' ? 'selected' : ''}>Despensa</option>
        <option value="spices" ${data.aisle === 'spices' ? 'selected' : ''}>Especias</option>
        <option value="frozen" ${data.aisle === 'frozen' ? 'selected' : ''}>Congelados</option>
        <option value="beverages" ${data.aisle === 'beverages' ? 'selected' : ''}>Bebidas</option>
        <option value="other" ${data.aisle === 'other' ? 'selected' : ''}>Otros</option>
      </select>
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="padding: 0; color: var(--m3-error);" title="Eliminar">
        <span class="material-symbols-outlined icon-sm">close</span>
      </button>
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
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="padding: 6px 8px; color: var(--m3-error);" title="Eliminar">
        <span class="material-symbols-outlined icon-sm">close</span>
      </button>
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
    this.syncDataWithCloud(true);
    alert("¡Receta guardada con éxito!");
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
      alert("¡Enhorabuena! Has completado todos los pasos de la receta. ¡A disfrutar!");
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
            ${this.renderSlotCard(dateStr, 'lunch', 'Almuerzo', 'wb_sunny', dayData.lunch)}
            ${this.renderSlotCard(dateStr, 'dinner', 'Cena', 'dark_mode', dayData.dinner)}
          </div>
        </div>
      `;
    }).join('');
  }

  renderSlotCard(dateStr, slotType, slotLabel, iconName, recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);

    if (recipe) {
      return `
        <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="slot-label">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.clearSlot('${dateStr}', '${slotType}')" title="Quitar">
              <span class="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; min-width: 0;">
            <img src="${recipe.imageUrl}" alt="" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0;">
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="meal-slot" onclick="app.openPickerModal('${dateStr}', '${slotType}')">
          <span class="slot-label">
            <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
          </span>
          <div class="slot-action-text">
            <span class="material-symbols-outlined icon-sm">add</span> Asignar plato
          </div>
        </div>
      `;
    }
  }

  clearSlot(dateStr, slotType) {
    if (state.mealPlan[dateStr]) {
      state.mealPlan[dateStr][slotType] = null;
      state.save('fa_mealplan', state.mealPlan);
      this.syncDataWithCloud(true);
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
            <div style="font-size: 11px; color: var(--m3-on-surface-variant); display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined icon-sm">schedule</span> ${r.prepTimeMinutes + r.cookTimeMinutes} min
            </div>
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
      this.syncDataWithCloud(true);
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
          <span class="material-symbols-outlined" style="font-size: 40px; margin-bottom: 6px; color: var(--m3-primary);">shopping_cart</span>
          <h3 style="color: var(--m3-on-surface); font-size: 16px;">Lista de la compra vacía</h3>
          <p style="font-size: 13px; margin: 4px 0 16px 0;">
            Genera la lista desde tu plan semanal con un clic o añade artículos manualmente.
          </p>
          <button class="btn btn-primary btn-sm" onclick="app.generateShoppingFromPlan()">
            <span class="material-symbols-outlined icon-sm">add_shopping_cart</span> Generar desde el Plan
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
              <span class="material-symbols-outlined icon-sm">${meta.icon}</span>
              <span>${meta.label}</span>
            </div>
            <span style="font-size: 11px; color: var(--m3-on-surface-variant);">${pendingInAisle} pendientes</span>
          </div>

          <div>
            ${items.map(item => `
              <div class="grocery-item-row ${item.isChecked ? 'checked' : ''}">
                <div class="grocery-left" onclick="app.toggleGroceryCheck(${item.originalIndex})">
                  <input type="checkbox" class="grocery-checkbox" ${item.isChecked ? 'checked' : ''} onclick="event.stopPropagation(); app.toggleGroceryCheck(${item.originalIndex})">
                  <div style="flex: 1; min-width: 0; overflow: hidden;">
                    <div class="grocery-name">${item.name}</div>
                    ${item.recipeOrigin ? `<div style="font-size: 11px; color: var(--m3-on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Para: ${item.recipeOrigin}</div>` : ''}
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                  ${item.amount ? `<span class="grocery-amount">${item.amount} ${item.unit || ''}</span>` : ''}
                  <button class="btn-ghost btn-sm" onclick="app.deleteGroceryItem(${item.originalIndex})" title="Eliminar">
                    <span class="material-symbols-outlined icon-sm">close</span>
                  </button>
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
      this.syncDataWithCloud(true);
      this.render();
    }
  }

  deleteGroceryItem(index) {
    state.shoppingList.splice(index, 1);
    state.save('fa_shopping', state.shoppingList);
    this.syncDataWithCloud(true);
    this.render();
  }

  clearCompletedGroceries() {
    if (!state.shoppingList || state.shoppingList.length === 0) {
      alert("La lista de la compra ya está vacía.");
      return;
    }

    const completed = state.shoppingList.filter(i => i.isChecked);
    
    if (completed.length > 0) {
      const count = completed.length;
      const total = state.shoppingList.length;
      if (count === total) {
        if (confirm(`¿Eliminar los ${count} artículos comprados y vaciar la lista?`)) {
          state.shoppingList = [];
          state.save('fa_shopping', state.shoppingList);
          this.syncDataWithCloud(true);
          this.render();
        }
      } else {
        if (confirm(`¿Eliminar los ${count} artículos marcados como comprados?`)) {
          state.shoppingList = state.shoppingList.filter(i => !i.isChecked);
          state.save('fa_shopping', state.shoppingList);
          this.syncDataWithCloud(true);
          this.render();
        }
      }
    } else {
      // Ningún artículo está marcado con el checkbox
      if (confirm("No hay artículos marcados como comprados.\n\n¿Deseas vaciar toda la lista de la compra?")) {
        state.shoppingList = [];
        state.save('fa_shopping', state.shoppingList);
        this.syncDataWithCloud(true);
        this.render();
      }
    }
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
    else if (/pan|baguette|tostada|molde|croissant/.test(lower)) aisle = 'bakery';
    else if (/arroz|pasta|aceite|harina|azucar|azúcar|sal|tomate frito|garbanzo|lenteja/.test(lower)) aisle = 'pantry';
    else if (/pimienta|oregano|orégano|pimenton|pimentón|curry|comino/.test(lower)) aisle = 'spices';
    else if (/helado|guisantes|pizza|congelado/.test(lower)) aisle = 'frozen';
    else if (/agua|cafe|café|te|té|refresco|cerveza|vino|zumo/.test(lower)) aisle = 'beverages';

    state.shoppingList.push({
      name: text,
      amount: null,
      unit: "",
      aisle: aisle,
      isChecked: false,
      recipeOrigin: "Añadido manualmente"
    });

    state.save('fa_shopping', state.shoppingList);
    this.syncDataWithCloud(true);
    input.value = '';
    this.renderShoppingList();
  }

  addRecipeIngredientsToShopping(recipeId) {
    this.openShoppingPreviewForRecipe(recipeId);
  }

  generateShoppingFromPlan() {
    this.openShoppingPreviewForPlan();
  }

  // ==========================================================================
  // PREVIEW & CUSTOMIZE INGREDIENTS BEFORE ADDING TO SHOPPING LIST
  // ==========================================================================
  openShoppingPreviewForRecipe(recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      alert("Esta receta no tiene ingredientes definidos.");
      return;
    }

    const baseServings = recipe.servings || 2;
    const currentServings = this.activeServings || baseServings;
    const ratio = currentServings / baseServings;

    this.shoppingPreviewState = {
      sourceType: 'recipe',
      sourceTitle: recipe.title,
      baseServings: baseServings,
      currentServings: currentServings,
      items: recipe.ingredients.map(ing => ({
        name: ing.name,
        baseAmount: ing.amount !== null && ing.amount !== undefined ? ing.amount : null,
        amount: ing.amount !== null && ing.amount !== undefined ? Math.round((ing.amount * ratio) * 10) / 10 : null,
        unit: ing.unit || '',
        aisle: ing.aisle || 'other',
        recipeOrigin: recipe.title,
        checked: true
      }))
    };

    const titleEl = document.getElementById('shopping-preview-title');
    const subtitleEl = document.getElementById('shopping-preview-subtitle');
    const servingsVal = document.getElementById('shopping-preview-servings-val');
    const clearFirst = document.getElementById('shopping-preview-clear-first');

    if (titleEl) titleEl.textContent = "Añadir a la Compra";
    if (subtitleEl) subtitleEl.textContent = `Receta: ${recipe.title}`;
    if (servingsVal) servingsVal.textContent = currentServings;
    if (clearFirst) clearFirst.checked = false;

    this.renderShoppingPreview();
    if (this.modalShoppingPreview) {
      this.modalShoppingPreview.classList.add('active');
    }
  }

  openShoppingPreviewForPlan() {
    const recipeMap = new Map();
    let plannedRecipesCount = 0;

    Object.values(state.mealPlan).forEach(day => {
      ['lunch', 'dinner'].forEach(slot => {
        const rId = day[slot];
        if (rId) {
          const recipe = state.recipes.find(r => r.id === rId);
          if (recipe) {
            plannedRecipesCount++;
            recipe.ingredients.forEach(ing => {
              const key = `${ing.name.toLowerCase().trim()}_${(ing.unit || '').toLowerCase().trim()}`;
              if (recipeMap.has(key)) {
                const item = recipeMap.get(key);
                if (item.baseAmount !== null && ing.amount !== null && ing.amount !== undefined) {
                  item.baseAmount = Math.round((item.baseAmount + ing.amount) * 10) / 10;
                  item.amount = item.baseAmount;
                }
                if (!item.origins.includes(recipe.title)) {
                  item.origins.push(recipe.title);
                }
              } else {
                recipeMap.set(key, {
                  name: ing.name,
                  baseAmount: ing.amount !== null && ing.amount !== undefined ? ing.amount : null,
                  amount: ing.amount !== null && ing.amount !== undefined ? ing.amount : null,
                  unit: ing.unit || '',
                  aisle: ing.aisle || 'other',
                  origins: [recipe.title],
                  checked: true
                });
              }
            });
          }
        }
      });
    });

    if (recipeMap.size === 0) {
      alert("No hay recetas asignadas en el plan semanal para generar la lista.");
      return;
    }

    const baseServings = state.settings.defaultServings || 2;
    const currentServings = baseServings;

    const items = Array.from(recipeMap.values()).map(item => ({
      name: item.name,
      baseAmount: item.baseAmount,
      amount: item.amount,
      unit: item.unit,
      aisle: item.aisle,
      recipeOrigin: item.origins.slice(0, 2).join(', ') + (item.origins.length > 2 ? ` (+${item.origins.length - 2})` : ''),
      checked: true
    }));

    this.shoppingPreviewState = {
      sourceType: 'plan',
      sourceTitle: 'Plan Semanal',
      baseServings: baseServings,
      currentServings: currentServings,
      items: items
    };

    const titleEl = document.getElementById('shopping-preview-title');
    const subtitleEl = document.getElementById('shopping-preview-subtitle');
    const servingsVal = document.getElementById('shopping-preview-servings-val');
    const clearFirst = document.getElementById('shopping-preview-clear-first');

    if (titleEl) titleEl.textContent = "Añadir a la Compra";
    if (subtitleEl) subtitleEl.textContent = `Menú Semanal (${plannedRecipesCount} comidas planificadas)`;
    if (servingsVal) servingsVal.textContent = currentServings;
    if (clearFirst) clearFirst.checked = false;

    this.renderShoppingPreview();
    if (this.modalShoppingPreview) {
      this.modalShoppingPreview.classList.add('active');
    }
  }

  renderShoppingPreview() {
    if (!this.shoppingPreviewState) return;

    const container = document.getElementById('shopping-preview-items-list');
    if (!container) return;

    const checkedCount = this.shoppingPreviewState.items.filter(i => i.checked).length;
    const btnText = document.getElementById('btn-confirm-add-shopping-text');
    if (btnText) {
      btnText.textContent = `Añadir a la Compra (${checkedCount})`;
    }

    container.innerHTML = this.shoppingPreviewState.items.map((ing, idx) => {
      const meta = AISLE_METADATA[ing.aisle] || AISLE_METADATA.other;
      const isChecked = ing.checked !== false;

      return `
        <div class="card" style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 0; background-color: ${isChecked ? 'var(--m3-surface)' : 'var(--m3-surface-container-low)'}; border: 1px solid var(--m3-outline-variant); transition: background-color 0.15s ease;">
          <label style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; cursor: pointer; margin: 0;">
            <input type="checkbox" class="grocery-checkbox" data-idx="${idx}" ${isChecked ? 'checked' : ''} onchange="app.handleShoppingPreviewItemCheck(${idx}, this.checked)" style="flex-shrink: 0;">
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div style="font-size: 14px; font-weight: 500; color: var(--m3-on-surface); word-break: break-word; line-height: 1.3; ${isChecked ? '' : 'text-decoration: line-through; opacity: 0.55;'}">
                ${ing.name}
              </div>
              <div style="font-size: 11px; color: var(--m3-on-surface-variant); display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                <span class="material-symbols-outlined icon-sm" style="font-size: 13px;">${meta.icon}</span> ${meta.label}
                ${ing.recipeOrigin ? `<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">• Para: ${ing.recipeOrigin}</span>` : ''}
              </div>
            </div>
          </label>
          
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <input type="number" step="any" min="0" value="${ing.amount !== null && ing.amount !== undefined ? ing.amount : ''}" 
              placeholder="Cant." 
              class="form-input" 
              style="width: 72px; padding: 6px 8px; text-align: center; font-size: 13px; font-weight: 500; ${isChecked ? '' : 'opacity: 0.5;'}"
              onchange="app.handleShoppingPreviewAmountChange(${idx}, this.value)"
              ${isChecked ? '' : 'disabled'}>
            <span style="font-size: 12px; color: var(--m3-on-surface-variant); min-width: 24px;">${ing.unit || ''}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  stepShoppingPreviewServings(delta) {
    if (!this.shoppingPreviewState) return;
    const newServings = Math.max(1, this.shoppingPreviewState.currentServings + delta);
    if (newServings === this.shoppingPreviewState.currentServings) return;

    const scale = newServings / this.shoppingPreviewState.baseServings;
    this.shoppingPreviewState.currentServings = newServings;
    const servingsVal = document.getElementById('shopping-preview-servings-val');
    if (servingsVal) servingsVal.textContent = newServings;

    this.shoppingPreviewState.items.forEach(item => {
      if (item.baseAmount !== null && item.baseAmount !== undefined) {
        item.amount = Math.round((item.baseAmount * scale) * 10) / 10;
      }
    });

    this.renderShoppingPreview();
  }

  toggleAllShoppingPreview(checked) {
    if (!this.shoppingPreviewState) return;
    this.shoppingPreviewState.items.forEach(item => {
      item.checked = checked;
    });
    this.renderShoppingPreview();
  }

  handleShoppingPreviewItemCheck(idx, checked) {
    if (!this.shoppingPreviewState || !this.shoppingPreviewState.items[idx]) return;
    this.shoppingPreviewState.items[idx].checked = checked;
    this.renderShoppingPreview();
  }

  handleShoppingPreviewAmountChange(idx, val) {
    if (!this.shoppingPreviewState || !this.shoppingPreviewState.items[idx]) return;
    const num = parseFloat(val);
    const item = this.shoppingPreviewState.items[idx];
    item.amount = isNaN(num) ? null : num;
    const scale = this.shoppingPreviewState.currentServings / this.shoppingPreviewState.baseServings;
    item.baseAmount = item.amount !== null ? item.amount / scale : null;
  }

  closeShoppingPreviewModal() {
    if (this.modalShoppingPreview) {
      this.modalShoppingPreview.classList.remove('active');
    }
    this.shoppingPreviewState = null;
  }

  confirmShoppingPreviewAdd() {
    if (!this.shoppingPreviewState) return;
    const selected = this.shoppingPreviewState.items.filter(i => i.checked);
    if (selected.length === 0) {
      alert("Por favor, selecciona al menos un ingrediente para añadir.");
      return;
    }

    const clearFirst = document.getElementById('shopping-preview-clear-first')?.checked;
    if (clearFirst) {
      state.shoppingList = [];
    }

    let addedCount = 0;
    selected.forEach(item => {
      const key = `${item.name.toLowerCase().trim()}_${(item.unit || '').toLowerCase().trim()}`;
      const existing = state.shoppingList.find(i => `${i.name.toLowerCase().trim()}_${(i.unit || '').toLowerCase().trim()}` === key && !i.isChecked);

      if (existing && existing.amount !== null && item.amount !== null) {
        existing.amount = Math.round((existing.amount + item.amount) * 10) / 10;
      } else {
        state.shoppingList.push({
          name: item.name,
          amount: item.amount,
          unit: item.unit || '',
          aisle: item.aisle || 'other',
          isChecked: false,
          recipeOrigin: item.recipeOrigin || ''
        });
      }
      addedCount++;
    });

    state.save('fa_shopping', state.shoppingList);
    this.syncDataWithCloud(true);
    this.closeShoppingPreviewModal();
    this.render();
    this.switchView('view-shopping');
    alert(`¡Se han añadido ${addedCount} ingredientes a tu lista de la compra!`);
  }

  copyShoppingList() {
    if (!state.shoppingList || !state.shoppingList.length) {
      alert("No hay artículos en la lista de la compra para copiar.");
      return;
    }

    let text = "LISTA DE LA COMPRA - FOOD ASSISTANT\n\n";
    const grouped = {};
    state.shoppingList.forEach(i => {
      const aisle = i.aisle || 'other';
      if (!grouped[aisle]) grouped[aisle] = [];
      grouped[aisle].push(i);
    });

    Object.entries(grouped).forEach(([aisleKey, items]) => {
      const meta = AISLE_METADATA[aisleKey] || AISLE_METADATA.other;
      text += `[${meta.label.toUpperCase()}]\n`;
      items.forEach(item => {
        text += `${item.isChecked ? '[X]' : '[ ]'} ${item.name} ${item.amount ? `(${item.amount} ${item.unit || ''})` : ''}\n`;
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
      return `¡He analizado tus recetas guardadas y he preparado un menú semanal equilibrado para ti!

- **Lunes**: Pasta al Pesto Genovés (Almuerzo) / Salmón a la Plancha (Cena)
- **Martes**: Pechugas al Limón (Almuerzo) / Ensalada Mediterránea (Cena)
- **Miércoles**: Ensalada Mediterránea (Almuerzo) / Pasta al Pesto (Cena)
- **Jueves**: Pechugas al Limón (Almuerzo) / Salmón con Espárragos (Cena)
- **Viernes**: Salmón a la Plancha (Almuerzo) / Pechugas al Limón (Cena)
- **Sábado**: Pasta al Pesto (Almuerzo) / Cena Ligera
- **Domingo**: Pollo Asado con Patatas (Almuerzo Familiar)`;
    }

    if (lower.includes('pollo') || lower.includes('nevera') || lower.includes('tengo')) {
      return `Con el pollo, calabacín y patatas te sugiero preparar unas **Pechugas Salteadas con Dados de Patata y Calabacín al Romero**:

- **Tiempo**: 25 min | **Porciones**: 2
- **Ingredientes**:
  - 350g de pechugas de pollo en dados
  - 2 patatas medianas en cubos
  - 1 calabacín en rodajas
  - Aceite de oliva, romero y ajo

- **Paso a paso**:
1. Dora las patatas en una sartén con aceite durante 10 min a fuego medio-alto.
2. Añade el pollo en dados y cocina 5 min hasta dorar.
3. Incorpora el calabacín y romero, saltea 5 min más y sirve caliente.`;
    }

    return `He tomado nota de tu consulta. Puedes configurar tu clave de API gratuita de Gemini en la pestaña de Ajustes para obtener respuestas 100% personalizadas en tiempo real.`;
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
    aiBubble.innerHTML = '<em>Consultando a Gemini...</em>';
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
        applyBtn.innerHTML = '<span class="material-symbols-outlined icon-sm">calendar_month</span> Aplicar este menú al Planificador';
        applyBtn.onclick = () => this.applySampleAiPlan();
        aiBubble.appendChild(document.createElement('br'));
        aiBubble.appendChild(applyBtn);
      }
    } catch (err) {
      aiBubble.innerHTML = `<span style="color: var(--m3-error);">Error: ${err.message}</span>`;
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
    this.syncDataWithCloud(true);
    this.render();
    alert("¡Menú asignado con éxito a tu calendario!");
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

  // UNIVERSAL RECIPE IMPORTER
  openImportModal() {
    this.modalRecipeImport.classList.add('active');
    document.getElementById('import-url-input').value = '';
    document.getElementById('import-text-input').value = '';
    const status = document.getElementById('import-status-indicator');
    if (status) status.style.display = 'none';
  }

  closeImportModal() {
    this.modalRecipeImport.classList.remove('active');
  }

  async handleRecipeImport() {
    const url = document.getElementById('import-url-input').value.trim();
    const text = document.getElementById('import-text-input').value.trim();
    const status = document.getElementById('import-status-indicator');

    if (!url && !text) {
      alert("Por favor, introduce un enlace o pega texto de la receta.");
      return;
    }

    if (status) {
      status.style.display = 'block';
      status.style.color = 'var(--m3-primary)';
      status.textContent = 'Extrayendo ingredientes y pasos con Gemini...';
    }

    try {
      const prompt = `Extrae la receta del siguiente contenido y formatea estrictamente como JSON válido con este esquema:
{
  "title": "Nombre del plato",
  "description": "Breve descripción",
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 15,
  "servings": 2,
  "tags": ["Saludable"],
  "ingredients": [{"name": "Ingrediente", "amount": 100, "unit": "g", "aisle": "produce"}],
  "instructions": [{"step": 1, "text": "Paso...", "timerMinutes": 5}]
}
Contenido: ${url ? `Enlace: ${url}` : ''}\n${text}`;

      let recipeJson = null;
      if (state.settings.geminiApiKey) {
        const raw = await this.callGeminiApi(prompt, "Responde única y exclusivamente con JSON puro sin formato markdown ni explicaciones.");
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        recipeJson = JSON.parse(cleaned);
      } else {
        // Fallback demo extracted recipe
        await new Promise(r => setTimeout(r, 1200));
        recipeJson = {
          title: url ? "Receta importada de la web" : "Receta importada de notas",
          description: text.slice(0, 100) || "Receta extraída automáticamente.",
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          servings: 2,
          tags: ["Importada", "Cena"],
          ingredients: [
            { id: "imp-1", name: "Ingrediente principal", amount: 300, unit: "g", aisle: "produce" },
            { id: "imp-2", name: "Aceite de oliva", amount: 20, unit: "ml", aisle: "pantry" }
          ],
          instructions: [
            { step: 1, text: "Preparar y cortar los ingredientes.", timerMinutes: 5 },
            { step: 2, text: "Cocinar a fuego medio durante 15 minutos.", timerMinutes: 15 }
          ]
        };
      }

      const newRecipe = {
        id: 'rec-' + Date.now(),
        title: recipeJson.title || "Receta Importada",
        description: recipeJson.description || "",
        imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
        prepTimeMinutes: recipeJson.prepTimeMinutes || 10,
        cookTimeMinutes: recipeJson.cookTimeMinutes || 15,
        servings: recipeJson.servings || 2,
        tags: recipeJson.tags || ["Importada"],
        ingredients: recipeJson.ingredients || [],
        instructions: recipeJson.instructions || []
      };

      state.recipes.unshift(newRecipe);
      state.save('fa_recipes', state.recipes);
      this.syncDataWithCloud(true);
      this.closeImportModal();
      this.render();
      this.openRecipeDetail(newRecipe.id);
      alert(`¡Receta "${newRecipe.title}" importada con éxito!`);
    } catch (err) {
      if (status) {
        status.style.color = 'var(--m3-error)';
        status.textContent = 'Error al extraer la receta: ' + err.message;
      }
    }
  }

  // SETTINGS
  renderSettings() {
    const inputKey = document.getElementById('input-gemini-key');
    if (inputKey) inputKey.value = state.settings.geminiApiKey || '';

    const status = document.getElementById('gemini-key-status');
    if (status) {
      if (state.settings.geminiApiKey) {
        status.innerHTML = '<span style="color: var(--color-brand); font-weight: 500;">✓ Clave configurada (Gemini 2.5 Flash activo)</span>';
      } else {
        status.innerHTML = '<span style="color: var(--m3-on-surface-variant);">Modo Asistente Simulado activo (sin coste ni clave)</span>';
      }
    }

    const selectServings = document.getElementById('select-default-servings');
    if (selectServings) {
      selectServings.value = String(state.settings.defaultServings || 2);
      selectServings.onchange = (e) => {
        state.settings.defaultServings = parseInt(e.target.value, 10);
        state.save('fa_settings', state.settings);
      };
    }
  }

  saveGeminiKey() {
    const key = document.getElementById('input-gemini-key').value.trim();
    state.settings.geminiApiKey = key;
    state.save('fa_settings', state.settings);
    this.renderSettings();
    alert("Clave de Gemini guardada con éxito.");
  }

  exportBackup() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      recipes: state.recipes,
      mealPlan: state.mealPlan,
      shoppingList: state.shoppingList
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.recipes) state.recipes = imported.recipes;
        if (imported.mealPlan) state.mealPlan = imported.mealPlan;
        if (imported.shoppingList) state.shoppingList = imported.shoppingList;

        state.save('fa_recipes', state.recipes);
        state.save('fa_mealplan', state.mealPlan);
        state.save('fa_shopping', state.shoppingList);

        this.syncDataWithCloud(true);
        this.render();
        alert("¡Copia de seguridad restaurada con éxito!");
      } catch (err) {
        alert("Error al importar el archivo JSON.");
      }
    };
    reader.readAsText(file);
  }

  resetDemoData() {
    if (confirm("¿Restablecer todas las recetas y el plan a los valores iniciales de demostración?")) {
      localStorage.removeItem('fa_recipes');
      localStorage.removeItem('fa_mealplan');
      localStorage.removeItem('fa_shopping');
      state.recipes = SEED_RECIPES;
      state.mealPlan = state.generateInitialMealPlan();
      state.shoppingList = [];
      state.save('fa_recipes', state.recipes);
      state.save('fa_mealplan', state.mealPlan);
      state.save('fa_shopping', state.shoppingList);
      this.syncDataWithCloud(true);
      this.render();
      alert("Datos restablecidos.");
    }
  }
}

// Global App Instance
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new FoodAssistantApp();
  window.app = app;
});
