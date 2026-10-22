import { describe, it, expect } from 'vitest';

// RecipeParser implementation under test
const RecipeParser = {
  // Normalize units
  normalizeUnit(rawUnit) {
    if (!rawUnit) return 'ud';
    const u = rawUnit.toLowerCase().trim().replace(/\.$/, '');
    if (/^(g|gr|gramo|gramos)$/.test(u)) return 'g';
    if (/^(kg|kilo|kilos|kilogramo|kilogramos)$/.test(u)) return 'kg';
    if (/^(ml|mililitro|mililitros)$/.test(u)) return 'ml';
    if (/^(cl|centilitro|centilitros)$/.test(u)) return 'cl';
    if (/^(l|litro|litros)$/.test(u)) return 'l';
    if (/^(cda|cdas|cucharada|cucharadas|tbsp|tablespoon|tablespoons)$/.test(u)) return 'cda';
    if (/^(cdta|cdtas|cucharadita|cucharaditas|tsp|teaspoon|teaspoons)$/.test(u)) return 'cdta';
    if (/^(taza|tazas|cup|cups)$/.test(u)) return 'taza';
    if (/^(vaso|vasos|glass|glasses)$/.test(u)) return 'vaso';
    if (/^(pizca|pizcas|pinch|pinches|dash|dashes)$/.test(u)) return 'pizca';
    if (/^(diente|dientes|clove|cloves)$/.test(u)) return 'diente';
    if (/^(rebanada|rebanadas|rodaja|rodajas)$/.test(u)) return 'rebanada';
    if (/^(loncha|lonchas|filete|filetes|slice|slices)$/.test(u)) return 'loncha';
    if (/^(rama|ramas|ramita|ramitas|sprig|sprigs|stalk|stalks)$/.test(u)) return 'rama';
    if (/^(hoja|hojas|leaf|leaves)$/.test(u)) return 'hoja';
    if (/^(lata|latas|bote|botes|can|cans)$/.test(u)) return 'lata';
    if (/^(paquete|paquetes|pack|packs|packet|packets)$/.test(u)) return 'paquete';
    if (/^(pu\u00F1ado|pu\u00F1ados)$/.test(u)) return 'pu\u00F1ado';
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
    if (l.endsWith(':')) return true;
    if (/^(para\s+(la|el|los|las|hacer|servir|decorar|marinar|el\s+sofrito|la\s+salsa|la\s+masa|el\s+relleno|la\s+bechamel|el\s+pan|el\s+adobo))/i.test(l)) return true;
    if (/^(?:ingredientes|ingredientes\s+para|instrucciones|paso\s+a\s+paso|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo|procedimiento|modo\s+de\s+(?:preparaci[o\u00F3]n|empleo)|pasos(?:\s+a\s+seguir)?)/i.test(l)) return true;

    // Detect uppercase sub-section headings like "- CERDO ASADO CUBANO", "- PAN DE CUBANO", "- BOCADILLO CUBANO (1)", "MÃ‰TODO"
    const stripped = l.replace(/^[-*â€¢#\s]+/, '').replace(/\s*\(\d+\)\s*$/, '').trim();
    if (stripped.length >= 3 && !/\d+\s*(?:g|kg|ml|cl|l|cda|cucharada|oz|lb|ud|loncha)/i.test(stripped)) {
      if (/^(?:pan(?:\s+de)?|bocadillo(?:\s+de)?|cerdo(?:\s+asado)?|masa|salsa|mojo|sofrito|relleno|bechamel|adobo|marinado|glaseado|crema|cobertura|decoraci[o\u00F3]n|guarnici[o\u00F3]n|montaje)\b/i.test(stripped)) {
        return true;
      }
      if (/^[-*â€¢]\s*[A-ZÃÃ‰ÃÃ“ÃšÃ‘\s\d\(\)]+$/.test(l)) {
        return true;
      }
    }
    return false;
  },

  parseIsoDuration(durationStr) {
    if (!durationStr) return 15;
    if (typeof durationStr === 'number') return durationStr;
    const str = String(durationStr).trim();
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

  parseServings(yieldVal) {
    if (!yieldVal) return 2;
    if (typeof yieldVal === 'number') return yieldVal;
    const str = Array.isArray(yieldVal) ? yieldVal.join(' ') : String(yieldVal);
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
  },

  parseIngredientLine(rawLine) {
    if (!rawLine || typeof rawLine !== 'string') return null;
    let clean = rawLine.replace(/^([\u2022\-\*]|\d+[\.\)])\s*/, '').trim();
    if (!clean || this.isSectionHeader(clean)) return null;

    const unitWords = 'cucharadas|cucharada|cdas|cda|cucharaditas|cucharadita|cdtas|cdta|kilogramos|kilogramo|kilos|kilo|kg|gramos|gramo|gr|litros|litro|cl|ml|tablespoons|tablespoon|tbsp|teaspoons|teaspoon|tsp|tazas|taza|cups|cup|vasos|vaso|glasses|glass|pinches|pinch|pizcas|pizca|dientes|diente|cloves|clove|rebanadas|rebanada|rodajas|rodaja|lonchas|loncha|filetes|filete|slices|slice|ramitas|ramita|ramas|rama|sprigs|sprig|stalks|stalk|hojas|hoja|leaves|leaf|latas|lata|botes|bote|cans|can|paquetes|paquete|packet|packets|packs|pack|pu\\u00F1ados|pu\\u00F1ado|chorritos|chorrito|chorro|sobres|sobre|unidades|unidad|uds|ud|units|unit|items|item|pieces|piece|counts|count|dashes|dash|ea|g|l';

    let amount = 1;
    let unit = 'ud';
    let name = clean;

    const fracChars = '\\u00BD\\u00BC\\u00BE\\u2153\\u2154\\u215B\\u215C\\u215D\\u215E';

    // Pattern 1: Standard quantity first: "200 g de pollo", "4count Diente de ajo", "3 huevos", "1/2 cucharada de sal"
    const startNumRegex = new RegExp(`^([\\d${fracChars}\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s*(${unitWords})?\\.?\\b\\s*(?:de\\s+)?(.*)$`, 'i');
    const startMatch = clean.match(startNumRegex);

    if (startMatch && (isNaN(startMatch[1]) === false || new RegExp(`[\\/${fracChars}]`).test(startMatch[1]))) {
      amount = this.parseNumber(startMatch[1]);
      unit = startMatch[2] ? this.normalizeUnit(startMatch[2]) : 'ud';
      name = (startMatch[3] || '').trim();
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

    // Clean extraneous prefixes/suffixes from ingredient name
    name = name
      .replace(/^[\.\,\-\:\s]+/, '')
      .replace(/^count\s+/i, '')
      .replace(/\s+count$/i, '')
      .replace(/^de\s+/i, '')
      .replace(/:\s*$/, '')
      .trim();

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
        const rawJson = match[1].trim();
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

  isRecipeType(typeVal) {
    if (!typeVal) return false;
    if (typeof typeVal === 'string') return typeVal.toLowerCase().includes('recipe');
    if (Array.isArray(typeVal)) return typeVal.some(t => String(t).toLowerCase().includes('recipe'));
    return false;
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
    if (Array.isArray(rawIngredients)) {
      rawIngredients.forEach(line => {
        const parsed = this.parseIngredientLine(String(line));
        if (parsed) ingredients.push(parsed);
      });
    }

    const rawInstructions = schema.recipeInstructions || schema.instructions || [];
    const instructions = [];
    const processItem = (item) => {
      if (!item) return;
      if (typeof item === 'string') {
        const cleaned = item.trim();
        if (cleaned) {
          const timerMatch = cleaned.match(/(?:durante|por|hervir|cocer|hornear|reposar)?\s*(\d+)\s*(?:min|minutos)/i);
          instructions.push({ step: instructions.length + 1, text: cleaned, timerMinutes: timerMatch ? parseInt(timerMatch[1], 10) : null });
        }
      } else if (item.text) {
        const cleaned = item.text.trim();
        const timerMatch = cleaned.match(/(?:durante|por|hervir|cocer|hornear|reposar)?\s*(\d+)\s*(?:min|minutos)/i);
        instructions.push({ step: instructions.length + 1, text: cleaned, timerMinutes: timerMatch ? parseInt(timerMatch[1], 10) : null });
      } else if (item.itemListElement && Array.isArray(item.itemListElement)) {
        item.itemListElement.forEach(sub => processItem(sub));
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
      instructions: instructions
    };
  },

  htmlToText(html) {
    if (!html) return '';
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

  parseRecipeText(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;
    const trimmed = rawText.trim();
    if (!trimmed) return null;

    // Check if rawText is actually JSON or HTML with JSON-LD
    if (trimmed.includes('<script') || trimmed.startsWith('{') || trimmed.includes('"@type"') || trimmed.includes('"recipeIngredient"')) {
      try {
        const schema = this.extractJsonLdFromHtml(trimmed) || (trimmed.startsWith('{') ? JSON.parse(trimmed) : null);
        if (schema && (this.isRecipeType(schema['@type']) || schema.recipeIngredient || schema.ingredients)) {
          return this.parseSchemaRecipe(schema);
        }
      } catch (e) {}
    }

    const inputLines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (inputLines.length === 0) return null;

    // --- Pre-pass: Detect Title if present as "CÃ³mo hacer [TÃ­tulo]" or similar anywhere ---
    let detectedTitle = null;
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
            .replace(/\s*(?:[\-\u2013\u2014\|]\s*(?:diegodoal|directo al paladar|recetas|cocina|blog|youtube).*)$/i, '')
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
          .replace(/^#+\s*|^T[i\u00ED]tulo:\s*|^Receta\s+(?:de\s+)?/i, '')
          .replace(/^[-*\u2022#\s]+/, '')
          .replace(/\s*(?:[\-\u2013\u2014\|]\s*(?:diegodoal|directo al paladar|recetas|cocina|blog|youtube).*)$/i, '')
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

      // Section switches
      if (/^(?:ingredientes|lista de ingredientes|lo que necesitas):?$/i.test(line) || /^#+\s*ingredientes/i.test(line)) {
        currentSection = 'ingredients';
        continue;
      }

      if (/^(?:instrucciones|preparaci[o\u00F3]n|pasos|elaboraci[o\u00F3]n|m[e\u00E9]todo|procedimiento|modo de preparaci[o\u00F3]n|c[o\u00F3]mo hacer(?:lo)?|paso a paso):?$/i.test(line) || /^#+\s*(?:instrucciones|pasos|preparaci[o\u00F3]n|elaboraci[o\u00F3]n|m[e\u00E9]todo)/i.test(line)) {
        currentSection = 'instructions';
        continue;
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

      // Skip title duplicate lines like "CÃ³mo hacer Bocadillo de atÃºn"
      if (/^c[o\u00F3]mo hacer/i.test(line) || /paso a paso$/i.test(line)) {
        if (!currentSection || currentSection === 'ingredients') {
          currentSection = 'instructions';
        }
        continue;
      }

      // Parsing items according to active section
      if (currentSection === 'ingredients') {
        const parsed = this.parseIngredientLine(line);
        if (parsed) ingredients.push(parsed);
      } else if (currentSection === 'instructions') {
        if (this.isSectionHeader(line)) {
          continue;
        }
        const stepText = line.replace(/^\d+[\.\)]\s*|^paso\s*\d+[:\.\-]\s*/i, '').trim();
        if (stepText && stepText.length > 3) {
          const timerMatch = stepText.match(/(?:durante|por|hervir|cocer|hornear|reposar)?\s*(\d+)\s*(?:min|minutos)/i) ||
                             stepText.match(/(?:durante|por|hervir|cocer|hornear|reposar)?\s*(\d+)\s*(?:h|hora|horas)/i);
          let timerMin = null;
          if (timerMatch) {
            timerMin = this.parseIsoDuration(timerMatch[0]);
          }
          instructions.push({
            step: instructions.length + 1,
            text: stepText,
            timerMinutes: timerMin
          });
        }
      } else {
        // Line before any explicit section header
        if (/^[\d\-\* ]/.test(line)) {
          const parsed = this.parseIngredientLine(line);
          if (parsed) ingredients.push(parsed);
        }
      }
    }

    return {
      id: 'rec-' + Date.now(),
      title: title || 'Receta de Notas',
      description: 'Receta importada desde texto estructurado.',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
      prepTimeMinutes: prepTimeMinutes,
      cookTimeMinutes: cookTimeMinutes,
      servings: servings,
      tags: [],
      ingredients: ingredients,
      instructions: instructions
    };
  }
};

describe('US-15: Importador de Recetas (Schema.org / JSON-LD & Texto Estructurado)', () => {
  it('parseIsoDuration convierte duraciones ISO 8601 a minutos correctamente', () => {
    expect(RecipeParser.parseIsoDuration('PT15M')).toBe(15);
    expect(RecipeParser.parseIsoDuration('PT1H30M')).toBe(90);
    expect(RecipeParser.parseIsoDuration('PT2H')).toBe(120);
    expect(RecipeParser.parseIsoDuration('25 min')).toBe(25);
    expect(RecipeParser.parseIsoDuration(null)).toBe(15);
  });

  it('parseServings extrae el n\u00FAmero de raciones o comensales', () => {
    expect(RecipeParser.parseServings(4)).toBe(4);
    expect(RecipeParser.parseServings('4 raciones')).toBe(4);
    expect(RecipeParser.parseServings('Para 6 personas')).toBe(6);
    expect(RecipeParser.parseServings(null)).toBe(2);
  });

  it('parseIngredientLine desglosa cantidad, unidad y clasifica el pasillo (aisle)', () => {
    const ing1 = RecipeParser.parseIngredientLine('200 g de pechuga de pollo');
    expect(ing1.amount).toBe(200);
    expect(ing1.unit).toBe('g');
    expect(ing1.name).toBe('Pechuga de pollo');
    expect(ing1.aisle).toBe('meat');

    const ing2 = RecipeParser.parseIngredientLine('3 huevos');
    expect(ing2.amount).toBe(3);
    expect(ing2.unit).toBe('ud');
    expect(ing2.aisle).toBe('dairy');

    const ing3 = RecipeParser.parseIngredientLine('1/2 cucharada de sal');
    expect(ing3.amount).toBe(0.5);
    expect(ing3.unit).toBe('cda');
    expect(ing3.aisle).toBe('spices');

    const ing4 = RecipeParser.parseIngredientLine('Tomates cherry');
    expect(ing4.amount).toBe(1);
    expect(ing4.unit).toBe('ud');
    expect(ing4.aisle).toBe('produce');
  });

  it('extractJsonLdFromHtml extrae el objeto Recipe de un bloque de HTML', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Recipe",
            "name": "Tortilla de Patatas",
            "prepTime": "PT10M",
            "cookTime": "PT20M",
            "recipeYield": "4 raciones",
            "recipeIngredient": ["5 patatas medianas", "6 huevos", "Aceite de oliva", "Sal"],
            "recipeInstructions": ["Pelar y cortar las patatas.", "Fre\u00EDr a fuego medio.", "Batir los huevos y mezclar.", "Cuajar la tortilla."]
          }
          </script>
        </head>
      </html>
    `;
    const extracted = RecipeParser.extractJsonLdFromHtml(html);
    expect(extracted).not.toBeNull();
    expect(extracted.name).toBe('Tortilla de Patatas');

    const recipe = RecipeParser.parseSchemaRecipe(extracted);
    expect(recipe.title).toBe('Tortilla de Patatas');
    expect(recipe.prepTimeMinutes).toBe(10);
    expect(recipe.cookTimeMinutes).toBe(20);
    expect(recipe.servings).toBe(4);
    expect(recipe.ingredients).toHaveLength(4);
    expect(recipe.instructions).toHaveLength(4);
  });

  it('extractJsonLdFromHtml soporta schemas anidados en @graph', () => {
    const html = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "name": "Cocina F\u00E1cil" },
          {
            "@type": "Recipe",
            "name": "Guacamole Casero",
            "recipeIngredient": ["2 aguacates maduros", "1 lima", "1 tomate peque\u00F1o", "Cilantro fresco", "Sal al gusto"],
            "recipeInstructions": ["Chafar los aguacates.", "A\u00F1adir el resto de ingredientes y mezclar."]
          }
        ]
      }
      </script>
    `;
    const extracted = RecipeParser.extractJsonLdFromHtml(html);
    expect(extracted).not.toBeNull();
    expect(extracted.name).toBe('Guacamole Casero');
  });

  it('parseRecipeText procesa notas o texto libre estructurado', () => {
    const text = `
    Salm\u00F3n con Verduras al Vapor
    Raciones: 3
    Tiempo de preparaci\u00F3n: 10 min
    Tiempo de cocci\u00F3n: 25 min

    Ingredientes:
    - 3 lomos de salm\u00F3n
    - 200 g de br\u00F3coli
    - 2 zanahorias

    Instrucciones:
    1. Cortar las verduras en trozos medianos.
    2. Cocinar el salm\u00F3n a la plancha 4 minutos por lado.
    3. Servir caliente.
    `;

    const recipe = RecipeParser.parseRecipeText(text);
    expect(recipe).not.toBeNull();
    expect(recipe.title).toBe('Salm\u00F3n con Verduras al Vapor');
    expect(recipe.servings).toBe(3);
    expect(recipe.cookTimeMinutes).toBe(25);
    expect(recipe.ingredients).toHaveLength(3);
    expect(recipe.instructions).toHaveLength(3);
    expect(recipe.instructions[1].text).toBe('Cocinar el salm\u00F3n a la plancha 4 minutos por lado.');
  });

  it('parseIngredientLine soporta formato inverso de webs espa\u00F1olas (Directo al Paladar, Cookpad)', () => {
    const r1 = RecipeParser.parseIngredientLine('Placas de lasa\u00F1a 12');
    expect(r1.amount).toBe(12);
    expect(r1.unit).toBe('ud');
    expect(r1.name).toBe('Placas de lasa\u00F1a');
    expect(r1.aisle).toBe('bakery');

    const r2 = RecipeParser.parseIngredientLine('Tomate triturado 400 g');
    expect(r2.amount).toBe(400);
    expect(r2.unit).toBe('g');
    expect(r2.name).toBe('Tomate triturado');
    expect(r2.aisle).toBe('produce');

    const r3 = RecipeParser.parseIngredientLine('Berenjena 1');
    expect(r3.amount).toBe(1);
    expect(r3.unit).toBe('ud');
    expect(r3.name).toBe('Berenjena');

    const r4 = RecipeParser.parseIngredientLine('Aceite de oliva virgen extra 40 ml');
    expect(r4.amount).toBe(40);
    expect(r4.unit).toBe('ml');
  });

  it('parseIngredientLine gestiona ingredientes "al gusto" y descarta cabeceras de secci\u00F3n', () => {
    const tt = RecipeParser.parseIngredientLine('Sal y pimienta al gusto');
    expect(tt.amount).toBe(1);
    expect(tt.unit).toBe('pizca');
    expect(tt.name).toBe('Sal y pimienta');
    expect(tt.aisle).toBe('spices');

    const sh1 = RecipeParser.parseIngredientLine('Para la bechamel:');
    expect(sh1).toBeNull();

    const sh2 = RecipeParser.parseIngredientLine('Ingredientes:');
    expect(sh2).toBeNull();
  });

  it('parseIngredientLine elimina prefijos/unidades "count" y normaliza unidades pegadas (Directo al Paladar)', () => {
    const c1 = RecipeParser.parseIngredientLine('4count Diente de ajo');
    expect(c1.amount).toBe(4);
    expect(c1.unit).toBe('ud');
    expect(c1.name).toBe('Diente de ajo');

    const c2 = RecipeParser.parseIngredientLine('1count Lim\u00F3n');
    expect(c2.amount).toBe(1);
    expect(c2.unit).toBe('ud');
    expect(c2.name).toBe('Lim\u00F3n');

    const c3 = RecipeParser.parseIngredientLine('2count Clavo de olor');
    expect(c3.amount).toBe(2);
    expect(c3.unit).toBe('ud');
    expect(c3.name).toBe('Clavo de olor');

    const c4 = RecipeParser.parseIngredientLine('400g Tofu firme');
    expect(c4.amount).toBe(400);
    expect(c4.unit).toBe('g');
    expect(c4.name).toBe('Tofu firme');

    const c5 = RecipeParser.parseIngredientLine('300ml Agua');
    expect(c5.amount).toBe(300);
    expect(c5.unit).toBe('ml');
    expect(c5.name).toBe('Agua');
  });

  it('parseSchemaRecipe y parseRecipeText omiten etiqueta "Importada"', () => {
    const fakeSchema = {
      '@type': 'Recipe',
      name: 'Curry Vegano',
      recipeCategory: ['Vegui', 'Curry'],
      recipeIngredient: ['400g Tofu firme', '4count Diente de ajo'],
      recipeInstructions: ['Cocinar todo junto.']
    };
    const rSchema = RecipeParser.parseSchemaRecipe(fakeSchema);
    expect(rSchema.tags).toContain('Vegui');
    expect(rSchema.tags).not.toContain('Importada');

    const rawText = "Curry r\u00E1pido\nIngredientes:\n1 cebolla\nInstrucciones:\n1. Picar.";
    const rText = RecipeParser.parseRecipeText(rawText);
    expect(rText.tags).not.toContain('Importada');
    expect(rText.tags).not.toContain('Notas');
  });

  it('parseRecipeText procesa recetas completas reales de Directo al Paladar extrayendo raciones, tiempos y pasos con temporizador', () => {
    const rawDirecto = `
    Lasa\u00F1a de verduras f\u00E1cil y r\u00E1pida
    Tiempo de preparaci\u00F3n: 20 min
    Tiempo de cocci\u00F3n: 40 min
    Para 4 personas

    Ingredientes
    Placas de lasa\u00F1a 12
    Berenjena 1
    Calabac\u00EDn 1
    Cebolla 1
    Pimiento rojo 0.5
    Tomate triturado 400 g
    Queso rallado 100 g
    Aceite de oliva virgen extra 40 ml
    Sal y pimienta al gusto
    Para la bechamel:
    Mantequilla 50 g
    Harina de trigo 50 g
    Leche entera 500 ml
    Nuez moscada 1 pizca

    Instrucciones
    1. Cortar las verduras en dados peque\u00F1os.
    2. En una sart\u00E9n con aceite de oliva, pochar la cebolla y el pimiento durante 10 minutos.
    3. A\u00F1adir el calabac\u00EDn y la berenjena y cocinar otros 10 minutos.
    4. Agregar el tomate triturado, salpimentar y dejar reducir a fuego lento 15 minutos.
    5. Preparar la bechamel derritiendo la mantequilla, a\u00F1adiendo la harina y vertiendo la leche poco a poco.
    6. Montar la lasa\u00F1a alternando pasta, verduras y bechamel.
    7. Terminar con queso rallado y hornear a 200\u00BAC durante 25 minutos.
    `;

    const recipe = RecipeParser.parseRecipeText(rawDirecto);
    expect(recipe.title).toBe('Lasa\u00F1a de verduras f\u00E1cil y r\u00E1pida');
    expect(recipe.servings).toBe(4);
    expect(recipe.prepTimeMinutes).toBe(20);
    expect(recipe.cookTimeMinutes).toBe(40);
    expect(recipe.ingredients).toHaveLength(13);
    expect(recipe.instructions).toHaveLength(7);
    expect(recipe.instructions[1].timerMinutes).toBe(10);
    expect(recipe.instructions[6].timerMinutes).toBe(25);
  });

  it('parseRecipeText procesa recetas con ingredientes en dos líneas (cantidad y nombre separados) como Bocadillo de atún', () => {
    const rawBocadillo = `
Ingredientes
 Para 2 personas
2 uds.
Pan baguette
4 cucharadas
Mayonesa
2 cucharadas
Mostaza
200 g
Atún en conserva
2 uds.
Tomate en rama
1 ud.
Cogollo de lechuga
2 uds.
Huevo cocido
Cómo hacer Bocadillo de atún
Dificultad: Fácil
Tiempo total
5
min
Elaboración
5
min
Primero abrimos las barras de pan. Mezclamos la mayonesa con la mostaza, y untamos la base de las barras con la salsa.

Escurrimos los lomos de atún, pelamos y cortamos los huevos en rodajas, y cortamos en rodajas los tomates.

Colocamos las rodajas de tomate en la base de los bocadillos seguidas de las hojas de lechuga.

Ponemos encima el atún, y por último, las rodajas de huevo cocido antes de cerrar el bocadillo.

Bocadillo De Atun Paso A Paso
    `;

    const recipe = RecipeParser.parseRecipeText(rawBocadillo);
    expect(recipe.title).toBe('Bocadillo de atún');
    expect(recipe.servings).toBe(2);
    expect(recipe.prepTimeMinutes).toBe(5);
    expect(recipe.cookTimeMinutes).toBe(5);
    expect(recipe.ingredients).toHaveLength(7);
    expect(recipe.ingredients[0].name).toBe('Pan baguette');
    expect(recipe.ingredients[0].amount).toBe(2);
    expect(recipe.ingredients[0].unit).toBe('ud');
    expect(recipe.ingredients[1].name).toBe('Mayonesa');
    expect(recipe.ingredients[1].amount).toBe(4);
    expect(recipe.ingredients[1].unit).toBe('cda');
    expect(recipe.ingredients[3].name).toBe('Atún en conserva');
    expect(recipe.ingredients[3].amount).toBe(200);
    expect(recipe.ingredients[3].unit).toBe('g');
    expect(recipe.instructions).toHaveLength(4);
  });

  it('parseRecipeText procesa recetas complejas con subsecciones, metodo, tiempos en horas y lonchas como Bocadillo Cubano', () => {
    const rawCubano = `
Bocadillo Cubano completamente casero â€” diegodoal

DIFICULTAD: INTERMEDIA - INGREDIENTES: FÃCIL - TIEMPO: 5 HORAS
TIEMPO ACTIVO: 2 HORAS - CANTIDAD: 4 BOCADILLOS
INGREDIENTES
- CERDO ASADO CUBANO
2 kg de aguja de cerdo deshuesada 
Sal
Mojo:
60 ml de zumo de lima
120 ml de zumo de naranja
60 ml de aceite de oliva virgen extra
1 cucharada de orÃ©gano seco
- PAN DE CUBANO
350 g de harina de fuerza
15 g de azÃºcar
5 g de levadura instantÃ¡nea de panadero
9 g de sal
250 ml de agua templada
30 g de manteca de cerdo
- BOCADILLO CUBANO (1)
Cerdo asado cubano
4 lonchas de jamÃ³n cocido finas
2 lonchas de queso emmental
Mostaza amarilla
Pepinillos
Mantequilla
MÃ‰TODO
- CERDO ASADO CUBANO
Limpia la aguja de cerdo si tiene hueso. SÃ¡lala por toda la superficie abundantemente. 
En un bol, mezcla todos los ingredientes del mojo. Reserva la mitad en la nevera y con la otra mitad marina la carne. DÃ©jala en la nevera al menos dos horas, pero idealmente toda la noche.
Envuelve el trozo de carne y sus jugos con papel de aluminio y mÃ©telo a un horno a 180 grados, calor solo por abajo, dos horas.
DesenvuÃ©lvelo, bÃ¡Ã±alo con sus jugos, y devuÃ©lvelo al horno 2 horas mÃ¡s. BÃ¡Ã±alo con los jugos cada 30 minutos. 
SÃ¡calo del horno y dÃ©jalo reposar 15 minutos. Mientras, mezcla sus jugos con el mojo que habÃ­amos reservado en la nevera.
RÃ³mpelo en trozos medianos con las manos o dos tenedores. Vierte el mojo por toda la carne y mezcla bien. 
- PAN DE CUBANO
En un bol grande, aÃ±ade la harina de fuerza, el azÃºcar, la levadura instantÃ¡nea y la sal. Mezcla con unas varillas. 
Haz un hueco en el centro y aÃ±ade el agua. Mezcla con unas varillas y despuÃ©s con las manos, hasta que toda la harina se integre. 
AÃ±ade la manteca a temperatura ambiente e intÃ©grala en la masa. Amasa en una mesa durante 8-9 minutos, hasta que sea elÃ¡stica y rebote al tacto. 
Haz una bola con la masa y dÃ©jala reposar en un bol tapada con un trapo hÃºmedo, durante 45 minutos, o hasta que retomen la forma. 
`;

    const recipe = RecipeParser.parseRecipeText(rawCubano);
    expect(recipe.title).toBe('Bocadillo Cubano completamente casero');
    expect(recipe.servings).toBe(4);
    expect(recipe.prepTimeMinutes).toBe(120);
    expect(recipe.cookTimeMinutes).toBe(300);
    
    // Validate lonchas parsing (not 4 l of ham, but 4 lonchas!)
    const jamon = recipe.ingredients.find(i => i.name.toLowerCase().includes('jam'));
    expect(jamon).toBeDefined();
    expect(jamon.amount).toBe(4);
    expect(jamon.unit).toBe('loncha');
    
    const queso = recipe.ingredients.find(i => i.name.toLowerCase().includes('emmental'));
    expect(queso).toBeDefined();
    expect(queso.amount).toBe(2);
    expect(queso.unit).toBe('loncha');
    
    // Ensure section headers like "- PAN DE CUBANO" or "MÃ‰TODO" are not ingredients
    const metodoIng = recipe.ingredients.find(i => i.name.toLowerCase().includes('m\u00E9todo'));
    expect(metodoIng).toBe(undefined);
    
    // Instructions should be parsed under MÃ‰TODO
    expect(recipe.instructions.length).toBeGreaterThanOrEqual(10);
    expect(recipe.instructions[0].text).toContain('Limpia la aguja de cerdo');
  });
});
