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
        copied: 'Copiado al portapapeles',
        understood: 'Entendido',
        forPrefix: 'Para:'
      },
      pwa: {
        bannerTitle: 'Prueba Sabory como App',
        bannerSub: 'Acceso rápido desde tu pantalla de inicio y modo offline.'
      },
      nav: {
        today: 'Hoy',
        planner: 'Planificador',
        recipes: 'Recetas',
        shopping: 'Compra',
        ai: 'Asistente IA',
        aiTitle: 'Hablar con el Asistente de Cocina',
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
        viewAccount: 'Ver Cuenta',
        syncedWith: 'Sincronizado con',
        syncedAt: 'Sincronizado a las',
        localProfileDemo: 'Perfil local (Demo) - Supabase no configurado',
        dataOnlyDevice: 'Datos almacenados solo en este dispositivo',
        cloudAccountTitle: 'Cuenta en la Nube',
        myCloudAccountTitle: 'Mi Cuenta en la Nube',
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
        enableTracking: 'Activar seguimiento',
        enableTrackingDesc: 'Muestra el progreso en Hoy y los valores nutricionales en las tarjetas de Recetas',
        nutritionDisclaimer: 'Los valores nutricionales calculados para las recetas son una estimación orientativa y dependen de cada receta (creada a mano o importada por los usuarios). Úsalos únicamente como referencia aproximada.',
        saveGoals: 'Guardar objetivos',
        servingsTitle: 'Raciones por Defecto',
        servingsDesc: 'Porciones predeterminadas al planificar o calcular la lista de la compra.',
        advancedTitle: 'Configuración avanzada y sistema',
        autoTagTitle: 'Análisis y Auto-etiquetado de Recetas',
        autoTagDesc: 'Analiza todas tus recetas guardadas para detectar automáticamente sus etiquetas dietéticas (Vegano, Vegetariano, Sin Gluten, etc.) y prácticas (Rápida, Horno, Tupper, etc.) según sus ingredientes y pasos.',
        autoTagBtn: 'Analizar y etiquetar recetas ahora',
        aiMotorTitle: 'Motor de Inteligencia Artificial (BYOK Opcional)',
        aiMotorDesc: 'El Asistente incluye un motor inteligente integrado sin coste. Si lo deseas, puedes vincular tu propia clave (Bring Your Own Key) para conectar con Google Gemini, OpenAI o Claude y consumir de tu plan personal.',
        aiProviderLabel: 'Proveedor de Inteligencia Artificial:',
        aiTtsVoice: 'Voz del Asistente (TTS)',
        aiTtsVoiceDesc: 'Leer respuestas en voz alta de forma ágil y concisa',
        externalAgentTitle: 'Control Externo por Voz e IA (sin abrir la app)',
        externalAgentDesc: 'Conecta Claude, ChatGPT, Gemini o un atajo de voz de tu móvil para crear recetas, planificar y llenar la compra directamente en tu cuenta.',
        externalAgentAllow: 'Permitir acceso a asistentes externos',
        generateToken: 'Generar / Regenerar token',
        revokeToken: 'Revocar',
        quickGuide: 'Guía rápida de conexión',
        copyGuide: 'Copiar guía',
        versionTitle: 'Versión y Actualizaciones',
        versionCacheNotice: 'Si acabas de desplegar o notas que algún cambio no aparece, pulsa el botón para limpiar la caché del Service Worker y cargar el código más reciente.',
        forceUpdateBtn: 'Forzar Actualización y Limpiar Caché',
        installAppDesc: 'Instala Sabory en tu pantalla de inicio para abrirla como una app, a pantalla completa y también como destino al compartir enlaces de recetas.',
        installAppBtn: 'Instalar App en tu pantalla de inicio',
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
        addAnotherMeal: 'Añadir otra comida',
        assignDish: 'Asignar plato',
        viewRecipe: 'Ver receta',
        removeDish: 'Quitar plato',
        leftovers: 'Sobras',
        viewBreakdown: 'Ver desglose',
        hideBreakdown: 'Ocultar desglose',
        breakdownAria: 'Ver desglose nutricional completo en ventana modal',
        noMealsPlanned: 'Ninguna comida asignada para hoy. Toca un momento para empezar.',
        allMealsPlanned: 'Todas las comidas planificadas ({count} de {total}). ¡Listo para cocinar!',
        someMealsPlanned: '{count} de {total} comidas planificadas para hoy.',
        trackingDisabled: 'Seguimiento nutricional desactivado',
        setupOrActivate: 'Configurar / Activar',
        goalsBtn: 'Objetivos',
        dailySummaryTitle: 'Resumen Nutricional Diario',
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
        addMealBtn: 'Añadir Comida',
        addMealAria: 'Añadir momento de comida',
        noMealsAssigned: 'Sin comidas asignadas · toca para planificar',
        todayBadge: 'HOY',
        tomorrowBadge: 'MAÑANA',
        removeRecipe: 'Quitar receta',
        leftoversTooltip: 'Cocinado el día anterior para sobras',
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
        myFridgeTooltip: 'Buscar recetas según lo que tienes en la nevera',
        all: 'Todas',
        favorites: 'Favoritas',
        noIngredients: 'Sin ingredientes',
        noIngredientsTooltip: 'Filtrar recetas sin ingredientes',
        noInstructions: 'Sin pasos',
        noInstructionsTooltip: 'Filtrar recetas sin pasos ni elaboración',
        tagBreakfast: 'Desayunos',
        tagLunch: 'Almuerzos',
        tagSnack: 'Meriendas',
        tagDinner: 'Cenas',
        tagQuick: 'Rápidas',
        tagHealthy: 'Saludable',
        newRecipeBtn: 'Añadir',
        importBtn: 'Importar',
        noRecipesFound: 'No se encontraron recetas con ese criterio.',
        prepTime: 'Prep:',
        cookTime: 'Cocción:',
        totalTime: 'Tiempo Total',
        servings: 'Porciones',
        persons: 'personas',
        nutritionFacts: 'Información Nutricional',
        perServing: 'Por ración individual',
        nutritionDisclaimer: 'Los valores nutricionales calculados son una estimación orientativa que depende de cada receta (creada a mano o importada por los usuarios). No deben tomarse al pie de la letra, sino solo como referencia aproximada.',
        ingredients: 'Ingredientes',
        sendToShopping: 'Enviar a la Compra',
        instructions: 'Instrucciones',
        minutes: 'minutos',
        addToPlan: 'Añadir al Plan',
        cookingMode: 'Modo Cocina',
        planRecipe: 'Planificar',
        planRecipeTooltip: 'Planificar esta receta en el calendario',
        favoriteAria: 'Marcar o desmarcar como favorita',
        screenAwake: 'Pantalla activa',
        screenAwakeTooltip: 'La pantalla permanecerá encendida mientras consultas la receta',
        calories: 'kcal'
      },
      tags: {
        'Keto': 'Keto',
        'Vegano': 'Vegano',
        'Vegetariano': 'Vegetariano',
        'Sin Gluten': 'Sin Gluten',
        'Sin Lactosa': 'Sin Lactosa',
        'Bajo en Carbos': 'Bajo en Carbos',
        'Alta en Proteínas': 'Alta en Proteínas',
        'Desayuno': 'Desayuno',
        'Almuerzo': 'Almuerzo',
        'Merienda': 'Merienda',
        'Cena': 'Cena',
        'Rápida': 'Rápida',
        'Horno': 'Horno',
        'Tupper': 'Tupper',
        'Airfryer': 'Airfryer',
        'Saludable': 'Saludable',
        'Robot de Cocina': 'Robot de Cocina',
        'Smoothies': 'Smoothies'
      },
      nutrition: {
        breakdownTitle: 'Desglose Nutricional de Hoy',
        breakdownSubtitle: 'Plan para hoy ({count} {meals}).',
        mealSingle: 'comida',
        mealPlural: 'comidas',
        configureGoals: 'Configurar Objetivos',
        inRange: 'En rango',
        remaining: 'Faltan {amount}{unit}',
        exceeded: '+ Superado',
        excess: '+{amount}{unit}',
        ofTarget: 'de {target}{unit} ({percent}%)',
        syncedWithGoals: 'Valores nutricionales sincronizados con tus objetivos diarios configurados.',
        disclaimer: 'Valores orientativos calculados a partir de recetas creadas o importadas; úsalos como guía general.',
        ratioProt: 'Proteínas: {percent}%',
        ratioCarbs: 'Carbohidratos: {percent}%',
        ratioFat: 'Grasas: {percent}%'
      },
      ai: {
        title: 'Asistente de Cocina',
        subtitle: 'Dime qué necesitas, pregúntame dudas o planifiquemos juntos',
        stopVoice: 'Parar voz',
        newTopic: 'Nuevo tema',
        initialPrompt: 'Pulsa el micro o escribe tu petición',
        listeningTo: 'Escuchando a {name}...',
        listening: 'Escuchando...',
        chipShopping: 'Apuntar a la compra',
        chipWeekend: 'Menú fin de semana',
        chipDinner: 'Sugerencia de cena',
        inputPlaceholder: 'Pregunta algo o pulsa el micro...',
        talkToAssistant: 'Hablar con el Asistente',
        sendRequest: 'Enviar petición',
        listeningStop: 'Escuchando... pulsa para parar',
        speakMic: 'Hablar por micrófono'
      },
      household: {
        personalMode: 'Modo Personal',
        home: 'Hogar',
        inviteCodeLabel: 'Código de invitación',
        codeBtn: 'Código',
        inviteBtn: 'Invitar',
        membersTitle: 'Miembros del Hogar',
        syncBtn: 'Sincronizar hogar',
        leaveBtn: 'Abandonar hogar',
        dissolveBtn: 'Disolver hogar',
        hostRole: 'Anfitrión',
        memberRole: 'Miembro',
        makeHost: 'Hacer anfitrión',
        you: '(Tú)',
        syncedMemberSingle: 'miembro sincronizado',
        syncedMemberPlural: 'miembros sincronizados'
      },
      shopping: {
        title: 'Lista de la Compra',
        byAisles: 'Por Pasillos',
        byRecipe: 'Por Receta',
        inputPlaceholder: 'Añadir artículo (ej. Plátanos, 1L Leche, Huevos...)',
        addBtn: 'Añadir',
        clearCompletedBtn: 'Limpiar completados',
        clearCompleted: 'Limpiar completados',
        emptyList: 'Tu lista de la compra está vacía.',
        completedSectionTitle: 'Completados',
        completedHeading: 'Completados ({count})'
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
        copied: 'Copied to clipboard',
        understood: 'Got it',
        forPrefix: 'For:'
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
        ai: 'AI Assistant',
        aiTitle: 'Talk to Kitchen Assistant',
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
        viewAccount: 'View Account',
        syncedWith: 'Synced with',
        syncedAt: 'Synced at',
        localProfileDemo: 'Local profile (Demo) - Supabase not configured',
        dataOnlyDevice: 'Data stored only on this device',
        cloudAccountTitle: 'Cloud Account',
        myCloudAccountTitle: 'My Cloud Account',
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
        enableTracking: 'Enable tracking',
        enableTrackingDesc: 'Show progress on Today and nutritional values on recipe cards',
        nutritionDisclaimer: 'Nutritional values calculated for recipes are a general estimate and depend on each recipe (user-created or imported). Use only as an approximate reference.',
        saveGoals: 'Save goals',
        servingsTitle: 'Default Servings',
        servingsDesc: 'Default portions when planning meals or generating shopping lists.',
        advancedTitle: 'Advanced Settings & System',
        autoTagTitle: 'Recipe Analysis & Auto-tagging',
        autoTagDesc: 'Analyze all your saved recipes to automatically detect dietary (Vegan, Vegetarian, Gluten-Free, etc.) and practical tags (Quick, Oven, Meal Prep, etc.) based on ingredients and steps.',
        autoTagBtn: 'Analyze and tag recipes now',
        aiMotorTitle: 'AI Engine (Optional BYOK)',
        aiMotorDesc: 'The Assistant includes a built-in free AI engine. If you wish, you can link your own key (Bring Your Own Key) to connect with Google Gemini, OpenAI or Claude and consume from your personal plan.',
        aiProviderLabel: 'AI Provider:',
        aiTtsVoice: 'Assistant Voice (TTS)',
        aiTtsVoiceDesc: 'Read answers out loud concisely and swiftly',
        externalAgentTitle: 'External Voice & AI Control (without opening the app)',
        externalAgentDesc: 'Connect Claude, ChatGPT, Gemini or a mobile voice shortcut to create recipes, meal plan and populate shopping lists directly into your account.',
        externalAgentAllow: 'Allow access to external assistants',
        generateToken: 'Generate / Regenerate token',
        revokeToken: 'Revoke',
        quickGuide: 'Quick connection guide',
        copyGuide: 'Copy guide',
        versionTitle: 'Version & Updates',
        versionCacheNotice: 'If you just deployed or changes don\'t appear, tap the button to clear the Service Worker cache and load the freshest code.',
        forceUpdateBtn: 'Force Update & Clear Cache',
        installAppDesc: 'Install Sabory on your home screen to launch it as an app, full screen, and as a share target for recipe links.',
        installAppBtn: 'Install App on your home screen',
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
        addAnotherMeal: 'Add another meal',
        assignDish: 'Assign dish',
        viewRecipe: 'View recipe',
        removeDish: 'Remove dish',
        leftovers: 'Leftovers',
        viewBreakdown: 'Show breakdown',
        hideBreakdown: 'Hide breakdown',
        breakdownAria: 'View full nutritional breakdown in modal',
        noMealsPlanned: 'No meals assigned for today. Tap a meal slot to start.',
        allMealsPlanned: 'All meals planned ({count} of {total}). Ready to cook!',
        someMealsPlanned: '{count} of {total} meals planned for today.',
        trackingDisabled: 'Nutritional tracking disabled',
        setupOrActivate: 'Configure / Enable',
        goalsBtn: 'Goals',
        dailySummaryTitle: 'Daily Nutritional Summary',
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
        addMealBtn: 'Add Meal',
        addMealAria: 'Add meal slot',
        noMealsAssigned: 'No meals assigned · tap to plan',
        todayBadge: 'TODAY',
        tomorrowBadge: 'TOMORROW',
        removeRecipe: 'Remove recipe',
        leftoversTooltip: 'Cooked earlier for leftovers',
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
        myFridgeTooltip: 'Search recipes based on what is in your fridge',
        all: 'All',
        favorites: 'Favorites',
        noIngredients: 'No ingredients',
        noIngredientsTooltip: 'Filter recipes without ingredients',
        noInstructions: 'No instructions',
        noInstructionsTooltip: 'Filter recipes without instructions',
        tagBreakfast: 'Breakfast',
        tagLunch: 'Lunch',
        tagSnack: 'Snacks',
        tagDinner: 'Dinner',
        tagQuick: 'Quick',
        tagHealthy: 'Healthy',
        newRecipeBtn: 'Add',
        importBtn: 'Import',
        noRecipesFound: 'No recipes found matching your criteria.',
        prepTime: 'Prep:',
        cookTime: 'Cook:',
        totalTime: 'Total Time',
        servings: 'Servings',
        persons: 'people',
        nutritionFacts: 'Nutrition Facts',
        perServing: 'Per individual serving',
        nutritionDisclaimer: 'Nutritional values calculated are a general estimate depending on each recipe (user-created or imported). Use only as an approximate guide.',
        ingredients: 'Ingredients',
        sendToShopping: 'Send to Shopping',
        instructions: 'Instructions',
        minutes: 'minutes',
        addToPlan: 'Add to Plan',
        cookingMode: 'Cooking Mode',
        planRecipe: 'Plan',
        planRecipeTooltip: 'Plan this recipe in calendar',
        favoriteAria: 'Add or remove from favorites',
        screenAwake: 'Screen awake',
        screenAwakeTooltip: 'The screen will stay awake while viewing recipe',
        calories: 'kcal'
      },
      tags: {
        'Keto': 'Keto',
        'Vegano': 'Vegan',
        'Vegetariano': 'Vegetarian',
        'Sin Gluten': 'Gluten-Free',
        'Sin Lactosa': 'Lactose-Free',
        'Bajo en Carbos': 'Low Carb',
        'Alta en Proteínas': 'High Protein',
        'Desayuno': 'Breakfast',
        'Almuerzo': 'Lunch',
        'Merienda': 'Snack',
        'Cena': 'Dinner',
        'Rápida': 'Quick',
        'Horno': 'Oven',
        'Tupper': 'Meal Prep',
        'Airfryer': 'Air Fryer',
        'Saludable': 'Healthy',
        'Robot de Cocina': 'Food Processor',
        'Smoothies': 'Smoothies'
      },
      nutrition: {
        breakdownTitle: "Today's Nutritional Breakdown",
        breakdownSubtitle: "Today's plan ({count} {meals}).",
        mealSingle: 'meal',
        mealPlural: 'meals',
        configureGoals: 'Configure Goals',
        inRange: 'In range',
        remaining: '{amount}{unit} left',
        exceeded: '+ Exceeded',
        excess: '+{amount}{unit}',
        ofTarget: 'of {target}{unit} ({percent}%)',
        syncedWithGoals: 'Nutritional values synchronized with your configured daily goals.',
        disclaimer: 'Estimated values calculated from created or imported recipes; use as a general guide.',
        ratioProt: 'Protein: {percent}%',
        ratioCarbs: 'Carbohydrates: {percent}%',
        ratioFat: 'Fats: {percent}%'
      },
      ai: {
        title: 'Kitchen Assistant',
        subtitle: 'Tell me what you need, ask questions or let\'s plan together',
        stopVoice: 'Stop voice',
        newTopic: 'New chat',
        initialPrompt: 'Tap microphone or type your request',
        listeningTo: 'Listening to {name}...',
        listening: 'Listening...',
        chipShopping: 'Add to shopping',
        chipWeekend: 'Weekend menu',
        chipDinner: 'Dinner suggestion',
        inputPlaceholder: 'Ask anything or tap the microphone...',
        talkToAssistant: 'Talk to Assistant',
        sendRequest: 'Send request',
        listeningStop: 'Listening... tap to stop',
        speakMic: 'Speak through microphone'
      },
      household: {
        personalMode: 'Personal Mode',
        home: 'Household',
        inviteCodeLabel: 'Invite code',
        codeBtn: 'Code',
        inviteBtn: 'Invite',
        membersTitle: 'Household Members',
        syncBtn: 'Sync household',
        leaveBtn: 'Leave household',
        dissolveBtn: 'Dissolve household',
        hostRole: 'Host',
        memberRole: 'Member',
        makeHost: 'Make host',
        you: '(You)',
        syncedMemberSingle: 'synced member',
        syncedMemberPlural: 'synced members'
      },
      shopping: {
        title: 'Shopping List',
        byAisles: 'By Aisle',
        byRecipe: 'By Recipe',
        inputPlaceholder: 'Add item (e.g. Bananas, 1L Milk, Eggs...)',
        addBtn: 'Add',
        clearCompletedBtn: 'Clear completed',
        clearCompleted: 'Clear completed',
        emptyList: 'Your shopping list is empty.',
        completedSectionTitle: 'Completed',
        completedHeading: 'Completed ({count})'
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

    /**
     * Return localized label for a tag (e.g. 'Alta en Proteínas' -> 'High Protein')
     * @param {string} tag
     * @returns {string}
     */
    getTagLabel(tag) {
      if (!tag) return '';
      const key = `tags.${tag}`;
      const translated = this.t(key);
      return translated !== key ? translated : tag;
    }

    /**
     * Return localized label for a standard slot (e.g. 'breakfast' -> 'Desayuno' / 'Breakfast')
     * @param {string} slotKey
     * @param {string} [fallback]
     * @returns {string}
     */
    getSlotLabel(slotKey, fallback) {
      if (!slotKey) return fallback || '';
      const key = `today.${slotKey}`;
      const translated = this.t(key);
      return translated !== key ? translated : (fallback || slotKey);
    }

    /**
     * Return localized day of week name (0 = Monday, ..., 6 = Sunday)
     * @param {number} dayIndex
     * @returns {string}
     */
    getDayName(dayIndex) {
      const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const slotKey = keys[dayIndex] || 'monday';
      return this.t(`planner.${slotKey}`);
    }
  }

  const instance = new I18nManager();
  instance.MESSAGES = MESSAGES;
  instance.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  instance.detectSystemLanguage = detectSystemLanguage;
  return instance;
});
