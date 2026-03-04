console.log("LOGIN JS CARREGADO ✅");

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

  // ✅ Se você abriu outra página (ex: Principal.html) e esse JS carregou lá,
  // não deixa quebrar.
  if (!loginForm || !emailInput || !passwordInput || !loginBtn || !errorMsg) {
    console.warn("Elementos do login não encontrados nesta página. app.js não será executado aqui.");
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

  /** ✅ Olhinho da senha (só se existir no HTML) */
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      togglePasswordBtn.setAttribute("aria-pressed", String(isHidden));
      togglePasswordBtn.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
      togglePasswordBtn.title = isHidden ? "Ocultar senha" : "Mostrar senha";

      passwordInput.focus();
    });
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
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        setError("Senha inválida");
        return;
      }

      const usuario = await response.json();

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
localStorage.setItem("selectedUserEmail", email);

// ✅ ESSENCIAL pro resto do sistema
if (usuario?.id != null) {
  localStorage.setItem("selectedUserId", String(usuario.id));
}

// opcional (se você usa nome em algum lugar)
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