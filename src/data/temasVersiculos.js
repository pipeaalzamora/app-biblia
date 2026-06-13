// Catálogo de temas/emociones con referencias bíblicas curadas (RV1960).
// Reemplaza la detección con IA: las sugerencias se arman consultando la API
// bíblica por cada referencia del tema seleccionado.

export const CATALOGO_TEMAS = [
  {
    id: 'ansiedad',
    nombre: 'Ansiedad',
    icono: 'pulse-outline',
    palabrasClave: ['ansiedad', 'ansioso', 'preocupado', 'estres', 'estrés', 'nervios', 'afan', 'afán'],
    mensaje:
      'Cuando la preocupación pesa, Dios te invita a entregarle tus cargas. Él cuida de ti y su paz guarda tu corazón.',
    referencias: [
      { libro: 'filipenses', capitulo: 4, versiculo: '6-7' },
      { libro: '1-pedro', capitulo: 5, versiculo: 7 },
      { libro: 'mateo', capitulo: 6, versiculo: '25-27' },
      { libro: 'salmos', capitulo: 55, versiculo: 22 },
    ],
  },
  {
    id: 'tristeza',
    nombre: 'Tristeza',
    icono: 'rainy-outline',
    palabrasClave: ['tristeza', 'triste', 'llanto', 'dolor', 'depresion', 'depresión', 'lloro'],
    mensaje:
      'Dios está cerca de los que sufren. Él sana el corazón herido y promete consuelo en medio del llanto.',
    referencias: [
      { libro: 'salmos', capitulo: 34, versiculo: 18 },
      { libro: 'salmos', capitulo: 147, versiculo: 3 },
      { libro: 'mateo', capitulo: 5, versiculo: 4 },
      { libro: 'apocalipsis', capitulo: 21, versiculo: 4 },
    ],
  },
  {
    id: 'miedo',
    nombre: 'Miedo',
    icono: 'shield-outline',
    palabrasClave: ['miedo', 'temor', 'asustado', 'pavor', 'panico', 'pánico'],
    mensaje:
      'No estás solo frente a lo que temes. Dios va contigo, te sostiene y te da fuerzas para seguir adelante.',
    referencias: [
      { libro: 'isaias', capitulo: 41, versiculo: 10 },
      { libro: '2-timoteo', capitulo: 1, versiculo: 7 },
      { libro: 'salmos', capitulo: 27, versiculo: 1 },
      { libro: 'josue', capitulo: 1, versiculo: 9 },
    ],
  },
  {
    id: 'soledad',
    nombre: 'Soledad',
    icono: 'person-outline',
    palabrasClave: ['soledad', 'solo', 'sola', 'abandonado', 'aislado'],
    mensaje:
      'Aunque te sientas solo, Dios nunca te deja ni te desampara. Él camina a tu lado en todo momento.',
    referencias: [
      { libro: 'deuteronomio', capitulo: 31, versiculo: 6 },
      { libro: 'salmos', capitulo: 23, versiculo: 4 },
      { libro: 'hebreos', capitulo: 13, versiculo: 5 },
      { libro: 'isaias', capitulo: 43, versiculo: 2 },
    ],
  },
  {
    id: 'esperanza',
    nombre: 'Esperanza',
    icono: 'sunny-outline',
    palabrasClave: ['esperanza', 'futuro', 'animo', 'ánimo', 'desanimo', 'desánimo'],
    mensaje:
      'Dios tiene planes de bien para tu vida. Confía en que lo mejor todavía está por venir.',
    referencias: [
      { libro: 'jeremias', capitulo: 29, versiculo: 11 },
      { libro: 'romanos', capitulo: 15, versiculo: 13 },
      { libro: 'lamentaciones', capitulo: 3, versiculo: '22-23' },
      { libro: 'salmos', capitulo: 42, versiculo: 11 },
    ],
  },
  {
    id: 'fe',
    nombre: 'Fe',
    icono: 'flame-outline',
    palabrasClave: ['fe', 'creer', 'confianza', 'duda'],
    mensaje:
      'La fe es confiar en Dios aun cuando no vemos el camino completo. Él enderezará tus veredas.',
    referencias: [
      { libro: 'hebreos', capitulo: 11, versiculo: 1 },
      { libro: 'proverbios', capitulo: 3, versiculo: '5-6' },
      { libro: 'marcos', capitulo: 11, versiculo: 24 },
      { libro: 'romanos', capitulo: 10, versiculo: 17 },
    ],
  },
  {
    id: 'paz',
    nombre: 'Paz',
    icono: 'leaf-outline',
    palabrasClave: ['paz', 'tranquilidad', 'calma', 'descanso'],
    mensaje:
      'La paz de Dios sobrepasa todo entendimiento. Recíbela hoy en medio de cualquier circunstancia.',
    referencias: [
      { libro: 'juan', capitulo: 14, versiculo: 27 },
      { libro: 'filipenses', capitulo: 4, versiculo: 7 },
      { libro: 'isaias', capitulo: 26, versiculo: 3 },
      { libro: 'mateo', capitulo: 11, versiculo: 28 },
    ],
  },
  {
    id: 'fortaleza',
    nombre: 'Fortaleza',
    icono: 'barbell-outline',
    palabrasClave: ['fortaleza', 'fuerza', 'debil', 'débil', 'cansado', 'agotado'],
    mensaje:
      'Cuando tus fuerzas se acaban, las de Dios comienzan. Él te sostiene y renueva tu interior.',
    referencias: [
      { libro: 'filipenses', capitulo: 4, versiculo: 13 },
      { libro: 'isaias', capitulo: 40, versiculo: 31 },
      { libro: 'salmos', capitulo: 46, versiculo: 1 },
      { libro: '2-corintios', capitulo: 12, versiculo: 9 },
    ],
  },
  {
    id: 'amor',
    nombre: 'Amor',
    icono: 'heart-outline',
    palabrasClave: ['amor', 'amar', 'pareja', 'familia'],
    mensaje:
      'El amor de Dios por ti es eterno e incondicional. Nada podrá separarte de Él.',
    referencias: [
      { libro: '1-corintios', capitulo: 13, versiculo: '4-7' },
      { libro: 'juan', capitulo: 3, versiculo: 16 },
      { libro: '1-juan', capitulo: 4, versiculo: '7-8' },
      { libro: 'romanos', capitulo: 8, versiculo: '38-39' },
    ],
  },
  {
    id: 'perdon',
    nombre: 'Perdón',
    icono: 'hand-left-outline',
    palabrasClave: ['perdon', 'perdón', 'culpa', 'arrepentimiento', 'rencor'],
    mensaje:
      'Dios es fiel para perdonar. Suelta el peso de la culpa y perdona como fuiste perdonado.',
    referencias: [
      { libro: '1-juan', capitulo: 1, versiculo: 9 },
      { libro: 'efesios', capitulo: 4, versiculo: 32 },
      { libro: 'colosenses', capitulo: 3, versiculo: 13 },
      { libro: 'mateo', capitulo: 6, versiculo: '14-15' },
    ],
  },
  {
    id: 'gratitud',
    nombre: 'Gratitud',
    icono: 'gift-outline',
    palabrasClave: ['gratitud', 'gracias', 'agradecido', 'bendicion', 'bendición'],
    mensaje:
      'Dar gracias transforma el corazón. Reconoce hoy las bendiciones que Dios pone en tu vida.',
    referencias: [
      { libro: '1-tesalonicenses', capitulo: 5, versiculo: 18 },
      { libro: 'salmos', capitulo: 100, versiculo: '4-5' },
      { libro: 'colosenses', capitulo: 3, versiculo: 17 },
      { libro: 'salmos', capitulo: 107, versiculo: 1 },
    ],
  },
  {
    id: 'sabiduria',
    nombre: 'Sabiduría',
    icono: 'bulb-outline',
    palabrasClave: ['sabiduria', 'sabiduría', 'decision', 'decisión', 'guianza', 'guía', 'direccion', 'dirección'],
    mensaje:
      'Cuando necesites dirección, pídela a Dios. Él da sabiduría con generosidad a quien la busca.',
    referencias: [
      { libro: 'santiago', capitulo: 1, versiculo: 5 },
      { libro: 'proverbios', capitulo: 2, versiculo: '6-7' },
      { libro: 'proverbios', capitulo: 9, versiculo: 10 },
      { libro: 'salmos', capitulo: 32, versiculo: 8 },
    ],
  },
];

export const obtenerTemaPorId = (id) =>
  CATALOGO_TEMAS.find((tema) => tema.id === id) || null;

// Busca el tema que mejor coincide con un texto libre escrito por el usuario.
export const detectarTema = (texto) => {
  if (!texto || typeof texto !== 'string') return null;

  const normalizado = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const tema of CATALOGO_TEMAS) {
    const coincide = tema.palabrasClave.some((palabra) => {
      const clave = palabra
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizado.includes(clave);
    });
    if (coincide) return tema;
  }

  return null;
};
