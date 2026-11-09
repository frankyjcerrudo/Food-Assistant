/**
 * Sabory (Food Assistant) - i18n Internationalization Engine (US-12)
 * Lightweight, zero-dependency multilingual engine with auto-detection (Google Play standard)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.I18n = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'fa_language';
  const SUPPORTED_LANGUAGES = ['es', 'en'];
  const DEFAULT_LANGUAGE = 'es';

  const MESSAGES = {
    es: {
      common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        accept: 'Aceptar',
        confirm: 'Confirmar',
        back: 'Volver',
        add: 'Añadir',
        search: 'Buscar',
        loading: 'Cargando...',
        clear: 'Limpiar',
        options: 'Opciones',
        servings: 'raciones',
        minutes: 'min',
        copied: 'Copiado al portapapeles'
      },
      nav: {
        today: 'Hoy',
        planner: 'Plan',
        recipes: 'Recetas',
        shopping: 'Compra',
        ai: 'Asistente',
        settings: 'Ajustes',
        household: 'Mi Hogar'
      },
      header: {
        installApp: 'Instalar App',
        familyModeActive: 'Modo Familia activo — Pulsa para gestionar tu Hogar',
        searchAria: 'Búsqueda rápida'
      },
      settings: {
        title: 'Ajustes',
        subtitle: 'Mis preferencias culinarias y configuración.',
        onboardingBtn: 'Guía inicial',
        accountTitle: 'Cuenta de Usuario',
        accountDesc: 'Inicia sesión para tener tus recetas, planes semanales y listas de la compra sincronizados automáticamente en cualquier dispositivo.',
        localMode: 'Modo Local (Invitado)',
        localModeDesc: 'Datos guardados en este dispositivo',
        syncNow: 'Sincronizar',
        signIn: 'Iniciar Sesión',
        signOut: 'Cerrar Sesión',
        householdTitle: 'Modo Familia / Espacio del Hogar',
        householdDesc: 'Planifica comidas y comparte la lista de la compra en tiempo real con tu pareja o familia.',
        createHousehold: 'Crear un Hogar nuevo',
        joinHousehold: 'Unirse con código de invitación',
        appearanceTitle: 'Aspecto',
        appearanceDesc: 'Elige cómo se ve Sabory o sigue el tema de tu dispositivo.',
        themeSystem: 'Sistema',
        themeLight: 'Claro',
        themeDark: 'Oscuro',
        languageTitle: 'Idioma',
        languageDesc: 'Elige el idioma de la aplicación o sigue el idioma de tu dispositivo.',
        langAuto: 'Automático',
        langEs: 'Español',
        langEn: 'English',
        languageUpdated: 'Idioma actualizado correctamente',
        dietaryTitle: 'Preferencias Dietéticas',
        dietaryDesc: 'Filtra y avisa si una receta no encaja con tu estilo de vida.',
        nutritionTitle: 'Objetivos Nutricionales Diarios',
        nutritionDesc: 'Metas calóricas y reparto de macronutrientes para balancear tus planes.',
        servingsTitle: 'Raciones por Defecto',
        servingsDesc: 'Porciones predeterminadas al planificar o calcular la lista de la compra.',
        advancedTitle: 'Configuración avanzada y sistema',
        backupTitle: 'Copia de Seguridad Local',
        backupDesc: 'Exporta o restaura tus recetas y planes en un archivo JSON local.',
        exportBtn: 'Exportar',
        importBtn: 'Importar',
        resetBtn: 'Restablecer',
        privacyTitle: 'Privacidad y Control de Datos',
        privacyDesc: 'Sabory funciona offline de forma predeterminada y solo sincroniza tus datos si decides iniciar sesión.',
        privacyBtn: 'Política de Privacidad',
        deleteAccountBtn: 'Eliminar cuenta y datos',
        installedVersion: 'Versión instalada:'
      },
      today: {
        title: 'Comidas de Hoy',
        subtitle: 'Tus platos planificados para el día',
        noMeals: 'No tienes comidas planificadas para hoy.',
        addMealBtn: 'Añadir otra comida',
        breakfast: 'Desayuno',
        lunch: 'Almuerzo',
        snack: 'Merienda',
        dinner: 'Cena',
        cookBtn: 'Cocinar',
        openRecipe: 'Ver receta'
      },
      planner: {
        title: 'Planificador Semanal',
        autoPlanBtn: 'Autoplanificar',
        clearWeekBtn: 'Limpiar semana',
        addSlot: 'Añadir plato',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      },
      recipes: {
        title: 'Mis Recetas',
        searchPlaceholder: 'Buscar por nombre, ingrediente o etiqueta...',
        newRecipeBtn: 'Nueva Receta',
        importBtn: 'Importar',
        noRecipesFound: 'No se encontraron recetas con ese criterio.',
        all: 'Todas',
        favorites: 'Favoritas',
        prepTime: 'Prep:',
        cookTime: 'Cocción:',
        calories: 'kcal'
      },
      shopping: {
        title: 'Lista de la Compra',
        inputPlaceholder: 'Añadir producto a la compra...',
        addBtn: 'Añadir',
        clearCompletedBtn: 'Limpiar comprados',
        emptyList: 'Tu lista de la compra está vacía.',
        completedSectionTitle: 'Comprados'
      },
      aisles: {
        produce: 'Frutas y Verduras',
        dairy: 'Lácteos y Huevos',
        meat: 'Carnes y Pescados',
        bakery: 'Panadería y Pastelería',
        pantry: 'Despensa y Básicos',
        frozen: 'Congelados',
        beverages: 'Bebidas',
        spices: 'Especias y Aceites',
        personal_care: 'Cuidado Personal',
        household: 'Limpieza y Hogar',
        other: 'Otros'
      },
      cooking: {
        title: 'Modo Cocina',
        step: 'Paso',
        of: 'de',
        prevStep: 'Anterior',
        nextStep: 'Siguiente',
        finish: '¡Receta Completada!',
        exit: 'Salir',
        screenAwake: 'Pantalla activa',
        startTimer: 'Iniciar temporizador',
        pauseTimer: 'Pausar',
        resumeTimer: 'Reanudar',
        resetTimer: 'Reiniciar',
        timerFinished: '¡Tiempo cumplido!'
      },
      onboarding: {
        welcomeTitle: '¡Te damos la bienvenida a Sabory! 🍳',
        welcomeDesc: 'Tu asistente culinario inteligente y planificador familiar.',
        nextBtn: 'Continuar',
        backBtn: 'Atrás',
        skipBtn: 'Omitir',
        finishBtn: 'Comenzar a usar Sabory',
        step1Title: 'Bienvenida',
        step2Title: 'Tus Dietas y Alergias',
        step3Title: 'Objetivos Nutricionales',
        step4Title: 'Comensales en Casa',
        step5Title: '¡Todo Listo!'
      }
    },
    en: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        accept: 'Accept',
        confirm: 'Confirm',
        back: 'Back',
        add: 'Add',
        search: 'Search',
        loading: 'Loading...',
        clear: 'Clear',
        options: 'Options',
        servings: 'servings',
        minutes: 'min',
        copied: 'Copied to clipboard'
      },
      nav: {
        today: 'Today',
        planner: 'Plan',
        recipes: 'Recipes',
        shopping: 'Shopping',
        ai: 'Assistant',
        settings: 'Settings',
        household: 'My Home'
      },
      header: {
        installApp: 'Install App',
        familyModeActive: 'Family Mode active — Tap to manage your Household',
        searchAria: 'Quick search'
      },
      settings: {
        title: 'Settings',
        subtitle: 'My culinary preferences and configuration.',
        onboardingBtn: 'Getting Started',
        accountTitle: 'User Account',
        accountDesc: 'Sign in to automatically sync your recipes, weekly plans and shopping lists across any device.',
        localMode: 'Local Mode (Guest)',
        localModeDesc: 'Data saved on this device',
        syncNow: 'Sync Now',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        householdTitle: 'Family Mode / Household Space',
        householdDesc: 'Plan meals and share shopping lists in real time with your family or partner.',
        createHousehold: 'Create a new Household',
        joinHousehold: 'Join with invite code',
        appearanceTitle: 'Appearance',
        appearanceDesc: 'Choose how Sabory looks or follow your device theme.',
        themeSystem: 'System',
        themeLight: 'Light',
        themeDark: 'Dark',
        languageTitle: 'Language',
        languageDesc: 'Choose the application language or follow your device language.',
        langAuto: 'Auto',
        langEs: 'Español',
        langEn: 'English',
        languageUpdated: 'Language updated successfully',
        dietaryTitle: 'Dietary Preferences',
        dietaryDesc: 'Filter and alert if a recipe does not match your dietary needs.',
        nutritionTitle: 'Daily Nutritional Goals',
        nutritionDesc: 'Calorie targets and macronutrient split to balance your plans.',
        servingsTitle: 'Default Servings',
        servingsDesc: 'Default portions when planning meals or generating shopping lists.',
        advancedTitle: 'Advanced Settings & System',
        backupTitle: 'Local Backup',
        backupDesc: 'Export or restore your recipes and meal plans using a local JSON file.',
        exportBtn: 'Export',
        importBtn: 'Import',
        resetBtn: 'Reset',
        privacyTitle: 'Privacy & Data Control',
        privacyDesc: 'Sabory works offline by default and only syncs your data if you choose to sign in.',
        privacyBtn: 'Privacy Policy',
        deleteAccountBtn: 'Delete account & data',
        installedVersion: 'Installed version:'
      },
      today: {
        title: "Today's Meals",
        subtitle: 'Your planned dishes for the day',
        noMeals: 'No meals planned for today.',
        addMealBtn: 'Add another meal',
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snack: 'Snack',
        dinner: 'Dinner',
        cookBtn: 'Cook',
        openRecipe: 'View recipe'
      },
      planner: {
        title: 'Weekly Planner',
        autoPlanBtn: 'Auto-plan',
        clearWeekBtn: 'Clear week',
        addSlot: 'Add dish',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      recipes: {
        title: 'My Recipes',
        searchPlaceholder: 'Search by name, ingredient or tag...',
        newRecipeBtn: 'New Recipe',
        importBtn: 'Import',
        noRecipesFound: 'No recipes found matching your criteria.',
        all: 'All',
        favorites: 'Favorites',
        prepTime: 'Prep:',
        cookTime: 'Cook:',
        calories: 'kcal'
      },
      shopping: {
        title: 'Shopping List',
        inputPlaceholder: 'Add item to shopping list...',
        addBtn: 'Add',
        clearCompletedBtn: 'Clear completed',
        emptyList: 'Your shopping list is empty.',
        completedSectionTitle: 'Completed'
      },
      aisles: {
        produce: 'Produce & Veggies',
        dairy: 'Dairy & Eggs',
        meat: 'Meat & Seafood',
        bakery: 'Bakery & Bread',
        pantry: 'Pantry & Basics',
        frozen: 'Frozen Foods',
        beverages: 'Beverages & Drinks',
        spices: 'Spices & Oils',
        personal_care: 'Personal Care',
        household: 'Cleaning & Household',
        other: 'Other'
      },
      cooking: {
        title: 'Cooking Mode',
        step: 'Step',
        of: 'of',
        prevStep: 'Previous',
        nextStep: 'Next',
        finish: 'Recipe Completed!',
        exit: 'Exit',
        screenAwake: 'Screen awake',
        startTimer: 'Start timer',
        pauseTimer: 'Pause',
        resumeTimer: 'Resume',
        resetTimer: 'Reset',
        timerFinished: 'Time is up!'
      },
      onboarding: {
        welcomeTitle: 'Welcome to Sabory! 🍳',
        welcomeDesc: 'Your smart culinary assistant & family meal planner.',
        nextBtn: 'Continue',
        backBtn: 'Back',
        skipBtn: 'Skip',
        finishBtn: 'Start using Sabory',
        step1Title: 'Welcome',
        step2Title: 'Dietary Preferences',
        step3Title: 'Nutritional Goals',
        step4Title: 'Household Members',
        step5Title: 'All Set!'
      }
    }
  };

  /**
   * Detect system language based on browser/OS
   * @returns {'es' | 'en'}
   */
  function detectSystemLanguage() {
    if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower.startsWith('es')) return 'es';
      if (lower.startsWith('en')) return 'en';
    }
    // International fallback for unsupported languages (German, French, Italian, etc.)
    return 'en';
  }

  class I18nManager {
    constructor() {
      this.preference = 'auto'; // 'auto' | 'es' | 'en'
      this.resolvedLang = DEFAULT_LANGUAGE; // 'es' | 'en'
      this.listeners = new Set();
      this.init();
    }

    init() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored && (stored === 'auto' || SUPPORTED_LANGUAGES.includes(stored))) {
            this.preference = stored;
          }
        }
      } catch (err) {
        console.warn('[I18n] Could not read storage:', err);
      }
      this.computeResolvedLanguage();
    }

    computeResolvedLanguage() {
      if (this.preference === 'auto') {
        this.resolvedLang = detectSystemLanguage();
      } else if (SUPPORTED_LANGUAGES.includes(this.preference)) {
        this.resolvedLang = this.preference;
      } else {
        this.resolvedLang = DEFAULT_LANGUAGE;
      }
      this.updateHtmlLangAttribute();
    }

    updateHtmlLangAttribute() {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', this.resolvedLang);
      }
    }

    /**
     * @returns {'auto' | 'es' | 'en'}
     */
    getPreference() {
      return this.preference;
    }

    /**
     * @returns {'es' | 'en'}
     */
    getLanguage() {
      return this.resolvedLang;
    }

    /**
     * Set language preference and update DOM
     * @param {'auto' | 'es' | 'en'} mode
     */
    setPreference(mode) {
      if (mode !== 'auto' && !SUPPORTED_LANGUAGES.includes(mode)) {
        console.warn(`[I18n] Unsupported mode: ${mode}`);
        return;
      }
      this.preference = mode;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, mode);
        }
      } catch (err) {
        console.warn('[I18n] Could not write storage:', err);
      }

      this.computeResolvedLanguage();
      this.applyTranslations();
      this.notifyListeners();
    }

    onChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.add(callback);
      }
      return () => this.listeners.delete(callback);
    }

    notifyListeners() {
      this.listeners.forEach(cb => {
        try {
          cb(this.resolvedLang, this.preference);
        } catch (e) {
          console.error('[I18n] Error in change listener:', e);
        }
      });
    }

    /**
     * Retrieve translation by dot-notated key (e.g. 'settings.title')
     * @param {string} key
     * @param {Record<string, any>} [params]
     * @returns {string}
     */
    t(key, params) {
      if (!key || typeof key !== 'string') return '';
      const parts = key.split('.');
      
      // 1. Try current language
      let val = this._lookup(MESSAGES[this.resolvedLang], parts);
      
      // 2. Fallback to default language (es)
      if (val === undefined && this.resolvedLang !== DEFAULT_LANGUAGE) {
        val = this._lookup(MESSAGES[DEFAULT_LANGUAGE], parts);
      }

      // 3. Fallback to key itself
      if (val === undefined) {
        return key;
      }

      // Interpolation: {param}
      if (params && typeof params === 'object') {
        return String(val).replace(/\{(\w+)\}/g, (match, pName) => {
          return params[pName] !== undefined ? params[pName] : match;
        });
      }

      return String(val);
    }

    _lookup(obj, parts) {
      let cur = obj;
      for (const part of parts) {
        if (cur && typeof cur === 'object' && part in cur) {
          cur = cur[part];
        } else {
          return undefined;
        }
      }
      return cur;
    }

    /**
     * Walk DOM and apply translations to elements with data-i18n attributes
     * @param {Element|Document} [root]
     */
    applyTranslations(root) {
      if (typeof document === 'undefined') return;
      const container = root || document;

      // 1. data-i18n (Text Content)
      const textEls = container.querySelectorAll('[data-i18n]');
      textEls.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const translated = this.t(key);
        // If element has icon children (like <span class="material-symbols-outlined">),
        // we only update the direct text node to avoid destroying icons.
        let textNode = null;
        for (let i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === 3 /* Node.TEXT_NODE */) {
            textNode = el.childNodes[i];
            break;
          }
        }
        if (textNode && el.children.length > 0) {
          textNode.textContent = ' ' + translated.trim() + ' ';
        } else if (el.children.length === 0) {
          el.textContent = translated;
        }
      });

      // 2. data-i18n-placeholder
      const placeholderEls = container.querySelectorAll('[data-i18n-placeholder]');
      placeholderEls.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.setAttribute('placeholder', this.t(key));
      });

      // 3. data-i18n-title
      const titleEls = container.querySelectorAll('[data-i18n-title]');
      titleEls.forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.setAttribute('title', this.t(key));
      });

      // 4. data-i18n-aria
      const ariaEls = container.querySelectorAll('[data-i18n-aria]');
      ariaEls.forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (key) el.setAttribute('aria-label', this.t(key));
      });
    }

    /**
     * Return localized name of an aisle
     * @param {string} aisleId
     * @returns {string}
     */
    getAisleName(aisleId) {
      const key = `aisles.${aisleId}`;
      const translated = this.t(key);
      return translated !== key ? translated : aisleId;
    }
  }

  const instance = new I18nManager();
  instance.MESSAGES = MESSAGES;
  instance.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  instance.detectSystemLanguage = detectSystemLanguage;
  return instance;
});

