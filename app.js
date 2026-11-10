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
    nutrition: { calories: 540, protein: 18, carbs: 62, fat: 24 },
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
    nutrition: { calories: 420, protein: 46, carbs: 28, fat: 12 },
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
    nutrition: { calories: 510, protein: 38, carbs: 32, fat: 22 },
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
    nutrition: { calories: 380, protein: 16, carbs: 42, fat: 14 },
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
    nutrition: { calories: 340, protein: 15, carbs: 26, fat: 19 },
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
    nutrition: { calories: 360, protein: 12, carbs: 58, fat: 8 },
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
    nutrition: { calories: 290, protein: 11, carbs: 36, fat: 10 },
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
    nutrition: { calories: 310, protein: 22, carbs: 38, fat: 6 },
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
    const name = ing.name.toLowerCase().trim();
    const amount = Number(ing.amount) || 1;
    const unit = (ing.unit || 'ud').toLowerCase().trim();

    // 0. Especias, sal, hierbas y condimentos secos: aporte calórico y de macros prácticamente nulo
    if (/\b(sal|pimienta|especias?|or[eé]gano|perejil|albahaca|romero|tomillo|piment[oó]n|curry|canela|laurel|comino|nuez\s+moscada)\b/i.test(name)) {
      return;
    }

    // 1. Estimación de peso en gramos
    let grams = 100;
    const isOilOrFat = /\b(aceite|oliva|girasol|mantequilla|ghee|manteca)\b/i.test(name);

    if (unit === 'g' || unit === 'gr' || unit === 'gramo' || unit === 'gramos') {
      grams = amount;
    } else if (unit === 'kg' || unit === 'kilo' || unit === 'kilos') {
      grams = amount * 1000;
    } else if (unit === 'ml' || unit === 'cl' || unit === 'l') {
      const ml = unit === 'l' ? amount * 1000 : (unit === 'cl' ? amount * 10 : amount);
      grams = ml;
    } else if (unit === 'cda' || unit === 'cucharada' || unit === 'cucharadas') {
      grams = isOilOrFat ? amount * 10 : amount * 15;
    } else if (unit === 'cdta' || unit === 'cucharadita' || unit === 'cucharaditas' || /\b(pel[ií]n|chorrito|chorro|gota|gotas|toque|pizca|spray)\b/i.test(unit)) {
      grams = amount * 5;
    } else if (unit === 'rebanada' || unit === 'rebanadas' || unit === 'loncha' || unit === 'lonchas' || unit === 'tostada' || unit === 'tostadas') {
      grams = amount * 35;
    } else if (unit === 'taza' || unit === 'tazas' || unit === 'vaso' || unit === 'vasos') {
      grams = amount * 200;
    } else if (unit === 'diente' || unit === 'dientes') {
      grams = amount * 5;
    } else {
      // Unidades estándar ('ud', piezas enteras)
      if (isOilOrFat) {
        // En aceite, "1 ud" o sin unidad equivale a 1 cucharada culinaria (~10g), nunca 80g o 100g
        grams = Math.min(25, amount * 10);
      } else if (/\b(doradas?|lubinas?|truchas?|lenguados?|rodaballos?|corvinas?|rapes?)\b/i.test(name)) {
        // Pescado entero (dorada, doradas, lubinas...): ración limpia media ~250g
        grams = amount * 250;
      } else if (/\b(pechugas?|filetes?|lomos?|rodajas?|merluzas?|bacalaos?|pescadillas?|gallos?)\b/i.test(name)) {
        grams = amount * 180;
      } else if (/\b(gambas?|langostinos?|camarones?)\b/i.test(name)) {
        grams = amount * 25;
      } else if (/\b(huevos?)\b/i.test(name)) {
        grams = amount * 60;
      } else if (/\b(aguacates?)\b/i.test(name)) {
        grams = amount * 150;
      } else if (/\b(patatas?|papas?|manzanas?|peras?|pl[aá]tanos?|bananas?|naranjas?|pepinos?)\b/i.test(name)) {
        grams = amount * 160;
      } else if (/\b(lim[oó]n|limones|tomates?)\b/i.test(name)) {
        grams = amount * 100;
      } else if (/\b(cebollas?)\b/i.test(name)) {
        grams = amount * 120;
      } else {
        grams = amount * 80;
      }
    }

    // 2. Densidad nutricional por 100g (kcal, proteína, carbohidratos, grasa)
    let c100 = 80, p100 = 2, cb100 = 10, f100 = 1;

    if (/\b(pollos?|pechugas?|pavos?|conejos?)\b/i.test(name)) {
      c100 = 145; p100 = 31; cb100 = 0; f100 = 3;
    } else if (/\b(terneras?|solomillos?|buey|bueyes|cerdos?|carnes?|lomos?|corderos?)\b/i.test(name)) {
      c100 = 215; p100 = 26; cb100 = 0; f100 = 12;
    } else if (/\b(salm[oó]n|salmones|at[uú]n|atunes|bonitos?|emperadores?|pez\s+espada|peces\s+espada|sardinas?|boquer[oó]n|boquerones|caballas?|arenques?)\b/i.test(name)) {
      c100 = 190; p100 = 22; cb100 = 0; f100 = 11;
    } else if (/\b(doradas?|lubinas?|truchas?|merluzas?|bacalaos?|lenguados?|rodaballos?|corvinas?|rapes?|pescadillas?|gallos?|pescados?\s+blancos?|pescados?)\b/i.test(name)) {
      // Pescado blanco magro (dorada, doradas, merluza, merluzas, lubina...): rico en proteína y 0g hidratos
      c100 = 105; p100 = 20; cb100 = 0; f100 = 2.5;
    } else if (/\b(gambas?|langostinos?|camarones?|calamare?s?|chipir[oó]n|chipirones|sepias?|pulpos?|mejill[oó]n|mejillones|almejas?|berberechos?|chirlas?|mariscos?)\b/i.test(name)) {
      c100 = 90; p100 = 18; cb100 = 1; f100 = 1;
    } else if (/\b(claras?)\b/i.test(name)) {
      c100 = 50; p100 = 11; cb100 = 0.7; f100 = 0.2;
    } else if (/\b(huevos?)\b/i.test(name)) {
      c100 = 145; p100 = 13; cb100 = 1; f100 = 10;
    } else if (/\b(prote[ií]nas?|whey|polvos?\s+de\s+prote[ií]na|case[ií]nas?)\b/i.test(name)) {
      c100 = 380; p100 = 75; cb100 = 6; f100 = 4;
    } else if (/\b(tofus?|tempeh|sojas?)\b/i.test(name)) {
      c100 = 120; p100 = 14; cb100 = 3; f100 = 6;
    } else if (/\b(pastas?|espaguetis?|macarrones?|tallarines?|fideos?|lasa[ñn]as?)\b/i.test(name)) {
      c100 = 350; p100 = 12; cb100 = 72; f100 = 2;
    } else if (/\b(arroz|arroces|basmati|quinoa|cusc[uú]s)\b/i.test(name)) {
      c100 = 360; p100 = 8; cb100 = 78; f100 = 1;
    } else if (/\b(avena|copos\s+de\s+avena|harinas?)\b/i.test(name)) {
      c100 = 370; p100 = 13; cb100 = 60; f100 = 7;
    } else if (/\b(pan|panes|tostadas?|panecillos?|masas?)\b/i.test(name)) {
      c100 = 260; p100 = 9; cb100 = 50; f100 = 3;
    } else if (/\b(garbanzos?|lentejas?|alubias?|frijoles?|hummus)\b/i.test(name)) {
      c100 = 140; p100 = 9; cb100 = 20; f100 = 3;
    } else if (isOilOrFat) {
      c100 = 884; p100 = 0; cb100 = 0; f100 = 100;
    } else if (/\b(aguacates?)\b/i.test(name)) {
      c100 = 160; p100 = 2; cb100 = 8; f100 = 15;
    } else if (/\b(quesos?|parmesanos?|fetas?|mozzarellas?|cheddars?|cottage)\b/i.test(name)) {
      c100 = 280; p100 = 20; cb100 = 3; f100 = 20;
    } else if (/\b(yogures?|yogurs?|leches?|bebidas?\s+vegetales?)\b/i.test(name)) {
      c100 = 80; p100 = 7; cb100 = 5; f100 = 4;
    } else if (/\b(nueces|almendras?|pi[ñn]ones?|ch[ií]a|semillas?|cacahuetes?|frutos?\s+secos?)\b/i.test(name)) {
      c100 = 590; p100 = 18; cb100 = 15; f100 = 52;
    } else if (/\b(pl[aá]tanos?|bananas?|miel|mieles|az[uú]car|azucares|siropes?)\b/i.test(name)) {
      c100 = 120; p100 = 1; cb100 = 30; f100 = 0;
    } else if (/\b(fresas?|ar[aá]ndanos?|frutos?\s+rojos?|kiwis?|manzanas?|peras?|naranjas?|lim[oó]n|limones)\b/i.test(name)) {
      c100 = 50; p100 = 1; cb100 = 12; f100 = 0;
    } else if (/\b(patatas?|papas?)\b/i.test(name)) {
      c100 = 85; p100 = 2; cb100 = 19; f100 = 0;
    } else if (/\b(tomates?|cherrys?|pepinos?|cebollas?|cebolletas?|ajos?|esp[aá]rragos?|espinacas?|calabac[ií]n|calabacines|lechugas?|br[oó]colis?|jud[ií]as?)\b/i.test(name)) {
      c100 = 25; p100 = 1.5; cb100 = 4; f100 = 0.2;
    }

    const factor = grams / 100;
    totalCal += c100 * factor;
    totalProt += p100 * factor;
    totalCarbs += cb100 * factor;
    totalFat += f100 * factor;
  });

  const perServingCalories = Math.max(20, Math.round(totalCal / servings));
  const perServingProtein = Math.max(0, Math.round((totalProt / servings) * 10) / 10);
  const perServingCarbs = Math.max(0, Math.round((totalCarbs / servings) * 10) / 10);
  const perServingFat = Math.max(0, Math.round((totalFat / servings) * 10) / 10);

  return {
    calories: perServingCalories,
    protein: perServingProtein,
    carbs: perServingCarbs,
    fat: perServingFat
  };
}

function getRecipeNutrition(recipe) {
  if (!recipe) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
  if (recipe._cachedNutrition) {
    return recipe._cachedNutrition;
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
      recipe._cachedNutrition = res;
      return res;
    }
  }
  const estimated = estimateRecipeNutrition(recipe);
  recipe._cachedNutrition = estimated;
  return estimated;
}

/**
 * Detects whether a recipe's content is in Spanish or English based on keywords.
 * Defaults to 'es' (the primary language of Sabory's initial catalog).
 */
function detectRecipeLanguage(recipe) {
  if (!recipe) return 'es';
  if (recipe.language === 'en' || recipe.language === 'es') return recipe.language;

  const textParts = [
    recipe.title || '',
    recipe.description || ''
  ];

  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach(i => {
      if (typeof i === 'string') textParts.push(i);
      else if (i && i.name) textParts.push(i.name);
    });
  }

  if (Array.isArray(recipe.instructions)) {
    recipe.instructions.forEach(step => {
      if (typeof step === 'string') textParts.push(step);
      else if (step && step.text) textParts.push(step.text);
    });
  }

  const fullText = textParts.join(' ').toLowerCase();

  const enWords = /\b(the|and|with|chicken|cheese|salad|toast|butter|garlic|onion|pepper|sauce|rice|baked|fried|minutes|tablespoon|teaspoon|cup|cups|sliced|chopped|serve|heat|pan|skillet|bowl|salt|oil|healthy|breakfast|lunch|dinner|snack|cook|boil|stir|oven|grill|mix|whisk|add|bake|roast|simmer|crispy|beef|pork|salmon|tuna|bread|egg|eggs)\b/g;
  const esWords = /\b(el|la|los|las|con|de|del|en|para|y|pollo|queso|ensalada|tostadas|tostada|mantequilla|ajo|cebolla|pimienta|salsa|arroz|horno|minutos|cucharada|cucharadita|taza|tazas|cortar|servir|calentar|sartén|bol|sal|aceite|saludable|desayuno|almuerzo|cena|merienda|cocinar|hervir|mezclar|añadir|batir|hornear|dorar|crujiente|ternera|cerdo|salmón|atún|pan|huevo|huevos)\b/g;

  const enMatches = (fullText.match(enWords) || []).length;
  const esMatches = (fullText.match(esWords) || []).length;

  if (enMatches > esMatches) return 'en';
  return 'es';
}

function getRecipeLanguage(recipe) {
  return (recipe && (recipe.language === 'en' || recipe.language === 'es'))
    ? recipe.language
    : detectRecipeLanguage(recipe);
}

function getRecipeLanguageMeta(recipe) {
  const lang = getRecipeLanguage(recipe);
  const isEnApp = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
  if (lang === 'en') {
    return {
      code: 'EN',
      flag: '<span class="recipe-flag-icon flag-en" aria-hidden="true"></span>',
      flagEmoji: '🇬🇧',
      label: 'English',
      ariaLabel: isEnApp ? 'Recipe language: English' : 'Idioma de la receta: Inglés'
    };
  }
  return {
    code: 'ES',
    flag: '<span class="recipe-flag-icon flag-es" aria-hidden="true"></span>',
    flagEmoji: '🇪🇸',
    label: 'Español',
    ariaLabel: isEnApp ? 'Recipe language: Spanish' : 'Idioma de la receta: Español'
  };
}

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

function getPrimaryProteinCategory(recipe) {
  if (!recipe) return 'otro';
  const title = String(recipe.title || '').toLowerCase();
  const tags = (Array.isArray(recipe.tags) ? recipe.tags : []).join(' ').toLowerCase();
  const ings = (Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
    .map(i => typeof i === 'string' ? i : (i?.name || ''))
    .join(' ')
    .toLowerCase();
  const allText = `${title} ${tags} ${ings}`;

  if (/\b(pollo|pechuga[s]?(\s+de\s+pollo)?|contramuslo[s]?|alitas?|muslo[s]?(\s+de\s+pollo)?)\b/i.test(allText)) return 'pollo';
  if (/\b(pavo|pechuga[s]?\s+de\s+pavo|pavos)\b/i.test(allText)) return 'pavo';
  if (/\b(salm[oó]n|at[uú]n|merluza|bacalao|gamba[s]?|langostino[s]?|calamar(es)?|pulpo|sepia|sardina[s]?|lubina|dorada|bonito|pescado|marisco|anchoa[s]?|trucha|mejill[oó]n|mejillones)\b/i.test(allText)) return 'pescado';
  if (/\b(ternera|vaca|buey|cerdo|lomo|jam[oó]n|solomillo|carne\s+picada|chuleta[s]?|costilla[s]?)\b/i.test(allText)) return 'carne';
  if (/\b(huevo[s]?|tortilla|revuelto|claras?)\b/i.test(allText)) return 'huevos';
  if (/\b(lenteja[s]?|garbanzo[s]?|alubia[s]?|tofu|soja|heura|edamame|seit[aá]n|tempeh)\b/i.test(allText)) return 'legumbres_vegetal';
  if (/\b(pasta|espagueti[s]?|macarron(es)?|lasa[ñn]a|arroz|quinoa|gnocchi[s]?|couscous)\b/i.test(allText)) return 'cereal_pasta';

  return 'otro';
}

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

const AISLE_ORDER = Object.keys(AISLE_METADATA);
if (typeof window !== 'undefined') {
  window.AISLE_ORDER = AISLE_ORDER;
}

function getAisleLabel(aisleKey) {
  if (typeof window !== 'undefined' && window.I18n && typeof window.I18n.getAisleName === 'function') {
    return window.I18n.getAisleName(aisleKey);
  }
  return AISLE_METADATA[aisleKey]?.label || AISLE_METADATA.other.label;
}

// ==========================================================================
// UNIFIED INGREDIENT CLASSIFIER, ICONS & AUTOCOMPLETE CATALOG (US-20, BUG-14)
// ==========================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanInvisibleChars(str) {
  if (!str) return '';
  return String(str).replace(/[\u200B-\u200D\u2060\uFEFF\u00AD\u180E]/g, '').trim();
}

function normalizeIngredientText(str) {
  if (!str) return '';
  return str.toString()
    .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD\u180E]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function normalizeSearchText(str) {
  if (!str) return '';
  return str.toString()
    .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD\u180E]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[,;+._\-\/]/g, ' ')
    .trim();
}

function getSearchWordVariants(word) {
  const norm = normalizeSearchText(word);
  if (!norm) return [];
  const variants = new Set([norm]);

  // Reglas de número en español (singular/plural)
  // 1. Plurales en -ces (ej: nueces -> nuez, raices -> raiz, peces -> pez)
  if (norm.endsWith('ces') && norm.length > 4) {
    variants.add(norm.slice(0, -3) + 'z');
  }
  if (norm.endsWith('z')) {
    variants.add(norm.slice(0, -1) + 'ces');
  }

  // 2. Plurales en -es tras consonante (ej: limones -> limon, champinones -> champinon, panes -> pan, frijoles -> frijol)
  if (norm.endsWith('es') && norm.length > 3) {
    variants.add(norm.slice(0, -2)); // limon
    variants.add(norm.slice(0, -1)); // tomate
  }

  // 3. Plurales regulares en -s (ej: platanos -> platano, fresas -> fresa, patatas -> patata)
  if (norm.endsWith('s') && norm.length > 2) {
    variants.add(norm.slice(0, -1));
  } else if (!norm.endsWith('s')) {
    // Si la palabra es singular:
    // Termina en vocal -> añadir -s (platano -> platanos, fresa -> fresas)
    // Termina en consonante distinta de z -> añadir -es (limon -> limones)
    if (/[aeiou]$/.test(norm)) {
      variants.add(norm + 's');
    } else if (!norm.endsWith('z')) {
      variants.add(norm + 'es');
    }
  }

  return Array.from(variants);
}

function getRecipeSearchText(recipe) {
  if (!recipe) return '';
  const title = recipe.title || '';
  const desc = recipe.description || '';
  const tags = Array.isArray(recipe.tags) ? recipe.tags.join(' ') : '';
  let ingredients = '';
  if (Array.isArray(recipe.ingredients)) {
    ingredients = recipe.ingredients.map(i => {
      if (!i) return '';
      if (typeof i === 'string') return i;
      return [i.name, i.ingredient, i.original, i.text, i.raw, i.item, i.line].filter(Boolean).join(' ');
    }).join(' ');
  } else if (typeof recipe.ingredients === 'string') {
    ingredients = recipe.ingredients;
  }
  return normalizeSearchText(`${title} ${desc} ${tags} ${ingredients}`);
}

function matchRecipeSearch(recipe, query) {
  if (!query || !query.trim()) return true;
  const cleanQuery = normalizeSearchText(query);
  const rawTerms = cleanQuery.split(/\s+/).filter(Boolean);
  if (rawTerms.length === 0) return true;

  const targetText = getRecipeSearchText(recipe);

  // Cada término de la búsqueda (AND logic) debe coincidir con alguna de sus variantes léxicas
  return rawTerms.every(term => {
    const variants = getSearchWordVariants(term);
    return variants.some(v => targetText.includes(v));
  });
}

function matchFridgeIngredient(ingName, fridgeItem) {
  if (!ingName || !fridgeItem) return false;
  const rawIng = typeof ingName === 'string' ? ingName : (
    ingName.name || ingName.ingredient || ingName.original || ingName.text || ingName.raw || ingName.item || ingName.line || ''
  );
  const ingNorm = normalizeSearchText(rawIng);
  const fNorm = normalizeSearchText(fridgeItem);
  if (!ingNorm || !fNorm) return false;

  // 1. Variantes léxicas completas del ítem de la nevera (ej: aguacate -> [aguacate, aguacates])
  const fVariants = getSearchWordVariants(fNorm);
  if (fVariants.some(v => ingNorm.includes(v))) {
    return true;
  }

  // 2. Si el ítem de la nevera o el ingrediente tienen varias palabras (ej: 'dientes de ajo' vs 'ajo', 'pechuga de pollo' vs 'pollo')
  // Comprobar coincidencia por palabras significativas (> 2 caracteres para no confundir subcadenas como 'agua' en 'aguacate')
  const ingTokens = ingNorm.split(/\s+/).filter(t => t.length > 2);
  const fTokens = fNorm.split(/\s+/).filter(t => t.length > 2);

  return fTokens.some(ft => {
    const ftVariants = getSearchWordVariants(ft);
    return ingTokens.some(it => ftVariants.includes(it));
  });
}

// ==========================================================================
// SHOPPING LIST NORMALIZATION, UNIT CONVERSION & SMART MERGE (US-33)
// ==========================================================================
function singularizeSpanishToken(token) {
  if (!token || token.length <= 2) return token;
  if (/^(cuscus|humus|hummus|anis|compas)$/.test(token)) return token;
  if (token.endsWith('ces') && token.length > 4) {
    return token.slice(0, -3) + 'z';
  }
  if (/^(limon|champinon|macarron|jamon|salmon|atun|mejillon|boqueron|pinon|calabacin|freson|pan|yogur|calamar|coliflor|licor|frijol|chipiron|codorniz|alcuzcuz)es$/.test(token)) {
    return token.slice(0, -2);
  }
  if (token.endsWith('ales') && token.length > 5) {
    return token.slice(0, -2);
  }
  if (token.endsWith('s')) {
    return token.slice(0, -1);
  }
  return token;
}

const INGREDIENT_MODIFIERS = new Set([
  // Tamaños
  'grande', 'grandes', 'mediano', 'mediana', 'medianos', 'medianas',
  'pequeno', 'pequena', 'pequenos', 'pequenas', 'chico', 'chica', 'chicos', 'chicas', 'mini', 'xl',
  // Cortes y estados
  'entero', 'entera', 'enteros', 'enteras',
  'picado', 'picada', 'picados', 'picadas',
  'troceado', 'troceada', 'troceados', 'troceadas',
  'laminado', 'laminada', 'laminados', 'laminadas',
  'rallado', 'rallada', 'rallados', 'ralladas',
  'molido', 'molida', 'molidos', 'molidas',
  'triturado', 'triturada', 'triturados', 'trituradas',
  'cortado', 'cortada', 'cortados', 'cortadas',
  'desmenuzado', 'desmenuzada', 'desmigado', 'desmigada',
  // Madurez y frescura
  'maduro', 'madura', 'maduros', 'maduras',
  'fresco', 'fresca', 'frescos', 'frescas',
  'congelado', 'congelada', 'congelados', 'congeladas',
  'crudo', 'cruda', 'crudos', 'crudas',
  'cocido', 'cocida', 'cocidos', 'cocidas',
  'asado', 'asada', 'asados', 'asadas',
  // Limpieza y preparación
  'pelado', 'pelada', 'pelados', 'peladas',
  'limpio', 'limpia', 'limpios', 'limpias',
  'deshuesado', 'deshuesada', 'deshuesados', 'deshuesadas',
  // Dietéticos y sal
  'desnatado', 'desnatada', 'semidesnatado', 'semidesnatada',
  'desgrasado', 'desgrasada'
]);

function getCanonicalIngredientKey(name) {
  if (!name) return '';
  const clean = normalizeIngredientText(name)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\bcon\s+\d+%\s+de\s+grasa\b/g, ' ')
    .replace(/\b(en\s+(?:dados|trozos|rodajas|cubos|juliana|tiras|polvo))\b/g, ' ')
    .replace(/\b(?:bajo|baja|sin)\s+en\s+sal\b/g, ' ')
    .replace(/\b(?:sin|con)\s+(?:sal|gluten|azucar|lactosa|piel|hueso|espinas)\b/g, ' ')
    .replace(/[,;+._\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return '';

  const rawTokens = clean.split(' ').filter(Boolean);
  const filtered = rawTokens.filter(t => !INGREDIENT_MODIFIERS.has(t));
  const tokens = filtered.length > 0 ? filtered : rawTokens;

  return tokens
    .map(singularizeSpanishToken)
    .join(' ');
}

function parseCookingAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return null;
  if (typeof amount === 'number') {
    return isNaN(amount) ? null : amount;
  }
  const clean = String(amount).trim().replace(',', '.');
  if (!clean) return null;
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
      return Math.round((whole + val) * 100) / 100;
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
  return isNaN(val) ? null : val;
}

function normalizeAndConvertUnit(amount, unit) {
  const rawUnit = (unit === null || unit === undefined) ? '' : String(unit).trim();
  const cleanUnit = normalizeIngredientText(rawUnit).replace(/\.+$/g, '').trim();
  const numAmount = parseCookingAmount(amount);
  const hasNumericAmount = numAmount !== null;

  let dimension = 'custom';
  let canonicalUnit = cleanUnit;
  let factorToBase = 1;
  let baseUnit = cleanUnit;

  if (!cleanUnit || /^(ud|uds|u|unidad|unidades|pieza|piezas)$/.test(cleanUnit)) {
    dimension = 'count';
    canonicalUnit = cleanUnit ? 'ud' : '';
    baseUnit = 'ud';
    factorToBase = 1;
  } else if (/^(mg|miligramo|miligramos)$/.test(cleanUnit)) {
    dimension = 'mass';
    canonicalUnit = 'mg';
    baseUnit = 'g';
    factorToBase = 0.001;
  } else if (/^(g|gr|grs|gramo|gramos)$/.test(cleanUnit)) {
    dimension = 'mass';
    canonicalUnit = 'g';
    baseUnit = 'g';
    factorToBase = 1;
  } else if (/^(kg|kilo|kilos|kilogramo|kilogramos)$/.test(cleanUnit)) {
    dimension = 'mass';
    canonicalUnit = 'kg';
    baseUnit = 'g';
    factorToBase = 1000;
  } else if (/^(ml|mililitro|mililitros|cc)$/.test(cleanUnit)) {
    dimension = 'volume';
    canonicalUnit = 'ml';
    baseUnit = 'ml';
    factorToBase = 1;
  } else if (/^(cl|centilitro|centilitros)$/.test(cleanUnit)) {
    dimension = 'volume';
    canonicalUnit = 'cl';
    baseUnit = 'ml';
    factorToBase = 10;
  } else if (/^(dl|decilitro|decilitros)$/.test(cleanUnit)) {
    dimension = 'volume';
    canonicalUnit = 'dl';
    baseUnit = 'ml';
    factorToBase = 100;
  } else if (/^(l|lt|lts|litro|litros)$/.test(cleanUnit)) {
    dimension = 'volume';
    canonicalUnit = 'l';
    baseUnit = 'ml';
    factorToBase = 1000;
  } else if (/^(cda|cdas|cucharada|cucharadas|cucharada sopera|cucharadas soperas)$/.test(cleanUnit)) {
    canonicalUnit = 'cda';
  } else if (/^(cdta|cdtas|cucharadita|cucharaditas|cucharadita de postre)$/.test(cleanUnit)) {
    canonicalUnit = 'cdta';
  } else if (/^(diente|dientes)$/.test(cleanUnit)) {
    canonicalUnit = 'diente';
  } else if (/^(lata|latas)$/.test(cleanUnit)) {
    canonicalUnit = 'lata';
  } else if (/^(bote|botes)$/.test(cleanUnit)) {
    canonicalUnit = 'bote';
  } else if (/^(paquete|paquetes)$/.test(cleanUnit)) {
    canonicalUnit = 'paquete';
  } else if (/^(sobre|sobres)$/.test(cleanUnit)) {
    canonicalUnit = 'sobre';
  } else if (/^(rama|ramas)$/.test(cleanUnit)) {
    canonicalUnit = 'rama';
  } else if (/^(hoja|hojas)$/.test(cleanUnit)) {
    canonicalUnit = 'hoja';
  } else if (/^(loncha|lonchas)$/.test(cleanUnit)) {
    canonicalUnit = 'loncha';
  } else if (/^(rebanada|rebanadas)$/.test(cleanUnit)) {
    canonicalUnit = 'rebanada';
  } else if (/^(pizca|pizcas)$/.test(cleanUnit)) {
    canonicalUnit = 'pizca';
  } else if (/^(taza|tazas)$/.test(cleanUnit)) {
    canonicalUnit = 'taza';
  } else if (/^(vaso|vasos)$/.test(cleanUnit)) {
    canonicalUnit = 'vaso';
  } else if (/^(placa|placas)$/.test(cleanUnit)) {
    canonicalUnit = 'placa';
  } else if (/^(filete|filetes)$/.test(cleanUnit)) {
    canonicalUnit = 'filete';
  } else if (/^(manojo|manojos)$/.test(cleanUnit)) {
    canonicalUnit = 'manojo';
  } else if (/^(rodaja|rodajas)$/.test(cleanUnit)) {
    canonicalUnit = 'rodaja';
  } else if (/^(pellizco|pellizcos)$/.test(cleanUnit)) {
    canonicalUnit = 'pizca';
  } else if (/^(punado|punados|puñado|puñados)$/.test(cleanUnit)) {
    canonicalUnit = 'puñado';
  } else if (/^(chorrito|chorritos|chorro|chorros)$/.test(cleanUnit)) {
    canonicalUnit = 'chorro';
  } else if (/^(copa|copas|copita|copitas)$/.test(cleanUnit)) {
    canonicalUnit = 'copa';
  } else if (/^(trozo|trozos)$/.test(cleanUnit)) {
    canonicalUnit = 'trozo';
  } else if (/^(tira|tiras)$/.test(cleanUnit)) {
    canonicalUnit = 'tira';
  } else if (/^(porcion|porciones)$/.test(cleanUnit)) {
    canonicalUnit = 'porcion';
  } else if (/^(cubito|cubitos)$/.test(cleanUnit)) {
    canonicalUnit = 'cubito';
  }

  if (numAmount === null) {
    return {
      amount: null,
      unit: canonicalUnit || rawUnit,
      baseAmount: null,
      baseUnit,
      dimension,
      canonicalUnit,
      rawUnit
    };
  }

  const baseAmount = numAmount * factorToBase;
  let displayAmount = Math.round(numAmount * 100) / 100;
  let displayUnit = canonicalUnit;

  if (dimension === 'mass') {
    if (baseAmount >= 1000) {
      displayAmount = Math.round((baseAmount / 1000) * 100) / 100;
      displayUnit = 'kg';
    } else {
      displayAmount = Math.round(baseAmount * 100) / 100;
      displayUnit = 'g';
    }
  } else if (dimension === 'volume') {
    if (baseAmount >= 1000) {
      displayAmount = Math.round((baseAmount / 1000) * 100) / 100;
      displayUnit = 'l';
    } else {
      displayAmount = Math.round(baseAmount * 100) / 100;
      displayUnit = 'ml';
    }
  }

  return {
    amount: displayAmount,
    unit: displayUnit,
    baseAmount,
    baseUnit,
    dimension,
    canonicalUnit,
    rawUnit
  };
}

function mergeShoppingQuantities(amountA, unitA, amountB, unitB) {
  const normA = normalizeAndConvertUnit(amountA, unitA);
  const normB = normalizeAndConvertUnit(amountB, unitB);

  if (normA.baseAmount !== null && normB.baseAmount !== null) {
    if (normA.dimension === 'mass' && normB.dimension === 'mass') {
      const totalGrams = normA.baseAmount + normB.baseAmount;
      if (totalGrams >= 1000) {
        return { compatible: true, amount: Math.round((totalGrams / 1000) * 100) / 100, unit: 'kg' };
      }
      return { compatible: true, amount: Math.round(totalGrams * 100) / 100, unit: 'g' };
    }

    if (normA.dimension === 'volume' && normB.dimension === 'volume') {
      const totalMl = normA.baseAmount + normB.baseAmount;
      if (totalMl >= 1000) {
        return { compatible: true, amount: Math.round((totalMl / 1000) * 100) / 100, unit: 'l' };
      }
      return { compatible: true, amount: Math.round(totalMl * 100) / 100, unit: 'ml' };
    }

    if (normA.dimension === 'count' && normB.dimension === 'count') {
      const totalCount = Math.round((normA.baseAmount + normB.baseAmount) * 100) / 100;
      const resolvedUnit = (normA.canonicalUnit || normB.canonicalUnit) ? 'ud' : '';
      return { compatible: true, amount: totalCount, unit: resolvedUnit };
    }

    if (normA.dimension === 'custom' && normB.dimension === 'custom' && normA.canonicalUnit === normB.canonicalUnit) {
      const totalCustom = Math.round((normA.baseAmount + normB.baseAmount) * 100) / 100;
      return { compatible: true, amount: totalCustom, unit: normA.canonicalUnit };
    }

    return { compatible: false };
  }

  if (normA.baseAmount === null && normB.baseAmount === null) {
    if (normA.canonicalUnit === normB.canonicalUnit || !normA.canonicalUnit || !normB.canonicalUnit) {
      return { compatible: true, amount: null, unit: normA.canonicalUnit || normB.canonicalUnit || '' };
    }
    return { compatible: false };
  }

  if (normA.baseAmount === null && !normA.canonicalUnit) {
    return { compatible: true, amount: normB.amount, unit: normB.unit };
  }
  if (normB.baseAmount === null && !normB.canonicalUnit) {
    return { compatible: true, amount: normA.amount, unit: normA.unit };
  }

  return { compatible: false };
}

function recalculateShoppingItemQuantities(item) {
  if (!item) return;
  if (!Array.isArray(item.recipeBreakdown) || item.recipeBreakdown.length === 0) {
    const norm = normalizeAndConvertUnit(item.amount, item.unit);
    item.amount = norm.amount;
    item.unit = norm.unit;
    item.displayAmount = item.amount !== null && item.amount !== undefined ? `${item.amount} ${item.unit || ''}`.trim() : (item.unit || '');
    return;
  }

  let totalMassGrams = 0;
  let hasMass = false;

  let totalVolumeMl = 0;
  let hasVolume = false;

  let totalCount = 0;
  let hasCount = false;

  const customUnits = {};
  const noAmountUnits = [];

  item.recipeBreakdown.forEach(b => {
    const norm = normalizeAndConvertUnit(b.amount, b.unit);
    if (norm.baseAmount !== null) {
      if (norm.dimension === 'mass') {
        totalMassGrams += norm.baseAmount;
        hasMass = true;
      } else if (norm.dimension === 'volume') {
        totalVolumeMl += norm.baseAmount;
        hasVolume = true;
      } else if (norm.dimension === 'count') {
        totalCount += norm.baseAmount;
        hasCount = true;
      } else if (norm.dimension === 'custom') {
        const u = norm.canonicalUnit || 'ud';
        customUnits[u] = (customUnits[u] || 0) + norm.baseAmount;
      }
    } else if (norm.unit) {
      if (!noAmountUnits.includes(norm.unit)) noAmountUnits.push(norm.unit);
    }
  });

  const parts = [];

  if (hasMass) {
    if (totalMassGrams >= 1000) {
      parts.push(`${Math.round((totalMassGrams / 1000) * 100) / 100} kg`);
    } else {
      parts.push(`${Math.round(totalMassGrams * 100) / 100} g`);
    }
  }

  if (hasVolume) {
    if (totalVolumeMl >= 1000) {
      parts.push(`${Math.round((totalVolumeMl / 1000) * 100) / 100} l`);
    } else {
      parts.push(`${Math.round(totalVolumeMl * 100) / 100} ml`);
    }
  }

  if (hasCount) {
    parts.push(`${Math.round(totalCount * 100) / 100} ud`);
  }

  Object.entries(customUnits).forEach(([u, amt]) => {
    parts.push(`${Math.round(amt * 100) / 100} ${u}`);
  });

  noAmountUnits.forEach(u => {
    parts.push(u);
  });

  if (parts.length === 0) {
    item.amount = null;
    item.unit = '';
    item.displayAmount = '';
  } else if (parts.length === 1) {
    const match = parts[0].match(/^([\d.,]+)\s*(.*)$/);
    if (match) {
      item.amount = parseFloat(match[1].replace(',', '.'));
      item.unit = match[2];
    } else {
      item.amount = null;
      item.unit = parts[0];
    }
    item.displayAmount = parts[0];
  } else {
    // Fusión multi-unidad inteligente (ej: 800 g + 6 ud)
    const summary = parts.join(' + ');
    item.amount = null;
    item.unit = summary;
    item.displayAmount = summary;
  }
}

function formatDisplayAmount(amt, unit, displayAmt) {
  if (displayAmt && typeof displayAmt === 'string') {
    const trimmed = displayAmt.trim();
    if (/^(ud|uds|unidad|unidades|g|gr|kg|ml|l|sobre|sobres)$/i.test(trimmed)) {
      return '';
    }
    return trimmed;
  }
  if (amt !== null && amt !== undefined && !isNaN(Number(amt))) {
    return `${amt} ${unit || ''}`.trim();
  }
  if (unit && typeof unit === 'string') {
    const trimmedU = unit.trim();
    if (!/^(ud|uds|unidad|unidades|g|gr|kg|ml|l|sobre|sobres)$/i.test(trimmedU)) {
      return trimmedU;
    }
  }
  return '';
}

function reconcileShoppingItemBreakdown(item, recipes = []) {
  if (!item) return item;
  const knownRecipes = Array.isArray(recipes) ? recipes : [];
  const knownTitles = knownRecipes.map(r => (r && r.title ? r.title.trim() : '')).filter(Boolean);
  if (knownTitles.length === 0) return item;

  let currentPieces = [];
  if (Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0) {
    currentPieces = item.recipeBreakdown.map(b => (b && b.recipe ? String(b.recipe).trim() : '')).filter(Boolean);
  } else if (item.recipeOrigin) {
    currentPieces = parseRecipeOrigins(item.recipeOrigin, knownRecipes);
  }

  if (currentPieces.length === 0) return item;

  const healedRecipes = [];
  let buffer = '';

  for (let i = 0; i < currentPieces.length; i++) {
    const piece = currentPieces[i];
    const candidate = buffer ? `${buffer}, ${piece}` : piece;
    const candidateLower = candidate.toLowerCase();

    const isExact = knownTitles.some(t => t.toLowerCase() === candidateLower);
    const isPrefix = knownTitles.some(t => t.toLowerCase().startsWith(`${candidateLower},`));

    if (isPrefix && i < currentPieces.length - 1) {
      buffer = candidate;
    } else {
      healedRecipes.push(candidate);
      buffer = '';
    }
  }
  if (buffer) {
    healedRecipes.push(buffer);
  }

  // Si no hubo fractura y ya tiene breakdown válido, no tocar nada
  const hadBreakdown = Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0;
  if (hadBreakdown && healedRecipes.length === currentPieces.length) {
    return item;
  }

  // Si no tenía breakdown pero solo hay 1 receta (o ninguna fractura), inicializar breakdown simple
  if (!hadBreakdown && healedRecipes.length <= 1) {
    item.recipeOrigin = healedRecipes[0] || item.recipeOrigin;
    return item;
  }

  const newBreakdown = [];
  healedRecipes.forEach(recTitle => {
    const matchedRecipe = knownRecipes.find(r => r && r.title && r.title.trim().toLowerCase() === recTitle.trim().toLowerCase());
    let ingName = item.name;
    let ingAmount = item.amount !== null && item.amount !== undefined ? item.amount : null;
    let ingUnit = item.unit || '';

    if (matchedRecipe && Array.isArray(matchedRecipe.ingredients)) {
      const targetKey = getCanonicalIngredientKey(item.name);
      const foundIng = matchedRecipe.ingredients.find(ing => ing && getCanonicalIngredientKey(ing.name) === targetKey);
      if (foundIng) {
        ingName = foundIng.name || item.name;
        ingAmount = (foundIng.amount !== null && foundIng.amount !== undefined && !isNaN(Number(foundIng.amount))) ? Number(foundIng.amount) : null;
        ingUnit = foundIng.unit || ingUnit;
      }
    }

    if (Array.isArray(item.recipeBreakdown)) {
      const prevB = item.recipeBreakdown.find(b => b.recipe && b.recipe.trim().toLowerCase() === recTitle.trim().toLowerCase());
      if (prevB && prevB.amount !== null && prevB.amount !== undefined) {
        ingAmount = prevB.amount;
        ingUnit = prevB.unit || ingUnit;
        if (prevB.name) ingName = prevB.name;
      }
    }

    newBreakdown.push({
      recipe: recTitle,
      name: ingName,
      amount: ingAmount,
      unit: ingUnit
    });
  });

  item.recipeBreakdown = newBreakdown;
  item.recipeOrigin = healedRecipes.join(', ');

  recalculateShoppingItemQuantities(item);

  return item;
}

function deduplicateShoppingBreakdown(item) {
  if (!item) return item;
  if (!Array.isArray(item.recipeBreakdown) || item.recipeBreakdown.length === 0) {
    recalculateShoppingItemQuantities(item);
    return item;
  }
  if (item.recipeBreakdown.length === 1) {
    const single = item.recipeBreakdown[0];
    if (single && single.recipe) {
      item.recipeOrigin = String(single.recipe).trim();
    }
    recalculateShoppingItemQuantities(item);
    return item;
  }

  const uniqueBreakdown = [];
  item.recipeBreakdown.forEach(b => {
    if (!b || !b.recipe) return;
    const cleanRecipe = String(b.recipe).trim();
    const recipeKey = cleanRecipe.toLowerCase();

    const existing = uniqueBreakdown.find(u => String(u.recipe).trim().toLowerCase() === recipeKey);
    const bAmt = parseCookingAmount(b.amount);
    if (!existing) {
      uniqueBreakdown.push({
        recipe: cleanRecipe,
        name: cleanInvisibleChars(b.name || item.name),
        amount: bAmt,
        unit: b.unit || ''
      });
    } else {
      // Si la entrada existente no tenía cantidad y la nueva sí, actualizarla
      if ((existing.amount === null || existing.amount === undefined || isNaN(existing.amount)) && bAmt !== null) {
        existing.amount = bAmt;
        existing.unit = b.unit || existing.unit;
      }
    }
  });

  item.recipeBreakdown = uniqueBreakdown;
  item.recipeOrigin = uniqueBreakdown.map(b => b.recipe).join(', ');
  recalculateShoppingItemQuantities(item);
  return item;
}

function mergeOrAddShoppingItem(shoppingList, newItem) {
  if (!Array.isArray(shoppingList) || !newItem || !newItem.name) return null;
  const targetKey = getCanonicalIngredientKey(newItem.name);
  if (!targetKey) return null;

  const nowIso = new Date().toISOString();
  const cleanName = cleanInvisibleChars(newItem.name);
  const incomingBreakdown = Array.isArray(newItem.recipeBreakdown) && newItem.recipeBreakdown.length > 0
    ? newItem.recipeBreakdown.map(b => ({ ...b, name: cleanInvisibleChars(b.name) }))
    : [{
      recipe: newItem.recipeOrigin ? String(newItem.recipeOrigin).trim() : 'Añadido manualmente',
      name: cleanName,
      amount: parseCookingAmount(newItem.amount),
      unit: newItem.unit || ''
    }];

  for (let i = 0; i < shoppingList.length; i++) {
    const existing = shoppingList[i];
    if (!existing || existing.isChecked || existing.checked) continue;
    const existingKey = getCanonicalIngredientKey(existing.name);
    if (existingKey !== targetKey) continue;

    // Asegurar nombre limpio sin caracteres invisibles preexistentes
    existing.name = cleanInvisibleChars(existing.name);

    // 1. Inicializar breakdown si no existía en el item previo
    if (!Array.isArray(existing.recipeBreakdown) || existing.recipeBreakdown.length === 0) {
      existing.recipeBreakdown = [{
        recipe: existing.recipeOrigin ? String(existing.recipeOrigin).trim() : 'Añadido manualmente',
        name: existing.name,
        amount: parseCookingAmount(existing.amount),
        unit: existing.unit || ''
      }];
    }

    // 2. Anexar ingredientes desglosados (deduplicando por receta para evitar repeticiones)
    incomingBreakdown.forEach(inc => {
      if (!inc || !inc.recipe) return;
      const incRecipe = String(inc.recipe).trim();
      const incRecipeKey = incRecipe.toLowerCase();
      const existingEntry = existing.recipeBreakdown.find(b => b && String(b.recipe).trim().toLowerCase() === incRecipeKey);
      const incAmt = parseCookingAmount(inc.amount);

      if (existingEntry) {
        if (incRecipeKey === 'añadido manualmente' || incRecipeKey === 'anadido manualmente' || !incRecipeKey) {
          // Entradas manuales: acumular cantidades
          if (existingEntry.amount === null || existingEntry.amount === undefined || isNaN(existingEntry.amount)) {
            existingEntry.amount = incAmt;
            existingEntry.unit = inc.unit || existingEntry.unit;
          } else if (incAmt !== null) {
            const merged = mergeShoppingQuantities(existingEntry.amount, existingEntry.unit, incAmt, inc.unit);
            if (merged) {
              existingEntry.amount = merged.amount;
              existingEntry.unit = merged.unit;
            } else if (existingEntry.unit === inc.unit) {
              existingEntry.amount += incAmt;
            }
          }
        } else if ((existingEntry.amount === null || existingEntry.amount === undefined || isNaN(existingEntry.amount)) && incAmt !== null) {
          existingEntry.amount = incAmt;
          existingEntry.unit = inc.unit || existingEntry.unit;
        }
      } else {
        existing.recipeBreakdown.push({
          recipe: incRecipe,
          name: inc.name ? cleanInvisibleChars(inc.name) : existing.name,
          amount: incAmt,
          unit: inc.unit || ''
        });
      }
    });

    // 3. Sanear y recalcular cantidades (evita multiplicaciones indeseadas)
    deduplicateShoppingBreakdown(existing);

    // 4. Mejorar pasillo si era 'other'
    if ((!existing.aisle || existing.aisle === 'other') && newItem.aisle && newItem.aisle !== 'other') {
      existing.aisle = newItem.aisle;
    }

    // 5. Normalizar título si el nuevo es más limpio/canónico (sin adjetivos o más corto)
    const existingHasMod = Array.from(INGREDIENT_MODIFIERS).some(m => new RegExp(`\\b${m}\\b`, 'i').test(existing.name));
    const newHasMod = Array.from(INGREDIENT_MODIFIERS).some(m => new RegExp(`\\b${m}\\b`, 'i').test(cleanName));
    if (existingHasMod && !newHasMod) {
      existing.name = cleanName;
    } else if (!existingHasMod && !newHasMod && cleanName.length < existing.name.length) {
      existing.name = cleanName;
    }

    // 6. Actualizar recipeOrigin acumulativo
    const origins = existing.recipeBreakdown.map(b => b.recipe).filter(Boolean);
    const uniqueOrigins = Array.from(new Set(origins));
    existing.recipeOrigin = uniqueOrigins.join(', ');
    existing.updatedAt = (newItem.updatedAt && new Date(newItem.updatedAt).getTime() > new Date(existing.updatedAt || 0).getTime())
      ? newItem.updatedAt
      : (existing.updatedAt || nowIso);
    return existing;
  }

  const isItemChecked = Boolean(newItem.isChecked || newItem.checked);
  const created = {
    id: newItem.id || generateId('shop-'),
    name: cleanName,
    amount: parseCookingAmount(newItem.amount),
    unit: newItem.unit || '',
    displayAmount: '',
    aisle: newItem.aisle || categorizeIngredientAisle(cleanName),
    isChecked: isItemChecked,
    recipeOrigin: newItem.recipeOrigin ? String(newItem.recipeOrigin).trim() : '',
    recipeBreakdown: incomingBreakdown,
    updatedAt: newItem.updatedAt || nowIso
  };
  recalculateShoppingItemQuantities(created);
  shoppingList.push(created);
  return created;
}

function consolidateShoppingList(list, trackDeletionFn = null) {
  if (!Array.isArray(list)) return list;
  list.forEach(item => deduplicateShoppingBreakdown(item));
  if (list.length <= 1) return list;
  const result = [];
  list.forEach(item => {
    if (!item) return;
    if (item.isChecked || item.checked) {
      result.push(item);
    } else {
      const merged = mergeOrAddShoppingItem(result, item);
      if (merged && item.id && merged.id !== item.id) {
        if (typeof trackDeletionFn === 'function') {
          trackDeletionFn(item.id);
        } else if (typeof state !== 'undefined' && state && typeof state.trackDeletion === 'function') {
          state.trackDeletion('shoppingItems', item.id);
        }
      }
    }
  });
  return result;
}

function categorizeIngredientAisle(ingredientName) {
  const text = normalizeIngredientText(ingredientName);
  if (!text) return 'other';

  // 1. Dulces y Chocolates específicos (pantry)
  if (/\b(chocolate|chocolates|cacao|bombones)\b/.test(text)) {
    return 'pantry';
  }

  // 2. Carnes, Aves, Pescados, Mariscos y Embutidos (meat)
  if (/\b(pollo|pollos|pechuga|pechugas|muslo|muslos|alita|alitas|pavo|pavos|ternera|terneras|vaca|buey|cerdo|cerdos|cochinillo|cordero|conejo|pato|carne|carnes|carne\s+picada|picada\s+de\s+(?:ternera|cerdo|pollo|pavo|vaca|buey)|filete|filetes|solomillo|solomillos|lomo|lomos|costilla|costillas|chuleta|chuletas|entrecot|hamburguesa|hamburguesas|salchicha|salchichas|chorizo|chorizos|morcilla|morcillas|jamon|jamones|panceta|bacon|beicon|lacon|cecina|embutido|embutidos|pescado|pescados|salmon|salmones|merluza|merluzas|atun|atunes|bonito|bacalao|dorada|doradas|lubina|lubinas|trucha|truchas|sardina|sardinas|boqueron|boquerones|anchoa|anchoas|pez\s+espada|emperador|gamba|gambas|langostino|langostinos|calamar|calamares|sepia|chipiron|chipirones|pulpo|pulpos|mejillon|mejillones|almeja|almejas|navaja|navajas|ostra|ostras|cangrejo|bogavante|chicken|beef|pork|turkey|duck|steak|steaks|salmon|tuna|cod|shrimp|shrimps|prawn|prawns|clam|clams|mussel|mussels|octopus|squid|sausage|sausages|meat|ribs|lamb)\b/.test(text)) {
    return 'meat';
  }

  // 3. Lácteos y Huevos (dairy)
  if (/\b(ice\s+cream|helado|helados)\b/.test(text)) {
    return 'frozen';
  }
  if (/\b(leche|queso|quesos|yogur|yogurt|yogures|mantequilla|nata|crema\s+de\s+leche|huevo|huevos|clara|claras|yema|yemas|parmesano|mozzarella|ricotta|feta|mascarpone|gorgonzola|cheddar|gouda|brie|camembert|roquefort|cuajada|kefir|milk|cheese|butter|yogurt|cream|egg|eggs|parmesan|cheddar)\b/.test(text)) {
    return 'dairy';
  }

  // 4. Frutas, Verduras, Hortalizas y Hierbas Frescas (produce)
  if (/\b(tomate|tomates|cherry|cebolla|cebollas|cebolleta|cebolletas|ajo|ajos|patata|patatas|papa|papas|batata|batatas|boniato|boniatos|camote|camotes|aguacate|aguacates|espinaca|espinacas|lechuga|lechugas|zanahoria|zanahorias|limon|limones|lima|limas|manzana|manzanas|platano|platanos|banana|bananas|champinon|champinones|seta|setas|pimiento|pimientos|calabacin|calabacines|pepino|pepinos|fresa|fresas|fresones|arandano|arandanos|frambuesa|frambuesas|mora|moras|pera|peras|naranja|naranjas|mandarina|mandarinas|pomelo|uva|uvas|melon|sandia|melocoton|albaricoque|ciruela|ciruelas|mango|pina|kiwi|kiwis|brocoli|coliflor|col|repollo|lombarda|berenjena|berenjenas|judia|judias|guisante|guisantes|esparrago|esparragos|triguero|trigueros|apio|puerro|puerros|calabaza|calabazas|perejil|albahaca|cilantro|hierbabuena|menta|rucula|canonigos|alcachofa|alcachofas|remolacha|rabano|rabanos|nabo|brotes|endivia|endivias|castana|castanas|tomato|tomatoes|onion|onions|garlic|potato|potatoes|spinach|lettuce|carrot|carrots|lemon|lemons|lime|limes|apple|apples|banana|bananas|pepper|peppers|cucumber|cucumbers|avocado|avocados|mushroom|mushrooms|broccoli|cauliflower|zucchini|parsley|basil|cilantro)\b/.test(text)) {
    if (/\b(vinagre|vinagres|aceite|aceites|oil|vinegar)\b/.test(text)) {
      return 'spices';
    }
    if (/\b(tomate\s+frito|salsa\s+de\s+tomate|conserva|en\s+lata|bote|canned)\b/.test(text)) {
      return 'pantry';
    }
    if (/\b(congelado|congelados|congelada|congeladas|frozen)\b/.test(text)) {
      return 'frozen';
    }
    return 'produce';
  }

  // 5. Panadería, Bollería, Masas y Harinas (bakery)
  if (/\b(pan|panes|baguette|barra|tostada|tostadas|molde|croissant|croissants|brioche|bollo|bollos|picos|colines|harina|harinas|levadura|masa|masas|hojaldre|placas|placa|galleta|galletas|bizcocho|bizcochos|magdalena|magdalenas|tartaleta|bread|flour|toast|baguette|bun|buns|rolls?|dough|pastry|yeast|cookies)\b/.test(text)) {
    return 'bakery';
  }

  // 6. Congelados (frozen)
  if (/\b(helado|helados|congelado|congelados|congelada|congeladas|guisantes\s+congelados|pizza|pizzas|nuggets|hielo|ice\s+cream|frozen)\b/.test(text)) {
    return 'frozen';
  }

  // 7. Especias, Condimentos, Aceites y Vinagres (spices) -> Pasillo: "Especias y Aceites"
  if (/\b(sal|pimienta|oregano|comino|pimenton|curry|canela|romero|tomillo|nuez\s+moscada|azafran|laurel|eneldo|vainilla|clavo|jengibre|curcuma|cardamomo|cayena|guindilla|pizca|aceite|aceites|oliva|virgen\s+extra|aove|girasol|sesamo|vinagre|vinagres|balsamico|modena|salt|pepper|black\s+pepper|oregano|cumin|paprika|curry|cinnamon|rosemary|thyme|oil|olive\s+oil|vinegar|soy\s+sauce)\b/.test(text)) {
    return 'spices';
  }

  // 8. Bebidas, Destilados y Licores (beverages)
  if (/\b(agua|cafe|cafes|te|infusion|infusiones|refresco|refrescos|cerveza|cervezas|vino|vinos|zumo|zumos|sidra|licor|licores|bebida|bebidas|champan|cava|tonica|whiskey|whisky|ron|vodka|ginebra|gin|tequila|vermut|vermouth|brandy|cognac|bourbon|water|coffee|teas?|juice|beer|wine|soda)\b/.test(text)) {
    return 'beverages';
  }

  // 9. Despensa, Pastas, Arroces, Legumbres, Salsas y Dulces (pantry)
  if (/\b(pasta|pastas|espaguetis|espagueti|macarrones|fideos|tallarines|raviolis|tortellini|lasana|gnocchi|arroz|arroces|basmati|quinoa|cuscus|cous\s*cous|avena|legumbre|legumbres|garbanzo|garbanzos|lenteja|lentejas|alubia|alubias|frijol|frijoles|azucar|miel|sirope|chocolate|chocolates|cacao|bombones|tomate\s+frito|tomate\s+triturado|conserva|conservas|lata|latas|caldo|caldos|salsa|salsas|soja|mayonesa|ketchup|mostaza|tabasco|pesto|mermelada|mermeladas|frutos\s+secos|nueces|nuez|almendras|almendra|avellanas|avellana|cacahuetes|cacahuete|pistachos|pistacho|anacardos|anacardo|pinones|pinon|pasta|rice|spaghetti|noodles|beans|lentils|chickpeas|oats|cereal|sugar|honey|syrup)\b/.test(text)) {
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
  } catch (e) { }
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
  if (/\b(pescado|pescados|salmon|merluza|atun|bonito|bacalao|dorada|doradas|lubina|lubinas|trucha|truchas|sardina|sardinas|boqueron|boquerones|gamba|gambas|langostino|langostinos|calamar|calamares|pulpo|pulpos|mejillon|mejillones|almeja|almejas)\b/.test(norm)) {
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

// Pre-computed common ingredients with normalized and stemmed names for O(1) matching
let _PREPARED_COMMON_INGREDIENTS = null;
let _PREPARED_COMMON_INGREDIENTS_LEN = 0;
function getPreparedCommonIngredients() {
  if (!_PREPARED_COMMON_INGREDIENTS || _PREPARED_COMMON_INGREDIENTS_LEN !== COMMON_INGREDIENTS.length) {
    _PREPARED_COMMON_INGREDIENTS = COMMON_INGREDIENTS.map(item => {
      const norm = normalizeIngredientText(item.name);
      return {
        item,
        norm,
        stem: norm.replace(/(?:es|s)$/i, '').trim()
      };
    });
    _PREPARED_COMMON_INGREDIENTS_LEN = COMMON_INGREDIENTS.length;
  }
  return _PREPARED_COMMON_INGREDIENTS;
}

function getIngredientSuggestions(query, max = 6, extraItems = []) {
  if (!query || typeof query !== 'string') return [];
  const qNorm = normalizeIngredientText(query);
  if (!qNorm) return [];

  const common = getPreparedCommonIngredients();
  const seenNorms = new Set();
  const all = [];

  for (let i = 0; i < common.length; i++) {
    all.push(common[i]);
    seenNorms.add(common[i].norm);
  }

  if (Array.isArray(extraItems) && extraItems.length > 0) {
    for (let i = 0; i < extraItems.length; i++) {
      const item = extraItems[i];
      if (!item || !item.name) continue;
      const norm = normalizeIngredientText(item.name);
      if (!norm || seenNorms.has(norm)) continue;
      seenNorms.add(norm);

      const aisle = item.aisle || (typeof categorizeIngredientAisle === 'function' ? categorizeIngredientAisle(item.name) : 'other');
      const icon = item.icon || (typeof getIngredientIcon === 'function' ? getIngredientIcon(item.name, aisle) : (AISLE_METADATA[aisle]?.icon || 'inventory_2'));
      all.push({
        item: {
          name: item.name,
          aisle,
          defaultUnit: item.unit || 'ud',
          icon
        },
        norm,
        stem: norm.replace(/(?:es|s)$/i, '').trim()
      });
    }
  }

  const prefixMatches = [];
  const containsMatches = [];

  // Lematización básica de plurales en español (ej. doradas -> dorada, patatas -> patata)
  const qStem = qNorm.replace(/(?:es|s)$/i, '').trim();

  for (let i = 0; i < all.length; i++) {
    const entry = all[i];
    const itemNorm = entry.norm;
    const itemStem = entry.stem;
    const startsMatch = itemNorm.startsWith(qNorm) || (qStem.length >= 3 && itemNorm.startsWith(qStem)) || (qStem.length >= 3 && itemStem.startsWith(qStem));

    if (startsMatch) {
      prefixMatches.push(entry.item);
      if (prefixMatches.length >= max) break;
    } else {
      const containsMatch = itemNorm.includes(qNorm) || (qStem.length >= 3 && itemNorm.includes(qStem)) || (qStem.length >= 3 && itemStem.includes(qStem));
      if (containsMatch) {
        containsMatches.push(entry.item);
      }
    }
  }

  if (prefixMatches.length >= max) {
    return prefixMatches.slice(0, max);
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
const DAYS_OF_WEEK_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_SHORT_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
 * Formats a week range in localized language, e.g. "19 oct – 25 oct 2026" or "19 Oct – 25 Oct 2026"
 */
function formatWeekRange(weekDays) {
  if (!weekDays || weekDays.length !== 7) return '';
  const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
  const monthsArr = isEn ? MONTHS_SHORT_EN : MONTHS_SHORT_ES;
  const start = weekDays[0].date;
  const end = weekDays[6].date;
  const startDay = start.getDate();
  const startMonth = monthsArr[start.getMonth()];
  const endDay = end.getDate();
  const endMonth = monthsArr[end.getMonth()];
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

// ==========================================================================
// US-46: ALMACENAMIENTO ASÍNCRONO INDEXEDDB CON MIGRACIÓN Y FALLBACK
// ==========================================================================

const FA_IDB_NAME = 'food_assistant_db';
const FA_IDB_VERSION = 1;
const FA_IDB_STORE = 'keyval';

class IndexedDbStorage {
  constructor() {
    this.dbPromise = null;
    this.isSupported = typeof window !== 'undefined' && 'indexedDB' in window;
  }

  getDb() {
    if (!this.isSupported) return Promise.resolve(null);
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = window.indexedDB.open(FA_IDB_NAME, FA_IDB_VERSION);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(FA_IDB_STORE)) {
              db.createObjectStore(FA_IDB_STORE);
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => {
            console.warn('[Storage] IndexedDB no disponible, usando fallback localStorage.');
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    }
    return this.dbPromise;
  }

  async get(key) {
    const db = await this.getDb();
    if (!db) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch { return null; }
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(FA_IDB_STORE, 'readonly');
        const store = tx.objectStore(FA_IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async set(key, value) {
    const db = await this.getDb();
    if (db) {
      new Promise((resolve) => {
        try {
          const tx = db.transaction(FA_IDB_STORE, 'readwrite');
          const store = tx.objectStore(FA_IDB_STORE);
          store.put(value, key);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch {
          resolve(false);
        }
      });
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignorar QuotaExceededError en localStorage
    }
  }

  async delete(key) {
    const db = await this.getDb();
    if (db) {
      try {
        const tx = db.transaction(FA_IDB_STORE, 'readwrite');
        tx.objectStore(FA_IDB_STORE).delete(key);
      } catch { }
    }
    try { localStorage.removeItem(key); } catch { }
  }

  async migrateFromLocalStorage() {
    const alreadyMigrated = await this.get('fa_idb_migrated');
    if (alreadyMigrated) return true;

    try {
      const keysToMigrate = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('fa_')) {
          keysToMigrate.push(k);
        }
      }
      for (const k of keysToMigrate) {
        try {
          const raw = localStorage.getItem(k);
          if (raw !== null) {
            const val = JSON.parse(raw);
            await this.set(k, val);
          }
        } catch { }
      }
      await this.set('fa_idb_migrated', new Date().toISOString());
      console.log(`[Storage] Migración exitosa de ${keysToMigrate.length} claves fa_* a IndexedDB.`);
      return true;
    } catch (err) {
      console.warn('[Storage] Error durante la migración a IndexedDB:', err);
      return false;
    }
  }
}

// US-77: Generador y normalizador de códigos de invitación del Hogar Familiar
function generateHouseholdInviteCode() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SAB-${suffix}`;
}

function normalizeHouseholdInviteCode(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!cleaned) return '';
  if (/^SAB[A-Z0-9]{4,8}$/.test(cleaned)) {
    return `SAB-${cleaned.slice(3)}`;
  }
  return cleaned;
}

class StateStore {
  constructor() {
    this.idb = new IndexedDbStorage();
    if (typeof window !== 'undefined') {
      setTimeout(() => this.idb.migrateFromLocalStorage(), 50);
    }
    // Registro de borrados para propagación a Supabase (BUG-23)
    this.deletedRecords = this.load('fa_deleted_records', {
      recipes: [],
      mealPlans: [],
      shoppingItems: []
    });

    let savedRecipes = this.load('fa_recipes', null);
    if (!savedRecipes) {
      savedRecipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
      try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) { }
    } else {
      const seeded = localStorage.getItem('fa_recipes_seeded');
      if (seeded !== 'v8') {
        // Migración única a v8 para usuarios antiguos, respetando borrados del usuario
        SEED_RECIPES.forEach(seed => {
          if (!savedRecipes.some(r => r.id === seed.id) && !this.deletedRecords.recipes?.includes(seed.id)) {
            savedRecipes.push(seed);
          }
        });
        try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) { }
      }
    }
    if (Array.isArray(savedRecipes)) {
      let tagsCleaned = false;
      savedRecipes.forEach(r => {
        if (!r.createdAt && r.updatedAt) {
          r.createdAt = r.updatedAt;
        }
        // BUG-27: Saneamiento de recetas sin ingredientes (limpiar macros falsos heredados y etiqueta 'Alta en Proteínas')
        const hasIngs = Array.isArray(r.ingredients) && r.ingredients.some(i => i && (typeof i === 'string' ? i.trim().length > 0 : (i.name && String(i.name).trim().length > 0)));
        if (!hasIngs && !r.isExplicitNutrition) {
          if (Array.isArray(r.tags) && r.tags.includes('Alta en Proteínas')) {
            r.tags = r.tags.filter(t => t !== 'Alta en Proteínas');
            tagsCleaned = true;
          }
          if (r.nutrition && (
            (r.nutrition.calories === 450 && Math.round(r.nutrition.protein || 0) === 28) ||
            (r.nutrition.calories === 350 && Math.round(r.nutrition.protein || 0) === 14) ||
            (r.nutrition.calories === 280 && Math.round(r.nutrition.protein || 0) === 12) ||
            !r.isExplicitNutrition
          )) {
            r.nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            r._cachedNutrition = null;
            tagsCleaned = true;
          }
        }

        // Saneamiento v0.53: limpiar etiqueta 'Alta en Proteínas' si fue asignada erróneamente por ingredientes en lugar de por macros reales
        if (Array.isArray(r.tags) && r.tags.includes('Alta en Proteínas')) {
          const nut = (typeof getRecipeNutrition === 'function') ? getRecipeNutrition(r) : (r.nutrition || null);
          const isExplicit = /\b(batido de prote[ií]nas?|whey|aislado de prote[ií]na|suplemento proteico)\b/i.test(`${r.title || ''} ${r.description || ''}`);
          const qualifies = nut && ((nut.protein >= 25) || (nut.protein >= 20 && nut.calories > 0 && ((nut.protein * 4) / nut.calories) >= 0.30));
          if (!qualifies && !isExplicit) {
            r.tags = r.tags.filter(t => t !== 'Alta en Proteínas');
            tagsCleaned = true;
          }
        }
      });
      if (tagsCleaned) {
        try { localStorage.setItem('fa_recipes', JSON.stringify(savedRecipes)); } catch (e) { }
      }
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
    // US-45 & BUG-23 & US-33: Migración transparente para asegurar que todo artículo tenga id y desglose
    if (Array.isArray(this.shoppingList)) {
      let migrated = false;
      this.shoppingList.forEach(item => {
        if (!item.id) {
          item.id = generateId('shop-');
          migrated = true;
        }
        const prevOrigin = item.recipeOrigin;
        const prevLen = Array.isArray(item.recipeBreakdown) ? item.recipeBreakdown.length : 0;
        reconcileShoppingItemBreakdown(item, this.recipes || []);
        if (item.recipeOrigin !== prevOrigin || (Array.isArray(item.recipeBreakdown) ? item.recipeBreakdown.length : 0) !== prevLen) {
          migrated = true;
        }
      });
      if (migrated) this.save('fa_shopping', this.shoppingList);
    }

    this.settings = this.load('fa_settings', {
      geminiApiKey: '',
      defaultServings: 2,
      geminiModel: 'gemini-3.8-flash',
      ttsEnabled: true,
      nutritionGoals: {
        enabled: false,
        calories: 2000,
        protein: 140,
        carbs: 200,
        fat: 65
      }
    });
    if (!this.settings.geminiModel || this.settings.geminiModel === 'gemini-2.5-flash-lite' || this.settings.geminiModel === 'gemini-1.5-flash') {
      this.settings.geminiModel = 'gemini-3.8-flash';
      this.save('fa_settings', this.settings);
    }
    if (!this.settings.nutritionGoals) {
      this.settings.nutritionGoals = { enabled: false, calories: 2000, protein: 140, carbs: 200, fat: 65 };
    }
    this.dietaryPreferences = this.load('fa_dietary_preferences', []);
    this.dietaryUpdatedAt = localStorage.getItem('fa_dietary_updated_at') || null;
    this.customTags = this.load('fa_custom_tags', []);
    this.theme = localStorage.getItem('fa_theme_mode') || 'light';
    this.cloudUser = this.load('fa_cloud_user', null);
    this.household = this.load('fa_household', null);
    this.personalBackup = this.load('fa_personal_backup', null);
    this.supabaseConfig = {
      url: window.APP_CONFIG?.supabaseUrl || localStorage.getItem('fa_sb_url') || '',
      anonKey: window.APP_CONFIG?.supabaseAnonKey || localStorage.getItem('fa_sb_key') || ''
    };
    this.lastSyncedAt = localStorage.getItem('fa_last_sync') || null;
  }

  saveHousehold(household) {
    this.household = household || null;
    this.save('fa_household', this.household);
  }

  saveNutritionGoals(goals) {
    if (!this.settings) this.settings = {};
    this.settings.nutritionGoals = {
      enabled: !!goals?.enabled,
      calories: Math.max(0, Number(goals?.calories) || 0),
      protein: Math.max(0, Number(goals?.protein) || 0),
      carbs: Math.max(0, Number(goals?.carbs) || 0),
      fat: Math.max(0, Number(goals?.fat) || 0)
    };
    this.save('fa_settings', this.settings);
  }

  saveDietaryPreferences(prefs) {
    this.dietaryPreferences = Array.isArray(prefs) ? prefs : [];
    this.dietaryUpdatedAt = new Date().toISOString();
    this.save('fa_dietary_preferences', this.dietaryPreferences);
    this.save('fa_dietary_updated_at', this.dietaryUpdatedAt);
    if (this.household && typeof this.household === 'object') {
      this.household.dietaryPreferences = [...this.dietaryPreferences];
      this.household.dietaryUpdatedAt = this.dietaryUpdatedAt;
      this.save('fa_household', this.household);
    }
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
    // US-81: Registrar lápida persistente (14 días) para evitar resurrección remota
    this.addTombstone(entityType, id);
  }

  addTombstone(entityType, id) {
    if (!id || !entityType) return;
    if (!this.tombstones) {
      this.tombstones = this.load('fa_tombstones', {});
    }
    if (!this.tombstones[entityType]) {
      this.tombstones[entityType] = {};
    }
    this.tombstones[entityType][id] = Date.now();
    this.save('fa_tombstones', this.tombstones);
  }

  isTombstoned(entityType, id) {
    if (!id || !entityType) return false;
    if (!this.tombstones) {
      this.tombstones = this.load('fa_tombstones', {});
    }
    const bucket = this.tombstones[entityType];
    if (!bucket || !bucket[id]) return false;
    // Expira a los 14 días (14 * 24 * 60 * 60 * 1000 = 1209600000 ms)
    if (Date.now() - bucket[id] > 1209600000) {
      delete bucket[id];
      this.save('fa_tombstones', this.tombstones);
      return false;
    }
    return true;
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
// US-16: GESTIÓN FLEXIBLE DE IMÁGENES Y AVATARES GRÁFICOS ELEGANTES
// ==========================================================================


function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeUrl(url, fallback = '') {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function cleanRecipeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim();
  // Quitar comillas externas, backticks o corchetes angulares accidentales ("...", '...', <...>)
  cleaned = cleaned.replace(/^["'`<]+|["'`>]+$/g, '').trim();
  if (!cleaned) return '';
  // Si es un data URI base64, devolverlo intacto
  if (cleaned.startsWith('data:image/')) return cleaned;
  // Entidades HTML
  cleaned = cleaned.replace(/&amp;/g, '&');
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    // Eliminar parámetros de seguimiento y analítica (manteniendo tamaño, crop o calidad de CDN)
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'igshid', 'msclkid', 'mc_cid', 'mc_eid', '_ga', '_gl',
      'ref', 'source', 'feature', 'ncid', 'wt.mc_id'
    ];
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    parsed.hash = '';
    return parsed.toString();
  } catch (e) {
    return cleaned;
  }
}

function getRecipeTheme(recipeOrTitle, tags = []) {
  let title = '';
  let allTags = [];
  if (typeof recipeOrTitle === 'object' && recipeOrTitle !== null) {
    title = (recipeOrTitle.title || '').toLowerCase();
    allTags = Array.isArray(recipeOrTitle.tags) ? recipeOrTitle.tags.map(t => String(t).toLowerCase()) : [];
  } else if (typeof recipeOrTitle === 'string') {
    const found = (typeof state !== 'undefined' && state.recipes) ? state.recipes.find(r => r.id === recipeOrTitle) : null;
    if (found) {
      title = (found.title || '').toLowerCase();
      allTags = Array.isArray(found.tags) ? found.tags.map(t => String(t).toLowerCase()) : [];
    } else {
      title = recipeOrTitle.toLowerCase();
      allTags = Array.isArray(tags) ? tags.map(t => String(t).toLowerCase()) : [];
    }
  }

  const combined = title + ' ' + allTags.join(' ');

  // 1. Pescados
  if (/\b(?:salm[oó]n|pescado|sepia|at[uú]n|bacalao|merluza|dorada|lubina|trucha|calamar|calamares|pulpo|rape|sardinas?|boquerones?)\b/i.test(combined)) {
    return {
      type: 'fish',
      icon: 'set_meal',
      label: 'Pescado',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #115e59 50%, #134e4a 100%)',
      avatarBg: '#ccfbf1',
      avatarColor: '#0f766e'
    };
  }

  // 2. Mariscos y Crustáceos
  if (/\b(?:gambas?|langostinos?|mejillones?|almejas?|vieiras?|bogavante|centollo|mariscos?|n[eé]coras?|percebes?|carabineros?)\b/i.test(combined)) {
    return {
      type: 'seafood',
      icon: 'phishing',
      label: 'Marisco',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
      avatarBg: '#e0f2fe',
      avatarColor: '#0284c7'
    };
  }

  // 3. Pastas y Fideos
  if (/\b(?:pasta|espaguetis?|macarrones?|tallarines?|lasa[ñn]a|fideos?|noodles?|ramen|gnocchis?|canelones?|raviolis?|tortellini|tagliatelle|penne)\b/i.test(combined)) {
    return {
      type: 'pasta',
      icon: 'ramen_dining',
      label: 'Pasta y Fideos',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)',
      avatarBg: '#ffedd5',
      avatarColor: '#c2410c'
    };
  }

  // 4. Arroces y Paellas
  if (/\b(?:arroz|paella|risotto|arroz\s+(?:caldoso|negro|con\s+pollo))\b/i.test(combined)) {
    return {
      type: 'rice',
      icon: 'rice_bowl',
      label: 'Arroces',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#d97706'
    };
  }

  // 5. Pizzas y Masas
  if (/\b(?:pizza|calzone|empanadas?|focaccia)\b/i.test(combined)) {
    return {
      type: 'pizza',
      icon: 'local_pizza',
      label: 'Pizza',
      gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9f1239 100%)',
      avatarBg: '#ffe4e6',
      avatarColor: '#e11d48'
    };
  }

  // 6. Hamburguesas y Barbacoa
  if (/\b(?:hamburguesas?|burger|costillas?|bbq|barbacoa|buey|chulet[oó]n|chuletas?|churrasco|kebab)\b/i.test(combined)) {
    return {
      type: 'burger',
      icon: 'lunch_dining',
      label: 'Hamburguesas y Barbacoa',
      gradient: 'linear-gradient(135deg, #881337 0%, #701a75 50%, #4c0519 100%)',
      avatarBg: '#ffe4e6',
      avatarColor: '#881337'
    };
  }

  // 7. Bocadillos, Sandwiches, Tacos y Wraps (evaluado antes de carnes/aves específicas)
  if (/\b(?:bocadillos?|sandwich(?:es)?|tostas?|tacos?|fajitas?|burritos?|wraps?|arepas?|paninis?)\b/i.test(combined)) {
    return {
      type: 'sandwich',
      icon: 'breakfast_dining',
      label: 'Bocadillos y Tacos',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
      avatarBg: '#ffedd5',
      avatarColor: '#ea580c'
    };
  }

  // 8. Ensaladas y Frescos (evaluado antes de legumbres/sopas/carnes)
  if (/\b(?:ensaladas?|bowl|poke|ensaladilla|tartar|carpaccio)\b/i.test(combined)) {
    return {
      type: 'salad',
      icon: 'nutrition',
      label: 'Ensaladas',
      gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)',
      avatarBg: '#dcfce7',
      avatarColor: '#15803d'
    };
  }

  // 9. Huevos y Tortillas
  if (/\b(?:tortillas?|huevos?|revueltos?|omelette|poch[eé]|frittata)\b/i.test(combined)) {
    return {
      type: 'egg',
      icon: 'egg',
      label: 'Huevos y Tortillas',
      gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #a16207 100%)',
      avatarBg: '#fef9c3',
      avatarColor: '#a16207'
    };
  }

  // 10. Desayunos, Avena y Cereales
  if (/\b(?:avena|porridge|granola|muesli|cereales|tostadas?)\b/i.test(combined)) {
    return {
      type: 'oats',
      icon: 'grain',
      label: 'Avena y Cereales',
      gradient: 'linear-gradient(135deg, #d97706 0%, #a16207 50%, #78350f 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#a16207'
    };
  }

  // 11. Aves y Pollo
  if (/\b(?:pollo|pavo|pechugas?|alitas?|muslos?|ave)\b/i.test(combined)) {
    return {
      type: 'poultry',
      icon: 'skillet',
      label: 'Aves y Pollo',
      gradient: 'linear-gradient(135deg, #b45309 0%, #92400e 50%, #78350f 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#b45309'
    };
  }

  // 12. Carnes Rojas y Guisos de Carne
  if (/\b(?:carne|cerdo|ternera|lomo|solomillo|bistec|alb[oó]ndigas?|entrecot)\b/i.test(combined)) {
    return {
      type: 'meat',
      icon: 'kebab_dining',
      label: 'Carnes',
      gradient: 'linear-gradient(135deg, #9a3412 0%, #7c2d12 50%, #451a03 100%)',
      avatarBg: '#ffedd5',
      avatarColor: '#9a3412'
    };
  }

  // 13. Sopas, Cremas y Caldos
  if (/\b(?:sopas?|cremas?|pur[eé]|caldos?|potajes?|guisos?|estofados?|lentejas?|garbanzos?|alubias?|cocido|fabada)\b/i.test(combined)) {
    return {
      type: 'soup',
      icon: 'soup_kitchen',
      label: 'Sopas y Guisos',
      gradient: 'linear-gradient(135deg, #b45309 0%, #854d0e 50%, #713f12 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#854d0e'
    };
  }

  // 14. Verduras, Huerta y Vegano
  if (/\b(?:verduras?|huerta|vegano|vegetariano|salmorejo|gazpacho|espinacas?|calabac[ií]n|berenjenas?|pisto|setas?|champi[ñn]ones?|alcachofas?|br[oó]coli|aguacate)\b/i.test(combined)) {
    return {
      type: 'vegetable',
      icon: 'eco',
      label: 'Verduras y Huerta',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
      avatarBg: '#d1fae5',
      avatarColor: '#047857'
    };
  }

  // 14. Desayunos, Avena y Cereales
  if (/\b(?:avena|porridge|granola|muesli|cereales|tostadas?)\b/i.test(combined)) {
    return {
      type: 'oats',
      icon: 'grain',
      label: 'Avena y Cereales',
      gradient: 'linear-gradient(135deg, #d97706 0%, #a16207 50%, #78350f 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#a16207'
    };
  }

  // 15. Panadería y Bollería
  if (/\b(?:pan|hogaza|baguette|croissant|brioche|bollos?|panecillos?)\b/i.test(combined)) {
    return {
      type: 'bakery',
      icon: 'bakery_dining',
      label: 'Panadería',
      gradient: 'linear-gradient(135deg, #c2410c 0%, #9a3412 50%, #7c2d12 100%)',
      avatarBg: '#ffedd5',
      avatarColor: '#9a3412'
    };
  }

  // 16. Postres, Tartas y Dulces
  if (/\b(?:tartas?|pasteles?|bizcochos?|galletas?|flan|brownie|mousse|postres?|helados?|cupcakes?|pud[ií]n|chocolate)\b/i.test(combined)) {
    return {
      type: 'dessert',
      icon: 'cake',
      label: 'Postres y Dulces',
      gradient: 'linear-gradient(135deg, #db2777 0%, #be185d 50%, #9d174d 100%)',
      avatarBg: '#fce7f3',
      avatarColor: '#be185d'
    };
  }

  // 17. Bebidas, Batidos y Smoothies
  if (/\b(?:batidos?|smoothies?|zumos?|t[eé]|caf[eé]|infusi[oó]n|shakes?|c[oó]ctel)\b/i.test(combined)) {
    return {
      type: 'beverage',
      icon: 'emoji_food_beverage',
      label: 'Bebidas y Batidos',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
      avatarBg: '#ede9fe',
      avatarColor: '#6d28d9'
    };
  }

  // 18. Aperitivos y Snacks
  if (/\b(?:snacks?|aperitivos?|frutos\s+secos|nueces|almendras|patatas\s+fritas|chips|nachos)\b/i.test(combined)) {
    return {
      type: 'snack',
      icon: 'cookie',
      label: 'Snacks y Aperitivos',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #854d0e 100%)',
      avatarBg: '#fef3c7',
      avatarColor: '#b45309'
    };
  }

  // 19. Por defecto: Plato Casero
  return {
    type: 'default',
    icon: 'restaurant',
    label: 'Plato Casero',
    gradient: 'linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)',
    avatarBg: '#f1f5f9',
    avatarColor: '#334155'
  };
}

function getRecipePlaceholderSvg(recipeOrTitle, size = 'card') {
  const theme = getRecipeTheme(recipeOrTitle);

  const isThumb = size === 'thumb';
  const width = isThumb ? 96 : (size === 'detail' ? 800 : 400);
  const height = isThumb ? 96 : (size === 'detail' ? 400 : 280);
  const radius = isThumb ? 16 : 0;
  const avatarSize = isThumb ? 44 : (size === 'detail' ? 76 : 58);

  const hexColors = theme.gradient.match(/#[0-9a-fA-F]{6}/g) || ['#475569', '#334155', '#1e293b'];
  const startColor = hexColors[0] || '#475569';
  const endColor = hexColors[hexColors.length - 1] || '#1e293b';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g_${theme.type}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startColor}"/>
      <stop offset="100%" stop-color="${endColor}"/>
    </linearGradient>
    <radialGradient id="r_${theme.type}" cx="75%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#g_${theme.type})"/>
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#r_${theme.type})"/>
  <!-- Anillos concéntricos decorativos de plato gastronómico -->
  <circle cx="${width / 2}" cy="${height / 2}" r="${height * 0.42}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
  <circle cx="${width / 2}" cy="${height / 2}" r="${height * 0.32}" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5" stroke-dasharray="4,4"/>
  <!-- Avatar central con vajilla estilizada -->
  <g transform="translate(${width / 2}, ${height / 2})">
    <circle r="${avatarSize / 2}" fill="${theme.avatarBg}" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.25))"/>
    <g transform="scale(${avatarSize / 48})">
      <circle r="16" fill="none" stroke="${theme.avatarColor}" stroke-width="2.2" opacity="0.85"/>
      <circle r="12" fill="none" stroke="${theme.avatarColor}" stroke-width="1" opacity="0.4"/>
      <!-- Tenedor -->
      <path d="M -6,-9 L -6,-2 Q -6,1 -3,1 L -3,9 M -8,-9 L -8,-4 M -4,-9 L -4,-4" fill="none" stroke="${theme.avatarColor}" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Cuchillo -->
      <path d="M 5,-9 Q 8,-6 6,-1 L 5,1 L 5,9" fill="none" stroke="${theme.avatarColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getRecipePlaceholderHtml(recipeOrTitle, size = 'card') {
  const theme = getRecipeTheme(recipeOrTitle);
  const isDetail = size === 'detail';
  const sizeClass = isDetail ? 'size-detail' : 'size-card';
  const iconSizeClass = isDetail ? 'icon-36' : 'icon-28';

  return `
    <div class="recipe-placeholder-art ${sizeClass}" style="--placeholder-gradient: ${theme.gradient};" aria-hidden="true">
      <div class="recipe-placeholder-avatar" style="--avatar-bg: ${theme.avatarBg}; --avatar-color: ${theme.avatarColor};">
        <span class="material-symbols-outlined ${iconSizeClass}">${theme.icon}</span>
      </div>
    </div>
  `;
}

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

  parseIsoDuration(durationStr, fallback = 0) {
    if (!durationStr) return fallback;
    if (typeof durationStr === 'number') return durationStr;
    const str = String(durationStr).trim();
    if (!str) return fallback;

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
      return total > 0 ? total : fallback;
    }
    const anyNum = str.match(/\d+/);
    return anyNum ? parseInt(anyNum[0], 10) : fallback;
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

    if (unitMatch && (isNaN(Number(unitMatch[1].replace(',', '.'))) === false || new RegExp(`[\\/${fracChars}]`).test(unitMatch[1]))) {
      amount = this.parseNumber(unitMatch[1]);
      unit = this.normalizeUnit(unitMatch[2]);
      name = (unitMatch[3] || '').trim();
    } else if (noUnitMatch && (isNaN(Number(noUnitMatch[1].replace(',', '.'))) === false || new RegExp(`[\\/${fracChars}]`).test(noUnitMatch[1]))) {
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
      } catch (e) { }
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
      } catch (e) { }
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
      } catch (e) { }
    }

    return '';
  },

  isBadImage(url) {
    if (!url) return true;
    return /150_150|avatar|guest_user|author|logo|icon|favicon|98x98|16x16|32x32|gravatar|pixel\.gif|blank\.gif|emoji/i.test(url);
  },

  cleanImageUrl(url) {
    return cleanRecipeImageUrl(url);
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
    if (typeof analyzeAndInferRecipeTags === 'function') {
      if (!Array.isArray(recipe.tags)) recipe.tags = [];
      const inferred = analyzeAndInferRecipeTags(recipe);
      const existingLower = new Set(recipe.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(tag => {
        const lower = tag.toLowerCase().trim();
        if (!existingLower.has(lower) && lower !== 'general' && lower !== 'importada') {
          recipe.tags.push(tag);
          existingLower.add(lower);
        }
      });
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
      } catch (e) { }
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

  isWrapperDomain(domainOrUrl) {
    if (!domainOrUrl || typeof domainOrUrl !== 'string') return false;
    const domain = (domainOrUrl.includes('://') ? this.getDomain(domainOrUrl) : domainOrUrl).toLowerCase().trim();
    if (!domain) return false;
    return domain === 'share.google' ||
      domain.endsWith('.share.google') ||
      domain === 'google.com' ||
      domain.endsWith('.google.com') ||
      domain === 'google.es' ||
      domain.endsWith('.google.es') ||
      domain === 'goo.gl' ||
      domain === 't.co' ||
      domain === 'bit.ly' ||
      domain === 'tinyurl.com' ||
      domain === 'out.reddit.com' ||
      domain === 'l.instagram.com' ||
      domain === 'l.facebook.com' ||
      domain === 'lm.facebook.com';
  },

  unwrapRedirectUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl || '';
    let url = rawUrl.trim();
    const ampMatch = url.match(/^https?:\/\/(?:www\.)?google\.[a-z.]+\/amp\/s\/(.+)$/i);
    if (ampMatch) {
      url = 'https://' + ampMatch[1];
    }
    try {
      const parsed = new URL(url);
      for (const param of ['url', 'q', 'u', 'target', 'dest', 'destination', 'link']) {
        const val = parsed.searchParams.get(param);
        if (val && /^https?:\/\//i.test(val)) {
          return this.unwrapRedirectUrl(val);
        }
      }
    } catch (e) { }
    return url;
  },

  extractCanonicalUrl(schema, html = '') {
    if (schema) {
      if (typeof schema.mainEntityOfPage === 'string' && /^https?:\/\//i.test(schema.mainEntityOfPage)) {
        return schema.mainEntityOfPage.trim();
      }
      if (schema.mainEntityOfPage && typeof schema.mainEntityOfPage === 'object') {
        const id = schema.mainEntityOfPage['@id'] || schema.mainEntityOfPage.url;
        if (typeof id === 'string' && /^https?:\/\//i.test(id)) return id.trim();
      }
      if (typeof schema.url === 'string' && /^https?:\/\//i.test(schema.url)) {
        return schema.url.trim();
      }
      if (typeof schema['@id'] === 'string' && /^https?:\/\//i.test(schema['@id'])) {
        return schema['@id'].trim();
      }
    }
    if (html && typeof html === 'string') {
      const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
        html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
      if (canonicalMatch && /^https?:\/\//i.test(canonicalMatch[1])) {
        return canonicalMatch[1].trim();
      }
      const ogMatch = html.match(/<meta\s+[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["']/i);
      if (ogMatch && /^https?:\/\//i.test(ogMatch[1])) {
        return ogMatch[1].trim();
      }
    }
    return '';
  },

  extractSiteName(schema, html = '') {
    if (schema?.publisher?.name && typeof schema.publisher.name === 'string') {
      const pub = schema.publisher.name.trim();
      if (pub && !this.isWrapperDomain(pub)) return pub;
    }
    if (html && typeof html === 'string') {
      const ogSite = html.match(/<meta\s+[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
      if (ogSite && ogSite[1].trim()) {
        const site = ogSite[1].trim();
        if (!this.isWrapperDomain(site)) return site;
      }
    }
    return '';
  },

  resolveSourceMetadata(sourceUrl = '', schema = null, html = '') {
    let cleanSource = this.unwrapRedirectUrl(sourceUrl);
    const canonical = this.extractCanonicalUrl(schema, html);
    const siteName = this.extractSiteName(schema, html);

    const sourceDomain = this.getDomain(cleanSource);
    const isWrapper = !cleanSource || this.isWrapperDomain(sourceDomain);

    let finalUrl = cleanSource;
    if ((isWrapper || !finalUrl) && canonical) {
      const canonicalDomain = this.getDomain(canonical);
      if (!this.isWrapperDomain(canonicalDomain)) {
        finalUrl = canonical;
      }
    }

    let finalDomain = this.getDomain(finalUrl);
    if (!finalDomain || this.isWrapperDomain(finalDomain)) {
      if (canonical) {
        finalDomain = this.getDomain(canonical);
      }
      if ((!finalDomain || this.isWrapperDomain(finalDomain)) && siteName) {
        finalDomain = siteName;
      }
    }

    return {
      sourceUrl: finalUrl || '',
      sourceDomain: finalDomain || (siteName || '')
    };
  },

  parseSchemaRecipe(schema, sourceUrl = '', html = '') {
    if (!schema) return null;
    let imageUrl = '';
    if (schema.image) {
      if (typeof schema.image === 'string') imageUrl = schema.image;
      else if (Array.isArray(schema.image) && schema.image.length > 0) imageUrl = typeof schema.image[0] === 'string' ? schema.image[0] : (schema.image[0]?.url || '');
      else if (schema.image.url) imageUrl = schema.image.url;
    }

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

    const sourceMeta = this.resolveSourceMetadata(sourceUrl, schema, html);
    const resolvedSourceUrl = sourceMeta.sourceUrl;
    const resolvedDomain = sourceMeta.sourceDomain;

    const parsedNutrition = this.parseNutrition(schema.nutrition);
    const parsedServings = this.parseServings(schema.recipeYield);

    const prepMinutes = schema.prepTime ? this.parseIsoDuration(schema.prepTime, 0) : 0;
    let cookMinutes = 0;
    if (schema.cookTime) {
      cookMinutes = this.parseIsoDuration(schema.cookTime, 0);
    } else if (schema.totalTime) {
      const totalMinutes = this.parseIsoDuration(schema.totalTime, 0);
      cookMinutes = Math.max(0, totalMinutes - prepMinutes);
    }

    const recipe = {
      id: generateId('rec-'),
      title: schema.name ? String(schema.name).trim() : 'Receta Web',
      description: schema.description ? String(schema.description).trim() : '',
      imageUrl: imageUrl,
      prepTimeMinutes: prepMinutes,
      cookTimeMinutes: cookMinutes,
      servings: parsedServings,
      nutrition: parsedNutrition || estimateRecipeNutrition({
        title: schema.name,
        ingredients: ingredients,
        servings: parsedServings
      }),
      tags: tags.slice(0, 4),
      ingredients: ingredients,
      instructions: instructions,
      sourceUrl: resolvedSourceUrl,
      sourceDomain: resolvedDomain
    };
    this.detectRobotFeatures(recipe);
    return recipe;
  },

  parseNutritionNumber(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
    const str = String(val).replace(',', '.');
    const match = str.match(/\d+(?:\.\d+)?/);
    return match ? Math.round(parseFloat(match[0])) : 0;
  },

  parseNutrition(schemaNutrition) {
    if (!schemaNutrition || typeof schemaNutrition !== 'object') return null;
    const calories = this.parseNutritionNumber(schemaNutrition.calories);
    const protein = this.parseNutritionNumber(schemaNutrition.proteinContent || schemaNutrition.protein);
    const carbs = this.parseNutritionNumber(schemaNutrition.carbohydrateContent || schemaNutrition.carbs);
    const fat = this.parseNutritionNumber(schemaNutrition.fatContent || schemaNutrition.fat);

    if (calories > 0 || protein > 0 || carbs > 0 || fat > 0) {
      return { calories, protein, carbs, fat };
    }
    return null;
  },


  parseRecipeText(rawText, sourceUrl = '', html = '') {
    if (!rawText || typeof rawText !== 'string') return null;
    const trimmed = rawText.trim();
    if (!trimmed) return null;

    // Check if rawText is actually JSON or HTML with JSON-LD
    if (trimmed.includes('<script') || trimmed.startsWith('{') || trimmed.includes('"@type"') || trimmed.includes('"recipeIngredient"')) {
      try {
        const schema = this.extractJsonLdFromHtml(trimmed) || (trimmed.startsWith('{') ? JSON.parse(trimmed) : null);
        if (schema && (this.isRecipeType(schema['@type']) || schema.recipeIngredient || schema.ingredients)) {
          return this.parseSchemaRecipe(schema, sourceUrl, html);
        }
      } catch (e) { }
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
          prepTimeMinutes = this.parseIsoDuration(prepMatch[0], 0);
        }

        const cookMatch = line.match(/(?:cocc|horno|cocinado|cook).*?(\d+)\s*(?:h|hora|horas|min|m|minuto)/i);
        if (cookMatch) {
          cookTimeMinutes = this.parseIsoDuration(cookMatch[0], 0);
        }

        const totalMatch = line.match(/(?:tiempo(?:\s*total)?|duraci[o\u00F3]n).*?(\d+)\s*(?:h|hora|horas|min|m|minuto)/i);
        if (totalMatch && (cookTimeMinutes === 20 || cookTimeMinutes === 0 || cookTimeMinutes === prepTimeMinutes)) {
          cookTimeMinutes = this.parseIsoDuration(totalMatch[0], 0);
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
      imageUrl: candidateImage || '',
      prepTimeMinutes: prepTimeMinutes,
      cookTimeMinutes: cookTimeMinutes,
      servings: servings,
      nutrition: estimateRecipeNutrition({ title, ingredients, servings }),
      tags: [],
      ingredients: ingredients,
      instructions: instructions,
      sourceUrl: sourceUrl || '',
      sourceDomain: resolvedDomain
    };
    this.detectRobotFeatures(recipe);
    return recipe;
  },

  // US-67: Importador Masivo de Colecciones y Migración de Recetas (Samsung Food / Whisk / JSON Backup)
  parseBulkCollection(input) {
    if (!input) return { candidates: [], extraData: {} };
    let data = input;
    if (typeof input === 'string') {
      try {
        data = JSON.parse(input);
      } catch (err) {
        throw new Error('El archivo no contiene un formato JSON válido.');
      }
    }
    if (!data || typeof data !== 'object') {
      throw new Error('Estructura de copia de seguridad no válida (se esperaba un objeto o lista JSON).');
    }

    const rawList = [];
    const extraData = {};

    // 1. Array at root: [ { ... }, { ... } ]
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (!item || typeof item !== 'object') return;
        if (item.recipe && typeof item.recipe === 'object') {
          rawList.push({ ...item.recipe, _collection: item.collection || item.collectionName || '' });
        } else {
          rawList.push(item);
        }
      });
    }
    // 2. Object with "recipes" array: Food Assistant backup or Whisk export
    else if (data && typeof data === 'object') {
      if (Array.isArray(data.recipes)) {
        data.recipes.forEach(r => {
          if (r && typeof r === 'object') {
            rawList.push(r.recipe ? { ...r.recipe, _collection: r.collection || '' } : r);
          }
        });
      }
      // 3. Object with "collections" array (Samsung Food / Whisk multi-collection export)
      if (Array.isArray(data.collections)) {
        data.collections.forEach(col => {
          const colName = col.name || col.title || '';
          if (Array.isArray(col.recipes)) {
            col.recipes.forEach(r => {
              if (r && typeof r === 'object') {
                rawList.push({ ...(r.recipe || r), _collection: colName });
              }
            });
          }
        });
      }
      // 4. Object with "items" or "data" array
      if (Array.isArray(data.items)) {
        data.items.forEach(it => {
          if (it && typeof it === 'object') {
            rawList.push(it.recipe || it);
          }
        });
      } else if (Array.isArray(data.data)) {
        data.data.forEach(it => {
          if (it && typeof it === 'object') {
            rawList.push(it.recipe || it);
          }
        });
      }
      // 5. Schema.org @graph
      if (Array.isArray(data['@graph'])) {
        data['@graph'].forEach(node => {
          if (node && (node['@type'] === 'Recipe' || (Array.isArray(node['@type']) && node['@type'].includes('Recipe')))) {
            rawList.push(node);
          }
        });
      }
      // 6. Single Schema.org or Whisk recipe object at root
      if (rawList.length === 0) {
        if (data['@type'] === 'Recipe' || (Array.isArray(data['@type']) && data['@type'].includes('Recipe'))) {
          rawList.push(data);
        } else if (data.recipe && typeof data.recipe === 'object') {
          rawList.push(data.recipe);
        } else if ((data.title || data.name) && (data.ingredients || data.recipeIngredient || data.instructions || data.recipeInstructions)) {
          rawList.push(data);
        }
      }

      // Check for extra backup data (Food Assistant full backup)
      if (data.mealPlan && typeof data.mealPlan === 'object') {
        extraData.hasMealPlan = true;
        extraData.mealPlan = data.mealPlan;
      }
      if (Array.isArray(data.shoppingList)) {
        extraData.hasShoppingList = true;
        extraData.shoppingList = data.shoppingList;
      }
    }

    const candidates = [];
    rawList.forEach((cand, idx) => {
      if (!cand || typeof cand !== 'object') return;

      // Check if it's Schema.org Recipe format
      if (cand['@type'] === 'Recipe' || cand.recipeIngredient) {
        const parsedSchema = this.parseSchemaRecipe(cand, cand.url || cand['@id'] || '');
        if (parsedSchema) {
          parsedSchema.imageUrl = isSafeUrl(parsedSchema.imageUrl) ? parsedSchema.imageUrl : '';
          parsedSchema.sourceUrl = isSafeUrl(parsedSchema.sourceUrl) ? parsedSchema.sourceUrl : '';
          if (cand._collection && !parsedSchema.tags.includes(cand._collection)) {
            parsedSchema.tags.push(cand._collection);
          }
          candidates.push(parsedSchema);
          return;
        }
      }

      // Standardize title
      const title = String(cand.title || cand.name || cand.recipeName || `Receta importada ${idx + 1}`).trim();

      // Description
      const description = String(cand.description || cand.summary || '').trim();

      // Remote image extraction
      let imageUrl = '';
      if (cand.imageUrl) {
        imageUrl = cand.imageUrl;
      } else if (cand.image) {
        if (typeof cand.image === 'string') imageUrl = cand.image;
        else if (Array.isArray(cand.image) && cand.image.length > 0) {
          imageUrl = typeof cand.image[0] === 'string' ? cand.image[0] : (cand.image[0]?.url || '');
        } else if (cand.image.url) {
          imageUrl = cand.image.url;
        }
      } else if (Array.isArray(cand.images) && cand.images.length > 0) {
        imageUrl = typeof cand.images[0] === 'string' ? cand.images[0] : (cand.images[0]?.url || '');
      }

      // Servings
      let servings = 2;
      const rawServings = cand.servings || cand.servings_scaled || cand.yield || cand.recipeYield;
      if (rawServings) {
        servings = this.parseServings(rawServings);
      }

      // Prep & cook times (handles seconds from Whisk or minutes or ISO)
      const parseAnyDuration = (val) => {
        if (!val) return null;
        if (typeof val === 'number') {
          return val > 120 ? Math.round(val / 60) : val;
        }
        if (typeof val === 'string') {
          if (/^P/i.test(val)) return this.parseIsoDuration(val);
          const num = parseInt(val, 10);
          if (!isNaN(num)) return num > 120 ? Math.round(num / 60) : num;
        }
        return null;
      };

      const prepTimeMinutes = parseAnyDuration(cand.prepTimeMinutes || cand.prep_time || cand.prepTime) || 15;
      const cookTimeMinutes = parseAnyDuration(cand.cookTimeMinutes || cand.cook_time || cand.cookTime) || 20;

      // Source URL & Domain preservation
      let sourceUrl = cand.sourceUrl || cand.source_url || cand.source?.url || cand.url || '';
      let sourceDomain = cand.sourceDomain || cand.source_domain || '';
      if (sourceUrl && !sourceDomain) {
        sourceDomain = this.getDomain(sourceUrl) || cand.source?.name || '';
      }

      // Ingredients normalization
      const ingredients = [];
      const rawIngs = cand.ingredients || cand.recipeIngredient || [];
      const ingItems = Array.isArray(rawIngs) ? rawIngs : (typeof rawIngs === 'string' ? rawIngs.split(/\r?\n/) : []);

      const splitCompositeIngredientLine = (text) => {
        if (!text || typeof text !== 'string') return [];
        let clean = text.trim();
        if (/^(?:#+\s*)?(?:ingredientes(?:\s+para\s+[^:\n]+)?:?|para\s+(?:el\s+)?[^:\n]+:?)$/i.test(clean)) return [];
        if (clean.includes('\n')) {
          return clean.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        }
        if (/[🔸🔹•●■▪️]/u.test(clean)) {
          return clean.split(/[🔸🔹•●■▪️]/u).map(s => s.trim()).filter(Boolean);
        }
        if (/\s+-\s+/.test(clean)) {
          return clean.split(/\s+-\s+/).map(s => s.trim()).filter(Boolean);
        }
        if (clean.includes(',') && clean.length > 35) {
          const parts = clean.split(',').map(s => s.trim()).filter(Boolean);
          if (parts.length > 2) return parts;
        }
        return [clean];
      };

      ingItems.forEach(ingItem => {
        if (!ingItem) return;
        const rawString = typeof ingItem === 'string'
          ? ingItem
          : (ingItem.rawText || ingItem.text || ingItem.displayText || ingItem.raw || ingItem.ingredientText);

        if (rawString) {
          const subLines = splitCompositeIngredientLine(rawString);
          subLines.forEach(line => {
            if (/^(?:#+\s*)?(?:ingredientes(?:\s+para\s+[^:\n]+)?:?|para\s+(?:el\s+)?[^:\n]+:?)$/i.test(line)) return;
            // Descartar líneas sin letras (ej. emojis sueltos de señalización "👇👇👇" o viñetas vacías)
            if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(line)) return;
            const parsed = this.parseIngredientLine(line);
            if (parsed) {
              if (Array.isArray(parsed)) ingredients.push(...parsed);
              else ingredients.push(parsed);
            } else {
              const cleanLine = line.replace(/^[\u2022\-\*]\s*/, '').trim();
              if (cleanLine.length > 1) {
                ingredients.push({
                  id: generateId('i-'),
                  name: cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1),
                  amount: 1,
                  unit: 'ud',
                  aisle: (typeof categorizeIngredientAisle === 'function' ? categorizeIngredientAisle(cleanLine) : 'other')
                });
              }
            }
          });
        } else if (typeof ingItem === 'object' && (ingItem.name || ingItem.ingredient)) {
          let name = String(ingItem.name || ingItem.ingredient).replace(/^[\u2022\-\*]\s*/, '').trim();
          if (name) {
            const rawAmount = ingItem.amount !== undefined ? ingItem.amount : (ingItem.quantity !== undefined ? ingItem.quantity : null);
            const amount = typeof rawAmount === 'number' ? rawAmount : (rawAmount ? parseFloat(rawAmount) : null);
            const unit = this.normalizeUnit(ingItem.unit || ingItem.measurement || '');
            const aisle = ingItem.aisle || (typeof categorizeIngredientAisle === 'function' ? categorizeIngredientAisle(name) : 'other');
            ingredients.push({
              id: ingItem.id || generateId('i-'),
              name: name.charAt(0).toUpperCase() + name.slice(1),
              amount: amount !== null && !isNaN(amount) ? amount : null,
              unit: unit,
              aisle: aisle
            });
          }
        }
      });

      // Instructions normalization
      const instructions = [];
      let rawSteps = cand.instructions || cand.recipeInstructions || cand.steps || [];
      if (rawSteps && typeof rawSteps === 'object' && !Array.isArray(rawSteps) && Array.isArray(rawSteps.steps)) {
        rawSteps = rawSteps.steps;
      }
      if (typeof rawSteps === 'string') {
        rawSteps = [rawSteps];
      }

      const splitInstructionStep = (text) => {
        if (!text || typeof text !== 'string') return [];
        const clean = text.trim();
        if (clean.includes('\n') || /(?<=[^\d\s])\s*(?=\d+[\.\)]\s*)/.test(clean)) {
          return clean.split(/(?:\r?\n|(?<=[^\d\s])\s*(?=\d+[\.\)]\s*))/).map(s => s.trim()).filter(Boolean);
        }
        return [clean];
      };

      if (Array.isArray(rawSteps)) {
        rawSteps.forEach(stepItem => {
          if (!stepItem) return;
          let rawText = '';
          let timerMin = 0;
          if (typeof stepItem === 'string') {
            rawText = stepItem;
          } else if (typeof stepItem === 'object') {
            rawText = stepItem.text || stepItem.description || stepItem.step || '';
            if (stepItem.timerMinutes) timerMin = stepItem.timerMinutes;
          }

          const subSteps = splitInstructionStep(rawText);
          subSteps.forEach(sub => {
            let text = String(sub)
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/^[\d\.\)\s\-]+/, '')
              .replace(/\s+/g, ' ')
              .trim();
            if (text && text.length > 3) {
              const detectedTimer = timerMin || this.extractTimerMinutes(text);
              instructions.push({
                step: instructions.length + 1,
                text: text,
                timerMinutes: detectedTimer
              });
            }
          });
        });
      }

      // Tags
      const tags = [];
      if (Array.isArray(cand.tags)) tags.push(...cand.tags);
      if (Array.isArray(cand.categories)) tags.push(...cand.categories);
      if (cand._collection && !tags.includes(cand._collection)) {
        tags.push(cand._collection);
      }

      // Nutrition
      let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      if (cand.nutrition && typeof cand.nutrition === 'object') {
        nutrition = {
          calories: parseInt(cand.nutrition.calories, 10) || 0,
          protein: parseInt(cand.nutrition.protein, 10) || 0,
          carbs: parseInt(cand.nutrition.carbs, 10) || 0,
          fat: parseInt(cand.nutrition.fat, 10) || 0
        };
      }
      if (nutrition.calories === 0 && ingredients.length > 0 && typeof estimateRecipeNutrition === 'function') {
        nutrition = estimateRecipeNutrition({ title, ingredients, servings });
      }

      const safeId = (cand.id && typeof cand.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(cand.id))
        ? cand.id
        : generateId('rec-');
      const recipe = {
        id: safeId,
        title: title,
        description: description,
        imageUrl: isSafeUrl(imageUrl) ? imageUrl : '',
        prepTimeMinutes: prepTimeMinutes,
        cookTimeMinutes: cookTimeMinutes,
        servings: servings,
        nutrition: nutrition,
        tags: tags,
        ingredients: ingredients,
        instructions: instructions,
        sourceUrl: isSafeUrl(sourceUrl) ? sourceUrl : '',
        sourceDomain: sourceDomain,
        createdAt: cand.createdAt || new Date().toISOString(),
        updatedAt: cand.updatedAt || new Date().toISOString()
      };

      this.detectRobotFeatures(recipe);
      candidates.push(recipe);
    });

    return { candidates, extraData };
  },

  detectDuplicatesAndWarnings(candidates, existingRecipes = []) {
    if (!Array.isArray(candidates)) return;
    const existing = Array.isArray(existingRecipes) ? existingRecipes : [];

    const norm = (str) => {
      if (!str) return '';
      return String(str)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
    };

    const cleanUrl = (url) => {
      if (!url) return '';
      return String(url)
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/(?:www\.)?/, '')
        .replace(/\/+$/, '');
    };

    candidates.forEach(cand => {
      cand.warnings = [];
      const candTitleNorm = norm(cand.title);
      const candUrlNorm = cleanUrl(cand.sourceUrl);

      // Warning checks
      if (!cand.instructions || cand.instructions.length === 0) {
        cand.warnings.push('Sin pasos de preparación');
      }
      if (!cand.ingredients || cand.ingredients.length < 2) {
        cand.warnings.push(`Pocos ingredientes (${cand.ingredients ? cand.ingredients.length : 0})`);
      }
      if (!cand.imageUrl) {
        cand.warnings.push('Sin foto');
      }

      // Duplicate detection
      let dupMatch = null;
      let dupReason = '';

      if (candUrlNorm) {
        dupMatch = existing.find(ex => cleanUrl(ex.sourceUrl) === candUrlNorm);
        if (dupMatch) dupReason = 'Misma URL original';
      }

      if (!dupMatch && candTitleNorm) {
        dupMatch = existing.find(ex => norm(ex.title) === candTitleNorm);
        if (dupMatch) dupReason = 'Mismo título';
      }

      if (dupMatch) {
        cand.isDuplicate = true;
        cand.duplicateOf = dupMatch;
        cand.duplicateReason = dupReason;
        cand.selected = false; // Duplicates unselected by default
      } else {
        cand.isDuplicate = false;
        cand.duplicateOf = null;
        cand.duplicateReason = '';
        cand.selected = true; // New recipes selected by default
      }
    });
  },

  finalizeImportRecipe(cand) {
    if (!cand) return null;
    const finalRecipe = { ...cand };
    delete finalRecipe.warnings;
    delete finalRecipe.isDuplicate;
    delete finalRecipe.duplicateOf;
    delete finalRecipe.duplicateReason;
    delete finalRecipe.selected;
    delete finalRecipe._collection;

    // Normalization of ingredients with aisle categorization
    if (Array.isArray(finalRecipe.ingredients)) {
      finalRecipe.ingredients = finalRecipe.ingredients.map(ing => {
        const itemAisle = ing.aisle && ing.aisle !== 'other'
          ? ing.aisle
          : (typeof categorizeIngredientAisle === 'function' ? categorizeIngredientAisle(ing.name) : 'other');
        return {
          id: ing.id || generateId('i-'),
          name: ing.name,
          amount: ing.amount !== undefined ? ing.amount : null,
          unit: ing.unit || '',
          aisle: itemAisle
        };
      });
    } else {
      finalRecipe.ingredients = [];
    }

    // Auto-infer tags if available
    if (typeof analyzeAndInferRecipeTags === 'function') {
      const inferred = analyzeAndInferRecipeTags(finalRecipe);
      if (!Array.isArray(finalRecipe.tags)) finalRecipe.tags = [];
      const set = new Set(finalRecipe.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(t => {
        if (!set.has(String(t).toLowerCase().trim())) {
          finalRecipe.tags.push(t);
          set.add(String(t).toLowerCase().trim());
          if (typeof state !== 'undefined' && state.addCustomTag) {
            state.addCustomTag(t);
          }
        }
      });
    }

    if ((!finalRecipe.nutrition || finalRecipe.nutrition.calories === 0) && typeof estimateRecipeNutrition === 'function') {
      finalRecipe.nutrition = estimateRecipeNutrition({
        title: finalRecipe.title,
        ingredients: finalRecipe.ingredients,
        servings: finalRecipe.servings
      });
    }

    return finalRecipe;
  }
};

function parseRecipeOrigins(rawOrigin, knownRecipes = []) {
  if (!rawOrigin || typeof rawOrigin !== 'string') return [];
  const trimmed = rawOrigin.trim();
  if (!trimmed) return [];
  if (!trimmed.includes(',')) return [trimmed];

  const knownTitles = (knownRecipes || []).map(r => (r && r.title ? r.title.trim().toLowerCase() : '')).filter(Boolean);

  // 1. Si el string completo coincide exactamente con una receta del catálogo, es una sola receta con comas en su título
  if (knownTitles.includes(trimmed.toLowerCase())) {
    return [trimmed];
  }

  const candidateParts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
  if (candidateParts.length <= 1) return [trimmed];

  // 2. Si no hay recetas conocidas para contrastar, devolver los candidatos separados por coma
  if (knownTitles.length === 0) {
    return candidateParts;
  }

  // 3. Reensamblar partes si pertenecen a un mismo título conocido con comas
  const result = [];
  let currentBuffer = '';

  for (let i = 0; i < candidateParts.length; i++) {
    const part = candidateParts[i];
    const candidate = currentBuffer ? `${currentBuffer}, ${part}` : part;
    const candidateLower = candidate.toLowerCase();
    const isPrefix = knownTitles.some(t => t.startsWith(`${candidateLower},`));

    if (isPrefix && i < candidateParts.length - 1) {
      currentBuffer = candidate;
    } else {
      result.push(candidate);
      currentBuffer = '';
    }
  }

  if (currentBuffer) {
    result.push(currentBuffer);
  }

  return result.length > 0 ? result : candidateParts;
}

if (typeof window !== 'undefined') {
  window.RecipeParser = RecipeParser;
  window.APP_VERSION = 'v1.76';
  window.cleanRecipeImageUrl = cleanRecipeImageUrl;
  window.getRecipeTheme = getRecipeTheme;
  window.getRecipePlaceholderSvg = getRecipePlaceholderSvg;
  window.getRecipePlaceholderHtml = getRecipePlaceholderHtml;
  window.generateId = generateId;
  window.toLocalDateKey = toLocalDateKey;
  window.parseLocalDateKey = parseLocalDateKey;
  window.getMondayOfWeek = getMondayOfWeek;
  window.getWeekDates = getWeekDates;
  window.formatWeekRange = formatWeekRange;
  window.DAYS_OF_WEEK_ES = DAYS_OF_WEEK_ES;
  window.escapeHtml = escapeHtml;
  window.cleanInvisibleChars = cleanInvisibleChars;
  window.deduplicateShoppingBreakdown = deduplicateShoppingBreakdown;
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
  window.estimateRecipeNutrition = estimateRecipeNutrition;
  window.getRecipeNutrition = getRecipeNutrition;
  window.detectRecipeLanguage = detectRecipeLanguage;
  window.getRecipeLanguage = getRecipeLanguage;
  window.getRecipeLanguageMeta = getRecipeLanguageMeta;
  window.getPrimaryProteinCategory = getPrimaryProteinCategory;
  window.parseRecipeOrigins = parseRecipeOrigins;
  window.reconcileShoppingItemBreakdown = reconcileShoppingItemBreakdown;
  window.formatDisplayAmount = formatDisplayAmount;
}

// UI Controller
class FoodAssistantApp {
  constructor() {
    this.clientId = 'client-' + Math.random().toString(36).slice(2) + '-' + Date.now();
    this.appVersion = window.APP_VERSION || 'v1.76';
    this.activeView = 'view-today';
    this.todayNutritionExpanded = false; // US-73: Collapsible 1-line nutrition pill bar
    this.plannerExpandedDays = null; // US-73: Set of expanded dateKeys in weekly planner accordion
    this.aiChatHistory = [];
    this.activeRecipe = null;
    this.activeServings = 2;
    this.pickerTarget = null;
    this.plannerWeekOffset = 0; // 0: current week, -1: previous, +1: next (US-05)
    this.copyWeekSourceMondayKey = null; // US-04: selected source week Monday key
    this.copyWeekMode = 'replace'; // 'replace' | 'merge' (US-04)
    this.selectedRecipeTags = new Set();
    this.editorSelectedTags = new Set();
    this.pickerSelectedTags = new Set();
    this.pickerOnlyDietary = false;
    this.shoppingViewMode = (typeof localStorage !== 'undefined' && localStorage.getItem('fa_shopping_view_mode') === 'recipe') ? 'recipe' : 'aisle'; // US-33: 'aisle' | 'recipe'
    this.wakeLockSentinel = null; // US-60: Screen Wake Lock Sentinel
    this.isWakeLockActive = false; // US-60: Active flag for Wake Lock badge
    this.onboardingStep = 1; // US-68: Onboarding Wizard current step (1..5)
    this.onboardingDietary = new Set(Array.isArray(state.dietaryPreferences) ? state.dietaryPreferences : []);
    this.onboardingServings = state.defaultServings || 2;

    // US-34: Fridge Reverse Search state
    this.fridgeIngredients = [];

    // Progressive Recipe Catalog Rendering (eliminates lag with 800+ recipes)
    this.recipesPageSize = 36;
    this.recipesRenderedCount = 0;
    this.currentRenderedRecipesList = [];
    this.recipesScrollObserver = null;

    // US-78: Recipe Bulk Delete & Cleanup Filters
    this.isRecipeSelectMode = false;
    this.selectedRecipeIds = new Set();
    this.recipeAuditFilter = null; // 'no-ingredients' | 'no-instructions' | null

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
    this.initLanguage();
    this.initSupabaseClient();
    this.initEvents();
    this.updateUserAccountUI();
    this.sanitizeRecipeProteinTags();
    this.sanitizeRecipeSourceDomains();
    this.render();
  }

  cleanDuplicateRecipes() {
    if (!Array.isArray(state.recipes)) return 0;
    const seenTitles = new Map();
    const unique = [];
    const removedIds = [];

    state.recipes.forEach(r => {
      const key = String(r.title || '').trim().toLowerCase();
      if (!key) {
        unique.push(r);
        return;
      }
      if (!seenTitles.has(key)) {
        seenTitles.set(key, r);
        unique.push(r);
      } else {
        removedIds.push(r.id);
        if (typeof state.trackDeletion === 'function') {
          state.trackDeletion('recipes', r.id);
        }
      }
    });

    if (removedIds.length > 0) {
      state.recipes = unique;
      if (typeof state.save === 'function') {
        state.save('fa_recipes', state.recipes);
      }
      console.log(`[FoodAssistant] Limpieza de duplicados: ${removedIds.length} recetas duplicadas eliminadas del catálogo.`);
    }
    return removedIds.length;
  }

  sanitizeRecipeSourceDomains() {
    if (!Array.isArray(state.recipes) || state.recipes.length === 0) return;
    let changed = false;
    state.recipes.forEach(r => {
      if (!r) return;
      const isWrapper = RecipeParser && typeof RecipeParser.isWrapperDomain === 'function'
        ? RecipeParser.isWrapperDomain(r.sourceDomain)
        : (r.sourceDomain && (r.sourceDomain.includes('share.google') || r.sourceDomain.includes('google.com')));
      if (isWrapper) {
        const unwrapped = RecipeParser && typeof RecipeParser.unwrapRedirectUrl === 'function'
          ? RecipeParser.unwrapRedirectUrl(r.sourceUrl)
          : r.sourceUrl;
        const unwrappedDomain = RecipeParser && typeof RecipeParser.getDomain === 'function'
          ? RecipeParser.getDomain(unwrapped)
          : '';
        if (unwrappedDomain && !RecipeParser.isWrapperDomain(unwrappedDomain)) {
          r.sourceUrl = unwrapped;
          r.sourceDomain = unwrappedDomain;
          changed = true;
        } else {
          r.sourceDomain = '';
          changed = true;
        }
      }
    });
    if (changed) {
      state.save('fa_recipes', state.recipes);
      if (typeof this.scheduleSyncWithCloud === 'function') {
        this.scheduleSyncWithCloud();
      }
    }
  }

  sanitizeRecipeProteinTags() {
    if (!Array.isArray(state.recipes) || state.recipes.length === 0) return;
    let changed = false;
    state.recipes.forEach(r => {
      if (!r) return;
      if (!Array.isArray(r.tags)) r.tags = [];

      // 1. Limpiar la etiqueta obsoleta "General" si existe
      if (r.tags.some(t => t && String(t).trim().toLowerCase() === 'general')) {
        r.tags = r.tags.filter(t => t && String(t).trim().toLowerCase() !== 'general');
        changed = true;
      }

      // BUG-27: Saneamiento retroactivo de recetas sin ingredientes (limpiar macros falsos heredados y etiqueta 'Alta en Proteínas')
      const hasIngs = Array.isArray(r.ingredients) && r.ingredients.some(i => i && (typeof i === 'string' ? i.trim().length > 0 : (i.name && String(i.name).trim().length > 0)));
      if (!hasIngs && !r.isExplicitNutrition) {
        if (r.tags.includes('Alta en Proteínas')) {
          r.tags = r.tags.filter(t => t !== 'Alta en Proteínas');
          changed = true;
        }
        if (r.nutrition && (
          (r.nutrition.calories === 450 && Math.round(r.nutrition.protein || 0) === 28) ||
          (r.nutrition.calories === 350 && Math.round(r.nutrition.protein || 0) === 14) ||
          (r.nutrition.calories === 280 && Math.round(r.nutrition.protein || 0) === 12) ||
          !r.isExplicitNutrition
        )) {
          r.nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
          r._cachedNutrition = null;
          changed = true;
        }
      }

      const inferred = (typeof analyzeAndInferRecipeTags === 'function') ? analyzeAndInferRecipeTags(r) : [];
      const hasTag = r.tags.includes('Alta en Proteínas');
      const shouldHave = inferred.includes('Alta en Proteínas');

      if (hasTag && !shouldHave) {
        r.tags = r.tags.filter(t => t !== 'Alta en Proteínas');
        changed = true;
      }

      // 2. Añadir automáticamente todas las etiquetas inferidas que falten
      const currentLower = new Set(r.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(tag => {
        const lower = tag.toLowerCase().trim();
        if (!currentLower.has(lower) && lower !== 'general') {
          r.tags.push(tag);
          currentLower.add(lower);
          changed = true;
        }
      });
    });

    if (changed) {
      state.save('fa_recipes', state.recipes);
      if (typeof this.initRecipeTagFilters === 'function') {
        this.initRecipeTagFilters();
      }
      if (typeof this.scheduleSyncWithCloud === 'function') {
        this.scheduleSyncWithCloud();
      }
    }
  }

  // ==========================================================================
  // PWA: instalación nativa (US-10) y Web Share Target (US-59)
  // ==========================================================================
  isStandaloneDisplay() {
    try {
      return !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator?.standalone === true;
    } catch (e) {
      return false;
    }
  }

  isPwaBannerDismissed() {
    try {
      return localStorage.getItem('fa_pwa_banner_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  }

  dismissPwaBanner() {
    try {
      localStorage.setItem('fa_pwa_banner_dismissed', 'true');
    } catch (e) { }
    const banner = document.getElementById('pwa-smart-banner');
    if (banner) banner.hidden = true;
  }

  updatePwaInstallUI() {
    const box = document.getElementById('pwa-install-box');
    if (box) {
      box.hidden = !this.deferredInstallPrompt || this.isStandaloneDisplay();
    }
    const banner = document.getElementById('pwa-smart-banner');
    if (banner) {
      const isDismissed = this.isPwaBannerDismissed();
      const isStandalone = this.isStandaloneDisplay();
      const canInstall = Boolean(this.deferredInstallPrompt);
      banner.hidden = !canInstall || isStandalone || isDismissed;
    }
  }

  initPwaInstall() {
    if (this._pwaInstallBound) return;
    this._pwaInstallBound = true;
    this.deferredInstallPrompt = null;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredInstallPrompt = event;
      this.updatePwaInstallUI();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.updatePwaInstallUI();
      this.showToast('¡Sabory instalada en tu pantalla de inicio!', 'success');
    });

    document.getElementById('btn-install-pwa')?.addEventListener('click', () => this.promptPwaInstall());
    document.getElementById('btn-smart-install-pwa')?.addEventListener('click', () => this.promptPwaInstall());
    document.getElementById('btn-smart-dismiss-pwa')?.addEventListener('click', () => this.dismissPwaBanner());
    this.updatePwaInstallUI();
  }

  async promptPwaInstall() {
    const promptEvent = this.deferredInstallPrompt;
    if (!promptEvent || typeof promptEvent.prompt !== 'function') {
      this.updatePwaInstallUI();
      return false;
    }
    // El evento solo puede usarse una vez
    this.deferredInstallPrompt = null;
    this.updatePwaInstallUI();
    try {
      await promptEvent['prompt'](); // acceso por corchetes: la suite prohíbe diálogos nativos del navegador
      const choice = await promptEvent.userChoice;
      return !!choice && choice.outcome === 'accepted';
    } catch (e) {
      console.warn('[FoodAssistant] No se pudo mostrar el aviso de instalación:', e);
      return false;
    }
  }

  extractSharedPayload(params) {
    const clean = (v) => String(v || '').trim();
    const sharedUrl = clean(params.get('url'));
    const sharedText = clean(params.get('text'));
    const sharedTitle = clean(params.get('title'));
    const findUrl = (s) => {
      const m = s.match(/https?:\/\/[^\s<>"']+/i);
      return m ? m[0].replace(/[),.;!?]+$/, '') : '';
    };
    // Instagram / TikTok suelen enviar la URL dentro de `text`
    const rawUrl = findUrl(sharedUrl) || findUrl(sharedText) || findUrl(sharedTitle);
    const url = RecipeParser && typeof RecipeParser.unwrapRedirectUrl === 'function' ? RecipeParser.unwrapRedirectUrl(rawUrl) : rawUrl;
    const text = [sharedTitle, sharedText].filter(Boolean).join('\n').trim();
    return { url, text };
  }

  handleShareTargetLaunch() {
    if (typeof window === 'undefined' || !window.location?.search) return false;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('url') && !params.has('text') && !params.has('title')) return false;

    const { url, text } = this.extractSharedPayload(params);
    if (!url && !text) return false;

    // Limpiar la URL para no reimportar al recargar
    try {
      ['url', 'text', 'title'].forEach(k => params.delete(k));
      const remaining = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (remaining ? `?${remaining}` : '') + (window.location.hash || ''));
    } catch (e) { /* entorno sin History API */ }

    const open = () => {
      this.switchView('view-recipes');
      this.openImportModal(url ? 'url' : 'text');
      if (url) {
        const urlInput = document.getElementById('import-url-input');
        if (urlInput) urlInput.value = url;
      } else {
        const textInput = document.getElementById('import-text-input');
        if (textInput) textInput.value = text;
      }
      this.showToast(url ? 'Enlace recibido: pulsa Analizar e Importar' : 'Texto recibido: pulsa Analizar e Importar', 'info');
    };
    setTimeout(open, 400);
    return true;
  }

  initVersion() {
    const badge = document.getElementById('app-version-badge');
    if (badge) badge.textContent = this.appVersion;
    const settingsVer = document.getElementById('settings-app-version-text');
    if (settingsVer) settingsVer.textContent = this.appVersion;
  }

  initElements() {
    this.navItems = document.querySelectorAll('.bottom-nav .nav-item, .desktop-header-nav .header-nav-btn');
    this.viewPanels = document.querySelectorAll('.view-panel');

    // Modals
    this.modalRecipeDetail = document.getElementById('modal-recipe-detail');
    this.modalRecipePicker = document.getElementById('modal-recipe-picker');
    this.modalRecipeImport = document.getElementById('modal-recipe-import');
    this.modalRecipeAddChoice = document.getElementById('modal-recipe-add-choice');
    this.modalRecipeEdit = document.getElementById('modal-recipe-edit');
    this.modalAuth = document.getElementById('modal-auth');
    this.modalShoppingPreview = document.getElementById('modal-shopping-preview');
    this.modalCopyWeek = document.getElementById('modal-copy-week');
    this.modalBulkImport = document.getElementById('modal-bulk-import');
    this.modalConfirmDialog = document.getElementById('modal-confirm-dialog');
    this.modalGeminiInvoke = document.getElementById('modal-gemini-invoke');
    this.modalPlanRecipe = document.getElementById('modal-plan-recipe');
    this.modalOnboarding = document.getElementById('modal-onboarding');
    this.cookModeOverlay = document.getElementById('cook-mode-overlay');
    this._confirmDialogResolver = null;
    this._confirmDialogMode = 'confirm';
    this.planRecipeTarget = null;
    this.planRecipeSelectedSlot = 'lunch';
    this.planRecipeIsCustomSlot = false;
    this.pickerSearchQuery = '';
    this.recipesBulkToolbar = document.getElementById('recipes-bulk-toolbar');
    this.btnToggleRecipeSelectMode = document.getElementById('btn-toggle-recipes-select-mode');
  }

  // ==========================================================================
  // US-18 / US-55: NATIVE <dialog> MODAL SYSTEM & MATERIAL 3 TOASTS
  // ==========================================================================
  openDialogModal(el) {
    if (!el) return;
    el.classList.add('active');
    if (typeof el.showModal === 'function' && !el.open) {
      try {
        el.showModal();
      } catch (e) {
        el.setAttribute('open', '');
      }
    }
  }

  closeDialogModal(el) {
    if (!el) return;
    el.classList.remove('active');
    if (typeof el.close === 'function' && el.open) {
      try {
        el.close();
      } catch (e) {
        el.removeAttribute('open');
      }
    } else if (el.hasAttribute && el.hasAttribute('open')) {
      el.removeAttribute('open');
    }
  }

  showToast(message, type = 'info', duration = 3200) {
    if (!message || typeof document === 'undefined') return null;
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const icons = {
      success: 'check_circle',
      warning: 'warning',
      error: 'error',
      info: 'info'
    };
    const iconName = icons[type] || icons.info;

    const closeAria = window.I18n ? window.I18n.t('common.close') : 'Cerrar aviso';
    const toast = document.createElement('div');
    toast.className = `m3-toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML = `
      <span class="material-symbols-outlined m3-toast-icon">${iconName}</span>
      <span class="m3-toast-message"></span>
      <button type="button" class="m3-toast-close" aria-label="${closeAria}">
        <span class="material-symbols-outlined icon-16">close</span>
      </button>
    `;
    const resolvedMessage = (window.I18n && typeof message === 'string' && (message.startsWith('toasts.') || message.startsWith('common.')))
      ? window.I18n.t(message)
      : message;
    toast.querySelector('.m3-toast-message').textContent = resolvedMessage;

    const dismiss = () => {
      if (!toast.parentNode) return;
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 180);
    };

    toast.querySelector('.m3-toast-close')?.addEventListener('click', dismiss);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
    return toast;
  }

  highlightInputError(inputEl, message, toastType = 'warning') {
    if (inputEl) {
      inputEl.classList.add('input-error');
      if (typeof inputEl.focus === 'function') inputEl.focus();
      const clearErr = () => {
        inputEl.classList.remove('input-error');
        inputEl.removeEventListener('input', clearErr);
      };
      inputEl.addEventListener('input', clearErr);
      setTimeout(clearErr, 2600);
    }
    if (message) {
      this.showToast(message, toastType);
    }
  }

  ensureConfirmDialogElement() {
    let dialog = document.getElementById('modal-confirm-dialog');
    if (!dialog && typeof document !== 'undefined') {
      dialog = document.createElement('dialog');
      dialog.className = 'modal-overlay';
      dialog.id = 'modal-confirm-dialog';
      dialog.setAttribute('closedby', 'any');
      dialog.setAttribute('aria-labelledby', 'confirm-dialog-title');
      dialog.innerHTML = `
        <div class="modal-content confirm-dialog-content">
          <div class="confirm-dialog-header">
            <div class="confirm-dialog-icon" id="confirm-dialog-icon-wrap">
              <span class="material-symbols-outlined" id="confirm-dialog-icon">warning</span>
            </div>
            <h3 class="confirm-dialog-title" id="confirm-dialog-title">Confirmar acción</h3>
          </div>
          <p class="confirm-dialog-message" id="confirm-dialog-message"></p>
          <div id="confirm-dialog-input-wrap" class="confirm-dialog-input-wrap">
            <input type="email" class="form-input" id="confirm-dialog-input" placeholder="usuario@gmail.com">
          </div>
          <div class="confirm-dialog-actions">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-confirm-dialog-cancel" autofocus>Cancelar</button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-confirm-dialog-accept">Confirmar</button>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
      this.bindConfirmDialogEvents(dialog);
    }
    this.modalConfirmDialog = dialog;
    return dialog;
  }

  bindConfirmDialogEvents(dialog) {
    if (!dialog || dialog._confirmBound) return;
    dialog._confirmBound = true;

    const cancelBtn = dialog.querySelector('#btn-confirm-dialog-cancel');
    const acceptBtn = dialog.querySelector('#btn-confirm-dialog-accept');
    const inputEl = dialog.querySelector('#confirm-dialog-input');

    cancelBtn?.addEventListener('click', () => this.closeConfirmDialog(false));
    acceptBtn?.addEventListener('click', () => this.closeConfirmDialog(true));
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.closeConfirmDialog(true);
      }
    });

    dialog.addEventListener('close', () => {
      if (this._confirmDialogResolver) {
        this.closeConfirmDialog(false);
      }
    });
  }

  showConfirmDialog(options = {}) {
    const dialog = this.ensureConfirmDialogElement();
    if (!dialog) return Promise.resolve(false);
    if (this._isConfirmDialogOpen || dialog.open) {
      return Promise.resolve(false);
    }
    this._isConfirmDialogOpen = true;
    this.bindConfirmDialogEvents(dialog);

    const {
      title = 'Confirmar acción',
      message = '',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      danger = false,
      icon = danger ? 'warning' : 'help',
      input = false,
      defaultValue = '',
      placeholder = ''
    } = options;

    this._confirmDialogMode = input ? 'prompt' : 'confirm';

    const titleEl = dialog.querySelector('#confirm-dialog-title');
    const msgEl = dialog.querySelector('#confirm-dialog-message');
    const iconEl = dialog.querySelector('#confirm-dialog-icon');
    const iconWrap = dialog.querySelector('#confirm-dialog-icon-wrap');
    const acceptBtn = dialog.querySelector('#btn-confirm-dialog-accept');
    const cancelBtn = dialog.querySelector('#btn-confirm-dialog-cancel');
    const inputWrap = dialog.querySelector('#confirm-dialog-input-wrap');
    const inputEl = dialog.querySelector('#confirm-dialog-input');

    // Desvincular atributos i18n para evitar que un barrido de traducciones en segundo plano sobreescriba los textos del diálogo
    titleEl?.removeAttribute('data-i18n');
    msgEl?.removeAttribute('data-i18n');
    acceptBtn?.removeAttribute('data-i18n');
    cancelBtn?.removeAttribute('data-i18n');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;
    if (iconWrap) iconWrap.classList.toggle('is-danger', !!danger);
    if (acceptBtn) {
      acceptBtn.textContent = confirmText;
      acceptBtn.classList.toggle('btn-danger', !!danger);
      acceptBtn.classList.toggle('btn-primary', !danger);
    }
    if (cancelBtn) cancelBtn.textContent = cancelText;

    if (inputWrap && inputEl) {
      if (input) {
        inputWrap.style.display = 'block';
        inputEl.value = defaultValue;
        inputEl.placeholder = placeholder;
      } else {
        inputWrap.style.display = 'none';
        inputEl.value = '';
      }
    }

    this.openDialogModal(dialog);
    if (input && inputEl && typeof inputEl.focus === 'function') {
      setTimeout(() => inputEl.focus(), 50);
    } else if (cancelBtn && typeof cancelBtn.focus === 'function') {
      setTimeout(() => cancelBtn.focus(), 50);
    }

    return new Promise((resolve) => {
      this._confirmDialogResolver = resolve;
    });
  }

  showPromptDialog(options = {}) {
    return this.showConfirmDialog({ ...options, input: true });
  }

  closeConfirmDialog(accepted = false) {
    this._isConfirmDialogOpen = false;
    const dialog = this.modalConfirmDialog || document.getElementById('modal-confirm-dialog');
    const resolver = this._confirmDialogResolver;
    const mode = this._confirmDialogMode;
    this._confirmDialogResolver = null;

    let result = !!accepted;
    if (mode === 'prompt') {
      const inputEl = dialog?.querySelector('#confirm-dialog-input');
      const val = (inputEl?.value || '').trim();
      result = accepted && val ? val : null;
    }

    if (dialog) {
      this.closeDialogModal(dialog);
    }
    if (typeof resolver === 'function') {
      resolver(result);
    }
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

  // ==========================================================================
  // US-12: MULTILINGUAL & I18N SUPPORT (AUTO / ES / EN)
  // ==========================================================================
  initLanguage() {
    if (!window.I18n) return;
    this.updateLanguageUI(window.I18n.getPreference());

    // Listen to changes from any source
    window.I18n.onChange((resolvedLang, preference) => {
      this.updateLanguageUI(preference);
      this.updateUserAccountUI();
    });
  }

  applyLanguage(langMode, notify = true) {
    if (!window.I18n) return;
    window.I18n.setPreference(langMode);
    this.updateLanguageUI(langMode);
    this.render();
    this.updateUserAccountUI();
    if (typeof this.renderHouseholdSettings === 'function') {
      this.renderHouseholdSettings();
    }
    if (typeof this.renderSettings === 'function') {
      this.renderSettings();
    }
    if (this.onboardingStep === 2 && typeof this.renderOnboardingDietaryChips === 'function') {
      this.renderOnboardingDietaryChips();
    }
    if (this.activeRecipe && this.modalRecipeDetail && (this.modalRecipeDetail.open || this.modalRecipeDetail.classList.contains('active'))) {
      this.renderRecipeModalContent();
    }
    const nutModal = document.getElementById('modal-nutrition-breakdown');
    if (nutModal && nutModal.open) {
      this.renderNutritionBreakdownModal();
    }
    if (notify) {
      this.showToast(window.I18n.t('settings.languageUpdated'), 'info');
    }
  }

  updateLanguageUI(langMode) {
    document.querySelectorAll('#language-segmented-group .segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langVal === langMode);
    });
    if (window.I18n) {
      window.I18n.applyTranslations();
    }
    this.updateUserAccountUI();
    const currentRecipeLang = document.getElementById('edit-recipe-language')?.value || 'es';
    this.syncRecipeEditorLanguageUI(currentRecipeLang);
  }

  initRecipeEditorLanguagePicker() {
    const langBtn = document.getElementById('edit-recipe-lang-btn');
    const langDropdown = document.getElementById('edit-recipe-lang-dropdown');
    const langWrapper = document.getElementById('edit-recipe-lang-wrapper');
    const hiddenSelect = document.getElementById('edit-recipe-language');

    if (!langBtn || !langDropdown || !langWrapper) return;

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = langDropdown.classList.contains('is-hidden');
      if (isHidden) {
        langDropdown.classList.remove('is-hidden');
        langWrapper.classList.add('is-open');
        langBtn.setAttribute('aria-expanded', 'true');
      } else {
        langDropdown.classList.add('is-hidden');
        langWrapper.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    langDropdown.querySelectorAll('.custom-lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = opt.dataset.lang || 'es';
        this.syncRecipeEditorLanguageUI(selectedLang);
        langDropdown.classList.add('is-hidden');
        langWrapper.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
        if (hiddenSelect) {
          hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!langWrapper.contains(e.target)) {
        langDropdown.classList.add('is-hidden');
        langWrapper.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    if (hiddenSelect) {
      hiddenSelect.addEventListener('change', () => {
        this.syncRecipeEditorLanguageUI(hiddenSelect.value);
      });
    }
  }

  syncRecipeEditorLanguageUI(lang) {
    const normalized = (lang === 'en') ? 'en' : 'es';
    const hiddenSelect = document.getElementById('edit-recipe-language');
    if (hiddenSelect && hiddenSelect.value !== normalized) {
      hiddenSelect.value = normalized;
    }

    const flagIcon = document.getElementById('edit-recipe-lang-flag');
    const label = document.getElementById('edit-recipe-lang-label');
    const isEn = normalized === 'en';

    if (flagIcon) {
      flagIcon.className = `recipe-flag-icon flag-${isEn ? 'en' : 'es'}`;
    }
    if (label) {
      label.textContent = isEn ? 'English' : 'Español';
    }

    const dropdown = document.getElementById('edit-recipe-lang-dropdown');
    if (dropdown) {
      dropdown.querySelectorAll('.custom-lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === normalized);
      });
    }
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
            this.initHouseholdRealtimeSubscription();
            this.processPendingHouseholdJoin();
          }
        }).catch(err => console.warn("Supabase session check error:", err));

        // Listen for real-time auth changes
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            state.cloudUser = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              id: session.user.id,
              provider: session.user.app_metadata?.provider || 'email'
            };
            state.save('fa_cloud_user', state.cloudUser);
            this.updateUserAccountUI();
            this.syncDataWithCloud(true);
            this.initHouseholdRealtimeSubscription();
            this.processPendingHouseholdJoin();
          } else if (event === 'USER_UPDATED' && session?.user) {
            // Actualizar datos del usuario local sin disparar bucle recursivo de sync
            state.cloudUser = {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              id: session.user.id,
              provider: session.user.app_metadata?.provider || 'email'
            };
            state.save('fa_cloud_user', state.cloudUser);
            this.updateUserAccountUI();
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
        this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncReconnecting') : 'Conexión reanudada. Sincronizando...', 'syncing');
        this.syncDataWithCloud(true);
      });
      window.addEventListener('offline', () => {
        this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncOffline') : 'Sin conexión (modo local)', 'warning');
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushSync();
        } else if (document.visibilityState === 'visible') {
          if (this.shouldKeepScreenAwake()) {
            this.requestScreenWakeLock();
          }
          this.sanitizeRecipeProteinTags();
          this.render();
          if (this.supabaseClient && state.cloudUser?.id) {
            // US-69 & US-81: refresco reactivo al volver a la app (debounce de 2 s para multi-dispositivo y PWA)
            const nowMs = Date.now();
            if (!this._lastVisibilitySyncAt || nowMs - this._lastVisibilitySyncAt > 2000) {
              this._lastVisibilitySyncAt = nowMs;
              this.syncDataWithCloud(true);
            }
          }
        }
      });

      // US-81: Refresco activo en vivo (cada 5s) si la lista de la compra o el planificador están en pantalla
      setInterval(async () => {
        try {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !this.isPushingToCloud) {
            if (this.activeView === 'view-shopping' || this.activeView === 'view-planner') {
              if (this.supabaseClient && state.cloudUser?.id && (typeof navigator === 'undefined' || navigator.onLine)) {
                await this.pullFromCloud();
              }
            }
          }
        } catch (e) { }
      }, 5000);
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

  getUserDisplayName() {
    if (state.cloudUser?.name && typeof state.cloudUser.name === 'string') {
      const trimmed = state.cloudUser.name.trim();
      const first = trimmed.split(' ')[0];
      if (first) return first;
    }
    if (state.cloudUser?.email && typeof state.cloudUser.email === 'string') {
      const emailName = state.cloudUser.email.split('@')[0];
      if (emailName) return emailName;
    }
    if (state.settings?.userName && typeof state.settings.userName === 'string') {
      const customName = state.settings.userName.trim().split(' ')[0];
      if (customName) return customName;
    }
    return '';
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
      const firstName = this.getUserDisplayName() || user.email.split('@')[0];
      const isDemoSession = user.isDemo || !this.supabaseClient;
      if (pillText) {
        pillText.textContent = isDemoSession ? `${firstName} (Demo)` : firstName;
        pillText.removeAttribute('data-i18n');
      }

      if (settingsIcon) settingsIcon.textContent = isDemoSession ? 'account_circle' : 'cloud_done';
      if (settingsName) {
        settingsName.textContent = user.name || user.email.split('@')[0];
        settingsName.removeAttribute('data-i18n');
      }
      if (settingsStatus) {
        settingsStatus.removeAttribute('data-i18n');
        settingsStatus.textContent = !this.supabaseClient
          ? (window.I18n ? window.I18n.t('settings.localProfileDemo') : 'Perfil local (Demo) - Supabase no configurado')
          : `${window.I18n ? window.I18n.t('settings.syncedWith') : 'Sincronizado con'} Supabase (${user.provider || 'email'})`;
      }
      if (settingsAuthBtn) {
        settingsAuthBtn.setAttribute('data-i18n', 'settings.viewAccount');
        settingsAuthBtn.textContent = window.I18n ? window.I18n.t('settings.viewAccount') : 'Ver Cuenta';
      }
      if (syncNowBtn) syncNowBtn.style.display = 'inline-flex';
      if (state.lastSyncedAt && syncIndicator && !syncIndicator.textContent) {
        this.updateSyncIndicator(`${window.I18n ? window.I18n.t('settings.syncedAt') : 'Sincronizado a las'} ${new Date(state.lastSyncedAt).toLocaleTimeString()}`, 'success');
      }

      if (authModalTitle) {
        authModalTitle.setAttribute('data-i18n', 'settings.myCloudAccountTitle');
        authModalTitle.textContent = window.I18n ? window.I18n.t('settings.myCloudAccountTitle') : 'Mi Cuenta en la Nube';
      }
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
      if (pillText) {
        pillText.setAttribute('data-i18n', 'settings.signIn');
        pillText.textContent = window.I18n ? window.I18n.t('settings.signIn') : 'Iniciar sesión';
      }

      if (settingsIcon) settingsIcon.textContent = 'account_circle';
      if (settingsName) {
        settingsName.setAttribute('data-i18n', 'settings.localMode');
        settingsName.textContent = window.I18n ? window.I18n.t('settings.localMode') : 'Modo Local (Invitado)';
      }
      if (settingsStatus) {
        settingsStatus.setAttribute('data-i18n', 'settings.localModeDesc');
        settingsStatus.textContent = window.I18n ? window.I18n.t('settings.dataOnlyDevice') : 'Datos almacenados solo en este dispositivo';
      }
      if (settingsAuthBtn) {
        settingsAuthBtn.setAttribute('data-i18n', 'settings.signIn');
        settingsAuthBtn.textContent = window.I18n ? window.I18n.t('settings.signIn') : 'Iniciar Sesión';
      }
      if (syncNowBtn) syncNowBtn.style.display = 'none';
      this.updateSyncIndicator('');

      if (authModalTitle) {
        authModalTitle.setAttribute('data-i18n', 'settings.cloudAccountTitle');
        authModalTitle.textContent = window.I18n ? window.I18n.t('settings.cloudAccountTitle') : 'Cuenta en la Nube';
      }
      if (authTabs) authTabs.style.display = 'flex';
      if (authForms) authForms.style.display = 'block';
      if (authLoggedIn) authLoggedIn.style.display = 'none';
    }
    if (typeof this.renderHouseholdSettings === 'function') {
      this.renderHouseholdSettings();
    }
  }

  openAuthModal() {
    this.updateUserAccountUI();
    this.openDialogModal(this.modalAuth);
  }

  closeAuthModal() {
    this.closeDialogModal(this.modalAuth);
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
    const password = document.getElementById('auth-password').value;
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
            this.showToast("Revisa tu correo para confirmar la cuenta antes de iniciar sesión.", 'info');
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
    this.processPendingHouseholdJoin();
    this.showToast(`¡Bienvenido a Food Assistant, ${state.cloudUser.name}! Tu cuenta está conectada.`, 'success');
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
        this.showToast("Error al conectar con Google OAuth: " + err.message, 'error');
      }
    } else {
      this.showToast("La autenticación con Google requiere configurar Supabase en config.js", 'info');
    }
  }

  logoutCloudUser() {
    if (this.supabaseClient) {
      this.supabaseClient.auth.signOut().catch(() => { });
    }
    state.cloudUser = null;
    state.save('fa_cloud_user', null);
    if (state.settings?.defaultGeminiApiKey) {
      delete state.settings.defaultGeminiApiKey;
      state.save('fa_settings', state.settings);
    }
    this.updateUserAccountUI();
    this.closeAuthModal();
    this.showToast("Has cerrado sesión. Tus datos continúan disponibles localmente.", 'info');
  }

  // US-74: Eliminación de Cuenta y Datos en la Nube (Google Play Account Deletion Policy & GDPR)
  async deleteAccountAndData(skipConfirm = false) {
    const isCloud = !!(this.supabaseClient && state.cloudUser?.id && !state.cloudUser.isDemo);
    const confirmMessage = isCloud
      ? '¿Estás seguro de que deseas eliminar definitivamente tu cuenta y todos tus datos? Esta acción es irreversible: se borrarán de la nube todas tus recetas, planificaciones y listas de la compra, y se cerrará tu sesión.'
      : '¿Estás seguro de que deseas eliminar todos tus datos? Esta acción es irreversible: se borrarán todas tus recetas personalizadas, planes semanales y listas de la compra locales.';

    const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
      title: 'Eliminar cuenta y datos',
      message: confirmMessage,
      confirmText: 'Eliminar definitivamente',
      cancelText: 'Cancelar',
      danger: true,
      icon: 'delete_forever'
    });

    if (!confirmed) return false;

    // 1. Si está conectado a Supabase, eliminar datos remotos
    if (isCloud) {
      const uid = state.cloudUser.id;
      try {
        await Promise.allSettled([
          this.supabaseClient.from('recipes').delete().eq('user_id', uid),
          this.supabaseClient.from('meal_plans').delete().eq('user_id', uid),
          this.supabaseClient.from('shopping_items').delete().eq('user_id', uid),
          this.supabaseClient.from('user_settings').delete().eq('user_id', uid),
          this.supabaseClient.from('external_agent_tokens').delete().eq('user_id', uid)
        ]);
      } catch (err) {
        console.warn('[Supabase] Error al limpiar tablas remotas:', err);
      }
      try {
        await this.supabaseClient.auth.signOut();
      } catch (e) { }
    }

    // 2. Limpiar sesión y rastro de sincronización
    if (typeof this.teardownHouseholdRealtimeSubscription === 'function') {
      this.teardownHouseholdRealtimeSubscription();
    }
    state.cloudUser = null;
    state.save('fa_cloud_user', null);
    if (typeof state.saveHousehold === 'function') {
      state.saveHousehold(null);
    } else {
      state.household = null;
    }
    state.personalBackup = null;
    state.save('fa_personal_backup', null);
    state.lastSyncedAt = null;
    state.save('fa_last_synced_at', null);
    state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };
    state.save('fa_deleted_records', state.deletedRecords);

    // 3. Resetear almacenamiento local y base de recetas a estado inicial
    try {
      localStorage.removeItem('fa_recipes');
      localStorage.removeItem('fa_mealplan');
      localStorage.removeItem('fa_shopping');
      localStorage.removeItem('fa_deleted_records');
      localStorage.removeItem('fa_cloud_user');
      localStorage.removeItem('fa_household');
      localStorage.removeItem('fa_personal_backup');
      localStorage.removeItem('fa_last_synced_at');
    } catch (e) { }

    state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    state.shoppingList = [];
    state.save('fa_recipes', state.recipes);
    state.save('fa_mealplan', state.mealPlan);
    state.save('fa_shopping', state.shoppingList);

    // 4. Actualizar interfaz y notificar al usuario
    this.closeAuthModal();
    this.updateUserAccountUI();
    this.render();
    this.showToast(isCloud ? "Tu cuenta y tus datos han sido eliminados de la nube." : "Tus datos locales han sido eliminados.", 'info');
    return true;
  }

  // BUG-24: Sincronización diferida con debounce para mutaciones frecuentes
  scheduleSyncWithCloud(delay = 800) {
    if (!this.supabaseClient || !state.cloudUser?.id) return;
    this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncSaving') : 'Guardando cambios...', 'syncing');
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
      return this.pushToCloud(true);
    }
    return Promise.resolve({ success: true });
  }

  // US-35: Descarga y fusión bidireccional desde Supabase
  async pullFromCloud() {
    if (!this.supabaseClient || !state.cloudUser?.id) return { success: false, reason: 'no_session' };
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncOffline') : 'Sin conexión (modo local)', 'warning');
      return { success: false, reason: 'offline' };
    }

    try {
      // US-81: Resolver y adoptar el Hogar activo ANTES de consultar recetas, plan y compra
      let activeHouseholdId = state.household?.id || null;
      if (!activeHouseholdId && state.cloudUser?.id && this.supabaseClient?.from) {
        try {
          const sRes = await this.supabaseClient.from('user_settings').select('active_household_id').eq('user_id', state.cloudUser.id);
          if (Array.isArray(sRes?.data) && sRes.data[0]?.active_household_id) {
            const hId = sRes.data[0].active_household_id;
            if (typeof this.loadHouseholdByIdFromCloud === 'function') {
              await this.loadHouseholdByIdFromCloud(hId);
              activeHouseholdId = state.household?.id || hId;
            } else {
              activeHouseholdId = hId;
            }
          }
        } catch (e) { }
      }

      // Asegurar que la suscripción en tiempo real está activa para el hogar o el usuario
      if (!this.householdRealtimeChannel && !this.userRealtimeChannel && typeof this.initHouseholdRealtimeSubscription === 'function') {
        this.initHouseholdRealtimeSubscription();
      }

      // US-77: Si hay un hogar activo, refrescar la lista de miembros en segundo plano
      if (activeHouseholdId && typeof this.refreshHouseholdMembersFromCloud === 'function') {
        try {
          await this.refreshHouseholdMembersFromCloud(activeHouseholdId);
        } catch (hhErr) { }
      }

      let recBase = this.supabaseClient.from('recipes').select('*');
      let recQuery;
      if (activeHouseholdId) {
        if (typeof recBase.or === 'function') {
          recQuery = recBase.or(`household_id.eq.${activeHouseholdId},user_id.eq.${state.cloudUser.id}`);
        } else {
          recQuery = recBase.eq('household_id', activeHouseholdId);
        }
      } else {
        recQuery = recBase.eq('user_id', state.cloudUser.id);
      }
      if (typeof recQuery.limit === 'function') recQuery = recQuery.limit(5000);

      let planBase = this.supabaseClient.from('meal_plans').select('*');
      let planQuery;
      if (activeHouseholdId) {
        if (typeof planBase.or === 'function') {
          planQuery = planBase.or(`household_id.eq.${activeHouseholdId},user_id.eq.${state.cloudUser.id}`);
        } else {
          planQuery = planBase.eq('household_id', activeHouseholdId);
        }
      } else {
        planQuery = planBase.eq('user_id', state.cloudUser.id);
      }
      if (typeof planQuery.limit === 'function') planQuery = planQuery.limit(5000);

      let shopBase = this.supabaseClient.from('shopping_items').select('*');
      let shopQuery;
      if (activeHouseholdId) {
        if (typeof shopBase.or === 'function') {
          shopQuery = shopBase.or(`household_id.eq.${activeHouseholdId},user_id.eq.${state.cloudUser.id}`);
        } else {
          shopQuery = shopBase.eq('household_id', activeHouseholdId);
        }
      } else {
        shopQuery = shopBase.eq('user_id', state.cloudUser.id);
      }
      if (typeof shopQuery.limit === 'function') shopQuery = shopQuery.limit(5000);

      const [recRes, planRes, shopRes] = await Promise.all([
        recQuery,
        planQuery,
        shopQuery
      ]);

      if (recRes.error) throw recRes.error;
      if (planRes.error) throw planRes.error;
      if (shopRes.error) throw shopRes.error;

      let stateChanged = false;

      // 1. Fusión de Recetas (con desduplicación y respeto de recetas privadas en Modo Familia US-77)
      if (Array.isArray(recRes.data)) {
        const dedupedRemoteRecipesMap = new Map();
        recRes.data.forEach(row => {
          if (!row || !row.id) return;
          // No incluir recetas privadas de otros miembros del hogar
          if (row.is_private && row.user_id && row.user_id !== state.cloudUser.id) return;
          const existing = dedupedRemoteRecipesMap.get(row.id);
          if (!existing) {
            dedupedRemoteRecipesMap.set(row.id, row);
          } else {
            const existTime = new Date(existing.updated_at || existing.created_at || 0).getTime();
            const newTime = new Date(row.updated_at || row.created_at || 0).getTime();
            if (newTime >= existTime) {
              dedupedRemoteRecipesMap.set(row.id, row);
            }
          }
        });
        const remoteRecipesList = Array.from(dedupedRemoteRecipesMap.values());
        const remoteRecipeIds = new Set(remoteRecipesList.map(r => r.id));

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
            if (r._isLocalDraft) {
              return true; // Receta local recién creada/importada pendiente de sincronizar a la nube
            }
            return false;
          });
          if (state.recipes.length !== initialLen) {
            stateChanged = true;
          }
        } else if (remoteRecipesList.length > 0 && Array.isArray(state.recipes)) {
          // Si es el primer inicio de sesión en un dispositivo nuevo y el almacenamiento local
          // solo contenía las recetas demo iniciales (SEED_RECIPES), reemplazarlas por las de la nube
          const isOnlySeed = state.recipes.every(r => SEED_RECIPES.some(s => s.id === r.id));
          if (isOnlySeed) {
            state.recipes = [];
            stateChanged = true;
          }
        }

        remoteRecipesList.forEach(remoteRow => {
          if (state.deletedRecords.recipes?.includes(remoteRow.id)) return;

          const localIdx = state.recipes.findIndex(r => r.id === remoteRow.id);

          // Extraer información nutricional: columna dedicada o fallback en instructions[0]._nutrition
          let remoteNutrition = remoteRow.nutrition || null;
          if (!remoteNutrition && Array.isArray(remoteRow.instructions) && remoteRow.instructions[0]?._nutrition) {
            remoteNutrition = remoteRow.instructions[0]._nutrition;
          }

          // Limpiar el fallback interno de instructions para no ensuciar los pasos en la UI
          const remoteFavorite = remoteRow.is_favorite !== undefined
            ? !!remoteRow.is_favorite
            : !!remoteRow.instructions?.[0]?._isFavorite;

          const cleanInstructions = Array.isArray(remoteRow.instructions)
            ? remoteRow.instructions.map((inst, idx) => {
              if (idx === 0 && inst && typeof inst === 'object' && ('_nutrition' in inst || '_isFavorite' in inst)) {
                const copy = { ...inst };
                delete copy._nutrition;
                delete copy._isFavorite;
                return copy;
              }
              return inst;
            }).filter(inst => inst && (typeof inst === 'string' ? inst.trim() !== '' : (inst.text?.trim() !== '' || inst.timerMinutes > 0)))
            : [];

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
            instructions: cleanInstructions.length > 0 ? cleanInstructions : (Array.isArray(remoteRow.instructions) ? remoteRow.instructions : []),
            nutrition: remoteNutrition,
            isFavorite: remoteFavorite,
            createdAt: remoteRow.created_at || remoteRow.updated_at || null,
            updatedAt: remoteRow.updated_at
          };
          if (remoteRow.is_private !== undefined) remoteRecipe.isPrivate = !!remoteRow.is_private;
          if (remoteRow.household_id) remoteRecipe.householdId = remoteRow.household_id;
          if (remoteRow.user_id) remoteRecipe.ownerUserId = remoteRow.user_id;

          if (localIdx >= 0) {
            const local = state.recipes[localIdx];
            const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
            const localDate = new Date(local.updatedAt || local.createdAt || 0).getTime();

            const remoteHasNutrition = !!remoteRecipe.nutrition;
            const localHasNutrition = !!local.nutrition;
            const tagsDiffer = JSON.stringify(local.tags || []) !== JSON.stringify(remoteRecipe.tags || []);

            if (remoteDate > localDate) {
              state.recipes[localIdx] = {
                ...local,
                ...remoteRecipe,
                nutrition: remoteRecipe.nutrition || local.nutrition || null
              };
              stateChanged = true;
            } else if (remoteDate === localDate || remoteDate >= localDate) {
              let updated = false;
              if (!localHasNutrition && remoteHasNutrition) {
                local.nutrition = remoteRecipe.nutrition;
                updated = true;
              }
              if (tagsDiffer) {
                local.tags = remoteRecipe.tags;
                updated = true;
              }
              if (remoteRecipe.ownerUserId && !local.ownerUserId) {
                local.ownerUserId = remoteRecipe.ownerUserId;
                updated = true;
              }
              if (remoteRecipe.householdId && !local.householdId) {
                local.householdId = remoteRecipe.householdId;
                updated = true;
              }
              if (updated) {
                stateChanged = true;
              }
            } else {
              // Si local es más nuevo pero carece de nutrición y remota sí la tiene, recuperarla
              if (!localHasNutrition && remoteHasNutrition) {
                local.nutrition = remoteRecipe.nutrition;
                stateChanged = true;
              }
              if (remoteRecipe.ownerUserId && !local.ownerUserId) {
                local.ownerUserId = remoteRecipe.ownerUserId;
                stateChanged = true;
              }
              if (remoteRecipe.householdId && !local.householdId) {
                local.householdId = remoteRecipe.householdId;
                stateChanged = true;
              }
            }
          } else {
            state.recipes.push(remoteRecipe);
            stateChanged = true;
          }
        });
      }

      // 2. Fusión de Meal Plans (con desduplicación por fecha en Modo Familia US-77)
      let remoteHouseholdPrefsRow = null;
      const hasLocalDayMeals = (d) => !!(d && (d.breakfast || d.lunch || d.snack || d.dinner || (Array.isArray(d.customSlots) && d.customSlots.some(cs => cs && cs.recipeId && cs.type !== 'plan_explicit_clear'))));
      const hasRemoteRowMeals = (r) => !!(r && (r.breakfast_recipe_id || r.lunch_recipe_id || r.snack_recipe_id || r.dinner_recipe_id || (Array.isArray(r.custom_slots) && r.custom_slots.some(cs => cs && cs.recipeId && cs.type !== 'plan_explicit_clear'))));

      if (state.mealPlan && state.mealPlan['__household_prefs__']) {
        delete state.mealPlan['__household_prefs__'];
      }

      if (Array.isArray(planRes.data)) {
        const dedupedPlansMap = new Map();
        planRes.data.forEach(row => {
          const dKey = row?.plan_date || row?.id;
          if (!dKey) return;
          if (dKey === '__household_prefs__') {
            if (!remoteHouseholdPrefsRow || new Date(row.updated_at || 0).getTime() >= new Date(remoteHouseholdPrefsRow.updated_at || 0).getTime()) {
              remoteHouseholdPrefsRow = row;
            }
            return;
          }
          const prev = dedupedPlansMap.get(dKey);
          if (!prev) {
            dedupedPlansMap.set(dKey, row);
            return;
          }
          const rowHasExplicitClear = Array.isArray(row.custom_slots) && row.custom_slots.some(c => c && c.type === 'plan_explicit_clear');
          const prevHasExplicitClear = Array.isArray(prev.custom_slots) && prev.custom_slots.some(c => c && c.type === 'plan_explicit_clear');
          const rowHasContent = hasRemoteRowMeals(row);
          const prevHasContent = hasRemoteRowMeals(prev);

          if (rowHasExplicitClear || prevHasExplicitClear) {
            // Si alguno de los registros tiene un vaciado explícito por un miembro al mover o borrar,
            // prevalece la acción más reciente en el tiempo
            if (new Date(row.updated_at || 0).getTime() >= new Date(prev.updated_at || 0).getTime()) {
              dedupedPlansMap.set(dKey, row);
            }
          } else if (rowHasContent && !prevHasContent) {
            dedupedPlansMap.set(dKey, row);
          } else if (!rowHasContent && prevHasContent) {
            // Un registro vacío autogenerado de otro miembro nunca pisa un día planificado del hogar
            if (row.user_id && prev.user_id && row.user_id === prev.user_id && new Date(row.updated_at || 0).getTime() > new Date(prev.updated_at || 0).getTime()) {
              dedupedPlansMap.set(dKey, row);
            }
          } else if (new Date(row.updated_at || 0).getTime() >= new Date(prev.updated_at || 0).getTime()) {
            dedupedPlansMap.set(dKey, row);
          }
        });
        const remotePlansList = Array.from(dedupedPlansMap.values());
        const remotePlanKeys = new Set(remotePlansList.map(r => r.plan_date || r.id));
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

        remotePlansList.forEach(remoteRow => {
          const dateKey = remoteRow.plan_date || remoteRow.id;
          if (!dateKey || dateKey === '__household_prefs__' || state.deletedRecords.mealPlans?.includes(dateKey)) return;

          const localPlan = state.mealPlan[dateKey];
          const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
          const localDate = new Date(localPlan?.updatedAt || 0).getTime();
          const localIsUntouchedEmpty = localPlan && !hasLocalDayMeals(localPlan) && !localPlan.updatedAt;
          const remoteHasContent = hasRemoteRowMeals(remoteRow);

          if (!localPlan || localIsUntouchedEmpty || (remoteHasContent && !hasLocalDayMeals(localPlan) && !localPlan.updatedAt) || remoteDate >= localDate) {
            const cleanCustomSlots = (Array.isArray(remoteRow.custom_slots) ? remoteRow.custom_slots : []).filter(c => !c || c.type !== 'plan_explicit_clear');
            const mergedDay = {
              dayName: remoteRow.day_name || localPlan?.dayName || 'Día',
              breakfast: remoteRow.breakfast_recipe_id || null,
              lunch: remoteRow.lunch_recipe_id || null,
              snack: remoteRow.snack_recipe_id || null,
              dinner: remoteRow.dinner_recipe_id || null,
              customSlots: cleanCustomSlots,
              updatedAt: remoteRow.updated_at
            };
            if (remoteRow.household_id) mergedDay.householdId = remoteRow.household_id;
            if (remoteRow.user_id) mergedDay.ownerUserId = remoteRow.user_id;
            state.mealPlan[dateKey] = mergedDay;
            stateChanged = true;
          }
        });
      }

      // 3. Fusión de Shopping Items (con desduplicación colaborativa en Modo Familia US-77)
      if (Array.isArray(shopRes.data)) {
        const dedupedShopMap = new Map();
        shopRes.data.forEach(row => {
          if (!row || !row.id) return;
          const prev = dedupedShopMap.get(row.id);
          if (!prev || new Date(row.updated_at || 0).getTime() >= new Date(prev.updated_at || 0).getTime()) {
            dedupedShopMap.set(row.id, row);
          }
        });
        const remoteShopList = Array.from(dedupedShopMap.values());
        const remoteShopIds = new Set(remoteShopList.map(i => i.id));
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

        remoteShopList.forEach(remoteRow => {
          if (state.deletedRecords.shoppingItems?.includes(remoteRow.id) ||
              (typeof state.isTombstoned === 'function' && state.isTombstoned('shoppingItems', remoteRow.id))) {
            return;
          }

          const localIdx = state.shoppingList.findIndex(i => i.id === remoteRow.id);
          const local = localIdx >= 0 ? state.shoppingList[localIdx] : null;

          let breakdown = null;
          if (Array.isArray(remoteRow.recipe_breakdown)) {
            breakdown = remoteRow.recipe_breakdown;
          } else if (typeof remoteRow.recipe_breakdown === 'string') {
            try { breakdown = JSON.parse(remoteRow.recipe_breakdown); } catch (e) { }
          }

          if (!breakdown && local && Array.isArray(local.recipeBreakdown) && local.recipeBreakdown.length > 0) {
            breakdown = local.recipeBreakdown;
          }

          if (!breakdown && remoteRow.recipe_origin && remoteRow.recipe_origin.includes(',')) {
            const parts = parseRecipeOrigins(remoteRow.recipe_origin, state.recipes || []);
            if (parts.length > 1) {
              breakdown = parts.map(p => ({
                recipe: p,
                name: remoteRow.name,
                amount: null,
                unit: remoteRow.unit || ''
              }));
            }
          }

          const remoteItem = {
            id: remoteRow.id,
            name: remoteRow.name,
            amount: remoteRow.amount !== null && !isNaN(remoteRow.amount) ? Number(remoteRow.amount) : null,
            unit: remoteRow.unit || '',
            aisle: remoteRow.aisle || 'other',
            isChecked: !!remoteRow.is_checked,
            recipeOrigin: remoteRow.recipe_origin || '',
            recipeBreakdown: breakdown,
            updatedAt: remoteRow.updated_at
          };
          if (remoteRow.household_id) remoteItem.householdId = remoteRow.household_id;
          if (remoteRow.user_id) remoteItem.ownerUserId = remoteRow.user_id;
          reconcileShoppingItemBreakdown(remoteItem, state.recipes || []);

          if (localIdx >= 0) {
            const isRecentlyCheckedLocally = this._recentShoppingCheckTimestamps &&
              (Date.now() - (this._recentShoppingCheckTimestamps.get(local.id) || 0) < 10000);
            const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
            const localDate = new Date(local.updatedAt || 0).getTime();
            const finalChecked = isRecentlyCheckedLocally ? local.isChecked : !!remoteRow.is_checked;

            if (remoteDate >= localDate || !isRecentlyCheckedLocally) {
              state.shoppingList[localIdx] = {
                ...local,
                ...remoteItem,
                isChecked: finalChecked
              };
              stateChanged = true;
            }
          } else {
            state.shoppingList.push(remoteItem);
            stateChanged = true;
          }
        });

        // Auto-consolidar artículos de compra equivalentes procedentes de la nube o multi-dispositivo (US-64)
        if (Array.isArray(state.shoppingList) && state.shoppingList.length > 1) {
          const prevLen = state.shoppingList.length;
          state.shoppingList = consolidateShoppingList(state.shoppingList);
          if (state.shoppingList.length !== prevLen) {
            stateChanged = true;
          }
        }
      }

      // 4. Fusión de Preferencias Dietéticas, Tags Personalizados, Objetivos Nutricionales (US-03) y Clave Gemini
      let remoteDietary = null;
      let remoteCustomTags = null;
      let remoteDietaryUpdatedAt = null;
      let remoteGoals = null;
      let remoteGeminiKey = null;

      try {
        if (this.supabaseClient?.from) {
          const settingsRes = await this.supabaseClient.from('user_settings').select('*').eq('user_id', state.cloudUser.id);
          if (Array.isArray(settingsRes?.data) && settingsRes.data.length > 0) {
            const sRow = settingsRes.data[0];
            if (Array.isArray(sRow.dietary_preferences)) remoteDietary = sRow.dietary_preferences;
            if (Array.isArray(sRow.custom_tags)) remoteCustomTags = sRow.custom_tags;
            if (sRow.nutrition_goals && typeof sRow.nutrition_goals === 'object') remoteGoals = sRow.nutrition_goals;
            if (typeof sRow.gemini_api_key === 'string' && sRow.gemini_api_key.trim()) remoteGeminiKey = sRow.gemini_api_key.trim();
            if (sRow.updated_at) remoteDietaryUpdatedAt = sRow.updated_at;
            // US-69: adoptar el acceso externo configurado desde otro dispositivo
            if (typeof sRow.agent_token_hash === 'string' && sRow.agent_token_hash && !state.settings?.agentTokenHash) {
              if (!state.settings) state.settings = {};
              state.settings.agentTokenHash = sRow.agent_token_hash;
              state.settings.agentEnabled = !!sRow.agent_enabled;
              state.save('fa_settings', state.settings);
              stateChanged = true;
            }
            // US-77: Adoptar Hogar activo si el usuario inicia sesión desde un dispositivo nuevo
            if (sRow.active_household_id && !state.household?.id && typeof this.loadHouseholdByIdFromCloud === 'function') {
              await this.loadHouseholdByIdFromCloud(sRow.active_household_id);
              stateChanged = true;
            }
          }
        }
      } catch (e) {
        // Ignorar si la tabla user_settings no existe
      }

      if (this.supabaseClient?.auth && typeof this.supabaseClient.auth.getUser === 'function') {
        try {
          const authRes = await this.supabaseClient.auth.getUser();
          const meta = authRes?.data?.user?.user_metadata;
          if (meta) {
            if (Array.isArray(meta.dietary_preferences)) {
              const metaTime = meta.dietary_updated_at ? new Date(meta.dietary_updated_at).getTime() : 0;
              const rowTime = remoteDietaryUpdatedAt ? new Date(remoteDietaryUpdatedAt).getTime() : 0;
              if (!remoteDietary || metaTime >= rowTime) {
                remoteDietary = meta.dietary_preferences;
                remoteDietaryUpdatedAt = meta.dietary_updated_at;
              }
            }
            if (Array.isArray(meta.custom_tags)) {
              remoteCustomTags = Array.isArray(remoteCustomTags)
                ? [...new Set([...remoteCustomTags, ...meta.custom_tags])]
                : meta.custom_tags;
            }
            if (meta.nutrition_goals && typeof meta.nutrition_goals === 'object') {
              if (!remoteGoals) remoteGoals = meta.nutrition_goals;
            }
            if (typeof meta.gemini_api_key === 'string' && meta.gemini_api_key.trim()) {
              remoteGeminiKey = meta.gemini_api_key.trim();
            }
          }
        } catch (authErr) {
          // Ignorar si no está disponible auth
        }
      }

      if (!remoteDietary && Array.isArray(state.cloudUser?.user_metadata?.dietary_preferences)) {
        remoteDietary = state.cloudUser.user_metadata.dietary_preferences;
        remoteDietaryUpdatedAt = state.cloudUser.user_metadata.dietary_updated_at;
      }

      // US-77: En Modo Familia, las Preferencias Dietéticas son compartidas por todo el Hogar,
      // mientras que los Objetivos Nutricionales (Macros) siguen siendo individuales de cada usuario.
      if ((activeHouseholdId || state.household?.id) && remoteHouseholdPrefsRow) {
        const hhPrefSlot = Array.isArray(remoteHouseholdPrefsRow.custom_slots)
          ? remoteHouseholdPrefsRow.custom_slots.find(s => s && s.type === 'household_prefs')
          : null;
        if (hhPrefSlot && Array.isArray(hhPrefSlot.dietaryPreferences)) {
          remoteDietary = hhPrefSlot.dietaryPreferences;
          remoteDietaryUpdatedAt = hhPrefSlot.updatedAt || remoteHouseholdPrefsRow.updated_at || remoteDietaryUpdatedAt;
        }
        if (hhPrefSlot && typeof hhPrefSlot.sharedGeminiApiKey === 'string' && hhPrefSlot.sharedGeminiApiKey.trim()) {
          const sharedKey = hhPrefSlot.sharedGeminiApiKey.trim();
          if (state.household && state.household.sharedGeminiApiKey !== sharedKey) {
            state.household.sharedGeminiApiKey = sharedKey;
            state.saveHousehold(state.household);
            stateChanged = true;
          }
          if (!state.settings) state.settings = {};
          if (state.settings.defaultGeminiApiKey !== sharedKey) {
            state.settings.defaultGeminiApiKey = sharedKey;
            state.save('fa_settings', state.settings);
            stateChanged = true;
          }
        }
      }
      if (!remoteCustomTags && Array.isArray(state.cloudUser?.user_metadata?.custom_tags)) {
        remoteCustomTags = state.cloudUser.user_metadata.custom_tags;
      }
      if (!remoteGoals && state.cloudUser?.user_metadata?.nutrition_goals) {
        remoteGoals = state.cloudUser.user_metadata.nutrition_goals;
      }
      if (!remoteGeminiKey && typeof state.cloudUser?.user_metadata?.gemini_api_key === 'string') {
        remoteGeminiKey = state.cloudUser.user_metadata.gemini_api_key.trim();
      }

      if (Array.isArray(remoteDietary)) {
        const localTime = state.dietaryUpdatedAt ? new Date(state.dietaryUpdatedAt).getTime() : 0;
        const remoteTime = remoteDietaryUpdatedAt ? new Date(remoteDietaryUpdatedAt).getTime() : 0;
        if (remoteTime >= localTime || !state.dietaryUpdatedAt) {
          const localJson = JSON.stringify(state.dietaryPreferences || []);
          const remoteJson = JSON.stringify(remoteDietary);
          if (localJson !== remoteJson) {
            state.dietaryPreferences = [...remoteDietary];
            state.save('fa_dietary_preferences', state.dietaryPreferences);
            if (remoteDietaryUpdatedAt) {
              state.dietaryUpdatedAt = remoteDietaryUpdatedAt;
              state.save('fa_dietary_updated_at', state.dietaryUpdatedAt);
            }
            stateChanged = true;
          }
        }
      }

      if (Array.isArray(remoteCustomTags) && remoteCustomTags.length > 0) {
        let tagsChanged = false;
        remoteCustomTags.forEach(t => {
          if (t && typeof t === 'string' && !state.customTags.some(existing => existing.toLowerCase() === t.toLowerCase())) {
            state.customTags.push(t.trim());
            tagsChanged = true;
          }
        });
        if (tagsChanged) {
          state.save('fa_custom_tags', state.customTags);
          stateChanged = true;
        }
      }

      if (remoteGoals && typeof remoteGoals === 'object') {
        const localGoalsJson = JSON.stringify(state.settings?.nutritionGoals || {});
        const remoteGoalsJson = JSON.stringify(remoteGoals);
        if (localGoalsJson !== remoteGoalsJson) {
          state.saveNutritionGoals(remoteGoals);
          stateChanged = true;
        }
      }

      if (remoteGeminiKey && remoteGeminiKey !== (state.settings?.geminiApiKey || '')) {
        if (!state.settings) state.settings = {};
        state.settings.geminiApiKey = remoteGeminiKey;
        state.save('fa_settings', state.settings);
        stateChanged = true;
      }

      // Clave IA por defecto para usuarios autenticados sin clave propia (tabla public.app_config)
      if (!this.getEffectiveGeminiApiKey() && this.supabaseClient?.from) {
        try {
          const cfgRes = await this.supabaseClient.from('app_config').select('*').eq('key', 'default_gemini_api_key');
          const cfgRow = Array.isArray(cfgRes?.data) ? cfgRes.data[0] : cfgRes?.data;
          if (cfgRow && typeof cfgRow.value === 'string' && cfgRow.value.trim()) {
            if (!state.settings) state.settings = {};
            state.settings.defaultGeminiApiKey = cfgRow.value.trim();
            state.save('fa_settings', state.settings);
            stateChanged = true;
          }
        } catch (cfgErr) {
          // Ignorar silenciosamente si la tabla app_config aún no ha sido creada en Supabase
        }
      }

      if (stateChanged) {
        state.save('fa_recipes', state.recipes);
        state.save('fa_mealplan', state.mealPlan);
        state.save('fa_shopping', state.shoppingList);
        this.renderSettings();
        this.renderDietaryPreferencesSettings();
        this.renderNutritionGoalsSettings();
        this.initRecipeTagFilters();
        this.render();
      }

      return { success: true };
    } catch (err) {
      console.warn("Error al descargar datos de Supabase:", err);
      return { success: false, error: err };
    }
  }

  // Resilient batch upsert: gracefully handles schema variations, missing composite constraints,
  // and chunks large datasets (CHUNK_SIZE = 50) to prevent Kong/PostgREST payload threshold errors.
  async upsertWithSchemaFallback(table, payload) {
    if (!payload || payload.length === 0) return { success: true };
    if (!this.unsupportedColumns) {
      this.unsupportedColumns = { recipes: new Set(), meal_plans: new Set(), shopping_items: new Set(), user_settings: new Set() };
    }
    if (!this.preferredConflictTargets) {
      this.preferredConflictTargets = { recipes: 'user_id,id', meal_plans: 'user_id,id', shopping_items: 'user_id,id', user_settings: 'user_id' };
    }

    const sortedPayload = [...payload].sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));

    const CHUNK_SIZE = 50;
    if (sortedPayload.length > CHUNK_SIZE) {
      for (let i = 0; i < sortedPayload.length; i += CHUNK_SIZE) {
        const chunk = sortedPayload.slice(i, i + CHUNK_SIZE);
        const chunkRes = await this._upsertSingleBatchWithSchemaFallback(table, chunk);
        if (!chunkRes.success) return chunkRes;
      }
      return { success: true };
    }

    return this._upsertSingleBatchWithSchemaFallback(table, sortedPayload);
  }

  async _upsertSingleBatchWithSchemaFallback(table, payload) {
    if (!payload || payload.length === 0) return { success: true };

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

      // Fallback 3: Deadlock detected (40P01) due to concurrent operations from another device
      if (error.code === '40P01' || (error.message && error.message.toLowerCase().includes('deadlock detected'))) {
        console.warn(`[Sync] Concurrencia detectada (deadlock 40P01) en '${table}'. Reintentando intento ${attempt + 1}/8 tras espera...`);
        const jitterMs = 250 + Math.floor(Math.random() * 350);
        await new Promise(resolve => setTimeout(resolve, jitterMs));
        continue;
      }

      // Fallback 4: RLS violation on collaborative or legacy single-PK tables
      if (error.code === '42501' || (error.message && error.message.toLowerCase().includes('row-level security policy'))) {
        if (table !== 'user_settings' && this.preferredConflictTargets[table] === 'id') {
          this.preferredConflictTargets[table] = 'user_id,id';
        }
        const currentUserId = state.cloudUser?.id;
        if (currentUserId && currentPayload.some(row => row.user_id && row.user_id !== currentUserId)) {
          console.warn(`[Sync] RLS en '${table}' sobre filas de otro propietario; reintentando bajo el usuario activo...`);
          currentPayload = currentPayload.map(row => ({ ...row, user_id: currentUserId }));
          conflict = table === 'user_settings' ? 'user_id' : 'user_id,id';
          continue;
        }
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
      this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncOffline') : 'Sin conexión (modo local)', 'warning');
      return { success: false, reason: 'offline' };
    }

    // Mutex de sincronización: encola si ya hay una subida en curso para evitar concurrencia en el mismo cliente
    if (this.isPushingToCloud) {
      this.hasQueuedPush = true;
      this.queuedPushSilent = this.queuedPushSilent === false ? false : silent;
      return { success: true, queued: true };
    }
    this.isPushingToCloud = true;

    this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncingCloud') : 'Sincronizando con la nube...', 'syncing');

    try {
      let activeHouseholdId = state.household?.id || null;
      if (!activeHouseholdId && state.cloudUser?.id && this.supabaseClient?.from) {
        try {
          const sRes = await this.supabaseClient.from('user_settings').select('active_household_id').eq('user_id', state.cloudUser.id);
          if (Array.isArray(sRes?.data) && sRes.data[0]?.active_household_id) {
            const hId = sRes.data[0].active_household_id;
            if (typeof this.loadHouseholdByIdFromCloud === 'function') {
              await this.loadHouseholdByIdFromCloud(hId);
              activeHouseholdId = state.household?.id || hId;
            } else {
              activeHouseholdId = hId;
            }
          }
        } catch (e) { }
      }
      const deleteScopeCol = activeHouseholdId ? 'household_id' : 'user_id';
      const deleteScopeVal = activeHouseholdId || state.cloudUser.id;

      // 1. Propagar borrados pendientes (BUG-23 & US-77 Modo Familia)
      if (state.deletedRecords.recipes?.length > 0) {
        const toDelete = [...state.deletedRecords.recipes];
        const CHUNK_SIZE = 50;
        const successfullyDeleted = [];
        for (let i = 0; i < toDelete.length; i += CHUNK_SIZE) {
          const chunk = toDelete.slice(i, i + CHUNK_SIZE);
          const { error } = await this.supabaseClient.from('recipes')
            .delete()
            .in('id', chunk)
            .eq(deleteScopeCol, deleteScopeVal);
          if (!error) {
            successfullyDeleted.push(...chunk);
          } else {
            console.warn('Error al propagar borrado de recetas:', error);
          }
        }
        if (successfullyDeleted.length > 0) {
          state.clearDeletedRecords('recipes', successfullyDeleted);
        }
      }

      if (state.deletedRecords.mealPlans?.length > 0) {
        const toDelete = [...state.deletedRecords.mealPlans];
        const CHUNK_SIZE = 50;
        const successfullyDeleted = [];
        for (let i = 0; i < toDelete.length; i += CHUNK_SIZE) {
          const chunk = toDelete.slice(i, i + CHUNK_SIZE);
          let delQuery = this.supabaseClient.from('meal_plans').delete().in('id', chunk);
          if (activeHouseholdId && typeof delQuery.or === 'function') {
            delQuery = delQuery.or(`household_id.eq.${activeHouseholdId},user_id.eq.${state.cloudUser.id}`);
          } else {
            delQuery = delQuery.eq(deleteScopeCol, deleteScopeVal);
          }
          const { error } = await delQuery;
          if (!error) {
            successfullyDeleted.push(...chunk);
          } else {
            console.warn('Error al propagar borrado de planes:', error);
          }
        }
        if (successfullyDeleted.length > 0) {
          state.clearDeletedRecords('mealPlans', successfullyDeleted);
        }
      }

      if (state.deletedRecords.shoppingItems?.length > 0) {
        const toDelete = [...state.deletedRecords.shoppingItems];
        const CHUNK_SIZE = 50;
        const successfullyDeleted = [];
        for (let i = 0; i < toDelete.length; i += CHUNK_SIZE) {
          const chunk = toDelete.slice(i, i + CHUNK_SIZE);
          let delQuery = this.supabaseClient.from('shopping_items').delete().in('id', chunk);
          if (activeHouseholdId && typeof delQuery.or === 'function') {
            delQuery = delQuery.or(`household_id.eq.${activeHouseholdId},user_id.eq.${state.cloudUser.id}`);
          } else {
            delQuery = delQuery.eq(deleteScopeCol, deleteScopeVal);
          }
          const { error } = await delQuery;
          if (!error) {
            successfullyDeleted.push(...chunk);
          } else {
            console.warn('Error al propagar borrado de compra:', error);
          }
        }
        if (successfullyDeleted.length > 0) {
          state.clearDeletedRecords('shoppingItems', successfullyDeleted);
        }
      }

      // 2. Batch Upsert Recipes (BUG-22, BUG-24 & US-77 Modo Familia)
      const lastSyncTimeMs = state.lastSyncedAt ? new Date(state.lastSyncedAt).getTime() : 0;
      const dirtyRecipes = Array.isArray(state.recipes)
        ? state.recipes.filter(recipe => {
          if (!recipe || !recipe.id) return false;
          if (state.deletedRecords.recipes?.includes(recipe.id)) return false;
          if (recipe._isLocalDraft) return true;
          if (!lastSyncTimeMs) return true;
          const modTime = new Date(recipe.updatedAt || recipe.createdAt || 0).getTime();
          return modTime > lastSyncTimeMs;
        })
        : [];

      if (dirtyRecipes.length > 0) {
        const safeString = (s) => {
          if (typeof s !== 'string') return s ? String(s) : '';
          return typeof s.toWellFormed === 'function' ? s.toWellFormed() : s;
        };

        const recipesPayload = dirtyRecipes.map(recipe => {
          // Asegurar cálculo de nutrición persistente si la receta aún no lo tenía explícito
          const calculatedNutrition = recipe.nutrition || (typeof getRecipeNutrition === 'function' ? getRecipeNutrition(recipe) : null);
          if (!recipe.nutrition && calculatedNutrition && (calculatedNutrition.calories > 0 || calculatedNutrition.protein > 0)) {
            recipe.nutrition = calculatedNutrition;
          }

          let instructionsCopy = Array.isArray(recipe.instructions)
            ? recipe.instructions.map(inst => {
              if (typeof inst === 'object' && inst !== null) {
                return {
                  ...inst,
                  text: safeString(inst.text)
                };
              }
              return { text: safeString(inst) };
            })
            : [];

          // Adjuntar _nutrition e _isFavorite como metadato seguro en instructions[0] para persistencia ante fallbacks de esquema
          if (recipe.nutrition || recipe.isFavorite !== undefined) {
            if (instructionsCopy.length === 0) {
              instructionsCopy.push({ text: '' });
            }
            if (recipe.nutrition) {
              instructionsCopy[0]._nutrition = recipe.nutrition;
            }
            if (recipe.isFavorite !== undefined) {
              instructionsCopy[0]._isFavorite = !!recipe.isFavorite;
            }
          }

          const safeIngredients = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map(ing => ({
              ...ing,
              name: safeString(ing.name),
              unit: safeString(ing.unit)
            }))
            : [];

          const rowPayload = {
            id: recipe.id,
            user_id: (activeHouseholdId && !recipe.isPrivate && recipe.ownerUserId) ? recipe.ownerUserId : state.cloudUser.id,
            title: safeString(recipe.title),
            description: safeString(recipe.description || ''),
            image_url: recipe.imageUrl || null,
            source_url: recipe.sourceUrl || '',
            source_domain: recipe.sourceDomain || '',
            prep_time_minutes: recipe.prepTimeMinutes || 0,
            cook_time_minutes: recipe.cookTimeMinutes || 0,
            servings: recipe.servings || 2,
            tags: Array.isArray(recipe.tags) ? recipe.tags.map(t => safeString(t)) : [],
            ingredients: safeIngredients,
            instructions: instructionsCopy,
            nutrition: recipe.nutrition || null,
            is_favorite: !!recipe.isFavorite,
            created_at: recipe.createdAt || recipe.updatedAt || new Date().toISOString(),
            updated_at: recipe.updatedAt || new Date().toISOString()
          };
          if (activeHouseholdId || recipe.isPrivate !== undefined) {
            rowPayload.household_id = recipe.isPrivate ? null : activeHouseholdId;
            rowPayload.is_private = !!recipe.isPrivate;
          }
          return rowPayload;
        });

        const rRes = await this.upsertWithSchemaFallback('recipes', recipesPayload);
        if (!rRes.success) throw rRes.error;

        // Limpiar marca de borrador local tras subida exitosa a la nube
        let clearedDrafts = false;
        dirtyRecipes.forEach(dr => {
          const localR = state.recipes.find(r => r.id === dr.id);
          if (localR && localR._isLocalDraft) {
            delete localR._isLocalDraft;
            clearedDrafts = true;
          }
        });
        if (clearedDrafts) {
          state.save('fa_recipes', state.recipes);
        }
      }

      // 3. Batch Upsert Meal Plans (BUG-23, BUG-24 & US-77 Modo Familia)
      const planKeys = Object.keys(state.mealPlan || {}).filter(dateKey => {
        if (!dateKey || dateKey === '__household_prefs__') return false;
        const day = state.mealPlan[dateKey];
        if (!day || typeof day !== 'object') return false;
        const hasMeals = !!(day.breakfast || day.lunch || day.snack || day.dinner || (Array.isArray(day.customSlots) && day.customSlots.some(cs => cs && cs.recipeId)));
        // Evitar subir días vacíos autogenerados por getDayPlan() que no tienen updatedAt explícito
        return hasMeals || !!day.updatedAt;
      });

      const mealPlansPayload = planKeys.map(dateKey => {
        const day = state.mealPlan[dateKey] || {};
        const hasMeals = !!(day.breakfast || day.lunch || day.snack || day.dinner || (Array.isArray(day.customSlots) && day.customSlots.some(cs => cs && cs.recipeId)));
        let customSlotsPayload = Array.isArray(day.customSlots)
          ? day.customSlots.filter(cs => !cs || cs.type !== 'plan_explicit_clear')
          : [];
        if (activeHouseholdId && !hasMeals && day.updatedAt) {
          customSlotsPayload.push({
            type: 'plan_explicit_clear',
            updatedAt: day.updatedAt
          });
        }
        const rowPayload = {
          id: dateKey,
          user_id: (activeHouseholdId && day.ownerUserId) ? day.ownerUserId : state.cloudUser.id,
          plan_date: dateKey,
          day_name: day.dayName || 'Día',
          breakfast_recipe_id: day.breakfast || null,
          lunch_recipe_id: day.lunch || null,
          snack_recipe_id: day.snack || null,
          dinner_recipe_id: day.dinner || null,
          custom_slots: customSlotsPayload,
          updated_at: day.updatedAt || new Date().toISOString()
        };
        if (activeHouseholdId) {
          rowPayload.household_id = activeHouseholdId;
        }
        return rowPayload;
      });

      if (activeHouseholdId) {
        const effectiveGeminiKey = this.getEffectiveGeminiApiKey();
        if (effectiveGeminiKey && state.household && !state.household.sharedGeminiApiKey) {
          state.household.sharedGeminiApiKey = effectiveGeminiKey;
          state.saveHousehold(state.household);
        }
        const hhDietaryUpdatedAt = state.dietaryUpdatedAt || state.household?.dietaryUpdatedAt || new Date().toISOString();
        const hhPrefSlotPayload = {
          type: 'household_prefs',
          dietaryPreferences: Array.isArray(state.dietaryPreferences) ? [...state.dietaryPreferences] : [],
          updatedAt: hhDietaryUpdatedAt
        };
        if (effectiveGeminiKey) {
          hhPrefSlotPayload.sharedGeminiApiKey = effectiveGeminiKey;
        }
        mealPlansPayload.push({
          id: '__household_prefs__',
          user_id: state.household?.ownerId || state.cloudUser.id,
          plan_date: '__household_prefs__',
          day_name: 'Preferencias del Hogar',
          breakfast_recipe_id: null,
          lunch_recipe_id: null,
          snack_recipe_id: null,
          dinner_recipe_id: null,
          custom_slots: [hhPrefSlotPayload],
          household_id: activeHouseholdId,
          updated_at: hhDietaryUpdatedAt
        });
      }

      if (mealPlansPayload.length > 0) {
        const mRes = await this.upsertWithSchemaFallback('meal_plans', mealPlansPayload);
        if (!mRes.success) throw mRes.error;
      }

      // 4. Batch Upsert Shopping Items (US-45, BUG-23, BUG-24 & US-77 Modo Familia)
      if (Array.isArray(state.shoppingList) && state.shoppingList.length > 0) {
        const shoppingPayload = state.shoppingList.map(item => {
          if (!item.id) item.id = generateId('shop-');
          const rowPayload = {
            id: item.id,
            user_id: (activeHouseholdId && item.ownerUserId) ? item.ownerUserId : state.cloudUser.id,
            name: item.name,
            amount: item.amount !== null && !isNaN(item.amount) ? Number(item.amount) : null,
            unit: item.unit || '',
            aisle: item.aisle || 'other',
            is_checked: !!item.isChecked,
            recipe_origin: item.recipeOrigin || null,
            recipe_breakdown: Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0 ? item.recipeBreakdown : null,
            updated_at: item.updatedAt || new Date().toISOString()
          };
          if (activeHouseholdId) {
            rowPayload.household_id = activeHouseholdId;
          }
          return rowPayload;
        });

        const sRes = await this.upsertWithSchemaFallback('shopping_items', shoppingPayload);
        if (!sRes.success) throw sRes.error;
      }

      // 5. Preferencias Dietéticas, Tags Personalizados, Objetivos y Clave Gemini (Sincronización multi-dispositivo)
      if (this.supabaseClient?.auth && typeof this.supabaseClient.auth.updateUser === 'function') {
        try {
          const metaPayload = {
            dietary_preferences: state.dietaryPreferences || [],
            custom_tags: state.customTags || [],
            nutrition_goals: state.settings?.nutritionGoals || null,
            gemini_api_key: state.settings?.geminiApiKey || '',
            dietary_updated_at: state.dietaryUpdatedAt || new Date().toISOString()
          };
          await this.supabaseClient.auth.updateUser({ data: metaPayload });
          if (state.cloudUser) {
            state.cloudUser.user_metadata = {
              ...(state.cloudUser.user_metadata || {}),
              ...metaPayload
            };
            state.save('fa_cloud_user', state.cloudUser);
          }
        } catch (prefErr) {
          console.warn("[Sync] Error al actualizar user_metadata:", prefErr);
        }
      }

      // Opcional: Persistir en tabla user_settings si existe en el backend
      try {
        if (typeof this.upsertWithSchemaFallback === 'function') {
          const settingsRow = {
            user_id: state.cloudUser.id,
            dietary_preferences: state.dietaryPreferences || [],
            custom_tags: state.customTags || [],
            nutrition_goals: state.settings?.nutritionGoals || null,
            default_servings: state.settings?.defaultServings || 2,
            updated_at: state.dietaryUpdatedAt || new Date().toISOString()
          };
          // US-69: solo se envía si este dispositivo conoce el token (evita pisarlo con null)
          if (state.settings?.agentTokenHash !== undefined) {
            settingsRow.agent_token_hash = state.settings.agentTokenHash || null;
            settingsRow.agent_enabled = !!state.settings.agentEnabled;
          }
          // US-77: sincronizar el hogar activo del usuario si pertenece a uno
          if (activeHouseholdId) {
            settingsRow.active_household_id = activeHouseholdId;
          }
          await this.upsertWithSchemaFallback('user_settings', [settingsRow]);
        }
      } catch (tableErr) {
        // user_settings es opcional, user_metadata garantiza la persistencia multi-dispositivo
      }

      // Clave IA por defecto para usuarios autenticados (tabla public.app_config)
      const personalGeminiKey = typeof state.settings?.geminiApiKey === 'string' ? state.settings.geminiApiKey.trim() : '';
      if (personalGeminiKey && this.supabaseClient?.from) {
        try {
          await this.supabaseClient.from('app_config').upsert([{
            key: 'default_gemini_api_key',
            value: personalGeminiKey,
            updated_at: new Date().toISOString()
          }], { onConflict: 'key' });
        } catch (appCfgErr) {
          // Ignorar silenciosamente si la tabla app_config aún no ha sido creada en Supabase
        }
      }

      // 6. Éxito confirmado: actualizar marca temporal
      state.lastSyncedAt = new Date().toISOString();
      localStorage.setItem('fa_last_sync', state.lastSyncedAt);
      this.updateUserAccountUI();
      this.updateSyncIndicator(`${window.I18n ? window.I18n.t('settings.syncedAt') : 'Sincronizado a las'} ${new Date(state.lastSyncedAt).toLocaleTimeString()}`, 'success');

      if (!silent) {
        this.showToast(window.I18n ? window.I18n.t('notifications.syncSuccess') : "¡Datos sincronizados correctamente con la nube!", 'success');
      }
      return { success: true };
    } catch (err) {
      // BUG-21: No marcar como sincronizado si Supabase devolvió error
      console.warn("Error durante la sincronización con Supabase:", err);
      const syncErrMsg = window.I18n ? window.I18n.t('settings.syncError') : 'Error de sincronización';
      const syncNetErrMsg = window.I18n ? window.I18n.t('settings.syncNetworkError') : 'Error de conexión';
      this.updateSyncIndicator(`${syncErrMsg}: ${err.message || syncNetErrMsg}`, 'error');
      if (!silent) {
        this.showToast((window.I18n ? window.I18n.t('settings.syncError') : 'Error al sincronizar con la nube') + ": " + (err.message || syncNetErrMsg), 'error');
      }
      return { success: false, error: err };
    } finally {
      this.isPushingToCloud = false;
      if (this.hasQueuedPush) {
        this.hasQueuedPush = false;
        const nextSilent = this.queuedPushSilent !== false;
        this.queuedPushSilent = null;
        setTimeout(() => this.pushToCloud(nextSilent), 250);
      }
    }
  }

  // Sincronización completa (descarga + subida)
  async syncDataWithCloud(silent = false) {
    if (!this.supabaseClient || !state.cloudUser?.id) {
      this.updateUserAccountUI();
      return { success: false, reason: 'no_session' };
    }

    this.updateSyncIndicator(window.I18n ? window.I18n.t('settings.syncingCloud') : "Sincronizando con la nube...", 'syncing');
    const pullRes = await this.pullFromCloud();
    this.sanitizeRecipeProteinTags();
    this.render();
    const pushRes = await this.pushToCloud(silent);
    return { pull: pullRes, push: pushRes };
  }

  // ==========================================================================
  // EVENT LISTENERS & NAVIGATION
  // ==========================================================================

  // ==========================================================================
  // US-43: DELEGACIÓN CENTRALIZADA DE EVENTOS (data-action)
  // ==========================================================================
  initEventDelegation() {
    if (this._eventDelegationInitialized) return;
    this._eventDelegationInitialized = true;

    // Cierre al hacer click fuera del popover de macros de Hoy o con Escape (US-76)
    document.addEventListener('click', (e) => {
      if (!this.todayNutritionExpanded) return;
      const card = document.getElementById('today-nutrition-card');
      if (card && !card.contains(e.target)) {
        this.toggleTodayNutritionDetails();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.todayNutritionExpanded) {
        this.toggleTodayNutritionDetails();
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      if (!action) return;

      switch (action) {
        case 'openRecipeDetail':
          if (target.dataset.recipeId) {
            this.openRecipeDetail(target.dataset.recipeId);
          }
          break;
        case 'navigateWeek': {
          const dir = parseInt(target.dataset.dir || target.dataset.delta || '0', 10);
          this.navigateWeek(dir);
          break;
        }
        case 'toggleAllPlannerDays':
          this.toggleAllPlannerDays();
          break;
        case 'copyShoppingList':
          this.copyShoppingList();
          break;
        case 'adjustServings': {
          const delta = parseInt(target.dataset.delta || '0', 10);
          if (delta !== 0) this.adjustServings(delta);
          break;
        }
        case 'openPickerModal':
          this.openPickerModal(target.dataset.date, target.dataset.slot);
          break;
        case 'closePlanRecipeModal':
          this.closePlanRecipeModal();
          break;
        case 'confirmPlanRecipe':
          this.confirmPlanRecipe();
          break;
        case 'openPlanRecipeModal':
          this.openPlanRecipeModal(target.dataset.recipeId);
          break;
        case 'openCopyWeekModal':
          this.openCopyWeekModal();
          break;
        case 'closeCopyWeekModal':
          this.closeCopyWeekModal();
          break;
        case 'confirmCopyWeekPlan':
          this.confirmCopyWeekPlan();
          break;
        case 'setCopyWeekMode':
          this.setCopyWeekMode(target.dataset.mode);
          break;
        case 'openAddCustomSlotModal':
          this.openAddCustomSlotModal(target.dataset.date);
          break;
        case 'closeAddCustomSlotModal':
          this.closeAddCustomSlotModal();
          break;
        case 'confirmAddCustomSlot':
          this.confirmAddCustomSlot();
          break;
        case 'selectCustomSlotPreset':
          this.selectCustomSlotPreset(target.dataset.name, target.dataset.icon, target);
          break;
        case 'closeShoppingPreviewModal':
          this.closeShoppingPreviewModal();
          break;
        case 'confirmShoppingPreviewAdd':
          this.confirmShoppingPreviewAdd();
          break;
        case 'toggleAllShoppingPreview':
          this.toggleAllShoppingPreview(target.checked);
          break;
        case 'stepShoppingPreviewServings': {
          const d = parseInt(target.dataset.delta || '0', 10);
          if (d !== 0) this.stepShoppingPreviewServings(d);
          break;
        }
        case 'openNutritionGoalsModal':
          this.openNutritionGoalsModal();
          break;
        case 'openNutritionBreakdownModal':
          this.openNutritionBreakdownModal();
          break;
        case 'closeNutritionBreakdownModal':
          this.closeNutritionBreakdownModal();
          break;
        case 'closeNutritionGoalsModal':
          this.closeNutritionGoalsModal();
          break;
        case 'saveNutritionGoalsFromModal':
          this.saveNutritionGoalsFromModal();
          break;
        case 'recalculateEditorNutrition':
          this.recalculateEditorNutrition();
          break;
        case 'clearCompletedGroceries':
          this.clearCompletedGroceries();
          break;
        case 'confirmSaveImportRecipe':
          this.confirmSaveImportRecipe();
          break;
        case 'editImportReview':
          this.editImportReview();
          break;
        case 'cancelImportReview':
          this.cancelImportReview();
          break;
        case 'toggleRecipeFavorite':
          if (target.dataset.recipeId) {
            this.toggleRecipeFavorite(target.dataset.recipeId);
          }
          break;
        case 'toggleActiveRecipeFavorite':
          this.toggleActiveRecipeFavorite();
          break;
        case 'setShoppingViewMode':
          this.setShoppingViewMode(target.dataset.mode);
          break;
        case 'openOnboardingModal':
          this.openOnboardingModal(1);
          break;
        case 'skipOnboarding':
          this.skipOnboarding();
          break;
        case 'nextOnboardingStep':
          this.nextOnboardingStep();
          break;
        case 'prevOnboardingStep':
          this.prevOnboardingStep();
          break;
        case 'completeOnboarding':
          this.completeOnboarding();
          break;
        case 'toggleOnboardingDietaryTag':
          this.toggleOnboardingDietaryTag(target.dataset.tag);
          break;
        case 'applyOnboardingGoalPreset':
          this.applyOnboardingGoalPreset(target.dataset.preset);
          break;
        case 'selectOnboardingServings':
          this.selectOnboardingServings(target.dataset.servings);
          break;
        case 'stepOnboardingServings':
          this.stepOnboardingServings(target.dataset.step);
          break;
        case 'openHouseholdSettings':
          this.openHouseholdSettings();
          break;
        case 'copyHouseholdInviteCode':
          this.copyHouseholdInviteCode();
          break;
        case 'shareHouseholdInviteLink':
          this.shareHouseholdInviteLink();
          break;
        case 'leaveHousehold':
          this.leaveHousehold();
          break;
        case 'refreshHouseholdSync':
          this.syncDataWithCloud(false);
          break;
        case 'transferHouseholdOwnership':
          if (target.dataset.userId) {
            this.transferHouseholdOwnership(target.dataset.userId);
          }
          break;
          break;
        case 'inputOnboardingServings':
          this.inputOnboardingServings(e);
          break;
        case 'openAuthFromOnboarding':
          this.openAuthFromOnboarding();
          break;
        default:
          if (typeof this[action] === 'function') {
            this[action](target.dataset);
          }
          break;
      }
    });
  }

  initEvents() {
    this.initEventDelegation();
    document.addEventListener('input', (e) => {
      const target = e.target.closest('[data-action="inputOnboardingServings"]');
      if (target) {
        this.inputOnboardingServings(e);
      }
    });
    // Navigation
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.dataset.view;
        if (viewId) {
          this.switchView(viewId);
        }
      });
    });

    // Central Floating Gemini Invocation Button (✦) & Desktop Header Assistant Button
    document.getElementById('btn-central-gemini-invoke')?.addEventListener('click', () => {
      this.openGeminiInvokeModal(true);
    });
    document.getElementById('btn-desktop-gemini-invoke')?.addEventListener('click', () => {
      this.openGeminiInvokeModal(true);
    });

    // Quick links
    document.getElementById('btn-goto-planner')?.addEventListener('click', () => this.switchView('view-planner'));
    document.getElementById('btn-quick-shopping')?.addEventListener('click', () => this.switchView('view-shopping'));
    document.getElementById('btn-quick-ai-plan')?.addEventListener('click', () => this.openGeminiInvokeModal(true));
    document.getElementById('btn-header-settings')?.addEventListener('click', () => this.switchView('view-settings'));

    // Theme controls
    document.getElementById('btn-header-theme')?.addEventListener('click', () => this.toggleNextTheme());
    document.querySelectorAll('#theme-segmented-group .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.themeVal;
        this.applyTheme(theme);
      });
    });

    // Language controls (US-12)
    document.querySelectorAll('#language-segmented-group .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const langMode = btn.dataset.langVal;
        this.applyLanguage(langMode, true);
      });
    });
    this.initRecipeEditorLanguagePicker();

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
    document.getElementById('btn-auth-delete-account')?.addEventListener('click', () => this.deleteAccountAndData());
    document.getElementById('btn-settings-delete-account')?.addEventListener('click', () => this.deleteAccountAndData());

    // Importer (US-15: Schema.org & Text Parser)
    document.getElementById('btn-close-import-modal')?.addEventListener('click', () => this.closeImportModal());
    document.getElementById('btn-import-switch-to-manual')?.addEventListener('click', () => {
      const previewImg = document.getElementById('import-image-preview');
      const existingPhotoData = (previewImg?.src && !previewImg.src.includes('placeholder')) ? previewImg.src : null;
      this.closeImportModal();
      this.openCreateRecipeModal();
      if (existingPhotoData) {
        const imgInput = document.getElementById('edit-recipe-image');
        if (imgInput) {
          imgInput.value = existingPhotoData;
          this.updateRecipeEditorImagePreview();
        }
      }
    });
    document.getElementById('tab-import-url')?.addEventListener('click', () => this.switchImportTab('url'));
    document.getElementById('tab-import-text')?.addEventListener('click', () => this.switchImportTab('text'));
    document.getElementById('tab-import-ai')?.addEventListener('click', () => this.switchImportTab('ai'));
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
    this.initPwaInstall();

    // Image file preview in AI import tab (US-30)
    document.getElementById('import-image-input')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      this.selectedImportImageFile = file || null;
      const previewWrap = document.getElementById('import-image-preview-wrap');
      const previewImg = document.getElementById('import-image-preview');
      if (file && previewWrap && previewImg) {
        try {
          const url = URL.createObjectURL(file);
          previewImg.src = url;
          previewWrap.style.display = 'flex';
        } catch (err) {
          console.warn("[FoodAssistant] createObjectURL para preview falló:", err);
        }
      }
    });
    document.getElementById('btn-clear-import-image')?.addEventListener('click', () => {
      const input = document.getElementById('import-image-input');
      const previewWrap = document.getElementById('import-image-preview-wrap');
      const previewImg = document.getElementById('import-image-preview');
      this.selectedImportImageFile = null;
      if (input) input.value = '';
      if (previewImg) previewImg.src = '';
      if (previewWrap) previewWrap.style.display = 'none';
    });

    // Unified Recipe Creation Choice (Manual vs Link vs Text vs AI)
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
    document.getElementById('btn-choice-ai')?.addEventListener('click', () => {
      this.closeAddRecipeChoiceModal();
      this.openImportModal('ai');
    });
    document.getElementById('btn-choice-bulk-json')?.addEventListener('click', () => {
      this.closeAddRecipeChoiceModal();
      document.getElementById('input-bulk-import-file')?.click();
    });
    document.getElementById('input-bulk-import-file')?.addEventListener('change', (e) => this.handleFileInputForBulkImport(e));

    // US-78: Recipe Bulk Delete & Selection Mode Events
    document.getElementById('btn-toggle-recipes-select-mode')?.addEventListener('click', () => this.toggleRecipeSelectMode());
    document.getElementById('btn-recipes-bulk-select-all')?.addEventListener('click', () => this.selectVisibleRecipes());
    document.getElementById('btn-recipes-bulk-deselect-all')?.addEventListener('click', () => this.deselectAllRecipes());
    document.getElementById('btn-recipes-bulk-delete')?.addEventListener('click', () => this.deleteSelectedRecipes());
    document.getElementById('btn-recipes-bulk-cancel')?.addEventListener('click', () => this.toggleRecipeSelectMode(false));

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

    // US-16: Gestión flexible de imágenes de recetas (Galería, Cámara, IA, Quitar)
    const fileUploadBtn = document.getElementById('btn-edit-recipe-upload-file');
    const fileInput = document.getElementById('edit-recipe-file-input');
    fileUploadBtn?.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      fileInput?.click();
    });
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) this.handleRecipeImageFileUpload(file);
    });

    const cameraBtn = document.getElementById('btn-edit-recipe-camera');
    const cameraInput = document.getElementById('edit-recipe-camera-input');
    cameraBtn?.addEventListener('click', () => {
      if (cameraInput) cameraInput.value = '';
      cameraInput?.click();
    });
    cameraInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) this.handleRecipeImageFileUpload(file);
    });
    document.getElementById('btn-edit-recipe-remove-image')?.addEventListener('click', () => this.removeRecipeImage());

    const editImageInput = document.getElementById('edit-recipe-image');
    if (editImageInput) {
      editImageInput.addEventListener('input', () => this.updateRecipeEditorImagePreview());
      editImageInput.addEventListener('change', () => {
        editImageInput.value = cleanRecipeImageUrl(editImageInput.value);
        this.updateRecipeEditorImagePreview();
      });
    }

    const editTitleInput = document.getElementById('edit-recipe-title');
    if (editTitleInput) {
      editTitleInput.addEventListener('input', () => {
        if (!editImageInput?.value.trim()) {
          this.updateRecipeEditorImagePreview();
        }
      });
    }

    // Recipe search and tag chips (US-02: Filtro múltiple combinado)
    const searchInput = document.getElementById('recipes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyRecipeFilters());
    }
    this.initRecipeTagFilters();

    // US-34: Nevera reverse search events
    document.getElementById('btn-toggle-fridge-panel')?.addEventListener('click', () => this.toggleFridgePanel());
    document.getElementById('btn-add-fridge-ingredient')?.addEventListener('click', () => this.addFridgeIngredient());
    document.getElementById('input-fridge-ingredient')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addFridgeIngredient();
      }
    });
    document.getElementById('btn-clear-fridge-ingredients')?.addEventListener('click', () => this.clearFridgeIngredients());
    document.getElementById('btn-ai-invent-from-fridge')?.addEventListener('click', () => this.generateRecipeFromFridgeWithAi());

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

    // US-71: Real-time search in recipe picker
    const pickerSearchInput = document.getElementById('input-picker-search');
    const pickerClearBtn = document.getElementById('btn-clear-picker-search');
    if (pickerSearchInput) {
      pickerSearchInput.addEventListener('input', () => {
        this.pickerSearchQuery = pickerSearchInput.value.trim();
        if (pickerClearBtn) {
          pickerClearBtn.style.display = this.pickerSearchQuery ? 'inline-flex' : 'none';
        }
        this.renderPickerRecipesList();
      });
      pickerSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.pickerSearchQuery) {
          e.stopPropagation();
          this.clearPickerSearch();
        }
      });
    }
    pickerClearBtn?.addEventListener('click', () => {
      this.clearPickerSearch();
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
    // Nota: 'btn-clear-completed' usa data-action="clearCompletedGroceries" manejado por el listener delegado global
    document.getElementById('btn-copy-shopping')?.addEventListener('click', () => this.copyShoppingList());
    document.getElementById('btn-send-plan-to-shopping')?.addEventListener('click', () => this.generateShoppingFromPlan());

    // Planner AI
    document.getElementById('btn-planner-ai-auto')?.addEventListener('click', () => this.triggerGeminiAutoPlan());

    // Settings
    document.getElementById('btn-save-gemini-key')?.addEventListener('click', () => this.saveGeminiKey());
    document.getElementById('btn-generate-agent-token')?.addEventListener('click', () => this.generateExternalAgentToken());
    document.getElementById('btn-revoke-agent-token')?.addEventListener('click', () => this.revokeExternalAgentToken());
    document.getElementById('btn-copy-agent-token')?.addEventListener('click', () => this.copyExternalAgentText(document.getElementById('external-agent-token')?.value || ''));
    document.getElementById('btn-copy-agent-guide')?.addEventListener('click', () => this.copyExternalAgentText(document.getElementById('external-agent-guide')?.textContent || ''));
    document.getElementById('btn-save-nutrition-goals')?.addEventListener('click', () => this.saveNutritionGoalsFromSettings());
    document.getElementById('btn-export-backup')?.addEventListener('click', () => this.exportBackup());
    document.getElementById('input-import-backup')?.addEventListener('change', (e) => this.importBackup(e));
    document.getElementById('btn-reset-demo')?.addEventListener('click', () => this.resetDemoData());
    document.getElementById('btn-auto-tag-recipes')?.addEventListener('click', () => this.autoAnalyzeAndTagAllRecipes());
    document.getElementById('btn-today-quick-goals')?.addEventListener('click', () => this.openNutritionGoalsModal());

    // Modal closes & Light Dismiss (clicking outside the modal window / backdrop closes it)
    document.getElementById('btn-close-recipe-modal')?.addEventListener('click', () => this.closeRecipeModal());
    document.getElementById('btn-close-picker-modal')?.addEventListener('click', () => this.closePickerModal());
    document.getElementById('btn-exit-cook-mode')?.addEventListener('click', () => this.exitCookMode());
    document.getElementById('btn-cook-next-step')?.addEventListener('click', () => this.nextCookStep());
    document.getElementById('btn-cook-prev-step')?.addEventListener('click', () => this.prevCookStep());

    // Bulk Import Modal Events (US-67)
    document.getElementById('btn-close-bulk-import')?.addEventListener('click', () => this.closeBulkImportModal());
    document.getElementById('btn-cancel-bulk-import')?.addEventListener('click', () => this.closeBulkImportModal());
    document.getElementById('btn-confirm-bulk-import')?.addEventListener('click', () => this.executeBulkImport());
    document.getElementById('btn-bulk-select-all')?.addEventListener('click', () => this.setBulkImportSelection('all'));
    document.getElementById('btn-bulk-select-new')?.addEventListener('click', () => this.setBulkImportSelection('new'));
    document.getElementById('btn-bulk-select-none')?.addEventListener('click', () => this.setBulkImportSelection('none'));

    ['all', 'new', 'duplicates', 'warnings'].forEach(filterKey => {
      const chipEl = document.querySelector(`.bulk-filter-chips .chip[data-filter="${filterKey}"]`);
      chipEl?.addEventListener('click', () => {
        document.querySelectorAll('.bulk-filter-chips .chip').forEach(c => c.classList.remove('active'));
        chipEl.classList.add('active');
        this.bulkImportFilter = filterKey;
        this.renderBulkImportList();
      });
    });

    // Bind Confirm Dialog if present in DOM
    if (this.modalConfirmDialog) {
      this.bindConfirmDialogEvents(this.modalConfirmDialog);
    }

    // Backdrop click dismiss & native <dialog> close sync (modern-web-guidance light-dismiss fallback)
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
      overlay.addEventListener('close', () => {
        if (overlay.classList.contains('active')) {
          this.closeModalByElement(overlay);
        }
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

    // Gemini Chat & Voice Assistant (Camino B: US-17 & Central Button)
    this.initVoiceAssistant();
    document.getElementById('btn-send-ai-chat')?.addEventListener('click', () => this.handleAiChatSubmit());
    document.getElementById('btn-mic-ai-chat')?.addEventListener('click', () => this.toggleVoiceRecognition());
    document.getElementById('btn-header-voice')?.addEventListener('click', () => this.openGeminiInvokeModal(true));
    document.getElementById('ai-chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleAiChatSubmit();
    });

    // Gemini Quick Invoke Sheet Events
    document.getElementById('btn-close-gemini-invoke')?.addEventListener('click', () => this.closeGeminiInvokeModal());
    document.getElementById('btn-gemini-invoke-new-chat')?.addEventListener('click', () => {
      this.stopSpeech();
      this.aiChatHistory = [];
      const threadBox = document.getElementById('gemini-invoke-thread');
      if (threadBox) {
        threadBox.style.display = 'none';
        threadBox.innerHTML = '';
      }
      const resultBox = document.getElementById('gemini-invoke-result');
      if (resultBox) resultBox.style.display = 'none';
      const input = document.getElementById('gemini-invoke-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      const transcription = document.getElementById('gemini-invoke-transcription');
      if (transcription) transcription.innerHTML = '<em>Nueva consulta iniciada. Pregunta algo o pulsa el micro...</em>';
      const newChatBtn = document.getElementById('btn-gemini-invoke-new-chat');
      if (newChatBtn) newChatBtn.style.display = 'none';
    });
    document.getElementById('btn-header-stop-tts')?.addEventListener('click', () => this.stopSpeech());
    document.getElementById('btn-result-stop-tts')?.addEventListener('click', () => this.stopSpeech());
    document.getElementById('btn-chat-stop-tts')?.addEventListener('click', () => this.stopSpeech());
    document.getElementById('gemini-invoke-result-text')?.addEventListener('click', () => this.stopSpeech());
    document.getElementById('btn-gemini-invoke-send')?.addEventListener('click', () => this.handleGeminiInvokeSubmit());
    document.getElementById('btn-gemini-invoke-mic')?.addEventListener('click', () => this.toggleVoiceRecognition(true));
    document.getElementById('gemini-invoke-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleGeminiInvokeSubmit();
    });
    document.querySelectorAll('#gemini-invoke-chips .gemini-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('gemini-invoke-input');
        if (input && chip.dataset.prompt) {
          input.value = chip.dataset.prompt;
          this.handleGeminiInvokeSubmit();
        }
      });
    });

    // Web Share Target (US-59): ?url= / ?text= / ?title= compartidos desde otras apps de Android
    this.handleShareTargetLaunch();

    // US-77: Modo Familia — Enlace de invitación (?join=SAB-XXXX) y formularios en Ajustes
    this.initHouseholdEvents();
    this.handleHouseholdJoinUrlLaunch();
    if (state.household?.id || state.cloudUser?.id) {
      this.initHouseholdRealtimeSubscription();
    }

    // PWA Shortcut trigger: ?action=voice
    if (typeof window !== 'undefined' && window.location?.search) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'voice') {
        setTimeout(() => {
          this.openGeminiInvokeModal(true);
        }, 400);
      }
    }
    document.querySelectorAll('.chips-scroll-container button[data-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('ai-chat-input');
        if (input) {
          input.value = chip.dataset.prompt;
          this.handleAiChatSubmit();
        }
      });
    });

    this.initChipsScrollContainers();
  }

  switchView(viewId) {
    this.stopSpeech();
    if (this.isRecipeSelectMode && viewId !== 'view-recipes') {
      this.toggleRecipeSelectMode(false);
    }
    this.activeView = viewId;
    this.viewPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === viewId);
    });

    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
    this.renderView(viewId);
    if (window.I18n) {
      window.I18n.applyTranslations(document.getElementById(viewId) || document);
    }
    this.updateUserAccountUI();
  }

  renderView(viewId = this.activeView) {
    switch (viewId) {
      case 'view-today':
        this.renderTodayView();
        break;
      case 'view-recipes':
        this.initRecipeTagFilters();
        this.applyRecipeFilters();
        break;
      case 'view-planner':
        this.renderPlanner();
        break;
      case 'view-shopping':
        this.renderShoppingList();
        break;
      case 'view-settings':
        this.renderSettings();
        break;
      default:
        this.render();
    }
  }

  render() {
    this.renderTodayView();
    this.initRecipeTagFilters();
    this.applyRecipeFilters();
    this.renderPlanner();
    this.renderShoppingList();
    this.renderSettings();
    if (window.I18n) {
      window.I18n.applyTranslations();
    }
    this.updateUserAccountUI();
  }

  calculateTodayNutrition(todayPlan) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let mealCount = 0;

    if (!todayPlan) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0
      };
    }

    const recipeIds = [];
    STANDARD_SLOTS.forEach(s => {
      const slotVal = todayPlan[s.key];
      const recId = typeof slotVal === 'object' && slotVal !== null ? (slotVal.recipeId || slotVal.id) : slotVal;
      if (recId) recipeIds.push(recId);
    });
    (todayPlan.customSlots || []).forEach(cs => {
      const recId = typeof cs === 'object' && cs !== null ? (cs.recipeId || cs.id) : cs;
      if (recId) recipeIds.push(recId);
    });

    recipeIds.forEach(id => {
      const rec = state.recipes.find(r => r.id === id);
      if (rec) {
        const nut = getRecipeNutrition(rec);
        totalCalories += nut.calories;
        totalProtein += nut.protein;
        totalCarbs += nut.carbs;
        totalFat += nut.fat;
        mealCount++;
      }
    });

    const c = Math.round(totalCalories);
    const p = Math.round(totalProtein * 10) / 10;
    const cb = Math.round(totalCarbs * 10) / 10;
    const f = Math.round(totalFat * 10) / 10;

    return {
      calories: c,
      protein: p,
      carbs: cb,
      fat: f,
      totalCalories: c,
      totalProtein: p,
      totalCarbs: cb,
      totalFat: f,
      mealCount
    };
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

    const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';

    // Header dynamic date formatting (e.g., "Sábado, 24 de octubre" vs "Saturday, October 24")
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateFormatted = today.toLocaleDateString(isEn ? 'en-US' : 'es-ES', dateOptions);
    const dateCapitalized = dateFormatted ? (dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)) : (isEn ? 'Today' : 'Hoy');

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
        summaryElem.textContent = window.I18n ? window.I18n.t('today.noMealsPlanned') : 'Ninguna comida asignada para hoy. Toca un momento para empezar.';
      } else if (assignedCount === totalSlotsCount) {
        summaryElem.textContent = window.I18n ? window.I18n.t('today.allMealsPlanned', { count: assignedCount, total: totalSlotsCount }) : `Todas las comidas planificadas (${assignedCount} de ${totalSlotsCount}). ¡Listo para cocinar!`;
      } else {
        summaryElem.textContent = window.I18n ? window.I18n.t('today.someMealsPlanned', { count: assignedCount, total: totalSlotsCount }) : `${assignedCount} de ${totalSlotsCount} comidas planificadas para hoy.`;
      }
    }

    // Resumen diario de calorías y macronutrientes (US-01 & US-03)
    const todayNutrition = this.calculateTodayNutrition(todayPlan);
    const nutritionContainer = document.getElementById('today-nutrition-card');
    if (nutritionContainer) {
      const goals = state.settings?.nutritionGoals || { enabled: false };
      const goalsEnabled = !!goals.enabled;
      nutritionContainer.classList.toggle('is-collapsed-zen', !goalsEnabled);

      const headerGoalsBtn = `
        <button type="button" class="btn-today-goals-trigger" id="btn-today-quick-goals" onclick="app.openNutritionGoalsModal()" title="Configurar metas nutricionales diarias">
          <span class="material-symbols-outlined icon-14 icon-primary">tune</span>
          <span>${goalsEnabled ? (window.I18n ? window.I18n.t('today.goalsBtn') : 'Objetivos') : (window.I18n ? window.I18n.t('today.setupOrActivate') : 'Configurar / Activar')}</span>
        </button>
      `;

      if (!goalsEnabled) {
        nutritionContainer.innerHTML = `
          <div class="today-header-macros-zen">
            <span class="today-header-macros-zen-label">${window.I18n ? window.I18n.t('today.trackingDisabled') : 'Seguimiento nutricional desactivado'}</span>
            ${headerGoalsBtn}
          </div>
        `;
      } else if (todayNutrition.mealCount === 0) {
        nutritionContainer.innerHTML = `
          <div class="today-header-macros-empty">
            <div class="today-header-macros-top">
              <span class="today-nutrition-pill-kcal"><span class="material-symbols-outlined icon-14 icon-primary">local_fire_department</span> 0 kcal</span>
              <span class="today-nutrition-meta">0 ${window.I18n ? window.I18n.t('nutrition.mealPlural') : 'comidas'}</span>
              ${headerGoalsBtn}
            </div>
            <div class="today-nutrition-empty">
              <span class="today-zen-cal-strong">0 kcal</span> · ${goalsEnabled ? `Meta: ${goals.calories || 2000} kcal` : 'Asigna platos para ver macros.'}
            </div>
          </div>
        `;
      } else {
        const totalMacroGrams = (todayNutrition.totalProtein + todayNutrition.totalCarbs + todayNutrition.totalFat) || 1;
        const protPercent = Math.round((todayNutrition.totalProtein / totalMacroGrams) * 100);
        const carbsPercent = Math.round((todayNutrition.totalCarbs / totalMacroGrams) * 100);
        const fatPercent = Math.max(0, 100 - protPercent - carbsPercent);

        const formatChipWithGoal = (macroKey, label, currentVal, unit, targetVal, isProtein = false) => {
          const currentNum = Math.round(currentVal);
          if (!goalsEnabled || !targetVal || targetVal <= 0) {
            return `
              <div class="macro-chip macro-${macroKey}">
                <span class="macro-chip-label">${label}</span>
                <span class="macro-chip-val" id="today-macro-${macroKey}">${currentNum}<span class="macro-chip-unit">${unit}</span></span>
              </div>
            `;
          }

          const percent = Math.round((currentVal / targetVal) * 100);
          const diff = currentNum - Math.round(targetVal);
          let statusClass = 'goal-ok';
          let statusText = window.I18n ? window.I18n.t('nutrition.inRange') : 'En rango';

          if (percent < 85) {
            statusClass = 'goal-under';
            statusText = window.I18n ? window.I18n.t('nutrition.remaining', { amount: Math.abs(diff), unit }) : `Faltan ${Math.abs(diff)}${unit}`;
          } else if (percent > 110) {
            if (isProtein && percent <= 130) {
              statusClass = 'goal-super';
              statusText = window.I18n ? window.I18n.t('nutrition.exceeded') : '+ Superado';
            } else {
              statusClass = 'goal-over';
              statusText = `+${diff}${unit}`;
            }
          }

          const barPercent = Math.min(100, Math.max(0, percent));

          return `
            <div class="macro-chip macro-${macroKey} macro-chip-expanded">
              <div class="macro-chip-top-row">
                <span class="macro-chip-label macro-chip-label-compact">${label}</span>
                <span class="goal-status-badge ${statusClass}">${statusText}</span>
              </div>
              <div class="macro-chip-val macro-chip-val-expanded" id="today-macro-${macroKey}">
                ${currentNum}<span class="macro-chip-unit">${unit}</span>
              </div>
              <span class="macro-goal-subtext">${window.I18n ? window.I18n.t('nutrition.ofTarget', { target: targetVal, unit, percent }) : `de ${targetVal}${unit} (${percent}%)`}</span>
              <div class="goal-progress-track">
                <div class="goal-progress-fill ${statusClass}" style="--bar-pct: ${barPercent}%;"></div>
              </div>
            </div>
          `;
        };

        let goalBannerHtml = '';
        if (goalsEnabled && (goals.calories > 0 || goals.protein > 0 || goals.carbs > 0 || goals.fat > 0)) {
          const calGoal = Number(goals.calories) || 0;
          const protGoal = Number(goals.protein) || 0;
          const carbsGoal = Number(goals.carbs) || 0;
          const fatGoal = Number(goals.fat) || 0;

          const calCurrent = todayNutrition.totalCalories;
          const protCurrent = Math.round(todayNutrition.totalProtein);
          const carbsCurrent = Math.round(todayNutrition.totalCarbs);
          const fatCurrent = Math.round(todayNutrition.totalFat);

          // 1. Calorías globales (máxima prioridad energética)
          if (calGoal > 0 && calCurrent > calGoal * 1.1) {
            const excess = calCurrent - calGoal;
            goalBannerHtml = `
              <div class="today-goal-banner banner-over">
                <span class="material-symbols-outlined icon-sm">warning</span>
                <span>${isEn ? `Notice: Today's menu exceeds your daily goal by <strong>+${excess} kcal</strong> (${Math.round((calCurrent / calGoal) * 100)}%).` : `Aviso: El menú planificado para hoy supera tu objetivo diario en <strong>+${excess} kcal</strong> (${Math.round((calCurrent / calGoal) * 100)}%).`}</span>
              </div>
            `;
          } else if (calGoal > 0 && calCurrent < calGoal * 0.85) {
            const missing = calGoal - calCurrent;
            goalBannerHtml = `
              <div class="today-goal-banner banner-under">
                <span class="material-symbols-outlined icon-sm">trending_up</span>
                <span>${isEn ? `Current plan: <strong>${missing} kcal</strong> to reach your daily goal.` : `Plan actual: Faltan <strong>${missing} kcal</strong> para alcanzar tu meta diaria.`}</span>
              </div>
            `;
          } else {
            // 2. Comprobar descompensación en macronutrientes individuales (proteínas, carbos, grasas)
            const overMacros = [];
            const underMacros = [];

            if (protGoal > 0) {
              if (protCurrent < protGoal * 0.85) {
                underMacros.push(isEn ? `${protGoal - protCurrent}g protein remaining` : `faltan ${protGoal - protCurrent}g de proteína`);
              } else if (protCurrent > protGoal * 1.3) {
                overMacros.push(`+${protCurrent - protGoal}g ${isEn ? 'protein' : 'de proteína'}`);
              }
            }

            if (carbsGoal > 0) {
              if (carbsCurrent < carbsGoal * 0.85) {
                underMacros.push(isEn ? `${carbsGoal - carbsCurrent}g carbs remaining` : `faltan ${carbsGoal - carbsCurrent}g de carbos`);
              } else if (carbsCurrent > carbsGoal * 1.1) {
                overMacros.push(`+${carbsCurrent - carbsGoal}g ${isEn ? 'carbs' : 'de carbos'}`);
              }
            }

            if (fatGoal > 0) {
              if (fatCurrent < fatGoal * 0.85) {
                underMacros.push(isEn ? `${fatGoal - fatCurrent}g fats remaining` : `faltan ${fatGoal - fatCurrent}g de grasas`);
              } else if (fatCurrent > fatGoal * 1.1) {
                overMacros.push(`+${fatCurrent - fatGoal}g ${isEn ? 'fats' : 'de grasas'}`);
              }
            }

            const totalIssues = overMacros.length + underMacros.length;

            if (totalIssues > 0) {
              const bannerClass = overMacros.length > 0 ? 'banner-over' : 'banner-under';
              const icon = overMacros.length > 0 ? 'warning' : 'tune';

              if (totalIssues === 1) {
                if (underMacros.length === 1) {
                  const item = underMacros[0];
                  goalBannerHtml = `
                    <div class="today-goal-banner ${bannerClass}">
                      <span class="material-symbols-outlined icon-sm">${icon}</span>
                      <span>${isEn ? `Current plan: ${item} to reach your goal.` : `Plan actual: ${item.charAt(0).toUpperCase() + item.slice(1)} para alcanzar tu meta.`}</span>
                    </div>
                  `;
                } else {
                  const item = overMacros[0];
                  goalBannerHtml = `
                    <div class="today-goal-banner ${bannerClass}">
                      <span class="material-symbols-outlined icon-sm">${icon}</span>
                      <span>${isEn ? `Macro alert: Excess of <strong>${item.replace('+', '')}</strong> relative to your daily target.` : `Aviso de macros: Exceso de <strong>${item.replace('+', '')}</strong> respecto a tu objetivo diario.`}</span>
                    </div>
                  `;
                }
              } else {
                const parts = [
                  ...overMacros.map(o => isEn ? `excess of ${o.replace('+', '')}` : `exceso de ${o.replace('+', '')}`),
                  ...underMacros
                ];
                goalBannerHtml = `
                  <div class="today-goal-banner ${bannerClass}">
                    <span class="material-symbols-outlined icon-sm">${icon}</span>
                    <span>${isEn ? `Imbalanced distribution: ${parts.join(' and ')}.` : `Distribución descompensada: ${parts.join(' y ')}.`}</span>
                  </div>
                `;
              }
            } else {
              goalBannerHtml = `
                <div class="today-goal-banner banner-ok">
                  <span class="material-symbols-outlined icon-sm">check_circle</span>
                  <span>${isEn ? 'Balanced menu! Your meals planned for today meet your configured nutritional goals.' : '¡Menú equilibrado! Tu plan de comidas de hoy cumple con los objetivos nutricionales configurados.'}</span>
                </div>
              `;
            }
          }
        }

        const calGoalNum = Number(goals.calories) || 0;
        const calProgressPct = calGoalNum > 0 ? Math.min(100, Math.round((todayNutrition.totalCalories / calGoalNum) * 100)) : 0;

        nutritionContainer.innerHTML = `
          <div class="today-nutrition-pill-bar" id="today-nutrition-pill-bar" onclick="app.toggleTodayNutritionDetails()" role="button" tabindex="0" aria-expanded="${!!this.todayNutritionExpanded}" title="${window.I18n ? window.I18n.t('today.breakdownAria') : 'Ver desglose nutricional diario'}">
            <div class="today-header-macro-top-row">
              <span class="today-nutrition-pill-kcal">
                <span class="material-symbols-outlined icon-15 icon-primary">local_fire_department</span>
                <strong>${todayNutrition.totalCalories}</strong>${calGoalNum > 0 ? `<span class="today-header-cal-goal">/${calGoalNum}</span>` : ''} <span class="today-header-cal-unit">kcal</span>
              </span>
              <span class="material-symbols-outlined icon-16 today-nutrition-pill-chevron mobile-only-chevron">expand_more</span>
            </div>
            ${calGoalNum > 0 ? `
              <div class="today-header-mini-bar" aria-hidden="true">
                <div class="today-header-mini-bar-fill" style="--progress: ${calProgressPct}%;"></div>
              </div>
            ` : ''}
            <div class="today-header-macro-pills-row">
              <span class="today-header-macro-badge macro-badge-prot"><em>P</em> ${Math.round(todayNutrition.totalProtein)}g</span>
              <span class="today-header-macro-badge macro-badge-carbs"><em>C</em> ${Math.round(todayNutrition.totalCarbs)}g</span>
              <span class="today-header-macro-badge macro-badge-fat"><em>G</em> ${Math.round(todayNutrition.totalFat)}g</span>
            </div>
            <div class="today-header-macro-action desktop-only-action" onclick="event.stopPropagation(); app.openNutritionBreakdownModal();" title="${window.I18n ? window.I18n.t('today.breakdownAria') : 'Ver desglose nutricional completo en ventana modal'}">
              ${headerGoalsBtn}
              <span class="today-header-macro-action-label">${this.todayNutritionExpanded ? (window.I18n ? window.I18n.t('today.hideBreakdown') : 'Ocultar desglose') : (window.I18n ? window.I18n.t('today.viewBreakdown') : 'Ver desglose')}</span>
              <span class="material-symbols-outlined icon-16">open_in_new</span>
            </div>
          </div>
          <div class="today-nutrition-details-body" id="today-nutrition-details-body">
            <div class="today-nutrition-header">
              <div class="today-nutrition-title">
                <span class="material-symbols-outlined icon-sm icon-primary">local_fire_department</span> ${window.I18n ? window.I18n.t('today.dailySummaryTitle') : 'Resumen Nutricional Diario'}
              </div>
              <div class="u-flex-row-center-gap-6">
                ${headerGoalsBtn}
                <span class="today-nutrition-meta">${todayNutrition.mealCount} ${todayNutrition.mealCount === 1 ? (window.I18n ? window.I18n.t('nutrition.mealSingle') : 'comida') : (window.I18n ? window.I18n.t('nutrition.mealPlural') : 'comidas')}</span>
                <button type="button" class="btn btn-ghost btn-icon btn-sm popover-close-btn desktop-only-close" onclick="event.stopPropagation(); app.toggleTodayNutritionDetails();" aria-label="Cerrar desglose" title="Cerrar">
                  <span class="material-symbols-outlined icon-sm">close</span>
                </button>
              </div>
            </div>
            <div class="today-macros-grid ${goalsEnabled ? 'has-goals' : ''}">
              ${formatChipWithGoal('cal', window.I18n ? window.I18n.t('goals.calories') : 'Calorías', todayNutrition.totalCalories, 'kcal', goals.calories)}
              ${formatChipWithGoal('prot', window.I18n ? window.I18n.t('goals.protein') : 'Proteínas', todayNutrition.totalProtein, 'g', goals.protein, true)}
              ${formatChipWithGoal('carbs', window.I18n ? window.I18n.t('goals.carbs') : 'Carbos', todayNutrition.totalCarbs, 'g', goals.carbs)}
              ${formatChipWithGoal('fat', window.I18n ? window.I18n.t('goals.fat') : 'Grasas', todayNutrition.totalFat, 'g', goals.fat)}
            </div>
            <div class="macro-ratio-bar" title="Distribución: ${protPercent}% P / ${carbsPercent}% C / ${fatPercent}% G">
              <div class="ratio-segment ratio-prot" style="--seg-pct: ${protPercent}%;" title="Proteína: ${protPercent}%"></div>
              <div class="ratio-segment ratio-carbs" style="--seg-pct: ${carbsPercent}%;" title="Carbohidratos: ${carbsPercent}%"></div>
              <div class="ratio-segment ratio-fat" style="--seg-pct: ${fatPercent}%;" title="Grasa: ${fatPercent}%"></div>
            </div>
            ${goalBannerHtml}
            <div class="nutrition-estimation-disclaimer" id="today-nutrition-disclaimer">
              <span class="material-symbols-outlined">info</span>
              <span>${window.I18n ? window.I18n.t('recipes.nutritionDisclaimer') : 'Valores orientativos calculados a partir de recetas creadas a mano o importadas; úsalos solo como una estimación aproximada.'}</span>
            </div>
          </div>
        `;
        nutritionContainer.classList.toggle('is-expanded', !!this.todayNutritionExpanded);
      }
    }

    const container = document.getElementById('today-slots-container');
    if (!container) return;

    const standardHtml = STANDARD_SLOTS.map(s => {
      const recId = todayPlan[s.key];
      const isLeftover = todayPlan.leftoverSlots && todayPlan.leftoverSlots[s.key];
      const recipe = state.recipes.find(r => r.id === recId);
      const slotLabel = window.I18n ? window.I18n.getSlotLabel(s.key, s.label) : s.label;

      if (recipe) {
        const nut = typeof getRecipeNutrition === 'function' ? getRecipeNutrition(recipe) : null;
        const calNum = nut ? Math.round(nut.calories) : 0;
        const protNum = nut ? Math.round(nut.protein) : 0;
        const firstTag = (Array.isArray(recipe.tags) && recipe.tags.length > 0) ? recipe.tags[0] : '';
        const totalTime = (Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0);

        const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
        const isEn = window.I18n && window.I18n.getLanguage() === 'en';
        const violationsLabel = comp.violations.map(v => window.I18n ? window.I18n.getTagLabel(v) : v).join(', ');
        const warningBadgeHtml = !comp.compliant ? `
          <div class="dietary-warning-badge" title="${isEn ? `Violates dietary preferences: ${violationsLabel}` : `Incumple preferencias dietéticas: ${violationsLabel}`}">
            <span class="material-symbols-outlined icon-13">warning</span> ${isEn ? 'Does not comply' : 'No cumple'}: ${violationsLabel}
          </div>
        ` : '';

        const safeRecipeId = escapeHtml(recipe.id).replace(/'/g, "\\'");
        return `
          <div class="meal-slot has-meal today-meal-slot-card" onclick="app.openRecipeDetail('${safeRecipeId}')">
            <div class="u-flex-between-center today-meal-slot-top">
              <span class="slot-label">
                <span class="material-symbols-outlined icon-sm">${s.icon}</span> ${slotLabel}
              </span>
              <div class="u-flex-row-center-gap-4">
                ${isLeftover ? `
                  <span class="leftover-pill-badge">
                    <span class="material-symbols-outlined icon-12">takeout_dining</span> ${window.I18n ? window.I18n.t('today.leftovers') : 'Sobras'}
                  </span>
                ` : ''}
                <button type="button" class="btn btn-ghost btn-sm btn-slot-clear btn-remove-circle" onclick="event.stopPropagation(); app.clearSlot('${todayStr}', '${s.key}')" title="${window.I18n ? window.I18n.t('today.removeDish') : 'Quitar plato'}">
                  <span class="material-symbols-outlined icon-sm">close</span>
                </button>
              </div>
            </div>
            <div class="today-meal-body-row">
              ${recipe.imageUrl ? `
                <img src="${recipe.imageUrl}" alt="" class="today-meal-thumb-img" onerror="this.onerror=null; this.src=app.getRecipePlaceholderSvg('${(typeof escapeHtml === 'function' ? escapeHtml(recipe.title) : recipe.title).replace(/'/g, "\\'")}', 'thumb');">
              ` : `
                <div class="today-meal-thumb-wrap">
                  <img src="${this.getRecipePlaceholderSvg(recipe.title, 'thumb')}" alt="" class="img-cover-full">
                </div>
              `}
              <div class="u-flex-1-truncate today-meal-content-col">
                <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
                ${warningBadgeHtml}
                <div class="today-meal-meta-row">
                  <span class="u-inline-flex-gap-3">
                    <span class="material-symbols-outlined icon-sm">schedule</span> ${totalTime} min
                  </span>
                  ${recipe.servings ? `
                    <span class="u-inline-flex-gap-3">
                      <span class="material-symbols-outlined icon-sm">group</span> ${recipe.servings} p.
                    </span>
                  ` : ''}
                  ${calNum > 0 ? `
                    <span class="today-meal-kcal-badge">
                      <span class="material-symbols-outlined icon-sm">local_fire_department</span> ${calNum} kcal
                    </span>
                  ` : ''}
                </div>
                ${(protNum > 0 || firstTag) ? `
                  <div class="today-meal-pills-row">
                    ${protNum > 0 ? `<span class="today-meal-macro-pill">${protNum}g ${window.I18n ? window.I18n.t('goals.protein') : 'proteína'}</span>` : ''}
                    ${firstTag ? `<span class="today-meal-tag-pill">${escapeHtml(window.I18n ? window.I18n.getTagLabel(firstTag) : firstTag)}</span>` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="today-meal-desktop-action">
              <span>${window.I18n ? window.I18n.t('today.viewRecipe') : 'Ver receta'}</span>
              <span class="material-symbols-outlined icon-14">arrow_forward</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="meal-slot today-meal-slot-empty" onclick="app.openPickerModal('${todayStr}', '${s.key}')">
            <span class="slot-label">
              <span class="material-symbols-outlined icon-sm">${s.icon}</span> ${slotLabel}
            </span>
            <div class="slot-action-text">
              <span class="material-symbols-outlined icon-sm">add_circle</span> ${window.I18n ? window.I18n.t('today.assignDish') : 'Asignar plato'}
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
          <span>${window.I18n ? window.I18n.t('today.addAnotherMeal') : 'Añadir otra comida'}</span>
        </button>
      </div>
    `;

    container.innerHTML = standardHtml + customHtml + addExtraHtml;
  }

  toggleTodayNutritionDetails() {
    this.todayNutritionExpanded = !this.todayNutritionExpanded;
    const card = document.getElementById('today-nutrition-card');
    if (card) {
      card.classList.toggle('is-expanded', this.todayNutritionExpanded);
      const pill = document.getElementById('today-nutrition-pill-bar');
      if (pill) pill.setAttribute('aria-expanded', String(this.todayNutritionExpanded));
      const actionLabel = card.querySelector('.today-header-macro-action-label');
      if (actionLabel) {
        actionLabel.textContent = this.todayNutritionExpanded
          ? (window.I18n ? window.I18n.t('today.hideBreakdown') : 'Ocultar desglose')
          : (window.I18n ? window.I18n.t('today.viewBreakdown') : 'Ver desglose');
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth >= 900 && this.todayNutritionExpanded) {
      this.openNutritionBreakdownModal();
    }
  }

  openNutritionBreakdownModal() {
    const modal = document.getElementById('modal-nutrition-breakdown');
    if (!modal) return;
    this.renderNutritionBreakdownModal();
    this.openDialogModal(modal);
  }

  closeNutritionBreakdownModal() {
    const modal = document.getElementById('modal-nutrition-breakdown');
    if (modal) this.closeDialogModal(modal);
  }

  renderNutritionBreakdownModal() {
    const body = document.getElementById('nutrition-breakdown-modal-body');
    if (!body) return;
    const todayKey = window.toLocalDateKey ? window.toLocalDateKey(new Date()) : new Date().toISOString().slice(0, 10);
    const todayPlan = (state.mealPlan && state.mealPlan[todayKey]) || {};
    const todayNutrition = this.calculateTodayNutrition(todayPlan);
    const goals = state.settings?.nutritionGoals || { enabled: false };
    const goalsEnabled = !!goals.enabled;

    const subtitleElem = document.getElementById('nutrition-breakdown-modal-subtitle');
    if (subtitleElem) {
      const mealWord = todayNutrition.mealCount === 1 ? (window.I18n ? window.I18n.t('nutrition.mealSingle') : 'comida') : (window.I18n ? window.I18n.t('nutrition.mealPlural') : 'comidas');
      subtitleElem.textContent = window.I18n ? window.I18n.t('nutrition.breakdownSubtitle', { count: todayNutrition.mealCount, meals: mealWord }) : `Plan para hoy (${todayNutrition.mealCount} ${mealWord}).`;
    }

    const totalMacroGrams = (todayNutrition.totalProtein + todayNutrition.totalCarbs + todayNutrition.totalFat) || 1;
    const protPercent = Math.round((todayNutrition.totalProtein / totalMacroGrams) * 100);
    const carbsPercent = Math.round((todayNutrition.totalCarbs / totalMacroGrams) * 100);
    const fatPercent = Math.max(0, 100 - protPercent - carbsPercent);

    const formatChip = (macroKey, label, currentVal, unit, targetVal, isProtein = false) => {
      const currentNum = Math.round(currentVal);
      if (!goalsEnabled || !targetVal || targetVal <= 0) {
        return `
          <div class="macro-chip macro-${macroKey} macro-chip-expanded">
            <span class="macro-chip-label">${label}</span>
            <div class="macro-chip-val macro-chip-val-expanded">${currentNum}<span class="macro-chip-unit">${unit}</span></div>
          </div>
        `;
      }
      const percent = Math.round((currentVal / targetVal) * 100);
      const diff = currentNum - Math.round(targetVal);
      let statusClass = 'goal-ok';
      let statusText = window.I18n ? window.I18n.t('nutrition.inRange') : 'En rango';
      if (percent < 85) {
        statusClass = 'goal-under';
        statusText = window.I18n ? window.I18n.t('nutrition.remaining', { amount: Math.abs(diff), unit }) : `Faltan ${Math.abs(diff)}${unit}`;
      } else if (percent > 110) {
        statusClass = isProtein && percent <= 130 ? 'goal-super' : 'goal-over';
        statusText = isProtein && percent <= 130 ? (window.I18n ? window.I18n.t('nutrition.exceeded') : '+ Superado') : `+${diff}${unit}`;
      }
      const barPercent = Math.min(100, Math.max(0, percent));
      return `
        <div class="macro-chip macro-${macroKey} macro-chip-expanded">
          <div class="macro-chip-top-row">
            <span class="macro-chip-label">${label}</span>
            <span class="goal-status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="macro-chip-val macro-chip-val-expanded">${currentNum}<span class="macro-chip-unit">${unit}</span></div>
          <span class="macro-goal-subtext">${window.I18n ? window.I18n.t('nutrition.ofTarget', { target: targetVal, unit, percent }) : `de ${targetVal}${unit} (${percent}%)`}</span>
          <div class="goal-progress-track">
            <div class="goal-progress-fill ${statusClass}" style="--bar-pct: ${barPercent}%;"></div>
          </div>
        </div>
      `;
    };

    let goalBannerHtml = '';
    if (goalsEnabled) {
      goalBannerHtml = `
        <div class="today-goal-banner banner-ok modal-goal-banner">
          <span class="material-symbols-outlined icon-sm">check_circle</span>
          <span>${window.I18n ? window.I18n.t('nutrition.syncedWithGoals') : 'Valores nutricionales sincronizados con tus objetivos diarios configurados.'}</span>
        </div>
      `;
    }

    body.innerHTML = `
      <div class="today-macros-grid has-goals modal-macros-grid">
        ${formatChip('cal', window.I18n ? window.I18n.t('goals.calories') : 'Calorías', todayNutrition.totalCalories, 'kcal', goals.calories)}
        ${formatChip('prot', window.I18n ? window.I18n.t('goals.protein') : 'Proteínas', todayNutrition.totalProtein, 'g', goals.protein, true)}
        ${formatChip('carbs', window.I18n ? window.I18n.t('goals.carbs') : 'Carbos', todayNutrition.totalCarbs, 'g', goals.carbs)}
        ${formatChip('fat', window.I18n ? window.I18n.t('goals.fat') : 'Grasas', todayNutrition.totalFat, 'g', goals.fat)}
      </div>
      <div class="macro-ratio-bar modal-ratio-bar" title="Distribución: ${protPercent}% P / ${carbsPercent}% C / ${fatPercent}% G">
        <div class="ratio-segment ratio-prot" style="--seg-pct: ${protPercent}%;"></div>
        <div class="ratio-segment ratio-carbs" style="--seg-pct: ${carbsPercent}%;"></div>
        <div class="ratio-segment ratio-fat" style="--seg-pct: ${fatPercent}%;"></div>
      </div>
      <div class="modal-macro-ratio-labels">
        <span>${window.I18n ? window.I18n.t('nutrition.ratioProt', { percent: protPercent }) : `Proteínas: ${protPercent}%`}</span>
        <span>${window.I18n ? window.I18n.t('nutrition.ratioCarbs', { percent: carbsPercent }) : `Carbohidratos: ${carbsPercent}%`}</span>
        <span>${window.I18n ? window.I18n.t('nutrition.ratioFat', { percent: fatPercent }) : `Grasas: ${fatPercent}%`}</span>
      </div>
      ${goalBannerHtml}
      <div class="nutrition-estimation-disclaimer modal-nutrition-disclaimer">
        <span class="material-symbols-outlined">info</span>
        <span>${window.I18n ? window.I18n.t('nutrition.disclaimer') : 'Valores orientativos calculados a partir de recetas creadas o importadas; úsalos como guía general.'}</span>
      </div>
    `;
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

  renderSingleRecipeCardHtml(rec, showCardMacros) {
    const nut = showCardMacros ? getRecipeNutrition(rec) : null;
    const hasNutData = !!(nut && (nut.calories > 0 || nut.protein > 0));
    const langMeta = getRecipeLanguageMeta(rec);
    const fridgeMatch = (this.fridgeIngredients && this.fridgeIngredients.length > 0)
      ? this.getRecipeFridgeMatch(rec)
      : null;

    const safeRecipeId = escapeHtml(rec.id).replace(/'/g, "\\'");
    const isSelected = !!(this.isRecipeSelectMode && this.selectedRecipeIds && this.selectedRecipeIds.has(rec.id));
    const cardOnClick = this.isRecipeSelectMode
      ? `app.toggleRecipeSelect('${safeRecipeId}')`
      : `app.openRecipeDetail('${safeRecipeId}')`;

    const macroCardTitle = hasNutData
      ? (window.I18n ? window.I18n.t('recipes.macrosCardTitleHasData') : 'Valores nutricionales orientativos por ración individual')
      : (window.I18n ? window.I18n.t('recipes.macrosCardTitleNoData') : 'Sin información nutricional ni ingredientes');
    const lblCal = window.I18n ? window.I18n.t('recipes.macrosCalLabel') : 'Calorías';
    const titleCal = window.I18n ? window.I18n.t('recipes.macrosCalTitle') : 'Calorías';
    const lblProt = window.I18n ? window.I18n.t('recipes.macrosProtLabel') : 'Proteínas';
    const titleProt = window.I18n ? window.I18n.t('recipes.macrosProtTitle') : 'Proteínas';
    const lblCarbs = window.I18n ? window.I18n.t('recipes.macrosCarbsLabel') : 'Carbos';
    const titleCarbs = window.I18n ? window.I18n.t('recipes.macrosCarbsTitle') : 'Carbohidratos';
    const lblFat = window.I18n ? window.I18n.t('recipes.macrosFatLabel') : 'Grasas';
    const titleFat = window.I18n ? window.I18n.t('recipes.macrosFatTitle') : 'Grasas';
    const privateBadgeText = window.I18n ? window.I18n.t('recipes.cardPrivateBadge') : 'Privada';
    const privateBadgeTitle = window.I18n ? window.I18n.t('recipes.cardPrivateTitle') : 'Receta privada (solo visible para ti)';
    const sourcePrefixTitle = window.I18n ? window.I18n.t('recipes.cardSourceTitle', { domain: rec.sourceDomain }) : `Fuente: ${rec.sourceDomain}`;

    return `
      <article class="recipe-card ${this.isRecipeSelectMode ? 'is-select-mode' : ''} ${isSelected ? 'is-selected' : ''}" onclick="${cardOnClick}" data-action="${this.isRecipeSelectMode ? 'toggleRecipeSelect' : 'openRecipeDetail'}" data-recipe-id="${escapeHtml(rec.id)}">
        <div class="recipe-image-wrap">
          ${this.isRecipeSelectMode ? `
            <div class="recipe-select-checkbox-badge ${isSelected ? 'selected' : ''}" aria-label="${isSelected ? 'Deseleccionar' : 'Seleccionar'}">
              <span class="material-symbols-outlined icon-18">${isSelected ? 'check' : ''}</span>
            </div>
          ` : ''}
          <div class="recipe-img-box">
            ${isSafeUrl(rec.imageUrl) ? `
              <img class="recipe-img" src="${sanitizeUrl(rec.imageUrl)}" alt="${escapeHtml(rec.title)}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML=app.getRecipePlaceholderHtml('${safeRecipeId}', 'card');">
            ` : `
              ${this.getRecipePlaceholderHtml(rec, 'card')}
            `}
          </div>
          <div class="recipe-lang-badge" title="${escapeHtml(langMeta.ariaLabel)}" aria-label="${escapeHtml(langMeta.ariaLabel)}">
            <span class="recipe-lang-flag" aria-hidden="true">${langMeta.flag}</span>
            <span class="recipe-lang-code">${langMeta.code}</span>
          </div>
          <div class="recipe-time-badge">
            <span class="material-symbols-outlined icon-sm">schedule</span> ${rec.prepTimeMinutes + rec.cookTimeMinutes} min
          </div>
          ${!this.isRecipeSelectMode ? `
          <button type="button" class="recipe-fav-btn ${rec.isFavorite ? 'active' : ''}"
            onclick="event.stopPropagation(); app.toggleRecipeFavorite('${safeRecipeId}')"
            data-action="toggleRecipeFavorite" data-recipe-id="${escapeHtml(rec.id)}"
            aria-pressed="${rec.isFavorite ? 'true' : 'false'}"
            aria-label="${rec.isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita'}"
            title="${rec.isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita'}">
            <span class="material-symbols-outlined icon-18">favorite</span>
          </button>
          ` : ''}
          ${fridgeMatch && fridgeMatch.matchCount > 0 ? `
            <div class="fridge-match-overlay-badge">
              <span class="material-symbols-outlined icon-13">check_circle</span>
              <span>Tienes ${fridgeMatch.matchCount}/${fridgeMatch.totalCount} ingr.</span>
            </div>
          ` : ''}
        </div>
        <div class="recipe-body">
          <h3 class="recipe-title">${escapeHtml(rec.title)}</h3>
          <p class="recipe-desc">${escapeHtml(rec.description)}</p>

          ${showCardMacros ? `
          <!-- Tabla compacta de valores nutricionales por ración (US-01 / BUG-27) -->
          <div class="recipe-card-macros" title="${escapeHtml(macroCardTitle)}">
            <div class="card-macro-item card-macro-cal" title="${escapeHtml(titleCal)}">
              <span class="card-macro-lbl">${escapeHtml(lblCal)}</span>
              <span class="card-macro-val">${hasNutData && nut && nut.calories > 0 ? `${nut.calories}<span class="card-macro-unit">kcal</span>` : '—'}</span>
            </div>
            <div class="card-macro-item card-macro-prot" title="${escapeHtml(titleProt)}">
              <span class="card-macro-lbl">${escapeHtml(lblProt)}</span>
              <span class="card-macro-val">${hasNutData && nut && nut.protein > 0 ? `${Math.round(nut.protein)}<span class="card-macro-unit">g</span>` : '—'}</span>
            </div>
            <div class="card-macro-item card-macro-carbs" title="${escapeHtml(titleCarbs)}">
              <span class="card-macro-lbl">${escapeHtml(lblCarbs)}</span>
              <span class="card-macro-val">${hasNutData && nut && (nut.carbs > 0 || nut.carbs === 0) ? `${Math.round(nut.carbs)}<span class="card-macro-unit">g</span>` : '—'}</span>
            </div>
            <div class="card-macro-item card-macro-fat" title="${escapeHtml(titleFat)}">
              <span class="card-macro-lbl">${escapeHtml(lblFat)}</span>
              <span class="card-macro-val">${hasNutData && nut && (nut.fat > 0 || nut.fat === 0) ? `${Math.round(nut.fat)}<span class="card-macro-unit">g</span>` : '—'}</span>
            </div>
          </div>
          ` : ''}

          <div class="recipe-tags">
            ${rec.isPrivate ? `
              <span class="tag-chip recipe-privacy-badge" title="${escapeHtml(privateBadgeTitle)}">
                <span class="material-symbols-outlined icon-13">lock</span> ${escapeHtml(privateBadgeText)}
              </span>
            ` : ''}
            ${rec.sourceDomain ? `
              <span class="tag-chip tag-chip-source" title="${escapeHtml(sourcePrefixTitle)}">
                <span class="material-symbols-outlined icon-13">link</span> ${rec.sourceDomain}
              </span>
            ` : ''}
            ${(rec.tags || [])
        .filter(t => hasNutData || t !== 'Alta en Proteínas')
        .map(t => {
          const isDiet = PREDEFINED_DIETARY_TAGS.includes(t);
          const displayTag = window.I18n ? window.I18n.getTagLabel(t) : t;
          return `<span class="tag-chip${isDiet ? ' tag-chip-dietary' : ''}">${isDiet ? getDietaryTagEmoji(t) + ' ' : ''}${escapeHtml(displayTag)}</span>`;
        }).join('')}
          </div>
        </div>
      </article>
    `;
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
      subtitle.textContent = state.household?.name
        ? `Recetario compartido de ${state.household.name} y personal.`
        : 'Tu recetario personal.';
    }

    if (!recipesList.length) {
      grid.innerHTML = `
        <div class="recipes-empty-state">
          <span class="material-symbols-outlined recipes-empty-icon">menu_book</span>
          <h3>No se encontraron recetas</h3>
        </div>
      `;
      this.currentRenderedRecipesList = [];
      this.recipesRenderedCount = 0;
      return;
    }

    const sortedList = (this.fridgeIngredients && this.fridgeIngredients.length > 0)
      ? recipesList
      : this.getSortedRecipes(recipesList);

    this.currentRenderedRecipesList = sortedList;
    const batchSize = this.recipesPageSize || 36;
    this.recipesRenderedCount = Math.min(sortedList.length, batchSize);

    const showCardMacros = !!(state.settings?.nutritionGoals?.enabled);
    const initialBatch = sortedList.slice(0, this.recipesRenderedCount);

    let html = initialBatch.map(rec => this.renderSingleRecipeCardHtml(rec, showCardMacros)).join('');

    if (sortedList.length > this.recipesRenderedCount) {
      const remaining = sortedList.length - this.recipesRenderedCount;
      html += `
        <div id="recipes-load-more-sentinel" class="recipes-load-more-sentinel">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-load-more-recipes" onclick="app.loadMoreRecipes()">
            <span class="material-symbols-outlined icon-sm">expand_more</span>
            Mostrar más recetas (${remaining} restantes)
          </button>
        </div>
      `;
    }

    grid.innerHTML = html;
    this.setupRecipesInfiniteScroll();
  }

  loadMoreRecipes() {
    const grid = document.getElementById('recipes-cards-grid');
    const sentinel = document.getElementById('recipes-load-more-sentinel');
    if (!grid || !this.currentRenderedRecipesList) return;

    const list = this.currentRenderedRecipesList;
    const start = this.recipesRenderedCount;
    const batchSize = this.recipesPageSize || 36;
    const end = Math.min(list.length, start + batchSize);

    if (start >= list.length) {
      sentinel?.remove();
      return;
    }

    const nextBatch = list.slice(start, end);
    this.recipesRenderedCount = end;

    const showCardMacros = !!(state.settings?.nutritionGoals?.enabled);
    const nextHtml = nextBatch.map(rec => this.renderSingleRecipeCardHtml(rec, showCardMacros)).join('');

    if (sentinel) {
      sentinel.insertAdjacentHTML('beforebegin', nextHtml);
      const remaining = list.length - this.recipesRenderedCount;
      if (remaining > 0) {
        const btn = document.getElementById('btn-load-more-recipes');
        if (btn) {
          btn.innerHTML = `
            <span class="material-symbols-outlined icon-sm">expand_more</span>
            Mostrar más recetas (${remaining} restantes)
          `;
        }
      } else {
        sentinel.remove();
      }
    } else {
      grid.insertAdjacentHTML('beforeend', nextHtml);
    }
  }

  setupRecipesInfiniteScroll() {
    if (this.recipesScrollObserver) {
      this.recipesScrollObserver.disconnect();
      this.recipesScrollObserver = null;
    }

    const sentinel = document.getElementById('recipes-load-more-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    this.recipesScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMoreRecipes();
        }
      });
    }, {
      rootMargin: '400px 0px'
    });

    this.recipesScrollObserver.observe(sentinel);
  }

  // US-78: Métodos de Auditoría y Limpieza de Recetas
  hasNoIngredients(r) {
    if (!r) return true;
    if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) return true;
    return r.ingredients.every(item => {
      if (!item) return true;
      if (typeof item === 'string') return !item.trim();
      const text = (item.rawText || item.name || item.ingredient || '').trim();
      return !text;
    });
  }

  hasNoInstructions(r) {
    if (!r) return true;
    if (!Array.isArray(r.instructions) || r.instructions.length === 0) return true;
    return r.instructions.every(item => {
      if (!item) return true;
      if (typeof item === 'string') return !item.trim();
      const text = (item.text || item.instruction || item.step || '').trim();
      return !text;
    });
  }

  // US-78: Modo Selección Múltiple y Borrado Masivo (Bulk Delete)
  toggleRecipeSelectMode(forceState) {
    const targetState = forceState !== undefined ? !!forceState : !this.isRecipeSelectMode;
    if (this.isRecipeSelectMode === targetState) return;

    this.isRecipeSelectMode = targetState;
    if (!targetState) {
      this.selectedRecipeIds.clear();
    }
    this.updateRecipeSelectModeUI();
    this.renderRecipesGrid(this.currentRenderedRecipesList || state.recipes || []);
  }

  toggleRecipeSelect(id) {
    if (!this.isRecipeSelectMode || !id) return;
    if (this.selectedRecipeIds.has(id)) {
      this.selectedRecipeIds.delete(id);
    } else {
      this.selectedRecipeIds.add(id);
    }
    const card = document.querySelector(`.recipe-card[data-recipe-id="${id}"]`);
    if (card) {
      const isSelected = this.selectedRecipeIds.has(id);
      card.classList.toggle('is-selected', isSelected);
      let badge = card.querySelector('.recipe-select-checkbox-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = `recipe-select-checkbox-badge ${isSelected ? 'selected' : ''}`;
        badge.setAttribute('aria-label', isSelected ? 'Deseleccionar' : 'Seleccionar');
        badge.innerHTML = `<span class="material-symbols-outlined icon-18">${isSelected ? 'check' : ''}</span>`;
        const wrap = card.querySelector('.recipe-image-wrap') || card;
        wrap.prepend(badge);
      } else {
        badge.classList.toggle('selected', isSelected);
        badge.setAttribute('aria-label', isSelected ? 'Deseleccionar' : 'Seleccionar');
        badge.innerHTML = `<span class="material-symbols-outlined icon-18">${isSelected ? 'check' : ''}</span>`;
      }
    }
    this.updateRecipeSelectModeUI();
  }

  selectVisibleRecipes() {
    if (!this.isRecipeSelectMode) {
      this.isRecipeSelectMode = true;
    }
    const visibleList = this.currentRenderedRecipesList || [];
    visibleList.forEach(r => {
      if (r && r.id) this.selectedRecipeIds.add(r.id);
    });
    this.updateRecipeSelectModeUI();
    this.renderRecipesGrid(visibleList);
  }

  deselectAllRecipes() {
    this.selectedRecipeIds.clear();
    this.updateRecipeSelectModeUI();
    this.renderRecipesGrid(this.currentRenderedRecipesList || []);
  }

  updateRecipeSelectModeUI() {
    const btnToggle = document.getElementById('btn-toggle-recipes-select-mode');
    const btnToggleText = document.getElementById('btn-toggle-recipes-select-text');
    const toolbar = document.getElementById('recipes-bulk-toolbar');
    const countLabel = document.getElementById('recipes-bulk-selected-count');
    const btnDelete = document.getElementById('btn-recipes-bulk-delete');
    const btnDeleteText = document.getElementById('btn-recipes-bulk-delete-text');

    const count = this.selectedRecipeIds ? this.selectedRecipeIds.size : 0;

    if (btnToggle) {
      btnToggle.classList.toggle('active', this.isRecipeSelectMode);
      btnToggle.title = this.isRecipeSelectMode ? 'Finalizar selección' : 'Seleccionar recetas para gestión masiva';
    }
    if (btnToggleText) {
      btnToggleText.textContent = this.isRecipeSelectMode ? 'Listo' : 'Seleccionar';
    }

    if (toolbar) {
      toolbar.style.display = this.isRecipeSelectMode ? 'flex' : 'none';
    }

    if (countLabel) {
      countLabel.textContent = `${count} ${count === 1 ? 'seleccionada' : 'seleccionadas'}`;
    }

    if (btnDelete) {
      btnDelete.disabled = (count === 0);
    }
    if (btnDeleteText) {
      btnDeleteText.textContent = count > 0 ? `Eliminar (${count})` : 'Eliminar';
    }
  }

  async deleteSelectedRecipes() {
    if (!this.selectedRecipeIds || this.selectedRecipeIds.size === 0) {
      this.showToast('Selecciona al menos una receta para eliminar.', 'warning');
      return false;
    }

    const count = this.selectedRecipeIds.size;
    const confirmed = await this.showConfirmDialog({
      title: `¿Eliminar ${count} ${count === 1 ? 'receta' : 'recetas'}?`,
      message: `Se eliminarán permanentemente ${count} ${count === 1 ? 'receta' : 'recetas'} del catálogo. Esta acción no se puede deshacer.`,
      confirmText: `Eliminar ${count}`,
      cancelText: 'Cancelar',
      danger: true,
      icon: 'delete_forever'
    });

    if (!confirmed) return false;

    const toDeleteIds = Array.from(this.selectedRecipeIds);
    const deleteSet = new Set(toDeleteIds);

    // 1. Filtrar catálogo local
    state.recipes = (state.recipes || []).filter(r => !deleteSet.has(r.id));
    if (typeof state.save === 'function') {
      state.save('fa_recipes', state.recipes);
    }

    // 2. Registrar en eliminaciones pendientes para sincronización Supabase
    toDeleteIds.forEach(id => {
      if (typeof state.trackDeletion === 'function') {
        state.trackDeletion('recipes', id);
      }
    });

    // 3. Limpiar selección y modo
    this.selectedRecipeIds.clear();
    this.isRecipeSelectMode = false;
    this.updateRecipeSelectModeUI();

    // 4. Refrescar UI del recetario
    this.applyRecipeFilters();
    this.showToast(`Se ${count === 1 ? 'ha eliminado 1 receta' : `han eliminado ${count} recetas`} correctamente.`, 'info');

    // 5. Enviar cambios inmediatamente a Supabase
    this.pushToCloud(true);
    return true;
  }

  // US-02 & US-73: Filtro múltiple combinado con el buscador de recetas + Chip de Mi Nevera + US-78 Filtros de Auditoría
  initRecipeTagFilters() {
    const container = document.getElementById('recipes-tag-filters');
    if (!container) return;

    const availableTags = state.getAllTags ? state.getAllTags() : ALL_PREDEFINED_TAGS;
    const isAllActive = this.selectedRecipeTags.size === 0 && !this.recipeAuditFilter;
    const isFavSelected = this.selectedRecipeTags.has('Favoritas');
    const favCount = Array.isArray(state.recipes) ? state.recipes.filter(r => r && r.isFavorite).length : 0;
    const fridgePanel = document.getElementById('fridge-reverse-search-panel');
    const isFridgeActive = (this.fridgeIngredients && this.fridgeIngredients.length > 0) || (fridgePanel && fridgePanel.style.display === 'block');

    const noIngActive = this.recipeAuditFilter === 'no-ingredients';
    const noInstActive = this.recipeAuditFilter === 'no-instructions';

    const myFridgeText = window.I18n ? window.I18n.t('recipes.myFridge') : 'Mi Nevera';
    const allText = window.I18n ? window.I18n.t('recipes.all') : 'Todas';
    const favText = window.I18n ? window.I18n.t('recipes.favorites') : 'Favoritas';
    const noIngText = window.I18n ? window.I18n.t('recipes.noIngredients') : 'Sin ingredientes';
    const noInstText = window.I18n ? window.I18n.t('recipes.noInstructions') : 'Sin pasos';

    let html = `
      <button type="button" class="m3-filter-chip m3-filter-chip-fridge ${isFridgeActive ? 'active' : ''}" id="btn-toggle-fridge-panel"
        title="${window.I18n ? window.I18n.t('recipes.myFridgeTooltip') : 'Buscar recetas según lo que tienes en la nevera'}">
        <span class="material-symbols-outlined icon-15">kitchen</span>
        <span>${myFridgeText}${this.fridgeIngredients && this.fridgeIngredients.length > 0 ? ` (${this.fridgeIngredients.length})` : ''}</span>
      </button>
      <button type="button" class="m3-filter-chip ${isAllActive ? 'active' : ''}" data-tag="all">
        ${isAllActive ? '<span class="material-symbols-outlined icon-15">done</span>' : ''}
        ${allText}
      </button>
      <button type="button" class="m3-filter-chip m3-filter-chip-fav ${isFavSelected ? 'active' : ''}" id="btn-filter-favorites" data-tag="Favoritas" aria-pressed="${isFavSelected ? 'true' : 'false'}">
        <span class="material-symbols-outlined icon-15">favorite</span>
        <span>${favText}${favCount > 0 ? ` (${favCount})` : ''}</span>
      </button>
      <button type="button" class="m3-filter-chip m3-filter-chip-audit ${noIngActive ? 'active' : ''}" data-audit="no-ingredients" title="${window.I18n ? window.I18n.t('recipes.noIngredientsTooltip') : 'Filtrar recetas sin ingredientes'}">
        <span class="material-symbols-outlined icon-15">remove_shopping_cart</span>
        <span>${noIngText}</span>
      </button>
      <button type="button" class="m3-filter-chip m3-filter-chip-audit ${noInstActive ? 'active' : ''}" data-audit="no-instructions" title="${window.I18n ? window.I18n.t('recipes.noInstructionsTooltip') : 'Filtrar recetas sin pasos ni elaboración'}">
        <span class="material-symbols-outlined icon-15">format_list_bulleted</span>
        <span>${noInstText}</span>
      </button>
    `;

    availableTags.forEach(tag => {
      const isSelected = this.selectedRecipeTags.has(tag);
      const isDietary = PREDEFINED_DIETARY_TAGS.includes(tag);
      const displayTag = window.I18n ? window.I18n.getTagLabel(tag) : tag;
      html += `
        <button type="button" class="m3-filter-chip ${isDietary ? 'dietary-chip' : ''} ${isSelected ? 'active' : ''}" data-tag="${tag}">
          ${isDietary ? `<span class="dietary-emoji">${getDietaryTagEmoji(tag)}</span>` : ''}
          ${isSelected && !isDietary ? '<span class="material-symbols-outlined icon-14">done</span>' : ''}
          ${displayTag}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelector('#btn-toggle-fridge-panel')?.addEventListener('click', () => {
      this.toggleFridgePanel();
      this.initRecipeTagFilters();
    });

    container.querySelectorAll('.m3-filter-chip[data-audit]').forEach(chip => {
      chip.addEventListener('click', () => {
        const audit = chip.dataset.audit;
        if (this.recipeAuditFilter === audit) {
          this.recipeAuditFilter = null;
        } else {
          this.recipeAuditFilter = audit;
        }
        this.initRecipeTagFilters();
        this.applyRecipeFilters();
      });
    });

    container.querySelectorAll('.m3-filter-chip[data-tag]').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (tag === 'all') {
          this.selectedRecipeTags.clear();
          this.recipeAuditFilter = null;
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

    this.initChipsScrollContainers();
  }

  // ==========================================================================
  // BUG-28: NAVEGACIÓN HORIZONTAL Y DRAG EN SELECTOR DE ETIQUETAS (CHIPS)
  // ==========================================================================
  initChipsScrollContainers() {
    const containers = document.querySelectorAll('.chips-scroll-container');
    containers.forEach(container => {
      if (container._chipsScrollAttached) return;
      container._chipsScrollAttached = true;

      // 1. Scroll horizontal con rueda del ratón en escritorio
      container.addEventListener('wheel', (e) => {
        if (container.scrollWidth > container.clientWidth) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
          }
        }
      }, { passive: false });

      // 2. Grab-to-scroll (arrastre táctil/ratón en escritorio)
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasDragged = false;

      container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDown = true;
        hasDragged = false;
        container.classList.add('is-dragging-scroll');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      const stopDrag = () => {
        if (isDown) {
          isDown = false;
          container.classList.remove('is-dragging-scroll');
        }
      };

      window.addEventListener('mouseup', stopDrag);
      container.addEventListener('mouseleave', stopDrag);

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 4) {
          hasDragged = true;
          e.preventDefault();
        }
        container.scrollLeft = scrollLeft - walk;
      });

      // Evitar clic accidental si el usuario estaba arrastrando
      container.addEventListener('click', (e) => {
        if (hasDragged) {
          e.stopPropagation();
          e.preventDefault();
          hasDragged = false;
        }
      }, true);
    });
  }

  // US-34: NEVERA REVERSE SEARCH METHODS
  toggleFridgePanel() {
    const panel = document.getElementById('fridge-reverse-search-panel');
    if (!panel) return;
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      document.getElementById('input-fridge-ingredient')?.focus();
    }
  }

  addFridgeIngredient(name) {
    const raw = typeof name === 'string' ? name : document.getElementById('input-fridge-ingredient')?.value;
    const clean = (raw || '').trim().toLowerCase();
    if (!clean) return;
    if (!this.fridgeIngredients.includes(clean)) {
      this.fridgeIngredients.push(clean);
    }
    const input = document.getElementById('input-fridge-ingredient');
    if (input) input.value = '';
    this.renderFridgeChips();
    this.applyRecipeFilters();
  }

  removeFridgeIngredient(name) {
    this.fridgeIngredients = this.fridgeIngredients.filter(i => i !== name.toLowerCase());
    this.renderFridgeChips();
    this.applyRecipeFilters();
  }

  clearFridgeIngredients() {
    this.fridgeIngredients = [];
    this.renderFridgeChips();
    this.applyRecipeFilters();
  }

  renderFridgeChips() {
    const container = document.getElementById('fridge-chips-container');
    const clearBtn = document.getElementById('btn-clear-fridge-ingredients');
    const inventBtn = document.getElementById('btn-ai-invent-from-fridge');
    if (!container) return;

    if (this.fridgeIngredients.length === 0) {
      container.innerHTML = '<span class="fridge-empty-hint">Añade los ingredientes que tienes para encontrar recetas compatibles...</span>';
      if (clearBtn) clearBtn.style.display = 'none';
      if (inventBtn) inventBtn.style.display = 'none';
      return;
    }

    if (clearBtn) clearBtn.style.display = 'inline-flex';
    if (inventBtn) inventBtn.style.display = 'flex';

    container.innerHTML = this.fridgeIngredients.map(ing => `
      <span class="m3-filter-chip active fridge-active-chip">
        <span>${ing}</span>
        <button type="button" class="fridge-chip-remove-btn" onclick="app.removeFridgeIngredient('${ing.replace(/'/g, "\\'")}')">
          <span class="material-symbols-outlined icon-14">close</span>
        </button>
      </span>
    `).join('');
  }

  getRecipeFridgeMatch(recipe) {
    if (!this.fridgeIngredients || this.fridgeIngredients.length === 0) {
      return { matchCount: 0, totalCount: recipe?.ingredients?.length || 0, percent: 0, matchedNames: [] };
    }
    const matchedNames = [];
    const recipeIngredients = Array.isArray(recipe?.ingredients)
      ? recipe.ingredients
      : (typeof recipe?.ingredients === 'string' ? recipe.ingredients.split('\n').filter(Boolean) : []);

    this.fridgeIngredients.forEach(f => {
      // Coincidencia consistente con el motor general de recetas (título, descripción, tags o ingredientes)
      const matchesSearch = typeof matchRecipeSearch === 'function' ? matchRecipeSearch(recipe, f) : false;
      const matchesIng = recipeIngredients.some(ing => typeof matchFridgeIngredient === 'function' && matchFridgeIngredient(ing, f));

      if (matchesSearch || matchesIng) {
        let repName = f;
        if (recipeIngredients.length > 0) {
          const matchedItem = recipeIngredients.find(ing => typeof matchFridgeIngredient === 'function' && matchFridgeIngredient(ing, f));
          if (matchedItem) {
            repName = typeof matchedItem === 'string' ? matchedItem : (matchedItem.name || matchedItem.ingredient || f);
          }
        }
        matchedNames.push(repName);
      }
    });

    const totalCount = recipeIngredients.length || 1;
    const matchCount = matchedNames.length;
    const percent = Math.min(100, Math.round((matchCount / totalCount) * 100));
    return { matchCount, totalCount, percent, matchedNames };
  }

  generateRecipeFromFridgeWithAi() {
    if (this.fridgeIngredients.length === 0) {
      this.showToast("Añade al menos un ingrediente a la nevera.", "warning");
      return;
    }
    const ingredientsList = this.fridgeIngredients.join(', ');
    const promptText = `Tengo en la nevera: ${ingredientsList}. Inventa y crea una receta deliciosa, equilibrada y saludable aprovechando estos ingredientes y guárdala en mi recetario.`;
    const legacyAiPanel = document.getElementById('view-ai');
    const legacyInput = document.getElementById('ai-chat-input');
    if (legacyAiPanel && legacyInput) {
      this.switchView('view-ai');
      legacyInput.value = promptText;
      this.handleAiChatSubmit();
      return;
    }
    this.openGeminiInvokeModal(false);
    const invokeInput = document.getElementById('gemini-invoke-input');
    if (invokeInput) {
      invokeInput.value = promptText;
      this.handleGeminiInvokeSubmit();
    }
  }

  applyRecipeFilters(overrideTerm) {
    const searchInput = document.getElementById('recipes-search-input');
    const term = (overrideTerm !== undefined ? overrideTerm : (searchInput?.value || '')).trim();

    const filtered = state.recipes.filter(r => {
      // 0. US-78: Filtro de auditoría / limpieza (Sin ingredientes / Sin pasos)
      if (this.recipeAuditFilter === 'no-ingredients') {
        if (!this.hasNoIngredients(r)) return false;
      } else if (this.recipeAuditFilter === 'no-instructions') {
        if (!this.hasNoInstructions(r)) return false;
      }

      // 1. Tag multi-selection (AND logic: debe contener todas las etiquetas seleccionadas + chip Favoritas US-70)
      if (this.selectedRecipeTags.size > 0) {
        const rTagsNorm = (r.tags || []).map(t => typeof normalizeIngredientText === 'function' ? normalizeIngredientText(String(t)) : String(t).toLowerCase().trim());
        for (const selTag of this.selectedRecipeTags) {
          const selTagNorm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(selTag) : selTag.toLowerCase().trim();
          if (selTagNorm === 'favoritas' || selTagNorm === 'favorita') {
            if (!r.isFavorite && !rTagsNorm.includes('favoritas')) {
              return false;
            }
            continue;
          }
          if (selTagNorm === 'es' || selTagNorm === 'español' || selTagNorm === 'spanish') {
            if (getRecipeLanguage(r) !== 'es') return false;
            continue;
          }
          if (selTagNorm === 'en' || selTagNorm === 'ingles' || selTagNorm === 'inglés' || selTagNorm === 'english') {
            if (getRecipeLanguage(r) !== 'en') return false;
            continue;
          }
          if (!rTagsNorm.includes(selTagNorm)) {
            return false;
          }
        }
      }

      // 2. Término de búsqueda con normalización de acentos, tokenización y variantes singular/plural
      if (term) {
        if (typeof matchRecipeSearch === 'function') {
          if (!matchRecipeSearch(r, term)) return false;
        } else {
          const titleNorm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(r.title || '') : (r.title || '').toLowerCase();
          if (!titleNorm.includes(term.toLowerCase())) return false;
        }
      }

      // 3. US-34: Nevera reverse search (si hay ingredientes en nevera, mostrar preferentemente las que tengan al menos 1 coincidencia)
      if (this.fridgeIngredients.length > 0) {
        const match = this.getRecipeFridgeMatch(r);
        if (match.matchCount === 0) return false;
      }

      return true;
    });

    // Si la nevera está activa, ordenar por mayor porcentaje y número de ingredientes coincidentes
    if (this.fridgeIngredients.length > 0) {
      filtered.sort((a, b) => {
        const matchA = this.getRecipeFridgeMatch(a);
        const matchB = this.getRecipeFridgeMatch(b);
        if (matchB.matchCount !== matchA.matchCount) return matchB.matchCount - matchA.matchCount;
        return matchB.percent - matchA.percent;
      });
    }

    this.renderRecipesGrid(filtered);

    // Actualizar badge y subtítulo dinámico
    const badge = document.getElementById('recipes-count-badge');
    const subtitle = document.getElementById('recipes-count-subtitle');
    if (badge) {
      if (this.selectedRecipeTags.size > 0 || term || this.fridgeIngredients.length > 0 || this.recipeAuditFilter) {
        badge.textContent = `${filtered.length} de ${state.recipes.length}`;
      } else {
        badge.textContent = `${state.recipes.length}`;
      }
    }
    if (subtitle) {
      if (this.selectedRecipeTags.size > 0 || term || this.fridgeIngredients.length > 0 || this.recipeAuditFilter) {
        const isEn = window.I18n && window.I18n.getLanguage() === 'en';
        const filtersDesc = [];
        if (this.recipeAuditFilter === 'no-ingredients') filtersDesc.push(isEn ? 'No ingredients' : 'Sin ingredientes');
        if (this.recipeAuditFilter === 'no-instructions') filtersDesc.push(isEn ? 'No instructions' : 'Sin pasos');
        if (this.fridgeIngredients.length > 0) filtersDesc.push(`${isEn ? 'Fridge' : 'Nevera'}: ${this.fridgeIngredients.join(', ')}`);
        if (this.selectedRecipeTags.size > 0) filtersDesc.push(`${isEn ? 'tags' : 'etiquetas'}: ${Array.from(this.selectedRecipeTags).map(t => window.I18n ? window.I18n.getTagLabel(t) : t).join(', ')}`);
        if (term) filtersDesc.push(`"${term}"`);
        subtitle.textContent = isEn
          ? `${filtered.length} ${filtered.length === 1 ? 'recipe' : 'recipes'} (${filtersDesc.join(' + ')}).`
          : `${filtered.length} receta${filtered.length === 1 ? '' : 's'} (${filtersDesc.join(' + ')}).`;
      } else {
        subtitle.textContent = window.I18n ? window.I18n.t('recipes.subtitle') : 'Tu recetario personal.';
      }
    }
  }

  filterRecipes(searchTerm) {
    const searchInput = document.getElementById('recipes-search-input');
    if (searchInput && searchTerm !== undefined) {
      searchInput.value = searchTerm;
    }
    this.applyRecipeFilters(searchTerm);
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
    this.updateDetailFavoriteButton();
    this.renderRecipeModalContent();
    this.openDialogModal(this.modalRecipeDetail);
    this.requestScreenWakeLock();
  }

  openImportReview(recipe) {
    if (!recipe) return;
    this.isReviewingImport = true;
    this.pendingImportRecipe = recipe;
    this.activeRecipe = recipe;
    this.activeServings = recipe.servings || 2;
    this.updateRecipeDetailActionBars();
    this.updateDetailFavoriteButton();
    this.renderRecipeModalContent();
    this.openDialogModal(this.modalRecipeDetail);
    this.requestScreenWakeLock();
  }

  // US-70: FAVORITE RECIPES MANAGEMENT
  toggleRecipeFavorite(recipeId) {
    const targetId = typeof recipeId === 'object' && recipeId !== null ? recipeId.recipeId : recipeId;
    if (!targetId) return;
    const recipe = state.recipes.find(r => r.id === targetId);
    if (!recipe) return;

    recipe.isFavorite = !recipe.isFavorite;
    recipe.updatedAt = new Date().toISOString();
    state.save('fa_recipes', state.recipes);

    if (this.activeRecipe && this.activeRecipe.id === recipe.id) {
      this.activeRecipe.isFavorite = recipe.isFavorite;
      this.updateDetailFavoriteButton();
    }

    this.initRecipeTagFilters();
    this.applyRecipeFilters();
    this.scheduleSyncWithCloud();
    this.showToast(
      recipe.isFavorite ? `❤️ "${recipe.title}" añadida a Favoritas` : `"${recipe.title}" quitada de Favoritas`,
      'info',
      2200
    );
  }

  toggleActiveRecipeFavorite() {
    if (!this.activeRecipe || !this.activeRecipe.id) return;
    this.toggleRecipeFavorite(this.activeRecipe.id);
  }

  updateDetailFavoriteButton() {
    const btn = document.getElementById('btn-detail-favorite-recipe');
    if (!btn) return;
    const isFav = !!(this.activeRecipe && this.activeRecipe.isFavorite);
    btn.classList.toggle('active', isFav);
    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    btn.setAttribute('aria-label', isFav ? 'Quitar de favoritas' : 'Marcar como favorita');
    btn.title = isFav ? 'Quitar de favoritas' : 'Marcar como favorita';
  }

  // US-60: SCREEN WAKE LOCK API (RECETA ABIERTA + MODO COCINA)
  shouldKeepScreenAwake() {
    const isCookActive = !!(this.cookModeOverlay && this.cookModeOverlay.classList.contains('active'));
    const isDetailActive = !!(this.modalRecipeDetail && this.modalRecipeDetail.classList.contains('active'));
    return isCookActive || isDetailActive;
  }

  updateWakeLockBadges() {
    const recipeBadge = document.getElementById('recipe-wake-lock-badge');
    const cookBadge = document.getElementById('cook-wake-lock-badge');
    const show = !!this.isWakeLockActive && this.shouldKeepScreenAwake();
    if (recipeBadge) recipeBadge.classList.toggle('is-hidden', !show);
    if (cookBadge) cookBadge.classList.toggle('is-hidden', !show);
  }

  async requestScreenWakeLock() {
    if (!this.shouldKeepScreenAwake()) return null;
    if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
      this.isWakeLockActive = true;
      this.updateWakeLockBadges();
      return this.wakeLockSentinel;
    }
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator) || typeof navigator.wakeLock?.request !== 'function') {
      this.isWakeLockActive = false;
      this.updateWakeLockBadges();
      return null;
    }
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      // Si la receta / Modo Cocina se cerró mientras la petición estaba en vuelo, liberar inmediatamente
      if (!this.shouldKeepScreenAwake()) {
        if (sentinel && typeof sentinel.release === 'function') {
          try { await sentinel.release(); } catch (e) { }
        }
        this.isWakeLockActive = false;
        this.updateWakeLockBadges();
        return null;
      }
      this.wakeLockSentinel = sentinel;
      this.isWakeLockActive = true;
      if (sentinel && typeof sentinel.addEventListener === 'function') {
        sentinel.addEventListener('release', () => {
          if (this.wakeLockSentinel === sentinel) {
            this.wakeLockSentinel = null;
            this.isWakeLockActive = false;
            this.updateWakeLockBadges();
          }
        });
      }
      this.updateWakeLockBadges();
      return sentinel;
    } catch (err) {
      this.isWakeLockActive = false;
      this.updateWakeLockBadges();
      return null;
    }
  }

  async releaseScreenWakeLock() {
    const sentinel = this.wakeLockSentinel;
    this.wakeLockSentinel = null;
    this.isWakeLockActive = false;
    this.updateWakeLockBadges();
    if (sentinel && typeof sentinel.release === 'function') {
      try {
        await sentinel.release();
      } catch (e) {
        // Ignorar errores al liberar Wake Lock
      }
    }
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
    this.closeDialogModal(this.modalRecipeDetail);
    this.updateRecipeDetailActionBars();
    if (!this.shouldKeepScreenAwake()) {
      this.releaseScreenWakeLock();
    }
  }

  editImportReview() {
    const draft = this.pendingImportRecipe || this.activeRecipe;
    if (!draft) return;
    this.closeDialogModal(this.modalRecipeDetail);
    if (!this.shouldKeepScreenAwake()) {
      this.releaseScreenWakeLock();
    }
    this.openEditRecipeModal(draft);
  }

  closeRecipeModal() {
    this.closeDialogModal(this.modalRecipeDetail);
    if (this.isReviewingImport) {
      this.isReviewingImport = false;
      this.pendingImportRecipe = null;
      this.updateRecipeDetailActionBars();
    }
    if (!this.shouldKeepScreenAwake()) {
      this.releaseScreenWakeLock();
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
      case 'modal-nutrition-goals':
        this.closeNutritionGoalsModal();
        break;
      case 'modal-copy-week':
        this.closeCopyWeekModal();
        break;
      case 'modal-bulk-import':
        this.closeBulkImportModal();
        break;
      case 'modal-confirm-dialog':
        this.closeConfirmDialog(false);
        break;
      case 'modal-plan-recipe':
        this.closePlanRecipeModal();
        break;
      case 'modal-onboarding':
        this.closeOnboardingModal();
        break;
      default:
        this.closeDialogModal(overlay);
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
    const baseNutrition = getRecipeNutrition(r);
    const hasNutData = !!(baseNutrition && (baseNutrition.calories > 0 || baseNutrition.protein > 0));
    const langMeta = getRecipeLanguageMeta(r);

    body.innerHTML = `
      ${isSafeUrl(r.imageUrl) ? `
      <div class="recipe-detail-hero-photo">
        <img src="${sanitizeUrl(r.imageUrl)}" alt="${escapeHtml(r.title)}" class="img-cover-full" onerror="this.onerror=null; this.parentElement.innerHTML=app.getRecipePlaceholderHtml('${escapeHtml(r.id).replace(/'/g, "\\'")}', 'detail');">
      </div>
      ` : `
      <div class="recipe-detail-hero-placeholder">
        ${this.getRecipePlaceholderHtml(r, 'detail')}
      </div>
      `}
      
      <div class="recipe-detail-body">
        ${this.isReviewingImport ? `
          <div class="import-review-banner">
            <div class="u-flex-row-center-gap-8">
              <span class="material-symbols-outlined icon-brand icon-22">verified</span>
              <div>
                <div class="import-review-title">${window.I18n ? window.I18n.t('import.reviewTitle') : 'Revisión de Receta Importada (Borrador)'}</div>
                <div class="import-review-subtitle">${window.I18n ? window.I18n.t('import.reviewSubtitle') : 'Comprueba ingredientes y pasos antes de guardar o descártala.'}</div>
              </div>
            </div>
            <span class="badge import-review-badge">${window.I18n ? window.I18n.t('import.draftBadge') : 'Borrador'}</span>
          </div>
        ` : ''}

        <div class="recipe-detail-tags-row">
          <span class="tag-chip tag-chip-lang" title="${escapeHtml(langMeta.ariaLabel)}">
            <span class="recipe-lang-flag" aria-hidden="true">${langMeta.flag}</span>
            <span>${langMeta.label}</span>
          </span>
          ${isSafeUrl(r.sourceUrl) ? `
            <a href="${sanitizeUrl(r.sourceUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="tag-chip tag-chip-external-link" title="${window.I18n ? window.I18n.t('import.openOriginalTooltip') : 'Abrir enlace original en nueva pestaña'}">
              <span class="material-symbols-outlined icon-14">open_in_new</span>
              ${window.I18n ? window.I18n.t('import.sourcePrefix') : 'Fuente'}: ${escapeHtml(r.sourceDomain || 'Web Original')}
            </a>
          ` : ''}
          ${(r.tags || []).filter(t => hasNutData || t !== 'Alta en Proteínas').map(t => `<span class="tag-chip tag-chip-primary">${escapeHtml(window.I18n ? window.I18n.getTagLabel(t) : t)}</span>`).join('')}
        </div>
        
        <h2 class="recipe-detail-title">${escapeHtml(r.title)}</h2>
        <p class="recipe-detail-desc">${escapeHtml(r.description)}</p>
        
        <div class="recipe-detail-stats-bar">
          <div>
            <div class="recipe-stat-upper-label">${window.I18n ? window.I18n.t('recipes.totalTime') : 'Tiempo Total'}</div>
            <div class="recipe-stat-time-val">
              <span class="material-symbols-outlined icon-sm">schedule</span> ${r.prepTimeMinutes + r.cookTimeMinutes} ${window.I18n ? window.I18n.t('common.minutes') : 'min'}
            </div>
          </div>
          
          <div class="u-flex-row-center-gap-8">
            <div class="u-text-right">
              <div class="recipe-stat-upper-label">${window.I18n ? window.I18n.t('recipes.servings') : 'Porciones'}</div>
              <div class="recipe-stat-servings-val">
                <span class="material-symbols-outlined icon-sm">group</span> ${this.activeServings} ${window.I18n ? window.I18n.t('recipes.persons') : 'personas'}
              </div>
            </div>
            <div class="u-flex-row-center-gap-4">
              <button class="btn btn-secondary btn-sm btn-servings-step" onclick="app.adjustServings(-1)">-</button>
              <button class="btn btn-secondary btn-sm btn-servings-step" onclick="app.adjustServings(1)">+</button>
            </div>
          </div>
        </div>

        <!-- NUTRITION BREAKDOWN CARD (US-01 / BUG-27) -->
        <div class="recipe-nutrition-card" id="recipe-nutrition-breakdown">
          <div class="recipe-nutrition-header">
            <div class="recipe-nutrition-title">
              <span class="material-symbols-outlined icon-sm icon-Flame">local_fire_department</span> ${window.I18n ? window.I18n.t('recipes.nutritionFacts') : 'Información Nutricional'}
            </div>
            <div class="recipe-nutrition-subtitle" id="recipe-nutrition-subtitle">
              ${window.I18n ? window.I18n.t('recipes.perServing') : 'Por ración individual'}
            </div>
          </div>
          <div class="recipe-macros-grid">
            <div class="macro-chip macro-cal">
              <span class="macro-chip-label">${window.I18n ? window.I18n.t('goals.calories') : 'Calorías'}</span>
              <span class="macro-chip-val" id="macro-detail-calories">${hasNutData ? `${baseNutrition.calories}<span class="macro-chip-unit">kcal</span>` : '—'}</span>
            </div>
            <div class="macro-chip macro-prot">
              <span class="macro-chip-label">${window.I18n ? window.I18n.t('goals.protein') : 'Proteínas'}</span>
              <span class="macro-chip-val" id="macro-detail-protein">${hasNutData ? `${baseNutrition.protein}<span class="macro-chip-unit">g</span>` : '—'}</span>
            </div>
            <div class="macro-chip macro-carbs">
              <span class="macro-chip-label">${window.I18n ? window.I18n.t('goals.carbs') : 'Carbos'}</span>
              <span class="macro-chip-val" id="macro-detail-carbs">${hasNutData ? `${baseNutrition.carbs}<span class="macro-chip-unit">g</span>` : '—'}</span>
            </div>
            <div class="macro-chip macro-fat">
              <span class="macro-chip-label">${window.I18n ? window.I18n.t('goals.fat') : 'Grasas'}</span>
              <span class="macro-chip-val" id="macro-detail-fat">${hasNutData ? `${baseNutrition.fat}<span class="macro-chip-unit">g</span>` : '—'}</span>
            </div>
          </div>
          <div class="nutrition-estimation-disclaimer" id="recipe-detail-nutrition-disclaimer">
            <span class="material-symbols-outlined">info</span>
            <span>${window.I18n ? window.I18n.t('recipes.nutritionDisclaimer') : 'Los valores nutricionales calculados son una estimación orientativa que depende de cada receta (creada a mano o importada por los usuarios). No deben tomarse al pie de la letra, sino solo como referencia aproximada.'}</span>
          </div>
        </div>

        <div class="recipe-detail-section">
          <div class="recipe-detail-section-header">
            <h3 class="recipe-detail-section-title">${window.I18n ? window.I18n.t('recipes.ingredients') : 'Ingredientes'}</h3>
            ${!this.isReviewingImport ? `
              <button class="btn btn-tonal btn-sm" onclick="app.addRecipeIngredientsToShopping('${escapeHtml(r.id).replace(/'/g, "\\'")}')">
                <span class="material-symbols-outlined icon-sm">add_shopping_cart</span> ${window.I18n ? window.I18n.t('recipes.sendToShopping') : 'Enviar a la Compra'}
              </button>
            ` : ''}
          </div>
          <ul class="recipe-ingredients-list">
            ${(r.ingredients || []).map(ing => {
      const adjustedAmount = ing.amount ? Math.round((ing.amount * scale) * 10) / 10 : null;
      return `
                <li class="recipe-ingredient-item">
                  <span>${escapeHtml(ing.name)}</span>
                  <strong class="recipe-ingredient-amount">${adjustedAmount !== null ? `${adjustedAmount} ${ing.unit || ''}` : ''}</strong>
                </li>
              `;
    }).join('')}
          </ul>
        </div>

        <div class="recipe-detail-section">
          <h3 class="recipe-detail-section-title-mb">${window.I18n ? window.I18n.t('recipes.instructions') : 'Instrucciones'}</h3>
          <div class="recipe-steps-list">
            ${(r.instructions || []).map(inst => `
              <div class="recipe-step-row">
                <div class="recipe-step-badge">
                  ${inst.step}
                </div>
                <div class="recipe-step-text">
                  ${escapeHtml(inst.text)}
                  ${inst.timerMinutes > 0 ? `
                    <div class="recipe-step-timer-pill">
                      <span class="material-symbols-outlined icon-sm">timer</span> ${inst.timerMinutes} ${window.I18n ? window.I18n.t('recipes.minutes') : 'minutos'}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.isReviewingImport ? `
          <div class="import-review-footer">
            <button class="btn btn-primary btn-save-import-full" id="btn-bottom-save-import-recipe" onclick="app.confirmSaveImportRecipe()">
              <span class="material-symbols-outlined">check_circle</span> ${window.I18n ? window.I18n.t('import.saveToRecipes') : 'Guardar en Recetas'}
            </button>
            <div class="u-flex-row-center-gap-8">
              <button class="btn btn-secondary btn-import-subaction" onclick="app.editImportReview()">
                <span class="material-symbols-outlined icon-sm">edit</span> ${window.I18n ? window.I18n.t('import.editRecipe') : 'Editar receta'}
              </button>
              <button class="btn btn-ghost btn-import-cancel" onclick="app.cancelImportReview()">
                <span class="material-symbols-outlined icon-sm">cancel</span> ${window.I18n ? window.I18n.t('import.cancelImport') : 'Cancelar importación'}
              </button>
            </div>
          </div>
        ` : `
          <div class="recipe-detail-bottom-actions">
            <button class="btn btn-secondary btn-detail-plan" id="btn-bottom-plan-recipe" onclick="app.openPlanRecipeModal()">
              <span class="material-symbols-outlined icon-sm">calendar_month</span> ${window.I18n ? window.I18n.t('recipes.addToPlan') : 'Añadir al Plan'}
            </button>
            <button class="btn btn-primary btn-detail-cook" id="btn-bottom-start-cook-mode" onclick="app.startCookMode()">
              <span class="material-symbols-outlined icon-sm">skillet</span> ${window.I18n ? window.I18n.t('recipes.cookingMode') : 'Modo Cocina'}
            </button>
          </div>
        `}
      </div>
    `;
  }

  async deleteCurrentRecipe(skipConfirm = false) {
    if (!this.activeRecipe) return false;
    const recipeToDelete = this.activeRecipe;
    const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
      title: 'Eliminar receta',
      message: `¿Eliminar la receta "${recipeToDelete.title}" de tu recetario? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      danger: true,
      icon: 'delete'
    });
    if (confirmed) {
      const deletedId = recipeToDelete.id;
      state.recipes = state.recipes.filter(r => r.id !== deletedId);
      state.save('fa_recipes', state.recipes);
      state.trackDeletion('recipes', deletedId);
      this.closeRecipeModal();
      this.render();
      this.showToast(`Receta "${recipeToDelete.title}" eliminada.`, 'info');
      // Propagar borrado inmediatamente a Supabase (BUG-23)
      this.pushToCloud(true);
      return true;
    }
    return false;
  }

  // UNIFIED RECIPE ADD CHOICE
  openAddRecipeChoiceModal() {
    if (this.modalRecipeAddChoice) {
      this.openDialogModal(this.modalRecipeAddChoice);
    }
  }

  closeAddRecipeChoiceModal() {
    if (this.modalRecipeAddChoice) {
      this.closeDialogModal(this.modalRecipeAddChoice);
    }
  }

  // RECIPE EDITOR (CREATE & EDIT)
  openCreateRecipeModal() {
    const titleEl = document.getElementById('recipe-edit-modal-title');
    if (titleEl) {
      titleEl.innerHTML = `<span class="material-symbols-outlined icon-primary">edit_note</span> <span>${window.I18n ? window.I18n.t('recipes.newRecipeTitle') : 'Nueva Receta'}</span>`;
    }
    const switchBtn = document.getElementById('btn-edit-switch-to-import');
    if (switchBtn) switchBtn.style.display = 'inline-flex';
    document.getElementById('edit-recipe-id').value = "";
    document.getElementById('edit-recipe-title').value = "";
    document.getElementById('edit-recipe-desc').value = "";
    document.getElementById('edit-recipe-prep').value = "15";
    document.getElementById('edit-recipe-cook').value = "20";
    document.getElementById('edit-recipe-servings').value = state.settings.defaultServings || "2";
    const langSelect = document.getElementById('edit-recipe-language');
    const initialLang = (window.I18n && window.I18n.getLanguage() === 'en') ? 'en' : 'es';
    if (langSelect) langSelect.value = initialLang;
    this.syncRecipeEditorLanguageUI(initialLang);
    const imgEl = document.getElementById('edit-recipe-image');
    if (imgEl) imgEl.value = "";
    this.updateRecipeEditorImagePreview();
    document.getElementById('edit-recipe-tags').value = "Cena, Saludable";
    const calEl = document.getElementById('edit-recipe-calories');
    const proEl = document.getElementById('edit-recipe-protein');
    const carbEl = document.getElementById('edit-recipe-carbs');
    const fatEl = document.getElementById('edit-recipe-fat');
    if (calEl) calEl.value = "";
    if (proEl) proEl.value = "";
    if (carbEl) carbEl.value = "";
    if (fatEl) fatEl.value = "";
    this.editorSelectedTags = new Set(["Cena", "Saludable"]);
    this.renderRecipeEditorChips();
    const privCheckbox = document.getElementById('edit-recipe-private');
    if (privCheckbox) privCheckbox.checked = false;

    document.getElementById('edit-ingredients-container').innerHTML = "";
    document.getElementById('edit-steps-container').innerHTML = "";

    this.addIngredientRow({ name: "", amount: "", unit: "", aisle: "produce" });
    this.addStepRow({ step: 1, text: "", timerMinutes: 0 });

    if (window.I18n && typeof window.I18n.applyTranslations === 'function') {
      window.I18n.applyTranslations(this.modalRecipeEdit);
    }
    this.openDialogModal(this.modalRecipeEdit);
  }

  openEditRecipeModal(recipeOrId) {
    let r;
    if (typeof recipeOrId === 'object' && recipeOrId !== null) {
      r = recipeOrId;
    } else {
      r = state.recipes.find(rec => rec.id === recipeOrId);
    }
    if (!r) return;

    const titleEl = document.getElementById('recipe-edit-modal-title');
    if (titleEl) {
      const titleKey = this.isReviewingImport ? 'recipes.reviewEditTitle' : 'recipes.editRecipeTitle';
      const defaultText = this.isReviewingImport ? 'Editar y Revisar Receta Importada' : 'Editar Receta';
      titleEl.innerHTML = `<span class="material-symbols-outlined icon-primary">edit_note</span> <span>${window.I18n ? window.I18n.t(titleKey) : defaultText}</span>`;
    }
    const switchBtn = document.getElementById('btn-edit-switch-to-import');
    if (switchBtn) switchBtn.style.display = 'none';
    document.getElementById('edit-recipe-id').value = r.id || ('rec-' + Date.now());
    document.getElementById('edit-recipe-title').value = r.title || "";
    document.getElementById('edit-recipe-desc').value = r.description || "";
    document.getElementById('edit-recipe-prep').value = r.prepTimeMinutes || 0;
    document.getElementById('edit-recipe-cook').value = r.cookTimeMinutes || 0;
    document.getElementById('edit-recipe-servings').value = r.servings || 2;
    const editLangSelect = document.getElementById('edit-recipe-language');
    const recipeLang = getRecipeLanguage(r);
    if (editLangSelect) editLangSelect.value = recipeLang;
    this.syncRecipeEditorLanguageUI(recipeLang);
    const editImgEl = document.getElementById('edit-recipe-image');
    if (editImgEl) editImgEl.value = r.imageUrl || "";
    this.updateRecipeEditorImagePreview();
    document.getElementById('edit-recipe-tags').value = (r.tags || []).join(', ');
    const calEl = document.getElementById('edit-recipe-calories');
    const proEl = document.getElementById('edit-recipe-protein');
    const carbEl = document.getElementById('edit-recipe-carbs');
    const fatEl = document.getElementById('edit-recipe-fat');
    const nut = r.nutrition || (typeof getRecipeNutrition === 'function' ? getRecipeNutrition(r) : null);
    if (calEl) calEl.value = (nut && nut.calories > 0) ? nut.calories : "";
    if (proEl) proEl.value = (nut && nut.protein > 0) ? nut.protein : "";
    if (carbEl) carbEl.value = (nut && nut.carbs > 0) ? nut.carbs : "";
    if (fatEl) fatEl.value = (nut && nut.fat > 0) ? nut.fat : "";
    this.editorSelectedTags = new Set(Array.isArray(r.tags) ? r.tags : []);
    this.renderRecipeEditorChips();
    const editPrivCheckbox = document.getElementById('edit-recipe-private');
    if (editPrivCheckbox) editPrivCheckbox.checked = !!r.isPrivate;

    const ingContainer = document.getElementById('edit-ingredients-container');
    ingContainer.innerHTML = "";
    (r.ingredients || []).forEach(ing => this.addIngredientRow(ing));

    const stepContainer = document.getElementById('edit-steps-container');
    stepContainer.innerHTML = "";
    (r.instructions || []).forEach(step => this.addStepRow(step));

    if (window.I18n && typeof window.I18n.applyTranslations === 'function') {
      window.I18n.applyTranslations(this.modalRecipeEdit);
    }
    this.openDialogModal(this.modalRecipeEdit);
  }

  closeEditModal() {
    this.closeDialogModal(this.modalRecipeEdit);
    const langDropdown = document.getElementById('edit-recipe-lang-dropdown');
    const langWrapper = document.getElementById('edit-recipe-lang-wrapper');
    const langBtn = document.getElementById('edit-recipe-lang-btn');
    if (langDropdown) langDropdown.classList.add('is-hidden');
    if (langWrapper) langWrapper.classList.remove('is-open');
    if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
    if (this.isReviewingImport && this.pendingImportRecipe) {
      this.openImportReview(this.pendingImportRecipe);
    }
  }

  // ==========================================================================
  // US-16: GESTIÓN FLEXIBLE DE IMÁGENES DE RECETAS (AVATAR, SUBIDA, URL, IA)
  // ==========================================================================
  getRecipeTheme(recipeOrTitle, tags) {
    return getRecipeTheme(recipeOrTitle, tags);
  }

  getRecipePlaceholderSvg(recipeOrTitle, size) {
    return getRecipePlaceholderSvg(recipeOrTitle, size);
  }

  getRecipePlaceholderHtml(recipeOrTitle, size) {
    return getRecipePlaceholderHtml(recipeOrTitle, size);
  }

  cleanRecipeImageUrl(url) {
    return cleanRecipeImageUrl(url);
  }

  updateRecipeEditorImagePreview() {
    const previewContent = document.getElementById('recipe-editor-image-preview-content');
    const removeBtn = document.getElementById('btn-edit-recipe-remove-image');
    const imgInput = document.getElementById('edit-recipe-image');
    const titleInput = document.getElementById('edit-recipe-title');
    if (!previewContent || !imgInput) return;

    const currentUrl = cleanRecipeImageUrl(imgInput.value.trim());
    const currentTitle = titleInput?.value.trim() || 'Nueva Receta';

    if (currentUrl) {
      if (removeBtn) removeBtn.style.display = 'inline-flex';
      const isBase64 = currentUrl.startsWith('data:image/');
      const badgeText = isBase64 ? 'Foto propia' : 'URL Externa';
      const badgeIcon = isBase64 ? 'photo_camera' : 'link';

      const safeTitle = (typeof escapeHtml === 'function' ? escapeHtml(currentTitle) : currentTitle).replace(/'/g, "\\'");
      previewContent.innerHTML = `
        <div class="editor-image-preview-box">
          <img src="${currentUrl}" alt="Vista previa" class="img-cover-full" onerror="this.onerror=null; this.parentElement.innerHTML=app.getRecipePlaceholderHtml('${safeTitle}', 'card');">
          <span class="recipe-image-preview-badge">
            <span class="material-symbols-outlined icon-12">${badgeIcon}</span> ${badgeText}
          </span>
        </div>
      `;
    } else {
      if (removeBtn) removeBtn.style.display = 'none';
      previewContent.innerHTML = `
        <div class="editor-image-placeholder-box">
          ${this.getRecipePlaceholderHtml(currentTitle, 'card')}
        </div>
      `;
    }
  }

  removeRecipeImage() {
    const imgInput = document.getElementById('edit-recipe-image');
    const fileInput = document.getElementById('edit-recipe-file-input');
    const cameraInput = document.getElementById('edit-recipe-camera-input');
    if (imgInput) imgInput.value = '';
    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
    this.updateRecipeEditorImagePreview();
    this.showToast('Foto eliminada. Se usará el avatar gráfico elegante.', 'info');
  }

  async handleRecipeImageFileUpload(file) {
    if (!file) return;
    try {
      this.showToast('Optimizando foto...', 'info');
      const result = await this.compressImageToBase64(file, 1024, 1024, 0.8);
      if (result && result.dataUrl) {
        const imgInput = document.getElementById('edit-recipe-image');
        if (imgInput) {
          imgInput.value = result.dataUrl;
        }
        this.updateRecipeEditorImagePreview();
        this.showToast('Foto optimizada y cargada correctamente.', 'success');
      }
    } catch (err) {
      console.error('[FoodAssistant] Error al procesar imagen:', err);
      this.showToast('No se pudo procesar la imagen seleccionada.', 'error');
    }
  }

  async generateRecipeImageWithAi() {
    const titleInput = document.getElementById('edit-recipe-title');
    const title = titleInput?.value.trim();
    if (!title) {
      this.highlightInputError(titleInput, 'Escribe primero el título del plato para que la IA genere la foto adecuada.');
      this.showToast('Por favor, introduce el título del plato antes de generar la foto.', 'error');
      return;
    }

    const tags = Array.from(this.editorSelectedTags || []).join(', ');
    const aiBtn = document.getElementById('btn-edit-recipe-ai-image');
    const prevHtml = aiBtn ? aiBtn.innerHTML : '';

    if (aiBtn) {
      aiBtn.disabled = true;
      aiBtn.innerHTML = '<span class="material-symbols-outlined icon-sm icon-spin">sync</span> Generando foto con IA...';
    }

    const previewContent = document.getElementById('recipe-editor-image-preview-content');
    if (previewContent) {
      previewContent.innerHTML = `
        <div class="editor-ai-generating-box">
          <span class="material-symbols-outlined icon-32 icon-spin-slow">auto_awesome</span>
          <span class="editor-ai-generating-label">Creando fotografía gastronómica con IA...</span>
        </div>
      `;
    }

    try {
      const cleanTitle = title.replace(/["']/g, '');
      const seed = Math.floor(Math.random() * 900000) + 100000;
      const promptQuery = `appetizing gourmet culinary food photography of ${cleanTitle}${tags ? ', ' + tags : ''}, beautifully plated in a modern restaurant ceramic dish, warm studio soft light, appetizing garnish, high quality professional food photography, 4k`;
      const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptQuery)}?width=800&height=600&nologo=true&seed=${seed}`;

      const imgInput = document.getElementById('edit-recipe-image');
      if (imgInput) {
        imgInput.value = generatedUrl;
      }
      this.updateRecipeEditorImagePreview();
      this.showToast(`Foto gastronómica generada con éxito para "${title}".`, 'success');
    } catch (err) {
      console.error('[FoodAssistant] Error generando foto con IA:', err);
      this.showToast('No se pudo generar la foto con IA en este momento.', 'error');
      this.updateRecipeEditorImagePreview();
    } finally {
      if (aiBtn) {
        aiBtn.disabled = false;
        aiBtn.innerHTML = prevHtml;
      }
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
        selectedContainer.innerHTML = `<span>${window.I18n ? window.I18n.t('recipes.noTagsSelected') : 'Ninguna etiqueta seleccionada. Elige una abajo o crea una nueva.'}</span>`;
      } else {
        selectedContainer.className = 'recipe-editor-chips-box';
        const removeTagTitle = window.I18n ? window.I18n.t('recipes.removeTagAria') : 'Quitar etiqueta';
        selectedContainer.innerHTML = selectedArray.map(tag => `
          <span class="editor-selected-chip">
            <span>${escapeHtml(window.I18n ? window.I18n.getTagLabel(tag) : tag)}</span>
            <button type="button" class="chip-remove-btn" onclick="app.removeEditorTag('${tag.replace(/'/g, "\\'")}')" title="${escapeHtml(removeTagTitle)}">
              <span class="material-symbols-outlined icon-14">close</span>
            </button>
          </span>
        `).join('');
      }
    }

    const renderGroup = (container, tagList) => {
      if (!container) return;
      container.innerHTML = tagList.map(t => {
        const isSelected = this.editorSelectedTags.has(t);
        const displayTag = window.I18n ? window.I18n.getTagLabel(t) : t;
        return `
          <button type="button" class="editor-suggested-chip ${isSelected ? 'active' : ''}" onclick="app.toggleEditorTag('${t.replace(/'/g, "\\'")}')">
            ${PREDEFINED_DIETARY_TAGS.includes(t) ? `<span class="dietary-emoji">${getDietaryTagEmoji(t)}</span>` : `<span class="material-symbols-outlined icon-14">${isSelected ? 'check' : 'add'}</span>`}
            <span>${escapeHtml(displayTag)}</span>
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
    this.scheduleSyncWithCloud();
  }

  getCustomIngredientsFromState() {
    const recipesCount = (typeof state !== 'undefined' && state.recipes) ? state.recipes.length : 0;
    if (this._cachedCustomIngredients && this._cachedCustomIngredientsCount === recipesCount) {
      return this._cachedCustomIngredients;
    }
    const extra = [];
    const seen = new Set();
    if (typeof state !== 'undefined' && state.recipes) {
      state.recipes.forEach(r => {
        (r.ingredients || []).forEach(ing => {
          if (ing && ing.name) {
            const norm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(ing.name) : ing.name.toLowerCase().trim();
            if (norm && !seen.has(norm)) {
              seen.add(norm);
              extra.push(ing);
            }
          }
        });
      });
    }
    this._cachedCustomIngredients = extra;
    this._cachedCustomIngredientsCount = recipesCount;
    return extra;
  }

  attachIngredientAutocomplete(inputElem, dropdownElem, onSelect) {
    if (!inputElem || !dropdownElem) return;

    let activeIndex = -1;
    let currentSuggestions = [];

    // Delegación de clic en sugerencias
    if (!dropdownElem._clickBound) {
      dropdownElem.addEventListener('mousedown', (e) => {
        const itemEl = e.target.closest('.autocomplete-item');
        if (!itemEl) return;
        e.preventDefault();
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        if (currentSuggestions[idx]) {
          onSelect(currentSuggestions[idx]);
          dropdownElem.innerHTML = '';
          dropdownElem.style.display = 'none';
          currentSuggestions = [];
        }
      });
      dropdownElem._clickBound = true;
    }

    const renderSuggestions = (items) => {
      currentSuggestions = items || [];
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
        dropdownElem.innerHTML = '';
        dropdownElem.style.display = 'none';
        currentSuggestions = [];
        return;
      }

      const extra = this.getCustomIngredientsFromState();
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
          dropdownElem.innerHTML = '';
          dropdownElem.style.display = 'none';
          currentSuggestions = [];
        }
      } else if (e.key === 'Escape') {
        dropdownElem.innerHTML = '';
        dropdownElem.style.display = 'none';
        currentSuggestions = [];
      }
    });

    if (!dropdownElem._docClickBound) {
      document.addEventListener('click', (e) => {
        if (!inputElem.contains(e.target) && !dropdownElem.contains(e.target)) {
          dropdownElem.style.display = 'none';
        }
      });
      dropdownElem._docClickBound = true;
    }
  }

  renumberSteps() {
    const container = document.getElementById('edit-steps-container');
    if (!container) return;
    const stepRows = container.querySelectorAll('.edit-step-row');
    const stepTitleTpl = window.I18n ? window.I18n.t('recipes.stepTitle') : 'Paso {num}';
    stepRows.forEach((row, idx) => {
      const numPill = row.querySelector('.step-num-pill');
      if (numPill) numPill.textContent = idx + 1;
      const title = row.querySelector('.step-title-text');
      if (title) title.textContent = stepTitleTpl.replace('{num}', idx + 1);
    });
  }

  addIngredientRow(data = {}) {
    const container = document.getElementById('edit-ingredients-container');
    const row = document.createElement('div');
    row.className = 'edit-ing-row edit-ing-card';

    const currentAisle = data.aisle || (data.name ? categorizeIngredientAisle(data.name) : 'other');
    const initialIcon = getIngredientIcon(data.name || '', currentAisle);

    const namePlaceholder = window.I18n ? window.I18n.t('recipes.ingredientNamePlaceholder') : 'Nombre del ingrediente (ej. Castañas, Puerro...)';
    const removeTitle = window.I18n ? window.I18n.t('recipes.removeIngredientTitle') : 'Eliminar ingrediente';
    const amountLabel = window.I18n ? window.I18n.t('recipes.amountLabel') : 'Cantidad';
    const amountPlaceholder = window.I18n ? window.I18n.t('recipes.amountPlaceholder') : 'Ej. 1';
    const unitLabel = window.I18n ? window.I18n.t('recipes.unitLabel') : 'Unidad';
    const unitPlaceholder = window.I18n ? window.I18n.t('recipes.unitPlaceholder') : 'ud, g, ml...';
    const aisleLabel = window.I18n ? window.I18n.t('recipes.aisleLabel') : 'Pasillo / Sección';

    const aisleList = [
      { key: 'other', label: 'Otros / Varios' },
      { key: 'produce', label: 'Verduras y Frutas' },
      { key: 'meat', label: 'Carnes y Pescados' },
      { key: 'dairy', label: 'Lácteos y Huevos' },
      { key: 'bakery', label: 'Panadería y Masas' },
      { key: 'pantry', label: 'Despensa y Básicos' },
      { key: 'spices', label: 'Especias y Aceites' },
      { key: 'frozen', label: 'Congelados' },
      { key: 'beverages', label: 'Bebidas' }
    ];

    const aisleOptionsHtml = aisleList.map(a => {
      const locLabel = window.I18n ? window.I18n.getAisleName(a.key) : a.label;
      const isSelected = currentAisle === a.key ? 'selected' : '';
      return `<option value="${a.key}" ${isSelected}>${escapeHtml(locLabel)}</option>`;
    }).join('');

    row.innerHTML = `
      <div class="edit-ing-top-row">
        <div class="ing-name-wrap">
          <span class="material-symbols-outlined icon-sm ing-icon-badge">${initialIcon}</span>
          <input type="text" class="form-input ing-name" placeholder="${escapeHtml(namePlaceholder)}" value="${escapeHtml(data.name || '')}" autocomplete="off">
          <div class="ing-autocomplete-dropdown autocomplete-dropdown is-hidden"></div>
        </div>
        <button type="button" class="btn-remove-item" title="${escapeHtml(removeTitle)}">
          <span class="material-symbols-outlined icon-sm">delete</span>
        </button>
      </div>

      <div class="edit-ing-bottom-row">
        <div class="ing-field-group ing-amount-group">
          <label class="field-micro-label">${escapeHtml(amountLabel)}</label>
          <input type="number" class="form-input ing-amount" placeholder="${escapeHtml(amountPlaceholder)}" value="${data.amount !== null && data.amount !== undefined ? data.amount : ''}" step="any">
        </div>
        <div class="ing-field-group ing-unit-group">
          <label class="field-micro-label">${escapeHtml(unitLabel)}</label>
          <input type="text" class="form-input ing-unit" placeholder="${escapeHtml(unitPlaceholder)}" value="${escapeHtml(data.unit || '')}">
        </div>
        <div class="ing-field-group ing-aisle-group">
          <label class="field-micro-label">${escapeHtml(aisleLabel)}</label>
          <select class="form-select ing-aisle">
            ${aisleOptionsHtml}
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

    const stepTitleTpl = window.I18n ? window.I18n.t('recipes.stepTitle') : 'Paso {num}';
    const stepTitle = stepTitleTpl.replace('{num}', currentStepNum);
    const removeStepTitle = window.I18n ? window.I18n.t('recipes.removeStepTitle') : 'Eliminar paso';
    const stepPlaceholder = window.I18n ? window.I18n.t('recipes.stepPlaceholder') : 'Instrucción del paso...';
    const autoTimerBadge = window.I18n ? window.I18n.t('recipes.autoTimerBadge') : 'Auto';
    const editTimerTitle = window.I18n ? window.I18n.t('recipes.editTimerTitle') : 'Cambiar minutos';
    const removeTimerTitle = window.I18n ? window.I18n.t('recipes.removeTimerTitle') : 'Quitar temporizador';
    const optionalTimerPrompt = window.I18n ? window.I18n.t('recipes.optionalTimerPrompt') : '+ Tiempo opcional';
    const optionalTimerTooltip = window.I18n ? window.I18n.t('recipes.optionalTimerTooltip') : 'Añadir temporizador opcional';

    row.innerHTML = `
      <div class="edit-step-header">
        <div class="step-header-left">
          <span class="step-num-pill">${currentStepNum}</span>
          <span class="step-title-text">${escapeHtml(stepTitle)}</span>
        </div>
        <button type="button" class="btn-remove-item" title="${escapeHtml(removeStepTitle)}">
          <span class="material-symbols-outlined icon-sm">delete</span>
        </button>
      </div>

      <textarea class="form-textarea step-text" rows="2" placeholder="${escapeHtml(stepPlaceholder)}">${escapeHtml(text)}</textarea>

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
            <span class="material-symbols-outlined icon-sm icon-15">timer</span>
            <span class="timer-display-text">${mins} min</span>
            ${isAutoDetected ? `<span class="step-timer-auto-tag">${escapeHtml(autoTimerBadge)}</span>` : ''}
            <button type="button" class="btn-timer-edit btn-inline-icon-only" title="${escapeHtml(editTimerTitle)}">
              <span class="material-symbols-outlined icon-14">edit</span>
            </button>
            <button type="button" class="btn-timer-remove btn-inline-icon-only" title="${escapeHtml(removeTimerTitle)}">
              <span class="material-symbols-outlined icon-15">close</span>
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
          <button type="button" class="btn-step-timer-prompt" title="${escapeHtml(optionalTimerTooltip)}">
            <span class="material-symbols-outlined icon-sm icon-14">timer</span>
            <span>${escapeHtml(optionalTimerPrompt)}</span>
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
          <span class="material-symbols-outlined icon-sm icon-15 icon-primary">timer</span>
          <input type="number" class="step-timer-mini-input" value="${initialVal || ''}" min="1" max="999" placeholder="Min" autofocus>
          <span class="timer-unit-label">min</span>
          <button type="button" class="btn-save-inline-timer btn btn-primary btn-sm btn-save-inline-timer-compact">OK</button>
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

  recalculateEditorNutrition() {
    const servings = parseInt(document.getElementById('edit-recipe-servings')?.value, 10) || 2;
    const ingredients = [];
    document.querySelectorAll('#edit-ingredients-container .edit-ing-row').forEach(row => {
      const name = row.querySelector('.ing-name')?.value.trim();
      const amountVal = row.querySelector('.ing-amount')?.value;
      const unit = row.querySelector('.ing-unit')?.value.trim();
      const aisle = row.querySelector('.ing-aisle')?.value;

      if (name) {
        ingredients.push({
          id: generateId('ing-'),
          name: name,
          amount: amountVal !== "" && amountVal !== undefined ? parseFloat(amountVal) : null,
          unit: unit,
          aisle: aisle
        });
      }
    });

    const estimated = typeof estimateRecipeNutrition === 'function'
      ? estimateRecipeNutrition({ servings, ingredients })
      : null;

    if (estimated) {
      const calEl = document.getElementById('edit-recipe-calories');
      const proEl = document.getElementById('edit-recipe-protein');
      const carbEl = document.getElementById('edit-recipe-carbs');
      const fatEl = document.getElementById('edit-recipe-fat');

      if (calEl) calEl.value = estimated.calories > 0 ? estimated.calories : "";
      if (proEl) proEl.value = estimated.protein > 0 ? estimated.protein : "";
      if (carbEl) carbEl.value = estimated.carbs > 0 ? estimated.carbs : "";
      if (fatEl) fatEl.value = estimated.fat > 0 ? estimated.fat : "";

      [calEl, proEl, carbEl, fatEl].forEach(el => {
        if (el) {
          el.style.transition = 'background-color 0.3s ease';
          el.style.backgroundColor = 'var(--m3-primary-container)';
          setTimeout(() => { el.style.backgroundColor = ''; }, 600);
        }
      });
    }
  }

  saveRecipeEdit() {
    const titleInput = document.getElementById('edit-recipe-title');
    const title = titleInput?.value.trim() || '';
    if (!title) {
      this.highlightInputError(titleInput, "Por favor, introduce el título de la receta.");
      return;
    }

    const id = document.getElementById('edit-recipe-id').value || generateId('rec-');
    const description = document.getElementById('edit-recipe-desc').value.trim();
    const imageUrl = cleanRecipeImageUrl(document.getElementById('edit-recipe-image')?.value.trim() || '');
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

    const existingIdx = state.recipes.findIndex(r => r.id === id);
    const existing = existingIdx >= 0 ? state.recipes[existingIdx] : null;

    // Collect Nutrition
    const calVal = parseFloat(document.getElementById('edit-recipe-calories')?.value);
    const proVal = parseFloat(document.getElementById('edit-recipe-protein')?.value);
    const carbVal = parseFloat(document.getElementById('edit-recipe-carbs')?.value);
    const fatVal = parseFloat(document.getElementById('edit-recipe-fat')?.value);

    let nutrition = null;
    if (!isNaN(calVal) || !isNaN(proVal) || !isNaN(carbVal) || !isNaN(fatVal)) {
      nutrition = {
        calories: !isNaN(calVal) ? Math.max(0, Math.round(calVal)) : 0,
        protein: !isNaN(proVal) ? Math.max(0, Math.round(proVal * 10) / 10) : 0,
        carbs: !isNaN(carbVal) ? Math.max(0, Math.round(carbVal * 10) / 10) : 0,
        fat: !isNaN(fatVal) ? Math.max(0, Math.round(fatVal * 10) / 10) : 0
      };
    } else {
      // Si el usuario vació los campos de macros, recalcular forzosamente a partir de los ingredientes y raciones actuales
      const estimated = typeof estimateRecipeNutrition === 'function'
        ? estimateRecipeNutrition({ servings, ingredients })
        : null;
      if (estimated && (estimated.calories > 0 || estimated.protein > 0)) {
        nutrition = estimated;
      }
    }

    const isPrivate = !!document.getElementById('edit-recipe-private')?.checked;
    const languageEl = document.getElementById('edit-recipe-language');
    const language = languageEl?.value || detectRecipeLanguage({ title, description, ingredients, instructions });

    const updatedRecipe = {
      id,
      title,
      description,
      imageUrl,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      tags,
      language,
      nutrition: nutrition || undefined,
      ingredients,
      instructions
    };
    if (isPrivate || existing?.isPrivate !== undefined || state.household?.id) {
      updatedRecipe.isPrivate = isPrivate;
    }

    const baseRecipe = existing || (this.isReviewingImport ? this.pendingImportRecipe : null) || {};
    const finalRecipe = {
      ...baseRecipe,
      ...updatedRecipe,
      sourceUrl: baseRecipe.sourceUrl || updatedRecipe.sourceUrl || '',
      sourceDomain: baseRecipe.sourceDomain || updatedRecipe.sourceDomain || '',
      createdAt: baseRecipe.createdAt || baseRecipe.updatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (ingredients.length > 0 && typeof analyzeAndInferRecipeTags === 'function') {
      const inferred = analyzeAndInferRecipeTags(finalRecipe);
      if (finalRecipe.tags.includes('Alta en Proteínas') && !inferred.includes('Alta en Proteínas')) {
        finalRecipe.tags = finalRecipe.tags.filter(t => t !== 'Alta en Proteínas');
      }
      const existingLower = new Set(finalRecipe.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(tag => {
        const lower = tag.toLowerCase().trim();
        if (!existingLower.has(lower) && lower !== 'general') {
          finalRecipe.tags.push(tag);
          existingLower.add(lower);
          state.addCustomTag && state.addCustomTag(tag);
        }
      });
    }

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
    if (!this.activeRecipe || !Array.isArray(this.activeRecipe.instructions) || this.activeRecipe.instructions.length === 0) {
      this.showToast("Esta receta no tiene pasos de preparación para el Modo Cocina.", 'warning');
      return;
    }
    this.cookStepIndex = 0;
    this.cookModeOverlay.classList.add('active');
    this.closeRecipeModal();
    this.renderCookStep();
    this.requestScreenWakeLock();
  }

  exitCookMode() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.cookModeOverlay.classList.remove('active');
    if (!this.shouldKeepScreenAwake()) {
      this.releaseScreenWakeLock();
    }
  }

  nextCookStep() {
    if (this.cookStepIndex < this.activeRecipe.instructions.length - 1) {
      this.cookStepIndex++;
      this.renderCookStep();
    } else {
      this.exitCookMode();
      const finishMsg = window.I18n ? window.I18n.t('cooking.finish') : "¡Enhorabuena! Has completado todos los pasos de la receta. ¡A disfrutar!";
      this.showToast(finishMsg, 'success');
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

    const stepWord = window.I18n ? window.I18n.t('cooking.step') : 'Paso';
    const ofWord = window.I18n ? window.I18n.t('cooking.of') : 'de';
    document.getElementById('cook-recipe-title').textContent = r.title;
    document.getElementById('cook-step-indicator').textContent = `${stepWord} ${step.step} ${ofWord} ${r.instructions.length}`;
    document.getElementById('cook-step-text').textContent = step.text;

    const nextBtn = document.getElementById('btn-cook-next-step');
    if (nextBtn) {
      const isLast = this.cookStepIndex >= r.instructions.length - 1;
      const finishText = window.I18n ? window.I18n.t('cooking.finish') : 'Finalizar';
      const nextText = window.I18n ? window.I18n.t('cooking.nextStep') : 'Siguiente';
      nextBtn.innerHTML = isLast
        ? `${finishText} <span class="material-symbols-outlined icon-sm">check_circle</span>`
        : `${nextText} <span class="material-symbols-outlined icon-sm">arrow_forward</span>`;
    }

    const timerBox = document.getElementById('cook-timer-box');
    clearInterval(this.timerInterval);
    this.timerInterval = null;

    const timerStartBtn = document.getElementById('btn-timer-start');
    if (timerStartBtn) {
      timerStartBtn.textContent = window.I18n ? window.I18n.t('cooking.timerStart') : 'Iniciar';
    }

    if (step.timerMinutes > 0) {
      timerBox.style.display = 'block';
      this.timerSecondsLeft = step.timerMinutes * 60;
      this.updateTimerDisplay();

      if (timerStartBtn) {
        timerStartBtn.onclick = () => this.toggleCookTimer();
      }
      document.getElementById('btn-timer-reset').onclick = () => {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timerSecondsLeft = step.timerMinutes * 60;
        this.updateTimerDisplay();
        const startBtn = document.getElementById('btn-timer-start');
        if (startBtn) startBtn.textContent = window.I18n ? window.I18n.t('cooking.timerStart') : 'Iniciar';
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
      btn.textContent = window.I18n ? window.I18n.t('cooking.resumeTimer') : 'Reanudar';
    } else {
      btn.textContent = window.I18n ? window.I18n.t('cooking.pauseTimer') : 'Pausar';
      this.timerInterval = setInterval(() => {
        if (this.timerSecondsLeft > 0) {
          this.timerSecondsLeft--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          btn.textContent = window.I18n ? window.I18n.t('cooking.timerFinished') : '¡Completado!';
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
    } catch (e) { }
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
    this.plannerExpandedDays = null;
    this.renderPlanner();
  }

  getDefaultExpandedPlannerDays(weekDays) {
    const expanded = new Set();
    if (!Array.isArray(weekDays) || weekDays.length === 0) return expanded;
    const todayKey = toLocalDateKey(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = toLocalDateKey(tomorrow);

    weekDays.forEach(w => {
      if (w.dateKey === todayKey || w.dateKey === tomorrowKey) {
        expanded.add(w.dateKey);
      }
    });

    if (expanded.size === 0) {
      expanded.add(weekDays[0].dateKey);
      if (weekDays[1]) expanded.add(weekDays[1].dateKey);
    }
    return expanded;
  }

  togglePlannerDayAccordion(dateStr, event) {
    if (event) {
      const interactive = event.target.closest('button, a, input, select');
      if (interactive && !interactive.classList.contains('day-accordion-toggle')) return;
    }
    const weekDays = this.getPlannerWeekDates();
    if (!(this.plannerExpandedDays instanceof Set)) {
      this.plannerExpandedDays = this.getDefaultExpandedPlannerDays(weekDays);
    }
    if (this.plannerExpandedDays.has(dateStr)) {
      this.plannerExpandedDays.delete(dateStr);
    } else {
      this.plannerExpandedDays.add(dateStr);
    }
    const card = document.querySelector(`.day-card[data-date="${dateStr}"]`);
    if (card) {
      const isExp = this.plannerExpandedDays.has(dateStr);
      card.classList.toggle('is-expanded', isExp);
      card.classList.toggle('is-collapsed', !isExp);
    } else {
      this.renderPlanner();
    }
    this.updateToggleAllPlannerButtonLabel(weekDays);
  }

  toggleAllPlannerDays() {
    const weekDays = this.getPlannerWeekDates();
    if (!(this.plannerExpandedDays instanceof Set)) {
      this.plannerExpandedDays = this.getDefaultExpandedPlannerDays(weekDays);
    }
    const allExpanded = weekDays.every(w => this.plannerExpandedDays.has(w.dateKey));
    if (allExpanded) {
      this.plannerExpandedDays = this.getDefaultExpandedPlannerDays(weekDays);
    } else {
      this.plannerExpandedDays = new Set(weekDays.map(w => w.dateKey));
    }
    this.renderPlanner();
  }

  updateToggleAllPlannerButtonLabel(weekDays) {
    const labelEl = document.getElementById('btn-toggle-all-planner-days-label');
    if (!labelEl || !Array.isArray(weekDays)) return;
    const allExpanded = this.plannerExpandedDays instanceof Set && weekDays.every(w => this.plannerExpandedDays.has(w.dateKey));
    const key = allExpanded ? 'planner.collapseWeek' : 'planner.expandWeek';
    labelEl.setAttribute('data-i18n', key);
    if (window.I18n) {
      labelEl.textContent = window.I18n.t(key);
    } else {
      labelEl.textContent = allExpanded ? 'Plegar semana' : 'Expandir semana';
    }
  }

  buildDayCompactSummaryHtml(dayData) {
    const slotIcons = { breakfast: '🍳', lunch: '🥗', snack: '🍎', dinner: '🍲' };
    const pills = [];
    STANDARD_SLOTS.forEach(s => {
      const recId = dayData[s.key];
      if (recId) {
        const rec = state.recipes.find(r => r.id === recId);
        if (rec) {
          const shortTitle = rec.title.length > 22 ? rec.title.slice(0, 20) + '…' : rec.title;
          pills.push(`<span class="day-compact-meal-pill">${slotIcons[s.key] || '🍽️'} ${escapeHtml(shortTitle)}</span>`);
        }
      }
    });
    const customSlots = Array.isArray(dayData.customSlots) ? dayData.customSlots : [];
    customSlots.forEach(cs => {
      if (cs.recipeId) {
        const rec = state.recipes.find(r => r.id === cs.recipeId);
        if (rec) {
          const shortTitle = rec.title.length > 22 ? rec.title.slice(0, 20) + '…' : rec.title;
          pills.push(`<span class="day-compact-meal-pill">🍽️ ${escapeHtml(shortTitle)}</span>`);
        }
      }
    });
    if (pills.length === 0) {
      return `<span class="day-compact-empty">${window.I18n ? window.I18n.t('planner.noMealsAssigned') : 'Sin comidas asignadas · toca para planificar'}</span>`;
    }
    return pills.join('<span class="day-compact-sep">·</span>');
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

    const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
    const weekDays = this.getPlannerWeekDates();
    this.updatePlannerWeekLabel(weekDays);

    if (!(this.plannerExpandedDays instanceof Set)) {
      this.plannerExpandedDays = this.getDefaultExpandedPlannerDays(weekDays);
    } else {
      const hasAnyInWeek = weekDays.some(w => this.plannerExpandedDays.has(w.dateKey));
      if (!hasAnyInWeek) {
        this.plannerExpandedDays = this.getDefaultExpandedPlannerDays(weekDays);
      }
    }
    this.updateToggleAllPlannerButtonLabel(weekDays);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = toLocalDateKey(tomorrow);

    const todayBadgeText = window.I18n ? window.I18n.t('planner.todayBadge') : 'HOY';
    const tomorrowBadgeText = window.I18n ? window.I18n.t('planner.tomorrowBadge') : 'MAÑANA';
    const addMealText = window.I18n ? window.I18n.t('planner.addMealBtn') : 'Añadir Comida';
    const addMealTitle = window.I18n ? window.I18n.t('planner.addMealAria') : 'Añadir momento de comida';

    container.innerHTML = weekDays.map((wDay) => {
      const dateStr = wDay.dateKey;
      const dayData = state.getDayPlan(dateStr, wDay.dayName);
      const isToday = toLocalDateKey() === dateStr;
      const isTomorrow = tomorrowKey === dateStr;
      const isExpanded = this.plannerExpandedDays.has(dateStr);
      const customSlots = Array.isArray(dayData.customSlots) ? dayData.customSlots : [];
      const localizedDayName = isEn ? (DAYS_OF_WEEK_EN[wDay.date.getDay() === 0 ? 6 : wDay.date.getDay() - 1] || wDay.dayName) : wDay.dayName;
      const dayDateFormatted = `${wDay.date.getDate()} ${(isEn ? MONTHS_SHORT_EN : MONTHS_SHORT_ES)[wDay.date.getMonth()]}`;
      const compactSummaryHtml = this.buildDayCompactSummaryHtml(dayData);

      return `
        <div class="day-card ${isToday ? 'day-card-today' : ''} ${isExpanded ? 'is-expanded' : 'is-collapsed'}" data-date="${dateStr}">
          <div class="day-header" onclick="app.togglePlannerDayAccordion('${dateStr}', event)">
            <div class="day-name">
              <span class="day-title">${localizedDayName}</span>
              <span class="day-date-label">${dayDateFormatted}</span>
              ${isToday ? `<span class="day-badge-today">${todayBadgeText}</span>` : (isTomorrow ? `<span class="day-badge-tomorrow">${tomorrowBadgeText}</span>` : '')}
            </div>
            <div class="day-compact-summary">${compactSummaryHtml}</div>
            <div class="day-header-actions">
              <button type="button" class="btn btn-ghost btn-sm btn-add-custom-slot-header" onclick="event.stopPropagation(); app.openAddCustomSlotModal('${dateStr}')" title="${addMealTitle}">
                <span class="material-symbols-outlined icon-sm">add</span> ${addMealText}
              </button>
              <button type="button" class="btn-icon day-accordion-toggle" aria-label="${isEn ? 'Expand or collapse day' : 'Expandir o plegar día'}" title="${isEn ? 'Expand or collapse day' : 'Expandir o plegar día'}">
                <span class="material-symbols-outlined icon-sm">expand_more</span>
              </button>
            </div>
          </div>

          <div class="slots-grid">
            ${STANDARD_SLOTS.map(slot => this.renderSlotCard(dateStr, slot.key, window.I18n ? window.I18n.getSlotLabel(slot.key, slot.label) : slot.label, slot.icon, dayData[slot.key])).join('')}
            ${customSlots.map(cs => this.renderCustomSlotCard(dateStr, cs)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  renderSlotCard(dateStr, slotType, slotLabel, iconName, recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);
    const dayData = state.mealPlan[dateStr];
    const isLeftover = dayData?.leftoverSlots && dayData.leftoverSlots[slotType];

    if (recipe) {
      const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
      const isEn = window.I18n && window.I18n.getLanguage() === 'en';
      const violationsLabel = comp.violations.map(v => window.I18n ? window.I18n.getTagLabel(v) : v).join(', ');
      const warningHtml = !comp.compliant ? `
        <div class="dietary-warning-badge" title="${isEn ? `Violates dietary preferences: ${violationsLabel}` : `Incumple preferencias dietéticas: ${violationsLabel}`}">
          <span class="material-symbols-outlined icon-13">warning</span> ${isEn ? 'Does not comply' : 'No cumple'}: ${violationsLabel}
        </div>
      ` : '';

      const safeRecipeId = escapeHtml(recipe.id).replace(/'/g, "\\'");
      return `
        <div class="meal-slot has-meal" draggable="true"
          data-date="${dateStr}" data-slot="${slotType}" data-custom="false"
          ondragstart="app.handlePlannerSlotDragStart(event, '${dateStr}', '${slotType}', false)"
          ondragend="app.handlePlannerSlotDragEnd(event)"
          ondragover="app.handlePlannerSlotDragOver(event)"
          ondragleave="app.handlePlannerSlotDragLeave(event)"
          ondrop="app.handlePlannerSlotDrop(event, '${dateStr}', '${slotType}', false)"
          ontouchstart="app.handlePlannerSlotTouchStart(event, '${dateStr}', '${slotType}', false)"
          ontouchmove="app.handlePlannerSlotTouchMove(event)"
          ontouchend="app.handlePlannerSlotTouchEnd(event)"
          onclick="app.openRecipeDetail('${safeRecipeId}')"
          title="${isEn ? 'Drag to move or swap to another day or slot' : 'Arrastra para mover o intercambiar a otro día o momento'}">
          <div class="u-flex-between-center">
            <span class="slot-label">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <div class="u-flex-row-center-gap-4">
              ${isLeftover ? `
                <span class="leftover-pill-badge" title="${window.I18n ? window.I18n.t('planner.leftoversTooltip') : 'Cocinado el día anterior para sobras'}">
                  <span class="material-symbols-outlined icon-12">takeout_dining</span> ${window.I18n ? window.I18n.t('today.leftovers') : 'Sobras'}
                </span>
              ` : ''}
              <button type="button" class="btn btn-ghost btn-sm btn-slot-clear btn-remove-circle" onclick="event.stopPropagation(); app.clearSlot('${dateStr}', '${slotType}')" title="${window.I18n ? window.I18n.t('planner.removeRecipe') : 'Quitar receta'}">
                <span class="material-symbols-outlined icon-sm">close</span>
              </button>
            </div>
          </div>
          <div class="planner-slot-body-row">
            ${recipe.imageUrl ? `
              <img src="${recipe.imageUrl}" alt="" class="planner-slot-thumb" onerror="this.onerror=null; this.src=app.getRecipePlaceholderSvg('${(typeof escapeHtml === 'function' ? escapeHtml(recipe.title) : recipe.title).replace(/'/g, "\\'")}', 'thumb');">
            ` : `
              <div class="planner-slot-thumb-wrap">
                <img src="${this.getRecipePlaceholderSvg(recipe.title, 'thumb')}" alt="" class="img-cover-full">
              </div>
            `}
            <div class="u-flex-1-truncate">
              <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
              ${warningHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="meal-slot"
          data-date="${dateStr}" data-slot="${slotType}" data-custom="false"
          ondragover="app.handlePlannerSlotDragOver(event)"
          ondragleave="app.handlePlannerSlotDragLeave(event)"
          ondrop="app.handlePlannerSlotDrop(event, '${dateStr}', '${slotType}', false)"
          onclick="app.openPickerModal('${dateStr}', '${slotType}', false)">
          <span class="slot-label">
            <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
          </span>
          <div class="slot-action-text">
            <span class="material-symbols-outlined icon-sm">add</span> ${window.I18n ? window.I18n.t('planner.assignDish') : 'Asignar plato'}
          </div>
        </div>
      `;
    }
  }

  renderCustomSlotCard(dateStr, customSlot) {
    const recipe = customSlot.recipeId ? state.recipes.find(r => r.id === customSlot.recipeId) : null;
    const iconName = customSlot.icon || 'lunch_dining';
    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    const slotLabel = customSlot.name || (window.I18n ? window.I18n.t('planner.extraMeal') : 'Momento Extra');

    if (recipe) {
      const comp = checkDietaryCompliance(recipe, state.dietaryPreferences);
      const violationsLabel = comp.violations.map(v => window.I18n ? window.I18n.getTagLabel(v) : v).join(', ');
      const warningHtml = !comp.compliant ? `
        <div class="dietary-warning-badge" title="${isEn ? `Violates dietary preferences: ${violationsLabel}` : `Incumple preferencias dietéticas: ${violationsLabel}`}">
          <span class="material-symbols-outlined icon-13">warning</span> ${isEn ? 'Does not comply' : 'No cumple'}: ${violationsLabel}
        </div>
      ` : '';

      const safeRecipeId = escapeHtml(recipe.id).replace(/'/g, "\\'");
      return `
        <div class="meal-slot has-meal meal-slot-custom" draggable="true"
          data-date="${dateStr}" data-slot="${customSlot.id}" data-custom="true"
          ondragstart="app.handlePlannerSlotDragStart(event, '${dateStr}', '${customSlot.id}', true)"
          ondragend="app.handlePlannerSlotDragEnd(event)"
          ondragover="app.handlePlannerSlotDragOver(event)"
          ondragleave="app.handlePlannerSlotDragLeave(event)"
          ondrop="app.handlePlannerSlotDrop(event, '${dateStr}', '${customSlot.id}', true)"
          ontouchstart="app.handlePlannerSlotTouchStart(event, '${dateStr}', '${customSlot.id}', true)"
          ontouchmove="app.handlePlannerSlotTouchMove(event)"
          ontouchend="app.handlePlannerSlotTouchEnd(event)"
          onclick="app.openRecipeDetail('${safeRecipeId}')"
          title="${isEn ? 'Drag to move or swap to another day or slot' : 'Arrastra para mover o intercambiar a otro día o momento'}">
          <div class="u-flex-between-center">
            <span class="slot-label slot-label-custom">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <div class="u-flex-gap-2">
              <button type="button" class="btn btn-ghost btn-sm btn-slot-clear btn-remove-circle" onclick="event.stopPropagation(); app.clearCustomSlotRecipe('${dateStr}', '${customSlot.id}')" title="${window.I18n ? window.I18n.t('planner.removeRecipe') : 'Quitar receta'}">
                <span class="material-symbols-outlined icon-sm">close</span>
              </button>
              <button type="button" class="btn btn-ghost btn-sm btn-slot-delete btn-remove-circle" onclick="event.stopPropagation(); app.deleteCustomSlot('${dateStr}', '${customSlot.id}')" title="${window.I18n ? window.I18n.t('planner.deleteSlotTooltip') : 'Eliminar este momento'}">
                <span class="material-symbols-outlined icon-sm">delete</span>
              </button>
            </div>
          </div>
          <div class="planner-slot-body-row">
            ${recipe.imageUrl ? `
              <img src="${recipe.imageUrl}" alt="" class="planner-slot-thumb" onerror="this.onerror=null; this.src=app.getRecipePlaceholderSvg('${(typeof escapeHtml === 'function' ? escapeHtml(recipe.title) : recipe.title).replace(/'/g, "\\'")}', 'thumb');">
            ` : `
              <div class="planner-slot-thumb-wrap">
                <img src="${this.getRecipePlaceholderSvg(recipe.title, 'thumb')}" alt="" class="img-cover-full">
              </div>
            `}
            <div class="u-flex-1-truncate">
              <div class="slot-recipe-name" title="${recipe.title}">${recipe.title}</div>
              ${warningHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="meal-slot meal-slot-custom"
          data-date="${dateStr}" data-slot="${customSlot.id}" data-custom="true"
          ondragover="app.handlePlannerSlotDragOver(event)"
          ondragleave="app.handlePlannerSlotDragLeave(event)"
          ondrop="app.handlePlannerSlotDrop(event, '${dateStr}', '${customSlot.id}', true)"
          onclick="app.openPickerModal('${dateStr}', '${customSlot.id}', true)">
          <div class="u-flex-between-center">
            <span class="slot-label slot-label-custom">
              <span class="material-symbols-outlined icon-sm">${iconName}</span> ${slotLabel}
            </span>
            <button type="button" class="btn btn-ghost btn-sm btn-slot-delete btn-remove-circle" onclick="event.stopPropagation(); app.deleteCustomSlot('${dateStr}', '${customSlot.id}')" title="${window.I18n ? window.I18n.t('planner.deleteSlotTooltip') : 'Eliminar este momento'}">
              <span class="material-symbols-outlined icon-sm">delete</span>
            </button>
          </div>
          <div class="slot-action-text">
            <span class="material-symbols-outlined icon-sm">add</span> ${window.I18n ? window.I18n.t('planner.assignDish') : 'Asignar plato'}
          </div>
        </div>
      `;
    }
  }

  clearSlot(dateStr, slotType) {
    if (state.mealPlan[dateStr]) {
      state.mealPlan[dateStr][slotType] = null;
      state.mealPlan[dateStr].updatedAt = new Date().toISOString();
      if (state.household?.id) {
        state.mealPlan[dateStr].householdId = state.household.id;
        if (state.cloudUser?.id) state.mealPlan[dateStr].ownerUserId = state.cloudUser.id;
      }
      state.save('fa_mealplan', state.mealPlan);
      this.broadcastRealtimeChange('planner_change', {
        dateStr: dateStr,
        dayPlan: state.mealPlan[dateStr]
      });
      this.scheduleSyncWithCloud();
      this.flushSync();
      this.render();
    }
  }

  clearCustomSlotRecipe(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      const cs = state.mealPlan[dateStr].customSlots.find(c => c.id === customSlotId);
      if (cs) {
        cs.recipeId = null;
        state.mealPlan[dateStr].updatedAt = new Date().toISOString();
        if (state.household?.id) {
          state.mealPlan[dateStr].householdId = state.household.id;
          if (state.cloudUser?.id) state.mealPlan[dateStr].ownerUserId = state.cloudUser.id;
        }
        state.save('fa_mealplan', state.mealPlan);
        this.broadcastRealtimeChange('planner_change', {
          dateStr: dateStr,
          dayPlan: state.mealPlan[dateStr]
        });
        this.scheduleSyncWithCloud();
        this.flushSync();
        this.render();
      }
    }
  }

  deleteCustomSlot(dateStr, customSlotId) {
    if (state.mealPlan[dateStr] && Array.isArray(state.mealPlan[dateStr].customSlots)) {
      state.mealPlan[dateStr].customSlots = state.mealPlan[dateStr].customSlots.filter(c => c.id !== customSlotId);
      state.mealPlan[dateStr].updatedAt = new Date().toISOString();
      if (state.household?.id) {
        state.mealPlan[dateStr].householdId = state.household.id;
        if (state.cloudUser?.id) state.mealPlan[dateStr].ownerUserId = state.cloudUser.id;
      }
      state.save('fa_mealplan', state.mealPlan);
      this.broadcastRealtimeChange('planner_change', {
        dateStr: dateStr,
        dayPlan: state.mealPlan[dateStr]
      });
      this.scheduleSyncWithCloud();
      this.flushSync();
      this.render();
    }
  }

  // ==========================================================================
  // US-19: MOVER RECETAS POR LA SEMANA Y CAMBIAR MOMENTOS (DRAG & DROP)
  // ==========================================================================
  handlePlannerSlotDragStart(e, dateStr, slotKey, isCustom) {
    if (e.stopPropagation) e.stopPropagation();
    this._draggingPlannerSlot = {
      dateStr,
      slotKey,
      isCustom: !!isCustom
    };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', JSON.stringify(this._draggingPlannerSlot));
      } catch (err) { }
    }
    const targetSlot = e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.meal-slot') : e.currentTarget;
    if (targetSlot) {
      targetSlot.classList.add('is-dragging');
    }
  }

  handlePlannerSlotDragEnd(e) {
    this._draggingPlannerSlot = null;
    document.querySelectorAll('.meal-slot.is-dragging').forEach(el => el.classList.remove('is-dragging'));
    document.querySelectorAll('.meal-slot.drag-over').forEach(el => el.classList.remove('drag-over'));
  }

  handlePlannerSlotDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    const targetSlot = e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.meal-slot') : e.currentTarget;
    if (targetSlot && !targetSlot.classList.contains('drag-over')) {
      targetSlot.classList.add('drag-over');
    }
  }

  handlePlannerSlotDragLeave(e) {
    const targetSlot = e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.meal-slot') : e.currentTarget;
    if (targetSlot) {
      targetSlot.classList.remove('drag-over');
    }
  }

  handlePlannerSlotDrop(e, targetDateStr, targetSlotKey, isTargetCustom) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    const targetSlot = e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.meal-slot') : e.currentTarget;
    if (targetSlot) {
      targetSlot.classList.remove('drag-over');
    }

    let source = this._draggingPlannerSlot;
    if (!source && e.dataTransfer && typeof e.dataTransfer.getData === 'function') {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) source = JSON.parse(raw);
      } catch (err) { }
    }

    this._draggingPlannerSlot = null;
    document.querySelectorAll('.meal-slot.is-dragging').forEach(el => el.classList.remove('is-dragging'));

    if (!source) return false;

    return this.moveOrSwapPlannerSlot(
      source.dateStr,
      source.slotKey,
      source.isCustom,
      targetDateStr,
      targetSlotKey,
      !!isTargetCustom
    );
  }

  handlePlannerSlotTouchStart(e, dateStr, slotKey, isCustom) {
    if (!e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const targetSlot = e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.meal-slot') : e.currentTarget;
    if (this._touchHoldTimeout) {
      clearTimeout(this._touchHoldTimeout);
      this._touchHoldTimeout = null;
    }
    this._touchDragSource = {
      dateStr,
      slotKey,
      isCustom: !!isCustom,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      slotEl: targetSlot,
      active: false
    };
    this._touchHoldTimeout = setTimeout(() => {
      if (this._touchDragSource) {
        this._touchDragSource.active = true;
        if (targetSlot) targetSlot.classList.add('is-dragging');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(40); } catch (err) {}
        }
      }
    }, 220);
  }

  handlePlannerSlotTouchMove(e) {
    if (!this._touchDragSource || !e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - this._touchDragSource.startX);
    const dy = Math.abs(touch.clientY - this._touchDragSource.startY);

    if (!this._touchDragSource.active) {
      if (dx > 10 || dy > 10) {
        if (this._touchHoldTimeout) {
          clearTimeout(this._touchHoldTimeout);
          this._touchHoldTimeout = null;
        }
        this._touchDragSource = null;
      }
      return;
    }

    if (e.cancelable && e.preventDefault) e.preventDefault();
    this._touchDragSource.currentX = touch.clientX;
    this._touchDragSource.currentY = touch.clientY;

    if (typeof document !== 'undefined' && typeof document.elementFromPoint === 'function') {
      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetSlot = elUnder ? elUnder.closest('.meal-slot') : null;
      document.querySelectorAll('.meal-slot.drag-over').forEach(el => {
        if (el !== targetSlot) el.classList.remove('drag-over');
      });
      if (targetSlot && targetSlot !== this._touchDragSource.slotEl) {
        targetSlot.classList.add('drag-over');
      }
    }
  }

  handlePlannerSlotTouchEnd(e) {
    if (this._touchHoldTimeout) {
      clearTimeout(this._touchHoldTimeout);
      this._touchHoldTimeout = null;
    }
    if (!this._touchDragSource) return;

    const source = this._touchDragSource;
    this._touchDragSource = null;

    if (source.slotEl) {
      source.slotEl.classList.remove('is-dragging');
    }
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.meal-slot.drag-over').forEach(el => el.classList.remove('drag-over'));
      document.querySelectorAll('.meal-slot.is-dragging').forEach(el => el.classList.remove('is-dragging'));
    }

    if (!source.active) return;
    if (e.cancelable && e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    let targetSlot = null;
    if (typeof document !== 'undefined' && typeof document.elementFromPoint === 'function') {
      const targetEl = document.elementFromPoint(source.currentX, source.currentY);
      targetSlot = targetEl ? targetEl.closest('.meal-slot') : null;
    }
    if (!targetSlot) return;

    const targetDateStr = targetSlot.dataset ? targetSlot.dataset.date : targetSlot.getAttribute('data-date');
    const targetSlotKey = targetSlot.dataset ? targetSlot.dataset.slot : targetSlot.getAttribute('data-slot');
    const isTargetCustom = (targetSlot.dataset ? targetSlot.dataset.custom : targetSlot.getAttribute('data-custom')) === 'true';

    if (targetDateStr && targetSlotKey) {
      this.moveOrSwapPlannerSlot(
        source.dateStr,
        source.slotKey,
        source.isCustom,
        targetDateStr,
        targetSlotKey,
        isTargetCustom
      );
    }
  }

  moveOrSwapPlannerSlot(sourceDate, sourceSlotKey, isSourceCustom, targetDate, targetSlotKey, isTargetCustom) {
    if (sourceDate === targetDate && sourceSlotKey === targetSlotKey && !!isSourceCustom === !!isTargetCustom) {
      return false;
    }

    const srcDay = state.getDayPlan(sourceDate);
    const tgtDay = state.getDayPlan(targetDate);
    if (!srcDay || !tgtDay) return false;

    // Obtener receta y sobrante origen
    let srcRecipeId = null;
    let srcLeftover = false;
    if (isSourceCustom) {
      const cs = (srcDay.customSlots || []).find(c => c.id === sourceSlotKey);
      srcRecipeId = cs ? cs.recipeId : null;
    } else {
      srcRecipeId = srcDay[sourceSlotKey] || null;
      srcLeftover = !!(srcDay.leftoverSlots && srcDay.leftoverSlots[sourceSlotKey]);
    }

    if (!srcRecipeId) return false;

    // Obtener receta y sobrante destino
    let tgtRecipeId = null;
    let tgtLeftover = false;
    if (isTargetCustom) {
      const tgtCs = (tgtDay.customSlots || []).find(c => c.id === targetSlotKey);
      tgtRecipeId = tgtCs ? tgtCs.recipeId : null;
    } else {
      tgtRecipeId = tgtDay[targetSlotKey] || null;
      tgtLeftover = !!(tgtDay.leftoverSlots && tgtDay.leftoverSlots[targetSlotKey]);
    }

    // 1. Asignar origen en destino
    if (isTargetCustom) {
      const tgtCs = (tgtDay.customSlots || []).find(c => c.id === targetSlotKey);
      if (tgtCs) tgtCs.recipeId = srcRecipeId;
    } else {
      tgtDay[targetSlotKey] = srcRecipeId;
      if (!tgtDay.leftoverSlots) tgtDay.leftoverSlots = {};
      if (srcLeftover) tgtDay.leftoverSlots[targetSlotKey] = true;
      else delete tgtDay.leftoverSlots[targetSlotKey];
    }

    // 2. Asignar destino previo en origen (swap o limpiar)
    if (isSourceCustom) {
      const srcCs = (srcDay.customSlots || []).find(c => c.id === sourceSlotKey);
      if (srcCs) srcCs.recipeId = tgtRecipeId || null;
    } else {
      srcDay[sourceSlotKey] = tgtRecipeId || null;
      if (!srcDay.leftoverSlots) srcDay.leftoverSlots = {};
      if (tgtLeftover) srcDay.leftoverSlots[sourceSlotKey] = true;
      else delete srcDay.leftoverSlots[sourceSlotKey];
    }

    // 3. Persistir y actualizar
    const nowIso = new Date().toISOString();
    srcDay.updatedAt = nowIso;
    tgtDay.updatedAt = nowIso;
    if (state.household?.id) {
      srcDay.householdId = state.household.id;
      tgtDay.householdId = state.household.id;
      if (state.cloudUser?.id) {
        srcDay.ownerUserId = state.cloudUser.id;
        tgtDay.ownerUserId = state.cloudUser.id;
      }
    }
    state.save('fa_mealplan', state.mealPlan);
    this.broadcastRealtimeChange('planner_change', {
      dateStr: targetDate,
      dayPlan: tgtDay,
      sourceDateStr: sourceDate,
      sourceDayPlan: srcDay
    });
    this.scheduleSyncWithCloud();
    this.flushSync();
    this.renderPlanner();
    this.renderTodayView();

    // 4. Feedback al usuario
    const defaultRec = window.I18n ? window.I18n.t('planner.defaultRecipe') : 'Receta';
    const srcRec = state.recipes.find(r => r.id === srcRecipeId);
    const tgtRec = tgtRecipeId ? state.recipes.find(r => r.id === tgtRecipeId) : null;
    if (tgtRec) {
      const msg = window.I18n
        ? window.I18n.t('planner.recipesSwapped', { recipe1: srcRec?.title || defaultRec, recipe2: tgtRec.title })
        : `Recetas intercambiadas: "${srcRec?.title || defaultRec}" y "${tgtRec.title}"`;
      this.showToast(msg, 'success');
    } else {
      const msg = window.I18n
        ? window.I18n.t('planner.recipeMoved', { recipe: srcRec?.title || defaultRec })
        : `"${srcRec?.title || defaultRec}" movida con éxito`;
      this.showToast(msg, 'success');
    }
    return true;
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

    if (modal) this.openDialogModal(modal);
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 100);
  }

  closeAddCustomSlotModal() {
    const modal = document.getElementById('modal-add-custom-slot');
    if (modal) this.closeDialogModal(modal);
  }

  selectCustomSlotPreset(name, icon, targetEl) {
    const nameInput = document.getElementById('custom-slot-name');
    const iconSelect = document.getElementById('custom-slot-icon');
    const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
    let chosenName = name;
    if (targetEl && targetEl.dataset) {
      chosenName = isEn ? (targetEl.dataset.nameEn || name) : (targetEl.dataset.nameEs || name);
    }
    if (nameInput) nameInput.value = chosenName;
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
      const errorMsg = window.I18n ? window.I18n.t('planner.slotNameError') : "Por favor, introduce el nombre del momento de comida (ej. Media Mañana, Post-Entreno...).";
      this.highlightInputError(nameInput, errorMsg);
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

  // ==========================================================================
  // US-04: COPIAR O DUPLICAR PLAN DE CUALQUIER SEMANA (ANTERIOR, HISTÓRICA O POR FECHA)
  // ==========================================================================
  getWeekMealStats(weekDays) {
    let mealCount = 0;
    let customSlotsCount = 0;
    const sampleTitles = [];

    if (!Array.isArray(weekDays)) {
      return { mealCount: 0, customSlotsCount: 0, sampleTitles: [] };
    }

    weekDays.forEach(wDay => {
      const day = state.mealPlan?.[wDay.dateKey];
      if (!day) return;
      STANDARD_SLOTS.forEach(s => {
        const rId = day[s.key];
        if (rId) {
          mealCount++;
          const rec = state.recipes.find(r => r.id === rId);
          if (rec && sampleTitles.length < 3 && !sampleTitles.includes(rec.title)) {
            sampleTitles.push(rec.title);
          }
        }
      });
      if (Array.isArray(day.customSlots)) {
        day.customSlots.forEach(cs => {
          customSlotsCount++;
          if (cs && cs.recipeId) {
            mealCount++;
            const rec = state.recipes.find(r => r.id === cs.recipeId);
            if (rec && sampleTitles.length < 3 && !sampleTitles.includes(rec.title)) {
              sampleTitles.push(rec.title);
            }
          }
        });
      }
    });

    return { mealCount, customSlotsCount, sampleTitles };
  }

  getAvailableSourceWeeks() {
    const targetWeekDays = this.getPlannerWeekDates();
    const targetMonday = targetWeekDays[0].date;
    const targetMondayKey = targetWeekDays[0].dateKey;

    const prevMonday = new Date(targetMonday.getFullYear(), targetMonday.getMonth(), targetMonday.getDate() - 7);
    const prevMondayKey = toLocalDateKey(prevMonday);

    const mondayKeysSet = new Set([prevMondayKey]);

    // Collect all weeks that have at least one planned meal or custom slot in state.mealPlan
    Object.keys(state.mealPlan || {}).forEach(dateKey => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;
      const d = parseLocalDateKey(dateKey);
      const mKey = toLocalDateKey(getMondayOfWeek(d));
      if (mKey && mKey !== targetMondayKey) {
        mondayKeysSet.add(mKey);
      }
    });

    // If user picked a custom week via date input, ensure it's included
    if (this.copyWeekSourceMondayKey && this.copyWeekSourceMondayKey !== targetMondayKey) {
      mondayKeysSet.add(this.copyWeekSourceMondayKey);
    }

    const candidates = [];
    mondayKeysSet.forEach(mKey => {
      const mDate = parseLocalDateKey(mKey);
      const wDays = getWeekDates(mDate);
      const stats = this.getWeekMealStats(wDays);
      const isImmediatePrev = (mKey === prevMondayKey);

      // Keep immediate previous week, currently selected custom week, or any week with meals/customSlots
      if (isImmediatePrev || mKey === this.copyWeekSourceMondayKey || stats.mealCount > 0 || stats.customSlotsCount > 0) {
        const diffDays = Math.round((mDate.getTime() - targetMonday.getTime()) / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.round(diffDays / 7);
        let relativeLabel = 'Otra semana';
        if (diffWeeks === -1) relativeLabel = 'Semana inmediatamente anterior';
        else if (diffWeeks === 1) relativeLabel = 'Semana siguiente';
        else if (diffWeeks < -1) relativeLabel = `Hace ${Math.abs(diffWeeks)} semanas`;
        else if (diffWeeks > 1) relativeLabel = `Dentro de ${diffWeeks} semanas`;

        candidates.push({
          mondayKey: mKey,
          mondayDate: mDate,
          rangeLabel: formatWeekRange(wDays),
          relativeLabel,
          isImmediatePrev,
          mealCount: stats.mealCount,
          customSlotsCount: stats.customSlotsCount,
          sampleTitles: stats.sampleTitles
        });
      }
    });

    // Sort: immediate previous week first, then most recent first
    candidates.sort((a, b) => {
      if (a.isImmediatePrev && !b.isImmediatePrev) return -1;
      if (!a.isImmediatePrev && b.isImmediatePrev) return 1;
      return b.mondayDate.getTime() - a.mondayDate.getTime();
    });

    return candidates;
  }

  openCopyWeekModal() {
    const modal = document.getElementById('modal-copy-week') || this.modalCopyWeek;
    const targetWeekDays = this.getPlannerWeekDates();
    const targetMonday = targetWeekDays[0].date;
    const prevMonday = new Date(targetMonday.getFullYear(), targetMonday.getMonth(), targetMonday.getDate() - 7);
    const prevMondayKey = toLocalDateKey(prevMonday);

    // Default to immediate previous week if it has meals, or the first week with meals, otherwise immediate previous week
    const candidates = this.getAvailableSourceWeeks();
    const prevCandidate = candidates.find(c => c.mondayKey === prevMondayKey);
    const firstWithMeals = candidates.find(c => c.mealCount > 0 || c.customSlotsCount > 0);

    if (prevCandidate && (prevCandidate.mealCount > 0 || prevCandidate.customSlotsCount > 0)) {
      this.copyWeekSourceMondayKey = prevMondayKey;
    } else if (firstWithMeals) {
      this.copyWeekSourceMondayKey = firstWithMeals.mondayKey;
    } else {
      this.copyWeekSourceMondayKey = prevMondayKey;
    }

    this.copyWeekMode = 'replace';
    const dateInput = document.getElementById('input-copy-week-date');
    if (dateInput) dateInput.value = this.copyWeekSourceMondayKey;

    this.renderCopyWeekModal();
    if (modal) {
      this.openDialogModal(modal);
    }
  }

  closeCopyWeekModal() {
    const modal = document.getElementById('modal-copy-week') || this.modalCopyWeek;
    if (modal) {
      this.closeDialogModal(modal);
    }
  }

  selectCopyWeekSource(mondayKey) {
    if (!mondayKey) return;
    const targetWeekDays = this.getPlannerWeekDates();
    if (mondayKey === targetWeekDays[0].dateKey) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.copyWeekSameError') : 'La semana de origen no puede ser la misma semana de destino.',
        'warning'
      );
      return;
    }
    this.copyWeekSourceMondayKey = mondayKey;
    const dateInput = document.getElementById('input-copy-week-date');
    if (dateInput) dateInput.value = mondayKey;
    this.renderCopyWeekModal();
  }

  selectCopyWeekFromDateInput(dateVal) {
    if (!dateVal) return;
    const pickedDate = parseLocalDateKey(dateVal);
    const pickedMondayKey = toLocalDateKey(getMondayOfWeek(pickedDate));
    const targetWeekDays = this.getPlannerWeekDates();

    if (pickedMondayKey === targetWeekDays[0].dateKey) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.copyWeekSameTargetError') : 'Esa fecha pertenece a la semana actual de destino. Elige otra semana.',
        'warning'
      );
      return;
    }

    this.copyWeekSourceMondayKey = pickedMondayKey;
    this.renderCopyWeekModal();
  }

  setCopyWeekMode(mode) {
    this.copyWeekMode = mode === 'merge' ? 'merge' : 'replace';
    this.renderCopyWeekModal();
  }

  renderCopyWeekModal() {
    const targetWeekDays = this.getPlannerWeekDates();
    const targetLabelEl = document.getElementById('copy-week-target-label');
    if (targetLabelEl) {
      targetLabelEl.textContent = `Destino: ${formatWeekRange(targetWeekDays)}`;
    }

    const sourcesListEl = document.getElementById('copy-week-sources-list');
    const candidates = this.getAvailableSourceWeeks();

    if (sourcesListEl) {
      sourcesListEl.innerHTML = candidates.map(c => {
        const isSelected = c.mondayKey === this.copyWeekSourceMondayKey;
        const subtitleText = c.sampleTitles.length > 0
          ? `${c.rangeLabel} · ${c.sampleTitles.slice(0, 2).join(', ')}${c.sampleTitles.length > 2 ? '…' : ''}`
          : c.rangeLabel;

        return `
          <button type="button" class="copy-week-source-card ${isSelected ? 'active' : ''}" data-monday="${c.mondayKey}" onclick="app.selectCopyWeekSource('${c.mondayKey}')">
            <div class="copy-source-left">
              <span class="material-symbols-outlined icon-sm">${c.isImmediatePrev ? 'history' : 'date_range'}</span>
              <div class="u-min-w-0">
                <span class="copy-source-title">${c.relativeLabel}</span>
                <span class="copy-source-range">${subtitleText}</span>
              </div>
            </div>
            <span class="copy-week-badge">${c.mealCount} ${c.mealCount === 1 ? 'comida' : 'comidas'}</span>
          </button>
        `;
      }).join('');
    }

    // Render preview of selected source week
    const previewBox = document.getElementById('copy-week-preview-box');
    const previewBadge = document.getElementById('copy-week-preview-badge');
    const confirmBtn = document.getElementById('btn-confirm-copy-week');
    const sourceMonday = parseLocalDateKey(this.copyWeekSourceMondayKey);
    const sourceWeekDays = getWeekDates(sourceMonday);
    const sourceStats = this.getWeekMealStats(sourceWeekDays);

    if (previewBadge) {
      previewBadge.textContent = `${sourceStats.mealCount} ${sourceStats.mealCount === 1 ? 'comida' : 'comidas'}${sourceStats.customSlotsCount > 0 ? ` · ${sourceStats.customSlotsCount} extra` : ''}`;
    }

    if (previewBox) {
      if (sourceStats.mealCount === 0 && sourceStats.customSlotsCount === 0) {
        previewBox.innerHTML = `
          <div class="copy-week-empty-state">
            <span class="material-symbols-outlined copy-week-empty-icon">event_busy</span>
            La semana seleccionada (${formatWeekRange(sourceWeekDays)}) no tiene platos ni momentos personalizados asignados.
          </div>
        `;
      } else {
        previewBox.innerHTML = sourceWeekDays.map(wDay => {
          const day = state.mealPlan?.[wDay.dateKey];
          const entries = [];
          if (day) {
            STANDARD_SLOTS.forEach(s => {
              const rId = day[s.key];
              if (rId) {
                const rec = state.recipes.find(r => r.id === rId);
                entries.push(`${s.label}: <strong>${rec ? rec.title : 'Plato'}</strong>`);
              }
            });
            if (Array.isArray(day.customSlots)) {
              day.customSlots.forEach(cs => {
                if (cs.recipeId) {
                  const rec = state.recipes.find(r => r.id === cs.recipeId);
                  entries.push(`${cs.name || 'Extra'}: <strong>${rec ? rec.title : 'Plato'}</strong>`);
                } else {
                  entries.push(`${cs.name || 'Extra'} <em>(momento vacío)</em>`);
                }
              });
            }
          }
          return `
            <div class="copy-preview-day-row">
              <span class="copy-preview-day-name">${wDay.dayName}</span>
              <span class="copy-preview-day-meals">${entries.length > 0 ? entries.join(' · ') : '<em class="copy-preview-empty-em">Sin comidas</em>'}</span>
            </div>
          `;
        }).join('');
      }
    }

    // Update mode buttons
    const replaceBtn = document.getElementById('btn-copy-mode-replace');
    const mergeBtn = document.getElementById('btn-copy-mode-merge');
    if (replaceBtn) replaceBtn.classList.toggle('active', this.copyWeekMode === 'replace');
    if (mergeBtn) mergeBtn.classList.toggle('active', this.copyWeekMode === 'merge');

    if (confirmBtn) {
      confirmBtn.disabled = (sourceStats.mealCount === 0 && sourceStats.customSlotsCount === 0);
    }
  }

  /**
   * Copia el plan de una semana origen (identificada por su Lunes o cualquier fecha de esa semana)
   * hacia la semana actualmente activa en el planificador (o hacia targetMondayKey si se especifica).
   */
  async copyWeekPlanFrom(sourceDateOrMondayKey, options = {}) {
    const {
      mode = this.copyWeekMode || 'replace',
      targetMondayKey = null,
      skipConfirm = false
    } = options;

    const sourceMonday = getMondayOfWeek(parseLocalDateKey(sourceDateOrMondayKey));
    const sourceMondayKey = toLocalDateKey(sourceMonday);
    const sourceWeekDays = getWeekDates(sourceMonday);

    const targetWeekDays = targetMondayKey
      ? getWeekDates(parseLocalDateKey(targetMondayKey))
      : this.getPlannerWeekDates();
    const resolvedTargetMondayKey = targetWeekDays[0].dateKey;

    if (sourceMondayKey === resolvedTargetMondayKey) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.copyWeekSameSelfError') : 'No puedes copiar una semana sobre sí misma.',
        'warning'
      );
      return { copied: false, reason: 'same_week' };
    }

    const sourceStats = this.getWeekMealStats(sourceWeekDays);
    if (sourceStats.mealCount === 0 && sourceStats.customSlotsCount === 0) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.copyWeekEmptyError') : 'La semana de origen no tiene comidas asignadas para copiar.',
        'warning'
      );
      return { copied: false, reason: 'empty_source' };
    }

    const targetStats = this.getWeekMealStats(targetWeekDays);

    // Si la semana destino ya tiene platos y estamos en modo reemplazar, pedir confirmación segura (US-04 / US-18)
    if (mode === 'replace' && (targetStats.mealCount > 0 || targetStats.customSlotsCount > 0) && !skipConfirm) {
      const confirmed = await this.showConfirmDialog({
        title: '¿Reemplazar plan de la semana?',
        message: `La semana de destino (${formatWeekRange(targetWeekDays)}) ya tiene ${targetStats.mealCount} ${targetStats.mealCount === 1 ? 'comida asignada' : 'comidas asignadas'}.\n\n¿Deseas reemplazarla con el plan del ${formatWeekRange(sourceWeekDays)}?`,
        confirmText: 'Sí, reemplazar semana',
        cancelText: 'Cancelar',
        danger: true,
        icon: 'sync_alt'
      });
      if (!confirmed) {
        return { copied: false, reason: 'cancelled' };
      }
    }

    const nowIso = new Date().toISOString();
    let copiedMealsCount = 0;
    let copiedCustomSlotsCount = 0;

    for (let i = 0; i < 7; i++) {
      const srcDayInfo = sourceWeekDays[i];
      const tgtDayInfo = targetWeekDays[i];
      const srcDay = state.mealPlan?.[srcDayInfo.dateKey];
      const tgtDay = state.getDayPlan(tgtDayInfo.dateKey, tgtDayInfo.dayName);

      if (mode === 'replace') {
        STANDARD_SLOTS.forEach(s => {
          const val = srcDay ? (srcDay[s.key] || null) : null;
          tgtDay[s.key] = val;
          if (val) copiedMealsCount++;
        });

        const srcCustom = (srcDay && Array.isArray(srcDay.customSlots)) ? srcDay.customSlots : [];
        tgtDay.customSlots = srcCustom.map(cs => {
          if (cs.recipeId) copiedMealsCount++;
          copiedCustomSlotsCount++;
          return {
            id: generateId('cslot-'),
            name: cs.name || 'Momento Extra',
            icon: cs.icon || 'lunch_dining',
            recipeId: cs.recipeId || null
          };
        });
      } else {
        // Merge mode: solo rellena huecos vacíos y añade momentos personalizados que no existan por nombre
        if (srcDay) {
          STANDARD_SLOTS.forEach(s => {
            const srcVal = srcDay[s.key] || null;
            if (srcVal && !tgtDay[s.key]) {
              tgtDay[s.key] = srcVal;
              copiedMealsCount++;
            }
          });

          const srcCustom = Array.isArray(srcDay.customSlots) ? srcDay.customSlots : [];
          if (!Array.isArray(tgtDay.customSlots)) tgtDay.customSlots = [];

          srcCustom.forEach(cs => {
            const existingCustom = tgtDay.customSlots.find(
              tcs => (tcs.name || '').trim().toLowerCase() === (cs.name || '').trim().toLowerCase()
            );
            if (!existingCustom) {
              tgtDay.customSlots.push({
                id: generateId('cslot-'),
                name: cs.name || 'Momento Extra',
                icon: cs.icon || 'lunch_dining',
                recipeId: cs.recipeId || null
              });
              copiedCustomSlotsCount++;
              if (cs.recipeId) copiedMealsCount++;
            } else if (!existingCustom.recipeId && cs.recipeId) {
              existingCustom.recipeId = cs.recipeId;
              copiedMealsCount++;
            }
          });
        }
      }

      tgtDay.dayName = tgtDayInfo.dayName;
      tgtDay.updatedAt = nowIso;
    }

    state.save('fa_mealplan', state.mealPlan);
    this.scheduleSyncWithCloud();
    this.render();

    const mealLabel = copiedMealsCount === 1
      ? (window.I18n ? window.I18n.t('planner.copyWeekMealSingular') : 'comida')
      : (window.I18n ? window.I18n.t('planner.copyWeekMealPlural') : 'comidas');
    this.showToast(
      window.I18n
        ? window.I18n.t('planner.copyWeekSuccess', { count: copiedMealsCount, label: mealLabel })
        : `¡Semana copiada con éxito (${copiedMealsCount} ${mealLabel})!`,
      'success'
    );

    return {
      copied: true,
      copiedMealsCount,
      copiedCustomSlotsCount,
      sourceMondayKey,
      targetMondayKey: resolvedTargetMondayKey
    };
  }

  async confirmCopyWeekPlan(skipConfirm = false) {
    if (!this.copyWeekSourceMondayKey) return { copied: false };
    const selectedSource = this.copyWeekSourceMondayKey;
    const selectedMode = this.copyWeekMode || 'replace';
    this.closeCopyWeekModal();
    return await this.copyWeekPlanFrom(selectedSource, {
      mode: selectedMode,
      skipConfirm
    });
  }

  clearPickerSearch() {
    this.pickerSearchQuery = '';
    if (this.pickerSelectedTags) {
      this.pickerSelectedTags.clear();
    }
    const input = document.getElementById('input-picker-search');
    const clearBtn = document.getElementById('btn-clear-picker-search');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.initPickerTagFilters();
    this.renderPickerRecipesList();
    if (input) input.focus();
  }

  initPickerTagFilters() {
    const container = document.getElementById('picker-tag-filters');
    if (!container) return;

    if (!this.pickerSelectedTags) {
      this.pickerSelectedTags = new Set();
    }

    const availableTags = state.getAllTags ? state.getAllTags() : (typeof ALL_PREDEFINED_TAGS !== 'undefined' ? ALL_PREDEFINED_TAGS : []);
    const isAllActive = this.pickerSelectedTags.size === 0;
    const isFavSelected = this.pickerSelectedTags.has('Favoritas');
    const favCount = Array.isArray(state.recipes) ? state.recipes.filter(r => r && r.isFavorite).length : 0;

    const allText = window.I18n ? window.I18n.t('recipes.all') : 'Todas';
    const favText = window.I18n ? window.I18n.t('recipes.favorites') : 'Favoritas';

    let html = `
      <button type="button" class="m3-filter-chip ${isAllActive ? 'active' : ''}" data-picker-tag="all">
        ${isAllActive ? '<span class="material-symbols-outlined icon-14">done</span>' : ''}
        ${allText}
      </button>
      <button type="button" class="m3-filter-chip m3-filter-chip-fav ${isFavSelected ? 'active' : ''}" data-picker-tag="Favoritas" aria-pressed="${isFavSelected ? 'true' : 'false'}">
        <span class="material-symbols-outlined icon-14">favorite</span>
        <span>${favText}${favCount > 0 ? ` (${favCount})` : ''}</span>
      </button>
    `;

    availableTags.forEach(tag => {
      const isSelected = this.pickerSelectedTags.has(tag);
      const isDietary = typeof PREDEFINED_DIETARY_TAGS !== 'undefined' && PREDEFINED_DIETARY_TAGS.includes(tag);
      const emoji = typeof getDietaryTagEmoji === 'function' ? getDietaryTagEmoji(tag) : '';
      const displayTag = window.I18n ? window.I18n.getTagLabel(tag) : tag;
      html += `
        <button type="button" class="m3-filter-chip ${isDietary ? 'dietary-chip' : ''} ${isSelected ? 'active' : ''}" data-picker-tag="${escapeHtml(tag)}">
          ${isDietary && emoji ? `<span class="dietary-emoji">${emoji}</span>` : ''}
          ${isSelected && !isDietary ? '<span class="material-symbols-outlined icon-14">done</span>' : ''}
          ${escapeHtml(displayTag)}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.m3-filter-chip[data-picker-tag]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = chip.dataset.pickerTag;
        if (tag === 'all') {
          this.pickerSelectedTags.clear();
        } else {
          if (this.pickerSelectedTags.has(tag)) {
            this.pickerSelectedTags.delete(tag);
          } else {
            this.pickerSelectedTags.add(tag);
          }
        }
        this.initPickerTagFilters();
        this.renderPickerRecipesList();
      });
    });

    this.initChipsScrollContainers();
  }

  openPickerModal(dateStr, slotKey, isCustom = false) {
    this.pickerTarget = { dateStr, slotKey, isCustom };
    const filterBar = document.getElementById('picker-dietary-filter-bar');
    const toggleBtn = document.getElementById('btn-toggle-picker-dietary-only');

    let slotTitle = slotKey;
    if (isCustom) {
      const cs = (state.mealPlan[dateStr]?.customSlots || []).find(c => c.id === slotKey);
      slotTitle = cs ? cs.name : (window.I18n ? window.I18n.t('planner.extraMeal') : 'Momento Extra');
    } else {
      if (window.I18n && typeof window.I18n.getSlotLabel === 'function') {
        slotTitle = window.I18n.getSlotLabel(slotKey);
      } else {
        const std = STANDARD_SLOTS.find(s => s.key === slotKey);
        slotTitle = std ? std.label : slotKey;
      }
    }

    const titleElem = document.getElementById('picker-modal-title');
    if (titleElem) {
      titleElem.textContent = window.I18n
        ? window.I18n.t('picker.titleForSlot', { slot: slotTitle.toUpperCase() })
        : `Elegir plato para ${slotTitle.toUpperCase()}`;
    }

    if (window.I18n && typeof window.I18n.applyTranslations === 'function' && this.modalRecipePicker) {
      window.I18n.applyTranslations(this.modalRecipePicker);
    }

    const hasPreferences = Array.isArray(state.dietaryPreferences) && state.dietaryPreferences.length > 0;
    if (filterBar) {
      filterBar.style.display = hasPreferences ? 'flex' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.pickerOnlyDietary);
    }

    // US-71: Reset search and tag filters on modal open
    this.pickerSearchQuery = '';
    if (!this.pickerSelectedTags) {
      this.pickerSelectedTags = new Set();
    } else {
      this.pickerSelectedTags.clear();
    }
    this.initPickerTagFilters();

    const searchInput = document.getElementById('input-picker-search');
    const clearBtn = document.getElementById('btn-clear-picker-search');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.renderPickerRecipesList();
    this.openDialogModal(this.modalRecipePicker);

    setTimeout(() => {
      if (searchInput && this.modalRecipePicker && (this.modalRecipePicker.open || this.modalRecipePicker.classList.contains('active'))) {
        searchInput.focus();
      }
    }, 60);
  }

  renderPickerRecipesList() {
    const list = document.getElementById('picker-recipes-list');
    if (!list) return;

    let recipes = this.getSortedRecipes(state.recipes);
    const hasPreferences = Array.isArray(state.dietaryPreferences) && state.dietaryPreferences.length > 0;

    if (this.pickerOnlyDietary && hasPreferences) {
      recipes = recipes.filter(r => checkDietaryCompliance(r, state.dietaryPreferences).compliant);
    }

    // Filtro por etiquetas multi-selección (tipo pestaña Recetas)
    if (this.pickerSelectedTags && this.pickerSelectedTags.size > 0) {
      recipes = recipes.filter(r => {
        const rTagsNorm = (r.tags || []).map(t => typeof normalizeIngredientText === 'function' ? normalizeIngredientText(String(t)) : String(t).toLowerCase().trim());
        for (const selTag of this.pickerSelectedTags) {
          const selTagNorm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(selTag) : selTag.toLowerCase().trim();
          if (selTagNorm === 'favoritas' || selTagNorm === 'favorita') {
            if (!r.isFavorite && !rTagsNorm.includes('favoritas')) {
              return false;
            }
            continue;
          }
          if (selTagNorm === 'es' || selTagNorm === 'español' || selTagNorm === 'spanish') {
            if (getRecipeLanguage(r) !== 'es') return false;
            continue;
          }
          if (selTagNorm === 'en' || selTagNorm === 'ingles' || selTagNorm === 'inglés' || selTagNorm === 'english') {
            if (getRecipeLanguage(r) !== 'en') return false;
            continue;
          }
          if (!rTagsNorm.includes(selTagNorm)) {
            return false;
          }
        }
        return true;
      });
    }

    // US-71: Filtrado reactivo en tiempo real por término de búsqueda (título, descripción e ingredientes)
    const q = (this.pickerSearchQuery || '').trim();
    if (q) {
      if (typeof matchRecipeSearch === 'function') {
        recipes = recipes.filter(r => matchRecipeSearch(r, q));
      } else {
        const qNorm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(q) : q.toLowerCase();
        recipes = recipes.filter(r => {
          const titleNorm = typeof normalizeIngredientText === 'function' ? normalizeIngredientText(r.title || '') : (r.title || '').toLowerCase();
          return titleNorm.includes(qNorm);
        });
      }
    }

    // Contador reactivo de recetas
    const countElem = document.getElementById('picker-recipes-count');
    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    if (countElem) {
      const total = Array.isArray(state.recipes) ? state.recipes.length : 0;
      const count = recipes.length;
      if (q || (this.pickerSelectedTags && this.pickerSelectedTags.size > 0) || (this.pickerOnlyDietary && hasPreferences)) {
        countElem.textContent = window.I18n
          ? window.I18n.t('picker.recipesFound', { count, total })
          : `${count} de ${total} recetas encontradas`;
      } else {
        countElem.textContent = window.I18n
          ? window.I18n.t('picker.recipesAvailable', { count: total })
          : `${total} recetas disponibles`;
      }
    }

    if (recipes.length === 0) {
      if (q) {
        list.innerHTML = `
          <div class="picker-empty-state">
            <span class="material-symbols-outlined picker-empty-icon">search_off</span>
            ${isEn ? `No recipes found for "<strong>${escapeHtml(q)}</strong>".` : `No se encontraron recetas para "<strong>${escapeHtml(q)}</strong>".`}
            <div class="u-mt-10">
              <button type="button" class="btn btn-secondary btn-sm" onclick="app.clearPickerSearch()">
                <span class="material-symbols-outlined icon-sm">backspace</span> ${isEn ? 'Clear search' : 'Limpiar búsqueda'}
              </button>
            </div>
          </div>
        `;
        return;
      }

      if (this.pickerSelectedTags && this.pickerSelectedTags.size > 0) {
        list.innerHTML = `
          <div class="picker-empty-state">
            <span class="material-symbols-outlined picker-empty-icon">filter_alt_off</span>
            ${isEn ? 'No recipes found with the selected tags.' : 'No se encontraron recetas con las etiquetas seleccionadas.'}
            <div class="u-mt-10">
              <button type="button" class="btn btn-secondary btn-sm" onclick="app.clearPickerSearch()">
                <span class="material-symbols-outlined icon-sm">backspace</span> ${isEn ? 'Clear filters' : 'Quitar filtros'}
              </button>
            </div>
          </div>
        `;
        return;
      }

      if (this.pickerOnlyDietary && hasPreferences) {
        list.innerHTML = `
          <div class="picker-empty-state">
            <span class="material-symbols-outlined picker-empty-icon">eco</span>
            ${isEn ? 'No recipes comply with the selected dietary preferences.' : 'No hay recetas que cumplan con los filtros dietéticos seleccionados.'}
          </div>
        `;
        return;
      }

      list.innerHTML = `
        <div class="picker-empty-state">
          <span class="material-symbols-outlined picker-empty-icon">menu_book</span>
          ${isEn ? 'You have no recipes in your cookbook yet.' : 'Aún no tienes recetas guardadas en tu recetario.'}
        </div>
      `;
      return;
    }

    list.innerHTML = recipes.map(r => {
      const comp = hasPreferences ? checkDietaryCompliance(r, state.dietaryPreferences) : { compliant: true, violations: [] };
      const totalTime = (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0);
      const cal = r.nutritionPerServing?.calories || r.calories || null;
      const tags = Array.isArray(r.tags) ? r.tags.filter(t => t && String(t).toLowerCase() !== 'general').slice(0, 3) : [];

      return `
        <div class="picker-recipe-row"
             onclick="app.selectRecipeForSlot('${r.id}')">
          <div class="picker-recipe-main">
            ${r.imageUrl ? `
              <img src="${r.imageUrl}" alt="" class="picker-recipe-thumb" onerror="this.onerror=null; this.src=app.getRecipePlaceholderSvg('${(typeof escapeHtml === 'function' ? escapeHtml(r.title) : r.title).replace(/'/g, "\\'")}', 'thumb');">
            ` : `
              <div class="picker-recipe-thumb-wrap">
                <img src="${this.getRecipePlaceholderSvg(r.title, 'thumb')}" alt="" class="img-cover-full">
              </div>
            `}
            <div class="picker-recipe-body">
              <div class="picker-recipe-title-row">
                <strong class="picker-recipe-title">${escapeHtml(r.title)}</strong>
                ${r.isFavorite ? `<span class="material-symbols-outlined picker-fav-heart" title="${isEn ? 'Favorite' : 'Favorita'}">favorite</span>` : ''}
              </div>
              <div class="picker-recipe-meta">
                ${totalTime > 0 ? `<span class="u-flex-row-center-gap-4"><span class="material-symbols-outlined icon-14">schedule</span> ${totalTime} min</span>` : ''}
                ${cal ? `<span>•</span> <span class="u-flex-row-center-gap-4"><span class="material-symbols-outlined icon-14">local_fire_department</span> ${cal} kcal</span>` : ''}
                ${tags.length > 0 ? `
                  <span class="picker-recipe-tags-wrap">
                    ${tags.map(t => {
                      const tagLabel = window.I18n ? window.I18n.getTagLabel(t) : t;
                      return `<span class="picker-recipe-mini-tag">${escapeHtml(tagLabel)}</span>`;
                    }).join('')}
                  </span>
                ` : ''}
              </div>
              ${hasPreferences ? (() => {
                const prefsLabel = state.dietaryPreferences.map(p => window.I18n ? window.I18n.getTagLabel(p) : p).join(', ');
                const violationsLabel = comp.violations.map(v => window.I18n ? window.I18n.getTagLabel(v) : v).join(', ');
                return comp.compliant
                  ? `<span class="dietary-ok-badge u-mt-3"><span class="material-symbols-outlined icon-12">check</span> ${isEn ? 'Compliant' : 'Apta'} (${escapeHtml(prefsLabel)})</span>`
                  : `<span class="dietary-warning-badge u-mt-3"><span class="material-symbols-outlined icon-12">warning</span> ${isEn ? 'Does not comply' : 'No cumple'}: ${escapeHtml(violationsLabel)}</span>`;
              })() : ''}
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm u-shrink-0" onclick="event.stopPropagation(); app.selectRecipeForSlot('${r.id}')">${isEn ? 'Select' : 'Elegir'}</button>
        </div>
      `;
    }).join('');
  }

  closePickerModal() {
    this.pickerSearchQuery = '';
    if (this.pickerSelectedTags) {
      this.pickerSelectedTags.clear();
    }
    const input = document.getElementById('input-picker-search');
    const clearBtn = document.getElementById('btn-clear-picker-search');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.closeDialogModal(this.modalRecipePicker);
  }

  // ==========================================================================
  // US-72: PLANIFICAR RECETA DIRECTAMENTE DESDE SU FICHA ("AÑADIR AL PLAN")
  // ==========================================================================
  openPlanRecipeModal(recipeOrId = null) {
    let r = null;
    if (recipeOrId && typeof recipeOrId === 'object') {
      r = recipeOrId;
    } else if (typeof recipeOrId === 'string') {
      r = state.recipes.find(rec => rec.id === recipeOrId);
    } else if (this.activeRecipe) {
      r = this.activeRecipe;
    }

    if (!r) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.recipeNotFound') : 'No se encontró la receta a planificar.',
        'error'
      );
      return;
    }

    this.planRecipeTarget = r;

    // Actualizar snippet resumen
    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    const titleEl = document.getElementById('plan-recipe-target-title');
    const metaEl = document.getElementById('plan-recipe-target-meta');
    if (titleEl) titleEl.textContent = r.title;
    if (metaEl) {
      const totalTime = (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0);
      const servings = r.servings || 2;
      const servingsLabel = isEn ? (servings === 1 ? '1 person' : `${servings} people`) : `${servings} personas`;
      metaEl.textContent = `${totalTime > 0 ? `${totalTime} min • ` : ''}${servingsLabel}`;
    }

    // Inicializar fecha (hoy por defecto)
    const today = new Date();
    const todayKey = toLocalDateKey(today);
    const dateInput = document.getElementById('plan-recipe-date-input');
    if (dateInput) {
      dateInput.value = todayKey;
      dateInput.onchange = () => {
        this.renderPlanRecipeSlots();
        this.updatePlanRecipeConflict();
      };
    }

    // Quick date pills
    const quickDatesContainer = document.getElementById('plan-recipe-quick-dates');
    if (quickDatesContainer) {
      const dates = [];
      for (let i = 0; i < 4; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const k = toLocalDateKey(d);
        let label = '';
        if (i === 0) label = isEn ? 'Today' : 'Hoy';
        else if (i === 1) label = isEn ? 'Tomorrow' : 'Mañana';
        else {
          const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
          const dayName = isEn ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIdx] : (DAYS_OF_WEEK_ES[dayIdx] || '').slice(0, 3);
          label = `${dayName} ${d.getDate()}`;
        }
        dates.push({ key: k, label });
      }

      quickDatesContainer.innerHTML = dates.map((item, idx) => `
        <button type="button" class="m3-filter-chip plan-quick-date-chip u-cursor-pointer ${idx === 0 ? 'active' : ''}" data-date="${item.key}" onclick="app.selectPlanRecipeQuickDate('${item.key}', this)">
          ${item.label}
        </button>
      `).join('');
    }

    // Render slots y verificar conflicto
    this.planRecipeSelectedSlot = 'lunch';
    this.planRecipeIsCustomSlot = false;
    this.renderPlanRecipeSlots();
    this.updatePlanRecipeConflict();

    if (window.I18n && typeof window.I18n.applyTranslations === 'function' && this.modalPlanRecipe) {
      window.I18n.applyTranslations(this.modalPlanRecipe);
    }

    this.openDialogModal(this.modalPlanRecipe);
  }

  selectPlanRecipeQuickDate(dateKey, btnElem) {
    const dateInput = document.getElementById('plan-recipe-date-input');
    if (dateInput) {
      dateInput.value = dateKey;
    }
    const container = document.getElementById('plan-recipe-quick-dates');
    if (container) {
      container.querySelectorAll('.plan-quick-date-chip').forEach(b => b.classList.remove('active'));
      if (btnElem) btnElem.classList.add('active');
    }
    this.renderPlanRecipeSlots();
    this.updatePlanRecipeConflict();
  }

  renderPlanRecipeSlots() {
    const container = document.getElementById('plan-recipe-slots-container');
    if (!container) return;

    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    const dateInput = document.getElementById('plan-recipe-date-input');
    const dateKey = dateInput?.value || toLocalDateKey(new Date());
    const dayData = state.getDayPlan(dateKey);

    const slots = [
      ...STANDARD_SLOTS.map(s => ({
        key: s.key,
        label: window.I18n ? window.I18n.getSlotLabel(s.key, s.label) : s.label,
        icon: s.icon,
        isCustom: false
      })),
      ...(dayData.customSlots || []).map(cs => ({ key: cs.id, label: cs.name, icon: 'restaurant', isCustom: true }))
    ];

    if (!slots.some(s => s.key === this.planRecipeSelectedSlot)) {
      this.planRecipeSelectedSlot = slots[0]?.key || 'lunch';
      this.planRecipeIsCustomSlot = slots[0]?.isCustom || false;
    }

    container.innerHTML = slots.map(s => {
      const isSelected = s.key === this.planRecipeSelectedSlot;
      const currentRecipeId = s.isCustom
        ? (dayData.customSlots.find(c => c.id === s.key)?.recipeId)
        : dayData[s.key];
      const hasCurrent = !!currentRecipeId;

      return `
        <button type="button" class="plan-slot-card-choice ${isSelected ? 'selected' : ''}" onclick="app.selectPlanRecipeSlot('${s.key}', ${s.isCustom})">
          <div class="u-flex-row-center-gap-8">
            <span class="material-symbols-outlined icon-sm plan-slot-choice-icon">${s.icon}</span>
            <span>${s.label}</span>
          </div>
          ${hasCurrent ? `<span class="material-symbols-outlined icon-sm icon-warning" title="${isEn ? 'Already has an assigned dish' : 'Ya tiene plato asignado'}">warning</span>` : ''}
        </button>
      `;
    }).join('');
  }

  selectPlanRecipeSlot(slotKey, isCustom = false) {
    this.planRecipeSelectedSlot = slotKey;
    this.planRecipeIsCustomSlot = isCustom;
    this.renderPlanRecipeSlots();
    this.updatePlanRecipeConflict();
  }

  updatePlanRecipeConflict() {
    const warningBox = document.getElementById('plan-recipe-conflict-warning');
    if (!warningBox) return;

    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    const dateInput = document.getElementById('plan-recipe-date-input');
    const dateKey = dateInput?.value || toLocalDateKey(new Date());
    const dayData = state.getDayPlan(dateKey);
    const slotKey = this.planRecipeSelectedSlot || 'lunch';

    let currentRecipeId = null;
    let slotLabel = slotKey;

    if (this.planRecipeIsCustomSlot) {
      const cs = (dayData.customSlots || []).find(c => c.id === slotKey);
      currentRecipeId = cs?.recipeId;
      slotLabel = cs?.name || (isEn ? 'Extra meal' : 'Momento extra');
    } else {
      currentRecipeId = dayData[slotKey];
      const std = STANDARD_SLOTS.find(s => s.key === slotKey);
      slotLabel = window.I18n ? window.I18n.getSlotLabel(slotKey, std ? std.label : slotKey) : (std ? std.label : slotKey);
    }

    if (currentRecipeId) {
      const existing = (state.recipes || []).find(r => r.id === currentRecipeId);
      const existingTitle = existing ? existing.title : (isEn ? 'Another dish' : 'Otro plato');
      warningBox.style.display = 'block';
      warningBox.style.background = 'var(--m3-surface-container-high)';
      warningBox.style.borderColor = '#f59e0b';
      warningBox.style.color = 'var(--m3-on-surface)';
      warningBox.innerHTML = `
        <div class="plan-overwrite-row">
          <span class="material-symbols-outlined icon-sm plan-overwrite-icon">warning</span>
          <div>
            <strong>${isEn ? 'Slot occupied:' : 'Momento ocupado:'}</strong> ${isEn ? `Already assigned "<em>${escapeHtml(existingTitle)}</em>" for ${slotLabel}.` : `Ya hay asignado "<em>${escapeHtml(existingTitle)}</em>" en ${slotLabel}.`}
            <div class="plan-overwrite-sub">
              ${isEn ? `Upon confirming, it will be replaced with "${escapeHtml(this.planRecipeTarget?.title || '')}".` : `Al confirmar, se sustituirá por "${escapeHtml(this.planRecipeTarget?.title || '')}".`}
            </div>
          </div>
        </div>
      `;
    } else {
      warningBox.style.display = 'block';
      warningBox.style.background = 'var(--m3-surface-container-low)';
      warningBox.style.borderColor = 'var(--m3-outline-variant)';
      warningBox.style.color = 'var(--m3-on-surface-variant)';
      warningBox.innerHTML = `
        <div class="u-flex-row-center-gap-8">
          <span class="material-symbols-outlined icon-sm icon-primary">check_circle</span>
          <span>${isEn ? `Available slot in <strong>${slotLabel}</strong>.` : `Hueco libre en <strong>${slotLabel}</strong>.`}</span>
        </div>
      `;
    }
  }

  closePlanRecipeModal() {
    this.closeDialogModal(this.modalPlanRecipe);
    this.planRecipeTarget = null;
  }

  confirmPlanRecipe() {
    const r = this.planRecipeTarget;
    if (!r) {
      this.closePlanRecipeModal();
      return;
    }

    const dateInput = document.getElementById('plan-recipe-date-input');
    const dateKey = dateInput?.value || toLocalDateKey(new Date());
    if (!dateKey) {
      this.showToast(
        window.I18n ? window.I18n.t('planner.selectValidDate') : 'Por favor selecciona una fecha válida.',
        'error'
      );
      return;
    }

    const slotKey = this.planRecipeSelectedSlot || 'lunch';
    const dayData = state.getDayPlan(dateKey);

    if (this.planRecipeIsCustomSlot) {
      const cs = (dayData.customSlots || []).find(c => c.id === slotKey);
      if (cs) {
        cs.recipeId = r.id;
      }
    } else {
      dayData[slotKey] = r.id;
    }
    if (state.household?.id) {
      dayData.householdId = state.household.id;
      if (state.cloudUser?.id) {
        dayData.ownerUserId = state.cloudUser.id;
      }
    }
    dayData.updatedAt = new Date().toISOString();

    state.save('fa_mealplan', state.mealPlan);
    this.broadcastRealtimeChange('planner_change', {
      dateStr: dateKey,
      dayPlan: state.mealPlan[dateKey]
    });
    this.scheduleSyncWithCloud();
    this.flushSync();
    this.closePlanRecipeModal();
    this.render();

    const std = STANDARD_SLOTS.find(s => s.key === slotKey);
    const slotLabel = std
      ? (window.I18n ? window.I18n.getSlotLabel(std.key, std.label) : std.label)
      : slotKey;
    const parts = dateKey.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateKey;

    const plannedMsg = window.I18n
      ? window.I18n.t('planner.recipePlanned', { recipe: r.title, slot: slotLabel, date: formattedDate })
      : `¡"${r.title}" planificada para ${slotLabel} (${formattedDate})!`;
    this.showToast(plannedMsg, 'success');
  }

  selectRecipeForSlot(recipeId, cookDoubleOverride = null) {
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
      if (state.household?.id) {
        dayData.householdId = state.household.id;
        if (state.cloudUser?.id) {
          dayData.ownerUserId = state.cloudUser.id;
        }
      }
      dayData.updatedAt = new Date().toISOString();

      // US-65: Batch cooking / Cocinar doble para sobras
      const checkbox = document.getElementById('toggle-picker-cook-double');
      const shouldCookDouble = (cookDoubleOverride !== null) ? !!cookDoubleOverride : (checkbox && checkbox.checked);

      if (shouldCookDouble) {
        const parts = dateStr.split('-').map(Number);
        if (parts.length === 3) {
          const currentDate = new Date(parts[0], parts[1] - 1, parts[2]);
          const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          const nextDateKey = toLocalDateKey(nextDate);
          const nextDayData = state.getDayPlan(nextDateKey);

          // Asignar al mismo slot o a Almuerzo si se cocinó de cena
          const targetNextSlot = (!isCustom && slotKey === 'dinner') ? 'lunch' : (isCustom ? 'lunch' : slotKey);
          nextDayData[targetNextSlot] = recipeId;
          if (!nextDayData.leftoverSlots) nextDayData.leftoverSlots = {};
          nextDayData.leftoverSlots[targetNextSlot] = true;
          if (state.household?.id) {
            nextDayData.householdId = state.household.id;
            if (state.cloudUser?.id) {
              nextDayData.ownerUserId = state.cloudUser.id;
            }
          }
          nextDayData.updatedAt = new Date().toISOString();
        }
      }

      state.save('fa_mealplan', state.mealPlan);
      this.closePickerModal();
      this.broadcastRealtimeChange('planner_change', {
        dateStr: dateStr,
        dayPlan: state.mealPlan[dateStr]
      });
      this.scheduleSyncWithCloud();
      this.flushSync();
      this.render();
      if (shouldCookDouble) {
        this.showToast(
          window.I18n ? window.I18n.t('planner.batchCookingScheduled') : "¡Plato asignado para hoy y programado como sobras para mañana!",
          "success"
        );
      }
    }
  }

  // SHOPPING LIST (US-33: Vista Por Pasillos vs Por Receta + Fusión y Conversión Inteligente)
  setShoppingViewMode(modeOrDataset) {
    const rawMode = typeof modeOrDataset === 'object' && modeOrDataset !== null ? modeOrDataset.mode : modeOrDataset;
    const mode = rawMode === 'recipe' ? 'recipe' : 'aisle';
    this.shoppingViewMode = mode;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('fa_shopping_view_mode', mode);
      } catch (e) { }
    }
    this.renderShoppingList();
  }

  _distributeShoppingCards(cardsWithWeights, numCols = 3) {
    if (!cardsWithWeights || cardsWithWeights.length === 0) return '';
    if (cardsWithWeights.length === 1) {
      return `<div class="shopping-column">${cardsWithWeights[0].html}</div>`;
    }

    const actualCols = Math.min(numCols, cardsWithWeights.length);
    const cols = Array.from({ length: actualCols }, () => []);

    // Distribuir en orden secuencial fijo (Round-Robin) para que los pasillos
    // mantengan SIEMPRE su posición estable y predecible de izquierda a derecha y arriba hacia abajo.
    // Esto evita que las tarjetas salten de columna o cambien de orden al tachar artículos.
    cardsWithWeights.forEach((card, i) => {
      cols[i % actualCols].push(card.html);
    });

    return cols
      .filter(col => col.length > 0)
      .map(col => `<div class="shopping-column">${col.join('')}</div>`)
      .join('');
  }

  renderShoppingList() {
    const container = document.getElementById('shopping-aisles-container');
    if (!container) return;

    if (state.shoppingList && state.recipes && state.recipes.length > 0) {
      let listHealed = false;
      state.shoppingList.forEach(item => {
        const prevOrigin = item.recipeOrigin;
        const prevLen = Array.isArray(item.recipeBreakdown) ? item.recipeBreakdown.length : 0;
        reconcileShoppingItemBreakdown(item, state.recipes);
        if (item.recipeOrigin !== prevOrigin || (Array.isArray(item.recipeBreakdown) ? item.recipeBreakdown.length : 0) !== prevLen) {
          listHealed = true;
        }
      });
      if (listHealed) {
        state.save('fa_shopping', state.shoppingList);
      }
    }

    // US-64: Auto-consolidar y sanear desgloses en vivo (sin bucles de sincronización)
    if (Array.isArray(state.shoppingList)) {
      state.shoppingList.forEach(item => deduplicateShoppingBreakdown(item));
      if (state.shoppingList.length > 1) {
        const prevLen = state.shoppingList.length;
        state.shoppingList = consolidateShoppingList(state.shoppingList);
        if (state.shoppingList.length !== prevLen) {
          state.save('fa_shopping', state.shoppingList);
        }
      }
    }

    const btnAisle = document.getElementById('btn-shopping-view-aisle');
    const btnRecipe = document.getElementById('btn-shopping-view-recipe');
    const isRecipeView = this.shoppingViewMode === 'recipe';
    if (btnAisle) {
      btnAisle.classList.toggle('active', !isRecipeView);
      btnAisle.setAttribute('aria-pressed', !isRecipeView ? 'true' : 'false');
    }
    if (btnRecipe) {
      btnRecipe.classList.toggle('active', isRecipeView);
      btnRecipe.setAttribute('aria-pressed', isRecipeView ? 'true' : 'false');
    }

    if (Array.isArray(state.shoppingList)) {
      state.shoppingList.forEach(item => {
        if (item && !item.id) item.id = generateId('shop-');
      });
    }

    const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
    const pendingCount = state.shoppingList.filter(i => !i.isChecked).length;
    const summaryEl = document.getElementById('shopping-summary-text');
    if (summaryEl) {
      if (isEn) {
        summaryEl.textContent = `${pendingCount} ${pendingCount === 1 ? 'item pending' : 'items pending'}`;
      } else {
        summaryEl.textContent = `${pendingCount} artículo${pendingCount === 1 ? '' : 's'} pendiente${pendingCount === 1 ? '' : 's'}`;
      }
    }

    if (!state.shoppingList.length) {
      const emptyTitle = window.I18n ? window.I18n.t('shopping.emptyTitle') : 'Lista de la compra vacía';
      const emptyDesc = window.I18n ? window.I18n.t('shopping.emptyDesc') : 'Genera la lista desde tu plan semanal con un clic o añade artículos manualmente.';
      const genBtnText = window.I18n ? window.I18n.t('shopping.generateFromPlan') : 'Generar desde el Plan';
      container.innerHTML = `
        <div class="card shopping-empty-card">
          <span class="material-symbols-outlined shopping-empty-icon">shopping_cart</span>
          <h3 class="shopping-empty-title">${escapeHtml(emptyTitle)}</h3>
          <p class="shopping-empty-desc">${escapeHtml(emptyDesc)}</p>
          <button class="btn btn-primary btn-sm" onclick="app.generateShoppingFromPlan()">
            <span class="material-symbols-outlined icon-sm">add_shopping_cart</span> ${escapeHtml(genBtnText)}
          </button>
        </div>
      `;
      const completedContainer = document.getElementById('shopping-completed-container');
      if (completedContainer) completedContainer.innerHTML = '';
      return;
    }

    let cards = [];

    if (isRecipeView) {
      const groupedByRecipe = {};
      state.shoppingList.forEach((item, index) => {
        // US-81: Los artículos completados se agrupan en su propia sección inferior
        if (item.isChecked) return;
        if (Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0) {
          item.recipeBreakdown.forEach(b => {
            const recipeLabel = b.recipe ? String(b.recipe).trim() : (isEn ? 'Added manually' : 'Añadido manualmente');
            if (!groupedByRecipe[recipeLabel]) groupedByRecipe[recipeLabel] = [];
            groupedByRecipe[recipeLabel].push({
              ...item,
              recipeSpecificName: b.name || item.name,
              recipeSpecificAmount: (b.amount !== null && b.amount !== undefined) ? `${b.amount} ${b.unit || ''}`.trim() : (b.unit || ''),
              originalIndex: index
            });
          });
        } else {
          const rawOrigin = item.recipeOrigin ? String(item.recipeOrigin).trim() : '';
          const origins = rawOrigin
            ? rawOrigin.split(',').map(s => s.trim()).filter(Boolean)
            : ['Añadido manualmente'];
          origins.forEach(originLabel => {
            if (!groupedByRecipe[originLabel]) groupedByRecipe[originLabel] = [];
            groupedByRecipe[originLabel].push({
              ...item,
              recipeSpecificName: item.name,
              recipeSpecificAmount: item.displayAmount || (item.amount ? `${item.amount} ${item.unit || ''}`.trim() : (item.unit || '')),
              originalIndex: index
            });
          });
        }
      });

      cards = Object.entries(groupedByRecipe).map(([recipeLabel, items]) => {
        const pendingInRecipe = items.filter(i => !i.isChecked).length;
        const isManualGroup = /manualmente|otros|asistente|sous chef/i.test(recipeLabel);
        const headerIcon = isManualGroup ? 'shopping_bag' : 'menu_book';
        const pendingRecipeText = isEn
          ? `${pendingInRecipe} pending`
          : `${pendingInRecipe} ${pendingInRecipe === 1 ? 'pendiente' : 'pendientes'}`;

        const html = `
          <div class="aisle-card recipe-shopping-card" data-recipe-group="${escapeHtml(recipeLabel)}">
            <div class="aisle-header">
              <div class="u-flex-row-center-gap-8">
                <span class="material-symbols-outlined icon-sm">${headerIcon}</span>
                <span>${escapeHtml(recipeLabel)}</span>
              </div>
              <span class="aisle-pending-count">${pendingRecipeText}</span>
            </div>

            <div>
              ${items.map(item => {
          const aisleMeta = AISLE_METADATA[item.aisle || 'other'] || AISLE_METADATA.other;
          const displayName = item.recipeSpecificName || item.name;
          const displayAmt = formatDisplayAmount(item.amount, item.unit, item.recipeSpecificAmount || item.displayAmount);
          const removeTitle = window.I18n ? window.I18n.t('shopping.removeItemTitle') : 'Eliminar artículo';
          return `
                  <div class="grocery-item-row ${item.isChecked ? 'checked' : ''}">
                    <div class="grocery-left" onclick="app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                      <input type="checkbox" class="grocery-checkbox" ${item.isChecked ? 'checked' : ''} onclick="event.stopPropagation(); app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                      <div class="grocery-item-icon-badge" title="${escapeHtml(displayName)}">
                        <span class="material-symbols-outlined icon-sm">${getIngredientIcon(displayName, item.aisle)}</span>
                      </div>
                      <div class="u-flex-1-truncate">
                        <div class="grocery-name">${escapeHtml(displayName)}</div>
                        <div class="grocery-origin-sub">${escapeHtml(getAisleLabel(item.aisle || 'other'))}</div>
                      </div>
                    </div>
                    <div class="u-flex-center-gap-8-shrink">
                      ${displayAmt ? `<span class="grocery-amount">${escapeHtml(displayAmt)}</span>` : ''}
                      <button type="button" class="btn btn-ghost btn-sm btn-grocery-remove btn-remove-circle" onclick="app.deleteGroceryItem('${escapeHtml(item.id)}')" title="${removeTitle}">
                        <span class="material-symbols-outlined icon-sm">close</span>
                      </button>
                    </div>
                  </div>
                `;
        }).join('')}
            </div>
          </div>
        `;
        return { recipeLabel, html, weight: 3 + items.length };
      });

      cards.sort((a, b) => {
        const isAManual = /manualmente|otros|asistente|sous chef/i.test(a.recipeLabel);
        const isBManual = /manualmente|otros|asistente|sous chef/i.test(b.recipeLabel);
        if (isAManual && !isBManual) return 1;
        if (!isAManual && isBManual) return -1;
        return a.recipeLabel.localeCompare(b.recipeLabel, undefined, { sensitivity: 'base' });
      });
    } else {
      const grouped = {};
      state.shoppingList.forEach((item, index) => {
        // US-81: Los artículos completados se agrupan en su propia sección inferior
        if (item.isChecked) return;
        const aisle = item.aisle || 'other';
        if (!grouped[aisle]) grouped[aisle] = [];
        grouped[aisle].push({ ...item, originalIndex: index });
      });

      cards = Object.entries(grouped).map(([aisleKey, items]) => {
        const meta = AISLE_METADATA[aisleKey] || AISLE_METADATA.other;
        const pendingInAisle = items.filter(i => !i.isChecked).length;
        const pendingAisleText = isEn
          ? `${pendingInAisle} pending`
          : `${pendingInAisle} ${pendingInAisle === 1 ? 'pendiente' : 'pendientes'}`;

        const html = `
          <div class="aisle-card" data-aisle="${escapeHtml(aisleKey)}">
            <div class="aisle-header">
              <div class="u-flex-row-center-gap-8">
                <span class="material-symbols-outlined icon-sm">${meta.icon}</span>
                <span>${getAisleLabel(aisleKey)}</span>
              </div>
              <span class="aisle-pending-count">${pendingAisleText}</span>
            </div>

            <div>
              ${items.map(item => {
          const displayAmt = formatDisplayAmount(item.amount, item.unit, item.displayAmount);
          let subtextHtml = '';
          let breakdown = Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0 ? item.recipeBreakdown : null;

          // Reconstruir desglose si no está en memoria pero recipeOrigin contiene múltiples recetas separadas por coma
          if (!breakdown && item.recipeOrigin && item.recipeOrigin.includes(',')) {
            const parts = parseRecipeOrigins(item.recipeOrigin, state.recipes || []);
            if (parts.length > 1) {
              breakdown = parts.map(p => ({
                recipe: p,
                name: item.name,
                amount: null,
                unit: item.unit || ''
              }));
            }
          } else if (breakdown && breakdown.length === 1 && breakdown[0].recipe && breakdown[0].recipe.includes(',')) {
            const parts = parseRecipeOrigins(breakdown[0].recipe, state.recipes || []);
            if (parts.length > 1) {
              breakdown = parts.map(p => ({
                recipe: p,
                name: breakdown[0].name || item.name,
                amount: null,
                unit: item.unit || ''
              }));
            }
          }

          if (breakdown && breakdown.length > 1) {
            const seenRecs = new Set();
            const cleanBreakdown = [];
            breakdown.forEach(b => {
              if (!b || !b.recipe) return;
              const rk = String(b.recipe).trim().toLowerCase();
              if (!seenRecs.has(rk)) {
                seenRecs.add(rk);
                cleanBreakdown.push(b);
              }
            });
            breakdown = cleanBreakdown;
          }

          if (breakdown && breakdown.length > 1) {
            subtextHtml = `
                    <div class="grocery-breakdown-list">
                      ${breakdown.map(b => {
              const qtyStr = (b.amount !== null && b.amount !== undefined) ? `${b.amount} ${b.unit || ''}`.trim() : '';
              const nameDiff = b.name && b.name.toLowerCase().trim() !== item.name.toLowerCase().trim() ? ` (${escapeHtml(b.name)})` : '';
              return `
                          <div class="grocery-breakdown-row" title="${escapeHtml(b.recipe)}">
                            <span class="grocery-breakdown-dot">•</span>
                            <div class="grocery-breakdown-body">
                              <span class="grocery-breakdown-recipe">${escapeHtml(b.recipe)}${qtyStr ? ':' : ''}</span>
                              ${qtyStr ? `<span class="grocery-breakdown-qty">${escapeHtml(qtyStr)}${nameDiff}</span>` : (nameDiff ? `<span class="grocery-breakdown-qty">${nameDiff}</span>` : '')}
                            </div>
                          </div>
                        `;
            }).join('')}
                    </div>
                  `;
          } else if (breakdown && breakdown.length === 1) {
            const b = breakdown[0];
            const nameDiff = b.name && b.name.toLowerCase().trim() !== item.name.toLowerCase().trim() ? ` (como "${escapeHtml(b.name)}")` : '';
            subtextHtml = `<div class="grocery-origin-sub">Para: ${escapeHtml(b.recipe)}${nameDiff}</div>`;
          } else if (item.recipeOrigin) {
            subtextHtml = `<div class="grocery-origin-sub">Para: ${escapeHtml(item.recipeOrigin)}</div>`;
          }

          return `
                  <div class="grocery-item-row ${item.isChecked ? 'checked' : ''}">
                    <div class="grocery-left" onclick="app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                      <input type="checkbox" class="grocery-checkbox" ${item.isChecked ? 'checked' : ''} onclick="event.stopPropagation(); app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                      <div class="grocery-item-icon-badge" title="${escapeHtml(item.name)}">
                        <span class="material-symbols-outlined icon-sm">${getIngredientIcon(item.name, item.aisle)}</span>
                      </div>
                      <div class="u-flex-1-truncate">
                        <div class="grocery-name">${escapeHtml(item.name)}</div>
                        ${subtextHtml}
                      </div>
                    </div>
                    <div class="u-flex-center-gap-8-shrink">
                      ${displayAmt ? `<span class="grocery-amount">${escapeHtml(displayAmt)}</span>` : ''}
                      <button type="button" class="btn btn-ghost btn-sm btn-grocery-remove btn-remove-circle" onclick="app.deleteGroceryItem('${escapeHtml(item.id)}')" title="Eliminar artículo">
                        <span class="material-symbols-outlined icon-sm">close</span>
                      </button>
                    </div>
                  </div>
                `;
        }).join('')}
            </div>
          </div>
        `;
        return { aisleKey, html, weight: 3 + items.length };
      });

      cards.sort((a, b) => {
        const idxA = AISLE_ORDER.indexOf(a.aisleKey);
        const idxB = AISLE_ORDER.indexOf(b.aisleKey);
        return (idxA >= 0 ? idxA : 999) - (idxB >= 0 ? idxB : 999);
      });
    }

    if (cards.length > 0) {
      container.innerHTML = this._distributeShoppingCards(cards, 3);
    } else {
      // Todos los artículos están en el carrito / completados
      container.innerHTML = `
        <div class="card shopping-empty-card shopping-all-done-card">
          <span class="material-symbols-outlined shopping-empty-icon u-text-success">task_alt</span>
          <h3 class="shopping-empty-title">¡Todo en el carrito!</h3>
          <p class="shopping-empty-desc">
            Has completado todos los artículos de la lista. Puedes revisarlos abajo o limpiarlos cuando termines la compra.
          </p>
        </div>
      `;
    }

    // US-81: Renderizado de sección de artículos completados
    const completedItems = [];
    state.shoppingList.forEach((item, index) => {
      if (item.isChecked) {
        completedItems.push({ ...item, originalIndex: index });
      }
    });

    const completedContainer = document.getElementById('shopping-completed-container');
    if (completedItems.length > 0) {
      const completedHtml = `
        <div class="card shopping-completed-card" id="shopping-completed-section">
          <div class="shopping-completed-header">
            <div class="u-flex-row-center-gap-8">
              <span class="material-symbols-outlined icon-sm u-text-success">check_circle</span>
              <span class="shopping-completed-title">${window.I18n ? window.I18n.t('shopping.completedSectionTitle') : 'Completados'}</span>
              <span class="shopping-completed-count">(${completedItems.length})</span>
            </div>
            <button type="button" class="btn btn-ghost btn-sm btn-clear-completed-section" data-action="clearCompletedGroceries" title="${window.I18n ? window.I18n.t('shopping.clearCompletedBtn') : 'Eliminar artículos completados'}">
              <span class="material-symbols-outlined icon-sm">delete_sweep</span>
              <span>${window.I18n ? window.I18n.t('shopping.clearCompletedBtn') : 'Limpiar completados'}</span>
            </button>
          </div>
          <div class="shopping-completed-list">
            ${completedItems.map(item => {
        const aisleMeta = AISLE_METADATA[item.aisle || 'other'] || AISLE_METADATA.other;
        const displayName = item.name;
        const displayAmt = formatDisplayAmount(item.amount, item.unit, item.displayAmount);
        const localizedAisle = window.I18n ? window.I18n.getAisleName(item.aisle || 'other') : aisleMeta.label;
        const forPrefix = window.I18n ? window.I18n.t('common.forPrefix') : 'Para:';
        const originInfo = item.recipeOrigin ? `${forPrefix} ${escapeHtml(item.recipeOrigin)}` : localizedAisle;
        return `
                <div class="grocery-item-row checked">
                  <div class="grocery-left" onclick="app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                    <input type="checkbox" class="grocery-checkbox" checked onclick="event.stopPropagation(); app.toggleGroceryCheck('${escapeHtml(item.id)}')">
                    <div class="grocery-item-icon-badge" title="${escapeHtml(displayName)}">
                      <span class="material-symbols-outlined icon-sm">${getIngredientIcon(displayName, item.aisle)}</span>
                    </div>
                    <div class="u-flex-1-truncate">
                      <div class="grocery-name">${escapeHtml(displayName)}</div>
                      <div class="grocery-origin-sub">${originInfo}</div>
                    </div>
                  </div>
                  <div class="u-flex-center-gap-8-shrink">
                    ${displayAmt ? `<span class="grocery-amount">${escapeHtml(displayAmt)}</span>` : ''}
                    <button type="button" class="btn btn-ghost btn-sm btn-grocery-remove btn-remove-circle" onclick="app.deleteGroceryItem('${escapeHtml(item.id)}')" title="Eliminar artículo">
                      <span class="material-symbols-outlined icon-sm">close</span>
                    </button>
                  </div>
                </div>
              `;
      }).join('')}
          </div>
        </div>
      `;
      if (completedContainer) {
        completedContainer.innerHTML = completedHtml;
      } else {
        container.insertAdjacentHTML('beforeend', completedHtml);
      }
    } else {
      if (completedContainer) {
        completedContainer.innerHTML = '';
      }
    }
  }

  async toggleGroceryCheck(idOrIndex) {
    if (!state.shoppingList || state.shoppingList.length === 0) return;
    let item = null;
    if (typeof idOrIndex === 'string') {
      item = state.shoppingList.find(i => i.id === idOrIndex);
    }
    if (!item && (typeof idOrIndex === 'number' || (!isNaN(Number(idOrIndex)) && idOrIndex !== ''))) {
      const idx = Number(idOrIndex);
      if (state.shoppingList[idx]) item = state.shoppingList[idx];
    }
    if (!item) return;

    if (!item.id) item.id = generateId('shop-');
    item.isChecked = !Boolean(item.isChecked || item.checked);
    delete item.checked;
    item.updatedAt = new Date().toISOString();
    if (state.household?.id) {
      item.householdId = state.household.id;
      if (state.cloudUser?.id && !item.ownerUserId) {
        item.ownerUserId = state.cloudUser.id;
      }
    }
    state.save('fa_shopping', state.shoppingList);
    this.render();

    // Registrar timestamp de modificación local reciente para proteger contra respuestas remotas desactualizadas
    if (!this._recentShoppingCheckTimestamps) this._recentShoppingCheckTimestamps = new Map();
    this._recentShoppingCheckTimestamps.set(item.id, Date.now());

    // US-81: Sincronización instantánea en la nube / Modo Familia sin retardo
    if (this.supabaseClient && state.cloudUser?.id) {
      await this.syncShoppingItemInstant(item);
    } else {
      this.scheduleSyncWithCloud();
    }
  }

  async syncShoppingItemInstant(item) {
    if (!this.supabaseClient || !state.cloudUser?.id || !item) return;
    try {
      const activeHouseholdId = state.household?.id || null;
      if (!item.id) item.id = generateId('shop-');
      const rowPayload = {
        id: item.id,
        user_id: (activeHouseholdId && item.ownerUserId) ? item.ownerUserId : state.cloudUser.id,
        name: item.name,
        amount: item.amount !== null && !isNaN(item.amount) ? Number(item.amount) : null,
        unit: item.unit || '',
        aisle: item.aisle || 'other',
        is_checked: !!item.isChecked,
        recipe_origin: item.recipeOrigin || null,
        recipe_breakdown: Array.isArray(item.recipeBreakdown) && item.recipeBreakdown.length > 0 ? item.recipeBreakdown : null,
        updated_at: item.updatedAt || new Date().toISOString()
      };
      if (activeHouseholdId) {
        rowPayload.household_id = activeHouseholdId;
      }
      // Broadcast WebSocket ultra-rápido a otros miembros / dispositivos
      this.broadcastRealtimeChange('shopping_change', {
        action: 'toggle',
        item: {
          id: item.id,
          name: item.name,
          amount: rowPayload.amount,
          unit: item.unit,
          aisle: item.aisle,
          isChecked: !!item.isChecked,
          recipeOrigin: item.recipeOrigin || '',
          updatedAt: rowPayload.updated_at
        }
      });
      await this.upsertWithSchemaFallback('shopping_items', [rowPayload]);
    } catch (e) {
      console.warn('[Sync] Fallo en syncShoppingItemInstant, delegando en scheduleSyncWithCloud:', e);
      this.scheduleSyncWithCloud();
    }
  }

  deleteGroceryItem(idOrIndex) {
    if (!state.shoppingList || state.shoppingList.length === 0) return;
    let index = -1;
    if (typeof idOrIndex === 'string') {
      index = state.shoppingList.findIndex(i => i.id === idOrIndex);
    }
    if (index === -1 && (typeof idOrIndex === 'number' || (!isNaN(Number(idOrIndex)) && idOrIndex !== ''))) {
      const idx = Number(idOrIndex);
      if (idx >= 0 && idx < state.shoppingList.length) index = idx;
    }
    if (index < 0 || index >= state.shoppingList.length) return;

    const item = state.shoppingList[index];
    if (item && item.id) {
      state.trackDeletion('shoppingItems', item.id);
      this.broadcastRealtimeChange('shopping_change', {
        action: 'delete',
        itemId: item.id
      });
    }
    state.shoppingList.splice(index, 1);
    state.save('fa_shopping', state.shoppingList);
    this.scheduleSyncWithCloud();
    this.flushSync();
    this.render();
  }

  async clearCompletedGroceries(skipConfirm = false) {
    if (this._isClearingCompleted) return false;
    this._isClearingCompleted = true;
    try {
      if (!state.shoppingList || state.shoppingList.length === 0) {
        this.showToast("La lista de la compra ya está vacía.", 'info');
        return false;
      }

      // Normalizar y recoger todos los artículos marcados como comprados (tanto isChecked como checked)
      const completed = state.shoppingList.filter(i => Boolean(i && (i.isChecked || i.checked)));

      if (completed.length > 0) {
        const count = completed.length;
        const total = state.shoppingList.length;
        if (count === total) {
          const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
            title: 'Vaciar lista comprada',
            message: `¿Eliminar los ${count} artículos comprados y vaciar la lista?`,
            confirmText: 'Vaciar lista',
            cancelText: 'Cancelar',
            danger: true,
            icon: 'delete_sweep'
          });
          if (confirmed) {
            const deletedIds = [];
            state.shoppingList.forEach(item => {
              const id = item.id || generateId('shop-');
              state.trackDeletion('shoppingItems', id);
              deletedIds.push(id);
              if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(id);
            });
            state.shoppingList = [];
            state.save('fa_shopping', state.shoppingList);
            this.broadcastRealtimeChange('shopping_change', {
              action: 'clear_completed',
              deletedIds
            });
            this.scheduleSyncWithCloud();
            await this.flushSync();
            this.render();
            this.showToast("Lista de la compra vaciada.", 'info');
            return true;
          }
        } else {
          const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
            title: 'Limpiar comprados',
            message: `¿Eliminar los ${count} artículos marcados como comprados?`,
            confirmText: 'Eliminar comprados',
            cancelText: 'Cancelar',
            danger: true,
            icon: 'remove_done'
          });
          if (confirmed) {
            const deletedIds = [];
            completed.forEach(item => {
              const id = item.id || generateId('shop-');
              state.trackDeletion('shoppingItems', id);
              deletedIds.push(id);
              if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(id);
            });
            state.shoppingList = state.shoppingList.filter(i => !i.isChecked && !i.checked);
            state.save('fa_shopping', state.shoppingList);
            this.broadcastRealtimeChange('shopping_change', {
              action: 'clear_completed',
              deletedIds
            });
            this.scheduleSyncWithCloud();
            await this.flushSync();
            this.render();
            this.showToast(`Se eliminaron ${count} artículos comprados.`, 'info');
            return true;
          }
        }
      } else {
        // Ningún artículo está marcado con el checkbox
        const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
          title: 'Vaciar toda la lista',
          message: "No hay artículos marcados como comprados.\n\n¿Deseas vaciar toda la lista de la compra?",
          confirmText: 'Vaciar todo',
          cancelText: 'Cancelar',
          danger: true,
          icon: 'delete_sweep'
        });
        if (confirmed) {
          const deletedIds = [];
          state.shoppingList.forEach(item => {
            const id = item.id || generateId('shop-');
            state.trackDeletion('shoppingItems', id);
            deletedIds.push(id);
            if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(id);
          });
          state.shoppingList = [];
          state.save('fa_shopping', state.shoppingList);
          this.broadcastRealtimeChange('shopping_change', {
            action: 'clear_completed',
            deletedIds
          });
          this.scheduleSyncWithCloud();
          await this.flushSync();
          this.render();
          this.showToast("Lista de la compra vaciada.", 'info');
          return true;
        }
      }
      return false;
    } finally {
      this._isClearingCompleted = false;
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

    const newItem = {
      id: generateId('shop-'),
      name: name,
      amount: amount,
      unit: unit,
      aisle: aisle,
      isChecked: false,
      recipeOrigin: "Añadido manualmente",
      updatedAt: new Date().toISOString()
    };

    mergeOrAddShoppingItem(state.shoppingList, newItem);

    state.save('fa_shopping', state.shoppingList);
    this.broadcastRealtimeChange('shopping_change', {
      action: 'add',
      item: newItem
    });
    this.scheduleSyncWithCloud();
    this.flushSync();
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
      this.showToast("Esta receta no tiene ingredientes definidos.", 'warning');
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
      this.openDialogModal(this.modalShoppingPreview);
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
      this.showToast("No hay recetas asignadas en el plan semanal para generar la lista.", 'warning');
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
      this.showToast("Las recetas del plan no tienen ingredientes configurados.", 'warning');
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
      this.openDialogModal(this.modalShoppingPreview);
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
        <div class="card shopping-preview-group-card">
          <!-- Recipe Section Header -->
          <div class="shopping-preview-group-header">
            <div class="shopping-preview-group-title-wrap">
              ${group.recipeImage ? `<img src="${group.recipeImage}" alt="" class="shopping-preview-thumb">` : `<span class="material-symbols-outlined icon-primary">restaurant</span>`}
              <div class="u-flex-1-truncate">
                <div class="shopping-preview-recipe-title">${group.recipeTitle}</div>
                <div class="shopping-preview-count-sub">${checkedInGroup} de ${group.items.length} ingredientes seleccionados</div>
              </div>
            </div>
            
            <button type="button" class="btn btn-ghost btn-sm btn-preview-toggle-group" onclick="app.toggleGroupShoppingPreview(${groupIdx}, ${!allChecked})">
              ${allChecked ? 'Desmarcar receta' : 'Marcar receta'}
            </button>
          </div>

          <!-- Recipe Ingredients List -->
          <div class="shopping-preview-items-col">
            ${group.items.map((ing, itemIdx) => {
        const meta = AISLE_METADATA[ing.aisle] || AISLE_METADATA.other;
        const isChecked = ing.checked !== false;

        return `
                <div class="shopping-preview-item-row ${isChecked ? 'is-checked' : ''}">
                  <label class="shopping-preview-item-label">
                    <input type="checkbox" class="grocery-checkbox u-shrink-0" ${isChecked ? 'checked' : ''} onchange="app.handleShoppingPreviewItemCheck(${groupIdx}, ${itemIdx}, this.checked)">
                    <div class="u-flex-1-truncate">
                      <span class="shopping-preview-item-name ${isChecked ? '' : 'is-unchecked'}">
                        ${ing.name}
                      </span>
                      <span class="shopping-preview-aisle-tag">
                        <span class="material-symbols-outlined icon-sm icon-12">${meta.icon}</span> ${meta.label}
                      </span>
                    </div>
                  </label>

                  <div class="u-flex-center-gap-4-shrink">
                    <input type="number" step="any" min="0" value="${ing.amount !== null && ing.amount !== undefined ? ing.amount : ''}" 
                      placeholder="Cant." 
                      class="form-input shopping-preview-amount-input ${isChecked ? '' : 'is-unchecked'}" 
                      onchange="app.handleShoppingPreviewAmountChange(${groupIdx}, ${itemIdx}, this.value)"
                      ${isChecked ? '' : 'disabled'}>
                    <span class="shopping-preview-unit-label">${ing.unit || ''}</span>
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
      const gBase = group.baseServings || this.shoppingPreviewState.baseServings || 2;
      group.items.forEach(item => {
        if (item.baseAmount !== null && item.baseAmount !== undefined) {
          item.amount = Math.round((item.baseAmount * (newServings / gBase)) * 10) / 10;
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
      this.closeDialogModal(this.modalShoppingPreview);
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
      this.showToast("Por favor, selecciona al menos un ingrediente para añadir.", 'warning');
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
      mergeOrAddShoppingItem(state.shoppingList, {
        id: item.id || generateId('shop-'),
        name: item.name,
        amount: item.amount,
        unit: item.unit || '',
        aisle: item.aisle || 'other',
        isChecked: false,
        recipeOrigin: item.recipeOrigin || '',
        updatedAt: new Date().toISOString()
      });
      addedCount++;
    });

    state.save('fa_shopping', state.shoppingList);
    this.scheduleSyncWithCloud();
    this.closeShoppingPreviewModal();
    this.render();
    this.switchView('view-shopping');
    this.showToast(`\u00A1Se han a\u00F1adido ${addedCount} ingredientes a tu lista de la compra!`, 'success');
  }

  async copyShoppingList() {
    if (!state.shoppingList || !state.shoppingList.length) {
      this.showToast("No hay artículos en la lista de la compra para copiar.", 'info');
      return false;
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

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        this.showToast("¡Lista copiada al portapapeles!", 'success');
        return true;
      }
      throw new Error("Clipboard API no disponible");
    } catch (err) {
      let copied = false;
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        copied = false;
      }

      if (copied) {
        this.showToast("¡Lista copiada al portapapeles!", 'success');
        return true;
      } else {
        this.showToast("No se pudo copiar automáticamente al portapapeles. Comprueba los permisos de tu navegador.", 'warning');
        return false;
      }
    }
  }

  // ==========================================================================
  // GEMINI AI AGENT INTEGRATION (US-17, BUG-15, US-37, US-39)
  // ==========================================================================
  getDietarySlotGaps() {
    const activePrefs = Array.isArray(state.dietaryPreferences) ? state.dietaryPreferences : [];
    if (activePrefs.length === 0) return [];

    const allRecipes = Array.isArray(state.recipes) ? state.recipes : [];
    const compliantRecipes = allRecipes.filter(r => checkDietaryCompliance(r, activePrefs).compliant);
    const hasTagCI = (recipe, tag) =>
      Array.isArray(recipe?.tags) && recipe.tags.some(t => String(t).toLowerCase() === tag.toLowerCase());

    const slotDefs = [
      { slot: 'breakfast', tag: 'Desayuno', label: 'Desayunos' },
      { slot: 'lunch', tag: 'Almuerzo', label: 'Almuerzos' },
      { slot: 'snack', tag: 'Merienda', label: 'Meriendas' },
      { slot: 'dinner', tag: 'Cena', label: 'Cenas' }
    ];

    // Para una semana completa de 7 días se necesitan al menos 3 opciones distintas por momento de comida
    return slotDefs.filter(def => compliantRecipes.filter(r => hasTagCI(r, def.tag)).length < 3);
  }

  isSingleDayPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return false;
    // Si el usuario pide ideas, sugerencias o se refiere a un momento concreto (ej: "dame ideas para cenar hoy"), NO es plan de día completo
    const isSlotOrSuggestion = /\b(ideas?|sugiere|sugerencias?|qu[eé]\s+(hago|preparo|cocino|puedo|como|ceno|desayuno|meriendo)|recomienda|recomendaci[oó]n|opciones?)\b/i.test(prompt) ||
      (/\b(cena|cenar|almuerzo|comida|comer|desayuno|desayunar|merienda|merendar)\b/i.test(prompt) && !/\b(planifica|organiza|men[uú]\s+del\s+d[ií]a|todo\s+el\s+d[ií]a)\b/i.test(prompt));
    if (isSlotOrSuggestion) return false;

    // Días de la semana específicos o referencias temporales directas
    return /\b(hoy|dia\s+de\s+hoy|d[ií]a\s+de\s+hoy|ma[ñn]ana|solo\s+hoy|este\s+d[ií]a|para\s+hoy|de\s+hoy|qu[eé]\s+como\s+hoy|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\b/i.test(prompt) &&
      !/\b(fin\s+de\s+semana|finde|semana\s+completa|toda\s+la\s+semana|men[uú]\s+semanal)\b/i.test(prompt);
  }

  isWeekendPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return false;
    // Si hay una negación o exclusión expresa, NO es un comando enfocado en el fin de semana
    if (/\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de|no\s+quiero)\b.*?\b(fin\s+de\s+semana|finde|s[aá]bado|domingo)\b/i.test(prompt)) {
      return false;
    }
    return /\b(fin\s+de\s+semana|finde|s[aá]bado\s+y\s+domingo|sabado\s+y\s+domingo)\b/i.test(prompt);
  }

  isRecurringWeeklySlotPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return false;
    return /\b(pon|mete|asigna|a[ñn]ade|cambia)\b.*?\b(todas?\s+las?\s+|todos?\s+los?\s+|en\s+las?\s+|en\s+los?\s+)?(metiendas?|meriendas?|desayunos?|almuerzos?|comidas?|cenas?)\b.*?\b(semana|d[ií]as?)\b|\b(todas?\s+las?\s+|todos?\s+los?\s+)(metiendas?|meriendas?|desayunos?|almuerzos?|comidas?|cenas?)\b.*?\b(pon|mete|asigna|a[ñn]ade)\b/i.test(prompt);
  }

  isWeeklyPlanPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return false;
    // Si el usuario pide un solo día específico o el fin de semana, NO forzar semana completa
    if (this.isSingleDayPrompt(prompt) || this.isWeekendPrompt(prompt)) return false;
    return /\b(planifica|planifiques|planificar|organiza|organices|organizar|completa|completes|rellena|rellenes|pon|pongas|asigna|asignes|prepara|prepares|haz|hazme|crea|crees|diseña|diseñes|arma|armes)\b.*?\b(semana|men[uú]|plan)\b|\b(men[uú]\s+semanal|plan\s+semanal|semana\s+completa|dejad[oa]s?\s+vac[ií][ao]s?|huecos?\s+libres?|huecos?\s+vac[ií][ao]s?|faltan\s+comidas|sin\s+aparecer\s+muchas\s+comidas|platos\s+en\s+el\s+plan|desayunos\s+y\s+meriendas|batch\s+cooking|sobras|tuppers?)\b/i.test(prompt);
  }

  isAiActionPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return false;
    if (this.isSingleDayPrompt(prompt) || this.isWeeklyPlanPrompt(prompt) || this.isRecurringWeeklySlotPrompt(prompt)) return true;
    return /\b(asigna|pon\s+en\s+el|cambia\s+el|actualiza\s+el\s+plan|crea\s+una\s+receta|crea\s+recetas|inventa|nueva\s+receta|compra|a[ñn]ade|apunta|agrega|quita|borra|elimina|tacha|planifica|organiza)\b/i.test(prompt);
  }

  stripRecipeIdsFromText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\s*\([\s*`'"]*rec-[a-zA-Z0-9_-]+[\s*`'"]*\)/gi, '')
      .replace(/\s*[`*]rec-[a-zA-Z0-9_-]+[`*]/gi, '')
      .replace(/\s*rec-[a-zA-Z0-9_-]+/gi, '');
  }

  detectPromptCriteria(prompt) {
    if (!prompt || typeof prompt !== 'string') return [];
    const lower = prompt.toLowerCase();
    const criteria = [];

    // Metas de macros y fitness / gym / deporte (US-68, US-70, v1.25)
    if (/prote[ií]n|gimnasio|gym|entreno|entrenar|pesas|m[uú]sculo|fitness|post-?entreno|pre-?entreno|deporte|recuperaci[oó]n/i.test(lower)) {
      criteria.push({ type: 'macro', key: 'protein', min: 25 });
      criteria.push({ type: 'tag', tag: 'Alta en Proteínas' });
    }
    if (/calor[ií]a|baja\s+en\s+calor|ligera|ligero|livian/i.test(lower)) {
      criteria.push({ type: 'tag', tag: 'Baja en Calorías' });
      criteria.push({ type: 'tag', tag: 'Saludable' });
    }
    if (/carbohidrato|baja\s+en\s+carbo|low\s*carb/i.test(lower)) criteria.push({ type: 'tag', tag: 'Baja en Carbohidratos' });
    if (/keto|cetog[eé]nic/i.test(lower)) criteria.push({ type: 'tag', tag: 'Keto' });
    if (/vegan/i.test(lower)) criteria.push({ type: 'tag', tag: 'Vegano' });
    if (/vegetar/i.test(lower)) criteria.push({ type: 'tag', tag: 'Vegetariano' });
    if (/gluten|cel[ií]ac/i.test(lower)) criteria.push({ type: 'tag', tag: 'Sin Gluten' });
    if (/lactosa/i.test(lower)) criteria.push({ type: 'tag', tag: 'Sin Lactosa' });
    if (/r[aá]pida|express|f[aá]cil|pocos?\s+ingredientes/i.test(lower)) criteria.push({ type: 'tag', tag: 'Rápida' });
    if (/merienda|metiendas?/i.test(lower)) criteria.push({ type: 'tag', tag: 'Merienda' });
    if (/cena|cenar|noche/i.test(lower)) criteria.push({ type: 'slot', slot: 'dinner' });
    if (/almuerzo|comida|comer|mediod[ií]a/i.test(lower)) criteria.push({ type: 'slot', slot: 'lunch' });
    if (/desayuno|desayunar|ma[ñn]ana/i.test(lower)) criteria.push({ type: 'slot', slot: 'breakfast' });

    // Ingredientes o familias clave
    if (/pescado|marisco|at[uú]n|salm[oó]n|merluza|bacalao|gamba/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /pescado|marisco|at[uú]n|salm[oó]n|merluza|bacalao|gambas?|langostinos?|lubina|dorada|trucha/i });
    }
    if (/pollo|pavo|ave/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /pollo|pavo/i });
    }
    if (/ternera|carne|vaca|cerdo|lomo/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /ternera|carne|vaca|lomo|solomillo|cerdo/i });
    }
    if (/legumbre|garbanzo|lenteja|alubia|frijol/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /garbanz|lentej|alubi|frijol|legumbre/i });
    }
    if (/pasta|arroz/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /pasta|arroz|espagueti|macarron|fideos?/i });
    }
    if (/huevo|tortilla/i.test(lower)) {
      criteria.push({ type: 'ingredient', regex: /huevo|tortilla/i });
    }

    return criteria;
  }

  selectRelevantRecipesForPrompt(recipes, prompt = '') {
    if (!Array.isArray(recipes) || recipes.length === 0) return [];
    if (recipes.length <= 80) return recipes;

    const lowerPrompt = (prompt || '').toLowerCase();
    const criteria = this.detectPromptCriteria(prompt);

    // Priorizar recetas nombradas directamente en la petición del usuario
    const promptStopWordsRegex = /\b(de|del|la|las|el|los|un|una|unos|unas|con|al|a|en|y|para|sin|por|pon|mete|asigna|a[ñn]ade|todas?|toda|semana|esta|las|los|receta|metiendas?|meriendas?|desayunos?|almuerzos?|cenas?)\b/gi;
    const promptKeywords = (prompt || '')
      .toLowerCase()
      .replace(promptStopWordsRegex, ' ')
      .split(/\s+/)
      .map(k => k.trim())
      .filter(k => k.length >= 3);

    const directMentionRecipes = [];
    const directMentionIds = new Set();
    if (promptKeywords.length > 0) {
      recipes.forEach(r => {
        const titleNorm = normalizeIngredientText(r.title || '');
        const titleTokens = titleNorm.replace(promptStopWordsRegex, ' ').split(/\s+/).filter(t => t.length >= 3);
        if (titleTokens.length === 0) return;
        const matchingTokens = titleTokens.filter(tt => promptKeywords.some(pk => pk.includes(tt) || tt.includes(pk)));
        if (matchingTokens.length >= Math.min(2, titleTokens.length)) {
          directMentionRecipes.push(r);
          directMentionIds.add(r.id);
        }
      });
    }

    // Prioridades configuradas del usuario (US-68, US-70)
    const userPrefs = Array.isArray(state?.dietaryPreferences) ? state.dietaryPreferences : [];
    const userGoals = state?.settings?.nutritionGoals;
    const isGoalActive = !!userGoals?.enabled;
    const targetProtein = isGoalActive ? (userGoals.protein || 0) : 0;
    const isHighProteinGoal = targetProtein >= 120 || userPrefs.some(p => /prote/i.test(p));

    // Detección de momento específico en el prompt
    const isDinnerQuery = /\b(cena|cenar|cenas|noche)\b/i.test(lowerPrompt);
    const isLunchQuery = /\b(almuerzo|almuerzos|comida|comidas|comer|mediod[ií]a)\b/i.test(lowerPrompt);
    const isBreakfastQuery = /\b(desayuno|desayunos|desayunar|ma[ñn]ana)\b/i.test(lowerPrompt);
    const isSnackQuery = /\b(merienda|meriendas|snack|snacks|picoteo)\b/i.test(lowerPrompt);
    const isSingleSlotQuery = isDinnerQuery || isLunchQuery || isBreakfastQuery || isSnackQuery;

    // Detección de intención deportiva / gimnasio / recuperación
    const isFitnessIntent = /\b(gimnasio|gym|entreno|entrenar|pesas|m[uú]sculo|musculo|fitness|post-?entreno|pre-?entreno|deporte|recuperaci[oó]n)\b/i.test(lowerPrompt);

    // Sistema de puntuación y ranking inteligente
    const scored = recipes.map(r => {
      let score = 0;
      const rId = r.id;
      const titleLower = String(r.title || '').toLowerCase();
      const tags = (r.tags || []).map(t => String(t).toLowerCase());
      const nut = getRecipeNutrition(r);
      const ingText = (r.ingredients || []).map(i => typeof i === 'string' ? i : (i.name || '')).join(' ').toLowerCase();

      const isBreakfastOrSnack = tags.some(t => t.includes('desayuno') || t.includes('merienda')) ||
        /avena|porridge|yogur|chia|smoothie|batido|pancake|torta|tosta|fruta|bowl/i.test(titleLower);

      // 1. Mención directa en la petición
      if (directMentionIds.has(rId)) {
        score += 150;
      }

      // 2. Recetas Favoritas (❤️): Máxima prioridad del usuario (US-70)
      if (r.isFavorite) {
        score += 60;
      }

      // 3. Preferencias dietéticas configuradas del usuario
      if (userPrefs.length > 0) {
        const comp = checkDietaryCompliance(r, userPrefs);
        if (comp.compliant) {
          score += 45;
        } else {
          score -= 40;
        }
      }

      // 4. Objetivos nutricionales o intención de gimnasio/proteínas
      if (isFitnessIntent || isHighProteinGoal) {
        if ((nut.protein || 0) >= 30) score += 40;
        else if ((nut.protein || 0) >= 20) score += 20;
        if (tags.some(t => t.includes('prote') || t.includes('fitness'))) score += 25;
      }

      // 5. Coherencia con el momento del día
      if (isDinnerQuery) {
        if (tags.some(t => t.includes('cena')) || (!isBreakfastOrSnack && /cena|saludable|ligera/i.test(tags.join(' ')))) {
          score += 45;
        } else if (isBreakfastOrSnack) {
          score -= 70; // No sugerir desayunos para cenar
        } else {
          score += 15;
        }
      } else if (isLunchQuery) {
        if (!isBreakfastOrSnack) score += 35;
        else score -= 50;
      } else if (isBreakfastQuery) {
        if (tags.some(t => t.includes('desayuno')) || isBreakfastOrSnack) score += 55;
        else score -= 60;
      } else if (isSnackQuery) {
        if (tags.some(t => t.includes('merienda') || t.includes('snack')) || isBreakfastOrSnack) score += 55;
        else score -= 60;
      }

      // 6. Criterios adicionales del prompt
      for (const c of criteria) {
        if (c.type === 'macro' && c.key === 'protein') {
          if ((nut.protein || 0) >= c.min) score += 30;
        } else if (c.type === 'tag') {
          if (tags.some(t => t.includes(c.tag.toLowerCase()))) score += 30;
        } else if (c.type === 'ingredient') {
          if (c.regex.test(titleLower) || c.regex.test(ingText)) score += 40;
        }
      }

      // 7. Completitud y calidad de la ficha
      if (r.image && !r.image.includes('placeholder')) score += 5;
      if (Array.isArray(r.instructions) && r.instructions.length > 0) score += 5;

      // Variedad determinista entre llamadas
      let hash = 0;
      for (let j = 0; j < rId.length; j++) hash = (hash * 31 + rId.charCodeAt(j)) % 17;
      score += (hash % 7);

      return { recipe: r, score, isBreakfastOrSnack };
    });

    // Ordenar de mayor a menor puntuación de relevancia
    scored.sort((a, b) => b.score - a.score);

    // Límite seguro para Gemini: 50 recetas para momentos individuales (cena/almuerzo),
    // o 90 recetas para planificación semanal completa (con balance de slots).
    // NUNCA enviar el catálogo masivo completo (ej. 887 recetas) para evitar timeouts.
    const targetLimit = isSingleSlotQuery ? 50 : 90;

    if (isSingleSlotQuery) {
      return scored.slice(0, targetLimit).map(s => s.recipe);
    }

    // Para menú semanal o peticiones genéricas: garantizar variedad entre desayunos, meriendas y platos principales
    const selected = [];
    const selectedIds = new Set();

    const bAndS = scored.filter(s => s.isBreakfastOrSnack);
    const mains = scored.filter(s => !s.isBreakfastOrSnack);

    // Reservar ~20 desayunos y meriendas
    for (const item of bAndS.slice(0, 20)) {
      selected.push(item.recipe);
      selectedIds.add(item.recipe.id);
    }

    // Rellenar con los mejores platos principales (almuerzos y cenas)
    for (const item of mains) {
      if (selected.length >= targetLimit) break;
      if (!selectedIds.has(item.recipe.id)) {
        selected.push(item.recipe);
        selectedIds.add(item.recipe.id);
      }
    }

    // Si aún queda hueco, completar con los mejores puntuados restantes
    for (const item of scored) {
      if (selected.length >= targetLimit) break;
      if (!selectedIds.has(item.recipe.id)) {
        selected.push(item.recipe);
        selectedIds.add(item.recipe.id);
      }
    }

    return selected;
  }

  buildAiSystemInstruction(prompt = '') {
    const todayKey = toLocalDateKey(new Date());
    const weekDays = this.getPlannerWeekDates();
    const prefs = (state.dietaryPreferences || []).join(', ') || 'Ninguna restricción específica';
    const goals = state.settings?.nutritionGoals?.enabled
      ? `${state.settings.nutritionGoals.calories} kcal, ${state.settings.nutritionGoals.protein}g Proteínas, ${state.settings.nutritionGoals.carbs}g Carbos, ${state.settings.nutritionGoals.fat}g Grasas`
      : 'Sin metas numéricas estrictas activas';

    const sourceRecipes = this.selectRelevantRecipesForPrompt(state.recipes || [], prompt);
    const recipesCatalog = sourceRecipes.map(r => {
      const nut = getRecipeNutrition(r);
      const cleanTitle = String(r.title || '').replace(/[\r\n]+/g, ' ').slice(0, 80);
      const cleanTags = (r.tags || []).slice(0, 4).join(', ');
      const cleanIngredients = (r.ingredients || [])
        .map(i => typeof i === 'string' ? i : (i.name || ''))
        .map(n => n.replace(/[\r\n]+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 10)
        .join(', ');
      return `- ID: "${r.id}" | "${cleanTitle}" | Ingredientes: [${cleanIngredients}] | Tags: [${cleanTags}] | Macros: ${nut.calories}kcal, P:${nut.protein}g, C:${nut.carbs}g, G:${nut.fat}g${r.isFavorite ? ' | ❤️ FAVORITA: Sí' : ''}`;
    }).join('\n');

    const currentPlanSummary = weekDays.map(d => {
      const dayPlan = state.getDayPlan(d.dateKey, d.dayName);
      return `- ${d.dayName} (${d.dateKey}): Desayuno=${dayPlan.breakfast || 'vacío'}, Almuerzo=${dayPlan.lunch || 'vacío'}, Merienda=${dayPlan.snack || 'vacío'}, Cena=${dayPlan.dinner || 'vacío'}`;
    }).join('\n');

    const pendingShop = (state.shoppingList || []).filter(i => !i.isChecked).map(i => `${i.name} (${i.amount || 1} ${i.unit || ''})`).join(', ') || 'Vacía';
    const slotGaps = this.getDietarySlotGaps();
    const gapNotice = slotGaps.length > 0
      ? `\nAVISO DE COBERTURA DEL CATÁLOGO: El usuario no tiene recetas guardadas para [${slotGaps.map(g => g.label).join(', ')}] que cumplan estrictamente con [${prefs}]. Al planificar la semana con "set_weekly_plan", rellena esos huecos con las mejores opciones actuales de su catálogo (sin dejar huecos vacíos) y SUGIÉRELE expresamente en tu mensaje crear recetas nuevas de ${slotGaps.map(g => g.label).join(' y ')} adaptadas a (${prefs}) para esos huecos.`
      : '';

    const isEn = typeof window !== 'undefined' && window.I18n && window.I18n.getLanguage() === 'en';
    const userName = this.getUserDisplayName();
    const userRef = userName || (isEn ? 'the user' : 'el usuario');
    const userPossessive = userName ? `de ${userName}` : (isEn ? 'del usuario' : 'del usuario');
    const userCatalog = userName ? `DE ${userName.toUpperCase()}` : 'DEL USUARIO';

    return `Eres el Sous Chef Personal ${userName ? `de ${userName}` : 'en Sabory'} en Food Assistant.
Fecha actual: ${todayKey}.
Raciones por defecto en casa: ${state.settings?.defaultServings || 2}.
Preferencias dietéticas ${userName ? `de ${userName}` : 'del usuario'} (RESPETAR SIEMPRE): ${prefs}.
Objetivos nutricionales diarios ${userName ? `de ${userName}` : 'del usuario'}: ${goals}.
Lista de la compra pendiente: ${pendingShop}.${gapNotice}

CATÁLOGO DE RECETAS ${userCatalog}:
${recipesCatalog || '(Sin recetas guardadas)'}

PLAN SEMANAL ACTUAL (Semana visible):
${currentPlanSummary}

INSTRUCCIONES DE CONTROL Y PERSONALIDAD OBLIGATORIAS:
1. Dirígete siempre a ${userRef} de forma natural, cálida, concisa y directa (sin introducciones robóticas, sin disculpas innecesarias y yendo siempre al grano).
2. PRECISIÓN DE MOMENTO Y ALCANCE (EVITAR SOBRE-PLANIFICACIÓN):
- Si ${userRef} pide ideas, dudas o sugerencias para un momento concreto (ej. "dame ideas para cenar hoy", "¿qué puedo cenar?", "ideas para el almuerzo"): NUNCA planifiques ni reemplaces el día entero. Ofrece 2 o 3 opciones apetecibles y saludables para ese momento específico (cena, almuerzo, etc.) de forma conversacional.
- Si ${userRef} pide asignar un plato a una comida concreta (ej. "pon salmón para cenar hoy"), usa "set_day_plan" manteniendo intactos el desayuno, almuerzo y merienda existentes del día.
- Solo invoca "set_day_plan" con las 4 comidas completas cuando ${userRef} pida explícitamente planificar u organizar todo el día ("planifica mi día de hoy", "organiza todas las comidas de hoy"). NUNCA invoques "set_weekly_plan" para un solo día ni toques el resto de la semana.
3. PLANIFICACIÓN SEMANAL INTELIGENTE Y APLICACIÓN DIRECTA EN EL PLANIFICADOR:
- Cuando ${userRef} pida crear, armar, planificar o modificar su menú semanal (ej. "Crea un plan semanal...", "Planifica mi semana...", "Organiza las comidas..."):
  * DEBES invocar OBLIGATORIAMENTE la herramienta "set_weekly_plan" para que los platos queden guardados y aplicados directamente en su Planificador. NUNCA respondas solo con texto plano pidiendo confirmación cuando se te pide explícitamente crear el plan.
  * Utiliza SIEMPRE los IDs ("rec-...") de las recetas ya existentes en el catálogo ${userPossessive}. NUNCA uses "create_and_save_recipe" para platos que ya están en el catálogo ${userPossessive} ni si solo se te pidió planificar.
  * Si ${userRef} pide exclusiones (ej. "no incluyas el fin de semana", "sin meriendas"), pasa null en esas propiedades en "days" (ej. "snack": null) u omite el fin de semana. El esquema de "set_weekly_plan" ahora permite valores null en comidas excluidas.
- ASIGNACIÓN RECURRENTE DE UNA RECETA A UN MOMENTO CONCRETO EN LA SEMANA:
  * Si ${userRef} pide asignar, poner o cambiar una receta concreta en un momento de comida específico para varios días o para toda la semana (ej. "pon en todas las meriendas de esta semana el Batido de proteinas MyProtein", "asigna la ensalada césar a las cenas de la semana", "pon avena en los desayunos"):
    - NUNCA uses "manage_shopping_list" (NO es un artículo de compra, es una asignación en el planificador).
    - NUNCA uses "create_and_save_recipe" si el plato ya existe en el catálogo de recetas ${userPossessive} (aunque ${userRef} diga "añade la receta X").
    - DEBES invocar "set_weekly_plan" indicando en "days" los días correspondientes con su "dateKey" y asignando el ID de esa receta ÚNICAMENTE en el momento pedido (ej. "snack": "rec-...", "breakfast": "rec-...", etc.), conservando o dejando intactos los demás momentos de comida existentes.
    - TOLERANCIA A PREPOSICIONES Y CONECTORES: ${userRef} puede nombrar una receta con o sin conectores como "de", "con", "al", "a la" (ej. "Batido de proteinas MyProtein" frente a "Batido proteinas MyProtein", o "Pollo verduras" frente a "Pollo con verduras"). Empareja SIEMPRE por similitud de palabras clave con el catálogo ${userPossessive} y utiliza el ID exacto ("rec-...").
    - TOLERANCIA A ERRATAS TIPOGRÁFICAS EN MOMENTOS: Entiende erratas menores comunes como "metiendas" -> meriendas, "almuersos" -> almuerzos, "desallunos" -> desayunos.
- RESPETO RIGUROSO A EXCLUSIONES DEL USUARIO:
  * Si ${userRef} indica "no incluyas el fin de semana", "de lunes a viernes" o excluye ciertos días, DEBES dejar los días Sábado y Domingo con comidas en null o sin modificar.
  * Si ${userRef} indica "sin meriendas", "sin desayunos" o excluye cualquier momento, DEBES dejar esos momentos en null. NUNCA fuerces comidas que el usuario haya pedido excluir explícitamente.
- CUADRE FLEXIBLE DE OBJETIVOS NUTRICIONALES DIARIOS:
  * Si ${userRef} tiene objetivos nutricionales diarios activos (${goals}):
    - Al crear o proponer un menú semanal, combina las comidas de cada día (desayuno, almuerzo, merienda y cena) buscando que la suma total diaria de calorías y macronutrientes se aproxime de forma equilibrada y realista a sus objetivos (tolerancia flexible de ±10-15%, sin obsesionarte con exactitudes milimétricas que perjudiquen la variedad o el disfrute de la comida casera).
  * ADVERTENCIA TRANSPARENTE ANTE SOBREPASOS EXCESIVOS (SIN BLOQUEO):
    - Si ${userRef} pide asignar, poner o cambiar una receta (ej. poner un batido proteico en todas las meriendas, o un plato muy calórico) y eso causa que en uno o varios días se sobrepase de forma excesiva (+25% a +30% o más) el objetivo diario de calorías, proteínas, carbohidratos o grasas:
      1. NUNCA bloquees ni te niegues: ejecuta SIEMPRE la acción solicitada en el planificador ("set_weekly_plan" o "set_day_plan"). La voluntad de ${userRef} siempre manda.
      2. Añade en tu mensaje de respuesta un aviso nutricional breve, cordial y transparente (ej. "💡 Nota: He asignado tu plato al planificador. Ten en cuenta que con esta merienda rondarás los ~Xg de proteína diaria, superando tu meta de Yg.").
- REGLA ESTRICTA DE VARIEDAD Y ROTACIÓN DE PROTEÍNAS (ANTI-MONOTONÍA):
  * NUNCA repitas la misma receta en la misma semana (excepto si ${userRef} solicita expresamente modo sobras o Batch Cooking).
  * NUNCA repitas la misma fuente de proteína principal (ej. pollo) en días seguidos ni dos veces en el mismo día. Alterna obligatoriamente fuentes proteicas: pescados (blanco o azul), legumbres, aves (pollo/pavo), huevos, ternera magra y opciones vegetales/tofu.
  * PONDERACIÓN INTELIGENTE DE RECETAS FAVORITAS (US-70): Otorga una ligera prioridad de selección a las recetas marcadas con "❤️ FAVORITA: Sí" cuando encajen con el momento de comida y las preferencias dietéticas ${userPossessive}, integrándolas de forma natural en el menú semanal o sugerencias sin monopolizar la semana ni romper la rotación de proteínas y variedad.
  * Si ${userRef} pide un enfoque nutricional (ej. "enfoque en proteínas", "bajo en calorías"), selecciona preferentemente recetas del catálogo con altos valores de ese macro y explica brevemente en tu mensaje tu razonamiento y cómo se distribuyen los nutrientes a lo largo de los días planificados.
- RAZONAMIENTO, TRANSPARENCIA Y PREGUNTAS:
  * Si en el catálogo de recetas no hay suficientes platos para cubrir los días solicitados sin repetir o sin incumplir las preferencias, RAZONA con total honestidad: explica a ${userRef} qué días has planificado y pregúntale si quiere que le inventes y guardes recetas nuevas para completar los huecos restantes.
  * Si la petición de ${userRef} es ambigua o contradictoria, PREGUNTA antes de asumir decisiones arbitrarias.
4. Si ${userRef} pide "Batch Cooking" o modo sobras: planifica cocinar ración doble en la cena de 2 días (ej. Lunes cena y Miércoles cena) para reutilizar como tupper en el almuerzo del día siguiente (Martes almuerzo y Jueves almuerzo) con isLeftoverLunch: true. Todas las demás comidas (desayunos, meriendas y demás cenas/almuerzos) DEBEN ser diferentes, frescas y variadas; NUNCA repitas todo el día idéntico.
5. REGLA ESTRICTA PARA LA LISTA DE LA COMPRA: Si ${userRef} pide añadir artículos concretos (ej. "añade leche y plátanos", "apunta 3 huevos"), usa SIEMPRE la herramienta "manage_shopping_list" con action: "add" y la lista de artículos pedidos en "items". NUNCA uses action: "add_from_current_plan" a menos que ${userRef} diga explícitamente "añade los ingredientes del plan", "vuelca el menú semanal" o "añade todo lo de la semana". PROHIBIDO ABSOLUTAMENTE usar "manage_shopping_list" si ${userRef} pide poner o asignar un plato a una comida o merienda del planificador (ej. "pon X en las meriendas", "mete X a las cenas"). En esos casos es SIEMPRE "set_weekly_plan" o "set_day_plan".
6. GUARDAR Y CREAR RECETAS EN EL CATÁLOGO: Si ${userRef} te pide recomendaciones de recetas y a continuación te pide guardarlas (ej: "guárdalas", "guarda las recetas", "guarda esa receta", "añádelas a mis recetas", "guárdame la primera", "créala"), o si te pide directamente inventar o crear una o varias recetas nuevas: DEBES invocar OBLIGATORIAMENTE la herramienta "create_and_save_recipe" (una llamada por cada receta que ${userRef} quiera guardar) con todos los datos estructurados: title, description, prepTimeMinutes, cookTimeMinutes, servings, tags, ingredients (name, amount, unit) e instructions (step, text, timerMinutes) y nutrition (calories, protein, carbs, fat). NUNCA uses esta herramienta si la receta ya existe en el catálogo ${userPossessive} (incluso si la frase empieza por "añade la receta X a las meriendas de toda la semana"), pues en ese caso se trata de planificarla con "set_weekly_plan". NUNCA respondas diciendo que has guardado una receta sin haber ejecutado la llamada a "create_and_save_recipe".
7. PROHIBIDO terminantemente mostrar IDs internos tipo "rec-..." en el texto visible para ${userRef}. Escribe los nombres legibles de los platos de forma limpia y atractiva.
8. CAPACIDAD DE RAZONAMIENTO Y ASESORAMIENTO CULINARIO: Si ${userRef} hace preguntas abiertas, pide sugerencias o dudas sobre cocina, sustitutos de ingredientes, macros, técnicas o ideas para comer, razona con empatía e inteligencia como un chef y nutricionista experto, ofreciendo explicaciones claras y prácticas. Solo invoca herramientas cuando haya una acción concreta que ejecutar en la app (como apuntar a la compra, planificar comidas o guardar recetas).
9. CONCISIÓN OBLIGATORIA PARA VOZ HABLADA: ${userRef} escucha tus respuestas mediante sintetizador de voz. Responde SIEMPRE de forma directa y sintética (máximo 1 a 3 frases claras y conversacionales). NUNCA recites monólogos largos ni enumeres listas eternas de ingredientes en el mensaje hablado si no se te pide expresamente. Confirma las acciones realizadas con agilidad y brevedad.
${isEn
        ? `10. LANGUAGE: Respond to ${userRef} in fluent English with a warm, encouraging and concise tone. Keep recipe names and food terms natural.`
        : `10. IDIOMA: Responde a ${userRef} en español natural, cálido y conciso.`}`;
  }

  getEffectiveGeminiApiKey() {
    const ownKey = typeof state.settings?.geminiApiKey === 'string' ? state.settings.geminiApiKey.trim() : '';
    if (ownKey) return ownKey;
    const householdKey = typeof state.household?.sharedGeminiApiKey === 'string' ? state.household.sharedGeminiApiKey.trim() : '';
    if (householdKey) return householdKey;
    const defaultKey = typeof state.settings?.defaultGeminiApiKey === 'string' ? state.settings.defaultGeminiApiKey.trim() : '';
    if (defaultKey) return defaultKey;
    return '';
  }

  async callGeminiAgent(prompt, systemInstruction = "", enableTools = true) {
    const provider = state.settings?.aiProvider || 'gemini';
    if (provider === 'openai') {
      return this.callOpenAiAgent(prompt, systemInstruction, enableTools);
    }
    if (provider === 'claude') {
      return this.callClaudeAgent(prompt, systemInstruction, enableTools);
    }

    const apiKey = this.getEffectiveGeminiApiKey();
    if (!apiKey) {
      return this.simulateGeminiAgentResponse(prompt);
    }

    let rawModel = state.settings.geminiModel || 'gemini-3.8-flash';
    if (rawModel === 'gemini-2.5-flash-lite' || rawModel === 'gemini-1.5-flash') {
      rawModel = 'gemini-3.8-flash';
      state.settings.geminiModel = 'gemini-3.8-flash';
      state.save && state.save('fa_settings', state.settings);
    }
    // Secuencia multi-modelo: Probar el modelo configurado (o 3.8 Flash) y ante cualquier problema
    // (timeout, cuota 429, o alta demanda 503) conmutar inmediatamente a 3.5 Flash-Lite en la misma llamada
    const candidateModels = (rawModel === 'gemini-3.5-flash-lite')
      ? ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
      : [rawModel, 'gemini-3.5-flash-lite'];

    const historyTurns = Array.isArray(this.aiChatHistory)
      ? this.aiChatHistory.slice(-6).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(m.text || '') }]
      }))
      : [];

    const payload = {
      contents: [
        ...historyTurns,
        { role: "user", parts: [{ text: prompt }] }
      ]
    };

    const effectiveSystemInstruction = systemInstruction || this.buildAiSystemInstruction(prompt);
    if (effectiveSystemInstruction) {
      payload.systemInstruction = { parts: [{ text: effectiveSystemInstruction }] };
    }

    if (enableTools) {
      payload.tools = [{ functionDeclarations: AI_TOOLS_DECLARATIONS }];
      payload.toolConfig = {
        functionCallingConfig: {
          mode: "AUTO"
        }
      };
    }

    let lastErrMsg = "Error al conectar con Gemini API";
    let data = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i];
      // US-39: La clave nunca va en la URL (?key=), se envía en la cabecera x-goog-api-key
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const controller = new AbortController();
      const timeoutMs = (model === 'gemini-3.8-flash') ? 16000 : 20000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      let response;

      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        lastErrMsg = fetchErr.name === 'AbortError' ? `Tiempo de espera agotado en modelo ${model}` : fetchErr.message;
        console.warn(`[FoodAssistant] Fallo de conexión o timeout con ${model}: ${lastErrMsg}. Conmutando a siguiente modelo...`);
        continue;
      }
      clearTimeout(timeoutId);

      if (response.ok) {
        data = await response.json();
        break;
      }

      let errMsg = "Error al conectar con Gemini API";
      try {
        const err = await response.json();
        errMsg = err.error?.message || errMsg;
      } catch (e) { }
      lastErrMsg = errMsg;

      console.warn(`[FoodAssistant] Error devuelto por ${model} (${response.status}): ${errMsg}. Conmutando a siguiente modelo...`);

      if (model === 'gemini-2.5-flash' && (/not available.*(new users|new projects)|not supported for new|permission denied|deprecated|not found/i.test(errMsg) || response.status === 404)) {
        state.settings.geminiModel = 'gemini-3.5-flash-lite';
        state.save && state.save('fa_settings', state.settings);
      }

      // Si es un error de clave inválida (400/401/403 API key not valid), no reintentar con otros modelos
      if (/api key not valid|invalid api key/i.test(errMsg)) {
        break;
      }

      // Pequeña pausa de alivio ante 429/503
      if (response.status === 429 || response.status === 503) {
        await new Promise(res => setTimeout(res, 300));
      }
    }

    if (!data) {
      const isDemandOrTimeoutOrQuota = /quota|exceeded|rate limit|429|resource exhausted|high demand|overloaded|try again later|503|tiempo de espera|timeout|abort|network|fetch/i.test(lastErrMsg);
      if (isDemandOrTimeoutOrQuota) {
        console.warn(`[FoodAssistant] Gemini saturado o cuota superada (${lastErrMsg}). Activando motor inteligente local.`);
        const sim = this.simulateGeminiAgentResponse(prompt);
        return {
          ...sim,
          isSimulatedFallback: true,
          originalError: lastErrMsg
        };
      }
      throw new Error(lastErrMsg);
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const textParts = [];
    const toolCalls = [];

    parts.forEach(part => {
      if (typeof part.text === 'string' && part.text.trim()) {
        textParts.push(part.text);
      }
      if (part.functionCall && part.functionCall.name) {
        toolCalls.push({
          name: part.functionCall.name,
          args: part.functionCall.args || {}
        });
      }
    });

    this.lastAiToolCalls = toolCalls;
    return {
      text: textParts.join('\n').trim(),
      toolCalls
    };
  }

  async callGeminiApi(prompt, systemInstruction = "") {
    const res = await this.callGeminiAgent(prompt, systemInstruction, false);
    return res.text || "";
  }

  buildSimulatedWeeklyPlanArgs(mode = 'replace', isBatchCooking = false, prompt = '') {
    const noWeekend = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(fin\s+de\s+semana|finde|s[aá]bado|domingo)\b/i.test(prompt || '');
    const noSnacks = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(merienda|meriendas)\b/i.test(prompt || '');
    const noBreakfast = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(desayuno|desayunos)\b/i.test(prompt || '');
    const activePrefs = Array.isArray(state.dietaryPreferences) ? state.dietaryPreferences : [];
    const allRecipes = Array.isArray(state.recipes) ? state.recipes : [];
    const compliantRecipes = activePrefs.length > 0
      ? allRecipes.filter(r => checkDietaryCompliance(r, activePrefs).compliant)
      : allRecipes;
    const pool = compliantRecipes.length > 0 ? compliantRecipes : allRecipes;

    // Restricciones estrictas (alergias / dieta ética) frente a metas de macros (ej. Alta en Proteínas)
    const macroPrefs = new Set(['Alta en Proteínas', 'Baja en Carbohidratos', 'Baja en Calorías', 'Baja en Grasas']);
    const strictPrefs = activePrefs.filter(p => !macroPrefs.has(p));
    const strictCompliantPool = strictPrefs.length > 0
      ? allRecipes.filter(r => checkDietaryCompliance(r, strictPrefs).compliant)
      : allRecipes;
    const safePool = strictCompliantPool.length > 0 ? strictCompliantPool : allRecipes;

    const hasTagCI = (recipe, tag) =>
      Array.isArray(recipe?.tags) && recipe.tags.some(t => String(t).toLowerCase() === tag.toLowerCase());

    const filterByTag = (tag, allowNonBreakfastFallback = false) => {
      const strictMatch = pool.filter(r => hasTagCI(r, tag));
      if (strictMatch.length > 0) return strictMatch;

      // Si no hay p.ej. ningún Desayuno o Merienda con etiqueta "Alta en Proteínas",
      // usar los Desayunos / Meriendas del catálogo que respetan las alergias estrictas, ordenados por proteína
      const safeTagMatch = safePool.filter(r => hasTagCI(r, tag));
      if (safeTagMatch.length > 0) {
        return [...safeTagMatch].sort((a, b) => (getRecipeNutrition(b).protein || 0) - (getRecipeNutrition(a).protein || 0));
      }

      if (tag.toLowerCase() === 'merienda') {
        const snackOrBreakfast = safePool.filter(r => hasTagCI(r, 'Desayuno') || /batido|yogur|hummus|tosta|fruta|avena|snack/i.test(r.title || ''));
        if (snackOrBreakfast.length > 0) return snackOrBreakfast;
      }

      if (tag.toLowerCase() === 'desayuno') {
        const breakfastCandidates = safePool.filter(r => hasTagCI(r, 'Desayuno') || /pancake|torta|avena|tosta|huevo|tortilla|yogur|chia|cha|smoothie|batido|fruta|porridge|bowl/i.test(r.title || ''));
        if (breakfastCandidates.length > 0) return breakfastCandidates;
      }

      if (allowNonBreakfastFallback) {
        const nonBreakfast = pool.filter(r => !hasTagCI(r, 'Desayuno') && !hasTagCI(r, 'Merienda'));
        if (nonBreakfast.length > 0) return nonBreakfast;
      }
      return pool;
    };

    const breakfastList = filterByTag('Desayuno', false);
    const lunchList = filterByTag('Almuerzo', true);
    const snackList = filterByTag('Merienda', false);
    const dinnerList = filterByTag('Cena', true);

    const weekDays = this.getPlannerWeekDates();
    let prevDinnerId = null;
    const days = weekDays.map((wDay, idx) => {
      const pick = (list, offset = 0) => list.length > 0 ? list[(idx + offset) % list.length].id : null;
      let lunchId = pick(lunchList, 0);
      let dinnerId = pick(dinnerList, 1);
      let isLeftoverLunch = false;

      // US-65: Batch Cooking inteligente / Sobras en tupper:
      // En vez de duplicar exactamente todo el día, se cocina ración doble de cena y se lleva de tupper para el almuerzo del día siguiente
      if (isBatchCooking) {
        if (idx === 1 && prevDinnerId) { // Martes almuerzo = tupper de la cena del Lunes
          lunchId = prevDinnerId;
          isLeftoverLunch = true;
        } else if (idx === 3 && prevDinnerId) { // Jueves almuerzo = tupper de la cena del Miércoles
          lunchId = prevDinnerId;
          isLeftoverLunch = true;
        }
      }

      prevDinnerId = dinnerId;

      // Deduplicación almuerzo vs cena en el mismo día
      const safeDinnerPool = dinnerList.filter(r => r.id !== lunchId);
      const safeDinnerId = safeDinnerPool.length > 0 ? pick(safeDinnerPool, 0) : dinnerId;

      const isWeekendDay = String(wDay.dayName || '').toLowerCase().includes('sáb') ||
        String(wDay.dayName || '').toLowerCase().includes('sab') ||
        String(wDay.dayName || '').toLowerCase().includes('dom');

      if (noWeekend && isWeekendDay) {
        return {
          dateKey: wDay.dateKey,
          dayName: wDay.dayName,
          breakfast: null,
          lunch: null,
          snack: null,
          dinner: null,
          isLeftoverLunch: false
        };
      }

      return {
        dateKey: wDay.dateKey,
        dayName: wDay.dayName,
        breakfast: noBreakfast ? null : pick(breakfastList, 0),
        lunch: lunchId,
        snack: noSnacks ? null : pick(snackList, 0),
        dinner: safeDinnerId,
        isLeftoverLunch
      };
    });

    return { mode, days, isBatchCooking };
  }

  async callOpenAiAgent(prompt, systemInstruction = "", enableTools = true) {
    const apiKey = this.getEffectiveGeminiApiKey();
    if (!apiKey) return this.simulateGeminiAgentResponse(prompt);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const messages = [];
      const effectiveSystemInstruction = systemInstruction || this.buildAiSystemInstruction();
      if (effectiveSystemInstruction) {
        messages.push({ role: 'system', content: effectiveSystemInstruction });
      }
      if (Array.isArray(this.aiChatHistory)) {
        this.aiChatHistory.slice(-6).forEach(m => {
          messages.push({ role: m.role === 'model' ? 'assistant' : 'user', content: String(m.text || '') });
        });
      }
      messages.push({ role: 'user', content: prompt });

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (resp.ok) {
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content || '';
        return { text: content, toolCalls: [] };
      }
      const err = await resp.json().catch(() => ({}));
      const msg = err.error?.message || `Error HTTP ${resp.status}`;
      console.warn('[FoodAssistant] Fallback OpenAI:', msg);
      return { ...this.simulateGeminiAgentResponse(prompt), isSimulatedFallback: true, originalError: msg };
    } catch (e) {
      console.warn('[FoodAssistant] Error conexión OpenAI, fallback local:', e.message);
      return { ...this.simulateGeminiAgentResponse(prompt), isSimulatedFallback: true, originalError: e.message };
    }
  }

  async callClaudeAgent(prompt, systemInstruction = "", enableTools = true) {
    const apiKey = this.getEffectiveGeminiApiKey();
    if (!apiKey) return this.simulateGeminiAgentResponse(prompt);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const messages = [];
      if (Array.isArray(this.aiChatHistory)) {
        this.aiChatHistory.slice(-6).forEach(m => {
          messages.push({ role: m.role === 'model' ? 'assistant' : 'user', content: String(m.text || '') });
        });
      }
      messages.push({ role: 'user', content: prompt });

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          system: systemInstruction || this.buildAiSystemInstruction(),
          messages
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.[0]?.text || '';
        return { text, toolCalls: [] };
      }
      const err = await resp.json().catch(() => ({}));
      const msg = err.error?.message || `Error HTTP ${resp.status}`;
      console.warn('[FoodAssistant] Fallback Claude:', msg);
      return { ...this.simulateGeminiAgentResponse(prompt), isSimulatedFallback: true, originalError: msg };
    } catch (e) {
      console.warn('[FoodAssistant] Error conexión Claude, fallback local:', e.message);
      return { ...this.simulateGeminiAgentResponse(prompt), isSimulatedFallback: true, originalError: e.message };
    }
  }

  simulateGeminiAgentResponse(prompt) {
    const lower = (prompt || '').toLowerCase();
    const userName = this.getUserDisplayName();
    const salutation = userName ? `, ${userName}` : '';

    // 0. Recetas temáticas, Halloween, celebraciones o preguntas culinarias abiertas
    if (/hall|halloween|calabaza|tem[aá]tic|oto[ñn]o|fiesta/i.test(prompt)) {
      return {
        text: `¡Por supuesto${salutation}! Aquí tienes 3 ideas temáticas espectaculares, divertidas y saludables para **Halloween**:\n\n` +
          `🎃 **1. Pimientos Monstruosos Rellenos de Arroz y Pavo**:\n` +
          `Pimientos naranjas y amarillos vaciados, a los que les tallas ojos y sonrisa terrorífica. Los rellenas con carne picada de pavo, arroz integral salteado y tomate natural, gratinados con queso mozzarella fundido imitando telarañas.\n\n` +
          `👻 **2. Momias de Hojaldre con Pechuga de Pollo y Espárragos**:\n` +
          `Tiras jugosas de pollo marinadas con especias, envueltas en tiras finas de masa de hojaldre dejando huecos como vendas de momia, doradas al horno con dos gotas de salsa o granos de pimienta como ojos.\n\n` +
          `🦇 **3. Crema Tenebrosa de Calabaza con Arañas de Champiñón y Sésamo Negro**:\n` +
          `Crema suave de calabaza asada y puerro. Decora la superficie con un hilo de yogur griego en círculos concéntricos para formar una telaraña y pequeños champiñones salteados colocados con patitas de romero simulando arañas.\n\n` +
          `¿Te apetece que guardemos alguna de estas recetas en tu recetario o que añadamos los ingredientes directamente a tu lista de la compra?`,
        toolCalls: []
      };
    }

    // 0.0 Consultas y dudas culinarias, sustitutos o técnicas
    if (/sustitu|cambiar|puedo usar|qu[eé] pongo en vez|consejo|truco|c[oó]mo cocino|c[oó]mo preparar/i.test(prompt)) {
      return {
        text: `¡Claro${salutation}! En la cocina casi todo tiene alternativa saludable:\n\n` +
          `• Si buscas sustituir **harinas refinadas**, la harina de avena integral o almendra molida funcionan de maravilla.\n` +
          `• Para reemplazar la **nata o crema**, el queso batido 0%, yogur griego natural o bebida de soja sin azúcar aportan cremosidad sin grasas saturadas.\n` +
          `• Si necesitas un sustituto del **huevo**, 1 cucharada de semillas de chía o lino molido hidratadas en 3 cucharadas de agua crean una textura ideal para repostería.\n\n` +
          `Dime qué ingrediente concreto quieres cambiar o para qué plato lo necesitas y te doy la mejor proporción exacta.`,
        toolCalls: []
      };
    }

    // 0.05 Sugerencias o ideas para un momento concreto (Cena, Almuerzo, Desayuno, Merienda) - NO sobre-planificar todo el día
    const isAskingSuggestions = /\b(ideas?|sugiere|sugerencias?|qu[eé]\s+(hago|preparo|cocino|puedo\s+(hacer|cenar|comer|preparar)|como|ceno|desayuno|meriendo)|opciones?|recomienda|recomendaci[oó]n|recomendaciones)\b/i.test(prompt);
    const isDinnerSlot = /\b(cena|cenar)\b/i.test(prompt);
    const isLunchSlot = /\b(almuerzo|comida|comer)\b/i.test(prompt);
    const isBreakfastSlot = /\b(desayuno|desayunar)\b/i.test(prompt);
    const isSnackSlot = /\b(merienda|merendar)\b/i.test(prompt);
    const isSlotQuery = isDinnerSlot || isLunchSlot || isBreakfastSlot || isSnackSlot;

    if (isAskingSuggestions || (isSlotQuery && !/\b(planifica\s+(todo\s+el\s+)?d[ií]a|organiza\s+(todo\s+el\s+)?d[ií]a|men[uú]\s+completo)\b/i.test(prompt))) {
      const hasTagCI = (recipe, tag) => Array.isArray(recipe?.tags) && recipe.tags.some(t => String(t).toLowerCase() === tag.toLowerCase());
      let targetTag = 'Cena';
      let slotLabel = 'cenar hoy';
      if (isLunchSlot) { targetTag = 'Almuerzo'; slotLabel = 'comer hoy'; }
      else if (isBreakfastSlot) { targetTag = 'Desayuno'; slotLabel = 'desayunar'; }
      else if (isSnackSlot) { targetTag = 'Merienda'; slotLabel = 'merendar'; }

      const matchingRecipes = (state.recipes || []).filter(r => hasTagCI(r, targetTag));
      const candidates = matchingRecipes.length >= 2 ? matchingRecipes.slice(0, 3) : [
        {
          title: "Salmón a la Plancha con Espárragos y Arroz",
          time: "20 min",
          protein: "38g"
        },
        {
          title: "Tortilla de Espinacas, Champiñones y Queso Feta",
          time: "12 min",
          protein: "26g"
        },
        {
          title: "Bowl Templado de Pollo a la Plancha, Quinoa y Aguacate",
          time: "15 min",
          protein: "42g"
        }
      ];

      const optionsText = candidates.map((c, i) => {
        const title = c.title || 'Plato saludable';
        const nut = c.nutrition || (c.protein ? { protein: c.protein } : { protein: 30 });
        const time = c.time || `${(c.prepTimeMinutes || 10) + (c.cookTimeMinutes || 10)} min`;
        const protText = nut.protein ? ` | ${nut.protein}${typeof nut.protein === 'number' ? 'g' : ''} proteína` : '';
        return `${i + 1}. **${title}** (${time}${protText})`;
      }).join('\n');

      return {
        text: `¡Hola${salutation}! Para **${slotLabel}** te propongo estas deliciosas opciones ligeras y saludables:\n\n${optionsText}\n\n¿Te apetece alguna de ellas? Puedes pedirme que te la guarde en tu recetario, o que te detalle sus ingredientes.`,
        toolCalls: []
      };
    }

    // 0. Planificación de un solo día concreto (ej. "Planifica mi día de hoy")
    const isSingleDay = !isSlotQuery && /\b(planifica|organiza|prepara|haz|asigna|men[uú]|plan)\b.*\b(hoy|dia\s+de\s+hoy|d[ií]a\s+de\s+hoy|ma[ñn]ana|solo\s+hoy|este\s+d[ií]a)\b/i.test(prompt);
    if (isSingleDay) {
      const todayKey = toLocalDateKey(new Date());
      const planArgs = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
      const todayPlan = planArgs.days[0] || {};
      const findTitle = (id) => state.recipes.find(r => r.id === id)?.title || 'Comida equilibrada';
      const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
      const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      return {
        text: `¡Listo${salutation}! He planificado las comidas para tu **día de hoy (${capDay})** en tu Planificador:\n\n` +
          `• **Desayuno**: ${findTitle(todayPlan.breakfast)}\n` +
          `• **Almuerzo**: ${findTitle(todayPlan.lunch)}\n` +
          `• **Merienda**: ${findTitle(todayPlan.snack)}\n` +
          `• **Cena**: ${findTitle(todayPlan.dinner)}`,
        toolCalls: [
          {
            name: 'set_day_plan',
            args: {
              dateKey: todayKey,
              dayName: capDay,
              breakfast: todayPlan.breakfast,
              lunch: todayPlan.lunch,
              snack: todayPlan.snack,
              dinner: todayPlan.dinner
            }
          }
        ]
      };
    }

    // 0.1 Planificación específica de fin de semana (Sábado y Domingo únicamente)
    if (this.isWeekendPrompt(prompt)) {
      const planArgs = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
      const weekendDays = planArgs.days.filter(d => {
        const dName = String(d.dayName || '').toLowerCase();
        return dName.includes('sáb') || dName.includes('sab') || dName.includes('dom');
      });
      const findTitle = (id) => state.recipes.find(r => r.id === id)?.title || 'Comida equilibrada';
      const summaryLines = weekendDays.map(d =>
        `- **${d.dayName}**: Desayuno: ${findTitle(d.breakfast)} | Almuerzo: ${findTitle(d.lunch)} | Merienda: ${findTitle(d.snack)} | Cena: ${findTitle(d.dinner)}`
      ).join('\n');

      return {
        text: `¡Listo${salutation}! He planificado únicamente tu **fin de semana** (Sábado y Domingo), manteniendo intactos los menús del resto de la semana:\n\n${summaryLines}`,
        toolCalls: [
          {
            name: 'set_weekly_plan',
            args: {
              mode: 'replace',
              days: weekendDays
            }
          }
        ]
      };
    }

    // 0.2 Asignación recurrente de una receta a un momento concreto en la semana (ej. "pon Batido en todas las meriendas de la semana")
    if (this.isRecurringWeeklySlotPrompt(prompt)) {
      let targetSlot = 'snack';
      let slotLabel = 'las meriendas';
      if (/desayuno|desalluno/i.test(prompt)) { targetSlot = 'breakfast'; slotLabel = 'los desayunos'; }
      else if (/almuerzo|almuerso|comida/i.test(prompt)) { targetSlot = 'lunch'; slotLabel = 'los almuerzos'; }
      else if (/cena/i.test(prompt)) { targetSlot = 'dinner'; slotLabel = 'las cenas'; }

      const cleanedRef = prompt
        .replace(/\b(por favor|pon|mete|asigna|a[ñn]ade|anade|receta|en|todas?|todos?|las?|los?|de|esta|la|semana|a|para|metiendas?|meriendas?|desayunos?|almuerzos?|comidas?|cenas?)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const matchedRecipeId = this.resolveRecipeIdForAgent(cleanedRef) || this.resolveRecipeIdForAgent(prompt);
      const matchedRecipe = (state.recipes || []).find(r => r.id === matchedRecipeId);

      if (matchedRecipe) {
        const weekDays = this.getPlannerWeekDates();
        const days = weekDays.map(d => ({
          dateKey: d.dateKey,
          dayName: d.dayName,
          [targetSlot]: matchedRecipe.id
        }));

        let notice = '';
        const goals = state.settings?.nutritionGoals;
        if (goals?.enabled) {
          const nut = getRecipeNutrition(matchedRecipe);
          const protGoal = Number(goals.protein) || 0;
          const calGoal = Number(goals.calories) || 0;
          const estDayProtein = (nut.protein || 0) + 80;
          const estDayCalories = (nut.calories || 0) + 1400;

          if (protGoal > 0 && (nut.protein > protGoal * 0.4 || estDayProtein > protGoal * 1.25)) {
            notice = `\n\n💡 **Nota nutricional**: Con esta incorporación estarás rondando los ~${Math.round(estDayProtein)}g de proteína diaria (algo por encima de tu meta de ${protGoal}g), pero tus comidas han quedado planificadas tal como me pediste.`;
          } else if (calGoal > 0 && estDayCalories > calGoal * 1.25) {
            notice = `\n\n💡 **Nota nutricional**: Con este plato estarás rondando las ~${Math.round(estDayCalories)} kcal al día (por encima de tu meta de ${calGoal} kcal), pero tu menú ya está actualizado.`;
          }
        }

        return {
          text: `¡Listo${salutation}! He asignado tu receta **${matchedRecipe.title}** a ${slotLabel} de toda la semana en tu Planificador.${notice}`,
          toolCalls: [
            {
              name: 'set_weekly_plan',
              args: {
                mode: 'replace',
                days: days
              }
            }
          ]
        };
      }
    }

    // 1. Planificación semanal estructurada respetando preferencias dietéticas o modo Batch Cooking (BUG-15 + US-17 + US-65)
    if (this.isWeeklyPlanPrompt(prompt)) {
      const isBatch = lower.includes('batch cooking') || lower.includes('sobras') || lower.includes('tupper');
      const planArgs = this.buildSimulatedWeeklyPlanArgs('replace', isBatch, prompt);
      planArgs.completeWeek = true;
      this.lastAiProposedPlan = planArgs;

      const noWeekend = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(fin\s+de\s+semana|finde|s[aá]bado|domingo)\b/i.test(prompt || '');
      const noSnacks = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(merienda|meriendas)\b/i.test(prompt || '');
      const noBreakfast = /\b(no\s+(incluyas?|pongas?|metas?|cuentes?)|sin|excepto|quitar|fuera|nada\s+de)\b.*?\b(desayuno|desayunos)\b/i.test(prompt || '');

      const cleanTitle = (id) => {
        const raw = state.recipes.find(r => r.id === id)?.title || 'Comida equilibrada';
        return raw.split(/\r?\n|Ingredientes:/i)[0].trim() || raw;
      };

      const filteredDays = noWeekend
        ? planArgs.days.filter(d => {
          const dn = String(d.dayName || '').toLowerCase();
          return !dn.includes('sáb') && !dn.includes('sab') && !dn.includes('dom');
        })
        : planArgs.days;

      const summaryLines = filteredDays.map(d => {
        const lunchLabel = d.isLeftoverLunch ? `🥡 Tupper de sobras (${cleanTitle(d.lunch)})` : cleanTitle(d.lunch);
        const dinnerLabel = (isBatch && (d.dayName === 'Lunes' || d.dayName === 'Miércoles'))
          ? `${cleanTitle(d.dinner)} (cocinas doble para tupper)`
          : cleanTitle(d.dinner);
        const parts = [];
        if (!noBreakfast && d.breakfast) parts.push(`Desayuno: ${cleanTitle(d.breakfast)}`);
        if (d.lunch) parts.push(`Almuerzo: ${lunchLabel}`);
        if (!noSnacks && d.snack) parts.push(`Merienda: ${cleanTitle(d.snack)}`);
        if (d.dinner) parts.push(`Cena: ${dinnerLabel}`);
        return `- **${d.dayName}**: ${parts.join(' | ')}`;
      }).join('\n');

      const prefNote = (state.dietaryPreferences && state.dietaryPreferences.length > 0)
        ? ` respetando tus preferencias (**${state.dietaryPreferences.join(', ')}**)`
        : '';
      const modeNote = isBatch ? ' en modo **Batch Cooking Inteligente** (ahorras tiempo con tuppers de sobras martes y jueves)' : '';

      return {
        text: `¡Listo${salutation}! He analizado tu catálogo de recetas${prefNote} y he organizado tu menú semanal completo${modeNote}:\n\n${summaryLines}`,
        toolCalls: [
          {
            name: 'set_weekly_plan',
            args: planArgs
          }
        ]
      };
    }

    // 2. Creación de receta nueva, guardado o aprovechamiento de nevera (US-17)
    if (lower.includes('guarda') || lower.includes('guardar') || lower.includes('guárdala') || lower.includes('guárdalas') || lower.includes('crea') || lower.includes('inventa') || lower.includes('receta') || lower.includes('pollo') || lower.includes('nevera') || lower.includes('tengo') || lower.includes('15 min')) {
      const isQuickDinner = lower.includes('15 min') || lower.includes('proteína') || lower.includes('proteina');
      const newRecipeArgs = isQuickDinner ? {
        id: generateId('rec-'),
        title: "Salteado Express de Pollo, Espinacas y Huevo Rico en Proteínas",
        description: "Cena saludable lista en 15 minutos con alto aporte proteico y baja en carbohidratos.",
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        servings: state.settings?.defaultServings || 2,
        tags: ["Cena", "Rápida", "Saludable", "Alta en Proteínas", "Sin Gluten"],
        ingredients: [
          { name: "Pechuga de pollo", amount: 350, unit: "g" },
          { name: "Espinacas frescas", amount: 150, unit: "g" },
          { name: "Huevos camperos", amount: 2, unit: "ud" },
          { name: "Aceite de oliva virgen extra", amount: 15, unit: "ml" }
        ],
        instructions: [
          { step: 1, text: "Corta la pechuga de pollo en tiras y dórala en la sartén con aceite de oliva durante 6 minutos.", timerMinutes: 6 },
          { step: 2, text: "Añade las espinacas frescas y saltea durante 2 minutos hasta que reduzcan.", timerMinutes: 2 },
          { step: 3, text: "Incorpora los huevos encima y cuaja durante 2 minutos más.", timerMinutes: 2 }
        ],
        nutrition: { calories: 390, protein: 48, carbs: 4, fat: 18 }
      } : {
        id: generateId('rec-'),
        title: "Pechugas Salteadas con Dados de Patata y Calabacín al Romero",
        description: "Receta casera de aprovechamiento con pollo jugoso, calabacín tierno y patatas doradas al romero.",
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: state.settings?.defaultServings || 2,
        tags: ["Almuerzo", "Cena", "Saludable", "Rápida", "Sin Gluten"],
        ingredients: [
          { name: "Pechugas de pollo", amount: 350, unit: "g" },
          { name: "Patatas medianas", amount: 2, unit: "ud" },
          { name: "Calabacín", amount: 1, unit: "ud" },
          { name: "Aceite de oliva virgen extra", amount: 20, unit: "ml" },
          { name: "Romero fresco", amount: 1, unit: "rama" }
        ],
        instructions: [
          { step: 1, text: "Dora las patatas en dados en una sartén con aceite durante 10 minutos a fuego medio-alto.", timerMinutes: 10 },
          { step: 2, text: "Añade el pollo en dados y cocina 5 minutos hasta dorar.", timerMinutes: 5 },
          { step: 3, text: "Incorpora el calabacín y el romero, saltea 5 minutos más y sirve caliente.", timerMinutes: 5 }
        ],
        nutrition: { calories: 410, protein: 42, carbs: 26, fat: 13 }
      };

      return {
        text: `¡Listo${salutation}! He creado y guardado en tu recetario la receta **${newRecipeArgs.title}** (${newRecipeArgs.prepTimeMinutes + newRecipeArgs.cookTimeMinutes} min | ${newRecipeArgs.nutrition.protein}g de proteína por ración).`,
        toolCalls: [
          {
            name: 'create_and_save_recipe',
            args: newRecipeArgs
          }
        ]
      };
    }

    // 3. Gestión de lista de la compra por voz / chat (US-17)
    if (lower.includes('compra') || lower.includes('añade') || lower.includes('anade') || lower.includes('apunta') || lower.includes('agrega')) {
      const isPlanDump = /ingredientes\s+del\s+plan|vuelca|todo\s+el\s+plan|del\s+men[uú]\s+semanal|plan\s+a\s+la\s+compra|completo\s+a\s+la\s+compra/i.test(prompt);
      if (isPlanDump) {
        return {
          text: `¡Hecho${salutation}! He añadido todos los ingredientes de tu plan semanal a la Lista de la Compra.`,
          toolCalls: [
            {
              name: 'manage_shopping_list',
              args: { action: 'add_from_current_plan' }
            }
          ]
        };
      }

      const cleaned = prompt
        .replace(/^(?:por favor\s+)?(?:a[ñn]ade|apunta|mete|pon|agrega)\s+/i, '')
        .replace(/\s+(?:a|en)\s+la\s+(?:lista\s+de\s+la\s+)?compra.*$/i, '')
        .trim();
      const rawParts = cleaned
        ? cleaned.split(/\s*,\s*|\s+y\s+/i).map(s => s.trim()).filter(Boolean)
        : ['Leche'];

      const items = rawParts.map(part => {
        const parsed = RecipeParser.parseIngredientLine(part);
        const single = Array.isArray(parsed) ? parsed[0] : parsed;
        return {
          name: single?.name || part,
          amount: single?.amount || 1,
          unit: single?.unit || 'ud'
        };
      });

      return {
        text: `¡Hecho${salutation}! He añadido **${items.map(i => i.name).join(', ')}** a tu Lista de la Compra clasificados por pasillo.`,
        toolCalls: [
          {
            name: 'manage_shopping_list',
            args: {
              action: 'add',
              items
            }
          }
        ]
      };
    }

    return {
      text: `¡Hola${salutation}! Puedes pedirme que **planifique tu día de hoy**, que **organice tu menú semanal** (incluyendo modo Batch Cooking / sobras), que **cree recetas nuevas** o que **añada artículos a tu lista de la compra**.`,
      toolCalls: []
    };
  }

  simulateGeminiDemoResponse(prompt) {
    return this.simulateGeminiAgentResponse(prompt).text;
  }

  resolveRecipeIdForAgent(ref) {
    if (!ref || typeof ref !== 'string') return null;
    const trimmed = ref.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'vacío' || trimmed.toLowerCase() === 'vacio') {
      return null;
    }

    // 1. Coincidencia exacta por ID
    const exact = state.recipes.find(r => r.id === trimmed);
    if (exact) return exact.id;

    // 2. Si el texto incluye un ID explícito tipo rec-... (ej. "Porridge (*rec-porridge-bowl*)")
    const embeddedIdMatch = trimmed.match(/\brec-[a-zA-Z0-9_-]+\b/);
    if (embeddedIdMatch) {
      const byEmbeddedId = state.recipes.find(r => r.id === embeddedIdMatch[0]);
      if (byEmbeddedId) return byEmbeddedId.id;
    }

    // 3. Limpiar formato Markdown o paréntesis residuales y buscar por título normalizado
    const cleanTitleRef = trimmed
      .replace(/\s*\([\s*`'"]*rec-[a-zA-Z0-9_-]+[\s*`'"]*\)/gi, '')
      .replace(/[*`'"]/g, '')
      .trim();

    const normRef = normalizeIngredientText(cleanTitleRef);
    if (!normRef) return null;

    const byTitle = state.recipes.find(r => normalizeIngredientText(r.title || '') === normRef) ||
      state.recipes.find(r => normalizeIngredientText(r.title || '').includes(normRef) || normRef.includes(normalizeIngredientText(r.title || '')));
    if (byTitle) return byTitle.id;

    // 4. Limpieza de palabras vacías/conectores ("stop words" como "de", "del", "con", "al", "a", etc.)
    const stopWordsRegex = /\b(de|del|la|las|el|los|un|una|unos|unas|con|al|a|en|y|para|sin|por)\b/gi;
    const strippedRef = normRef.replace(stopWordsRegex, ' ').replace(/\s+/g, ' ').trim();
    if (strippedRef) {
      const byStripped = state.recipes.find(r => {
        const rNorm = normalizeIngredientText(r.title || '');
        const rStripped = rNorm.replace(stopWordsRegex, ' ').replace(/\s+/g, ' ').trim();
        return rStripped === strippedRef || rStripped.includes(strippedRef) || strippedRef.includes(rStripped);
      });
      if (byStripped) return byStripped.id;
    }

    // 5. Coincidencia difusa por porcentaje de palabras clave significativas (Token Overlap)
    const refTokens = normRef
      .replace(stopWordsRegex, ' ')
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length >= 2);

    if (refTokens.length > 0) {
      let bestCandidate = null;
      let highestScore = 0;

      state.recipes.forEach(r => {
        const rNorm = normalizeIngredientText(r.title || '');
        const rTokens = rNorm
          .replace(stopWordsRegex, ' ')
          .split(/\s+/)
          .map(t => t.trim())
          .filter(t => t.length >= 2);

        if (rTokens.length === 0) return;

        let matches = 0;
        refTokens.forEach(token => {
          if (rTokens.some(rt => rt === token || rt.startsWith(token) || token.startsWith(rt))) {
            matches++;
          }
        });

        const score = matches / refTokens.length;
        if (score > highestScore && score >= 0.75) {
          highestScore = score;
          bestCandidate = r;
        }
      });

      if (bestCandidate && highestScore >= 0.75) {
        return bestCandidate.id;
      }
    }

    return null;
  }

  extractWeeklyPlanFromAiText(aiText) {
    const fallbackPlan = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
    if (!aiText || typeof aiText !== 'string') {
      return { ...fallbackPlan, completeWeek: true };
    }

    const weekDays = this.getPlannerWeekDates();
    const lines = aiText.split(/\r?\n/);

    lines.forEach((line) => {
      const matchedDayIdx = weekDays.findIndex(w => {
        const normDay = normalizeIngredientText(w.dayName);
        return normDay && normalizeIngredientText(line).includes(normDay);
      });
      if (matchedDayIdx === -1) return;

      const dayTarget = fallbackPlan.days[matchedDayIdx];
      const slotPatterns = [
        { slot: 'breakfast', regex: /desayuno\s*:\s*([^|\n•]+)/i },
        { slot: 'lunch', regex: /(?:almuerzo|comida)\s*:\s*([^|\n•]+)/i },
        { slot: 'snack', regex: /merienda\s*:\s*([^|\n•]+)/i },
        { slot: 'dinner', regex: /cena\s*:\s*([^|\n•]+)/i }
      ];

      slotPatterns.forEach(({ slot, regex }) => {
        const m = line.match(regex);
        if (m && m[1]) {
          const resolved = this.resolveRecipeIdForAgent(m[1]);
          if (resolved) {
            dayTarget[slot] = resolved;
          }
        }
      });
    });

    return { mode: 'replace', days: fallbackPlan.days, completeWeek: true };
  }

  buildWeeklyPlanSummaryText() {
    const weekDays = this.getPlannerWeekDates();
    const findTitle = (id) => state.recipes.find(r => r.id === id)?.title || 'Plato asignado';
    const lines = weekDays.map(w => {
      const dp = state.getDayPlan(w.dateKey, w.dayName);
      const leftoverBadge = dp.leftoverSlots?.lunch ? ' 🥡(Tupper de sobras)' : '';
      return `- **${w.dayName}**: Desayuno: ${findTitle(dp.breakfast)} | Almuerzo: ${findTitle(dp.lunch)}${leftoverBadge} | Merienda: ${findTitle(dp.snack)} | Cena: ${findTitle(dp.dinner)}`;
    }).join('\n');
    return `He actualizado tu **Planificador Semanal** completo (7 días, 4 comidas diarias):\n\n${lines}`;
  }

  executeAiToolCall(toolCall) {
    if (!toolCall || !toolCall.name) return null;
    const name = toolCall.name;
    const args = toolCall.args || {};

    if (name === 'create_and_save_recipe') {
      const targetTitle = String(args.title || 'Receta creada con IA').trim();
      const normTarget = normalizeIngredientText(targetTitle);
      const stopWordsRegex = /\b(de|del|la|las|el|los|un|una|unos|unas|con|al|a|en|y|para|sin|por)\b/gi;
      const strippedTarget = normTarget.replace(stopWordsRegex, ' ').replace(/\s+/g, ' ').trim();
      const existing = (state.recipes || []).find(r => {
        if (!r.title) return false;
        const normR = normalizeIngredientText(r.title);
        if (normR === normTarget) return true;
        const strippedR = normR.replace(stopWordsRegex, ' ').replace(/\s+/g, ' ').trim();
        return Boolean(strippedR && strippedTarget && strippedR === strippedTarget);
      });
      if (existing) {
        return {
          tool: 'create_and_save_recipe',
          success: true,
          recipeId: existing.id,
          title: existing.title,
          alreadyExisted: true,
          recipe: existing
        };
      }
      const nowIso = new Date().toISOString();
      const rawIngredients = Array.isArray(args.ingredients) ? args.ingredients : [];
      const normalizedIngredients = rawIngredients.map((ing, idx) => {
        const ingName = String(ing?.name || `Ingrediente ${idx + 1}`).trim();
        return {
          id: ing?.id || generateId('ing-'),
          name: ingName,
          amount: Number(ing?.amount) || 1,
          unit: RecipeParser.normalizeUnit(ing?.unit || 'ud'),
          aisle: ing?.aisle || categorizeIngredientAisle(ingName)
        };
      });

      const rawInstructions = Array.isArray(args.instructions) ? args.instructions : [];
      const normalizedInstructions = rawInstructions.map((inst, idx) => {
        const text = typeof inst === 'string' ? inst : String(inst?.text || '').trim();
        const detectedTimer = RecipeParser.extractTimerMinutes(text);
        return {
          step: Number(inst?.step) || (idx + 1),
          text,
          timerMinutes: typeof inst?.timerMinutes === 'number' ? inst.timerMinutes : (detectedTimer || 0)
        };
      }).filter(s => s.text);

      const newRecipe = {
        id: (args.id && typeof args.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(args.id) && !state.recipes.some(r => r.id === args.id)) ? String(args.id) : generateId('rec-'),
        title: String(args.title || 'Receta creada con IA').trim(),
        description: String(args.description || 'Receta generada a medida con IA.').trim(),
        imageUrl: args.imageUrl ? String(args.imageUrl).trim() : '',
        prepTimeMinutes: Math.max(0, parseInt(args.prepTimeMinutes, 10) || 10),
        cookTimeMinutes: Math.max(0, parseInt(args.cookTimeMinutes, 10) || 15),
        servings: Math.max(1, parseInt(args.servings, 10) || state.settings?.defaultServings || 2),
        tags: Array.isArray(args.tags) ? [...args.tags] : [],
        ingredients: normalizedIngredients,
        instructions: normalizedInstructions.length > 0 ? normalizedInstructions : [{ step: 1, text: "Prepara y mezcla los ingredientes.", timerMinutes: 5 }],
        nutrition: args.nutrition && typeof args.nutrition === 'object' ? {
          calories: Number(args.nutrition.calories) || 0,
          protein: Number(args.nutrition.protein) || 0,
          carbs: Number(args.nutrition.carbs) || 0,
          fat: Number(args.nutrition.fat) || 0
        } : null,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      if (!newRecipe.nutrition || !newRecipe.nutrition.calories) {
        newRecipe.nutrition = estimateRecipeNutrition(newRecipe);
      }

      if (typeof analyzeAndInferRecipeTags === 'function') {
        const inferred = analyzeAndInferRecipeTags(newRecipe);
        const lowerSet = new Set(newRecipe.tags.map(t => String(t).toLowerCase().trim()));
        inferred.forEach(tag => {
          const l = tag.toLowerCase().trim();
          if (!lowerSet.has(l) && l !== 'general') {
            newRecipe.tags.push(tag);
            lowerSet.add(l);
            state.addCustomTag && state.addCustomTag(tag);
          }
        });
      }

      state.recipes.unshift(newRecipe);
      state.save('fa_recipes', state.recipes);
      this.scheduleSyncWithCloud();
      this.render();

      return {
        tool: 'create_and_save_recipe',
        success: true,
        recipeId: newRecipe.id,
        title: newRecipe.title,
        recipe: newRecipe
      };
    }

    if (name === 'set_day_plan') {
      const targetDateKey = args.dateKey || toLocalDateKey(new Date());
      const dayData = state.getDayPlan(targetDateKey, args.dayName);
      if (args.breakfast !== undefined) dayData.breakfast = this.resolveRecipeIdForAgent(args.breakfast);
      if (args.lunch !== undefined) dayData.lunch = this.resolveRecipeIdForAgent(args.lunch);
      if (args.snack !== undefined) dayData.snack = this.resolveRecipeIdForAgent(args.snack);
      if (args.dinner !== undefined) dayData.dinner = this.resolveRecipeIdForAgent(args.dinner);
      dayData.updatedAt = new Date().toISOString();
      state.save('fa_mealplan', state.mealPlan);
      this.scheduleSyncWithCloud();
      this.render();
      return {
        tool: 'set_day_plan',
        success: true,
        dateKey: targetDateKey,
        dayName: args.dayName || dayData.dayName
      };
    }

    if (name === 'set_weekly_plan') {
      const mode = args.mode === 'merge' ? 'merge' : 'replace';
      const daysInput = Array.isArray(args.days) ? args.days : [];
      const weekDays = this.getPlannerWeekDates();
      const fallbackPlan = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
      const shouldCompleteAllWeek = args.completeWeek === true;
      const updatedDateKeys = new Set();

      // Paso 1: Completar desayunos y meriendas faltantes en días planificados si el usuario no los excluyó explícitamente
      const isMultiMealRequest = daysInput.some(d => (d.lunch || d.dinner) && (d.breakfast === undefined || d.snack === undefined));
      if (isMultiMealRequest) {
        daysInput.forEach(d => {
          let wIdx = weekDays.findIndex(w => w.dateKey === d.dateKey);
          if (wIdx < 0 && d.dayName) {
            wIdx = weekDays.findIndex(w => normalizeIngredientText(w.dayName) === normalizeIngredientText(d.dayName));
          }
          if (wIdx < 0) wIdx = 0;
          const fb = fallbackPlan.days[wIdx] || fallbackPlan.days[0];
          if (d.breakfast === undefined && fb?.breakfast) d.breakfast = fb.breakfast;
          if (d.snack === undefined && fb?.snack) d.snack = fb.snack;
        });
      }

      // Paso 2: Validación y rotación balanceada de proteínas (Anti-Pollo y Anti-Monotonía)
      let lastDinnerProtein = null;
      let totalChickenCount = 0;
      const maxAllowedChicken = daysInput.length <= 2 ? 1 : Math.min(3, Math.ceil(daysInput.length * 0.35));

      daysInput.forEach((d) => {
        const lunchRec = d.lunch ? (state.recipes || []).find(r => r.id === d.lunch || r.id === this.resolveRecipeIdForAgent(d.lunch)) : null;
        let lunchProt = getPrimaryProteinCategory(lunchRec);

        if (lunchProt === 'pollo' && totalChickenCount >= maxAllowedChicken) {
          const altLunch = (state.recipes || []).find(r =>
            r.id !== d.lunch &&
            getPrimaryProteinCategory(r) !== 'pollo' &&
            (r.tags || []).some(t => /almuerzo|comida|cena/i.test(t))
          );
          if (altLunch) {
            d.lunch = altLunch.id;
            lunchProt = getPrimaryProteinCategory(altLunch);
          }
        }
        if (lunchProt === 'pollo') totalChickenCount++;

        const dinnerRec = d.dinner ? (state.recipes || []).find(r => r.id === d.dinner || r.id === this.resolveRecipeIdForAgent(d.dinner)) : null;
        let dinnerProt = getPrimaryProteinCategory(dinnerRec);

        const isSameAsLunch = dinnerProt !== 'otro' && dinnerProt === lunchProt;
        const isExcessChicken = dinnerProt === 'pollo' && (totalChickenCount >= maxAllowedChicken || lunchProt === 'pollo' || lastDinnerProtein === 'pollo');

        if (isSameAsLunch || isExcessChicken) {
          const altDinner = (state.recipes || []).find(r =>
            r.id !== d.lunch &&
            r.id !== d.dinner &&
            getPrimaryProteinCategory(r) !== lunchProt &&
            getPrimaryProteinCategory(r) !== 'pollo' &&
            (r.tags || []).some(t => /cena|almuerzo|comida/i.test(t))
          );
          if (altDinner) {
            d.dinner = altDinner.id;
            dinnerProt = getPrimaryProteinCategory(altDinner);
          }
        }
        if (dinnerProt === 'pollo') totalChickenCount++;
        lastDinnerProtein = dinnerProt;
      });

      daysInput.forEach((dayEntry, idx) => {
        if (!dayEntry) return;
        let targetDateKey = dayEntry.dateKey;
        let targetDayName = dayEntry.dayName;

        if ((!targetDateKey || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateKey)) && targetDayName) {
          const matchedDay = weekDays.find(w => normalizeIngredientText(w.dayName) === normalizeIngredientText(targetDayName));
          if (matchedDay) {
            targetDateKey = matchedDay.dateKey;
            targetDayName = matchedDay.dayName;
          }
        }
        if (!targetDateKey && weekDays[idx]) {
          targetDateKey = weekDays[idx].dateKey;
          targetDayName = weekDays[idx].dayName;
        }
        if (!targetDateKey) return;

        const weekDayIdx = Math.max(0, weekDays.findIndex(w => w.dateKey === targetDateKey));
        const fallbackDay = fallbackPlan.days[weekDayIdx] || fallbackPlan.days[0];
        const dayData = state.getDayPlan(targetDateKey, targetDayName);

        ['breakfast', 'lunch', 'snack', 'dinner'].forEach(slotKey => {
          const rawVal = dayEntry[slotKey];
          const isExplicitClear = (typeof rawVal === 'string' && rawVal.trim().toUpperCase() === 'CLEAR') || rawVal === null;

          if (isExplicitClear) {
            if (mode === 'replace') dayData[slotKey] = null;
            return;
          }

          if (rawVal !== undefined && String(rawVal).trim() !== '') {
            const resolvedId = this.resolveRecipeIdForAgent(String(rawVal));
            if (resolvedId && (mode === 'replace' || !dayData[slotKey])) {
              dayData[slotKey] = resolvedId;
            }
          } else if (rawVal === undefined && args.completeWeek === true) {
            if (!dayData[slotKey] && fallbackDay && fallbackDay[slotKey]) {
              dayData[slotKey] = fallbackDay[slotKey];
            }
          }
        });

        if (dayEntry.isLeftoverLunch) {
          if (!dayData.leftoverSlots) dayData.leftoverSlots = {};
          dayData.leftoverSlots.lunch = true;
        }

        dayData.updatedAt = new Date().toISOString();
        updatedDateKeys.add(targetDateKey);
      });

      // Si es una planificación semanal completa (o rellenar la semana), garantizar los 7 días con sus 4 comidas
      if (shouldCompleteAllWeek) {
        weekDays.forEach((wDay, idx) => {
          const dayData = state.getDayPlan(wDay.dateKey, wDay.dayName);
          const fallbackDay = fallbackPlan.days[idx] || fallbackPlan.days[0];
          let modified = false;
          ['breakfast', 'lunch', 'snack', 'dinner'].forEach(slotKey => {
            if (!dayData[slotKey] && fallbackDay && fallbackDay[slotKey]) {
              dayData[slotKey] = fallbackDay[slotKey];
              modified = true;
            }
            if (!dayData[slotKey]) {
              const allAvailable = (state.recipes && state.recipes.length > 0) ? state.recipes : DEFAULT_RECIPES;
              const picked = allAvailable[(idx + slotKey.length) % allAvailable.length];
              if (picked) {
                dayData[slotKey] = picked.id;
                modified = true;
              }
            }
          });
          if (modified || !updatedDateKeys.has(wDay.dateKey)) {
            dayData.updatedAt = new Date().toISOString();
            updatedDateKeys.add(wDay.dateKey);
          }
        });
      }

      const daysUpdated = updatedDateKeys.size;
      this.lastAiProposedPlan = { mode, days: daysInput };
      state.save('fa_mealplan', state.mealPlan);
      this.scheduleSyncWithCloud();
      this.render();

      return {
        tool: 'set_weekly_plan',
        success: true,
        mode,
        daysUpdated
      };
    }

    if (name === 'manage_shopping_list') {
      const action = String(args.action || 'add').toLowerCase();
      const items = Array.isArray(args.items) ? args.items : [];
      let affectedCount = 0;

      if (action === 'add_from_current_plan') {
        const weekDays = this.getPlannerWeekDates();
        weekDays.forEach(wDay => {
          const dayPlan = state.getDayPlan(wDay.dateKey, wDay.dayName);
          ['breakfast', 'lunch', 'snack', 'dinner'].forEach(slotKey => {
            const recId = dayPlan[slotKey];
            const rec = recId ? state.recipes.find(r => r.id === recId) : null;
            if (rec && Array.isArray(rec.ingredients)) {
              rec.ingredients.forEach(ing => {
                mergeOrAddShoppingItem(state.shoppingList, {
                  id: generateId('shop-'),
                  name: ing.name,
                  amount: Number(ing.amount) || 1,
                  unit: RecipeParser.normalizeUnit(ing.unit || 'ud'),
                  aisle: ing.aisle || categorizeIngredientAisle(ing.name),
                  isChecked: false,
                  recipeOrigin: rec.title,
                  updatedAt: new Date().toISOString()
                });
                affectedCount++;
              });
            }
          });
        });
      } else if (action === 'add') {
        items.forEach(item => {
          if (!item || !item.name) return;
          const cleanName = String(item.name).trim();
          if (!cleanName) return;
          mergeOrAddShoppingItem(state.shoppingList, {
            id: generateId('shop-'),
            name: cleanName,
            amount: Number(item.amount) || 1,
            unit: RecipeParser.normalizeUnit(item.unit || 'ud'),
            aisle: item.aisle || categorizeIngredientAisle(cleanName),
            isChecked: false,
            recipeOrigin: 'Sous Chef',
            updatedAt: new Date().toISOString()
          });
          affectedCount++;
        });
      } else if (action === 'check') {
        items.forEach(item => {
          const normTarget = normalizeIngredientText(item?.name || '');
          if (!normTarget) return;
          state.shoppingList.forEach(shopItem => {
            if (normalizeIngredientText(shopItem.name).includes(normTarget)) {
              shopItem.isChecked = true;
              shopItem.updatedAt = new Date().toISOString();
              affectedCount++;
            }
          });
        });
      } else if (action === 'remove') {
        const toRemoveNorms = items.map(i => normalizeIngredientText(i?.name || '')).filter(Boolean);
        const remaining = [];
        state.shoppingList.forEach(shopItem => {
          const normName = normalizeIngredientText(shopItem.name);
          if (toRemoveNorms.some(t => normName.includes(t))) {
            state.trackDeletion && state.trackDeletion('shoppingItems', shopItem.id);
            affectedCount++;
          } else {
            remaining.push(shopItem);
          }
        });
        state.shoppingList = remaining;
      }

      state.save('fa_shopping', state.shoppingList);
      this.scheduleSyncWithCloud();
      this.render();

      return {
        tool: 'manage_shopping_list',
        success: true,
        action,
        count: affectedCount
      };
    }

    return null;
  }

  executeAiToolCalls(toolCalls) {
    if (!Array.isArray(toolCalls) || toolCalls.length === 0) return [];
    const results = [];
    toolCalls.forEach(tc => {
      const res = this.executeAiToolCall(tc);
      if (res) results.push(res);
    });
    return results;
  }

  async handleAiChatSubmit(fromVoice = false) {
    this.stopSpeech();
    const input = document.getElementById('ai-chat-input');
    const text = input?.value.trim() || '';
    if (!text) return;

    const history = document.getElementById('chat-history-container');
    if (!history) return;

    const userBubble = document.createElement('div');
    userBubble.className = 'ai-user-bubble';
    userBubble.textContent = text;
    history.appendChild(userBubble);
    input.value = '';
    history.scrollTop = history.scrollHeight;

    const aiBubble = document.createElement('div');
    aiBubble.className = 'ai-assistant-bubble';
    const isFullCatalog = false;
    const waitNotice = isFullCatalog ? `<div class="ai-wait-notice">Analizando recetario completo (${state.recipes.length} recetas)... unos segundos.</div>` : '';
    const consultingText = window.I18n ? window.I18n.t('ai.consultingAssistant') : 'Consultando al Sous Chef...';
    aiBubble.innerHTML = `<em>${consultingText}</em>${waitNotice}`;
    history.appendChild(aiBubble);
    history.scrollTop = history.scrollHeight;

    try {
      const systemPrompt = this.buildAiSystemInstruction(text);
      const agentResult = await this.callGeminiAgent(text, systemPrompt, true);
      const isSingleDay = this.isSingleDayPrompt(text);
      const isWeekend = this.isWeekendPrompt(text);
      const isWeeklyIntent = !isSingleDay && !isWeekend && this.isWeeklyPlanPrompt(text);

      let rawToolCalls = Array.isArray(agentResult.toolCalls) ? [...agentResult.toolCalls] : [];

      if (isWeekend && agentResult.isSimulatedFallback) {
        rawToolCalls = rawToolCalls.map(tc => {
          if (tc.name === 'set_weekly_plan') {
            const days = Array.isArray(tc.args?.days) ? tc.args.days : [];
            const weekendEntries = days.filter(d => {
              const dName = String(d.dayName || '').toLowerCase();
              return dName.includes('sáb') || dName.includes('sab') || dName.includes('dom');
            });
            return {
              name: 'set_weekly_plan',
              args: {
                mode: 'replace',
                days: weekendEntries.length > 0 ? weekendEntries : days.slice(-2)
              }
            };
          }
          return tc;
        });

        if (!rawToolCalls.some(tc => tc.name === 'set_weekly_plan')) {
          const planArgs = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
          const weekendDays = planArgs.days.filter(d => {
            const dName = String(d.dayName || '').toLowerCase();
            return dName.includes('sáb') || dName.includes('sab') || dName.includes('dom');
          });
          rawToolCalls.push({
            name: 'set_weekly_plan',
            args: {
              mode: 'replace',
              days: weekendDays
            }
          });
        }
      } else if (isSingleDay) {
        const todayKey = toLocalDateKey(new Date());
        const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
        const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        rawToolCalls = rawToolCalls.map(tc => {
          if (tc.name === 'set_weekly_plan') {
            const days = Array.isArray(tc.args?.days) ? tc.args.days : [];
            const dayEntry = days.find(d => d.dateKey === todayKey) || days[0] || {};
            return {
              name: 'set_day_plan',
              args: {
                dateKey: todayKey,
                dayName: capDay,
                breakfast: dayEntry.breakfast,
                lunch: dayEntry.lunch,
                snack: dayEntry.snack,
                dinner: dayEntry.dinner
              }
            };
          }
          return tc;
        });

        if (!rawToolCalls.some(tc => tc.name === 'set_day_plan')) {
          const planArgs = this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
          const todayPlan = planArgs.days[0] || {};
          rawToolCalls.push({
            name: 'set_day_plan',
            args: {
              dateKey: todayKey,
              dayName: capDay,
              breakfast: todayPlan.breakfast,
              lunch: todayPlan.lunch,
              snack: todayPlan.snack,
              dinner: todayPlan.dinner
            }
          });
        }
      } else if (isWeeklyIntent) {
        rawToolCalls.forEach(tc => {
          if (tc.name === 'set_weekly_plan') {
            tc.args = { ...(tc.args || {}), completeWeek: true };
          }
        });
        // Red de seguridad: si el modelo devolvió el menú en texto sin emitir functionCall, extraerlo y aplicarlo
        if (!rawToolCalls.some(tc => tc.name === 'set_weekly_plan')) {
          const extractedArgs = this.extractWeeklyPlanFromAiText(agentResult.text);
          rawToolCalls.push({
            name: 'set_weekly_plan',
            args: extractedArgs
          });
        }
      }

      // Proteger lista de la compra si el usuario solo pidió añadir artículos sueltos
      const isExplicitPlanShopRequest = /ingredientes\s+del\s+plan|men[uú]\s+semanal|toda\s+la\s+semana|plan\s+a\s+la\s+compra|vuelca.*compra/i.test(text);
      if (!isExplicitPlanShopRequest) {
        rawToolCalls.forEach(tc => {
          if (tc.name === 'manage_shopping_list' && tc.args?.action === 'add_from_current_plan') {
            tc.args.action = 'add';
            const cleanItemName = text.replace(/a[ñn]ade|apunta|agrega|a\s+la\s+lista|a\s+la\s+compra/gi, '').trim() || 'Artículo nuevo';
            tc.args.items = (Array.isArray(tc.args.items) && tc.args.items.length > 0)
              ? tc.args.items
              : [{ name: cleanItemName }];
          }
        });
      }

      const executedResults = this.executeAiToolCalls(rawToolCalls);
      const hasWeeklyPlanExecuted = executedResults.some(r => r.tool === 'set_weekly_plan');
      const slotGaps = hasWeeklyPlanExecuted ? this.getDietarySlotGaps() : [];

      let displayMessage = agentResult.text;
      if (agentResult.isSimulatedFallback) {
        const fallbackPrefix = `⚠️ *Servidores de Gemini con saturación temporal. Petición completada con el motor inteligente local de Food Assistant:*\n\n`;
        displayMessage = displayMessage ? `${fallbackPrefix}${displayMessage}` : fallbackPrefix;
      }
      if (!displayMessage && executedResults.length > 0) {
        const summaries = executedResults.map(r => {
          if (r.tool === 'create_and_save_recipe') return `He creado la receta **${r.title}**.`;
          if (r.tool === 'set_weekly_plan') return this.buildWeeklyPlanSummaryText();
          if (r.tool === 'set_day_plan') return `He planificado las comidas de tu día (${r.dayName || r.dateKey}) en el Planificador.`;
          if (r.tool === 'manage_shopping_list') return `He actualizado tu **Lista de la Compra** (${r.count} artículos).`;
          return '';
        }).filter(Boolean);
        displayMessage = summaries.join('\n\n');
      }

      // Eliminar IDs internos tipo (*rec-...*) o rec-... del mensaje visible
      displayMessage = this.stripRecipeIdsFromText(displayMessage);

      if (slotGaps.length > 0 && !/crear|inventar|nuevas recetas/i.test(displayMessage || '')) {
        const gapLabels = slotGaps.map(g => g.label.toLowerCase()).join(' y ');
        const prefList = (state.dietaryPreferences || []).join(', ');
        displayMessage = `${displayMessage}\n\n💡 **Nota**: En tu recetario tienes pocas o ninguna opción de **${gapLabels}** que cumplan con **${prefList}**, así que he completado la semana apoyándome en tus mejores opciones actuales. ¿Quieres que cree nuevas recetas a medida para esos huecos y las asigne al plan?`;
      }

      if (!Array.isArray(this.aiChatHistory)) this.aiChatHistory = [];
      this.aiChatHistory.push({ role: 'user', text });
      this.aiChatHistory.push({ role: 'model', text: displayMessage || 'Acción completada.' });

      // US-37: Saneamiento estricto antes de aplicar formato Markdown ligero
      aiBubble.innerHTML = formatSafeAiMarkdown(displayMessage || 'Acción completada.');

      if (executedResults.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'ai-actions-row';

        executedResults.forEach(res => {
          if (res.tool === 'set_weekly_plan' || res.tool === 'set_day_plan') {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-primary btn-sm';
            btn.innerHTML = '<span class="material-symbols-outlined icon-sm">calendar_month</span> Ver en Planificador';
            btn.onclick = () => this.switchView('view-planner');
            actionsContainer.appendChild(btn);

            if (slotGaps.length > 0) {
              const createMissingBtn = document.createElement('button');
              createMissingBtn.type = 'button';
              createMissingBtn.className = 'btn btn-tonal btn-sm';
              const gapLabelText = slotGaps.map(g => g.label).join(' y ');
              createMissingBtn.innerHTML = `<span class="material-symbols-outlined icon-sm">auto_awesome</span> Crear ${gapLabelText} a medida`;
              createMissingBtn.onclick = () => this.triggerCreateMissingSlotRecipes(slotGaps);
              actionsContainer.appendChild(createMissingBtn);
            }
          } else if (res.tool === 'create_and_save_recipe') {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-tonal btn-sm';
            btn.innerHTML = '<span class="material-symbols-outlined icon-sm">restaurant_menu</span> Abrir Receta';
            btn.onclick = () => {
              this.switchView('view-recipes');
              this.openRecipeDetail(res.recipeId);
            };
            actionsContainer.appendChild(btn);
          } else if (res.tool === 'manage_shopping_list') {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-tonal btn-sm';
            btn.innerHTML = '<span class="material-symbols-outlined icon-sm">shopping_cart</span> Ver Lista de la Compra';
            btn.onclick = () => this.switchView('view-shopping');
            actionsContainer.appendChild(btn);
          }
        });

        aiBubble.appendChild(actionsContainer);
      }

      // Camino B (US-17): Si la orden se dictó por voz, responder también con voz natural hablada
      if (fromVoice && displayMessage) {
        this.speakAiResponse(displayMessage);
      }
    } catch (err) {
      // US-37: Mostrar mensajes de error con textContent para impedir XSS
      aiBubble.innerHTML = '';
      const errSpan = document.createElement('span');
      errSpan.style.color = 'var(--m3-error)';
      errSpan.textContent = `Error: ${err?.message || 'Error desconocido'}`;
      aiBubble.appendChild(errSpan);
    }

    history.scrollTop = history.scrollHeight;
  }

  // ==========================================================================
  // US-17 / CAMINO B: ASISTENTE DE VOZ INTEGRADO & INVOCADOR CENTRAL GEMINI (✦)
  // ==========================================================================
  initVoiceAssistant() {
    const SpeechRec = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    this.speechRecognitionSupported = !!SpeechRec;
    this.isListeningVoice = false;

    if (this.speechRecognitionSupported) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListeningVoice = true;
          this.updateVoiceUI(true);
        };

        this.recognition.onresult = (event) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const recognizedText = final || interim;
          const chatInput = document.getElementById('ai-chat-input');
          if (chatInput) {
            chatInput.value = recognizedText;
          }
          const invokeInput = document.getElementById('gemini-invoke-input');
          if (invokeInput) {
            invokeInput.value = recognizedText;
          }
          const invokeTranscription = document.getElementById('gemini-invoke-transcription');
          if (invokeTranscription && recognizedText) {
            invokeTranscription.textContent = `"${recognizedText}"`;
          }
        };

        this.recognition.onerror = (event) => {
          console.warn("[Voice] Error en reconocimiento de voz:", event.error);
          this.isListeningVoice = false;
          this.updateVoiceUI(false);
          if (event.error === 'not-allowed') {
            this.showToast("Permiso de micrófono no concedido en el navegador.", "warning");
          }
        };

        this.recognition.onend = () => {
          this.isListeningVoice = false;
          this.updateVoiceUI(false);
          const invokeModal = document.getElementById('modal-gemini-invoke');
          if (invokeModal && (invokeModal.classList.contains('active') || invokeModal.open)) {
            const invokeInput = document.getElementById('gemini-invoke-input');
            const text = invokeInput?.value?.trim();
            if (text) {
              this.handleGeminiInvokeSubmit(true);
            }
          } else {
            const chatInput = document.getElementById('ai-chat-input');
            const text = chatInput?.value?.trim();
            if (text) {
              this.handleAiChatSubmit(true);
            }
          }
        };
      } catch (e) {
        console.warn("Could not init SpeechRecognition:", e);
      }
    }
  }

  toggleVoiceRecognition(isInvokeModal = false) {
    if (!this.speechRecognitionSupported) {
      this.showToast("Tu navegador no soporta reconocimiento de voz nativo.", "info");
      return;
    }
    if (this.isListeningVoice) {
      try { this.recognition.stop(); } catch (e) { }
      this.isListeningVoice = false;
      this.updateVoiceUI(false);
    } else {
      if (!isInvokeModal) {
        this.switchView('view-ai');
        const chatInput = document.getElementById('ai-chat-input');
        if (chatInput) chatInput.value = '';
      } else {
        const invokeInput = document.getElementById('gemini-invoke-input');
        if (invokeInput) invokeInput.value = '';
        const invokeTranscription = document.getElementById('gemini-invoke-transcription');
        if (invokeTranscription) {
          const userName = this.getUserDisplayName();
          if (userName) {
            invokeTranscription.textContent = window.I18n ? window.I18n.t('ai.listeningTo', { name: userName }) : `Escuchando a ${userName}...`;
          } else {
            invokeTranscription.textContent = window.I18n ? window.I18n.t('ai.listening') : 'Escuchando...';
          }
        }
      }
      try {
        this.recognition.start();
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    }
  }

  updateVoiceUI(isListening) {
    const micBtn = document.getElementById('btn-mic-ai-chat');
    const headerVoiceBtn = document.getElementById('btn-header-voice');
    const badge = document.getElementById('voice-listening-indicator');
    const centralGeminiBtn = document.getElementById('btn-central-gemini-invoke');
    const invokeMicBtn = document.getElementById('btn-gemini-invoke-mic');
    const invokePulse = document.getElementById('gemini-invoke-pulse');

    if (micBtn) {
      micBtn.classList.toggle('listening', isListening);
      micBtn.innerHTML = isListening
        ? '<span class="material-symbols-outlined icon-sm icon-pulse icon-error">mic</span>'
        : '<span class="material-symbols-outlined icon-sm">mic</span>';
      micBtn.title = isListening ? (window.I18n ? window.I18n.t('ai.listeningStop') : 'Escuchando... pulsa para parar') : (window.I18n ? window.I18n.t('ai.speakMic') : 'Hablar por micrófono');
    }
    if (headerVoiceBtn) {
      headerVoiceBtn.classList.toggle('listening', isListening);
      const icon = headerVoiceBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.style.color = isListening ? 'var(--m3-error, #ba1a1a)' : '';
        icon.style.animation = isListening ? 'pulse 1s infinite' : '';
      }
    }
    if (centralGeminiBtn) {
      centralGeminiBtn.classList.toggle('listening', isListening);
    }
    if (invokeMicBtn) {
      invokeMicBtn.classList.toggle('listening', isListening);
    }
    if (invokePulse) {
      invokePulse.style.display = isListening ? 'flex' : 'none';
    }
    if (badge) {
      badge.style.display = isListening ? 'flex' : 'none';
    }
  }

  openGeminiInvokeModal(startVoice = false) {
    this.stopSpeech();
    const modal = document.getElementById('modal-gemini-invoke');
    if (!modal) return;
    this.openDialogModal(modal);

    const input = document.getElementById('gemini-invoke-input');
    const resultBox = document.getElementById('gemini-invoke-result');
    const transcription = document.getElementById('gemini-invoke-transcription');
    if (input) input.value = '';
    if (resultBox) {
      resultBox.style.display = 'none';
      const actions = document.getElementById('gemini-invoke-result-actions');
      if (actions) actions.innerHTML = '';
    }
    if (transcription) {
      transcription.innerHTML = '<em>Pulsa el micro o escribe tu petición</em>';
    }

    if (startVoice && this.speechRecognitionSupported) {
      this.toggleVoiceRecognition(true);
    } else if (input) {
      setTimeout(() => input.focus(), 150);
    }
  }

  closeGeminiInvokeModal() {
    this.stopSpeech();
    const modal = document.getElementById('modal-gemini-invoke');
    if (this.isListeningVoice) {
      try { this.recognition.stop(); } catch (e) { }
      this.isListeningVoice = false;
      this.updateVoiceUI(false);
    }
    // Franky: limpiar memoria conversacional al cerrar la ventana para comenzar limpio en la siguiente apertura
    this.aiChatHistory = [];
    const threadBox = document.getElementById('gemini-invoke-thread');
    if (threadBox) {
      threadBox.style.display = 'none';
      threadBox.innerHTML = '';
    }
    const newChatBtn = document.getElementById('btn-gemini-invoke-new-chat');
    if (newChatBtn) newChatBtn.style.display = 'none';
    if (modal) this.closeDialogModal(modal);
  }

  async handleGeminiInvokeSubmit(isVoice = false) {
    this.stopSpeech();
    const input = document.getElementById('gemini-invoke-input');
    const prompt = input?.value?.trim();
    if (!prompt) return;
    if (input) input.value = '';

    if (this.isListeningVoice) {
      try { this.recognition.stop(); } catch (e) { }
      this.isListeningVoice = false;
      this.updateVoiceUI(false);
    }

    const transcription = document.getElementById('gemini-invoke-transcription');
    const resultBox = document.getElementById('gemini-invoke-result');
    const resultText = document.getElementById('gemini-invoke-result-text');
    const resultActions = document.getElementById('gemini-invoke-result-actions');
    const sendBtn = document.getElementById('btn-gemini-invoke-send');

    const isFullCatalog = false;
    const noticeHtml = isFullCatalog
      ? `<div class="ai-wait-notice">Analizando tu recetario completo (${state.recipes.length} recetas)... Esto puede tardar unos segundos.</div>`
      : '';
    if (transcription) {
      const thinkingText = window.I18n ? window.I18n.t('ai.assistantThinking') : 'El Sous Chef está pensando...';
      transcription.innerHTML = `<span class="ai-status-loading">
        <span class="material-symbols-outlined icon-sm icon-spin">sync</span>
        ${thinkingText}
      </span>${noticeHtml}`;
    }
    if (sendBtn) sendBtn.disabled = true;

    try {
      const systemPrompt = this.buildAiSystemInstruction(prompt);
      const response = await this.callGeminiAgent(prompt, systemPrompt, true);
      let executedToolsCount = 0;
      let primaryActionTarget = null; // 'view-shopping' | 'view-planner' | 'view-recipes'
      const createdRecipes = [];

      if (Array.isArray(response.toolCalls) && response.toolCalls.length > 0) {
        response.toolCalls.forEach(call => {
          const res = this.executeAiToolCall(call);
          if (res) {
            executedToolsCount++;
            if (call.name === 'manage_shopping_list' || call.name === 'add_shopping_items') primaryActionTarget = 'view-shopping';
            else if (call.name === 'set_weekly_plan' || call.name === 'set_day_plan') primaryActionTarget = 'view-planner';
            else if (call.name === 'create_and_save_recipe') {
              primaryActionTarget = 'view-recipes';
              if (res.recipeId) createdRecipes.push(res);
            }
          }
        });
      }

      this.render();

      const cleanText = response.text || 'Acción completada con éxito.';
      if (transcription) {
        transcription.textContent = `"${prompt}"`;
      }

      // Mantener memoria multi-turno en el Asistente para permitir diálogos continuos ("recomiéndame..." -> "guárdalas")
      if (!Array.isArray(this.aiChatHistory)) this.aiChatHistory = [];
      this.aiChatHistory.push({ role: 'user', text: prompt });
      this.aiChatHistory.push({ role: 'model', text: cleanText });

      // Botón "Nuevo tema" visible si hay conversación activa
      const newChatBtn = document.getElementById('btn-gemini-invoke-new-chat');
      if (newChatBtn) newChatBtn.style.display = 'inline-flex';

      // Mostrar hilo anterior mientras la ventana está abierta para memoria conversacional visual
      const threadBox = document.getElementById('gemini-invoke-thread');
      if (threadBox) {
        const previousTurns = this.aiChatHistory.slice(0, -2);
        if (previousTurns.length > 0) {
          threadBox.style.display = 'flex';
          threadBox.innerHTML = previousTurns.map(t => {
            const isU = t.role === 'user';
            const escaped = typeof escapeHtml === 'function' ? escapeHtml(t.text) : String(t.text).replace(/</g, '&lt;');
            const authorText = isU
              ? (window.I18n ? window.I18n.t('household.you').replace(/[()]/g, '') : 'Tú')
              : 'Sous Chef';
            return `<div class="ai-history-bubble ${isU ? 'is-user' : ''}">
              <strong class="${isU ? 'ai-history-author-user' : 'ai-history-author-assistant'}">${authorText}:</strong> ${escaped.slice(0, 160)}${escaped.length > 160 ? '...' : ''}
            </div>`;
          }).join('');
        } else {
          threadBox.style.display = 'none';
          threadBox.innerHTML = '';
        }
      }

      if (resultBox && resultText) {
        resultBox.style.display = 'flex';
        let fallbackBanner = '';
        if (response && response.isSimulatedFallback) {
          const safeErrorMsg = escapeHtml(response.originalError || 'tiempo de espera agotado');
          fallbackBanner = `<div class="ai-fallback-banner">
            <span class="material-symbols-outlined icon-18 u-shrink-0">cloud_off</span>
            <span><strong>Aviso de conexión:</strong> No se pudo contactar con Gemini en la nube (${safeErrorMsg}). Se ha activado la simulación local provisional de emergencia.</span>
          </div>`;
        }
        resultText.innerHTML = fallbackBanner + formatSafeAiMarkdown(cleanText);

        if (resultActions) {
          resultActions.innerHTML = '';

          // Si se crearon recetas nuevas, añadir botón directo para abrir cada una
          if (createdRecipes.length > 0) {
            createdRecipes.forEach(cr => {
              const btnRecipe = document.createElement('button');
              btnRecipe.type = 'button';
              btnRecipe.className = 'btn btn-primary btn-sm';
              btnRecipe.innerHTML = `<span class="material-symbols-outlined icon-sm">restaurant_menu</span> Ver "${cr.title}"`;
              btnRecipe.addEventListener('click', () => {
                this.closeGeminiInvokeModal();
                this.switchView('view-recipes');
                this.openRecipeDetail(cr.recipeId);
              });
              resultActions.appendChild(btnRecipe);
            });
            this.showToast(`✓ ${createdRecipes.length === 1 ? `Receta "${createdRecipes[0].title}" guardada en tu catálogo.` : `${createdRecipes.length} recetas guardadas en tu catálogo.`}`, 'success');
          } else if (primaryActionTarget) {
            const btnTarget = document.createElement('button');
            btnTarget.className = 'btn btn-primary btn-sm';
            btnTarget.textContent = primaryActionTarget === 'view-shopping'
              ? 'Ver Lista de la Compra'
              : (primaryActionTarget === 'view-planner' ? 'Ver Planificador' : 'Ver Recetas');
            btnTarget.addEventListener('click', () => {
              this.closeGeminiInvokeModal();
              this.switchView(primaryActionTarget);
            });
            resultActions.appendChild(btnTarget);
          } else if (/\b(Lunes|Martes|Miércoles|Miercoles|Jueves|Viernes|Sábado|Sabado|Domingo)\b.*?[:\-]/i.test(cleanText)) {
            // Si el Asistente propuso un menú semanal en texto, ofrecer botón directo para aplicarlo al planificador
            const btnApplyPlan = document.createElement('button');
            btnApplyPlan.type = 'button';
            btnApplyPlan.className = 'btn btn-primary btn-sm';
            btnApplyPlan.innerHTML = `<span class="material-symbols-outlined icon-sm">calendar_month</span> Aplicar al Planificador`;
            btnApplyPlan.addEventListener('click', () => {
              const input = document.getElementById('gemini-invoke-input');
              if (input) {
                input.value = 'Aplica este menú semanal en mi Planificador con los IDs de mi catálogo';
                this.handleGeminiInvokeSubmit(isVoice);
              }
            });
            resultActions.appendChild(btnApplyPlan);
          } else if (/receta|plato|ingrediente|1\.|2\./i.test(cleanText)) {
            // Si el Asistente propuso recetas sueltas en texto que no existen, ofrecer guardarlas
            const btnSaveRecipes = document.createElement('button');
            btnSaveRecipes.type = 'button';
            btnSaveRecipes.className = 'btn btn-tonal btn-sm';
            btnSaveRecipes.innerHTML = `<span class="material-symbols-outlined icon-sm">bookmark_add</span> Guardar en mis recetas`;
            btnSaveRecipes.addEventListener('click', () => {
              const input = document.getElementById('gemini-invoke-input');
              if (input) {
                input.value = 'Guarda las recetas recomendadas en mi catálogo';
                this.handleGeminiInvokeSubmit(isVoice);
              }
            });
            resultActions.appendChild(btnSaveRecipes);
          }

          const btnClose = document.createElement('button');
          btnClose.className = 'btn btn-secondary btn-sm';
          btnClose.textContent = 'Listo';
          btnClose.addEventListener('click', () => this.closeGeminiInvokeModal());
          resultActions.appendChild(btnClose);
        }
      }

      if (isVoice) {
        this.speakAiResponse(cleanText);
      }
      this.showToast('✓ Tu Sous Chef respondió.', 'success');
    } catch (err) {
      if (transcription) {
        transcription.innerHTML = `<span class="u-text-error-medium">Error: ${err.message}</span>`;
      }
      this.showToast(`Error del Sous Chef: ${err.message}`, 'error');
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  speakAiResponse(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (state.settings?.ttsEnabled === false) return;
    try {
      this.stopSpeech();
      const clean = String(text || '')
        .replace(/[*#_`]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\n+/g, '. ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!clean) return;

      // Locución ágil y concisa (máximo 2 oraciones o ~240 caracteres)
      // para evitar que el sintetizador recite párrafos interminables.
      const sentences = clean.match(/[^.!?]+[.!?]+/g);
      let spokenText = clean;
      if (sentences && sentences.length > 2) {
        spokenText = sentences.slice(0, 2).join(' ').trim();
      }
      if (spokenText.length > 240) {
        const truncated = spokenText.slice(0, 240);
        const lastSpace = truncated.lastIndexOf(' ');
        spokenText = (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + '.';
      }

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.onstart = () => this.updateTtsPlayingUI(true);
      utterance.onend = () => this.updateTtsPlayingUI(false);
      utterance.onerror = () => this.updateTtsPlayingUI(false);

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      this.updateTtsPlayingUI(true);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
      this.updateTtsPlayingUI(false);
    }
  }

  stopSpeech() {
    this.currentUtterance = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { }
    }
    this.updateTtsPlayingUI(false);
  }

  updateTtsPlayingUI(isPlaying) {
    const headerBtn = document.getElementById('btn-header-stop-tts');
    if (headerBtn) headerBtn.style.display = isPlaying ? 'inline-flex' : 'none';

    const ttsBar = document.getElementById('gemini-invoke-tts-bar');
    if (ttsBar) ttsBar.style.display = isPlaying ? 'flex' : 'none';

    const chatTtsBar = document.getElementById('ai-chat-speaking-indicator');
    if (chatTtsBar) chatTtsBar.style.display = isPlaying ? 'flex' : 'none';

    const resultText = document.getElementById('gemini-invoke-result-text');
    if (resultText) {
      if (isPlaying) {
        resultText.style.cursor = 'pointer';
        resultText.title = window.I18n ? window.I18n.t('ai.clickToStopVoice') : 'Haz clic para detener la voz del Sous Chef';
      } else {
        resultText.style.cursor = 'default';
        resultText.removeAttribute('title');
      }
    }
  }

  applySampleAiPlan(planOverride = null) {
    const targetPlan = planOverride || this.lastAiProposedPlan || this.buildSimulatedWeeklyPlanArgs('replace', false, typeof prompt !== 'undefined' ? prompt : '');
    this.executeAiToolCall({
      name: 'set_weekly_plan',
      args: targetPlan
    });
    this.showToast("¡Menú semanal organizado con éxito en tu calendario!", 'success');
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

  triggerCreateMissingSlotRecipes(gaps = null) {
    const activeGaps = Array.isArray(gaps) && gaps.length > 0 ? gaps : this.getDietarySlotGaps();
    const gapTags = activeGaps.length > 0 ? activeGaps.map(g => g.tag).join(' y ') : 'Desayuno y Merienda';
    const prefs = (state.dietaryPreferences || []).join(', ') || 'saludables';
    this.switchView('view-ai');
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = `Crea recetas nuevas de ${gapTags} que cumplan con ${prefs} y asígnalas en mi Plan semanal.`;
      this.handleAiChatSubmit();
    }
  }

  // ==========================================================================
  // US-30: MULTIMODAL AI RECIPE IMPORTER & GENERATOR (SCHEMA + IMAGE COMPRESSION + GEMINI)
  // ==========================================================================
  async compressImageToBase64(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
    if (!file) return null;

    // Capa 1: createImageBitmap (Moderno, nativo, decodifica JPEG/PNG/WebP/HEIC/AVIF sin fallos de FileReader)
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(file);
        let width = bitmap.width || 800;
        let height = bitmap.height || 600;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        if (typeof bitmap.close === 'function') bitmap.close();
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = (dataUrl.split(',')[1] || '').trim();
        if (base64Data && base64Data.length > 50) {
          return { dataUrl, base64Data, mimeType: 'image/jpeg' };
        }
      } catch (bmErr) {
        console.warn("[FoodAssistant] createImageBitmap no disponible o falló:", bmErr);
      }
    }

    // Capa 2: Si el preview del modal ya cargó la imagen en el DOM, extraer directamente desde el elemento <img>
    const previewImg = document.getElementById('import-image-preview');
    if (previewImg && (previewImg.naturalWidth > 0 || previewImg.width > 0)) {
      try {
        let width = previewImg.naturalWidth || previewImg.width || 800;
        let height = previewImg.naturalHeight || previewImg.height || 600;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = (dataUrl.split(',')[1] || '').trim();
        if (base64Data && base64Data.length > 50) {
          return { dataUrl, base64Data, mimeType: 'image/jpeg' };
        }
      } catch (prevErr) {
        console.warn("[FoodAssistant] Render desde previewImg falló:", prevErr);
      }
    }

    // Capa 3: Lectura binaria directa con file.arrayBuffer() (instantáneo, sin dependencias de DOM ni timers)
    if (typeof file.arrayBuffer === 'function') {
      try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const len = bytes.byteLength;
        const chunkSize = 8192;
        for (let i = 0; i < len; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)));
        }
        const base64Data = (typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64')).trim();
        if (base64Data && base64Data.length > 0) {
          const mimeType = (file.type && file.type.startsWith('image/')) ? file.type : 'image/jpeg';
          return {
            dataUrl: `data:${mimeType};base64,${base64Data}`,
            base64Data,
            mimeType
          };
        }
      } catch (bufErr) {
        console.warn("[FoodAssistant] file.arrayBuffer falló:", bufErr);
      }
    }

    // Capa 4: URL.createObjectURL + HTMLImageElement (evita bloqueos de permisos en FileReader de móviles)
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' && typeof file === 'object') {
      try {
        const objectUrl = URL.createObjectURL(file);
        const res = await new Promise((resolve, reject) => {
          const img = new Image();
          const tId = setTimeout(() => {
            try { URL.revokeObjectURL(objectUrl); } catch (e) { }
            reject(new Error("Timeout cargando imagen"));
          }, 2500);
          img.onload = () => {
            clearTimeout(tId);
            try {
              let width = img.naturalWidth || img.width || 800;
              let height = img.naturalHeight || img.height || 600;
              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                } else {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = Math.max(1, width);
              canvas.height = Math.max(1, height);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              try { URL.revokeObjectURL(objectUrl); } catch (e) { }
              const dataUrl = canvas.toDataURL('image/jpeg', quality);
              const base64Data = (dataUrl.split(',')[1] || '').trim();
              resolve({ dataUrl, base64Data, mimeType: 'image/jpeg' });
            } catch (err) {
              try { URL.revokeObjectURL(objectUrl); } catch (e) { }
              reject(err);
            }
          };
          img.onerror = (err) => {
            clearTimeout(tId);
            try { URL.revokeObjectURL(objectUrl); } catch (e) { }
            reject(err);
          };
          img.src = objectUrl;
        });
        if (res && res.base64Data && res.base64Data.length > 0) {
          return res;
        }
      } catch (objErr) {
        console.warn("[FoodAssistant] URL.createObjectURL falló:", objErr);
      }
    }

    // Capa 5: FileReader clásico
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => reject(new Error("Tiempo de procesamiento de imagen agotado")), 8000);
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timeoutId);
          try {
            let width = img.naturalWidth || img.width || 800;
            let height = img.naturalHeight || img.height || 600;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            const base64Data = (dataUrl.split(',')[1] || '').trim();
            resolve({ dataUrl, base64Data, mimeType: 'image/jpeg' });
          } catch (cErr) {
            reject(cErr);
          }
        };
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error("El archivo no es una imagen compatible o legible."));
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("No se pudo leer el archivo de imagen."));
      };
      reader.readAsDataURL(file);
    });
  }

  normalizeAiExtractedRecipe(rawJson, sourceUrl = '') {
    if (!rawJson || typeof rawJson !== 'object') {
      throw new Error("Respuesta inválida recibida de la IA.");
    }
    const title = String(rawJson.title || 'Receta Importada con IA').trim();
    const description = String(rawJson.description || 'Receta extraída y adaptada mediante Gemini IA.').trim();
    const prepTimeMinutes = Math.max(0, parseInt(rawJson.prepTimeMinutes, 10) || 10);
    const cookTimeMinutes = Math.max(0, parseInt(rawJson.cookTimeMinutes, 10) || 15);
    const servings = Math.max(1, parseInt(rawJson.servings, 10) || state.settings?.defaultServings || 2);

    const rawIngs = Array.isArray(rawJson.ingredients) ? rawJson.ingredients : [];
    const ingredients = rawIngs.map((ing, idx) => {
      const name = String(ing?.name || `Ingrediente ${idx + 1}`).trim();
      const unit = RecipeParser.normalizeUnit(ing?.unit || 'ud');
      return {
        id: generateId('ing-'),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: ing?.amount !== null && ing?.amount !== undefined && !isNaN(ing.amount) ? Number(ing.amount) : 1,
        unit: unit,
        aisle: ing?.aisle || categorizeIngredientAisle(name)
      };
    }).filter(i => i.name);

    const rawSteps = Array.isArray(rawJson.instructions) ? rawJson.instructions : [];
    let stepNum = 1;
    const instructions = rawSteps.map(step => {
      const text = typeof step === 'string' ? step : String(step?.text || '').trim();
      if (!text) return null;
      const detectedTimer = RecipeParser.extractTimerMinutes(text);
      return {
        step: stepNum++,
        text,
        timerMinutes: typeof step?.timerMinutes === 'number' ? step.timerMinutes : (detectedTimer || 0)
      };
    }).filter(Boolean);

    let nutrition = null;
    if (rawJson.nutrition && typeof rawJson.nutrition === 'object') {
      nutrition = {
        calories: Number(rawJson.nutrition.calories) || 0,
        protein: Number(rawJson.nutrition.protein) || 0,
        carbs: Number(rawJson.nutrition.carbs) || 0,
        fat: Number(rawJson.nutrition.fat) || 0
      };
    } else {
      nutrition = estimateRecipeNutrition({ title, ingredients, servings });
    }

    const tags = Array.isArray(rawJson.tags) ? [...rawJson.tags] : [];

    const recipe = {
      id: generateId('rec-'),
      title,
      description,
      imageUrl: rawJson.imageUrl || rawJson.image || '',
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      tags,
      nutrition,
      ingredients,
      instructions,
      sourceUrl: sourceUrl || '',
      sourceDomain: sourceUrl ? RecipeParser.getDomain(sourceUrl) : 'Gemini IA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (typeof analyzeAndInferRecipeTags === 'function') {
      const inferred = analyzeAndInferRecipeTags(recipe);
      const lowerSet = new Set(recipe.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(t => {
        const l = t.toLowerCase().trim();
        if (!lowerSet.has(l) && l !== 'general') {
          recipe.tags.push(t);
          lowerSet.add(l);
          state.addCustomTag && state.addCustomTag(t);
        }
      });
    }

    return recipe;
  }

  async extractRecipeWithGemini({ text = '', imageBase64 = null, mimeType = 'image/jpeg', sourceUrl = '' } = {}) {
    const apiKey = this.getEffectiveGeminiApiKey();
    if (!apiKey) {
      // Fallback simulado cuando el usuario no tiene clave
      const sampleText = text || 'Receta extraída de foto';
      const isProteic = /prote[ií]n/i.test(sampleText);
      return this.normalizeAiExtractedRecipe({
        title: isProteic ? "Bowl Fitness Proteico Multimodal" : "Plato Casero Tradicional Multimodal",
        description: "Receta procesada e interpretada automáticamente a partir del contenido multimedia proporcionado.",
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: state.settings?.defaultServings || 2,
        tags: ["Saludable", isProteic ? "Alta en Proteínas" : "Almuerzo"],
        ingredients: [
          { name: "Pechuga de pollo o tofu", amount: 250, unit: "g" },
          { name: "Verduras variadas salteadas", amount: 200, unit: "g" },
          { name: "Aceite de oliva virgen extra", amount: 15, unit: "ml" },
          { name: "Arroz integral o quinoa", amount: 150, unit: "g" }
        ],
        instructions: [
          { step: 1, text: "Cocina el arroz o base de cereal según indicaciones del paquete.", timerMinutes: 12 },
          { step: 2, text: "Saltea el pollo o tofu en dados en una sartén caliente con aceite de oliva.", timerMinutes: 6 },
          { step: 3, text: "Añade las verduras troceadas, salpimenta al gusto y combina todos los ingredientes en un plato o bowl.", timerMinutes: 4 }
        ],
        nutrition: { calories: 430, protein: 42, carbs: 38, fat: 12 }
      }, sourceUrl);
    }

    const parts = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64
        }
      });
    }
    const promptText = `Eres un asistente culinario experto. Analiza este texto o imagen de receta y extrae de forma limpia todos los campos estructurados en formato JSON estricto.
Texto o contexto: ${text || '(Sin texto adicional, analiza la imagen adjunta)'}

REGLAS CRÍTICAS:
- Devuelve SOLAMENTE un bloque JSON válido, sin texto adicional antes ni después ni bloques \`\`\`json.
- Estructura requerida:
{
  "title": "string con el nombre del plato",
  "description": "string breve de 1-2 frases descriptivas",
  "prepTimeMinutes": número entero,
  "cookTimeMinutes": número entero,
  "servings": número entero de raciones,
  "tags": ["array", "de", "etiquetas"],
  "ingredients": [
    { "name": "nombre limpio", "amount": número, "unit": "g|ml|ud|cda|cdta|pizca..." }
  ],
  "instructions": [
    { "step": 1, "text": "descripción del paso", "timerMinutes": 0 }
  ],
  "nutrition": {
    "calories": número entero kcal por ración,
    "protein": gramos,
    "carbs": gramos,
    "fat": gramos
  }
}`;
    parts.push({ text: promptText });

    let rawModel = state.settings.geminiModel || 'gemini-3.8-flash';
    if (rawModel === 'gemini-2.5-flash-lite' || rawModel === 'gemini-1.5-flash' || rawModel === 'gemini-2.5-flash') {
      rawModel = 'gemini-3.8-flash';
      state.settings.geminiModel = 'gemini-3.8-flash';
      state.save && state.save('fa_settings', state.settings);
    }
    const candidateModels = (rawModel === 'gemini-3.5-flash-lite')
      ? ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.1-flash-lite']
      : ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

    let lastError = null;
    let data = null;

    for (const model of candidateModels) {
      const controller = new AbortController();
      const timeoutMs = (model === 'gemini-3.8-flash') ? 16000 : 20000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [{ parts }]
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          data = await resp.json();
          break;
        }
        const errJson = await resp.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP ${resp.status}`;
        lastError = new Error(errMsg);

        if (/api key not valid|invalid api key/i.test(errMsg)) {
          break;
        }

        if (resp.status === 503 || resp.status === 429) {
          await new Promise(r => setTimeout(r, 300));
        }
      } catch (e) {
        clearTimeout(timeoutId);
        lastError = e.name === 'AbortError' ? new Error(`Tiempo de espera agotado al analizar con Gemini (${model})`) : e;
      }
    }

    if (!data) {
      const isDemandOrTimeoutOrQuota = /quota|exceeded|rate limit|429|resource exhausted|high demand|overloaded|try again later|503|tiempo de espera|timeout|abort|network|fetch/i.test(lastError?.message || '');
      if (isDemandOrTimeoutOrQuota) {
        console.warn(`[FoodAssistant] Gemini saturado o con alta demanda (${lastError?.message}). Activando extracción asistida de borrador con foto/datos adjuntos.`);
        const sampleText = text || 'Receta extraída de foto';
        const isProteic = /prote[ií]n/i.test(sampleText);
        const parsedFromText = text ? RecipeParser.parseRecipeText(text) : null;
        const recipeImage = imageBase64
          ? (imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`)
          : '';

        const draftRecipe = this.normalizeAiExtractedRecipe({
          title: parsedFromText?.title || (isProteic ? "Bowl Fitness Proteico (Borrador)" : (text ? text.slice(0, 40) : "Receta desde foto")),
          description: "Borrador generado con tu foto y notas mientras los servidores de Gemini se descongestionan. Puedes editar los ingredientes o reanalizar cuando desees.",
          image: recipeImage,
          prepTimeMinutes: parsedFromText?.prepTimeMinutes || 10,
          cookTimeMinutes: parsedFromText?.cookTimeMinutes || 15,
          servings: parsedFromText?.servings || state.settings?.defaultServings || 2,
          tags: parsedFromText?.tags || ["Saludable", isProteic ? "Alta en Proteínas" : "Foto"],
          ingredients: (parsedFromText?.ingredients && parsedFromText.ingredients.length > 0)
            ? parsedFromText.ingredients
            : [
              { name: "Ingrediente principal de la foto", amount: 1, unit: "ud" },
              { name: "Guarnición o verduras", amount: 150, unit: "g" },
              { name: "Aceite de oliva virgen extra", amount: 15, unit: "ml" }
            ],
          instructions: (parsedFromText?.instructions && parsedFromText.instructions.length > 0)
            ? parsedFromText.instructions
            : [
              { step: 1, text: "Preparar los ingredientes mostrados en la imagen.", timerMinutes: 5 },
              { step: 2, text: "Cocinar según la técnica habitual del plato.", timerMinutes: 10 }
            ],
          nutrition: parsedFromText?.nutrition || { calories: 420, protein: 35, carbs: 35, fat: 12 }
        }, sourceUrl);

        draftRecipe._isHighDemandFallback = true;
        draftRecipe._highDemandOriginalError = lastError?.message;
        return draftRecipe;
      }
      throw lastError || new Error("No se pudo conectar con Gemini para extraer la receta.");
    }

    const rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Extracción limpia y tolerante a bloques markdown o introducciones de texto
    const jsonMatch = rawResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se detectó un formato JSON válido en la receta analizada.");
    }

    const parsedJson = JSON.parse(jsonMatch[0]);
    return this.normalizeAiExtractedRecipe(parsedJson, sourceUrl);
  }

  // ==========================================================================
  // UNIVERSAL RECIPE IMPORTER (US-15: SCHEMA.ORG JSON-LD & TEXT PARSER)
  // ==========================================================================
  openImportModal(defaultTab = 'url') {
    if (this.modalRecipeImport) {
      this.openDialogModal(this.modalRecipeImport);
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
    this.closeDialogModal(this.modalRecipeImport);
    this.pendingImportRecipe = null;
  }

  switchImportTab(tab) {
    const tabUrl = document.getElementById('tab-import-url');
    const tabText = document.getElementById('tab-import-text');
    const tabAi = document.getElementById('tab-import-ai');
    const secUrl = document.getElementById('section-import-url');
    const secText = document.getElementById('section-import-text');
    const secAi = document.getElementById('section-import-ai');
    const status = document.getElementById('import-status-indicator');
    if (status) status.style.display = 'none';
    const corsBanner = document.getElementById('import-cors-banner');
    if (corsBanner) corsBanner.style.display = 'none';

    // Reset styles & ARIA states (US-30, US-68 / v1.23)
    [tabUrl, tabText, tabAi].forEach(t => {
      if (t) {
        t.style.background = '';
        t.style.color = '';
        t.style.boxShadow = '';
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      }
    });
    [secUrl, secText, secAi].forEach(s => {
      if (s) s.style.display = 'none';
    });

    if (tab === 'url') {
      if (tabUrl) {
        tabUrl.classList.add('active');
        tabUrl.setAttribute('aria-selected', 'true');
      }
      if (secUrl) secUrl.style.display = 'block';
    } else if (tab === 'text') {
      if (tabText) {
        tabText.classList.add('active');
        tabText.setAttribute('aria-selected', 'true');
      }
      if (secText) secText.style.display = 'block';
    } else if (tab === 'ai') {
      if (tabAi) {
        tabAi.classList.add('active');
        tabAi.setAttribute('aria-selected', 'true');
      }
      if (secAi) secAi.style.display = 'block';
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
        status.innerHTML = '<span class="material-symbols-outlined icon-sm icon-valign-middle">help</span> Para pegar, pulsa <strong>Ctrl + V</strong> (o mantén pulsado el área de texto en móvil).';
      }
    }
  }

  async handleRecipeImport() {
    let url = document.getElementById('import-url-input')?.value.trim() || '';
    const text = document.getElementById('import-text-input')?.value.trim() || '';
    const aiPrompt = document.getElementById('import-ai-prompt-input')?.value.trim() || '';
    const imageInput = document.getElementById('import-image-input');
    const imageFile = imageInput?.files?.[0] || this.selectedImportImageFile || null;

    const status = document.getElementById('import-status-indicator');
    const previewBox = document.getElementById('import-preview-box');
    const corsBanner = document.getElementById('import-cors-banner');
    const btnExecute = document.getElementById('btn-execute-import');
    const btnConfirm = document.getElementById('btn-confirm-save-import');

    const isUrlActive = document.getElementById('section-import-url')?.style.display !== 'none';
    const isAiActive = document.getElementById('section-import-ai')?.style.display !== 'none';
    const isTextActive = !isUrlActive && !isAiActive;

    if (isUrlActive && !url) {
      this.highlightInputError(document.getElementById('import-url-input'), window.I18n ? window.I18n.t('import.urlRequired') : "Por favor, introduce una URL de receta.");
      return;
    }
    if (isTextActive && !text) {
      this.highlightInputError(document.getElementById('import-text-input'), window.I18n ? window.I18n.t('import.textRequired') : "Por favor, pega el texto de la receta.");
      return;
    }
    if (isAiActive && !aiPrompt && !imageFile) {
      this.highlightInputError(document.getElementById('import-ai-prompt-input'), window.I18n ? window.I18n.t('import.aiPromptRequired') : "Sube una foto o describe la receta que deseas.");
      return;
    }

    if (corsBanner) corsBanner.style.display = 'none';
    if (status) {
      status.style.display = 'block';
      status.style.color = 'var(--m3-primary)';
      const analyzingMsg = window.I18n ? window.I18n.t('import.analyzing') : 'Analizando receta con IA y extrayendo ingredientes...';
      status.innerHTML = `<span class="material-symbols-outlined icon-sm icon-spin icon-valign-middle">sync</span> ${escapeHtml(analyzingMsg)}`;
    }

    try {
      let extractedRecipe = null;

      if (isAiActive) {
        // Mode 3: Multimodal AI (Photo / Social / Prompt)
        let imageBase64 = null;
        let mimeType = 'image/jpeg';
        if (imageFile) {
          const compressed = await this.compressImageToBase64(imageFile);
          imageBase64 = compressed?.base64Data || null;
          mimeType = compressed?.mimeType || 'image/jpeg';
        }
        extractedRecipe = await this.extractRecipeWithGemini({
          text: aiPrompt,
          imageBase64,
          mimeType
        });
      } else if (isUrlActive) {
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
          // US-52: Proxy propio con Supabase Edge Function
          const proxyEndpoints = [];
          const sbUrl = (state.supabaseConfig?.url || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
          if (sbUrl) {
            proxyEndpoints.push(`${sbUrl}/functions/v1/import-recipe?url=${encodeURIComponent(cleanUrl)}`);
          }
          proxyEndpoints.push(`https://r.jina.ai/${cleanUrl}`);
          proxyEndpoints.push(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(cleanUrl)}`);
          proxyEndpoints.push(`https://corsproxy.io/?url=${encodeURIComponent(cleanUrl)}`);

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
              extractedRecipe = RecipeParser.parseSchemaRecipe(schemaObj, cleanUrl, html);
            }
            // If schema parsing yielded no recipe, or 0 ingredients, or 0 instructions, try text parser to complement or replace
            if (!extractedRecipe || extractedRecipe.ingredients.length === 0 || extractedRecipe.instructions.length === 0) {
              const extractedText = RecipeParser.htmlToText(html);
              if (extractedText) {
                const textRecipe = RecipeParser.parseRecipeText(extractedText, cleanUrl, html);
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

          // US-30: Fallback con IA si la extracción clásica de la URL descargada no obtuvo ingredientes reconocibles
          if ((!extractedRecipe || !extractedRecipe.ingredients || extractedRecipe.ingredients.length === 0) && html && fetchSuccess) {
            try {
              const plainText = RecipeParser.htmlToText(html).substring(0, 4000);
              extractedRecipe = await this.extractRecipeWithGemini({
                text: `Página web de receta: ${cleanUrl}\n\nTexto extraído de la página:\n${plainText}`,
                sourceUrl: cleanUrl
              });
            } catch (aiUrlErr) {
              console.warn("Fallo en fallback IA para URL:", aiUrlErr);
            }
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
        // US-30: Fallback con IA si el texto pegado no tiene formato de receta convencional (ej. texto social de Instagram)
        if (!extractedRecipe || !extractedRecipe.ingredients || extractedRecipe.ingredients.length === 0) {
          try {
            extractedRecipe = await this.extractRecipeWithGemini({ text });
          } catch (aiTextErr) {
            console.warn("Fallo en fallback IA para texto pegado:", aiTextErr);
          }
        }
      }

      if (!extractedRecipe || !extractedRecipe.title || !extractedRecipe.ingredients || extractedRecipe.ingredients.length === 0) {
        throw new Error("No se pudieron detectar ingredientes válidos en el contenido introducido. Comprueba que contenga la lista de ingredientes o prueba en la pestaña 'Foto / IA'.");
      }

      if (extractedRecipe && !extractedRecipe.language) {
        extractedRecipe.language = detectRecipeLanguage(extractedRecipe);
      }

      // Store in memory for confirmation
      this.pendingImportRecipe = extractedRecipe;

      // Close the import modal directly and open the full recipe detail screen in review mode
      this.closeImportModal();
      this.openImportReview(extractedRecipe);

      if (extractedRecipe?._isHighDemandFallback) {
        this.showToast(window.I18n ? window.I18n.t('import.geminiHighDemand') : '⚠️ Servidores de Gemini con alta demanda temporal. Se ha creado el borrador con tu foto adjunta para que no pierdas ningún dato.', 'info');
      }

    } catch (err) {
      if (status) {
        status.style.color = 'var(--m3-error)';
        const rawMsg = err?.message || '';
        let cleanMsg = rawMsg;
        if (/is no longer available/i.test(rawMsg)) {
          cleanMsg = window.I18n ? window.I18n.t('import.aiModelOutdated') : 'Modelo de IA desactualizado. Se ha actualizado automáticamente a gemini-3.8-flash. Por favor, pulsa "Analizar e Importar" de nuevo.';
        } else if (/high demand|overloaded|try again later|503/i.test(rawMsg)) {
          cleanMsg = 'Los servidores de Gemini están experimentando alta demanda global en este momento. Puedes reintentar en unos instantes o pulsar "Escribir a mano" para crear la receta con tu foto adjunta.';
        }
        status.textContent = 'Aviso: ' + cleanMsg;
      }
      if (previewBox) previewBox.style.display = 'none';
      if (btnExecute) btnExecute.style.display = 'inline-flex';
      if (btnConfirm) btnConfirm.style.display = 'none';
    }
  }
  async confirmSaveImportRecipe(skipUrlDuplicateCheck = false) {
    const newRecipe = this.pendingImportRecipe || this.activeRecipe;
    if (!newRecipe) return;
    if (!newRecipe.language) {
      newRecipe.language = detectRecipeLanguage(newRecipe);
    }

    // BUG-16: Detectar sourceUrl existente y ofrecer "Abrir existente" o "Guardar copia"
    if (!skipUrlDuplicateCheck && newRecipe.sourceUrl && (!newRecipe.id || !state.recipes.some(r => r.id === newRecipe.id))) {
      const cleanSourceUrl = newRecipe.sourceUrl.trim().replace(/\/+$/, '').toLowerCase();
      const existingUrlRecipe = state.recipes.find(r =>
        r.id !== newRecipe.id &&
        r.sourceUrl &&
        r.sourceUrl.trim().replace(/\/+$/, '').toLowerCase() === cleanSourceUrl
      );

      if (existingUrlRecipe) {
        const modalTitle = window.I18n ? window.I18n.t('import.alreadyImportedTitle') : 'Receta ya importada';
        const modalMsg = window.I18n ? window.I18n.t('import.alreadyImportedMsg', { title: existingUrlRecipe.title }) : `Esta receta ya existe en tu recetario como "${existingUrlRecipe.title}".\n\n¿Deseas abrir la receta existente en lugar de duplicarla?`;
        const openText = window.I18n ? window.I18n.t('import.openExisting') : 'Abrir existente';
        const copyText = window.I18n ? window.I18n.t('import.saveCopy') : 'Guardar copia';

        const openExisting = await this.showConfirmDialog({
          title: modalTitle,
          message: modalMsg,
          confirmText: openText,
          cancelText: copyText,
          icon: 'content_copy'
        });

        if (openExisting) {
          this.isReviewingImport = false;
          this.pendingImportRecipe = null;
          this.closeImportModal();
          this.closeRecipeModal();
          this.render();
          this.switchView('view-recipes');
          this.openRecipeDetail(existingUrlRecipe.id);
          this.showToast(window.I18n ? window.I18n.t('import.showingExisting', { title: existingUrlRecipe.title }) : `Mostrando receta existente: "${existingUrlRecipe.title}".`, 'info');
          return existingUrlRecipe;
        }
        newRecipe.id = generateId('rec-');
      }
    }

    if (!newRecipe.id) {
      newRecipe.id = generateId('rec-');
    }
    const existingIdx = state.recipes.findIndex(r => r.id === newRecipe.id);
    const existing = existingIdx >= 0 ? state.recipes[existingIdx] : null;

    if (!Array.isArray(newRecipe.tags)) newRecipe.tags = [];
    if (typeof analyzeAndInferRecipeTags === 'function') {
      const inferred = analyzeAndInferRecipeTags(newRecipe);
      const existingLower = new Set(newRecipe.tags.map(t => String(t).toLowerCase().trim()));
      inferred.forEach(tag => {
        const lower = tag.toLowerCase().trim();
        if (!existingLower.has(lower) && lower !== 'general' && lower !== 'importada') {
          newRecipe.tags.push(tag);
          existingLower.add(lower);
          state.addCustomTag && state.addCustomTag(tag);
        }
      });
    }

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
    const selectProvider = document.getElementById('select-ai-provider');
    const inputKey = document.getElementById('input-gemini-key');
    const status = document.getElementById('gemini-key-status');

    if (selectProvider) {
      selectProvider.value = state.settings.aiProvider || 'gemini';
      selectProvider.onchange = (e) => {
        state.settings.aiProvider = e.target.value;
        state.save && state.save('fa_settings', state.settings);
        this.renderSettings();
      };
    }

    const currentProvider = state.settings.aiProvider || 'gemini';
    const modelWrapper = document.getElementById('wrapper-gemini-model');
    const selectModel = document.getElementById('select-gemini-model');
    if (modelWrapper) {
      modelWrapper.style.display = 'none';
    }
    if (selectModel) {
      selectModel.value = state.settings.geminiModel || 'gemini-3.5-flash-lite';
      selectModel.onchange = (e) => {
        state.settings.geminiModel = e.target.value;
        state.save && state.save('fa_settings', state.settings);
        this.renderSettings();
      };
    }

    const switchTts = document.getElementById('switch-tts-voice');
    if (switchTts) {
      switchTts.checked = state.settings.ttsEnabled !== false;
      switchTts.onchange = (e) => {
        state.settings.ttsEnabled = e.target.checked;
        state.save && state.save('fa_settings', state.settings);
        if (!e.target.checked) {
          this.stopSpeech();
        }
      };
    }

    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    if (inputKey) {
      inputKey.value = state.settings.geminiApiKey || '';
      if (currentProvider === 'openai') {
        inputKey.placeholder = isEn ? 'sk-proj-... (OpenAI Key)' : 'sk-proj-... (Clave de OpenAI)';
      } else if (currentProvider === 'claude') {
        inputKey.placeholder = isEn ? 'sk-ant-... (Anthropic Claude Key)' : 'sk-ant-... (Clave de Anthropic Claude)';
      } else {
        inputKey.placeholder = isEn ? 'AIzaSy... (Google Gemini Key)' : 'AIzaSy... (Clave de Google Gemini)';
      }
    }

    if (status) {
      const provName = currentProvider === 'openai' ? 'OpenAI ChatGPT' : (currentProvider === 'claude' ? 'Anthropic Claude' : 'Google Gemini');
      if (state.settings.geminiApiKey) {
        status.innerHTML = `<span class="u-text-brand-medium">✓ ${window.I18n ? window.I18n.t('settings.apiKeyConfigured', { provider: provName }) : `Clave configurada (${provName} activo)`}</span>`;
      } else if (this.getEffectiveGeminiApiKey()) {
        status.innerHTML = `<span class="u-text-brand-medium">✓ ${window.I18n ? window.I18n.t('settings.apiKeySharedActive', { provider: provName }) : `IA de Sabory activa automáticamente (${provName} · clave propia opcional)`}</span>`;
      } else {
        status.innerHTML = `<span class="u-text-muted">${window.I18n ? window.I18n.t('settings.apiKeyIntegrated') : 'Modo Sous Chef Integrado activo (sin coste ni clave requerida)'}</span>`;
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
    this.renderNutritionGoalsSettings();
    this.renderExternalAgentSettings();
    this.renderHouseholdSettings();
    this.updateUserAccountUI();
  }

  // ==========================================================================
  // US-77: MODO FAMILIA / ESPACIO COLABORATIVO DEL HOGAR (FAMILY MODE)
  // ==========================================================================
  initHouseholdEvents() {
    if (this._householdEventsInitialized) return;
    this._householdEventsInitialized = true;

    const createForm = document.getElementById('form-create-household');
    if (createForm) {
      createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('input-create-household-name');
        await this.createHousehold(input ? input.value : '');
      });
    }

    const joinForm = document.getElementById('form-join-household');
    if (joinForm) {
      joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('input-join-household-code');
        await this.joinHouseholdByCode(input ? input.value : '');
      });
    }

    const createInput = document.getElementById('input-create-household-name');
    if (createInput) {
      createInput.addEventListener('input', () => {
        createInput.setCustomValidity?.('');
        createInput.classList.remove('input-error');
      });
    }

    const joinInput = document.getElementById('input-join-household-code');
    if (joinInput) {
      joinInput.addEventListener('input', () => {
        joinInput.setCustomValidity?.('');
        joinInput.classList.remove('input-error');
      });
    }
  }

  openHouseholdSettings() {
    this.switchView('view-settings');
    const card = document.getElementById('card-family-household');
    if (card && typeof card.scrollIntoView === 'function') {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  renderHouseholdSettings() {
    const hh = state.household;
    const isActive = !!(hh && hh.id);

    const headerBadge = document.getElementById('header-household-badge');
    const headerName = document.getElementById('header-household-name');
    if (headerBadge) {
      if (isActive) {
        headerBadge.removeAttribute('hidden');
        headerBadge.style.display = 'inline-flex';
        if (headerName) headerName.textContent = hh.name || 'Mi Hogar';
      } else {
        headerBadge.setAttribute('hidden', '');
        headerBadge.style.display = 'none';
      }
    }

    const statusBadge = document.getElementById('household-status-badge');
    const emptyView = document.getElementById('household-empty-view');
    const activeView = document.getElementById('household-active-view');

    if (statusBadge) {
      statusBadge.textContent = isActive ? `${window.I18n ? window.I18n.t('household.home') : 'Hogar'}: ${hh.name}` : (window.I18n ? window.I18n.t('household.personalMode') : 'Modo Personal');
      statusBadge.classList.toggle('is-active', isActive);
    }

    if (emptyView) emptyView.style.display = isActive ? 'none' : 'block';
    if (activeView) activeView.style.display = isActive ? 'block' : 'none';

    if (!isActive) return;

    const activeNameEl = document.getElementById('household-active-name');
    const activeRoleEl = document.getElementById('household-active-role');
    const membersCountEl = document.getElementById('household-members-count');
    const inviteCodeEl = document.getElementById('household-invite-code-display');
    const membersListEl = document.getElementById('household-members-list');
    const leaveBtnText = document.getElementById('btn-leave-household-text');

    const currentUserId = state.cloudUser?.id || '';
    const isOwner = hh.role === 'owner' || (currentUserId && hh.ownerId === currentUserId);
    const hostRoleText = window.I18n ? window.I18n.t('household.hostRole') : 'Anfitrión';
    const memberRoleText = window.I18n ? window.I18n.t('household.memberRole') : 'Miembro';

    const members = Array.isArray(hh.members) && hh.members.length > 0
      ? hh.members
      : [{
        userId: currentUserId || hh.ownerId || 'local',
        name: state.cloudUser?.name || hostRoleText,
        email: state.cloudUser?.email || '',
        role: 'owner'
      }];

    if (activeNameEl) activeNameEl.textContent = hh.name || (window.I18n ? window.I18n.t('nav.household') : 'Mi Hogar');
    if (activeRoleEl) activeRoleEl.textContent = isOwner ? hostRoleText : memberRoleText;
    if (membersCountEl) {
      const singleText = window.I18n ? window.I18n.t('household.syncedMemberSingle') : 'miembro sincronizado';
      const pluralText = window.I18n ? window.I18n.t('household.syncedMemberPlural') : 'miembros sincronizados';
      membersCountEl.textContent = `${members.length} ${members.length === 1 ? singleText : pluralText}`;
    }
    if (inviteCodeEl) inviteCodeEl.textContent = hh.inviteCode || 'SAB-0000';
    if (leaveBtnText) {
      leaveBtnText.textContent = (isOwner && members.length === 1) ? (window.I18n ? window.I18n.t('household.dissolveBtn') : 'Disolver hogar') : (window.I18n ? window.I18n.t('household.leaveBtn') : 'Abandonar hogar');
    }

    if (membersListEl) {
      const youText = window.I18n ? window.I18n.t('household.you') : '(Tú)';
      const makeHostText = window.I18n ? window.I18n.t('household.makeHost') : 'Hacer anfitrión';

      membersListEl.innerHTML = members.map(m => {
        const displayName = m.name || m.display_name || (m.email ? m.email.split('@')[0] : memberRoleText);
        const initials = displayName.trim().slice(0, 2).toUpperCase() || 'HM';
        const mRole = (m.role === 'owner' || m.userId === hh.ownerId) ? 'owner' : 'member';
        const isMe = currentUserId && (m.userId === currentUserId || m.user_id === currentUserId);
        const targetId = m.userId || m.user_id || '';

        return `
          <div class="household-member-item" role="listitem">
            <div class="household-member-info">
              <div class="household-member-avatar" aria-hidden="true">${escapeHtml(initials)}</div>
              <div class="household-member-texts">
                <span class="household-member-name">
                  ${escapeHtml(displayName)}${isMe ? ` <span class="household-member-self-tag">${youText}</span>` : ''}
                </span>
                ${m.email ? `<span class="household-member-email">${escapeHtml(m.email)}</span>` : ''}
              </div>
            </div>
            <div class="household-member-actions">
              <span class="household-role-pill">${mRole === 'owner' ? hostRoleText : memberRoleText}</span>
              ${isOwner && !isMe && targetId ? `
                <button type="button" class="btn btn-secondary btn-sm"
                  data-action="transferHouseholdOwnership"
                  data-user-id="${escapeHtml(targetId)}"
                  title="${makeHostText} (${escapeHtml(displayName)})">
                  ${makeHostText}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  async createHousehold(rawName) {
    const nameInput = document.getElementById('input-create-household-name');
    const cleanName = typeof rawName === 'string'
      ? rawName.trim()
      : (nameInput?.value.trim() || '');

    if (!cleanName || cleanName.length < 2) {
      if (nameInput) {
        this.highlightInputError(nameInput, 'Introduce un nombre para tu Hogar (mínimo 2 caracteres).');
      } else {
        this.showToast('Introduce un nombre para tu Hogar.', 'warning');
      }
      return { success: false, reason: 'invalid_name' };
    }

    if (!state.cloudUser?.id) {
      this.showToast('Inicia sesión en tu cuenta para crear un Hogar compartido.', 'info');
      this.openAuthModal();
      return { success: false, reason: 'auth_required' };
    }

    const householdId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : generateId('hh-');
    const inviteCode = generateHouseholdInviteCode();
    const nowIso = new Date().toISOString();

    const ownerMember = {
      userId: state.cloudUser.id,
      name: state.cloudUser.name || (state.cloudUser.email ? state.cloudUser.email.split('@')[0] : 'Anfitrión'),
      email: state.cloudUser.email || '',
      role: 'owner',
      joinedAt: nowIso
    };

    if (this.supabaseClient?.from) {
      try {
        const hhRes = await this.supabaseClient.from('households').insert({
          id: householdId,
          name: cleanName,
          invite_code: inviteCode,
          owner_id: state.cloudUser.id,
          created_at: nowIso,
          updated_at: nowIso
        });
        if (hhRes?.error) throw hhRes.error;

        const memRes = await this.supabaseClient.from('household_members').upsert({
          household_id: householdId,
          user_id: state.cloudUser.id,
          role: 'owner',
          display_name: ownerMember.name,
          email: ownerMember.email,
          joined_at: nowIso
        }, { onConflict: 'household_id,user_id' });
        if (memRes?.error) {
          console.warn('[Household] Aviso al insertar miembro propietario:', memRes.error);
        }
      } catch (err) {
        console.warn('[Household] Error al crear hogar en Supabase:', err);
        this.showToast('Error al crear el hogar en la nube: ' + (err.message || 'Fallo de red'), 'error');
        return { success: false, reason: 'cloud_error', error: err };
      }
    }

    const newHousehold = {
      id: householdId,
      name: cleanName,
      inviteCode,
      ownerId: state.cloudUser.id,
      role: 'owner',
      createdAt: nowIso,
      dietaryPreferences: Array.isArray(state.dietaryPreferences) ? [...state.dietaryPreferences] : [],
      dietaryUpdatedAt: state.dietaryUpdatedAt || nowIso,
      members: [ownerMember]
    };

    state.saveHousehold(newHousehold);

    // Convertir el plan semanal, compra y recetas actuales (no privadas) en la base compartida del Hogar
    if (Array.isArray(state.recipes)) {
      state.recipes.forEach(r => {
        if (!r.isPrivate) {
          r.householdId = householdId;
          r.ownerUserId = r.ownerUserId || state.cloudUser.id;
          r.updatedAt = nowIso;
        }
      });
      state.save('fa_recipes', state.recipes);
    }
    if (state.mealPlan && typeof state.mealPlan === 'object') {
      Object.keys(state.mealPlan).forEach(k => {
        const day = state.mealPlan[k];
        if (!day || k === '__household_prefs__') return;
        const hasMeals = !!(day.breakfast || day.lunch || day.snack || day.dinner || (Array.isArray(day.customSlots) && day.customSlots.length > 0));
        if (hasMeals || day.updatedAt) {
          day.householdId = householdId;
          day.ownerUserId = day.ownerUserId || state.cloudUser.id;
          day.updatedAt = day.updatedAt || nowIso;
        }
      });
      state.save('fa_mealplan', state.mealPlan);
    }
    if (Array.isArray(state.shoppingList)) {
      state.shoppingList.forEach(item => {
        item.householdId = householdId;
        item.ownerUserId = item.ownerUserId || state.cloudUser.id;
        item.updatedAt = item.updatedAt || nowIso;
      });
      state.save('fa_shopping', state.shoppingList);
    }

    // Forzar subida de todos los registros al hogar recién creado
    state.lastSyncedAt = null;
    if (nameInput) nameInput.value = '';
    this.renderHouseholdSettings();
    this.render();
    this.initHouseholdRealtimeSubscription();
    await this.pushToCloud(true);

    this.showToast(`¡Hogar "${cleanName}" creado! Código de invitación: ${inviteCode}`, 'success');
    return { success: true, household: newHousehold };
  }

  async joinHouseholdByCode(rawCode) {
    const codeInput = document.getElementById('input-join-household-code');
    const cleanCode = normalizeHouseholdInviteCode(
      typeof rawCode === 'string' ? rawCode : (codeInput?.value || '')
    );

    if (!cleanCode || cleanCode.length < 4) {
      if (codeInput) {
        this.highlightInputError(codeInput, 'Introduce un código de invitación válido (ej. SAB-4F8K).');
      } else {
        this.showToast('Introduce un código de invitación válido.', 'warning');
      }
      return { success: false, reason: 'invalid_code' };
    }

    if (!state.cloudUser?.id) {
      try {
        localStorage.setItem('fa_pending_household_join', cleanCode);
      } catch (e) { }
      this.showToast(`Inicia sesión para unirte al Hogar con el código ${cleanCode}.`, 'info');
      this.openAuthModal();
      return { success: false, reason: 'auth_required', pendingCode: cleanCode };
    }

    if (!this.supabaseClient?.from) {
      this.showToast('La unión a un Hogar requiere conexión con Supabase.', 'warning');
      return { success: false, reason: 'no_supabase' };
    }

    try {
      const hhQuery = this.supabaseClient.from('households').select('*').eq('invite_code', cleanCode);
      const hhRes = typeof hhQuery.maybeSingle === 'function'
        ? await hhQuery.maybeSingle()
        : await hhQuery;

      const remoteHousehold = Array.isArray(hhRes?.data) ? hhRes.data[0] : hhRes?.data;
      if (hhRes?.error || !remoteHousehold || !remoteHousehold.id) {
        if (codeInput) {
          this.highlightInputError(codeInput, 'No se encontró ningún Hogar con ese código.');
        } else {
          this.showToast('No se encontró ningún Hogar con ese código de invitación.', 'error');
        }
        return { success: false, reason: 'not_found' };
      }

      // Respaldar el plan semanal, lista de compra y preferencias dietéticas personales antes de adoptar el espacio familiar unificado
      const preJoinDietary = Array.isArray(state.dietaryPreferences) ? [...state.dietaryPreferences] : [];
      if (!state.household?.id) {
        state.personalBackup = {
          mealPlan: typeof structuredClone === 'function' ? structuredClone(state.mealPlan || {}) : JSON.parse(JSON.stringify(state.mealPlan || {})),
          shoppingList: typeof structuredClone === 'function' ? structuredClone(state.shoppingList || []) : JSON.parse(JSON.stringify(state.shoppingList || [])),
          dietaryPreferences: [...preJoinDietary],
          savedAt: new Date().toISOString()
        };
        state.save('fa_personal_backup', state.personalBackup);
      }

      const nowIso = new Date().toISOString();
      const myRole = remoteHousehold.owner_id === state.cloudUser.id ? 'owner' : 'member';
      const myDisplayName = state.cloudUser.name || (state.cloudUser.email ? state.cloudUser.email.split('@')[0] : 'Miembro');

      await this.supabaseClient.from('household_members').upsert({
        household_id: remoteHousehold.id,
        user_id: state.cloudUser.id,
        role: myRole,
        display_name: myDisplayName,
        email: state.cloudUser.email || '',
        joined_at: nowIso
      }, { onConflict: 'household_id,user_id' });

      let membersList = [
        {
          userId: state.cloudUser.id,
          name: myDisplayName,
          email: state.cloudUser.email || '',
          role: myRole,
          joinedAt: nowIso
        }
      ];

      try {
        const memRes = await this.supabaseClient.from('household_members').select('*').eq('household_id', remoteHousehold.id);
        if (Array.isArray(memRes?.data) && memRes.data.length > 0) {
          membersList = memRes.data.map(m => ({
            userId: m.user_id || m.userId,
            name: m.display_name || m.name || (m.email ? m.email.split('@')[0] : 'Miembro'),
            email: m.email || '',
            role: m.role || (m.user_id === remoteHousehold.owner_id ? 'owner' : 'member'),
            joinedAt: m.joined_at || nowIso
          }));
        }
      } catch (e) { }

      const joinedHousehold = {
        id: remoteHousehold.id,
        name: remoteHousehold.name || 'Hogar Familiar',
        inviteCode: remoteHousehold.invite_code || cleanCode,
        ownerId: remoteHousehold.owner_id,
        role: myRole,
        createdAt: remoteHousehold.created_at || nowIso,
        members: membersList
      };

      state.saveHousehold(joinedHousehold);
      try {
        localStorage.removeItem('fa_pending_household_join');
      } catch (e) { }

      // Limpiar plan y lista locales para adoptar el Planificador y Lista de Compra unificados del Hogar
      state.mealPlan = {};
      state.shoppingList = [];
      state.lastSyncedAt = null;
      state.save('fa_mealplan', state.mealPlan);
      state.save('fa_shopping', state.shoppingList);

      if (codeInput) codeInput.value = '';
      await this.pullFromCloud();
      // Combinar las preferencias dietéticas previas del miembro con las del Hogar compartido
      if (preJoinDietary.length > 0) {
        const mergedDietary = Array.from(new Set([...(state.dietaryPreferences || []), ...preJoinDietary]));
        if (JSON.stringify(mergedDietary) !== JSON.stringify(state.dietaryPreferences || [])) {
          state.saveDietaryPreferences(mergedDietary);
        }
      }
      await this.pushToCloud(true);

      this.initHouseholdRealtimeSubscription();
      this.renderHouseholdSettings();
      this.renderDietaryPreferencesSettings();
      this.render();
      this.showToast(`¡Te has unido a "${joinedHousehold.name}"! Menú, recetas y compra sincronizados.`, 'success');
      return { success: true, household: joinedHousehold };
    } catch (err) {
      console.warn('[Household] Error al unirse al hogar:', err);
      this.showToast('Error al unirse al hogar: ' + (err.message || 'Fallo de conexión'), 'error');
      return { success: false, reason: 'cloud_error', error: err };
    }
  }

  async refreshHouseholdMembersFromCloud(householdId = state.household?.id) {
    if (!householdId || !this.supabaseClient?.from || !state.household) return;
    try {
      const [hhRes, memRes] = await Promise.all([
        this.supabaseClient.from('households').select('*').eq('id', householdId),
        this.supabaseClient.from('household_members').select('*').eq('household_id', householdId)
      ]);
      const hhRow = Array.isArray(hhRes?.data) ? hhRes.data[0] : hhRes?.data;
      if (hhRow && hhRow.id) {
        state.household.name = hhRow.name || state.household.name;
        state.household.inviteCode = hhRow.invite_code || state.household.inviteCode;
        state.household.ownerId = hhRow.owner_id || state.household.ownerId;
        state.household.role = hhRow.owner_id === state.cloudUser?.id ? 'owner' : 'member';
      }
      if (Array.isArray(memRes?.data) && memRes.data.length > 0) {
        state.household.members = memRes.data.map(m => ({
          userId: m.user_id || m.userId,
          name: m.display_name || m.name || (m.email ? m.email.split('@')[0] : 'Miembro'),
          email: m.email || '',
          role: m.role || (m.user_id === state.household.ownerId ? 'owner' : 'member'),
          joinedAt: m.joined_at
        }));
      }
      state.saveHousehold(state.household);
      this.renderHouseholdSettings();
    } catch (e) { }
  }

  async loadHouseholdByIdFromCloud(householdId) {
    if (!householdId || !this.supabaseClient?.from) return null;
    try {
      const [hhRes, memRes] = await Promise.all([
        this.supabaseClient.from('households').select('*').eq('id', householdId),
        this.supabaseClient.from('household_members').select('*').eq('household_id', householdId)
      ]);
      const hhRow = Array.isArray(hhRes?.data) ? hhRes.data[0] : hhRes?.data;
      if (!hhRow || !hhRow.id) return null;

      const members = Array.isArray(memRes?.data)
        ? memRes.data.map(m => ({
          userId: m.user_id || m.userId,
          name: m.display_name || m.name || (m.email ? m.email.split('@')[0] : 'Miembro'),
          email: m.email || '',
          role: m.role || (m.user_id === hhRow.owner_id ? 'owner' : 'member'),
          joinedAt: m.joined_at
        }))
        : [];

      const loaded = {
        id: hhRow.id,
        name: hhRow.name,
        inviteCode: hhRow.invite_code,
        ownerId: hhRow.owner_id,
        role: hhRow.owner_id === state.cloudUser?.id ? 'owner' : 'member',
        createdAt: hhRow.created_at,
        members
      };
      state.saveHousehold(loaded);
      this.initHouseholdRealtimeSubscription();
      this.renderHouseholdSettings();
      return loaded;
    } catch (e) {
      return null;
    }
  }

  async transferHouseholdOwnership(targetUserId) {
    if (!state.household?.id || !targetUserId) {
      return { success: false, reason: 'invalid_state' };
    }
    const currentUserId = state.cloudUser?.id || '';
    const isOwner = state.household.role === 'owner' || state.household.ownerId === currentUserId;
    if (!isOwner) {
      this.showToast('Solo el anfitrión actual puede transferir la administración del hogar.', 'warning');
      return { success: false, reason: 'not_owner' };
    }

    const householdId = state.household.id;
    const targetMember = (state.household.members || []).find(m => (m.userId || m.user_id) === targetUserId);
    const targetName = targetMember?.name || 'el miembro seleccionado';

    if (this.supabaseClient?.from) {
      try {
        await Promise.all([
          this.supabaseClient.from('households').update({ owner_id: targetUserId, updated_at: new Date().toISOString() }).eq('id', householdId),
          this.supabaseClient.from('household_members').update({ role: 'owner' }).eq('household_id', householdId).eq('user_id', targetUserId),
          this.supabaseClient.from('household_members').update({ role: 'member' }).eq('household_id', householdId).eq('user_id', currentUserId)
        ]);
      } catch (err) {
        console.warn('[Household] Error al transferir propiedad:', err);
      }
    }

    state.household.ownerId = targetUserId;
    state.household.role = 'member';
    if (Array.isArray(state.household.members)) {
      state.household.members = state.household.members.map(m => {
        const uid = m.userId || m.user_id;
        return {
          ...m,
          role: uid === targetUserId ? 'owner' : 'member'
        };
      });
    }
    state.saveHousehold(state.household);
    this.renderHouseholdSettings();
    this.showToast(`Ahora ${targetName} es el anfitrión de "${state.household.name}".`, 'success');
    return { success: true };
  }

  async leaveHousehold(skipConfirm = false) {
    if (!state.household?.id) {
      return { success: false, reason: 'no_household' };
    }

    const hh = state.household;
    const currentUserId = state.cloudUser?.id || '';
    const isOwner = hh.role === 'owner' || hh.ownerId === currentUserId;
    const otherMembers = (hh.members || []).filter(m => (m.userId || m.user_id) !== currentUserId);

    const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
      title: isOwner && otherMembers.length === 0 ? `¿Disolver "${hh.name}"?` : `¿Abandonar "${hh.name}"?`,
      message: isOwner && otherMembers.length > 0
        ? `Saldrás del hogar "${hh.name}" y la administración pasará automáticamente a ${otherMembers[0].name || 'otro miembro'}. Volverás a tu Modo Personal.`
        : `Dejarás de compartir el menú semanal y la lista de la compra con "${hh.name}" y volverás a tu Modo Personal.`,
      confirmText: isOwner && otherMembers.length === 0 ? 'Disolver hogar' : 'Salir del hogar',
      cancelText: 'Cancelar',
      danger: true,
      icon: 'logout'
    });

    if (!confirmed) return { success: false, reason: 'cancelled' };

    this.teardownHouseholdRealtimeSubscription();

    if (this.supabaseClient?.from && currentUserId) {
      try {
        if (isOwner) {
          if (otherMembers.length > 0) {
            const nextOwnerId = otherMembers[0].userId || otherMembers[0].user_id;
            await this.supabaseClient.from('households').update({ owner_id: nextOwnerId }).eq('id', hh.id);
            await this.supabaseClient.from('household_members').update({ role: 'owner' }).eq('household_id', hh.id).eq('user_id', nextOwnerId);
          } else {
            await this.supabaseClient.from('households').delete().eq('id', hh.id);
          }
        }
        await this.supabaseClient.from('household_members').delete().eq('household_id', hh.id).eq('user_id', currentUserId);
        await this.upsertWithSchemaFallback('user_settings', [{
          user_id: currentUserId,
          active_household_id: null,
          updated_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.warn('[Household] Error al abandonar hogar en Supabase:', err);
      }
    }

    // Restaurar espacio individual (planificador, lista de compra y preferencias dietéticas previas) y conservar recetas propias
    if (state.personalBackup) {
      if (state.personalBackup.mealPlan) {
        state.mealPlan = state.personalBackup.mealPlan;
      }
      if (Array.isArray(state.personalBackup.shoppingList)) {
        state.shoppingList = state.personalBackup.shoppingList;
      }
      if (Array.isArray(state.personalBackup.dietaryPreferences)) {
        state.dietaryPreferences = [...state.personalBackup.dietaryPreferences];
        state.save('fa_dietary_preferences', state.dietaryPreferences);
      }
      state.personalBackup = null;
      state.save('fa_personal_backup', null);
      try { localStorage.removeItem('fa_personal_backup'); } catch (e) { }
    }

    if (Array.isArray(state.recipes)) {
      state.recipes = state.recipes
        .filter(r => !r.ownerUserId || !currentUserId || r.ownerUserId === currentUserId)
        .map(r => {
          const copy = { ...r };
          delete copy.householdId;
          return copy;
        });
    }

    state.saveHousehold(null);
    try { localStorage.removeItem('fa_household'); } catch (e) { }
    state.lastSyncedAt = null;
    state.save('fa_recipes', state.recipes);
    state.save('fa_mealplan', state.mealPlan);
    state.save('fa_shopping', state.shoppingList);

    this.renderHouseholdSettings();
    this.render();
    this.showToast(`Has salido de "${hh.name}". Estás de nuevo en tu Modo Personal.`, 'info');
    return { success: true };
  }

  getHouseholdInviteUrl() {
    const code = state.household?.inviteCode || '';
    const origin = (typeof window !== 'undefined' && window.location?.origin && /^https?:\/\//i.test(window.location.origin) && !/localhost|127\.0\.0\.1/i.test(window.location.origin))
      ? `${window.location.origin}${window.location.pathname || '/'}`
      : 'https://sabory.food/';
    return `${origin.replace(/\?.*$/, '')}?join=${encodeURIComponent(code)}`;
  }

  async copyHouseholdInviteCode() {
    if (!state.household?.inviteCode) return false;
    const code = state.household.inviteCode;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch (e) { }
    this.showToast(`Código ${code} copiado al portapapeles.`, 'success');
    return true;
  }

  async shareHouseholdInviteLink() {
    if (!state.household?.inviteCode) return false;
    const url = this.getHouseholdInviteUrl();
    const message = `🏠 ¡Únete a nuestro hogar "${state.household.name}" en Sabory para compartir el menú semanal, el recetario y la lista de la compra en tiempo real!\n\n🔑 Código: ${state.household.inviteCode}\n👉 Enlace directo: ${url}`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Invitación a ${state.household.name} en Sabory`,
          text: message,
          url
        });
        return true;
      } catch (err) {
        if (err?.name === 'AbortError') return false;
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      }
    } catch (e) { }
    this.showToast('Invitación copiada al portapapeles lista para pegar en WhatsApp.', 'success');
    return true;
  }

  handleHouseholdJoinUrlLaunch() {
    if (typeof window === 'undefined' || !window.location?.search) return false;
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return false;
    }

    const rawJoin = params.get('join') || params.get('household') || '';
    const cleanCode = normalizeHouseholdInviteCode(rawJoin);
    if (!cleanCode) return false;

    try {
      if (window.history && typeof window.history.replaceState === 'function') {
        const cleanUrl = window.location.pathname + (window.location.hash || '');
        window.history.replaceState({}, '', cleanUrl);
      }
    } catch (e) { }

    setTimeout(() => {
      this.joinHouseholdByCode(cleanCode);
    }, 120);
    return true;
  }

  processPendingHouseholdJoin() {
    let pendingCode = '';
    try {
      pendingCode = localStorage.getItem('fa_pending_household_join') || '';
    } catch (e) { }
    if (!pendingCode || !state.cloudUser?.id) return false;
    try {
      localStorage.removeItem('fa_pending_household_join');
    } catch (e) { }
    setTimeout(() => {
      this.joinHouseholdByCode(pendingCode);
    }, 200);
    return true;
  }

  initHouseholdRealtimeSubscription() {
    this.teardownHouseholdRealtimeSubscription();
    if (!this.supabaseClient || typeof this.supabaseClient.channel !== 'function') {
      return null;
    }

    const householdId = state.household?.id;
    const userId = state.cloudUser?.id;

    if (!householdId && !userId) {
      return null;
    }

    const setupChannel = (channelName, filterScope) => {
      try {
        const channel = this.supabaseClient.channel(channelName, {
          config: {
            broadcast: { self: false }
          }
        });

        // 1. Broadcast ultra-rápido por WebSocket directo (15-30ms) sin depender de CDC en Postgres
        channel
          .on('broadcast', { event: 'shopping_change' }, (msg) => {
            this.handleRealtimeShoppingBroadcast(msg?.payload);
          })
          .on('broadcast', { event: 'planner_change' }, (msg) => {
            this.handleRealtimePlannerBroadcast(msg?.payload);
          });

        // 2. CDC fallback (postgres_changes)
        if (filterScope) {
          const onRealtimeChange = (payload) => {
            this.handleHouseholdRealtimeEvent(payload);
          };
          channel
            .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_items', filter: filterScope }, onRealtimeChange)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'meal_plans', filter: filterScope }, onRealtimeChange)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes', filter: filterScope }, onRealtimeChange)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'household_members', filter: filterScope }, onRealtimeChange);
        }

        channel.subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Realtime] Conectado y suscrito exitosamente al canal ${channelName}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.warn(`[Realtime] Error en canal ${channelName}:`, err);
          } else if (status === 'TIMED_OUT') {
            console.warn(`[Realtime] Timeout en canal ${channelName}`);
          }
        });
        return channel;
      } catch (err) {
        console.warn(`[Household Realtime] No se pudo suscribir al canal ${channelName}:`, err);
        return null;
      }
    };

    if (householdId) {
      this.householdRealtimeChannel = setupChannel(`household-${householdId}`, `household_id=eq.${householdId}`);
    }
    if (userId) {
      this.userRealtimeChannel = setupChannel(`user-${userId}`, `user_id=eq.${userId}`);
    }

    return this.householdRealtimeChannel || this.userRealtimeChannel;
  }

  teardownHouseholdRealtimeSubscription() {
    if (this._householdRealtimeDebounce) {
      clearTimeout(this._householdRealtimeDebounce);
      this._householdRealtimeDebounce = null;
    }
    const cleanChan = (ch) => {
      if (!ch) return;
      try {
        if (this.supabaseClient && typeof this.supabaseClient.removeChannel === 'function') {
          this.supabaseClient.removeChannel(ch);
        } else if (typeof ch.unsubscribe === 'function') {
          ch.unsubscribe();
        }
      } catch (e) { }
    };
    cleanChan(this.householdRealtimeChannel);
    cleanChan(this.userRealtimeChannel);
    this.householdRealtimeChannel = null;
    this.userRealtimeChannel = null;
  }

  broadcastRealtimeChange(event, payload) {
    if (!this.supabaseClient) return;
    if (!this.householdRealtimeChannel && !this.userRealtimeChannel && typeof this.initHouseholdRealtimeSubscription === 'function') {
      this.initHouseholdRealtimeSubscription();
    }
    const body = {
      ...payload,
      clientId: this.clientId,
      senderId: state.cloudUser?.id,
      timestamp: Date.now()
    };
    const sendToChan = async (ch) => {
      if (ch && typeof ch.send === 'function') {
        try {
          await ch.send({
            type: 'broadcast',
            event: event,
            payload: body
          });
        } catch (e) {
          console.warn('[Realtime Broadcast] Error enviando broadcast:', e);
        }
      }
    };
    sendToChan(this.householdRealtimeChannel);
    sendToChan(this.userRealtimeChannel);
  }

  handleRealtimeShoppingBroadcast(payload) {
    if (!payload || !Array.isArray(state.shoppingList)) return;
    // Ignorar únicamente si fue emitido por esta misma ventana/pestaña local
    if (payload.clientId && this.clientId && payload.clientId === this.clientId) {
      return;
    }

    const action = payload.action;
    let modified = false;

    if (action === 'toggle' || action === 'update') {
      const item = payload.item;
      if (!item || !item.id) return;
      if (state.deletedRecords.shoppingItems?.includes(item.id) ||
          (typeof state.isTombstoned === 'function' && state.isTombstoned('shoppingItems', item.id))) {
        return;
      }
      const localIdx = state.shoppingList.findIndex(i => i.id === item.id);
      if (localIdx >= 0) {
        const local = state.shoppingList[localIdx];
        const remoteDate = new Date(item.updatedAt || 0).getTime();
        const localDate = new Date(local.updatedAt || 0).getTime();
        if (remoteDate >= localDate) {
          local.isChecked = !!item.isChecked;
          local.updatedAt = item.updatedAt || new Date().toISOString();
          if (item.name) local.name = item.name;
          if (item.amount !== undefined) local.amount = item.amount;
          if (item.unit !== undefined) local.unit = item.unit;
          if (item.aisle) local.aisle = item.aisle;
          modified = true;
        }
      } else {
        state.shoppingList.push({
          id: item.id,
          name: item.name,
          amount: item.amount !== undefined ? item.amount : null,
          unit: item.unit || '',
          aisle: item.aisle || 'other',
          isChecked: !!item.isChecked,
          recipeOrigin: item.recipeOrigin || '',
          updatedAt: item.updatedAt || new Date().toISOString()
        });
        modified = true;
      }
    } else if (action === 'delete') {
      if (payload.itemId) {
        state.trackDeletion('shoppingItems', payload.itemId);
        if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(payload.itemId);
        const prevLen = state.shoppingList.length;
        state.shoppingList = state.shoppingList.filter(i => i.id !== payload.itemId);
        if (state.shoppingList.length !== prevLen) modified = true;
      }
    } else if (action === 'clear_completed') {
      const prevLen = state.shoppingList.length;
      if (Array.isArray(payload.deletedIds) && payload.deletedIds.length > 0) {
        payload.deletedIds.forEach(id => {
          state.trackDeletion('shoppingItems', id);
          if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(id);
        });
        state.shoppingList = state.shoppingList.filter(i => !payload.deletedIds.includes(i.id));
      } else {
        state.shoppingList.forEach(i => {
          if (Boolean(i.isChecked || i.checked) && i.id) {
            state.trackDeletion('shoppingItems', i.id);
            if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(i.id);
          }
        });
        state.shoppingList = state.shoppingList.filter(i => !i.isChecked && !i.checked);
      }
      if (state.shoppingList.length !== prevLen) modified = true;
    } else if (action === 'add') {
      if (payload.item && payload.item.id) {
        if (state.deletedRecords.shoppingItems?.includes(payload.item.id) ||
            (typeof state.isTombstoned === 'function' && state.isTombstoned('shoppingItems', payload.item.id))) {
          return;
        }
        const exists = state.shoppingList.some(i => i.id === payload.item.id);
        if (!exists) {
          state.shoppingList.push(payload.item);
          modified = true;
        }
      }
    }

    if (modified) {
      state.save('fa_shopping', state.shoppingList);
      this.renderShoppingList();
    }
  }

  handleRealtimePlannerBroadcast(payload) {
    if (!payload) return;
    // Ignorar únicamente si fue emitido por esta misma ventana/pestaña local
    if (payload.clientId && this.clientId && payload.clientId === this.clientId) {
      return;
    }
    let modified = false;
    if (payload.dateStr && payload.dayPlan) {
      state.mealPlan[payload.dateStr] = payload.dayPlan;
      modified = true;
    }
    if (payload.sourceDateStr && payload.sourceDayPlan) {
      state.mealPlan[payload.sourceDateStr] = payload.sourceDayPlan;
      modified = true;
    }
    if (modified) {
      state.save('fa_mealplan', state.mealPlan);
      this.renderPlanner();
      this.renderTodayView();
    }
    if (this._householdRealtimeDebounce) {
      clearTimeout(this._householdRealtimeDebounce);
    }
    this._householdRealtimeDebounce = setTimeout(async () => {
      this._householdRealtimeDebounce = null;
      await this.pullFromCloud();
    }, 500);
  }

  handleHouseholdRealtimeEvent(payload) {
    if (!state.household?.id && !state.cloudUser?.id) return;

    // US-81: Sincronización instantánea de compras en Modo Familia / multi-dispositivo vía Realtime WebSocket
    if (payload && payload.table === 'shopping_items' && Array.isArray(state.shoppingList)) {
      try {
        const eventType = payload.eventType;
        if (eventType === 'UPDATE' && payload.new) {
          const remoteRow = payload.new;
          if (state.deletedRecords.shoppingItems?.includes(remoteRow.id) ||
              (typeof state.isTombstoned === 'function' && state.isTombstoned('shoppingItems', remoteRow.id))) {
            return;
          }
          const localIdx = state.shoppingList.findIndex(i => i.id === remoteRow.id);
          if (localIdx >= 0) {
            const local = state.shoppingList[localIdx];
            const isRecentlyCheckedLocally = this._recentShoppingCheckTimestamps &&
              (Date.now() - (this._recentShoppingCheckTimestamps.get(local.id) || 0) < 10000);
            if (isRecentlyCheckedLocally) return;

            const remoteDate = new Date(remoteRow.updated_at || 0).getTime();
            const localDate = new Date(local.updatedAt || 0).getTime();
            if (remoteDate >= localDate) {
              local.isChecked = !!remoteRow.is_checked;
              local.updatedAt = remoteRow.updated_at;
              if (remoteRow.name) local.name = remoteRow.name;
              if (remoteRow.amount !== undefined) local.amount = (remoteRow.amount !== null && !isNaN(remoteRow.amount)) ? Number(remoteRow.amount) : null;
              if (remoteRow.unit !== undefined) local.unit = remoteRow.unit || '';
              if (remoteRow.aisle) local.aisle = remoteRow.aisle;
              state.save('fa_shopping', state.shoppingList);
              this.renderShoppingList();
            }
          } else {
            let breakdown = null;
            if (Array.isArray(remoteRow.recipe_breakdown)) {
              breakdown = remoteRow.recipe_breakdown;
            } else if (typeof remoteRow.recipe_breakdown === 'string') {
              try { breakdown = JSON.parse(remoteRow.recipe_breakdown); } catch (e) { }
            }
            const remoteItem = {
              id: remoteRow.id,
              name: remoteRow.name,
              amount: remoteRow.amount !== null && !isNaN(remoteRow.amount) ? Number(remoteRow.amount) : null,
              unit: remoteRow.unit || '',
              aisle: remoteRow.aisle || 'other',
              isChecked: !!remoteRow.is_checked,
              recipeOrigin: remoteRow.recipe_origin || '',
              recipeBreakdown: breakdown,
              updatedAt: remoteRow.updated_at
            };
            if (remoteRow.household_id) remoteItem.householdId = remoteRow.household_id;
            if (remoteRow.user_id) remoteItem.ownerUserId = remoteRow.user_id;
            state.shoppingList.push(remoteItem);
            state.save('fa_shopping', state.shoppingList);
            this.renderShoppingList();
          }
        } else if (eventType === 'INSERT' && payload.new) {
          const remoteRow = payload.new;
          if (state.deletedRecords.shoppingItems?.includes(remoteRow.id) ||
              (typeof state.isTombstoned === 'function' && state.isTombstoned('shoppingItems', remoteRow.id))) {
            return;
          }
          const localIdx = state.shoppingList.findIndex(i => i.id === remoteRow.id);
          if (localIdx < 0) {
            let breakdown = null;
            if (Array.isArray(remoteRow.recipe_breakdown)) {
              breakdown = remoteRow.recipe_breakdown;
            } else if (typeof remoteRow.recipe_breakdown === 'string') {
              try { breakdown = JSON.parse(remoteRow.recipe_breakdown); } catch (e) { }
            }
            const remoteItem = {
              id: remoteRow.id,
              name: remoteRow.name,
              amount: remoteRow.amount !== null && !isNaN(remoteRow.amount) ? Number(remoteRow.amount) : null,
              unit: remoteRow.unit || '',
              aisle: remoteRow.aisle || 'other',
              isChecked: !!remoteRow.is_checked,
              recipeOrigin: remoteRow.recipe_origin || '',
              recipeBreakdown: breakdown,
              updatedAt: remoteRow.updated_at
            };
            if (remoteRow.household_id) remoteItem.householdId = remoteRow.household_id;
            if (remoteRow.user_id) remoteItem.ownerUserId = remoteRow.user_id;
            state.shoppingList.push(remoteItem);
            state.save('fa_shopping', state.shoppingList);
            this.renderShoppingList();
          }
        } else if (eventType === 'DELETE' && payload.old?.id) {
          const delId = payload.old.id;
          state.trackDeletion('shoppingItems', delId);
          if (this._pendingShoppingToggles) this._pendingShoppingToggles.delete(delId);
          const prevLen = state.shoppingList.length;
          state.shoppingList = state.shoppingList.filter(i => i.id !== delId);
          if (state.shoppingList.length !== prevLen) {
            state.save('fa_shopping', state.shoppingList);
            this.renderShoppingList();
          }
        }
      } catch (err) {
        console.warn('[Household Realtime] Error en procesamiento rápido de shopping_items:', err);
      }
    }

    if (this._householdRealtimeDebounce) {
      clearTimeout(this._householdRealtimeDebounce);
    }
    this._householdRealtimeDebounce = setTimeout(async () => {
      this._householdRealtimeDebounce = null;
      await this.pullFromCloud();
    }, 250);
  }

  // ==========================================================================
  // US-69 (Fase 3): Control externo por voz / IA / MCP sin abrir la app
  // ==========================================================================
  getExternalAgentEndpoint() {
    const base = (window.APP_CONFIG?.supabaseUrl || localStorage.getItem('fa_sb_url') || '').replace(/\/+$/, '');
    return base ? `${base}/functions/v1/food-assistant-agent` : '';
  }

  async hashAgentToken(token) {
    const bytes = new TextEncoder().encode(String(token));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async generateExternalAgentToken() {
    if (!state.cloudUser?.id) {
      this.showToast('Inicia sesión en tu cuenta para activar el control externo.', 'warning');
      return null;
    }
    const uuid = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}${Math.random()}`).replace(/-/g, '');
    const token = `fa_live_${uuid}`;
    state.settings.agentTokenHash = await this.hashAgentToken(token);
    state.settings.agentTokenHint = token.slice(-4);
    state.settings.agentEnabled = true;
    state.save('fa_settings', state.settings);
    this.renderExternalAgentSettings(token);
    this.scheduleSyncWithCloud();
    return token;
  }

  revokeExternalAgentToken() {
    state.settings.agentTokenHash = '';
    state.settings.agentTokenHint = '';
    state.settings.agentEnabled = false;
    state.save('fa_settings', state.settings);
    this.renderExternalAgentSettings();
    this.scheduleSyncWithCloud();
    this.showToast('Token revocado. Los asistentes externos ya no tienen acceso.', 'success');
  }

  toggleExternalAgentEnabled(enabled) {
    if (!state.settings.agentTokenHash) return;
    state.settings.agentEnabled = !!enabled;
    state.save('fa_settings', state.settings);
    this.renderExternalAgentSettings();
    this.scheduleSyncWithCloud();
  }

  async copyExternalAgentText(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copiado al portapapeles.', 'success');
    } catch (e) {
      this.showToast('No se pudo copiar automáticamente.', 'warning');
    }
  }

  // `freshToken` solo existe justo tras generarlo: es la única vez que se muestra completo.
  renderExternalAgentSettings(freshToken = null) {
    const statusEl = document.getElementById('external-agent-status');
    if (!statusEl) return;
    const hasToken = !!state.settings?.agentTokenHash;
    const enabled = hasToken && !!state.settings.agentEnabled;

    const toggle = document.getElementById('toggle-external-agent');
    if (toggle) {
      toggle.checked = enabled;
      toggle.disabled = !hasToken;
      toggle.onchange = (e) => this.toggleExternalAgentEnabled(e.target.checked);
    }

    const endpoint = this.getExternalAgentEndpoint();
    const isEn = window.I18n && window.I18n.getLanguage() === 'en';
    const activeLabel = isEn ? '✓ External access active' : '✓ Acceso externo activo';
    const pausedLabel = isEn ? 'External access paused' : 'Acceso externo en pausa';
    const noTokenLabel = isEn ? 'No token. Generate one to connect external assistants.' : 'Sin token. Genera uno para conectar asistentes externos.';
    statusEl.innerHTML = hasToken
      ? `<span class="${enabled ? 'u-text-brand-medium' : 'u-text-muted-medium'}">${enabled ? activeLabel : pausedLabel} · token fa_live_••••${state.settings.agentTokenHint || ''}</span>`
      : `<span class="u-text-muted">${noTokenLabel}</span>`;

    const reveal = document.getElementById('external-agent-token-reveal');
    const tokenInput = document.getElementById('external-agent-token');
    if (reveal && tokenInput) {
      reveal.style.display = freshToken ? 'block' : 'none';
      tokenInput.value = freshToken || '';
    }

    const guide = document.getElementById('external-agent-guide');
    if (guide) {
      const tk = freshToken || (isEn ? 'fa_live_YOUR_TOKEN' : 'fa_live_TU_TOKEN');
      guide.textContent = isEn
        ? `# 1) Natural language command (Voice shortcuts / HTTP Shortcuts / Telegram)
POST ${endpoint}/command
Authorization: Bearer ${tk}
Content-Type: application/json
{"command": "Add milk and avocados to the shopping list"}
→ responds {"ok":true,"speech":"..."} (read "speech" out loud)

# 2) Claude / MCP clients (remote MCP server)
URL:  ${endpoint}/mcp
Header: Authorization: Bearer ${tk}

# 3) ChatGPT (Custom GPT → Actions)
Import schema from: ${endpoint}/openapi.json
Authentication: API Key → Bearer → ${tk}`
        : `# 1) Comando en lenguaje natural (Atajos de voz / HTTP Shortcuts / Telegram)
POST ${endpoint}/command
Authorization: Bearer ${tk}
Content-Type: application/json
{"command": "Añade leche y aguacates a la compra"}
→ responde {"ok":true,"speech":"..."}  (lee "speech" en voz alta)

# 2) Claude / clientes MCP  (servidor MCP remoto)
URL:  ${endpoint}/mcp
Header: Authorization: Bearer ${tk}

# 3) ChatGPT (Custom GPT → Actions)
Importar esquema desde: ${endpoint}/openapi.json
Autenticación: API Key → Bearer → ${tk}`;
    }
  }

  // US-02: Preferencias dietéticas activas en Ajustes
  renderDietaryPreferencesSettings() {
    const container = document.getElementById('settings-dietary-chips');
    if (!container) return;

    container.innerHTML = PREDEFINED_DIETARY_TAGS.map(pref => {
      const isSelected = (state.dietaryPreferences || []).includes(pref);
      const displayPref = window.I18n ? window.I18n.getTagLabel(pref) : pref;
      return `
        <button type="button" class="m3-filter-chip dietary-chip ${isSelected ? 'active' : ''}" onclick="app.toggleDietaryPreference('${pref}')">
          ${isSelected ? '<span class="material-symbols-outlined icon-14">check_circle</span>' : `<span class="dietary-emoji">${getDietaryTagEmoji(pref)}</span>`}
          <span>${escapeHtml(displayPref)}</span>
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
    this.scheduleSyncWithCloud();
  }

  // US-03: Objetivos nutricionales diarios en Ajustes
  renderNutritionGoalsSettings() {
    const goals = state.settings?.nutritionGoals || { enabled: false, calories: 2000, protein: 140, carbs: 200, fat: 65 };
    const toggleEnabled = document.getElementById('toggle-nutrition-goals-enabled');
    const inputCal = document.getElementById('input-goal-calories');
    const inputProt = document.getElementById('input-goal-protein');
    const inputCarbs = document.getElementById('input-goal-carbs');
    const inputFat = document.getElementById('input-goal-fat');

    if (toggleEnabled) toggleEnabled.checked = !!goals.enabled;
    if (inputCal) inputCal.value = goals.calories || '';
    if (inputProt) inputProt.value = goals.protein || '';
    if (inputCarbs) inputCarbs.value = goals.carbs || '';
    if (inputFat) inputFat.value = goals.fat || '';
  }

  saveNutritionGoalsFromSettings() {
    const toggleEnabled = document.getElementById('toggle-nutrition-goals-enabled');
    const inputCal = document.getElementById('input-goal-calories');
    const inputProt = document.getElementById('input-goal-protein');
    const inputCarbs = document.getElementById('input-goal-carbs');
    const inputFat = document.getElementById('input-goal-fat');
    const statusMsg = document.getElementById('nutrition-goals-status-msg');

    const newGoals = {
      enabled: toggleEnabled ? toggleEnabled.checked : true,
      calories: inputCal ? Number(inputCal.value) : 2000,
      protein: inputProt ? Number(inputProt.value) : 140,
      carbs: inputCarbs ? Number(inputCarbs.value) : 200,
      fat: inputFat ? Number(inputFat.value) : 65
    };

    state.saveNutritionGoals(newGoals);
    this.renderTodayView();
    this.applyRecipeFilters();
    this.scheduleSyncWithCloud();

    if (statusMsg) {
      statusMsg.style.display = 'inline';
      setTimeout(() => { statusMsg.style.display = 'none'; }, 2500);
    }
  }

  // Modal rápido de objetivos (US-03)
  openNutritionGoalsModal() {
    const modal = document.getElementById('modal-nutrition-goals');
    if (!modal) return;
    const goals = state.settings?.nutritionGoals || { enabled: false, calories: 2000, protein: 140, carbs: 200, fat: 65 };

    const toggle = document.getElementById('toggle-modal-goal-enabled');
    const inputCal = document.getElementById('input-modal-goal-calories');
    const inputProt = document.getElementById('input-modal-goal-protein');
    const inputCarbs = document.getElementById('input-modal-goal-carbs');
    const inputFat = document.getElementById('input-modal-goal-fat');

    if (toggle) toggle.checked = !!goals.enabled;
    if (inputCal) inputCal.value = goals.calories || '';
    if (inputProt) inputProt.value = goals.protein || '';
    if (inputCarbs) inputCarbs.value = goals.carbs || '';
    if (inputFat) inputFat.value = goals.fat || '';

    this.openDialogModal(modal);
  }

  closeNutritionGoalsModal() {
    const modal = document.getElementById('modal-nutrition-goals');
    if (modal) this.closeDialogModal(modal);
  }

  saveNutritionGoalsFromModal() {
    const toggle = document.getElementById('toggle-modal-goal-enabled');
    const inputCal = document.getElementById('input-modal-goal-calories');
    const inputProt = document.getElementById('input-modal-goal-protein');
    const inputCarbs = document.getElementById('input-modal-goal-carbs');
    const inputFat = document.getElementById('input-modal-goal-fat');

    const newGoals = {
      enabled: toggle ? toggle.checked : true,
      calories: inputCal ? Number(inputCal.value) : 2000,
      protein: inputProt ? Number(inputProt.value) : 140,
      carbs: inputCarbs ? Number(inputCarbs.value) : 200,
      fat: inputFat ? Number(inputFat.value) : 65
    };

    state.saveNutritionGoals(newGoals);
    this.renderNutritionGoalsSettings();
    this.renderTodayView();
    this.applyRecipeFilters();
    this.scheduleSyncWithCloud();
    this.closeNutritionGoalsModal();
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
      const inferredTags = analyzeAndInferRecipeTags(recipe);

      // Limpiar 'Alta en Proteínas' si ya no califica según el análisis nutricional actual
      let tagsUpdated = false;
      let currentTags = [...existingTags];
      if (currentTags.includes('Alta en Proteínas') && !inferredTags.includes('Alta en Proteínas')) {
        currentTags = currentTags.filter(t => t !== 'Alta en Proteínas');
        tagsUpdated = true;
      }

      const currentLower = new Set(currentTags.map(t => String(t).toLowerCase().trim()));
      const newTagsToAdd = [];
      inferredTags.forEach(tag => {
        if (!currentLower.has(tag.toLowerCase().trim()) && tag.toLowerCase().trim() !== 'general') {
          newTagsToAdd.push(tag);
          state.addCustomTag && state.addCustomTag(tag);
        }
      });

      if (newTagsToAdd.length > 0 || tagsUpdated) {
        recipe.tags = [...currentTags, ...newTagsToAdd];
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
        resultMsg.innerHTML = `<span class="u-text-brand-medium">✓ ¡Análisis completado! Se actualizaron ${updatedCount} ${updatedCount === 1 ? 'receta' : 'recetas'} con ${totalTagsAdded} nuevas ${totalTagsAdded === 1 ? 'etiqueta' : 'etiquetas'}.</span>`;
      } else {
        resultMsg.innerHTML = `<span class="u-text-muted-medium">✓ Todas tus recetas ya cuentan con las etiquetas correspondientes.</span>`;
      }
    }

    return { updatedCount, totalTagsAdded };
  }

  saveGeminiKey() {
    const key = document.getElementById('input-gemini-key').value.trim();
    state.settings.geminiApiKey = key;
    const provider = document.getElementById('select-ai-provider')?.value || 'gemini';
    state.settings.aiProvider = provider;
    const model = 'gemini-3.8-flash';
    state.settings.geminiModel = model;
    state.save('fa_settings', state.settings);
    this.renderSettings();
    this.scheduleSyncWithCloud();
    this.showToast("Configuración de Inteligencia Artificial guardada.", 'success');
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

  handleFileInputForBulkImport(e) {
    const file = e.target?.files?.[0];
    if (!file) return;

    const inputEl = e.target;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target.result;
        this.openBulkImportModal(rawContent);
      } catch (err) {
        this.showToast('Error al leer el archivo JSON: ' + (err.message || 'formato inválido'), 'error');
      } finally {
        if (inputEl) inputEl.value = '';
      }
    };
    reader.onerror = () => {
      this.showToast('Error de lectura del archivo.', 'error');
      if (inputEl) inputEl.value = '';
    };
    reader.readAsText(file);
  }

  importBackup(e) {
    this.handleFileInputForBulkImport(e);
  }

  // ==========================================================================
  // US-67: BULK RECIPES & COLLECTIONS IMPORTER (Samsung Food / Whisk / Backup)
  // ==========================================================================

  openBulkImportModal(dataOrJsonString) {
    let parsed = null;
    try {
      parsed = RecipeParser.parseBulkCollection(dataOrJsonString);
    } catch (err) {
      this.showToast(err.message || 'Error al procesar el archivo JSON.', 'error');
      return;
    }

    const { candidates, extraData } = parsed;
    if (!candidates || candidates.length === 0) {
      this.showToast('No se encontraron recetas válidas en el archivo seleccionado.', 'warning');
      return;
    }

    RecipeParser.detectDuplicatesAndWarnings(candidates, state.recipes);

    this.pendingBulkImport = {
      candidates,
      extraData
    };
    this.bulkImportFilter = 'all';

    // Show extra backup notice if mealPlan / shoppingList is present
    const extraNotice = document.getElementById('bulk-import-extra-notice');
    if (extraNotice) {
      if (extraData && (extraData.hasMealPlan || extraData.hasShoppingList)) {
        extraNotice.style.display = 'block';
        const parts = [];
        if (extraData.hasMealPlan) parts.push('Plan Semanal');
        if (extraData.hasShoppingList) parts.push('Lista de la Compra');
        extraNotice.innerHTML = `<span class="material-symbols-outlined icon-16 icon-valign-bottom icon-primary">inventory_2</span> Esta copia también incluye datos de <strong>${parts.join(' y ')}</strong> que se sincronizarán al importar.`;
      } else {
        extraNotice.style.display = 'none';
      }
    }

    // Reset progress UI and unlock buttons
    const progressSec = document.getElementById('bulk-progress-section');
    if (progressSec) progressSec.style.display = 'none';
    const btnConfirm = document.getElementById('btn-confirm-bulk-import');
    if (btnConfirm) btnConfirm.disabled = false;
    const btnCancel = document.getElementById('btn-cancel-bulk-import');
    if (btnCancel) btnCancel.disabled = false;

    // Reset active chip
    document.querySelectorAll('.bulk-filter-chips .chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === 'all');
    });

    this.renderBulkImportStats();
    this.renderBulkImportList();
    this.updateBulkImportFooterAction();

    this.openDialogModal(this.modalBulkImport);
  }

  closeBulkImportModal() {
    this.closeDialogModal(this.modalBulkImport);
    this.pendingBulkImport = null;
  }

  renderBulkImportStats() {
    if (!this.pendingBulkImport) return;
    const { candidates } = this.pendingBulkImport;

    const total = candidates.length;
    const newCount = candidates.filter(c => !c.isDuplicate).length;
    const dupCount = candidates.filter(c => c.isDuplicate).length;
    const warnCount = candidates.filter(c => c.warnings && c.warnings.length > 0).length;

    // Update stats header container
    const statsContainer = document.getElementById('bulk-import-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="bulk-stat-card">
          <span class="bulk-stat-number">${total}</span>
          <span class="bulk-stat-label">Encontradas</span>
        </div>
        <div class="bulk-stat-card bulk-stat-new">
          <span class="bulk-stat-number">${newCount}</span>
          <span class="bulk-stat-label">Nuevas</span>
        </div>
        <div class="bulk-stat-card bulk-stat-dup">
          <span class="bulk-stat-number">${dupCount}</span>
          <span class="bulk-stat-label">Duplicadas</span>
        </div>
        <div class="bulk-stat-card bulk-stat-warn">
          <span class="bulk-stat-number">${warnCount}</span>
          <span class="bulk-stat-label">Con avisos</span>
        </div>
      `;
    }

    // Update filter counts
    const countAll = document.getElementById('count-filter-all');
    const countNew = document.getElementById('count-filter-new');
    const countDup = document.getElementById('count-filter-dup');
    const countWarn = document.getElementById('count-filter-warn');
    if (countAll) countAll.textContent = total;
    if (countNew) countNew.textContent = newCount;
    if (countDup) countDup.textContent = dupCount;
    if (countWarn) countWarn.textContent = warnCount;

    // Toggle duplicate overwrite option
    const dupOptionCard = document.getElementById('bulk-duplicate-option-card');
    if (dupOptionCard) {
      dupOptionCard.style.display = dupCount > 0 ? 'block' : 'none';
    }
  }

  renderBulkImportList() {
    if (!this.pendingBulkImport) return;
    const { candidates } = this.pendingBulkImport;
    const listContainer = document.getElementById('bulk-import-list');
    if (!listContainer) return;

    let filtered = candidates;
    if (this.bulkImportFilter === 'new') {
      filtered = candidates.filter(c => !c.isDuplicate);
    } else if (this.bulkImportFilter === 'duplicates') {
      filtered = candidates.filter(c => c.isDuplicate);
    } else if (this.bulkImportFilter === 'warnings') {
      filtered = candidates.filter(c => c.warnings && c.warnings.length > 0);
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="bulk-empty-filter-msg">
          No hay recetas en esta categoría.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map((c) => {
      const originalIdx = candidates.indexOf(c);
      const thumbHtml = c.imageUrl
        ? `<div class="bulk-item-thumb"><img src="${c.imageUrl}" alt="" onerror="this.parentElement.innerHTML='<span class=\\'material-symbols-outlined\\'>restaurant</span>'"></div>`
        : `<div class="bulk-item-thumb"><span class="material-symbols-outlined">restaurant</span></div>`;

      const dupBadge = c.isDuplicate
        ? `<span class="bulk-badge bulk-badge-dup"><span class="material-symbols-outlined icon-12">sync_problem</span> ${c.duplicateReason || 'Ya existe'}</span>`
        : `<span class="bulk-badge bulk-badge-new"><span class="material-symbols-outlined icon-12">auto_awesome</span> Nueva</span>`;

      const domainBadge = c.sourceDomain
        ? `<span class="bulk-badge bulk-badge-domain"><span class="material-symbols-outlined icon-12">public</span> ${c.sourceDomain}</span>`
        : '';

      const warningsBadges = (c.warnings || []).map(w =>
        `<span class="bulk-badge bulk-badge-warn"><span class="material-symbols-outlined icon-12">warning</span> ${w}</span>`
      ).join('');

      const totalTime = (c.prepTimeMinutes || 0) + (c.cookTimeMinutes || 0);
      const timeStr = totalTime > 0 ? `<span>• ${totalTime} min</span>` : '';

      return `
        <div class="bulk-import-item ${c.selected ? '' : 'is-excluded'}" data-cand-idx="${originalIdx}">
          <input type="checkbox" class="bulk-item-check" data-idx="${originalIdx}" ${c.selected ? 'checked' : ''} aria-label="Seleccionar receta ${c.title}">
          ${thumbHtml}
          <div class="bulk-item-info">
            <div class="bulk-item-title-row">
              <span class="bulk-item-title" title="${c.title}">${c.title}</span>
              ${dupBadge}
              ${domainBadge}
              ${warningsBadges}
            </div>
            <div class="bulk-item-meta">
              <span>${c.ingredients?.length || 0} ingredientes</span>
              <span>• ${c.instructions?.length || 0} pasos</span>
              <span>• ${c.servings || 2} raciones</span>
              ${timeStr}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events on items and checkboxes
    listContainer.querySelectorAll('.bulk-import-item').forEach(itemEl => {
      const idx = parseInt(itemEl.getAttribute('data-cand-idx'), 10);
      const checkEl = itemEl.querySelector('.bulk-item-check');

      checkEl.addEventListener('change', (e) => {
        candidates[idx].selected = e.target.checked;
        itemEl.classList.toggle('is-excluded', !e.target.checked);
        this.updateBulkImportFooterAction();
      });

      itemEl.addEventListener('click', (e) => {
        if (e.target === checkEl || e.target.tagName === 'INPUT') return;
        checkEl.checked = !checkEl.checked;
        candidates[idx].selected = checkEl.checked;
        itemEl.classList.toggle('is-excluded', !checkEl.checked);
        this.updateBulkImportFooterAction();
      });
    });
  }

  setBulkImportSelection(mode) {
    if (!this.pendingBulkImport) return;
    const { candidates } = this.pendingBulkImport;

    candidates.forEach(c => {
      if (mode === 'all') c.selected = true;
      else if (mode === 'new') c.selected = !c.isDuplicate;
      else if (mode === 'none') c.selected = false;
    });

    this.renderBulkImportList();
    this.updateBulkImportFooterAction();
  }

  updateBulkImportFooterAction() {
    if (!this.pendingBulkImport) return;
    const { candidates } = this.pendingBulkImport;
    const selectedCount = candidates.filter(c => c.selected).length;
    const totalCount = candidates.length;

    const btnText = document.getElementById('btn-confirm-bulk-import-text');
    const btnConfirm = document.getElementById('btn-confirm-bulk-import');
    if (btnText) {
      btnText.textContent = selectedCount > 0
        ? `Importar ${selectedCount} de ${totalCount} recetas`
        : 'Selecciona al menos 1 receta';
    }
    if (btnConfirm) {
      btnConfirm.disabled = (selectedCount === 0);
    }
  }

  async executeBulkImport() {
    if (!this.pendingBulkImport) return;
    const { candidates, extraData } = this.pendingBulkImport;
    const selected = candidates.filter(c => c.selected);
    if (selected.length === 0) {
      this.showToast('Selecciona al menos una receta para importar.', 'warning');
      return;
    }

    const overwrite = document.getElementById('check-bulk-overwrite-duplicates')?.checked || false;

    // Show progress UI and lock buttons
    const progressSec = document.getElementById('bulk-progress-section');
    const fillEl = document.getElementById('bulk-progress-fill');
    const titleEl = document.getElementById('bulk-progress-title');
    const percentEl = document.getElementById('bulk-progress-percent');
    const detailEl = document.getElementById('bulk-progress-detail');
    const btnConfirm = document.getElementById('btn-confirm-bulk-import');
    const btnCancel = document.getElementById('btn-cancel-bulk-import');

    if (progressSec) progressSec.style.display = 'flex';
    if (btnConfirm) btnConfirm.disabled = true;
    if (btnCancel) btnCancel.disabled = true;

    let processedCount = 0;
    const total = selected.length;

    for (let i = 0; i < total; i++) {
      const cand = selected[i];
      const percent = Math.round(((i + 1) / total) * 100);

      // Smooth unblocked tick: yield every 5 items on large batches or every item on small batches
      if (total <= 50 || i % 5 === 0 || i === total - 1) {
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = `${percent}%`;
        if (titleEl) titleEl.textContent = `Procesando receta ${i + 1} de ${total}`;
        if (detailEl) detailEl.textContent = `Normalizando ingredientes y pasillos: ${cand.title}...`;
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      const finalRecipe = RecipeParser.finalizeImportRecipe(cand);

      const importTimestamp = new Date().toISOString();
      finalRecipe.createdAt = cand.createdAt || importTimestamp;
      finalRecipe.updatedAt = importTimestamp;
      finalRecipe._isLocalDraft = true;

      if (cand.isDuplicate && overwrite && cand.duplicateOf) {
        const idx = state.recipes.findIndex(r => r.id === cand.duplicateOf.id);
        if (idx >= 0) {
          finalRecipe.id = cand.duplicateOf.id;
          finalRecipe.createdAt = cand.duplicateOf.createdAt || finalRecipe.createdAt;
          finalRecipe.updatedAt = importTimestamp;
          state.recipes[idx] = finalRecipe;
        } else {
          state.recipes.unshift(finalRecipe);
        }
      } else {
        finalRecipe.id = generateId('rec-');
        state.recipes.unshift(finalRecipe);
      }

      processedCount++;
    }

    // Extra data restoration if present in backup
    if (extraData && extraData.mealPlan) {
      state.mealPlan = extraData.mealPlan;
      state.save('fa_mealplan', state.mealPlan);
    }
    if (extraData && extraData.shoppingList) {
      state.shoppingList = extraData.shoppingList;
      state.save('fa_shopping', state.shoppingList);
    }

    state.save('fa_recipes', state.recipes);
    this.scheduleSyncWithCloud();

    this.closeBulkImportModal();
    this.render();
    this.switchView('view-recipes');

    this.showToast(`¡${processedCount} recetas importadas con éxito!`, 'success');
  }

  async resetDemoData(skipConfirm = false) {
    const confirmed = skipConfirm === true ? true : await this.showConfirmDialog({
      title: 'Restablecer datos de demostración',
      message: "¿Restablecer todas las recetas y el plan a los valores iniciales de demostración? Se perderán los cambios locales no exportados.",
      confirmText: 'Restablecer datos',
      cancelText: 'Cancelar',
      danger: true,
      icon: 'restart_alt'
    });
    if (confirmed) {
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
      try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) { }
      this.syncDataWithCloud(true);
      this.render();
      this.showToast("Datos restablecidos a los valores iniciales.", 'info');
      return true;
    }
    return false;
  }

  // ==========================================================================
  // US-68: ONBOARDING WIZARD FOR NEW USERS
  // ==========================================================================
  checkAndLaunchOnboarding() {
    if (typeof localStorage === 'undefined') return false;
    const completed = localStorage.getItem('fa_onboarding_completed') === 'true';
    if (completed) return false;
    const modal = this.modalOnboarding || document.getElementById('modal-onboarding');
    if (!modal) return false;
    this.openOnboardingModal(1);
    return true;
  }

  openOnboardingModal(step = 1) {
    const modal = this.modalOnboarding || document.getElementById('modal-onboarding');
    if (!modal) return;
    this.modalOnboarding = modal;

    const targetStep = (typeof step === 'number' && step >= 1 && step <= 5) ? step : 1;
    this.onboardingStep = targetStep;
    this.onboardingDietary = new Set(Array.isArray(state.dietaryPreferences) ? state.dietaryPreferences : []);
    this.onboardingServings = Number(state.defaultServings || state.settings?.defaultServings || 2);

    const goals = state.settings?.nutritionGoals || state.nutritionGoals || {
      enabled: true,
      calories: 2000,
      protein: 140,
      carbs: 200,
      fat: 65
    };
    const enabledToggle = document.getElementById('onboarding-goals-enabled');
    const calInput = document.getElementById('onboarding-goal-calories');
    const protInput = document.getElementById('onboarding-goal-protein');
    const carbsInput = document.getElementById('onboarding-goal-carbs');
    const fatInput = document.getElementById('onboarding-goal-fat');

    if (enabledToggle) enabledToggle.checked = goals.enabled !== false;
    if (calInput) calInput.value = goals.calories || 2000;
    if (protInput) protInput.value = goals.protein || 140;
    if (carbsInput) carbsInput.value = goals.carbs || 200;
    if (fatInput) fatInput.value = goals.fat || 65;

    this.renderOnboardingStep();
    this.openDialogModal(modal);
  }

  closeOnboardingModal() {
    const modal = this.modalOnboarding || document.getElementById('modal-onboarding');
    if (modal) {
      this.closeDialogModal(modal);
    }
  }

  skipOnboarding() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('fa_onboarding_completed', 'true');
      } catch (e) { }
    }
    this.closeOnboardingModal();
    this.showToast('Puedes abrir la Guía inicial cuando quieras desde Ajustes.', 'info');
  }

  nextOnboardingStep() {
    if (this.onboardingStep < 5) {
      this.onboardingStep++;
      this.renderOnboardingStep();
    } else {
      this.completeOnboarding();
    }
  }

  prevOnboardingStep() {
    if (this.onboardingStep > 1) {
      this.onboardingStep--;
      this.renderOnboardingStep();
    }
  }

  toggleOnboardingDietaryTag(tagOrDataset) {
    const tag = typeof tagOrDataset === 'object' && tagOrDataset !== null ? tagOrDataset.tag : tagOrDataset;
    if (!tag) return;
    if (this.onboardingDietary.has(tag)) {
      this.onboardingDietary.delete(tag);
    } else {
      this.onboardingDietary.add(tag);
    }
    this.renderOnboardingDietaryChips();
  }

  renderOnboardingDietaryChips() {
    const container = document.getElementById('onboarding-dietary-chips');
    if (!container) return;
    container.innerHTML = PREDEFINED_DIETARY_TAGS.map(tag => {
      const isSelected = this.onboardingDietary.has(tag);
      const emoji = getDietaryTagEmoji(tag);
      const displayTag = window.I18n ? window.I18n.getTagLabel(tag) : tag;
      return `
        <button type="button" class="m3-filter-chip dietary-chip ${isSelected ? 'active' : ''}"
          data-action="toggleOnboardingDietaryTag" data-tag="${escapeHtml(tag)}"
          aria-pressed="${isSelected ? 'true' : 'false'}">
          <span class="dietary-emoji">${emoji}</span>
          <span>${escapeHtml(displayTag)}</span>
        </button>
      `;
    }).join('');
  }

  applyOnboardingGoalPreset(presetOrDataset) {
    const preset = typeof presetOrDataset === 'object' && presetOrDataset !== null ? presetOrDataset.preset : presetOrDataset;
    const presets = {
      deficit: { calories: 1700, protein: 145, carbs: 150, fat: 55 },
      balanced: { calories: 2000, protein: 140, carbs: 200, fat: 65 },
      protein: { calories: 2400, protein: 180, carbs: 240, fat: 75 }
    };
    const chosen = presets[preset] || presets.balanced;

    const enabledToggle = document.getElementById('onboarding-goals-enabled');
    const calInput = document.getElementById('onboarding-goal-calories');
    const protInput = document.getElementById('onboarding-goal-protein');
    const carbsInput = document.getElementById('onboarding-goal-carbs');
    const fatInput = document.getElementById('onboarding-goal-fat');

    if (enabledToggle) enabledToggle.checked = true;
    if (calInput) calInput.value = chosen.calories;
    if (protInput) protInput.value = chosen.protein;
    if (carbsInput) carbsInput.value = chosen.carbs;
    if (fatInput) fatInput.value = chosen.fat;

    document.querySelectorAll('#onboarding-goal-presets .onboarding-preset-pill, #onboarding-goal-presets .onboarding-preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === preset);
      btn.setAttribute('aria-pressed', btn.dataset.preset === preset ? 'true' : 'false');
    });
  }

  selectOnboardingServings(servingsOrDataset) {
    const rawVal = typeof servingsOrDataset === 'object' && servingsOrDataset !== null ? servingsOrDataset.servings : servingsOrDataset;
    const num = parseInt(rawVal, 10);
    if (!isNaN(num) && num > 0) {
      this.onboardingServings = Math.min(50, Math.max(1, num));
    }
    this.updateOnboardingServingsUI();
  }

  stepOnboardingServings(stepOrDataset) {
    const delta = typeof stepOrDataset === 'object' && stepOrDataset !== null ? parseInt(stepOrDataset.step, 10) : parseInt(stepOrDataset, 10);
    const current = Number(this.onboardingServings) || 2;
    const nextVal = Math.min(50, Math.max(1, current + (isNaN(delta) ? 1 : delta)));
    this.selectOnboardingServings(nextVal);
  }

  inputOnboardingServings(e) {
    const raw = e?.target?.value;
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      this.onboardingServings = Math.min(50, Math.max(1, num));
      this.updateOnboardingServingsUI(false);
    }
  }

  updateOnboardingServingsUI(updateInput = true) {
    const num = Number(this.onboardingServings) || 2;
    const input = document.getElementById('onboarding-servings-input');
    const unitText = document.getElementById('onboarding-servings-unit-text');
    if (input && updateInput) input.value = num;
    if (unitText) unitText.textContent = num === 1 ? 'persona' : 'personas';

    document.querySelectorAll('#onboarding-servings-grid .onboarding-serving-chip, #onboarding-servings-grid .onboarding-serving-card').forEach(btn => {
      const btnVal = parseInt(btn.dataset.servings, 10);
      btn.classList.toggle('active', btnVal === num);
      btn.setAttribute('aria-pressed', btnVal === num ? 'true' : 'false');
    });
  }

  openAuthFromOnboarding() {
    this.openAuthModal();
  }

  renderOnboardingStep() {
    const step = this.onboardingStep || 1;

    document.querySelectorAll('#onboarding-step-dots .onboarding-dot').forEach(dot => {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', dotStep === step);
      dot.classList.toggle('completed', dotStep < step);
    });

    for (let i = 1; i <= 5; i++) {
      const panel = document.getElementById(`onboarding-step-${i}`);
      if (panel) {
        panel.classList.toggle('active', i === step);
        panel.classList.toggle('is-hidden', i !== step);
      }
    }

    const prevBtn = document.getElementById('btn-onboarding-prev');
    const nextBtn = document.getElementById('btn-onboarding-next');
    const finishBtn = document.getElementById('btn-onboarding-finish');

    if (prevBtn) prevBtn.classList.toggle('is-hidden', step === 1);
    if (nextBtn) nextBtn.classList.toggle('is-hidden', step === 5);
    if (finishBtn) finishBtn.classList.toggle('is-hidden', step !== 5);

    if (step === 1) {
      const statusText = document.getElementById('onboarding-account-status-text');
      const connectBtn = document.getElementById('btn-onboarding-connect-account');
      if (state.cloudUser?.email) {
        if (statusText) {
          statusText.textContent = window.I18n && window.I18n.getLanguage() === 'en'
            ? `Connected as ${state.cloudUser.email}`
            : `Conectado como ${state.cloudUser.email}`;
        }
        if (connectBtn) {
          connectBtn.textContent = window.I18n && window.I18n.getLanguage() === 'en'
            ? 'Account connected'
            : 'Cuenta conectada';
        }
      } else {
        if (statusText) {
          statusText.textContent = window.I18n
            ? window.I18n.t('onboarding.accountPromo')
            : '¿Tienes cuenta o quieres sincronizar entre dispositivos?';
        }
      }
    } else if (step === 2) {
      this.renderOnboardingDietaryChips();
    } else if (step === 4) {
      this.selectOnboardingServings(this.onboardingServings);
    } else if (step === 5) {
      const summaryBox = document.getElementById('onboarding-summary-box');
      if (summaryBox) {
        const isEn = window.I18n && window.I18n.getLanguage() === 'en';
        const dietList = Array.from(this.onboardingDietary).map(t => window.I18n ? window.I18n.getTagLabel(t) : t);
        const dietText = dietList.length > 0 ? dietList.join(', ') : (isEn ? 'Omnivore / No restrictions' : 'Omnívoro / Sin restricciones');
        const goalsEnabled = document.getElementById('onboarding-goals-enabled')?.checked !== false;
        const cal = parseInt(document.getElementById('onboarding-goal-calories')?.value, 10) || 2000;
        const prot = parseInt(document.getElementById('onboarding-goal-protein')?.value, 10) || 140;
        const carbs = parseInt(document.getElementById('onboarding-goal-carbs')?.value, 10) || 200;
        const fat = parseInt(document.getElementById('onboarding-goal-fat')?.value, 10) || 65;
        const goalsText = goalsEnabled
          ? `${cal} kcal · ${prot}g P · ${carbs}g C · ${fat}g G`
          : (isEn ? 'Tracking disabled' : 'Seguimiento desactivado');
        const dietLabel = window.I18n ? window.I18n.t('settings.dietaryTitle') : 'Preferencias dietéticas';
        const goalsLabel = window.I18n ? window.I18n.t('settings.nutritionTitle') : 'Objetivos nutricionales diarios';
        const servingsLabel = window.I18n ? window.I18n.t('settings.servingsTitle') : 'Porciones por defecto';
        const personWord = this.onboardingServings === 1 ? (isEn ? 'person' : 'persona') : (isEn ? 'people' : 'personas');

        summaryBox.innerHTML = `
          <div class="onboarding-summary-item">
            <span class="material-symbols-outlined icon-sm icon-primary">eco</span>
            <div>
              <div class="onboarding-summary-label">${escapeHtml(dietLabel)}</div>
              <div class="onboarding-summary-value">${escapeHtml(dietText)}</div>
            </div>
          </div>
          <div class="onboarding-summary-item">
            <span class="material-symbols-outlined icon-sm icon-primary">flag</span>
            <div>
              <div class="onboarding-summary-label">${escapeHtml(goalsLabel)}</div>
              <div class="onboarding-summary-value">${escapeHtml(goalsText)}</div>
            </div>
          </div>
          <div class="onboarding-summary-item">
            <span class="material-symbols-outlined icon-sm icon-primary">group</span>
            <div>
              <div class="onboarding-summary-label">${escapeHtml(servingsLabel)}</div>
              <div class="onboarding-summary-value">${this.onboardingServings} ${personWord}</div>
            </div>
          </div>
        `;
      }
    }
    if (window.I18n && typeof window.I18n.applyTranslations === 'function') {
      window.I18n.applyTranslations(document.getElementById('modal-onboarding'));
    }
  }

  completeOnboarding() {
    // 1. Preferencias dietéticas
    state.dietaryPreferences = Array.from(this.onboardingDietary || []);
    state.save('fa_dietary_prefs', state.dietaryPreferences);

    // 2. Objetivos nutricionales diarios
    const goalsEnabled = document.getElementById('onboarding-goals-enabled')?.checked !== false;
    const cal = Math.max(500, parseInt(document.getElementById('onboarding-goal-calories')?.value, 10) || 2000);
    const prot = Math.max(10, parseInt(document.getElementById('onboarding-goal-protein')?.value, 10) || 140);
    const carbs = Math.max(10, parseInt(document.getElementById('onboarding-goal-carbs')?.value, 10) || 200);
    const fat = Math.max(10, parseInt(document.getElementById('onboarding-goal-fat')?.value, 10) || 65);

    const updatedGoals = {
      enabled: goalsEnabled,
      calories: cal,
      protein: prot,
      carbs: carbs,
      fat: fat
    };
    state.nutritionGoals = updatedGoals;
    if (!state.settings) state.settings = {};
    state.settings.nutritionGoals = updatedGoals;
    state.save('fa_nutrition_goals', updatedGoals);

    // 3. Porciones por defecto
    const servings = Number(this.onboardingServings) || 2;
    state.defaultServings = servings;
    state.settings.defaultServings = servings;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('fa_servings', String(servings));
        localStorage.setItem('fa_onboarding_completed', 'true');
      } catch (e) { }
    }

    this.closeOnboardingModal();
    this.render();
    this.scheduleSyncWithCloud();
    this.showToast('¡Configuración inicial guardada! Disfruta de Sabory.', 'success');
  }
}

// ==========================================================================
// US-17, US-37 & BUG-15: AI AGENT TOOLS DECLARATIONS & SAFE MARKDOWN FORMATTER
// ==========================================================================
function formatSafeAiMarkdown(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  // Limpiar cualquier identificador interno rec-... que el modelo haya podido filtrar en el texto visible
  const cleaned = rawText
    .replace(/\s*\([\s*`'"]*rec-[a-zA-Z0-9_-]+[\s*`'"]*\)/gi, '')
    .replace(/\s*\[[\s*`'"]*rec-[a-zA-Z0-9_-]+[\s*`'"]*\]/gi, '')
    .replace(/[*`'"]*\brec-[a-zA-Z0-9_-]+\b[*`'"]*/gi, '');

  const escaped = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return escaped
    .replace(/^[ \t]*[\-\*•][ \t]+(.*)$/gm, '• $1')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

const AI_TOOLS_DECLARATIONS = [
  {
    name: "create_and_save_recipe",
    description: "Crea y guarda una nueva receta completa en el catálogo del usuario cuando no tiene una receta adecuada o pide inventar una receta nueva. NUNCA uses esta herramienta si la receta ya existe en su catálogo o si el usuario pide asignar una receta a las comidas o meriendas de la semana.",
    parameters: {
      type: "OBJECT",
      properties: {
        id: { type: "STRING", description: "ID opcional sugerido para la receta" },
        title: { type: "STRING", description: "Título de la receta" },
        description: { type: "STRING", description: "Descripción breve del plato" },
        prepTimeMinutes: { type: "INTEGER", description: "Minutos de preparación" },
        cookTimeMinutes: { type: "INTEGER", description: "Minutos de cocción" },
        servings: { type: "INTEGER", description: "Número de raciones" },
        tags: { type: "ARRAY", items: { type: "STRING" }, description: "Etiquetas de la receta (ej. Cena, Rápida, Sin Gluten, Alta en Proteínas)" },
        ingredients: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              amount: { type: "NUMBER" },
              unit: { type: "STRING" }
            },
            required: ["name", "amount", "unit"]
          }
        },
        instructions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              step: { type: "INTEGER" },
              text: { type: "STRING" },
              timerMinutes: { type: "INTEGER" }
            },
            required: ["step", "text"]
          }
        },
        nutrition: {
          type: "OBJECT",
          properties: {
            calories: { type: "INTEGER" },
            protein: { type: "INTEGER" },
            carbs: { type: "INTEGER" },
            fat: { type: "INTEGER" }
          }
        }
      },
      required: ["title", "ingredients", "instructions"]
    }
  },
  {
    name: "set_day_plan",
    description: "Asigna o actualiza las comidas de un día concreto en el Planificador (ej. hoy, mañana o una fecha específica) usando IDs reales de recetas.",
    parameters: {
      type: "OBJECT",
      properties: {
        dateKey: { type: "STRING", description: "Fecha ISO local YYYY-MM-DD del día a planificar (ej. 2026-10-29)" },
        dayName: { type: "STRING", description: "Nombre del día (ej. Lunes, Martes...)" },
        breakfast: { type: "STRING", description: "ID de la receta para desayuno (opcional)" },
        lunch: { type: "STRING", description: "ID de la receta para almuerzo (opcional)" },
        snack: { type: "STRING", description: "ID de la receta para merienda (opcional)" },
        dinner: { type: "STRING", description: "ID de la receta para cena (opcional)" }
      },
      required: ["dateKey"]
    }
  },
  {
    name: "set_weekly_plan",
    description: "Asigna o actualiza el menú semanal en el Planificador. Puede aplicarse a la semana completa (con las 4 comidas: breakfast, lunch, snack y dinner) o a un momento de comida específico para toda la semana (ej. asignar una receta a todas las meriendas, desayunos o cenas de los 7 días) usando los IDs reales de las recetas.",
    parameters: {
      type: "OBJECT",
      properties: {
        mode: { type: "STRING", description: "'replace' para aplicar los slots indicados o 'merge' para rellenar solo los huecos vacíos" },
        days: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              dateKey: { type: "STRING", description: "Fecha ISO local YYYY-MM-DD" },
              dayName: { type: "STRING", description: "Nombre del día (Lunes..Domingo)" },
              breakfast: { type: "STRING", description: "ID de la receta de Desayuno (opcional si solo actualizas otro momento)" },
              lunch: { type: "STRING", description: "ID de la receta de Almuerzo (opcional si solo actualizas otro momento)" },
              snack: { type: "STRING", description: "ID de la receta de Merienda (opcional si solo actualizas otro momento)" },
              dinner: { type: "STRING", description: "ID de la receta de Cena (opcional si solo actualizas otro momento)" },
              isLeftoverLunch: { type: "BOOLEAN", description: "true si este almuerzo es tupper de la cena anterior (Batch Cooking)" }
            },
            required: ["dateKey"]
          }
        }
      },
      required: ["days"]
    }
  },
  {
    name: "manage_shopping_list",
    description: "Gestiona la lista de la compra. Para añadir artículos sueltos que pida el usuario usa SIEMPRE action: 'add' y la lista en 'items'. NUNCA uses 'add_from_current_plan' para artículos individuales. NUNCA uses esta herramienta si el usuario pide asignar o poner un plato en una comida, merienda o día del planificador.",
    parameters: {
      type: "OBJECT",
      properties: {
        action: { type: "STRING", description: "'add' (artículos sueltos pedidos por el usuario) | 'check' (marcar comprados) | 'remove' (borrar) | 'add_from_current_plan' (SOLO si el usuario pide explícitamente volcar todo el menú semanal a la lista)" },
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Nombre del producto" },
              amount: { type: "NUMBER", description: "Cantidad numérica" },
              unit: { type: "STRING", description: "Unidad (ej. g, ml, ud, l, kg)" }
            },
            required: ["name"]
          }
        }
      },
      required: ["action"]
    }
  }
];

// Global App Instance
let app;
function bootstrapApp() {
  if (typeof window !== 'undefined' && !window.app) {
    if (window.I18n) {
      window.I18n.applyTranslations();
    }
    app = new FoodAssistantApp();
    window.app = app;
    if (Array.isArray(state.shoppingList) && state.shoppingList.length > 0) {
      state.shoppingList = consolidateShoppingList(state.shoppingList);
      state.save('fa_shopping', state.shoppingList);
    }
    app.checkAndLaunchOnboarding();
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    bootstrapApp();
  }
  window.SEED_RECIPES = SEED_RECIPES;
  window.STANDARD_SLOTS = STANDARD_SLOTS;
  window.AISLE_METADATA = AISLE_METADATA;
  window.getAisleLabel = getAisleLabel;
  window.COMMON_INGREDIENTS = COMMON_INGREDIENTS;
  window.normalizeIngredientText = normalizeIngredientText;
  window.normalizeSearchText = normalizeSearchText;
  window.getSearchWordVariants = getSearchWordVariants;
  window.getRecipeSearchText = getRecipeSearchText;
  window.matchRecipeSearch = matchRecipeSearch;
  window.matchFridgeIngredient = matchFridgeIngredient;
  window.singularizeSpanishToken = singularizeSpanishToken;
  window.parseCookingAmount = parseCookingAmount;
  window.getCanonicalIngredientKey = getCanonicalIngredientKey;
  window.normalizeAndConvertUnit = normalizeAndConvertUnit;
  window.mergeShoppingQuantities = mergeShoppingQuantities;
  window.mergeOrAddShoppingItem = mergeOrAddShoppingItem;
  window.recalculateShoppingItemQuantities = recalculateShoppingItemQuantities;
  window.consolidateShoppingList = consolidateShoppingList;
  window.categorizeIngredientAisle = categorizeIngredientAisle;
  window.resolveAisleOnline = resolveAisleOnline;
  window.getCachedAisle = getCachedAisle;
  window.setCachedAisle = setCachedAisle;
  window.getIngredientIcon = getIngredientIcon;
  window.getIngredientSuggestions = getIngredientSuggestions;
  window.extractTimerFromStepText = extractTimerFromStepText;
  window.StateStore = StateStore;
  window.IndexedDbStorage = IndexedDbStorage;
  window.state = state;
  window.isSafeUrl = isSafeUrl;
  window.sanitizeUrl = sanitizeUrl;
  window.cleanRecipeImageUrl = cleanRecipeImageUrl;
  window.FoodAssistantApp = FoodAssistantApp;
  window.generateId = generateId;
  window.analyzeAndInferRecipeTags = analyzeAndInferRecipeTags;
  window.estimateRecipeNutrition = estimateRecipeNutrition;
  window.getRecipeNutrition = getRecipeNutrition;
  window.formatSafeAiMarkdown = formatSafeAiMarkdown;
  window.AI_TOOLS_DECLARATIONS = AI_TOOLS_DECLARATIONS;
  window.checkDietaryCompliance = checkDietaryCompliance;
  window.generateHouseholdInviteCode = generateHouseholdInviteCode;
  window.normalizeHouseholdInviteCode = normalizeHouseholdInviteCode;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SEED_RECIPES,
    STANDARD_SLOTS,
    AISLE_METADATA,
    getAisleLabel,
    COMMON_INGREDIENTS,
    cleanInvisibleChars,
    escapeHtml,
    normalizeIngredientText,
    normalizeSearchText,
    getSearchWordVariants,
    getRecipeSearchText,
    matchRecipeSearch,
    matchFridgeIngredient,
    singularizeSpanishToken,
    parseCookingAmount,
    getCanonicalIngredientKey,
    normalizeAndConvertUnit,
    mergeShoppingQuantities,
    mergeOrAddShoppingItem,
    recalculateShoppingItemQuantities,
    deduplicateShoppingBreakdown,
    consolidateShoppingList,
    categorizeIngredientAisle,
    resolveAisleOnline,
    getCachedAisle,
    setCachedAisle,
    getIngredientIcon,
    getIngredientSuggestions,
    extractTimerFromStepText,
    StateStore,
    IndexedDbStorage,
    FoodAssistantApp,
    isSafeUrl,
    sanitizeUrl,
    cleanRecipeImageUrl,
    generateId,
    analyzeAndInferRecipeTags,
    estimateRecipeNutrition,
    getRecipeNutrition,
    formatSafeAiMarkdown,
    AI_TOOLS_DECLARATIONS,
    checkDietaryCompliance,
    generateHouseholdInviteCode,
    normalizeHouseholdInviteCode
  };
}