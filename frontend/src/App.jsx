import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
  Checkbox,
  IconButton,
  useClipboard,
  Tooltip,
  Stack,
  Spinner, // Importa el Spinner
  useMediaQuery,
  Divider,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import './App.css';

function App() {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar la carga
  const [showPrompt, setShowPrompt] = useState(false); // Nuevo estado para controlar la visibilidad
  const [formData, setFormData] = useState({ // Estado para almacenar los datos del formulario
    tema: '',
    formato: '',
    cantidad: '',
    audiencia: '',
    audiencia_otro: '',
    objetivo: '',
    objetivo_otro: '',
    tono: '',
    emocion: '',
    emocion_otro: '',
    respuesta_emocional: '',
    respuesta_emocional_otro: '',
    elementos: [],
    otro_elemento: false,
    otro_elemento_especificar: '',
    resultado_esperado: '',
    resultado_esperado_otro: '',
    plataforma: '',
    plataforma_otro: '',
    contexto_digital: '',
    metrica_exito: '',
    caracteristica_clave: '',
    caracteristica_clave_otro: '',
    otra_caracteristica_clave: '',
    otra_caracteristica_clave_otro: '',
    tipo_participacion: '',
    tipo_participacion_otro: '',
  });
  const { hasCopied, onCopy } = useClipboard(generatedPrompt); // Hook para la funcionalidad de copiar
 // Opcional: Hook para detectar si la pantalla es pequeña (móvil)
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === 'elementos') {
      setFormData(prevFormData => ({
        ...prevFormData,
        elementos: checked
          ? [...prevFormData.elementos, value]
          : prevFormData.elementos.filter(item => item !== value),
      }));
    } else if (name.startsWith('otro_elemento')) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else {
      handleChange(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Activa el spinner al enviar la petición
    setShowPrompt(false); // Asegurarse de que el prompt esté oculto al enviar de nuevo

    const tema = event.target.tema?.value || '';
    const formato = event.target.formato?.value || '';
    const cantidad = event.target.cantidad?.value || '';
    const audiencia = event.target.audiencia?.value || '';
    const audienciaOtro = event.target.audiencia_otro?.value || '';
    const objetivo = event.target.objetivo?.value || '';
    const objetivoOtro = event.target.objetivo_otro?.value || '';
    const tono = event.target.tono?.value || '';
    const emocion = event.target.emocion?.value || '';
    const emocionOtro = event.target.emocion_otro?.value || '';
    const respuestaEmocional = event.target.respuesta_emocional?.value || '';
    const respuestaEmocionalOtro = event.target.respuesta_emocional_otro?.value || '';
    const elementosSeleccionados = Array.from(event.target.elements)
      .filter(input => input.name === 'elementos' && input.checked)
      .map(input => input.value);
    const otroElementoEspecificado = event.target.otro_elemento?.checked ? (event.target.otro_elemento_especificar?.value || '') : '';
    const elementos = [...elementosSeleccionados, otroElementoEspecificado].filter(Boolean);
    const resultadoEsperado = event.target.resultado_esperado?.value || '';
    const resultadoEsperadoOtro = event.target.resultado_esperado_otro?.value || '';
    const plataforma = event.target.plataforma?.value || '';
    const plataformaOtro = event.target.plataforma_otro?.value || '';
    const contextoDigital = event.target.contexto_digital?.value || '';
    const metricaExito = event.target.metrica_exito?.value || '';
    const caracteristicaClave = event.target.caracteristica_clave?.value || '';
    const caracteristicaClaveOtro = event.target.caracteristica_clave_otro?.value || '';
    const otraCaracteristicaClave = event.target.otra_caracteristica_clave?.value || '';
    const otraCaracteristicaClaveOtro = event.target.otra_caracteristica_clave_otro?.value || '';
    const tipoParticipacion = event.target.tipo_participacion?.value || '';
    const tipoParticipacionOtro = event.target.tipo_participacion_otro?.value || '';

    const formData = {
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
      elementos,
      otroElementoEspecificado,
      resultadoEsperado,
      resultadoEsperadoOtro,
      plataforma,
      plataformaOtro,
      contextoDigital,
      metricaExito,
      caracteristicaClave,
      caracteristicaClaveOtro,
      otraCaracteristicaClave,
      otraCaracteristicaClaveOtro,
      tipoParticipacion,
      tipoParticipacionOtro,
    };

    try {
      const response = await fetch('http://localhost:5000/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del backend:', errorData);
        setGeneratedPrompt(`Error al generar el prompt: ${response.statusText}`);
        setIsLoading(false); // Desactiva el spinner en caso de error
        setShowPrompt(true); // Mostrar el mensaje de error en la vista del prompt
        return;
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
      console.log('Prompt recibido del backend:', data.prompt);
      setIsLoading(false); // Desactiva el spinner al recibir la respuesta
      setShowPrompt(true); // Mostrar el prompt generado
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setGeneratedPrompt('Error al conectar con el servidor.');
      setIsLoading(false); // Desactiva el spinner en caso de error
      setShowPrompt(true); // Mostrar el mensaje de error en la vista del prompt
    }
  };

  const handleGoBack = () => {
    setShowPrompt(false); // Volver a mostrar el formulario
  };

  return (
    <Box className="App" maxWidth="800px" mx="auto" py={8} px={4}>
      <Heading as="h1" mb={6} textAlign="center">Generador de Ideas Virales</Heading>
      {!showPrompt ? (
        <form onSubmit={handleSubmit}>
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Información Básica del Contenido</Heading>
            <FormControl mb={4}>
              <FormLabel htmlFor="tema" mb={1}>Tema:</FormLabel>
              <Input type="text" id="tema" name="tema" value={formData.tema} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="formato" mb={1}>Formato:</FormLabel>
              <Select id="formato" name="formato" value={formData.formato} onChange={handleChange}>
                <option value="">Seleccionar formato</option>
                <option value="video_corto">Video corto (Reel, TikTok, Short de YouTube)</option>
                <option value="publicacion_blog">Publicación de blog</option>
                <option value="infografia">Infografía</option>
                <option value="podcast_episodio">Podcast (episodio)</option>
                <option value="podcast_serie">Podcast (idea para serie)</option>
                <option value="historia_instagram">Historia de Instagram (serie de historias)</option>
                <option value="carrusel_instagram">Carrusel de Instagram</option>
                <option value="tweet">Tweet (o hilo de Twitter/X)</option>
                <option value="post_facebook">Post de Facebook</option>
                <option value="guia_descargable">Guía descargable (PDF)</option>
                <option value="plantilla">Plantilla (ej., para redes sociales, presupuesto)</option>
                <option value="quiz_interactivo">Quiz interactivo</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="cantidad" mb={1}>Cantidad de Ideas:</FormLabel>
              <Select id="cantidad" name="cantidad" value={formData.cantidad} onChange={handleChange}>
                <option value="">Seleccionar cantidad</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="10">10</option>
              </Select>
            </FormControl>
          </section>
          <Divider my={8} />
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Audiencia y Objetivo</Heading>
            <FormControl mb={4}>
              <FormLabel htmlFor="audiencia" mb={1}>Audiencia Objetivo:</FormLabel>
              <Select id="audiencia" name="audiencia" value={formData.audiencia} onChange={handleChange}>
                <option value="">Seleccionar audiencia</option>
                <option value="jovenes_18_25">Jóvenes entre 18 y 25 años interesados en [interés específico]</option>
                <option value="profesionales_marketing">Profesionales del marketing digital con experiencia en [área específica]</option>
                <option value="padres_primerizos">Padres primerizos con hijos menores de 3 años</option>
                <option value="amantes_viajes">Amantes de los viajes de aventura y la naturaleza</option>
                <option value="mayores_60">Personas mayores de 60 años interesados en [interés específico]</option>
                <option value="emprendedores">Emprendedores que están iniciando sus negocios</option>
                <option value="estudiantes_universitarios">Estudiantes universitarios de [carrera específica]</option>
                <option value="residentes_local">Residentes de [ubicación geográfica específica] interesados en [tema local]</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="audiencia_otro" name="audiencia_otro" placeholder="Especificar otra audiencia" value={formData.audiencia_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="objetivo" mb={1}>Objetivo Principal:</FormLabel>
              <Select id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange}>
                <option value="">Seleccionar objetivo</option>
                <option value="aumentar_conocimiento">Aumentar el conocimiento de la marca</option>
                <option value="generar_leads">Generar leads/captar potenciales clientes</option>
                <option value="fomentar_interaccion">Fomentar la interacción y el engagement</option>
                <option value="construir_comunidad">Construir una comunidad en línea</option>
                <option value="educar_audiencia">Educar a la audiencia sobre [tema específico]</option>
                <option value="inspirar_audiencia">Inspirar y motivar a la audiencia</option>
                <option value="entretener_audiencia">Entretener a la audiencia</option>
                <option value="impulsar_trafico">Impulsar el tráfico al sitio web</option>
                <option value="promocionar_producto">Promocionar un producto o servicio específico</option>
                <option value="maximizar_alcance">Maximizar el alcance y la viralidad del contenido</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="objetivo_otro" name="objetivo_otro" placeholder="Especificar otro objetivo" value={formData.objetivo_otro} onChange={handleChange} />
            </FormControl>
          </section>
          <Divider my={8} />
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Tono y Emoción</Heading>
            <FormControl mb={4}>
              <FormLabel htmlFor="tono" mb={1}>Tono General:</FormLabel>
              <Select id="tono" name="tono" value={formData.tono} onChange={handleChange}>
                <option value="">Seleccionar tono</option>
                <option value="divertido">Divertido/Humorístico</option>
                <option value="informativo">Informativo/Educativo</option>
                <option value="inspirador">Inspirador/Motivacional</option>
                <option value="empatico">Empático/Cercano</option>
                <option value="autoritario">Autoritario/Experto</option>
                <option value="nostalgico">Nostálgico</option>
                <option value="critico">Crítico/Reflexivo</option>
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="emocion" mb={1}>Emoción a Evocar:</FormLabel>
              <Select id="emocion" name="emocion" value={formData.emocion} onChange={handleChange}>
                <option value="">Seleccionar emoción</option>
                <option value="curiosidad">Curiosidad</option>
                <option value="entusiasmo">Entusiasmo</option>
                <option value="confianza">Confianza</option>
                <option value="alegria">Alegría</option>
                <option value="asombro">Asombro</option>
                <option value="urgencia">Urgencia</option>
                <option value="seguridad">Seguridad</option>
                <option value="novedad">Novedad</option>
                <option value="sorpresa">Sorpresa</option>
                <option value="intriga">Intriga</option>
                <option value="alegria_intensa">Alegría intensa</option>
                <option value="identificacion_profunda">Identificación profunda</option>
                <option value="empatia_fuerte">Empatía fuerte</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="emocion_otro" name="emocion_otro" placeholder="Especificar otra emoción" value={formData.emocion_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="respuesta_emocional" mb={1}>Respuesta Emocional Deseada:</FormLabel>
              <Select id="respuesta_emocional" name="respuesta_emocional" value={formData.respuesta_emocional} onChange={handleChange}>
                <option value="">Seleccionar respuesta</option>
                <option value="generar_comentarios">Generar comentarios y debate</option>
                <option value="aumentar_visualizaciones">Aumentar las visualizaciones del video/historia</option>
                <option value="obtener_likes_shares">Obtener "me gusta" y compartidos</option>
                <option value="aumentar_suscripciones">Aumentar las suscripciones al newsletter</option>
                <option value="impulsar_trafico_web">Impulsar el tráfico a una página específica</option>
                <option value="generar_preguntas">Generar preguntas directas/mensajes</option>
                <option value="aumentar_menciones">Aumentar las menciones de la marca</option>
                <option value="descargas_recurso">Descargas de un recurso gratuito</option>
                <option value="alcanzar_metrica">Alcanzar una [métrica de éxito de viralización]</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="respuesta_emocional_otro" name="respuesta_emocional_otro" placeholder="Especificar otra respuesta" value={formData.respuesta_emocional_otro} onChange={handleChange} />
            </FormControl>
          </section>
          <Divider my={8} />
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Elementos para la Viralización</Heading>
            <FormControl mb={4}>
              <FormLabel mb={1}>Elementos a Incluir:</FormLabel>
              <Stack spacing={2}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="ejemplos_practicos" name="elementos" value="ejemplos_practicos" isChecked={formData.elementos.includes('ejemplos_practicos')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="ejemplos_practicos" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Ejemplos prácticos</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="datos_estadisticos" name="elementos" value="datos_estadisticos" isChecked={formData.elementos.includes('datos_estadisticos')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="datos_estadisticos" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Datos estadísticos relevantes</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="historias_personales" name="elementos" value="historias_personales" isChecked={formData.elementos.includes('historias_personales')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="historias_personales" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Historias personales/casos de éxito</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="preguntas_debate" name="elementos" value="preguntas_debate" isChecked={formData.elementos.includes('preguntas_debate')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="preguntas_debate" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Preguntas para generar debate</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="consejos_accionables" name="elementos" value="consejos_accionables" isChecked={formData.elementos.includes('consejos_accionables')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="consejos_accionables" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Consejos accionables</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="humor_referencias" name="elementos" value="humor_referencias" isChecked={formData.elementos.includes('humor_referencias')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="humor_referencias" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Humor y referencias culturales</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="imagenes_videos" name="elementos" value="imagenes_videos" isChecked={formData.elementos.includes('imagenes_videos')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="imagenes_videos" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Imágenes o videos atractivos</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="llamadas_accion" name="elementos" value="llamadas_accion" isChecked={formData.elementos.includes('llamadas_accion')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="llamadas_accion" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Llamadas a la acción claras</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="enlaces_externos" name="elementos" value="enlaces_externos" isChecked={formData.elementos.includes('enlaces_externos')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="enlaces_externos" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Enlaces a recursos externos</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="elementos_interactivos" name="elementos" value="elementos_interactivos" isChecked={formData.elementos.includes('elementos_interactivos')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="elementos_interactivos" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Elementos interactivos (encuestas, quizzes)</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="elementos_sorpresa" name="elementos" value="elementos_sorpresa" isChecked={formData.elementos.includes('elementos_sorpresa')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="elementos_sorpresa" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Elementos de sorpresa o inesperados</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="ganchos_impactantes" name="elementos" value="ganchos_impactantes" isChecked={formData.elementos.includes('ganchos_impactantes')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="ganchos_impactantes" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Ganchos visuales o narrativos impactantes desde el inicio</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="musica_tendencia" name="elementos" value="musica_tendencia" isChecked={formData.elementos.includes('musica_tendencia')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="musica_tendencia" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Música o sonido tendencia</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="llamadas_compartir" name="elementos" value="llamadas_compartir" isChecked={formData.elementos.includes('llamadas_compartir')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="llamadas_compartir" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Llamadas a la acción claras para compartir</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="formatos_compartibles" name="elementos" value="formatos_compartibles" isChecked={formData.elementos.includes('formatos_compartibles')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="formatos_compartibles" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Formatos o estructuras inherentemente compartibles (ej., listas, tutoriales rápidos, "antes y después")</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="oportunidades_derivado" name="elementos" value="oportunidades_derivado" isChecked={formData.elementos.includes('oportunidades_derivado')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="oportunidades_derivado" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Oportunidades para que los usuarios creen contenido derivado (ej., plantillas, desafíos)</FormLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox id="otro_elemento" name="elementos" value="otro_elemento" isChecked={formData.elementos.includes('otro_elemento')} onChange={handleCheckboxChange} />
                  <FormLabel htmlFor="otro_elemento" ml={2} display="inline" style={{ marginTop: '0' }} mb={1}>Otro (especificar)</FormLabel>
                  <Input type="text" id="otro_elemento_especificar" name="otro_elemento_especificar" placeholder="Especificar otro elemento" value={formData.otro_elemento_especificar} onChange={handleChange} ml={2} />
                </div>
              </Stack>
            </FormControl>
          </section>
          <Divider my={8} />
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Resultado Específico Esperado</Heading>
            <FormControl mb={4}>
              <FormLabel htmlFor="resultado_esperado" mb={1}>Resultado Específico Esperado:</FormLabel>
              <Select id="resultado_esperado" name="resultado_esperado" value={formData.resultado_esperado} onChange={handleChange}>
                <option value="">Seleccionar resultado</option>
                <option value="aumento_seguidores">Aumento significativo de seguidores en [plataforma]</option>
                <option value="mayor_interaccion">Mayor interacción (likes, comentarios, compartidos) en un [porcentaje] en [plataforma]</option>
                <option value="trafico_referencia">Aumento del tráfico de referencia desde [plataforma] al sitio web</option>
                <option value="viralizacion_plataforma">Viralización del contenido en [plataforma] alcanzando [número] de visualizaciones/impresiones</option>
                <option value="participacion_desafio">Participación masiva en un desafío o concurso específico</option>
                <option value="creacion_contenido_usuario">Generación de contenido creado por el usuario relacionado con la marca/tema</option>
                <option value="posicionamiento_tendencia">Posicionamiento del contenido como tendencia en [plataforma]</option>
                <option value="notoriedad_evento">Aumento de la notoriedad de un evento o lanzamiento específico</option>
                <option value="cambio_percepcion">Cambio en la percepción de la marca/tema en la audiencia</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="resultado_esperado_otro" name="resultado_esperado_otro" placeholder="Especificar otro resultado" value={formData.resultado_esperado_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="metrica_exito" mb={1}>Métrica de Éxito de Viralización (Opcional):</FormLabel>
              <Input type="text" id="metrica_exito" name="metrica_exito" placeholder="Ej: Número de compartidos, Tasa de interacción..." value={formData.metrica_exito} onChange={handleChange} />
            </FormControl>
          </section>
          <Divider my={8} />
          <section style={{ marginBottom: '3rem' }}>
            <Heading as="h2" size="lg" mb={4}>Contexto y Características</Heading>
            <FormControl mb={4}>
              <FormLabel htmlFor="plataforma" mb={1}>Plataforma/Medio Principal:</FormLabel>
              <Select id="plataforma" name="plataforma" value={formData.plataforma} onChange={handleChange}>
                <option value="">Seleccionar plataforma</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="pinterest">Pinterest</option>
                <option value="blog">Blog</option>
                <option value="podcast">Podcast</option>
                <option value="email_marketing">Email Marketing</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="plataforma_otro" name="plataforma_otro" placeholder="Especificar otra plataforma" value={formData.plataforma_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="contexto_digital" mb={1}>Contexto Digital a Considerar (Opcional):</FormLabel>
              <Input type="text" id="contexto_digital" name="contexto_digital" placeholder="Tendencias, conversaciones online relevantes..." value={formData.contexto_digital} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="caracteristica_clave" mb={1}>Característica Clave del Contenido:</FormLabel>
              <Select id="caracteristica_clave" name="caracteristica_clave" value={formData.caracteristica_clave} onChange={handleChange}>
                <option value="">Seleccionar característica</option>
                <option value="autenticidad">Autenticidad/Transparencia</option>
                <option value="relevancia">Relevancia para la audiencia</option>
                <option value="oportunidad">Oportunidad (timing)</option>
                <option value="unicidad">Unicidad/Originalidad</option>
                <option value="valor_util">Valor útil/práctico</option>
                <option value="conexion_emocional">Conexión emocional</option>
                <option value="factor_wow">Factor "Wow"/Sorpresa</option>
                <option value="simplicidad">Simplicidad/Facilidad de entender</option>
                <option value="interactividad">Interactividad</option>
                <option value="visualmente_atractivo">Visualmente atractivo</option>
                <option value="narrativa_poderosa">Narrativa poderosa (storytelling)</option>
                <option value="humor">Humor</option>
                <option value="polemica_controlada">Polémica controlada (con estrategia)</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="caracteristica_clave_otro" name="caracteristica_clave_otro" placeholder="Especificar otra característica" value={formData.caracteristica_clave_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="otra_caracteristica_clave" mb={1}>Otra Característica Clave del Contenido (Opcional):</FormLabel>
              <Select id="otra_caracteristica_clave" name="otra_caracteristica_clave" value={formData.otra_caracteristica_clave} onChange={handleChange}>
                <option value="">Seleccionar otra característica (opcional)</option>
                <option value="autenticidad">Autenticidad/Transparencia</option>
                <option value="relevancia">Relevancia para la audiencia</option>
                <option value="oportunidad">Oportunidad (timing)</option>
                <option value="unicidad">Unicidad/Originalidad</option>
                <option value="valor_util">Valor útil/práctico</option>
                <option value="conexion_emocional">Conexión emocional</option>
                <option value="factor_wow">Factor "Wow"/Sorpresa</option>
                <option value="simplicidad">Simplicidad/Facilidad de entender</option>
                <option value="interactividad">Interactividad</option>
                <option value="visualmente_atractivo">Visualmente atractivo</option>
                <option value="narrativa_poderosa">Narrativa poderosa (storytelling)</option>
                <option value="humor">Humor</option>
                <option value="polemica_controlada">Polémica controlada (con estrategia)</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="otra_caracteristica_clave_otro" name="otra_caracteristica_clave_otro" placeholder="Especificar otra característica" value={formData.otra_caracteristica_clave_otro} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="tipo_participacion" mb={1}>Tipo de Participación Viral (Opcional):</FormLabel>
              <Select id="tipo_participacion" name="tipo_participacion" value={formData.tipo_participacion} onChange={handleChange}>
                <option value="">Seleccionar tipo (opcional)</option>
                <option value="compartir_simple">Compartir simple (repost, retweet)</option>
                <option value="mencionar_amigos">Mencionar amigos</option>
                <option value="crear_respuesta">Crear contenido de respuesta (dúos, comentarios creativos)</option>
                <option value="participar_desafio">Participar en un desafío/trend</option>
                <option value="usar_hashtag">Usar un hashtag específico</option>
                <option value="guardar_coleccionar">Guardar/Coleccionar (ej., en Pinterest, Instagram)</option>
                <option value="otro">Otro (especificar)</option>
              </Select>
              <Input type="text" id="tipo_participacion_otro" name="tipo_participacion_otro" placeholder="Especificar otro tipo de participación" value={formData.tipo_participacion_otro} onChange={handleChange} />
            </FormControl>
          </section>


          <Button type="submit" colorScheme="blue" size="lg" width="full" mt={6} isLoading={isLoading} loadingText="Generando...">
            Generar Prompt
          </Button>

        </form>
      ) : (
        <Box
          mt={8}
          p={4}
          borderWidth="2px"
          borderColor="blue.200"
          borderRadius="md"
          boxShadow="md"
          bg="blue.50"
          position="relative"
        >
          {/* Presentación del prompt en un Box */}
          <Box position="absolute" top="0" right="0">
            <Tooltip label={hasCopied ? '¡Copiado!' : 'Copiar al portapapeles'}>
              <IconButton
                icon={<CopyIcon />}
                size="sm"
                colorScheme="blue"
                position="absolute"
                top="0.5rem"
                right="0.5rem"
                onClick={onCopy}
              />
            </Tooltip>
          </Box>
          <Heading as="h2" size="lg" mb={4}>
            Prompt Generado
          </Heading>
          <Textarea
            rows={isMobile ? 8 : 10} // Reduce las filas en móvil
            cols={isMobile ? 40 : 80} // Reduce las columnas en móvil
            value={generatedPrompt}
            readOnly
            resize="vertical"
          />
          <Button mt={2} colorScheme="gray" onClick={handleGoBack}>
            Volver para Editar
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default App;