# Entrenamiento ECICEP IA v4.6

Incluye:
- Selector permanente de rol.
- Entrenamiento guiado.
- Plan de cuidado por 9 aspectos.
- Seguimiento a distancia guiado.
- Bitácora de gestión de casos.
- Banco de preguntas.
- Role play con IA.
- Escala importancia/posibilidad autoguiada.
- Frases IA.
- Auditoría de plan impuesto.
- Backend seguro para GroqCloud en Vercel.

Seguridad:
No ingresar RUT, nombres, direcciones, teléfonos ni datos identificatorios.
La API key de GroqCloud nunca va en el index.html ni en GitHub Pages.

Variables en Vercel:
GROQ_API_KEY = tu clave de GroqCloud
GROQ_MODEL = el modelo que ya tienes configurado (opcional)
ALLOWED_ORIGIN = dominio permitido (opcional)

Si usas GitHub Pages + Vercel:
Pega la URL del backend Vercel en Soporte IA:
https://TU-PROYECTO.vercel.app/api/ecicep-ai


## Cambios v4.6
- Eliminada barra de búsqueda global.
- Menú dinámico según rol.
- Preguntas reescritas con lenguaje más cálido, respetuoso e inclusivo.
- Role play ampliado con más casos por rol, tipo de atención y dificultad.

## Cambios v4.6
- Ruta según rol ajustada a lógica protocolo/manual.
- Advertencia de privacidad movida al encabezado.
- Barreras frecuentes ampliadas por aspecto como ayuda de memoria clínica.
- "IA: qué falta explorar" renombrado a "IA: fortalecer anamnesis del aspecto".
- Prompt IA quirúrgico: no inventar barreras, facilitadores ni ambivalencia.
- IA entrega "siguiente mejor pregunta", hipótesis a aclarar y suficiencia para plan.
- La salida visual del análisis por aspecto ya no muestra JSON crudo.

## Cambios v4.6
- La casilla 2 ahora parte con "PREGUNTE AHORA".
- La pregunta inmediata se basa en el dato más específico escrito por el profesional.
- Funciona para todos los 9 aspectos del plan.
- La IA evita partir con preguntas genéricas del banco cuando ya existe una barrera específica.
- El texto pulido fue ajustado para ordenar anamnesis, no para decir "no se menciona".
- Se fuerza detección de ambivalencia cuando hay tensión del tipo "quiere/sabe que es importante, pero...".

## Cambios v4.6
- Rediseño visual completo del módulo Plan 9 aspectos.
- Selector desplegable de aspecto en lugar de grilla.
- Flujo vertical por pasos: aspecto → evaluación → pregunte ahora → texto pulido → suficiencia para plan.
- Barreras frecuentes agrupadas por categoría.
- Preguntas por intención en bloque desplegable.
- "PREGUNTE AHORA" queda como primer resultado visible.
- Análisis clínico completo queda en desplegable para no saturar el uso en box.
- Suficiencia para plan se muestra con semáforo visual.

## Cambios v4.6
- Corrección móvil: el bloque de rol ya no queda fijo detrás del menú.
- Inicio rediseñado como índice breve y orientador.
- Ruta por rol más limpia y legible.
- Entrenamiento guiado por selector.
- Entrenamiento en 4 capas: aprender rápido, ejemplo completo, caso simulado IA y práctica opcional.
- Ingreso/control/acuerdo con lenguaje breve, cálido y operativo.
- Práctica estructurada con retroalimentación IA.

## Cambios v4.6
- Optimización visual para PC y Android sin perder limpieza.
- Se corrige comportamiento móvil: rol no tapa contenido y menú queda estable.
- Inicio se transforma en tablero/índice más claro en PC.
- Ruta por rol se muestra como flujo limpio en PC y tarjetas simples en móvil.
- Entrenar aprovecha dos columnas en PC para aprender + ejemplo, pero mantiene una columna en Android.
- Plan 9 aspectos mantiene flujo vertical, con paso inicial mejor aprovechado en PC.

## Cambios v4.6
- Nueva matriz visual institucional basada en azul, blanco y rojo de Chile.
- Selector de apariencia visual persistente en el navegador.
- Temas disponibles: Chile institucional, Clínico limpio, Cálido humano, Dinámico moderno y Alto contraste.
- Los colores se aplican por función: azul estructura, blanco lectura, rojo alerta, verde avance, amarillo barrera/parcial, morado IA.
- Se mantiene la misma lógica clínica y de IA; solo cambia la capa visual.

## Cambios v4.6
- Se reemplaza el foco "Chile institucional" por un sistema de estilos cálidos, amables y agradables a la vista.
- Nuevos temas: Sereno ECICEP, Cálido humano, Litoral Valparaíso, Lavanda profesional, Menta clínica y Alto contraste amable.
- Se mantiene la lógica de color funcional: azul/verde para estructura y cuidado, amarillo para barreras, rojo para alertas y morado para IA.
- El selector de estilo visual queda dentro de la app y se guarda en el navegador.

## Cambios v4.6
- Fuente cambiada a Nunito Sans para una lectura más cálida y menos plana.
- Selector de estilo visual movido al encabezado superior derecho.
- Nombres de estilos más formales.
- Ruta según rol movida bajo el selector de rol.
- Encabezado simplificado: Entrenamiento ECICEP + bajada breve + advertencia de privacidad destacada.
- Inicio reescrito como orientación real de uso y accesos rápidos.
- Entrenamiento guiado reconstruido en 4 capas: aprender rápido, ejemplo completo, caso IA y práctica opcional.
- Barreras frecuentes en Plan 9 aspectos mejor distribuidas en PC.

## Cambios v4.6
- Capa 3 se transforma en simulador dinámico de entrevista ECICEP.
- La simulación permite configurar tipo de caso, dificultad y foco principal.
- La IA responde como persona usuaria y enseña criterio por turno.
- Se activa modo motivacional cuando aparece ambivalencia, resistencia, baja confianza o alta importancia/baja posibilidad.
- Capa 4 queda conectada a la simulación: la conversación se transfiere automáticamente a observaciones, barreras, facilitadores, ambivalencias, razones para el cambio, problemas, acuerdo y seguimiento.
- Se agrega retroalimentación formativa: qué abrió la pregunta, qué faltó explorar, riesgo de imposición y microlección.

## Cambios v4.6
- Capa 3 vuelve a ser estructurada y guiada, con casos específicos seleccionados.
- Cada caso enseña una habilidad concreta: barrera relacional, adherencia de fin de semana, actividad con miedo a caída, cuidador/a sobrecargado/a, sí automático y alta hospitalaria.
- Capa 4 queda como espacio de caso aleatorio + práctica + retroalimentación IA.
- Se elimina la lógica de simulación dinámica por turnos porque no era la experiencia deseada.
- La práctica mantiene casillas para ordenar observaciones, barreras, facilitadores, ambivalencias, razones para el cambio, problemas, acuerdo y seguimiento.

## Cambios v4.6
- Capa 3 se transforma en “Estudio guiado con ejemplos prácticos”.
- Cada ficha combina situación ECICEP, caso práctico, decisión interactiva, retroalimentación, preguntas útiles, errores a evitar, microlección, ordenamiento y registro sugerido.
- Capa 4 se mantiene como práctica con caso aleatorio y retroalimentación IA.
- Se agregan situaciones ECICEP frecuentes: controles, fármacos, alimentación, actividad, sí automático, cuidador/a, alta hospitalaria y urgencia/descompensación.

## Cambios v4.6
- Arquitectura visual por pantallas/capas.
- Nueva pantalla inicial de selección de perfil.
- Después de elegir perfil, la app entra a un inicio adaptado por rol.
- Se reemplaza el menú horizontal visible por una barra superior compacta con selector de módulo.
- Cada módulo se abre como pantalla limpia y tiene botón para volver al inicio del perfil.
- La ruta según rol queda dentro del inicio del perfil y ocupa menos espacio.
- Se mantiene el selector de estilo visual en formato compacto.

## Cambios v4.6
- Rediseño completo de Entrenamiento guiado por pantallas internas.
- Se eliminan las etiquetas "Capa" del contenido visible.
- Entrenamiento ahora separa: elección del foco, orientación, ejemplo guiado, ejemplos prácticos por fases y práctica con IA.
- Se incorpora explícitamente la ruta clínica ECICEP: Prepararse, Abrir, Explorar, Priorizar, Deliberar, Acordar, Registrar y Continuar.
- Se integra la lógica comunicacional del manual: vincular, enfocar, evocar y planificar; seguir, guiar y dirigir según el momento.
- Los ejemplos prácticos avanzan por fases con alternativas breves y retroalimentación profesional.
- Se mantiene práctica con IA como pantalla independiente, accesible sin pasar por todos los ejemplos.

## Cambios v4.6
- Corrige retroalimentación duplicada: cada alternativa ahora tiene análisis propio.
- Las “siguientes preguntas” pasan a ser interactivas.
- La app no permite avanzar hasta elegir una alternativa inicial y una siguiente pregunta que habilite continuidad.
- Cada fase cambia su color visual para distinguir el momento de la entrevista.
- Se mejora el tono formativo: útil ahora, parcial, con cuidado, prematuro o evitar.

## Cambios v4.6
- Practicar con IA ahora tiene flujo visual: generar caso, profundizar, bitácora, anamnesis acumulativa, extracción por categoría y evaluación.
- Se agregan botones “Ayúdame” en cada casilla: observaciones, barreras, facilitadores, ambivalencias, razones, problemas, acuerdo y seguimiento.
- La IA distingue encontrado, inferido con cautela, no aparece y pregunta necesaria.
- La IA analiza lo que el usuario ya escribió antes de sugerir cambios.
- El caso y la bitácora se resaltan visualmente con colores por categoría.
- Los casos aleatorios se solicitan más completos para entrenar ECICEP con barreras, facilitadores, ambivalencias, razones y continuidad.

## Cambios v4.6
- Se integra documento interno: `docs/matriz_tecnica_ecicep_aps_chile.md`.
- Se integra base JSON: `data/matriz_tecnica_ecicep_aps_chile.json`.
- Nueva pantalla “Matriz APS Chile”.
- La app incorpora matriz interna para APS Chile, GES, COMGES/IAAPS/REM, CIE-10 orientativo, NANDA orientativo y mínimos del plan de cuidado.
- En Práctica con IA se agrega botón “Lectura técnica APS Chile”.
- El API usa la matriz como contexto interno para generar casos, orientar lectura técnica y evaluar sin diagnosticar ni confirmar garantías.

## Cambios v4.6 — Consolidación clínica, visual y técnica

- Limpieza de estructura HTML y corrección de duplicados de sección.
- Matriz técnica ampliada como motor interno de la app.
- Casos simulados con estructura obligatoria para entrenamiento ECICEP APS Chile.
- Refuerzo de alcance por rol: profesional, TENS/seguimiento y gestor/a.
- Salidas de ayuda IA más visuales: Encontrado / Inferido / No aparece / Pregunta necesaria.
- Nueva sección en práctica IA: “¿Ya se puede construir el plan?”.
- Evaluación de suficiencia del plan con criterios ECICEP: problema, objetivo, actividad, responsable, seguimiento, barrera, facilitador, riesgo de imposición y registro.
- Mejor diferenciación visual entre caso, bitácora, anamnesis, análisis, plan y evaluación.

## Cambios v4.6
- En práctica con IA se agrega selección de profesión y ámbito de práctica.
- La generación de casos, profundización, extracción, lectura técnica y evaluación consideran profesión/ámbito.
- Se agrega una ventana “Síntesis IA de lo entendido hasta ahora”, actualizada con el caso y la bitácora.
- Las categorías de práctica se muestran hacia abajo, a ancho completo, no en dos columnas.
- Las tarjetas Encontrado / Inferido / No aparece / Pregunta necesaria se ordenan 2x2 y con numeración por importancia.
- Los hallazgos se solicitan ordenados por importancia clínica/formativa.

## Cambios v4.6
- Renombra “Tipo de caso” a “Momento ECICEP”.
- Elimina el selector “Ámbito de práctica” para evitar contradicciones como Ingreso integral + Seguimiento a distancia.
- Renombra “Foco principal” a “Foco clínico-programático”.
- Amplía opciones de foco clínico-programático, incluyendo PSCV / HTA / DM2 / RCV.
- Amplía matriz PSCV con condiciones, barreras, facilitadores, alertas, preguntas, CIE-10 orientativo, NANDA orientativo y registro mínimo.
- Ajusta API para usar Momento ECICEP + Profesión/Rol + Foco clínico-programático + Dificultad.

## Cambios v4.6
- Simplifica visualmente Práctica con IA en 6 pantallas internas: configurar, leer, entrevistar, ordenar, plan y evaluar.
- Agrega barra de progreso: Caso → Leer → Entrevistar → Ordenar → Plan → Evaluar.
- Mantiene configuración por Momento ECICEP + Profesión/Rol + Foco clínico-programático + Dificultad.
- Mueve lectura técnica a la pantalla de lectura del caso.
- Mueve síntesis IA a la pantalla de entrevista.
- Agrupa categorías en acordeones: lo que observamos, lo que explica el cambio y lo que permite planificar.
- Mantiene botones “Ayúdame”, pero solo en la etapa de ordenar información.

## Cambios v4.6
- Agrega control de calidad automático de casos antes de mostrarlos.
- Nueva acción IA `validate_training_case`.
- El generador crea un borrador; la validación corrige nombres propios, establecimientos inventados, contradicciones, eventos no sustentados y redacción débil.
- Se agrega estado visible: generando, validando, caso listo.
- Se agrega lectura rápida del caso: foco, barrera probable, facilitador, ambivalencia, información pendiente y continuidad.
- Reglas reforzadas para PSCV y lenguaje clínico seguro.

## Cambios v4.6
- Elimina el bloque visible “Lectura ECICEP” en la entrevista.
- Reordena pantalla de entrevista: síntesis viva, elementos detectados, bitácora, pregunta sugerida y nueva pregunta.
- Agrega tarjetas acumulativas para barreras, facilitadores, ambivalencias y razones.
- Cada elemento detectado tiene botón de explicación opcional.
- Corrige criterio de ambivalencia: emoción aislada no es ambivalencia.
- La pregunta sugerida queda siempre al final y depende de la brecha principal de información.
