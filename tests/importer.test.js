import { describe, it, expect } from 'vitest';

// RecipeParser implementation under test
const RecipeParser = {
  parseIsoDuration(durationStr) {
    if (!durationStr) return 15;
    if (typeof durationStr === 'number') return durationStr;
    const str = String(durationStr).trim();
    const simpleMatch = str.match(/^(\d+)\s*(min|m|minutos)?$/i);
    if (simpleMatch) return parseInt(simpleMatch[1], 10);

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

  categorizeAisle(ingredientName) {
    const text = ingredientName.toLowerCase();
    if (/pollo|ternera|carne|cerdo|pavo|jamón|salmón|pescado|atún|merluza|gambas|langostinos|bacon|lomo|chorizo|hamburguesa|filete/i.test(text)) {
      return 'meat';
    }
    if (/leche|queso|mantequilla|yogur|nata|huevo|huevos|parmesano|mozzarella|crema/i.test(text)) {
      return 'dairy';
    }
    if (/tomate|cebolla|ajo|patata|aguacate|espinaca|lechuga|zanahoria|limón|manzana|plátano|champiñón|seta|pimiento|calabacín|pepino|fresa|arándano/i.test(text)) {
      return 'produce';
    }
    if (/harina|pan|levadura|masa|hojaldre|tortilla|galleta/i.test(text)) {
      return 'bakery';
    }
    if (/sal|pimienta|orégano|comino|pimentón|curry|canela|albahaca|perejil|romero|tomillo|nuez moscada|azafrán/i.test(text)) {
      return 'spices';
    }
    return 'pantry';
  },

  normalizeUnit(rawUnit) {
    const u = rawUnit.toLowerCase().trim();
    if (/^(g|gramos|gr)$/.test(u)) return 'g';
    if (/^(kg|kilos|kilo)$/.test(u)) return 'kg';
    if (/^(ml|mililitros)$/.test(u)) return 'ml';
    if (/^(l|litro|litros)$/.test(u)) return 'l';
    if (/^(cda|cucharada|cucharadas)$/.test(u)) return 'cda';
    if (/^(cdta|cucharadita|cucharaditas)$/.test(u)) return 'cdta';
    if (/^(taza|tazas)$/.test(u)) return 'taza';
    if (/^(vaso|vasos)$/.test(u)) return 'vaso';
    if (/^(pizca|pizcas)$/.test(u)) return 'pizca';
    if (/^(diente|dientes)$/.test(u)) return 'diente';
    if (/^(rebanada|rebanadas)$/.test(u)) return 'rebanada';
    return 'ud';
  },

  parseIngredientLine(rawLine) {
    if (!rawLine || typeof rawLine !== 'string') return null;
    let clean = rawLine.replace(/^([\u2022\-\*]|\d+[\.\)])\s*/, '').trim();
    if (!clean) return null;

    let amount = 1;
    let unit = 'ud';
    let name = clean;

    const fractionRegex = /^(\d+)?\s*(\d+)\/(\d+)\s*(g|kg|ml|l|cda|cdta|cucharada|cucharadas|cucharadita|cucharaditas|taza|tazas|vaso|vasos|pizca|diente|dientes|rebanada|rebanadas)?\s*(?:de\s+)?(.*)$/i;
    const fracMatch = clean.match(fractionRegex);

    if (fracMatch) {
      const whole = fracMatch[1] ? parseInt(fracMatch[1], 10) : 0;
      const num = parseInt(fracMatch[2], 10);
      const denom = parseInt(fracMatch[3], 10) || 1;
      amount = Math.round((whole + num / denom) * 100) / 100;
      unit = fracMatch[4] ? this.normalizeUnit(fracMatch[4]) : 'ud';
      name = fracMatch[5].trim();
    } else {
      const numRegex = /^([\d\.,]+)\s*(g|kg|ml|l|litro|litros|gramos|kilos|cda|cdta|cucharada|cucharadas|cucharadita|cucharaditas|taza|tazas|vaso|vasos|pizca|pizcas|diente|dientes|rebanada|rebanadas|rama|ramas)?\s*(?:de\s+)?(.*)$/i;
      const match = clean.match(numRegex);
      if (match) {
        amount = parseFloat(match[1].replace(',', '.'));
        if (isNaN(amount)) amount = 1;
        unit = match[2] ? this.normalizeUnit(match[2]) : 'ud';
        name = match[3].trim() || match[2] || clean;
      }
    }

    name = name.replace(/^de\s+/i, '').trim();
    if (!name) name = clean;

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
        if (cleaned) instructions.push({ step: instructions.length + 1, text: cleaned, timerMinutes: null });
      } else if (item.text) {
        instructions.push({ step: instructions.length + 1, text: item.text.trim(), timerMinutes: null });
      } else if (item.itemListElement && Array.isArray(item.itemListElement)) {
        item.itemListElement.forEach(sub => processItem(sub));
      }
    };

    if (Array.isArray(rawInstructions)) rawInstructions.forEach(inst => processItem(inst));
    else if (typeof rawInstructions === 'string') rawInstructions.split(/\r?\n/).forEach(l => processItem(l));

    return {
      id: 'rec-' + Date.now(),
      title: schema.name ? String(schema.name).trim() : 'Receta Web Importada',
      description: schema.description ? String(schema.description).trim() : '',
      imageUrl: imageUrl,
      prepTimeMinutes: this.parseIsoDuration(schema.prepTime),
      cookTimeMinutes: this.parseIsoDuration(schema.cookTime || schema.totalTime),
      servings: this.parseServings(schema.recipeYield),
      tags: ['Importada'],
      ingredients: ingredients,
      instructions: instructions
    };
  },

  parseRecipeText(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    let title = lines[0].replace(/^#+\s*|^Título:\s*/i, '');
    let servings = 2;
    let prepTimeMinutes = 15;
    let cookTimeMinutes = 20;

    const ingredients = [];
    const instructions = [];
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const servingsMatch = line.match(/(?:raciones|personas|comensales|porciones|servings)[:\s]+(\d+)/i);
      if (servingsMatch) {
        servings = parseInt(servingsMatch[1], 10);
        continue;
      }
      const timeMatch = line.match(/(?:tiempo|preparación|cocción)[:\s]+(\d+)\s*(?:min|minutos)?/i);
      if (timeMatch) {
        cookTimeMinutes = parseInt(timeMatch[1], 10);
        continue;
      }
      if (/^ingredientes:?$/i.test(line) || /^#+\s*ingredientes/i.test(line)) {
        currentSection = 'ingredients';
        continue;
      }
      if (/^(?:instrucciones|preparación|pasos|elaboración):?$/i.test(line) || /^#+\s*(?:instrucciones|pasos|preparación)/i.test(line)) {
        currentSection = 'instructions';
        continue;
      }

      if (currentSection === 'ingredients') {
        const parsed = this.parseIngredientLine(line);
        if (parsed) ingredients.push(parsed);
      } else if (currentSection === 'instructions') {
        const stepText = line.replace(/^\d+[\.\)]\s*/, '').trim();
        if (stepText) {
          instructions.push({ step: instructions.length + 1, text: stepText, timerMinutes: null });
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
});
