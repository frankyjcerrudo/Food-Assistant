// Food Assistant - Core Constants (US-42)
const DAYS_OF_WEEK_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
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
    const title = (recipe.title || '').toLowerCase();
    if (/\b(snack|merienda|tostas?|fruta|yogur)\b/i.test(title)) {
      return { calories: 280, protein: 12, carbs: 35, fat: 8 };
    }
    if (/\b(desayuno|avena|porridge|tostadas?)\b/i.test(title)) {
      return { calories: 350, protein: 14, carbs: 48, fat: 10 };
    }
    return { calories: 450, protein: 28, carbs: 45, fat: 15 };
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
    if (calories > 0 || protein > 0 || carbs > 0 || fat > 0) {
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
    const nutrition = (typeof getRecipeNutrition === 'function') ? getRecipeNutrition(recipe) : null;
    if (nutrition) {
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

      if (qualifies) {
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
  SEED_RECIPES,
  STANDARD_SLOTS,
  AISLE_METADATA,
  DAYS_OF_WEEK_ES,
  MONTHS_SHORT_ES,
  PREDEFINED_DIETARY_TAGS,
  DIETARY_TAG_EMOJIS,
  PREDEFINED_OCCASION_TAGS,
  PREDEFINED_PRACTICAL_TAGS,
  ALL_PREDEFINED_TAGS
};
