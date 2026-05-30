const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function buildPrompt(action, role, payload) {
  const roleText = {
    profesional: 'Profesional clínico de box: prioriza, explica opciones, construye o ajusta plan y registra acuerdos clínicos.',
    tens: 'TENS/seguimiento: revisa acuerdos, detecta barreras o alertas, refuerza comprensión y reporta al equipo; no toma decisiones clínicas fuera de alcance.',
    gestor: 'Gestor/a ECICEP: ordena complejidad, coordina equipo/red, sostiene continuidad y trabaja barreras persistentes.'
  }[role] || 'Rol no especificado';

  const base = `Eres un entrenador experto en entrevista ECICEP para APS chilena.
Tu tarea es mejorar conversaciones clínicas para que sean centradas en la persona, no impositivas, seguras, concretas y orientadas al plan de cuidado integral consensuado.
Principios: no culpar, no retar, no imponer, mantener seguridad clínica, cuidar autonomía, explorar barreras, usar toma de decisiones compartidas, entrevista motivacional, favorecer automanejo y continuidad.
Considera MAIS, ECICEP, APS chilena, multimorbilidad, ingreso integral, control integral, seguimiento a distancia, gestión de casos, registro clínico y continuidad.
No diagnostiques, no indiques tratamiento, no reemplaces juicio clínico y no pidas datos personales.
Rol del usuario: ${roleText}
Devuelve solo JSON válido, sin markdown, sin texto fuera del JSON.`;

  if (action === 'reformulate') return `${base}
Acción: reformula una frase clínica escrita por el usuario para que sea compatible con ECICEP y entrevista motivacional.
Frase: ${payload.text || ''}
Formato JSON:
{"reformulacion":"...","por_que_mejora":"...","pregunta_siguiente":"...","alerta":"...","registro_sugerido":"..."}`;

  if (action === 'evaluate_case') return `${base}
Acción: evalúa una respuesta de role play ECICEP.
Caso: ${JSON.stringify(payload.case || {})}
Respuesta del usuario: ${payload.answer || ''}
Evalúa intención clínica, exploración de barreras, autonomía, posibilidad, cierre, seguridad y alcance según rol.
Formato JSON:
{"puntaje":"0-5","fortalezas":["..."],"mejoras":["..."],"version_experta":"...","riesgo_imposicion":"bajo|medio|alto"}`;

  if (action === 'suggest_questions') return `${base}
Acción: sugiere preguntas para una situación clínica.
Situación: ${payload.context || ''}
Formato JSON:
{"preguntas_prioritarias":["..."],"orden_sugerido":["..."],"que_evitar":"...","proximo_paso":"..."}`;

  if (action === 'scale') return `${base}
Acción: orientar uso de escala importancia/posibilidad.
Importancia: ${payload.importance}/10
Posibilidad: ${payload.possibility}/10
Contexto: ${payload.context || ''}
Formato JSON:
{"lectura_clinica":"...","preguntas_para_profundizar":["..."],"ajuste_sugerido":"...","frase_de_cierre":"...","registro_sugerido":"..."}`;

  if (action === 'audit_plan') return `${base}
Acción: audita si un plan parece impuesto, parcial o consensuado.
Texto del plan/entrevista: ${payload.text || ''}
Formato JSON:
{"resultado":"consensuado|parcial|impuesto","senales_positivas":["..."],"brechas":["..."],"como_reabrir_conversacion":"...","mejor_registro":"..."}`;

  if (action === 'improve_record') return `${base}
Acción: mejorar un registro ECICEP para que sea trazable, breve y útil para continuidad.
Datos:
Prioridad/acuerdo: ${payload.priority || ''}
Barrera/facilitador: ${payload.barrier || ''}
Acuerdo/ajuste/reporte: ${payload.agreement || ''}
Seguimiento: ${payload.followup || ''}
Formato JSON:
{"registro_mejorado":"...","que_falta":"...","continuidad_sugerida":"...","alerta":"..."}`;

  return `${base}
Acción: prueba de conexión.
Formato JSON:
{"mensaje":"IA operativa con Gemini","uso":"Transformar frases, sugerir preguntas, evaluar role play, auditar planes y mejorar registros."}`;
}

function parseJsonText(text) {
  try { return JSON.parse(text); } catch (e) {}
  const cleaned = String(text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  try { return JSON.parse(cleaned); } catch (e) {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (e) {}
  }
  return { respuesta: cleaned || 'Sin respuesta interpretable.' };
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map(p => p.text || '').join('\n').trim();
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST.' });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Falta GEMINI_API_KEY en variables de entorno de Vercel.' });
    }

    const body = req.body || {};
    const { action = 'test', role = 'profesional', ...payload } = body;
    const prompt = buildPrompt(action, role, payload);
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900,
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || 'Error desde Gemini API.';
      return res.status(response.status).json({ error: msg });
    }

    const text = extractGeminiText(data);
    return res.status(200).json({ ok: true, ...parseJsonText(text) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error inesperado.' });
  }
}
