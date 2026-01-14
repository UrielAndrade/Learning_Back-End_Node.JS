import { createServer } from "node:http";
import { customRequest } from "../../../custom-request.mjs";
import { customResponse } from "../../../custom-response.mjs";
import { Router } from "../../../router.mjs";
import { mkdir, writeFile } from "node:fs/promises";

// end points aq fora
const router = new Router();

router.post('/produtos', async (req, res) => {
    const { categoria, slug } = JSON.parse(req.body);
    try {
        await mkdir(`./produtos/${categoria}`, { recursive: true });
    } catch {
        console.log(`${categoria} ja criada`)
    }
    try {
        await writeFile(`./produtos/${categoria}/${slug}.json`)
    } catch {

    }
    res.end('produtos');
});
router.get('/produtos', async (req, res) => {
    res.end('produtos');
});
router.get('/produto', async (req, res) => {
    res.end('produto');
});


// --------------------------------------------------------------------------------------------- //
const server = createServer(async (request, response) => {
    const req = await customRequest(request);
    const res = await customResponse(response);

    const handler = router.find(req.method, req.pathname) // nao URL, mas sim o path
    if (handler) {
        handler(req, res);
    }
    else {
        res.statusCode = 404;
        res.end("error");
    }
});

const porta = 3000;
server.listen(porta, () => {
    console.log(`Server disponivel: http://localhost:${porta}`);
});
// --------------------------------------------------------------------------------------------- //
