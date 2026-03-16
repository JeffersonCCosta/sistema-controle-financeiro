const usuario = sessionStorage.getItem("usuarioLogado");
const logoutBtn = document.getElementById("logout");
const logoutModal = document.getElementById("logoutModal");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

if (!usuario) {
  window.location.href = "../Login/Login.html";
}

document.addEventListener("DOMContentLoaded", () => {
        if (!usuario) {
            window.location.href = "../Login/login.html";
            return;
        }
        const usuarioRaw = JSON.parse(usuario);
        //console.log("usuario vindo do localStorage:", usuario);
        //console.log("elemento #userAvatar:", document.getElementById("userAvatar"));

        const topbarAvatar = document.getElementById("topbarAvatar");
        const topbarUserName = document.getElementById("topbarUserName");
        const topbarUserRole = document.getElementById("topbarUserRole");

        if (topbarAvatar) {
            const nome = usuarioRaw?.nome || usuarioRaw?.email || "Usuário";

            topbarAvatar.innerText = gerarIniciais(nome);
            topbarAvatar.style.background = gerarCor(nome);

            if (topbarUserName) topbarUserName.textContent = nome;

            const cargo = (usuarioRaw?.tipoUsuario || usuarioRaw?.tipo || "USUÁRIO").toString();
            if (topbarUserRole) topbarUserRole.textContent = cargo.toUpperCase();
        }

    // nome do usuário
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
        userNameEl.textContent = usuarioRaw.nome || usuarioRaw.email || "";
    }

    /*  avatar do usuário
    const avatarEl = document.getElementById("userAvatar");
    if (avatarEl && usuario) {
        if (usuario.nome === "Jefferson") {
            avatarEl.src = "../IMG/perfil_jefferson.jpeg";
        } 
        else if (usuario.nome === "Isabella") {
            avatarEl.src = "../IMG/perfil_isabella.jpeg";
        }
    }
    */

    setTimeout(() => {
        const dashboardBtn = document.querySelector('[data-section="dashboard"]');
        if(dashboardBtn){
            dashboardBtn.click();
        }
    }, 100);
});

// ===== Dropdown usuário (topbar) =====
const userDropdown = document.getElementById("userDropdown");
const userTrigger  = document.getElementById("userTrigger");
const userMenu     = document.getElementById("userMenu");

function closeUserMenu(){
  if(!userDropdown) return;
  userDropdown.classList.remove("open");
  userTrigger?.setAttribute("aria-expanded", "false");
}

function toggleUserMenu(){
  if(!userDropdown) return;
  const willOpen = !userDropdown.classList.contains("open");
  userDropdown.classList.toggle("open", willOpen);
  userTrigger?.setAttribute("aria-expanded", String(willOpen));
}

userTrigger?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleUserMenu();
});

// fecha clicando fora
document.addEventListener("click", (e) => {
  if(!userDropdown) return;
  if (!userDropdown.contains(e.target)) closeUserMenu();
});

// fecha ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeUserMenu();
});

// ações
document.getElementById("goProfile")?.addEventListener("click", () => {
  closeUserMenu();
  // TODO: aponte para sua página real de perfil
  contentArea.innerHTML = `
    <div class="card">
      <h2>Perfil</h2>
      <p>Em construção…</p>
    </div>
  `;
});

document.getElementById("goPassword")?.addEventListener("click", () => {
  closeUserMenu();
  // TODO: aponte para sua tela real de alterar senha
  contentArea.innerHTML = `
    <div class="card">
      <h2>Alterar senha</h2>
      <p>Em construção…</p>
    </div>
  `;
});

document.getElementById("menuLogout")?.addEventListener("click", () => {
  closeUserMenu();
  logoutModal.classList.add("show"); // reaproveita seu modal
});

const menuButtons = document.querySelectorAll(".menu-item");
const sectionTitle = document.getElementById("sectionTitle");
const contentArea = document.getElementById("contentArea");
const sidebar = document.querySelector(".sidebar");
const toggleMenu = document.getElementById("toggleMenu");
const overlay = document.getElementById("overlay");

function openMenu(){
  sidebar.classList.add("open");
  overlay?.classList.add("show");
}

function closeMenu(){
  sidebar.classList.remove("open");
  overlay?.classList.remove("show");
}

function isMobile(){
  return window.matchMedia("(max-width: 900px)").matches;
}

toggleMenu.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) closeMenu();
  else openMenu();
});

overlay?.addEventListener("click", closeMenu);

/* Fecha menu ao redimensionar para desktop */
window.addEventListener("resize", () => {
  if (!isMobile()) closeMenu();
});

menuButtons.forEach(btn => {
    btn.addEventListener("click", async () => {

        if (isMobile()) closeMenu();

        menuButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const section = btn.dataset.section;
        sectionTitle.textContent =
            section.charAt(0).toUpperCase() + section.slice(1);

        // ---------- CATEGORIAS ----------
        if (section === "categorias") {
            const html = await fetch("../categorias/categorias.html").then(res => res.text());
            contentArea.innerHTML = html;

            document.querySelectorAll("script[data-dynamic]").forEach(s => s.remove());

            const script = document.createElement("script");
            script.src = "../categorias/categorias.js";
            script.setAttribute("data-dynamic", "true");

            script.onload = () => {
                if (typeof carregarCategorias === "function") {
                    carregarCategorias();
                }
            };

            document.body.appendChild(script);
            return;
        }

        // ---------- DESPESAS ----------
        if (section === "despesas") {
            const html = await fetch("../despesas/despesas.html").then(res => res.text());
            contentArea.innerHTML = html;

            document.querySelectorAll("script[data-dynamic]").forEach(s => s.remove());

            const script = document.createElement("script");
            script.src = "../despesas/despesas.js";
            script.setAttribute("data-dynamic", "true");

            script.onload = () => {
                if (typeof initDespesas === "function") {
                    initDespesas();
                } else {
                    console.error("initDespesas não encontrada");
                }
            };

            document.body.appendChild(script);
            return;
        }

        // ---------- RECEITAS ----------
        if (section === "receitas") {
            const html = await fetch("../receitas/receitas.html").then(res => res.text());
            contentArea.innerHTML = html;

            document.querySelectorAll("script[data-dynamic]").forEach(s => s.remove());

            const script = document.createElement("script");
            script.src = "../receitas/receitas.js";
            script.setAttribute("data-dynamic", "true");

            script.onload = () => {
                if (typeof initReceitas === "function") {
                    initReceitas();
                } else {
                    console.error("initReceitas não encontrada");
                }
            };

            document.body.appendChild(script);
            return;
        }

        // ---------- DASHBOARD ----------
        if (section === "dashboard") {
            const html = await fetch("../dashboard/dashboard.html").then(res => res.text());
            contentArea.innerHTML = html;

            await carregarLib("https://cdn.jsdelivr.net/npm/chart.js");

            document.querySelectorAll("script[data-dynamic]").forEach(s => s.remove());

            const script = document.createElement("script");
            script.src = "../dashboard/dashboard.js";
            script.setAttribute("data-dynamic", "true");

            script.onload = () => {
                if (typeof initDashboard === "function") {
                    initDashboard();
                } else {
                    console.error("initDashboard não encontrada");
                }
            };

            document.body.appendChild(script);
            return;
        }

        // ---------- PADRÃO ----------
        contentArea.innerHTML = `
            <div class="card">
                <h2>${sectionTitle.textContent}</h2>
                <p>Página de <strong>${section}</strong>.</p>
            </div>
        `;
    });
});

function carregarLib(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

logoutBtn?.addEventListener("click", () => {
    logoutModal?.classList.add("show");
});

cancelLogout?.addEventListener("click", () => {
    logoutModal?.classList.remove("show");
});

confirmLogout?.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../Login/login.html";
});

const session_timeout = 60 * 60 * 1000;
let sessionTimer;

function encerrarSessaoPorInatividade() {
    localStorage.clear();

    const modal = document.getElementById("sessionExpiredModal");
    const btn = document.getElementById("sessionLoginBtn");

    modal?.classList.add("show");

    btn?.addEventListener("click", () => {
        window.location.href = "../Login/login.html";
    });
}

function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(encerrarSessaoPorInatividade, session_timeout);
}

const collapseBtn = document.getElementById("collapseBtn");
const sidebarEl = document.getElementById("sidebar");

if (collapseBtn && sidebarEl) {
    const isCollapsed = sidebarEl.classList.contains("collapsed");
    collapseBtn.setAttribute("aria-expanded", String(!isCollapsed));
    collapseBtn.title = isCollapsed ? "Expandir menu" : "Recolher menu";

    collapseBtn.addEventListener("click", () => {
        const nowCollapsed = sidebarEl.classList.toggle("collapsed");
        collapseBtn.setAttribute("aria-expanded", String(!nowCollapsed));
        collapseBtn.title = nowCollapsed ? "Expandir menu" : "Recolher menu";
    });
} else {
    console.warn("collapseBtn ou sidebar não encontrado.");
}

logoutModal?.addEventListener("click", (e) => {
  if (e.target === logoutModal) {
    logoutModal.classList.remove("show");
  }
});

function gerarIniciais(nome) {

    if (!nome) return "U";

    const partes = nome.trim().split(" ");

    if (partes.length === 1) {
        return partes[0].substring(0,2).toUpperCase();
    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();
}


function gerarCor(nome){

    let hash = 0;

    for(let i = 0; i < nome.length; i++){
        hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;

    return `hsl(${hue},70%,45%)`;
}

["click", "mousemove", "keydow", "scroll", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, resetSessionTimer);
});

resetSessionTimer();