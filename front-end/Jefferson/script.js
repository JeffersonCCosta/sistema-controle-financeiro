const menuButtons = document.querySelectorAll(".menu-item");
const sectionTitle = document.getElementById("sectionTitle");
const contentArea = document.getElementById("contentArea");
const sidebar = document.querySelector(".sidebar");
const toggleMenu = document.getElementById("toggleMenu");

// Alterna o menu no mobile
toggleMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// Eventos de navegação
menuButtons.forEach(btn => {
    btn.addEventListener("click", async () => {

    menuButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const section = btn.dataset.section;
    sectionTitle.textContent =
        section.charAt(0).toUpperCase() + section.slice(1);

    if (section === "categorias") {
    const html = await fetch("../categorias/categorias.html")
        .then(res => res.text());

    // 1️⃣ Carrega o HTML na tela
    contentArea.innerHTML = html;

    // 2️⃣ Remove scripts antigos carregados dinamicamente
    document.querySelectorAll("script[data-dynamic]").forEach(s => s.remove());

    // 3️⃣ Cria um novo script e adiciona na página
    const script = document.createElement("script");
    script.src = "../categorias/categorias.js";
    script.setAttribute("data-dynamic", "true");

    // 4️⃣ Quando o script terminar de carregar, executa carregarCategorias()
    script.onload = () => {
        if (typeof carregarCategorias === "function") {
            carregarCategorias();
        }
    };

    document.body.appendChild(script);

    return; // impede a parte de conteúdo padrão rodar
    }

    if (section === "despesas") {
    const html = await fetch("../despesas/despesas.html")
        .then(res => res.text());

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

    
    if (section === "receitas") {
    const html = await fetch("../receitas/receitas.html")
        .then(res => res.text());

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


    if (section === "dashboard") {
    const html = await fetch("../dashboard/dashboard.html")
        .then(res => res.text());

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

    // Conteúdo padrão
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
            resolve(); // já carregado
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}


// Logout temporário
document.getElementById("logout").addEventListener("click", () => {
    window.location.href = "../Principal/principal.html";
});

// pega elementos
const collapseBtn = document.getElementById("collapseBtn");
const sidebarEl = document.getElementById("sidebar");

// função segura para inicializar comportamento de colapso
if (collapseBtn && sidebarEl) {
  // inicial: garantir estado coerente (se tiver classe no HTML)
  const isCollapsed = sidebarEl.classList.contains("collapsed");
  collapseBtn.setAttribute("aria-expanded", String(!isCollapsed));
  collapseBtn.title = isCollapsed ? "Expandir menu" : "Recolher menu";

  collapseBtn.addEventListener("click", () => {
    const nowCollapsed = sidebarEl.classList.toggle("collapsed");
    // atualiza atributo e tooltip
    collapseBtn.setAttribute("aria-expanded", String(!nowCollapsed));
    collapseBtn.title = nowCollapsed ? "Expandir menu" : "Recolher menu";
  });
} else {
  // debugging leve — útil durante desenvolvimento
  console.warn("collapseBtn ou sidebar não encontrado. Verifique se o HTML tem <button id='collapseBtn'> e <aside id='sidebar'>.");
}
