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
    if (/^(cda|cdas|cucharada|cucharadas|tbsp)$/.test(u)) return 'cda';
    if (/^(cdta|cdtas|cucharadita|cucharaditas|tsp)$/.test(u)) return 'cdta';
    if (/^(taza|tazas|cup|cups)$/.test(u)) return 'taza';
    if (/^(vaso|vasos)$/.test(u)) return 'vaso';
    if (/^(pizca|pizcas|pinch)$/.test(u)) return 'pizca';
    if (/^(diente|dientes)$/.test(u)) return 'diente';
    if (/^(rebanada|rebanadas|rodaja|rodajas)$/.test(u)) return 'rebanada';
    if (/^(loncha|lonchas|filete|filetes)$/.test(u)) return 'loncha';
    if (/^(rama|ramas|ramita|ramitas)$/.test(u)) return 'rama';
    if (/^(hoja|hojas)$/.test(u)) return 'hoja';
    if (/^(lata|latas|bote|botes)$/.test(u)) return 'lata';
    if (/^(paquete|paquetes)$/.test(u)) return 'paquete';
    if (/^(puñado|puñados)$/.test(u)) return 'puñado';
    if (/^(chorro|chorrito|chorritos)$/.test(u)) return 'chorrito';
    if (/^(sobre|sobres)$/.test(u)) return 'sobre';
    return 'ud';
  },

  categorizeAisle(ingredientName) {
    const text = (ingredientName || '').toLowerCase();
    if (/pollo|ternera|carne|cerdo|pavo|jamón|salmón|pescado|atún|merluza|gambas|langostinos|bacon|lomo|chorizo|hamburguesa|filete|salchicha|costilla|pato|cordero|bacalao|calamar|pulpo|mejillón|almeja/i.test(text)) {
      return 'meat';
    }
    if (/leche|queso|mantequilla|yogur|nata|huevo|huevos|parmesano|mozzarella|crema|ricotta|feta|mascarpone|gorgonzola|cheddar/i.test(text)) {
      return 'dairy';
    }
    if (/tomate|cebolla|ajo|patata|aguacate|espinaca|lechuga|zanahoria|limón|manzana|plátano|champiñón|seta|pimiento|calabacín|pepino|fresa|arándano|pera|naranja|brócoli|coliflor|berenjena|judía|espárrago|apio|puerro|calabaza|perejil|albahaca|cilantro|hierbabuena|menta/i.test(text)) {
      return 'produce';
    }
    if (/harina|pan|levadura|masa|hojaldre|tortilla|galleta|bizcocho|placas|pasta|espaguetis|macarrones|fideos|arroz|quinoa|avena/i.test(text)) {
      return 'bakery';
    }
    if (/sal|pimienta|orégano|comino|pimentón|curry|canela|romero|tomillo|nuez moscada|azafrán|laurel|eneldo|vainilla|clavo|jengibre|aceite|vinagre|soja|mostaza|mayonesa|kétchup|tabasco/i.test(text)) {
      return 'spices';
    }
    return 'pantry';
  },

  parseNumber(str) {
    if (!str) return 1;
    const clean = str.trim().replace(',', '.');
    const unicodeFractions = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 0.33, '⅔': 0.67, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
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
    if (/^(para\s+(la|el|los|las|hacer|servir|decorar|marinar|el\s+sofrito|la\s+salsa|la\s+masa|el\s+relleno|la\s+bechamel))/i.test(l)) return true;
    if (/^(ingredientes|ingredientes\s+para|instrucciones|paso\s+a\s+paso|preparación|elaboración)/i.test(l)) return true;
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

    const unitWords = 'g|gr|gramos|kg|kilo|kilos|ml|cl|l|litro|litros|cda|cdas|cucharada|cucharadas|cdta|cdtas|cucharadita|cucharaditas|taza|tazas|vaso|vasos|pizca|pizcas|diente|dientes|rebanada|rebanadas|rodaja|rodajas|loncha|lonchas|rama|ramas|hoja|hojas|lata|latas|bote|botes|paquete|paquetes|puñado|puñados|chorro|chorrito|chorritos|sobre|sobres|ud|uds|unidad|unidades';

    let amount = 1;
    let unit = 'ud';
    let name = clean;

    // Pattern 1: Standard quantity first: "200 g de pollo", "3 huevos", "1/2 cucharada de sal"
    const startNumRegex = new RegExp(`^([\\d½¼¾⅓⅔⅛⅜⅝⅞\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s*(${unitWords})?\\s*(?:de\\s+)?(.*)$`, 'i');
    const startMatch = clean.match(startNumRegex);

    if (startMatch && (isNaN(startMatch[1]) === false || /[\/½¼¾⅓⅔⅛⅜⅝⅞]/.test(startMatch[1]))) {
      amount = this.parseNumber(startMatch[1]);
      unit = startMatch[2] ? this.normalizeUnit(startMatch[2]) : 'ud';
      name = (startMatch[3] || '').trim();
    } else {
      // Pattern 2: Name first, quantity at end: "Tomate triturado 400 g", "Placas de lasaña 12", "Berenjena 1"
      const endNumRegex = new RegExp(`^(.*?)(?::|,)?\\s+([\\d½¼¾⅓⅔⅛⅜⅝⅞\\.,]+(?:\\s*\\/\\s*\\d+)?)\\s*(${unitWords})?$`, 'i');
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

    name = name.replace(/^de\s+/i, '').replace(/:\s*$/, '').trim();
    if (!name) return null;

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

  parseSchemaRecipe(schema) {
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

    const tags = ['Importada'];
    if (schema.recipeCategory) {
      const cats = Array.isArray(schema.recipeCategory) ? schema.recipeCategory : [schema.recipeCategory];
      cats.forEach(c => {
        const catStr = String(c).trim();
        if (catStr && !tags.includes(catStr)) tags.push(catStr);
      });
    }

    return {
      id: 'rec-' + Date.now(),
      title: schema.name ? String(schema.name).trim() : 'Receta Web Importada',
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

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    // Find title: skip initial URLs, empty lines or generic header keywords
    let titleIdx = 0;
    while (titleIdx < lines.length && (lines[titleIdx].startsWith('http') || /^ingredientes/i.test(lines[titleIdx]))) {
      titleIdx++;
    }
    let title = lines[titleIdx] ? lines[titleIdx].replace(/^#+\s*|^Título:\s*|^Receta\s+(?:de\s+)?/i, '').replace(/["']/g, '').trim() : 'Receta Importada';

    let servings = 2;
    let prepTimeMinutes = 15;
    let cookTimeMinutes = 20;

    const ingredients = [];
    const instructions = [];
    let currentSection = null;

    for (let i = titleIdx + 1; i < lines.length; i++) {
      const line = lines[i];

      // Header metadata (servings, times) - only before instructions section begins
      if (currentSection !== 'instructions') {
        const servingsMatch = line.match(/(?:para|rinde|porciones|raciones|comensales|personas|servings)[:\s]+(\d+)/i) ||
                              line.match(/(?:para|de)\s+(\d+)\s*(?:personas|raciones|porciones|comensales|servings)/i) ||
                              line.match(/^(\d+)\s*(?:personas|raciones|porciones|comensales|servings)$/i);
        if (servingsMatch) {
          servings = parseInt(servingsMatch[1], 10);
          continue;
        }

        const prepMatch = line.match(/(?:prep|elaborac).*?(\d+)\s*(?:min|m|minuto)/i);
        if (prepMatch) {
          prepTimeMinutes = parseInt(prepMatch[1], 10);
          continue;
        }

        const cookMatch = line.match(/(?:cocc|horno|cocinado|cook).*?(\d+)\s*(?:min|m|minuto)/i);
        if (cookMatch) {
          cookTimeMinutes = parseInt(cookMatch[1], 10);
          continue;
        }

        const totalMatch = line.match(/(?:tiempo(?:\s*total)?|duraci[oÃ³]n).*?(\d+)\s*(?:min|m|minuto)/i);
        if (totalMatch && cookTimeMinutes === 20) {
          cookTimeMinutes = parseInt(totalMatch[1], 10);
          continue;
        }

        if (/^(?:dificultad|calor[íi]as|autor|categor[íi]a|valoraci[oó]n|coste|precio):/i.test(line)) {
          continue;
        }
      }

      // Section switches
      if (/^(?:ingredientes|lista de ingredientes|lo que necesitas):?$/i.test(line) || /^#+\s*ingredientes/i.test(line)) {
        currentSection = 'ingredients';
        continue;
      }

      if (/^(?:instrucciones|preparaci[oó]n|pasos|elaboraci[oó]n|c[oó]mo hacer(?:lo)?|modo de preparaci[oó]n|paso a paso):?$/i.test(line) || /^#+\s*(?:instrucciones|pasos|preparaci[oó]n|elaboraci[oó]n)/i.test(line)) {
        currentSection = 'instructions';
        continue;
      }

      // Parsing items according to active section
      if (currentSection === 'ingredients') {
        const parsed = this.parseIngredientLine(line);
        if (parsed) ingredients.push(parsed);
      } else if (currentSection === 'instructions') {
        const stepText = line.replace(/^\d+[\.\)]\s*|^paso\s*\d+[:\.\-]\s*/i, '').trim();
        if (stepText && stepText.length > 3) {
          const timerMatch = stepText.match(/(?:durante|por|hervir|cocer|hornear|reposar)?\s*(\d+)\s*(?:min|minutos)/i);
          instructions.push({
            step: instructions.length + 1,
            text: stepText,
            timerMinutes: timerMatch ? parseInt(timerMatch[1], 10) : null
          });
        }
      } else {
        // Line before any explicit section header
        if (/^[\d\-\*•]/.test(line)) {
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
      tags: ['Importada', 'Notas'],
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

  it('parseServings extrae el número de raciones o comensales', () => {
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
            "recipeYield": "4 personas",
            "recipeIngredient": [
              "5 patatas medianas",
              "6 huevos",
              "1 cebolla"
            ],
            "recipeInstructions": [
              { "@type": "HowToStep", "text": "Pelar y cortar las patatas." },
              { "@type": "HowToStep", "text": "Freír a fuego medio." }
            ]
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
    expect(recipe.ingredients).toHaveLength(3);
    expect(recipe.instructions).toHaveLength(2);
    expect(recipe.instructions[0].text).toBe('Pelar y cortar las patatas.');
  });

  it('extractJsonLdFromHtml maneja grafos Schema.org (@graph)', () => {
    const html = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "name": "Blog de Cocina" },
          {
            "@type": "Recipe",
            "name": "Guacamole Casero",
            "recipeYield": 2,
            "recipeIngredient": ["2 aguacates maduros", "1 lima"]
          }
        ]
      }
      </script>
    `;

    const extracted = RecipeParser.extractJsonLdFromHtml(html);
    expect(extracted).not.toBeNull();
    expect(extracted.name).toBe('Guacamole Casero');
  });

  it('parseRecipeText extrae receta a partir de texto libre estructurado', () => {
    const text = `
    Salmón con Verduras al Vapor
    Raciones: 3
    Tiempo: 25 min

    Ingredientes:
    - 3 lomos de salmón
    - 200 g de brócoli
    - 1 cucharada de aceite de oliva

    Instrucciones:
    1. Lavar y cortar el brócoli en ramilletes.
    2. Cocinar el salmón a la plancha 4 minutos por lado.
    3. Servir caliente.
    `;

    const recipe = RecipeParser.parseRecipeText(text);
    expect(recipe).not.toBeNull();
    expect(recipe.title).toBe('Salmón con Verduras al Vapor');
    expect(recipe.servings).toBe(3);
    expect(recipe.cookTimeMinutes).toBe(25);
    expect(recipe.ingredients).toHaveLength(3);
    expect(recipe.instructions).toHaveLength(3);
    expect(recipe.instructions[1].text).toBe('Cocinar el salmón a la plancha 4 minutos por lado.');
  });

  it('parseIngredientLine soporta formato inverso de webs espaÃ±olas (Directo al Paladar, Cookpad)', () => {
    const r1 = RecipeParser.parseIngredientLine('Placas de lasaÃ±a 12');
    expect(r1.amount).toBe(12);
    expect(r1.unit).toBe('ud');
    expect(r1.name).toBe('Placas de lasaÃ±a');
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

  it('parseIngredientLine gestiona ingredientes "al gusto" y descarta cabeceras de secciÃ³n', () => {
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

  it('parseRecipeText procesa recetas completas reales de Directo al Paladar extrayendo raciones, tiempos y pasos con temporizador', () => {
    const rawDirecto = `
    LasaÃ±a de verduras fÃ¡cil y rÃ¡pida
    Tiempo de preparaciÃ³n: 20 min
    Tiempo de cocciÃ³n: 40 min
    Para 4 personas

    Ingredientes
    Placas de lasaÃ±a 12
    Berenjena 1
    CalabacÃ­n 1
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
    1. Cortar las verduras en dados pequeÃ±os.
    2. En una sartÃ©n con aceite de oliva, pochar la cebolla y el pimiento durante 10 minutos.
    3. AÃ±adir el calabacÃ­n y la berenjena y cocinar otros 10 minutos.
    4. Agregar el tomate triturado, salpimentar y dejar reducir a fuego lento 15 minutos.
    5. Preparar la bechamel derritiendo la mantequilla, aÃ±adiendo la harina y vertiendo la leche poco a poco.
    6. Montar la lasaÃ±a alternando pasta, verduras y bechamel.
    7. Terminar con queso rallado y hornear a 200ÂºC durante 25 minutos.
    `;

    const recipe = RecipeParser.parseRecipeText(rawDirecto);
    expect(recipe.title).toBe('LasaÃ±a de verduras fÃ¡cil y rÃ¡pida');
    expect(recipe.servings).toBe(4);
    expect(recipe.prepTimeMinutes).toBe(20);
    expect(recipe.cookTimeMinutes).toBe(40);
    expect(recipe.ingredients).toHaveLength(13);
    expect(recipe.instructions).toHaveLength(7);
    expect(recipe.instructions[1].timerMinutes).toBe(10);
    expect(recipe.instructions[6].timerMinutes).toBe(25);
  });
});
