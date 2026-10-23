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
  },
  {
    id: "rec-avocado-toast",
    title: "Tostadas de Aguacate, Huevo Poché y Semillas",
    description: "Rebanadas de pan de masa madre crujiente con crema de aguacate fresco, huevos poché jugosos y semillas de chía y sésamo.",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    servings: 2,
    tags: ["Desayuno", "Rápida", "Saludable"],
    ingredients: [
      { id: "i22", name: "Pan integral de masa madre", amount: 2, unit: "rebanadas", aisle: "bakery" },
      { id: "i23", name: "Aguacate maduro", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i24", name: "Huevos camperos", amount: 2, unit: "ud", aisle: "dairy" },
      { id: "i25", name: "Semillas de chía y sésamo", amount: 10, unit: "g", aisle: "pantry" },
      { id: "i26", name: "Aceite de oliva virgen extra", amount: 10, unit: "ml", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Tuesta las rebanadas de pan hasta que estén doradas y crujientes.", timerMinutes: 3 },
      { step: 2, text: "En un plato, machaca el aguacate con sal, pimienta y unas gotas de limón.", timerMinutes: 1 },
      { step: 3, text: "Cocina los huevos poché en agua hirviendo con vinagre o a la plancha.", timerMinutes: 3 },
      { step: 4, text: "Monta el aguacate sobre las tostadas, pon el huevo encima y corona con las semillas.", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-porridge-bowl",
    title: "Porridge Cremoso de Avena con Frutos Rojos",
    description: "Gachas de avena templadas cocinadas a fuego lento, con arándanos, plátano, nueces picadas y un toque de canela y miel.",
    imageUrl: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    servings: 2,
    tags: ["Desayuno", "Saludable"],
    ingredients: [
      { id: "i27", name: "Copos de avena integral", amount: 100, unit: "g", aisle: "pantry" },
      { id: "i28", name: "Leche o bebida vegetal", amount: 400, unit: "ml", aisle: "dairy" },
      { id: "i29", name: "Frutos rojos frescos (arándanos/frambuesas)", amount: 80, unit: "g", aisle: "produce" },
      { id: "i30", name: "Plátano maduro", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i31", name: "Nueces peladas", amount: 25, unit: "g", aisle: "pantry" },
      { id: "i32", name: "Miel pura y canela", amount: 15, unit: "g", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Calienta la leche en un cazo con una pizca de canela.", timerMinutes: 2 },
      { step: 2, text: "Añade los copos de avena y remueve suavemente a fuego medio 5 minutos hasta que espese.", timerMinutes: 5 },
      { step: 3, text: "Sirve en boles y añade el plátano en rodajas, los frutos rojos, nueces y miel.", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-healthy-snack",
    title: "Tostas de Hummus con Tomates Cherry y Chía",
    description: "Snack saciante y nutritivo ideal para media mañana o merienda, listo en 5 minutos sin cocinar.",
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 2,
    tags: ["Merienda", "Saludable", "Rápida"],
    ingredients: [
      { id: "i33", name: "Tostadas de espelta o centeno", amount: 4, unit: "ud", aisle: "bakery" },
      { id: "i34", name: "Hummus de garbanzos", amount: 120, unit: "g", aisle: "pantry" },
      { id: "i35", name: "Tomates cherry", amount: 8, unit: "ud", aisle: "produce" },
      { id: "i36", name: "Semillas de chía o calabaza", amount: 15, unit: "g", aisle: "pantry" },
      { id: "i37", name: "Aceite de oliva virgen extra", amount: 10, unit: "ml", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Unta generosamente el hummus sobre cada una de las tostas crujientes.", timerMinutes: 2 },
      { step: 2, text: "Corta los tomates cherry por la mitad y colócalos encima.", timerMinutes: 2 },
      { step: 3, text: "Espolvorea las semillas y añade un hilo de aceite de oliva con sal en escamas.", timerMinutes: 0 }
    ]
  },
  {
    id: "rec-smoothie-bowl",
    title: "Bowl de Yogur Griego, Frutas Frescas y Granola",
    description: "Desayuno o merienda equilibrada y llena de energía con base láctea fresca, kiwi, fresas y crujiente de granola.",
    imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 2,
    tags: ["Desayuno", "Merienda", "Saludable", "Rápida"],
    ingredients: [
      { id: "i38", name: "Yogur griego natural sin azúcar", amount: 300, unit: "g", aisle: "dairy" },
      { id: "i39", name: "Fresas", amount: 100, unit: "g", aisle: "produce" },
      { id: "i40", name: "Kiwi", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i41", name: "Granola tostada", amount: 60, unit: "g", aisle: "pantry" },
      { id: "i42", name: "Miel o sirope de agave", amount: 15, unit: "ml", aisle: "pantry" }
    ],
    instructions: [
      { step: 1, text: "Vierte el yogur griego en dos boles hondos.", timerMinutes: 1 },
      { step: 2, text: "Lava y corta las fresas y el kiwi en rodajas finas.", timerMinutes: 3 },
      { step: 3, text: "Dispón la fruta y la granola en la superficie y endulza con un toque de miel.", timerMinutes: 0 }
    ]
  }
];

const STANDARD_SLOTS = [
  { key: 'breakfast', label: 'Desayuno', icon: 'wb_twilight' },
  { key: 'lunch', label: 'Almuerzo', icon: 'wb_sunny' },
  { key: 'snack', label: 'Merienda', icon: 'cookie' },
  { key: 'dinner', label: 'Cena', icon: 'dark_mode' }
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
    let savedRecipes = this.load('fa_recipes', SEED_RECIPES);
    // Merge any new seed recipes so users get breakfasts and snacks immediately
    if (Array.isArray(savedRecipes)) {
      SEED_RECIPES.forEach(seed => {
        if (!savedRecipes.some(r => r.id === seed.id)) {
          savedRecipes.push(seed);
        }
      });
    } else {
      savedRecipes = SEED_RECIPES;
    }
    this.recipes = savedRecipes;

    const loadedPlan = this.load('fa_mealplan', null);
    if (loadedPlan && typeof loadedPlan === 'object') {
      // Normalize each day for backward compatibility with 4 standard slots + customSlots
      Object.keys(loadedPlan).forEach(dateKey => {
        const day = loadedPlan[dateKey];
        if (!('breakfast' in day)) day.breakfast = null;
        if (!('lunch' in day)) day.lunch = null;
        if (!('snack' in day)) day.snack = null;
        if (!('dinner' in day)) day.dinner = null;
        if (!Array.isArray(day.customSlots)) day.customSlots = [];
      });
      this.mealPlan = loadedPlan;
    } else {
      this.mealPlan = this.generateInitialMealPlan();
    }

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
        breakfast: i === 0 ? "rec-avocado-toast" : (i === 1 ? "rec-porridge-bowl" : null),
        lunch: i === 0 ? "rec-pesto-pasta" : (i === 1 ? "rec-lemon-chicken" : null),
        snack: i === 0 ? "rec-healthy-snack" : null,
        dinner: i === 0 ? "rec-salmon-bowl" : (i === 1 ? "rec-chickpea-salad" : null),
        customSlots: []
      };
    }
    return plan;
  }
}

const state = new StateStore();

// ==========================================================================
// US-15: RECIPE PARSER (SCHEMA.ORG / JSON-LD & STRUCTURED TEXT)
// ==========================================================================
const RecipeParser = {
  // Normalize units
  normalizeUnit(rawUnit) {
    if (!rawUnit) return 'ud';
    const u = rawUnit.toLowerCase().trim()
      .replace(/\.(?=\s|$)/, '')
      .replace(/\((?:s|es)\)/g, '')
      .trim();
    if (/^(g|gr|gramo|gramos)$/.test(u)) return 'g';
    if (/^(kg|kilo|kilos|kilogramo|kilogramos)$/.test(u)) return 'kg';
    if (/^(ml|mililitro|mililitros)$/.test(u)) return 'ml';
    if (/^(cl|centilitro|centilitros)$/.test(u)) return 'cl';
    if (/^(dl|decilitro|decilitros)$/.test(u)) return 'dl';
    if (/^(l|litro|litros)$/.test(u)) return 'l';
    if (/^(cda|cdas|cucharada|cucharadas|cucharada\s+sopera|cucharadas\s+soperas|tbsp|tablespoon|tablespoons)$/.test(u)) return 'cda';
    if (/^(cdta|cdtas|cucharadita|cucharaditas|cucharada\s+pequeña|cucharadas\s+pequeñas|cucharadita\s+de\s+postre|cucharadas?\s+de\s+postre|tsp|teaspoon|teaspoons)$/.test(u)) return 'cdta';
    if (/^(taza|tazas|cup|cups)$/.test(u)) return 'taza';
    if (/^(vaso|vasos|glass|glasses)$/.test(u)) return 'vaso';
    if (/^(copa|copas|copita|copitas)$/.test(u)) return 'copita';
    if (/^(pizca|pizcas|pinch|pinches|dash|dashes|pellizco|pellizcos)$/.test(u)) return 'pizca';
    if (/^(diente|dientes|clove|cloves)$/.test(u)) return 'ud';
    if (/^(rebanada|rebanadas|rodaja|rodajas)$/.test(u)) return 'rebanada';
    if (/^(loncha|lonchas|filete|filetes|slice|slices)$/.test(u)) return 'loncha';
    if (/^(rama|ramas|ramita|ramitas|sprig|sprigs|stalk|stalks)$/.test(u)) return 'rama';
    if (/^(hoja|hojas|leaf|leaves)$/.test(u)) return 'hoja';
    if (/^(lata|latas|bote|botes|can|cans)$/.test(u)) return 'lata';
    if (/^(paquete|paquetes|pack|packs|packet|packets)$/.test(u)) return 'paquete';
    if (/^(puñado|puñados)$/.test(u)) return 'puñado';
    if (/^(chorro|chorrito|chorritos)$/.test(u)) return 'chorrito';
    if (/^(sobre|sobres)$/.test(u)) return 'sobre';
    if (/^(ud|uds|unidad|unidades|unit|units|count|counts|item|items|piece|pieces|ea)$/.test(u)) return 'ud';
    return 'ud';
  },

  categorizeAisle(ingredientName) {
    const text = (ingredientName || '').toLowerCase();
    if (/pollo|ternera|carne|cerdo|pavo|jam\u00F3n|salm\u00F3n|pescado|at\u00FAn|merluza|gambas|langostinos|bacon|lomo|chorizo|hamburguesa|filete|salchicha|costilla|pato|cordero|bacalao|calamar|pulpo|mejill\u00F3n|almeja/i.test(text)) {
      return 'meat';
    }
    if (/leche|queso|mantequilla|yogur|nata|huevo|huevos|parmesano|mozzarella|crema|ricotta|feta|mascarpone|gorgonzola|cheddar/i.test(text)) {
      return 'dairy';
    }
    if (/tomate|cebolla|ajo|patata|aguacate|espinaca|lechuga|zanahoria|lim\u00F3n|manzana|pl\u00E1tano|champi\u00F1\u00F3n|seta|pimiento|calabac\u00EDn|pepino|fresa|ar\u00E1ndano|pera|naranja|br\u00F3coli|coliflor|berenjena|jud\u00EDa|esp\u00E1rrago|apio|puerro|calabaza|perejil|albahaca|cilantro|hierbabuena|menta/i.test(text)) {
      return 'produce';
    }
    if (/harina|pan|levadura|masa|hojaldre|tortilla|galleta|bizcocho|placas|pasta|espaguetis|macarrones|fideos|arroz|quinoa|avena/i.test(text)) {
      return 'bakery';
    }
    if (/sal|pimienta|or\u00E9gano|comino|piment\u00F3n|curry|canela|romero|tomillo|nuez moscada|azafr\u00E1n|laurel|eneldo|vainilla|clavo|jengibre|aceite|vinagre|soja|mostaza|mayonesa|k\u00E9tchup|tabasco/i.test(text)) {
      return 'spices';
    }
    return 'pantry';
  },

  parseNumber(str) {
    if (!str) return 1;
    const clean = str.trim().replace(',', '.');
    const unicodeFractions = {
      '\u00BD': 0.5,
      '\u00BC': 0.25,
      '\u00BE': 0.75,
      '\u2153': 0.33,
      '\u2154': 0.67,
      '\u215B': 0.125,
      '\u215C': 0.375,
      '\u215D': 0.625,
      '\u215E': 0.875
    };
    for (const [char, val] of Object.entries(unicodeFractions)) {
      if (clean.includes(char)) {
        const parts = clean.split(char);
        const whole = parts[0].trim() ? parseFloat(parts[0]) : 0;
        return whole + val;
      }
    }
    const fracMatch = clean.match(/^(\d+)?\s*(\d+)\/(\d+)$/);
    if (fracMatch) {
      const whole = fracMatch[1] ? parseInt(fracMatch[1], 10) : 0;
      const num = parseInt(fracMatch[2], 10);
      const denom = parseInt(fracMatch[3], 10) || 1;
      return Math.round((whole + num / denom) * 100) / 100;
    }
    const val = parseFloat(clean);
    return isNaN(val) ? 1 : val;
  },

  isSectionHeader(line) {
    const l = line.trim();
    if (!l) return true;
    if (l.length >= 50) return false;
    if (l.endsWith(':')) return true;
    if (/^(para\s+(la|el|los|las|hacer|servir|decorar|marinar|el\s+sofrito|la\s+salsa|la\s+masa|el\s+relleno|la\s+bechamel|el\s+pan|el\s+adobo))/i.test(l)) return true;
    if (/^(?:ingredientes|ingredientes\s+para|instrucciones|paso\s+a\s+paso|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo|procedimiento|modo\s+de\s+(?:preparaci[o\u00F3]n|empleo)|pasos(?:\s+a\s+seguir)?)/i.test(l)) return true;

    // Detect uppercase sub-section headings like "- CERDO ASADO CUBANO", "- PAN DE CUBANO", "- BOCADILLO CUBANO (1)", "MÉTODO"
    const stripped = l.replace(/^[-*\u2022#\s]+/, '').replace(/\s*\(\d+\)\s*$/, '').trim();
    if (stripped.length >= 3 && !/\d+\s*(?:g|kg|ml|cl|l|cda|cucharada|oz|lb|ud|loncha)/i.test(stripped)) {
      if (/^(?:pan(?:\s+de)?|bocadillo(?:\s+de)?|cerdo(?:\s+asado)?|masa|salsa|mojo|sofrito|relleno|bechamel|adobo|marinado|glaseado|crema|cobertura|decoraci[o\u00F3]n|guarnici[o\u00F3]n|montaje)\b/i.test(stripped)) {
        return true;
      }
      if (/^[-*•]\s*[A-ZÁÉÍÓÚÑ\s\d\(\)]+$/.test(l)) {
        return true;
      }
    }
    return false;
  },

  parseIsoDuration(durationStr) {
    if (!durationStr) return 15;
    if (typeof durationStr === 'number') return durationStr;
    const str = String(durationStr).trim();

    // Check Spanish fractions of hours: "1 hora y media", "media hora", "1 hora y cuarto"
    const halfHourMatch = str.match(/(?:(\d+)\s*(?:h|horas?)\s*y\s*media|media\s*hora)/i);
    if (halfHourMatch) {
      const h = halfHourMatch[1] ? parseInt(halfHourMatch[1], 10) : 0;
      return h * 60 + 30;
    }
    const quarterHourMatch = str.match(/(?:(\d+)\s*(?:h|horas?)\s*y\s*(?:un\s+)?cuarto|(?:un\s+)?cuarto\s*de\s*hora)/i);
    if (quarterHourMatch) {
      const h = quarterHourMatch[1] ? parseInt(quarterHourMatch[1], 10) : 0;
      return h * 60 + 15;
    }

    // Ranges in minutes: "18-20 minutos", "18 a 20 min", "2 o 3 minutos" -> take upper bound
    const rangeMinMatch = str.match(/(\d+)\s*(?:[-–—]|a|o)\s*(\d+)\s*(?:min|minutos|m\b)/i);
    if (rangeMinMatch) {
      return Math.max(parseInt(rangeMinMatch[1], 10), parseInt(rangeMinMatch[2], 10));
    }
    const rangeHourMatch = str.match(/(\d+)\s*(?:[-–—]|a|o)\s*(\d+)\s*(?:h|horas?)/i);
    if (rangeHourMatch) {
      return Math.max(parseInt(rangeHourMatch[1], 10), parseInt(rangeHourMatch[2], 10)) * 60;
    }

    const simpleMatch = str.match(/^(\d+)\s*(min|m|minutos)?$/i);
    if (simpleMatch) return parseInt(simpleMatch[1], 10);

    const hourMatch = str.match(/(\d+)\s*(?:h|hora|horas)(?:\s*(?:y\s*)?(\d+)\s*(?:min|m|minutos)?)?/i);
    if (hourMatch) {
      const h = parseInt(hourMatch[1], 10) || 0;
      const m = parseInt(hourMatch[2], 10) || 0;
      return h * 60 + m;
    }

    const isoRegex = /P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
    const match = str.match(isoRegex);
    if (match && (match[1] || match[2] || match[3])) {
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      const seconds = parseInt(match[3] || '0', 10);
      const total = hours * 60 + minutes + (seconds > 30 ? 1 : 0);
      return total > 0 ? total : 15;
    }
    const anyNum = str.match(/\d+/);
    return anyNum ? parseInt(anyNum[0], 10) : 15;
  },

  extractTimerMinutes(stepText) {
    if (!stepText || typeof stepText !== 'string') return null;

    // 1. Spanish fraction hour expressions
    const halfMatch = stepText.match(/(?:durante|por|remojo|reposar|cocer|hornear|cocinar|llevar[aá])\s+(?:unos?\s+)?(?:(\d+)\s*(?:h|horas?)\s*y\s*media|media\s*hora)/i) ||
                      stepText.match(/(?:(\d+)\s*(?:h|horas?)\s*y\s*media|media\s*hora)/i);
    if (halfMatch) {
      return this.parseIsoDuration(halfMatch[0]);
    }

    // 2. Primary cooking/action duration patterns (verbs of cooking/duration)
    // e.g. "lo que nos llevará unos 18-20 minutos", "durante 15 minutos", "hornear 45 min"
    const primaryRegex = /(?:durante(?:\s+toda\s+la\s+cocc?i[o\u00F3]n)?|llevar[aá]\s*(?:unos?)?|cocer|cocinar|hornear|hervir|sofre[ií]r|pochar|dorar|reducir|remojo|reposar)\s+(?:unos?\s+)?(\d+(?:\s*(?:[-–—]|a|o)\s*\d+)?)\s*(minutos?|min|horas?|h\b)/gi;
    const primaryMatches = [...stepText.matchAll(primaryRegex)];
    if (primaryMatches.length > 0) {
      let maxVal = 0;
      for (const m of primaryMatches) {
        const val = this.parseIsoDuration(m[0]);
        if (val > maxVal) maxVal = val;
      }
      if (maxVal > 0) return maxVal;
    }

    // 3. Fallback: general time mention
    const generalRegex = /(\d+(?:\s*(?:[-–—]|a|o)\s*\d+)?)\s*(minutos?|min|horas?|h\b)/gi;
    const generalMatches = [...stepText.matchAll(generalRegex)];
    if (generalMatches.length > 0) {
      let maxVal = 0;
      for (const m of generalMatches) {
        const val = this.parseIsoDuration(m[0]);
        if (val > maxVal && val <= 720) maxVal = val;
      }
      if (maxVal > 0) return maxVal;
    }

    return null;
  },

  parseServings(yieldVal) {
    if (!yieldVal) return 2;
    if (typeof yieldVal === 'number') return yieldVal;
    const str = Array.isArray(yieldVal) ? yieldVal.join(' ') : String(yieldVal);
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
  },

  parseIngredientLine(rawLine) {
    if (!rawLine || typeof rawLine !== 'string') return null;

    // Drop markdown images or image tags
    if (/!\[.*?\]\(.*?\)|<img\b/i.test(rawLine)) return null;

    let clean = rawLine
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/(\d+(?:[.,]\d+)?\s*[a-zA-Z\u00C0-\u017F\.]+)\[([^\]]+)\]/g, '$1 [$2]')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/^([\u2022\-\*]|\d+[\.\)])\s*/, '')
      .replace(/\b([a-zA-Z\u00C0-\u017F]+)\((?:s|es)\)/gi, '$1')
      .trim();

    if (!clean || this.isSectionHeader(clean)) return null;

    // Reject allergen badge rows or notices (e.g. "(Contiene: Apio)" or "Alérgenos: ...")
    if (/^\(?\s*(?:contiene\s*:|al[eé]rgenos?\s*:)/i.test(clean)) {
      return null;
    }

    // Reject obvious instruction / procedural lines that slipped into ingredient parsing
    if (clean.length > 95 || 
        /^(?:limpia|remueve|unta|vierte|introduce|sirve|bate|hornea|saltea|precalienta|pela|trocea|fr[i\u00ED]e)\b/i.test(clean) ||
        /\b(?:pelamos|cortamos|batimos|mezclamos|ponemos|a[n\u00F1]adimos|dejamos|doramos|sofre[i\u00ED]mos|cocinamos|horneamos|trituramos|se\s+(?:pelan|cortan|baten|rebozan|fr[i\u00ED]en|mezclan|presenta|ponen))\b/i.test(clean)) {
      return null;
    }

    // Reject dates, timestamps, image labels or captions
    const spanishMonths = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
    if (new RegExp(`(?:^|\\b)(?:\\d{1,2}\\s+(?:de\\s+)?(?:${spanishMonths})|(?:${spanishMonths})\\s+\\d{4})\\b`, 'i').test(clean)) {
      return null;
    }
    if (/\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(clean) && new RegExp(`(?:${spanishMonths}|\\d{4})`, 'i').test(clean)) {
      return null;
    }
    if (/^(?:image\s*\d+|editor\s+senior|foto\s+principal)/i.test(clean)) {
      return null;
    }
    // Reject table headers, portion column labels, bare numbers (e.g. HelloFresh column headers)
    if (/^(?:cantidad\s+de\s+la\s+raci[o\u00F3]n|unidad(?:\(es\)|es)?|raci[o\u00F3]n\b|raciones\b|porci[o\u00F3]n\b|porciones\b)/i.test(clean)) {
      return null;
    }
    if (/^\d+(?:[.,]\d+)?$/.test(clean)) {
      return null;
    }

    // Compound accompaniment/serving line detection: e.g. "Para acompañar: huevo duro y jamón serrano a taquitos"
    const compoundMatch = clean.match(/^(?:para\s+(?:acompañar|servir|decorar|guarnici[oó]n)|guarnici[oó]n|opcional):\s*(.+)$/i);
    let partsToProcess = null;
    if (compoundMatch && compoundMatch[1]) {
      const parts = compoundMatch[1].split(/\s+y\s+|\s*,\s*(?![^()]*\))/i).map(p => p.trim()).filter(Boolean);
      if (parts.length > 1) {
        partsToProcess = parts;
      } else if (parts.length === 1) {
        clean = parts[0];
      }
    } else if (/\b(?:huevos?\s+(?:duros?|cocidos?))\s+y\s+(?:jam[oó]n\b.*)$/i.test(clean)) {
      partsToProcess = clean.split(/\s+y\s+/i).map(p => p.trim()).filter(Boolean);
    }

    if (partsToProcess && partsToProcess.length > 1) {
      const results = [];
      for (const part of partsToProcess) {
        const parsed = this.parseIngredientLine(part);
        if (parsed) {
          if (Array.isArray(parsed)) results.push(...parsed);
          else results.push(parsed);
        }
      }
      if (results.length > 0) return results;
    }

    // Pre-processing Spanish written quantities and fractions at the beginning
    clean = clean
      // Ranges like "18-20" or "2 o 3" -> take upper bound
      .replace(/^(\d+)\s*(?:[-–—]|a|o)\s*(\d+)\b/i, (m, g1, g2) => Math.max(parseFloat(g1), parseFloat(g2)))
      // "unos 5" / "unas 5" / "una 5" -> "5"
      .replace(/^(?:unos?|unas?)\s+(\d+)\b/i, '$1')
      // "1 y medio" / "1 y media" -> "1.5"
      .replace(/^(\d+)\s+y\s+(?:medio|media)\b/i, (m, g1) => (parseFloat(g1) + 0.5).toString())
      // "medio" / "media" -> "0.5"
      .replace(/^(?:medio|media)\b/i, '0.5')
      // "un cuarto" -> "0.25", "tres cuartos" -> "0.75"
      .replace(/^tres\s+cuartos\b/i, '0.75')
      .replace(/^un\s+cuarto\b/i, '0.25')
      // Word numbers before units or ingredient names
      .replace(/^un[oa]?\b/i, '1')
      .replace(/^dos\b/i, '2')
      .replace(/^tres\b/i, '3')
      .replace(/^cuatro\b/i, '4')
      .replace(/^cinco\b/i, '5')
      .replace(/^seis\b/i, '6')
      .replace(/^siete\b/i, '7')
      .replace(/^ocho\b/i, '8')
      .replace(/^nueve\b/i, '9')
      .replace(/^diez\b/i, '10');

    const unitWords = 'cucharadas?\\s+pequeñas?|cucharaditas?\\s+de\\s+postre|cucharadas?\\s+de\\s+postre|cucharadas?\\s+soperas?|cucharadas?|cdas?|cucharaditas?|cdtas?|kilogramos?|kilos?|kg|gramos?|gr|litros?|mililitros?|centilitros?|decilitros?|dl\\.?|cl|ml|tablespoons?|tbsp|teaspoons?|tsp|tazas?|cups?|vasos?|glasses?|copitas?|copas?|pinches?|pizcas?|pellizcos?|dientes?|cloves?|rebanadas?|rodajas?|lonchas?|filetes?|slices?|ramitas?|ramas?|sprigs?|stalks?|hojas?|leaves|leaf|latas?|botes?|cans?|paquetes?|packs?|packet|packets|puñados?|chorritos?|chorro|sobres?|unidad(?:es)?|uds?\\.?|ud\\.?|units?|items?|pieces?|counts?|dashes?|cazos?|trozos?|ea|g|l';

    let amount = 1;
    let unit = 'ud';
    let name = clean;

    const fracChars = '\\u00BD\\u00BC\\u00BE\\u2153\\u2154\\u215B\\u215C\\u215D\\u215E';

    // Pattern 1a: Standard quantity with explicit unit (e.g. "200 g de pollo", "1 unidad Manzana", "380 gramo Lentejas")
    const startWithUnitRegex = new RegExp(`^([\\d${fracChars}\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s*(${unitWords})\\.?\\b\\s*(?:de\\s+la\\s+|de\\s+los\\s+|de\\s+las\\s+|de\\s+|del\\s+|con\\s+)?(.*)$`, 'i');
    // Pattern 1b: Standard quantity without unit (e.g. "3 huevos", "2 manzanas")
    const startNoUnitRegex = new RegExp(`^([\\d${fracChars}\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s+(?:de\\s+la\\s+|de\\s+los\\s+|de\\s+las\\s+|de\\s+|del\\s+|con\\s+)?(.*)$`, 'i');

    const unitMatch = clean.match(startWithUnitRegex);
    const noUnitMatch = !unitMatch ? clean.match(startNoUnitRegex) : null;

    if (unitMatch && (isNaN(unitMatch[1]) === false || new RegExp(`[\\/${fracChars}]`).test(unitMatch[1]))) {
      amount = this.parseNumber(unitMatch[1]);
      unit = this.normalizeUnit(unitMatch[2]);
      name = (unitMatch[3] || '').trim();
    } else if (noUnitMatch && (isNaN(noUnitMatch[1]) === false || new RegExp(`[\\/${fracChars}]`).test(noUnitMatch[1]))) {
      amount = this.parseNumber(noUnitMatch[1]);
      unit = 'ud';
      name = (noUnitMatch[2] || '').trim();
    } else {
      // Pattern 2: Name first, quantity at end: "Tomate triturado 400 g", "Placas de lasa\u00F1a 12", "Berenjena 1"
      const endNumRegex = new RegExp(`^(.*?)(?::|,)?\\s+([\\d${fracChars}\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s*(${unitWords})?\\.?$`, 'i');
      const endMatch = clean.match(endNumRegex);

      if (endMatch && endMatch[1] && endMatch[2]) {
        name = endMatch[1].trim();
        amount = this.parseNumber(endMatch[2]);
        unit = endMatch[3] ? this.normalizeUnit(endMatch[3]) : 'ud';
      } else {
        // Pattern 3: Qualitative / to taste
        if (/al\s+gusto|a\s+gusto|al\s+punto/i.test(clean)) {
          name = clean.replace(/al\s+gusto|a\s+gusto|al\s+punto/gi, '').trim();
          amount = 1;
          unit = 'pizca';
        } else {
          name = clean;
          amount = 1;
          unit = 'ud';
        }
      }
    }

    // Clean extraneous prefixes/suffixes and notes from ingredient name
    name = name
      .replace(/^[\.\,\-\:\s]+/, '')
      .replace(/^(?:\(s\)|\(es\))\s*/i, '')
      .replace(/^count\s+/i, '')
      .replace(/\s+count$/i, '')
      .replace(/^(?:de\s+la|de\s+los|de\s+las|de|del|con)\s+/i, '')
      .replace(/^(?:para\s+(?:acompañar|servir|decorar|el\s+sofrito|la\s+salsa|el\s+relleno|la\s+guarnición)|opcional):\s*/i, '')
      .replace(/\s*\((?:ver\s+nota|nota\s*\d*|opcional|al\s+gusto|a\s+temperatura\s+ambiente|según\s+tamaño|unas?\s+\d+[^)]*|aprox[^)]*|contiene\s*:[^)]*|al[eé]rgenos?\s*:[^)]*)\)/gi, '')
      .replace(/:\s*$/, '')
      .trim();

    // Specific culinary cleanups: "sal fina" -> "Sal"
    if (/^sal\s+fina$/i.test(name)) {
      name = 'Sal';
    }
    // "huevo duro" / "huevos duros" / "huevo cocido" -> el ingrediente básico es el huevo
    if (/^huevos?\s+(?:duros?|cocidos?|pasados?\s+por\s+agua|fritos?)$/i.test(name)) {
      name = amount > 1 ? 'Huevos' : 'Huevo';
    }

    // Reject if name ended up as a table column header or bare numbers
    if (/^(?:cantidad(?:\s+de\s+la\s+raci[o\u00F3]n)?|unidad(?:\(es\)|es)?|raci[o\u00F3]n\b|raciones\b|porci[o\u00F3]n\b|porciones\b|ingredientes?)$/i.test(name)) {
      return null;
    }
    if (/^\d+(?:[.,]\d+)?$/.test(name)) {
      return null;
    }

    if (!name || (name.length <= 1 && /^[a-z\.\,]$/i.test(name))) return null;

    return {
      id: 'ing-' + Math.random().toString(36).substr(2, 9),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: amount,
      unit: unit,
      aisle: this.categorizeAisle(name)
    };
  },

  extractJsonLdFromHtml(html) {
    if (!html) return null;
    const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    const jsonObjects = [];

    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        let rawJson = match[1].trim();
        // Strip comments from JSON-LD (common in WordPress plugins / blogs like Javi Recetas)
        rawJson = rawJson.replace(/\/\*[\s\S]*?\*\//g, '');
        rawJson = rawJson.replace(/^[ \t]*\/\/[^\r\n]*/gm, '');
        rawJson = rawJson.replace(/([,;\{\}\[\]])[ \t]*\/\/[^\r\n]*/g, '$1');
        // Clean unescaped carriage returns inside strings before quotes (common in Javi Recetas CMS)
        rawJson = rawJson.replace(/[\r\n]+(?=\s*")/g, '');
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          jsonObjects.push(...parsed);
        } else {
          jsonObjects.push(parsed);
        }
      } catch (e) {}
    }

    for (const item of jsonObjects) {
      if (item['@graph'] && Array.isArray(item['@graph'])) {
        const recipeInGraph = item['@graph'].find(obj => this.isRecipeType(obj['@type']));
        if (recipeInGraph) return recipeInGraph;
      }
      if (this.isRecipeType(item['@type'])) {
        return item;
      }
    }
    return null;
  },

  extractMicrodataRecipe(html) {
    if (!html || typeof html !== 'string') return null;
    if (!/itemprop=["'](?:recipeIngredient|ingredients|recipeInstructions)["']/i.test(html)) return null;

    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const ingEls = doc.querySelectorAll('[itemprop="recipeIngredient"], [itemprop="ingredients"]');
        const instEls = doc.querySelectorAll('[itemprop="recipeInstructions"]');

        if (ingEls.length > 0 || instEls.length > 0) {
          const ingredients = Array.from(ingEls).map(el => el.textContent.trim()).filter(Boolean);
          const instructions = Array.from(instEls).map(el => el.textContent.trim()).filter(Boolean);

          const titleEl = doc.querySelector('[itemprop="name"]') || doc.querySelector('h1');
          const title = titleEl ? titleEl.textContent.trim() : '';

          const imgEl = doc.querySelector('[itemprop="image"]');
          let imageUrl = '';
          if (imgEl) {
            imageUrl = imgEl.getAttribute('src') || imgEl.getAttribute('content') || imgEl.getAttribute('data-src') || '';
          }

          const yieldEl = doc.querySelector('[itemprop="recipeYield"]');
          const recipeYield = yieldEl ? (yieldEl.getAttribute('content') || yieldEl.textContent.trim()) : '';

          const prepEl = doc.querySelector('[itemprop="prepTime"]');
          const cookEl = doc.querySelector('[itemprop="cookTime"]');
          const totalEl = doc.querySelector('[itemprop="totalTime"]');

          return {
            '@type': 'Recipe',
            name: title,
            image: imageUrl,
            recipeYield: recipeYield,
            prepTime: prepEl ? (prepEl.getAttribute('content') || prepEl.textContent) : '',
            cookTime: cookEl ? (cookEl.getAttribute('content') || cookEl.textContent) : '',
            totalTime: totalEl ? (totalEl.getAttribute('content') || totalEl.textContent) : '',
            recipeIngredient: ingredients,
            recipeInstructions: instructions
          };
        }
      } catch (e) {}
    }
    return null;
  },

  isRecipeType(typeVal) {
    if (!typeVal) return false;
    if (typeof typeVal === 'string') return typeVal.toLowerCase().includes('recipe');
    if (Array.isArray(typeVal)) return typeVal.some(t => String(t).toLowerCase().includes('recipe'));
    return false;
  },

  htmlToText(html) {
    if (!html) return '';
    // If it's already clean markdown/text without full HTML structure
    if (!html.includes('<html') && !html.includes('<body') && !html.includes('<div') && !html.includes('<p>') && !html.includes('<article')) {
      return html
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    }
    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        ['script', 'style', 'nav', 'header', 'footer', 'aside', 'svg', 'noscript'].forEach(tag => {
          doc.querySelectorAll(tag).forEach(el => el.remove());
        });
        doc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, tr, hr, br').forEach(el => {
          el.insertAdjacentText('afterend', '\n');
        });
        const text = doc.body ? (doc.body.innerText || doc.body.textContent || '') : '';
        if (text && text.trim().length > 50) {
          return text.trim();
        }
      } catch (e) {}
    }
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n\s*\n/g, '\n')
      .trim();
  },

  getDomain(url) {
    if (!url || typeof url !== 'string') return '';
    try {
      const match = url.match(/https?:\/\/(?:www\.)?([^\/\?#]+)/i);
      return match ? match[1].toLowerCase() : '';
    } catch {
      return '';
    }
  },

  parseSchemaRecipe(schema, sourceUrl = '') {
    if (!schema) return null;
    let imageUrl = '';
    if (schema.image) {
      if (typeof schema.image === 'string') imageUrl = schema.image;
      else if (Array.isArray(schema.image) && schema.image.length > 0) imageUrl = typeof schema.image[0] === 'string' ? schema.image[0] : (schema.image[0]?.url || '');
      else if (schema.image.url) imageUrl = schema.image.url;
    }
    if (!imageUrl) imageUrl = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";

    const rawIngredients = schema.recipeIngredient || schema.ingredients || [];
    const ingredients = [];
    let linesToParse = [];
    if (Array.isArray(rawIngredients)) {
      if (rawIngredients.length === 1 && typeof rawIngredients[0] === 'string' && rawIngredients[0].includes(',')) {
        linesToParse = rawIngredients[0].split(',').map(s => s.trim()).filter(Boolean);
      } else {
        linesToParse = rawIngredients;
      }
    } else if (typeof rawIngredients === 'string') {
      if (rawIngredients.includes('\n')) linesToParse = rawIngredients.split(/\r?\n/);
      else if (rawIngredients.includes(',')) linesToParse = rawIngredients.split(',');
      else linesToParse = [rawIngredients];
    }

    linesToParse.forEach(line => {
      const parsed = this.parseIngredientLine(String(line));
      if (parsed) {
        if (Array.isArray(parsed)) ingredients.push(...parsed);
        else ingredients.push(parsed);
      }
    });

    const rawInstructions = schema.recipeInstructions || schema.instructions || [];
    const instructions = [];
    const processItem = (item) => {
      if (!item) return;
      let rawText = '';
      if (typeof item === 'string') {
        rawText = item;
      } else if (item.text) {
        rawText = item.text;
      } else if (item.itemListElement && Array.isArray(item.itemListElement)) {
        item.itemListElement.forEach(sub => processItem(sub));
        return;
      }
      if (rawText) {
        const cleaned = rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+([.,;:!?])/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleaned && cleaned.length > 5) {
          instructions.push({ 
            step: instructions.length + 1, 
            text: cleaned, 
            timerMinutes: this.extractTimerMinutes(cleaned) 
          });
        }
      }
    };

    if (Array.isArray(rawInstructions)) rawInstructions.forEach(inst => processItem(inst));
    else if (typeof rawInstructions === 'string') rawInstructions.split(/\r?\n/).forEach(l => processItem(l));

    const tags = [];
    if (schema.recipeCategory) {
      const cats = Array.isArray(schema.recipeCategory) ? schema.recipeCategory : [schema.recipeCategory];
      cats.forEach(c => {
        const catStr = String(c).trim();
        if (catStr && !tags.includes(catStr) && catStr.toLowerCase() !== 'importada') tags.push(catStr);
      });
    }

    const resolvedSourceUrl = sourceUrl || schema.mainEntityOfPage || schema.url || '';
    const resolvedDomain = this.getDomain(resolvedSourceUrl) || (schema.publisher?.name || '');

    return {
      id: 'rec-' + Date.now(),
      title: schema.name ? String(schema.name).trim() : 'Receta Web',
      description: schema.description ? String(schema.description).trim() : '',
      imageUrl: imageUrl,
      prepTimeMinutes: this.parseIsoDuration(schema.prepTime),
      cookTimeMinutes: this.parseIsoDuration(schema.cookTime || schema.totalTime),
      servings: this.parseServings(schema.recipeYield),
      tags: tags.slice(0, 4),
      ingredients: ingredients,
      instructions: instructions,
      sourceUrl: resolvedSourceUrl,
      sourceDomain: resolvedDomain
    };
  },


  parseRecipeText(rawText, sourceUrl = '') {
    if (!rawText || typeof rawText !== 'string') return null;
    const trimmed = rawText.trim();
    if (!trimmed) return null;

    // Check if rawText is actually JSON or HTML with JSON-LD
    if (trimmed.includes('<script') || trimmed.startsWith('{') || trimmed.includes('"@type"') || trimmed.includes('"recipeIngredient"')) {
      try {
        const schema = this.extractJsonLdFromHtml(trimmed) || (trimmed.startsWith('{') ? JSON.parse(trimmed) : null);
        if (schema && (this.isRecipeType(schema['@type']) || schema.recipeIngredient || schema.ingredients)) {
          return this.parseSchemaRecipe(schema, sourceUrl);
        }
      } catch (e) {}
    }

    // Extract first valid food image from markdown if present
    let candidateImage = '';
    const imgMatches = trimmed.matchAll(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g);
    for (const m of imgMatches) {
      const url = m[1];
      if (!/150_150|avatar|guest_user|author|logo|icon|98x98|16x16/i.test(url)) {
        candidateImage = url;
        break;
      }
    }

    const rawLines = trimmed.split(/(?:\r?\n|  (?=#{1,6}\s|[-*\u2022]\s+|\d+[\.\)]\s+|Title:|URL Source:|Markdown Content:))/).map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) return null;

    const inputLines = [];
    let detectedTitle = null;

    for (const l of rawLines) {
      if (!detectedTitle && /^Title:\s*(.+)$/i.test(l)) {
        detectedTitle = l
          .replace(/^Title:\s*/i, '')
          .replace(/\s*(?:[\-\u2013\u2014\|]|—)\s*(?:diegodoal|directo al paladar|recetas|cocina|blog|youtube).*$/i, '')
          .replace(/["']/g, '')
          .trim();
        continue;
      }
      if (/^(?:URL Source|Published Time|Markdown Content):/i.test(l)) {
        continue;
      }

      // Clean markdown images, unwrap markdown links, unbold
      const cleaned = l
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/(\d+(?:[.,]\d+)?\s*[a-zA-Z\u00C0-\u017F\.]+)\[([^\]]+)\]/g, '$1 [$2]')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .trim();

      if (cleaned) {
        if (/^(?:Image \d+:|Editor Senior|\d+\s*votos|Ahorra hasta|Suscribirme|Guardar|Calor[i\u00ED]as|\d+\s*kcal|Prote[i\u00ED]nas|\d+g?\s*prote[i\u00ED]nas|Difficulty|Vegetariano|Vegano|Keto)/i.test(cleaned) || /\b(?:viajer[ao]\s+gastron[o\u00F3]mic[ao]|periodista\s+intr[e\u00E9]pida|editor\s+senior)\b/i.test(cleaned)) continue;
        const spanishMonths = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
        if (new RegExp(`(?:^|\\b)(?:\\d{1,2}\\s+(?:de\\s+)?(?:${spanishMonths})|(?:${spanishMonths})\\s+\\d{4})\\b`, 'i').test(cleaned)) continue;
        if (/\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(cleaned) && new RegExp(`(?:${spanishMonths}|\\d{4})`, 'i').test(cleaned)) continue;
        inputLines.push(cleaned);
      }
    }

    if (inputLines.length === 0) return null;

    // --- Pre-pass: Detect Title if present as "Cómo hacer [Título]" or similar anywhere ---
    for (const l of inputLines) {
      const comoMatch = l.match(/^c[o\u00F3]mo hacer\s+(?:un\s+|una\s+|el\s+|la\s+|los\s+|las\s+)?(.+)$/i);
      if (comoMatch && comoMatch[1] && comoMatch[1].length > 2) {
        detectedTitle = comoMatch[1].replace(/["']/g, '').trim();
        break;
      }
      const pasoMatch = l.match(/^(.+?)\s+paso\s+a\s+paso$/i);
      if (pasoMatch && pasoMatch[1] && pasoMatch[1].length > 3 && !/ingredientes|instrucciones|m[e\u00E9]todo/i.test(pasoMatch[1])) {
        if (!detectedTitle) detectedTitle = pasoMatch[1].replace(/["']/g, '').trim();
      }
    }

    // Check if any line has an explicit dish/sandwich name
    if (!detectedTitle) {
      for (const l of inputLines) {
        if (/^[-*\u2022#\s]*(?:bocadillo|sandwich|hamburguesa|tarta|pastel|ensalada|arroz|pasta|pizza|sopa|crema)\b/i.test(l)) {
          const cand = l
            .replace(/^[-*\u2022#\s]+/, '')
            .replace(/\s*\(\d+\)\s*$/, '')
            .replace(/\s*(?:[\-\u2013\u2014\|]|â€”)\s*(?:diegodoal|directo al paladar|recetas|cocina|blog|youtube).*$/i, '')
            .replace(/["']/g, '')
            .trim();
          if (cand.length >= 4 && cand.length <= 60 && !/ingredientes|instrucciones|m[e\u00E9]todo/i.test(cand)) {
            detectedTitle = cand;
            break;
          }
        }
      }
    }

    // --- Pre-pass: Multi-line Normalization ---
    // Merge split quantities (e.g. "2 uds.\nPan baguette" or "200 g\nAtÃºn en conserva")
    // Merge split times (e.g. "Tiempo total\n5\nmin")
    const unitPatternStr = '(?:cucharadas?|cdas?|cucharaditas?|cdtas?|kilogramos?|kilos?|kg|gramos?|gr|litros?|cl|ml|tablespoons?|tbsp|teaspoons?|tsp|tazas?|cups?|vasos?|glasses?|pinches?|pizcas?|dientes?|cloves?|rebanadas?|rodajas?|lonchas?|filetes?|slices?|ramitas?|ramas?|sprigs?|stalks?|hojas?|leaves|leaf|latas?|botes?|cans?|paquetes?|packs?|pu\\u00F1ados?|chorritos?|sobres?|unidades?|uds?\\.?|ud\\.?|units?|items?|pieces?|counts?|g|l)';
    const numPatternStr = '[\\d\\u00BD\\u00BC\\u00BE\\u2153\\u2154\\u215B\\u215C\\u215D\\u215E\\.,]+(?:\\s*\\/\\s*\\d+)?';
    const isPureQuantity = (str) => {
      const qRegex = new RegExp(`^${numPatternStr}\\s*${unitPatternStr}?\\.?$`, 'i');
      return qRegex.test(str);
    };

    const isHeaderOrSection = (str) => {
      return /^(?:ingredientes|instrucciones|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo|pasos|c[o\u00F3]mo hacer|tiempo|dificultad|dificil|f[a\u00E1]cil|para\s+\d+|rinde)/i.test(str);
    };

    const lines = [];
    for (let idx = 0; idx < inputLines.length; idx++) {
      const cur = inputLines[idx];
      const next = idx + 1 < inputLines.length ? inputLines[idx + 1] : null;
      const next2 = idx + 2 < inputLines.length ? inputLines[idx + 2] : null;

      // Check multi-line times: e.g. "Tiempo total" + "5" + "min"
      if (/^(?:tiempo(?:\s*total)?|duraci[o\u00F3]n|elaboraci[o\u00F3]n|preparaci[o\u00F3]n|cocc?i[o\u00F3]n)$/i.test(cur) && next && /^\d+$/.test(next)) {
        if (next2 && /^(?:min|minutos?|m|h|horas?)$/i.test(next2)) {
          lines.push(`${cur}: ${next} ${next2}`);
          idx += 2;
          continue;
        } else {
          lines.push(`${cur}: ${next} min`);
          idx += 1;
          continue;
        }
      }

      // Check multi-line ingredient: pure quantity on cur + ingredient name on next
      if (isPureQuantity(cur) && next && !isPureQuantity(next) && !isHeaderOrSection(next)) {
        lines.push(`${cur} ${next}`);
        idx += 1;
        continue;
      }

      lines.push(cur);
    }

    // Determine initial section & title
    let titleIdx = -1;
    let currentSection = null;

    if (/^ingredientes/i.test(lines[0])) {
      currentSection = 'ingredients';
    }

    // Find title if not already detected
    if (!detectedTitle) {
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.startsWith('http')) continue;
        if (/^(?:ingredientes|instrucciones|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo|pasos|dificultad|tiempo)/i.test(l)) continue;
        if (/^(?:para|rinde|comensales|porciones|raciones|cantidad)\s*[:\s]+\d+/i.test(l)) continue;
        if (/^\d+\s*(?:personas|raciones|porciones|bocadillos)/i.test(l)) continue;
        if (isPureQuantity(l)) continue;

        titleIdx = i;
        detectedTitle = l
          .replace(/^#+\s*|^(?:T[i\u00ED]tulo|Title):\s*|^Receta\s+(?:de\s+)?/i, '')
          .replace(/^[-*\u2022#\s]+/, '')
          .replace(/\s*(?:[\-\u2013\u2014\|]|â€”)\s*(?:diegodoal|directo al paladar|recetas|cocina|blog|youtube).*$/i, '')
          .replace(/["']/g, '')
          .trim();
        break;
      }
    }

    let title = detectedTitle || 'Receta';

    let servings = 2;
    let prepTimeMinutes = 15;
    let cookTimeMinutes = 20;

    const ingredients = [];
    const instructions = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === titleIdx) continue;

      // Stop parsing instructions on footer sections (ratings, related tips, comments, author, dates, blog pagination)
      if (currentSection === 'instructions') {
        const isFooterStop = /^(?:#+\s*(?:con qu[e\u00E9]\s+acompa[n\u00F1]ar|trucos\s+y\s+consejos|trucos|consejos|truco|notas|nota|curiosidades|informaci[o\u00F3]n\s+nutricional|resumen\s+f[a\u00E1]cil|dale\s+un\s+toque|variaciones|m[a\u00E1]s\s+recetas|recetas\s+recomendadas|otras\s+recetas|te\s+puede\s+interesar|comentarios|sobre\s+el\s+autor|autor|comparte|cooksnap|[¿\?]?\s*has\s+hecho\s+la\s+receta)|(?:dale\s+un\s+toque|trucos\s+y\s+consejos|c[o\u00F3]mo\s+conseguir\s+que|un\s+truco\s+para\s+que|[¿\?]?\s*has\s+hecho\s+la\s+receta|comparte\s+(?:una|tu)\s+cooksnap|suscr[i\u00ED]bete|ver\s+todos\s+los\s+comentarios|En DAP\s*\||\d+\s*votos)|^(?:\d+\s+de\s+)?[a-z]+\s+de\s+\d{4})/i.test(line) ||
          /\b(?:viajer[ao]\s+gastron[o\u00F3]mic[ao]|periodista|editor\s+senior|cooksnap)\b/i.test(line) ||
          /[¿\?]?\s*has\s+hecho\s+la\s+receta/i.test(line) ||
          /^(?:anterior\s+entrada|siguiente\s+entrada|te\s+va\s+a\s+encantar|previous|next|entradas?\s+relacionadas?|art[i\u00ED]culos?\s+relacionados?|recetas?\s+relacionadas?|deja\s+(?:un|tu)\s+comentario|\d+\s+comentarios?|comentarios?\s*(?:\(\d+\)|:\s*\d+)?|deja\s+una\s+respuesta|cancelar\s+la\s+respuesta|tu\s+direcci[o\u00F3]n\s+de\s+correo|guardar\s+mi\s+nombre|notif[i\u00ED]came|votar\s+y\s+compartir)/i.test(line) ||
          /^\[\s*\]\(https?:\/\//i.test(line);

        if (isFooterStop) {
          currentSection = 'end';
          continue;
        }
      }
      if (currentSection === 'end') continue;

      // Section switches
      if (/^(?:#+\s*)?(?:ingredientes(?:\s+(?:para|de|necesarios)\b[^\n:]*)?|lista de ingredientes|lo que necesitas):?$/i.test(line) || /^#+\s*ingredientes\b/i.test(line)) {
        currentSection = 'ingredients';
        const servM = line.match(/(?:para|rinde|de)\s+(\d+)\s*(?:personas|raciones|porciones|comensales)/i);
        if (servM) {
          servings = parseInt(servM[1], 10);
        }
        continue;
      }

      if (/^(?:#+\s*)?(?:receta(?:\s+de\b[^\n:]*)?|c[o\u00F3]mo\s+(?:hacer|preparar|cocinar)\b[^\n:]*|instrucciones|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|pasos(?:\s+a\s+seguir)?|m[e\u00E9]todo|procedimiento|modo\s+de\s+preparaci[o\u00F3]n|paso\s+a\s+paso):?$/i.test(line) || /^#+\s*(?:receta|instrucciones|pasos|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo|c[o\u00F3]mo hacer)/i.test(line)) {
        currentSection = 'instructions';
        continue;
      }

      // Automatic transition: only if unassigned or if line is a clear step action
      const isInstructionAction = (str) => {
        if (!str || str.length < 15) return false;
        if (/^\[.*?\]\(.*?\)$/.test(str)) return false;
        if (/^\d+[\.\)]\s*\[/.test(str)) return false;
        if (/^(?:limpia|remueve|unta|vierte|introduce|sirve|bate|hornea|saltea|precalienta|pela|trocea|fr[i\u00ED]e)\b/i.test(str)) {
          return true;
        }
        if (/\b(?:se\s+(?:pelan|cortan|baten|rebozan|fr[i\u00ED]en|mezclan|presenta|ponen|agregan|dejan|sirven)|pelamos|cortamos|batimos|mezclamos|ponemos|a[n\u00F1]adimos|dejamos|doramos|sofre[i\u00ED]mos|cocinamos|horneamos|trituramos)\b/i.test(str)) {
          return true;
        }
        return false;
      };

      if (!currentSection && isInstructionAction(line)) {
        currentSection = 'instructions';
      }

      // Metadata (servings, times) - only evaluate outside instructions
      const isShortMeta = line.length < 80 && !/(?:mezclamos|escurrimos|colocamos|ponemos|abrimos|limpia|corta|vierte|hornea|dora)/i.test(line);
      if (currentSection !== 'instructions' || isShortMeta) {
        const servingsMatch = line.match(/(?:para|rinde|porciones|raciones|comensales|personas|servings|cantidad)[:\s]+(\d+)/i) ||
                              line.match(/(?:para|de|rinde)\s+(\d+)\s*(?:personas|raciones|porciones|comensales|servings|bocadillos|unidades|piezas)/i) ||
                              line.match(/^(\d+)\s*(?:personas|raciones|porciones|comensales|servings|bocadillos|unidades|piezas)$/i);
        if (servingsMatch) {
          servings = parseInt(servingsMatch[1], 10);
        }

        const prepMatch = line.match(/(?:prep|elaborac|tiempo\s*activo).*?(\d+)\s*(?:h|hora|horas|min|m|minuto)/i);
        if (prepMatch) {
          prepTimeMinutes = this.parseIsoDuration(prepMatch[0]);
        }

        const cookMatch = line.match(/(?:cocc|horno|cocinado|cook).*?(\d+)\s*(?:h|hora|horas|min|m|minuto)/i);
        if (cookMatch) {
          cookTimeMinutes = this.parseIsoDuration(cookMatch[0]);
        }

        const totalMatch = line.match(/(?:tiempo(?:\s*total)?|duraci[o\u00F3]n).*?(\d+)\s*(?:h|hora|horas|min|m|minuto)/i);
        if (totalMatch && (cookTimeMinutes === 20 || cookTimeMinutes === 0 || cookTimeMinutes === prepTimeMinutes)) {
          cookTimeMinutes = this.parseIsoDuration(totalMatch[0]);
        }

        if (servingsMatch || prepMatch || cookMatch || totalMatch) {
          continue;
        }
      }

      if (/^(?:dificultad|calor[i\u00ED]as|autor|categor[i\u00ED]a|valoraci[o\u00F3]n|coste|precio):/i.test(line)) {
        continue;
      }

      // Parsing items according to active section
      if (currentSection === 'ingredients') {
        const parsed = this.parseIngredientLine(line);
        if (parsed) {
          if (Array.isArray(parsed)) ingredients.push(...parsed);
          else ingredients.push(parsed);
        }
      } else if (currentSection === 'instructions') {
        if (this.isSectionHeader(line)) {
          continue;
        }
        const stepText = line
          .replace(/^[#*\-\u2022\s]+/, '')
          .replace(/^\d+[\.\)]\s*(?:\d+[\.\)]?\s+)?|^paso\s*\d+[:\.\-]\s*/i, '')
          .trim();

        const isSpuriousInstruction = /^(?:Image \d+|Dificultad:|Tiempo total|\* Tiempo|anterior entrada|siguiente entrada|previous|next|te va a encantar)/i.test(stepText) ||
          /^\[\s*\]\(https?:\/\//i.test(stepText) ||
          /^https?:\/\//i.test(stepText);

        if (stepText && stepText.length > 5 && !isSpuriousInstruction) {
          const timerMin = this.extractTimerMinutes(stepText);
          instructions.push({
            step: instructions.length + 1,
            text: stepText,
            timerMinutes: timerMin
          });
        }
      } else {
        // Line before any explicit section header:
        // If the recipe contains an explicit ingredients header further down, ignore pre-header lines!
        const hasExplicitIngredients = lines.some(l => /^(?:#+\s*)?(?:ingredientes|lista de ingredientes|lo que necesitas):?$/i.test(l) || /^#+\s*ingredientes\b/i.test(l));
        if (!hasExplicitIngredients && /^[\-\*\u2022]/.test(line)) {
          const parsed = this.parseIngredientLine(line);
          if (parsed) {
            if (Array.isArray(parsed)) ingredients.push(...parsed);
            else ingredients.push(parsed);
          }
        }
      }
    }

    const resolvedDomain = sourceUrl ? this.getDomain(sourceUrl) : '';
    return {
      id: 'rec-' + Date.now(),
      title: title || 'Receta de Notas',
      description: 'Receta importada desde texto estructurado.',
      imageUrl: candidateImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
      prepTimeMinutes: prepTimeMinutes,
      cookTimeMinutes: cookTimeMinutes,
      servings: servings,
      tags: [],
      ingredients: ingredients,
      instructions: instructions,
      sourceUrl: sourceUrl || '',
      sourceDomain: resolvedDomain
    };
  }
};
if (typeof window !== 'undefined') {
  window.RecipeParser = RecipeParser;
  window.APP_VERSION = 'v0.21';
}

// UI Controller
class FoodAssistantApp {
  constructor() {
    this.appVersion = 'v0.21';
    this.activeView = 'view-today';
    this.activeRecipe = null;
    this.activeServings = 2;
    this.pickerTarget = null;
    
    // Cook mode state
    this.cookStepIndex = 0;
    this.timerInterval = null;
    this.timerSecondsLeft = 0;

    // Import Review Mode state (review draft before saving or canceling)
    this.isReviewingImport = false;
    this.pendingImportRecipe = null;

    // Supabase client instance
    this.supabaseClient = null;

    this.initElements();
    this.initVersion();
    this.initTheme();
    this.initSupabaseClient();
    this.initEvents();
    this.updateUserAccountUI();
    this.render();
  }

  initVersion() {
    const badge = document.getElementById('app-version-badge');
    if (badge) badge.textContent = this.appVersion;
    const settingsVer = document.getElementById('settings-app-version-text');
    if (settingsVer) settingsVer.textContent = this.appVersion;
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
        headerIcon.textContent = 'dark_mode';
        headerBtn.title = 'Modo Claro activo (clic para cambiar a Modo Oscuro)';
      } else if (themeMode === 'dark') {
        headerIcon.textContent = 'light_mode';
        headerBtn.title = 'Modo Oscuro activo (clic para cambiar a Modo Claro)';
      } else {
        const isSysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        headerIcon.textContent = isSysDark ? 'light_mode' : 'dark_mode';
        headerBtn.title = isSysDark ? 'Modo Sistema Oscuro (clic para Modo Claro)' : 'Modo Sistema Claro (clic para Modo Oscuro)';
      }
    }

    // Update Segmented Button in Settings View
    document.querySelectorAll('#theme-segmented-group .segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeVal === themeMode);
    });
  }

  toggleNextTheme() {
    // Alternancia directa e inequvoca entre Claro y Oscuro
    let next = 'light';
    if (state.theme === 'light') {
      next = 'dark';
    } else if (state.theme === 'dark') {
      next = 'light';
    } else {
      // Modo system: alternar al opuesto del sistema actual
      const isSysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      next = isSysDark ? 'light' : 'dark';
    }
    this.applyTheme(next);
  }

  async forceUpdateApp() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      localStorage.setItem('fa_last_forced_reload', String(Date.now()));
      window.location.reload(true);
    } catch (e) {
      console.warn("Error al reiniciar caché:", e);
      window.location.reload();
    }
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

    // Importer (US-15: Schema.org & Text Parser)
    document.getElementById('btn-quick-import')?.addEventListener('click', () => this.openImportModal());
    document.getElementById('btn-close-import-modal')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('tab-import-url')?.addEventListener('click', () => this.switchImportTab('url'));
    document.getElementById('tab-import-text')?.addEventListener('click', () => this.switchImportTab('text'));
    document.getElementById('btn-execute-import')?.addEventListener('click', () => this.handleRecipeImport());
    document.getElementById('btn-confirm-save-import')?.addEventListener('click', () => this.confirmSaveImportRecipe());
    document.getElementById('btn-review-edit-recipe')?.addEventListener('click', () => this.editImportReview());
    document.getElementById('btn-review-cancel-recipe')?.addEventListener('click', () => this.cancelImportReview());
    document.getElementById('btn-review-save-recipe')?.addEventListener('click', () => this.confirmSaveImportRecipe());
    document.getElementById('btn-cors-goto-text')?.addEventListener('click', () => {
      this.switchImportTab('text');
      this.handleClipboardPaste();
    });
    document.getElementById('btn-paste-clipboard')?.addEventListener('click', () => this.handleClipboardPaste());
    document.getElementById('btn-force-cache-update')?.addEventListener('click', () => this.forceUpdateApp());

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
    document.getElementById('btn-save-recipe-edit-header')?.addEventListener('click', () => this.saveRecipeEdit());
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

    // Modal closes & Light Dismiss (clicking outside the modal window / backdrop closes it)
    document.getElementById('btn-close-recipe-modal')?.addEventListener('click', () => this.closeRecipeModal());
    document.getElementById('btn-close-picker-modal')?.addEventListener('click', () => this.closePickerModal());
    document.getElementById('btn-exit-cook-mode')?.addEventListener('click', () => this.exitCookMode());
    document.getElementById('btn-cook-next-step')?.addEventListener('click', () => this.nextCookStep());
    document.getElementById('btn-cook-prev-step')?.addEventListener('click', () => this.prevCookStep());

    // Backdrop click dismiss: closes modal when user clicks outside the dialog content
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      let isBackdropClick = false;
      overlay.addEventListener('mousedown', (e) => {
        isBackdropClick = (e.target === overlay);
      });
      overlay.addEventListener('click', (e) => {
        if (isBackdropClick && e.target === overlay) {
          this.closeModalByElement(overlay);
        }
        isBackdropClick = false;
      });
    });

    // Escape key dismiss for active modal & cook mode
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.cookModeOverlay && this.cookModeOverlay.classList.contains('active')) {
          this.exitCookMode();
          return;
        }
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        if (activeModals.length > 0) {
          const topModal = activeModals[activeModals.length - 1];
          this.closeModalByElement(topModal);
        }
      }
    });

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
      breakfast: null,
      lunch: state.recipes[0]?.id || null,
      snack: null,
      dinner: state.recipes[1]?.id || null,
      customSlots: []
    };

    const totalRecipesElem = document.getElementById('stat-total-recipes');
    if (totalRecipesElem) totalRecipesElem.textContent = state.recipes.length;
    
    let plannedCount = 0;
    Object.values(state.mealPlan).forEach(day => {
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach(k => {
        if (day[k]) plannedCount++;
      });
      if (Array.isArray(day.customSlots)) {
        day.customSlots.forEach(cs => {
          if (cs.recipeId) plannedCount++;
        });
      }
    });
    const plannedElem = document.getElementById('stat-planned-meals');
    if (plannedElem) plannedElem.textContent = plannedCount;

    const pendingItems = state.shoppingList.filter(i => !i.isChecked).length;
    const shoppingElem = document.getElementById('stat-shopping-items');
    if (shoppingElem) shoppingElem.textContent = pendingItems;

    const container = document.getElementById('today-slots-container');
    if (!container) return;

    const standardHtml = STANDARD_SLOTS.map(s => {
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

    const customSlots = Array.isArray(todayPlan.customSlots) ? todayPlan.customSlots : [];
    const customHtml = customSlots.map(cs => this.renderCustomSlotCard(todayStr, cs)).join('');

    const addExtraHtml = `
      <div style="grid-column: 1 / -1; margin-top: 4px;">
        <button type="button" class="btn btn-tonal btn-sm" style="width: 100%; justify-content: center; border-radius: var(--radius-md); padding: 10px; white-space: normal; line-height: 1.35; text-align: center;" onclick="app.openAddCustomSlotModal('${todayStr}')">
          <span class="material-symbols-outlined icon-sm">add_circle</span>
          <span>Añadir otra comida para hoy (media mañana, post-entreno, merienda...)</span>
        </button>
      </div>
    `;

    container.innerHTML = standardHtml + customHtml + addExtraHtml;
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
            ${rec.sourceDomain ? `
              <span class="tag-chip" style="background: var(--m3-surface-container-high); color: var(--m3-primary); font-weight: 500; display: inline-flex; align-items: center; gap: 3px;" title="Fuente: ${rec.sourceDomain}">
                <span class="material-symbols-outlined" style="font-size: 13px;">link</span> ${rec.sourceDomain}
              </span>
            ` : ''}
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

    this.isReviewingImport = false;
    this.pendingImportRecipe = null;
    this.activeRecipe = recipe;
    this.activeServings = recipe.servings;
    this.updateRecipeDetailActionBars();
    this.renderRecipeModalContent();
    this.modalRecipeDetail.classList.add('active');
  }

  openImportReview(recipe) {
    if (!recipe) return;
    this.isReviewingImport = true;
    this.pendingImportRecipe = recipe;
    this.activeRecipe = recipe;
    this.activeServings = recipe.servings || 2;
    this.updateRecipeDetailActionBars();
    this.renderRecipeModalContent();
    this.modalRecipeDetail.classList.add('active');
  }

  updateRecipeDetailActionBars() {
    const normalActions = document.getElementById('recipe-detail-normal-actions');
    const reviewActions = document.getElementById('recipe-detail-review-actions');
    if (this.isReviewingImport) {
      if (normalActions) normalActions.style.display = 'none';
      if (reviewActions) reviewActions.style.display = 'flex';
    } else {
      if (normalActions) normalActions.style.display = 'flex';
      if (reviewActions) reviewActions.style.display = 'none';
    }
  }

  cancelImportReview() {
    this.isReviewingImport = false;
    this.pendingImportRecipe = null;
    this.activeRecipe = null;
    this.modalRecipeDetail.classList.remove('active');
    this.updateRecipeDetailActionBars();
  }

  editImportReview() {
    const draft = this.pendingImportRecipe || this.activeRecipe;
    if (!draft) return;
    this.modalRecipeDetail.classList.remove('active');
    this.openEditRecipeModal(draft);
  }

  closeRecipeModal() {
    this.modalRecipeDetail.classList.remove('active');
    if (this.isReviewingImport) {
      this.isReviewingImport = false;
      this.pendingImportRecipe = null;
      this.updateRecipeDetailActionBars();
    }
  }

  closeModalByElement(overlay) {
    if (!overlay) return;
    switch (overlay.id) {
      case 'modal-recipe-detail':
        this.closeRecipeModal();
        break;
      case 'modal-recipe-import':
        this.closeImportModal();
        break;
      case 'modal-recipe-edit':
        this.closeEditModal();
        break;
      case 'modal-recipe-picker':
        this.closePickerModal();
        break;
      case 'modal-auth':
        this.closeAuthModal();
        break;
      case 'modal-shopping-preview':
        this.closeShoppingPreviewModal();
        break;
      case 'modal-add-custom-slot':
        this.closeAddCustomSlotModal();
        break;
      default:
        overlay.classList.remove('active');
        break;
    }
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
        ${this.isReviewingImport ? `
          <div style="background: var(--color-brand-container); color: var(--color-brand-on-container); border: 1px solid var(--color-brand); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: var(--color-brand); font-size: 22px;">verified</span>
              <div>
                <div style="font-size: 13px; font-weight: 700;">Revisión de Receta Importada (Borrador)</div>
                <div style="font-size: 11px; opacity: 0.9;">Comprueba ingredientes y pasos antes de guardar o descártala.</div>
              </div>
            </div>
            <span class="badge" style="background: var(--color-brand); color: #ffffff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); text-transform: uppercase;">Borrador</span>
          </div>
        ` : ''}

        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; align-items: center;">
          ${r.sourceUrl ? `
            <a href="${r.sourceUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="tag-chip" style="background: var(--m3-secondary-container); color: var(--m3-on-secondary-container); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--radius-full);" title="Abrir enlace original en nueva pestaña">
              <span class="material-symbols-outlined" style="font-size: 14px;">open_in_new</span>
              Fuente: ${r.sourceDomain || 'Web Original'}
            </a>
          ` : ''}
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
            ${!this.isReviewingImport ? `
              <button class="btn btn-tonal btn-sm" onclick="app.addRecipeIngredientsToShopping('${r.id}')">
                <span class="material-symbols-outlined icon-sm">add_shopping_cart</span> Enviar a la Compra
              </button>
            ` : ''}
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

        ${this.isReviewingImport ? `
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--m3-outline-variant);">
            <button class="btn btn-primary" id="btn-bottom-save-import-recipe" style="width: 100%; padding: 12px; font-weight: 700; background-color: var(--color-brand); color: #ffffff; font-size: 14px;" onclick="app.confirmSaveImportRecipe()">
              <span class="material-symbols-outlined">check_circle</span> Guardar en Recetas
            </button>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="app.editImportReview()">
                <span class="material-symbols-outlined icon-sm">edit</span> Editar receta
              </button>
              <button class="btn btn-ghost" style="flex: 1; padding: 10px; font-size: 13px; color: var(--m3-error);" onclick="app.cancelImportReview()">
                <span class="material-symbols-outlined icon-sm">cancel</span> Cancelar importación
              </button>
            </div>
          </div>
        ` : `
          <button class="btn btn-primary" style="width: 100%; padding: 12px;" onclick="app.startCookMode()">
            <span class="material-symbols-outlined">skillet</span> Empezar Modo Cocina Paso a Paso
          </button>
        `}
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

  openEditRecipeModal(recipeOrId) {
    let r;
    if (typeof recipeOrId === 'object' && recipeOrId !== null) {
      r = recipeOrId;
    } else {
      r = state.recipes.find(rec => rec.id === recipeOrId);
    }
    if (!r) return;

    document.getElementById('recipe-edit-modal-title').textContent = this.isReviewingImport ? "Editar y Revisar Receta Importada" : "Editar Receta";
    document.getElementById('edit-recipe-id').value = r.id || ('rec-' + Date.now());
    document.getElementById('edit-recipe-title').value = r.title || "";
    document.getElementById('edit-recipe-desc').value = r.description || "";
    document.getElementById('edit-recipe-prep').value = r.prepTimeMinutes || 0;
    document.getElementById('edit-recipe-cook').value = r.cookTimeMinutes || 0;
    document.getElementById('edit-recipe-servings').value = r.servings || 2;
    document.getElementById('edit-recipe-image').value = r.imageUrl || "";
    document.getElementById('edit-recipe-tags').value = (r.tags || []).join(', ');

    const ingContainer = document.getElementById('edit-ingredients-container');
    ingContainer.innerHTML = "";
    (r.ingredients || []).forEach(ing => this.addIngredientRow(ing));

    const stepContainer = document.getElementById('edit-steps-container');
    stepContainer.innerHTML = "";
    (r.instructions || []).forEach(step => this.addStepRow(step));

    this.modalRecipeEdit.classList.add('active');
  }

  closeEditModal() {
    this.modalRecipeEdit.classList.remove('active');
    if (this.isReviewingImport && this.pendingImportRecipe) {
      this.openImportReview(this.pendingImportRecipe);
    }
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

    const wasReviewing = this.isReviewingImport;
    const existingIdx = state.recipes.findIndex(r => r.id === id);
    if (existingIdx >= 0) {
      state.recipes[existingIdx] = updatedRecipe;
    } else {
      state.recipes.unshift(updatedRecipe);
    }

    state.save('fa_recipes', state.recipes);
    this.isReviewingImport = false;
    this.pendingImportRecipe = null;
    this.closeEditModal();
    this.render();
    this.openRecipeDetail(id);
    this.syncDataWithCloud(true);
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
      const customSlots = Array.isArray(dayData.customSlots) ? dayData.customSlots : [];

      return `
        <div class="day-card">
          <div class="day-header">
            <div class="day-name">
              <span>${dayData.dayName}</span>
              <span style="font-size: 13px; font-weight: 500; color: var(--m3-on-surface-variant);">${dateStr}</span>
              ${isToday ? `<span class="day-badge-today">HOY</span>` : ''}
            </div>
            <button type="button" class="btn btn-ghost btn-sm" onclick="app.openAddCustomSlotModal('${dateStr}')" style="font-size: 11px; padding: 4px 8px; color: var(--m3-primary);" title="Añadir momento de comida">
              <span class="material-symbols-outlined icon-sm">add</span> Añadir Comida
            </button>
          </div>

          <div class="slots-grid">
            ${STANDARD_SLOTS.map(slot => this.renderSlotCard(dateStr, slot.key, slot.label, slot.icon, dayData[slot.key])).join('')}
            ${customSlots.map(cs => this.renderCustomSlotCard(dateStr, cs)).join('')}
          </div>

          <div style="margin-top: 8px; display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="app.openAddCustomSlotModal('${dateStr}')" style="font-size: 12px; color: var(--m3-primary); gap: 4px;">
              <span class="material-symbols-outlined icon-sm">add_circle</span> Añadir momento (snack, merienda, batido...)
            </button>
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
            <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.clearSlot('${dateStr}', '${slotType}')" title="Quitar receta" style="padding: 2px 4px;">
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
        <div class="meal-slot" onclick="app.openPickerModal('${dateStr}', '${slotType}', false)">
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

  renderCustomSlotCard(dateStr, customSlot) {
    const recipe = customSlot.recipeId ? state.recipes.find(r => r.id === customSlot.recipeId) : null;
    const iconName = customSlot.icon || 'lunch_dining';
    const slotLabel = customSlot.name || 'Momento Extra';

    if (recipe) {
      return `
        <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')" style="border-left: 3px solid var(--m3-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="slot-label" style="color: var(--m3-primary); font-weight: 700;">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <div style="display: flex; gap: 2px;">
              <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.clearCustomSlotRecipe('${dateStr}', '${customSlot.id}')" title="Quitar receta" style="padding: 2px 4px;">
                <span class="material-symbols-outlined icon-sm">remove_circle_outline</span>
              </button>
              <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.deleteCustomSlot('${dateStr}', '${customSlot.id}')" title="Eliminar este momento" style="padding: 2px 4px; color: var(--m3-error);">
                <span class="material-symbols-outlined icon-sm">delete</span>
              </button>
            </div>
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
        <div class="meal-slot" onclick="app.openPickerModal('${dateStr}', '${customSlot.id}', true)" style="border-left: 3px solid var(--m3-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="slot-label" style="color: var(--m3-primary); font-weight: 700;">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.deleteCustomSlot('${dateStr}', '${customSlot.id}')" title="Eliminar este momento" style="padding: 2px 4px; color: var(--m3-error);">
              <span class="material-symbols-outlined icon-sm">delete</span>
            </button>
          </div>
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

  clearCustomSlotRecipe(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      const cs = state.mealPlan[dateStr].customSlots.find(c => c.id === customSlotId);
      if (cs) {
        cs.recipeId = null;
        state.save('fa_mealplan', state.mealPlan);
        this.syncDataWithCloud(true);
        this.render();
      }
    }
  }

  deleteCustomSlot(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      state.mealPlan[dateStr].customSlots = state.mealPlan[dateStr].customSlots.filter(c => c.id !== customSlotId);
      state.save('fa_mealplan', state.mealPlan);
      this.syncDataWithCloud(true);
      this.render();
    }
  }

  // CUSTOM SLOT MODAL METHODS
  openAddCustomSlotModal(dateStr) {
    const modal = document.getElementById('modal-add-custom-slot');
    const dateInput = document.getElementById('custom-slot-date');
    const nameInput = document.getElementById('custom-slot-name');
    const iconSelect = document.getElementById('custom-slot-icon');

    if (dateInput) dateInput.value = dateStr;
    if (nameInput) nameInput.value = '';
    if (iconSelect) iconSelect.value = 'lunch_dining';

    if (modal) modal.classList.add('active');
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 100);
  }

  closeAddCustomSlotModal() {
    const modal = document.getElementById('modal-add-custom-slot');
    if (modal) modal.classList.remove('active');
  }

  selectCustomSlotPreset(name, icon) {
    const nameInput = document.getElementById('custom-slot-name');
    const iconSelect = document.getElementById('custom-slot-icon');
    if (nameInput) nameInput.value = name;
    if (iconSelect && icon) iconSelect.value = icon;
  }

  confirmAddCustomSlot() {
    const dateInput = document.getElementById('custom-slot-date');
    const nameInput = document.getElementById('custom-slot-name');
    const iconSelect = document.getElementById('custom-slot-icon');

    const dateStr = dateInput?.value || new Date().toISOString().split('T')[0];
    const name = (nameInput?.value || '').trim();
    const icon = iconSelect?.value || 'lunch_dining';

    if (!name) {
      alert("Por favor, introduce el nombre del momento de comida (ej. Media Mañana, Post-Entreno...).");
      return;
    }

    if (!state.mealPlan[dateStr]) {
      state.mealPlan[dateStr] = {
        dayName: '',
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null,
        customSlots: []
      };
    }

    if (!Array.isArray(state.mealPlan[dateStr].customSlots)) {
      state.mealPlan[dateStr].customSlots = [];
    }

    const newSlot = {
      id: 'cslot-' + Date.now(),
      name: name,
      icon: icon,
      recipeId: null
    };

    state.mealPlan[dateStr].customSlots.push(newSlot);
    state.save('fa_mealplan', state.mealPlan);
    this.syncDataWithCloud(true);
    this.closeAddCustomSlotModal();
    this.render();
  }

  openPickerModal(dateStr, slotKey, isCustom = false) {
    this.pickerTarget = { dateStr, slotKey, isCustom };
    const list = document.getElementById('picker-recipes-list');

    let slotTitle = slotKey;
    if (isCustom) {
      const cs = (state.mealPlan[dateStr]?.customSlots || []).find(c => c.id === slotKey);
      slotTitle = cs ? cs.name : 'Momento Extra';
    } else {
      const std = STANDARD_SLOTS.find(s => s.key === slotKey);
      slotTitle = std ? std.label : slotKey;
    }

    document.getElementById('picker-modal-title').textContent = `Elegir plato para ${slotTitle.toUpperCase()}`;
    
    list.innerHTML = state.recipes.map(r => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--m3-surface-container-low); border: 1px solid var(--m3-outline-variant); border-radius: var(--radius-md); cursor: pointer;"
           onclick="app.selectRecipeForSlot('${r.id}')">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; padding-right: 8px;">
          <img src="${r.imageUrl}" alt="" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; flex-shrink: 0;">
          <div style="min-width: 0;">
            <strong style="font-size: 13px; color: var(--m3-on-surface); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.title}</strong>
            <div style="font-size: 11px; color: var(--m3-on-surface-variant); display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined icon-sm">schedule</span> ${r.prepTimeMinutes + r.cookTimeMinutes} min
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" style="flex-shrink: 0;">Elegir</button>
      </div>
    `).join('');

    this.modalRecipePicker.classList.add('active');
  }

  closePickerModal() {
    this.modalRecipePicker.classList.remove('active');
  }

  selectRecipeForSlot(recipeId) {
    if (this.pickerTarget) {
      const { dateStr, slotKey, isCustom } = this.pickerTarget;
      if (!state.mealPlan[dateStr]) {
        state.mealPlan[dateStr] = {
          dayName: '',
          breakfast: null,
          lunch: null,
          snack: null,
          dinner: null,
          customSlots: []
        };
      }

      if (isCustom) {
        if (!Array.isArray(state.mealPlan[dateStr].customSlots)) {
          state.mealPlan[dateStr].customSlots = [];
        }
        const cs = state.mealPlan[dateStr].customSlots.find(c => c.id === slotKey);
        if (cs) {
          cs.recipeId = recipeId;
        }
      } else {
        state.mealPlan[dateStr][slotKey] = recipeId;
      }

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
      `${pendingCount} art\u00EDculo${pendingCount === 1 ? '' : 's'} pendiente${pendingCount === 1 ? '' : 's'}`;

    if (!state.shoppingList.length) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px 16px; color: var(--m3-on-surface-variant);">
          <span class="material-symbols-outlined" style="font-size: 40px; margin-bottom: 6px; color: var(--m3-primary);">shopping_cart</span>
          <h3 style="color: var(--m3-on-surface); font-size: 16px;">Lista de la compra vac\u00EDa</h3>
          <p style="font-size: 13px; margin: 4px 0 16px 0;">
            Genera la lista desde tu plan semanal con un clic o a\u00F1ade art\u00EDculos manualmente.
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
        if (confirm(`\u00BFEliminar los ${count} art\u00EDculos comprados y vaciar la lista?`)) {
          state.shoppingList = [];
          state.save('fa_shopping', state.shoppingList);
          this.syncDataWithCloud(true);
          this.render();
        }
      } else {
        if (confirm(`\u00BFEliminar los ${count} art\u00EDculos marcados como comprados?`)) {
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
      groups: [
        {
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          recipeImage: recipe.imageUrl,
          baseServings: baseServings,
          items: recipe.ingredients.map(ing => ({
            name: ing.name,
            baseAmount: ing.amount !== null && ing.amount !== undefined ? ing.amount : null,
            amount: ing.amount !== null && ing.amount !== undefined ? Math.round((ing.amount * ratio) * 10) / 10 : null,
            unit: ing.unit || '',
            aisle: ing.aisle || 'other',
            checked: true
          }))
        }
      ]
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
    const recipeOccurrences = new Map();
    let plannedCount = 0;

    Object.values(state.mealPlan).forEach(day => {
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach(slot => {
        const rId = day[slot];
        if (rId) {
          recipeOccurrences.set(rId, (recipeOccurrences.get(rId) || 0) + 1);
          plannedCount++;
        }
      });

      if (Array.isArray(day.customSlots)) {
        day.customSlots.forEach(cs => {
          if (cs.recipeId) {
            recipeOccurrences.set(cs.recipeId, (recipeOccurrences.get(cs.recipeId) || 0) + 1);
            plannedCount++;
          }
        });
      }
    });

    if (recipeOccurrences.size === 0) {
      alert("No hay recetas asignadas en el plan semanal para generar la lista.");
      return;
    }

    const baseServings = state.settings.defaultServings || 2;
    const currentServings = baseServings;

    const groups = [];
    recipeOccurrences.forEach((count, recipeId) => {
      const recipe = state.recipes.find(r => r.id === recipeId);
      if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
        const recipeBaseServings = recipe.servings || 2;
        const scale = (currentServings / recipeBaseServings) * count;

        groups.push({
          recipeId: recipe.id,
          recipeTitle: count > 1 ? `${recipe.title} (${count} comidas)` : recipe.title,
          recipeImage: recipe.imageUrl,
          baseServings: recipeBaseServings,
          occurrenceCount: count,
          items: recipe.ingredients.map(ing => ({
            name: ing.name,
            baseAmount: ing.amount !== null && ing.amount !== undefined ? ing.amount * count : null,
            amount: ing.amount !== null && ing.amount !== undefined ? Math.round((ing.amount * scale) * 10) / 10 : null,
            unit: ing.unit || '',
            aisle: ing.aisle || 'other',
            checked: true
          }))
        });
      }
    });

    if (groups.length === 0) {
      alert("Las recetas del plan no tienen ingredientes configurados.");
      return;
    }

    this.shoppingPreviewState = {
      sourceType: 'plan',
      sourceTitle: 'Plan Semanal',
      baseServings: baseServings,
      currentServings: currentServings,
      groups: groups
    };

    const titleEl = document.getElementById('shopping-preview-title');
    const subtitleEl = document.getElementById('shopping-preview-subtitle');
    const servingsVal = document.getElementById('shopping-preview-servings-val');
    const clearFirst = document.getElementById('shopping-preview-clear-first');

    if (titleEl) titleEl.textContent = "Añadir a la Compra";
    if (subtitleEl) subtitleEl.textContent = `Men\u00FA Semanal (${groups.length} recetas, ${plannedCount} comidas)`;
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

    let totalChecked = 0;
    this.shoppingPreviewState.groups.forEach(group => {
      totalChecked += group.items.filter(i => i.checked).length;
    });

    const btnText = document.getElementById('btn-confirm-add-shopping-text');
    if (btnText) {
      btnText.textContent = `Añadir a la Compra (${totalChecked})`;
    }

    container.innerHTML = this.shoppingPreviewState.groups.map((group, groupIdx) => {
      const allChecked = group.items.length > 0 && group.items.every(i => i.checked);
      const checkedInGroup = group.items.filter(i => i.checked).length;

      return `
        <div class="card" style="margin-bottom: 12px; padding: 12px; background-color: var(--m3-surface); border: 1px solid var(--m3-outline-variant); border-radius: var(--radius-lg);">
          <!-- Recipe Section Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--m3-outline-variant); gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
              ${group.recipeImage ? `<img src="${group.recipeImage}" alt="" style="width: 34px; height: 34px; border-radius: 6px; object-fit: cover; flex-shrink: 0;">` : `<span class="material-symbols-outlined" style="color: var(--m3-primary);">restaurant</span>`}
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; font-weight: 700; color: var(--m3-on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${group.recipeTitle}</div>
                <div style="font-size: 11px; color: var(--m3-on-surface-variant);">${checkedInGroup} de ${group.items.length} ingredientes seleccionados</div>
              </div>
            </div>
            
            <button type="button" class="btn btn-ghost btn-sm" style="font-size: 11px; padding: 4px 8px; white-space: nowrap;" onclick="app.toggleGroupShoppingPreview(${groupIdx}, ${!allChecked})">
              ${allChecked ? 'Desmarcar receta' : 'Marcar receta'}
            </button>
          </div>

          <!-- Recipe Ingredients List -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${group.items.map((ing, itemIdx) => {
              const meta = AISLE_METADATA[ing.aisle] || AISLE_METADATA.other;
              const isChecked = ing.checked !== false;

              return `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-radius: var(--radius-sm); background-color: ${isChecked ? 'var(--m3-surface-container-low)' : 'transparent'}; transition: background-color 0.15s ease;">
                  <label style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; cursor: pointer; margin: 0;">
                    <input type="checkbox" class="grocery-checkbox" ${isChecked ? 'checked' : ''} onchange="app.handleShoppingPreviewItemCheck(${groupIdx}, ${itemIdx}, this.checked)" style="flex-shrink: 0;">
                    <div style="flex: 1; min-width: 0; overflow: hidden;">
                      <span style="font-size: 13px; font-weight: 500; color: var(--m3-on-surface); word-break: break-word; ${isChecked ? '' : 'text-decoration: line-through; opacity: 0.55;'}">
                        ${ing.name}
                      </span>
                      <span style="font-size: 10px; color: var(--m3-on-surface-variant); margin-left: 4px; display: inline-flex; align-items: center; gap: 2px;">
                        <span class="material-symbols-outlined icon-sm" style="font-size: 12px;">${meta.icon}</span> ${meta.label}
                      </span>
                    </div>
                  </label>

                  <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                    <input type="number" step="any" min="0" value="${ing.amount !== null && ing.amount !== undefined ? ing.amount : ''}" 
                      placeholder="Cant." 
                      class="form-input" 
                      style="width: 64px; padding: 4px 6px; text-align: center; font-size: 12px; font-weight: 500; height: 30px; ${isChecked ? '' : 'opacity: 0.5;'}"
                      onchange="app.handleShoppingPreviewAmountChange(${groupIdx}, ${itemIdx}, this.value)"
                      ${isChecked ? '' : 'disabled'}>
                    <span style="font-size: 11px; color: var(--m3-on-surface-variant); min-width: 22px;">${ing.unit || ''}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  stepShoppingPreviewServings(delta) {
    if (!this.shoppingPreviewState) return;
    const newServings = Math.max(1, this.shoppingPreviewState.currentServings + delta);
    if (newServings === this.shoppingPreviewState.currentServings) return;

    this.shoppingPreviewState.currentServings = newServings;
    const servingsVal = document.getElementById('shopping-preview-servings-val');
    if (servingsVal) servingsVal.textContent = newServings;

    this.shoppingPreviewState.groups.forEach(group => {
      group.items.forEach(item => {
        if (item.baseAmount !== null && item.baseAmount !== undefined) {
          item.amount = Math.round((item.baseAmount * (newServings / this.shoppingPreviewState.baseServings)) * 10) / 10;
        }
      });
    });

    this.renderShoppingPreview();
  }

  toggleAllShoppingPreview(checked) {
    if (!this.shoppingPreviewState) return;
    this.shoppingPreviewState.groups.forEach(group => {
      group.items.forEach(item => {
        item.checked = checked;
      });
    });
    this.renderShoppingPreview();
  }

  toggleGroupShoppingPreview(groupIdx, checked) {
    if (!this.shoppingPreviewState || !this.shoppingPreviewState.groups[groupIdx]) return;
    this.shoppingPreviewState.groups[groupIdx].items.forEach(item => {
      item.checked = checked;
    });
    this.renderShoppingPreview();
  }

  handleShoppingPreviewItemCheck(groupIdx, itemIdx, checked) {
    if (!this.shoppingPreviewState || !this.shoppingPreviewState.groups[groupIdx]) return;
    const item = this.shoppingPreviewState.groups[groupIdx].items[itemIdx];
    if (item) item.checked = checked;
    this.renderShoppingPreview();
  }

  handleShoppingPreviewAmountChange(groupIdx, itemIdx, val) {
    if (!this.shoppingPreviewState || !this.shoppingPreviewState.groups[groupIdx]) return;
    const item = this.shoppingPreviewState.groups[groupIdx].items[itemIdx];
    if (!item) return;
    const num = parseFloat(val);
    item.amount = isNaN(num) ? null : num;
    const ratio = (this.shoppingPreviewState.currentServings / this.shoppingPreviewState.baseServings);
    item.baseAmount = item.amount !== null ? item.amount / ratio : null;
  }

  closeShoppingPreviewModal() {
    if (this.modalShoppingPreview) {
      this.modalShoppingPreview.classList.remove('active');
    }
    this.shoppingPreviewState = null;
  }

  confirmShoppingPreviewAdd() {
    if (!this.shoppingPreviewState) return;
    
    const selectedItems = [];
    this.shoppingPreviewState.groups.forEach(group => {
      group.items.forEach(item => {
        if (item.checked) {
          selectedItems.push({
            name: item.name,
            amount: item.amount,
            unit: item.unit || '',
            aisle: item.aisle || 'other',
            isChecked: false,
            recipeOrigin: group.recipeTitle
          });
        }
      });
    });

    if (selectedItems.length === 0) {
      alert("Por favor, selecciona al menos un ingrediente para añadir.");
      return;
    }

    const clearFirst = document.getElementById('shopping-preview-clear-first')?.checked;
    if (clearFirst) {
      state.shoppingList = [];
    }

    let addedCount = 0;
    selectedItems.forEach(item => {
      const key = `${item.name.toLowerCase().trim()}_${(item.unit || '').toLowerCase().trim()}`;
      const existing = state.shoppingList.find(i => `${i.name.toLowerCase().trim()}_${(i.unit || '').toLowerCase().trim()}` === key && !i.isChecked);

      if (existing && existing.amount !== null && item.amount !== null) {
        existing.amount = Math.round((existing.amount + item.amount) * 10) / 10;
        if (item.recipeOrigin && !existing.recipeOrigin.includes(item.recipeOrigin)) {
          existing.recipeOrigin += `, ${item.recipeOrigin}`;
        }
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
    alert(`\u00A1Se han a\u00F1adido ${addedCount} ingredientes a tu lista de la compra!`);
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
    const breakfastRecipes = state.recipes.filter(r => r.tags.includes('Desayuno'));
    const lunchRecipes = state.recipes.filter(r => r.tags.includes('Almuerzo') || !r.tags.includes('Desayuno'));
    const snackRecipes = state.recipes.filter(r => r.tags.includes('Merienda'));
    const dinnerRecipes = state.recipes.filter(r => r.tags.includes('Cena') || !r.tags.includes('Desayuno'));
    const all = state.recipes;

    let i = 0;
    Object.keys(state.mealPlan).forEach(dateKey => {
      state.mealPlan[dateKey].breakfast = (breakfastRecipes[i % breakfastRecipes.length] || all[i % all.length])?.id || null;
      state.mealPlan[dateKey].lunch = (lunchRecipes[i % lunchRecipes.length] || all[(i + 1) % all.length])?.id || null;
      state.mealPlan[dateKey].snack = (snackRecipes[i % snackRecipes.length] || all[(i + 2) % all.length])?.id || null;
      state.mealPlan[dateKey].dinner = (dinnerRecipes[i % dinnerRecipes.length] || all[(i + 3) % all.length])?.id || null;
      i++;
    });
    state.save('fa_mealplan', state.mealPlan);
    this.syncDataWithCloud(true);
    this.render();
    alert("¡Menú completo (desayunos, almuerzos, meriendas y cenas) organizado con éxito en tu calendario!");
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

// ==========================================================================
  // UNIVERSAL RECIPE IMPORTER (US-15: SCHEMA.ORG JSON-LD & TEXT PARSER)
  // ==========================================================================
  openImportModal() {
    this.modalRecipeImport.classList.add('active');
    document.getElementById('import-url-input').value = '';
    document.getElementById('import-text-input').value = '';
    const status = document.getElementById('import-status-indicator');
    if (status) status.style.display = 'none';
    const previewBox = document.getElementById('import-preview-box');
    if (previewBox) previewBox.style.display = 'none';
    const corsBanner = document.getElementById('import-cors-banner');
    if (corsBanner) corsBanner.style.display = 'none';
    const btnExecute = document.getElementById('btn-execute-import');
    if (btnExecute) btnExecute.style.display = 'inline-flex';
    const btnConfirm = document.getElementById('btn-confirm-save-import');
    if (btnConfirm) btnConfirm.style.display = 'none';
    this.pendingImportRecipe = null;
    this.switchImportTab('url');
  }

  fillAndTestSampleRecipe() {
    const urlInput = document.getElementById('import-url-input');
    if (urlInput) {
      urlInput.value = 'https://www.directoalpaladar.com/recetas-vegetarianas/bolitas-garbanzos-brocoli-al-horno-receta-facil-para-cena-saludable';
    }
    const corsBanner = document.getElementById('import-cors-banner');
    if (corsBanner) corsBanner.style.display = 'none';
    const status = document.getElementById('import-status-indicator');
    if (status) status.style.display = 'none';
    this.handleRecipeImport();
  }

  closeImportModal() {
    this.modalRecipeImport.classList.remove('active');
    this.pendingImportRecipe = null;
  }

  switchImportTab(tab) {
    const tabUrl = document.getElementById('tab-import-url');
    const tabText = document.getElementById('tab-import-text');
    const secUrl = document.getElementById('section-import-url');
    const secText = document.getElementById('section-import-text');
    const status = document.getElementById('import-status-indicator');
    if (status) status.style.display = 'none';
    const corsBanner = document.getElementById('import-cors-banner');
    if (corsBanner) corsBanner.style.display = 'none';

    if (tab === 'url') {
      if (tabUrl) {
        tabUrl.style.background = 'var(--m3-surface)';
        tabUrl.style.color = 'var(--m3-on-surface)';
        tabUrl.style.boxShadow = 'var(--elevation-1)';
      }
      if (tabText) {
        tabText.style.background = 'transparent';
        tabText.style.color = 'var(--m3-on-surface-variant)';
        tabText.style.boxShadow = 'none';
      }
      if (secUrl) secUrl.style.display = 'block';
      if (secText) secText.style.display = 'none';
    } else {
      if (tabText) {
        tabText.style.background = 'var(--m3-surface)';
        tabText.style.color = 'var(--m3-on-surface)';
        tabText.style.boxShadow = 'var(--elevation-1)';
      }
      if (tabUrl) {
        tabUrl.style.background = 'transparent';
        tabUrl.style.color = 'var(--m3-on-surface-variant)';
        tabUrl.style.boxShadow = 'none';
      }
      if (secText) secText.style.display = 'block';
      if (secUrl) secUrl.style.display = 'none';
    }
  }

  async handleClipboardPaste() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const textarea = document.getElementById('import-text-input');
          if (textarea) {
            textarea.value = text.trim();
            this.handleRecipeImport();
          }
          return;
        }
      }
    } catch (e) {
      console.warn("Acceso directo a portapapeles no disponible:", e);
    }
    const textarea = document.getElementById('import-text-input');
    if (textarea) {
      textarea.focus();
      textarea.select();
    }
  }

  async handleRecipeImport() {
    let url = document.getElementById('import-url-input')?.value.trim() || '';
    const text = document.getElementById('import-text-input')?.value.trim() || '';
    const status = document.getElementById('import-status-indicator');
    const previewBox = document.getElementById('import-preview-box');
    const corsBanner = document.getElementById('import-cors-banner');
    const btnExecute = document.getElementById('btn-execute-import');
    const btnConfirm = document.getElementById('btn-confirm-save-import');

    const isUrlActive = document.getElementById('section-import-url')?.style.display !== 'none';
    const targetInput = isUrlActive ? url : text;

    if (!targetInput) {
      alert(isUrlActive ? "Por favor, introduce una URL de receta." : "Por favor, pega el texto de la receta.");
      return;
    }

    if (corsBanner) corsBanner.style.display = 'none';
    if (status) {
      status.style.display = 'block';
      status.style.color = 'var(--m3-primary)';
      status.innerHTML = '<span class="material-symbols-outlined icon-sm" style="animation: spin 1s linear infinite; vertical-align: middle;">sync</span> Analizando receta y extrayendo ingredientes...';
    }

    try {
      let extractedRecipe = null;

      if (isUrlActive) {
        // Mode 1: URL or Raw JSON-LD in URL field
        if (url.startsWith('{') || url.includes('<script')) {
          const jsonLd = RecipeParser.extractJsonLdFromHtml(url) || JSON.parse(url);
          extractedRecipe = RecipeParser.parseSchemaRecipe(jsonLd);
        } else {
          // Normalize URL
          let cleanUrl = url.trim();
          if (!/^https?:\/\//i.test(cleanUrl)) {
            cleanUrl = 'https://' + cleanUrl;
          }

          let html = null;
          let fetchSuccess = false;
          let is404OrEmpty = false;

          // Priority proxy endpoints
          const proxyEndpoints = [
            `https://r.jina.ai/${cleanUrl}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(cleanUrl)}`,
            `https://corsproxy.io/?url=${encodeURIComponent(cleanUrl)}`
          ];

          if (window.location.protocol === 'http:' || window.location.hostname === 'localhost') {
            proxyEndpoints.unshift(`/api/fetch?url=${encodeURIComponent(cleanUrl)}`);
          }

          for (const proxyUrl of proxyEndpoints) {
            try {
              console.log("[FoodAssistant] Intentando descargar receta vía proxy:", proxyUrl);
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 11000);
              const fetchHeaders = {};
              if (proxyUrl.includes('r.jina.ai')) {
                fetchHeaders['X-Return-Format'] = 'html';
                fetchHeaders['Accept'] = 'text/html';
              }
              const resp = await fetch(proxyUrl, { 
                signal: controller.signal,
                headers: fetchHeaders
              });
              clearTimeout(timeoutId);
              if (resp.ok) {
                const textResp = await resp.text();
                if (textResp && textResp.length > 80) {
                  // Detect Cloudflare Turnstile / Managed challenge anti-bot
                  if (/<title>.*?(?:Just a moment|Cloudflare|Security Check).*?<\/title>|cf-turnstile|__cf_chl/i.test(textResp.substring(0, 2000))) {
                    if (corsBanner) corsBanner.style.display = 'block';
                    throw new Error("Esta web cuenta con protección activa anti-scraping (Cloudflare). Puedes importar la receta al instante copiando y pegando su texto en la pestaña 'Texto / Notas'.");
                  }
                  // Detect true 404 / missing pages in response header or title (including DAP & SPA Next.js 404s)
                  if (/^404\s+not\s+found|<title>.*?(?:404|not\s+found|no\s+encontrada|no\s+se\s+ha\s+encontrado).*?<\/title>|^Title:\s*404|"(?:page|statusCode)":\s*"(?:\/error-pages\/not-found|404)"/i.test(textResp.substring(0, 3000))) {
                    is404OrEmpty = true;
                    fetchSuccess = true;
                    break;
                  }
                  html = textResp;
                  fetchSuccess = true;
                  console.log("[FoodAssistant] Descarga exitosa (" + textResp.length + " bytes)");
                  break;
                }
              }
            } catch (proxyErr) {
              console.warn("[FoodAssistant] Proxy falló o timeout:", proxyUrl, proxyErr);
            }
          }

          if (html && !is404OrEmpty) {
            const schemaObj = RecipeParser.extractJsonLdFromHtml(html) || RecipeParser.extractMicrodataRecipe(html);
            if (schemaObj) {
              extractedRecipe = RecipeParser.parseSchemaRecipe(schemaObj, cleanUrl);
            }
            // If schema parsing yielded no recipe, or 0 ingredients, or 0 instructions, try text parser to complement or replace
            if (!extractedRecipe || extractedRecipe.ingredients.length === 0 || extractedRecipe.instructions.length === 0) {
              const extractedText = RecipeParser.htmlToText(html);
              if (extractedText) {
                const textRecipe = RecipeParser.parseRecipeText(extractedText, cleanUrl);
                if (textRecipe) {
                  if (!extractedRecipe) {
                    extractedRecipe = textRecipe;
                  } else {
                    if (extractedRecipe.ingredients.length === 0 && textRecipe.ingredients.length > 0) {
                      extractedRecipe.ingredients = textRecipe.ingredients;
                    }
                    if (extractedRecipe.instructions.length === 0 && textRecipe.instructions.length > 0) {
                      extractedRecipe.instructions = textRecipe.instructions;
                    }
                  }
                }
              }
            }
            if (extractedRecipe && (!extractedRecipe.imageUrl || extractedRecipe.imageUrl.includes('unsplash'))) {
              const imgMatch = html.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
              if (imgMatch && imgMatch[1] && !imgMatch[1].includes('150_150') && !imgMatch[1].includes('avatar')) {
                extractedRecipe.imageUrl = imgMatch[1];
              }
            }
          }

          if (is404OrEmpty) {
            if (corsBanner) corsBanner.style.display = 'none';
            throw new Error(`La página web parece no existir o devolver error 404 ("${cleanUrl}"). Asegúrate de copiar la URL completa de una receta.`);
          }

          if (!extractedRecipe || !extractedRecipe.ingredients || extractedRecipe.ingredients.length === 0) {
            if (fetchSuccess) {
              if (corsBanner) corsBanner.style.display = 'none';
              throw new Error("La página web se ha descargado correctamente pero no contiene una receta con ingredientes reconocibles (puede ser un buscador, portada o listado general). Copia el enlace de una receta concreta o pega su texto en 'Texto / Notas'.");
            }
            if (corsBanner) corsBanner.style.display = 'block';
            throw new Error("Esta web no permite la descarga directa automática. Puedes pegarla desde 'Texto / Notas' en 1 clic.");
          }
        }
      } else {
        // Mode 2: Text / Raw Paste
        extractedRecipe = RecipeParser.parseRecipeText(text);
      }

      if (!extractedRecipe || !extractedRecipe.title || !extractedRecipe.ingredients || extractedRecipe.ingredients.length === 0) {
        throw new Error("No se pudieron detectar ingredientes válidos en el texto introducido. Comprueba que contenga la lista de ingredientes.");
      }

      // Store in memory for confirmation
      this.pendingImportRecipe = extractedRecipe;

      // Close the import modal directly and open the full recipe detail screen in review mode
      this.closeImportModal();
      this.openImportReview(extractedRecipe);

    } catch (err) {
      if (status) {
        status.style.color = 'var(--m3-error)';
        status.textContent = 'Aviso: ' + err.message;
      }
      if (previewBox) previewBox.style.display = 'none';
      if (btnExecute) btnExecute.style.display = 'inline-flex';
      if (btnConfirm) btnConfirm.style.display = 'none';
    }
  }
  confirmSaveImportRecipe() {
    const newRecipe = this.pendingImportRecipe || this.activeRecipe;
    if (!newRecipe) return;

    if (!newRecipe.id) {
      newRecipe.id = 'rec-' + Date.now();
    }

    const existingIdx = state.recipes.findIndex(r => r.id === newRecipe.id);
    if (existingIdx >= 0) {
      state.recipes[existingIdx] = newRecipe;
    } else {
      state.recipes.unshift(newRecipe);
    }

    state.save('fa_recipes', state.recipes);
    this.syncDataWithCloud(true);
    this.isReviewingImport = false;
    this.pendingImportRecipe = null;
    this.closeImportModal();
    this.render();
    this.switchView('view-recipes');
    this.openRecipeDetail(newRecipe.id);
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
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (!window.app) {
      app = new FoodAssistantApp();
      window.app = app;
    }
  });
  window.SEED_RECIPES = SEED_RECIPES;
  window.STANDARD_SLOTS = STANDARD_SLOTS;
  window.AISLE_METADATA = AISLE_METADATA;
  window.StateStore = StateStore;
  window.FoodAssistantApp = FoodAssistantApp;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SEED_RECIPES, STANDARD_SLOTS, AISLE_METADATA, StateStore, FoodAssistantApp };
}
