import { createServer } from "node:http";
import { Router } from "./router.mjs";

const router = new Router();

console.log(router.routes);

router.get('/', (req, res) => {
    res.end("Home");
});

router.get('/produtos/notebook', (req, res) => {
    res.end('produtos - Laptop gamer last generation 2077');
});

router.post('/produtos', (req, res) => {
    res.end('produtos - POST');
});

function pizza(req, res) {
    res.end('PiZAAAAAAAAAAAAAAAAAAAA!')
}
router.get('/pizza', pizza);

console.log(router.routes);


//* server
const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    res.setHeader("Access-Control-Allow-Origin", "Contetnt-Type , Authorization");

    // chunk é um pedaco de dado, da request
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const body = Buffer.concat(chunks).toString("utf-8");
    const handler = router.find(req.method, url.pathname);
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
