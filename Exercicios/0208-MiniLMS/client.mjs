const response = await fetch(
    "http://localhost:3000/cursos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: 1, slug: "linuxforbeginner", nome: "Linux - for beginners", descricao: "linux" }),
});

const body = await response.text();
console.log(response)
console.log(JSON.parse(body));
