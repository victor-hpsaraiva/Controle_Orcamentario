const API_URL = "http://localhost:3000/auth/register";

async function cadastrarUsuario() {
  const name = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("senha").value;
  const confirsenha = document.getElementById("confirsenha").value;

  // tudo relacionado a senha 
  if (password.length < 8) {
    alert("A senha deve possuir no mínimo 8 caracteres.");

    return;
  }

  if (!/[A-Z]/.test(password)) {
    alert("A senha deve possuir pelo menos uma letra maiúscula.");

    return;
  }

  if (!/[a-z]/.test(password)) {
    alert("A senha deve possuir pelo menos uma letra minúscula.");

    return;
  }

  if (!/\d/.test(password)) {
    alert("A senha deve possuir pelo menos um número.");

    return;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    alert("A senha deve possuir pelo menos um caractere especial.");

    return;
  }

  if (password !== confirsenha) {
    alert("As senhas não coincidem.");

    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    // validação de email pra saber se existe mesmo
 const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {

    alert(
        "Digite um e-mail válido."
    );

    return;

}

// validação se o cadastro está funcionando ou nao
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao cadastrar.");

      return;
    }

    alert("Usuário cadastrado com sucesso!");

    window.location.href = "telaLogin.html";
  } catch (error) {
    console.error(error);

    alert("Erro de conexão com a API.");
  }
}
