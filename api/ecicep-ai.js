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
- Usa lenguaje cálido, humanizado, cercano, respetuoso e inclusivo de género de forma natural.\n- No uses lenguaje culpabilizante.
- No inventes datos.
- Si falta información clave, dilo claramente.
- Diferencia: información registrada, inferencias razonables y preguntas pendientes.
- Si hay posible alerta o algo fuera del alcance del rol, sugiere registrar y coordinar continuidad según flujo local.
- Devuelve solo JSON válido, sin markdown.`;
}

function buildPrompt(action, role, payload) {
  const base = basePrompt(role);

  if (action === 'aspect_analyze') return `${base}
Tarea: actuar como asistente de entrevista en tiempo real para fortalecer la anamnesis clínica de un aspecto del plan de cuidado ECICEP.

OBJETIVO PRINCIPAL:
Ayudar al funcionario/a a seguir preguntando mejor ANTES de cerrar un plan. La primera respuesta debe ser la pregunta inmediata más útil para enriquecer lo escrito.

REGLAS CRÍTICAS:
- Esto aplica a TODOS los aspectos del plan: controles, fármacos, alimentación, actividad física, tabaco, alcohol, inmunizaciones, participación y otros aspectos.
- La primera salida debe ser "pregunta_inmediata_recomendada".
- Esa pregunta debe basarse en el dato MÁS ESPECÍFICO escrito por el profesional, no en el aspecto general.
- Si el texto contiene expresiones como "no le gusta", "no quiere", "le cuesta", "no puede", "no entiende", "le da miedo", "no tiene tiempo", "se le olvida", "le hizo mal", la primera pregunta debe aclarar exactamente qué significa esa expresión.
- Si el texto contiene "pero", "aunque", "sin embargo", "sabe que es importante", "quiere, pero", "le gustaría, pero", identifica posible ambivalencia y úsala para preguntar por motivos de importancia y barreras.
- No uses primero preguntas genéricas del banco del aspecto si el texto ya trae una barrera específica.
- No selecciones barreras frecuentes si no aparecen en el texto. Las barreras frecuentes son solo ayuda de memoria.
- No inventes facilitadores ni ambivalencia; si aparecen motivos de importancia, disposición, reconocimiento de beneficio, rutina que funciona o apoyo disponible, rescátalos como activos/facilitadores.
- Si el texto es ambiguo, declara "barrera declarada pero inespecífica" y orienta preguntas para precisarla.
- Entrega máximo 5 preguntas para profundizar, ordenadas por utilidad clínica.
- Indica si la información es suficiente, parcial o insuficiente para construir plan.
- Si falta información, NO propongas problema/objetivo/actividad cerrados; solo posibles focos futuros condicionados a aclaración.
- En texto_pulido NO escribas "no se menciona la orientación del aspecto". Nunca evalúes si se mencionó la orientación del aspecto. Ordena clínicamente lo que el profesional escribió.
- En texto_pulido, si falta información, declárala solo en "informacion_pendiente".
- El texto_pulido debe ser una versión clara y ordenada de la anamnesis escrita por el profesional, no un informe de errores.

Aspecto: ${payload.aspect?.title}
Orientación del aspecto: ${payload.aspect?.purpose}
Preguntas esenciales de referencia, no obligatorias: ${(payload.aspect?.essential || []).join(' | ')}
Barreras frecuentes como ayuda de memoria, no como diagnóstico automático: ${(payload.aspect?.barriers || []).join(' | ')}
Automanejo posible: ${(payload.aspect?.selfcare || []).join(' | ')}
Riesgos a comunicar: ${payload.aspect?.risks}
Texto escrito por el profesional: ${payload.notes || ''}

Ejemplo de lógica esperada:
Si el texto dice "No asistió a nutricionista porque no le gusta, pero sabe que es importante para ella", la pregunta inmediata debe ir primero a aclarar "qué no le gusta" o "qué pasó en esa atención", luego explorar desde cuándo ocurre y después rescatar por qué lo considera importante. No partir con preguntas genéricas de reprogramación u horarios.

Devuelve JSON:
{
 "pregunta_inmediata_recomendada":"pregunta única, cálida, concreta y atingente al dato más específico del texto",
 "preguntas_para_profundizar":["máximo 5 preguntas, ordenadas para enriquecer anamnesis"],
 "por_que_preguntar_esto":"explicación breve de por qué esta pregunta es la mejor siguiente",
 "lo_que_ya_sabemos":["solo información explícita o muy razonable desde el texto"],
 "no_asumir_todavia":["cosas que NO se pueden concluir con el texto disponible"],
 "barrera_principal":{"descripcion":"...","de_que":"...","evidencia_en_el_texto":"...","nivel_de_claridad":"alta|media|baja|inespecífica"},
 "hipotesis_barreras":["posibles explicaciones a aclarar, no afirmarlas como hechos"],
 "suficiencia_plan":{"estado":"suficiente|parcial|insuficiente","razon":"...","que_falta_antes_de_cerrar":"..."},
 "texto_pulido":{"observacion":"ordenar lo que se escribió, sin inventar","barrera":"barrera clara o inespecífica","activos_facilitadores":"rescatar importancia, disposición, apoyos o rutinas si aparecen","ambivalencia":"describir tensión específica si aparece; si no, decir que requiere exploración","informacion_pendiente":"qué falta preguntar antes de cerrar plan"},
 "automanejo":{"requiere_fortalecer":true,"que_fortalecer":["..."],"como_conversarlo":"..."},
 "riesgos":{"requiere_comunicar":true,"riesgos_a_comunicar":["..."],"forma_clara_de_comunicar":"..."},
 "potenciales_planes":[{"foco":"...","condicion_para_usarlo":"qué habría que aclarar o confirmar antes","problema":"...","objetivo":"...","actividad":"...","responsable":"...","seguimiento":"..."}],
 "alerta":"si no hay alerta, escribir 'Sin alerta identificada con la información disponible'"
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


  if (action === 'generate_training_case') return `${base}
Tarea: generar un caso simulado para entrenamiento ECICEP en APS/CESFAM Valparaíso.
Módulo: ${payload.module || 'ingreso'}

Margen seguro:
- Caso ficticio, sin nombres reales, RUT, direcciones ni datos identificatorios.
- Debe incluir 3 a 6 datos clínicos o contextuales plausibles.
- Puede incluir: inasistencias, atención de urgencia, alta hospitalaria reciente, PDS/cuidador/a, descompensación HTA/DM, polifarmacia, salud mental, barrera económica, dificultad de traslado, baja red, tabaco/alcohol.
- No diagnostiques condiciones nuevas ni indiques tratamientos.
- El caso debe servir para entrenar entrevista centrada en la persona y plan consensuado.

Devuelve JSON:
{"caso_simulado":"...","datos_clave":["..."],"tension_ecicep":"...","objetivo_de_entrenamiento":"...","pregunta_inicial_sugerida":"..."}`;

  if (action === 'evaluate_structured_practice') return `${base}
Tarea: evaluar una práctica de separación de anamnesis ECICEP.
Módulo: ${payload.module || ''}
Texto bruto/anamnesis: ${payload.raw || ''}
Respuesta del usuario:
Barreras: ${payload.barriers || ''}
Facilitadores: ${payload.facilitators || ''}
Ambivalencias: ${payload.ambivalence || ''}
Razones para el cambio: ${payload.reasons || ''}
Problemas potenciales: ${payload.problems || ''}
Primer acuerdo posible: ${payload.agreement || ''}
Seguimiento sugerido: ${payload.follow || ''}

Evalúa con tono formativo, positivo y útil. No castigues. Identifica qué hizo bien y qué faltó explorar.
Devuelve JSON:
{"retroalimentacion_positiva":["..."],"lo_que_falto_explorar":["..."],"pregunta_que_habria_ayudado":"...","riesgo_de_plan_impuesto":"bajo|medio|alto","version_mejorada":{"observaciones":"...","barreras":"...","facilitadores":"...","ambivalencias":"...","razones_para_el_cambio":"...","problemas_potenciales":"...","primer_acuerdo_posible":"...","seguimiento_sugerido":"..."}}`;

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
