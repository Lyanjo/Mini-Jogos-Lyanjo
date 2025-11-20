// Lista de palavras do jogo
const PALAVRAS = [
    "BANANA", "CACHORRO", "FUTEBOL", "PIZZA", "PRAIA",
    "MONTANHA", "COMPUTADOR", "VIOLÃO", "LIVRO", "CINEMA",
    "CAFÉ", "CHOCOLATE", "NUVEM", "ESTRELA", "CARRO",
    "BICICLETA", "TELEFONE", "ESCOLA", "HOSPITAL", "FLORESTA",
    "OCEANO", "DESERTO", "VULCÃO", "GELEIRA", "CAVERNA",
    "CASTELO", "PONTE", "TÚNEL", "FAROL", "MOINHO",
    "JARDIM", "PARQUE", "SHOPPING", "AEROPORTO", "ESTAÇÃO",
    "MUSEU", "TEATRO", "CIRCO", "ZOOLÓGICO", "AQUÁRIO",
    "BIBLIOTECA", "RESTAURANTE", "PADARIA", "FARMÁCIA", "BANCO",
    "AÇÚCAR", "SAL", "PIMENTA", "ALHO", "CEBOLA",
    "TOMATE", "ALFACE", "CENOURA", "BATATA", "ARROZ",
    "FEIJÃO", "MACARRÃO", "QUEIJO", "LEITE", "OVO",
    "PEIXE", "FRANGO", "CARNE", "SUCO", "REFRIGERANTE",
    "ÁGUA", "CHÁ", "SORVETE", "BOLO", "BISCOITO",
    "PÃO", "MANTEIGA", "GELEIA", "MEL", "IOGURTE"
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
const btnIrPontuacao = document.getElementById('btn-ir-pontuacao');

// Elementos DOM - Tela Pontuação
const telaPontuacao = document.getElementById('tela-pontuacao');
const nomeImpostor = document.getElementById('nome-impostor');
const palavraPartida = document.getElementById('palavra-partida');
const btnPontuarVerdadeiros = document.getElementById('btn-pontuar-verdadeiros');
const btnPontuarImpostor = document.getElementById('btn-pontuar-impostor');
const corpoPlacar = document.getElementById('corpo-placar');
const btnNovaRodada = document.getElementById('btn-nova-rodada');
const btnReiniciar = document.getElementById('btn-reiniciar');

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
        // Todos viram, ir para tela de embate
        trocarTela(telaRevelacao, telaEmbate);
    }
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
btnIrPontuacao.addEventListener('click', irParaPontuacao);
btnPontuarVerdadeiros.addEventListener('click', pontuarVerdadeiros);
btnPontuarImpostor.addEventListener('click', pontuarImpostor);
btnNovaRodada.addEventListener('click', novaRodada);
btnReiniciar.addEventListener('click', reiniciarJogo);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inputNomeJogador.focus();
    atualizarListaJogadores();
});
