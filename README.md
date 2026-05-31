[README.md](https://github.com/user-attachments/files/28444083/README.md)
# Entrenamiento ECICEP IA v3.7

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


## Cambios v3.7
- Eliminada barra de búsqueda global.
- Menú dinámico según rol.
- Preguntas reescritas con lenguaje más cálido, respetuoso e inclusivo.
- Role play ampliado con más casos por rol, tipo de atención y dificultad.

## Cambios v3.7
- Ruta según rol ajustada a lógica protocolo/manual.
- Advertencia de privacidad movida al encabezado.
- Barreras frecuentes ampliadas por aspecto como ayuda de memoria clínica.
- "IA: qué falta explorar" renombrado a "IA: fortalecer anamnesis del aspecto".
- Prompt IA quirúrgico: no inventar barreras, facilitadores ni ambivalencia.
- IA entrega "siguiente mejor pregunta", hipótesis a aclarar y suficiencia para plan.
- La salida visual del análisis por aspecto ya no muestra JSON crudo.

## Cambios v3.7
- La casilla 2 ahora parte con "PREGUNTE AHORA".
- La pregunta inmediata se basa en el dato más específico escrito por el profesional.
- Funciona para todos los 9 aspectos del plan.
- La IA evita partir con preguntas genéricas del banco cuando ya existe una barrera específica.
- El texto pulido fue ajustado para ordenar anamnesis, no para decir "no se menciona".
- Se fuerza detección de ambivalencia cuando hay tensión del tipo "quiere/sabe que es importante, pero...".

## Cambios v3.7
- Rediseño visual completo del módulo Plan 9 aspectos.
- Selector desplegable de aspecto en lugar de grilla.
- Flujo vertical por pasos: aspecto → evaluación → pregunte ahora → texto pulido → suficiencia para plan.
- Barreras frecuentes agrupadas por categoría.
- Preguntas por intención en bloque desplegable.
- "PREGUNTE AHORA" queda como primer resultado visible.
- Análisis clínico completo queda en desplegable para no saturar el uso en box.
- Suficiencia para plan se muestra con semáforo visual.

## Cambios v3.7
- Corrección móvil: el bloque de rol ya no queda fijo detrás del menú.
- Inicio rediseñado como índice breve y orientador.
- Ruta por rol más limpia y legible.
- Entrenamiento guiado por selector.
- Entrenamiento en 4 capas: aprender rápido, ejemplo completo, caso simulado IA y práctica opcional.
- Ingreso/control/acuerdo con lenguaje breve, cálido y operativo.
- Práctica estructurada con retroalimentación IA.

## Cambios v3.7
- Optimización visual para PC y Android sin perder limpieza.
- Se corrige comportamiento móvil: rol no tapa contenido y menú queda estable.
- Inicio se transforma en tablero/índice más claro en PC.
- Ruta por rol se muestra como flujo limpio en PC y tarjetas simples en móvil.
- Entrenar aprovecha dos columnas en PC para aprender + ejemplo, pero mantiene una columna en Android.
- Plan 9 aspectos mantiene flujo vertical, con paso inicial mejor aprovechado en PC.

## Cambios v3.7
- Nueva matriz visual institucional basada en azul, blanco y rojo de Chile.
- Selector de apariencia visual persistente en el navegador.
- Temas disponibles: Chile institucional, Clínico limpio, Cálido humano, Dinámico moderno y Alto contraste.
- Los colores se aplican por función: azul estructura, blanco lectura, rojo alerta, verde avance, amarillo barrera/parcial, morado IA.
- Se mantiene la misma lógica clínica y de IA; solo cambia la capa visual.

## Cambios v3.7
- Se reemplaza el foco "Chile institucional" por un sistema de estilos cálidos, amables y agradables a la vista.
- Nuevos temas: Sereno ECICEP, Cálido humano, Litoral Valparaíso, Lavanda profesional, Menta clínica y Alto contraste amable.
- Se mantiene la lógica de color funcional: azul/verde para estructura y cuidado, amarillo para barreras, rojo para alertas y morado para IA.
- El selector de estilo visual queda dentro de la app y se guarda en el navegador.

## Cambios v3.7
- Fuente cambiada a Nunito Sans para una lectura más cálida y menos plana.
- Selector de estilo visual movido al encabezado superior derecho.
- Nombres de estilos más formales.
- Ruta según rol movida bajo el selector de rol.
- Encabezado simplificado: Entrenamiento ECICEP + bajada breve + advertencia de privacidad destacada.
- Inicio reescrito como orientación real de uso y accesos rápidos.
- Entrenamiento guiado reconstruido en 4 capas: aprender rápido, ejemplo completo, caso IA y práctica opcional.
- Barreras frecuentes en Plan 9 aspectos mejor distribuidas en PC.

## Cambios v3.7
- Capa 3 se transforma en simulador dinámico de entrevista ECICEP.
- La simulación permite configurar tipo de caso, dificultad y foco principal.
- La IA responde como persona usuaria y enseña criterio por turno.
- Se activa modo motivacional cuando aparece ambivalencia, resistencia, baja confianza o alta importancia/baja posibilidad.
- Capa 4 queda conectada a la simulación: la conversación se transfiere automáticamente a observaciones, barreras, facilitadores, ambivalencias, razones para el cambio, problemas, acuerdo y seguimiento.
- Se agrega retroalimentación formativa: qué abrió la pregunta, qué faltó explorar, riesgo de imposición y microlección.

## Cambios v3.7
- Capa 3 vuelve a ser estructurada y guiada, con casos específicos seleccionados.
- Cada caso enseña una habilidad concreta: barrera relacional, adherencia de fin de semana, actividad con miedo a caída, cuidador/a sobrecargado/a, sí automático y alta hospitalaria.
- Capa 4 queda como espacio de caso aleatorio + práctica + retroalimentación IA.
- Se elimina la lógica de simulación dinámica por turnos porque no era la experiencia deseada.
- La práctica mantiene casillas para ordenar observaciones, barreras, facilitadores, ambivalencias, razones para el cambio, problemas, acuerdo y seguimiento.

## Cambios v3.7
- Capa 3 se transforma en “Estudio guiado con ejemplos prácticos”.
- Cada ficha combina situación ECICEP, caso práctico, decisión interactiva, retroalimentación, preguntas útiles, errores a evitar, microlección, ordenamiento y registro sugerido.
- Capa 4 se mantiene como práctica con caso aleatorio y retroalimentación IA.
- Se agregan situaciones ECICEP frecuentes: controles, fármacos, alimentación, actividad, sí automático, cuidador/a, alta hospitalaria y urgencia/descompensación.

## Cambios v3.7
- Arquitectura visual por pantallas/capas.
- Nueva pantalla inicial de selección de perfil.
- Después de elegir perfil, la app entra a un inicio adaptado por rol.
- Se reemplaza el menú horizontal visible por una barra superior compacta con selector de módulo.
- Cada módulo se abre como pantalla limpia y tiene botón para volver al inicio del perfil.
- La ruta según rol queda dentro del inicio del perfil y ocupa menos espacio.
- Se mantiene el selector de estilo visual en formato compacto.

## Cambios v3.7
- Rediseño completo de Entrenamiento guiado por pantallas internas.
- Se eliminan las etiquetas "Capa" del contenido visible.
- Entrenamiento ahora separa: elección del foco, orientación, ejemplo guiado, ejemplos prácticos por fases y práctica con IA.
- Se incorpora explícitamente la ruta clínica ECICEP: Prepararse, Abrir, Explorar, Priorizar, Deliberar, Acordar, Registrar y Continuar.
- Se integra la lógica comunicacional del manual: vincular, enfocar, evocar y planificar; seguir, guiar y dirigir según el momento.
- Los ejemplos prácticos avanzan por fases con alternativas breves y retroalimentación profesional.
- Se mantiene práctica con IA como pantalla independiente, accesible sin pasar por todos los ejemplos.

## Cambios v3.7
- Corrige retroalimentación duplicada: cada alternativa ahora tiene análisis propio.
- Las “siguientes preguntas” pasan a ser interactivas.
- La app no permite avanzar hasta elegir una alternativa inicial y una siguiente pregunta que habilite continuidad.
- Cada fase cambia su color visual para distinguir el momento de la entrevista.
- Se mejora el tono formativo: útil ahora, parcial, con cuidado, prematuro o evitar.
