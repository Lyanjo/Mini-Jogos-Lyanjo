// Lista de palavras do jogo
const PALAVRAS = [
    // Frutas
    "BANANA", "MAÇÃ", "LARANJA", "UVA", "MELANCIA",
    "MORANGO", "ABACAXI", "MANGA", "PÊRA", "LIMÃO",
    "MAMÃO", "KIWI", "MELÃO", "AMORA", "FRAMBOESA",
    
    // Animais
    "CACHORRO", "GATO", "ELEFANTE", "LEÃO", "TIGRE",
    "URSO", "COELHO", "RAPOSA", "LOBO", "GIRAFA",
    "ZEBRA", "MACACO", "PANDA", "PINGUIM", "GOLFINHO",
    
    // Esportes e Lazer
    "FUTEBOL", "BASQUETE", "VÔLEI", "TÊNIS", "NATAÇÃO",
    "CORRIDA", "CICLISMO", "SKATE", "SURF", "YOGA",
    
    // Comidas
    "PIZZA", "HAMBÚRGUER", "SUSHI", "TACOS", "LASANHA",
    "MACARRÃO", "ARROZ", "FEIJÃO", "SALADA", "SOPA",
    "SANDUÍCHE", "PASTEL", "COXINHA", "BRIGADEIRO", "PUDIM",
    
    // Lugares
    "PRAIA", "MONTANHA", "FLORESTA", "DESERTO", "OCEANO",
    "VULCÃO", "GELEIRA", "CAVERNA", "ILHA", "LAGO",
    "CACHOEIRA", "CAMPO", "CIDADE", "VILA", "ALDEIA",
    
    // Construções
    "CASTELO", "PONTE", "TÚNEL", "FAROL", "MOINHO",
    "TORRE", "PIRÂMIDE", "TEMPLO", "IGLU", "CABANA",
    
    // Estabelecimentos
    "ESCOLA", "HOSPITAL", "BIBLIOTECA", "MUSEU", "TEATRO",
    "CINEMA", "CIRCO", "ZOOLÓGICO", "AQUÁRIO", "PARQUE",
    "SHOPPING", "AEROPORTO", "ESTAÇÃO", "RESTAURANTE", "PADARIA",
    "FARMÁCIA", "BANCO", "HOTEL", "MERCADO", "ACADEMIA",
    
    // Tecnologia
    "COMPUTADOR", "TELEFONE", "TABLET", "MOUSE", "TECLADO",
    "MONITOR", "CÂMERA", "DRONE", "ROBÔ", "SATÉLITE",
    
    // Música
    "VIOLÃO", "PIANO", "BATERIA", "FLAUTA", "SAXOFONE",
    "TROMPETE", "HARPA", "VIOLINO", "GUITARRA", "BAIXO",
    
    // Natureza
    "NUVEM", "ESTRELA", "SOL", "LUA", "ARCO-ÍRIS",
    "TROVÃO", "RELÂMPAGO", "NEVE", "CHUVA", "VENTO",
    
    // Veículos
    "CARRO", "BICICLETA", "MOTO", "ÔNIBUS", "TREM",
    "AVIÃO", "HELICÓPTERO", "NAVIO", "BARCO", "SUBMARINO",
    
    // Objetos do Dia a Dia
    "LIVRO", "CADERNO", "CANETA", "LÁPIS", "MOCHILA",
    "RELÓGIO", "ÓCULOS", "CHAVE", "CARTEIRA", "GUARDA-CHUVA",
    
    // Bebidas
    "CAFÉ", "CHÁ", "SUCO", "REFRIGERANTE", "ÁGUA",
    "LEITE", "VITAMINA", "SMOOTHIE", "LIMONADA", "CHOCOLATE QUENTE",
    
    // Doces
    "CHOCOLATE", "SORVETE", "BOLO", "BISCOITO", "CUPCAKE",
    "TORTA", "BROWNIE", "COOKIE", "BOMBOM", "PIRULITO"
];

// Estado do jogo
let jogadores = [];
let pontuacoes = {};
let palavraAtual = null;
let impostorAtual = null;
let indiceJogadorAtual = 0;

// Elementos DOM - Tela Configuração
const telaConfiguracao = document.getElementById('tela-configuracao');
const inputNomeJogador = document.getElementById('input-nome-jogador');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaJogadores = document.getElementById('lista-jogadores');
const contadorJogadores = document.getElementById('contador-jogadores');
const btnIniciar = document.getElementById('btn-iniciar');

// Elementos DOM - Tela Revelação
const telaRevelacao = document.getElementById('tela-revelacao');
const nomeJogadorAtual = document.getElementById('nome-jogador-atual');
const btnRevelar = document.getElementById('btn-revelar');
const areaImpostor = document.getElementById('area-impostor');
const areaPalavra = document.getElementById('area-palavra');
const palavraRevelada = document.getElementById('palavra-revelada');
const btnProximo = document.getElementById('btn-proximo');
const progressoAtual = document.getElementById('progresso-atual');
const progressoTotal = document.getElementById('progresso-total');

// Elementos DOM - Tela Embate
const telaEmbate = document.getElementById('tela-embate');
const btnSortear = document.getElementById('btn-sortear');
const roletaNome = document.getElementById('roleta-nome');
const roletaSeta = document.getElementById('roleta-seta');
const resultadoSorteio = document.getElementById('resultado-sorteio');
const primeiroJogadorSpan = document.getElementById('primeiro-jogador');
const sentidoRodadaSpan = document.getElementById('sentido-rodada');
const btnIrPontuacao = document.getElementById('btn-ir-pontuacao');

// Elementos DOM - Tela Pontuação
const telaPontuacao = document.getElementById('tela-pontuacao');
const nomeImpostor = document.getElementById('nome-impostor');
const palavraPartida = document.getElementById('palavra-partida');
const btnPontuarVerdadeiros = document.getElementById('btn-pontuar-verdadeiros');
const btnPontuarImpostor = document.getElementById('btn-pontuar-impostor');
const corpoPlacar = document.getElementById('corpo-placar');
const btnNovaRodada = document.getElementById('btn-nova-rodada');
const btnTerminarJogo = document.getElementById('btn-terminar-jogo');

// Elementos DOM - Tela Pódio
const telaPodio = document.getElementById('tela-podio');
const nomePrimeiro = document.getElementById('nome-primeiro');
const pontosPrimeiro = document.getElementById('pontos-primeiro');
const nomeSegundo = document.getElementById('nome-segundo');
const pontosSegundo = document.getElementById('pontos-segundo');
const nomeTerceiro = document.getElementById('nome-terceiro');
const pontosTerceiro = document.getElementById('pontos-terceiro');
const outrosJogadores = document.getElementById('outros-jogadores');
const btnNovoJogo = document.getElementById('btn-novo-jogo');

// Funções auxiliares
function obterPalavraAleatoria() {
    return PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
}

function obterImpostorAleatorio() {
    return jogadores[Math.floor(Math.random() * jogadores.length)];
}

function trocarTela(telaAtual, telaNova) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    telaNova.classList.add('ativa');
}

// Adicionar jogador
function adicionarJogador() {
    const nome = inputNomeJogador.value.trim();
    
    if (nome === '') {
        alert('Por favor, digite um nome!');
        return;
    }
    
    if (jogadores.includes(nome)) {
        alert('Este nome já foi adicionado!');
        return;
    }
    
    jogadores.push(nome);
    
    // Inicializar pontuação
    if (!pontuacoes[nome]) {
        pontuacoes[nome] = 0;
    }
    
    inputNomeJogador.value = '';
    inputNomeJogador.focus();
    
    atualizarListaJogadores();
}

// Atualizar lista de jogadores
function atualizarListaJogadores() {
    listaJogadores.innerHTML = '';
    
    jogadores.forEach((jogador, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="jogador-nome">${jogador}</span>
            <button class="btn-remover" onclick="removerJogador(${index})">✕</button>
        `;
        listaJogadores.appendChild(li);
    });
    
    contadorJogadores.textContent = jogadores.length;
    btnIniciar.disabled = jogadores.length < 3;
}

// Remover jogador
function removerJogador(index) {
    const nomeRemovido = jogadores[index];
    jogadores.splice(index, 1);
    delete pontuacoes[nomeRemovido];
    atualizarListaJogadores();
}

// Iniciar partida
function iniciarPartida() {
    if (jogadores.length < 3) {
        alert('São necessários pelo menos 3 jogadores!');
        return;
    }
    
    // Escolher palavra e impostor
    palavraAtual = obterPalavraAleatoria();
    impostorAtual = obterImpostorAleatorio();
    indiceJogadorAtual = 0;
    
    // Ir para tela de revelação
    prepararRevelacao();
}

// Preparar revelação para o jogador atual
function prepararRevelacao() {
    const jogadorAtual = jogadores[indiceJogadorAtual];
    
    nomeJogadorAtual.textContent = jogadorAtual;
    progressoAtual.textContent = indiceJogadorAtual + 1;
    progressoTotal.textContent = jogadores.length;
    
    // Esconder áreas de revelação
    areaImpostor.classList.add('escondido');
    areaPalavra.classList.add('escondido');
    btnProximo.classList.add('escondido');
    btnRevelar.classList.remove('escondido');
    
    trocarTela(telaConfiguracao, telaRevelacao);
}

// Revelar palavra para o jogador atual
function revelarPalavra() {
    const jogadorAtual = jogadores[indiceJogadorAtual];
    
    btnRevelar.classList.add('escondido');
    btnProximo.classList.remove('escondido');
    
    if (jogadorAtual === impostorAtual) {
        // Mostrar que é o impostor
        areaImpostor.classList.remove('escondido');
        areaPalavra.classList.add('escondido');
    } else {
        // Mostrar a palavra
        areaPalavra.classList.remove('escondido');
        areaImpostor.classList.add('escondido');
        palavraRevelada.textContent = palavraAtual;
    }
    
    // Atualizar texto do botão
    if (indiceJogadorAtual < jogadores.length - 1) {
        btnProximo.textContent = 'Próximo Jogador →';
    } else {
        btnProximo.textContent = 'Ir para Pontuação';
    }
}

// Próximo jogador
function proximoJogador() {
    indiceJogadorAtual++;
    
    if (indiceJogadorAtual < jogadores.length) {
        // Ainda há jogadores para ver a palavra
        prepararRevelacao();
    } else {
        // Todos viram, ir para tela de embate/sorteio
        trocarTela(telaRevelacao, telaEmbate);
        prepararSorteio();
    }
}

// Preparar tela de sorteio
function prepararSorteio() {
    roletaNome.textContent = '?';
    roletaSeta.textContent = '⟳';
    btnSortear.disabled = false;
    btnSortear.classList.remove('escondido');
    resultadoSorteio.classList.add('escondido');
    roletaNome.classList.remove('girando');
    roletaSeta.classList.remove('girando');
}

// Sortear primeiro jogador e sentido
function sortearRodada() {
    btnSortear.disabled = true;
    
    // Adicionar animação de girar
    roletaNome.classList.add('girando');
    roletaSeta.classList.add('girando');
    
    let contador = 0;
    const totalGiros = 20; // Número de trocas antes de parar
    const intervalo = 100; // Milissegundos entre cada troca
    
    const intervalId = setInterval(() => {
        // Sortear jogador aleatório para mostrar
        const jogadorAleatorio = jogadores[Math.floor(Math.random() * jogadores.length)];
        roletaNome.textContent = jogadorAleatorio;
        
        contador++;
        
        if (contador >= totalGiros) {
            clearInterval(intervalId);
            
            // Sortear o jogador final
            const primeiroJogador = jogadores[Math.floor(Math.random() * jogadores.length)];
            roletaNome.textContent = primeiroJogador;
            
            // Sortear sentido (horário ou anti-horário)
            const sentidos = ['⟳ Horário', '⟲ Anti-horário'];
            const sentidoSorteado = sentidos[Math.floor(Math.random() * sentidos.length)];
            
            // Remover animação
            roletaNome.classList.remove('girando');
            roletaSeta.classList.remove('girando');
            
            // Mostrar resultado
            setTimeout(() => {
                mostrarResultadoSorteio(primeiroJogador, sentidoSorteado);
            }, 500);
        }
    }, intervalo);
}

// Mostrar resultado do sorteio
function mostrarResultadoSorteio(jogador, sentido) {
    primeiroJogadorSpan.textContent = jogador;
    sentidoRodadaSpan.textContent = sentido;
    
    btnSortear.classList.add('escondido');
    resultadoSorteio.classList.remove('escondido');
}

// Ir para pontuação (após embate)
function irParaPontuacao() {
    trocarTela(telaEmbate, telaPontuacao);
    configurarTelaPontuacao();
}

// Configurar tela de pontuação
function configurarTelaPontuacao() {
    nomeImpostor.textContent = impostorAtual;
    palavraPartida.textContent = palavraAtual;
    atualizarPlacar();
}

// Pontuar verdadeiros
function pontuarVerdadeiros() {
    jogadores.forEach(jogador => {
        if (jogador !== impostorAtual) {
            pontuacoes[jogador]++;
        }
    });
    
    atualizarPlacar();
}

// Pontuar impostor
function pontuarImpostor() {
    pontuacoes[impostorAtual]++;
    atualizarPlacar();
}

// Atualizar placar
function atualizarPlacar() {
    corpoPlacar.innerHTML = '';
    
    // Ordenar jogadores por pontuação
    const jogadoresOrdenados = Object.entries(pontuacoes)
        .filter(([jogador]) => jogadores.includes(jogador))
        .sort((a, b) => b[1] - a[1]);
    
    jogadoresOrdenados.forEach(([jogador, pontos]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${jogador}${jogador === impostorAtual ? ' 🎭' : ''}</td>
            <td><strong>${pontos}</strong></td>
        `;
        corpoPlacar.appendChild(tr);
    });
}

// Nova rodada
function novaRodada() {
    palavraAtual = null;
    impostorAtual = null;
    indiceJogadorAtual = 0;
    
    trocarTela(telaPontuacao, telaConfiguracao);
}

// Terminar jogo e mostrar pódio
function terminarJogo() {
    trocarTela(telaPontuacao, telaPodio);
    montarPodio();
}

// Montar pódio com os vencedores
function montarPodio() {
    // Ordenar jogadores por pontuação
    const jogadoresOrdenados = Object.entries(pontuacoes)
        .filter(([jogador]) => jogadores.includes(jogador))
        .sort((a, b) => b[1] - a[1]);

    // Preencher top 3
    if (jogadoresOrdenados.length >= 1) {
        nomePrimeiro.textContent = jogadoresOrdenados[0][0];
        pontosPrimeiro.textContent = `${jogadoresOrdenados[0][1]} pts`;
    } else {
        nomePrimeiro.textContent = '-';
        pontosPrimeiro.textContent = '0 pts';
    }

    if (jogadoresOrdenados.length >= 2) {
        nomeSegundo.textContent = jogadoresOrdenados[1][0];
        pontosSegundo.textContent = `${jogadoresOrdenados[1][1]} pts`;
    } else {
        nomeSegundo.textContent = '-';
        pontosSegundo.textContent = '0 pts';
    }

    if (jogadoresOrdenados.length >= 3) {
        nomeTerceiro.textContent = jogadoresOrdenados[2][0];
        pontosTerceiro.textContent = `${jogadoresOrdenados[2][1]} pts`;
    } else {
        nomeTerceiro.textContent = '-';
        pontosTerceiro.textContent = '0 pts';
    }

    // Preencher outros jogadores (a partir do 4º lugar)
    outrosJogadores.innerHTML = '';
    
    if (jogadoresOrdenados.length > 3) {
        const tituloOutros = document.createElement('h3');
        tituloOutros.textContent = '📋 Demais Jogadores';
        outrosJogadores.appendChild(tituloOutros);

        for (let i = 3; i < jogadoresOrdenados.length; i++) {
            const [jogador, pontos] = jogadoresOrdenados[i];
            
            const divJogador = document.createElement('div');
            divJogador.className = 'jogador-ranking';
            
            divJogador.innerHTML = `
                <div class="jogador-ranking-info">
                    <span class="posicao-numero">${i + 1}º</span>
                    <span class="jogador-ranking-nome">${jogador}</span>
                </div>
                <span class="jogador-ranking-pontos">${pontos} pts</span>
            `;
            
            outrosJogadores.appendChild(divJogador);
        }
    }
}

// Novo jogo (limpar tudo e voltar ao início)
function novoJogo() {
    jogadores = [];
    pontuacoes = {};
    palavraAtual = null;
    impostorAtual = null;
    indiceJogadorAtual = 0;
    
    atualizarListaJogadores();
    trocarTela(telaPodio, telaConfiguracao);
    inputNomeJogador.focus();
}

// Reiniciar jogo
function reiniciarJogo() {
    if (confirm('Deseja realmente reiniciar o jogo? Todos os jogadores e pontuações serão perdidos.')) {
        jogadores = [];
        pontuacoes = {};
        palavraAtual = null;
        impostorAtual = null;
        indiceJogadorAtual = 0;
        
        atualizarListaJogadores();
        trocarTela(telaPontuacao, telaConfiguracao);
    }
}

// Event Listeners
btnAdicionar.addEventListener('click', adicionarJogador);

inputNomeJogador.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarJogador();
    }
});

btnIniciar.addEventListener('click', iniciarPartida);
btnRevelar.addEventListener('click', revelarPalavra);
btnProximo.addEventListener('click', proximoJogador);
btnSortear.addEventListener('click', sortearRodada);
btnIrPontuacao.addEventListener('click', irParaPontuacao);
btnPontuarVerdadeiros.addEventListener('click', pontuarVerdadeiros);
btnPontuarImpostor.addEventListener('click', pontuarImpostor);
btnNovaRodada.addEventListener('click', novaRodada);
btnTerminarJogo.addEventListener('click', terminarJogo);
btnNovoJogo.addEventListener('click', novoJogo);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inputNomeJogador.focus();
    atualizarListaJogadores();
});
