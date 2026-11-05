// Food Assistant - Core Utilities (US-42)
import {
  DAYS_OF_WEEK_ES,
  MONTHS_SHORT_ES,
  PREDEFINED_DIETARY_TAGS,
  DIETARY_TAG_EMOJIS,
  PREDEFINED_OCCASION_TAGS,
  PREDEFINED_PRACTICAL_TAGS,
  ALL_PREDEFINED_TAGS,
  AISLE_METADATA
} from './constants.js';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  cleaned = cleaned.replace(/^["'`<]+|["'`>]+$/g, '').trim();
  if (!cleaned) return '';
  if (cleaned.startsWith('data:image/')) return cleaned;
  cleaned = cleaned.replace(/&amp;/g, '&');
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'igshid', 'msclkid', 'mc_cid', 'mc_eid', '_ga', '_gl',
      'ref', 'source', 'feature', 'ncid', 'wt.mc_id'
    ];
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    parsed.hash = '';
    return parsed.toString();
  } catch (e) {
    return '';
  }
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

function normalizeIngredientText(str) {
  if (!str) return '';
  return str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function normalizeSearchText(str) {
  if (!str) return '';
  return str.toString()
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

function getCanonicalIngredientKey(name) {
  if (!name) return '';
  const norm = normalizeIngredientText(name)
    .replace(/[,;+._\-\/()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!norm) return '';
  return norm
    .split(' ')
    .filter(Boolean)
    .map(singularizeSpanishToken)
    .join(' ');
}

function normalizeAndConvertUnit(amount, unit) {
  const rawUnit = (unit === null || unit === undefined) ? '' : String(unit).trim();
  const cleanUnit = normalizeIngredientText(rawUnit).replace(/\.+$/g, '').trim();
  const hasNumericAmount = amount !== null && amount !== undefined && amount !== '' && !isNaN(Number(amount));
  const numAmount = hasNumericAmount ? Number(amount) : null;

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
    } else if (canonicalUnit === 'cl' || canonicalUnit === 'dl') {
      displayAmount = Math.round(baseAmount * 100) / 100;
      displayUnit = 'ml';
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

  // Uno tiene cantidad numérica y el otro no tiene cantidad ni unidad incompatible
  if (normA.baseAmount === null && !normA.canonicalUnit) {
    return { compatible: true, amount: normB.amount, unit: normB.unit };
  }
  if (normB.baseAmount === null && !normB.canonicalUnit) {
    return { compatible: true, amount: normA.amount, unit: normA.unit };
  }

  return { compatible: false };
}

function mergeOrAddShoppingItem(shoppingList, newItem) {
  if (!Array.isArray(shoppingList) || !newItem || !newItem.name) return null;
  const targetKey = getCanonicalIngredientKey(newItem.name);
  if (!targetKey) return null;

  const normNew = normalizeAndConvertUnit(newItem.amount, newItem.unit);
  const nowIso = new Date().toISOString();

  for (let i = 0; i < shoppingList.length; i++) {
    const existing = shoppingList[i];
    if (!existing || existing.isChecked || existing.checked) continue;
    const existingKey = getCanonicalIngredientKey(existing.name);
    if (existingKey !== targetKey) continue;

    const mergedQty = mergeShoppingQuantities(existing.amount, existing.unit, newItem.amount, newItem.unit);
    if (!mergedQty.compatible) continue;

    existing.amount = mergedQty.amount;
    existing.unit = mergedQty.unit;
    if ((!existing.aisle || existing.aisle === 'other') && newItem.aisle && newItem.aisle !== 'other') {
      existing.aisle = newItem.aisle;
    }

    if (newItem.recipeOrigin) {
      const incomingOrigins = String(newItem.recipeOrigin).split(',').map(s => s.trim()).filter(Boolean);
      const currentOrigins = existing.recipeOrigin
        ? String(existing.recipeOrigin).split(',').map(s => s.trim()).filter(Boolean)
        : [];
      incomingOrigins.forEach(orig => {
        if (!currentOrigins.includes(orig)) {
          currentOrigins.push(orig);
        }
      });
      existing.recipeOrigin = currentOrigins.join(', ');
    }

    existing.updatedAt = nowIso;
    return existing;
  }

  const isItemChecked = Boolean(newItem.isChecked || newItem.checked);
  const created = {
    id: newItem.id || generateId('shop-'),
    name: String(newItem.name).trim(),
    amount: normNew.amount,
    unit: normNew.unit,
    aisle: newItem.aisle || categorizeIngredientAisle(newItem.name),
    isChecked: isItemChecked,
    recipeOrigin: newItem.recipeOrigin ? String(newItem.recipeOrigin).trim() : '',
    updatedAt: newItem.updatedAt || nowIso
  };
  shoppingList.push(created);
  return created;
}

function categorizeIngredientAisle(ingredientName) {
  const text = normalizeIngredientText(ingredientName);
  if (!text) return 'other';

  // 1. Dulces y Chocolates específicos (pantry)
  if (/\b(chocolate|chocolates|cacao|bombones)\b/.test(text)) {
    return 'pantry';
  }

  // 2. Carnes, Aves, Pescados, Mariscos y Embutidos (meat)
  if (/\b(pollo|pollos|pechuga|pechugas|muslo|muslos|alita|alitas|pavo|pavos|ternera|terneras|vaca|buey|cerdo|cerdos|cochinillo|cordero|conejo|pato|carne|carnes|carne\s+picada|picada\s+de\s+(?:ternera|cerdo|pollo|pavo|vaca|buey)|filete|filetes|solomillo|solomillos|lomo|lomos|costilla|costillas|chuleta|chuletas|entrecot|hamburguesa|hamburguesas|salchicha|salchichas|chorizo|chorizos|morcilla|morcillas|jamon|jamones|panceta|bacon|beicon|lacon|cecina|embutido|embutidos|pescado|pescados|salmon|salmones|merluza|merluzas|atun|atunes|bonito|bacalao|dorada|doradas|lubina|lubinas|trucha|truchas|sardina|sardinas|boqueron|boquerones|anchoa|anchoas|pez\s+espada|emperador|gamba|gambas|langostino|langostinos|calamar|calamares|sepia|chipiron|chipirones|pulpo|pulpos|mejillon|mejillones|almeja|almejas|navaja|navajas|ostra|ostras|cangrejo|bogavante)\b/.test(text)) {
    return 'meat';
  }

  // 3. Lácteos y Huevos (dairy)
  if (/\b(leche|queso|quesos|yogur|yogurt|yogures|mantequilla|nata|crema\s+de\s+leche|huevo|huevos|clara|claras|yema|yemas|parmesano|mozzarella|ricotta|feta|mascarpone|gorgonzola|cheddar|gouda|brie|camembert|roquefort|cuajada|kefir)\b/.test(text)) {
    return 'dairy';
  }

  // 4. Frutas, Verduras, Hortalizas y Hierbas Frescas (produce)
  if (/\b(tomate|tomates|cherry|cebolla|cebollas|cebolleta|cebolletas|ajo|ajos|patata|patatas|papa|papas|batata|batatas|boniato|boniatos|camote|camotes|aguacate|aguacates|espinaca|espinacas|lechuga|lechugas|zanahoria|zanahorias|limon|limones|lima|limas|manzana|manzanas|platano|platanos|banana|bananas|champinon|champinones|seta|setas|pimiento|pimientos|calabacin|calabacines|pepino|pepinos|fresa|fresas|fresones|arandano|arandanos|frambuesa|frambuesas|mora|moras|pera|peras|naranja|naranjas|mandarina|mandarinas|pomelo|uva|uvas|melon|sandia|melocoton|albaricoque|ciruela|ciruelas|mango|pina|kiwi|kiwis|brocoli|coliflor|col|repollo|lombarda|berenjena|berenjenas|judia|judias|guisante|guisantes|esparrago|esparragos|triguero|trigueros|apio|puerro|puerros|calabaza|calabazas|perejil|albahaca|cilantro|hierbabuena|menta|rucula|canonigos|alcachofa|alcachofas|remolacha|rabano|rabanos|nabo|brotes|endivia|endivias|castana|castanas)\b/.test(text)) {
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

export {
  escapeHtml,
  isSafeUrl,
  sanitizeUrl,
  cleanRecipeImageUrl,
  getIngredientIcon,
  getDietaryTagEmoji,
  categorizeIngredientAisle,
  getIngredientSuggestions,
  extractTimerFromStepText,
  normalizeIngredientText,
  normalizeSearchText,
  getSearchWordVariants,
  getRecipeSearchText,
  matchRecipeSearch,
  matchFridgeIngredient,
  singularizeSpanishToken,
  getCanonicalIngredientKey,
  normalizeAndConvertUnit,
  mergeShoppingQuantities,
  mergeOrAddShoppingItem,
  resolveAisleOnline,
  getCachedAisle,
  setCachedAisle,
  generateId,
  toLocalDateKey,
  parseLocalDateKey,
  getMondayOfWeek,
  getWeekDates,
  formatWeekRange,
  checkDietaryCompliance,
  estimateRecipeNutrition,
  getRecipeNutrition,
  getRecipeTheme,
  getRecipePlaceholderSvg,
  getRecipePlaceholderHtml,
  formatSafeAiMarkdown,
  AI_TOOLS_DECLARATIONS,
  COMMON_INGREDIENTS,
  RECIPE_THEMES
};
