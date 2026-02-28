function showAlert(message, type = "success") {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${type}`;
    alerta.innerText = message;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

//função para buscar do banco
async function carregarCategorias() {
    const tabelaExiste = document.getElementById("tabela-categorias");
    if (!tabelaExiste) return;

    try {
        const response = await fetch(window.API.CATEGORIAS);
        const categorias = await response.json();
        
        preencherTabela(categorias);
    } catch (erro) {
        console.error("Erro ao buscar as categorias.", erro);
    }
}

function preencherTabela(lista) {
    const tabela = document.getElementById("tabela-categorias");

    if (!tabela) {
    console.warn("tabela-categorias não encontrada (tela de despesas não está carregada).");
    return;
    }

    tabela.innerHTML = "";

    lista.forEach((cat, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${index + 1}</td>
            <td>${cat.nome}</td>
            <td>${cat.tipo}</td>
            <td>${formatarData(cat.criadoEm)}</td>
            <td>
                <button class="btn-editar" onclick="abrirModalEditar(${cat.id}, '${cat.nome}', '${cat.tipo}')">Editar</button>
                <button class="btn-excluir" onclick="abrirModalExcluir(${cat.id})">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

document.getElementById("formCadastro")
    .addEventListener("submit",async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const tipo = document.getElementById("tipo").value;

        const categoria = {
            nome:nome,
            tipo:tipo
        };

        try {
            const response = await fetch(window.API.CATEGORIAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoria)
            });

            if(!response.ok) {
                showAlert("Erro ao cadastrar categoria!", "error");
                return;
            }

            showAlert("Categoria cadastrada!", "success");
            document.getElementById("formCadastro").reset();
            carregarCategorias();
        } catch (error) {
            showAlert("Erro ao conectar ao servidor.", "error");
            console.error(error);
        }
    });

async function salvarEdicao() {
    const id = document.getElementById("editarId").value;
    const nome = document.getElementById("editarNome").value;
    const tipo = document.getElementById("editarTipo").value;
    const categoria = {nome, tipo};

    const response = await fetch (`${window.API.CATEGORIAS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria)

    });

    if (response.ok) {
        showAlert("Categoria atualizada!", "success");
        fecharModalEditar();
        carregarCategorias();
    } else {
        showAlert("Erro ao atualizar categoria!", "error");
    }
}


function abrirModalEditar(id, nome, tipo){
    document.getElementById("editarId").value = id;
    document.getElementById("editarNome").value = nome;
    document.getElementById("editarTipo").value = tipo;
    document.getElementById("modalEditar").classList.add("show");
}

function fecharModalEditar(){
    document.getElementById("modalEditar").classList.remove("show");
}

window.categoriaParaDeletar = null;

function abrirModalExcluir(id) {
    window.categoriaParaDeletar = id;
    document.getElementById("modalExcluir").classList.add("show");
}

function cancelarExclusao() {
    window.categoriaParaDeletar = null;
    document.getElementById("modalExcluir").classList.remove("show");
}

async function confirmarExclusao() {
    if (!window.categoriaParaDeletar) return;

    try {
        const resp = await fetch(`${window.API.CATEGORIAS}/${window.categoriaParaDeletar}`, {
            method: "DELETE"
        });

        if (!resp.ok) {
            throw new Error("Erro ao deletar categoria", "error");
        }

        showAlert("Categoria excluida com sucesso!", "success");
        cancelarExclusao();
        carregarCategorias();

    } catch (error) {
        showAlert("Não foi possível excluir.", "error");
        console.error(error);
    }
}

function formatarData(isoString) {
    const data = new Date(isoString);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}



document.addEventListener("DOMContentLoaded", carregarCategorias);