export function customResponse(res) {
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
