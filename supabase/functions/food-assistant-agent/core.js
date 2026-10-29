/**
 * Food Assistant - Núcleo del Agente Externo (US-69, Fase 3)
 *
 * Lógica PURA y sin dependencias de runtime (Deno / Node / navegador) compartida por:
 *  - la Supabase Edge Function `food-assistant-agent` (index.ts)
 *  - los tests de Vitest (tests/agent.test.js)
 *
 * El acceso a datos se abstrae mediante un adaptador `db`:
 *   db.select(table)            -> Promise<Array<row>>  (ya filtrado por usuario)
 *   db.upsert(table, rows)      -> Promise<void>
 *   db.remove(table, ids)       -> Promise<void>
 */

export const TOKEN_PREFIX = 'fa_live_';
export const SLOT_KEYS = ['breakfast', 'lunch', 'snack', 'dinner'];
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ---------------------------------------------------------------- Tokens

export function generateAgentToken() {
  const uuid = (globalThis.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`).replace(/-/g, '');
  return `${TOKEN_PREFIX}${uuid}`;
}

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function extractBearerToken(headerValue) {
  const m = /^Bearer\s+(\S+)$/i.exec(String(headerValue || '').trim());
  return m && m[1].startsWith(TOKEN_PREFIX) ? m[1] : null;
}

// ---------------------------------------------------------------- Fechas

export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Semana ISO (Lunes-Domingo) que contiene `now`. */
export function getWeekDays(now = new Date()) {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const offset = (base.getDay() + 6) % 7; // 0 = lunes
  base.setDate(base.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    return { dateKey: toDateKey(d), dayName: DAY_NAMES[d.getDay()] };
  });
}

function dayNameFromKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return DAY_NAMES[new Date(y, m - 1, d).getDay()];
}

const isDateKey = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

// ---------------------------------------------------------------- Utilidades

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

function randomId(prefix) {
  const u = (globalThis.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`).replace(/-/g, '').slice(0, 12);
  return `${prefix}${u}`;
}

const AISLE_RULES = [
  ['meat', /pollo|pavo|ternera|cerdo|pescado|dorada|salmon|merluza|atun|gamba|jamon|carne|lomo|bacalao|lubina/],
  ['dairy', /leche|yogur|queso|huevo|nata|mantequilla|kefir|requeson/],
  ['produce', /tomate|cebolla|ajo|lechuga|espinaca|calabacin|patata|zanahoria|pimiento|aguacate|platano|manzana|naranja|limon|fresa|esparrago|brocoli|fruta|verdura|champi/],
  ['bakery', /pan\b|tostada|tortita|harina|masa|galleta/],
  ['spices', /aceite|sal\b|pimienta|especia|vinagre|comino|pimenton|oregano|romero/],
  ['frozen', /congelad|helado/],
  ['beverages', /agua|cafe|te\b|zumo|refresco|cerveza|vino|bebida/],
  ['pantry', /arroz|pasta|legumbre|lenteja|garbanzo|avena|azucar|cereal|conserva|frutos secos|chia|proteina/]
];

export function categorizeAisle(name) {
  const n = norm(name);
  const hit = AISLE_RULES.find(([, re]) => re.test(n));
  return hit ? hit[0] : 'other';
}

// ---------------------------------------------------------------- Definición de herramientas (MCP / OpenAPI)

const slotProps = {
  breakfast: { type: 'string', description: 'ID o título exacto de la receta para el desayuno' },
  lunch: { type: 'string', description: 'ID o título exacto de la receta para el almuerzo' },
  snack: { type: 'string', description: 'ID o título exacto de la receta para la merienda' },
  dinner: { type: 'string', description: 'ID o título exacto de la receta para la cena' }
};

export const MCP_TOOLS = [
  {
    name: 'get_food_assistant_context',
    description: 'Devuelve el contexto completo del usuario: preferencias dietéticas, objetivos nutricionales, recetas (id, título, tags, nutrición), plan de la semana actual y lista de la compra pendiente. Llámala SIEMPRE antes de planificar.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'create_and_save_recipe',
    description: 'Crea y guarda una receta nueva en el recetario del usuario. Incluye cantidades realistas y una estimación nutricional POR RACIÓN coherente con los ingredientes.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        prepTimeMinutes: { type: 'integer' },
        cookTimeMinutes: { type: 'integer' },
        servings: { type: 'integer' },
        tags: { type: 'array', items: { type: 'string' } },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, amount: { type: 'number' }, unit: { type: 'string' } },
            required: ['name']
          }
        },
        instructions: {
          type: 'array',
          items: {
            type: 'object',
            properties: { step: { type: 'integer' }, text: { type: 'string' }, timerMinutes: { type: 'integer' } },
            required: ['text']
          }
        },
        nutrition: {
          type: 'object',
          properties: { calories: { type: 'number' }, protein: { type: 'number' }, carbs: { type: 'number' }, fat: { type: 'number' } }
        }
      },
      required: ['title', 'ingredients', 'instructions']
    }
  },
  {
    name: 'set_day_plan',
    description: 'Asigna recetas a las comidas de UN día concreto (YYYY-MM-DD). Solo modifica las comidas indicadas; el resto del día y de la semana no se toca.',
    inputSchema: {
      type: 'object',
      properties: { dateKey: { type: 'string', description: 'YYYY-MM-DD' }, ...slotProps },
      required: ['dateKey']
    }
  },
  {
    name: 'set_weekly_plan',
    description: 'Asigna recetas a varios días a la vez. Úsala solo para varios días (ej. "el fin de semana" = sábado y domingo). Solo se tocan los días enviados. mode "merge" rellena solo huecos vacíos; "replace" (por defecto) sobrescribe las comidas indicadas.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['replace', 'merge'] },
        days: {
          type: 'array',
          items: { type: 'object', properties: { dateKey: { type: 'string' }, ...slotProps }, required: ['dateKey'] }
        }
      },
      required: ['days']
    }
  },
  {
    name: 'manage_shopping_list',
    description: "Gestiona la lista de la compra. action 'add' añade SOLO los artículos de 'items'; 'check' los marca comprados; 'remove' los borra; 'add_from_current_plan' vuelca los ingredientes del plan de la semana (solo si el usuario lo pide explícitamente).",
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['add', 'check', 'remove', 'add_from_current_plan'] },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, amount: { type: 'number' }, unit: { type: 'string' } },
            required: ['name']
          }
        }
      },
      required: ['action']
    }
  }
];

// ---------------------------------------------------------------- Adaptadores fila <-> modelo

function recipeToModel(row) {
  return {
    id: row.id,
    title: row.title,
    tags: row.tags || [],
    servings: row.servings,
    nutrition: row.nutrition || null,
    ingredients: row.ingredients || []
  };
}

function planRowToModel(row) {
  return {
    dateKey: row.plan_date || row.id,
    dayName: row.day_name,
    breakfast: row.breakfast_recipe_id || null,
    lunch: row.lunch_recipe_id || null,
    snack: row.snack_recipe_id || null,
    dinner: row.dinner_recipe_id || null
  };
}

function resolveRecipeId(recipes, ref) {
  if (!ref || typeof ref !== 'string') return null;
  const t = ref.trim();
  if (!t || ['null', 'vacio', 'vacío'].includes(t.toLowerCase())) return null;
  const byId = recipes.find(r => r.id === t);
  if (byId) return byId.id;
  const n = norm(t);
  const byTitle = recipes.find(r => norm(r.title) === n) || recipes.find(r => norm(r.title).includes(n) && n.length > 3);
  return byTitle ? byTitle.id : null;
}

// ---------------------------------------------------------------- Ejecución de herramientas

async function toolGetContext(db, userId, args, now) {
  const [settingsRows, recipes, plans, shopping] = await Promise.all([
    db.select('user_settings'), db.select('recipes'), db.select('meal_plans'), db.select('shopping_items')
  ]);
  const s = settingsRows[0] || {};
  const week = getWeekDays(now);
  const keys = new Set(week.map(w => w.dateKey));
  const weekPlan = week.map(w => {
    const row = plans.find(p => (p.plan_date || p.id) === w.dateKey);
    return row ? { ...planRowToModel(row), dayName: w.dayName } : { dateKey: w.dateKey, dayName: w.dayName, breakfast: null, lunch: null, snack: null, dinner: null };
  });
  return {
    today: toDateKey(now),
    dietaryPreferences: s.dietary_preferences || [],
    nutritionGoals: s.nutrition_goals || {},
    defaultServings: s.default_servings || 2,
    recipes: recipes.map(recipeToModel),
    weekPlan,
    shoppingList: shopping.filter(i => !i.is_checked).map(i => ({ id: i.id, name: i.name, amount: i.amount, unit: i.unit })),
    _weekKeys: [...keys].length
  };
}

async function toolCreateRecipe(db, userId, args) {
  const title = String(args.title || '').trim();
  if (!title) throw new Error('La receta necesita un título.');
  const ingredients = (Array.isArray(args.ingredients) ? args.ingredients : [])
    .filter(i => i && i.name)
    .map(i => ({ name: String(i.name).trim(), amount: Number(i.amount) || 1, unit: String(i.unit || 'ud') }));
  if (ingredients.length === 0) throw new Error('La receta necesita al menos un ingrediente.');
  const instructions = (Array.isArray(args.instructions) ? args.instructions : [])
    .filter(s => s && (typeof s === 'string' || s.text))
    .map((s, idx) => typeof s === 'string'
      ? { step: idx + 1, text: s }
      : { step: Number(s.step) || idx + 1, text: String(s.text), ...(s.timerMinutes ? { timerMinutes: Number(s.timerMinutes) } : {}) });
  const nut = args.nutrition && typeof args.nutrition === 'object' ? args.nutrition : null;
  const nowIso = new Date().toISOString();
  const id = randomId('rec-');
  await db.upsert('recipes', [{
    id,
    user_id: userId,
    title,
    description: String(args.description || ''),
    prep_time_minutes: Number(args.prepTimeMinutes) || 0,
    cook_time_minutes: Number(args.cookTimeMinutes) || 0,
    servings: Math.max(1, parseInt(args.servings, 10) || 2),
    tags: Array.isArray(args.tags) ? args.tags.map(String) : [],
    ingredients,
    instructions,
    nutrition: nut ? {
      calories: Math.round(Number(nut.calories) || 0),
      protein: Math.round(Number(nut.protein) || 0),
      carbs: Math.round(Number(nut.carbs) || 0),
      fat: Math.round(Number(nut.fat) || 0)
    } : null,
    is_favorite: false,
    created_at: nowIso,
    updated_at: nowIso
  }]);
  return { recipeId: id, title };
}

async function applyDays(db, userId, daysInput, mode) {
  const recipes = await db.select('recipes');
  const plans = await db.select('meal_plans');
  const nowIso = new Date().toISOString();
  const rows = [];
  const skipped = [];
  for (const day of daysInput) {
    if (!day || !isDateKey(day.dateKey)) { skipped.push(`fecha inválida (${day?.dateKey})`); continue; }
    const existing = plans.find(p => (p.plan_date || p.id) === day.dateKey);
    const row = {
      id: day.dateKey,
      user_id: userId,
      plan_date: day.dateKey,
      day_name: dayNameFromKey(day.dateKey),
      breakfast_recipe_id: existing?.breakfast_recipe_id ?? null,
      lunch_recipe_id: existing?.lunch_recipe_id ?? null,
      snack_recipe_id: existing?.snack_recipe_id ?? null,
      dinner_recipe_id: existing?.dinner_recipe_id ?? null,
      custom_slots: existing?.custom_slots ?? [],
      updated_at: nowIso
    };
    let touched = 0;
    for (const slot of SLOT_KEYS) {
      if (day[slot] === undefined) continue;
      const col = `${slot}_recipe_id`;
      if (mode === 'merge' && row[col]) continue;
      const rid = resolveRecipeId(recipes, day[slot]);
      if (!rid) { skipped.push(`${day.dateKey} ${slot}: receta no encontrada (${day[slot]})`); continue; }
      row[col] = rid;
      touched++;
    }
    if (touched > 0) rows.push(row);
  }
  if (rows.length) await db.upsert('meal_plans', rows);
  return { daysUpdated: rows.length, dates: rows.map(r => r.plan_date), skipped };
}

async function toolSetDayPlan(db, userId, args) {
  if (!isDateKey(args.dateKey)) throw new Error('dateKey debe tener formato YYYY-MM-DD.');
  return applyDays(db, userId, [args], 'replace');
}

async function toolSetWeeklyPlan(db, userId, args) {
  const days = Array.isArray(args.days) ? args.days : [];
  if (days.length === 0) throw new Error('Indica al menos un día en "days".');
  return applyDays(db, userId, days, args.mode === 'merge' ? 'merge' : 'replace');
}

async function toolManageShopping(db, userId, args, now) {
  const action = args.action;
  const nowIso = new Date().toISOString();
  const current = await db.select('shopping_items');
  const items = (Array.isArray(args.items) ? args.items : []).filter(i => i && i.name);

  if (action === 'add') {
    if (items.length === 0) throw new Error('Indica los artículos en "items".');
    const rows = [];
    let merged = 0;
    for (const it of items) {
      const name = String(it.name).trim();
      const amount = it.amount !== undefined && it.amount !== null ? Number(it.amount) : 1;
      const unit = String(it.unit || 'ud');
      const dup = current.find(c => !c.is_checked && norm(c.name) === norm(name) && (c.unit || '') === unit);
      if (dup) {
        rows.push({ ...dup, amount: (Number(dup.amount) || 0) + amount, updated_at: nowIso });
        merged++;
      } else {
        rows.push({ id: randomId('shop-'), user_id: userId, name, amount, unit, aisle: categorizeAisle(name), is_checked: false, recipe_origin: null, created_at: nowIso, updated_at: nowIso });
      }
    }
    await db.upsert('shopping_items', rows);
    return { itemsAdded: rows.length - merged, itemsMerged: merged, names: items.map(i => i.name) };
  }

  if (action === 'check' || action === 'remove') {
    if (items.length === 0) throw new Error('Indica los artículos en "items".');
    const targets = current.filter(c => items.some(i => norm(c.name) === norm(i.name) || norm(c.name).includes(norm(i.name))));
    if (targets.length === 0) return { itemsAffected: 0, names: [] };
    if (action === 'check') {
      await db.upsert('shopping_items', targets.map(t => ({ ...t, is_checked: true, updated_at: nowIso })));
    } else {
      await db.remove('shopping_items', targets.map(t => t.id));
    }
    return { itemsAffected: targets.length, names: targets.map(t => t.name) };
  }

  if (action === 'add_from_current_plan') {
    const [recipes, plans] = await Promise.all([db.select('recipes'), db.select('meal_plans')]);
    const keys = new Set(getWeekDays(now).map(w => w.dateKey));
    const totals = new Map();
    plans.filter(p => keys.has(p.plan_date || p.id)).forEach(p => {
      SLOT_KEYS.forEach(slot => {
        const recipe = recipes.find(r => r.id === p[`${slot}_recipe_id`]);
        (recipe?.ingredients || []).forEach(ing => {
          const k = `${norm(ing.name)}|${ing.unit || ''}`;
          const prev = totals.get(k) || { name: ing.name, unit: ing.unit || '', amount: 0 };
          prev.amount += Number(ing.amount) || 0;
          totals.set(k, prev);
        });
      });
    });
    const rows = [...totals.values()].map(t => {
      const dup = current.find(c => !c.is_checked && norm(c.name) === norm(t.name) && (c.unit || '') === t.unit);
      return dup
        ? { ...dup, amount: (Number(dup.amount) || 0) + t.amount, updated_at: nowIso }
        : { id: randomId('shop-'), user_id: userId, name: t.name, amount: t.amount || null, unit: t.unit, aisle: categorizeAisle(t.name), is_checked: false, recipe_origin: 'plan', created_at: nowIso, updated_at: nowIso };
    });
    if (rows.length) await db.upsert('shopping_items', rows);
    return { itemsAdded: rows.length };
  }

  throw new Error(`Acción desconocida: ${action}`);
}

const TOOL_HANDLERS = {
  get_food_assistant_context: toolGetContext,
  create_and_save_recipe: toolCreateRecipe,
  set_day_plan: toolSetDayPlan,
  set_weekly_plan: toolSetWeeklyPlan,
  manage_shopping_list: toolManageShopping
};

/**
 * Despacha una herramienta contra la base de datos.
 * @returns {Promise<{ok: boolean, tool: string, result?: object, error?: string}>}
 */
export async function dispatchHeadlessAgentAction(db, userId, name, args = {}, now = new Date()) {
  const handler = TOOL_HANDLERS[name];
  if (!handler) return { ok: false, tool: name, error: `Herramienta desconocida: ${name}` };
  try {
    const result = await handler(db, userId, args || {}, now);
    if (name === 'get_food_assistant_context') delete result._weekKeys;
    return { ok: true, tool: name, result };
  } catch (err) {
    return { ok: false, tool: name, error: err?.message || String(err) };
  }
}

/** Frase corta pensada para ser leída en voz alta por un asistente móvil. */
export function buildSpeech(actions) {
  const parts = [];
  for (const a of actions) {
    if (!a.ok) { parts.push(`No he podido ejecutar ${a.tool}: ${a.error}`); continue; }
    const r = a.result || {};
    if (a.tool === 'create_and_save_recipe') parts.push(`He creado la receta ${r.title}.`);
    else if (a.tool === 'set_day_plan' || a.tool === 'set_weekly_plan') {
      parts.push(r.daysUpdated ? `He actualizado el plan de ${r.daysUpdated} ${r.daysUpdated === 1 ? 'día' : 'días'}.` : 'No he cambiado ningún día del plan.');
      if (r.skipped?.length) parts.push(`Algunas comidas se omitieron porque no encontré la receta.`);
    } else if (a.tool === 'manage_shopping_list') {
      if (r.itemsAdded !== undefined) parts.push(`He añadido ${r.itemsAdded + (r.itemsMerged || 0)} ${r.itemsAdded + (r.itemsMerged || 0) === 1 ? 'artículo' : 'artículos'} a la lista de la compra.`);
      else parts.push(`He actualizado ${r.itemsAffected} ${r.itemsAffected === 1 ? 'artículo' : 'artículos'} de la lista.`);
    }
  }
  return parts.join(' ') || 'Hecho.';
}

// ---------------------------------------------------------------- OpenAPI (ChatGPT Actions)

export function buildOpenApiSpec(baseUrl) {
  const paths = {};
  MCP_TOOLS.forEach(t => {
    paths[`/tools/${t.name}`] = {
      post: {
        operationId: t.name,
        summary: t.description,
        requestBody: { required: true, content: { 'application/json': { schema: t.inputSchema } } },
        responses: { 200: { description: 'Resultado de la herramienta' } }
      }
    };
  });
  return {
    openapi: '3.1.0',
    info: { title: 'Food Assistant Agent', version: '1.0.0', description: 'Controla recetas, plan semanal y lista de la compra.' },
    servers: [{ url: baseUrl }],
    components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearer: [] }],
    paths
  };
}

// ---------------------------------------------------------------- MCP JSON-RPC

/** Procesa un mensaje JSON-RPC de MCP. Devuelve null para notificaciones. */
export async function handleMcpMessage(msg, db, userId, now = new Date()) {
  const id = msg?.id ?? null;
  const reply = result => ({ jsonrpc: '2.0', id, result });
  const fail = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  switch (msg?.method) {
    case 'initialize':
      return reply({
        protocolVersion: msg.params?.protocolVersion || '2025-03-26',
        capabilities: { tools: {} },
        serverInfo: { name: 'food-assistant-agent', version: '1.0.0' }
      });
    case 'ping':
      return reply({});
    case 'tools/list':
      return reply({ tools: MCP_TOOLS });
    case 'tools/call': {
      const out = await dispatchHeadlessAgentAction(db, userId, msg.params?.name, msg.params?.arguments, now);
      return reply({
        content: [{ type: 'text', text: JSON.stringify(out.ok ? out.result : { error: out.error }) }],
        isError: !out.ok
      });
    }
    default:
      if (typeof msg?.method === 'string' && msg.method.startsWith('notifications/')) return null;
      return fail(-32601, `Método no soportado: ${msg?.method}`);
  }
}

// ---------------------------------------------------------------- Modo comando (lenguaje natural + Gemini)

export function buildCommandSystemInstruction(context) {
  const recipes = context.recipes.map(r => {
    const n = r.nutrition ? ` | ${r.nutrition.calories}kcal ${r.nutrition.protein}P ${r.nutrition.carbs}C ${r.nutrition.fat}G` : '';
    return `- ${r.id}: ${r.title} [${(r.tags || []).join(', ')}]${n}`;
  }).join('\n');
  const week = context.weekPlan.map(d => `${d.dayName} ${d.dateKey}: D=${d.breakfast || '-'} A=${d.lunch || '-'} M=${d.snack || '-'} C=${d.dinner || '-'}`).join('\n');
  return `Eres el asistente de cocina de Franky. Hoy es ${context.today}. Razona sobre lo que pide y usa las herramientas con precisión:
- Modifica ÚNICAMENTE lo que pide. "Fin de semana" = sábado y domingo. "Hoy" = solo hoy. Nunca toques días no mencionados.
- Para planificar usa SOLO IDs de la lista de recetas; no repitas el mismo plato en días consecutivos salvo que pida sobras/batch cooking. Si faltan recetas adecuadas, crea alguna con create_and_save_recipe y úsala.
- Para añadir cosas sueltas a la compra usa manage_shopping_list action "add" con SOLO esos artículos. Nunca "add_from_current_plan" salvo petición explícita.
- Respeta preferencias dietéticas: ${(context.dietaryPreferences || []).join(', ') || 'ninguna'}. Raciones por defecto: ${context.defaultServings}.
- Responde SIEMPRE en español, en 1-2 frases naturales aptas para ser leídas en voz alta, sin IDs.

RECETAS:
${recipes || '(ninguna)'}

SEMANA ACTUAL:
${week}`;
}

/** Convierte las herramientas MCP al formato functionDeclarations de Gemini. */
export function toGeminiDeclarations() {
  const conv = s => {
    if (Array.isArray(s)) return s.map(conv);
    if (s && typeof s === 'object') {
      const o = {};
      for (const [k, v] of Object.entries(s)) {
        if (k === 'enum') continue;
        o[k] = k === 'type' && typeof v === 'string' ? v.toUpperCase() : conv(v);
      }
      return o;
    }
    return s;
  };
  return MCP_TOOLS
    .filter(t => t.name !== 'get_food_assistant_context')
    .map(t => ({ name: t.name, description: t.description, parameters: conv(t.inputSchema) }));
}

/**
 * Ejecuta un comando en lenguaje natural con Gemini (bucle de function-calling).
 * `fetchImpl` es inyectable para tests.
 */
export async function runNaturalLanguageCommand({ command, db, userId, geminiApiKey, model = 'gemini-3.8-flash', now = new Date(), fetchImpl = globalThis.fetch }) {
  const ctxRes = await dispatchHeadlessAgentAction(db, userId, 'get_food_assistant_context', {}, now);
  const system = buildCommandSystemInstruction(ctxRes.result);
  const contents = [{ role: 'user', parts: [{ text: command }] }];
  const actions = [];
  let finalText = '';

  for (let turn = 0; turn < 4; turn++) {
    const res = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiApiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        tools: [{ functionDeclarations: toGeminiDeclarations() }]
      })
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const calls = parts.filter(p => p.functionCall);
    finalText = parts.filter(p => p.text).map(p => p.text).join(' ').trim() || finalText;
    if (calls.length === 0) break;

    contents.push({ role: 'model', parts });
    const responses = [];
    for (const p of calls) {
      const out = await dispatchHeadlessAgentAction(db, userId, p.functionCall.name, p.functionCall.args || {}, now);
      actions.push(out);
      responses.push({ functionResponse: { name: p.functionCall.name, response: out.ok ? out.result : { error: out.error } } });
    }
    contents.push({ role: 'user', parts: responses });
  }

  return { ok: actions.every(a => a.ok), speech: finalText || buildSpeech(actions), actionsExecuted: actions.map(a => ({ tool: a.tool, ok: a.ok, ...(a.ok ? a.result : { error: a.error }) })) };
}

