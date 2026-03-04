const usuario = localStorage.getItem("usuarioLogado");
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
        console.log("usuario vindo do localStorage:", usuario);
        //console.log("elemento #userAvatar:", document.getElementById("userAvatar"));
        carregarAvatar(usuarioRaw);

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

logoutBtn.addEventListener("click", () => {
    logoutModal.classList.add("show");
});

cancelLogout.addEventListener("click", () => {
    logoutModal.classList.remove("show");
});

confirmLogout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../Login/login.html";
});

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

logoutModal.addEventListener("click", (e) => {
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


function carregarAvatar(usuario){

    const avatarEl = document.getElementById("userAvatar");

    if(!avatarEl) return;

    const nome = usuario?.nome || usuario?.email || "Usuário";

    const iniciais = gerarIniciais(nome);

    avatarEl.innerText = iniciais;
    avatarEl.style.background = gerarCor(nome);

}