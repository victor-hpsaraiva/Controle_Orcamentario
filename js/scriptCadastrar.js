const API_URL =
    "http://localhost:3000/auth/register";

async function cadastrarUsuario() {

    const name =
        document.getElementById(
            "nome"
        ).value;

    const email =
        document.getElementById(
            "email"
        ).value;

    const password =
        document.getElementById(
            "senha"
        ).value;

    const confirsenha =
        document.getElementById(
            "confirsenha"
        ).value;

    if(password !== confirsenha){

        alert(
            "As senhas não coincidem."
        );

        return;
    }

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if(!response.ok){

            alert(data.error);

            return;
        }

        alert(
            "Usuário cadastrado com sucesso!"
        );

        window.location.href =
            "telaLogin.html";

    } catch(error){

        console.error(error);

        alert(
            "Erro de conexão com a API."
        );

    }
}
``