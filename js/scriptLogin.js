const API = 'http://localhost:3000/tarefas'
const API_LOGIN = 'http://localhost:3000/login'
 
// Função Login

function login() {
    const email = document.getElementById('emailLogin').value
    const senha = document.getElementById('senhaLogin').value

    fetch(API_LOGIN , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Login inválido")
        }
        return res.json()
    })
    .then(data => {
        window.alert("Login realizado!!")
        window.location.href = "realizado.html"
    })
    .catch(error => {
        alert("Email ou senha incorretos")
        console.error("Erro: ", error)
    })
}
