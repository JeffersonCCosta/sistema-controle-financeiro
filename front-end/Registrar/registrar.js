console.log("REGISTRAR JS CARREGADO");

const BASE_URL = "https://sistema-controle-financeiro-zrep.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const nomeInput = document.getElementById("nomeInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const registerBtn = document.getElementById("registerBtn");
  const errorMsg = document.getElementById("errorMsg");
  const statusMsg = document.getElementById("statusMsg");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const iconEye = document.getElementById("iconEye");

  if (!registerForm) {
    console.warn("Formulário de cadastro não encontrado.");
    return;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(message) {
    errorMsg.textContent = message || "";
    if (message) {
      errorMsg.classList.remove("shake");
      void errorMsg.offsetWidth;
      errorMsg.classList.add("shake");
    }
  }

  function setStatus(message) {
    statusMsg.textContent = message || "";
  }

  function setLoading(isLoading) {
    registerBtn.disabled = isLoading;

    const textEl = registerBtn.querySelector(".btn-text");
    if (isLoading) {
      registerBtn.classList.add("is-loading");
      if (textEl) textEl.textContent = "Cadastrando";
    } else {
      registerBtn.classList.remove("is-loading");
      if (textEl) textEl.textContent = "Cadastrar";
    }
  }

  function validateField(input, isValid) {
    input.classList.remove("is-valid", "is-invalid");

    if (!input.value.trim()) return;

    if (isValid) {
      input.classList.add("is-valid");
    } else {
      input.classList.add("is-invalid");
    }
  }

  emailInput.addEventListener("input", () => {
    validateField(emailInput, isValidEmail(emailInput.value.trim().toLowerCase()));
  });

  nomeInput.addEventListener("input", () => {
    validateField(nomeInput, nomeInput.value.trim().length >= 3);
  });

  passwordInput.addEventListener("input", () => {
    validateField(passwordInput, passwordInput.value.length >= 3);

    if (confirmPasswordInput.value) {
      validateField(confirmPasswordInput, confirmPasswordInput.value === passwordInput.value);
    }
  });

  confirmPasswordInput.addEventListener("input", () => {
    validateField(confirmPasswordInput, confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value.length >= 3);
  });

  if (togglePasswordBtn) {
    const eyeOpen =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48L3N2Zz4=";

    const eyeClosed =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTAgNS4wNzZhMTAuNzQ0IDEwLjc0NCAwIDAgMSAxMS4yMDUgNi41NzUgMSAxIDAgMCAxIDAgLjY5NiAxMC43NDcgMTAuNzQ3IDAgMCAxLTEuNDQ0IDIuNDkiLz48cGF0aCBkPSJNMTQuMDg0IDE0LjE1OGEzIDMgMCAwIDEtNC4yNDItNC4yNDIiLz48cGF0aCBkPSJNMTcuNDc5IDE3LjQ5OWExMC43NSAxMC43NSAwIDAgMS0xNS40MTctNS4xNTEgMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSA0LjQ0Ni01LjE0MyIvPjxwYXRoIGQ9Im0yIDIgMjAgMjAiLz48L3N2Zz4=";

    if (iconEye) iconEye.src = eyeClosed;

    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";
      confirmPasswordInput.type = isHidden ? "text" : "password";

      if (iconEye) iconEye.src = isHidden ? eyeOpen : eyeClosed;

      togglePasswordBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
      togglePasswordBtn.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
      togglePasswordBtn.title = isHidden ? "Ocultar senha" : "Mostrar senha";
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    const nome = (nomeInput.value || "").trim();
    const email = (emailInput.value || "").trim().toLowerCase();
    const senha = passwordInput.value || "";
    const confirmarSenha = confirmPasswordInput.value || "";

    if (!nome) {
      setError("Informe seu nome.");
      nomeInput.focus();
      return;
    }

    if (nome.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres.");
      nomeInput.focus();
      return;
    }

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

    if (senha.length < 3) {
      setError("A senha deve ter pelo menos 3 caracteres.");
      passwordInput.focus();
      return;
    }

    if (!confirmarSenha) {
      setError("Confirme sua senha.");
      confirmPasswordInput.focus();
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      confirmPasswordInput.focus();
      return;
    }

    setLoading(true);
    setStatus("Criando sua conta...");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Não foi possível realizar o cadastro.");
        return;
      }

      setStatus("Cadastro realizado com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        window.location.href = "../Login/login.html";
      }, 2500);

    } catch (error) {
      console.error(error);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  });
});