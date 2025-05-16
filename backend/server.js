const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());
// Middleware para parsear application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

app.post('/api/generate-prompt', (req, res) => {
 const {
    tema,
    formato,
    cantidad,
    audiencia,
    audienciaOtro,
    objetivo,
    objetivoOtro,
    tono,
    emocion,
    emocionOtro,
    respuestaEmocional,
    respuestaEmocionalOtro,
    elementos: elementosSeleccionados = [],
    otro_elemento: otroElementoCheck,
    otro_elemento_especificar: otroElementoEspecificado = '',
    resultado_esperado: resultadoEsperadoSelect,
    resultado_esperado_otro: resultadoEsperadoOtro = '',
    plataforma,
    plataformaOtro,
    contextoDigital = '',
    metrica_exito: metricaExitoInput = '',
    caracteristica_clave: caracteristicaClaveSelect,
    caracteristica_clave_otro: caracteristicaClaveOtro = '',
    otra_caracteristica_clave: otraCaracteristicaClaveSelect,
    otra_caracteristica_clave_otro: otraCaracteristicaClaveOtro = '',
    tipo_participacion: tipoParticipacionSelect,
    tipo_participacion_otro: tipoParticipacionOtro = ''
  } = req.body;

  const elementos = [...elementosSeleccionados, otroElementoCheck ? otroElementoEspecificado : ''].filter(Boolean);

  const audienciaFinal = audiencia === 'otro' ? audienciaOtro : audiencia;
  const objetivoFinal = objetivo === 'otro' ? objetivoOtro : objetivo;
  const emocionFinal = emocion === 'otro' ? emocionOtro : emocion;
  const respuestaEmocionalFinal = respuestaEmocional === 'otro' ? respuestaEmocionalOtro : respuestaEmocional;
  const resultadoEsperadoFinal = resultadoEsperadoSelect === 'otro' ? resultadoEsperadoOtro : resultadoEsperadoSelect;
  const plataformaFinal = plataforma === 'otro' ? plataformaOtro : plataforma;
  const caracteristicaClaveFinal = caracteristicaClaveSelect === 'otro' ? caracteristicaClaveOtro : caracteristicaClaveSelect;
  const otraCaracteristicaClaveFinal = otraCaracteristicaClaveSelect === 'otro' ? otraCaracteristicaClaveOtro : otraCaracteristicaClaveSelect || '';
  const tipoParticipacionFinal = tipoParticipacionSelect === 'otro' ? tipoParticipacionOtro : tipoParticipacionSelect;

  const prompt = `Genera ${cantidad} ideas de contenido <span class="math-inline">\{formato\} originales y altamente compartibles sobre el tema de '</span>{tema}' para una audiencia de '${audienciaFinal}'. El objetivo principal de este contenido es ${objetivoFinal}, buscando maximizar su alcance y viralidad. El tono general de este contenido debe ser ${tono}, evocando ${emocionFinal} y generando una fuerte ${respuestaEmocionalFinal}. Asegúrate de que las ideas incorporen los siguientes elementos: ${elementos.length > 0 ? elementos.join(', ') : 'ninguno especificado'}, con un enfoque en aquellos que incentiven la interacción y el compartimiento. El resultado específico esperado de estas ideas es ${resultadoEsperadoFinal}, idealmente alcanzando una ${metricaExitoInput ? metricaExitoInput : '[métrica de éxito de viralización]'}. Considera las tendencias actuales en ${plataformaFinal}, el comportamiento de esta audiencia en ${contextoDigital ? contextoDigital : 'ninguno específico'} y elementos conocidos por su potencial viral. El contenido debe ser ${caracteristicaClaveFinal} y ${otraCaracteristicaClaveFinal ? otraCaracteristicaClaveFinal : '[otra característica clave del contenido]'}, con un diseño o estructura que facilite su consumo y replicación. Además, explora ideas que puedan generar ${tipoParticipacionFinal}.`;

  res.json({ prompt });
});
// Ruta de prueba
app.get('/api/hello', (req, res) => {
  res.send({ message: '¡Hola desde el backend!' });
});



// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});