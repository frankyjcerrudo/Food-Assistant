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
    expect(RecipeParser.parseIngredientLine('Cantidad de la ración')).toBeNull();
    expect(RecipeParser.parseIngredientLine('1 ud Cantidad de la ración')).toBeNull();
    expect(RecipeParser.parseIngredientLine('4')).toBeNull();
    expect(RecipeParser.parseIngredientLine('2 ud 4')).toBeNull();
    expect(RecipeParser.parseIngredientLine('Unidad(es)')).toBeNull();
    expect(RecipeParser.parseIngredientLine('1 ud Unidad(es)')).toBeNull();
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

  it('parseIngredientLine procesa cantidades en texto español (medio, media, dos) y limpia notas explicativas', () => {
    const c1 = RecipeParser.parseIngredientLine('medio diente de ajo');
    expect(c1.amount).toBe(0.5);
    expect(c1.unit).toBe('ud');
    expect(c1.name).toBe('Ajo');

    const c2 = RecipeParser.parseIngredientLine('media cucharada pequeña con sal fina');
    expect(c2.amount).toBe(0.5);
    expect(c2.unit).toBe('cdta');
    expect(c2.name).toBe('Sal');

    const c3 = RecipeParser.parseIngredientLine('500 gramos de tomates maduros (ver nota)');
    expect(c3.amount).toBe(500);
    expect(c3.unit).toBe('g');
    expect(c3.name).toBe('Tomates maduros');

    const c4 = RecipeParser.parseIngredientLine('100 gramos de pan');
    expect(c4.amount).toBe(100);
    expect(c4.unit).toBe('g');
    expect(c4.name).toBe('Pan');

    const c5 = RecipeParser.parseIngredientLine('media cebolla fresca');
    expect(c5.amount).toBe(0.5);
    expect(c5.unit).toBe('ud');
    expect(c5.name).toBe('Cebolla fresca');

    const c6 = RecipeParser.parseIngredientLine('16 septiembre 2026, 16:53');
    expect(c6).toBeNull();

    const comp = RecipeParser.parseIngredientLine('Para acompañar: huevo duro y jamón serrano a taquitos');
    expect(Array.isArray(comp)).toBe(true);
    expect(comp.length).toBe(2);
    expect(comp[0].name).toBe('Huevo');
    expect(comp[0].amount).toBe(1);
    expect(comp[0].unit).toBe('ud');
    expect(comp[0].aisle).toBe('dairy');
    expect(comp[1].name).toBe('Jamón serrano a taquitos');
    expect(comp[1].amount).toBe(1);
    expect(comp[1].unit).toBe('ud');
    expect(comp[1].aisle).toBe('meat');

    const hSolo = RecipeParser.parseIngredientLine('1 huevo duro');
    expect(hSolo.name).toBe('Huevo');
    expect(hSolo.amount).toBe(1);
    expect(hSolo.unit).toBe('ud');
    expect(hSolo.aisle).toBe('dairy');
  });

  it('parseIsoDuration procesa fracciones de hora en español y rangos de cocción', () => {
    expect(RecipeParser.parseIsoDuration('1 hora y media')).toBe(90);
    expect(RecipeParser.parseIsoDuration('media hora')).toBe(30);
    expect(RecipeParser.parseIsoDuration('1 hora y cuarto')).toBe(75);
    expect(RecipeParser.parseIsoDuration('18-20 minutos')).toBe(20);
    expect(RecipeParser.parseIsoDuration('2 o 3 minutos')).toBe(3);
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

  it('procesa correctamente recetas de Directo al Paladar con título "paso a paso" y metadatos de Jina', () => {
    const rawDirecto = [
      'Title: Tortilla de patatas con cebolla: receta tradicional española paso a paso',
      'URL Source: https://www.directoalpaladar.com/recetas-de-huevos-y-tortillas/empezando-en-la-cocina-receta-de-tortilla-de-patatas-con-cebolla/amp',
      'Published Time: 2026-09-16T14:53:16Z',
      'Markdown Content:',
      '![Image 1: Tortilla Patata](https://i.blogs.es/93cdb8/tortilla_patata/650_1200.jpg)',
      '16 septiembre 2026, 16:53',
      '![Image 2: pakus](https://i.blogs.es/093f03/blob/150_150.jpeg)',
      'Editor Senior  977 votos',
      'Quizás la receta de la tortilla de patata sea una de las primeras que todo aspirante a cocinillas debería aprender a hacer.',
      '',
      '## Ingredientes',
      'Para 4 personas',
      '* Patata 4',
      '* Huevo 4',
      '* Cebolla 1',
      '* Aceite de oliva virgen extra',
      '* Sal',
      '',
      '## Cómo hacer tortilla de patatas con cebolla tradicional',
      'Comenzamos con la tarea más larga, la de caramelizar la cebolla que nos llevará unos 30 minutos.',
      'Mientras la cebolla se hace, pelamos las patatas y las cortamos en rodajas finas durante 15 minutos.',
      'Cuajamos la tortilla en una sartén caliente 3 minutos por lado.',
      '',
      'En DAP | Tortilla de patatas con Thermomix'
    ].join('\n');

    const recipe = RecipeParser.parseRecipeText(rawDirecto, 'https://www.directoalpaladar.com/recetas-de-huevos-y-tortillas/tortilla');
    expect(recipe).not.toBeNull();
    expect(recipe.title).toContain('Tortilla de patatas con cebolla');
    expect(recipe.servings).toBe(4);
    expect(recipe.ingredients.length).toBeGreaterThanOrEqual(4);
    expect(recipe.ingredients.some(i => i.name.toLowerCase().includes('septiembre'))).toBe(false);
    expect(recipe.instructions.length).toBe(3);
    // Ensure metadata was NOT added as instruction steps
    expect(recipe.instructions[0].text).toContain('caramelizar la cebolla');
    expect(recipe.instructions.some(i => i.text.includes('URL Source') || i.text.includes('Editor Senior'))).toBe(false);
  });

  it('elimina imágenes inline markdown de ingredientes e instrucciones y calcula temporizadores complejos (caso Bon Viveur)', () => {
    const rawBonViveur = [
      'Title: Risotto de boletus: una receta italiana exquisita y muy fácil de preparar',
      'URL Source: https://bonviveur.com/es/recetas/risotto-de-boletus?hl=es-ES',
      '',
      '## Ingredientes del risotto de boletus',
      '* 20 g de boletus deshidratados',
      '* 180 g de arroz para risotto',
      '* 500 ml de caldo de verduras',
      '* 2 cda de aceite de oliva virgen extra',
      '![Image 2: Ingredientes para preparar el risotto de boletus](https://imag.bonviveur.com/ingredientes-para-preparar-el-risotto-de-boletus.jpg)',
      '',
      '## Cómo hacer el risotto de boletus',
      '![Image 3: Rehidratar boletus para hacer el risotto](https://imag.bonviveur.com/rehidratar-boletus-para-hacer-el-risotto.jpg)',
      'Para hacer el risotto de boletus lo primero que hay que hacer es rehidratar 20 g de boletus deshidratados en agua fría y los dejamos a remojo durante 1 hora y media aproximadamente.',
      '![Image 4: Picar boletus para hacer el risotto](https://imag.bonviveur.com/picar-boletus-para-hacer-el-risotto.jpg)',
      'Transcurrido este tiempo, escurrimos y picamos los boletus, y reservamos el agua de hidratación.',
      'Pasados 2 o 3 minutos, añadimos medio vaso de vino blanco y dejamos que se evapore durante toda la cocción del arroz mientras este se va cociendo y absorbiendo el caldo, lo que nos llevará unos 18-20 minutos.',
      'María Ángeles Fernández Viajera gastronómica y periodista intrépida.'
    ].join('\n');

    const recipe = RecipeParser.parseRecipeText(rawBonViveur, 'https://bonviveur.com/es/recetas/risotto-de-boletus');
    expect(recipe).not.toBeNull();
    // No images in ingredients
    expect(recipe.ingredients.some(i => i.name.includes('Image') || i.name.includes('bonviveur'))).toBe(false);
    expect(recipe.ingredients.length).toBe(4);
    // No images in instructions
    expect(recipe.instructions.some(i => i.text.includes('Image') || i.text.includes('bonviveur'))).toBe(false);
    expect(recipe.instructions.length).toBe(3);
    expect(recipe.instructions[0].text).toContain('rehidratar 20 g de boletus');
    // Step 1: "1 hora y media" should be 90 minutes
    expect(recipe.instructions[0].timerMinutes).toBe(90);
    // Step 3: "lo que nos llevará unos 18-20 minutos" should be 20 minutes
    expect(recipe.instructions[2].timerMinutes).toBe(20);
  });

  it('reconoce cabeceras tipo "### RECETA DE...", procesa ingredientes con gramos/cantidades en texto y limpia notas (caso Javi Recetas)', () => {
    const rawSalmorejo = [
      'Title: SALMOREJO CORDOBÉS - Receta Súper FÁCIL - Javi Recetas',
      'URL Source: https://www.javirecetas.com/salmorejo-cordobes/',
      '',
      '## INGREDIENTES PARA EL SALMOREJO:',
      '* 500 gramos de tomates maduros (ver nota)',
      '* 100 gramos de pan',
      '* 50 ml de aceite de oliva (una 5 cucharadas)',
      '* medio diente de ajo',
      '* media cucharada pequeña con sal fina',
      '* Para acompañar: huevo duro y jamón serrano a taquitos',
      '',
      '### RECETA DE SALMOREJO CORDOBÉS:',
      '1. Opcional: Yo antes pelaba los tomates para que el salmorejo quedara más fino.',
      '2. Corta los tomates en trozos y ponlos en el vaso de una batidora y tritura todo bien.',
      '3. Trocea el pan y ponlo en un recipiente hondo. Añade por encima el tomate triturado.',
      '4. Pela el ajo y quítale el centro para que no repita. Añádelo al pan y al tomate.',
      '5. Añade el aceite y la sal fina. Tritura todo durante un buen rato hasta que quede fino.'
    ].join('\n');

    const recipe = RecipeParser.parseRecipeText(rawSalmorejo, 'https://www.javirecetas.com/salmorejo-cordobes/');
    expect(recipe).not.toBeNull();
    // Ingredients should only contain the actual ingredients with clean names
    expect(recipe.ingredients.length).toBe(7);
    expect(recipe.ingredients.some(i => i.name.toLowerCase().includes('tritura') || i.name.toLowerCase().includes('trocea'))).toBe(false);

    const tomates = recipe.ingredients.find(i => i.name.toLowerCase().includes('tomate'));
    expect(tomates.name).toBe('Tomates maduros');
    expect(tomates.amount).toBe(500);
    expect(tomates.unit).toBe('g');

    const pan = recipe.ingredients.find(i => i.name.toLowerCase() === 'pan');
    expect(pan.amount).toBe(100);
    expect(pan.unit).toBe('g');

    const aceite = recipe.ingredients.find(i => i.name.toLowerCase().includes('aceite'));
    expect(aceite.name).toBe('Aceite de oliva');
    expect(aceite.amount).toBe(50);
    expect(aceite.unit).toBe('ml');

    const ajo = recipe.ingredients.find(i => i.name.toLowerCase() === 'ajo');
    expect(ajo.amount).toBe(0.5);
    expect(ajo.unit).toBe('ud');

    const sal = recipe.ingredients.find(i => i.name.toLowerCase() === 'sal');
    expect(sal.amount).toBe(0.5);

    const huevo = recipe.ingredients.find(i => i.name === 'Huevo');
    expect(huevo).toBeDefined();
    expect(huevo.amount).toBe(1);
    expect(huevo.unit).toBe('ud');
    expect(huevo.aisle).toBe('dairy');

    const jamon = recipe.ingredients.find(i => i.name.toLowerCase().includes('jamón serrano'));
    expect(jamon).toBeDefined();
    expect(jamon.name).toBe('Jamón serrano a taquitos');
    expect(jamon.amount).toBe(1);
    expect(jamon.unit).toBe('ud');
    expect(jamon.aisle).toBe('meat');

    // Instructions should contain the 5 cooking steps
    expect(recipe.instructions.length).toBe(5);
    expect(recipe.instructions[1].text).toContain('Corta los tomates en trozos');
  });

  it('termina la captura de instrucciones antes de los consejos y trucos del blog (caso Hogarmania)', () => {
    const rawHogarmania = [
      'Title: Karlos Arguiñano te enseña cómo hacer pollo al horno jugoso y crujiente',
      'URL Source: https://www.hogarmania.com/cocina/recetas/carnes/pollo-al-horno.html',
      '',
      '## Ingredientes',
      '* 1 pollo entero limpio',
      '* 3 patatas',
      '* 1 cebolla',
      '* 1 vaso de vino blanco',
      '',
      '## Cómo hacer un pollo asado al horno',
      '1. Precalienta el horno a 180º con calor arriba y abajo.',
      '2. Sazona el pollo por dentro y por fuera y colócalo en la bandeja durante 45 minutos.',
      '3. Sirve el pollo asado en un plato con su guarnición.',
      '',
      '## Dale un toque más de sabor a tu pollo al horno',
      'Karlos Arguiñano nos propone hacer la receta de pollo asado con manzana para darle un extra de dulzor.',
      'Pela las manzanas y córtalas en rodajas.',
      '## Trucos y consejos para preparar pollo al horno',
      'Cómo conseguir que el pollo al horno quede jugoso'
    ].join('\n');

    const recipe = RecipeParser.parseRecipeText(rawHogarmania, 'https://www.hogarmania.com/cocina/recetas/carnes/pollo-al-horno.html');
    expect(recipe).not.toBeNull();
    expect(recipe.ingredients.length).toBe(4);
    // Should stop before "Dale un toque más..."
    expect(recipe.instructions.length).toBe(3);
    expect(recipe.instructions[2].text).toContain('Sirve el pollo asado');
    expect(recipe.instructions.some(i => i.text.includes('Dale un toque') || i.text.includes('Trucos y consejos'))).toBe(false);
  });

  it('soporta recetas sin cabecera de instrucciones, enlaces en ingredientes y unidades como dl o copita (caso Cookpad)', () => {
    const rawCookpad = [
      'Title: Buñuelos De Manzana "Finisterre" Receta de carme castillo',
      'URL Source: https://cookpad.com/es/recetas/111818',
      'Markdown Content:',
      '6 raciones',
      '*   600 gr manzanas',
      '*   1/2 litro aceite',
      '*   200 gr[harina](https://cookpad.com/es/buscar/harina)',
      '*   25 gr azúcar',
      '*   200 gr mermelada de fresa',
      '*   2 huevos',
      '*   2 dl.[cerveza](https://cookpad.com/es/buscar/cerveza)',
      '*   1 copita[ron](https://cookpad.com/es/buscar/ron)',
      '',
      '1.   1 Se pelan las manzanas y se cortan en rodajas de 1/2 ml de grosor, eliminando el corazón.',
      '2.   2 En un bowl preparar la harina, con la yema de los dos huevos, una pizca de sal y la cerveza.',
      '3.   3 A continuación se baten las claras de huevo a punto de nieve y se agregan a la mezcla.',
      '4.   4 Con la mezcla que hemos hecho, se rebozan las rodajas de manzana y se fríen en aceite caliente.',
      '5.   5 Se presenta en una bandeja o plato y antes de servirlas se cubren con mermelada.',
      '',
      '## ¿Has hecho la receta? ¡Comparte una Cooksnap!',
      'Dile al carme castillo cómo te quedó.',
      '¡No hay nada mejor para dar las gracias que una foto!',
      '11 de marzo de 2010',
      '![Image 4: Foto principal de Buñuelos de manzana](https://img-global.cpcdn.com/recipes/cef86bab5d23afa3/240x320cq80/photo.jpg)'
    ].join('\n');

    const recipe = RecipeParser.parseRecipeText(rawCookpad, 'https://cookpad.com/es/recetas/111818');
    expect(recipe).not.toBeNull();
    expect(recipe.servings).toBe(6);
    // Ingredients should parse 8 items with cleaned names (no markdown link syntax)
    expect(recipe.ingredients.length).toBe(8);

    const manzanas = recipe.ingredients.find(i => i.name.toLowerCase().includes('manzana'));
    expect(manzanas.name).toBe('Manzanas');
    expect(manzanas.amount).toBe(600);
    expect(manzanas.unit).toBe('g');

    const harina = recipe.ingredients.find(i => i.name.toLowerCase().includes('harina'));
    expect(harina).toBeDefined();
    expect(harina.name).toBe('Harina');
    expect(harina.amount).toBe(200);
    expect(harina.unit).toBe('g');

    const cerveza = recipe.ingredients.find(i => i.name.toLowerCase().includes('cerveza'));
    expect(cerveza.name).toBe('Cerveza');
    expect(cerveza.amount).toBe(2);
    expect(cerveza.unit).toBe('dl');

    const ron = recipe.ingredients.find(i => i.name.toLowerCase().includes('ron'));
    expect(ron.name).toBe('Ron');
    expect(ron.amount).toBe(1);
    expect(ron.unit).toBe('copita');

    // Numbered steps with action verbs automatically detected as instructions
    expect(recipe.instructions.length).toBe(5);
    // Double numbering cleaned
    expect(recipe.instructions[0].text).not.toMatch(/^1\b/);
    expect(recipe.instructions[0].text).toContain('Se pelan las manzanas');

    // Date and footer image not in ingredients
    expect(recipe.ingredients.some(i => i.name.includes('marzo') || i.name.includes('Image'))).toBe(false);
    expect(recipe.instructions.some(i => i.text.includes('Cooksnap') || i.text.includes('foto'))).toBe(false);
  });

  it('parseIngredientLine y parseSchemaRecipe procesan correctamente recetas de HelloFresh con unidades como unidad(es), gramo(s), y pasos con HTML', () => {
    // 1. Ingredients parsing with HelloFresh unit variations
    const ing1 = RecipeParser.parseIngredientLine('1 unidad(es) Manzana');
    expect(ing1).not.toBeNull();
    expect(ing1.name).toBe('Manzana');
    expect(ing1.amount).toBe(1);
    expect(ing1.unit).toBe('ud');

    const ing2 = RecipeParser.parseIngredientLine('380 gramo(s) Lentejas');
    expect(ing2).not.toBeNull();
    expect(ing2.name).toBe('Lentejas');
    expect(ing2.amount).toBe(380);
    expect(ing2.unit).toBe('g');

    const ing3 = RecipeParser.parseIngredientLine('½ unidad(es) Cebolla');
    expect(ing3).not.toBeNull();
    expect(ing3.name).toBe('Cebolla');
    expect(ing3.amount).toBe(0.5);
    expect(ing3.unit).toBe('ud');

    const ing4 = RecipeParser.parseIngredientLine('1 sobre(s) Caldo vegetal');
    expect(ing4).not.toBeNull();
    expect(ing4.name).toBe('Caldo vegetal');
    expect(ing4.amount).toBe(1);
    expect(ing4.unit).toBe('sobre');

    const ing5 = RecipeParser.parseIngredientLine('500 mililitro(s) Agua');
    expect(ing5).not.toBeNull();
    expect(ing5.name).toBe('Agua');
    expect(ing5.amount).toBe(500);
    expect(ing5.unit).toBe('ml');

    const allergen = RecipeParser.parseIngredientLine('(Contiene: Apio)');
    expect(allergen).toBeNull();

    // 2. Full Schema.org parsing with HTML tags in instructions
    const helloFreshSchema = {
      "@context": "http://schema.org/",
      "@type": "Recipe",
      "name": "Crema casera de calabacín y manzana con lentejas crujientes al horno",
      "recipeYield": 2,
      "totalTime": "PT35M",
      "recipeIngredient": [
        "1 unidad(es) Manzana",
        "1 unidad(es) Calabacín",
        "380 gramo(s) Lentejas",
        "1 unidad(es) Puerro",
        "½ unidad(es) Cebolla",
        "1 sobre(s) Caldo vegetal",
        "200 gramo(s) Crème Fraîche",
        "1 sobre(s) Nuez moscada",
        "1 pizca(s) Sal y pimienta",
        "2 cucharada(s) Aceite de oliva",
        "1 unidad(es) Ajo",
        "500 mililitro(s) Agua"
      ],
      "recipeInstructions": [
        {
          "@type": "HowToStep",
          "text": "<div>¡Asegúrate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 200ºC. Escurre las <strong>lentejas</strong> con ayuda de un colador.</div>"
        },
        {
          "@type": "HowToStep",
          "text": "<p>Reparte las <strong>lentejas</strong> en una bandeja y hornea a media altura 15-20 min. Remueve a mitad de cocción.</p>"
        }
      ]
    };

    const parsed = RecipeParser.parseSchemaRecipe(helloFreshSchema, 'https://www.hellofresh.es/recipes/crema-casera-de-calabacin-y-manzana-650afe12270f68660e1b06a1');
    expect(parsed).not.toBeNull();
    expect(parsed.title).toBe('Crema casera de calabacín y manzana con lentejas crujientes al horno');
    expect(parsed.servings).toBe(2);
    expect(parsed.ingredients).toHaveLength(12);

    expect(parsed.ingredients[0].name).toBe('Manzana');
    expect(parsed.ingredients[0].unit).toBe('ud');
    expect(parsed.ingredients[1].name).toBe('Calabacín');
    expect(parsed.ingredients[1].unit).toBe('ud');
    expect(parsed.ingredients[2].name).toBe('Lentejas');
    expect(parsed.ingredients[2].unit).toBe('g');
    expect(parsed.ingredients[2].amount).toBe(380);

    // HTML stripped from steps
    expect(parsed.instructions[0].text).not.toContain('<div>');
    expect(parsed.instructions[0].text).not.toContain('<strong>');
    expect(parsed.instructions[0].text).toBe('¡Asegúrate de utilizar las cantidades indicadas a la izquierda para preparar tu receta! Precalienta el horno a 200ºC. Escurre las lentejas con ayuda de un colador.');
    expect(parsed.instructions[1].text).not.toContain('<p>');
    expect(parsed.instructions[1].timerMinutes).toBe(20);
  });

  it('BUG-09: editar una receta importada (guardada o en borrador de revisión) conserva sourceUrl y sourceDomain', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    document.documentElement.innerHTML = fs.readFileSync(htmlPath, 'utf-8');
    const app = new window.FoodAssistantApp();
    const importedRecipe = {
      id: 'rec-imported-bug09',
      title: 'Paella Original',
      description: 'Receta tradicional',
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
      tags: ['Almuerzo'],
      sourceUrl: 'https://www.directoalpaladar.com/recetas-de-arroces/paella',
      sourceDomain: 'directoalpaladar.com',
      ingredients: [{ id: 'ing-1', name: 'Arroz', amount: 400, unit: 'g', aisle: 'pantry' }],
      instructions: [{ step: 1, text: 'Cocer el arroz', timerMinutes: 20 }]
    };

    window.state.recipes = [importedRecipe];
    app.openEditRecipeModal(importedRecipe.id);
    document.getElementById('edit-recipe-title').value = 'Paella Editada por Franky';
    app.saveRecipeEdit();

    const saved = window.state.recipes.find(r => r.id === 'rec-imported-bug09');
    expect(saved).toBeDefined();
    expect(saved.title).toBe('Paella Editada por Franky');
    expect(saved.sourceUrl).toBe('https://www.directoalpaladar.com/recetas-de-arroces/paella');
    expect(saved.sourceDomain).toBe('directoalpaladar.com');
  });
});
