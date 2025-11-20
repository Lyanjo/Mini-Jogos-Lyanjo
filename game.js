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

// Configuração da sala
let SALA_ID = 'jogo-impostor-sala';
const INTERVALO_SYNC = 500; // 0.5 segundo

// Estado do usuário
let meuNome = null;
let ehLider = false;
let codigoSala = null;

// BroadcastChannel para sincronização entre abas
let canalBroadcast = null;

// Elementos DOM - Tela Entrada
const telaEntrada = document.getElementById('tela-entrada');
const inputNomeJogador = document.getElementById('input-nome-jogador');
const btnEntrar = document.getElementById('btn-entrar');
const subtituloEntrada = document.getElementById('subtitulo-entrada');
const linkSala = document.getElementById('link-sala');
const btnCopiar = document.getElementById('btn-copiar');

// Elementos DOM - Tela Espera
const telaEspera = document.getElementById('tela-espera');
const nomeUsuario = document.getElementById('nome-usuario');
const listaJogadoresEspera = document.getElementById('lista-jogadores-espera');
const contadorJogadoresEspera = document.getElementById('contador-jogadores-espera');

// Elementos DOM - Tela Líder
const telaLider = document.getElementById('tela-lider');
const listaJogadores = document.getElementById('lista-jogadores');
const contadorJogadores = document.getElementById('contador-jogadores');
const btnIniciar = document.getElementById('btn-iniciar');
const btnLimparSala = document.getElementById('btn-limpar-sala');

// Elementos DOM - Tela Jogo
const telaJogo = document.getElementById('tela-jogo');
const areaImpostor = document.getElementById('area-impostor');
const areaPalavra = document.getElementById('area-palavra');
const palavraRevelada = document.getElementById('palavra-revelada');
const btnPronto = document.getElementById('btn-pronto');

// Elementos DOM - Tela Pontuação (Líder)
const telaPontuacao = document.getElementById('tela-pontuacao');
const nomeImpostor = document.getElementById('nome-impostor');
const palavraPartida = document.getElementById('palavra-partida');
const btnPontuarVerdadeiros = document.getElementById('btn-pontuar-verdadeiros');
const btnPontuarImpostor = document.getElementById('btn-pontuar-impostor');
const corpoPlacar = document.getElementById('corpo-placar');
const btnNovaRodada = document.getElementById('btn-nova-rodada');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Elementos DOM - Tela Aguardando (Jogadores)
const telaAguardando = document.getElementById('tela-aguardando');
const resultadoRodada = document.getElementById('resultado-rodada');
const textoResultado = document.getElementById('texto-resultado');

// Funções de LocalStorage
function obterDadosSala() {
    const dados = localStorage.getItem(SALA_ID);
    return dados ? JSON.parse(dados) : null;
}

function salvarDadosSala(dados) {
    localStorage.setItem(SALA_ID, JSON.stringify(dados));
    
    // Notificar outras abas via BroadcastChannel
    if (canalBroadcast) {
        canalBroadcast.postMessage({
            tipo: 'atualizar',
            dados: dados
        });
    }
}

function inicializarSala() {
    const sala = {
        jogadores: [],
        pontuacoes: {},
        lider: null,
        estado: 'entrada', // entrada, jogando, pontuacao
        palavraAtual: null,
        impostorAtual: null,
        codigoSala: codigoSala,
        timestamp: Date.now()
    };
    salvarDadosSala(sala);
    return sala;
}

function obterOuCriarSala() {
    let sala = obterDadosSala();
    if (!sala) {
        sala = inicializarSala();
    }
    return sala;
}

// Gerar código de sala único
function gerarCodigoSala() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Obter código da sala da URL
function obterCodigoSalaDaURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('sala');
}

// Funções auxiliares
function obterPalavraAleatoria() {
    return PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
}

function obterImpostorAleatorio(jogadores) {
    return jogadores[Math.floor(Math.random() * jogadores.length)];
}

function trocarTela(telaAtual, telaNova) {
    if (telaAtual) telaAtual.classList.remove('ativa');
    telaNova.classList.add('ativa');
}

// Função de entrada no jogo
function entrarNoJogo() {
    const nome = inputNomeJogador.value.trim();
    
    if (nome === '') {
        alert('Por favor, digite um nome!');
        return;
    }
    
    const sala = obterOuCriarSala();
    
    // Verificar se o nome já existe
    if (sala.jogadores.includes(nome)) {
        // Permitir reconexão do mesmo jogador (não adicionar duplicado)
        meuNome = nome;
        
        // Verificar se é o líder
        if (sala.lider === nome) {
            ehLider = true;
        }
    } else {
        // Adicionar novo jogador
        meuNome = nome;
        sala.jogadores.push(nome);
        
        // Inicializar pontuação
        if (!sala.pontuacoes[nome]) {
            sala.pontuacoes[nome] = 0;
        }
        
        // Definir líder (primeiro jogador)
        if (!sala.lider) {
            sala.lider = nome;
            ehLider = true;
            
            // Se for o líder e não tiver código de sala na URL, gerar um novo
            if (!codigoSala) {
                codigoSala = gerarCodigoSala();
                sala.codigoSala = codigoSala;
                SALA_ID = 'jogo-impostor-sala-' + codigoSala;
                
                // Atualizar URL com código da sala
                const novaURL = window.location.origin + window.location.pathname + '?sala=' + codigoSala;
                window.history.pushState({}, '', novaURL);
            }
        }
        
        sala.timestamp = Date.now();
        salvarDadosSala(sala);
    }
    
    // Ir para tela apropriada
    if (ehLider) {
        // Atualizar link da sala com o nome do líder
        const urlSala = window.location.origin + window.location.pathname + '?sala=' + codigoSala;
        linkSala.value = urlSala;
        
        trocarTela(telaEntrada, telaLider);
        atualizarListaJogadoresLider();
    } else {
        nomeUsuario.textContent = meuNome;
        trocarTela(telaEntrada, telaEspera);
        atualizarListaJogadoresEspera();
    }
    
    // Iniciar sincronização
    iniciarSincronizacao();
}

// Atualizar lista de jogadores (Líder)
function atualizarListaJogadoresLider() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    listaJogadores.innerHTML = '';
    sala.jogadores.forEach((jogador, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="jogador-nome">
                ${jogador === sala.lider ? '👑 ' : ''}${jogador}
            </span>
        `;
        listaJogadores.appendChild(li);
    });
    
    contadorJogadores.textContent = sala.jogadores.length;
    btnIniciar.disabled = sala.jogadores.length < 3;
}

// Atualizar lista de jogadores (Espera)
function atualizarListaJogadoresEspera() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    listaJogadoresEspera.innerHTML = '';
    sala.jogadores.forEach((jogador) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="jogador-nome">
                ${jogador === sala.lider ? '👑 ' : ''}${jogador}
            </span>
        `;
        listaJogadoresEspera.appendChild(li);
    });
    
    contadorJogadoresEspera.textContent = sala.jogadores.length;
}

// Iniciar partida (Líder)
function iniciarPartida() {
    const sala = obterDadosSala();
    if (!sala || sala.jogadores.length < 3) {
        alert('São necessários pelo menos 3 jogadores!');
        return;
    }
    
    // Escolher palavra e impostor
    sala.palavraAtual = obterPalavraAleatoria();
    sala.impostorAtual = obterImpostorAleatorio(sala.jogadores);
    sala.estado = 'jogando';
    sala.timestamp = Date.now();
    
    salvarDadosSala(sala);
    
    // Mostrar tela do jogo para o líder
    mostrarPalavraJogador();
}

// Mostrar palavra para o jogador
function mostrarPalavraJogador() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    trocarTela(null, telaJogo);
    
    if (meuNome === sala.impostorAtual) {
        // Sou o impostor
        areaImpostor.classList.remove('escondido');
        areaPalavra.classList.add('escondido');
    } else {
        // Tenho a palavra
        areaPalavra.classList.remove('escondido');
        areaImpostor.classList.add('escondido');
        palavraRevelada.textContent = sala.palavraAtual;
    }
}

// Jogador pronto
function jogadorPronto() {
    const sala = obterDadosSala();
    
    if (ehLider) {
        // Líder vai para tela de pontuação
        trocarTela(telaJogo, telaPontuacao);
        configurarTelaPontuacao();
    } else {
        // Outros jogadores vão para tela de espera
        trocarTela(telaJogo, telaAguardando);
    }
}

// Configurar tela de pontuação (Líder)
function configurarTelaPontuacao() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    nomeImpostor.textContent = sala.impostorAtual;
    palavraPartida.textContent = sala.palavraAtual;
    atualizarPlacar();
}

// Pontuar verdadeiros
function pontuarVerdadeiros() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    sala.jogadores.forEach(jogador => {
        if (jogador !== sala.impostorAtual) {
            sala.pontuacoes[jogador]++;
        }
    });
    
    sala.timestamp = Date.now();
    salvarDadosSala(sala);
    atualizarPlacar();
    
    // Notificar jogadores
    mostrarResultadoParaJogadores('verdadeiros');
}

// Pontuar impostor
function pontuarImpostor() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    sala.pontuacoes[sala.impostorAtual]++;
    
    sala.timestamp = Date.now();
    salvarDadosSala(sala);
    atualizarPlacar();
    
    // Notificar jogadores
    mostrarResultadoParaJogadores('impostor');
}

// Mostrar resultado para jogadores
function mostrarResultadoParaJogadores(vencedor) {
    const sala = obterDadosSala();
    if (!sala) return;
    
    sala.resultadoAtual = vencedor;
    sala.timestamp = Date.now();
    salvarDadosSala(sala);
}

// Atualizar placar
function atualizarPlacar() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    corpoPlacar.innerHTML = '';
    
    // Ordenar jogadores por pontuação
    const jogadoresOrdenados = Object.entries(sala.pontuacoes)
        .filter(([jogador]) => sala.jogadores.includes(jogador))
        .sort((a, b) => b[1] - a[1]);
    
    jogadoresOrdenados.forEach(([jogador, pontos]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${jogador}${jogador === sala.impostorAtual ? ' 🎭' : ''}</td>
            <td><strong>${pontos}</strong></td>
        `;
        corpoPlacar.appendChild(tr);
    });
}

// Nova rodada
function novaRodada() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    sala.estado = 'entrada';
    sala.palavraAtual = null;
    sala.impostorAtual = null;
    sala.resultadoAtual = null;
    sala.timestamp = Date.now();
    
    salvarDadosSala(sala);
    
    trocarTela(telaPontuacao, telaLider);
    atualizarListaJogadoresLider();
}

// Reiniciar jogo
function reiniciarJogo() {
    if (confirm('Deseja realmente reiniciar o jogo? Todos os jogadores e pontuações serão perdidos.')) {
        localStorage.removeItem(SALA_ID);
        location.reload();
    }
}

// Limpar sala (apenas líder)
function limparSala() {
    if (!ehLider) return;
    
    if (confirm('Deseja limpar a sala? Todos os jogadores serão removidos e você poderá começar novamente.')) {
        const sala = obterDadosSala();
        if (!sala) return;
        
        // Manter apenas o líder
        sala.jogadores = [sala.lider];
        
        // Resetar estado
        sala.estado = 'entrada';
        sala.palavraAtual = null;
        sala.impostorAtual = null;
        sala.resultadoAtual = null;
        sala.timestamp = Date.now();
        
        salvarDadosSala(sala);
        atualizarListaJogadoresLider();
    }
}

// Sincronização automática
let intervalSync = null;

function iniciarSincronizacao() {
    if (intervalSync) return;
    
    // Criar BroadcastChannel para sincronização entre abas
    try {
        canalBroadcast = new BroadcastChannel('jogo-impostor-' + codigoSala);
        
        canalBroadcast.onmessage = (event) => {
            if (event.data.tipo === 'atualizar') {
                // Atualizar interface quando outra aba fizer mudanças
                processarAtualizacao();
            }
        };
    } catch (e) {
        console.log('BroadcastChannel não suportado, usando apenas localStorage events');
    }
    
    // Listener para mudanças no localStorage (funciona entre abas)
    window.addEventListener('storage', (e) => {
        if (e.key === SALA_ID && e.newValue) {
            processarAtualizacao();
        }
    });
    
    intervalSync = setInterval(() => {
        processarAtualizacao();
    }, INTERVALO_SYNC);
}

function processarAtualizacao() {
    const sala = obterDadosSala();
    if (!sala) return;
    
    // Atualizar tela baseado no estado
    if (!ehLider) {
        // Jogadores seguem o estado da sala
        if (sala.estado === 'jogando' && telaEspera.classList.contains('ativa')) {
            // Partida iniciou
            mostrarPalavraJogador();
        } else if (sala.estado === 'entrada') {
            // Atualizar lista de jogadores na espera
            if (telaEspera.classList.contains('ativa')) {
                atualizarListaJogadoresEspera();
            }
        }
        
        // Verificar se há resultado
        if (sala.resultadoAtual && telaAguardando.classList.contains('ativa')) {
            resultadoRodada.classList.remove('escondido');
            if (sala.resultadoAtual === 'verdadeiros') {
                textoResultado.textContent = '✅ Jogadores Verdadeiros Venceram!';
                textoResultado.style.color = 'var(--cor-sucesso)';
            } else {
                textoResultado.textContent = '🎭 Impostor Venceu!';
                textoResultado.style.color = 'var(--cor-perigo)';
            }
        }
        
        // Voltar para espera se nova rodada
        if (sala.estado === 'entrada' && telaAguardando.classList.contains('ativa')) {
            trocarTela(telaAguardando, telaEspera);
            atualizarListaJogadoresEspera();
        }
    } else {
        // Líder atualiza lista de jogadores
        if (telaLider.classList.contains('ativa')) {
            atualizarListaJogadoresLider();
        }
    }
}

// Copiar link
function copiarLink() {
    linkSala.select();
    linkSala.setSelectionRange(0, 99999); // Para mobile
    
    try {
        document.execCommand('copy');
        btnCopiar.textContent = '✓ Copiado!';
        setTimeout(() => {
            btnCopiar.textContent = 'Copiar';
        }, 2000);
    } catch (err) {
        alert('Não foi possível copiar o link');
    }
}

// Event Listeners
btnEntrar.addEventListener('click', entrarNoJogo);

inputNomeJogador.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        entrarNoJogo();
    }
});

btnIniciar.addEventListener('click', iniciarPartida);
btnPronto.addEventListener('click', jogadorPronto);
btnPontuarVerdadeiros.addEventListener('click', pontuarVerdadeiros);
btnPontuarImpostor.addEventListener('click', pontuarImpostor);
btnNovaRodada.addEventListener('click', novaRodada);
btnReiniciar.addEventListener('click', reiniciarJogo);
btnCopiar.addEventListener('click', copiarLink);
btnLimparSala.addEventListener('click', limparSala);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há código de sala na URL
    const codigoDaURL = obterCodigoSalaDaURL();
    
    if (codigoDaURL) {
        // Entrar em uma sala existente
        codigoSala = codigoDaURL;
        SALA_ID = 'jogo-impostor-sala-' + codigoSala;
        
        // Verificar se a sala existe e pegar o nome do líder
        const sala = obterDadosSala();
        if (sala && sala.lider) {
            subtituloEntrada.textContent = `Entrando no jogo de ${sala.lider}`;
        } else {
            subtituloEntrada.textContent = 'Entre com seu nome para participar';
        }
    } else {
        // Criar nova sala (será definido quando o líder entrar)
        subtituloEntrada.textContent = 'Entre com seu nome para criar uma sala';
    }
    
    // Focar no input
    inputNomeJogador.focus();
    
    // Verificar se já está em uma sala
    const sala = obterDadosSala();
    if (sala && sala.jogadores.length > 0) {
        // Limpar sala antiga se passou muito tempo (mais de 1 hora)
        const tempoDecorrido = Date.now() - sala.timestamp;
        if (tempoDecorrido > 3600000) {
            localStorage.removeItem(SALA_ID);
        }
    }
});
