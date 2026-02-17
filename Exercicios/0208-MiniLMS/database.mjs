import { DatabaseSync } from "node:sqlite";
import { Router } from "./router.mjs";
import { createServer } from "node:http";
import { customRequest } from "../../custom-request.mjs"
import { customResponse } from "../../custom-response.mjs"

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
      "id" INTEGER PRIMARY KEY,
      "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
      "nome" TEXT NOT NULL,
      "descricao" TEXT NOT NULL
    ) STRICT;
`);

db.exec(/*sql*/`
    CREATE TABLE IF NOT EXISTS "aulas" (
      "id" INTEGER PRIMARY KEY,
      "curso_id" INTEGER NOT NULL,
      "slug" TEXT NOT NULL COLLATE NOCASE,
      "nome" TEXT NOT NULL,
      FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
      UNIQUE("curso_id", "slug")
    ) STRICT;`);

const createCourse = db.prepare(/*sql*/`
    INSERT OR IGNORE INTO cursos
        (id, slug, nome, descricao)
    VALUES
        (?,?,?,?)
    `)

const router = new Router();

// atv 2.1
router.post('/cursos', (req, res) => {
    const body = req.body;
    const { id, slug, nome, descricao } = body;
    try {
        createCourse.run(id, slug, nome, descricao);
        res.json({
            mensage: 'created'
        });
    } catch (error) {
        res.status(404);
    }
    res.status(404);
});
// atv 2.2
const createAula = db.prepare(/*sql*/`
    INSERT OR IGNORE INTO aulas
        (id, curso_id, slug, nome)
    VALUES
        (?,?,?,?)
    `);
router.post('/aulas', (req, res) => {
    const body = req.body;
    const { id, curso_id, slug, nome } = body;

    try {
        const result = createAula.run(id, curso_id, slug, nome)

        if (result.changes === 0) {
            return res.status(409).json({ error: 'Aula já existe' });
        }
        return res.status(201).json({ message: 'Aula criada' });

    } catch (erro) {
        return res.status(500).json({ error: 'internal error' });
    }
});

// atv 2.3
const listCursos = db.prepare(/*sql*/`
    SELECT * FROM cursos
    `);
router.get('/cursos', (req, res) => {
    const cursos = listCursos.all();
    return res.json(cursos);
});

// atv 2.4
const getCurseBySlug = db.prepare(/*sql*/`
    SELECT * FROM cursos WHERE slug = ?
`);
router.get('/curso', (req, res) => {
    try {
        const slug = req.query.get("slug");
        const curso = getCurseBySlug.get(slug);
        return res.json(curso)
    } catch (error) {
        res.status(404)
    }
});

// atv 2.5
const getAulaBySlug = db.prepare(/*sql*/`
    SELECT * FROM aulas WHERE slug = ?
`);
router.get('/aulas', (req, res) => {
    try {
        const slug = req.query.get("slug");
        const aula = getAulaBySlug.get(slug);
        return res.json(aula)
    } catch (error) {
        res.status(404)
    }
});

// atv 2.5 && 2 queries
const getAulaAndCursoBySlug = db.prepare(/*sql*/`
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
`);

router.get('/aula', (req, res) => {
    try {

        const cursoSlug = req.query.get("curso");
        const aulaSlug = req.query.get("aula");
        if (!aulaSlug || !cursoSlug) {
            return res.status(400).json({ error: "Informe 'curso' e 'aula' na query" });
        }

        const resultado = getAulaAndCursoBySlug.get(aulaSlug, cursoSlug);

        if (!resultado) {
            return res.status(404).json({ error: 'Aula ou curso nao encontrado' });
        }

        return res.json(resultado);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno' });
    }
});


//* ============================ server ============================ *//
const server = createServer(async (request, response) => {
    const req = await customRequest(request);
    const res = await customResponse(response)

    const handler = router.find(req.method, req.pathname);
    if (handler) {
        handler(req, res);
    }
    else {
        res.statusCode = 404;
        res.end("Não encontrado");
    }
});

server.listen(3000, () => {
    console.log("Server disponivel: http://localhost:3000");
});
