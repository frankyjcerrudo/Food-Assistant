import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { StateStore, FoodAssistantApp, generateId, state } = window;

describe('US-35 & Bugs Bloqueantes: Sincronización Supabase, IDs Únicos y Esquema', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div id="sync-status-indicator"></div>
      <div id="settings-user-status"></div>
      <div id="btn-sync-now" style="display: none;"></div>
      <button id="btn-header-account">
        <span id="header-account-icon"></span>
        <span id="header-account-text"></span>
      </button>
      <div id="settings-user-icon"></div>
      <div id="settings-user-name"></div>
      <button id="btn-settings-auth-action"></button>
      <div id="auth-modal-title"></div>
      <div id="auth-forms-container"></div>
      <div id="auth-tab-buttons"></div>
      <div id="auth-logged-in-container">
        <div id="auth-profile-name"></div>
        <div id="auth-profile-email"></div>
      </div>
      <div id="modal-auth" class="modal-overlay"></div>
      <div id="auth-error-msg"></div>
    `;

    state.cloudUser = {
      id: 'test-user-uuid-1234',
      email: 'test@example.com',
      name: 'Franky'
    };
    state.lastSyncedAt = null;
    state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };

    appInstance = new FoodAssistantApp();
  });

  // 1. US-45: Generación de IDs únicos con crypto.randomUUID() y migración de compra
  describe('US-45: Generador de IDs y migración de artículos de compra', () => {
    it('generateId debe generar identificadores válidos con prefijo', () => {
      const recId = generateId('rec-');
      const shopId = generateId('shop-');
      const bareId = generateId();

      expect(recId.startsWith('rec-')).toBe(true);
      expect(shopId.startsWith('shop-')).toBe(true);
      expect(bareId.length).toBeGreaterThan(10);
      expect(generateId('test-')).not.toBe(generateId('test-'));
    });

    it('StateStore debe migrar automáticamente artículos de la compra antiguos sin ID', () => {
      const legacyShopping = [
        { name: 'Tomates', amount: 2, unit: 'kg', aisle: 'produce', isChecked: false },
        { name: 'Aceite de Oliva', amount: 1, unit: 'l', aisle: 'pantry', isChecked: true }
      ];
      localStorage.setItem('fa_shopping', JSON.stringify(legacyShopping));

      const newStore = new StateStore();
      expect(newStore.shoppingList).toHaveLength(2);
      expect(newStore.shoppingList[0].id).toBeDefined();
      expect(newStore.shoppingList[0].id.startsWith('shop-')).toBe(true);
      expect(newStore.shoppingList[1].id).toBeDefined();
      expect(newStore.shoppingList[1].id.startsWith('shop-')).toBe(true);
      expect(newStore.shoppingList[0].id).not.toBe(newStore.shoppingList[1].id);
    });
  });

  // 2. BUG-21: Gestión estricta de errores (no falso positivo "Sincronizado")
  describe('BUG-21: Gestión de errores de Supabase e indicadores visuales', () => {
    it('no debe actualizar lastSyncedAt ni mostrar éxito si Supabase devuelve error', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'RLS policy violation or network failure' }
          })
        })
      };

      appInstance.supabaseClient = mockSupabase;
      const initialSyncTime = state.lastSyncedAt;

      const result = await appInstance.pushToCloud(true);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('RLS policy violation or network failure');
      expect(state.lastSyncedAt).toBe(initialSyncTime);

      const indicator = document.getElementById('sync-status-indicator');
      expect(indicator.textContent).toContain('Error de sincronización');
    });
  });

  // 3. BUG-22 & BUG-24: Batch Upsert y clave compuesta (user_id, id)
  describe('BUG-22 & BUG-24: Batch Upsert eficiente y prevención de colisión de IDs', () => {
    it('debe enviar recetas, plan semanal y lista de compra en lotes con onConflict user_id,id', async () => {
      let upsertCalls = {};
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockImplementation((payload, options) => {
            upsertCalls[table] = { payload, options };
            return Promise.resolve({ data: payload, error: null });
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;

      // Ensure some state data
      state.recipes = [
        {
          id: 'rec-test-1',
          title: 'Pasta al Pesto',
          sourceUrl: 'https://ejemplo.com/pesto',
          sourceDomain: 'ejemplo.com',
          servings: 2,
          tags: ['Pasta'],
          ingredients: [],
          instructions: []
        }
      ];
      state.shoppingList = [
        { id: 'shop-1', name: 'Albahaca', amount: 50, unit: 'g', aisle: 'produce', isChecked: false }
      ];

      const res = await appInstance.pushToCloud(true);
      expect(res.success).toBe(true);

      // Verificaciones de llamada en lote (BUG-24)
      expect(upsertCalls.recipes).toBeDefined();
      expect(upsertCalls.recipes.options.onConflict).toBe('user_id,id');
      expect(Array.isArray(upsertCalls.recipes.payload)).toBe(true);
      expect(upsertCalls.recipes.payload[0].user_id).toBe('test-user-uuid-1234');
      expect(upsertCalls.recipes.payload[0].source_url).toBe('https://ejemplo.com/pesto');
      expect(upsertCalls.recipes.payload[0].source_domain).toBe('ejemplo.com');

      expect(upsertCalls.meal_plans).toBeDefined();
      expect(upsertCalls.meal_plans.options.onConflict).toBe('user_id,id');

      expect(upsertCalls.shopping_items).toBeDefined();
      expect(upsertCalls.shopping_items.options.onConflict).toBe('user_id,id');
      expect(upsertCalls.shopping_items.payload[0].id).toBe('shop-1');
      expect(upsertCalls.shopping_items.payload[0].user_id).toBe('test-user-uuid-1234');
    });

    it('debe recuperarse y reintentar automáticamente si Supabase devuelve error de columna faltante en schema cache (resiliencia de esquema)', async () => {
      let attempts = 0;
      let finalPayload = null;
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockImplementation((payload) => {
            if (table === 'recipes') {
              attempts++;
              if (attempts === 1) {
                return Promise.resolve({
                  data: null,
                  error: { message: "Could not find the 'source_domain' column of 'recipes' in the schema cache" }
                });
              }
              if (attempts === 2) {
                return Promise.resolve({
                  data: null,
                  error: { message: "Could not find the 'source_url' column of 'recipes' in the schema cache" }
                });
              }
              finalPayload = payload;
            }
            return Promise.resolve({ data: payload, error: null });
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;
      state.recipes = [
        {
          id: 'rec-test-resilience',
          title: 'Tortilla Casera',
          sourceUrl: 'https://ejemplo.com/tortilla',
          sourceDomain: 'ejemplo.com'
        }
      ];

      const res = await appInstance.pushToCloud(true);
      expect(res.success).toBe(true);
      expect(attempts).toBeGreaterThanOrEqual(3);
      expect(finalPayload[0].source_domain).toBeUndefined();
      expect(finalPayload[0].source_url).toBeUndefined();
      expect(finalPayload[0].title).toBe('Tortilla Casera');
    });

    it('debe retroceder a onConflict: "id" si la tabla remota no tiene clave compuesta (user_id,id)', async () => {
      let attempts = 0;
      let usedConflict = null;
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockImplementation((payload, options) => {
            if (table === 'recipes') {
              attempts++;
              if (attempts === 1) {
                return Promise.resolve({
                  data: null,
                  error: { code: '42P10', message: 'there is no unique or exclusion constraint matching the ON CONFLICT specification' }
                });
              }
              usedConflict = options.onConflict;
            }
            return Promise.resolve({ data: payload, error: null });
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;
      state.recipes = [{ id: 'rec-1', title: 'Test' }];

      const res = await appInstance.pushToCloud(true);
      expect(res.success).toBe(true);
      expect(usedConflict).toBe('id');
    });
  });

  // 4. BUG-23: Propagación de borrados remotos
  describe('BUG-23: Propagación de borrados a Supabase', () => {
    it('debe enviar delete a Supabase para registros marcados en deletedRecords', async () => {
      let deletedTables = [];
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockImplementation((col, ids) => ({
              eq: vi.fn().mockImplementation((userCol, userId) => {
                deletedTables.push({ table, col, ids, userId });
                return Promise.resolve({ error: null });
              })
            }))
          }),
          upsert: vi.fn().mockResolvedValue({ error: null })
        }))
      };

      appInstance.supabaseClient = mockSupabase;

      state.trackDeletion('recipes', 'rec-deleted-123');
      state.trackDeletion('shoppingItems', 'shop-deleted-456');

      expect(state.deletedRecords.recipes).toContain('rec-deleted-123');
      expect(state.deletedRecords.shoppingItems).toContain('shop-deleted-456');

      await appInstance.pushToCloud(true);

      const recipeDelete = deletedTables.find(d => d.table === 'recipes');
      expect(recipeDelete).toBeDefined();
      expect(recipeDelete.ids).toContain('rec-deleted-123');
      expect(recipeDelete.userId).toBe('test-user-uuid-1234');

      const shopDelete = deletedTables.find(d => d.table === 'shopping_items');
      expect(shopDelete).toBeDefined();
      expect(shopDelete.ids).toContain('shop-deleted-456');

      // Después de una subida con éxito, la cola de borrados debe limpiarse
      expect(state.deletedRecords.recipes).not.toContain('rec-deleted-123');
      expect(state.deletedRecords.shoppingItems).not.toContain('shop-deleted-456');
    });
  });

  // 5. US-35: Descarga y Fusión Automática (pullFromCloud)
  describe('US-35: Descarga y fusión bidireccional desde la nube', () => {
    it('pullFromCloud debe descargar recetas, planes y compra y fusionarlos con el estado local', async () => {
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation((col, val) => {
              if (table === 'recipes') {
                return Promise.resolve({
                  data: [
                    {
                      id: 'rec-remote-1',
                      title: 'Salmón al Horno con Verduras',
                      source_url: 'https://cocina.es/salmon',
                      source_domain: 'cocina.es',
                      prep_time_minutes: 10,
                      cook_time_minutes: 25,
                      servings: 4,
                      tags: ['Pescado', 'Cena'],
                      ingredients: [{ id: 'ing-1', name: 'Salmón', amount: 400, unit: 'g', aisle: 'meat' }],
                      instructions: [{ step: 1, text: 'Hornear a 180°C' }],
                      is_favorite: true,
                      updated_at: '2026-10-25T10:00:00Z'
                    }
                  ],
                  error: null
                });
              }
              if (table === 'meal_plans') {
                return Promise.resolve({
                  data: [
                    {
                      id: '2026-10-26',
                      plan_date: '2026-10-26',
                      day_name: 'Lunes',
                      breakfast_recipe_id: null,
                      lunch_recipe_id: 'rec-remote-1',
                      snack_recipe_id: null,
                      dinner_recipe_id: null,
                      custom_slots: [{ id: 'cslot-1', name: 'Post-Entreno', icon: 'fitness_center', recipeId: null }],
                      updated_at: '2026-10-25T10:00:00Z'
                    }
                  ],
                  error: null
                });
              }
              if (table === 'shopping_items') {
                return Promise.resolve({
                  data: [
                    {
                      id: 'shop-remote-1',
                      name: 'Aguacates',
                      amount: 3,
                      unit: 'ud',
                      aisle: 'produce',
                      is_checked: false,
                      recipe_origin: 'Plan semanal',
                      updated_at: '2026-10-25T10:00:00Z'
                    }
                  ],
                  error: null
                });
              }
              return Promise.resolve({ data: [], error: null });
            })
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;

      const pullRes = await appInstance.pullFromCloud();
      expect(pullRes.success).toBe(true);

      // Verificación de fusión de recetas
      const salmon = state.recipes.find(r => r.id === 'rec-remote-1');
      expect(salmon).toBeDefined();
      expect(salmon.title).toBe('Salmón al Horno con Verduras');
      expect(salmon.sourceUrl).toBe('https://cocina.es/salmon');
      expect(salmon.sourceDomain).toBe('cocina.es');

      // Verificación de fusión de planes semanales
      const mondayPlan = state.mealPlan['2026-10-26'];
      expect(mondayPlan).toBeDefined();
      expect(mondayPlan.lunch).toBe('rec-remote-1');
      expect(mondayPlan.customSlots).toHaveLength(1);
      expect(mondayPlan.customSlots[0].name).toBe('Post-Entreno');

      // Verificación de fusión de la lista de la compra
      const aguacates = state.shoppingList.find(i => i.id === 'shop-remote-1');
      expect(aguacates).toBeDefined();
      expect(aguacates.name).toBe('Aguacates');
      expect(aguacates.amount).toBe(3);
    });

    it('no debe resucitar registros que fueron eliminados localmente mientras estaba offline', async () => {
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [
                { id: 'rec-borrada-localmente', title: 'Receta Fantasma', updated_at: '2026-10-25T00:00:00Z' }
              ],
              error: null
            })
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;
      state.trackDeletion('recipes', 'rec-borrada-localmente');

      await appInstance.pullFromCloud();

      const ghost = state.recipes.find(r => r.id === 'rec-borrada-localmente');
      expect(ghost).toBeUndefined();
    });

    it('pullFromCloud debe eliminar localmente recetas que fueron borradas en la nube desde otro dispositivo', async () => {
      // Simula que el dispositivo local ya había sincronizado previamente
      state.lastSyncedAt = '2026-10-25T12:00:00Z';
      state.recipes = [
        { id: 'rec-activa', title: 'Receta Activa', updatedAt: '2026-10-25T11:00:00Z' },
        { id: 'rec-borrada-en-otro-dispositivo', title: 'Receta Borrada Remotamente', updatedAt: '2026-10-25T11:30:00Z' }
      ];

      // En Supabase solo queda 'rec-activa' (la otra fue borrada por otro dispositivo)
      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: table === 'recipes' ? [
                { id: 'rec-activa', title: 'Receta Activa', updated_at: '2026-10-25T11:00:00Z' }
              ] : [],
              error: null
            })
          })
        }))
      };

      appInstance.supabaseClient = mockSupabase;
      const res = await appInstance.pullFromCloud();

      expect(res.success).toBe(true);
      expect(state.recipes.some(r => r.id === 'rec-activa')).toBe(true);
      expect(state.recipes.some(r => r.id === 'rec-borrada-en-otro-dispositivo')).toBe(false);
    });
  });

  // 6. BUG-24: Debounce y sincronización diferida
  describe('BUG-24: Sincronización diferida con debounce', () => {
    it('scheduleSyncWithCloud no debe lanzar peticiones inmediatas y flushSync las ejecuta', async () => {
      let pushCalled = 0;
      appInstance.pushToCloud = vi.fn().mockImplementation(() => {
        pushCalled++;
        return Promise.resolve({ success: true });
      });
      appInstance.supabaseClient = {};

      appInstance.scheduleSyncWithCloud(500);
      expect(appInstance.syncDebounceTimer).not.toBeNull();
      expect(pushCalled).toBe(0);

      // flushSync fuerza la ejecución de inmediato
      appInstance.flushSync();
      expect(appInstance.syncDebounceTimer).toBeNull();
      expect(pushCalled).toBe(1);
    });
  });

  // 7. Contador y ordenación consistente de recetas (multi-dispositivo)
  describe('Consistencia de recetas: Contador visual y ordenación por fecha de creación', () => {
    it('getSortedRecipes debe ordenar las recetas por fecha de creación (más nuevas arriba, más viejas al final)', () => {
      const recipesWithDates = [
        { id: 'rec-old', title: 'Receta Antigua', createdAt: '2026-01-01T10:00:00Z', tags: [] },
        { id: 'rec-new', title: 'Receta Recientísima', createdAt: '2026-10-25T12:00:00Z', tags: [] },
        { id: 'rec-mid', title: 'Receta Intermedia', createdAt: '2026-05-15T10:00:00Z', tags: [] }
      ];

      const sorted = appInstance.getSortedRecipes(recipesWithDates);
      expect(sorted[0].id).toBe('rec-new');
      expect(sorted[1].id).toBe('rec-mid');
      expect(sorted[2].id).toBe('rec-old');
    });

    it('getSortedRecipes debe desempatar alfabéticamente (A-Z) si las fechas son idénticas o no existen', () => {
      const seeds = [
        { id: 'rec-z', title: 'Zumo de naranja', tags: [] },
        { id: 'rec-a', title: 'Arroz con verduras', tags: [] },
        { id: 'rec-m', title: 'Macarrones con queso', tags: [] }
      ];

      const sorted = appInstance.getSortedRecipes(seeds);
      expect(sorted[0].title).toBe('Arroz con verduras');
      expect(sorted[1].title).toBe('Macarrones con queso');
      expect(sorted[2].title).toBe('Zumo de naranja');
    });

    it('renderRecipesGrid debe actualizar el badge y subtítulo del contador de recetas', () => {
      document.body.innerHTML += `
        <span id="recipes-count-badge">0</span>
        <p id="recipes-count-subtitle"></p>
        <div id="recipes-cards-grid"></div>
      `;

      state.recipes = [
        { id: 'r1', title: 'Receta 1', tags: [], imageUrl: '' },
        { id: 'r2', title: 'Receta 2', tags: [], imageUrl: '' }
      ];

      appInstance.renderRecipesGrid(state.recipes);

      const badge = document.getElementById('recipes-count-badge');
      const subtitle = document.getElementById('recipes-count-subtitle');

      expect(badge.textContent).toBe('2');
      expect(subtitle.textContent).toBe('Tu recetario personal.');

      // Filtrado parcial
      appInstance.renderRecipesGrid([state.recipes[0]]);
      expect(badge.textContent).toBe('1 de 2');
    });
  });

  // 8. Sincronización multi-dispositivo de Preferencias Dietéticas y Tags Personalizados
  describe('Multi-dispositivo: Sincronización de Preferencias Dietéticas y Tags Personalizados', () => {
    it('pushToCloud debe enviar preferencias dietéticas y etiquetas personalizadas a user_metadata', async () => {
      let updatedUserMetadata = null;
      let upsertTable = null;
      let upsertPayload = null;

      const mockSupabase = {
        auth: {
          updateUser: vi.fn().mockImplementation(async ({ data }) => {
            updatedUserMetadata = data;
            return { data: { user: { user_metadata: data } }, error: null };
          })
        },
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null })
            })
          }),
          upsert: vi.fn().mockImplementation(async (payload) => {
            upsertPayload = payload;
            return { data: payload, error: null };
          })
        })
      };

      appInstance.supabaseClient = mockSupabase;
      state.saveDietaryPreferences(['Vegano', 'Sin Gluten']);
      state.addCustomTag('Airfryer Pro');

      const pushRes = await appInstance.pushToCloud(true);
      expect(pushRes.success).toBe(true);
      expect(mockSupabase.auth.updateUser).toHaveBeenCalled();
      expect(updatedUserMetadata.dietary_preferences).toEqual(['Vegano', 'Sin Gluten']);
      expect(updatedUserMetadata.custom_tags).toContain('Airfryer Pro');
    });

    it('pullFromCloud debe descargar preferencias dietéticas y etiquetas de user_metadata y fusionarlas', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'test-user-uuid-1234',
                user_metadata: {
                  dietary_preferences: ['Keto', 'Alta en Proteínas'],
                  custom_tags: ['MealPrep Rápido'],
                  dietary_updated_at: '2026-10-27T15:00:00Z'
                }
              }
            },
            error: null
          })
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      };

      state.dietaryPreferences = [];
      state.customTags = [];
      state.dietaryUpdatedAt = null;

      appInstance.supabaseClient = mockSupabase;
      const pullRes = await appInstance.pullFromCloud();

      expect(pullRes.success).toBe(true);
      expect(state.dietaryPreferences).toEqual(['Keto', 'Alta en Proteínas']);
      expect(state.customTags).toContain('MealPrep Rápido');
      expect(localStorage.getItem('fa_dietary_preferences')).toBe(JSON.stringify(['Keto', 'Alta en Proteínas']));
    });

    it('toggleDietaryPreference programa la sincronización con la nube', () => {
      const scheduleSpy = vi.spyOn(appInstance, 'scheduleSyncWithCloud');
      appInstance.toggleDietaryPreference('Vegano');

      expect(state.dietaryPreferences).toContain('Vegano');
      expect(scheduleSpy).toHaveBeenCalled();
    });
  });
});

