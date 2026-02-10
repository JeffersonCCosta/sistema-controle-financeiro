console.log("JS de receitas carregado");

// Buscar Categorias
async function carregarCategorias() {
    const select = document.getElementById("categoria");
    select.innerHTML = '<option value="">Selecione</option>';

    try {
        const resp = await fetch(window.API.CATEGORIAS);
        const categorias = await resp.json();

        categorias
            .filter(c => c.tipo === "Entrada")
            .forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.nome;
                select.appendChild(option);
            });

    } catch (e) {
        showAlert("Erro ao carregar categorias", "error");
        console.error(e);
    }
}

// Listar Receitas
async function carregarReceitas() {
    try {
        const userId = localStorage.getItem("selectedUserId");
        const resp = await fetch(`${window.API.RECEITAS}/usuario/${userId}`);
        const receitas = await resp.json();
        preencherTabelaReceitas(receitas);
    } catch (e) {
        showAlert("Erro ao carregar receitas", "error");
        console.error(e);
    }
}

function preencherTabelaReceitas(lista) {
    const tabela = document.getElementById("tabela-receitas");
    tabela.innerHTML = "";

    lista.forEach((r, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${r.descricao}</td>
            <td>${Number(r.valor).toFixed(2)}</td>
            <td>${formatarData(r.data)}</td>
            <td>${r.categoria?.nome ?? "-"}</td>
            <td>${r.observacao ?? ""}</td>
            <td>
                <button class="btn-editar" onclick="abrirModalEditarReceita(${r.id})">Editar</button>
                <button class="btn-excluir" onclick="abrirModalExcluirReceita(${r.id})">Excluir</button>
            </td>
        `;

        tabela.appendChild(tr);
    });
}

// Cadastrar Receitas
document.getElementById("formReceita").addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("selectedUserId");
    const receita = {
        descricao: descricao.value,
        valor: valor.value,
        data: data.value,
        categoria: {
            id: categoria.value
        },
        observacao: observacao.value,
        usuario: {
            id: userId
        }
    };

    try {
        const resp = await fetch(window.API.RECEITAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(receita)
        });

        if (!resp.ok) {
            showAlert("Erro ao cadastrar receita", "error");
            return;
        }

        showAlert("Receita cadastrada com sucesso!", "success");
        this.reset();
        carregarReceitas();

    } catch (e) {
        showAlert("Erro de conexão", "error");
        console.error(e);
    }
});

// Modal de Edição
async function abrirModalEditarReceita(id) {
    const resp = await fetch(`${window.API.RECEITAS}/${id}`);
    const r = await resp.json();

    editarId.value = r.id;
    editarDescricao.value = r.descricao;
    editarValor.value = r.valor;
    editarData.value = r.data;
    editarObservacao.value = r.observacao;

    // 🔥 carregar categorias ANTES de abrir o modal
    await carregarCategoriasSelectEdicao(r.categoria.id);
    modalEditarReceita.classList.add("show");
}

async function salvarEdicaoReceita() {
    const id = editarId.value;

    const receita = {
        descricao: editarDescricao.value,
        valor: editarValor.value,
        data: editarData.value,
        categoria: { id: editarCategoria.value },
        observacao: editarObservacao.value
    };

    const resp = await fetch(`${window.API.RECEITAS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receita)
    });

    if (resp.ok) {
        showAlert("Receita atualizada!", "success");
        fecharModalEditarReceita();
        carregarReceitas();
    } else {
        showAlert("Erro ao atualizar receita", "error");
    }
}

// Excluir Receita
window.receitaParaExcluir = null;

function abrirModalExcluirReceita(id) {
    window.receitaParaExcluir = id;
    modalExcluirReceita.classList.add("show");
}

async function confirmarExclusaoReceita() {
    if (!window.receitaParaExcluir) return;

    const resp = await fetch(`${window.API.RECEITAS}/${window.receitaParaExcluir}`, {
        method: "DELETE"
    });

    if (resp.ok) {
        showAlert("Receita excluída!", "success");
        carregarReceitas();
    } else {
        showAlert("Erro ao excluir receita", "error");
    }

    fecharModalExcluirReceita();
}

function fecharModalEditarReceita() {
    modalEditarReceita.classList.remove("show");
}

function fecharModalExcluirReceita() {
    modalExcluirReceita.classList.remove("show");
    window.receitaParaExcluir = null;
}

function formatarData(dataStr) {
    if (!dataStr) return "";

    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}

function initReceitas() {
    console.log("INIT RECEITAS EXECUTOU");

    carregarCategorias();
    carregarReceitas();

    const form = document.getElementById("formReceita");
    if (!form) {
        console.warn("Form de receita não encontrado");
        return;
    }
}
