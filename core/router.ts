import type { CustomRequest } from "./http/custom-request";
import type { CustomResponse } from "./http/custom-response";

type Handler = (req: CustomRequest, res: CustomResponse) => Promise<void> | void;

export class Router {
    routes: Record<string, Record<string, Handler>> = {
        GET: {} as Record<string, Handler>,
        POST: {} as Record<string, Handler>,
    };
    get(route: string, handler: Handler) {
        this.routes['GET'][route] = handler;
    }
    post(route: string, handler: Handler) {
        this.routes['POST'][route] = handler;
    }
    find(method: string, route: string) {
        return this.routes[method]?.[route] || null;
    }
}
