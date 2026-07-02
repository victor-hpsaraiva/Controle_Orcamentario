//Função para cadastrar um novo usuário
function cadastrarUsuario() {

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirsenha = document.getElementById("confirsenha").value;

  fetch("http://localhost:3000/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },    
    body: JSON.stringify({ nome, email, senha, confirsenha }),
  })
    .then(response => {
      if (response.ok) {
        alert("Usuário cadastrado com sucesso! Veja confirmação no seu E-mail.");
        
        // chama função que já vai redirecionar
        emaildeRegistro();

        userList();

      } else {
        alert("Erro ao cadastrar o usuário Digite os campos.");
      }
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro de conexão com a API....");
    });
}



function emaildeRegistro() {
  const email = document.getElementById("email").value; 
  alert("E-mail de registro: " + email);


  window.location.href = "login.html";
}


//Função para testar a conexão com a API
function testeConexao() {
  fetch("http://localhost:3000/conexao")
    .then(response => response.json())
    .then(data => {
      alert(data.msg);
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro de conexão com a API.");
    }); 
}


//função de API externa para exibir os usuários aleatoriamente cadastrados
function userList() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
      data.forEach(usuario => {
        console.log("Nome:", usuario.name, "Email:", usuario.email);
      });
    })
    .catch(err => console.error("Erro:", err));
}
