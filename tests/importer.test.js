import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { RecipeParser } = window;

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
            "recipeYield": "4 raciones",
            "recipeIngredient": ["5 patatas medianas", "6 huevos", "Aceite de oliva", "Sal"],
            "recipeInstructions": ["Pelar y cortar las patatas.", "Freír a fuego medio.", "Batir los huevos y mezclar.", "Cuajar la tortilla."]
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
          { "@type": "WebSite", "name": "Cocina Fácil" },
          {
            "@type": "Recipe",
            "name": "Guacamole Casero",
            "recipeIngredient": ["2 aguacates maduros", "1 lima", "1 tomate pequeño", "Cilantro fresco", "Sal al gusto"],
            "recipeInstructions": ["Chafar los aguacates.", "Añadir el resto de ingredientes y mezclar."]
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
    Salmón con Verduras al Vapor
    Raciones: 3
    Tiempo de preparación: 10 min
    Tiempo de cocción: 25 min

    Ingredientes:
    - 3 lomos de salmón
    - 200 g de brócoli
    - 2 zanahorias

    Instrucciones:
    1. Cortar las verduras en trozos medianos.
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

  it('parseIngredientLine soporta formato inverso de webs españolas (Directo al Paladar, Cookpad)', () => {
    const r1 = RecipeParser.parseIngredientLine('Placas de lasaña 12');
    expect(r1.amount).toBe(12);
    expect(r1.unit).toBe('ud');
    expect(r1.name).toBe('Placas de lasaña');
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
    expect(r3.aisle).toBe('produce');

    const r4 = RecipeParser.parseIngredientLine('Pimiento rojo 0.5');
    expect(r4.amount).toBe(0.5);
    expect(r4.unit).toBe('ud');
    expect(r4.name).toBe('Pimiento rojo');
    expect(r4.aisle).toBe('produce');
  });

  it('parseIngredientLine gestiona ingredientes "al gusto" y descarta cabeceras de sección', () => {
    const ingGusto = RecipeParser.parseIngredientLine('Sal y pimienta al gusto');
    expect(ingGusto).not.toBeNull();
    expect(ingGusto.amount).toBe(1);
    expect(ingGusto.unit).toBe('pizca');
    expect(ingGusto.aisle).toBe('spices');

    expect(RecipeParser.parseIngredientLine('Ingredientes:')).toBeNull();
    expect(RecipeParser.parseIngredientLine('Para la bechamel:')).toBeNull();
    expect(RecipeParser.parseIngredientLine('Instrucciones')).toBeNull();
  });

  it('parseIngredientLine elimina prefijos/unidades "count" y normaliza unidades pegadas (Directo al Paladar)', () => {
    const c1 = RecipeParser.parseIngredientLine('1ud.Cebolla');
    expect(c1.amount).toBe(1);
    expect(c1.unit).toBe('ud');
    expect(c1.name).toBe('Cebolla');

    const c2 = RecipeParser.parseIngredientLine('2ud. Diente de ajo');
    expect(c2.amount).toBe(2);
    expect(c2.unit).toBe('ud');
    expect(c2.name).toBe('Diente de ajo');

    const c3 = RecipeParser.parseIngredientLine('4count Diente de ajo');
    expect(c3.amount).toBe(4);
    expect(c3.unit).toBe('ud');
    expect(c3.name).toBe('Diente de ajo');

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

    const rawText = "Curry rápido\nIngredientes:\n1 cebolla\nInstrucciones:\n1. Picar.";
    const rText = RecipeParser.parseRecipeText(rawText);
    expect(rText.tags).not.toContain('Importada');
    expect(rText.tags).not.toContain('Notas');
  });

  it('parseSchemaRecipe incluye sourceUrl y sourceDomain para atribución de fuente original', () => {
    const fakeSchema = {
      '@type': 'Recipe',
      name: 'Paella Valenciana',
      recipeIngredient: ['400g Arroz', '1 Pollo troceado'],
      recipeInstructions: ['Cocinar la carne.', 'Añadir arroz y caldo.']
    };
    const recipe = RecipeParser.parseSchemaRecipe(fakeSchema, 'https://www.directoalpaladar.com/recetas/paella-valenciana');
    expect(recipe.sourceUrl).toBe('https://www.directoalpaladar.com/recetas/paella-valenciana');
    expect(recipe.sourceDomain).toBe('directoalpaladar.com');
  });

  it('parseRecipeText procesa recetas completas reales de Directo al Paladar extrayendo raciones, tiempos y pasos con temporizador', () => {
    const rawDirecto = `
    Lasaña de verduras fácil y rápida
    Tiempo de preparación: 20 min
    Tiempo de cocción: 40 min
    Para 4 personas

    Ingredientes
    Placas de lasaña 12
    Berenjena 1
    Calabacín 1
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
    1. Cortar las verduras en dados pequeños.
    2. En una sartén con aceite de oliva, pochar la cebolla y el pimiento durante 10 minutos.
    3. Añadir el calabacín y la berenjena y cocinar otros 10 minutos.
    4. Agregar el tomate triturado, salpimentar y dejar reducir a fuego lento 15 minutos.
    5. Preparar la bechamel derritiendo la mantequilla, añadiendo la harina y vertiendo la leche poco a poco.
    6. Montar la lasaña alternando pasta, verduras y bechamel.
    7. Terminar con queso rallado y hornear a 200ºC durante 25 minutos.
    `;

    const recipe = RecipeParser.parseRecipeText(rawDirecto);
    expect(recipe.title).toBe('Lasaña de verduras fácil y rápida');
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
    const rawCubano = [
      "Bocadillo Cubano completamente casero \u2014 diegodoal",
      "",
      "DIFICULTAD: INTERMEDIA - INGREDIENTES: F\u00C1CIL - TIEMPO: 5 HORAS",
      "TIEMPO ACTIVO: 2 HORAS - CANTIDAD: 4 BOCADILLOS",
      "INGREDIENTES",
      "- CERDO ASADO CUBANO",
      "2 kg de aguja de cerdo deshuesada",
      "Sal",
      "Mojo:",
      "60 ml de zumo de lima",
      "120 ml de zumo de naranja",
      "60 ml de aceite de oliva virgen extra",
      "1 cucharada de or\u00E9gano seco",
      "- PAN DE CUBANO",
      "350 g de harina de fuerza",
      "15 g de az\u00FAcar",
      "5 g de levadura instant\u00E1nea de panadero",
      "9 g de sal",
      "250 ml de agua templada",
      "30 g de manteca de cerdo",
      "- BOCADILLO CUBANO (1)",
      "Cerdo asado cubano",
      "4 lonchas de jam\u00F3n cocido finas",
      "2 lonchas de queso emmental",
      "Mostaza amarilla",
      "Pepinillos",
      "Mantequilla",
      "M\u00C9TODO",
      "- CERDO ASADO CUBANO",
      "Limpia la aguja de cerdo si tiene hueso. S\u00E1lala por toda la superficie abundantemente.",
      "En un bol, mezcla todos los ingredientes del mojo. Reserva la mitad en la nevera y con la otra mitad marina la carne. D\u00E9jala en la nevera al menos dos horas, pero idealmente toda la noche.",
      "Envuelve el trozo de carne y sus jugos con papel de aluminio y m\u00E9telo a un horno a 180 grados, calor solo por abajo, dos horas.",
      "Desenvu\u00E9lvelo, b\u00E1\u00F1alo con sus jugos, y devu\u00E9lvelo al horno 2 horas m\u00E1s. B\u00E1\u00F1alo con los jugos cada 30 minutos.",
      "S\u00E1calo del horno y d\u00E9jalo reposar 15 minutos. Mientras, mezcla sus jugos con el mojo que hab\u00EDamos reservado en la nevera.",
      "R\u00F3mpelo en trozos medianos con las manos o dos tenedores. Vierte el mojo por toda la carne y mezcla bien.",
      "- PAN DE CUBANO",
      "En un bol grande, a\u00F1ade la harina de fuerza, el az\u00FAcar, la levadura instant\u00E1nea y la sal. Mezcla con unas varillas.",
      "Haz un hueco en el centro y a\u00F1ade el agua. Mezcla con unas varillas y despu\u00E9s con las manos, hasta que toda la harina se integre.",
      "A\u00F1ade la manteca a temperatura ambiente e int\u00E9grala en la masa. Amasa en una mesa durante 8-9 minutos, hasta que sea el\u00E1stica y rebote al tacto.",
      "Haz una bola con la masa y d\u00E9jala reposar en un bol tapada con un trapo h\u00FAmedo, durante 45 minutos, o hasta que retomen la forma."
    ].join("\n");

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

    // Ensure section headers like "- PAN DE CUBANO" or "MÉTODO" are not ingredients
    const metodoIng = recipe.ingredients.find(i => i.name.toLowerCase().includes('m\u00E9todo'));
    expect(metodoIng).toBe(undefined);

    // Instructions should be parsed under MÉTODO
    expect(recipe.instructions.length).toBeGreaterThanOrEqual(10);
    expect(recipe.instructions[0].text).toContain('Limpia la aguja de cerdo');
  });

  it('htmlToText y parseRecipeText procesan contenido Markdown de Jina Reader (# Ingredientes, ## Cómo hacer...)', () => {
    const sampleMd = [
      'Title: Bolitas de garbanzos y brócoli al horno: receta fácil',
      'URL Source: https://www.directoalpaladar.com/recetas-vegetarianas/bolitas-garbanzos',
      '',
      '## Ingredientes',
      'Para 4 personas',
      '* 400 g Garbanzos cocidos escurridos',
      '* 100 g Brócoli',
      '* 1 ud. Cebolla',
      '',
      '## Cómo hacer bolitas de garbanzos y brócoli',
      'Dificultad: Fácil',
      '* Tiempo total 40 min',
      '',
      'Separamos los floretes y lo ponemos a cocer tres minutos.',
      'Aplastar los garbanzos en un bol.',
      'Hornear a 200 grados durante 20 minutos.'
    ].join('\n');

    const cleanedText = RecipeParser.htmlToText(sampleMd);
    expect(cleanedText).toBe(sampleMd);

    const recipe = RecipeParser.parseRecipeText(cleanedText, 'https://www.directoalpaladar.com/recetas-vegetarianas/bolitas-garbanzos');
    expect(recipe).not.toBeNull();
    expect(recipe.title).toBe('Bolitas de garbanzos y brócoli al horno: receta fácil');
    expect(recipe.servings).toBe(4);
    expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
    expect(recipe.instructions.length).toBeGreaterThanOrEqual(3);
    expect(recipe.sourceDomain).toBe('directoalpaladar.com');
  });
});
