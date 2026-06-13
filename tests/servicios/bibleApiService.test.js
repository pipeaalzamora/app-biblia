import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de la instancia axios.create usada por el servicio.
const mockGet = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({ get: (...args) => mockGet(...args) })),
  },
}));

import {
  buildReference,
  formatBibleApiVerse,
  getVersesByReference,
  getChapter,
  searchVerses,
  normalizeBookName,
} from '../../src/services/bibleApiService';

describe('Servicio de API de la Biblia (RV1960)', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('normaliza nombres de libros', () => {
    expect(normalizeBookName('Juan')).toBe('juan');
    expect(normalizeBookName('1 Corintios')).toBe('1-corintios');
    expect(normalizeBookName('Éxodo')).toBe('exodo');
  });

  it('valida referencias incompletas', () => {
    const resultado = buildReference({ libro: '', capitulo: '', versiculo: '' });
    expect(resultado.success).toBe(false);
    expect(resultado.error).toContain('libro');
  });

  it('construye referencias válidas', () => {
    const resultado = buildReference({ libro: 'Juan', capitulo: '3', versiculo: '16' });
    expect(resultado).toEqual({
      success: true,
      reference: { libro: 'juan', capitulo: 3, versiculo: '16' },
    });
  });

  it('formatea un versículo individual', () => {
    const resultado = formatBibleApiVerse(
      { number: 16, verse: 'Porque de tal manera amó Dios al mundo...' },
      'juan',
      3
    );
    expect(resultado).toEqual({
      referencia: 'Juan 3:16 RV1960',
      texto: 'Porque de tal manera amó Dios al mundo...',
    });
  });

  it('formatea rangos de versículos', () => {
    const resultado = formatBibleApiVerse(
      [
        { number: 6, verse: 'Primer versículo' },
        { number: 7, verse: 'Segundo versículo' },
      ],
      'filipenses',
      4
    );
    expect(resultado).toEqual({
      referencia: 'Filipenses 4:6-7 RV1960',
      texto: 'Primer versículo Segundo versículo',
    });
  });

  it('consulta una referencia desde la API', async () => {
    mockGet.mockResolvedValue({
      data: { number: 16, verse: 'Porque de tal manera amó Dios al mundo...' },
    });

    const resultado = await getVersesByReference({
      libro: 'Juan',
      capitulo: '3',
      versiculo: '16',
    });

    expect(resultado.success).toBe(true);
    expect(resultado.source).toBe('bible-api');
    expect(resultado.versiculos[0]).toEqual({
      referencia: 'Juan 3:16 RV1960',
      texto: 'Porque de tal manera amó Dios al mundo...',
    });
    expect(mockGet).toHaveBeenCalledWith('/read/rv1960/juan/3/16');
  });

  it('normaliza referencia no encontrada', async () => {
    mockGet.mockRejectedValue({ response: { status: 404 } });

    const resultado = await getVersesByReference({
      libro: 'Juan',
      capitulo: '999',
      versiculo: '1',
    });

    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('No se encontró esa referencia bíblica.');
    expect(resultado.versiculos).toEqual([]);
  });

  it('lee un capítulo completo', async () => {
    mockGet.mockResolvedValue({
      data: {
        num_chapters: 21,
        vers: [
          { number: 1, verse: 'Versículo uno', study: 'Título' },
          { number: 2, verse: 'Versículo dos' },
        ],
      },
    });

    const resultado = await getChapter('juan', 3);

    expect(resultado.success).toBe(true);
    expect(resultado.libro).toBe('Juan');
    expect(resultado.totalCapitulos).toBe(21);
    expect(resultado.versiculos).toHaveLength(2);
    expect(resultado.versiculos[0]).toEqual({
      numero: 1,
      texto: 'Versículo uno',
      titulo: 'Título',
      referencia: 'Juan 3:1 RV1960',
    });
  });

  it('realiza búsqueda de texto', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [{ verse: 'texto', book: 'Genesis', chapter: 10, number: 16 }],
        meta: { total: 401 },
      },
    });

    const resultado = await searchVerses('amor');

    expect(resultado.success).toBe(true);
    expect(resultado.versiculos[0].referencia).toBe('Génesis 10:16 RV1960');
    expect(resultado.meta.total).toBe(401);
    expect(mockGet).toHaveBeenCalledWith(
      '/read/rv1960/search',
      expect.objectContaining({ params: { q: 'amor', take: 20, page: 1 } })
    );
  });

  it('rechaza búsqueda vacía', async () => {
    const resultado = await searchVerses('');
    expect(resultado.success).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
