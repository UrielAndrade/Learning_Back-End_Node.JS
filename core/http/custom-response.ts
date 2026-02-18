import type { ServerResponse } from "node:http";

export interface CustomResponse extends ServerResponse{
  status(code: number): CustomResponse // status recebe um number e retorna uma customResponse
  json(value: any): void //methodo json pode retonar qualquer coisa
}

export function customResponse(response: ServerResponse) {
  const res = response as CustomResponse;
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    };
    res.json = (value) => {
        try {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(value));
        } catch {
            res.status(500).end('erro');
        }
    }
    return res;
}
