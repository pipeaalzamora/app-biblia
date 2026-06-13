import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('bibliahelp.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libro TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        versiculo TEXT NOT NULL,
        referencia TEXT UNIQUE NOT NULL,
        texto TEXT NOT NULL,
        tema TEXT,
        popularidad INTEGER DEFAULT 0
      );
      
      CREATE INDEX IF NOT EXISTS idx_libro ON verses(libro);
      CREATE INDEX IF NOT EXISTS idx_tema ON verses(tema);
      CREATE INDEX IF NOT EXISTS idx_popularidad ON verses(popularidad DESC);
      CREATE INDEX IF NOT EXISTS idx_referencia ON verses(referencia);
    `);

    return true;
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    return false;
  }
};

export const saveVerseOffline = async (verse, tema = null) => {
  if (!db) await initDatabase();

  try {
    // Extrae "cap:vers" buscando el patrón número:algo dentro de la referencia.
    // Soporta libros de varias palabras (ej: "1 Corintios 13:4-7 RV1960").
    const match = (verse.referencia || '').match(/(\d+):([\w-]+)/);
    if (!match) return false;

    const capitulo = parseInt(match[1], 10);
    const versiculo = match[2];
    // El libro es todo lo que está antes de "cap:vers".
    const libro = verse.referencia
      .slice(0, match.index)
      .trim()
      .toLowerCase();

    await db.runAsync(
      `INSERT OR REPLACE INTO verses (libro, capitulo, versiculo, referencia, texto, tema, popularidad)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT popularidad FROM verses WHERE referencia = ?), 0) + 1)`,
      [libro, capitulo, versiculo, verse.referencia, verse.texto, tema, verse.referencia]
    );

    return true;
  } catch (error) {
    console.error('Error guardando versículo offline:', error);
    return false;
  }
};

export const searchOfflineVerses = async (searchTerm) => {
  if (!db) await initDatabase();
  
  try {
    const term = `%${searchTerm.toLowerCase()}%`;
    const results = await db.getAllAsync(
      `SELECT * FROM verses 
       WHERE LOWER(texto) LIKE ? OR LOWER(tema) LIKE ? OR LOWER(referencia) LIKE ?
       ORDER BY popularidad DESC
       LIMIT 10`,
      [term, term, term]
    );
    
    return results.map(row => ({
      referencia: row.referencia,
      texto: row.texto,
    }));
  } catch (error) {
    console.error('Error buscando versículos offline:', error);
    return [];
  }
};

export const getPopularVerses = async (limit = 20) => {
  if (!db) await initDatabase();
  
  try {
    const results = await db.getAllAsync(
      'SELECT * FROM verses ORDER BY popularidad DESC LIMIT ?',
      [limit]
    );
    
    return results.map(row => ({
      referencia: row.referencia,
      texto: row.texto,
    }));
  } catch (error) {
    console.error('Error obteniendo versículos populares:', error);
    return [];
  }
};

export const getVersesByBook = async (libro, capitulo = null) => {
  if (!db) await initDatabase();
  
  try {
    let query = 'SELECT * FROM verses WHERE LOWER(libro) = ?';
    const params = [libro.toLowerCase()];
    
    if (capitulo) {
      query += ' AND capitulo = ?';
      params.push(capitulo);
    }
    
    query += ' ORDER BY capitulo, CAST(versiculo AS INTEGER)';
    
    const results = await db.getAllAsync(query, params);
    
    return results.map(row => ({
      referencia: row.referencia,
      texto: row.texto,
    }));
  } catch (error) {
    console.error('Error obteniendo versículos por libro:', error);
    return [];
  }
};

export const seedPopularVerses = async () => {
  const popularVerses = [
    { libro: 'juan', capitulo: 3, versiculo: '16', referencia: 'Juan 3:16 RV1960', texto: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', tema: 'amor' },
    { libro: 'filipenses', capitulo: 4, versiculo: '13', referencia: 'Filipenses 4:13 RV1960', texto: 'Todo lo puedo en Cristo que me fortalece.', tema: 'fortaleza' },
    { libro: 'salmos', capitulo: 23, versiculo: '1', referencia: 'Salmos 23:1 RV1960', texto: 'Jehová es mi pastor; nada me faltará.', tema: 'paz' },
    { libro: 'jeremias', capitulo: 29, versiculo: '11', referencia: 'Jeremías 29:11 RV1960', texto: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', tema: 'esperanza' },
    { libro: 'proverbios', capitulo: 3, versiculo: '5-6', referencia: 'Proverbios 3:5-6 RV1960', texto: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.', tema: 'fe' },
    { libro: 'isaias', capitulo: 41, versiculo: '10', referencia: 'Isaías 41:10 RV1960', texto: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', tema: 'miedo' },
    { libro: 'romanos', capitulo: 8, versiculo: '28', referencia: 'Romanos 8:28 RV1960', texto: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', tema: 'esperanza' },
    { libro: 'mateo', capitulo: 11, versiculo: '28', referencia: 'Mateo 11:28 RV1960', texto: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', tema: 'paz' },
  ];

  for (const verse of popularVerses) {
    await saveVerseOffline(verse, verse.tema);
  }
};
