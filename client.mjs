const response = await fetch(
    "http://localhost:3000/produtos",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "uriel", password: "1234" }),
    },
);

const body = await response.json();
console.log(body);

// console.log(response);
