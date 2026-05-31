const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const roleText = {
  profesional: 'Profesional clínico de box: integra evaluación clínica, prioriza con la persona, construye o ajusta plan de cuidado consensuado y define seguimiento.',
  tens: 'TENS / seguimiento a distancia: revisa acuerdos del plan, detecta barreras o alertas, refuerza comprensión y coordina/reporta continuidad; no toma decisiones clínicas fuera de alcance.',
  gestor: 'Gestor/a ECICEP: ordena complejidad, barreras persistentes, coordinación de equipo/red, responsables, pendientes, reevaluación e intensificación/cierre.'
};

function basePrompt(role) {
  return `Eres un entrenador experto en implementación ECICEP/MAIS para APS chilena.
Trabajas con enfoque centrado en la persona, toma de decisiones compartidas, entrevista motivacional, automanejo, continuidad y registro clínico trazable.
Rol del usuario: ${roleText[role] || roleText.profesional}

Reglas:
- No diagnostiques.
- No indiques tratamientos nuevos.
- No reemplaces juicio clínico ni protocolo local.
- No uses lenguaje culpabilizante.
- No inventes datos.
- Si falta información clave, dilo claramente.
- Diferencia: información registrada, inferencias razonables y preguntas pendientes.
- Si hay posible alerta o algo fuera del alcance del rol, sugiere registrar y coordinar continuidad según flujo local.
- Devuelve solo JSON válido, sin markdown.`;
}

function buildPrompt(action, role, payload) {
  const base = basePrompt(role);

  if (action === 'aspect_analyze') return `${base}
Tarea: analizar evaluación inicial de un aspecto del plan de cuidado ECICEP.
Aspecto: ${payload.aspect?.title}
Orientación del aspecto: ${payload.aspect?.purpose}
Preguntas esenciales: ${(payload.aspect?.essential || []).join(' | ')}
Barreras frecuentes: ${(payload.aspect?.barriers || []).join(' | ')}
Automanejo posible: ${(payload.aspect?.selfcare || []).join(' | ')}
Riesgos a comunicar: ${payload.aspect?.risks}
Notas del profesional: ${payload.notes || ''}

Devuelve JSON:
{
 "informacion_clara":["..."],
 "barreras":[{"barrera":"...","de_que":"...","evidencia_en_el_texto":"..."}],
 "facilitadores":[{"facilitador":"...","para_que_sirve":"..."}],
 "ambivalencia":{"existe":true,"descripcion":"...","entre_que_tensiones":"..."},
 "informacion_faltante":["..."],
 "preguntas_para_enriquecer":["..."],
 "texto_pulido":{"observacion":"...","barrera":"...","activos_facilitadores":"...","ambivalencia":"...","informacion_pendiente":"..."},
 "automanejo":{"requiere_fortalecer":true,"que_fortalecer":["..."],"como_conversarlo":"..."},
 "riesgos":{"requiere_comunicar":true,"riesgos_a_comunicar":["..."],"forma_clara_de_comunicar":"..."},
 "potenciales_planes":[{"foco":"...","problema":"...","objetivo":"...","actividad":"...","responsable":"...","seguimiento":"..."}],
 "alerta":"..."
}`;

  if (action === 'followup_analyze') return `${base}
Tarea: analizar seguimiento a distancia ECICEP.
Aspecto: ${payload.aspect?.title}
Acuerdo revisado: ${payload.agreement || ''}
Notas de llamada: ${payload.notes || ''}
Alerta marcada: ${payload.alertType || ''}

Devuelve JSON:
{"acuerdo_revisado":"...","resultado":"cumple|parcial|no cumple|no evaluable","barrera_detectada":"...","facilitador":"...","alerta":{"existe":true,"tipo":"...","conducta_sugerida":"..."},"pregunta_siguiente":"...","conducta_segun_rol":"...","registro_sugerido":"..."}`;

  if (action === 'case_management_analyze') return `${base}
Tarea: analizar bitácora de gestión de casos ECICEP.
Etapa: ${payload.stage}
Motivo/foco crítico: ${payload.reason || ''}
Objetivo del acompañamiento: ${payload.goal || ''}
Barreras, acciones, avances y pendientes: ${payload.notes || ''}

Devuelve JSON:
{"estado_del_caso":"...","foco_critico":"...","barreras_persistentes":["..."],"avances":["..."],"pendientes_criticos":["..."],"responsables_por_aclarar":["..."],"coordinacion_necesaria":["..."],"proxima_accion_sugerida":"...","reevaluacion":"mantener|intensificar|preparar cierre|requiere aclarar","registro_pulido":"..."}`;

  if (action === 'guided_scale') return `${base}
Tarea: orientar escala ECICEP de importancia/posibilidad.
Cambio/acuerdo: ${payload.change || ''}
Aspecto: ${payload.aspect?.title}
Importancia: ${payload.importance}/10
Posibilidad: ${payload.possibility}/10
Barrera principal: ${payload.barrier || ''}
Contexto: ${payload.context || ''}

Devuelve JSON:
{"lectura_clinica":"...","motivos_de_cambio_a_explorar":["..."],"barreras_concretas_a_explorar":["..."],"preguntas_sugeridas":["..."],"que_hacer_segun_barrera":"...","acuerdo_mas_pequeno_posible":"...","registro_sugerido":"..."}`;

  if (action === 'suggest_questions') return `${base}
Tarea: sugerir preguntas según rol, aspecto y situación.
Aspecto: ${payload.aspect?.title}
Situación: ${payload.context || ''}
Devuelve JSON:
{"preguntas_prioritarias":["..."],"por_que_estas_preguntas":"...","que_evitar":"...","siguiente_paso":"..."}`;

  if (action === 'training_eval') return `${base}
Tarea: evaluar práctica de entrenamiento ECICEP.
Entrenamiento: ${JSON.stringify(payload.training || {})}
Respuesta del usuario: ${payload.answer || ''}
Devuelve JSON:
{"puntaje":"0-5","fortalezas":["..."],"mejoras":["..."],"version_experta":"...","registro_sugerido":"..."}`;

  if (action === 'roleplay_eval') return `${base}
Tarea: evaluar respuesta de role play.
Caso: ${JSON.stringify(payload.case || {})}
Respuesta: ${payload.answer || ''}
Devuelve JSON:
{"puntaje":"0-5","fortalezas":["..."],"brechas":["..."],"version_experta":"...","pregunta_siguiente":"...","riesgo_imposicion":"bajo|medio|alto"}`;

  if (action === 'roleplay_sim') return `${base}
Tarea: simular respuesta de persona usuaria en role play.
Caso: ${JSON.stringify(payload.case || {})}
Respuesta del funcionario: ${payload.answer || ''}
Devuelve JSON:
{"persona_responde":"...","pista_para_funcionario":"...","que_entrenar_ahora":"..."}`;

  if (action === 'reformulate') return `${base}
Tarea: reformular frase clínica en estilo ECICEP.
Aspecto: ${payload.aspect?.title}
Frase: ${payload.text || ''}
Devuelve JSON:
{"frase_reformulada":"...","intencion_clinica":"...","pregunta_siguiente":"...","riesgo_de_frase_original":"...","registro_sugerido":"..."}`;

  if (action === 'audit_plan') return `${base}
Tarea: auditar si un plan parece impuesto o consensuado.
Texto: ${payload.text || ''}
Devuelve JSON:
{"resultado":"consensuado|parcial|impuesto","senales_positivas":["..."],"brechas":["..."],"como_reabrir_conversacion":"...","version_ecicep":"..."}`;

  return `${base}
Tarea: prueba de conexión.
Devuelve JSON: {"mensaje":"Conexión establecida con GroqCloud para sistema ECICEP","uso":"IA operativa para Plan 9 aspectos, seguimiento, gestión, preguntas, role play, escala, frases y auditoría."}`;
}

function parseJsonText(text) {
  try { return JSON.parse(text); } catch(e) {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch(e) {}
  }
  return { respuesta: text };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST.' });

  try {
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'Falta GROQ_API_KEY en variables de entorno de Vercel.' });
    const body = req.body || {};
    const { action = 'test', role = 'profesional', ...payload } = body;
    const prompt = buildPrompt(action, role, payload);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Responde solo JSON válido. No uses markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || data.error || 'Error desde GroqCloud.' });

    const text = data.choices?.[0]?.message?.content || JSON.stringify(data);
    return res.status(200).json({ ok: true, ...parseJsonText(text) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error inesperado.' });
  }
}
