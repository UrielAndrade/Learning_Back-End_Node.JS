import { createServer } from 'node:http';

//*PROMISE
const frase1 = Promise.resolve('olá ');
const frase2 = Promise.resolve('mundo');
const frasePromise = [frase1, frase2];
const frases = [];

for await (const frase of frasePromise) {
  frases.push(frase);
}
// console.log(frases.join(''));

//* BUFFER
const parte1 = Buffer.from('olá ');
const parte2 = Buffer.from('mundo');
const final = Buffer.concat([parte1, parte2]);
// console.log(final);

//* server
const server = createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const url = new URL(req.url, 'http://localhost');
  const cor = url.searchParams.get('cor');
  const tamanho = url.searchParams.get('tamanho');
  // console.log(req.headers['content-type']);
  // console.log(req.rawHeaders);

  // chunk é um pedaco de dado, da request
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf-8');
  console.log(JSON.parse(body));

  if (req.method === 'GET' && url.pathname === '/') {
    res.statusCode = 200;
    res.end('Home');
  } else if (req.method === 'POST' && url.pathname === '/produtos') {
    res.statusCode = 201;
    res.end(`Produtos: ${cor} , ${tamanho}`);
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }

  console.log(req.method);
});

server.listen(3000, () => {
  console.log('Server disponivel: http://localhost:3000');
});
