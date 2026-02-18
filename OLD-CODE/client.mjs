const response = await fetch(
    "http://localhost:3000/produtos/notebook?cor=azul", {
    method: "GET",
    // headers: {
    //     "Content-Type": "application/json",
    // },
    // body: JSON.stringify({ username: "uriel", password: "1234" }),
});

const body = await response.text();
console.log(response)
console.log(body);
