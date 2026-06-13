import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';
import { obtenerLibroPorId } from '../data/librosBiblia';

const api = axios.create({
  baseURL: CONFIGURACION.URL_BIBLE_API,
  timeout: CONFIGURACION.TIMEOUT_BIBLE_API,
  headers: { Accept: 'application/json' },
});

const { VERSION_BIBLIA, NOMBRE_VERSION } = CONFIGURACION;

export const normalizeBookName = (book) => {
  if (!book || typeof book !== 'string') return '';

  return book
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
};

const nombreLibro = (slug) => {
  const libro = obtenerLibroPorId(slug);
  if (libro) return libro.nombre;
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const buildReference = ({ libro, capitulo, versiculo }) => {
  const normalizedBook = normalizeBookName(libro);
  const chapter = Number.parseInt(capitulo, 10);
  const verse = String(versiculo || '').trim();

  if (!normalizedBook || Number.isNaN(chapter) || chapter < 1 || !verse) {
    return { success: false, error: 'Ingresa libro, capítulo y versículo.' };
  }

  return {
    success: true,
    reference: { libro: normalizedBook, capitulo: chapter, versiculo: verse },
  };
};

// Da formato a la respuesta de /read/<v>/<libro>/<cap>/<vers>
export const formatBibleApiVerse = (apiResponse, libro, capitulo) => {
  const book = nombreLibro(libro);

  if (Array.isArray(apiResponse)) {
    const numbers = apiResponse.map((verse) => verse.number);
    const text = apiResponse.map((verse) => verse.verse).join(' ');
    const verseRange =
      numbers.length > 1
        ? `${numbers[0]}-${numbers[numbers.length - 1]}`
        : numbers[0];

    return {
      referencia: `${book} ${capitulo}:${verseRange} ${NOMBRE_VERSION}`,
      texto: text,
    };
  }

  return {
    referencia: `${book} ${capitulo}:${apiResponse.number} ${NOMBRE_VERSION}`,
    texto: apiResponse.verse,
  };
};

// Consulta una referencia puntual (un versículo o rango).
export const getVersesByReference = async ({ libro, capitulo, versiculo }) => {
  const built = buildReference({ libro, capitulo, versiculo });

  if (!built.success) {
    return { success: false, error: built.error, versiculos: [] };
  }

  const { reference } = built;

  try {
    const { data } = await api.get(
      `/read/${VERSION_BIBLIA}/${reference.libro}/${reference.capitulo}/${reference.versiculo}`
    );

    return {
      success: true,
      versiculos: [
        formatBibleApiVerse(data, reference.libro, reference.capitulo),
      ],
      source: 'bible-api',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.status === 404
          ? 'No se encontró esa referencia bíblica.'
          : 'No se pudo consultar la referencia. Revisa tu conexión.',
      versiculos: [],
    };
  }
};

// Lee un capítulo completo: devuelve metadatos + lista de versículos.
export const getChapter = async (libro, capitulo) => {
  const slug = normalizeBookName(libro);
  const chapter = Number.parseInt(capitulo, 10);

  if (!slug || Number.isNaN(chapter) || chapter < 1) {
    return { success: false, error: 'Capítulo inválido.', versiculos: [] };
  }

  try {
    const { data } = await api.get(`/read/${VERSION_BIBLIA}/${slug}/${chapter}`);
    const book = nombreLibro(slug);

    const versiculos = (data?.vers || []).map((item) => ({
      numero: item.number,
      texto: item.verse,
      titulo: item.study || null,
      referencia: `${book} ${chapter}:${item.number} ${NOMBRE_VERSION}`,
    }));

    return {
      success: true,
      libro: book,
      capitulo: chapter,
      totalCapitulos: data?.num_chapters || null,
      versiculos,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.status === 404
          ? 'No se encontró ese capítulo.'
          : 'No se pudo cargar el capítulo. Revisa tu conexión.',
      versiculos: [],
    };
  }
};

// Búsqueda de texto completo en la versión RV1960.
export const searchVerses = async (query, { take = 20, page = 1 } = {}) => {
  const term = String(query || '').trim();

  if (!term) {
    return { success: false, error: 'Escribe algo para buscar.', versiculos: [] };
  }

  try {
    const { data } = await api.get(`/read/${VERSION_BIBLIA}/search`, {
      params: { q: term, take, page },
    });

    const versiculos = (data?.data || []).map((item) => ({
      referencia: `${nombreLibro(normalizeBookName(item.book))} ${item.chapter}:${item.number} ${NOMBRE_VERSION}`,
      texto: item.verse,
      libro: normalizeBookName(item.book),
      capitulo: item.chapter,
      numero: item.number,
    }));

    return {
      success: true,
      versiculos,
      meta: data?.meta || null,
      source: 'bible-api',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.status === 404
          ? 'No se encontraron resultados.'
          : 'No se pudo realizar la búsqueda. Revisa tu conexión.',
      versiculos: [],
    };
  }
};

// "Consejo" temático: resuelve todas las referencias de un tema desde la API.
export const getVersesForTopic = async (tema) => {
  if (!tema?.referencias?.length) {
    return { success: false, error: 'Tema sin referencias.', versiculos: [] };
  }

  const resultados = await Promise.all(
    tema.referencias.map((ref) => getVersesByReference(ref))
  );

  const versiculos = resultados
    .filter((r) => r.success && r.versiculos.length > 0)
    .flatMap((r) => r.versiculos);

  if (versiculos.length === 0) {
    return {
      success: false,
      error: 'No se pudieron cargar los versículos. Revisa tu conexión.',
      versiculos: [],
    };
  }

  return { success: true, versiculos, mensaje: tema.mensaje };
};
