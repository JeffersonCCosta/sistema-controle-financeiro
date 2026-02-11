let grafico = null;

(function() {
    let receitasData = [];
    let despesasData = [];

    async function carregarDashboard() {
        const userId = localStorage.getItem("selectedUserId");
        
        if (!userId) {
            console.error("Usuário não encontrado");
            mostrarErro();
            return;
        }

        try {
            const [receitas, despesas] = await Promise.all([
                fetch(`${window.API.RECEITAS}/usuario/${userId}`).then(r => {
                    if (!r.ok) throw new Error('Erro ao carregar receitas');
                    return r.json();
                }),
                fetch(`${window.API.DESPESAS}/usuario/${userId}`).then(r => {
                    if (!r.ok) throw new Error('Erro ao carregar despesas');
                    return r.json();
                })
            ]);

            // Armazena os dados para uso posterior
            receitasData = receitas;
            despesasData = despesas;

            /*
            const totalReceitas = receitas.reduce((s, r) => s + r.valor, 0);
            const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
            const saldo = totalReceitas - totalDespesas;

            // Atualiza os valores com animação
            atualizarValor("totalReceitas", totalReceitas);
            atualizarValor("totalDespesas", totalDespesas);
            atualizarValor("saldo", saldo);

            montarGrafico(totalReceitas, totalDespesas);
            mostrarTransacoesRecentes(receitas, despesas);
            */

            carregarMeses();
            carregarAnos(receitas, despesas);
            selecionarMesEAnoAtual();
            atualizarDashboardFiltrado();

            document.getElementById("selecionaMes").addEventListener("change", atualizarDashboardFiltrado);
            document.getElementById("selecionaAno").addEventListener("change", atualizarDashboardFiltrado);

        } catch (erro) {
            console.error("Erro ao carregar dashboard:", erro);
            mostrarErro();
        }
    }

    function atualizarValor(elementId, valor) {
        const elemento = document.getElementById(elementId);
        elemento.classList.remove('loading');
        elemento.textContent = formatar(valor);
        
        // Adiciona classe de animação
        elemento.style.opacity = '0';
        setTimeout(() => {
            elemento.style.transition = 'opacity 0.5s ease';
            elemento.style.opacity = '1';
        }, 100);
    }

    function formatar(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function montarGrafico(receitas, despesas) {
        const ctx = document.getElementById("graficoFinanceiro");

        if(grafico){
            grafico.destroy();
        }
        
        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    label: 'Valor (R$)',
                    data: [receitas, despesas],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',  // Verde para receitas
                        'rgba(239, 68, 68, 0.8)'     // Vermelho para despesas
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatar(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function mostrarTransacoesRecentes(receitas, despesas) {
        const container = document.getElementById('listaTransacoes');
        
        if (!container) return;

        // Combina e ordena por data (mais recentes primeiro)
        const todas = [
            ...receitas.map(r => ({ ...r, tipo: 'receita' })),
            ...despesas.map(d => ({ ...d, tipo: 'despesa' }))
        ].sort((a, b) => {
            const dataA = new Date(a.data || a.createdAt || a.dataTransacao);
            const dataB = new Date(b.data || b.createdAt || b.dataTransacao);
            return dataB - dataA;
        }).slice(0, 6); // Pega as 6 mais recentes
        
        if (todas.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280; font-size: 14px;">Nenhuma transação encontrada</p>';
            return;
        }
        
        container.innerHTML = '';
        
        todas.forEach(transacao => {
            const item = document.createElement('div');
            item.className = 'transacao-item';
            
            // Corrige problema de fuso horário
            const dataString = transacao.data || transacao.createdAt || transacao.dataTransacao;
            let dataFormatada = 'Data não disponível';
            
            try {
                if (typeof dataString === 'string' && dataString.includes('T')) {
                    // Se for ISO string (2026-01-30T00:00:00.000Z)
                    const partes = dataString.split('T')[0].split('-');
                    const data = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
                    dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                } else if (dataString) {
                    // Tenta converter direto e adiciona offset de timezone
                    const data = new Date(dataString);
                    // Adiciona o offset do timezone para compensar
                    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
                    dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                }
            } catch (e) {
                console.error('Erro ao formatar data:', e, dataString);
            }
            
            // Ícone baseado no tipo
            // Categoria pode vir como objeto {nome: "Lazer"} ou string
            const categoriaNome = typeof transacao.categoria === 'object' && transacao.categoria?.nome 
                ? transacao.categoria.nome 
                : transacao.categoria;
            
            const icone = transacao.tipo === 'receita' ? '💰' : getCategoriaIcon(categoriaNome);
            const sinal = transacao.tipo === 'receita' ? '+' : '-';
            const classe = transacao.tipo === 'receita' ? 'amount-positive' : 'amount-negative';
            
            // Usa descrição se tiver, senão usa categoria
            const titulo = transacao.descricao || categoriaNome || 'Transação';
            
            item.innerHTML = `
                <div class="transacao-info">
                    <div class="transacao-icon">${icone}</div>
                    <div class="transacao-details">
                        <h4>${titulo}</h4>
                        <p>${dataFormatada}</p>
                    </div>
                </div>
                <div class="transacao-amount ${classe}">${sinal} ${formatar(transacao.valor)}</div>
            `;
            
            container.appendChild(item);
        });
    }

    function getCategoriaIcon(categoria) {
        const icones = {
            // Alimentação
            'alimentacao': '🛒',
            'alimentação': '🛒',
            'supermercado': '🛒',
            'mercado': '🛒',
            'restaurante': '🍽️',
            'ifood': '🍔',
            
            // Transporte
            'transporte': '🚗',
            'uber': '🚗',
            'combustivel': '⛽',
            'gasolina': '⛽',
            'carro': '🚗',
            'onibus': '🚌',
            'metro': '🚇',
            
            // Moradia
            'moradia': '🏠',
            'aluguel': '🏠',
            'condominio': '🏢',
            
            // Saúde
            'saude': '💊',
            'saúde': '💊',
            'farmacia': '💊',
            'farmácia': '💊',
            'medico': '🩺',
            'médico': '🩺',
            'hospital': '🏥',
            
            // Lazer e Entretenimento
            'lazer': '🎮',
            'entretenimento': '🎮',
            'cinema': '🎬',
            'netflix': '📺',
            'streaming': '📺',
            'jogo': '🎮',
            'jogos': '🎮',
            'festa': '🎉',
            'viagem': '✈️',
            'clube':'🏊',
            
            // Educação
            'educacao': '📚',
            'educação': '📚',
            'curso': '📚',
            'livro': '📖',
            'escola': '🎓',
            'faculdade': '🎓',
            
            // Contas
            'conta': '⚡',
            'luz': '⚡',
            'energia': '⚡',
            'agua': '💧',
            'água': '💧',
            'internet': '🌐',
            'telefone': '📱',
            'celular': '📱',
            'tv': '📺',
            
            // Vestuário
            'roupa': '👕',
            'vestuario': '👕',
            'vestuário': '👕',
            'calcado': '👟',
            'calçado': '👟',
            
            // Outros
            'outros': '📌',
            'diverso': '📌'
        };
        
        if (!categoria || typeof categoria !== 'string') {
            return '💳';
        }
        
        const categoriaLower = categoria.toLowerCase().trim();
        
        // Busca exata primeiro
        if (icones[categoriaLower]) {
            return icones[categoriaLower];
        }
        
        // Busca por palavra contida
        for (const [key, icon] of Object.entries(icones)) {
            if (categoriaLower.includes(key)) {
                return icon;
            }
        }
        
        return '💳';
    }

    function mostrarErro() {
        ["totalReceitas", "totalDespesas", "saldo"].forEach(id => {
            const elemento = document.getElementById(id);
            elemento.classList.remove('loading');
            elemento.textContent = "Erro ao carregar";
            elemento.style.color = "#ef4444";
            elemento.style.fontSize = "14px";
        });

        const container = document.getElementById('listaTransacoes');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: #ef4444; font-size: 14px;">Erro ao carregar transações</p>';
        }
    }

    function carregarMeses(){
        const selectMes = document.getElementById("selecionaMes");

        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        meses.forEach((mes, index) => {
            const option = document.createElement("option");
            option.value = index + 1;
            option.textContent = mes;

            selectMes.appendChild(option);
        })
    }

    function carregarAnos(receitas, despesas){
        const selectAno = document.getElementById("selecionaAno");
        const anos = new Set();

        [...receitas,...despesas].forEach(item => {
            const data = new Date(item.data || item.createdAt || item.dataTransacao);
            anos.add(data.getFullYear());
        });

        [...anos].sort().forEach(ano => {
            const option = document.createElement("option");
            option.value = ano;
            option.textContent = ano;

            selectAno.appendChild(option);
        })
    }

    function selecionarMesEAnoAtual(){
        const hoje = new Date();

        document.getElementById("selecionaMes").value = hoje.getMonth() + 1;
        document.getElementById("selecionaAno").value = hoje.getFullYear();
    }

    function filtrarPorMesEAno(lista, mes, ano){
        return lista.filter(item => {
            const data = new Date(item.data || item.createdAt || item.dataTransacao);
            return (
                data.getMonth() + 1 ===Number(mes) &&
                data.getFullYear() ===Number(ano)
            );
        });
    }

    function atualizarDashboardFiltrado(){
        const mes = document.getElementById("selecionaMes").value;
        const ano = document.getElementById("selecionaAno").value;

        if(!mes || !ano) return;

        const receitasFiltradas = filtrarPorMesEAno(receitasData, mes, ano);
        const despesasFiltradas = filtrarPorMesEAno(despesasData, mes, ano);

        const totalReceitas = receitasFiltradas.reduce((s, r) => s + r.valor, 0);
        const totalDespesas = despesasFiltradas.reduce((s, d) => s + d.valor, 0);
        const saldo = totalReceitas - totalDespesas;
        
        atualizarValor("totalReceitas", totalReceitas);
        atualizarValor("totalDespesas", totalDespesas);
        atualizarValor("saldo", saldo);
        
        montarGrafico(totalReceitas, totalDespesas);
        mostrarTransacoesRecentes(receitasFiltradas, despesasFiltradas);
    }

    window.initDashboard = carregarDashboard;
    
})();