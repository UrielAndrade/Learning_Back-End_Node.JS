const produtosRes = await fetch("http://localhost:3000/produtos");
console.log(produtosRes);
const produtos = await produtosRes.json();
console.log(produtos);

// const response = await fetch(
//     "http://localhost:3000/produtos", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'aplication/json',
//     },
//     body: JSON.stringify({
//         nome: "Notebook",
//         slug: "notebook",
//         categoria: "eletronicos",
//         preco: 4499,
//     }),
// });
// const body = await response.text();
// console.log(body);
// console.log(response);

// await fetch(
//     "http://localhost:3000/produtos", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'aplication/json',
//     },
//     body: JSON.stringify({
//         nome: "Mesa 4 pernas",
//         slug: "mesa4pernas",
//         categoria: "moveis",
//         preco: 4499,
//     }),
// });

// await fetch(
//     "http://localhost:3000/produtos", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'aplication/json',
//     },
//     body: JSON.stringify({
//         nome: "mouse",
//         slug: "mouse",
//         categoria: "eletronicos",
//         preco: 200,
//     }),
// });
