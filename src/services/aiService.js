import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';
import { getVersesByReference } from './bibleApiService';

// La IA es opcional: solo se activa si hay una URL configurada.
export const iaDisponible = () => Boolean(CONFIGURACION.URL_IA);

/**
 * Sugerencia semántica de versículos vía endpoint de IA (opcional).
 * Envía el texto del usuario y espera:
 *   { mensaje: string, versiculos: [{ libro, capitulo, versiculo }] }
 * Luego resuelve cada referencia contra la API bíblica para traer el texto.
 *
 * Devuelve { success, versiculos, mensaje } o { success:false } si falla / no
 * está configurada, para que el llamador caiga al flujo local sin romperse.
 */
export const sugerirVersiculosIA = async (texto) => {
  if (!iaDisponible()) {
    return { success: false, versiculos: [], mensaje: '' };
  }

  try {
    const { data } = await axios.post(
      CONFIGURACION.URL_IA,
      { userInput: texto },
      { timeout: 20000, headers: { 'Content-Type': 'application/json' } }
    );

    const referencias = Array.isArray(data?.versiculos) ? data.versiculos : [];
    if (referencias.length === 0) {
      return { success: false, versiculos: [], mensaje: '' };
    }

    // Si el endpoint ya devuelve texto completo, lo usamos directo.
    const yaTienenTexto = referencias.every((r) => r.texto && r.referencia);
    if (yaTienenTexto) {
      return {
        success: true,
        versiculos: referencias.map((r) => ({
          referencia: r.referencia,
          texto: r.texto,
        })),
        mensaje: data.mensaje || '',
      };
    }

    // Si solo trae referencias, resolvemos cada una contra la API bíblica.
    const resultados = await Promise.all(
      referencias.map((ref) => getVersesByReference(ref))
    );

    const versiculos = resultados
      .filter((r) => r.success && r.versiculos.length > 0)
      .flatMap((r) => r.versiculos);

    if (versiculos.length === 0) {
      return { success: false, versiculos: [], mensaje: '' };
    }

    return { success: true, versiculos, mensaje: data.mensaje || '' };
  } catch (error) {
    return { success: false, versiculos: [], mensaje: '' };
  }
};
