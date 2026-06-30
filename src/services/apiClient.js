import axios from 'axios';
import { CONFIGURACION } from '../config/constantes';

// Instancia única hacia la API bíblica pública.
const instancia = axios.create({
  baseURL: CONFIGURACION.URL_BIBLE_API,
  timeout: CONFIGURACION.TIMEOUT_BIBLE_API,
  headers: { Accept: 'application/json' },
});

// Solo reintentamos ante fallos transitorios: timeouts, errores de red o 5xx.
// Un 404 (no encontrado) o 4xx no se reintenta porque no va a cambiar.
const esReintentable = (error) => {
  if (!error) return false;
  if (error.code === 'ECONNABORTED') return true; // timeout
  if (!error.response) return true; // sin respuesta = problema de red
  const status = error.response.status;
  return status >= 500 && status < 600;
};

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET con reintentos y backoff exponencial.
 * Mantiene la firma de axios: si no se pasa config, llama get(url) con un solo
 * argumento (importante para no romper expectativas de los tests).
 */
export const apiGet = async (url, config, { reintentos = 2, baseDelay = 400 } = {}) => {
  let ultimoError;

  for (let intento = 0; intento <= reintentos; intento++) {
    try {
      return config !== undefined
        ? await instancia.get(url, config)
        : await instancia.get(url);
    } catch (error) {
      ultimoError = error;
      if (!esReintentable(error) || intento === reintentos) {
        throw error;
      }
      await esperar(2 ** intento * baseDelay);
    }
  }

  throw ultimoError;
};

export default instancia;
