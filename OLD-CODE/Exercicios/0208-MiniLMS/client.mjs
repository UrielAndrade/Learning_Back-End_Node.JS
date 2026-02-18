const response = await fetch(
  "http://localhost:3000/aula?aula=howtousebasicscomandsbash&curso=linuxforbeginner", { // cursos, aulas, curso "SLUG", aula "SLUG,
  // method: "get",
  // headers: {
  //     "Content-Type": "application/json",
  // },
  // body: JSON.stringify({ id: 2, slug: "linuxforbeginner2", nome: "Linux - for beginners2", descricao: "linux" }), //create coruse
  // body: JSON.stringify({ id: 1, curso_id: 1, slug: "howtousebasicscomandsbash", nome: "how to use basics comands at bash" }),s
});

const body = await response.text();
console.log(response)
console.log(JSON.parse(body));
