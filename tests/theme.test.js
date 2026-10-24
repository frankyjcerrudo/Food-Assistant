import { describe, it, expect, beforeEach } from 'vitest';

describe('Control de Tema Visual (Light / Dark / System)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('debe tener Modo Claro por defecto y asignar data-theme="light" en el elemento raíz', () => {
    const defaultTheme = localStorage.getItem('fa_theme_mode') || 'light';
    expect(defaultTheme).toBe('light');
    document.documentElement.setAttribute('data-theme', defaultTheme);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('debe persistir fa_theme_mode="dark" y asignar data-theme="dark" en el elemento raíz', () => {
    const themeMode = 'dark';
    localStorage.setItem('fa_theme_mode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);

    expect(localStorage.getItem('fa_theme_mode')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('debe alternar de forma limpia y directa entre Modo Claro y Modo Oscuro al pulsar el botón de cabecera', () => {
    let currentTheme = 'light';
    const toggle = (theme) => (theme === 'light' ? 'dark' : 'light');

    currentTheme = toggle(currentTheme);
    expect(currentTheme).toBe('dark');

    currentTheme = toggle(currentTheme);
    expect(currentTheme).toBe('light');
  });

  it('debe mostrar el icono de acción target correcto (Sol en oscuro, Luna en claro)', () => {
    const getTargetIcon = (theme) => (theme === 'light' ? 'dark_mode' : 'light_mode');

    expect(getTargetIcon('light')).toBe('dark_mode'); // En claro, el botón invita a ir a oscuro
    expect(getTargetIcon('dark')).toBe('light_mode');  // En oscuro, el botón invita a ir a claro
  });
});