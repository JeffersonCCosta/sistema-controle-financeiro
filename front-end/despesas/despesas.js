console.log("JS de despesas carregado");
let despesasData = [];

// Buscar Categorias
async function carregarCategorias() {
    const select = document.getElementById("categoria");

    try {
        const resp = await fetch (window.API.CATEGORIAS);
        const categorias = await resp.json();

        categorias.filter(c => c.tipo ==="Saida").forEach(cat => {
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

// Listar Despesas
async function carregarDespesas() {
    const tabelaExiste = document.getElementById("tabela-despesas");
    if (!tabelaExiste) return;

    try {
        const userId = localStorage.getItem("selectedUserId");
        const resp = await fetch (`${window.API.DESPESAS}/usuario/${userId}`);
        const despesas = await resp.json();

        despesasData = despesas;
        preencherTabelaDespesas(despesasData);
    } catch (e) {
        showAlert("Erro ao carregar despesas", "error");
        console.error(e);
    }
}

function preencherTabelaDespesas(lista) {
    const tabela = document.getElementById("tabela-despesas");

    lista.sort((a, b) => new Date(b.data) - new Date(a.data));

    if(!tabela){
        console.warn("tabela-despesas não encontrada (tela de despesas não está carregada).");
        return;
    }

    tabela.innerHTML = "";

    lista.forEach((d, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${d.descricao}</td>
            <td>${Number(d.valor).toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'})}</td>
            <td>${formatarData(d.data)}</td>
            <td>${d.categoria.nome}</td>
            <td>${d.observacao ?? ""}</td>
            <td>
                <button class="btn-editar" onclick="abrirModalEditarDespesa(${d.id})">Editar</button>
                <button class="btn-excluir" onclick="abrirModalExcluirDespesa(${d.id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}
   
// Cadastrar Receita
    document.getElementById("formDespesa").addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("SUBMIT FUNCIONOU");
        
        const userId = localStorage.getItem("selectedUserId");
        const despesa = {
            descricao: document.getElementById("descricao").value,
            valor: document.getElementById("valor").value,
            data: document.getElementById("data").value,
            categoria: {
                id: document.getElementById("categoria").value
            },
            observacao: document.getElementById("observacao").value,
            usuario: {
                id: userId
            }
        };

        try {
            const resp = await fetch (window.API.DESPESAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(despesa)
            });

            if (!resp.ok){
                showAlert("Erro ao cadastrar Despesa.", "error");
                return;
            }

            showAlert("Despesa cadastrada com sucesso!", "success");
            this.reset();
            carregarDespesas();
        } catch (e) {
            showAlert("Erro ao conectar no servidor.", "error");
            console.error(e);
        }
    });

// Modal de Edição
async function abrirModalEditarDespesa(id) {
    const resp = await fetch(`${window.API.DESPESAS}/${id}`);
    const d = await resp.json();

    document.getElementById("editarId").value = d.id;
    document.getElementById("editarDescricao").value = d.descricao;
    document.getElementById("editarValor").value = d.valor;
    document.getElementById("editarData").value = d.data;
    document.getElementById("editarObservacao").value = d.observacao;

    // 🔥 carregar categorias ANTES de abrir o modal
    await carregarCategoriasSelectEdicao(d.categoria.id);

    document
        .getElementById("modalEditarDespesa")
        .classList.add("show");
}


async function salvarEdicaoDespesa() {
    const id = document.getElementById("editarId").value;

    const despesa = {
        descricao: document.getElementById("editarDescricao").value,
        valor: parseFloat(document.getElementById("editarValor").value),
        data: document.getElementById("editarData").value,
        categoria: {
            id: document.getElementById("editarCategoria").value
        },
        observacao: document.getElementById("editarObservacao").value
    };

    const resp = await fetch(`${window.API.DESPESAS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesa)
    });

    if (resp.ok) {
        showAlert("Despesa atualizada!", "success");
        fecharModalEditarDespesa();
        carregarDespesas();
    } else {
        showAlert("Erro ao atualizar despesa", "error");
    }
}

// Excluir Despesa
window.despesaParaExcluir = null;

function abrirModalExcluirDespesa(id) {
    window.despesaParaExcluir = id;

    const modal = document.getElementById("modalExcluirDespesa");
    if (!modal) {
        console.error("Modal de exclusão não encontrado no DOM");
        return;
    }

    modal.classList.add("show");
}


async function confirmarExclusaoDespesa() {
    if (!window.despesaParaExcluir) return;

    const resp = await fetch(`${window.API.DESPESAS}/${window.despesaParaExcluir}`, {
        method: "DELETE"
    });

    if (resp.ok) {
        showAlert("Despesa excluída!", "success");
        carregarDespesas();
    } else {
        showAlert("Erro ao excluir despesa", "error");
    }

    fecharModalExcluirDespesa();
}

function fecharModalEditarDespesa() {
    document
        .getElementById("modalEditarDespesa")
        .classList.remove("show");
}

function fecharModalExcluirDespesa() {
    const modal = document.getElementById("modalExcluirDespesa");
    if (modal) {
        modal.classList.remove("show");
    }

    window.despesaParaExcluir = null;
}


async function carregarCategoriasSelectEdicao(idSelecionado) {
    const select = document.getElementById("editarCategoria");
    select.innerHTML = "";

    try {
        const resp = await fetch(window.API.CATEGORIAS);
        const categorias = await resp.json();

        categorias.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.nome;

            if (c.id === idSelecionado) {
                option.selected = true;
            }

            select.appendChild(option);
        });

    } catch (e) {
        showAlert("Erro ao carregar categorias", "error");
        console.error(e);
    }
}

function formatarData(dataStr) {
    if (!dataStr) return "";

    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}
function configurarToggleDespesa() {
    const toggle = document.getElementById("toggleDespesa");
    const conteudo = document.getElementById("conteudoDespesa");
    const icone = document.getElementById("iconeDespesa");
    
    if (!toggle || !conteudo || !icone) return;

    toggle.addEventListener("click", () => {
        const estaOculto = conteudo.classList.toggle("hidden");
        icone.textContent = estaOculto ? "➕" : "➖";
    });
}

function filtrarDespesasPorData() {
    const dataInicio = document.getElementById("filtroDataInicio").value;
    const dataFim = document.getElementById("filtroDataFim").value;

    if(dataInicio > dataFim){
        showAlert("A data inicial não pode ser maior que a data final", "error")
        return;
    }

    let listaFiltrada = [...despesasData];

    if(dataInicio) {
        listaFiltrada = listaFiltrada.filter(r => r.data >= dataInicio);
    }

    if(dataFim) {
        listaFiltrada = listaFiltrada.filter(r => r.data <= dataFim);
    }

    preencherTabelaDespesas(listaFiltrada);
}

function limparFiltroDespesas() {
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";

    preencherTabelaDespesas(despesasData);
}

function configurarFiltrosDespesas() {
    const btnFiltrar = document.getElementById("btnFiltrarDespesas");
    const btnLimpar = document.getElementById("btnLimparFiltroDespesas");

        if(btnFiltrar) {
        btnFiltrar.addEventListener("click", filtrarDespesasPorData);
    }

    if(btnLimpar) {
        btnLimpar.addEventListener("click", limparFiltroDespesas);
    }
}

function initDespesas() {
    console.log("INIT DESPESAS EXECUTOU");

    carregarCategorias();
    carregarDespesas();
    configurarToggleDespesa();
    configurarFiltrosDespesas();

    const form = document.getElementById("formDespesa");
    if (!form) {
        console.warn("Form de despesas não encontrado");
        return;
    }
}
