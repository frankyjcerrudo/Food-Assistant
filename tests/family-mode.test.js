import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  FoodAssistantApp,
  state,
  generateHouseholdInviteCode,
  normalizeHouseholdInviteCode
} = window;

describe('US-77: Modo Familia / Espacio Colaborativo del Hogar (Family Mode)', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <header class="app-header">
        <button type="button" class="household-header-pill" id="header-household-badge" hidden data-action="openHouseholdSettings">
          <span class="material-symbols-outlined icon-sm">home</span>
          <span class="household-header-pill-text" id="header-household-name">Mi Hogar</span>
        </button>
        <button id="btn-header-account">
          <span id="header-account-icon"></span>
          <span id="header-account-text"></span>
        </button>
      </header>
      <div id="sync-status-indicator"></div>
      <div id="settings-user-status"></div>
      <div id="btn-sync-now" style="display: none;"></div>
      <div id="settings-user-icon"></div>
      <div id="settings-user-name"></div>
      <button id="btn-settings-auth-action"></button>
      <dialog id="modal-auth"></dialog>

      <div class="card" id="card-family-household">
        <span class="household-mode-badge" id="household-status-badge">Modo Personal</span>
        <div id="household-empty-view">
          <form id="form-create-household">
            <input type="text" id="input-create-household-name" name="household_name">
            <button type="submit" id="btn-create-household">Crear Hogar</button>
          </form>
          <form id="form-join-household">
            <input type="text" id="input-join-household-code" name="invite_code">
            <button type="submit" id="btn-join-household">Unirse</button>
          </form>
        </div>
        <div id="household-active-view" style="display: none;">
          <strong id="household-active-name"></strong>
          <span id="household-active-role"></span>
          <span id="household-members-count"></span>
          <code id="household-invite-code-display"></code>
          <div id="household-members-list"></div>
          <button type="button" id="btn-leave-household">
            <span id="btn-leave-household-text">Abandonar hogar</span>
          </button>
        </div>
      </div>

      <span id="recipes-count-badge">0</span>
      <p id="recipes-count-subtitle"></p>
      <div id="recipes-cards-grid"></div>
    `;

    state.cloudUser = {
      id: 'user-franky-111',
      email: 'franky@sabory.food',
      name: 'Franky'
    };
    state.saveHousehold(null);
    state.personalBackup = null;
    state.lastSyncedAt = null;
    state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };

    appInstance = new FoodAssistantApp();
    appInstance.initHouseholdEvents();
  });

  describe('1. Códigos de invitación y esquema SQL colaborativo', () => {
    it('generateHouseholdInviteCode y normalizeHouseholdInviteCode deben generar y normalizar códigos SAB-XXXX', () => {
      const code1 = generateHouseholdInviteCode();
      const code2 = generateHouseholdInviteCode();

      expect(code1).toMatch(/^SAB-[2-9A-HJ-NP-Z]{4}$/);
      expect(code2).toMatch(/^SAB-[2-9A-HJ-NP-Z]{4}$/);

      expect(normalizeHouseholdInviteCode('  sab-7k9p ')).toBe('SAB-7K9P');
      expect(normalizeHouseholdInviteCode('sab7k9p')).toBe('SAB-7K9P');
      expect(normalizeHouseholdInviteCode('')).toBe('');
    });

    it('replica/schema.sql debe definir tablas households, household_members, columnas household_id y políticas RLS', () => {
      const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'replica/schema.sql'), 'utf-8');
      expect(schemaSql).toContain('create table if not exists public.households');
      expect(schemaSql).toContain('create table if not exists public.household_members');
      expect(schemaSql).toContain('alter table public.recipes add column if not exists household_id uuid');
      expect(schemaSql).toContain('alter table public.recipes add column if not exists is_private boolean');
      expect(schemaSql).toContain('alter table public.meal_plans add column if not exists household_id uuid');
      expect(schemaSql).toContain('alter table public.shopping_items add column if not exists household_id uuid');
      expect(schemaSql).toContain('public.is_household_member(household_id)');
    });

    it('index.html debe incluir la tarjeta #card-family-household, pill en cabecera y switch de receta privada', () => {
      const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      expect(html).toContain('id="card-family-household"');
      expect(html).toContain('id="header-household-badge"');
      expect(html).toContain('id="form-create-household"');
      expect(html).toContain('id="form-join-household"');
      expect(html).toContain('id="edit-recipe-private"');
    });
  });

  describe('2. Creación de Hogar Familiar y promoción del espacio actual', () => {
    it('createHousehold debe crear el hogar, vincular recetas/plan/compra actuales y sincronizar con Supabase', async () => {
      const insertedTables = {};
      const upsertedTables = {};

      appInstance.supabaseClient = {
        from: vi.fn().mockImplementation((table) => ({
          insert: vi.fn().mockImplementation(async (payload) => {
            insertedTables[table] = payload;
            return { data: payload, error: null };
          }),
          upsert: vi.fn().mockImplementation(async (payload, options) => {
            upsertedTables[table] = { payload, options };
            return { data: payload, error: null };
          }),
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          })
        })),
        channel: vi.fn().mockReturnValue({
          on: vi.fn().mockReturnThis(),
          subscribe: vi.fn().mockReturnThis()
        })
      };

      state.recipes = [
        { id: 'rec-fam-1', title: 'Paella Familiar', isPrivate: false, ingredients: [], instructions: [] },
        { id: 'rec-priv-1', title: 'Batido Secreto', isPrivate: true, ingredients: [], instructions: [] }
      ];
      state.mealPlan = {
        '2026-11-09': { dayName: 'Lunes', lunch: 'rec-fam-1', customSlots: [] }
      };
      state.shoppingList = [
        { id: 'shop-fam-1', name: 'Arroz Bomba', amount: 1, unit: 'kg', aisle: 'pantry', isChecked: false }
      ];

      const res = await appInstance.createHousehold('Casa Cerrudo');

      expect(res.success).toBe(true);
      expect(state.household).toBeDefined();
      expect(state.household.name).toBe('Casa Cerrudo');
      expect(state.household.role).toBe('owner');
      expect(state.household.inviteCode).toMatch(/^SAB-/);
      expect(insertedTables.households.name).toBe('Casa Cerrudo');

      // Verificar que la receta pública tiene household_id y la privada tiene household_id = null
      const pushedRecipes = upsertedTables.recipes.payload;
      const pubRec = pushedRecipes.find(r => r.id === 'rec-fam-1');
      const privRec = pushedRecipes.find(r => r.id === 'rec-priv-1');
      expect(pubRec.household_id).toBe(state.household.id);
      expect(pubRec.is_private).toBe(false);
      expect(privRec.household_id).toBeNull();
      expect(privRec.is_private).toBe(true);

      // Verificar que meal_plans y shopping_items llevan el household_id del hogar
      expect(upsertedTables.meal_plans.payload[0].household_id).toBe(state.household.id);
      expect(upsertedTables.shopping_items.payload[0].household_id).toBe(state.household.id);

      // Verificar UI actualizada
      expect(document.getElementById('household-status-badge').textContent).toContain('Casa Cerrudo');
      expect(document.getElementById('header-household-badge').hasAttribute('hidden')).toBe(false);
      expect(document.getElementById('header-household-name').textContent).toBe('Casa Cerrudo');
    });
  });

  describe('3. Unión a Hogar por código / enlace y espacio unificado (Plan + Compra + Recetario)', () => {
    it('joinHouseholdByCode debe respaldar los datos individuales, unirse al hogar y descargar el Plan y Compra unificados', async () => {
      // Estado individual previo de Laura antes de unirse al hogar de Franky
      state.cloudUser = { id: 'user-laura-222', email: 'laura@sabory.food', name: 'Laura' };
      state.mealPlan = {
        '2026-11-09': { dayName: 'Lunes', lunch: 'rec-personal-laura', customSlots: [] }
      };
      state.shoppingList = [
        { id: 'shop-personal-laura', name: 'Té Matcha', amount: 1, unit: 'ud', aisle: 'pantry', isChecked: false }
      ];
      state.recipes = [
        { id: 'rec-personal-laura', title: 'Ensalada de Laura', ownerUserId: 'user-laura-222', ingredients: [], instructions: [] }
      ];

      const householdId = 'hh-uuid-cerrudo-999';
      appInstance.supabaseClient = {
        from: vi.fn().mockImplementation((table) => {
          if (table === 'households') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{
                    id: householdId,
                    name: 'Familia Cerrudo',
                    invite_code: 'SAB-9K2M',
                    owner_id: 'user-franky-111'
                  }],
                  error: null
                })
              })
            };
          }
          if (table === 'household_members') {
            return {
              upsert: vi.fn().mockResolvedValue({ error: null }),
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    { household_id: householdId, user_id: 'user-franky-111', role: 'owner', display_name: 'Franky', email: 'franky@sabory.food' },
                    { household_id: householdId, user_id: 'user-laura-222', role: 'member', display_name: 'Laura', email: 'laura@sabory.food' }
                  ],
                  error: null
                })
              })
            };
          }
          if (table === 'recipes') {
            return {
              select: vi.fn().mockReturnValue({
                or: vi.fn().mockResolvedValue({
                  data: [
                    {
                      id: 'rec-shared-franky',
                      user_id: 'user-franky-111',
                      household_id: householdId,
                      is_private: false,
                      title: 'Lasaña de la Abuela',
                      ingredients: [],
                      instructions: [],
                      updated_at: '2026-11-07T12:00:00Z'
                    },
                    {
                      id: 'rec-private-franky',
                      user_id: 'user-franky-111',
                      household_id: null,
                      is_private: true,
                      title: 'Receta Privada de Franky',
                      ingredients: [],
                      instructions: [],
                      updated_at: '2026-11-07T12:00:00Z'
                    }
                  ],
                  error: null
                })
              }),
              upsert: vi.fn().mockResolvedValue({ error: null })
            };
          }
          if (table === 'meal_plans') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    {
                      id: '2026-11-09',
                      user_id: 'user-franky-111',
                      household_id: householdId,
                      plan_date: '2026-11-09',
                      day_name: 'Lunes',
                      lunch_recipe_id: 'rec-shared-franky',
                      custom_slots: [],
                      updated_at: '2026-11-07T12:00:00Z'
                    }
                  ],
                  error: null
                })
              }),
              upsert: vi.fn().mockResolvedValue({ error: null })
            };
          }
          if (table === 'shopping_items') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    {
                      id: 'shop-shared-1',
                      user_id: 'user-franky-111',
                      household_id: householdId,
                      name: 'Placas de Lasaña',
                      amount: 2,
                      unit: 'paquetes',
                      aisle: 'pantry',
                      is_checked: false,
                      updated_at: '2026-11-07T12:00:00Z'
                    }
                  ],
                  error: null
                })
              }),
              upsert: vi.fn().mockResolvedValue({ error: null })
            };
          }
          return {
            select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }),
            upsert: vi.fn().mockResolvedValue({ error: null })
          };
        }),
        channel: vi.fn().mockReturnValue({
          on: vi.fn().mockReturnThis(),
          subscribe: vi.fn().mockReturnThis()
        })
      };

      const joinRes = await appInstance.joinHouseholdByCode('sab-9k2m');
      expect(joinRes.success).toBe(true);
      expect(state.household.id).toBe(householdId);
      expect(state.household.members).toHaveLength(2);

      // 1. Verificar que se creó el backup personal de Laura antes de adoptar el hogar
      expect(state.personalBackup).toBeDefined();
      expect(state.personalBackup.shoppingList[0].name).toBe('Té Matcha');

      // 2. Verificar que ahora Laura ve el Plan Semanal y la Lista de la Compra unificados del hogar
      expect(state.mealPlan['2026-11-09'].lunch).toBe('rec-shared-franky');
      expect(state.shoppingList).toHaveLength(1);
      expect(state.shoppingList[0].name).toBe('Placas de Lasaña');

      // 3. Verificar que el recetario contiene la receta compartida de Franky + la propia de Laura, pero NO la privada de Franky
      expect(state.recipes.some(r => r.id === 'rec-shared-franky')).toBe(true);
      expect(state.recipes.some(r => r.id === 'rec-personal-laura')).toBe(true);
      expect(state.recipes.some(r => r.id === 'rec-private-franky')).toBe(false);
    });
  });

  describe('4. Gestión de miembros, transferencia de anfitrión y salida del hogar (restauración personal)', () => {
    it('transferHouseholdOwnership y leaveHousehold deben gestionar roles y restaurar el espacio individual al salir', async () => {
      state.cloudUser = { id: 'user-laura-222', email: 'laura@sabory.food', name: 'Laura' };
      state.personalBackup = {
        mealPlan: { '2026-11-09': { dayName: 'Lunes', lunch: 'rec-personal-laura', customSlots: [] } },
        shoppingList: [{ id: 'shop-personal-laura', name: 'Té Matcha', amount: 1, unit: 'ud', aisle: 'pantry', isChecked: false }],
        savedAt: '2026-11-07T10:00:00Z'
      };
      state.saveHousehold({
        id: 'hh-uuid-cerrudo-999',
        name: 'Familia Cerrudo',
        inviteCode: 'SAB-9K2M',
        ownerId: 'user-laura-222',
        role: 'owner',
        members: [
          { userId: 'user-laura-222', name: 'Laura', email: 'laura@sabory.food', role: 'owner' },
          { userId: 'user-franky-111', name: 'Franky', email: 'franky@sabory.food', role: 'member' }
        ]
      });
      state.recipes = [
        { id: 'rec-shared-franky', title: 'Lasaña de la Abuela', ownerUserId: 'user-franky-111' },
        { id: 'rec-personal-laura', title: 'Ensalada de Laura', ownerUserId: 'user-laura-222' }
      ];
      state.mealPlan = { '2026-11-09': { dayName: 'Lunes', lunch: 'rec-shared-franky', customSlots: [] } };
      state.shoppingList = [{ id: 'shop-shared-1', name: 'Placas de Lasaña', amount: 2, unit: 'paquetes', aisle: 'pantry' }];

      appInstance.supabaseClient = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockResolvedValue({ error: null })
        })
      };

      // Transferir administración a Franky
      const transferRes = await appInstance.transferHouseholdOwnership('user-franky-111');
      expect(transferRes.success).toBe(true);
      expect(state.household.ownerId).toBe('user-franky-111');
      expect(state.household.role).toBe('member');

      // Abandonar el hogar y comprobar que Laura recupera su Plan y Compra individuales y sus propias recetas
      const leaveRes = await appInstance.leaveHousehold(true);
      expect(leaveRes.success).toBe(true);
      expect(state.household).toBeNull();
      expect(state.mealPlan['2026-11-09'].lunch).toBe('rec-personal-laura');
      expect(state.shoppingList).toHaveLength(1);
      expect(state.shoppingList[0].name).toBe('Té Matcha');
      expect(state.recipes.some(r => r.id === 'rec-personal-laura')).toBe(true);
      expect(state.recipes.some(r => r.id === 'rec-shared-franky')).toBe(false);
    });

    it('no pisa días planificados con días vacíos autogenerados y comparte Preferencias Dietéticas manteniendo Macros individuales', async () => {
      state.cloudUser = { id: 'user-aroa-222', email: 'aroa@sabory.food', name: 'Aroa' };
      state.saveHousehold({
        id: 'hh-family-999',
        name: 'Casa Sabory',
        inviteCode: 'SAB-9K2M',
        ownerId: 'user-franky-111',
        role: 'member',
        members: [
          { userId: 'user-franky-111', name: 'Franky', role: 'owner' },
          { userId: 'user-aroa-222', name: 'Aroa', role: 'member' }
        ]
      });

      // Día vacío local autogenerado por getDayPlan() sin updatedAt
      state.mealPlan = {};
      state.getDayPlan('2026-11-07', 'Sábado');
      expect(state.mealPlan['2026-11-07'].updatedAt).toBeUndefined();

      // Objetivos nutricionales individuales de Aroa
      state.saveNutritionGoals({ enabled: true, calories: 1750, protein: 120, carbs: 160, fat: 55 });

      const remoteMealPlans = [
        // Registro vacío más reciente de otro miembro vs registro planificado de Franky
        {
          id: '2026-11-07',
          user_id: 'user-aroa-222',
          household_id: 'hh-family-999',
          plan_date: '2026-11-07',
          day_name: 'Sábado',
          breakfast_recipe_id: null,
          lunch_recipe_id: null,
          snack_recipe_id: null,
          dinner_recipe_id: null,
          custom_slots: [],
          updated_at: '2026-11-07T18:00:00.000Z'
        },
        {
          id: '2026-11-07',
          user_id: 'user-franky-111',
          household_id: 'hh-family-999',
          plan_date: '2026-11-07',
          day_name: 'Sábado',
          breakfast_recipe_id: 'rec-avocado-toast',
          lunch_recipe_id: 'rec-pesto-pasta',
          snack_recipe_id: null,
          dinner_recipe_id: 'rec-salmon-bowl',
          custom_slots: [],
          updated_at: '2026-11-07T12:00:00.000Z'
        },
        // Preferencias dietéticas compartidas del hogar
        {
          id: '__household_prefs__',
          user_id: 'user-franky-111',
          household_id: 'hh-family-999',
          plan_date: '__household_prefs__',
          day_name: 'Preferencias del Hogar',
          custom_slots: [{
            type: 'household_prefs',
            dietaryPreferences: ['Sin Lactosa', 'Alta en Proteínas'],
            updatedAt: '2026-11-07T18:01:00.000Z'
          }],
          updated_at: '2026-11-07T18:01:00.000Z'
        }
      ];

      appInstance.supabaseClient = {
        from: vi.fn((table) => {
          if (table === 'meal_plans') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: remoteMealPlans, error: null })
                })
              })
            };
          }
          if (table === 'user_settings') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{
                    user_id: 'user-aroa-222',
                    dietary_preferences: ['Vegetariano'],
                    nutrition_goals: { enabled: true, calories: 1750, protein: 120, carbs: 160, fat: 55 },
                    updated_at: '2026-11-07T10:00:00.000Z'
                  }],
                  error: null
                })
              })
            };
          }
          return {
            select: vi.fn().mockReturnValue({
              or: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) }),
              eq: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })
            })
          };
        })
      };

      const pullRes = await appInstance.pullFromCloud();
      expect(pullRes.success).toBe(true);

      // 1. El día planificado de Franky prevalece sobre el día vacío autogenerado
      expect(state.mealPlan['2026-11-07'].lunch).toBe('rec-pesto-pasta');
      expect(state.mealPlan['2026-11-07'].dinner).toBe('rec-salmon-bowl');
      expect(state.mealPlan['__household_prefs__']).toBeUndefined();

      // 2. Las preferencias dietéticas adoptan las compartidas del hogar
      expect(state.dietaryPreferences).toEqual(['Sin Lactosa', 'Alta en Proteínas']);

      // 3. Los objetivos nutricionales (macros) siguen siendo los individuales de Aroa
      expect(state.settings.nutritionGoals.calories).toBe(1750);
      expect(state.settings.nutritionGoals.protein).toBe(120);
    });
  });
});
