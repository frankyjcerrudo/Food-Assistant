/**
 * Controlador principal de Sabory Admin (US-87b+).
 * Gestiona el guard de acceso Zero-Trust (`is_admin()`), sesión Supabase Auth,
 * navegación de vistas administrativas y Dashboard ejecutivo de KPIs.
 */

import {
  DEFAULT_EUR_PER_USD,
  computeRevenueMetrics,
  summarizeAiUsage,
  derivePlanBreakdownFromUsers,
  validateEntitlementChange,
  validateQuotaResetRequest,
  formatAuditSummary,
  summarizeSupabaseStorage
} from './admin-core.js';

const PLAN_BREAKDOWN_SPEC = Object.freeze([
  { key: 'free', labelKey: 'admin.planFree', tone: 'terracotta' },
  { key: 'play_monthly', labelKey: 'admin.planPlayMonthly', tone: 'sage' },
  { key: 'play_annual', labelKey: 'admin.planPlayAnnual', tone: 'sage' },
  { key: 'trial', labelKey: 'admin.planTrial', tone: 'terracotta' },
  { key: 'gift', labelKey: 'admin.planGift', tone: 'sage' },
  { key: 'admin', labelKey: 'admin.planAdmin', tone: 'sage' },
  { key: 'household_pro', labelKey: 'admin.planHousehold', tone: 'sage' },
  { key: 'on_hold', labelKey: 'admin.planOnHold', tone: 'terracotta' },
  { key: 'canceled_active', labelKey: 'admin.planCanceledActive', tone: 'terracotta' }
]);

const VALID_VIEWS = Object.freeze(['dashboard', 'users', 'ai', 'households', 'audit']);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toSafeCount(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : 0;
}

export class SaboryAdminApp {
  constructor(options = {}) {
    this.doc = options.documentRef || (typeof document !== 'undefined' ? document : null);
    this.win = options.windowRef || (typeof window !== 'undefined' ? window : null);
    this.i18n = options.i18n || this.win?.I18n || null;
    this.supabaseClient = options.supabaseClient || null;

    this.currentUser = null;
    this.activeView = 'dashboard';
    this.stats = null;
    this.statsDays = 30;
    this.lastUpdatedAt = null;
    this.usersSearch = '';
    this.usersPlanFilter = 'all';
    this.usersSourceFilter = 'all';
    this.usersStatusFilter = 'all';
    this.usersPageLimit = 25;
    this.usersOffset = 0;
    this.usersTotal = 0;
    this.usersItems = [];
    this.usersLoaded = false;
    this.selectedUserId = null;
    this.selectedUserDetail = null;
    this._usersSearchTimer = null;
    this.householdsSearch = '';
    this.householdsPageLimit = 25;
    this.householdsOffset = 0;
    this.householdsTotal = 0;
    this.householdsItems = [];
    this.householdsLoaded = false;
    this.selectedHouseholdId = null;
    this.selectedHousehold = null;
    this._householdsSearchTimer = null;
    this.auditPageLimit = 50;
    this.auditOffset = 0;
    this.auditTotal = 0;
    this.auditItems = [];
    this.auditLoaded = false;
    this._confirmResolver = null;
    this._eventsBound = false;
    this._authListenerBound = false;
    this.els = {};
  }

  t(key, params) {
    if (this.i18n && typeof this.i18n.t === 'function') {
      return this.i18n.t(key, params);
    }
    return key;
  }

  getLocale() {
    const lang = this.i18n?.getLanguage?.() || this.doc?.documentElement?.getAttribute('lang') || 'es';
    return lang === 'en' ? 'en-US' : 'es-ES';
  }

  formatInt(value) {
    return toSafeCount(value).toLocaleString(this.getLocale());
  }

  formatDecimal(value, digits = 2) {
    const num = Number(value);
    const safe = Number.isFinite(num) ? num : 0;
    return safe.toLocaleString(this.getLocale(), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  formatEur(value) {
    return `${this.formatDecimal(value, 2)} €`;
  }

  cacheElements() {
    const d = this.doc;
    if (!d) return;
    const byId = (id) => d.getElementById(id);

    this.els = {
      authGate: byId('admin-auth-gate'),
      authLoading: byId('admin-auth-loading'),
      loginCard: byId('admin-login-card'),
      loginForm: byId('admin-login-form'),
      loginEmail: byId('admin-login-email'),
      loginPassword: byId('admin-login-password'),
      loginSubmit: byId('btn-admin-login-submit'),
      loginError: byId('admin-login-error'),
      googleLoginBtn: byId('btn-admin-google-login'),
      forbiddenCard: byId('admin-forbidden-card'),
      forbiddenEmail: byId('admin-forbidden-email'),
      forbiddenSignoutBtn: byId('btn-admin-forbidden-signout'),

      shell: byId('admin-shell'),
      activeEmail: byId('admin-active-email'),
      periodSelect: byId('admin-dashboard-days'),
      refreshBtn: byId('btn-admin-refresh'),
      langBtn: byId('btn-admin-lang'),
      langCode: byId('admin-lang-code'),
      themeBtn: byId('btn-admin-theme'),
      themeIcon: byId('admin-theme-icon'),
      logoutBtn: byId('btn-admin-logout'),
      lastUpdated: byId('admin-last-updated'),

      kpiTotalUsers: byId('kpi-total-users'),
      kpiNewUsersSub: byId('kpi-new-users-sub'),
      kpiActiveUsers: byId('kpi-active-users'),
      kpiProUsers: byId('kpi-pro-users'),
      kpiPaidUsersSub: byId('kpi-paid-users-sub'),
      kpiConversionRate: byId('kpi-conversion-rate'),
      kpiMrrEur: byId('kpi-mrr-eur'),
      kpiMrrSub: byId('kpi-mrr-sub'),
      kpiArrEur: byId('kpi-arr-eur'),
      kpiAiCallsToday: byId('kpi-ai-calls-today'),
      kpiAiCallsPeriod: byId('kpi-ai-calls-period'),
      kpiAiCostMonth: byId('kpi-ai-cost-month'),
      kpiAiTokensSub: byId('kpi-ai-tokens-sub'),
      kpiAiErrorRate: byId('kpi-ai-error-rate'),
      kpiAiErrorSub: byId('kpi-ai-error-sub'),
      kpiTotalRecipes: byId('kpi-total-recipes'),
      kpiHouseholdsSummary: byId('kpi-households-summary'),
      kpiTotalMealPlans: byId('kpi-total-meal-plans'),
      kpiTotalShoppingItems: byId('kpi-total-shopping-items'),

      planBreakdown: byId('admin-plan-breakdown'),
      topDomains: byId('admin-top-domains'),
      kpiDbSize: byId('kpi-db-size'),
      kpiDbSizeMeta: byId('kpi-db-size-meta'),
      adminDbQuotaBar: byId('admin-db-quota-bar'),
      kpiBase64Images: byId('kpi-base64-images'),
      kpiBase64ImagesMeta: byId('kpi-base64-images-meta'),
      adminStorageBreakdown: byId('admin-storage-breakdown'),
      toastContainer: byId('admin-toast-container'),

      usersSearchInput: byId('admin-users-search'),
      filterPlanSelect: byId('admin-filter-plan'),
      filterSourceSelect: byId('admin-filter-source'),
      filterStatusSelect: byId('admin-filter-status'),
      usersCountBadge: byId('admin-users-count'),
      usersList: byId('admin-users-list'),
      usersPrevBtn: byId('btn-users-prev'),
      usersNextBtn: byId('btn-users-next'),

      userModal: byId('modal-admin-user'),
      userModalEmail: byId('admin-user-modal-email'),
      userModalCloseBtn: byId('btn-admin-user-close'),
      userUuidEl: byId('admin-user-uuid'),
      copyUuidBtn: byId('btn-admin-copy-uuid'),
      userCreatedEl: byId('admin-user-created'),
      userLastSignInEl: byId('admin-user-last-signin'),
      userProviderEl: byId('admin-user-provider'),
      userServingsEl: byId('admin-user-servings'),
      userDietaryEl: byId('admin-user-dietary'),
      userGoalsEl: byId('admin-user-goals'),
      userHouseholdEl: byId('admin-user-household'),
      userActivityBadgesEl: byId('admin-user-activity-badges'),
      userPlanBadgeEl: byId('admin-user-plan-badge'),
      userPlanMetaEl: byId('admin-user-plan-meta'),
      userPlayNoticeEl: byId('admin-user-play-notice'),
      gift14dBtn: byId('btn-admin-gift-14d'),
      gift30dBtn: byId('btn-admin-gift-30d'),
      gift90dBtn: byId('btn-admin-gift-90d'),
      gift365dBtn: byId('btn-admin-gift-365d'),
      grantPermanentBtn: byId('btn-admin-grant-permanent'),
      revokeProBtn: byId('btn-admin-revoke-pro'),
      entitlementForm: byId('admin-entitlement-form'),
      giftDaysInput: byId('input-admin-gift-days'),
      entitlementNotesInput: byId('input-admin-entitlement-notes'),
      wipeUserDataBtn: byId('btn-admin-wipe-user-data'),
      deleteUserBtn: byId('btn-admin-delete-user'),
      userQuotasSummaryEl: byId('admin-user-quotas-summary'),
      quotaFeatureSelect: byId('select-admin-quota-feature'),
      resetQuotaBtn: byId('btn-admin-reset-quota'),
      userAuditListEl: byId('admin-user-audit-list'),

      aiRangeSelect: byId('admin-ai-range'),
      aiKpiCost: byId('ai-kpi-cost'),
      aiKpiCostMeta: byId('ai-kpi-cost-meta'),
      aiKpiTokens: byId('ai-kpi-tokens'),
      aiKpiTokensMeta: byId('ai-kpi-tokens-meta'),
      aiKpiCalls: byId('ai-kpi-calls'),
      aiKpiCallsMeta: byId('ai-kpi-calls-meta'),
      aiKpiMargin: byId('ai-kpi-margin'),
      aiKpiMarginMeta: byId('ai-kpi-margin-meta'),
      aiByFeature: byId('admin-ai-by-feature'),
      aiByModel: byId('admin-ai-by-model'),
      aiHeavyUsersList: byId('admin-ai-heavy-users'),
      aiFreeCappedList: byId('admin-ai-free-capped'),

      householdsCountBadge: byId('admin-households-count'),
      householdsSearchInput: byId('admin-households-search'),
      householdsList: byId('admin-households-list'),
      householdsPrevBtn: byId('btn-households-prev'),
      householdsNextBtn: byId('btn-households-next'),
      householdModal: byId('modal-admin-household'),
      householdModalTitleEl: byId('admin-household-modal-title'),
      householdModalMetaEl: byId('admin-household-modal-meta'),
      householdModalCloseBtn: byId('btn-admin-household-close'),
      householdStatusBadgeEl: byId('admin-household-status-badge'),
      householdInviteCodeEl: byId('admin-household-invite-code'),
      householdRegenCodeBtn: byId('btn-admin-regen-code'),
      householdMembersListEl: byId('admin-household-members-list'),

      auditCountBadge: byId('admin-audit-count'),
      auditList: byId('admin-audit-list'),
      auditPrevBtn: byId('btn-audit-prev'),
      auditNextBtn: byId('btn-audit-next'),

      confirmModal: byId('modal-admin-confirm'),
      confirmTitleEl: byId('admin-confirm-title'),
      confirmMsgEl: byId('admin-confirm-msg'),
      confirmCancelBtn: byId('btn-admin-confirm-cancel'),
      confirmOkBtn: byId('btn-admin-confirm-ok')
    };
  }

  createSupabaseClient() {
    if (this.supabaseClient) return this.supabaseClient;
    const cfg = this.win?.APP_CONFIG || {};
    const rawUrl = String(cfg.supabaseUrl || '').trim();
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    const cleanKey = String(cfg.supabaseAnonKey || '').trim();

    if (this.win?.supabase?.createClient && cleanUrl && cleanKey) {
      this.supabaseClient = this.win.supabase.createClient(cleanUrl, cleanKey);
    }
    return this.supabaseClient;
  }

  async init() {
    this.cacheElements();
    this.bindEvents();
    this.syncThemeUI();
    this.syncLanguageUI();

    const client = this.createSupabaseClient();
    if (!client) {
      this.showLoginGate(this.t('admin.configMissingError'));
      return;
    }

    this.bindAuthStateListener();
    await this.checkAccessAndBoot();
  }

  bindEvents() {
    if (this._eventsBound || !this.doc) return;
    this._eventsBound = true;

    this.els.loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePasswordLogin();
    });

    this.els.googleLoginBtn?.addEventListener('click', () => {
      this.handleGoogleLogin();
    });

    this.els.forbiddenSignoutBtn?.addEventListener('click', () => {
      this.handleSignOut();
    });

    this.els.logoutBtn?.addEventListener('click', () => {
      this.handleSignOut();
    });

    this.els.refreshBtn?.addEventListener('click', () => {
      if (this.activeView === 'users') {
        this.loadUsers({ resetOffset: false });
      } else if (this.activeView === 'households') {
        this.loadHouseholds({ resetOffset: false });
      } else if (this.activeView === 'audit') {
        this.loadAuditLog({ resetOffset: false });
      } else {
        this.loadDashboardStats();
      }
    });

    this.els.periodSelect?.addEventListener('change', () => {
      const days = Number(this.els.periodSelect?.value) || 30;
      if (this.els.aiRangeSelect) {
        this.els.aiRangeSelect.value = String(days);
      }
      this.loadDashboardStats(days);
    });

    this.els.aiRangeSelect?.addEventListener('change', () => {
      const days = Number(this.els.aiRangeSelect?.value) || 30;
      if (this.els.periodSelect && ['7', '30', '90'].includes(String(days))) {
        this.els.periodSelect.value = String(days);
      }
      this.loadDashboardStats(days);
    });

    this.els.themeBtn?.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.els.langBtn?.addEventListener('click', () => {
      this.toggleLanguage();
    });

    this.doc.querySelectorAll('[data-admin-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-admin-view');
        if (view) this.switchAdminView(view);
      });
    });

    this.els.usersSearchInput?.addEventListener('input', (e) => {
      this.usersSearch = String(e.target?.value || '').trim();
      const timerApi = this.win || globalThis;
      if (this._usersSearchTimer) {
        timerApi.clearTimeout(this._usersSearchTimer);
      }
      this._usersSearchTimer = timerApi.setTimeout(() => {
        this.loadUsers({ resetOffset: true });
      }, 250);
    });

    this.els.filterPlanSelect?.addEventListener('change', (e) => {
      this.usersPlanFilter = String(e.target?.value || 'all');
      this.loadUsers({ resetOffset: true });
    });

    this.els.filterSourceSelect?.addEventListener('change', (e) => {
      this.usersSourceFilter = String(e.target?.value || 'all');
      this.loadUsers({ resetOffset: true });
    });

    this.els.filterStatusSelect?.addEventListener('change', (e) => {
      this.usersStatusFilter = String(e.target?.value || 'all');
      this.loadUsers({ resetOffset: true });
    });

    this.els.usersPrevBtn?.addEventListener('click', () => {
      if (this.usersOffset <= 0) return;
      this.usersOffset = Math.max(0, this.usersOffset - this.usersPageLimit);
      this.loadUsers({ resetOffset: false });
    });

    this.els.usersNextBtn?.addEventListener('click', () => {
      if (this.usersOffset + this.usersPageLimit >= this.usersTotal) return;
      this.usersOffset += this.usersPageLimit;
      this.loadUsers({ resetOffset: false });
    });

    this.els.usersList?.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('[data-open-user-id]');
      if (!btn) return;
      const userId = btn.getAttribute('data-open-user-id');
      if (userId) this.openUserDetailModal(userId);
    });

    this.els.userModalCloseBtn?.addEventListener('click', () => {
      this.closeDialog(this.els.userModal);
    });

    this.els.copyUuidBtn?.addEventListener('click', () => {
      this.copySelectedUuid();
    });

    const quickGifts = [
      [this.els.gift14dBtn, { plan: 'pro', source: 'gift', status: 'active', days: 14 }],
      [this.els.gift30dBtn, { plan: 'pro', source: 'gift', status: 'active', days: 30 }],
      [this.els.gift90dBtn, { plan: 'pro', source: 'gift', status: 'active', days: 90 }],
      [this.els.gift365dBtn, { plan: 'pro', source: 'gift', status: 'active', days: 365 }],
      [this.els.grantPermanentBtn, { plan: 'pro', source: 'admin', status: 'active', days: null }],
      [this.els.revokeProBtn, { plan: 'free', source: 'none', status: 'active', days: null }]
    ];
    quickGifts.forEach(([btn, spec]) => {
      btn?.addEventListener('click', () => this.applyEntitlementChange(spec));
    });

    this.els.entitlementForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawDays = Number(this.els.giftDaysInput?.value);
      this.applyEntitlementChange({
        plan: 'pro',
        source: 'gift',
        status: 'active',
        days: Number.isFinite(rawDays) && rawDays > 0 ? Math.floor(rawDays) : null
      });
    });

    this.els.wipeUserDataBtn?.addEventListener('click', () => {
      this.handleDeleteUserData('wipe_data');
    });

    this.els.deleteUserBtn?.addEventListener('click', () => {
      this.handleDeleteUserData('delete_account');
    });

    this.els.confirmCancelBtn?.addEventListener('click', () => {
      this.resolveConfirm(false);
    });

    this.els.confirmOkBtn?.addEventListener('click', () => {
      this.resolveConfirm(true);
    });

    this.els.resetQuotaBtn?.addEventListener('click', () => {
      if (!this.selectedUserId) return;
      const feature = String(this.els.quotaFeatureSelect?.value || 'all');
      this.handleResetUserQuota(this.selectedUserId, feature);
    });

    const bindAiActionList = (listEl) => {
      listEl?.addEventListener('click', (e) => {
        const resetBtn = e.target?.closest?.('[data-reset-quota-user]');
        if (resetBtn) {
          const userId = resetBtn.getAttribute('data-reset-quota-user');
          if (!userId) return;
          const row = resetBtn.closest('[data-user-id]');
          const sel = row?.querySelector?.('[data-quota-feature-select]');
          const feature = String(sel?.value || resetBtn.getAttribute('data-reset-feature') || 'all');
          this.handleResetUserQuota(userId, feature);
          return;
        }
        const openBtn = e.target?.closest?.('[data-open-user-id]');
        if (openBtn) {
          const userId = openBtn.getAttribute('data-open-user-id');
          if (userId) this.openUserDetailModal(userId);
        }
      });
    };
    bindAiActionList(this.els.aiHeavyUsersList);
    bindAiActionList(this.els.aiFreeCappedList);

    this.els.householdsSearchInput?.addEventListener('input', (e) => {
      this.householdsSearch = String(e.target?.value || '').trim();
      const timerApi = this.win || globalThis;
      if (this._householdsSearchTimer) {
        timerApi.clearTimeout(this._householdsSearchTimer);
      }
      this._householdsSearchTimer = timerApi.setTimeout(() => {
        this.loadHouseholds({ resetOffset: true });
      }, 250);
    });

    this.els.householdsPrevBtn?.addEventListener('click', () => {
      if (this.householdsOffset <= 0) return;
      this.householdsOffset = Math.max(0, this.householdsOffset - this.householdsPageLimit);
      this.loadHouseholds({ resetOffset: false });
    });

    this.els.householdsNextBtn?.addEventListener('click', () => {
      if (this.householdsOffset + this.householdsPageLimit >= this.householdsTotal) return;
      this.householdsOffset += this.householdsPageLimit;
      this.loadHouseholds({ resetOffset: false });
    });

    this.els.householdsList?.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('[data-manage-household-id]');
      if (!btn) return;
      const householdId = btn.getAttribute('data-manage-household-id');
      if (householdId) this.openHouseholdModal(householdId);
    });

    this.els.householdModalCloseBtn?.addEventListener('click', () => {
      this.closeDialog(this.els.householdModal);
      this.selectedHouseholdId = null;
      this.selectedHousehold = null;
    });

    this.els.householdRegenCodeBtn?.addEventListener('click', () => {
      if (this.selectedHouseholdId) {
        this.handleManageHousehold(this.selectedHouseholdId, 'regenerate_code');
      }
    });

    this.els.householdMembersListEl?.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('[data-household-action][data-target-user-id]');
      if (!btn || !this.selectedHouseholdId) return;
      const action = btn.getAttribute('data-household-action');
      const targetUserId = btn.getAttribute('data-target-user-id');
      if (action && targetUserId) {
        this.handleManageHousehold(this.selectedHouseholdId, action, targetUserId);
      }
    });

    this.els.auditPrevBtn?.addEventListener('click', () => {
      if (this.auditOffset <= 0) return;
      this.auditOffset = Math.max(0, this.auditOffset - this.auditPageLimit);
      this.loadAuditLog({ resetOffset: false });
    });

    this.els.auditNextBtn?.addEventListener('click', () => {
      if (this.auditOffset + this.auditPageLimit >= this.auditTotal) return;
      this.auditOffset += this.auditPageLimit;
      this.loadAuditLog({ resetOffset: false });
    });

    this.els.auditList?.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('[data-open-user-id]');
      if (!btn) return;
      const userId = btn.getAttribute('data-open-user-id');
      if (userId) this.openUserDetailModal(userId);
    });
  }

  bindAuthStateListener() {
    if (this._authListenerBound || !this.supabaseClient?.auth?.onAuthStateChange) return;
    this._authListenerBound = true;

    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.stats = null;
        this.showLoginGate();
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        if (!this.currentUser || this.currentUser.id !== session.user.id) {
          this.checkAccessAndBoot();
        }
      }
    });
  }

  setGateMode(mode) {
    if (this.els.authLoading) this.els.authLoading.hidden = mode !== 'loading';
    if (this.els.loginCard) this.els.loginCard.hidden = mode !== 'login';
    if (this.els.forbiddenCard) this.els.forbiddenCard.hidden = mode !== 'forbidden';

    const showShell = mode === 'authenticated';
    if (this.els.authGate) this.els.authGate.hidden = showShell;
    if (this.els.shell) this.els.shell.hidden = !showShell;
  }

  showLoginError(message) {
    if (!this.els.loginError) return;
    if (!message) {
      this.els.loginError.textContent = '';
      this.els.loginError.hidden = true;
      return;
    }
    this.els.loginError.textContent = message;
    this.els.loginError.hidden = false;
  }

  showLoginGate(errorMessage = '') {
    this.currentUser = null;
    this.setGateMode('login');
    this.showLoginError(errorMessage);
  }

  showForbiddenGate(email = '') {
    this.currentUser = null;
    if (this.els.forbiddenEmail) {
      this.els.forbiddenEmail.textContent = email || '';
    }
    this.setGateMode('forbidden');
  }

  async checkAccessAndBoot() {
    if (!this.supabaseClient) {
      this.showLoginGate(this.t('admin.configMissingError'));
      return false;
    }

    this.setGateMode('loading');
    this.showLoginError('');

    try {
      const { data, error } = await this.supabaseClient.auth.getSession();
      const session = data?.session;

      if (error || !session?.user) {
        this.showLoginGate();
        return false;
      }

      const { data: isAdmin, error: rpcError } = await this.supabaseClient.rpc('is_admin');
      if (rpcError || isAdmin !== true) {
        this.showForbiddenGate(session.user.email || '');
        return false;
      }

      this.currentUser = session.user;
      if (this.els.activeEmail) {
        this.els.activeEmail.textContent = session.user.email || '';
      }
      this.setGateMode('authenticated');
      this.switchAdminView(this.activeView);
      await this.loadDashboardStats();
      return true;
    } catch (err) {
      this.showLoginGate(err?.message || this.t('admin.loginError'));
      return false;
    }
  }

  async handlePasswordLogin() {
    if (!this.supabaseClient?.auth?.signInWithPassword) return;
    const email = (this.els.loginEmail?.value || '').trim();
    const password = this.els.loginPassword?.value || '';

    if (!email || !password) {
      this.showLoginError(this.t('admin.missingEmailPassword'));
      return;
    }

    this.showLoginError('');
    if (this.els.loginSubmit) this.els.loginSubmit.disabled = true;

    try {
      const { error } = await this.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        this.showLoginError(error.message || this.t('admin.loginError'));
        return;
      }
      await this.checkAccessAndBoot();
    } catch (err) {
      this.showLoginError(err?.message || this.t('admin.loginError'));
    } finally {
      if (this.els.loginSubmit) this.els.loginSubmit.disabled = false;
    }
  }

  async handleGoogleLogin() {
    if (!this.supabaseClient?.auth?.signInWithOAuth) return;
    try {
      const redirectTo = this.win?.location
        ? `${this.win.location.origin}${this.win.location.pathname}`
        : undefined;
      const { error } = await this.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      });
      if (error) throw error;
    } catch (err) {
      this.showLoginError(err?.message || this.t('admin.loginError'));
    }
  }

  async handleSignOut() {
    if (this.supabaseClient?.auth?.signOut) {
      try {
        await this.supabaseClient.auth.signOut();
      } catch (err) {
        this.showToast(err?.message || this.t('admin.loginError'), 'error');
      }
    }
    this.stats = null;
    this.showLoginGate();
  }

  switchAdminView(viewName) {
    if (!VALID_VIEWS.includes(viewName)) return;
    this.activeView = viewName;
    if (!this.doc) return;

    this.doc.querySelectorAll('[data-admin-view]').forEach((btn) => {
      const isMatch = btn.getAttribute('data-admin-view') === viewName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-current', isMatch ? 'page' : 'false');
    });

    VALID_VIEWS.forEach((v) => {
      const panel = this.doc.getElementById(`admin-view-${v}`);
      if (!panel) return;
      const isActive = v === viewName;
      panel.hidden = !isActive;
      panel.classList.toggle('active', isActive);
    });

    if (viewName === 'users' && !this.usersLoaded) {
      this.loadUsers({ resetOffset: true });
    } else if (viewName === 'households' && !this.householdsLoaded) {
      this.loadHouseholds({ resetOffset: true });
    } else if (viewName === 'audit' && !this.auditLoaded) {
      this.loadAuditLog({ resetOffset: true });
    } else if ((viewName === 'ai' || viewName === 'dashboard') && !this.stats) {
      this.loadDashboardStats();
    }
  }

  async loadDashboardStats(overrideDays = null) {
    if (!this.supabaseClient?.rpc) return null;
    const activeDefaultDays = this.activeView === 'ai'
      ? (this.els.aiRangeSelect?.value || this.statsDays)
      : (this.els.periodSelect?.value || this.statsDays);
    const days = Number(overrideDays || activeDefaultDays) || 30;
    this.statsDays = days;
    if (this.els.aiRangeSelect) {
      const hasAiOpt = Array.from(this.els.aiRangeSelect.options || []).some((opt) => String(opt.value) === String(days));
      if (hasAiOpt) this.els.aiRangeSelect.value = String(days);
    }
    if (this.els.periodSelect && ['7', '30', '90'].includes(String(days))) {
      this.els.periodSelect.value = String(days);
    }

    if (this.els.refreshBtn) this.els.refreshBtn.disabled = true;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_get_dashboard_stats', {
        p_days: days
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingStats'));
      }

      // Auto-reconciliación si admin_get_dashboard_stats antiguo omitió usuarios sin fila en entitlements
      const totalUsers = toSafeCount(data.users?.total);
      const revCheck = computeRevenueMetrics(data.plans, totalUsers);
      const accounted = toSafeCount(data.plans?.free) + revCheck.proTotal;
      if (totalUsers > 0 && accounted < totalUsers) {
        try {
          const listRes = await this.supabaseClient.rpc('admin_list_users', {
            p_search: null,
            p_plan: 'all',
            p_source: 'all',
            p_status: 'all',
            p_limit: 100,
            p_offset: 0
          });
          if (listRes?.data?.items?.length) {
            data.plans = derivePlanBreakdownFromUsers(listRes.data.items, data.plans);
            if (!this.usersLoaded) {
              this.usersTotal = toSafeCount(listRes.data.total ?? listRes.data.items.length);
              this.usersItems = listRes.data.items.slice(0, this.usersPageLimit);
              this.usersLoaded = true;
              this.renderUsersList();
            }
          }
        } catch (_) {
          // Respaldo silencioso si no hay respuesta del listado
        }
      }

      this.stats = data;
      this.lastUpdatedAt = new Date();
      this.renderDashboard(data, days);
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorLoadingStats'), 'error');
      return null;
    } finally {
      if (this.els.refreshBtn) this.els.refreshBtn.disabled = false;
    }
  }

  renderDashboard(stats = {}, days = 30) {
    const users = stats.users || {};
    const plans = stats.plans || {};
    const catalog = stats.catalog || {};
    const ai = stats.ai || {};
    const periodDays = Number(ai.period_days || days || 30);

    const rev = computeRevenueMetrics(plans, users.total);
    const aiSummary = summarizeAiUsage(Array.isArray(ai.by_feature_model) ? ai.by_feature_model : []);

    // Respaldo a totales agregados si no vienen filas desglosadas
    const totalCalls = aiSummary.callsTotal > 0 ? aiSummary.callsTotal : toSafeCount(ai.calls_total);
    const callsOk = aiSummary.callsTotal > 0 ? aiSummary.callsOk : toSafeCount(ai.calls_ok);
    const callsError = aiSummary.callsTotal > 0 ? aiSummary.callsError : toSafeCount(ai.calls_error);
    const callsReset = aiSummary.callsTotal > 0 ? aiSummary.callsReset : toSafeCount(ai.calls_reset);
    const totalTokens = aiSummary.totalTokens > 0
      ? aiSummary.totalTokens
      : (toSafeCount(ai.prompt_tokens) + toSafeCount(ai.output_tokens));
    const errorRatePct = aiSummary.callsTotal > 0
      ? aiSummary.errorRatePct
      : (totalCalls > 0 ? Math.round(((callsError / totalCalls) * 100) * 100) / 100 : 0);

    if (this.els.kpiTotalUsers) this.els.kpiTotalUsers.textContent = this.formatInt(users.total);
    if (this.els.kpiNewUsersSub) {
      this.els.kpiNewUsersSub.textContent = this.t('admin.kpiNewUsersMeta', {
        d7: this.formatInt(users.new_7d),
        d30: this.formatInt(users.new_30d)
      });
    }
    if (this.els.kpiActiveUsers) {
      this.els.kpiActiveUsers.textContent = `${this.formatInt(users.dau)} / ${this.formatInt(users.wau)} / ${this.formatInt(users.mau)}`;
    }

    if (this.els.kpiProUsers) this.els.kpiProUsers.textContent = this.formatInt(rev.proTotal);
    if (this.els.kpiPaidUsersSub) {
      this.els.kpiPaidUsersSub.textContent = this.t('admin.kpiPaidUsersMeta', {
        paid: this.formatInt(rev.paidUsers),
        coverage: this.formatDecimal(rev.proCoveragePct, 1)
      });
    }

    if (this.els.kpiConversionRate) {
      this.els.kpiConversionRate.textContent = `${this.formatDecimal(rev.conversionRatePct, 2)}%`;
    }
    if (this.els.kpiMrrEur) this.els.kpiMrrEur.textContent = this.formatEur(rev.mrrEur);
    if (this.els.kpiMrrSub) {
      this.els.kpiMrrSub.textContent = this.t('admin.kpiMrrMeta', {
        monthly: this.formatInt(rev.paidMonthly),
        annual: this.formatInt(rev.paidAnnual)
      });
    }
    if (this.els.kpiArrEur) this.els.kpiArrEur.textContent = this.formatEur(rev.arrEur);

    if (this.els.kpiAiCallsToday) this.els.kpiAiCallsToday.textContent = this.formatInt(ai.today_calls);
    if (this.els.kpiAiCallsPeriod) {
      this.els.kpiAiCallsPeriod.textContent = this.t('admin.kpiAiCallsPeriodMeta', {
        total: this.formatInt(totalCalls),
        days: periodDays
      });
    }

    if (this.els.kpiAiCostMonth) {
      this.els.kpiAiCostMonth.textContent = `${this.formatEur(aiSummary.costEur)} ($${this.formatDecimal(aiSummary.costUsd, 2)})`;
    }
    if (this.els.kpiAiTokensSub) {
      this.els.kpiAiTokensSub.textContent = this.t('admin.kpiAiTokensMeta', {
        tokens: this.formatInt(totalTokens)
      });
    }

    if (this.els.kpiAiErrorRate) this.els.kpiAiErrorRate.textContent = `${this.formatDecimal(errorRatePct, 2)}%`;
    if (this.els.kpiAiErrorSub) {
      this.els.kpiAiErrorSub.textContent = this.t('admin.kpiAiErrorMeta', {
        ok: this.formatInt(callsOk),
        err: this.formatInt(callsError),
        reset: this.formatInt(callsReset)
      });
    }

    if (this.els.kpiTotalRecipes) this.els.kpiTotalRecipes.textContent = this.formatInt(catalog.total_recipes);
    if (this.els.kpiHouseholdsSummary) {
      this.els.kpiHouseholdsSummary.textContent = this.t('admin.householdsSummary', {
        total: this.formatInt(catalog.total_households),
        paused: this.formatInt(catalog.paused_households)
      });
    }
    if (this.els.kpiTotalMealPlans) this.els.kpiTotalMealPlans.textContent = this.formatInt(catalog.total_meal_plans);
    if (this.els.kpiTotalShoppingItems) this.els.kpiTotalShoppingItems.textContent = this.formatInt(catalog.total_shopping_items);

    if (this.els.lastUpdated && this.lastUpdatedAt) {
      const timeStr = this.lastUpdatedAt.toLocaleTimeString(this.getLocale(), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      this.els.lastUpdated.textContent = this.t('admin.lastUpdated', { time: timeStr });
    }

    this.renderPlanBreakdown(plans, Math.max(toSafeCount(users.total), rev.freeTotal + rev.proTotal, 1));
    this.renderTopDomains(stats.top_domains);
    this.renderStorageHealth(stats.storage);
    this.renderAiMonitor(stats, days, {
      rev,
      aiSummary,
      totalCalls,
      callsOk,
      callsError,
      callsReset,
      totalTokens
    });
  }

  renderPlanBreakdown(plans = {}, baseTotal = 1) {
    if (!this.els.planBreakdown) return;
    const denom = Math.max(toSafeCount(baseTotal), 1);

    this.els.planBreakdown.innerHTML = PLAN_BREAKDOWN_SPEC.map((item) => {
      const count = toSafeCount(plans[item.key]);
      const pct = Math.min(100, Math.round((count / denom) * 100));
      const fillClass = item.tone === 'sage' ? 'admin-bar-fill is-sage' : 'admin-bar-fill';
      return `
        <div class="admin-bar-row" data-plan-key="${escapeHtml(item.key)}">
          <div class="admin-bar-head">
            <span class="admin-bar-label">${escapeHtml(this.t(item.labelKey))}</span>
            <span class="admin-bar-count">${escapeHtml(this.formatInt(count))}</span>
          </div>
          <div class="admin-bar-track">
            <span class="${fillClass}" style="width: ${pct}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTopDomains(domains = []) {
    if (!this.els.topDomains) return;
    const list = Array.isArray(domains) ? domains.filter((d) => d && d.domain) : [];

    if (list.length === 0) {
      this.els.topDomains.innerHTML = `<p class="admin-empty-text">${escapeHtml(this.t('admin.topDomainsEmpty'))}</p>`;
      return;
    }

    const maxCount = Math.max(...list.map((d) => toSafeCount(d.count)), 1);
    this.els.topDomains.innerHTML = list.map((d) => {
      const count = toSafeCount(d.count);
      const pct = Math.max(4, Math.min(100, Math.round((count / maxCount) * 100)));
      return `
        <div class="admin-bar-row" data-domain="${escapeHtml(d.domain)}">
          <div class="admin-bar-head">
            <span class="admin-bar-label">${escapeHtml(d.domain)}</span>
            <span class="admin-bar-count">${escapeHtml(this.formatInt(count))}</span>
          </div>
          <div class="admin-bar-track">
            <span class="admin-bar-fill is-sage" style="width: ${pct}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderStorageHealth(storage = null) {
    const summary = summarizeSupabaseStorage(storage || {});
    if (!summary.available) {
      if (this.els.kpiDbSize) this.els.kpiDbSize.textContent = '—';
      if (this.els.kpiDbSizeMeta) this.els.kpiDbSizeMeta.textContent = this.t('admin.kpiDbSizeUnavailable');
      if (this.els.adminDbQuotaBar) this.els.adminDbQuotaBar.style.width = '0%';
      if (this.els.kpiBase64Images) this.els.kpiBase64Images.textContent = '—';
      if (this.els.kpiBase64ImagesMeta) this.els.kpiBase64ImagesMeta.textContent = '—';
      if (this.els.adminStorageBreakdown) this.els.adminStorageBreakdown.textContent = '—';
      return;
    }

    if (this.els.kpiDbSize) {
      this.els.kpiDbSize.textContent = `${this.formatDecimal(summary.dbMb, 2)} MB`;
    }
    if (this.els.kpiDbSizeMeta) {
      this.els.kpiDbSizeMeta.textContent = this.t('admin.kpiDbSizeMeta', {
        pct: this.formatDecimal(summary.dbQuotaPct, 1),
        limit: this.formatInt(summary.freeLimitMb)
      });
    }
    if (this.els.adminDbQuotaBar) {
      this.els.adminDbQuotaBar.style.width = `${Math.min(100, Math.max(2, summary.dbQuotaPct))}%`;
      this.els.adminDbQuotaBar.className = summary.status === 'ok'
        ? 'admin-bar-fill is-sage'
        : 'admin-bar-fill';
    }

    if (this.els.kpiBase64Images) {
      this.els.kpiBase64Images.textContent = `${this.formatDecimal(summary.base64ImagesMb, 2)} MB`;
    }
    if (this.els.kpiBase64ImagesMeta) {
      this.els.kpiBase64ImagesMeta.textContent = this.t('admin.kpiBase64ImagesMeta', {
        count: this.formatInt(summary.base64ImagesCount),
        avg: this.formatDecimal(summary.avgImageKb, 1)
      });
    }

    if (this.els.adminStorageBreakdown) {
      this.els.adminStorageBreakdown.innerHTML = [
        `recipes: <strong>${escapeHtml(this.formatDecimal(summary.recipesTableMb, 2))} MB</strong>`,
        `meal_plans: <strong>${escapeHtml(this.formatDecimal(summary.mealPlansTableMb, 2))} MB</strong>`,
        `shopping_items: <strong>${escapeHtml(this.formatDecimal(summary.shoppingItemsTableMb, 2))} MB</strong>`,
        `ai_usage: <strong>${escapeHtml(this.formatDecimal(summary.aiUsageTableMb, 2))} MB</strong>`
      ].join(' · ');
    }
  }

  toggleTheme() {
    if (!this.doc) return;
    const current = this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.doc.documentElement.setAttribute('data-theme', next);
    try {
      this.win?.localStorage?.setItem('fa_theme_mode', next);
    } catch (_) {
      // ignore storage errors in restricted contexts
    }
    const metaTheme = this.doc.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#26221E' : '#FAF7F2');
    this.syncThemeUI();
  }

  syncThemeUI() {
    if (!this.doc || !this.els.themeIcon) return;
    const isDark = this.doc.documentElement.getAttribute('data-theme') === 'dark';
    this.els.themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  toggleLanguage() {
    if (!this.i18n?.setPreference) return;
    const current = this.i18n.getLanguage?.() || 'es';
    const next = current === 'es' ? 'en' : 'es';
    this.i18n.setPreference(next);
    this.syncLanguageUI();
    if (this.stats) {
      this.renderDashboard(this.stats, this.statsDays);
    }
    if (this.usersLoaded) {
      this.renderUsersList();
    }
    if (this.selectedUserDetail) {
      this.renderUserDetailModal(this.selectedUserDetail);
    }
    if (this.householdsLoaded) {
      this.renderHouseholdsList();
    }
    if (this.selectedHousehold) {
      this.renderHouseholdModal(this.selectedHousehold);
    }
    if (this.auditLoaded) {
      this.renderAuditLog();
    }
  }

  syncLanguageUI() {
    const lang = (this.i18n?.getLanguage?.() || 'es').toUpperCase();
    if (this.els.langCode) {
      this.els.langCode.textContent = lang;
    }
    if (this.i18n?.applyTranslations && this.doc) {
      this.i18n.applyTranslations(this.doc);
    }
    if (this.doc) {
      this.doc.querySelectorAll('[data-admin-upcoming]').forEach((el) => {
        const story = el.getAttribute('data-admin-upcoming') || '';
        el.textContent = this.t('admin.upcomingSectionNotice', { story });
      });
    }
  }

  formatDateTime(isoValue) {
    if (!isoValue) return this.t('admin.never');
    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) return this.t('admin.never');
    return date.toLocaleString(this.getLocale(), {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }

  closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === 'function') {
      if (dlg.open) dlg.close();
    } else {
      dlg.removeAttribute('open');
    }
  }

  getPlanBadgeMeta(item = {}) {
    const effectivePlan = item.effective_plan || item.plan || 'free';
    const source = item.source || item.raw_source || 'none';
    if (effectivePlan !== 'pro') {
      return { label: this.t('admin.badgeFree'), cssClass: 'is-free' };
    }
    if (item.via_household || source === 'household') {
      return { label: this.t('admin.badgeProHousehold'), cssClass: 'is-household' };
    }
    if (source === 'play') {
      return { label: this.t('admin.badgeProPlay'), cssClass: 'is-play' };
    }
    if (source === 'gift') {
      return { label: this.t('admin.badgeProGift'), cssClass: 'is-gift' };
    }
    return { label: this.t('admin.badgeProAdmin'), cssClass: 'is-admin' };
  }

  async loadUsers({ resetOffset = false } = {}) {
    if (!this.supabaseClient?.rpc) return null;
    if (resetOffset) this.usersOffset = 0;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_list_users', {
        p_search: this.usersSearch || null,
        p_plan: this.usersPlanFilter || 'all',
        p_source: this.usersSourceFilter || 'all',
        p_status: this.usersStatusFilter || 'all',
        p_limit: this.usersPageLimit,
        p_offset: this.usersOffset
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingUsers'));
      }
      this.usersTotal = toSafeCount(data.total);
      this.usersItems = Array.isArray(data.items) ? data.items : [];
      this.usersLoaded = true;
      this.renderUsersList();
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorLoadingUsers'), 'error');
      return null;
    }
  }

  getUserInitials(displayName = '', email = '') {
    const raw = String(displayName || '').trim();
    if (raw) {
      const words = raw.split(/\s+/).filter(Boolean);
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return words[0].slice(0, 2).toUpperCase();
    }
    const mailPrefix = String(email || '').split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    return (mailPrefix.slice(0, 2) || 'U').toUpperCase();
  }

  formatNutritionGoals(goals) {
    if (!goals || typeof goals !== 'object' || Object.keys(goals).length === 0) {
      return '-';
    }
    const parts = [];
    const kcal = goals.calories ?? goals.kcal;
    if (kcal !== undefined && kcal !== null && kcal !== '') {
      parts.push(`${this.formatInt(kcal)} kcal`);
    }
    if (goals.protein !== undefined && goals.protein !== null && goals.protein !== '') {
      parts.push(`${this.formatInt(goals.protein)}g P`);
    }
    if (goals.carbs !== undefined && goals.carbs !== null && goals.carbs !== '') {
      parts.push(`${this.formatInt(goals.carbs)}g C`);
    }
    if (goals.fat !== undefined && goals.fat !== null && goals.fat !== '') {
      parts.push(`${this.formatInt(goals.fat)}g G`);
    }
    if (parts.length === 0) return '-';
    return `${parts.join(' · ')}${goals.enabled === false ? ' (off)' : ''}`;
  }

  renderUsersList() {
    const shown = this.usersItems.length;
    if (this.els.usersCountBadge) {
      const from = shown > 0 ? this.usersOffset + 1 : 0;
      const to = shown > 0 ? this.usersOffset + shown : 0;
      this.els.usersCountBadge.textContent = this.t('admin.usersCountSummary', {
        from: this.formatInt(from),
        to: this.formatInt(to),
        total: this.formatInt(this.usersTotal)
      });
    }

    if (this.els.usersPrevBtn) {
      this.els.usersPrevBtn.disabled = this.usersOffset <= 0;
    }
    if (this.els.usersNextBtn) {
      this.els.usersNextBtn.disabled = this.usersOffset + this.usersPageLimit >= this.usersTotal;
    }

    if (!this.els.usersList) return;
    if (shown === 0) {
      this.els.usersList.innerHTML = `<p class="admin-empty-text">${escapeHtml(this.t('admin.usersEmpty'))}</p>`;
      return;
    }

    this.els.usersList.innerHTML = this.usersItems.map((item) => {
      const badge = this.getPlanBadgeMeta(item);
      const displayName = item.display_name || item.email || item.id;
      const initials = this.getUserInitials(item.display_name, item.email);
      const expiresText = item.effective_plan === 'pro'
        ? (item.period_end ? this.formatDateTime(item.period_end) : this.t('admin.permanent'))
        : '-';
      const lastSignInText = this.formatDateTime(item.last_sign_in_at);
      const recipesChip = this.t('admin.recipesShort', { count: this.formatInt(item.recipes_count) });
      const aiChip = this.t('admin.aiCallsShort', { count: this.formatInt(item.ai_calls_30d) });

      return `
        <article class="admin-user-card" data-user-id="${escapeHtml(item.id)}">
          <div class="admin-user-avatar" aria-hidden="true">${escapeHtml(initials)}</div>
          <div class="admin-user-card-main">
            <div class="admin-user-card-title">
              <span class="admin-user-name">${escapeHtml(displayName)}</span>
              <span class="admin-plan-pill ${escapeHtml(badge.cssClass)}">${escapeHtml(badge.label)}</span>
            </div>
            <div class="admin-user-card-email">${escapeHtml(item.email || '-')}</div>
            <div class="admin-user-card-meta">
              <span class="admin-user-meta-item">
                <span class="material-symbols-outlined" aria-hidden="true">event</span>
                <span>${escapeHtml(this.t('admin.colExpires'))}: ${escapeHtml(expiresText)}</span>
              </span>
              <span class="admin-user-meta-item">
                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                <span>${escapeHtml(this.t('admin.colLastSignIn'))}: ${escapeHtml(lastSignInText)}</span>
              </span>
              <span class="admin-user-meta-chip">${escapeHtml(recipesChip)}</span>
              <span class="admin-user-meta-chip">${escapeHtml(aiChip)}</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm admin-open-user-btn" data-open-user-id="${escapeHtml(item.id)}">
            <span class="material-symbols-outlined icon-sm" aria-hidden="true">person_search</span>
            <span>${escapeHtml(this.t('admin.openUserBtn'))}</span>
          </button>
        </article>
      `;
    }).join('');
  }

  async openUserDetailModal(userId) {
    if (!this.supabaseClient?.rpc || !userId) return null;
    try {
      const { data, error } = await this.supabaseClient.rpc('admin_get_user_detail', {
        p_user_id: userId
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingUserDetail'));
      }
      this.selectedUserId = userId;
      this.selectedUserDetail = data;
      this.renderUserDetailModal(data);
      this.openDialog(this.els.userModal);
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorLoadingUserDetail'), 'error');
      return null;
    }
  }

  renderUserDetailModal(detail = {}) {
    const user = detail.user || {};
    const ent = detail.entitlement || {};
    const settings = detail.settings || {};
    const activity = detail.activity || {};
    const household = detail.household || null;
    const auditLog = Array.isArray(detail.audit_log) ? detail.audit_log : [];

    if (this.els.userModalEmail) this.els.userModalEmail.textContent = user.email || '-';
    if (this.els.userUuidEl) this.els.userUuidEl.textContent = user.id || '-';
    if (this.els.userCreatedEl) this.els.userCreatedEl.textContent = this.formatDateTime(user.created_at);
    if (this.els.userLastSignInEl) this.els.userLastSignInEl.textContent = this.formatDateTime(user.last_sign_in_at);
    if (this.els.userProviderEl) this.els.userProviderEl.textContent = user.provider || '-';

    if (this.els.userServingsEl) {
      this.els.userServingsEl.textContent = settings.default_servings ? this.formatInt(settings.default_servings) : '-';
    }
    if (this.els.userDietaryEl) {
      const prefs = Array.isArray(settings.dietary_preferences) && settings.dietary_preferences.length > 0
        ? settings.dietary_preferences.join(', ')
        : '-';
      this.els.userDietaryEl.textContent = prefs;
    }
    if (this.els.userGoalsEl) {
      this.els.userGoalsEl.textContent = this.formatNutritionGoals(settings.nutrition_goals);
    }
    if (this.els.userHouseholdEl) {
      this.els.userHouseholdEl.textContent = household
        ? `${household.name || household.id} (${household.role || '-'})`
        : this.t('admin.noHousehold');
    }

    if (this.els.userActivityBadgesEl) {
      const totalTokens = toSafeCount(activity.prompt_tokens_30d) + toSafeCount(activity.output_tokens_30d);
      const chips = [
        this.t('admin.recipesShort', { count: this.formatInt(activity.recipes_count) }),
        this.t('admin.mealPlansShort', { count: this.formatInt(activity.meal_plans_count) }),
        this.t('admin.shoppingItemsShort', { count: this.formatInt(activity.shopping_items_count) }),
        this.t('admin.aiCallsShort', { count: this.formatInt(activity.ai_calls_30d) }),
        this.t('admin.tokens30d', { tokens: this.formatInt(totalTokens) })
      ];
      this.els.userActivityBadgesEl.innerHTML = chips
        .map((txt) => `<span class="admin-badge admin-badge-neutral">${escapeHtml(txt)}</span>`)
        .join('');
    }

    const badge = this.getPlanBadgeMeta(ent);
    if (this.els.userPlanBadgeEl) {
      this.els.userPlanBadgeEl.className = `admin-plan-pill ${badge.cssClass}`;
      this.els.userPlanBadgeEl.textContent = badge.label;
    }
    if (this.els.userPlanMetaEl) {
      const expires = ent.effective_plan === 'pro'
        ? (ent.period_end ? this.formatDateTime(ent.period_end) : this.t('admin.permanent'))
        : '-';
      const trialPart = ent.is_trial ? ` · ${this.t('admin.trialBadge')}` : '';
      this.els.userPlanMetaEl.textContent = `${this.t('admin.colExpires')}: ${expires}${trialPart}`;
    }
    if (this.els.userPlayNoticeEl) {
      const isPlay = ent.source === 'play';
      this.els.userPlayNoticeEl.hidden = !isPlay;
      if (isPlay) {
        this.els.userPlayNoticeEl.textContent = this.t('admin.playManagedNotice', {
          product: ent.play_product_id || 'Google Play'
        });
      }
    }

    if (this.els.userQuotasSummaryEl) {
      const q = detail.quotas || {};
      this.els.userQuotasSummaryEl.textContent = this.t('admin.quotaSummaryToday', {
        weekly: this.formatInt(q.weekly_plan),
        guided: this.formatInt(q.guided_query),
        importAi: this.formatInt(q.import_ai),
        chat: this.formatInt(q.chat),
        voice: this.formatInt(q.voice)
      });
    }

    if (this.els.userAuditListEl) {
      if (auditLog.length === 0) {
        this.els.userAuditListEl.innerHTML = `<li class="admin-empty-text">${escapeHtml(this.t('admin.auditEmpty'))}</li>`;
      } else {
        this.els.userAuditListEl.innerHTML = auditLog.map((entry) => `
          <li class="admin-audit-item">
            <span>${escapeHtml(formatAuditSummary(entry))}</span>
            <span class="admin-audit-meta">${escapeHtml(entry.admin_email || '-')} · ${escapeHtml(this.formatDateTime(entry.created_at))}</span>
          </li>
        `).join('');
      }
    }
  }

  async applyEntitlementChange({ plan, source, status = 'active', days = null }) {
    if (!this.supabaseClient?.rpc || !this.selectedUserId) return null;

    const check = validateEntitlementChange({ plan, source, status, days });
    if (!check.ok) {
      this.showToast(check.error || this.t('admin.errorUpdatingEntitlement'), 'error');
      return null;
    }

    const currentSource = this.selectedUserDetail?.entitlement?.source;
    if (plan === 'free' && currentSource === 'play') {
      const confirmed = await this.confirmAdminAction({
        title: this.t('admin.revokePlayConfirmTitle'),
        message: this.t('admin.revokePlayConfirmMsg')
      });
      if (!confirmed) return null;
    }

    const notes = String(this.els.entitlementNotesInput?.value || '').trim() || null;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_set_user_entitlement', {
        p_user_id: this.selectedUserId,
        p_plan: plan,
        p_source: source,
        p_status: status,
        p_days: days,
        p_notes: notes
      });
      if (error || !data?.ok) {
        throw error || new Error(this.t('admin.errorUpdatingEntitlement'));
      }

      if (this.els.giftDaysInput) this.els.giftDaysInput.value = '';
      if (this.els.entitlementNotesInput) this.els.entitlementNotesInput.value = '';
      this.showToast(this.t('admin.entitlementUpdated'), 'success');
      await this.openUserDetailModal(this.selectedUserId);
      await this.loadUsers({ resetOffset: false });
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorUpdatingEntitlement'), 'error');
      return null;
    }
  }

  confirmAdminAction({ title, message }) {
    if (!this.els.confirmModal) return Promise.resolve(false);
    if (this.els.confirmTitleEl) this.els.confirmTitleEl.textContent = title || '';
    if (this.els.confirmMsgEl) this.els.confirmMsgEl.textContent = message || '';
    this.openDialog(this.els.confirmModal);

    return new Promise((resolve) => {
      this._confirmResolver = resolve;
    });
  }

  resolveConfirm(result) {
    this.closeDialog(this.els.confirmModal);
    if (typeof this._confirmResolver === 'function') {
      const fn = this._confirmResolver;
      this._confirmResolver = null;
      fn(Boolean(result));
    }
  }

  async handleDeleteUserData(mode) {
    if (!this.supabaseClient?.rpc || !this.selectedUserId) return null;
    const isDeleteAccount = mode === 'delete_account';
    const targetEmail = this.selectedUserDetail?.user?.email || this.selectedUserId || '';
    const confirmed = await this.confirmAdminAction({
      title: this.t(isDeleteAccount ? 'admin.deleteAccountConfirmTitle' : 'admin.wipeDataConfirmTitle'),
      message: this.t(
        isDeleteAccount ? 'admin.deleteAccountConfirmMsg' : 'admin.wipeDataConfirmMsg',
        { email: targetEmail }
      )
    });
    if (!confirmed) return null;

    const notes = String(this.els.entitlementNotesInput?.value || '').trim() || null;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_delete_user_data', {
        p_user_id: this.selectedUserId,
        p_mode: mode,
        p_notes: notes
      });
      if (error || !data?.ok) {
        throw error || new Error(this.t('admin.errorUpdatingEntitlement'));
      }

      this.showToast(this.t('admin.userDataDeleted'), 'success');
      if (isDeleteAccount) {
        this.closeDialog(this.els.userModal);
        this.selectedUserId = null;
        this.selectedUserDetail = null;
      } else {
        await this.openUserDetailModal(this.selectedUserId);
      }
      await this.loadUsers({ resetOffset: false });
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorUpdatingEntitlement'), 'error');
      return null;
    }
  }

  async copySelectedUuid() {
    const uuid = this.selectedUserId || this.els.userUuidEl?.textContent || '';
    if (!uuid || uuid === '-') return;
    try {
      if (this.win?.navigator?.clipboard?.writeText) {
        await this.win.navigator.clipboard.writeText(uuid);
      }
      this.showToast(this.t('admin.uuidCopied'), 'info');
    } catch (_) {
      // ignore clipboard restrictions
    }
  }

  updatePaginationUI(countEl, prevBtn, nextBtn, labelKey, shownCount, offset, limit, total) {
    if (countEl) {
      const from = shownCount > 0 ? offset + 1 : 0;
      const to = shownCount > 0 ? offset + shownCount : 0;
      countEl.textContent = this.t(labelKey, {
        from: this.formatInt(from),
        to: this.formatInt(to),
        total: this.formatInt(total)
      });
    }
    if (prevBtn) prevBtn.disabled = offset <= 0;
    if (nextBtn) nextBtn.disabled = offset + limit >= total;
  }

  buildQuotaFeatureSelectHtml() {
    const features = [
      ['all', 'admin.aiFeatureAll'],
      ['weekly_plan', 'admin.aiFeatureWeeklyPlan'],
      ['guided_query', 'admin.aiFeatureGuidedQuery'],
      ['import_ai', 'admin.aiFeatureImportAi'],
      ['chat', 'admin.aiFeatureChat'],
      ['voice', 'admin.aiFeatureVoice']
    ];
    return features
      .map(([value, key]) => `<option value="${escapeHtml(value)}">${escapeHtml(this.t(key))}</option>`)
      .join('');
  }

  renderAiBreakdownBars(container, bucketMap = {}) {
    if (!container) return;
    const entries = Object.entries(bucketMap || {}).sort(
      (a, b) => (b[1].costEur - a[1].costEur) || (b[1].calls - a[1].calls)
    );
    if (entries.length === 0) {
      container.innerHTML = `<p class="admin-empty-text">${escapeHtml(this.t('admin.aiEmptyBreakdown'))}</p>`;
      return;
    }

    const maxCalls = Math.max(...entries.map(([, b]) => toSafeCount(b.calls)), 1);
    container.innerHTML = entries.map(([name, bucket]) => {
      const calls = toSafeCount(bucket.calls);
      const pct = Math.max(4, Math.min(100, Math.round((calls / maxCalls) * 100)));
      const summary = `${this.formatInt(calls)} · ${this.formatInt(bucket.totalTokens)} tok · ${this.formatEur(bucket.costEur)}`;
      return `
        <div class="admin-bar-row" data-ai-bucket="${escapeHtml(name)}">
          <div class="admin-bar-head">
            <span class="admin-bar-label">${escapeHtml(name)}</span>
            <span class="admin-bar-count">${escapeHtml(summary)}</span>
          </div>
          <div class="admin-bar-track">
            <span class="admin-bar-fill is-sage" style="width: ${pct}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAiMonitor(stats = {}, _days = 30, precomputed = null) {
    const users = stats.users || {};
    const plans = stats.plans || {};
    const ai = stats.ai || {};
    const rev = precomputed?.rev || computeRevenueMetrics(plans, users.total);
    const aiSummary = precomputed?.aiSummary || summarizeAiUsage(Array.isArray(ai.by_feature_model) ? ai.by_feature_model : []);

    const totalCalls = precomputed?.totalCalls ?? (aiSummary.callsTotal > 0 ? aiSummary.callsTotal : toSafeCount(ai.calls_total));
    const callsOk = precomputed?.callsOk ?? (aiSummary.callsTotal > 0 ? aiSummary.callsOk : toSafeCount(ai.calls_ok));
    const callsError = precomputed?.callsError ?? (aiSummary.callsTotal > 0 ? aiSummary.callsError : toSafeCount(ai.calls_error));
    const callsReset = precomputed?.callsReset ?? (aiSummary.callsTotal > 0 ? aiSummary.callsReset : toSafeCount(ai.calls_reset));
    const promptTokens = aiSummary.totalTokens > 0 ? aiSummary.promptTokens : toSafeCount(ai.prompt_tokens);
    const outputTokens = aiSummary.totalTokens > 0 ? aiSummary.outputTokens : toSafeCount(ai.output_tokens);
    const totalTokens = precomputed?.totalTokens ?? (aiSummary.totalTokens > 0 ? aiSummary.totalTokens : promptTokens + outputTokens);
    const grossMarginEur = Math.round((rev.mrrEur - aiSummary.costEur) * 100) / 100;

    if (this.els.aiKpiCost) this.els.aiKpiCost.textContent = this.formatEur(aiSummary.costEur);
    if (this.els.aiKpiCostMeta) {
      this.els.aiKpiCostMeta.textContent = this.t('admin.aiKpiCostMeta', {
        usd: this.formatDecimal(aiSummary.costUsd, 2),
        rate: this.formatDecimal(DEFAULT_EUR_PER_USD, 2)
      });
    }
    if (this.els.aiKpiTokens) this.els.aiKpiTokens.textContent = this.formatInt(totalTokens);
    if (this.els.aiKpiTokensMeta) {
      this.els.aiKpiTokensMeta.textContent = this.t('admin.aiKpiTokensMeta', {
        prompt: this.formatInt(promptTokens),
        output: this.formatInt(outputTokens)
      });
    }
    if (this.els.aiKpiCalls) this.els.aiKpiCalls.textContent = this.formatInt(totalCalls);
    if (this.els.aiKpiCallsMeta) {
      this.els.aiKpiCallsMeta.textContent = this.t('admin.aiKpiCallsMeta', {
        ok: this.formatInt(callsOk),
        error: this.formatInt(callsError),
        reset: this.formatInt(callsReset)
      });
    }
    if (this.els.aiKpiMargin) this.els.aiKpiMargin.textContent = this.formatEur(grossMarginEur);
    if (this.els.aiKpiMarginMeta) {
      this.els.aiKpiMarginMeta.textContent = this.t('admin.aiKpiMarginMeta', {
        mrr: this.formatEur(rev.mrrEur),
        cost: this.formatEur(aiSummary.costEur)
      });
    }

    this.renderAiBreakdownBars(this.els.aiByFeature, aiSummary.byFeature);
    this.renderAiBreakdownBars(this.els.aiByModel, aiSummary.byModel);

    if (this.els.aiHeavyUsersList) {
      const heavy = Array.isArray(stats.ai_heavy_users) ? stats.ai_heavy_users : [];
      if (heavy.length === 0) {
        this.els.aiHeavyUsersList.innerHTML = `<li class="admin-empty-text">${escapeHtml(this.t('admin.aiHeavyUsersEmpty'))}</li>`;
      } else {
        const optionsHtml = this.buildQuotaFeatureSelectHtml();
        this.els.aiHeavyUsersList.innerHTML = heavy.map((u) => {
          const callsToday = toSafeCount(u.calls_today);
          const isNearCap = callsToday >= 150;
          const label = u.display_name || u.email || u.user_id;
          const badge = this.getPlanBadgeMeta({ plan: u.plan, effective_plan: u.plan });
          const meta7d = this.t('admin.aiCalls7dMeta', {
            calls: this.formatInt(u.calls_7d),
            tokens: this.formatInt(u.tokens_7d)
          });
          return `
            <li class="admin-action-row" data-user-id="${escapeHtml(u.user_id)}">
              <div class="admin-action-main">
                <div class="admin-action-header">
                  <strong>${escapeHtml(label)}</strong>
                  <div class="admin-action-controls">
                    <span class="admin-plan-pill ${escapeHtml(badge.cssClass)}">${escapeHtml(badge.label)}</span>
                    <span class="admin-badge ${isNearCap ? 'admin-badge-warn' : 'admin-badge-neutral'}">${escapeHtml(this.t('admin.aiCallsTodayBadge', { count: this.formatInt(callsToday) }))}</span>
                    ${isNearCap ? `<span class="admin-badge admin-badge-warn">${escapeHtml(this.t('admin.aiHeavyBadge'))}</span>` : ''}
                  </div>
                </div>
                <div class="admin-action-meta">${escapeHtml(u.email || '-')} · ${escapeHtml(meta7d)}</div>
              </div>
              <div class="admin-action-controls">
                <select class="form-select admin-filter-select" data-quota-feature-select="${escapeHtml(u.user_id)}" aria-label="${escapeHtml(this.t('admin.aiFeatureCol'))}">
                  ${optionsHtml}
                </select>
                <button type="button" class="btn btn-secondary btn-sm" data-reset-quota-user="${escapeHtml(u.user_id)}">
                  <span class="material-symbols-outlined icon-sm" aria-hidden="true">restart_alt</span>
                  <span>${escapeHtml(this.t('admin.resetQuotaBtn'))}</span>
                </button>
                <button type="button" class="btn btn-ghost btn-sm" data-open-user-id="${escapeHtml(u.user_id)}">
                  <span>${escapeHtml(this.t('admin.openUserBtn'))}</span>
                </button>
              </div>
            </li>
          `;
        }).join('');
      }
    }

    if (this.els.aiFreeCappedList) {
      const capped = Array.isArray(stats.ai_free_capped_users) ? stats.ai_free_capped_users : [];
      if (capped.length === 0) {
        this.els.aiFreeCappedList.innerHTML = `<li class="admin-empty-text">${escapeHtml(this.t('admin.aiFreeCappedEmpty'))}</li>`;
      } else {
        this.els.aiFreeCappedList.innerHTML = capped.map((u) => {
          const label = u.display_name || u.email || u.user_id;
          const usageMeta = this.t('admin.aiFreeCappedUsageMeta', {
            weekly: this.formatInt(u.weekly_plan_used),
            guided: this.formatInt(u.guided_query_used),
            importAi: this.formatInt(u.import_ai_used)
          });
          return `
            <li class="admin-action-row" data-user-id="${escapeHtml(u.user_id)}">
              <div class="admin-action-main">
                <div class="admin-action-header">
                  <strong>${escapeHtml(label)}</strong>
                  <span class="admin-plan-pill is-free">${escapeHtml(this.t('admin.badgeFree'))}</span>
                </div>
                <div class="admin-action-meta">${escapeHtml(u.email || '-')} · ${escapeHtml(usageMeta)}</div>
              </div>
              <div class="admin-action-controls">
                <button type="button" class="btn btn-secondary btn-sm" data-reset-quota-user="${escapeHtml(u.user_id)}" data-reset-feature="all">
                  <span class="material-symbols-outlined icon-sm" aria-hidden="true">restart_alt</span>
                  <span>${escapeHtml(this.t('admin.resetQuotaAllBtn'))}</span>
                </button>
                <button type="button" class="btn btn-ghost btn-sm" data-open-user-id="${escapeHtml(u.user_id)}">
                  <span>${escapeHtml(this.t('admin.openUserBtn'))}</span>
                </button>
              </div>
            </li>
          `;
        }).join('');
      }
    }
  }

  async handleResetUserQuota(userId, feature = 'all') {
    if (!this.supabaseClient?.rpc) return null;
    const cleanUserId = String(userId || '').trim();
    const cleanFeature = String(feature || 'all').trim() || 'all';
    const check = validateQuotaResetRequest({ userId: cleanUserId, feature: cleanFeature });
    if (!check.ok) {
      this.showToast(check.error || this.t('admin.errorResettingQuota'), 'error');
      return null;
    }

    const notes = this.selectedUserId === cleanUserId
      ? String(this.els.entitlementNotesInput?.value || '').trim()
      : '';

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_reset_user_ai_quota', {
        p_user_id: cleanUserId,
        p_feature: cleanFeature,
        p_notes: notes
      });
      if (error || !data?.ok) {
        throw error || new Error(this.t('admin.errorResettingQuota'));
      }

      this.showToast(
        this.t('admin.resetQuotaSuccess', {
          feature: cleanFeature,
          rows: this.formatInt(data.rows_reset)
        }),
        'success'
      );

      await this.loadDashboardStats(this.statsDays);
      if (this.selectedUserId === cleanUserId) {
        await this.openUserDetailModal(cleanUserId);
      }
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorResettingQuota'), 'error');
      return null;
    }
  }

  async loadHouseholds({ resetOffset = false } = {}) {
    if (!this.supabaseClient?.rpc) return null;
    if (resetOffset) this.householdsOffset = 0;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_list_households', {
        p_search: this.householdsSearch || '',
        p_limit: this.householdsPageLimit,
        p_offset: this.householdsOffset
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingHouseholds'));
      }
      this.householdsTotal = toSafeCount(data.total);
      this.householdsItems = Array.isArray(data.items) ? data.items : [];
      this.householdsLoaded = true;
      this.renderHouseholdsList();

      if (this.selectedHouseholdId) {
        const updated = this.householdsItems.find((h) => h.id === this.selectedHouseholdId) || null;
        if (updated) {
          this.selectedHousehold = updated;
          this.renderHouseholdModal(updated);
        }
      }
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorLoadingHouseholds'), 'error');
      return null;
    }
  }

  renderHouseholdsList() {
    this.updatePaginationUI(
      this.els.householdsCountBadge,
      this.els.householdsPrevBtn,
      this.els.householdsNextBtn,
      'admin.householdsPaginationShowing',
      this.householdsItems.length,
      this.householdsOffset,
      this.householdsPageLimit,
      this.householdsTotal
    );

    if (!this.els.householdsList) return;
    if (this.householdsItems.length === 0) {
      this.els.householdsList.innerHTML = `<p class="admin-empty-text">${escapeHtml(this.t('admin.householdsEmpty'))}</p>`;
      return;
    }

    this.els.householdsList.innerHTML = this.householdsItems.map((h) => {
      const isActive = Boolean(h.owner_has_pro) && !h.is_paused;
      const statusClass = isActive ? 'admin-badge-pro' : 'admin-badge-paused';
      const statusLabel = this.t(isActive ? 'admin.householdStatusActive' : 'admin.householdStatusPaused');
      const meta = this.t('admin.householdMeta', {
        members: this.formatInt(h.members_count),
        recipes: this.formatInt(h.recipes_count),
        owner: h.owner_email || '-'
      });
      return `
        <article class="admin-household-card" data-household-id="${escapeHtml(h.id)}">
          <div class="admin-household-card-header">
            <div>
              <strong>${escapeHtml(h.name || h.id)}</strong>
              <div class="admin-household-meta">${escapeHtml(meta)}</div>
            </div>
            <span class="admin-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
          </div>
          <div class="admin-action-header">
            <div class="admin-action-controls">
              <span class="admin-meta-label">${escapeHtml(this.t('admin.householdInviteLabel'))}</span>
              <code class="admin-uuid-code">${escapeHtml(h.invite_code || '-')}</code>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-manage-household-id="${escapeHtml(h.id)}">
              <span class="material-symbols-outlined icon-sm" aria-hidden="true">home_and_garden</span>
              <span>${escapeHtml(this.t('admin.manageHouseholdBtn'))}</span>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  async openHouseholdModal(householdId) {
    if (!householdId) return null;
    if (!this.householdsLoaded) {
      await this.loadHouseholds({ resetOffset: false });
    }
    const household = this.householdsItems.find((h) => h.id === householdId) || null;
    if (!household) return null;
    this.selectedHouseholdId = household.id;
    this.selectedHousehold = household;
    this.renderHouseholdModal(household);
    this.openDialog(this.els.householdModal);
    return household;
  }

  renderHouseholdModal(household = {}) {
    if (this.els.householdModalTitleEl) {
      this.els.householdModalTitleEl.textContent = household.name || this.t('admin.householdModalTitle');
    }
    if (this.els.householdModalMetaEl) {
      this.els.householdModalMetaEl.textContent = this.t('admin.householdMeta', {
        members: this.formatInt(household.members_count),
        recipes: this.formatInt(household.recipes_count),
        owner: household.owner_email || '-'
      });
    }
    if (this.els.householdStatusBadgeEl) {
      const isActive = Boolean(household.owner_has_pro) && !household.is_paused;
      this.els.householdStatusBadgeEl.className = `admin-badge ${isActive ? 'admin-badge-pro' : 'admin-badge-paused'}`;
      this.els.householdStatusBadgeEl.textContent = this.t(
        isActive ? 'admin.householdStatusActive' : 'admin.householdStatusPaused'
      );
    }
    if (this.els.householdInviteCodeEl) {
      this.els.householdInviteCodeEl.textContent = household.invite_code || '-';
    }

    if (this.els.householdMembersListEl) {
      const members = Array.isArray(household.members) ? household.members : [];
      this.els.householdMembersListEl.innerHTML = members.map((m) => {
        const isOwner = m.user_id === household.owner_id || m.role === 'owner';
        const roleLabel = this.t(isOwner ? 'admin.householdRoleOwner' : 'admin.householdRoleMember');
        const nameText = m.display_name || m.email || m.user_id;
        return `
          <li class="admin-household-member-row" data-member-id="${escapeHtml(m.user_id)}">
            <div class="admin-household-member-info">
              <div class="admin-action-controls">
                <strong>${escapeHtml(nameText)}</strong>
                <span class="admin-badge ${isOwner ? 'admin-badge-pro' : 'admin-badge-neutral'}">${escapeHtml(roleLabel)}</span>
              </div>
              <span class="admin-action-meta">${escapeHtml(m.email || '-')}</span>
            </div>
            ${isOwner ? '' : `
              <div class="admin-household-member-actions">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  data-household-action="transfer_owner"
                  data-target-user-id="${escapeHtml(m.user_id)}"
                >${escapeHtml(this.t('admin.householdTransferOwnerBtn'))}</button>
                <button
                  type="button"
                  class="btn btn-danger-outline btn-sm"
                  data-household-action="remove_member"
                  data-target-user-id="${escapeHtml(m.user_id)}"
                >${escapeHtml(this.t('admin.householdRemoveMemberBtn'))}</button>
              </div>
            `}
          </li>
        `;
      }).join('');
    }
  }

  async handleManageHousehold(householdId, action, targetUserId = null) {
    if (!this.supabaseClient?.rpc || !householdId || !action) return null;

    if (action === 'remove_member') {
      const member = this.selectedHousehold?.members?.find((m) => m.user_id === targetUserId);
      const confirmed = await this.confirmAdminAction({
        title: this.t('admin.confirmRemoveMemberTitle'),
        message: this.t('admin.confirmRemoveMemberBody', {
          email: member?.email || targetUserId || '',
          name: this.selectedHousehold?.name || householdId
        })
      });
      if (!confirmed) return null;
    }

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_manage_household', {
        p_household_id: householdId,
        p_action: action,
        p_target_user_id: targetUserId
      });
      if (error || !data?.ok) {
        throw error || new Error(this.t('admin.errorManagingHousehold'));
      }

      if (action === 'transfer_owner') {
        this.showToast(this.t('admin.householdTransferSuccess'), 'success');
      } else if (action === 'remove_member') {
        this.showToast(this.t('admin.householdRemoveSuccess'), 'success');
      } else if (action === 'regenerate_code') {
        this.showToast(
          this.t('admin.householdCodeRegenerated', { code: data.invite_code || '-' }),
          'success'
        );
      }

      await this.loadHouseholds({ resetOffset: false });
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorManagingHousehold'), 'error');
      return null;
    }
  }

  async loadAuditLog({ resetOffset = false } = {}) {
    if (!this.supabaseClient?.rpc) return null;
    if (resetOffset) this.auditOffset = 0;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_list_audit_log', {
        p_limit: this.auditPageLimit,
        p_offset: this.auditOffset
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingAudit'));
      }
      this.auditTotal = toSafeCount(data.total);
      this.auditItems = Array.isArray(data.items) ? data.items : [];
      this.auditLoaded = true;
      this.renderAuditLog();
      return data;
    } catch (err) {
      this.showToast(err?.message || this.t('admin.errorLoadingAudit'), 'error');
      return null;
    }
  }

  renderAuditLog() {
    this.updatePaginationUI(
      this.els.auditCountBadge,
      this.els.auditPrevBtn,
      this.els.auditNextBtn,
      'admin.auditPaginationShowing',
      this.auditItems.length,
      this.auditOffset,
      this.auditPageLimit,
      this.auditTotal
    );

    if (!this.els.auditList) return;
    if (this.auditItems.length === 0) {
      this.els.auditList.innerHTML = `<li class="admin-empty-text">${escapeHtml(this.t('admin.auditEmpty'))}</li>`;
      return;
    }

    this.els.auditList.innerHTML = this.auditItems.map((entry) => {
      const targetPart = entry.target_email ? ` · ${entry.target_email}` : '';
      return `
        <li class="admin-audit-item" data-audit-id="${escapeHtml(entry.id)}">
          <div class="admin-audit-row-top">
            <span>${escapeHtml(formatAuditSummary(entry))}</span>
            ${entry.target_user_id ? `
              <button type="button" class="btn btn-secondary btn-sm admin-audit-target-btn" data-open-user-id="${escapeHtml(entry.target_user_id)}">
                <span>${escapeHtml(this.t('admin.auditViewUserBtn'))}</span>
              </button>
            ` : ''}
          </div>
          <span class="admin-audit-meta">${escapeHtml(entry.admin_email || '-')}${escapeHtml(targetPart)} · ${escapeHtml(this.formatDateTime(entry.created_at))}</span>
        </li>
      `;
    }).join('');
  }

  showToast(message, type = 'info') {
    if (!this.doc || !this.els.toastContainer) return;
    const iconMap = {
      success: 'check_circle',
      warning: 'warning',
      error: 'error',
      info: 'info'
    };

    const toast = this.doc.createElement('div');
    toast.className = `m3-toast toast-${type}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined m3-toast-icon" aria-hidden="true">${iconMap[type] || 'info'}</span>
      <span class="m3-toast-message">${escapeHtml(message)}</span>
    `;
    this.els.toastContainer.appendChild(toast);

    const timerFn = this.win?.setTimeout || setTimeout;
    timerFn(() => {
      toast.classList.add('toast-hiding');
      timerFn(() => toast.remove(), 220);
    }, 3600);
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__SABORY_ADMIN_DISABLE_AUTO_INIT__) {
  const boot = () => {
    window.saboryAdmin = new SaboryAdminApp();
    window.saboryAdmin.init();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
