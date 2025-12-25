import { createServer } from "node:http";
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

});

server.listen(3000, () => {
    console.log("Server disponivel: http://localhost:3000");
});

// const cor = url.searchParams.get('cor');
// const tamanho = url.searchParams.get('tamanho');
