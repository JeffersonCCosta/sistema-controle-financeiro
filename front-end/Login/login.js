console.log("LOGIN JS CARREGADO");

const BASE_URL = "https://sistema-controle-financeiro-zrep.onrender.com";
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const errorMsg = document.getElementById("errorMsg");

  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const registerLink = document.getElementById("registerLink");
  if (!loginForm || !emailInput || !passwordInput || !loginBtn || !errorMsg) {
    console.warn(
      "Elementos do login não encontrados nesta página. login.js não será executado aqui.",
    );
    return;
  }

  /**Olho da senha + troca do ícone */
  if (togglePasswordBtn) {
    const iconEye = document.getElementById("iconEye");

    const eyeOpen =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1leWUtaWNvbiBsdWNpZGUtZXllIj48cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48L3N2Zz4=";

    const eyeClosed =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1leWUtb2ZmLWljb24gbHVjaWRlLWV5ZS1vZmYiPjxwYXRoIGQ9Ik0xMC43MzMgNS4wNzZhMTAuNzQ0IDEwLjc0NCAwIDAgMSAxMS4yMDUgNi41NzUgMSAxIDAgMCAxIDAgLjY5NiAxMC43NDcgMTAuNzQ3IDAgMCAxLTEuNDQ0IDIuNDkiLz48cGF0aCBkPSJNMTQuMDg0IDE0LjE1OGEzIDMgMCAwIDEtNC4yNDItNC4yNDIiLz48cGF0aCBkPSJNMTcuNDc5IDE3LjQ5OWExMC43NSAxMC43NSAwIDAgMS0xNS40MTctNS4xNTEgMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSA0LjQ0Ni01LjE0MyIvPjxwYXRoIGQ9Im0yIDIgMjAgMjAiLz48L3N2Zz4=";

    //Estado inicial: senha escondida + ícone de "não ver" (olho cortado)
    passwordInput.type = "password";
    if (iconEye) iconEye.src = eyeClosed;
    togglePasswordBtn.setAttribute("aria-pressed", "false");
    togglePasswordBtn.setAttribute("aria-label", "Mostrar senha");
    togglePasswordBtn.title = "Mostrar senha";

    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      if (isHidden) {
        passwordInput.type = "text";
        if (iconEye) iconEye.src = eyeOpen; // agora está vendo
        togglePasswordBtn.setAttribute("aria-pressed", "true");
        togglePasswordBtn.setAttribute("aria-label", "Ocultar senha");
        togglePasswordBtn.title = "Ocultar senha";
      } else {
        passwordInput.type = "password";
        if (iconEye) iconEye.src = eyeClosed; // agora não está vendo
        togglePasswordBtn.setAttribute("aria-pressed", "false");
        togglePasswordBtn.setAttribute("aria-label", "Mostrar senha");
        togglePasswordBtn.title = "Mostrar senha";
      }

      passwordInput.focus();
    });
  }

  if (!loginForm || !emailInput || !passwordInput || !loginBtn || !errorMsg) {
    console.warn(
      "Elementos do login não encontrados nesta página. app.js não será executado aqui.",
    );
    return;
  }

  function setError(message) {
    errorMsg.textContent = message || "";
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;

    if (isLoading) {
      loginBtn.dataset.originalText = loginBtn.textContent;
      loginBtn.textContent = "Logando...";
    } else {
      loginBtn.textContent = loginBtn.dataset.originalText || "Entrar";
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Links (placeholder) */
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Em breve: recuperação de senha.");
    });
  }

  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Em breve: tela de cadastro.");
    });
  }

  /** Login (Enter e clique) */
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");

    const email = (emailInput.value || "").trim().toLowerCase();
    const senha = passwordInput.value || "";

    if (!email) {
      setError("Informe seu e-mail.");
      emailInput.focus();
      return;
    }
    if (!isValidEmail(email)) {
      setError("E-mail inválido.");
      emailInput.focus();
      return;
    }
    if (!senha) {
      setError("Informe sua senha.");
      passwordInput.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setError("Senha inválida");
        return;
      }

      const usuario = await response.json();

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("selectedUserEmail", email);

      if (usuario?.id != null) {
        localStorage.setItem("selectedUserId", String(usuario.id));
      }
      if (usuario?.nome) {
        localStorage.setItem("selectedUser", usuario.nome);
      }

      window.location.href = "../Principal/Principal.html";
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  });
});

/* JS ANTIGO: NOVO FEITO COM AJUDA DE IA PARA OTIMIZAR TEMPO DA TELA DE LOGIN

Função para atualizar UI quando um usuário é selecionado
function selectUser(userId, element) {
  selectedUser = userId;

  // Atualiza atributos aria-pressed e estilo
  userCards.forEach(card => {
    const isSelected = card === element;
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    
    // Adiciona/remove classe para estilização
    if (isSelected) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Salva a seleção no localStorage
  localStorage.setItem('selectedUser', selectedUser);
  localStorage.setItem('selectedUserId', element.dataset.userId);
  localStorage.setItem('selectedUserEmail', element.dataset.email);

  // Habilita botão continuar
  continueBtn.disabled = false;
}

// Adiciona evento de clique a cada cartão
userCards.forEach(card => {
  card.addEventListener('click', () => {
    const userId = card.dataset.user;
    selectUser(userId, card);
  });

  // Melhora acessibilidade para teclado
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const userId = card.dataset.user;
      selectUser(userId, card);
    }
  });
});

/*
// Restaura seleção anterior (se houver)
const prevUser = localStorage.getItem('selectedUser');
if (prevUser) {
  const previousCard = Array.from(userCards).find(c => c.dataset.user === prevUser);
  if (previousCard) {
    selectUser(prevUser, previousCard);
  }
}


document.getElementById('loginBtn').addEventListener('click', async () => {
  const senha = document.getElementById('passwordInput').value;
  const email = localStorage.getItem('selectedUserEmail');

  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      senha: senha
    })
  });

  if (!response.ok) {
    document.getElementById('errorMsg')
      .innerText = 'Senha inválida';
    return;
  }

  const usuario = await response.json();

  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

  window.location.href = '../Principal/Principal.html';
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
  document.getElementById('passwordModal')
    .classList.add('hidden');
});


// Ação do botão continuar
continueBtn.addEventListener('click', () => {
  if (!selectedUser) return;

  document.getElementById('passwordModal')
  .classList.remove('hidden');

  /*
  const userId = localStorage.getItem('selectedUserId');
  
  window.location.href = '../Principal/Principal.html';
});
*/
