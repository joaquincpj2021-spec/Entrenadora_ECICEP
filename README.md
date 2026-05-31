[README.md](https://github.com/user-attachments/files/28436789/README.md)
# Entrenamiento ECICEP IA v2.4

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


## Cambios v2.4
- Eliminada barra de búsqueda global.
- Menú dinámico según rol.
- Preguntas reescritas con lenguaje más cálido, respetuoso e inclusivo.
- Role play ampliado con más casos por rol, tipo de atención y dificultad.

## Cambios v2.4
- Ruta según rol ajustada a lógica protocolo/manual.
- Advertencia de privacidad movida al encabezado.
- Barreras frecuentes ampliadas por aspecto como ayuda de memoria clínica.
- "IA: qué falta explorar" renombrado a "IA: fortalecer anamnesis del aspecto".
- Prompt IA quirúrgico: no inventar barreras, facilitadores ni ambivalencia.
- IA entrega "siguiente mejor pregunta", hipótesis a aclarar y suficiencia para plan.
- La salida visual del análisis por aspecto ya no muestra JSON crudo.
