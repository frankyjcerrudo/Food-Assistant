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
        copy: 'Copiar',
        install: 'Instalar',
        options: 'Opciones',
        servings: 'raciones',
        minutes: 'min',
        copied: 'Copiado al portapapeles'
      },
      pwa: {
        bannerTitle: 'Prueba Sabory como App',
        bannerSub: 'Acceso rápido desde tu pantalla de inicio y modo offline.'
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
        menuTitle: 'Menú de Hoy',
        menuSubtitle: 'Tus comidas organizadas para el día.',
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
        subtitle: 'Organiza tus menús de Lunes a Domingo.',
        copyWeek: 'Copiar semana',
        sendToShopping: 'Enviar a la Compra',
        prevWeek: 'Anterior',
        currentWeek: 'Esta semana',
        nextWeek: 'Siguiente',
        expandWeek: 'Expandir semana',
        collapseWeek: 'Plegar semana',
        loadingWeek: 'Cargando semana...',
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
        title: 'Recetario',
        subtitle: 'Tu colección culinaria personal.',
        select: 'Seleccionar',
        selectAll: 'Seleccionar todas',
        deselectAll: 'Deseleccionar',
        searchPlaceholder: 'Buscar por plato, ingrediente o técnica...',
        fridgeTitle: '¿Qué cocino con lo que tengo en la nevera?',
        fridgePlaceholder: 'Ej. pollo, calabacín, huevos...',
        myFridge: 'Mi Nevera',
        tagBreakfast: 'Desayunos',
        tagLunch: 'Almuerzos',
        tagSnack: 'Meriendas',
        tagDinner: 'Cenas',
        tagQuick: 'Rápidas',
        tagHealthy: 'Saludable',
        newRecipeBtn: 'Añadir',
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
        byAisles: 'Por Pasillos',
        byRecipe: 'Por Receta',
        inputPlaceholder: 'Añadir artículo (ej. Plátanos, 1L Leche, Huevos...)',
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
        mode: 'Modo Cocina',
        step: 'Paso',
        of: 'de',
        prevStep: 'Anterior',
        nextStep: 'Siguiente',
        finish: '¡Receta Completada!',
        exit: 'Salir',
        screenAwake: 'Pantalla activa',
        timerTitle: 'Temporizador',
        timerStart: 'Iniciar',
        timerReset: 'Reiniciar',
        startTimer: 'Iniciar temporizador',
        pauseTimer: 'Pausar',
        resumeTimer: 'Reanudar',
        resetTimer: 'Reiniciar',
        timerFinished: '¡Tiempo cumplido!'
      },
      confirm: {
        title: 'Confirmar acción',
        cancel: 'Cancelar',
        accept: 'Confirmar'
      },
      onboarding: {
        skip: 'Omitir por ahora',
        welcomeTitle: '¡Te damos la bienvenida a Sabory!',
        welcomeSubtitle: 'Tu recetario editorial, planificador semanal y asistente de cocina inteligente. Configura Sabory a tu medida en menos de un minuto.',
        feature1Title: 'Recetario y Modo Cocina',
        feature1Desc: 'Importa recetas de webs, redes o fotos y cocina con pantalla siempre activa.',
        feature2Title: 'Planificación y Compra Inteligente',
        feature2Desc: 'Organiza tu semana y genera la lista agrupada por pasillos o por receta.',
        accountPromo: '¿Tienes cuenta o quieres sincronizar entre dispositivos?',
        connectAccount: 'Conectar cuenta',
        step2Kicker: 'Paso 2 de 5 · Alimentación',
        step2Title: '¿Sigues alguna preferencia dietética?',
        step2Subtitle: 'Selecciona las etiquetas que se adapten a ti. El Asistente IA y el Planificador las respetarán siempre. Puedes dejarlo en blanco si comes de todo.',
        step3Kicker: 'Paso 3 de 5 · Nutrición',
        step3Title: 'Objetivos nutricionales diarios',
        step3Subtitle: 'Activa el seguimiento si quieres ver tus calorías y macronutrientes diarios en la pantalla Hoy.',
        step3SwitchLabel: 'Mostrar calorías y macros',
        step3SwitchDesc: 'Anillo de calorías y barras de proteína, carbos y grasas',
        step3Templates: 'Plantillas recomendadas:',
        presetDeficit: '🔥 Déficit',
        presetBalanced: '⚖️ Equilibrado',
        presetProtein: '💪 Proteína',
        step3Custom: 'O personaliza tus cantidades exactas:',
        step3EditableBadge: 'Editables',
        step3Hint: '💡 Toca cualquiera de las cuatro casillas para escribir tus propios números.',
        step4Kicker: 'Paso 4 de 5 · Hogar',
        step4Title: '¿Para cuántas personas sueles cocinar?',
        step4Subtitle: 'Ajustaremos automáticamente las cantidades de tus recetas y de tu lista de la compra a estas raciones por defecto.',
        decreaseServings: 'Reducir comensales',
        increaseServings: 'Aumentar comensales',
        persons: 'personas',
        step5Title: '¡Todo listo para empezar!',
        step5Subtitle: 'Hemos preparado Sabory con tus preferencias. Puedes modificar cualquiera de estos ajustes en cualquier momento desde el icono de engranaje.',
        nextBtn: 'Siguiente',
        prevBtn: 'Anterior',
        finishBtn: '¡Empezar a cocinar!'
      },
      goals: {
        calories: 'Calorías',
        protein: 'Proteínas',
        carbs: 'Carbohidratos',
        fat: 'Grasas'
      },
      import: {
        title: 'Importador de Recetas',
        subtitle: 'Pega el enlace o el texto de una receta para añadirla a tu colección.',
        tabUrl: 'Enlace',
        tabText: 'Texto',
        tabAi: 'Foto / IA',
        urlLabel: 'URL de la receta',
        urlPlaceholder: 'https://www.directoalpaladar.com/recetas/...',
        corsTitle: 'No se pudo descargar automáticamente desde esta web.',
        corsDesc: 'Puedes importar la receta copiando su contenido:',
        corsStep1: 'Copia el texto de los ingredientes y pasos en tu navegador.',
        corsStep2: 'Pégalo en la pestaña "Texto / Notas".',
        corsBtn: "Pegar en 'Texto / Notas'",
        textLabel: 'Texto o notas de la receta',
        pasteClipboard: 'Pegar del portapapeles',
        textPlaceholder: 'Pega aquí el texto copiado de cualquier web o nota...',
        aiPhotoLabel: '1. Foto de libro de cocina, nota manuscrita o plato (opcional)',
        removePhoto: 'Quitar foto',
        aiPromptLabel: '2. Descripción de Instagram/TikTok o idea para que Gemini cree la receta',
        aiPromptPlaceholder: 'Pega aquí el texto desordenado de un Reel/TikTok o describe lo que quieres...',
        manualBtn: 'Escribir a mano',
        executeBtn: 'Analizar e Importar',
        saveBtn: 'Guardar en Recetas'
      },
      toasts: {
        recipeSaved: 'Receta guardada con éxito',
        recipeDeleted: 'Receta eliminada',
        planAdded: 'Plato añadido al plan',
        planCleared: 'Plan semanal limpiado',
        shoppingItemAdded: 'Artículo añadido a la lista',
        shoppingCleared: 'Artículos comprados eliminados',
        shoppingCopied: 'Lista de la compra copiada',
        weekCopied: 'Semana copiada con éxito',
        goalsSaved: 'Objetivos nutricionales actualizados',
        errorGeneric: 'Ha ocurrido un error inesperado',
        syncSuccess: 'Datos sincronizados correctamente'
      },
      recipeChoice: {
        title: 'Añadir Receta',
        subtitle: 'Elige cómo prefieres añadir la receta a tu recetario:',
        manualTitle: 'Añadir a mano',
        manualDesc: 'Rellena los ingredientes, pasos y detalles paso a paso',
        urlTitle: 'Importar por enlace web',
        urlDesc: 'Pega una URL de recetas para extraerla automáticamente',
        textTitle: 'Importar por texto o notas',
        textDesc: 'Pega texto copiado con ingredientes y preparación',
        aiTitle: 'Foto, Redes Sociales o IA (Gemini)',
        aiDesc: 'Sube foto de un libro/plato, pega texto de Instagram/TikTok o descríbela',
        bulkTitle: 'Importar archivo JSON o copia',
        bulkDesc: 'Migración masiva de colecciones o copias de seguridad'
      },
      copyWeek: {
        title: 'Copiar Plan de Otra Semana',
        chooseSource: '1. Elige la semana de origen',
        customDateLabel: 'O elige cualquier fecha del calendario:',
        previewTitle: '2. Vista previa de la semana a copiar',
        modeTitle: '3. Modo de copia',
        replaceTitle: 'Reemplazar semana',
        replaceDesc: 'Copia el menú exacto sustituyendo el actual',
        mergeTitle: 'Solo huecos vacíos',
        mergeDesc: 'Respeta los platos que ya tengas asignados',
        copyBtn: 'Copiar a esta semana'
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
        copy: 'Copy',
        install: 'Install',
        options: 'Options',
        servings: 'servings',
        minutes: 'min',
        copied: 'Copied to clipboard'
      },
      pwa: {
        bannerTitle: 'Try Sabory as an App',
        bannerSub: 'Fast access from your home screen and offline mode.'
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
        menuTitle: "Today's Menu",
        menuSubtitle: 'Your meals organized for today.',
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
        subtitle: 'Organize your meal plans from Monday to Sunday.',
        copyWeek: 'Copy week',
        sendToShopping: 'Send to Shopping',
        prevWeek: 'Previous',
        currentWeek: 'This week',
        nextWeek: 'Next',
        expandWeek: 'Expand week',
        collapseWeek: 'Collapse week',
        loadingWeek: 'Loading week...',
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
        title: 'Recipes',
        subtitle: 'Your personal culinary collection.',
        select: 'Select',
        selectAll: 'Select all',
        deselectAll: 'Deselect',
        searchPlaceholder: 'Search by dish, ingredient or technique...',
        fridgeTitle: 'What can I cook with what is in my fridge?',
        fridgePlaceholder: 'E.g. chicken, zucchini, eggs...',
        myFridge: 'My Fridge',
        tagBreakfast: 'Breakfast',
        tagLunch: 'Lunch',
        tagSnack: 'Snacks',
        tagDinner: 'Dinner',
        tagQuick: 'Quick',
        tagHealthy: 'Healthy',
        newRecipeBtn: 'Add',
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
        byAisles: 'By Aisle',
        byRecipe: 'By Recipe',
        inputPlaceholder: 'Add item (e.g. Bananas, 1L Milk, Eggs...)',
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
        mode: 'Cooking Mode',
        step: 'Step',
        of: 'of',
        prevStep: 'Previous',
        nextStep: 'Next',
        finish: 'Recipe Completed!',
        exit: 'Exit',
        screenAwake: 'Screen awake',
        timerTitle: 'Timer',
        timerStart: 'Start',
        timerReset: 'Reset',
        startTimer: 'Start timer',
        pauseTimer: 'Pause',
        resumeTimer: 'Resume',
        resetTimer: 'Reset',
        timerFinished: 'Time is up!'
      },
      confirm: {
        title: 'Confirm action',
        cancel: 'Cancel',
        accept: 'Confirm'
      },
      onboarding: {
        skip: 'Skip for now',
        welcomeTitle: 'Welcome to Sabory!',
        welcomeSubtitle: 'Your culinary collection, weekly meal planner and smart cooking assistant. Set up Sabory in under a minute.',
        feature1Title: 'Recipes & Cooking Mode',
        feature1Desc: 'Import recipes from websites, social media or photos and cook with your screen always awake.',
        feature2Title: 'Meal Planning & Smart Shopping',
        feature2Desc: 'Organize your week and generate shopping lists sorted by aisle or by recipe.',
        accountPromo: 'Have an account or want to sync across devices?',
        connectAccount: 'Connect account',
        step2Kicker: 'Step 2 of 5 · Food',
        step2Title: 'Do you follow any dietary preference?',
        step2Subtitle: 'Select tags that suit you. The AI Assistant and Planner will always respect them. You can leave it empty if you eat everything.',
        step3Kicker: 'Step 3 of 5 · Nutrition',
        step3Title: 'Daily nutritional goals',
        step3Subtitle: 'Enable tracking if you want to see your daily calories and macronutrients on the Today screen.',
        step3SwitchLabel: 'Show calories & macros',
        step3SwitchDesc: 'Calorie ring and bars for protein, carbs and fats',
        step3Templates: 'Recommended templates:',
        presetDeficit: '🔥 Deficit',
        presetBalanced: '⚖️ Balanced',
        presetProtein: '💪 High Protein',
        step3Custom: 'Or customize your exact amounts:',
        step3EditableBadge: 'Editable',
        step3Hint: '💡 Tap any of the four boxes to type your own numbers.',
        step4Kicker: 'Step 4 of 5 · Household',
        step4Title: 'How many people do you usually cook for?',
        step4Subtitle: 'We will automatically adjust your recipe quantities and shopping lists to these default servings.',
        decreaseServings: 'Decrease servings',
        increaseServings: 'Increase servings',
        persons: 'people',
        step5Title: 'All set to get started!',
        step5Subtitle: 'We prepared Sabory with your preferences. You can change any of these settings anytime from the gear icon.',
        nextBtn: 'Next',
        prevBtn: 'Previous',
        finishBtn: 'Start cooking!'
      },
      goals: {
        calories: 'Calories',
        protein: 'Protein',
        carbs: 'Carbohydrates',
        fat: 'Fats'
      },
      import: {
        title: 'Recipe Importer',
        subtitle: 'Paste a link or text from a recipe to add it to your collection.',
        tabUrl: 'Link',
        tabText: 'Text',
        tabAi: 'Photo / AI',
        urlLabel: 'Recipe URL',
        urlPlaceholder: 'https://www.allrecipes.com/recipe/...',
        corsTitle: 'Could not download automatically from this site.',
        corsDesc: 'You can import the recipe by copying its contents:',
        corsStep1: 'Copy the ingredients and steps text in your browser.',
        corsStep2: 'Paste it into the "Text / Notes" tab.',
        corsBtn: "Paste in 'Text / Notes'",
        textLabel: 'Recipe text or notes',
        pasteClipboard: 'Paste from clipboard',
        textPlaceholder: 'Paste the text copied from any web or note here...',
        aiPhotoLabel: '1. Photo of cookbook, handwritten note or dish (optional)',
        removePhoto: 'Remove photo',
        aiPromptLabel: '2. Instagram/TikTok description or idea for Gemini to create the recipe',
        aiPromptPlaceholder: 'Paste messy text from a Reel/TikTok or describe what you want (e.g. \'High-protein banana oat pancakes in 10 minutes\')...',
        manualBtn: 'Write manually',
        executeBtn: 'Analyze & Import',
        saveBtn: 'Save to Recipes'
      },
      toasts: {
        recipeSaved: 'Recipe saved successfully',
        recipeDeleted: 'Recipe deleted',
        planAdded: 'Dish added to plan',
        planCleared: 'Weekly plan cleared',
        shoppingItemAdded: 'Item added to list',
        shoppingCleared: 'Purchased items cleared',
        shoppingCopied: 'Shopping list copied',
        weekCopied: 'Week copied successfully',
        goalsSaved: 'Nutritional goals updated',
        errorGeneric: 'An unexpected error occurred',
        syncSuccess: 'Data synchronized successfully'
      },
      recipeChoice: {
        title: 'Add Recipe',
        subtitle: 'Choose how you prefer to add the recipe to your cookbook:',
        manualTitle: 'Add manually',
        manualDesc: 'Fill in ingredients, steps and details step by step',
        urlTitle: 'Import from web link',
        urlDesc: 'Paste a recipe URL to extract it automatically',
        textTitle: 'Import from text or notes',
        textDesc: 'Paste copied text with ingredients and preparation',
        aiTitle: 'Photo, Social Media or AI (Gemini)',
        aiDesc: 'Upload photo of a book/dish, paste Instagram/TikTok text or describe it',
        bulkTitle: 'Import JSON file or backup',
        bulkDesc: 'Bulk migration of collections or backups'
      },
      copyWeek: {
        title: 'Copy Plan from Another Week',
        chooseSource: '1. Choose source week',
        customDateLabel: 'Or choose any date from the calendar:',
        previewTitle: '2. Preview of week to copy',
        modeTitle: '3. Copy mode',
        replaceTitle: 'Replace week',
        replaceDesc: 'Copy the exact menu replacing current dishes',
        mergeTitle: 'Only empty slots',
        mergeDesc: 'Preserve dishes you already assigned',
        copyBtn: 'Copy to this week'
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

      // 4. data-i18n-aria & data-i18n-aria-label
      const ariaEls = container.querySelectorAll('[data-i18n-aria], [data-i18n-aria-label]');
      ariaEls.forEach(el => {
        const key = el.getAttribute('data-i18n-aria') || el.getAttribute('data-i18n-aria-label');
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

