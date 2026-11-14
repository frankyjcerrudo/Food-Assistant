/**
 * Controlador principal de Sabory Admin (US-87b+).
 * Gestiona el guard de acceso Zero-Trust (`is_admin()`), sesión Supabase Auth,
 * navegación de vistas administrativas y Dashboard ejecutivo de KPIs.
 */

import { computeRevenueMetrics, summarizeAiUsage } from './admin-core.js';

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
      toastContainer: byId('admin-toast-container')
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
      this.loadDashboardStats();
    });

    this.els.periodSelect?.addEventListener('change', () => {
      this.loadDashboardStats();
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
  }

  async loadDashboardStats() {
    if (!this.supabaseClient?.rpc) return null;
    const days = Number(this.els.periodSelect?.value) || this.statsDays || 30;
    this.statsDays = days;

    if (this.els.refreshBtn) this.els.refreshBtn.disabled = true;

    try {
      const { data, error } = await this.supabaseClient.rpc('admin_get_dashboard_stats', {
        p_days: days
      });
      if (error || !data) {
        throw error || new Error(this.t('admin.errorLoadingStats'));
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
