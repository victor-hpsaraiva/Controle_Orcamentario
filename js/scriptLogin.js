const API_URL = "http://localhost:3000/auth/login";

async function login() {

    const email =
        document.getElementById("emailLogin").value;

    const password =
        document.getElementById("senhaLogin").value;

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Erro ao realizar login"
            );

            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(data.user)
        );

        alert(
            "Login realizado com sucesso!"
        );

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(error);

        alert(
            "Erro ao conectar com a API."
        );

    }
}