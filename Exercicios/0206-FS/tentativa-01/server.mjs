import { createServer } from "node:http";
import { customRequest } from "../../../custom-request.mjs";
import { customResponse } from "../../../custom-response.mjs";
import { Router } from "../../../router.mjs";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { json } from "node:stream/consumers";

// end points aq fora
const router = new Router();

router.post('/produtos', async (req, res) => {
    const body = JSON.parse(req.body);
    const { categoria, slug } = body;
    try {
        await mkdir(`./produtos/${categoria}`, { recursive: true });
    } catch {
        console.log(`${categoria} ja criada`);
    } try {
        await writeFile(`./produtos/${categoria}/${slug}.json`, JSON.stringify(body))
        res.status(201).json(`${slug} criado`);
    } catch {
        res.status(500).end("Erro")
    }
});

router.get('/produtos', async (req, res) => {
    try {
        const arquivos = await readdir('./produtos', { recursive: true });
        const arquivoJson = arquivos.filter(item => item.endsWith('.json'));
        console.log(arquivoJson);

        const promises = []
        for (const arquivo of arquivoJson) {
            const content = readFile(`./produtos/${arquivo}`, 'utf-8');
            promises.push(content);
        }
        const contents = await Promise.all(promises);
        const prod = contents.map(JSON.parse);
        res.status(200).json(prod);
    } catch (error) {
        console.error('Erro ao ler diretório:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar produtos',
            message: error.message
        });
    }
});

router.get('/produto', async (req, res) => {
    const categoria = req.query.get("categoria");
    const slug = req.query.get("slug");
    try {
        const conteudo = await readFile(`./produtos/${categoria}/${slug}.json`, "utf-8");
        const produto = JSON.parse(conteudo);
        res.status(200).json(produto);
    } catch (err) {
        res.status(404).json("Não encontrado.");
    }
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
