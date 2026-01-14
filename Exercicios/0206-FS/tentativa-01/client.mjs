const response = await fetch(
    "http://localhost:3000/produtos", {
    method: 'POST',
    headers: {
        'Content-Type': 'aplication/json',
    },
    body: JSON.stringify({
        nome: "Notebook",
        slug: "notebook",
        categoria: "eletronicos",
        preco: 4499,
    }),
});
const body = await response.text();
console.log(body);
console.log(response);
