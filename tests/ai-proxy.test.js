import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  AI_FEATURES,
  MAX_PAYLOAD_BYTES,
  MAX_OUTPUT_TOKENS,
  resolveModelChain,
  validateAiRequest,
  sanitizePayload,
  extractUsage,
  timeoutForModel
} from '../supabase/functions/ai-proxy/core.js';

describe('US-79a: ai-proxy core', () => {
  describe('validateAiRequest', () => {
    it('rechaza un feature desconocido con INVALID_FEATURE', () => {
      const res = validateAiRequest({
        feature: 'unknown_feature',
        payload: { contents: [{ role: 'user', parts: [{ text: 'hola' }] }] }
      }, 100);
      expect(res).toEqual({ ok: false, status: 400, code: 'INVALID_FEATURE' });
    });

    it('rechaza contents vacío o ausente con INVALID_PAYLOAD', () => {
      expect(validateAiRequest({ feature: 'chat', payload: {} }, 50))
        .toEqual({ ok: false, status: 400, code: 'INVALID_PAYLOAD' });
      expect(validateAiRequest({ feature: 'chat', payload: { contents: [] } }, 50))
        .toEqual({ ok: false, status: 400, code: 'INVALID_PAYLOAD' });
      expect(validateAiRequest({ feature: 'chat' }, 50))
        .toEqual({ ok: false, status: 400, code: 'INVALID_PAYLOAD' });
    });

    it('rechaza peticiones mayores que MAX_PAYLOAD_BYTES con 413 PAYLOAD_TOO_LARGE', () => {
      const res = validateAiRequest({
        feature: 'chat',
        payload: { contents: [{ role: 'user', parts: [{ text: 'hola' }] }] }
      }, MAX_PAYLOAD_BYTES + 1);
      expect(res).toEqual({ ok: false, status: 413, code: 'PAYLOAD_TOO_LARGE' });
    });

    it('acepta una petición válida para cada uno de los 5 features', () => {
      expect(AI_FEATURES).toEqual(['chat', 'voice', 'guided_query', 'weekly_plan', 'import_ai']);
      for (const feature of AI_FEATURES) {
        const res = validateAiRequest({
          feature,
          payload: { contents: [{ role: 'user', parts: [{ text: 'hola' }] }] }
        }, 256);
        expect(res).toEqual({ ok: true });
      }
    });
  });

  describe('resolveModelChain', () => {
    it('devuelve gemini-3.5-flash-lite primero para free y gemini-3.8-flash primero para pro', () => {
      expect(resolveModelChain('free')[0]).toBe('gemini-3.5-flash-lite');
      expect(resolveModelChain('pro')[0]).toBe('gemini-3.8-flash');
      expect(resolveModelChain('unknown')).toEqual(resolveModelChain('free'));
    });
  });

  describe('sanitizePayload', () => {
    it('elimina model, key y safetySettings; conserva campos permitidos y limita maxOutputTokens a 8192', () => {
      const clean = sanitizePayload({
        model: 'gemini-custom',
        key: 'AIzaFakeKey',
        safetySettings: [{ category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }],
        contents: [{ role: 'user', parts: [{ text: 'hola' }] }],
        systemInstruction: { parts: [{ text: 'eres chef' }] },
        tools: [{ functionDeclarations: [] }],
        toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
        generationConfig: { temperature: 0.4, maxOutputTokens: 999999 }
      });

      expect(clean.model).toBeUndefined();
      expect(clean.key).toBeUndefined();
      expect(clean.safetySettings).toBeUndefined();
      expect(clean.contents).toHaveLength(1);
      expect(clean.systemInstruction).toEqual({ parts: [{ text: 'eres chef' }] });
      expect(clean.tools).toBeDefined();
      expect(clean.toolConfig).toBeDefined();
      expect(clean.generationConfig.temperature).toBe(0.4);
      expect(clean.generationConfig.maxOutputTokens).toBe(MAX_OUTPUT_TOKENS);
      expect(MAX_OUTPUT_TOKENS).toBe(8192);
    });
  });

  describe('extractUsage & timeoutForModel', () => {
    it('lee usageMetadata y devuelve 0 si falta', () => {
      expect(extractUsage({ usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 45 } }))
        .toEqual({ promptTokens: 120, outputTokens: 45 });
      expect(extractUsage({})).toEqual({ promptTokens: 0, outputTokens: 0 });
      expect(extractUsage(null)).toEqual({ promptTokens: 0, outputTokens: 0 });
    });

    it('aplica timeout adecuado según modelo', () => {
      expect(timeoutForModel('gemini-3.8-flash')).toBe(16000);
      expect(timeoutForModel('gemini-3.5-flash-lite')).toBe(20000);
    });
  });

  describe('Seguridad estática de index.ts', () => {
    it('usa Deno.env.get("GEMINI_API_KEY") y no contiene claves AIza', () => {
      const indexTs = fs.readFileSync(
        path.resolve(__dirname, '../supabase/functions/ai-proxy/index.ts'),
        'utf8'
      );
      expect(indexTs).toContain("Deno.env.get('GEMINI_API_KEY')");
      expect(indexTs).not.toMatch(/AIza/);
    });
  });
});
