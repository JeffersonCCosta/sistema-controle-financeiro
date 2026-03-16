console.log("JS de receitas carregado");
let receitasData = [];

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
    const tabelaExiste = document.getElementById("tabela-receitas");
    if (!tabelaExiste) return;

    try {
        const userId = sessionStorage.getItem("selectedUserId");
        const resp = await fetch(`${window.API.RECEITAS}/usuario/${userId}`);
        const receitas = await resp.json();

        receitasData = receitas;
        preencherTabelaReceitas(receitasData);
    } catch (e) {
        showAlert("Erro ao carregar receitas", "error");
        console.error(e);
    }
}

function preencherTabelaReceitas(lista) {
    const tabela = document.getElementById("tabela-receitas");

    lista.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (!tabela) {
    console.warn("tabela-receitas não encontrada (tela de despesas não está carregada).");
    return;
    }

    tabela.innerHTML = "";

    lista.forEach((r, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${r.descricao}</td>
            <td>${Number(r.valor).toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'})}</td>
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

    const userId = sessionStorage.getItem("selectedUserId");
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

function configurarToggleReceita() {
    const toggle = document.getElementById("toggleReceita");
    const conteudo = document.getElementById("conteudoReceita");
    const icone = document.getElementById("iconeReceita");

    if(!toggle || !conteudo || !icone) return;

    toggle.addEventListener("click", () => {
        const estaOculto = conteudo.classList.toggle("hidden");
        icone.textContent = estaOculto ? "➕" : "➖" ;
    });
}

function filtrarReceitasPorData() {
    const dataInicio = document.getElementById("filtroDataInicio").value;
    const dataFim = document.getElementById("filtroDataFim").value;

    if(dataInicio > dataFim){
        showAlert("A data inicial não pode ser maior que a data final", "error")
        return;
    }

    let listaFiltrada = [...receitasData];

    if(dataInicio) {
        listaFiltrada = listaFiltrada.filter(r => r.data >= dataInicio);
    }

    if(dataFim) {
        listaFiltrada = listaFiltrada.filter(r => r.data <= dataFim);
    }

    preencherTabelaReceitas(listaFiltrada);
}

function limparFiltroReceitas() {
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";

    preencherTabelaReceitas(receitasData);
}

function configurarFiltrosReceitas() {
    const btnFiltrar = document.getElementById("btnFiltrarReceitas");
    const btnLimpar = document.getElementById("btnLimparFiltroReceitas");

    /* FILTRAR ALTOMATICAMENTE
    const dataInicio = document.getElementById("filtroDataInicio");
    const dataFim = document.getElementById("filtroDataFim");

    dataInicio.getElementById("filtroDataInicio").addEventListener("change", filtrarReceitasPorData);
    dataFim.getElementById("filtroDataFim").addEventListener("change", filtrarReceitasPorData);
    */
    if(btnFiltrar) {
        btnFiltrar.addEventListener("click", filtrarReceitasPorData);
    }

    if(btnLimpar) {
        btnLimpar.addEventListener("click", limparFiltroReceitas);
    }
}

function initReceitas() {
    console.log("INIT RECEITAS EXECUTOU");

    carregarCategorias();
    carregarReceitas();
    configurarToggleReceita();
    configurarFiltrosReceitas();

    const form = document.getElementById("formReceita");
    if (!form) {
        console.warn("Form de receita não encontrado");
        return;
    }
}
