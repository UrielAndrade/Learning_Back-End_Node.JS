export const routes = {
    GET: {

        '/': (req, res) => {
            res.end("Seu nome é hello world!");
        },

        '/produtos': (req, res) => {
            res.end('produtos - Laptop gamer last generation 2077');
        }
    },
    POST: {
        '/produtos': (req, res) => {
            res.end('produtos - POST');
        },

    }
}
