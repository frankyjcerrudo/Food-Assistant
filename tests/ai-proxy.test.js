import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  AI_FEATURES,
  DECISION_MODEL,
  DECISION_TIMEOUT_MS,
  MAX_PAYLOAD_BYTES,
  MAX_OUTPUT_TOKENS,
  resolveModelChain,
  validateDecisionQuestions,
  validateAiRequest,
  sanitizePayload,
  extractUsage,
  timeoutForModel,
  extractLastUserText,
  shouldRunRoutingDecision,
  buildRoutingDecisionRequest,
  evaluateRoutingDecision
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
    it('lee usageMetadata, devuelve 0 si falta y estima tokens de entrada con fallbackInputText si falta promptTokenCount', () => {
      expect(extractUsage({ usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 45 } }))
        .toEqual({ promptTokens: 120, outputTokens: 45 });
      expect(extractUsage({})).toEqual({ promptTokens: 0, outputTokens: 0 });
      expect(extractUsage(null)).toEqual({ promptTokens: 0, outputTokens: 0 });
      expect(extractUsage({}, 'Hola Sous Chef')).toEqual({ promptTokens: 4, outputTokens: 0 });
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
      expect(indexTs).toContain('/v1beta/decisions');
      expect(indexTs).not.toMatch(/AIza/);
    });
  });

  describe('US-89: Gemini Decisions API (gemini-decision-1) routing, guardrails y batch', () => {
    it('expone DECISION_MODEL, timeout dedicado y valida payloads directos decisions', () => {
      expect(DECISION_MODEL).toBe('gemini-decision-1');
      expect(timeoutForModel(DECISION_MODEL)).toBe(DECISION_TIMEOUT_MS);
      expect(DECISION_TIMEOUT_MS).toBe(1800);

      expect(validateDecisionQuestions({
        is_vegan: { type: 'noul', instructions: '¿Es vegana?' }
      })).toEqual({ ok: true });
      expect(validateDecisionQuestions({})).toEqual({ ok: false, reason: 'QUESTIONS_COUNT_OUT_OF_RANGE' });

      const validDirect = validateAiRequest({
        feature: 'guided_query',
        payload: {
          decisions: {
            input: 'Ensalada de garbanzos con tomate',
            questions: {
              is_vegan: { type: 'noul', instructions: '¿Es vegana?' }
            }
          }
        }
      }, 200);
      expect(validDirect).toEqual({ ok: true });

      const cleanDirect = sanitizePayload({
        model: 'gemini-custom',
        decisions: {
          input: 'Ensalada',
          questions: { is_vegan: { type: 'noul', instructions: '¿Es vegana?' } }
        }
      });
      expect(cleanDirect.model).toBeUndefined();
      expect(cleanDirect.decisions.input).toBe('Ensalada');
    });

    it('extractLastUserText y shouldRunRoutingDecision omiten media inline, decisiones directas y features no interactivos', () => {
      const textPayload = {
        contents: [
          { role: 'user', parts: [{ text: 'Hola' }] },
          { role: 'model', parts: [{ text: 'Hola, ¿qué cocinamos?' }] },
          { role: 'user', parts: [{ text: 'Dame un sustituto para la nata' }] }
        ]
      };
      expect(extractLastUserText(textPayload)).toBe('Dame un sustituto para la nata');
      expect(shouldRunRoutingDecision('chat', textPayload)).toBe(true);
      expect(shouldRunRoutingDecision('voice', textPayload)).toBe(true);
      expect(shouldRunRoutingDecision('guided_query', textPayload)).toBe(true);
      expect(shouldRunRoutingDecision('weekly_plan', textPayload)).toBe(false);
      expect(shouldRunRoutingDecision('import_ai', textPayload)).toBe(false);

      const mediaPayload = {
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'image/jpeg', data: 'abc' } }, { text: 'Analiza' }] }]
      };
      expect(extractLastUserText(mediaPayload)).toBe('');
      expect(shouldRunRoutingDecision('chat', mediaPayload)).toBe(false);
    });

    it('buildRoutingDecisionRequest construye las 4 preguntas para gemini-decision-1', () => {
      const req = buildRoutingDecisionRequest('¿Puedo sustituir el yogur por queso crema?', 'chat');
      expect(req.model).toBe('gemini-decision-1');
      expect(Object.keys(req.questions)).toEqual([
        'is_culinary_domain',
        'is_prompt_injection',
        'complexity_tier',
        'intent_scope'
      ]);
      expect(req.questions.is_culinary_domain.type).toBe('noul');
      expect(req.questions.complexity_tier.type).toBe('choice');
    });

    it('evaluateRoutingDecision bloquea prompt injection y mensajes fuera de dominio con alta confianza', () => {
      const inj = evaluateRoutingDecision({
        answers: {
          is_prompt_injection: { type: 'noul', noul: 0.96, confidence: 0.95 },
          is_culinary_domain: { type: 'noul', noul: 0.10, confidence: 0.90 }
        }
      }, 'pro', 'chat');
      expect(inj.blockedByGuardrail).toBe(true);
      expect(inj.reason).toBe('prompt_injection');
      expect(inj.models).toEqual(['gemini-decision-1']);

      const offTopic = evaluateRoutingDecision({
        answers: {
          is_prompt_injection: { type: 'noul', noul: 0.05, confidence: 0.90 },
          is_culinary_domain: { type: 'noul', noul: 0.08, confidence: 0.92 }
        }
      }, 'pro', 'chat');
      expect(offTopic.blockedByGuardrail).toBe(true);
      expect(offTopic.reason).toBe('off_topic');
    });

    it('evaluateRoutingDecision enruta consultas simples de Pro a gemini-3.5-flash-lite y mantiene 3.8-flash en complejas o baja confianza', () => {
      const simplePro = evaluateRoutingDecision({
        answers: {
          is_prompt_injection: { type: 'noul', noul: 0.01, confidence: 0.98 },
          is_culinary_domain: { type: 'noul', noul: 0.97, confidence: 0.95 },
          complexity_tier: { type: 'choice', choice: 'lite', probabilities: { lite: 0.91, full: 0.09 }, confidence: 0.91 },
          intent_scope: { type: 'choice', choice: 'general_query', probabilities: { general_query: 0.88 }, confidence: 0.88 }
        }
      }, 'pro', 'chat');
      expect(simplePro.blockedByGuardrail).toBe(false);
      expect(simplePro.routedToLite).toBe(true);
      expect(simplePro.models).toEqual(['gemini-3.5-flash-lite', 'gemini-3.8-flash']);

      const weeklyPro = evaluateRoutingDecision({
        answers: {
          is_prompt_injection: { type: 'noul', noul: 0.01, confidence: 0.99 },
          is_culinary_domain: { type: 'noul', noul: 0.99, confidence: 0.99 },
          complexity_tier: { type: 'choice', choice: 'full', probabilities: { lite: 0.10, full: 0.90 }, confidence: 0.90 },
          intent_scope: { type: 'choice', choice: 'weekly_plan', probabilities: { weekly_plan: 0.93 }, confidence: 0.93 }
        }
      }, 'pro', 'chat');
      expect(weeklyPro.routedToLite).toBe(false);
      expect(weeklyPro.models).toEqual(['gemini-3.8-flash', 'gemini-3.5-flash-lite']);

      const lowConfPro = evaluateRoutingDecision({
        answers: {
          is_prompt_injection: { type: 'noul', noul: 0.10, confidence: 0.80 },
          is_culinary_domain: { type: 'noul', noul: 0.85, confidence: 0.85 },
          complexity_tier: { type: 'choice', choice: 'lite', probabilities: { lite: 0.52, full: 0.48 }, confidence: 0.52 },
          intent_scope: { type: 'choice', choice: 'general_query', probabilities: { general_query: 0.55 }, confidence: 0.55 }
        }
      }, 'pro', 'chat');
      expect(lowConfPro.routedToLite).toBe(false);
      expect(lowConfPro.models).toEqual(['gemini-3.8-flash', 'gemini-3.5-flash-lite']);
    });
  });
});
