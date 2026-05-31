[README.md](https://github.com/user-attachments/files/28441367/README.md)
# Entrenamiento ECICEP IA v2.9

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


## Cambios v2.9
- Eliminada barra de búsqueda global.
- Menú dinámico según rol.
- Preguntas reescritas con lenguaje más cálido, respetuoso e inclusivo.
- Role play ampliado con más casos por rol, tipo de atención y dificultad.

## Cambios v2.9
- Ruta según rol ajustada a lógica protocolo/manual.
- Advertencia de privacidad movida al encabezado.
- Barreras frecuentes ampliadas por aspecto como ayuda de memoria clínica.
- "IA: qué falta explorar" renombrado a "IA: fortalecer anamnesis del aspecto".
- Prompt IA quirúrgico: no inventar barreras, facilitadores ni ambivalencia.
- IA entrega "siguiente mejor pregunta", hipótesis a aclarar y suficiencia para plan.
- La salida visual del análisis por aspecto ya no muestra JSON crudo.

## Cambios v2.9
- La casilla 2 ahora parte con "PREGUNTE AHORA".
- La pregunta inmediata se basa en el dato más específico escrito por el profesional.
- Funciona para todos los 9 aspectos del plan.
- La IA evita partir con preguntas genéricas del banco cuando ya existe una barrera específica.
- El texto pulido fue ajustado para ordenar anamnesis, no para decir "no se menciona".
- Se fuerza detección de ambivalencia cuando hay tensión del tipo "quiere/sabe que es importante, pero...".

## Cambios v2.9
- Rediseño visual completo del módulo Plan 9 aspectos.
- Selector desplegable de aspecto en lugar de grilla.
- Flujo vertical por pasos: aspecto → evaluación → pregunte ahora → texto pulido → suficiencia para plan.
- Barreras frecuentes agrupadas por categoría.
- Preguntas por intención en bloque desplegable.
- "PREGUNTE AHORA" queda como primer resultado visible.
- Análisis clínico completo queda en desplegable para no saturar el uso en box.
- Suficiencia para plan se muestra con semáforo visual.

## Cambios v2.9
- Corrección móvil: el bloque de rol ya no queda fijo detrás del menú.
- Inicio rediseñado como índice breve y orientador.
- Ruta por rol más limpia y legible.
- Entrenamiento guiado por selector.
- Entrenamiento en 4 capas: aprender rápido, ejemplo completo, caso simulado IA y práctica opcional.
- Ingreso/control/acuerdo con lenguaje breve, cálido y operativo.
- Práctica estructurada con retroalimentación IA.

## Cambios v2.9
- Optimización visual para PC y Android sin perder limpieza.
- Se corrige comportamiento móvil: rol no tapa contenido y menú queda estable.
- Inicio se transforma en tablero/índice más claro en PC.
- Ruta por rol se muestra como flujo limpio en PC y tarjetas simples en móvil.
- Entrenar aprovecha dos columnas en PC para aprender + ejemplo, pero mantiene una columna en Android.
- Plan 9 aspectos mantiene flujo vertical, con paso inicial mejor aprovechado en PC.

## Cambios v2.9
- Nueva matriz visual institucional basada en azul, blanco y rojo de Chile.
- Selector de apariencia visual persistente en el navegador.
- Temas disponibles: Chile institucional, Clínico limpio, Cálido humano, Dinámico moderno y Alto contraste.
- Los colores se aplican por función: azul estructura, blanco lectura, rojo alerta, verde avance, amarillo barrera/parcial, morado IA.
- Se mantiene la misma lógica clínica y de IA; solo cambia la capa visual.
