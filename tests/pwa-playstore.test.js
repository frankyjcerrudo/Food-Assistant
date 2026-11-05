import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
const { FoodAssistantApp } = window;

const read = (f) => fs.readFileSync(path.resolve(process.cwd(), f), 'utf-8');

describe('Fase 2 Google Play: PWA, Share Target, Accesibilidad y VersiÃ³n (US-10, US-41, US-47, US-53, US-59)', () => {
  const manifest = JSON.parse(read('manifest.json'));
  const html = read('index.html');

  it('US-47: la versiÃ³n es idÃ©ntica en package.json, app.js, sw.js, index.html y tests', () => {
    const tag = read('app.js').match(/window\.APP_VERSION = '(v[\d.]+)'/)[1];
    const num = tag.slice(1);
    const [major, minor] = num.split('.');
    const pkg = JSON.parse(read('package.json')).version;
    expect(pkg).toBe(`${major}.${minor[0]}.${Number(minor.slice(1))}`);
    expect(read('sw.js')).toContain(`food-assistant-${tag}`);
    const swVersions = [...read('sw.js').matchAll(/\?v=([\d.]+)/g)].map(m => m[1]);
    expect(swVersions.length).toBeGreaterThan(0);
    swVersions.forEach(v => expect(v).toBe(num));
    [...html.matchAll(/\?v=([\d.]+)/g)].forEach(m => expect(m[1]).toBe(num));
    expect(html).toMatch(new RegExp(`id="app-version-badge">${tag.replace('.', '\\.')}<`));
  });

  it('US-10: theme_color coincide entre manifest.json e index.html', () => {
    const meta = html.match(/<meta name="theme-color" content="([^"]+)"/)[1];
    expect(manifest.theme_color.toLowerCase()).toBe(meta.toLowerCase());
  });

  it('US-10: iconos "any" y "maskable" separados (sin "any maskable" combinado)', () => {
    const purposes = manifest.icons.map(i => i.purpose);
    expect(purposes).not.toContain('any maskable');
    ['192x192', '512x512'].forEach(size => {
      expect(manifest.icons.some(i => i.sizes === size && i.purpose === 'any')).toBe(true);
      const mask = manifest.icons.find(i => i.sizes === size && i.purpose === 'maskable');
      expect(mask).toBeTruthy();
      expect(fs.existsSync(path.resolve(process.cwd(), mask.src))).toBe(true);
    });
  });

  it('US-10: Ajustes incluye botÃ³n de instalaciÃ³n oculto por defecto y app.js captura beforeinstallprompt', () => {
    expect(html).toMatch(/id="pwa-install-box"[^>]*\shidden/);
    expect(html).toContain('id="btn-install-pwa"');
    const js = read('app.js');
    expect(js).toContain("'beforeinstallprompt'");
    expect(js).toContain("'appinstalled'");
  });

  it('US-59: manifest declara share_target GET con title, text y url', () => {
    expect(manifest.share_target).toBeTruthy();
    expect(manifest.share_target.method).toBe('GET');
    expect(manifest.share_target.params).toEqual({ title: 'title', text: 'text', url: 'url' });
    expect(manifest.share_target.action.startsWith(manifest.scope || './')).toBe(true);
  });

  it('US-53: el viewport permite zoom (WCAG 1.4.4)', () => {
    const viewport = html.match(/<meta name="viewport" content="([^"]+)"/)[1];
    expect(viewport).not.toMatch(/user-scalable\s*=\s*(no|0)/i);
    expect(viewport).not.toMatch(/maximum-scale/i);
  });

  it('US-41: el SDK de Supabase usa versiÃ³n fija con SRI sha384, crossorigin y referrerpolicy', () => {
    const tagMatch = html.match(/<script[^>]*supabase-js@[^>]*><\/script>/s)[0];
    expect(tagMatch).toMatch(/supabase-js@\d+\.\d+\.\d+\//);
    expect(tagMatch).toMatch(/integrity="sha384-[A-Za-z0-9+/=]+"/);
    expect(tagMatch).toContain('crossorigin="anonymous"');
    expect(tagMatch).toContain('referrerpolicy="no-referrer"');
  });

  it('US-59: extractSharedPayload detecta la URL aunque llegue dentro de 	ext (Instagram/TikTok)', () => {
    const extract = (qs) => FoodAssistantApp.prototype.extractSharedPayload.call({}, new URLSearchParams(qs));
    expect(extract('url=https%3A%2F%2Fexample.com%2Freceta').url).toBe('https://example.com/receta');
    expect(extract('text=' + encodeURIComponent('Mira esta receta https://www.instagram.com/reel/abc123/?igsh=1, ¡brutal!')).url)
      .toBe('https://www.instagram.com/reel/abc123/?igsh=1');
    const onlyText = extract('title=Tortitas&text=' + encodeURIComponent('Avena y plátano en 10 minutos'));
    expect(onlyText.url).toBe('');
    expect(onlyText.text).toContain('Avena y plátano');
  });

  it('US-59: handleShareTargetLaunch abre el importador con la URL rellenada y limpia la query', async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<input id="import-url-input"><textarea id="import-text-input"></textarea>';
    window.happyDOM.setURL('http://localhost:3000/index.html?url=' + encodeURIComponent('https://example.com/receta') + '&foo=1');
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const fake = {
      extractSharedPayload: FoodAssistantApp.prototype.extractSharedPayload,
      switchView: vi.fn(),
      showToast: vi.fn(),
      openImportModal: vi.fn()
    };
    expect(FoodAssistantApp.prototype.handleShareTargetLaunch.call(fake)).toBe(true);
    vi.advanceTimersByTime(500);
    expect(fake.openImportModal).toHaveBeenCalledWith('url');
    expect(document.getElementById('import-url-input').value).toBe('https://example.com/receta');
    expect(replaceSpy).toHaveBeenCalledWith(null, '', '/index.html?foo=1');
    replaceSpy.mockRestore();
    vi.useRealTimers();
  });

  it('US-10: promptPwaInstall usa el evento diferido una sola vez y devuelve si el usuario aceptó', async () => {
    const promptEvent = { prompt: vi.fn().mockResolvedValue(undefined), userChoice: Promise.resolve({ outcome: 'accepted' }) };
    const fake = { deferredInstallPrompt: promptEvent, updatePwaInstallUI: vi.fn() };
    await expect(FoodAssistantApp.prototype.promptPwaInstall.call(fake)).resolves.toBe(true);
    expect(promptEvent.prompt).toHaveBeenCalledTimes(1);
    expect(fake.deferredInstallPrompt).toBeNull();
    await expect(FoodAssistantApp.prototype.promptPwaInstall.call(fake)).resolves.toBe(false);
  });
});
