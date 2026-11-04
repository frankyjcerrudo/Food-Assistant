// Food Assistant - Universal Recipe Parser (US-42, US-15, US-67)
import {
  generateId,
  cleanRecipeImageUrl,
  sanitizeUrl,
  estimateRecipeNutrition,
  categorizeIngredientAisle
} from '../core/utils.js';

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
      imageUrl: cleanRecipeImageUrl(imageUrl),
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
      sourceUrl: sanitizeUrl(resolvedSourceUrl),
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
      imageUrl: cleanRecipeImageUrl(candidateImage || ''),
      prepTimeMinutes: prepTimeMinutes,
      cookTimeMinutes: cookTimeMinutes,
      servings: servings,
      nutrition: estimateRecipeNutrition({ title, ingredients, servings }),
      tags: [],
      ingredients: ingredients,
      instructions: instructions,
      sourceUrl: sanitizeUrl(sourceUrl || ''),
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
      imageUrl = cleanRecipeImageUrl(imageUrl);

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

      // Source URL & Domain preservation (bloquea protocolos javascript:)
      let rawSource = cand.sourceUrl || cand.source_url || cand.source?.url || cand.url || '';
      let sourceUrl = sanitizeUrl(rawSource);
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

      const recipe = {
        id: cand.id || generateId('rec-'),
        title: title,
        description: description,
        imageUrl: imageUrl,
        prepTimeMinutes: prepTimeMinutes,
        cookTimeMinutes: cookTimeMinutes,
        servings: servings,
        nutrition: nutrition,
        tags: tags,
        ingredients: ingredients,
        instructions: instructions,
        sourceUrl: sourceUrl,
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

export {
  RecipeParser
};
