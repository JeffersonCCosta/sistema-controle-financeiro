const BASE_URL = "https://sistema-controle-financeiro-zrep.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const newPassword = document.getElementById("newPassword");
  const errorMsg = document.getElementById("resetErrorMsg");
  const resetBtn = document.getElementById("resetBtn");

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  function setLoading(isLoading) {
    resetBtn.disabled = isLoading;
    const textEl = resetBtn.querySelector(".btn-text");

    if (isLoading) {
      resetBtn.classList.add("is-loading");
      if (textEl) textEl.textContent = "Salvando...";
    } else {
      resetBtn.classList.remove("is-loading");
      if (textEl) textEl.textContent = "Salvar nova senha";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    errorMsg.style.color = "#dc2626";

    const senha = newPassword.value || "";

    if (!token) {
      errorMsg.textContent = "Token não encontrado.";
      return;
    }

    if (!senha) {
      errorMsg.textContent = "Informe a nova senha.";
      newPassword.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          novaSenha: senha
        })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.message || "Erro ao redefinir senha.";
        return;
      }

      errorMsg.style.color = "#16a34a";
      errorMsg.textContent = "Senha redefinida com sucesso. Redirecionando para login...";

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);
    } catch (error) {
      console.error(error);
      errorMsg.textContent = "Erro ao conectar com o servidor.";
    } finally {
      setLoading(false);
    }
  });
});