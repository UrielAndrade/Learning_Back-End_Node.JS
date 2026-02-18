import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";

const router = new Router();

console.log(router.routes);

router.get('/', (req, res) => {
    res.end("Home");
});

router.get('/produtos/notebook', (req, res) => {
    const cor = req.query.get("cor");
    res.status(200).json(`produtos - Laptop gamer last generation 2077 ${cor} `);
});

router.post('/produtos', (req, res) => {
    const cor = req.query.get("cor");
    res.end(`produtos - POST ${cor}`);
});

function postPizza(req, res) {
    const cor = req.query.get('cor');
    res.status(201).json({ produto: "notebook", cor });
}

router.get('/pizza', postPizza);

console.log(router.routes);


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
