console.log("LOGIN JS CARREGADO");

const BASE_URL = "https://sistema-controle-financeiro-zrep.onrender.com";
const statusMsg = document.getElementById("statusMsg");

document.addEventListener("DOMContentLoaded", () => {
  // Se já estiver logado, manda direto pro sistema
  const jaLogado = sessionStorage.getItem("usuarioLogado");
  if (jaLogado) {
    window.location.href = "../Principal/Principal.html";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const errorMsg = document.getElementById("errorMsg");

  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const registerLink = document.getElementById("registerLink");

  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const forgotEmailInput = document.getElementById("forgotEmailInput");
  const forgotErrorMsg = document.getElementById("forgotErrorMsg");
  const sendRecoveryBtn = document.getElementById("sendRecoveryBtn");
  const closeForgotModalBtn = document.getElementById("closeForgotModalBtn");

  if (!loginForm || !emailInput || !passwordInput || !loginBtn || !errorMsg) {
    console.warn("Elementos do login não encontrados. login.js não será executado.");
    return;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(message) {
    errorMsg.textContent = message || "";
    if (message) {
      errorMsg.classList.remove("shake");
      // reinicia animação
      void errorMsg.offsetWidth;
      errorMsg.classList.add("shake");
    }
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;

    const textEl = loginBtn.querySelector(".btn-text");
    if (isLoading) {
      loginBtn.classList.add("is-loading");
      if (textEl) textEl.textContent = "Logando";
    } else {
      loginBtn.classList.remove("is-loading");
      if (textEl) textEl.textContent = "Entrar";
    }
  }

  function markEmailState() {
    const email = (emailInput.value || "").trim().toLowerCase();

    // não marca nada se estiver vazio (evita UX chata)
    if (!email) {
      emailInput.classList.remove("is-valid", "is-invalid");
      setError("");
      return;
    }

    if (isValidEmail(email)) {
      emailInput.classList.add("is-valid");
      emailInput.classList.remove("is-invalid");
      setError("");
    } else {
      emailInput.classList.add("is-invalid");
      emailInput.classList.remove("is-valid");
      // não força erro enquanto digita, só mostra se perder foco (ver blur)
    }
  }

  // valida enquanto digita (somente visual)
  emailInput.addEventListener("input", markEmailState);

  // ao sair do campo, se inválido, mostra mensagem
  emailInput.addEventListener("blur", () => {
    const email = (emailInput.value || "").trim().toLowerCase();
    if (email && !isValidEmail(email)) {
      setError("E-mail inválido.");
    }
  });

  /** Olho da senha + troca do ícone */
  if (togglePasswordBtn) {
    const iconEye = document.getElementById("iconEye");

    const eyeOpen =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1leWUtaWNvbiBsdWNpZGUtZXllIj48cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48L3N2Zz4=";

    const eyeClosed =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1leWUtb2ZmLWljb24gbHVjaWRlLWV5ZS1vZmYiPjxwYXRoIGQ9Ik0xMC43MzMgNS4wNzZhMTAuNzQ0IDEwLjc0NCAwIDAgMSAxMS4yMDUgNi41NzUgMSAxIDAgMCAxIDAgLjY5NiAxMC43NDcgMTAuNzQ3IDAgMCAxLTEuNDQ0IDIuNDkiLz48cGF0aCBkPSJNMTQuMDg0IDE0LjE1OGEzIDMgMCAwIDEtNC4yNDItNC4yNDIiLz48cGF0aCBkPSJNMTcuNDc5IDE3LjQ5OWExMC43NSAxMC43NSAwIDAgMS0xNS40MTctNS4xNTEgMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSA0LjQ0Ni01LjE0MyIvPjxwYXRoIGQ9Im0yIDIgMjAgMjAiLz48L3N2Zz4=";

    passwordInput.type = "password";
    if (iconEye) iconEye.src = eyeClosed;

    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      if (isHidden) {
        passwordInput.type = "text";
        if (iconEye) iconEye.src = eyeOpen;
        togglePasswordBtn.setAttribute("aria-pressed", "true");
        togglePasswordBtn.setAttribute("aria-label", "Ocultar senha");
        togglePasswordBtn.title = "Ocultar senha";
      } else {
        passwordInput.type = "password";
        if (iconEye) iconEye.src = eyeClosed;
        togglePasswordBtn.setAttribute("aria-pressed", "false");
        togglePasswordBtn.setAttribute("aria-label", "Mostrar senha");
        togglePasswordBtn.title = "Mostrar senha";
      }

      passwordInput.focus();
    });
  }

  forgotPasswordLink?.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal?.classList.add("show");
    forgotErrorMsg.textContent = "";
    forgotEmailInput.value = emailInput.value || "";
    forgotEmailInput.focus();
  });

  closeForgotModalBtn?.addEventListener("click", () => {
    forgotPasswordModal?.classList.remove("show");
  });

  forgotPasswordModal?.addEventListener("click", (e) => {
    if(e.target === forgotPasswordModal) {
      forgotPasswordModal.classList.remove("show");
    }
  });

  sendRecoveryBtn?.addEventListener("click", async () => {
    const email = (forgotEmailInput.value || "").trim().toLowerCase();
    
    forgotErrorMsg.textContent = "";
    forgotErrorMsg.style.color = "#16a34a";
    
    if(!email) {
      forgotErrorMsg.textContent = "Informe seu e-mail cadastrado.";
      forgotEmailInput.focus();
      return;
    }

    if(!isValidEmail(email)) {
      forgotErrorMsg.textContent = "E-mail inválido.";
      forgotEmailInput.focus();
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/esqueci-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        forgotErrorMsg.textContent = data.message || "Erro ao solicitar recuperação.";
        return;
      }

      if(data.resetLink) {
        window.location.href = data.resetLink;
        return;
      }

      forgotErrorMsg.style.color = "#dc2626";
      forgotErrorMsg.textContent = data.message || "Solicitação enviada com sucesso.";
    } catch (error) {
      console.error(error);
      forgotErrorMsg.textContent = "Erro ao conectar com o servidor.";
    }
  });

  registerLink?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../Registrar/registrar.html"
  });

  function setStatus(message) {
    if (!statusMsg) return;
    statusMsg.innerHTML = message || "";
  }

  /** Login */
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    const email = (emailInput.value || "").trim().toLowerCase();
    const senha = passwordInput.value || "";

    // validações
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

    const t1 = setTimeout(() => {
      setStatus("Conectando com o servidor...");
    }, 3000);

    const t2 = setTimeout(() => {
      setStatus("Servidor iniciando (primeiro acesso do dia). Aguarde mais alguns segundos...");
    }, 10000);

    const t3 = setTimeout(() => {
      setStatus("Ainda conectando... isso pode demorar um pouco na primeira tentativa.");
    }, 15000);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      const usuario = await response.json();

      sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      sessionStorage.setItem("selectedUserEmail", email);

      if (usuario?.id != null) sessionStorage.setItem("selectedUserId", String(usuario.id));
      if (usuario?.nome) sessionStorage.setItem("selectedUser", usuario.nome);

      window.location.href = "../Principal/Principal.html";
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setStatus("");
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
