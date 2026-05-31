const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const APS_CHILE_MATRIX_CONTEXT = `MATRIZ TÉCNICA ECICEP APS CHILE v4.3 (uso interno):
- Eje central: persona/contexto -> condición/programa -> barreras/facilitadores -> prioridad compartida -> opciones/riesgo -> acuerdo -> registro -> continuidad.
- La matriz no diagnostica, no confirma GES y no indica tratamiento. Entrena razonamiento clínico-comunicacional.
- Casos de práctica deben incluir, cuando sea pertinente: datos clínicos/contextuales, programa APS, situación actual, barrera explícita, facilitador, ambivalencia/tensión, razón para el cambio, riesgo o pendiente, información faltante, posible acuerdo y continuidad.
- Programas/situaciones: PSCV/DM2/HTA/dislipidemia; ERA/EPOC/asma; Salud Mental; Adulto mayor/EMPAM; Dependencia/PADDS/cuidador/a; preventivos PAP/mamografía/EMPA/EMPAM/vacunas; Farmacia/FOFAR; SOME/acceso/agenda; urgencia/descompensación; alta hospitalaria.
- GES: alerta orientativa de derecho/continuidad; verificar criterios, edad, diagnóstico, etapa, red y registro local.
- COMGES/IAAPS/REM: contexto de gestión y continuidad; nunca motivo para imponer. Recordar registro si corresponde.
- CIE-10: familia orientativa, no diagnóstico. E10-E14 DM; I10-I15 HTA; E78 dislipidemia; J40-J47 respiratorias crónicas; F00-F99 salud mental; Z00-Z99 contacto/factores; R00-R99 síntomas.
- NANDA: patrón a valorar, no diagnóstico automático. Autogestión ineficaz/riesgo/disposición; conocimientos deficientes; riesgo de caídas; deterioro movilidad; sobrecarga rol cuidador/a; afrontamiento ineficaz; conductas de salud propensas a riesgo.
- Cierre de plan: problema priorizado, objetivo comprensible, actividad concreta, responsable, seguimiento, barrera considerada, facilitador/apoyo, riesgo/alerta si existe, registro útil y revisión de imposición.
- Profesiones de práctica: enfermería, medicina, nutrición, psicología, trabajo social, kinesiología, matronería, odontología, química/farmacia, TENS, gestor/a ECICEP y SOME. Ajustar los casos y orientaciones al alcance profesional, sin sobrepasarlo.
- Configuración v4.3: usar Momento ECICEP + profesión/rol + foco clínico-programático + dificultad. No usar 'ámbito de práctica' como selector separado.
- Si foco clínico-programático es PSCV/HTA/DM2/RCV, el caso debe considerar según pertinencia: HTA, DM2, dislipidemia, riesgo cardiovascular, adherencia a controles/fármacos, alimentación, actividad física, tabaco/alcohol, farmacia/retiro, exámenes/controles, urgencia/descompensación, pie diabético o salud oral si corresponde, barreras, facilitadores, ambivalencia, razones para el cambio, alerta y continuidad. No diagnosticar ni indicar tratamiento.`;

const roleText = {
  profesional: 'Profesional clínico de box: integra evaluación clínica, prioriza con la persona, construye o ajusta plan de cuidado consensuado y define seguimiento.',
  tens: 'TENS / seguimiento a distancia: revisa acuerdos del plan, detecta barreras o alertas, refuerza comprensión y coordina/reporta continuidad. No construye diagnóstico ni cambia tratamiento; si aparece alerta o decisión clínica fuera de alcance, debe reportar/coordinar.',
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
- Devuelve solo JSON válido, sin markdown.
- Usa la matriz técnica APS Chile solo como orientación, sin diagnosticar ni confirmar GES.
${APS_CHILE_MATRIX_CONTEXT}`;
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
Tarea: generar un caso simulado COMPLETO para entrenamiento ECICEP en APS/CESFAM Valparaíso.
Módulo: ${payload.module || 'ingreso'}
Profesión/rol que practica: ${payload.profession || 'no especificada'}

Margen seguro:
- Caso ficticio, sin nombres reales, RUT, direcciones ni datos identificatorios.
- Debe incluir material suficiente para entrenar anamnesis ECICEP: datos clínicos/contextuales, barreras, facilitadores, ambivalencia, razones para el cambio, problemas potenciales, posible acuerdo o información pendiente. No todo debe estar explícito; algunas cosas pueden requerir preguntas.
- Puede incluir: inasistencias, atención de urgencia, alta hospitalaria reciente, PDS/cuidador/a, descompensación HTA/DM, polifarmacia, salud mental, barrera económica, dificultad de traslado, baja red, tabaco/alcohol.
- No diagnostiques condiciones nuevas ni indiques tratamientos.
- El caso debe servir para entrenar entrevista centrada en la persona y plan consensuado.

Devuelve JSON:
{"caso_simulado":"caso narrativo completo y realista, sin datos identificatorios","programa_aps_relacionado":["..."],"datos_clinicos_contextuales":["..."],"barrera_explicita":"...","barrera_oculta_posible":"...","facilitador":"...","ambivalencia":"...","razon_para_el_cambio":"...","riesgo_o_alerta":"...","pendiente_preventivo_programatico":"...","informacion_pendiente":["..."],"posible_acuerdo":"...","continuidad_sugerida":"...","datos_clave":["..."],"tension_ecicep":"...","objetivo_de_entrenamiento":"...","pregunta_inicial_sugerida":"..."}`;

  if (action === 'evaluate_structured_practice') return `${base}
Tarea: evaluar una práctica de separación de anamnesis ECICEP.
Módulo: ${payload.module || ''}
Texto bruto/anamnesis: ${payload.raw || ''}
Respuesta del usuario:
Observaciones: ${payload.observations || ''}
Barreras: ${payload.barriers || ''}
Facilitadores: ${payload.facilitators || ''}
Ambivalencias: ${payload.ambivalence || ''}
Razones para el cambio: ${payload.reasons || ''}
Problemas potenciales: ${payload.problems || ''}
Primer acuerdo posible: ${payload.agreement || ''}
Seguimiento sugerido: ${payload.follow || ''}
Bitácora de preguntas al caso: ${JSON.stringify(payload.transcript || [])}
Ayudas/colores usados: ${JSON.stringify(payload.highlights || [])}

Evalúa con tono formativo, positivo y útil. No castigues. Identifica qué hizo bien y qué faltó explorar.
Devuelve JSON:
{"retroalimentacion_positiva":["..."],"lo_que_falto_explorar":["..."],"pregunta_que_habria_ayudado":"...","riesgo_de_plan_impuesto":"bajo|medio|alto","version_mejorada":{"observaciones":"...","barreras":"...","facilitadores":"...","ambivalencias":"...","razones_para_el_cambio":"...","problemas_potenciales":"...","primer_acuerdo_posible":"...","seguimiento_sugerido":"..."},"analisis_de_uso_de_ayuda_ia":"comenta brevemente si la persona usó ayuda IA y si integró bien la evidencia"}`;


  if (action === 'start_dynamic_simulation') return `${base}
Tarea: iniciar un simulador dinámico de entrevista ECICEP para APS/CESFAM Valparaíso.
Módulo de entrenamiento: ${payload.module || 'ingreso'}
Momento ECICEP: ${payload.type || 'ingreso'}
Dificultad: ${payload.difficulty || 'intermedia'}
Foco clínico-programático: ${payload.focus || 'aleatorio'}

Marco de generación seguro y realista:
- Caso ficticio, sin nombres, RUT, direcciones, teléfonos ni datos identificatorios.
- Basado en situaciones plausibles de APS Chile, ECICEP, multimorbilidad, continuidad, automanejo, cambio de conducta, controles y seguimiento.
- Puede incluir: G2/G3, HTA, DM2, ERA/EPOC, PSCV, inasistencias, urgencia reciente, alta hospitalaria, PDS/cuidador/a, polifarmacia, adherencia irregular, alimentación con barrera económica, actividad limitada por dolor/caída, PAP/mamografía/EMPA/EMPAM/vacunas pendientes, tabaco/alcohol, salud mental, baja red, traslado, indicaciones contradictorias.
- No diagnostiques enfermedades nuevas ni indiques tratamientos.
- El caso debe entrenar criterio conversacional: evaluar, priorizar, acordar, registrar, revisar y ajustar.
- Incluye un objetivo de aprendizaje explícito.
- Entrega opciones de próxima acción, no como examen, sino para enseñar criterio.

Devuelve JSON:
{
 "tipo":"...",
 "dificultad":"...",
 "foco":"...",
 "objetivo_aprendizaje":"habilidad ECICEP que se entrenará",
 "caso_inicial":"caso breve pero suficiente",
 "primera_respuesta_persona":"respuesta inicial simulada de la persona, si corresponde",
 "microleccion_inicial":"microlección breve de 2-3 líneas",
 "opciones_siguiente_accion":["opción A...","opción B...","opción C...","Escribir mi propia pregunta"]
}`;

  if (action === 'advance_dynamic_simulation') return `${base}
Tarea: continuar una simulación dinámica de entrevista ECICEP.
Caso inicial: ${payload.caseText || ''}
Objetivo de aprendizaje: ${payload.objective || ''}
Turno actual: ${payload.turn || 0}
Conversación previa: ${JSON.stringify(payload.transcript || [])}
Acción o pregunta del funcionario/a: ${payload.action || ''}

Actúa en dos capas:
1) Responde como persona usuaria de APS de forma realista, breve y humana.
2) Luego entrena al funcionario/a con retroalimentación ECICEP.

Reglas:
- No evalúes como "correcto/incorrecto"; enseña criterio.
- Indica qué abrió la pregunta y qué faltó explorar.
- Señala riesgo de imposición si la pregunta adelanta indicaciones, culpabiliza o cierra acuerdo sin explorar.
- Si aparece ambivalencia, resistencia, cansancio, vergüenza, baja confianza, "sí automático", alta importancia/baja posibilidad o rechazo a una prestación, activa modo motivacional.
- En modo motivacional: reflejar, validar, explorar importancia, explorar posibilidad, evocar razones propias y ajustar acuerdo.
- Después de cada turno entrega nuevas opciones de acción.
- Mantén coherencia con el rol ECICEP y APS; no indiques tratamientos ni diagnostiques.

Devuelve JSON:
{
 "respuesta_persona":"respuesta simulada de la persona",
 "que_hiciste_bien":["..."],
 "que_abre_tu_pregunta":"...",
 "que_falto_explorar":["..."],
 "riesgo_de_imposicion":"bajo|medio|alto",
 "mejor_siguiente_paso":"...",
 "microleccion":"microlección breve y aplicable",
 "modo_motivacional":{"activar":true,"por_que":"...","evitar":["..."],"hacer_ahora":["..."],"pregunta_motivacional_sugerida":"..."},
 "opciones_siguiente_accion":["opción A...","opción B...","opción C...","Escribir mi propia pregunta"]
}`;

  if (action === 'summarize_simulation_for_practice') return `${base}
Tarea: transformar una conversación simulada ECICEP en una bitácora de práctica para Capa 4.
Caso inicial: ${payload.caseText || ''}
Objetivo de aprendizaje: ${payload.objective || ''}
Conversación: ${JSON.stringify(payload.transcript || [])}

Ordena lo conversado de forma clara, útil y editable. No inventes datos. Si falta información, declárala como pendiente.
Devuelve JSON:
{
 "observaciones":"...",
 "barreras":"...",
 "facilitadores":"...",
 "ambivalencias":"...",
 "razones_para_el_cambio":"...",
 "problemas_potenciales":"...",
 "primer_acuerdo_posible":"...",
 "seguimiento_sugerido":"...",
 "registro_sugerido":"...",
 "informacion_pendiente":["..."]
}`;


  if (action === 'deepen_practice_case') return `${base}
Tarea: responder como persona usuaria simulada a una pregunta de profundización durante práctica ECICEP.
Caso base: ${payload.caseText || ''}
Bitácora previa: ${JSON.stringify(payload.transcript || [])}
Pregunta del funcionario/a: ${payload.question || ''}
Módulo: ${payload.module || 'ingreso'}
Profesión/rol que practica: ${payload.profession || 'no especificada'}

Instrucciones:
- Responde como persona usuaria, de forma humana, breve y realista.
- Mantén coherencia con el caso base y la bitácora.
- Puedes entregar nueva información útil para anamnesis: barreras, facilitadores, ambivalencias, razones para el cambio o datos pendientes.
- No inventes datos identificatorios ni tratamientos.
- No resuelvas como profesional; responde desde la vivencia de la persona.
- Luego agrega una lectura formativa ECICEP breve.

Devuelve JSON:
{
 "respuesta_persona":"...",
 "nuevos_datos":["..."],
 "posibles_barreras":["..."],
 "posibles_facilitadores":["..."],
 "posibles_ambivalencias":["..."],
 "razones_para_el_cambio":["..."],
 "pregunta_siguiente_sugerida":"...",
 "sintesis_acumulada":"síntesis integradora de TODO lo entendido hasta ahora según caso inicial, bitácora y respuesta actual; debe facilitar encontrar barreras, facilitadores, ambivalencias, razones, problemas y continuidad",
 "evidencias":[{"categoria":"barreras|facilitadores|ambivalencias|razones|observaciones|problemas","frase":"frase exacta de la respuesta que respalda la categoría"}]
}`;

  if (action === 'extract_practice_category') return `${base}
Tarea: extraer y enseñar una categoría ECICEP desde un caso de práctica.
Categoría solicitada: ${payload.categoryLabel || payload.category || ''}
Texto completo del caso y bitácora: ${payload.caseText || ''}
Texto ya escrito por el usuario en esa casilla: ${payload.currentText || ''}
Módulo: ${payload.module || 'ingreso'}
Profesión/rol que practica: ${payload.profession || 'no especificada'}

Instrucciones estrictas:
- No inventes evidencia.
- Distingue claramente:
  1) Encontrado en el caso.
  2) Inferido con cautela.
  3) No aparece todavía.
  4) Pregunta necesaria para aclarar.
- Si el usuario ya escribió algo, analízalo brevemente: qué está bien, qué está inespecífico, qué falta precisar.
- Devuelve frases de evidencia lo más exactas posible para poder marcarlas visualmente en el texto.
- Ordena los hallazgos por importancia clínica/formativa, de mayor a menor relevancia.
- Si no hay evidencia, no rellenes como si existiera; propone pregunta.

Devuelve JSON:
{
 "analisis_de_lo_escrito":"...",
 "encontrado_en_el_caso":["..."],
 "inferido_con_cautela":["..."],
 "no_aparece":["..."],
 "pregunta_necesaria":"...",
 "texto_sugerido":"texto breve para completar o mejorar la casilla",
 "evidencias":[{"frase":"frase exacta del caso o respuesta","categoria":"${payload.category || ''}"}]
}`;



  if (action === 'plan_readiness') return `${base}
Tarea: evaluar si la información levantada en práctica ECICEP ya permite construir un plan de cuidado consensuado o si todavía es anamnesis insuficiente.

Rol del usuario: ${payload.role || role}
Módulo: ${payload.module || 'ingreso'}
Profesión/rol que practica: ${payload.profession || 'no especificada'}
Síntesis IA acumulada: ${payload.synthesis || ''}
Anamnesis/observaciones: ${payload.raw || ''}
Observaciones estructuradas: ${payload.observations || ''}
Barreras: ${payload.barriers || ''}
Facilitadores: ${payload.facilitators || ''}
Ambivalencias: ${payload.ambivalence || ''}
Razones para el cambio: ${payload.reasons || ''}
Problemas/riesgos: ${payload.problems || ''}
Acuerdo posible: ${payload.agreement || ''}
Seguimiento: ${payload.follow || ''}
Bitácora: ${JSON.stringify(payload.transcript || [])}

Evalúa con enfoque ECICEP/APS Chile:
- problema priorizado con la persona;
- objetivo claro y comprensible;
- actividad concreta y posible;
- responsable;
- seguimiento;
- barrera considerada;
- facilitador considerado;
- riesgo/alerta abordado si existe;
- registro útil para continuidad;
- riesgo de plan impuesto.

Si el rol es TENS, distingue qué puede registrar/reforzar y qué debe reportar/coordinar.

Devuelve JSON:
{
 "estado":"listo_para_plan|parcial|aun_anamnesis",
 "criterios":[
  {"criterio":"Problema priorizado","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Objetivo","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Actividad concreta","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Responsable","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Seguimiento","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Barrera considerada","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Facilitador/apoyo","estado":"cumple|parcial|falta","comentario":"..."},
  {"criterio":"Riesgo de imposición","estado":"cumple|parcial|falta","comentario":"..."}
 ],
 "que_falta":["..."],
 "pregunta_para_cerrar_mejor":"...",
 "registro_sugerido":"...",
 "cuidado_ecicep":"..."
}`;

  if (action === 'technical_case_reading') return `${base}
Tarea: realizar lectura técnica orientativa de un caso de práctica ECICEP usando matriz APS Chile integrada.
Caso y bitácora: ${payload.caseText || ''}
Rol del usuario: ${roleText[role] || roleText.profesional}
Módulo: ${payload.module || 'ingreso'}

Usa esta lectura para enseñar, no para diagnosticar. Debes distinguir lo explícito, lo probable y lo pendiente.
Considera APS Chile, programas, posible GES, COMGES/IAAPS/REM, CIE-10 orientativo, NANDA orientativo y plan de cuidado.

Devuelve JSON:
{
 "lectura_ecicep":"...",
 "programas_aps_relacionados":[{"programa":"...","por_que":"...","que_revisar":"..."}],
 "posible_ges":{"existe_alerta":true,"orientacion":"verificar criterios; no confirmar garantía","condiciones_a_verificar":["..."]},
 "comges_iaaps_rem":{"oportunidades":["..."],"cuidado":"no usar indicador para imponer plan"},
 "cie10_orientativo":[{"familia":"...","solo_si":"verificar diagnóstico en ficha"}],
 "nanda_orientativo":[{"patron":"...","por_que_valorar":"...","no_confirmar_automaticamente":true}],
 "aspectos_ecicep_prioritarios":["..."],
 "alertas_o_pendientes":["..."],
 "preguntas_para_completar":["..."],
 "orientacion_de_continuidad":"..."
}`;

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
