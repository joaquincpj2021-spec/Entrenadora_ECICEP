# Matriz técnica ECICEP APS Chile v4.4

Esta matriz es un documento interno integrado para orientar la app de entrenamiento ECICEP en APS Chile. No diagnostica, no confirma GES, no indica tratamientos y no reemplaza el juicio clínico ni el protocolo local.

## Eje principal

La app debe razonar siempre en este orden:

1. Persona y contexto.
2. Condición clínica o programa relacionado.
3. Barreras y facilitadores.
4. Prioridad compartida.
5. Opciones, riesgos y preferencias.
6. Acuerdo posible.
7. Registro trazable.
8. Continuidad.

## Alcance por rol

### Profesional clínico de box
Puede integrar evaluación clínica, deliberar opciones con la persona, construir o ajustar plan y definir seguimiento.

### TENS / seguimiento
Puede retomar acuerdos, detectar barreras o alertas, reforzar comprensión y coordinar continuidad. No toma decisiones clínicas fuera de alcance.

### Gestor/a ECICEP
Ordena complejidad, barreras persistentes, responsables, coordinación y reevaluación.

## Casos de entrenamiento

Todo caso generado debe incluir, cuando sea pertinente:

- datos clínicos/contextuales no identificatorios;
- programa APS o línea de cuidado relacionada;
- situación actual;
- barrera explícita;
- facilitador;
- ambivalencia o tensión;
- razón propia para el cambio;
- riesgo o alerta;
- pendiente preventivo/programático;
- información pendiente;
- posible acuerdo o condición para acordar;
- continuidad sugerida según rol.

## Situaciones clínicas integradas

### DM2 / HTA / PSCV
Activa lectura de PSCV, fármacos, alimentación, actividad física, tabaco/alcohol, automanejo, GES orientativo, CIE-10 E10-E14/I10-I15/E78 y patrones NANDA de autogestión.

### Respiratorio ERA
Activa lectura de ERA/EPOC/asma, inhaladores, tabaco, vacunas, señales de alarma, CIE-10 J40-J47 y patrones de manejo de salud/conocimientos.

### Salud mental
Activa lectura de ánimo, afrontamiento, red, consumo, continuidad, posible GES según criterios, CIE-10 F00-F99 y patrones de afrontamiento/autogestión.

### Adulto mayor / dependencia / cuidador
Activa lectura de EMPAM, funcionalidad, PDS, cuidador/a, sobrecarga, caídas, continuidad domiciliaria y patrones NANDA de caídas, movilidad y rol cuidador/a.

### Preventivos y acceso
Activa lectura de PAP, mamografía, EMPA/EMPAM, vacunas, SOME, agenda, acceso, barreras de continuidad y familias CIE-10 Z00-Z99.

## GES, COMGES/IAAPS, CIE-10 y NANDA

- **GES:** solo alerta orientativa. Verificar criterios, edad, diagnóstico, etapa, red y normativa vigente.
- **COMGES/IAAPS/REM:** contexto de continuidad y gestión; nunca motivo para imponer.
- **CIE-10:** familia orientativa; no diagnóstico automático.
- **NANDA:** patrón a valorar; no diagnóstico automático.

## Cierre de plan

La app debe preguntar: **¿Esto ya puede convertirse en plan de cuidado o todavía es anamnesis?**

Criterios mínimos:

- problema priorizado;
- objetivo claro;
- actividad concreta;
- responsable;
- seguimiento;
- barrera considerada;
- facilitador considerado;
- riesgo/alerta abordado si existe;
- registro útil;
- revisión de riesgo de imposición.


## Profesión y ámbito de práctica

La app permite seleccionar una profesión o rol de práctica y un ámbito de atención. Esto orienta el caso simulado, la lectura técnica y la retroalimentación. La selección no reemplaza el perfil principal, sino que permite practicar desde distintas disciplinas de APS:

- Enfermería
- Medicina
- Nutrición
- Psicología
- Trabajo social
- Kinesiología
- Matronería
- Odontología
- Química y farmacia / farmacia
- TENS / seguimiento
- Gestor/a ECICEP
- SOME / acceso

Ámbitos: box clínico, seguimiento a distancia, control programático, gestión de casos, domicilio, post alta, preventivos/acceso y comunitario.


## Cambio v4.4: configuración corregida

Se elimina el selector “Ámbito de práctica” porque duplicaba el sentido de “Momento ECICEP”. La práctica queda configurada por:

1. **Momento ECICEP:** ingreso integral, control integral, seguimiento a distancia o gestión de casos.
2. **Profesión/rol que practica:** ajusta alcance, lenguaje y foco de intervención.
3. **Foco clínico-programático:** orienta el contenido clínico/programático del caso.
4. **Dificultad:** regula complejidad.

### Foco PSCV / HTA / DM2 / RCV

Cuando se elige PSCV, la app debe entender que puede involucrar hipertensión, diabetes mellitus tipo 2, dislipidemia, riesgo cardiovascular, antecedentes cardiovasculares, tabaquismo, alimentación, actividad física, tratamiento farmacológico, adherencia a controles, farmacia, exámenes, automanejo, urgencias/descompensaciones, y prestaciones asociadas como pie diabético o salud oral en DM si corresponde.

La app debe usar esto como matriz formativa, no como diagnóstico automático ni indicación terapéutica.

## Cambio v4.4: práctica con IA simplificada

La práctica deja de mostrarse como una pantalla única saturada y pasa a organizarse como flujo:

1. Configurar caso.
2. Leer caso simulado.
3. Preguntar para comprender.
4. Ordenar información.
5. Revisar si alcanza para plan.
6. Retroalimentación final.

Se mantiene la potencia técnica de v4.3, pero se dosifica por pantalla para mejorar comprensión, uso en Android y aprendizaje andragógico.
