// Food Assistant - Storage & Persistence (US-42, US-46)
import { SEED_RECIPES, DAYS_OF_WEEK_ES, ALL_PREDEFINED_TAGS } from '../core/constants.js';
import {
  generateId,
  getWeekDates,
  toLocalDateKey,
  getRecipeNutrition
} from '../core/utils.js';

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
      // Ignorar QuotaExceededError en localStorage (los datos persisten en IndexedDB)
    }
  }

  async delete(key) {
    const db = await this.getDb();
    if (db) {
      try {
        const tx = db.transaction(FA_IDB_STORE, 'readwrite');
        tx.objectStore(FA_IDB_STORE).delete(key);
      } catch {}
    }
    try { localStorage.removeItem(key); } catch {}
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
        } catch {}
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

// Application State Store (Local First + Cloud Sync)
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
      try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) {}
    } else {
      const seeded = localStorage.getItem('fa_recipes_seeded');
      if (seeded !== 'v8') {
        // Migración única a v8 para usuarios antiguos, respetando borrados del usuario
        SEED_RECIPES.forEach(seed => {
          if (!savedRecipes.some(r => r.id === seed.id) && !this.deletedRecords.recipes?.includes(seed.id)) {
            savedRecipes.push(seed);
          }
        });
        try { localStorage.setItem('fa_recipes_seeded', 'v8'); } catch (e) {}
      }
    }
    if (Array.isArray(savedRecipes)) {
      let tagsCleaned = false;
      savedRecipes.forEach(r => {
        if (!r.createdAt && r.updatedAt) {
          r.createdAt = r.updatedAt;
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
        try { localStorage.setItem('fa_recipes', JSON.stringify(savedRecipes)); } catch (e) {}
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
    // US-45 & BUG-23: Migración transparente para asegurar que todo artículo tenga id
    if (Array.isArray(this.shoppingList)) {
      let migrated = false;
      this.shoppingList.forEach(item => {
        if (!item.id) {
          item.id = generateId('shop-');
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
    this.supabaseConfig = {
      url: window.APP_CONFIG?.supabaseUrl || localStorage.getItem('fa_sb_url') || '',
      anonKey: window.APP_CONFIG?.supabaseAnonKey || localStorage.getItem('fa_sb_key') || ''
    };
    this.lastSyncedAt = localStorage.getItem('fa_last_sync') || null;
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
    } catch (e) {}
    if (this.idb) {
      try { this.idb.set(key, val); } catch (e) {}
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
    return '';
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

  return `
    <div class="recipe-placeholder-art ${sizeClass}" style="background: ${theme.gradient};" aria-hidden="true">
      <div class="recipe-placeholder-avatar" style="background: ${theme.avatarBg}; color: ${theme.avatarColor};">
        <span class="material-symbols-outlined" style="font-size: ${isDetail ? '36px' : '28px'};">${theme.icon}</span>
      </div>
    </div>
  `;
}

// ==========================================================================
// US-15: RECIPE PARSER (SCHEMA.ORG / JSON-LD & STRUCTURED TEXT)

export {
  IndexedDbStorage,
  StateStore,
  state
};
