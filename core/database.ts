import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./storage_lms.db.sqlite");

db.exec(/*sql*/`
    PRAGMA foreign_keys = 1;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    PRAGMA cache_size = 2000;
    PRAGMA busy_timeout = 5000;
    PRAGMA temp_store = MEMORY;
    `);

db.exec(/*sql*/`
    CREATE TABLE IF NOT EXISTS "cursos" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
      "nome" TEXT NOT NULL,
      "descricao" TEXT NOT NULL
    ) STRICT;
`);

db.exec(/*sql*/`
    CREATE TABLE IF NOT EXISTS "aulas" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "curso_id" INTEGER NOT NULL,
      "slug" TEXT NOT NULL COLLATE NOCASE,
      "nome" TEXT NOT NULL,
      FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
      UNIQUE("curso_id", "slug")
    ) STRICT;`);

export const createCourse = (slug: string, nome: string, descricao: string) => {
  return db.prepare(/*sql*/`
    INSERT OR IGNORE INTO cursos
        (slug, nome, descricao)
    VALUES
        (?,?,?)
    `).run(slug, nome, descricao);
};

// atv 2.2
export const createAula = (curso_id: number, slug: string, nome: string) => {
  return db.prepare(/*sql*/`
    INSERT OR IGNORE INTO aulas
        (curso_id, slug, nome)
    VALUES
        (?,?,?)
    `).run(curso_id, slug, nome);
};


// atv 2.3
export const listCursos = () => {
  return db.prepare(/*sql*/`
    SELECT * FROM cursos
    `).all();
};

// atv 2.4
export const getCurseBySlug = (slug: string) => {
  return db.prepare(/*sql*/`
    SELECT * FROM cursos WHERE slug = ?
`).get(slug);
};

// atv 2.5
export const getAulaBySlug = (slug: string) => {
  return db.prepare(/*sql*/`
    SELECT * FROM aulas WHERE slug = ?
`).get(slug);
};


// atv 2.5 && 2 queries
export const getAulaAndCursoBySlug = (aulaSlug: string, cursoSlug: string) => {
  return db.prepare(/*sql*/`
    SELECT
        cursos.id AS curso_id,
        cursos.nome AS curso_nome,
        cursos.slug AS curso_slug,
        aulas.id AS aula_id,
        aulas.nome AS aula_nome,
        aulas.slug AS aula_slug
    FROM aulas
    JOIN cursos ON aulas.curso_id = cursos.id
    WHERE aulas.slug = ? AND cursos.slug = ?
`).get(aulaSlug, cursoSlug);
};
