import { IncomingMessage } from 'node:http';

export interface CustomRequest extends IncomingMessage{ // cusomRequest type
  query: URLSearchParams,
  pathname: string,
  body: Record<string, any>
}

export async function customRequest(request: IncomingMessage) {
  const req = request as  customRequest;
    const url = new URL(req.url || '', "http://localhost");
    req.query = url.searchParams;
    req.pathname = url.pathname;

    // chunk é um pedaco de dado, da request
    const chunks: Buffer[] = []; // passar type da array
    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const body = Buffer.concat(chunks).toString("utf-8");
    if (req.headers['content-type'] === 'application/json') {
        req.body = JSON.parse(body);
    }
    else {
        req.body = {}; // indicar objt vazio, erro de tipagem
    }
    return req;
}
