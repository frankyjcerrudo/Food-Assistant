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
    tags: ["Pasta", "Rápida", "Cena", "Saludable", "Vegetariano"],
    ingredients: [
      { id: "i1", name: "Espaguetis o Tagliatelle", amount: 200, unit: "g", aisle: "pantry" },
      { id: "i2", name: "Albahaca fresca", amount: 50, unit: "g", aisle: "produce" },
      { id: "i3", name: "Queso Parmesano rallado", amount: 60, unit: "g", aisle: "dairy" },
      { id: "i4", name: "Piñones", amount: 30, unit: "g", aisle: "pantry" },
      { id: "i5", name: "Dientes de ajo", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i6", name: "Aceite de oliva virgen extra", amount: 60, unit: "ml", aisle: "spices" },
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
    tags: ["Pollo", "Almuerzo", "Cena", "Saludable", "Sin Gluten"],
    ingredients: [
      { id: "i8", name: "Pechugas de pollo", amount: 400, unit: "g", aisle: "meat" },
      { id: "i9", name: "Limón (zumo y ralladura)", amount: 2, unit: "ud", aisle: "produce" },
      { id: "i10", name: "Patatas medianas", amount: 3, unit: "ud", aisle: "produce" },
      { id: "i11", name: "Romero fresco", amount: 2, unit: "ramas", aisle: "produce" },
      { id: "i12", name: "Aceite de oliva", amount: 30, unit: "ml", aisle: "spices" }
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
    tags: ["Pescado", "Cena", "Saludable", "Rápida", "Sin Gluten", "Keto"],
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
    tags: ["Saludable", "Rápida", "Almuerzo", "Cena", "Vegetariano", "Sin Gluten"],
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
    tags: ["Desayuno", "Rápida", "Saludable", "Vegetariano"],
    ingredients: [
      { id: "i22", name: "Pan integral de masa madre", amount: 2, unit: "rebanadas", aisle: "bakery" },
      { id: "i23", name: "Aguacate maduro", amount: 1, unit: "ud", aisle: "produce" },
      { id: "i24", name: "Huevos camperos", amount: 2, unit: "ud", aisle: "dairy" },
      { id: "i25", name: "Semillas de chía y sésamo", amount: 10, unit: "g", aisle: "pantry" },
      { id: "i26", name: "Aceite de oliva virgen extra", amount: 10, unit: "ml", aisle: "spices" }
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
    tags: ["Desayuno", "Saludable", "Vegetariano"],
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
    tags: ["Merienda", "Saludable", "Rápida", "Vegano", "Vegetariano"],
    ingredients: [
      { id: "i33", name: "Tostadas de espelta o centeno", amount: 4, unit: "ud", aisle: "bakery" },
      { id: "i34", name: "Hummus de garbanzos", amount: 120, unit: "g", aisle: "pantry" },
      { id: "i35", name: "Tomates cherry", amount: 8, unit: "ud", aisle: "produce" },
      { id: "i36", name: "Semillas de chía o calabaza", amount: 15, unit: "g", aisle: "pantry" },
      { id: "i37", name: "Aceite de oliva virgen extra", amount: 10, unit: "ml", aisle: "spices" }
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
    tags: ["Desayuno", "Merienda", "Saludable", "Rápida", "Vegetariano", "Sin Gluten"],
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

// ==========================================================================
// PREDEFINED TAGS & DIETARY CLASSIFIER (US-02)
// ==========================================================================
const PREDEFINED_DIETARY_TAGS = ['Keto', 'Vegano', 'Vegetariano', 'Sin Gluten', 'Sin Lactosa', 'Bajo en Carbos', 'Alta en Proteínas'];
const DIETARY_TAG_EMOJIS = {
  'Keto': '🥑',
  'Vegano': '🌱',
  'Vegetariano': '🥗',
  'Sin Gluten': '🌾',
  'Sin Lactosa': '🥛',
  'Bajo en Carbos': '🥦',
  'Alta en Proteínas': '💪'
};
function getDietaryTagEmoji(tag) {
  return DIETARY_TAG_EMOJIS[tag] || '';
}
const PREDEFINED_OCCASION_TAGS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
const PREDEFINED_PRACTICAL_TAGS = ['Rápida', 'Horno', 'Tupper', 'Airfryer', 'Saludable', 'Robot de Cocina'];
const ALL_PREDEFINED_TAGS = [
  ...PREDEFINED_DIETARY_TAGS,
  ...PREDEFINED_OCCASION_TAGS,
  ...PREDEFINED_PRACTICAL_TAGS
];

function checkDietaryCompliance(recipe, preferences) {
  if (!recipe || !Array.isArray(preferences) || preferences.length === 0) {
    return { compliant: true, violations: [] };
  }
  const recipeTagsLower = (Array.isArray(recipe.tags) ? recipe.tags : []).map(t => String(t).toLowerCase().trim());
  const violations = [];

  preferences.forEach(pref => {
    const prefLower = String(pref).toLowerCase().trim();
    let isCompliant = recipeTagsLower.includes(prefLower);

    // Negative ingredient/tag check for vegetarian / vegan
    if (prefLower === 'vegano' || prefLower === 'vegetariano') {
      const hasMeatAisle = Array.isArray(recipe.ingredients) && recipe.ingredients.some(i => i && (i.aisle === 'meat' || i.aisle === 'fish'));
      const hasMeatTag = recipeTagsLower.some(t => ['pollo', 'carne', 'pescado', 'ternera', 'cerdo', 'jamon', 'jamón'].includes(t));
      if (hasMeatAisle || hasMeatTag) {
        isCompliant = false;
      }
      if (prefLower === 'vegano') {
        const hasDairy = Array.isArray(recipe.ingredients) && recipe.ingredients.some(i => i && i.aisle === 'dairy');
        if (hasDairy) isCompliant = false;
      }
    }

    if (!isCompliant) {
      violations.push(pref);
    }
  });

  return {
    compliant: violations.length === 0,
    violations
  };
}

// US-02: Motor de Inferencia y Auto-etiquetado Inteligente de Recetas
function analyzeAndInferRecipeTags(recipe) {
  if (!recipe) return [];
  const inferred = new Set();
  const title = (recipe.title || '').toLowerCase();
  const desc = (recipe.description || '').toLowerCase();
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  const ingNames = ingredients.map(i => (typeof i === 'string' ? i : (i.name || '')).toLowerCase());
  const allIngText = ingNames.join(' ');
  const stepsText = instructions.map(s => (typeof s === 'string' ? s : (s.text || '')).toLowerCase()).join(' ');
  const fullText = `${title} ${desc} ${allIngText} ${stepsText}`;

  const prep = parseInt(recipe.prepTimeMinutes, 10) || 0;
  const cook = parseInt(recipe.cookTimeMinutes, 10) || 0;
  const totalTime = prep + cook;

  // 1. Prácticas / Técnicas
  if (totalTime > 0 && totalTime <= 25) {
    inferred.add('Rápida');
  }
  if (/\b(horno|hornear|hornead[oa]s?|gratinar|gratinad[oa]s?|asar al horno|precalentar)\b/i.test(`${stepsText} ${title}`)) {
    inferred.add('Horno');
  }
  if (/\b(airfryer|freidora de aire|freidora sin aceite)\b/i.test(fullText)) {
    inferred.add('Airfryer');
  }
  if (/\b(microondas)\b/i.test(fullText)) {
    inferred.add('Microondas');
  }
  if (/\b(tupper|taper|batch cooking|para llevar|conservar en nevera)\b/i.test(fullText)) {
    inferred.add('Tupper');
  }
  if (/\b(congelar|congelable|apto para congelador)\b/i.test(fullText)) {
    inferred.add('Para Congelar');
  }

  // 2. Dietéticas basadas en ingredientes
  if (ingredients.length > 0) {
    const hasMeat = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      const aisle = (typeof ing === 'object' && ing.aisle) || '';
      return aisle === 'meat' || /\b(pollo|pechuga|carne|ternera|cerdo|lomo|bacon|beicon|jam[oó]n|pavo|salchicha|hamburguesa|chorizo|panceta|cordero|conejo|solomillo|alitas)\b/i.test(name);
    });

    const hasFish = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      const aisle = (typeof ing === 'object' && ing.aisle) || '';
      return aisle === 'fish' || /\b(pescado|salm[oó]n|at[uú]n|merluza|bacalao|gambas?|langostinos?|camarones?|mejillones?|calamar|pulpo|anchoas?|sardinas?|dorada|lubina|almejas?)\b/i.test(name);
    });

    const hasDairy = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      const aisle = (typeof ing === 'object' && ing.aisle) || '';
      if (/\b(sin lactosa|vegetal|de avena|de soja|de almendra|de coco|de arroz)\b/i.test(name)) return false;
      return aisle === 'dairy' || /\b(leche|queso|yogur|mantequilla|nata|parmesano|mozzarella|crema de leche|feta|cottage|ricotta|mascarpone|cuajada)\b/i.test(name);
    });

    const hasEgg = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      return /\b(huevo|huevos|clara|claras|yema|yemas)\b/i.test(name);
    });

    const hasGluten = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      if (/\b(sin gluten|gluten[ -]?free)\b/i.test(name)) return false;
      return /\b(harina(?! de almendra| de arroz| de ma[ií]z| sin gluten)|trigo|pan\b(?! sin gluten)|pasta\b(?! sin gluten)|espaguetis?|macarrones?|tallarines?|fideos?|cebada|centeno|avena\b(?! sin gluten)|cerveza|cusc[uú]s|galletas?)\b/i.test(name);
    });

    const hasHighCarbs = ingredients.some(ing => {
      const name = (typeof ing === 'string' ? ing : (ing.name || '')).toLowerCase();
      return /\b(arroz|pasta|espaguetis?|pan\b|patatas?|papas?|az[uú]car|miel|harina|legumbres|garbanzos?|lentejas?|alubias?|ma[ií]z)\b/i.test(name);
    });

    // Vegano: Sin carne, pescado, lácteos, huevos ni miel
    if (!hasMeat && !hasFish && !hasDairy && !hasEgg && !/\b(miel)\b/i.test(allIngText)) {
      inferred.add('Vegano');
      inferred.add('Vegetariano');
    } else if (!hasMeat && !hasFish) {
      inferred.add('Vegetariano');
    }

    // Sin Gluten
    if (!hasGluten) {
      inferred.add('Sin Gluten');
    }

    // Sin Lactosa
    if (!hasDairy) {
      inferred.add('Sin Lactosa');
    }

    // Keto / Bajo en Carbos
    if (!hasHighCarbs && (hasMeat || hasFish || hasEgg || /\b(aguacate|aceite de oliva|frutos secos|nueces|semillas|espinacas?|calabac[ií]n|br[oó]coli|coliflor)\b/i.test(allIngText))) {
      inferred.add('Bajo en Carbos');
      inferred.add('Keto');
    }

    // Alta en Proteínas (heurística por ingredientes proteicos clave)
    const hasProteinSource = ingNames.some(name => /\b(pollo|pechuga|pavo|ternera|solomillo|at[uú]n|salm[oó]n|merluza|bacalao|gambas?|langostinos?|huevos?|claras?|tofu|tempeh|seit[aá]n|soja texturizada|reques[oó]n|cottage|prote[ií]na|lentejas?|garbanzos?|alubias?)\b/i.test(name));
    if (hasProteinSource) {
      inferred.add('Alta en Proteínas');
    }
  }

  // 3. Momento de Comida
  if (/\b(desayuno|tostada|porridge|avena|smoothie|tortitas|pancakes|granola|muesli|caf[eé])\b/i.test(`${title} ${desc}`)) {
    inferred.add('Desayuno');
  }
  if (/\b(merienda|snack|batido|tentempi[eé]|barrita)\b/i.test(`${title} ${desc}`)) {
    inferred.add('Merienda');
    inferred.add('Snack');
  }
  if (/\b(guiso|potaje|cocido|estofado|fabada|paella|arroz|lentejas|garbanzos|alubias|pasta|espaguetis|macarrones|lasa[ñn]a|risotto)\b/i.test(`${title} ${desc}`)) {
    inferred.add('Almuerzo');
  }
  if (/\b(cena|crema|sopa|ensalada|tortilla|salteado|plancha|revuelto|wrap)\b/i.test(`${title} ${desc}`)) {
    inferred.add('Cena');
  }

  return Array.from(inferred);
}

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

// ==========================================================================
// UNIFIED INGREDIENT CLASSIFIER, ICONS & AUTOCOMPLETE CATALOG (US-20, BUG-14)
// ==========================================================================
function normalizeIngredientText(str) {
  if (!str) return '';
  return str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function categorizeIngredientAisle(ingredientName) {
  const text = normalizeIngredientText(ingredientName);
  if (!text) return 'other';

  // 1. Dulces y Chocolates específicos (pantry)
  if (/\b(chocolate|chocolates|cacao|bombones)\b/.test(text)) {
    return 'pantry';
  }

  // 2. Carnes, Aves, Pescados, Mariscos y Embutidos (meat)
  if (/\b(pollo|pollos|pechuga|pechugas|muslo|muslos|alita|alitas|pavo|pavos|ternera|terneras|vaca|buey|cerdo|cerdos|cochinillo|cordero|conejo|pato|carne|carnes|picada|filete|filetes|solomillo|solomillos|lomo|lomos|costilla|costillas|chuleta|chuletas|entrecot|hamburguesa|hamburguesas|salchicha|salchichas|chorizo|chorizos|morcilla|morcillas|jamon|jamones|panceta|bacon|beicon|lacon|cecina|embutido|embutidos|pescado|pescados|salmon|salmones|merluza|merluzas|atun|atunes|bonito|bacalao|dorada|lubina|trucha|truchas|sardina|sardinas|boqueron|boquerones|anchoa|anchoas|pez\s+espada|emperador|gamba|gambas|langostino|langostinos|calamar|calamares|sepia|chipiron|chipirones|pulpo|pulpos|mejillon|mejillones|almeja|almejas|navaja|navajas|ostra|ostras|cangrejo|bogavante)\b/.test(text)) {
    return 'meat';
  }

  // 3. Lácteos y Huevos (dairy)
  if (/\b(leche|queso|quesos|yogur|yogurt|yogures|mantequilla|nata|crema\s+de\s+leche|huevo|huevos|clara|claras|yema|yemas|parmesano|mozzarella|ricotta|feta|mascarpone|gorgonzola|cheddar|gouda|brie|camembert|roquefort|cuajada|kefir)\b/.test(text)) {
    return 'dairy';
  }

  // 4. Frutas, Verduras, Hortalizas y Hierbas Frescas (produce)
  if (/\b(tomate|tomates|cherry|cebolla|cebollas|cebolleta|cebolletas|ajo|ajos|patata|patatas|papa|papas|aguacate|aguacates|espinaca|espinacas|lechuga|lechugas|zanahoria|zanahorias|limon|limones|lima|limas|manzana|manzanas|platano|platanos|banana|bananas|champinon|champinones|seta|setas|pimiento|pimientos|calabacin|calabacines|pepino|pepinos|fresa|fresas|fresones|arandano|arandanos|frambuesa|frambuesas|mora|moras|pera|peras|naranja|naranjas|mandarina|mandarinas|pomelo|uva|uvas|melon|sandia|melocoton|albaricoque|ciruela|ciruelas|mango|pina|kiwi|kiwis|brocoli|coliflor|col|repollo|lombarda|berenjena|berenjenas|judia|judias|guisante|guisantes|esparrago|esparragos|triguero|trigueros|apio|puerro|puerros|calabaza|calabazas|perejil|albahaca|cilantro|hierbabuena|menta|rucula|canonigos|alcachofa|alcachofas|remolacha|rabano|rabanos|nabo|brotes|endivia|endivias|castana|castanas)\b/.test(text)) {
    if (/\b(vinagre|vinagres|aceite|aceites)\b/.test(text)) {
      return 'spices';
    }
    if (/\b(tomate\s+frito|salsa\s+de\s+tomate|conserva|en\s+lata|bote)\b/.test(text)) {
      return 'pantry';
    }
    if (/\b(congelado|congelados|congelada|congeladas)\b/.test(text)) {
      return 'frozen';
    }
    return 'produce';
  }

  // 5. Panadería, Bollería, Masas y Harinas (bakery)
  if (/\b(pan|panes|baguette|barra|tostada|tostadas|molde|croissant|croissants|brioche|bollo|bollos|picos|colines|harina|harinas|levadura|masa|masas|hojaldre|placas|placa|galleta|galletas|bizcocho|bizcochos|magdalena|magdalenas|tartaleta)\b/.test(text)) {
    return 'bakery';
  }

  // 6. Congelados (frozen)
  if (/\b(helado|helados|congelado|congelados|congelada|congeladas|guisantes\s+congelados|pizza|pizzas|nuggets|hielo)\b/.test(text)) {
    return 'frozen';
  }

  // 7. Especias, Condimentos, Aceites y Vinagres (spices) -> Pasillo: "Especias y Aceites"
  if (/\b(sal|pimienta|oregano|comino|pimenton|curry|canela|romero|tomillo|nuez\s+moscada|azafran|laurel|eneldo|vainilla|clavo|jengibre|curcuma|cardamomo|cayena|guindilla|pizca|aceite|aceites|oliva|virgen\s+extra|aove|girasol|sesamo|vinagre|vinagres|balsamico|modena)\b/.test(text)) {
    return 'spices';
  }

  // 8. Bebidas, Destilados y Licores (beverages)
  if (/\b(agua|cafe|cafes|te|infusion|infusiones|refresco|refrescos|cerveza|cervezas|vino|vinos|zumo|zumos|sidra|licor|licores|bebida|bebidas|champan|cava|tonica|whiskey|whisky|ron|vodka|ginebra|gin|tequila|vermut|vermouth|brandy|cognac|bourbon)\b/.test(text)) {
    return 'beverages';
  }

  // 9. Despensa, Pastas, Arroces, Legumbres, Salsas y Dulces (pantry)
  if (/\b(pasta|pastas|espaguetis|espagueti|macarrones|fideos|tallarines|raviolis|tortellini|lasana|gnocchi|arroz|arroces|basmati|quinoa|cuscus|cous\s*cous|avena|legumbre|legumbres|garbanzo|garbanzos|lenteja|lentejas|alubia|alubias|frijol|frijoles|azucar|miel|sirope|chocolate|chocolates|cacao|bombones|tomate\s+frito|tomate\s+triturado|conserva|conservas|lata|latas|caldo|caldos|salsa|salsas|soja|mayonesa|ketchup|mostaza|tabasco|pesto|mermelada|mermeladas|frutos\s+secos|nueces|nuez|almendras|almendra|avellanas|avellana|cacahuetes|cacahuete|pistachos|pistacho|anacardos|anacardo|pinones|pinon)\b/.test(text)) {
    return 'pantry';
  }

  // Check persistent online-resolved cache
  const cached = getCachedAisle(text);
  if (cached) return cached;

  return 'other';
}

// Persistent cache for background online ingredient classification
const AISLE_CACHE_KEY = 'fa_aisle_cache';
function getAisleCache() {
  try {
    return JSON.parse(localStorage.getItem(AISLE_CACHE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function getCachedAisle(normalizedText) {
  if (!normalizedText) return null;
  const cache = getAisleCache();
  return cache[normalizedText] || null;
}
function setCachedAisle(normalizedText, aisle) {
  if (!normalizedText || !aisle) return;
  try {
    const cache = getAisleCache();
    cache[normalizedText] = aisle;
    localStorage.setItem(AISLE_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

let _aisleLookupTimeout = null;
function resolveAisleOnline(rawName, callback) {
  if (!rawName || typeof rawName !== 'string') return;
  const norm = normalizeIngredientText(rawName);
  if (norm.length < 3) return;

  // 1. Direct local rule
  const localAisle = categorizeIngredientAisle(norm);
  if (localAisle && localAisle !== 'other') {
    if (typeof callback === 'function') callback(localAisle);
    return;
  }

  // 2. LocalStorage cache
  const cached = getCachedAisle(norm);
  if (cached) {
    if (typeof callback === 'function') callback(cached);
    return;
  }

  // 3. Debounced online lookup (600ms)
  if (_aisleLookupTimeout) clearTimeout(_aisleLookupTimeout);
  _aisleLookupTimeout = setTimeout(async () => {
    try {
      const cleanSearch = norm.replace(/^[\d\.,\/\s]+(?:g|kg|ml|cl|dl|l|cda|cdta|taza|vaso|ud|uds)?\s*(?:de\s+)?/i, '').trim();
      if (!cleanSearch) return;

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 4000) : null;
      const fetchOpts = controller ? { signal: controller.signal } : {};

      const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSearch)}`, fetchOpts);
      if (timer) clearTimeout(timer);

      if (res && res.ok) {
        const data = await res.json();
        const info = normalizeIngredientText(`${data.title || ''} ${data.description || ''} ${data.extract || ''}`);

        let resolved = 'other';
        if (/\b(bebida|alcohol|destilad|licor|vino|cerveza|fermentad|infusion)\b/.test(info)) {
          resolved = 'beverages';
        } else if (/\b(fruta|fruto|verdura|hortaliza|vegetal|tuberculo|hongo|seta|planta\s+herbacea)\b/.test(info)) {
          resolved = 'produce';
        } else if (/\b(carne|pescado|ave|embutido|marisco|molusco|crustaceo|mamifero)\b/.test(info)) {
          resolved = 'meat';
        } else if (/\b(lacteo|queso|leche|yogur|mantequilla)\b/.test(info)) {
          resolved = 'dairy';
        } else if (/\b(pan|harina|bollo|galleta|trigo|cereal|masa|pastel)\b/.test(info)) {
          resolved = 'bakery';
        } else if (/\b(especia|condimento|aderezo|aceite|vinagre)\b/.test(info)) {
          resolved = 'spices';
        } else if (/\b(grano|semilla|legumbre|arroz|pasta|conserva|despensa)\b/.test(info)) {
          resolved = 'pantry';
        }

        if (resolved !== 'other') {
          setCachedAisle(norm, resolved);
          if (typeof callback === 'function') callback(resolved);
        }
      }
    } catch (e) {
      // Best-effort lookup, silent failure
    }
  }, 600);
}

function getIngredientIcon(name, aisle) {
  const norm = normalizeIngredientText(name);
  if (/\b(manzana|manzanas|pera|peras|platano|platanos|banana|fresa|fresas|fresones|fruta|frutas|arandano|arandanos|frambuesa|frambuesas|naranja|naranjas|mandarina|mandarinas|limon|limones|lima|melon|sandia|kiwi|kiwis|uva|uvas|mango|albaricoque|ciruela|ciruelas)\b/.test(norm)) {
    return 'nutrition';
  }
  if (/\b(pollo|pollos|pechuga|muslo|muslos|alitas|pavo|conejo)\b/.test(norm)) {
    return 'kebab_dining';
  }
  if (/\b(ternera|vaca|buey|cerdo|hamburguesa|hamburguesas|filete|filetes|solomillo|lomo|costilla|costillas|chuleta|chuletas|carne|carnes|bacon|panceta|jamon)\b/.test(norm)) {
    return 'dinner_dining';
  }
  if (/\b(pescado|pescados|salmon|merluza|atun|bonito|bacalao|dorada|lubina|trucha|sardina|sardinas|boqueron|boquerones|gamba|gambas|langostino|langostinos|calamar|calamares|pulpo|mejillon|mejillones|almeja|almejas)\b/.test(norm)) {
    return 'set_meal';
  }
  if (/\b(huevo|huevos|clara|claras|yema|yemas)\b/.test(norm)) {
    return 'egg';
  }
  if (/\b(leche|yogur|nata|mantequilla|crema)\b/.test(norm)) {
    return 'water_drop';
  }
  if (/\b(queso|quesos|parmesano|mozzarella|cheddar|feta|ricotta|gouda)\b/.test(norm)) {
    return 'bakery_dining';
  }
  if (/\b(pan|panes|baguette|tostada|tostadas|croissant|bollo|bizcocho|galleta|galletas|harina|masa|hojaldre)\b/.test(norm)) {
    return 'bakery_dining';
  }
  if (/\b(pasta|espaguetis|macarrones|fideos|tallarines|arroz|quinoa|avena)\b/.test(norm)) {
    return 'dinner_dining';
  }
  if (/\b(cafe|te|infusion|refresco|zumo|zumos)\b/.test(norm)) {
    return 'local_cafe';
  }
  if (/\b(vino|cerveza|cervezas|sidra|licor|licores|cava|whiskey|whisky|ron|vodka|ginebra|gin|tequila|vermut|brandy)\b/.test(norm)) {
    return 'liquor';
  }
  if (/\b(chocolate|chocolates|cacao|bombones)\b/.test(norm)) {
    return 'cookie';
  }
  if (/\b(helado|helados|hielo|congelado|congelados|pizza|pizzas)\b/.test(norm)) {
    return 'ac_unit';
  }
  if (/\b(aceite|oliva|vinagre|salsa|salsas|mayonesa|ketchup|mostaza|soja|pesto|caldo)\b/.test(norm)) {
    return 'soup_kitchen';
  }
  if (/\b(sal|pimienta|oregano|comino|curry|pimenton|canela|especias|romero|tomillo|azafran)\b/.test(norm)) {
    return 'grain';
  }
  if (/\b(tomate|tomates|cebolla|cebollas|ajo|ajos|patata|patatas|papa|papas|aguacate|aguacates|espinaca|espinacas|lechuga|zanahoria|zanahorias|pimiento|pimientos|calabacin|pepino|champinon|champinones|seta|setas|brocoli|calabaza|guisante|guisantes)\b/.test(norm)) {
    return 'eco';
  }
  const detectedAisle = aisle || categorizeIngredientAisle(name);
  return AISLE_METADATA[detectedAisle]?.icon || AISLE_METADATA.other.icon;
}

const COMMON_INGREDIENTS = [
  // Frutas y verduras (produce)
  { name: 'Aguacate', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Ajo', aisle: 'produce', defaultUnit: 'dientes', icon: 'eco' },
  { name: 'Albahaca fresca', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Alcachofas', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Apio', aisle: 'produce', defaultUnit: 'ramas', icon: 'eco' },
  { name: 'Arándanos frescos', aisle: 'produce', defaultUnit: 'g', icon: 'nutrition' },
  { name: 'Berenjena', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Brócoli', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Calabacín', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Calabaza', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Canónigos', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Cebolla', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Cebolla morada', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Champiñones', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Cilantro fresco', aisle: 'produce', defaultUnit: 'ramas', icon: 'eco' },
  { name: 'Coliflor', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Espárragos trigueros', aisle: 'produce', defaultUnit: 'manojo', icon: 'eco' },
  { name: 'Espinacas frescas', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Fresas', aisle: 'produce', defaultUnit: 'g', icon: 'nutrition' },
  { name: 'Guisantes', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Hierbabuena fresca', aisle: 'produce', defaultUnit: 'hojas', icon: 'eco' },
  { name: 'Judías verdes', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Kiwi', aisle: 'produce', defaultUnit: 'ud', icon: 'nutrition' },
  { name: 'Lechuga', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Lima', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Limón', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Mandarinas', aisle: 'produce', defaultUnit: 'kg', icon: 'nutrition' },
  { name: 'Manzanas', aisle: 'produce', defaultUnit: 'kg', icon: 'nutrition' },
  { name: 'Melocotón', aisle: 'produce', defaultUnit: 'ud', icon: 'nutrition' },
  { name: 'Melón', aisle: 'produce', defaultUnit: 'ud', icon: 'nutrition' },
  { name: 'Naranjas', aisle: 'produce', defaultUnit: 'kg', icon: 'nutrition' },
  { name: 'Patatas', aisle: 'produce', defaultUnit: 'kg', icon: 'eco' },
  { name: 'Pepino', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Pera', aisle: 'produce', defaultUnit: 'kg', icon: 'nutrition' },
  { name: 'Perejil fresco', aisle: 'produce', defaultUnit: 'ramas', icon: 'eco' },
  { name: 'Pimiento rojo', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Pimiento verde', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Plátanos', aisle: 'produce', defaultUnit: 'kg', icon: 'nutrition' },
  { name: 'Puerro', aisle: 'produce', defaultUnit: 'ud', icon: 'eco' },
  { name: 'Rúcula', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Sandía', aisle: 'produce', defaultUnit: 'ud', icon: 'nutrition' },
  { name: 'Setas variadas', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Tomates cherry', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },
  { name: 'Tomates maduros', aisle: 'produce', defaultUnit: 'kg', icon: 'eco' },
  { name: 'Zanahorias', aisle: 'produce', defaultUnit: 'g', icon: 'eco' },

  // Carnes y pescados (meat)
  { name: 'Almejas', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Atún fresco', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Bacalao', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Bacon / Panceta', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Calamares', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Carne picada mixta', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Chorizo', aisle: 'meat', defaultUnit: 'ud', icon: 'dinner_dining' },
  { name: 'Costillas de cerdo', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Dorada', aisle: 'meat', defaultUnit: 'ud', icon: 'set_meal' },
  { name: 'Filetes de ternera', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Gambas / Langostinos', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Hamburguesas', aisle: 'meat', defaultUnit: 'ud', icon: 'dinner_dining' },
  { name: 'Jamón serrano', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Lomo de cerdo', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Lubina', aisle: 'meat', defaultUnit: 'ud', icon: 'set_meal' },
  { name: 'Mejillones', aisle: 'meat', defaultUnit: 'kg', icon: 'set_meal' },
  { name: 'Merluza', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Muslos de pollo', aisle: 'meat', defaultUnit: 'ud', icon: 'kebab_dining' },
  { name: 'Pavo en lonchas', aisle: 'meat', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Pechuga de pavo', aisle: 'meat', defaultUnit: 'g', icon: 'kebab_dining' },
  { name: 'Pechuga de pollo', aisle: 'meat', defaultUnit: 'g', icon: 'kebab_dining' },
  { name: 'Pulpo', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Salchichas', aisle: 'meat', defaultUnit: 'paquete', icon: 'dinner_dining' },
  { name: 'Salmón fresco', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },
  { name: 'Sardinas', aisle: 'meat', defaultUnit: 'g', icon: 'set_meal' },

  // Lácteos y huevos (dairy)
  { name: 'Huevos', aisle: 'dairy', defaultUnit: 'ud', icon: 'egg' },
  { name: 'Leche entera', aisle: 'dairy', defaultUnit: 'l', icon: 'water_drop' },
  { name: 'Leche desnatada', aisle: 'dairy', defaultUnit: 'l', icon: 'water_drop' },
  { name: 'Leche semidesnatada', aisle: 'dairy', defaultUnit: 'l', icon: 'water_drop' },
  { name: 'Mantequilla', aisle: 'dairy', defaultUnit: 'g', icon: 'water_drop' },
  { name: 'Nata para cocinar', aisle: 'dairy', defaultUnit: 'ml', icon: 'water_drop' },
  { name: 'Queso Cheddar', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Queso Feta', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Queso Mozzarella', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Queso Parmesano', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Queso crema', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Queso rallado', aisle: 'dairy', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Yogur griego', aisle: 'dairy', defaultUnit: 'ud', icon: 'water_drop' },
  { name: 'Yogur natural', aisle: 'dairy', defaultUnit: 'ud', icon: 'water_drop' },

  // Despensa y básicos (pantry)
  { name: 'Arroz basmati', aisle: 'pantry', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Arroz redondo', aisle: 'pantry', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Atún en lata', aisle: 'pantry', defaultUnit: 'latas', icon: 'set_meal' },
  { name: 'Avena en copos', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Azúcar blanco', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Azúcar moreno', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Cacao en polvo', aisle: 'pantry', defaultUnit: 'g', icon: 'cookie' },
  { name: 'Caldo de pollo', aisle: 'pantry', defaultUnit: 'l', icon: 'soup_kitchen' },
  { name: 'Caldo de verduras', aisle: 'pantry', defaultUnit: 'l', icon: 'soup_kitchen' },
  { name: 'Chocolate negro', aisle: 'pantry', defaultUnit: 'tableta', icon: 'cookie' },
  { name: 'Espaguetis', aisle: 'pantry', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Garbanzos cocidos', aisle: 'pantry', defaultUnit: 'bote', icon: 'grain' },
  { name: 'Lentejas cocidas', aisle: 'pantry', defaultUnit: 'bote', icon: 'grain' },
  { name: 'Macarrones / Penne', aisle: 'pantry', defaultUnit: 'g', icon: 'dinner_dining' },
  { name: 'Mayonesa', aisle: 'pantry', defaultUnit: 'bote', icon: 'soup_kitchen' },
  { name: 'Miel', aisle: 'pantry', defaultUnit: 'g', icon: 'soup_kitchen' },
  { name: 'Mostaza Dijon', aisle: 'pantry', defaultUnit: 'bote', icon: 'soup_kitchen' },
  { name: 'Nueces', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Piñones', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Quinoa', aisle: 'pantry', defaultUnit: 'g', icon: 'grain' },
  { name: 'Salsa de soja', aisle: 'pantry', defaultUnit: 'ml', icon: 'soup_kitchen' },
  { name: 'Salsa de tomate / Tomate frito', aisle: 'pantry', defaultUnit: 'g', icon: 'soup_kitchen' },
  { name: 'Tomate triturado', aisle: 'pantry', defaultUnit: 'lata', icon: 'soup_kitchen' },

  // Panadería y masas (bakery)
  { name: 'Bizcocho', aisle: 'bakery', defaultUnit: 'ud', icon: 'bakery_dining' },
  { name: 'Galletas María', aisle: 'bakery', defaultUnit: 'paquete', icon: 'bakery_dining' },
  { name: 'Harina de trigo', aisle: 'bakery', defaultUnit: 'g', icon: 'bakery_dining' },
  { name: 'Levadura química (Royal)', aisle: 'bakery', defaultUnit: 'sobre', icon: 'bakery_dining' },
  { name: 'Masa de hojaldre', aisle: 'bakery', defaultUnit: 'placa', icon: 'bakery_dining' },
  { name: 'Masa de pizza', aisle: 'bakery', defaultUnit: 'ud', icon: 'bakery_dining' },
  { name: 'Pan de barra', aisle: 'bakery', defaultUnit: 'ud', icon: 'bakery_dining' },
  { name: 'Pan de molde', aisle: 'bakery', defaultUnit: 'paquete', icon: 'bakery_dining' },
  { name: 'Placas de lasaña', aisle: 'bakery', defaultUnit: 'placas', icon: 'bakery_dining' },
  { name: 'Tortillas de trigo (Fajitas)', aisle: 'bakery', defaultUnit: 'paquete', icon: 'bakery_dining' },

  // Especias, aceites y condimentos (spices)
  { name: 'Aceite de oliva virgen extra', aisle: 'spices', defaultUnit: 'ml', icon: 'soup_kitchen' },
  { name: 'Aceite de girasol', aisle: 'spices', defaultUnit: 'ml', icon: 'soup_kitchen' },
  { name: 'Canela en polvo', aisle: 'spices', defaultUnit: 'cda', icon: 'grain' },
  { name: 'Comino en polvo', aisle: 'spices', defaultUnit: 'cda', icon: 'grain' },
  { name: 'Curry en polvo', aisle: 'spices', defaultUnit: 'g', icon: 'grain' },
  { name: 'Laurel en hoja', aisle: 'spices', defaultUnit: 'hojas', icon: 'grain' },
  { name: 'Nuez moscada', aisle: 'spices', defaultUnit: 'pizca', icon: 'grain' },
  { name: 'Orégano seco', aisle: 'spices', defaultUnit: 'cda', icon: 'grain' },
  { name: 'Pimentón dulce de la Vera', aisle: 'spices', defaultUnit: 'cda', icon: 'grain' },
  { name: 'Pimienta negra molida', aisle: 'spices', defaultUnit: 'g', icon: 'grain' },
  { name: 'Romero seco', aisle: 'spices', defaultUnit: 'ramas', icon: 'grain' },
  { name: 'Sal fina', aisle: 'spices', defaultUnit: 'g', icon: 'grain' },
  { name: 'Sal gorda / marina', aisle: 'spices', defaultUnit: 'g', icon: 'grain' },
  { name: 'Tomillo seco', aisle: 'spices', defaultUnit: 'cda', icon: 'grain' },
  { name: 'Vinagre de manzana', aisle: 'spices', defaultUnit: 'ml', icon: 'soup_kitchen' },
  { name: 'Vinagre de Módena', aisle: 'spices', defaultUnit: 'ml', icon: 'soup_kitchen' },

  // Congelados (frozen)
  { name: 'Guisantes congelados', aisle: 'frozen', defaultUnit: 'g', icon: 'ac_unit' },
  { name: 'Helado', aisle: 'frozen', defaultUnit: 'tarrina', icon: 'ac_unit' },
  { name: 'Hielo', aisle: 'frozen', defaultUnit: 'bolsa', icon: 'ac_unit' },
  { name: 'Pizza congelada', aisle: 'frozen', defaultUnit: 'ud', icon: 'ac_unit' },

  // Bebidas (beverages)
  { name: 'Agua mineral', aisle: 'beverages', defaultUnit: 'botella', icon: 'local_cafe' },
  { name: 'Café molido o en grano', aisle: 'beverages', defaultUnit: 'paquete', icon: 'local_cafe' },
  { name: 'Cerveza', aisle: 'beverages', defaultUnit: 'latas', icon: 'liquor' },
  { name: 'Refresco', aisle: 'beverages', defaultUnit: 'latas', icon: 'local_cafe' },
  { name: 'Té verde / Infusiones', aisle: 'beverages', defaultUnit: 'caja', icon: 'local_cafe' },
  { name: 'Vino blanco', aisle: 'beverages', defaultUnit: 'botella', icon: 'liquor' },
  { name: 'Vino tinto', aisle: 'beverages', defaultUnit: 'botella', icon: 'liquor' },
  { name: 'Whiskey / Whisky', aisle: 'beverages', defaultUnit: 'ml', icon: 'liquor' },
  { name: 'Zumo de naranja', aisle: 'beverages', defaultUnit: 'l', icon: 'local_cafe' }
];

function getIngredientSuggestions(query, max = 6, extraItems = []) {
  if (!query || typeof query !== 'string') return [];
  const qNorm = normalizeIngredientText(query);
  if (!qNorm) return [];

  const all = [...COMMON_INGREDIENTS];
  if (Array.isArray(extraItems)) {
    extraItems.forEach(item => {
      if (item && item.name && !all.some(c => normalizeIngredientText(c.name) === normalizeIngredientText(item.name))) {
        all.push({
          name: item.name,
          aisle: item.aisle || categorizeIngredientAisle(item.name),
          defaultUnit: item.unit || 'ud',
          icon: getIngredientIcon(item.name, item.aisle)
        });
      }
    });
  }

  const prefixMatches = [];
  const containsMatches = [];

  for (const item of all) {
    const itemNorm = normalizeIngredientText(item.name);
    if (itemNorm.startsWith(qNorm)) {
      prefixMatches.push(item);
    } else if (itemNorm.includes(qNorm)) {
      containsMatches.push(item);
    }
  }

  return [...prefixMatches, ...containsMatches].slice(0, max);
}

// ==========================================================================
// STEP TIMER AUTO-DETECTION (US-61 & UX)
// ==========================================================================
function extractTimerFromStepText(text) {
  if (!text || typeof text !== 'string') return 0;
  
  // Try RecipeParser.extractTimerMinutes if available
  if (typeof RecipeParser !== 'undefined' && typeof RecipeParser.extractTimerMinutes === 'function') {
    const pVal = RecipeParser.extractTimerMinutes(text);
    if (pVal && pVal > 0) return pVal;
  }

  const clean = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Horas y minutos: ej. "1 hora y media", "1 hora y 20 minutos", "1 h 30 min", "2 horas"
  const hrAndMinMatch = clean.match(/(\d+)\s*(?:horas?|h)\s*(?:y\s*)?(?:(\d+)\s*(?:minutos?|mins?|min)?|media\s*hora)?/i);
  if (hrAndMinMatch) {
    const hours = parseInt(hrAndMinMatch[1], 10) || 0;
    let mins = 0;
    if (hrAndMinMatch[2]) {
      mins = parseInt(hrAndMinMatch[2], 10) || 0;
    } else if (clean.includes('y media')) {
      mins = 30;
    } else if (clean.includes('y cuarto')) {
      mins = 15;
    }
    return (hours * 60) + mins;
  }

  // 2. Expresiones verbales comunes: "media hora", "cuarto de hora"
  if (/\bmedia\s+hora\b/i.test(clean)) return 30;
  if (/\b(?:un\s+)?cuarto\s+de\s+hora\b/i.test(clean)) return 15;

  // 3. Rango de minutos: "6/7 minutos", "6-7 minutos", "9-10 min", "15 a 20 minutos"
  const rangeMatch = clean.match(/(\d+)\s*(?:[\/\-]|(?:a\s+))\s*(\d+)\s*(?:minutos?|mins?|min|m)\b/i);
  if (rangeMatch) {
    return parseInt(rangeMatch[2], 10) || parseInt(rangeMatch[1], 10) || 0;
  }

  // 4. Minutos simples: "40 minutos", "15 min", "5 mins", "20 m"
  const minMatch = clean.match(/(\d+)\s*(?:minutos?|mins?|min)\b/i);
  if (minMatch) {
    return parseInt(minMatch[1], 10) || 0;
  }

  return 0;
}

// ==========================================================================
// DATE & CALENDAR UTILS (ISO 8601 & LOCAL DATES) - US-05, US-22, BUG-07
// ==========================================================================
const DAYS_OF_WEEK_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function toLocalDateKey(date) {
  const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDateKey(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return new Date();
  const parts = dateStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

/**
 * Returns Monday (00:00:00 local time) of the ISO 8601 week containing `date`.
 * In ISO 8601, Monday is the first day of the week (day 1), Sunday is day 7.
 */
function getMondayOfWeek(date) {
  const d = date ? (date instanceof Date ? new Date(date) : new Date(date)) : new Date();
  const day = d.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff, 0, 0, 0, 0);
  return monday;
}

/**
 * Returns the 7 days of the ISO 8601 week for a given reference date.
 */
function getWeekDates(referenceDate) {
  const monday = getMondayOfWeek(referenceDate);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, 0, 0, 0, 0);
    week.push({
      date: d,
      dateKey: toLocalDateKey(d),
      dayName: DAYS_OF_WEEK_ES[i],
      isWeekend: i >= 5
    });
  }
  return week;
}

/**
 * Formats a week range in Spanish, e.g. "19 oct – 25 oct 2026"
 */
function formatWeekRange(weekDays) {
  if (!weekDays || weekDays.length !== 7) return '';
  const start = weekDays[0].date;
  const end = weekDays[6].date;
  const startDay = start.getDate();
  const startMonth = MONTHS_SHORT_ES[start.getMonth()];
  const endDay = end.getDate();
  const endMonth = MONTHS_SHORT_ES[end.getMonth()];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
}

/**
 * US-45: Generador de identificadores únicos universales con crypto.randomUUID()
 * y soporte resiliente para entornos sin soporte nativo o tests.
 */
function generateId(prefix = '') {
  let uuid = '';
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      uuid = crypto.randomUUID();
    } catch (e) {
      uuid = '';
    }
  }
  if (!uuid) {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      arr[6] = (arr[6] & 0x0f) | 0x40;
      arr[8] = (arr[8] & 0x3f) | 0x80;
      const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
      uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
    } else {
      uuid = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
    }
  }
  return prefix ? `${prefix}${uuid}` : uuid;
}

// Application State Store (Local First + Cloud Sync)
class StateStore {
  constructor() {
    // Registro de borrados para propagación a Supabase (BUG-23)
    this.deletedRecords = this.load('fa_deleted_records', {
      recipes: [],
      mealPlans: [],
      shoppingItems: []
    });

    let savedRecipes = this.load('fa_recipes', null);
    if (!savedRecipes) {
      savedRecipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
      try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) {}
    } else {
      const seeded = localStorage.getItem('fa_recipes_seeded');
      if (seeded !== 'v8') {
        // Migración única a v8 para usuarios antiguos, respetando borrados del usuario
        SEED_RECIPES.forEach(seed => {
          if (!savedRecipes.some(r => r.id === seed.id) && !this.deletedRecords.recipes?.includes(seed.id)) {
            savedRecipes.push(seed);
          }
        });
        try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) {}
      }
    }
    if (Array.isArray(savedRecipes)) {
      savedRecipes.forEach(r => {
        if (!r.createdAt && r.updatedAt) {
          r.createdAt = r.updatedAt;
        }
      });
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
        if (!day.dayName && dateKey) {
          const parts = dateKey.split('-').map(Number);
          if (parts.length === 3) {
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            const dayIdx = (d.getDay() + 6) % 7;
            day.dayName = DAYS_OF_WEEK_ES[dayIdx] || 'Día';
          }
        }
      });
      this.mealPlan = loadedPlan;
    } else {
      this.mealPlan = this.generateInitialMealPlan();
    }

    this.shoppingList = this.load('fa_shopping', []);
    // US-45 & BUG-23: Migración transparente para asegurar que todo artículo tenga id
    if (Array.isArray(this.shoppingList)) {
      let migrated = false;
      this.shoppingList.forEach(item => {
        if (!item.id) {
          item.id = generateId('shop-');
          migrated = true;
        }
      });
      if (migrated) this.save('fa_shopping', this.shoppingList);
    }

    this.settings = this.load('fa_settings', {
      geminiApiKey: '',
      defaultServings: 2,
      geminiModel: 'gemini-2.5-flash'
    });
    this.dietaryPreferences = this.load('fa_dietary_preferences', []);
    this.customTags = this.load('fa_custom_tags', []);
    this.theme = localStorage.getItem('fa_theme_mode') || 'light';
    this.cloudUser = this.load('fa_cloud_user', null);
    this.supabaseConfig = {
      url: window.APP_CONFIG?.supabaseUrl || localStorage.getItem('fa_sb_url') || '',
      anonKey: window.APP_CONFIG?.supabaseAnonKey || localStorage.getItem('fa_sb_key') || ''
    };
    this.lastSyncedAt = localStorage.getItem('fa_last_sync') || null;
  }

  saveDietaryPreferences(prefs) {
    this.dietaryPreferences = Array.isArray(prefs) ? prefs : [];
    this.save('fa_dietary_preferences', this.dietaryPreferences);
  }

  addCustomTag(tag) {
    if (!tag || typeof tag !== 'string') return;
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!Array.isArray(this.customTags)) this.customTags = [];
    if (!this.customTags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      this.customTags.push(trimmed);
      this.save('fa_custom_tags', this.customTags);
    }
  }

  getAllTags() {
    const tagSet = new Set();
    ALL_PREDEFINED_TAGS.forEach(t => tagSet.add(t));
    (this.customTags || []).forEach(t => tagSet.add(t));
    (this.recipes || []).forEach(r => {
      if (Array.isArray(r.tags)) {
        r.tags.forEach(t => {
          if (t && typeof t === 'string' && t.trim()) tagSet.add(t.trim());
        });
      }
    });
    return Array.from(tagSet);
  }

  trackDeletion(entityType, id) {
    if (!id) return;
    if (!this.deletedRecords[entityType]) this.deletedRecords[entityType] = [];
    if (!this.deletedRecords[entityType].includes(id)) {
      this.deletedRecords[entityType].push(id);
      this.save('fa_deleted_records', this.deletedRecords);
    }
  }

  clearDeletedRecords(entityType, ids) {
    if (!this.deletedRecords[entityType] || !ids || ids.length === 0) return;
    this.deletedRecords[entityType] = this.deletedRecords[entityType].filter(id => !ids.includes(id));
    this.save('fa_deleted_records', this.deletedRecords);
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

  getDayPlan(dateStr, fallbackDayName) {
    if (!this.mealPlan[dateStr]) {
      let dayName = fallbackDayName;
      if (!dayName && dateStr) {
        const parts = dateStr.split('-').map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const dayIdx = (d.getDay() + 6) % 7;
          dayName = DAYS_OF_WEEK_ES[dayIdx] || 'Día';
        }
      }
      this.mealPlan[dateStr] = {
        dayName: dayName || 'Día',
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null,
        customSlots: []
      };
    } else {
      const day = this.mealPlan[dateStr];
      if (!day.dayName && dateStr) {
        const parts = dateStr.split('-').map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const dayIdx = (d.getDay() + 6) % 7;
          day.dayName = DAYS_OF_WEEK_ES[dayIdx] || 'Día';
        }
      }
      if (!Array.isArray(day.customSlots)) day.customSlots = [];
    }
    return this.mealPlan[dateStr];
  }

  generateInitialMealPlan() {
    const plan = {};
    const weekDays = getWeekDates(new Date());
    const todayKey = toLocalDateKey(new Date());

    weekDays.forEach((w, i) => {
      plan[w.dateKey] = {
        dayName: w.dayName,
        breakfast: (i === 0 || w.dateKey === todayKey) ? "rec-avocado-toast" : (i === 1 ? "rec-porridge-bowl" : null),
        lunch: (i === 0 || w.dateKey === todayKey) ? "rec-pesto-pasta" : (i === 1 ? "rec-lemon-chicken" : null),
        snack: (i === 0 || w.dateKey === todayKey) ? "rec-healthy-snack" : null,
        dinner: (i === 0 || w.dateKey === todayKey) ? "rec-salmon-bowl" : (i === 1 ? "rec-chickpea-salad" : null),
        customSlots: []
      };
    });
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
    return categorizeIngredientAisle(ingredientName);
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
    // e.g. "lo que nos llevará unos 18-20 minutos", "durante 15 minutos", "hornear 45 min", "programa 8 minutos"
    const primaryRegex = /(?:durante(?:\s+toda\s+la\s+cocc?i[o\u00F3]n)?|llevar[aá]\s*(?:unos?)?|cocer|cocinar|hornear|hervir|sofre[ií]r|pochar|dorar|reducir|remojo|reposar|programa|programar)\s+(?:unos?\s+)?(\d+(?:\s*(?:[-–—]|a|o)\s*\d+)?)\s*(minutos?|min|horas?|h\b)/gi;
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
      id: generateId('ing-'),
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
          if (!imageUrl || this.isBadImage(imageUrl)) {
            imageUrl = this.extractImageFromHtml(html);
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

  extractImageFromHtml(html) {
    if (!html || typeof html !== 'string') return '';
    
    // 1. OpenGraph image (og:image)
    const ogMatch = html.match(/<meta\s+[^>]*property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i);
    if (ogMatch && ogMatch[1] && !this.isBadImage(ogMatch[1])) {
      return this.cleanImageUrl(ogMatch[1]);
    }

    // 2. Twitter Card image (twitter:image)
    const twMatch = html.match(/<meta\s+[^>]*name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i);
    if (twMatch && twMatch[1] && !this.isBadImage(twMatch[1])) {
      return this.cleanImageUrl(twMatch[1]);
    }

    // 3. Schema.org / Microdata image link
    const schemaImgMatch = html.match(/<meta\s+[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<link\s+[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i);
    if (schemaImgMatch && schemaImgMatch[1] && !this.isBadImage(schemaImgMatch[1])) {
      return this.cleanImageUrl(schemaImgMatch[1]);
    }

    // 4. In DOM if available (featured image, post thumbnail, recipe image)
    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgCandidates = doc.querySelectorAll('.post-thumbnail img, .featured-image img, .entry-content img, .recipe-image img, article img');
        for (const img of imgCandidates) {
          const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || '';
          if (src && !this.isBadImage(src)) {
            return this.cleanImageUrl(src);
          }
        }
      } catch (e) {}
    }

    return '';
  },

  isBadImage(url) {
    if (!url) return true;
    return /150_150|avatar|guest_user|author|logo|icon|favicon|98x98|16x16|32x32|gravatar|pixel\.gif|blank\.gif|emoji/i.test(url);
  },

  cleanImageUrl(url) {
    if (!url) return '';
    return url.replace(/&amp;/g, '&').trim();
  },

  detectRobotFeatures(recipe) {
    if (!recipe) return;
    const fullText = ((recipe.title || '') + ' ' + (recipe.instructions || []).map(i => i.text).join(' ')).toLowerCase();
    const isRobot = /\b(?:varoma|velocidad\s+(?:cuchara|\d+)|giro\s+(?:a\s+la\s+izquierda|inverso)|cubilete|mariposa|cestillo|thermomix|tm\s*[356]\d*|mambo|robot\s+de\s+cocina)\b/i.test(fullText);
    if (isRobot) {
      if (!Array.isArray(recipe.tags)) recipe.tags = [];
      if (!recipe.tags.includes('Robot de Cocina')) {
        recipe.tags.push('Robot de Cocina');
      }
      if (/\b(?:thermomix|tm\s*[356]\d*)\b/i.test(fullText) && !recipe.tags.includes('Thermomix')) {
        recipe.tags.push('Thermomix');
      }
      if (/\bmambo\b/i.test(fullText) && !recipe.tags.includes('Mambo')) {
        recipe.tags.push('Mambo');
      }
    }
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

    const recipe = {
      id: generateId('rec-'),
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
    this.detectRobotFeatures(recipe);
    return recipe;
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

    // Extract first valid food image from HTML / OpenGraph or markdown
    let candidateImage = this.extractImageFromHtml(rawText);
    if (!candidateImage) {
      const imgMatches = trimmed.matchAll(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g);
      for (const m of imgMatches) {
        const url = m[1];
        if (!this.isBadImage(url)) {
          candidateImage = url;
          break;
        }
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
    const recipe = {
      id: generateId('rec-'),
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
    this.detectRobotFeatures(recipe);
    return recipe;
  }
};

if (typeof window !== 'undefined') {
  window.RecipeParser = RecipeParser;
  window.APP_VERSION = 'v0.49';
  window.generateId = generateId;
  window.toLocalDateKey = toLocalDateKey;
  window.parseLocalDateKey = parseLocalDateKey;
  window.getMondayOfWeek = getMondayOfWeek;
  window.getWeekDates = getWeekDates;
  window.formatWeekRange = formatWeekRange;
  window.DAYS_OF_WEEK_ES = DAYS_OF_WEEK_ES;
  window.normalizeIngredientText = normalizeIngredientText;
  window.categorizeIngredientAisle = categorizeIngredientAisle;
  window.getIngredientIcon = getIngredientIcon;
  window.COMMON_INGREDIENTS = COMMON_INGREDIENTS;
  window.getIngredientSuggestions = getIngredientSuggestions;
  window.extractTimerFromStepText = extractTimerFromStepText;
  window.resolveAisleOnline = resolveAisleOnline;
  window.getCachedAisle = getCachedAisle;
  window.setCachedAisle = setCachedAisle;
  window.PREDEFINED_DIETARY_TAGS = PREDEFINED_DIETARY_TAGS;
  window.DIETARY_TAG_EMOJIS = DIETARY_TAG_EMOJIS;
  window.getDietaryTagEmoji = getDietaryTagEmoji;
  window.PREDEFINED_OCCASION_TAGS = PREDEFINED_OCCASION_TAGS;
  window.PREDEFINED_PRACTICAL_TAGS = PREDEFINED_PRACTICAL_TAGS;
  window.ALL_PREDEFINED_TAGS = ALL_PREDEFINED_TAGS;
  window.checkDietaryCompliance = checkDietaryCompliance;
  window.analyzeAndInferRecipeTags = analyzeAndInferRecipeTags;
}

// UI Controller
class FoodAssistantApp {
  constructor() {
    this.appVersion = 'v0.49';
    this.activeView = 'view-today';
    this.activeRecipe = null;
    this.activeServings = 2;
    this.pickerTarget = null;
    this.plannerWeekOffset = 0; // 0: current week, -1: previous, +1: next (US-05)
    this.selectedRecipeTags = new Set();
    this.editorSelectedTags = new Set();
    this.pickerOnlyDietary = false;
    
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
    this.modalRecipeAddChoice = document.getElementById('modal-recipe-add-choice');
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
  // US-35 / BUG-21-24: CLOUD AUTH & SUPABASE BIDIRECTIONAL SYNC ENGINE
  // ==========================================================================
  initSupabaseClient() {
    this.syncDebounceTimer = null;
    const rawUrl = state.supabaseConfig.url || '';
    const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    const cleanKey = (state.supabaseConfig.anonKey || '').trim();

    if (window.supabase && cleanUrl && cleanKey) {
      try {
        this.supabaseClient = window.supabase.createClient(cleanUrl, cleanKey);

        // Check active session (including after Google OAuth redirect)
        this.supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
          if (session?.user && !error) {
            state.cloudUser = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              id: session.user.id,
              provider: session.user.app_metadata?.provider || 'email'
            };
            state.save('fa_cloud_user', state.cloudUser);
            this.updateUserAccountUI();
            // US-35: Descarga y sincronización automática al abrir la app con sesión activa
            this.syncDataWithCloud(true);
          }
        }).catch(err => console.warn("Supabase session check error:", err));

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

    // US-35: Resiliencia Local-First y recuperación de conexión offline
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateSyncIndicator('Conexión reanudada. Sincronizando...', 'syncing');
        this.syncDataWithCloud(true);
      });
      window.addEventListener('offline', () => {
        this.updateSyncIndicator('Sin conexión (modo local)', 'warning');
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushSync();
        }
      });
      window.addEventListener('pagehide', () => {
        this.flushSync();
      });
    }
  }

  updateSyncIndicator(message, status = 'default') {
    const indicator = document.getElementById('sync-status-indicator');
    const syncNowBtn = document.getElementById('btn-sync-now');
    if (indicator) {
      indicator.textContent = message;
      if (status === 'error') {
        indicator.style.color = 'var(--m3-error, #dc2626)';
        indicator.style.backgroundColor = 'var(--m3-error-container, #ffdad6)';
      } else if (status === 'success') {
        indicator.style.color = 'var(--color-brand, #16a34a)';
        indicator.style.backgroundColor = 'var(--color-brand-container, #c4eed0)';
      } else if (status === 'syncing') {
        indicator.style.color = 'var(--m3-primary, #0284c7)';
        indicator.style.backgroundColor = 'var(--m3-primary-container, #d3e3fd)';
      } else {
        indicator.style.color = 'var(--m3-on-surface-variant)';
        indicator.style.backgroundColor = 'var(--m3-surface-container-high)';
      }
    }
    if (syncNowBtn) {
      syncNowBtn.classList.toggle('btn-syncing', status === 'syncing');
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
    const syncNowBtn = document.getElementById('btn-sync-now');
    const syncIndicator = document.getElementById('sync-status-indicator');

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
      if (settingsName) settingsName.textContent = user.name || user.email.split('@')[0];
      if (settingsStatus) {
        settingsStatus.textContent = user.email;
      }
      if (settingsAuthBtn) settingsAuthBtn.textContent = 'Ver Cuenta';
      if (syncNowBtn) syncNowBtn.style.display = 'inline-flex';
      if (state.lastSyncedAt && syncIndicator && !syncIndicator.textContent) {
        this.updateSyncIndicator(`Sincronizado a las ${new Date(state.lastSyncedAt).toLocaleTimeString()}`, 'success');
      }

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
      if (syncNowBtn) syncNowBtn.style.display = 'none';
      this.updateSyncIndicator('');

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

          // BUG-20: Si Supabase exige confirmar email, data.session es null
          if (data?.user && !data?.session) {
            if (errBox) {
              errBox.style.color = 'var(--m3-primary)';
              errBox.textContent = "Revisa tu correo para confirmar la cuenta antes de iniciar sesión.";
              errBox.style.display = 'block';
            }
            return;
          }
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
          errBox.style.color = 'var(--m3-error)';
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
        id: generateId('usr_'),
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
      const demoEmail = prompt("Acceso con cuenta de Google. Introduce tu correo de Google:", "usuario@gmail.com");
      if (!demoEmail) return;

      const userName = demoEmail.split('@')[0];
      state.cloudUser = {
        email: demoEmail,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        id: generateId('usr_g_'),
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

  // BUG-24: Sincronización diferida con debounce para mutaciones frecuentes
  scheduleSyncWithCloud(delay = 800) {
    if (!this.supabaseClient || !state.cloudUser?.id) return;
    this.updateSyncIndicator('Guardando cambios...', 'syncing');
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }
    this.syncDebounceTimer = setTimeout(() => {
      this.syncDebounceTimer = null;
      this.pushToCloud(true);
    }, delay);
  }

  flushSync() {
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = null;
      this.pushToCloud(true);
    }
  }

  // US-35: Descarga y fusión bidireccional desde Supabase
  async pullFromCloud() {
    if (!this.supabaseClient || !state.cloudUser?.id) return { success: false, reason: 'no_session' };
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.updateSyncIndicator('Sin conexión (modo local)', 'warning');
      return { success: false, reason: 'offline' };
    }

    try {
      const [recRes, planRes, shopRes] = await Promise.all([
        this.supabaseClient.from('recipes').select('*').eq('user_id', state.cloudUser.id),
        this.supabaseClient.from('meal_plans').select('*').eq('user_id', state.cloudUser.id),
        this.supabaseClient.from('shopping_items').select('*').eq('user_id', state.cloudUser.id)
      ]);

      if (recRes.error) throw recRes.error;
      if (planRes.error) throw planRes.error;
      if (shopRes.error) throw shopRes.error;

      let stateChanged = false;

      // 1. Fusión de Recetas
      if (Array.isArray(recRes.data)) {
        const remoteRecipeIds = new Set(recRes.data.map(r => r.id));

        // Propagación de borrados remotos entre dispositivos (BUG-23 / Multi-device):
        // Si el cliente ya sincronizó con la nube con anterioridad (state.lastSyncedAt no es null),
        // toda receta local que no esté presente en la nube y cuya última modificación sea anterior
        // o igual a la última sincronización fue borrada en otro dispositivo y debe eliminarse.
        if (state.lastSyncedAt) {
          const lastSyncTime = new Date(state.lastSyncedAt).getTime();
          const initialLen = state.recipes.length;
          state.recipes = state.recipes.filter(r => {
            if (remoteRecipeIds.has(r.id)) return true;
            if (r.updatedAt && new Date(r.updatedAt).getTime() > lastSyncTime) {
              return true; // Creada o editada offline tras la última sincronización
            }
            return false;
          });
          if (state.recipes.length !== initialLen) {
            stateChanged = true;
          }
        } else if (recRes.data.length > 0 && Array.isArray(state.recipes)) {
          // Si es el primer inicio de sesión en un dispositivo nuevo y el almacenamiento local
          // solo contenía las recetas demo iniciales (SEED_RECIPES), reemplazarlas por las de la nube
          const isOnlySeed = state.recipes.every(r => SEED_RECIPES.some(s => s.id === r.id));
          if (isOnlySeed) {
            state.recipes = [];
            stateChanged = true;
          }
        }

        recRes.data.forEach(remoteRow => {
          if (state.deletedRecords.recipes?.includes(remoteRow.id)) return;

          const localIdx = state.recipes.findIndex(r => r.id === remoteRow.id);
          const remoteRecipe = {
            id: remoteRow.id,
            title: remoteRow.title,
            description: remoteRow.description || '',
            imageUrl: remoteRow.image_url || '',
            sourceUrl: remoteRow.source_url || '',
            sourceDomain: remoteRow.source_domain || '',
            prepTimeMinutes: remoteRow.prep_time_minutes || 0,
            cookTimeMinutes: remoteRow.cook_time_minutes || 0,
            servings: remoteRow.servings || 2,
            tags: Array.isArray(remoteRow.tags) ? remoteRow.tags : [],
            ingredients: Array.isArray(remoteRow.ingredients) ? remoteRow.ingredients : [],
            instructions: Array.isArray(remoteRow.instructions) ? remoteRow.instructions : [],
            isFavorite: !!remoteRow.is_favorite,
            createdAt: remoteRow.created_at || remoteRow.updated_at || null,
            updatedAt: remoteRow.updated_at
          };

          if (localIdx >= 0) {
            const local = state.recipes[localIdx];
            const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
            const localDate = new Date(local.updatedAt || local.createdAt || 0).getTime();
            if (remoteDate > localDate) {
              state.recipes[localIdx] = { ...local, ...remoteRecipe };
              stateChanged = true;
            }
          } else {
            state.recipes.push(remoteRecipe);
            stateChanged = true;
          }
        });
      }

      // 2. Fusión de Meal Plans
      if (Array.isArray(planRes.data)) {
        const remotePlanKeys = new Set(planRes.data.map(r => r.plan_date || r.id));
        if (state.lastSyncedAt) {
          const lastSyncTime = new Date(state.lastSyncedAt).getTime();
          Object.keys(state.mealPlan).forEach(dateKey => {
            if (!remotePlanKeys.has(dateKey)) {
              const day = state.mealPlan[dateKey];
              if (day && day.updatedAt && new Date(day.updatedAt).getTime() <= lastSyncTime) {
                if (day.breakfast || day.lunch || day.snack || day.dinner || (day.customSlots && day.customSlots.length > 0)) {
                  day.breakfast = null;
                  day.lunch = null;
                  day.snack = null;
                  day.dinner = null;
                  day.customSlots = [];
                  stateChanged = true;
                }
              }
            }
          });
        }

        planRes.data.forEach(remoteRow => {
          const dateKey = remoteRow.plan_date || remoteRow.id;
          if (!dateKey || state.deletedRecords.mealPlans?.includes(dateKey)) return;

          const localPlan = state.mealPlan[dateKey];
          const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
          const localDate = new Date(localPlan?.updatedAt || 0).getTime();

          if (!localPlan || remoteDate >= localDate) {
            state.mealPlan[dateKey] = {
              dayName: remoteRow.day_name || localPlan?.dayName || 'Día',
              breakfast: remoteRow.breakfast_recipe_id || null,
              lunch: remoteRow.lunch_recipe_id || null,
              snack: remoteRow.snack_recipe_id || null,
              dinner: remoteRow.dinner_recipe_id || null,
              customSlots: Array.isArray(remoteRow.custom_slots) ? remoteRow.custom_slots : [],
              updatedAt: remoteRow.updated_at
            };
            stateChanged = true;
          }
        });
      }

      // 3. Fusión de Shopping Items
      if (Array.isArray(shopRes.data)) {
        const remoteShopIds = new Set(shopRes.data.map(i => i.id));
        if (state.lastSyncedAt) {
          const lastSyncTime = new Date(state.lastSyncedAt).getTime();
          const initialShopLen = state.shoppingList.length;
          state.shoppingList = state.shoppingList.filter(item => {
            if (remoteShopIds.has(item.id)) return true;
            if (item.updatedAt && new Date(item.updatedAt).getTime() > lastSyncTime) {
              return true;
            }
            return false;
          });
          if (state.shoppingList.length !== initialShopLen) {
            stateChanged = true;
          }
        }

        shopRes.data.forEach(remoteRow => {
          if (state.deletedRecords.shoppingItems?.includes(remoteRow.id)) return;

          const localIdx = state.shoppingList.findIndex(i => i.id === remoteRow.id);
          const remoteItem = {
            id: remoteRow.id,
            name: remoteRow.name,
            amount: remoteRow.amount !== null && !isNaN(remoteRow.amount) ? Number(remoteRow.amount) : null,
            unit: remoteRow.unit || '',
            aisle: remoteRow.aisle || 'other',
            isChecked: !!remoteRow.is_checked,
            recipeOrigin: remoteRow.recipe_origin || '',
            updatedAt: remoteRow.updated_at
          };

          if (localIdx >= 0) {
            const local = state.shoppingList[localIdx];
            const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
            const localDate = new Date(local.updatedAt || 0).getTime();
            if (remoteDate >= localDate) {
              state.shoppingList[localIdx] = { ...local, ...remoteItem };
              stateChanged = true;
            }
          } else {
            state.shoppingList.push(remoteItem);
            stateChanged = true;
          }
        });
      }

      if (stateChanged) {
        state.save('fa_recipes', state.recipes);
        state.save('fa_mealplan', state.mealPlan);
        state.save('fa_shopping', state.shoppingList);
        this.render();
      }

      return { success: true };
    } catch (err) {
      console.warn("Error al descargar datos de Supabase:", err);
      return { success: false, error: err };
    }
  }

  // Resilient batch upsert: gracefully handles schema variations & missing composite constraints
  async upsertWithSchemaFallback(table, payload) {
    if (!payload || payload.length === 0) return { success: true };
    if (!this.unsupportedColumns) {
      this.unsupportedColumns = { recipes: new Set(), meal_plans: new Set(), shopping_items: new Set() };
    }
    if (!this.preferredConflictTargets) {
      this.preferredConflictTargets = { recipes: 'user_id,id', meal_plans: 'user_id,id', shopping_items: 'user_id,id' };
    }

    let conflict = this.preferredConflictTargets[table] || 'user_id,id';
    let currentPayload = payload.map(item => ({ ...item }));

    // Pre-filter known unsupported columns for this table
    if (this.unsupportedColumns[table]) {
      this.unsupportedColumns[table].forEach(col => {
        currentPayload.forEach(row => delete row[col]);
      });
    }

    for (let attempt = 0; attempt < 8; attempt++) {
      const { data, error } = await this.supabaseClient.from(table).upsert(currentPayload, {
        onConflict: conflict
      });

      if (!error) {
        return { success: true, data };
      }

      // Fallback 1: Unique constraint does not match ON CONFLICT specification (e.g. table only has PRIMARY KEY (id))
      if (error.code === '42P10' || (error.message && error.message.includes('ON CONFLICT specification'))) {
        if (conflict !== 'id') {
          console.warn(`[Sync] Tabla '${table}' no tiene restricción única compuesta (user_id,id). Reintentando con onConflict: 'id'...`);
          conflict = 'id';
          this.preferredConflictTargets[table] = 'id';
          continue;
        }
      }

      // Fallback 2: Column does not exist in the remote schema cache
      const colMatch = error.message?.match(/Could not find the '([^']+)' column of '([^']+)' in the schema cache/i);
      if (colMatch) {
        const missingCol = colMatch[1];
        console.warn(`[Sync] Columna '${missingCol}' no existe en '${table}' de Supabase. Descartando del payload y reintentando...`);
        if (this.unsupportedColumns[table]) {
          this.unsupportedColumns[table].add(missingCol);
        }
        currentPayload.forEach(row => {
          delete row[missingCol];
        });
        continue;
      }

      // Unrecoverable error (e.g. auth / RLS / network)
      return { success: false, error };
    }

    return { success: false, error: new Error(`Reintentos de compatibilidad de esquema agotados para ${table}`) };
  }

  // US-35 / BUG-24: Subida en lote (batch upsert) y propagación de borrados (BUG-23)
  async pushToCloud(silent = false) {
    if (!this.supabaseClient || !state.cloudUser?.id) {
      return { success: false, reason: 'no_session' };
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.updateSyncIndicator('Sin conexión (modo local)', 'warning');
      return { success: false, reason: 'offline' };
    }

    this.updateSyncIndicator('Sincronizando con la nube...', 'syncing');

    try {
      // 1. Propagar borrados pendientes (BUG-23)
      if (state.deletedRecords.recipes?.length > 0) {
        const { error } = await this.supabaseClient.from('recipes')
          .delete()
          .in('id', state.deletedRecords.recipes)
          .eq('user_id', state.cloudUser.id);
        if (!error) {
          state.clearDeletedRecords('recipes', [...state.deletedRecords.recipes]);
        } else {
          console.warn('Error al propagar borrado de recetas:', error);
        }
      }

      if (state.deletedRecords.mealPlans?.length > 0) {
        const { error } = await this.supabaseClient.from('meal_plans')
          .delete()
          .in('id', state.deletedRecords.mealPlans)
          .eq('user_id', state.cloudUser.id);
        if (!error) {
          state.clearDeletedRecords('mealPlans', [...state.deletedRecords.mealPlans]);
        } else {
          console.warn('Error al propagar borrado de planes:', error);
        }
      }

      if (state.deletedRecords.shoppingItems?.length > 0) {
        const { error } = await this.supabaseClient.from('shopping_items')
          .delete()
          .in('id', state.deletedRecords.shoppingItems)
          .eq('user_id', state.cloudUser.id);
        if (!error) {
          state.clearDeletedRecords('shoppingItems', [...state.deletedRecords.shoppingItems]);
        } else {
          console.warn('Error al propagar borrado de compra:', error);
        }
      }

      // 2. Batch Upsert Recipes (BUG-22, BUG-24)
      if (Array.isArray(state.recipes) && state.recipes.length > 0) {
        const recipesPayload = state.recipes.map(recipe => ({
          id: recipe.id,
          user_id: state.cloudUser.id,
          title: recipe.title,
          description: recipe.description || '',
          image_url: recipe.imageUrl || null,
          source_url: recipe.sourceUrl || '',
          source_domain: recipe.sourceDomain || '',
          prep_time_minutes: recipe.prepTimeMinutes || 0,
          cook_time_minutes: recipe.cookTimeMinutes || 0,
          servings: recipe.servings || 2,
          tags: Array.isArray(recipe.tags) ? recipe.tags : [],
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          is_favorite: !!recipe.isFavorite,
          created_at: recipe.createdAt || recipe.updatedAt || new Date().toISOString(),
          updated_at: recipe.updatedAt || new Date().toISOString()
        }));

        const rRes = await this.upsertWithSchemaFallback('recipes', recipesPayload);
        if (!rRes.success) throw rRes.error;
      }

      // 3. Batch Upsert Meal Plans (BUG-23, BUG-24)
      const planKeys = Object.keys(state.mealPlan || {});
      if (planKeys.length > 0) {
        const mealPlansPayload = planKeys.map(dateKey => {
          const day = state.mealPlan[dateKey] || {};
          return {
            id: dateKey,
            user_id: state.cloudUser.id,
            plan_date: dateKey,
            day_name: day.dayName || 'Día',
            breakfast_recipe_id: day.breakfast || null,
            lunch_recipe_id: day.lunch || null,
            snack_recipe_id: day.snack || null,
            dinner_recipe_id: day.dinner || null,
            custom_slots: Array.isArray(day.customSlots) ? day.customSlots : [],
            updated_at: day.updatedAt || new Date().toISOString()
          };
        });

        const mRes = await this.upsertWithSchemaFallback('meal_plans', mealPlansPayload);
        if (!mRes.success) throw mRes.error;
      }

      // 4. Batch Upsert Shopping Items (US-45, BUG-23, BUG-24)
      if (Array.isArray(state.shoppingList) && state.shoppingList.length > 0) {
        const shoppingPayload = state.shoppingList.map(item => {
          if (!item.id) item.id = generateId('shop-');
          return {
            id: item.id,
            user_id: state.cloudUser.id,
            name: item.name,
            amount: item.amount !== null && !isNaN(item.amount) ? Number(item.amount) : null,
            unit: item.unit || '',
            aisle: item.aisle || 'other',
            is_checked: !!item.isChecked,
            recipe_origin: item.recipeOrigin || null,
            updated_at: item.updatedAt || new Date().toISOString()
          };
        });

        const sRes = await this.upsertWithSchemaFallback('shopping_items', shoppingPayload);
        if (!sRes.success) throw sRes.error;
      }

      // 5. Éxito confirmado: actualizar marca temporal
      state.lastSyncedAt = new Date().toISOString();
      localStorage.setItem('fa_last_sync', state.lastSyncedAt);
      this.updateUserAccountUI();
      this.updateSyncIndicator(`Sincronizado a las ${new Date(state.lastSyncedAt).toLocaleTimeString()}`, 'success');

      if (!silent) {
        alert("¡Datos sincronizados correctamente con la nube!");
      }
      return { success: true };
    } catch (err) {
      // BUG-21: No marcar como sincronizado si Supabase devolvió error
      console.warn("Error durante la sincronización con Supabase:", err);
      this.updateSyncIndicator(`Error de sincronización: ${err.message || 'Error de conexión'}`, 'error');
      if (!silent) {
        alert("Error al sincronizar con la nube: " + (err.message || 'Fallo de conexión'));
      }
      return { success: false, error: err };
    }
  }

  // Sincronización completa (descarga + subida)
  async syncDataWithCloud(silent = false) {
    if (!this.supabaseClient || !state.cloudUser?.id) {
      this.updateUserAccountUI();
      return { success: false, reason: 'no_session' };
    }

    this.updateSyncIndicator("Sincronizando con la nube...", 'syncing');
    const pullRes = await this.pullFromCloud();
    const pushRes = await this.pushToCloud(silent);
    return { pull: pullRes, push: pushRes };
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
    document.getElementById('btn-sync-now')?.addEventListener('click', () => this.syncDataWithCloud(false));
    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => this.closeAuthModal());
    document.getElementById('btn-auth-google')?.addEventListener('click', () => this.handleGoogleAuth());
    document.querySelectorAll('#auth-tab-buttons .auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
    });
    document.getElementById('btn-submit-auth')?.addEventListener('click', () => this.handleAuthSubmit());
    document.getElementById('btn-auth-logout')?.addEventListener('click', () => this.logoutCloudUser());

    // Importer (US-15: Schema.org & Text Parser)
    document.getElementById('btn-close-import-modal')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-import-switch-to-manual')?.addEventListener('click', () => {
      this.closeImportModal();
      this.openCreateRecipeModal();
    });
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

    // Unified Recipe Creation Choice (Manual vs Link vs Text)
    document.getElementById('btn-open-create-recipe')?.addEventListener('click', () => this.openAddRecipeChoiceModal());
    document.getElementById('btn-close-recipe-add-choice')?.addEventListener('click', () => this.closeAddRecipeChoiceModal());
    document.getElementById('btn-choice-manual')?.addEventListener('click', () => {
      this.closeAddRecipeChoiceModal();
      this.openCreateRecipeModal();
    });
    document.getElementById('btn-choice-url')?.addEventListener('click', () => {
      this.closeAddRecipeChoiceModal();
      this.openImportModal('url');
    });
    document.getElementById('btn-choice-text')?.addEventListener('click', () => {
      this.closeAddRecipeChoiceModal();
      this.openImportModal('text');
    });

    // Recipe CRUD
    document.getElementById('btn-edit-switch-to-import')?.addEventListener('click', () => {
      this.closeEditModal();
      this.openAddRecipeChoiceModal();
    });
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

    // Recipe search and tag chips (US-02: Filtro múltiple combinado)
    const searchInput = document.getElementById('recipes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyRecipeFilters());
    }
    this.initRecipeTagFilters();

    // Recipe Editor Custom Tag (US-02)
    document.getElementById('btn-add-custom-tag')?.addEventListener('click', () => this.handleAddCustomTagFromEditor());
    document.getElementById('input-new-custom-tag')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleAddCustomTagFromEditor();
      }
    });

    // Recipe Picker Dietary Filter Toggle (US-02)
    document.getElementById('btn-toggle-picker-dietary-only')?.addEventListener('click', () => {
      this.pickerOnlyDietary = !this.pickerOnlyDietary;
      document.getElementById('btn-toggle-picker-dietary-only')?.classList.toggle('active', this.pickerOnlyDietary);
      this.renderPickerRecipesList();
    });

    // Shopping List (US-20: Autocompletado inteligente de artículos)
    const quickGroceryInput = document.getElementById('input-quick-grocery');
    const quickGroceryDropdown = document.getElementById('quick-grocery-autocomplete');
    if (quickGroceryInput && quickGroceryDropdown) {
      this.attachIngredientAutocomplete(quickGroceryInput, quickGroceryDropdown, (selected) => {
        const val = quickGroceryInput.value.trim();
        const prefixMatch = val.match(/^([\d\.,\/\s]+(?:g|kg|ml|cl|dl|l|cda|cdta|taza|vaso|pizca|loncha|ud|uds)?\s*(?:de\s+)?)/i);
        if (prefixMatch && prefixMatch[0].length < val.length) {
          quickGroceryInput.value = `${prefixMatch[0].trim()} ${selected.name}`;
        } else {
          quickGroceryInput.value = selected.name;
        }
        quickGroceryInput.focus();
      });
    }

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
    document.getElementById('btn-auto-tag-recipes')?.addEventListener('click', () => this.autoAnalyzeAndTagAllRecipes());

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
    this.initRecipeTagFilters();
    this.applyRecipeFilters();
    this.renderPlanner();
    this.renderShoppingList();
    this.renderSettings();
  }

  renderTodayView() {
    const today = new Date();
    const todayStr = toLocalDateKey(today);
    const todayPlan = state.mealPlan[todayStr] || {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
      customSlots: []
    };

    // Header dynamic date formatting (e.g., "Sábado, 24 de octubre")
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateFormatted = today.toLocaleDateString('es-ES', dateOptions);
    const dateCapitalized = dateFormatted ? (dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)) : 'Hoy';

    const dateElem = document.getElementById('today-date-text');
    if (dateElem) {
      dateElem.textContent = dateCapitalized;
    }

    const customSlots = Array.isArray(todayPlan.customSlots) ? todayPlan.customSlots : [];
    const totalSlotsCount = STANDARD_SLOTS.length + customSlots.length;
    let assignedCount = 0;
    STANDARD_SLOTS.forEach(s => {
      if (todayPlan[s.key]) assignedCount++;
    });
    customSlots.forEach(cs => {
      if (cs.recipeId) assignedCount++;
    });

    const summaryElem = document.getElementById('today-summary-text');
    if (summaryElem) {
      if (assignedCount === 0) {
        summaryElem.textContent = 'Ninguna comida asignada para hoy. Toca un momento para empezar.';
      } else if (assignedCount === totalSlotsCount) {
        summaryElem.textContent = `Todas las comidas planificadas (${assignedCount} de ${totalSlotsCount}). ¡Listo para cocinar!`;
      } else {
        summaryElem.textContent = `${assignedCount} de ${totalSlotsCount} comidas planificadas para hoy.`;
      }
    }

    const container = document.getElementById('today-slots-container');
    if (!container) return;

    const standardHtml = STANDARD_SLOTS.map(s => {
      const recId = todayPlan[s.key];
      const recipe = state.recipes.find(r => r.id === recId);

      if (recipe) {
        const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
        const warningBadgeHtml = !comp.compliant ? `
          <div class="dietary-warning-badge" title="Incumple preferencias dietéticas: ${comp.violations.join(', ')}">
            <span class="material-symbols-outlined" style="font-size: 13px;">warning</span> No cumple: ${comp.violations.join(', ')}
          </div>
        ` : '';

        return `
          <div class="meal-slot has-meal" onclick="app.openRecipeDetail('${recipe.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="slot-label">
                <span class="material-symbols-outlined icon-sm">${s.icon}</span> ${s.label}
              </span>
              <button class="btn-ghost btn-sm" onclick="event.stopPropagation(); app.clearSlot('${todayStr}', '${s.key}')" title="Quitar plato" style="padding: 2px 4px; color: var(--m3-on-surface-variant);">
                <span class="material-symbols-outlined icon-sm">close</span>
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px; min-width: 0;">
              <img src="${recipe.imageUrl}" alt="" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0;" onerror="this.src='data:image/svg+xml,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 48 48\\\'><rect width=\\\'48\\\' height=\\\'48\\\' rx=\\\'10\\\' fill=\\\'%23f1f3f4\\\'/><text x=\\\'50%25\\\' y=\\\'55%25\\\' dominant-baseline=\\\'middle\\\' text-anchor=\\\'middle\\\' font-size=\\\'20\\\'>🍲</text></svg>'">
              <div style="flex: 1; min-width: 0; overflow: hidden;">
                <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
                ${warningBadgeHtml}
                <div style="font-size: 11px; color: var(--m3-on-surface-variant); margin-top: 3px; display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-flex; align-items: center; gap: 3px;">
                    <span class="material-symbols-outlined icon-sm">schedule</span> ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                  </span>
                  ${recipe.servings ? `
                    <span style="display: inline-flex; align-items: center; gap: 3px;">
                      <span class="material-symbols-outlined icon-sm">group</span> ${recipe.servings} p.
                    </span>
                  ` : ''}
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
              <span class="material-symbols-outlined icon-sm">add_circle</span> Asignar plato
            </div>
          </div>
        `;
      }
    }).join('');

    const customHtml = customSlots.map(cs => this.renderCustomSlotCard(todayStr, cs)).join('');

    const addExtraHtml = `
      <div class="today-add-slot-wrap">
        <button type="button" class="btn today-add-slot-btn" onclick="app.openAddCustomSlotModal('${todayStr}')">
          <span class="material-symbols-outlined icon-sm">add</span>
          <span>Añadir otra comida</span>
        </button>
      </div>
    `;

    container.innerHTML = standardHtml + customHtml + addExtraHtml;
  }

  getSortedRecipes(recipesList = state.recipes) {
    if (!Array.isArray(recipesList)) return [];
    return [...recipesList].sort((a, b) => {
      // Orden por fecha de creación: las más nuevas arriba del todo y las más viejas al final
      const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();

      if (timeB !== timeA) {
        return timeB - timeA;
      }

      // Desempate secundario alfabético determinista si tienen la misma fecha o son semillas
      const titleA = (a.title || '').trim();
      const titleB = (b.title || '').trim();
      return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
    });
  }

  renderRecipesGrid(recipesList) {
    const grid = document.getElementById('recipes-cards-grid');
    if (!grid) return;

    const totalCount = Array.isArray(state.recipes) ? state.recipes.length : 0;
    const currentCount = Array.isArray(recipesList) ? recipesList.length : 0;
    const badge = document.getElementById('recipes-count-badge');
    if (badge) {
      if (currentCount === totalCount) {
        badge.textContent = `${totalCount}`;
      } else {
        badge.textContent = `${currentCount} de ${totalCount}`;
      }
    }
    const subtitle = document.getElementById('recipes-count-subtitle');
    if (subtitle) {
      subtitle.textContent = 'Tu recetario personal.';
    }

    if (!recipesList.length) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 16px; color: var(--m3-on-surface-variant);">
          <span class="material-symbols-outlined" style="font-size: 40px; margin-bottom: 8px;">menu_book</span>
          <h3>No se encontraron recetas</h3>
        </div>
      `;
      return;
    }

    const sortedList = this.getSortedRecipes(recipesList);

    grid.innerHTML = sortedList.map(rec => `
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
            ${rec.tags.map(t => {
              const isDiet = PREDEFINED_DIETARY_TAGS.includes(t);
              return `<span class="tag-chip" ${isDiet ? 'style="border: 1px solid var(--color-brand); color: var(--color-brand); font-weight: 600;"' : ''}>${isDiet ? getDietaryTagEmoji(t) + ' ' : ''}${t}</span>`;
            }).join('')}
          </div>
        </div>
      </article>
    `).join('');
  }

  // US-02: Filtro múltiple combinado con el buscador de recetas
  initRecipeTagFilters() {
    const container = document.getElementById('recipes-tag-filters');
    if (!container) return;

    const availableTags = state.getAllTags ? state.getAllTags() : ALL_PREDEFINED_TAGS;
    const isAllActive = this.selectedRecipeTags.size === 0;

    let html = `
      <button type="button" class="m3-filter-chip ${isAllActive ? 'active' : ''}" data-tag="all">
        ${isAllActive ? '<span class="material-symbols-outlined" style="font-size: 15px;">done</span>' : ''}
        Todas
      </button>
    `;

    availableTags.forEach(tag => {
      const isSelected = this.selectedRecipeTags.has(tag);
      const isDietary = PREDEFINED_DIETARY_TAGS.includes(tag);
      html += `
        <button type="button" class="m3-filter-chip ${isDietary ? 'dietary-chip' : ''} ${isSelected ? 'active' : ''}" data-tag="${tag}">
          ${isDietary ? `<span class="dietary-emoji">${getDietaryTagEmoji(tag)}</span>` : ''}
          ${isSelected && !isDietary ? '<span class="material-symbols-outlined" style="font-size: 14px;">done</span>' : ''}
          ${tag}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.m3-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (tag === 'all') {
          this.selectedRecipeTags.clear();
        } else {
          if (this.selectedRecipeTags.has(tag)) {
            this.selectedRecipeTags.delete(tag);
          } else {
            this.selectedRecipeTags.add(tag);
          }
        }
        this.initRecipeTagFilters();
        this.applyRecipeFilters();
      });
    });
  }

  applyRecipeFilters() {
    const searchInput = document.getElementById('recipes-search-input');
    const term = (searchInput?.value || '').toLowerCase().trim();

    const filtered = state.recipes.filter(r => {
      // 1. Tag multi-selection (AND logic: debe contener todas las etiquetas seleccionadas)
      if (this.selectedRecipeTags.size > 0) {
        const rTagsLower = (r.tags || []).map(t => String(t).toLowerCase().trim());
        for (const selTag of this.selectedRecipeTags) {
          if (!rTagsLower.includes(selTag.toLowerCase().trim())) {
            return false;
          }
        }
      }

      // 2. Término de búsqueda (título, etiquetas o ingredientes)
      if (term) {
        const titleMatch = (r.title || '').toLowerCase().includes(term);
        const tagsMatch = (r.tags || []).some(t => String(t).toLowerCase().includes(term));
        const ingMatch = (r.ingredients || []).some(i => i && i.name && i.name.toLowerCase().includes(term));
        if (!titleMatch && !tagsMatch && !ingMatch) return false;
      }

      return true;
    });

    this.renderRecipesGrid(filtered);

    // Actualizar badge y subtítulo dinámico
    const badge = document.getElementById('recipes-count-badge');
    const subtitle = document.getElementById('recipes-count-subtitle');
    if (badge) {
      if (this.selectedRecipeTags.size > 0 || term) {
        badge.textContent = `${filtered.length} de ${state.recipes.length}`;
      } else {
        badge.textContent = `${state.recipes.length}`;
      }
    }
    if (subtitle) {
      if (this.selectedRecipeTags.size > 0 || term) {
        const filtersDesc = [];
        if (this.selectedRecipeTags.size > 0) filtersDesc.push(`etiquetas: ${Array.from(this.selectedRecipeTags).join(', ')}`);
        if (term) filtersDesc.push(`"${term}"`);
        subtitle.textContent = `${filtered.length} receta${filtered.length === 1 ? '' : 's'} (${filtersDesc.join(' + ')}).`;
      } else {
        subtitle.textContent = 'Tu recetario personal.';
      }
    }
  }

  filterRecipes(searchTerm) {
    this.applyRecipeFilters();
  }

  filterRecipesByTag(tag) {
    if (!tag || tag === 'all') {
      this.selectedRecipeTags.clear();
    } else {
      this.selectedRecipeTags.clear();
      this.selectedRecipeTags.add(tag);
    }
    this.initRecipeTagFilters();
    this.applyRecipeFilters();
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
      case 'modal-recipe-add-choice':
        this.closeAddRecipeChoiceModal();
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
      const deletedId = this.activeRecipe.id;
      state.recipes = state.recipes.filter(r => r.id !== deletedId);
      state.save('fa_recipes', state.recipes);
      state.trackDeletion('recipes', deletedId);
      this.closeRecipeModal();
      this.render();
      // Propagar borrado inmediatamente a Supabase (BUG-23)
      this.pushToCloud(true);
    }
  }

  // UNIFIED RECIPE ADD CHOICE
  openAddRecipeChoiceModal() {
    if (this.modalRecipeAddChoice) {
      this.modalRecipeAddChoice.classList.add('active');
    }
  }

  closeAddRecipeChoiceModal() {
    if (this.modalRecipeAddChoice) {
      this.modalRecipeAddChoice.classList.remove('active');
    }
  }

  // RECIPE EDITOR (CREATE & EDIT)
  openCreateRecipeModal() {
    document.getElementById('recipe-edit-modal-title').textContent = "Nueva Receta";
    const switchBtn = document.getElementById('btn-edit-switch-to-import');
    if (switchBtn) switchBtn.style.display = 'inline-flex';
    document.getElementById('edit-recipe-id').value = "";
    document.getElementById('edit-recipe-title').value = "";
    document.getElementById('edit-recipe-desc').value = "";
    document.getElementById('edit-recipe-prep').value = "15";
    document.getElementById('edit-recipe-cook').value = "20";
    document.getElementById('edit-recipe-servings').value = state.settings.defaultServings || "2";
    document.getElementById('edit-recipe-image').value = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";
    document.getElementById('edit-recipe-tags').value = "Cena, Saludable";
    this.editorSelectedTags = new Set(["Cena", "Saludable"]);
    this.renderRecipeEditorChips();

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
    const switchBtn = document.getElementById('btn-edit-switch-to-import');
    if (switchBtn) switchBtn.style.display = 'none';
    document.getElementById('edit-recipe-id').value = r.id || ('rec-' + Date.now());
    document.getElementById('edit-recipe-title').value = r.title || "";
    document.getElementById('edit-recipe-desc').value = r.description || "";
    document.getElementById('edit-recipe-prep').value = r.prepTimeMinutes || 0;
    document.getElementById('edit-recipe-cook').value = r.cookTimeMinutes || 0;
    document.getElementById('edit-recipe-servings').value = r.servings || 2;
    document.getElementById('edit-recipe-image').value = r.imageUrl || "";
    document.getElementById('edit-recipe-tags').value = (r.tags || []).join(', ');
    this.editorSelectedTags = new Set(Array.isArray(r.tags) ? r.tags : []);
    this.renderRecipeEditorChips();

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

  // US-02: Selector de etiquetas interactivas por Chips en el editor
  renderRecipeEditorChips() {
    const selectedContainer = document.getElementById('editor-selected-tags-container');
    const dietaryContainer = document.getElementById('editor-dietary-chips');
    const occasionContainer = document.getElementById('editor-occasion-chips');
    const practicalContainer = document.getElementById('editor-practical-chips');
    const hiddenInput = document.getElementById('edit-recipe-tags');

    const selectedArray = Array.from(this.editorSelectedTags);
    if (hiddenInput) {
      hiddenInput.value = selectedArray.join(', ');
    }

    if (selectedContainer) {
      if (selectedArray.length === 0) {
        selectedContainer.className = 'recipe-editor-chips-box empty';
        selectedContainer.innerHTML = '<span>Ninguna etiqueta seleccionada. Elige una abajo o crea una nueva.</span>';
      } else {
        selectedContainer.className = 'recipe-editor-chips-box';
        selectedContainer.innerHTML = selectedArray.map(tag => `
          <span class="editor-selected-chip">
            <span>${tag}</span>
            <button type="button" class="chip-remove-btn" onclick="app.removeEditorTag('${tag.replace(/'/g, "\\'")}')" title="Quitar etiqueta">
              <span class="material-symbols-outlined" style="font-size: 14px;">close</span>
            </button>
          </span>
        `).join('');
      }
    }

    const renderGroup = (container, tagList) => {
      if (!container) return;
      container.innerHTML = tagList.map(t => {
        const isSelected = this.editorSelectedTags.has(t);
        return `
          <button type="button" class="editor-suggested-chip ${isSelected ? 'active' : ''}" onclick="app.toggleEditorTag('${t.replace(/'/g, "\\'")}')">
            ${PREDEFINED_DIETARY_TAGS.includes(t) ? `<span class="dietary-emoji">${getDietaryTagEmoji(t)}</span>` : `<span class="material-symbols-outlined" style="font-size: 14px;">${isSelected ? 'check' : 'add'}</span>`}
            <span>${t}</span>
          </button>
        `;
      }).join('');
    };

    renderGroup(dietaryContainer, PREDEFINED_DIETARY_TAGS);
    renderGroup(occasionContainer, PREDEFINED_OCCASION_TAGS);

    const practicalPlusCustom = [...PREDEFINED_PRACTICAL_TAGS];
    (state.customTags || []).forEach(ct => {
      if (!practicalPlusCustom.includes(ct) && !PREDEFINED_DIETARY_TAGS.includes(ct) && !PREDEFINED_OCCASION_TAGS.includes(ct)) {
        practicalPlusCustom.push(ct);
      }
    });
    renderGroup(practicalContainer, practicalPlusCustom);
  }

  toggleEditorTag(tag) {
    if (!tag) return;
    if (this.editorSelectedTags.has(tag)) {
      this.editorSelectedTags.delete(tag);
    } else {
      this.editorSelectedTags.add(tag);
    }
    this.renderRecipeEditorChips();
  }

  removeEditorTag(tag) {
    if (!tag) return;
    this.editorSelectedTags.delete(tag);
    this.renderRecipeEditorChips();
  }

  handleAddCustomTagFromEditor() {
    const input = document.getElementById('input-new-custom-tag');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    state.addCustomTag(val);
    this.editorSelectedTags.add(val);
    input.value = '';
    this.renderRecipeEditorChips();
    this.initRecipeTagFilters();
  }

  attachIngredientAutocomplete(inputElem, dropdownElem, onSelect) {
    if (!inputElem || !dropdownElem) return;

    let activeIndex = -1;
    let currentSuggestions = [];

    const renderSuggestions = (items) => {
      currentSuggestions = items;
      activeIndex = -1;
      if (!items || items.length === 0) {
        dropdownElem.innerHTML = '';
        dropdownElem.style.display = 'none';
        return;
      }

      dropdownElem.innerHTML = items.map((item, idx) => {
        const meta = AISLE_METADATA[item.aisle] || AISLE_METADATA.other;
        return `
          <div class="autocomplete-item" data-index="${idx}">
            <div class="autocomplete-item-icon">
              <span class="material-symbols-outlined icon-sm">${item.icon || meta.icon}</span>
            </div>
            <div class="autocomplete-item-text">
              <span class="autocomplete-item-name">${item.name}</span>
            </div>
            <span class="autocomplete-item-badge">${meta.label}</span>
          </div>
        `;
      }).join('');

      dropdownElem.style.display = 'flex';

      dropdownElem.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const idx = parseInt(el.getAttribute('data-index'), 10);
          if (currentSuggestions[idx]) {
            onSelect(currentSuggestions[idx]);
            dropdownElem.style.display = 'none';
          }
        });
      });
    };

    const updateActiveItem = () => {
      const items = dropdownElem.querySelectorAll('.autocomplete-item');
      items.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add('active');
          if (typeof item.scrollIntoView === 'function') {
            item.scrollIntoView({ block: 'nearest' });
          }
        } else {
          item.classList.remove('active');
        }
      });
    };

    inputElem.addEventListener('input', () => {
      const q = inputElem.value.trim();
      let searchTerm = q;
      const prefixMatch = q.match(/^[\d\.,\/\s]+(?:g|kg|ml|cl|dl|l|cda|cdta|taza|vaso|pizca|loncha|ud|uds)?\s*(?:de\s+)?(.*)$/i);
      if (prefixMatch && prefixMatch[1] && prefixMatch[1].trim()) {
        searchTerm = prefixMatch[1].trim();
      }

      if (searchTerm.length < 1) {
        dropdownElem.style.display = 'none';
        return;
      }

      const extra = [];
      if (typeof state !== 'undefined' && state.recipes) {
        state.recipes.forEach(r => {
          (r.ingredients || []).forEach(ing => {
            if (ing && ing.name) extra.push(ing);
          });
        });
      }

      const suggestions = getIngredientSuggestions(searchTerm, 6, extra);
      renderSuggestions(suggestions);
    });

    inputElem.addEventListener('keydown', (e) => {
      if (dropdownElem.style.display === 'none' || currentSuggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % currentSuggestions.length;
        updateActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
        updateActiveItem();
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
          e.preventDefault();
          e.stopPropagation();
          onSelect(currentSuggestions[activeIndex]);
          dropdownElem.style.display = 'none';
        }
      } else if (e.key === 'Escape') {
        dropdownElem.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!inputElem.contains(e.target) && !dropdownElem.contains(e.target)) {
        dropdownElem.style.display = 'none';
      }
    });
  }

  renumberSteps() {
    const container = document.getElementById('edit-steps-container');
    if (!container) return;
    const stepRows = container.querySelectorAll('.edit-step-row');
    stepRows.forEach((row, idx) => {
      const numPill = row.querySelector('.step-num-pill');
      if (numPill) numPill.textContent = idx + 1;
      const title = row.querySelector('.step-title-text');
      if (title) title.textContent = `Paso ${idx + 1}`;
    });
  }

  addIngredientRow(data = {}) {
    const container = document.getElementById('edit-ingredients-container');
    const row = document.createElement('div');
    row.className = 'edit-ing-row edit-ing-card';

    const currentAisle = data.aisle || (data.name ? categorizeIngredientAisle(data.name) : 'other');
    const initialIcon = getIngredientIcon(data.name || '', currentAisle);

    row.innerHTML = `
      <div class="edit-ing-top-row">
        <div class="ing-name-wrap">
          <span class="material-symbols-outlined icon-sm ing-icon-badge">${initialIcon}</span>
          <input type="text" class="form-input ing-name" placeholder="Nombre del ingrediente (ej. Castañas, Puerro...)" value="${data.name || ''}" autocomplete="off">
          <div class="ing-autocomplete-dropdown autocomplete-dropdown" style="display: none;"></div>
        </div>
        <button type="button" class="btn-remove-item" title="Eliminar ingrediente">
          <span class="material-symbols-outlined icon-sm">delete</span>
        </button>
      </div>

      <div class="edit-ing-bottom-row">
        <div class="ing-field-group ing-amount-group">
          <label class="field-micro-label">Cantidad</label>
          <input type="number" class="form-input ing-amount" placeholder="Ej. 1" value="${data.amount !== null && data.amount !== undefined ? data.amount : ''}" step="any">
        </div>
        <div class="ing-field-group ing-unit-group">
          <label class="field-micro-label">Unidad</label>
          <input type="text" class="form-input ing-unit" placeholder="ud, g, ml..." value="${data.unit || ''}">
        </div>
        <div class="ing-field-group ing-aisle-group">
          <label class="field-micro-label">Pasillo / Sección</label>
          <select class="form-select ing-aisle">
            <option value="other" ${currentAisle === 'other' ? 'selected' : ''}>Otros / Varios</option>
            <option value="produce" ${currentAisle === 'produce' ? 'selected' : ''}>Verduras y Frutas</option>
            <option value="meat" ${currentAisle === 'meat' ? 'selected' : ''}>Carnes y Pescados</option>
            <option value="dairy" ${currentAisle === 'dairy' ? 'selected' : ''}>Lácteos y Huevos</option>
            <option value="bakery" ${currentAisle === 'bakery' ? 'selected' : ''}>Panadería y Masas</option>
            <option value="pantry" ${currentAisle === 'pantry' ? 'selected' : ''}>Despensa y Básicos</option>
            <option value="spices" ${currentAisle === 'spices' ? 'selected' : ''}>Especias y Aceites</option>
            <option value="frozen" ${currentAisle === 'frozen' ? 'selected' : ''}>Congelados</option>
            <option value="beverages" ${currentAisle === 'beverages' ? 'selected' : ''}>Bebidas</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(row);

    const nameInput = row.querySelector('.ing-name');
    const aisleSelect = row.querySelector('.ing-aisle');
    const unitInput = row.querySelector('.ing-unit');
    const iconBadge = row.querySelector('.ing-icon-badge');
    const dropdown = row.querySelector('.ing-autocomplete-dropdown');
    const btnRemove = row.querySelector('.btn-remove-item');

    const updateIcon = (name, aisle) => {
      if (iconBadge) {
        iconBadge.textContent = getIngredientIcon(name, aisle || (aisleSelect ? aisleSelect.value : 'other'));
      }
    };

    btnRemove?.addEventListener('click', () => {
      row.remove();
    });

    if (nameInput && dropdown) {
      this.attachIngredientAutocomplete(nameInput, dropdown, (selected) => {
        nameInput.value = selected.name;
        if (selected.aisle && aisleSelect) {
          aisleSelect.value = selected.aisle;
        }
        if (selected.defaultUnit && unitInput && !unitInput.value) {
          unitInput.value = selected.defaultUnit;
        }
        updateIcon(selected.name, selected.aisle);
      });

      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        const cat = categorizeIngredientAisle(val);
        if (cat && aisleSelect) {
          aisleSelect.value = cat;
        }
        updateIcon(val, aisleSelect ? aisleSelect.value : cat);

        if (cat === 'other' && val.length >= 3) {
          resolveAisleOnline(val, (resolved) => {
            if (resolved && resolved !== 'other') {
              if (aisleSelect && aisleSelect.value === 'other') {
                aisleSelect.value = resolved;
                updateIcon(val, resolved);
              }
            }
          });
        }
      });

      if (aisleSelect) {
        aisleSelect.addEventListener('change', () => {
          updateIcon(nameInput.value, aisleSelect.value);
        });
      }
    }
  }

  addStepRow(data = {}) {
    const container = document.getElementById('edit-steps-container');
    const currentStepNum = container.children.length + 1;
    const row = document.createElement('div');
    row.className = 'edit-step-row edit-step-card';

    const text = data.text || '';
    let timerMinutes = parseInt(data.timerMinutes, 10) || 0;
    let isAutoDetected = false;

    if (!timerMinutes && text) {
      const detected = extractTimerFromStepText(text);
      if (detected > 0) {
        timerMinutes = detected;
        isAutoDetected = true;
      }
    }

    row.innerHTML = `
      <div class="edit-step-header">
        <div class="step-header-left">
          <span class="step-num-pill">${currentStepNum}</span>
          <span class="step-title-text">Paso ${currentStepNum}</span>
        </div>
        <button type="button" class="btn-remove-item" title="Eliminar paso">
          <span class="material-symbols-outlined icon-sm">delete</span>
        </button>
      </div>

      <textarea class="form-textarea step-text" rows="2" placeholder="Instrucción del paso...">${text}</textarea>

      <div class="edit-step-footer">
        <div class="step-timer-slot"></div>
        <input type="hidden" class="step-timer" value="${timerMinutes}">
      </div>
    `;
    container.appendChild(row);

    const stepText = row.querySelector('.step-text');
    const timerInput = row.querySelector('.step-timer');
    const timerSlot = row.querySelector('.step-timer-slot');
    const btnRemove = row.querySelector('.btn-remove-item');

    let manualOverride = (data.timerMinutes !== undefined && data.timerMinutes !== null && data.timerMinutes > 0);

    const renderTimerSlot = () => {
      const mins = parseInt(timerInput.value, 10) || 0;
      if (mins > 0) {
        timerSlot.innerHTML = `
          <div class="step-timer-badge">
            <span class="material-symbols-outlined icon-sm" style="font-size: 15px;">timer</span>
            <span class="timer-display-text">${mins} min</span>
            ${isAutoDetected ? '<span class="step-timer-auto-tag">Auto</span>' : ''}
            <button type="button" class="btn-timer-edit" style="background:none;border:none;cursor:pointer;padding:0 2px;color:inherit;display:inline-flex;align-items:center;" title="Cambiar minutos">
              <span class="material-symbols-outlined" style="font-size: 14px;">edit</span>
            </button>
            <button type="button" class="btn-timer-remove" style="background:none;border:none;cursor:pointer;padding:0 2px;color:inherit;display:inline-flex;align-items:center;" title="Quitar temporizador">
              <span class="material-symbols-outlined" style="font-size: 15px;">close</span>
            </button>
          </div>
        `;

        timerSlot.querySelector('.btn-timer-edit')?.addEventListener('click', () => {
          showInlineTimerEdit(mins);
        });

        timerSlot.querySelector('.btn-timer-remove')?.addEventListener('click', () => {
          timerInput.value = "0";
          manualOverride = true;
          isAutoDetected = false;
          renderTimerSlot();
        });
      } else {
        timerSlot.innerHTML = `
          <button type="button" class="btn-step-timer-prompt" title="Añadir temporizador opcional">
            <span class="material-symbols-outlined icon-sm" style="font-size: 14px;">timer</span>
            <span>+ Tiempo opcional</span>
          </button>
        `;

        timerSlot.querySelector('.btn-step-timer-prompt')?.addEventListener('click', () => {
          showInlineTimerEdit(mins || 5);
        });
      }
    };

    const showInlineTimerEdit = (initialVal) => {
      timerSlot.innerHTML = `
        <div class="step-timer-inline-edit">
          <span class="material-symbols-outlined icon-sm" style="font-size: 15px; color: var(--m3-primary);">timer</span>
          <input type="number" class="step-timer-mini-input" value="${initialVal || ''}" min="1" max="999" placeholder="Min" autofocus>
          <span style="font-size: 12px; color: var(--m3-on-surface-variant);">min</span>
          <button type="button" class="btn-save-inline-timer btn btn-primary btn-sm" style="padding: 2px 8px; font-size: 11px; height: 24px;">OK</button>
        </div>
      `;

      const miniInput = timerSlot.querySelector('.step-timer-mini-input');
      const btnSave = timerSlot.querySelector('.btn-save-inline-timer');

      const applyTimer = () => {
        const val = parseInt(miniInput.value, 10);
        if (!isNaN(val) && val > 0) {
          timerInput.value = String(val);
          manualOverride = true;
          isAutoDetected = false;
        } else {
          timerInput.value = "0";
        }
        renderTimerSlot();
      };

      btnSave?.addEventListener('click', applyTimer);
      miniInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyTimer();
        } else if (e.key === 'Escape') {
          renderTimerSlot();
        }
      });
      miniInput?.focus();
    };

    stepText.addEventListener('input', () => {
      if (!manualOverride) {
        const detected = extractTimerFromStepText(stepText.value);
        if (detected > 0) {
          timerInput.value = String(detected);
          isAutoDetected = true;
          renderTimerSlot();
        } else if (parseInt(timerInput.value, 10) > 0 && isAutoDetected) {
          timerInput.value = "0";
          isAutoDetected = false;
          renderTimerSlot();
        }
      }
    });

    btnRemove.addEventListener('click', () => {
      row.remove();
      this.renumberSteps();
    });

    renderTimerSlot();
  }

  saveRecipeEdit() {
    const title = document.getElementById('edit-recipe-title').value.trim();
    if (!title) {
      alert("Por favor, introduce el título de la receta.");
      return;
    }

    const id = document.getElementById('edit-recipe-id').value || generateId('rec-');
    const description = document.getElementById('edit-recipe-desc').value.trim();
    const imageUrl = document.getElementById('edit-recipe-image')?.value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
    const prepTimeMinutes = parseInt(document.getElementById('edit-recipe-prep').value, 10) || 0;
    const cookTimeMinutes = parseInt(document.getElementById('edit-recipe-cook').value, 10) || 0;
    const servings = parseInt(document.getElementById('edit-recipe-servings').value, 10) || 2;
    let tags = this.editorSelectedTags && this.editorSelectedTags.size > 0
      ? Array.from(this.editorSelectedTags)
      : (document.getElementById('edit-recipe-tags')?.value.trim()
          ? document.getElementById('edit-recipe-tags').value.split(',').map(t => t.trim()).filter(Boolean)
          : []);
    if (!tags) tags = [];
    tags = tags.filter(t => t && t.toLowerCase() !== 'general');
    tags.forEach(t => state.addCustomTag && state.addCustomTag(t));

    // Collect Ingredients
    const ingredients = [];
    document.querySelectorAll('#edit-ingredients-container .edit-ing-row').forEach(row => {
      const name = row.querySelector('.ing-name').value.trim();
      const amountVal = row.querySelector('.ing-amount').value;
      const unit = row.querySelector('.ing-unit').value.trim();
      const aisle = row.querySelector('.ing-aisle').value;

      if (name) {
        ingredients.push({
          id: generateId('ing-'),
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
    const existing = existingIdx >= 0 ? state.recipes[existingIdx] : null;
    const finalRecipe = {
      ...(existing || {}),
      ...updatedRecipe,
      sourceUrl: existing?.sourceUrl || updatedRecipe.sourceUrl || '',
      sourceDomain: existing?.sourceDomain || updatedRecipe.sourceDomain || '',
      createdAt: existing?.createdAt || existing?.updatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      state.recipes[existingIdx] = finalRecipe;
    } else {
      state.recipes.unshift(finalRecipe);
    }

    state.save('fa_recipes', state.recipes);
    this.isReviewingImport = false;
    this.pendingImportRecipe = null;
    this.closeEditModal();
    this.render();
    this.openRecipeDetail(id);
    this.scheduleSyncWithCloud();
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

  // PLANNER - US-05, US-22, BUG-07, BUG-08, BUG-17
  getPlannerWeekDates() {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (this.plannerWeekOffset * 7));
    return getWeekDates(targetDate);
  }

  navigateWeek(direction) {
    if (direction === 0) {
      this.plannerWeekOffset = 0;
    } else {
      this.plannerWeekOffset += direction;
    }
    this.renderPlanner();
  }

  updatePlannerWeekLabel(weekDays) {
    const labelElem = document.getElementById('planner-week-range-text');
    if (labelElem) {
      labelElem.textContent = formatWeekRange(weekDays);
    }
    const currentBtn = document.getElementById('btn-current-week');
    if (currentBtn) {
      if (this.plannerWeekOffset === 0) {
        currentBtn.classList.remove('btn-ghost');
        currentBtn.classList.add('btn-tonal');
      } else {
        currentBtn.classList.remove('btn-tonal');
        currentBtn.classList.add('btn-ghost');
      }
    }
  }

  renderPlanner() {
    const container = document.getElementById('planner-days-container');
    if (!container) return;

    const weekDays = this.getPlannerWeekDates();
    this.updatePlannerWeekLabel(weekDays);

    container.innerHTML = weekDays.map((wDay) => {
      const dateStr = wDay.dateKey;
      const dayData = state.getDayPlan(dateStr, wDay.dayName);
      const isToday = toLocalDateKey() === dateStr;
      const customSlots = Array.isArray(dayData.customSlots) ? dayData.customSlots : [];
      const dayDateFormatted = `${wDay.date.getDate()} ${MONTHS_SHORT_ES[wDay.date.getMonth()]}`;

      return `
        <div class="day-card ${isToday ? 'day-card-today' : ''}">
          <div class="day-header">
            <div class="day-name">
              <span class="day-title">${wDay.dayName}</span>
              <span class="day-date-label">${dayDateFormatted}</span>
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
      const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
      const warningHtml = !comp.compliant ? `
        <div class="dietary-warning-badge" title="Incumple preferencias dietéticas: ${comp.violations.join(', ')}">
          <span class="material-symbols-outlined" style="font-size: 13px;">warning</span> No cumple: ${comp.violations.join(', ')}
        </div>
      ` : '';

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
            <img src="${recipe.imageUrl}" alt="" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" onerror="this.src='data:image/svg+xml,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 48 48\\\'><rect width=\\\'48\\\' height=\\\'48\\\' rx=\\\'8\\\' fill=\\\'%23f1f3f4\\\'/><text x=\\\'50%25\\\' y=\\\'55%25\\\' dominant-baseline=\\\'middle\\\' text-anchor=\\\'middle\\\' font-size=\\\'18\\\'>🍲</text></svg>'">
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
              ${warningHtml}
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
      const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
      const warningHtml = !comp.compliant ? `
        <div class="dietary-warning-badge" title="Incumple preferencias dietéticas: ${comp.violations.join(', ')}">
          <span class="material-symbols-outlined" style="font-size: 13px;">warning</span> No cumple: ${comp.violations.join(', ')}
        </div>
      ` : '';

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
            <img src="${recipe.imageUrl}" alt="" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" onerror="this.src='data:image/svg+xml,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 48 48\\\'><rect width=\\\'48\\\' height=\\\'48\\\' rx=\\\'8\\\' fill=\\\'%23f1f3f4\\\'/><text x=\\\'50%25\\\' y=\\\'55%25\\\' dominant-baseline=\\\'middle\\\' text-anchor=\\\'middle\\\' font-size=\\\'18\\\'>🍲</text></svg>'">
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
              ${warningHtml}
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
      state.mealPlan[dateStr].updatedAt = new Date().toISOString();
      state.save('fa_mealplan', state.mealPlan);
      this.scheduleSyncWithCloud();
      this.render();
    }
  }

  clearCustomSlotRecipe(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      const cs = state.mealPlan[dateStr].customSlots.find(c => c.id === customSlotId);
      if (cs) {
        cs.recipeId = null;
        state.mealPlan[dateStr].updatedAt = new Date().toISOString();
        state.save('fa_mealplan', state.mealPlan);
        this.scheduleSyncWithCloud();
        this.render();
      }
    }
  }

  deleteCustomSlot(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      state.mealPlan[dateStr].customSlots = state.mealPlan[dateStr].customSlots.filter(c => c.id !== customSlotId);
      state.mealPlan[dateStr].updatedAt = new Date().toISOString();
      state.save('fa_mealplan', state.mealPlan);
      this.scheduleSyncWithCloud();
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

    const dateStr = dateInput?.value || toLocalDateKey();
    const name = (nameInput?.value || '').trim();
    const icon = iconSelect?.value || 'lunch_dining';

    if (!name) {
      alert("Por favor, introduce el nombre del momento de comida (ej. Media Mañana, Post-Entreno...).");
      return;
    }

    const dayData = state.getDayPlan(dateStr);
    const newSlot = {
      id: generateId('cslot-'),
      name: name,
      icon: icon,
      recipeId: null
    };

    dayData.customSlots.push(newSlot);
    dayData.updatedAt = new Date().toISOString();
    state.save('fa_mealplan', state.mealPlan);
    this.scheduleSyncWithCloud();
    this.closeAddCustomSlotModal();
    this.render();
  }

  openPickerModal(dateStr, slotKey, isCustom = false) {
    this.pickerTarget = { dateStr, slotKey, isCustom };
    const filterBar = document.getElementById('picker-dietary-filter-bar');
    const toggleBtn = document.getElementById('btn-toggle-picker-dietary-only');

    let slotTitle = slotKey;
    if (isCustom) {
      const cs = (state.mealPlan[dateStr]?.customSlots || []).find(c => c.id === slotKey);
      slotTitle = cs ? cs.name : 'Momento Extra';
    } else {
      const std = STANDARD_SLOTS.find(s => s.key === slotKey);
      slotTitle = std ? std.label : slotKey;
    }

    document.getElementById('picker-modal-title').textContent = `Elegir plato para ${slotTitle.toUpperCase()}`;

    const hasPreferences = Array.isArray(state.dietaryPreferences) && state.dietaryPreferences.length > 0;
    if (filterBar) {
      filterBar.style.display = hasPreferences ? 'flex' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.pickerOnlyDietary);
    }

    this.renderPickerRecipesList();
    this.modalRecipePicker.classList.add('active');
  }

  renderPickerRecipesList() {
    const list = document.getElementById('picker-recipes-list');
    if (!list) return;

    let recipes = this.getSortedRecipes(state.recipes);
    const hasPreferences = Array.isArray(state.dietaryPreferences) && state.dietaryPreferences.length > 0;

    if (this.pickerOnlyDietary && hasPreferences) {
      recipes = recipes.filter(r => checkDietaryCompliance(r, state.dietaryPreferences).compliant);
    }

    if (recipes.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 28px 16px; color: var(--m3-on-surface-variant); font-size: 13px;">
          <span class="material-symbols-outlined" style="font-size: 32px; display: block; margin-bottom: 6px; color: var(--m3-primary);">eco</span>
          No hay recetas que cumplan con los filtros dietéticos seleccionados.
        </div>
      `;
      return;
    }

    list.innerHTML = recipes.map(r => {
      const comp = hasPreferences ? checkDietaryCompliance(r, state.dietaryPreferences) : { compliant: true, violations: [] };
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--m3-surface-container-low); border: 1px solid var(--m3-outline-variant); border-radius: var(--radius-md); cursor: pointer;"
             onclick="app.selectRecipeForSlot('${r.id}')">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; padding-right: 8px;">
            <img src="${r.imageUrl}" alt="" style="width: 42px; height: 42px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" onerror="this.src='data:image/svg+xml,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 48 48\\\'><rect width=\\\'48\\\' height=\\\'48\\\' rx=\\\'8\\\' fill=\\\'%23f1f3f4\\\'/><text x=\\\'50%25\\\' y=\\\'55%25\\\' dominant-baseline=\\\'middle\\\' text-anchor=\\\'middle\\\' font-size=\\\'18\\\'>🍲</text></svg>'">
            <div style="min-width: 0;">
              <strong style="font-size: 13px; color: var(--m3-on-surface); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.title}</strong>
              <div style="font-size: 11px; color: var(--m3-on-surface-variant); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span class="material-symbols-outlined icon-sm">schedule</span> ${r.prepTimeMinutes + r.cookTimeMinutes} min
              </div>
              ${hasPreferences ? (
                comp.compliant
                  ? `<span class="dietary-ok-badge" style="margin-top: 3px;"><span class="material-symbols-outlined" style="font-size: 12px;">check</span> Apta (${state.dietaryPreferences.join(', ')})</span>`
                  : `<span class="dietary-warning-badge" style="margin-top: 3px;"><span class="material-symbols-outlined" style="font-size: 12px;">warning</span> No cumple: ${comp.violations.join(', ')}</span>`
              ) : ''}
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="flex-shrink: 0;">Elegir</button>
        </div>
      `;
    }).join('');
  }

  closePickerModal() {
    this.modalRecipePicker.classList.remove('active');
  }

  selectRecipeForSlot(recipeId) {
    if (this.pickerTarget) {
      const { dateStr, slotKey, isCustom } = this.pickerTarget;
      const dayData = state.getDayPlan(dateStr);

      if (isCustom) {
        const cs = dayData.customSlots.find(c => c.id === slotKey);
        if (cs) {
          cs.recipeId = recipeId;
        }
      } else {
        dayData[slotKey] = recipeId;
      }
      dayData.updatedAt = new Date().toISOString();

      state.save('fa_mealplan', state.mealPlan);
      this.closePickerModal();
      this.scheduleSyncWithCloud();
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
                  <div class="grocery-item-icon-badge" title="${item.name}">
                    <span class="material-symbols-outlined icon-sm">${getIngredientIcon(item.name, item.aisle)}</span>
                  </div>
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
      state.shoppingList[index].updatedAt = new Date().toISOString();
      state.save('fa_shopping', state.shoppingList);
      this.scheduleSyncWithCloud();
      this.render();
    }
  }

  deleteGroceryItem(index) {
    const item = state.shoppingList[index];
    if (item && item.id) {
      state.trackDeletion('shoppingItems', item.id);
    }
    state.shoppingList.splice(index, 1);
    state.save('fa_shopping', state.shoppingList);
    this.scheduleSyncWithCloud();
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
          state.shoppingList.forEach(item => {
            if (item.id) state.trackDeletion('shoppingItems', item.id);
          });
          state.shoppingList = [];
          state.save('fa_shopping', state.shoppingList);
          this.scheduleSyncWithCloud();
          this.render();
        }
      } else {
        if (confirm(`\u00BFEliminar los ${count} art\u00EDculos marcados como comprados?`)) {
          completed.forEach(item => {
            if (item.id) state.trackDeletion('shoppingItems', item.id);
          });
          state.shoppingList = state.shoppingList.filter(i => !i.isChecked);
          state.save('fa_shopping', state.shoppingList);
          this.scheduleSyncWithCloud();
          this.render();
        }
      }
    } else {
      // Ningún artículo está marcado con el checkbox
      if (confirm("No hay artículos marcados como comprados.\n\n¿Deseas vaciar toda la lista de la compra?")) {
        state.shoppingList.forEach(item => {
          if (item.id) state.trackDeletion('shoppingItems', item.id);
        });
        state.shoppingList = [];
        state.save('fa_shopping', state.shoppingList);
        this.scheduleSyncWithCloud();
        this.render();
      }
    }
  }

  handleManualAddGrocery() {
    const input = document.getElementById('input-quick-grocery');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    // Hide autocomplete dropdown if present
    const autoList = document.getElementById('quick-grocery-autocomplete');
    if (autoList) autoList.style.display = 'none';

    // Parse structured input if user typed quantities (e.g. "500g pollo", "2 aguacates")
    const parsed = RecipeParser.parseIngredientLine(text);
    let name = text;
    let amount = null;
    let unit = "";
    let aisle = 'other';

    if (parsed && parsed.name) {
      name = parsed.name;
      amount = parsed.amount !== null && parsed.amount !== undefined ? parsed.amount : null;
      unit = parsed.unit || "";
      aisle = parsed.aisle || categorizeIngredientAisle(parsed.name);
    } else {
      aisle = categorizeIngredientAisle(text);
      name = text.charAt(0).toUpperCase() + text.slice(1);
    }

    state.shoppingList.push({
      id: generateId('shop-'),
      name: name,
      amount: amount,
      unit: unit,
      aisle: aisle,
      isChecked: false,
      recipeOrigin: "Añadido manualmente",
      updatedAt: new Date().toISOString()
    });

    state.save('fa_shopping', state.shoppingList);
    this.scheduleSyncWithCloud();
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

    // Collect from the active planner week
    const weekDays = this.getPlannerWeekDates();
    weekDays.forEach(wDay => {
      const day = state.mealPlan[wDay.dateKey];
      if (!day) return;
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

    // Fallback to all plan entries if the current visible week is empty
    if (recipeOccurrences.size === 0) {
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
    }

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
      state.shoppingList.forEach(item => {
        if (item.id) state.trackDeletion('shoppingItems', item.id);
      });
      state.shoppingList = [];
    }

    let addedCount = 0;
    selectedItems.forEach(item => {
      const key = `${item.name.toLowerCase().trim()}_${(item.unit || '').toLowerCase().trim()}`;
      const existing = state.shoppingList.find(i => `${i.name.toLowerCase().trim()}_${(i.unit || '').toLowerCase().trim()}` === key && !i.isChecked);

      if (existing && existing.amount !== null && item.amount !== null) {
        existing.amount = Math.round((existing.amount + item.amount) * 10) / 10;
        existing.updatedAt = new Date().toISOString();
        if (item.recipeOrigin && !existing.recipeOrigin.includes(item.recipeOrigin)) {
          existing.recipeOrigin += `, ${item.recipeOrigin}`;
        }
      } else {
        state.shoppingList.push({
          id: item.id || generateId('shop-'),
          name: item.name,
          amount: item.amount,
          unit: item.unit || '',
          aisle: item.aisle || 'other',
          isChecked: false,
          recipeOrigin: item.recipeOrigin || '',
          updatedAt: new Date().toISOString()
        });
      }
      addedCount++;
    });

    state.save('fa_shopping', state.shoppingList);
    this.scheduleSyncWithCloud();
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
    const weekDays = this.getPlannerWeekDates();
    weekDays.forEach(wDay => {
      const dayData = state.getDayPlan(wDay.dateKey, wDay.dayName);
      dayData.breakfast = (breakfastRecipes[i % breakfastRecipes.length] || all[i % all.length])?.id || null;
      dayData.lunch = (lunchRecipes[i % lunchRecipes.length] || all[(i + 1) % all.length])?.id || null;
      dayData.snack = (snackRecipes[i % snackRecipes.length] || all[(i + 2) % all.length])?.id || null;
      dayData.dinner = (dinnerRecipes[i % dinnerRecipes.length] || all[(i + 3) % all.length])?.id || null;
      i++;
    });
    state.save('fa_mealplan', state.mealPlan);
    this.scheduleSyncWithCloud();
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
  openImportModal(defaultTab = 'url') {
    if (this.modalRecipeImport) {
      this.modalRecipeImport.classList.add('active');
    }
    const urlInput = document.getElementById('import-url-input');
    if (urlInput) urlInput.value = '';
    const textInput = document.getElementById('import-text-input');
    if (textInput) textInput.value = '';
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
    this.switchImportTab(defaultTab || 'url');
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
    const textarea = document.getElementById('import-text-input');
    const status = document.getElementById('import-status-indicator');
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
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
    if (textarea) {
      textarea.focus();
      textarea.select();
      if (status) {
        status.style.display = 'block';
        status.style.color = 'var(--m3-on-surface-variant)';
        status.innerHTML = '<span class="material-symbols-outlined icon-sm" style="vertical-align: middle;">help</span> Para pegar, pulsa <strong>Ctrl + V</strong> (o mantén pulsado el área de texto en móvil).';
      }
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
              const detectedImg = RecipeParser.extractImageFromHtml(html);
              if (detectedImg) {
                extractedRecipe.imageUrl = detectedImg;
              } else {
                const imgMatch = html.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
                if (imgMatch && imgMatch[1] && !RecipeParser.isBadImage(imgMatch[1])) {
                  extractedRecipe.imageUrl = imgMatch[1];
                }
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
      newRecipe.id = generateId('rec-');
    }
    const existingIdx = state.recipes.findIndex(r => r.id === newRecipe.id);
    const existing = existingIdx >= 0 ? state.recipes[existingIdx] : null;

    newRecipe.createdAt = newRecipe.createdAt || existing?.createdAt || existing?.updatedAt || new Date().toISOString();
    newRecipe.updatedAt = new Date().toISOString();

    if (existingIdx >= 0) {
      state.recipes[existingIdx] = newRecipe;
    } else {
      state.recipes.unshift(newRecipe);
    }

    state.save('fa_recipes', state.recipes);
    this.scheduleSyncWithCloud();
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

    this.renderDietaryPreferencesSettings();
  }

  // US-02: Preferencias dietéticas activas en Ajustes
  renderDietaryPreferencesSettings() {
    const container = document.getElementById('settings-dietary-chips');
    if (!container) return;

    container.innerHTML = PREDEFINED_DIETARY_TAGS.map(pref => {
      const isSelected = (state.dietaryPreferences || []).includes(pref);
      return `
        <button type="button" class="m3-filter-chip dietary-chip ${isSelected ? 'active' : ''}" onclick="app.toggleDietaryPreference('${pref}')">
          ${isSelected ? '<span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>' : `<span class="dietary-emoji">${getDietaryTagEmoji(pref)}</span>`}
          <span>${pref}</span>
        </button>
      `;
    }).join('');
  }

  toggleDietaryPreference(pref) {
    if (!pref) return;
    let prefs = [...(state.dietaryPreferences || [])];
    if (prefs.includes(pref)) {
      prefs = prefs.filter(p => p !== pref);
    } else {
      prefs.push(pref);
    }
    state.saveDietaryPreferences(prefs);
    this.renderDietaryPreferencesSettings();
    this.renderPlanner();
    this.renderTodayView();
  }

  // US-02: Auto-análisis inteligente y etiquetado masivo de recetas guardadas
  async autoAnalyzeAndTagAllRecipes() {
    const recipes = state.recipes || [];
    let updatedCount = 0;
    let totalTagsAdded = 0;
    const nowIso = new Date().toISOString();

    recipes.forEach(recipe => {
      // 1. Limpiar la etiqueta obsoleta "General" si existe
      if (Array.isArray(recipe.tags) && recipe.tags.some(t => t && String(t).trim().toLowerCase() === 'general')) {
        recipe.tags = recipe.tags.filter(t => t && String(t).trim().toLowerCase() !== 'general');
      }

      const existingTags = Array.isArray(recipe.tags) ? recipe.tags : [];
      const existingLower = new Set(existingTags.map(t => String(t).toLowerCase().trim()));
      const inferredTags = analyzeAndInferRecipeTags(recipe);

      const newTagsToAdd = [];
      inferredTags.forEach(tag => {
        if (!existingLower.has(tag.toLowerCase().trim()) && tag.toLowerCase().trim() !== 'general') {
          newTagsToAdd.push(tag);
          state.addCustomTag && state.addCustomTag(tag);
        }
      });

      if (newTagsToAdd.length > 0) {
        recipe.tags = [...existingTags, ...newTagsToAdd];
        recipe.updatedAt = nowIso;
        updatedCount++;
        totalTagsAdded += newTagsToAdd.length;
      }
    });

    if (updatedCount > 0) {
      state.save('fa_recipes', state.recipes);
      this.initRecipeTagFilters();
      this.render();
      if (this.supabaseClient && state.cloudUser?.id) {
        await this.pushToCloud(true);
      }
    }

    const resultMsg = document.getElementById('auto-tag-result-msg');
    if (resultMsg) {
      resultMsg.style.display = 'block';
      if (updatedCount > 0) {
        resultMsg.innerHTML = `<span style="color: var(--color-brand); font-weight: 500;">✓ ¡Análisis completado! Se actualizaron ${updatedCount} ${updatedCount === 1 ? 'receta' : 'recetas'} con ${totalTagsAdded} nuevas ${totalTagsAdded === 1 ? 'etiqueta' : 'etiquetas'}.</span>`;
      } else {
        resultMsg.innerHTML = `<span style="color: var(--m3-on-surface-variant); font-weight: 500;">✓ Todas tus recetas ya cuentan con las etiquetas correspondientes.</span>`;
      }
    }

    return { updatedCount, totalTagsAdded };
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
    a.download = `food-assistant-backup-${toLocalDateKey()}.json`;
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
      localStorage.removeItem('fa_deleted_records');
      state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };
      state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
      state.mealPlan = state.generateInitialMealPlan();
      state.shoppingList = [];
      state.save('fa_recipes', state.recipes);
      state.save('fa_mealplan', state.mealPlan);
      state.save('fa_shopping', state.shoppingList);
      state.save('fa_deleted_records', state.deletedRecords);
      try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) {}
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
  window.COMMON_INGREDIENTS = COMMON_INGREDIENTS;
  window.normalizeIngredientText = normalizeIngredientText;
  window.categorizeIngredientAisle = categorizeIngredientAisle;
  window.resolveAisleOnline = resolveAisleOnline;
  window.getCachedAisle = getCachedAisle;
  window.setCachedAisle = setCachedAisle;
  window.getIngredientIcon = getIngredientIcon;
  window.getIngredientSuggestions = getIngredientSuggestions;
  window.extractTimerFromStepText = extractTimerFromStepText;
  window.StateStore = StateStore;
  window.state = state;
  window.FoodAssistantApp = FoodAssistantApp;
  window.generateId = generateId;
  window.analyzeAndInferRecipeTags = analyzeAndInferRecipeTags;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SEED_RECIPES,
    STANDARD_SLOTS,
    AISLE_METADATA,
    COMMON_INGREDIENTS,
    normalizeIngredientText,
    categorizeIngredientAisle,
    resolveAisleOnline,
    getCachedAisle,
    setCachedAisle,
    getIngredientIcon,
    getIngredientSuggestions,
    extractTimerFromStepText,
    StateStore,
    FoodAssistantApp,
    generateId,
    analyzeAndInferRecipeTags
  };
}
