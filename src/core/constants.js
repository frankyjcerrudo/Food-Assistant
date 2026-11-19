// Food Assistant - Core Constants (US-42)
const DAYS_OF_WEEK_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const NUTRITION_ENGINE_VERSION = 2;

const SEED_RECIPES = [
  {
    id: "rec-pesto-pasta",
    title: "Pasta al Pesto Genovés con Tomates Cherry",
    description: "Espaguetis al dente con salsa de albahaca fresca casera, piñones tostados, queso parmesano y tomates cherry salteados.",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 2,
    nutrition: { calories: 835, protein: 23.9, carbs: 77.8, fat: 48.7 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 667, protein: 67.6, carbs: 55.9, fat: 21.4 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 581, protein: 42, carbs: 61.5, fat: 17.8 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 518, protein: 28.3, carbs: 52.8, fat: 23.1 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 373, protein: 13.4, carbs: 25.2, fat: 25.9 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 442, protein: 13.3, carbs: 71.3, fat: 12.3 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 388, protein: 12, carbs: 42.5, fat: 18.6 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
    nutrition: { calories: 347, protein: 17.2, carbs: 40.4, fat: 13.1 },
    nutritionEngineVersion: NUTRITION_ENGINE_VERSION,
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
// US-01: GESTIÓN NUTRICIONAL, MACRONUTRIENTES Y ESTIMADOR (Kcal, P, C, G)
// ==========================================================================
function isValidExternalNutrition(nut) {
  if (!nut || typeof nut !== 'object') return false;
  const calories = Number(nut.calories);
  const protein = Number(nut.protein);
  const carbs = Number(nut.carbs);
  const fat = Number(nut.fat);
  if (![calories, protein, carbs, fat].every(v => Number.isFinite(v) && v >= 0)) return false;
  if (calories <= 0 && protein <= 0 && carbs <= 0 && fat <= 0) return false;
  if (calories > 50 && protein === 0 && carbs === 0 && fat === 0) return false;
  const isFakeDefault =
    (Math.round(calories) === 450 && Math.round(protein) === 28 && Math.round(carbs) === 45 && Math.round(fat) === 15) ||
    (Math.round(calories) === 350 && Math.round(protein) === 14 && Math.round(carbs) === 48 && Math.round(fat) === 10) ||
    (Math.round(calories) === 280 && Math.round(protein) === 12 && Math.round(carbs) === 35 && Math.round(fat) === 8);
  if (isFakeDefault) return false;
  const atwater = protein * 4 + carbs * 4 + fat * 9;
  if (calories > 0 && atwater > 0) {
    const ratio = calories / atwater;
    if (ratio < 0.60 || ratio > 1.50) return false;
  }
  return true;
}

function classifyIngredientNutritionProfile(normName, aisle = '') {
  const hasCalorieBearer = /\b(coco|leche|milk|nata|cream|azucar|sugar|miel|honey|sirope|syrup|balsamico|balsamic|aceite|oil|mantequilla|butter|cacao|cocoa|chocolate|arroz|rice|avena|oats|almendra|almond|soja|soy|panela|licor|vino|cerveza)\b/.test(normName);

  // 1. Líquidos 0 kcal (solo si empiezan por agua/hielo/café/té/infusión/vinagre sin ingredientes calóricos)
  if (
    !hasCalorieBearer &&
    /^(agua|water|hielo|ice|cafe|espresso|te|tea|infusion|vinagre|vinegar)\b/.test(normName) &&
    !/\b(crema|reduccion|glaseado)\b/.test(normName)
  ) {
    return { c100: 0, p100: 0, cb100: 0, f100: 0, category: 'liquid', isPureOilOrFat: false, isZeroCal: true };
  }

  // 2. Caldos y consomés
  if (/\b(caldos?|broths?|stocks?|consomes?)\b/.test(normName)) {
    return { c100: 10, p100: 1, cb100: 0.8, f100: 0.3, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }

  // 3. Salsas y condimentos específicos (antes de soja, aceite, tomate y sal)
  if (/\b(salsa\s+de\s+soja|soy\s+sauce|tamari)\b/.test(normName)) {
    return { c100: 53, p100: 8, cb100: 5, f100: 0, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(vinagre\s+balsamico|crema\s+balsamica|glaseado\s+balsamico|reduccion\s+(?:de\s+)?(?:modena|balsamico)|balsamic\s+glaze)\b/.test(normName)) {
    return { c100: 88, p100: 0.5, cb100: 17, f100: 0, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(mayonesas?|aliolis?|mayonnaise|mayo)\b/.test(normName)) {
    return { c100: 680, p100: 1, cb100: 1, f100: 75, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(pestos?)\b/.test(normName)) {
    return { c100: 450, p100: 5, cb100: 6, f100: 45, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(salsa\s+(?:barbacoa|bbq|teriyaki|agridulce)|ketchups?|catsup)\b/.test(normName)) {
    return { c100: 115, p100: 1.5, cb100: 26, f100: 0.3, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(mostazas?|mustards?)\b/.test(normName)) {
    return { c100: 66, p100: 4, cb100: 6, f100: 3.5, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(tomate\s+frito|salsa\s+de\s+tomate|tomato\s+sauce|marinara)\b/.test(normName)) {
    return { c100: 75, p100: 1.5, cb100: 9, f100: 3.5, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(tomate\s+(?:triturado|natural|tamizado|rallado|pelado)|passata|crushed\s+tomatoes?)\b/.test(normName)) {
    return { c100: 30, p100: 1.4, cb100: 5, f100: 0.2, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(bechamel)\b/.test(normName)) {
    return { c100: 130, p100: 4, cb100: 11, f100: 8, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(guacamole)\b/.test(normName)) {
    return { c100: 155, p100: 2, cb100: 8, f100: 14, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(vinagretas?|vinaigrette)\b/.test(normName)) {
    return { c100: 350, p100: 0.5, cb100: 4, f100: 37, category: 'sauce', isPureOilOrFat: false, isZeroCal: false };
  }

  // 4. Carnes, embutidos, pescados, mariscos, huevos y proteínas (antes de grasas/aceites)
  if (/\b(jamon\s+(?:cocido|york|dulce)|pechuga\s+de\s+pavo\s+(?:en\s+lonchas|cocida|braseada|fiambre)|fiambre\s+de\s+(?:pavo|pollo)|cooked\s+ham)\b/.test(normName)) {
    return { c100: 110, p100: 19, cb100: 1.5, f100: 3, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(jamon\s+(?:serrano|iberico|curado)|prosciutto|cecina)\b/.test(normName)) {
    return { c100: 245, p100: 31, cb100: 0, f100: 13, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(bacons?|beicons?|pancetas?|tocinos?|guanciale)\b/.test(normName)) {
    return { c100: 420, p100: 15, cb100: 0, f100: 40, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(lomo\s+(?:embuchado|curado|iberico))\b/.test(normName)) {
    return { c100: 200, p100: 32, cb100: 1, f100: 8, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(chorizos?|salchichon(?:es)?|fuets?|salamis?|chistorras?|sobrasadas?|morcillas?|pepperoni)\b/.test(normName)) {
    return { c100: 380, p100: 22, cb100: 2, f100: 32, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(salchichas?|frankfurts?|sausages?)\b/.test(normName)) {
    return { c100: 260, p100: 14, cb100: 2, f100: 22, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b((?:muslos?|contramuslos?|alitas?)\s+de\s+pollo|chicken\s+(?:thighs?|wings?|drumsticks?))\b/.test(normName)) {
    return { c100: 180, p100: 24, cb100: 0, f100: 9, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(pollos?|pechugas?|pavos?|conejos?|chickens?|turkeys?|rabbits?)\b/.test(normName)) {
    return { c100: 145, p100: 31, cb100: 0, f100: 3, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(salmon(?:es)?|atun(?:es)?|bonitos?|emperadores?|pez\s+espada|peces\s+espada|sardinas?|boqueron(?:es)?|caballas?|arenques?|anchoas?|tuna|mackerels?|anchov(?:y|ies)|sardines?)\b/.test(normName)) {
    return { c100: 190, p100: 22, cb100: 0, f100: 11, category: 'fish', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(doradas?|lubinas?|truchas?|merluzas?|bacalaos?|lenguados?|rodaballos?|corvinas?|rapes?|pescadillas?|gallos?|pescados?\s+blancos?|pescados?|cod|hake|sea\s+bass|tilapia|halibut|sole|trout|white\s+fish|fish)\b/.test(normName)) {
    return { c100: 105, p100: 20, cb100: 0, f100: 2.5, category: 'fish', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(gambas?|langostinos?|camarones?|calamar(?:es)?|chipiron(?:es)?|sepias?|pulpos?|mejillon(?:es)?|almejas?|berberechos?|chirlas?|vieiras?|cangrejos?|surimi|mariscos?|shrimps?|prawns?|squids?|octopus|mussels?|clams?|crabs?|seafood)\b/.test(normName)) {
    return { c100: 90, p100: 18, cb100: 1, f100: 1, category: 'seafood', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(terneras?|solomillos?|buey(?:es)?|entrecots?|chuleton(?:es)?|cerdos?|carnes?|lomos?|corderos?|hamburguesas?|albondigas?|patos?|beef|steaks?|pork|lamb|veal|duck)\b/.test(normName)) {
    return { c100: 210, p100: 25, cb100: 0, f100: 12, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(claras?(?:\s+de\s+huevo)?|egg\s+whites?)\b/.test(normName)) {
    return { c100: 50, p100: 11, cb100: 0.7, f100: 0.2, category: 'egg', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(huevos?|eggs?)\b/.test(normName)) {
    return { c100: 145, p100: 13, cb100: 1, f100: 10, category: 'egg', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(proteinas?|whey|polvos?\s+de\s+proteina|caseinas?|protein\s+powder)\b/.test(normName)) {
    return { c100: 380, p100: 75, cb100: 6, f100: 4, category: 'protein_powder', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(seitan)\b/.test(normName)) {
    return { c100: 140, p100: 24, cb100: 6, f100: 2, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(soja\s+texturizada|textured\s+soy)\b/.test(normName)) {
    return { c100: 335, p100: 50, cb100: 30, f100: 1.5, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(edamame)\b/.test(normName)) {
    return { c100: 122, p100: 11, cb100: 10, f100: 5, category: 'legume', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(tofus?|tempeh)\b/.test(normName)) {
    return { c100: 125, p100: 14, cb100: 3, f100: 6.5, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }

  // 5. Lácteos, quesos y bebidas vegetales
  if (/\b(queso\s+(?:fresco|de\s+burgos|batido|quark)|requeson|ricottas?|cottages?|quarks?|skyrs?)\b/.test(normName)) {
    return { c100: 98, p100: 11, cb100: 3.5, f100: 4.5, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(queso\s+(?:crema|de\s+untar|philadelphia)|philadelphia|mascarpone|cream\s+cheese)\b/.test(normName)) {
    return { c100: 280, p100: 6, cb100: 4, f100: 27, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(parmesanos?|parmesan|cheddars?|manchegos?|quesos?\s+curados?|emmentals?|gruyeres?|goudas?|pecorinos?|queso\s+azul|roqueforts?|gorgonzolas?|bries?|camemberts?)\b/.test(normName)) {
    return { c100: 375, p100: 26, cb100: 1.5, f100: 29, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(quesos?|mozzarellas?|fetas?|burratas?|halloumis?|provolones?|cheeses?)\b/.test(normName)) {
    return { c100: 270, p100: 20, cb100: 2.5, f100: 20, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(nata\s+(?:ligera|para\s+cocinar|de\s+cocinar)|light\s+cream)\b/.test(normName)) {
    return { c100: 180, p100: 2.5, cb100: 4, f100: 17, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(natas?|crema\s+de\s+leche|heavy\s+cream|whipping\s+cream|double\s+cream)\b/.test(normName)) {
    return { c100: 310, p100: 2, cb100: 3, f100: 32, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(leche\s+de\s+coco|crema\s+de\s+coco|coconut\s+milk|coconut\s+cream)\b/.test(normName)) {
    return { c100: 185, p100: 2, cb100: 3, f100: 19, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(leche\s+condensada|condensed\s+milk)\b/.test(normName)) {
    return { c100: 320, p100: 8, cb100: 55, f100: 8, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(yogur(?:es)?\s+griegos?|greek\s+yogurts?)\b/.test(normName)) {
    return { c100: 97, p100: 9, cb100: 4, f100: 5, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(yogur(?:es)?|yogurts?|kefirs?)\b/.test(normName)) {
    return { c100: 62, p100: 4.5, cb100: 5, f100: 2.5, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b((?:bebida|leche)\s+de\s+almendras?|almond\s+milk)\b/.test(normName)) {
    return { c100: 24, p100: 0.6, cb100: 2.5, f100: 1.2, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b((?:bebida|leche)\s+(?:vegetal|de\s+avena|de\s+soja|de\s+arroz)|bebidas?\s+vegetales?|oat\s+milk|soy\s+milk)\b/.test(normName)) {
    return { c100: 45, p100: 2, cb100: 6, f100: 1.5, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(leche\s+desnatada|skim\s+milk)\b/.test(normName)) {
    return { c100: 35, p100: 3.4, cb100: 5, f100: 0.2, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(leches?|milk)\b/.test(normName)) {
    return { c100: 52, p100: 3.3, cb100: 4.8, f100: 2.2, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }

  // 6a. Cremas de frutos secos (antes de mantequillas puras)
  if (/\b((?:crema|mantequilla)\s+de\s+(?:cacahuete|mani|almendras?|avellanas?|anacardos?|pistachos?)|tahinis?|peanut\s+butter|almond\s+butter)\b/.test(normName)) {
    return { c100: 590, p100: 24, cb100: 16, f100: 50, category: 'nuts', isPureOilOrFat: false, isZeroCal: false };
  }

  // 6b. Mantequilla, aceites y grasas puras (antes de sal/especias)
  if (/\b(mantequillas?|margarinas?|butters?|margarines?)\b/.test(normName)) {
    return { c100: 717, p100: 0.8, cb100: 0.1, f100: 81, category: 'fat', isPureOilOrFat: true, isZeroCal: false };
  }
  if (/\b(aceites?|ghee|mantecas?|oils?|lard)\b/.test(normName)) {
    return { c100: 884, p100: 0, cb100: 0, f100: 100, category: 'fat', isPureOilOrFat: true, isZeroCal: false };
  }

  // 7. Frutos secos y semillas
  if (/\b(nueces|nuez(?!\s+moscada)|almendras?|avellanas?|pistachos?|anacardos?|cacahuetes?|manis?|pinones?|chias?|sesamos?|linos?|pipas?|semillas?|frutos?\s+secos?|walnuts?|almonds?|hazelnuts?|pistachios?|cashews?|peanuts?|pine\s+nuts?|seeds?)\b/.test(normName)) {
    return { c100: 590, p100: 18, cb100: 15, f100: 52, category: 'nuts', isPureOilOrFat: false, isZeroCal: false };
  }

  // 8. Cereales, pastas, panes, tubérculos y legumbres
  if (/\b(gnocchis?|noquis?)\b/.test(normName)) {
    return { c100: 160, p100: 4, cb100: 34, f100: 0.8, category: 'grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(pasta\s+fresca|raviolis?|tortellinis?)\b/.test(normName)) {
    return { c100: 270, p100: 10, cb100: 46, f100: 5, category: 'grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(pastas?|espaguetis?|macarrones?|tallarines?|fideos?|lasanas?|canelones?|pennes?|fusillis?|tagliatelles?|spaghettis?|noodles?|ramen|udon)\b/.test(normName)) {
    return { c100: 350, p100: 12, cb100: 72, f100: 2, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(arroz|arroces|basmati|risotto|quinoas?|cuscus|couscous|bulgur|mijo|polenta|rice)\b/.test(normName)) {
    return { c100: 355, p100: 8.5, cb100: 76, f100: 1.5, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(granolas?|mueslis?)\b/.test(normName)) {
    return { c100: 450, p100: 10, cb100: 60, f100: 18, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(avenas?|copos\s+de\s+avena|harinas?|maicenas?|pan\s+rallado|panko|semolas?|oats?|oatmeal|flours?|breadcrumbs?)\b/.test(normName)) {
    return { c100: 365, p100: 12, cb100: 66, f100: 5, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(hojaldres?|masa\s+quebrada|puff\s+pastry)\b/.test(normName)) {
    return { c100: 410, p100: 6, cb100: 40, f100: 25, category: 'bakery', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(croissants?|brioches?|magdalenas?|bollos?)\b/.test(normName)) {
    return { c100: 390, p100: 8, cb100: 46, f100: 19, category: 'bakery', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(pan|panes|tostadas?|tostas?|panecillos?|baguettes?|pitas?|wraps?|fajitas?|tortillas?\s+de\s+(?:trigo|maiz|harina)|masas?|breads?|toasts?|buns?)\b/.test(normName)) {
    return { c100: 265, p100: 9, cb100: 50, f100: 3, category: 'bakery', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(boniatos?|batatas?|sweet\s+potatoes?)\b/.test(normName)) {
    return { c100: 86, p100: 1.6, cb100: 20, f100: 0.1, category: 'tuber', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(patatas?|papas?|potatoes?)\b/.test(normName)) {
    return { c100: 82, p100: 2, cb100: 18.5, f100: 0.1, category: 'tuber', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(yucas?|mandiocas?|platano\s+macho)\b/.test(normName)) {
    return { c100: 145, p100: 1.3, cb100: 34, f100: 0.3, category: 'tuber', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(hummus)\b/.test(normName)) {
    return { c100: 210, p100: 7, cb100: 15, f100: 13, category: 'legume', isPureOilOrFat: false, isZeroCal: false };
  }
  if (
    !/\bgreen\s+beans?\b/.test(normName) &&
    /\b(garbanzos?|lentejas?|alubias?|frijoles?|judias?\s+(?:pintas?|blancas?|negras?|rojas?)|habas?|legumbres?|chickpeas?|lentils?|beans?)\b/.test(normName)
  ) {
    if (/\b(sec[oa]s?|crud[oa]s?|dry|dried)\b/.test(normName)) {
      return { c100: 340, p100: 22, cb100: 58, f100: 2, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
    }
    return { c100: 130, p100: 8.5, cb100: 20, f100: 1.8, category: 'legume', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(guisantes?|peas?)\b/.test(normName)) {
    return { c100: 81, p100: 5.4, cb100: 14.5, f100: 0.4, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(maiz(?:\s+dulce)?|sweetcorn|corn)\b/.test(normName)) {
    return { c100: 86, p100: 3.2, cb100: 19, f100: 1.2, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  }

  // 9. Dulces, chocolate, azúcares, miel y repostería
  if (/\b(cacao(?:\s+puro|\s+en\s+polvo)?|cocoa)\b/.test(normName)) {
    return { c100: 340, p100: 20, cb100: 18, f100: 20, category: 'dry_grain', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(chocolates?|nutellas?|nocillas?)\b/.test(normName)) {
    return { c100: 540, p100: 6, cb100: 52, f100: 34, category: 'sweet', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(galletas?|bizcochos?|cookies?|biscuits?)\b/.test(normName)) {
    return { c100: 460, p100: 6, cb100: 68, f100: 18, category: 'bakery', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(azucar(?:es)?|panelas?|sugars?)\b/.test(normName)) {
    return { c100: 390, p100: 0, cb100: 98, f100: 0, category: 'sweet', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(miel(?:es)?|siropes?|agave|arce|melazas?|honeys?|syrups?)\b/.test(normName)) {
    return { c100: 310, p100: 0.3, cb100: 80, f100: 0, category: 'sweet', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(mermeladas?|confituras?|jams?)\b/.test(normName)) {
    return { c100: 250, p100: 0.4, cb100: 62, f100: 0.1, category: 'sweet', isPureOilOrFat: false, isZeroCal: false };
  }

  // 10. Frutas, aguacate y aceitunas
  if (/\b(aguacates?|avocados?)\b/.test(normName)) {
    return { c100: 160, p100: 2, cb100: 8.5, f100: 15, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(aceitunas?|olivas?|olives?)\b/.test(normName)) {
    return { c100: 145, p100: 1, cb100: 4, f100: 14, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(coco\s+(?:rallado|seco)|shredded\s+coconut)\b/.test(normName)) {
    return { c100: 660, p100: 7, cb100: 24, f100: 64, category: 'nuts', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(datiles?|pasas?|orejones?|ciruelas?\s+pasas?|arandanos?\s+secos?|dates?|raisins?)\b/.test(normName)) {
    return { c100: 295, p100: 2.5, cb100: 75, f100: 0.5, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(platanos?|bananas?)\b/.test(normName)) {
    return { c100: 89, p100: 1.1, cb100: 23, f100: 0.3, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }
  if (!/\btomates?\b/.test(normName) && /\b(mangos?|uvas?|cerezas?|higos?|caquis?|granadas?|chirimoyas?|grapes?|cherr(?:y|ies)|figs?)\b/.test(normName)) {
    return { c100: 65, p100: 0.8, cb100: 16, f100: 0.3, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(fresas?|arandanos?|frambuesas?|moras?|frutos?\s+rojos?|kiwis?|manzanas?|peras?|naranjas?|mandarinas?|melocotones?|nectarinas?|albaricoques?|ciruelas?|pinas?|sandias?|melones?|limon(?:es)?|limas?|pomelos?|strawberr(?:y|ies)|blueberr(?:y|ies)|raspberr(?:y|ies)|berr(?:y|ies)|apples?|pears?|oranges?|peaches?|pineapples?|watermelons?|lemons?|limes?)\b/.test(normName)) {
    return { c100: 48, p100: 0.8, cb100: 11.5, f100: 0.2, category: 'fruit', isPureOilOrFat: false, isZeroCal: false };
  }

  // 11. Verduras, hortalizas y setas
  if (/\b(remolachas?|beetroots?|beets?)\b/.test(normName)) {
    return { c100: 43, p100: 1.6, cb100: 10, f100: 0.2, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(zanahorias?|cebollas?|cebolletas?|chalotas?|puerros?|calabazas?|pimientos?|alcachofas?|coles?\s+de\s+bruselas|carrots?|onions?|leeks?|pumpkins?|squashes?|bell\s+peppers?|artichokes?)\b/.test(normName)) {
    return { c100: 35, p100: 1.2, cb100: 7.5, f100: 0.2, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(tomates?|cherrys?|pepinos?|ajos?|esparragos?|espinacas?|acelgas?|lechugas?|ruculas?|canonigos?|brocolis?|coliflores?|calabacin(?:es)?|berenjenas?|judias?\s+verdes?|judias?|champinon(?:es)?|setas?|apios?|repollos?|coles?|lombardas?|pepinillos?|rabanos?|endibias?|berros?|tomatoes?|cucumbers?|garlics?|asparagus|spinach|lettuces?|arugula|broccoli|cauliflower|zucchinis?|courgettes?|eggplants?|aubergines?|green\s+beans?|mushrooms?|celery|cabbage)\b/.test(normName)) {
    return { c100: 24, p100: 1.8, cb100: 4, f100: 0.2, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  }

  // 12. Zumos y bebidas de cocina
  if (/\b(zumos?|jugos?|juices?)\b/.test(normName)) {
    return { c100: 45, p100: 0.5, cb100: 10.5, f100: 0.1, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }
  if (/\b(vinos?|cervezas?|sidras?|brandys?|conacs?|ron|wines?|beers?)\b/.test(normName)) {
    return { c100: 45, p100: 0.2, cb100: 3, f100: 0, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };
  }

  // 13. Sal, especias, hierbas y aditivos 0 kcal (solo si nada anterior coincidió)
  if (/\b(sal|salt|pimientas?|black\s+pepper|especias?|spices?|oreganos?|perejil(?:es)?|parsley|albahacas?|basil|romeros?|rosemary|tomillos?|thyme|pimenton(?:es)?|paprika|currys?|curcumas?|turmeric|canelas?|cinnamon|laurel(?:es)?|bay\s+lea(?:f|ves)|cominos?|cumin|nuez\s+moscada|nutmeg|jengibres?|ginger|clavos?|cilantros?|coriander|eneldos?|dill|mentas?|hierbabuenas?|mint|azafran(?:es)?|saffron|cayenas?|guindillas?|chiles?\s+en\s+polvo|hierbas?\s+provenzales?|sazonador(?:es)?|vainillas?|vanilla|edulcorantes?|stevias?|eritritol|sacarinas?|levaduras?|yeast|bicarbonato|baking\s+(?:powder|soda))\b/.test(normName)) {
    return { c100: 0, p100: 0, cb100: 0, f100: 0, category: 'spice', isPureOilOrFat: false, isZeroCal: true };
  }

  // 14. Fallback inteligente por pasillo (aisle)
  const normAisle = String(aisle || '').toLowerCase().trim();
  if (normAisle === 'spices') return { c100: 0, p100: 0, cb100: 0, f100: 0, category: 'spice', isPureOilOrFat: false, isZeroCal: true };
  if (normAisle === 'produce') return { c100: 35, p100: 1.5, cb100: 7, f100: 0.3, category: 'veg', isPureOilOrFat: false, isZeroCal: false };
  if (normAisle === 'meat') return { c100: 175, p100: 24, cb100: 0, f100: 8.5, category: 'meat', isPureOilOrFat: false, isZeroCal: false };
  if (normAisle === 'dairy') return { c100: 130, p100: 8, cb100: 5, f100: 9, category: 'dairy', isPureOilOrFat: false, isZeroCal: false };
  if (normAisle === 'bakery') return { c100: 265, p100: 9, cb100: 50, f100: 3, category: 'bakery', isPureOilOrFat: false, isZeroCal: false };
  if (normAisle === 'beverages') return { c100: 30, p100: 0.3, cb100: 7, f100: 0, category: 'liquid', isPureOilOrFat: false, isZeroCal: false };

  return { c100: 80, p100: 2, cb100: 10, f100: 1, category: 'other', isPureOilOrFat: false, isZeroCal: false };
}

function estimateIngredientGrams(normName, normUnit, amount, profile) {
  const { category, isPureOilOrFat } = profile;

  if (/^(g|gr|gramo|gramos)$/.test(normUnit)) return amount;
  if (/^(kg|kilo|kilos|kilogramo|kilogramos)$/.test(normUnit)) return amount * 1000;
  if (/^mg$/.test(normUnit)) return amount / 1000;
  if (/^(oz|onza|onzas)$/.test(normUnit)) return amount * 28.35;
  if (/^(lb|libra|libras)$/.test(normUnit)) return amount * 453.6;

  if (/^(ml|cc|mililitro|mililitros)$/.test(normUnit)) return amount;
  if (/^(cl|centilitro|centilitros)$/.test(normUnit)) return amount * 10;
  if (/^(dl|decilitro|decilitros)$/.test(normUnit)) return amount * 100;
  if (/^(l|litro|litros)$/.test(normUnit)) return amount * 1000;

  if (/^(cda|cdas|cucharada|cucharadas|tbsp|tablespoon|tablespoons)$/.test(normUnit)) {
    return isPureOilOrFat ? amount * 10 : amount * 15;
  }
  if (/^(cdta|cdtas|cucharadita|cucharaditas|tsp|teaspoon|teaspoons|chorro|chorrito|chorritos|pelin)$/.test(normUnit)) {
    return amount * 5;
  }
  if (/^(pizca|pizcas|pinch|pinches|dash|dashes|pellizco|pellizcos|gota|gotas|toque|spray)$/.test(normUnit)) {
    return isPureOilOrFat ? amount * 5 : amount * 1;
  }

  if (/^(taza|tazas|cup|cups)$/.test(normUnit)) {
    if (category === 'dry_grain' || category === 'nuts') return amount * 130;
    if (category === 'veg') return amount * 70;
    return amount * 220;
  }
  if (/^(vaso|vasos|glass|glasses)$/.test(normUnit)) return amount * 220;
  if (/^(copita|copitas|copa|copas)$/.test(normUnit)) return amount * 100;

  if (/^(rebanada|rebanadas|tostada|tostadas|slice|slices)$/.test(normUnit)) return amount * 35;
  if (/^(loncha|lonchas)$/.test(normUnit)) return amount * 25;
  if (/^(filete|filetes)$/.test(normUnit)) return amount * 160;
  if (/^(rodaja|rodajas)$/.test(normUnit)) {
    return (category === 'fish' || category === 'meat') ? amount * 180 : amount * 30;
  }
  if (/^(diente|dientes|clove|cloves)$/.test(normUnit)) return amount * 5;
  if (/^(rama|ramas|ramita|ramitas|hoja|hojas|sprig|sprigs|stalk|stalks|leaf|leaves)$/.test(normUnit)) {
    return /\b(apio|celery)\b/.test(normName) ? amount * 40 : amount * 3;
  }
  if (/^(manojo|manojos|bunch|bunches)$/.test(normUnit)) return amount * 200;
  if (/^(punado|punados|handful|handfuls)$/.test(normUnit)) return amount * 30;
  if (/^(lata|latas|can|cans)$/.test(normUnit)) {
    if (category === 'fish') return amount * 80;
    if (category === 'legume' || category === 'sauce' || /\bcoco\b/.test(normName)) return amount * 400;
    return amount * 150;
  }
  if (/^(bote|botes|tarro|tarros|jar|jars)$/.test(normUnit)) {
    return (category === 'legume' || category === 'sauce') ? amount * 400 : amount * 200;
  }
  if (/^(paquete|paquetes|pack|packs)$/.test(normUnit)) return amount * 250;
  if (/^(sobre|sobres|packet|packets)$/.test(normUnit)) {
    return category === 'protein_powder' ? amount * 30 : amount * 10;
  }
  if (/^(cazo|cazos|scoop|scoops)$/.test(normUnit)) {
    return category === 'protein_powder' ? amount * 30 : amount * 120;
  }

  // Unidades estándar ('ud', piezas enteras)
  if (isPureOilOrFat) return Math.min(25, amount * 10);
  if (/\bcabezas?\s+de\s+ajo\b/.test(normName)) return amount * 45;
  if (/\bdientes?\s+de\s+ajo\b|\bajo\b/.test(normName)) return amount * 5;
  if (/\b(tomates?\s+cherry|cherrys?)\b/.test(normName)) return amount * 15;
  if (/\b(tostadas?|tostas?|rebanadas?)\b/.test(normName)) return amount * 30;
  if (/\b(tortillas?|wraps?|fajitas?|pitas?)\b/.test(normName)) return amount * 55;
  if (/\b(doradas?|lubinas?|truchas?|lenguados?|rodaballos?|corvinas?|rapes?)\b/.test(normName)) return amount * 250;
  if (/\b(pechugas?|filetes?|lomos?|rodajas?|merluzas?|bacalaos?|pescadillas?|gallos?|salmones?|muslos?|contramuslos?|hamburguesas?|solomillos?)\b/.test(normName)) return amount * 180;
  if (/\b(gambas?|langostinos?|camarones?)\b/.test(normName)) return amount * 25;
  if (/\b(fresas?|arandanos?|frambuesas?|moras?|cerezas?|uvas?)\b/.test(normName)) return amount * 15;
  if (/\b(nueces|almendras?|avellanas?|datiles?|aceitunas?|olivas?)\b/.test(normName)) return amount * 10;
  if (/\b(claras?)\b/.test(normName)) return amount * 35;
  if (/\b(huevos?|eggs?)\b/.test(normName)) return amount * 60;
  if (/\b(yogures?|yogurs?|yogurts?)\b/.test(normName)) return amount * 125;
  if (/\b(aguacates?|avocados?)\b/.test(normName)) return amount * 150;
  if (/\b(brocolis?|coliflores?|broccoli|cauliflower)\b/.test(normName)) return amount * 350;
  if (/\b(calabacin(?:es)?|berenjenas?|lechugas?|zucchinis?|eggplants?|lettuces?)\b/.test(normName)) return amount * 220;
  if (/\b(platanos?|bananas?)\b/.test(normName)) return amount * 120;
  if (/\b(patatas?|papas?|boniatos?|batatas?|manzanas?|peras?|naranjas?|pepinos?|mangos?|potatoes?|apples?|pears?|oranges?|cucumbers?)\b/.test(normName)) return amount * 160;
  if (/\b(cebollas?|onions?)\b/.test(normName)) return amount * 120;
  if (/\b(limon(?:es)?|limas?|tomates?|pimientos?|lemons?|limes?|tomatoes?|peppers?)\b/.test(normName)) return amount * 100;
  if (/\b(zanahorias?|kiwis?|mandarinas?|albaricoques?|ciruelas?|carrots?)\b/.test(normName)) return amount * 80;

  return amount * 80;
}

function estimateRecipeNutrition(recipe) {
  if (!recipe) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const servings = Math.max(1, parseInt(recipe.servings, 10) || 2);
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  if (ingredients.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  let totalCal = 0;
  let totalProt = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  ingredients.forEach(ing => {
    if (!ing || !ing.name) return;
    const normName = String(ing.name)
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (!normName) return;

    const rawAmount = ing.amount;
    let amount = 1;
    if (rawAmount !== null && rawAmount !== undefined && String(rawAmount).trim() !== '') {
      const parsedAmt = Number(String(rawAmount).replace(',', '.').trim());
      if (Number.isFinite(parsedAmt)) {
        if (parsedAmt <= 0) return;
        amount = parsedAmt;
      }
    }

    const normUnit = String(ing.unit || 'ud')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.$/, '');

    const profile = classifyIngredientNutritionProfile(normName, ing.aisle || '');
    if (profile.isZeroCal) return;

    const grams = estimateIngredientGrams(normName, normUnit, amount, profile);
    if (!Number.isFinite(grams) || grams <= 0) return;

    const factor = grams / 100;
    totalCal += profile.c100 * factor;
    totalProt += profile.p100 * factor;
    totalCarbs += profile.cb100 * factor;
    totalFat += profile.f100 * factor;
  });

  if (totalCal <= 0 && totalProt <= 0 && totalCarbs <= 0 && totalFat <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  return {
    calories: Math.max(5, Math.round(totalCal / servings)),
    protein: Math.max(0, Math.round((totalProt / servings) * 10) / 10),
    carbs: Math.max(0, Math.round((totalCarbs / servings) * 10) / 10),
    fat: Math.max(0, Math.round((totalFat / servings) * 10) / 10)
  };
}

function computeCanonicalRecipeNutrition(recipe, externalNutrition = null) {
  const normalizeNut = (n) => ({
    calories: Math.max(0, Math.round(Number(n.calories) || 0)),
    protein: Math.max(0, Math.round((Number(n.protein) || 0) * 10) / 10),
    carbs: Math.max(0, Math.round((Number(n.carbs) || 0) * 10) / 10),
    fat: Math.max(0, Math.round((Number(n.fat) || 0) * 10) / 10)
  });

  const hasIngs = Boolean(
    recipe &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.some(i => i && (typeof i === 'string' ? i.trim().length > 0 : (i.name && String(i.name).trim().length > 0)))
  );

  if (recipe?.isExplicitNutrition === true && recipe.nutrition && typeof recipe.nutrition === 'object') {
    const n = normalizeNut(recipe.nutrition);
    if (n.calories > 0 || n.protein > 0 || n.carbs > 0 || n.fat > 0) {
      return n;
    }
  }

  if (hasIngs) {
    return estimateRecipeNutrition(recipe);
  }

  const candidateExternal = externalNutrition || recipe?.nutrition || recipe?.nutritionSummary || null;
  if (isValidExternalNutrition(candidateExternal)) {
    return normalizeNut(candidateExternal);
  }

  return { calories: 0, protein: 0, carbs: 0, fat: 0 };
}

function setRecipeNutritionCache(recipe, nutrition, cacheKey = null) {
  if (!recipe || typeof recipe !== 'object') return;
  try {
    Object.defineProperty(recipe, '_cachedNutrition', {
      value: nutrition,
      writable: true,
      configurable: true,
      enumerable: false
    });
    Object.defineProperty(recipe, '_cachedNutritionKey', {
      value: cacheKey,
      writable: true,
      configurable: true,
      enumerable: false
    });
  } catch (e) { }
}

function getRecipeNutrition(recipe) {
  if (!recipe) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
  const raw = recipe.nutrition || recipe.nutritionSummary;
  if (raw && typeof raw === 'object') {
    const calories = Number(raw.calories) || 0;
    const protein = Number(raw.protein) || 0;
    const carbs = Number(raw.carbs) || 0;
    const fat = Number(raw.fat) || 0;

    const hasIngs = Array.isArray(recipe.ingredients) && recipe.ingredients.some(i => i && (typeof i === 'string' ? i.trim().length > 0 : (i.name && String(i.name).trim().length > 0)));
    const isFakeDefault = !hasIngs && (
      (calories === 450 && Math.round(protein) === 28 && Math.round(carbs) === 45 && Math.round(fat) === 15) ||
      (calories === 350 && Math.round(protein) === 14 && Math.round(carbs) === 48 && Math.round(fat) === 10) ||
      (calories === 280 && Math.round(protein) === 12 && Math.round(carbs) === 35 && Math.round(fat) === 8)
    );

    if (!isFakeDefault && (calories > 0 || protein > 0 || carbs > 0 || fat > 0)) {
      const res = {
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10
      };
      setRecipeNutritionCache(recipe, res, null);
      return res;
    }
  }
  const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const ingsSig = ings.map(i => (typeof i === 'string' ? i : `${i?.name || ''}:${i?.amount ?? ''}:${i?.unit || ''}`)).join('|');
  const cacheKey = `${recipe.servings || 2}:${ingsSig}:${recipe.nutritionEngineVersion || 0}`;
  if (recipe._cachedNutrition && recipe._cachedNutritionKey === cacheKey) {
    return recipe._cachedNutrition;
  }
  const estimated = estimateRecipeNutrition(recipe);
  setRecipeNutritionCache(recipe, estimated, cacheKey);
  return estimated;
}

// ==========================================================================
// PREDEFINED TAGS & DIETARY CLASSIFIER (US-02, US-91)
// ==========================================================================
const PREDEFINED_DIET_STYLES = [
  'Keto',
  'Vegano',
  'Vegetariano',
  'Bajo en Carbos',
  'Alta en Proteínas',
  'Mediterránea',
  'Sin Azúcar Añadido'
];
const PREDEFINED_ALLERGEN_RESTRICTIONS = [
  'Sin Gluten',
  'Sin Lactosa',
  'Sin Frutos Secos',
  'Sin Marisco',
  'Sin Pescado',
  'Sin Huevo',
  'Sin Soja',
  'Sin Sésamo',
  'Bajo en FODMAP'
];
const PREDEFINED_DIETARY_TAGS = [
  ...PREDEFINED_DIET_STYLES,
  ...PREDEFINED_ALLERGEN_RESTRICTIONS
];
const DIETARY_TAG_EMOJIS = {
  'Keto': '🥑',
  'Vegano': '🌱',
  'Vegetariano': '🥗',
  'Sin Gluten': '🌾',
  'Sin Lactosa': '🥛',
  'Bajo en Carbos': '🥦',
  'Alta en Proteínas': '💪',
  'Mediterránea': '🫒',
  'Sin Azúcar Añadido': '🍯',
  'Sin Frutos Secos': '🥜',
  'Sin Marisco': '🦐',
  'Sin Pescado': '🐟',
  'Sin Huevo': '🥚',
  'Sin Soja': '🫘',
  'Sin Sésamo': '🥯',
  'Bajo en FODMAP': '🫚'
};
function getDietaryTagEmoji(tag) {
  return DIETARY_TAG_EMOJIS[tag] || '';
}
function extractCustomAllergenTerm(pref) {
  return String(pref || '')
    .trim()
    .replace(/^(?:sin|no)\s+/i, '')
    .trim()
    .toLowerCase();
}
function isCustomAllergenPreference(pref) {
  const clean = String(pref || '').trim();
  if (!clean) return false;
  const lower = clean.toLowerCase();
  if (PREDEFINED_DIETARY_TAGS.some(t => t.toLowerCase() === lower)) return false;
  return /^(?:sin|no)\s+\S+/i.test(clean);
}
function normalizeCustomAllergenPreference(rawText) {
  let clean = String(rawText || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[,.;:!?/\\]+/g, ' ')
    .trim();
  if (!clean) return '';
  clean = clean
    .replace(/^(?:alergi[ao]s?\s+a(?:l| la| los| las)?|al[eé]rgic[oa]\s+a(?:l| la| los| las)?|intolerancia\s+a(?:l| la| los| las)?)\s+/i, '')
    .replace(/^(?:sin|no)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean || clean.length > 40) return '';

  const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const cleanNorm = stripAccents(clean);
  for (const tag of PREDEFINED_DIETARY_TAGS) {
    const tagNorm = stripAccents(tag);
    if (tagNorm === cleanNorm || tagNorm === `sin ${cleanNorm}`) {
      return tag;
    }
  }

  const titled = clean.charAt(0).toUpperCase() + clean.slice(1);
  return `Sin ${titled}`;
}
function isStrictAllergenPreference(pref) {
  const clean = String(pref || '').toLowerCase().trim();
  if (!clean) return false;
  return PREDEFINED_ALLERGEN_RESTRICTIONS.some(r => r.toLowerCase() === clean) || isCustomAllergenPreference(pref);
}
const PREDEFINED_OCCASION_TAGS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
const PREDEFINED_PRACTICAL_TAGS = ['Rápida', 'Horno', 'Tupper', 'Airfryer', 'Saludable', 'Robot de Cocina'];
const ALL_PREDEFINED_TAGS = [
  ...PREDEFINED_DIETARY_TAGS,
  ...PREDEFINED_OCCASION_TAGS,
  ...PREDEFINED_PRACTICAL_TAGS
];

function auditRecipeIngredientsForPreference(recipe, pref) {
  const prefLower = String(pref || '').toLowerCase().trim();
  const isAllergen = isStrictAllergenPreference(pref);
  const conflictingIngredients = [];
  if (!recipe || !prefLower) {
    return { hasViolation: false, conflictingIngredients };
  }

  const isCustomAllergen = isCustomAllergenPreference(pref);
  let customAllergenRegex = null;
  let customSafeRegex = null;
  if (isCustomAllergen) {
    const termNorm = extractCustomAllergenTerm(pref)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    if (termNorm) {
      const variants = new Set([termNorm]);
      if (termNorm.length > 3 && termNorm.endsWith('es')) {
        variants.add(termNorm.slice(0, -2));
        variants.add(termNorm.slice(0, -1));
      } else if (termNorm.length > 2 && termNorm.endsWith('s')) {
        variants.add(termNorm.slice(0, -1));
      } else if (/[aeiou]$/.test(termNorm)) {
        variants.add(`${termNorm}s`);
      } else if (termNorm.endsWith('z')) {
        variants.add(`${termNorm.slice(0, -1)}ces`);
      } else {
        variants.add(`${termNorm}es`);
      }
      const escapedVariants = Array.from(variants)
        .filter(Boolean)
        .map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (escapedVariants.length > 0) {
        customAllergenRegex = new RegExp(`\\b(${escapedVariants.join('|')})\\b`, 'i');
        const escapedTerm = termNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        customSafeRegex = new RegExp(`\\b(?:sin\\s+${escapedTerm}|${escapedTerm}[ -]?free)\\b`, 'i');
      }
    }
  }

  const recipeTagsLower = (Array.isArray(recipe.tags) ? recipe.tags : []).map(t => String(t).toLowerCase().trim());
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const seen = new Set();
  const pushConflict = (ingredientName, isHiddenTrace = false) => {
    const cleanName = String(ingredientName || '').trim();
    if (!cleanName) return;
    const key = `${cleanName.toLowerCase()}::${prefLower}`;
    if (seen.has(key)) return;
    seen.add(key);
    conflictingIngredients.push({
      ingredient: cleanName,
      preference: pref,
      isAllergen,
      isHiddenTrace
    });
  };

  if (Array.isArray(recipe.allergenAudit?.conflicts)) {
    recipe.allergenAudit.conflicts.forEach(c => {
      if (c && String(c.preference || '').toLowerCase().trim() === prefLower) {
        pushConflict(c.ingredient || c.label || pref, true);
      }
    });
  }

  for (const ing of ingredients) {
    if (!ing) continue;
    const rawName = typeof ing === 'string' ? ing : (ing.name || '');
    const lowerName = rawName.toLowerCase().trim();
    const aisle = typeof ing === 'object' ? String(ing.aisle || '').toLowerCase() : '';
    if (!lowerName && !aisle) continue;

    if (prefLower === 'vegano' || prefLower === 'vegetariano') {
      const isPlantAlternative = /\b(vegano|vegana|vegetal|de soja|tofu|seit[aá]n|heura)\b/i.test(lowerName);
      const isMeat = !isPlantAlternative && (
        aisle === 'meat'
        || /\b(pollo|pechuga|pavo|carne|ternera|vaca|buey|cerdo|lomo|jam[oó]n|bacon|beicon|panceta|chorizo|salchicha|hamburguesa|cordero|conejo|solomillo|alitas|pato)\b/i.test(lowerName)
      );
      const isFish = aisle === 'fish'
        || /\b(pescados?|salm[oó]n|salmones|at[uú]n|atunes|merluzas?|bacalaos?|doradas?|lubinas?|truchas?|sardinas?|anchoas?|boquer[oó]n|boquerones|rape|lenguado|caballa|gambas?|langostinos?|camar[oó]n|camarones|calamar(?:es)?|pulpos?|sepias?|mejill[oó]n|mejillones|almejas?|mariscos?|ostras?)\b/i.test(lowerName);
      const isAnimalBrothOrGelatin = /\b(gelatina|caldo de pollo|caldo de carne|caldo de pescado|caldo de ave|manteca de cerdo|salsa de ostras|salsa de pescado|fumet)\b/i.test(lowerName);
      if (isMeat || isFish) pushConflict(rawName, false);
      else if (isAnimalBrothOrGelatin) pushConflict(rawName, true);

      if (prefLower === 'vegano') {
        const isPlantMilk = /\b(sin lactosa|vegetal|de avena|de soja|de almendra|de coco|de arroz|vegano|vegana)\b/i.test(lowerName);
        const isEgg = !/\b(sin huevo|vegano|vegana)\b/i.test(lowerName) && /\b(huevos?|claras?|yemas?|mayonesa|merengue)\b/i.test(lowerName);
        const isDairy = !isPlantMilk && !isEgg && (
          (aisle === 'dairy' && !/\b(huevos?|claras?|yemas?)\b/i.test(lowerName))
          || /\b(leche|queso|yogur|mantequilla|nata|parmesano|mozzarella|feta|ricotta|mascarpone|cheddar|gouda|cuajada|suero|whey|case[ií]na)\b/i.test(lowerName)
        );
        const isHoney = /\b(miel)\b/i.test(lowerName);
        if (isDairy || isEgg || isHoney) pushConflict(rawName, false);
      }
      continue;
    }

    if (prefLower === 'sin gluten') {
      const isSafeGf = /\b(sin gluten|gluten[ -]?free|tamari|de ma[ií]z|de arroz|de almendra|de garbanzo|de coco|trigo sarraceno|alforf[oó]n)\b/i.test(lowerName);
      if (isSafeGf) continue;
      if (/\b(trigo|harina|pan|tostada|tostadas|baguette|pan rallado|panko|pasta|espaguetis?|tagliatelle|macarrones?|tallarines?|fideos?|lasa[ñn]a|gnocchi|ñoquis|cusc[uú]s|couscous|bulgur|seit[aá]n|cebada|centeno|espelta|kamut|malta|cerveza|galletas?|bizcocho|hojaldre|masa de pizza|empanadilla|tortilla de trigo|wrap|teriyaki|udon|ramen|rebozado|empanado|bechamel)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      } else if (/\bsalsa de soja\b/i.test(lowerName) && !recipeTagsLower.includes('sin gluten')) {
        pushConflict(rawName, true);
      }
      continue;
    }

    if (prefLower === 'sin lactosa') {
      const isPlantMilk = /\b(sin lactosa|lactose[ -]?free|vegetal|de avena|de soja|de almendra|de coco|de arroz|vegano|vegana)\b/i.test(lowerName);
      const isPureEgg = /\b(huevos?|claras?|yemas?)\b/i.test(lowerName) && !/\b(leche|queso|nata|mantequilla|yogur)\b/i.test(lowerName);
      if (isPlantMilk || isPureEgg) continue;
      if ((aisle === 'dairy' && !/\b(huevos?|claras?|yemas?)\b/i.test(lowerName))
        || /\b(leche|nata|crema de leche|queso|mantequilla|yogur|parmesano|mozzarella|feta|ricotta|mascarpone|cheddar|gouda|cuajada|suero de leche|whey|bechamel|leche condensada)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      }
      continue;
    }

    if (prefLower === 'sin frutos secos') {
      if (/\b(sin frutos secos|nut[ -]?free)\b/i.test(lowerName)) continue;
      if (/\b(nuez|nueces|almendras?|avellanas?|pistachos?|anacardos?|pi[ñn][oó]n|pi[ñn]ones|cacahuetes?|man[ií]|pacanas?|macadamia|crema de cacahuete|mantequilla de cacahuete)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      } else if (/\b(pesto|satay|pralin[eé]|mazap[aá]n|gianduja|frangipane)\b/i.test(lowerName)) {
        pushConflict(rawName, true);
      }
      continue;
    }

    if (prefLower === 'sin marisco') {
      if (/\b(gambas?|langostinos?|camar[oó]n|camarones|mejill[oó]n|mejillones|almejas?|berberechos?|calamar(?:es)?|sepias?|pulpos?|bogavantes?|langostas?|cangrejos?|n[eé]coras?|cigalas?|ostras?|mariscos?)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      } else if (/\bsalsa de ostras\b/i.test(lowerName)) {
        pushConflict(rawName, true);
      }
      continue;
    }

    if (prefLower === 'sin pescado') {
      if (aisle === 'fish' || /\b(pescados?|salm[oó]n|salmones|at[uú]n|atunes|bonito|merluzas?|bacalaos?|doradas?|lubinas?|truchas?|sardinas?|anchoas?|boquer[oó]n|boquerones|rape|lenguado|caballa)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      } else if (/\b(caldo de pescado|salsa de pescado|fumet)\b/i.test(lowerName)) {
        pushConflict(rawName, true);
      }
      continue;
    }

    if (prefLower === 'sin huevo') {
      if (/\b(sin huevo|egg[ -]?free|vegano|vegana)\b/i.test(lowerName)) continue;
      if (/\b(huevos?|claras?|yemas?)\b/i.test(lowerName)) pushConflict(rawName, false);
      else if (/\b(mayonesa|merengue)\b/i.test(lowerName)) pushConflict(rawName, true);
      continue;
    }

    if (prefLower === 'sin soja') {
      if (/\b(sin soja|soy[ -]?free)\b/i.test(lowerName)) continue;
      if (/\b(soja|tofu|edamame|tempeh|bebida de soja|heura|soja texturizada)\b/i.test(lowerName)) pushConflict(rawName, false);
      else if (/\b(salsa de soja|tamari|miso|lecitina de soja)\b/i.test(lowerName)) pushConflict(rawName, true);
      continue;
    }

    if (prefLower === 'sin sésamo') {
      if (/\b(sin s[eé]samo|sesame[ -]?free)\b/i.test(lowerName)) continue;
      if (/\b(s[eé]samo|ajonjol[ií]|aceite de s[eé]samo)\b/i.test(lowerName)) pushConflict(rawName, false);
      else if (/\b(tahini|tahina|gomasio)\b/i.test(lowerName)) pushConflict(rawName, true);
      continue;
    }

    if (prefLower === 'bajo en fodmap') {
      if (/\b(ajo|dientes de ajo|cebollas?|puerros?|chalotas?|trigo|centeno|miel|manzanas?|peras?|sand[ií]as?|lentejas?|garbanzos?|alubias?|frijoles?)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      }
      continue;
    }

    if (prefLower === 'sin azúcar añadido') {
      if (/\b(sin az[uú]car(?:es)?(?: a[ñn]adidos?)?|0% az[uú]car|sugar[ -]?free)\b/i.test(lowerName)) continue;
      if (/\b(az[uú]car(?: moreno| glas)?|miel|sirope|jarabe|caramelo|leche condensada|melaza)\b/i.test(lowerName)) {
        pushConflict(rawName, false);
      }
      continue;
    }

    if (customAllergenRegex) {
      const ingNorm = lowerName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (customSafeRegex && customSafeRegex.test(ingNorm)) continue;
      if (customAllergenRegex.test(ingNorm)) {
        pushConflict(rawName, false);
      }
    }
  }

  // Comprobación complementaria de título/pasos para trazas ocultas (ej. pesto, caldo de pollo)
  const titleAndSteps = `${recipe.title || ''} ${(Array.isArray(recipe.instructions) ? recipe.instructions : []).map(s => typeof s === 'string' ? s : (s?.text || '')).join(' ')}`.toLowerCase();
  if (prefLower === 'vegano' || prefLower === 'vegetariano') {
    const hasMeatTag = recipeTagsLower.some(t => ['pollo', 'carne', 'pescado', 'ternera', 'cerdo', 'jamon', 'jamón'].includes(t));
    if (hasMeatTag && conflictingIngredients.length === 0) {
      pushConflict(recipe.title || pref, false);
    }
    const hiddenAnimalStep = titleAndSteps.match(/\b(caldo de pollo|caldo de carne|caldo de pescado|gelatina|salsa de ostras|salsa de pescado)\b/i);
    if (hiddenAnimalStep) pushConflict(hiddenAnimalStep[0], true);
  } else if (prefLower === 'sin frutos secos') {
    const hiddenNutTitle = titleAndSteps.match(/\b(pesto|satay|pralin[eé]|mazap[aá]n)\b/i);
    if (hiddenNutTitle && !/\bsin frutos secos\b/i.test(titleAndSteps)) pushConflict(hiddenNutTitle[0], true);
  } else if (customAllergenRegex && conflictingIngredients.length === 0) {
    const titleStepsNorm = titleAndSteps.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!(customSafeRegex && customSafeRegex.test(titleStepsNorm))) {
      const customMatch = titleStepsNorm.match(customAllergenRegex);
      if (customMatch) pushConflict(customMatch[0], true);
    }
  }

  return {
    hasViolation: conflictingIngredients.length > 0,
    conflictingIngredients
  };
}

function checkDietaryCompliance(recipe, preferences) {
  if (!recipe || !Array.isArray(preferences) || preferences.length === 0) {
    return { compliant: true, violations: [], violatingIngredients: [], allergenViolations: [] };
  }
  const recipeTagsLower = (Array.isArray(recipe.tags) ? recipe.tags : []).map(t => String(t).toLowerCase().trim());
  const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const violations = [];
  const allergenViolations = [];
  const violatingIngredients = [];
  const seenIng = new Set();

  preferences.forEach(pref => {
    const prefLower = String(pref).toLowerCase().trim();
    const isAllergen = isStrictAllergenPreference(pref);
    const audit = auditRecipeIngredientsForPreference(recipe, pref);
    let isCompliant = false;

    if (audit.hasViolation) {
      isCompliant = false;
    } else if (recipeTagsLower.includes(prefLower)) {
      isCompliant = true;
    } else if ((isAllergen || prefLower === 'sin azúcar añadido') && hasIngredients) {
      isCompliant = true;
    }

    if (!isCompliant) {
      violations.push(pref);
      if (isAllergen) allergenViolations.push(pref);
      audit.conflictingIngredients.forEach(c => {
        const key = `${c.ingredient.toLowerCase()}::${prefLower}`;
        if (!seenIng.has(key)) {
          seenIng.add(key);
          violatingIngredients.push(c);
        }
      });
    }
  });

  return {
    compliant: violations.length === 0,
    violations,
    violatingIngredients,
    allergenViolations
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
      return aisle === 'fish' || /\b(pescados?|salm[oó]n|salmones|at[uú]n|atunes|merluzas?|bacalaos?|gambas?|langostinos?|camarones?|mejillones?|calamares?|pulpos?|anchoas?|sardinas?|doradas?|lubinas?|truchas?|almejas?)\b/i.test(name);
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
    const nutrition = (typeof getRecipeNutrition === 'function') ? getRecipeNutrition(recipe) : null;
    const isLowCarbByMacros = nutrition && nutrition.carbs > 0 && nutrition.carbs <= 20;
    const isKetoByMacros = nutrition && nutrition.carbs > 0 && nutrition.carbs <= 12 && nutrition.fat >= 8;
    const isLowCarbByIngredients = !hasHighCarbs && (hasMeat || hasFish || hasEgg || /\b(aguacate|aceite de oliva|frutos secos|nueces|semillas|espinacas?|calabac[ií]n|br[oó]coli|coliflor)\b/i.test(allIngText));

    if (isLowCarbByMacros || isLowCarbByIngredients) {
      inferred.add('Bajo en Carbos');
    }
    if (isKetoByMacros || (isLowCarbByIngredients && !/\b(frutas?|pl[aá]tano|manzana)\b/i.test(allIngText))) {
      inferred.add('Keto');
    }

    // Alta en Proteínas:
    // 1) Detección de repostería y postres dulces (tartas, bizcochos, pasteles):
    //    Evita falsos positivos en recetas hipercalóricas (ej. Carrot Cake de 1236 kcal con 31g de proteína por puro volumen pero solo 10% de densidad).
    const isDessertOrSweet = /\b(tarta|cake|pastel|bizcocho|brownie|galletas?|cookies?|postre|helado|mousse|magdalena|muffin|cupcake|flan|pudding|croissant|donut|donuts|churros|dulce|crepe|crepes|gofre|gofres|tiramis[uú]|cheesecake|carrot cake|tarta de zanahoria|tarta de queso)\b/i.test(`${title} ${desc}`);

    const hasExplicitSupplement = /\b(batido de prote[ií]nas?|whey|aislado de prote[ií]na|suplemento proteico|prote[ií]na en polvo)\b/i.test(`${title} ${desc} ${allIngText}`);

    let qualifiesHighProtein = false;

    if (hasExplicitSupplement) {
      qualifiesHighProtein = true;
    } else if (nutrition) {
      const p = Number(nutrition.protein) || 0;
      const cal = Number(nutrition.calories) || 0;
      const density = cal > 0 ? (p * 4) / cal : 0;

      if (isDessertOrSweet) {
        // En postres y repostería dulce, solo califica si tiene alta concentración proteica intencional (>= 18g y >= 25% de densidad calórica)
        if (p >= 18 && density >= 0.25) {
          qualifiesHighProtein = true;
        }
      } else {
        // En platos salados / comidas reales (ej. gnocchis con queso y chorizo de 23g, carnes, pescados, legumbres):
        // 1) Plato principal rico en proteína: >= 20g de proteína y al menos un 13% de densidad calórica
        // 2) O snack / comida ligera con alta concentración proteica: >= 18g y >= 25% de densidad
        if ((p >= 20 && (cal <= 0 || density >= 0.13)) || (p >= 18 && density >= 0.25)) {
          qualifiesHighProtein = true;
        }
      }
    } else {
      // Sin objeto nutricional explícito: solo si tiene carne/pescado sustancial y no es postre
      if (!isDessertOrSweet && (hasMeat || hasFish) && /\b(pechuga|lomo|solomillo|at[uú]n|salm[oó]n|ternera|pollo)\b/i.test(allIngText)) {
        qualifiesHighProtein = true;
      }
    }

    if (qualifiesHighProtein) {
      inferred.add('Alta en Proteínas');
    }
  } else {
    // Si la receta no tiene ingredientes desglosados pero sí nutrición directa
    const hasExplicitNutrition = recipe && recipe.nutrition && (
      (Number(recipe.nutrition.calories) || 0) > 0 ||
      (Number(recipe.nutrition.protein) || 0) > 0 ||
      (Number(recipe.nutrition.carbs) || 0) > 0 ||
      (Number(recipe.nutrition.fat) || 0) > 0
    );
    const nutrition = (typeof getRecipeNutrition === 'function') ? getRecipeNutrition(recipe) : null;
    if (hasExplicitNutrition && nutrition) {
      const p = Number(nutrition.protein) || 0;
      const cal = Number(nutrition.calories) || 0;
      const density = cal > 0 ? (p * 4) / cal : 0;
      const isDessertOrSweet = /\b(tarta|cake|pastel|bizcocho|brownie|galletas?|cookies?|postre|helado|mousse|magdalena|muffin|cupcake|flan|pudding|croissant|donut|donuts|churros|dulce|crepe|crepes|gofre|gofres|tiramis[uú]|cheesecake|carrot cake|tarta de zanahoria|tarta de queso)\b/i.test(`${title} ${desc}`);
      const hasExplicit = /\b(batido de prote[ií]nas?|whey|aislado de prote[ií]na|suplemento proteico|prote[ií]na en polvo)\b/i.test(`${title} ${desc}`);

      let qualifies = false;
      if (hasExplicit) {
        qualifies = true;
      } else if (isDessertOrSweet) {
        if (p >= 18 && density >= 0.25) qualifies = true;
      } else {
        if ((p >= 20 && (cal <= 0 || density >= 0.13)) || (p >= 18 && density >= 0.25)) {
          qualifies = true;
        }
      }

      if (qualifies && hasExplicit) {
        inferred.add('Alta en Proteínas');
      }
      if (nutrition.carbs > 0 && nutrition.carbs <= 20) {
        inferred.add('Bajo en Carbos');
      }
      if (nutrition.carbs > 0 && nutrition.carbs <= 12 && nutrition.fat >= 8) {
        inferred.add('Keto');
      }
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

export {
  NUTRITION_ENGINE_VERSION,
  SEED_RECIPES,
  STANDARD_SLOTS,
  AISLE_METADATA,
  DAYS_OF_WEEK_ES,
  MONTHS_SHORT_ES,
  PREDEFINED_DIET_STYLES,
  PREDEFINED_ALLERGEN_RESTRICTIONS,
  PREDEFINED_DIETARY_TAGS,
  DIETARY_TAG_EMOJIS,
  PREDEFINED_OCCASION_TAGS,
  PREDEFINED_PRACTICAL_TAGS,
  ALL_PREDEFINED_TAGS,
  extractCustomAllergenTerm,
  isCustomAllergenPreference,
  normalizeCustomAllergenPreference,
  isStrictAllergenPreference,
  auditRecipeIngredientsForPreference,
  isValidExternalNutrition,
  estimateRecipeNutrition,
  computeCanonicalRecipeNutrition,
  getRecipeNutrition,
  analyzeAndInferRecipeTags
};
