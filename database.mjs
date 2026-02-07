import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync('./db.sqlite');

db.exec(`
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

db.exec(/*sql*/`
    CREATE TABLE IF NOT EXISTS "produtos"(
        "slug" TEXT PRIMARY KEY,
        "nome" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "preco" INTEGER NOT NULL
    );
`);

const insert = db.prepare(/*sql*/`
    INSERT OR IGNORE INTO 'produtos'
        ('slug', 'nome', 'categoria', 'preco')
    VALUES
        (?,?,?,?)
    `)

insert.run('notebook', 'Notebook', 'eletronicos', 4000);
insert.run('celular', 'Celular', 'eletronicos', 200);

const produtos = db
    .prepare(/*sql*/` SELECT * FROM 'produtos'`)
    .all();
produtos.forEach(produto => {
    console.log(produto.nome + '\n');
});

const produto = db
    .prepare(/*sql*/`SELECT * FROM "produtos" WHERE "slug" = ?`)
    .get('mouse');
console.log(produto)
