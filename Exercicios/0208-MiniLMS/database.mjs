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
        ('id', 'slug', 'nome', 'descricao')
    VALUES
        (?,?,?,?)
    `)

const router = new Router();
router.post('/cursos', (req, res) => {
    const body = req.body;
    const { id, slug, nome, descricao } = body;
    try {
        createCourse.run(id, slug, nome, descricao);
    } catch (error) {
        res.status(404);
    }
    res.json({
        mensage: 'created'
    });
});

router.post('/aluas', (req, res) => {

});





//* server
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
