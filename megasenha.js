// Estado do jogo
let gameState = {
    teams: {
        A: { players: [], score: 0 },
        B: { players: [], score: 0 }
    },
    currentTeam: 'A',
    currentWord: null,
    wordsUsed: [],
    turnsPlayed: 0,
    timerInterval: null,
    timeRemaining: 120 // 2 minutos em segundos
};

// Banco de palavras (sem dicas, só as palavras)
const wordBank = [
    // Comida e bebida
    "CAFÉ", "PIZZA", "CHOCOLATE", "BANANA", "SORVETE", "HAMBÚRGUER", "MACARRÃO",
    "SUSHI", "BRIGADEIRO", "PUDIM", "PASTEL", "COXINHA", "EMPADA", "TAPIOCA",
    "AÇAÍ", "CHURRASCO", "FEIJOADA", "LASANHA", "RISOTO", "PANQUECA",
    
    // Animais
    "CACHORRO", "GATO", "ELEFANTE", "GIRAFA", "LEÃO", "TIGRE", "URSO",
    "COELHO", "PÁSSARO", "PEIXE", "BALEIA", "GOLFINHO", "TARTARUGA", "COBRA",
    "BORBOLETA", "ABELHA", "FORMIGA", "ARANHA", "CAVALO", "VACA",
    
    // Objetos do dia a dia
    "TELEFONE", "TECLADO", "RELÓGIO", "SAPATO", "ÓCULOS", "GUARDA-CHUVA",
    "MOCHILA", "CARTEIRA", "CHAVE", "ESCOVA", "PENTE", "TESOURA", "CANETA",
    "LÁPIS", "CADERNO", "LIVRO", "CADEIRA", "MESA", "CAMA", "TRAVESSEIRO",
    
    // Lugares
    "PRAIA", "CINEMA", "BIBLIOTECA", "MONTANHA", "JARDIM", "HOSPITAL",
    "ESCOLA", "PISCINA", "RESTAURANTE", "ACADEMIA", "PARQUE", "TEATRO",
    "MUSEU", "SHOPPING", "MERCADO", "FARMÁCIA", "PADARIA", "AÇOUGUE",
    "FLORICULTURA", "DENTISTA", "CABELEIREIRO", "AEROPORTO", "ESTÁDIO",
    "PRAÇA", "RUA", "AVENIDA", "PONTE", "TÚNEL", "BOSQUE", "CACHOEIRA",
    
    // Profissões
    "MÉDICO", "ENFERMEIRO", "PROFESSOR", "ADVOGADO", "BOMBEIRO", "POLICIAL",
    "MECÂNICO", "ELETRICISTA", "ENCANADOR", "PINTOR", "PEDREIRO", "CARPINTEIRO",
    "MOTORISTA", "PILOTO", "COZINHEIRO", "GARÇOM", "VENDEDOR", "RECEPCIONISTA",
    "SECRETÁRIA", "CONTADOR", "ENGENHEIRO", "ARQUITETO", "DESIGNER", "PROGRAMADOR",
    
    // Instrumentos e música
    "VIOLÃO", "GUITARRA", "PIANO", "BATERIA", "FLAUTA", "SAXOFONE", "TROMPETE",
    "VIOLINO", "HARPA", "GAITA", "PANDEIRO", "TAMBOR", "TECLADO", "BAIXO",
    
    // Esportes
    "FUTEBOL", "BASQUETE", "VÔLEI", "TÊNIS", "NATAÇÃO", "CORRIDA", "CICLISMO",
    "BOXE", "JUDÔ", "KARATÊ", "ATLETISMO", "GINÁSTICA", "SURF", "SKATE",
    "GOLFE", "RUGBY", "HANDEBOL", "BEISEBOL", "HÓQUEI", "ESGRIMA",
    
    // Tecnologia
    "COMPUTADOR", "NOTEBOOK", "CELULAR", "TABLET", "MOUSE", "MONITOR",
    "IMPRESSORA", "SCANNER", "WEBCAM", "FONE", "ROTEADOR", "PENDRIVE",
    "CARREGADOR", "BATERIA", "INTERNET", "EMAIL", "APLICATIVO", "SITE",
    
    // Transportes
    "AVIÃO", "CARRO", "ÔNIBUS", "TREM", "METRÔ", "BICICLETA", "MOTO",
    "NAVIO", "BARCO", "LANCHA", "HELICÓPTERO", "CAMINHÃO", "VAN", "TÁXI",
    
    // Natureza
    "CHUVA", "ESTRELA", "SOL", "LUA", "NUVEM", "VENTO", "TROVÃO", "RAIO",
    "ARCO-ÍRIS", "NEVE", "GELO", "FLOR", "ÁRVORE", "FOLHA", "GALHO",
    "RAIZ", "SEMENTE", "FRUTO", "GRAMA", "TERRA", "PEDRA", "AREIA",
    
    // Casa
    "COZINHA", "SALA", "QUARTO", "BANHEIRO", "GARAGEM", "QUINTAL", "VARANDA",
    "JANELA", "PORTA", "PAREDE", "TETO", "CHÃO", "ESCADA", "ELEVADOR",
    "SOFÁ", "GELADEIRA", "FOGÃO", "MICRO-ONDAS", "MÁQUINA", "TELEVISÃO",
    
    // Roupas e acessórios
    "CAMISA", "CALÇA", "VESTIDO", "SAIA", "SHORTS", "BLUSA", "JAQUETA",
    "CASACO", "BONÉ", "CHAPÉU", "LUVA", "CINTO", "GRAVATA", "LENÇO",
    "MEIA", "SANDÁLIA", "TÊNIS", "BOTA", "CHINELO", "SALTO",
    
    // Arte e entretenimento
    "PINTURA", "FOTOGRAFIA", "ESCULTURA", "DESENHO", "DANÇA", "POESIA",
    "ROMANCE", "FILME", "SÉRIE", "NOVELA", "DOCUMENTÁRIO", "ANIMAÇÃO",
    "JOGO", "BRINQUEDO", "QUEBRA-CABEÇA", "BARALHO", "DADO", "DOMINÓ",
    
    // Diversos
    "FESTA", "ANIVERSÁRIO", "CASAMENTO", "FORMATURA", "NATAL", "PÁSCOA",
    "CARNAVAL", "FÉRIAS", "VIAGEM", "AVENTURA", "SURPRESA", "PRESENTE",
    "MÚSICA", "CANÇÃO", "RITMO", "MELODIA", "LETRA", "DINHEIRO",
    "MOEDA", "NOTA", "BANCO", "CARTÃO", "SENHA", "CÓDIGO"
];

// Iniciar o jogo
function startGame() {
    // Coletar nomes dos jogadores
    const teamAPlayer1 = document.getElementById('teamAPlayer1').value.trim() || 'Jogador A1';
    const teamAPlayer2 = document.getElementById('teamAPlayer2').value.trim() || 'Jogador A2';
    const teamBPlayer1 = document.getElementById('teamBPlayer1').value.trim() || 'Jogador B1';
    const teamBPlayer2 = document.getElementById('teamBPlayer2').value.trim() || 'Jogador B2';

    // Configurar times
    gameState.teams.A.players = [teamAPlayer1, teamAPlayer2];
    gameState.teams.B.players = [teamBPlayer1, teamBPlayer2];

    // Trocar para tela de anúncio de turno
    document.getElementById('setupScreen').classList.add('hidden');
    showTurnAnnouncement();
}

// Mostrar anúncio de turno
function showTurnAnnouncement() {
    const players = gameState.teams[gameState.currentTeam].players;
    const teamName = gameState.currentTeam === 'A' ? 'Time A' : 'Time B';
    
    document.getElementById('turnPlayers').textContent = `${teamName}: ${players.join(' e ')}`;
    document.getElementById('turnScreen').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('checkRoundScreen').classList.add('hidden');
}

// Iniciar turno
function startTurn() {
    // Selecionar palavra aleatória
    selectNewWord();
    
    // Resetar timer
    gameState.timeRemaining = 120;
    updateTimerDisplay();
    
    // Iniciar contagem regressiva
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    // Trocar telas
    document.getElementById('turnScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    // Atualizar placar
    updateScores();
    
    // Limpar feedback
    document.getElementById('feedbackMessage').innerHTML = '';
}

// Selecionar nova palavra
function selectNewWord() {
    const availableWords = wordBank.filter(w => !gameState.wordsUsed.includes(w));
    
    if (availableWords.length === 0) {
        gameState.wordsUsed = [];
    }
    
    const randomIndex = Math.floor(Math.random() * (availableWords.length || wordBank.length));
    gameState.currentWord = availableWords.length > 0 ? availableWords[randomIndex] : wordBank[randomIndex];
    gameState.wordsUsed.push(gameState.currentWord);
    
    document.getElementById('secretWord').textContent = gameState.currentWord;
}

// Atualizar timer
function updateTimer() {
    gameState.timeRemaining--;
    updateTimerDisplay();
    
    if (gameState.timeRemaining <= 0) {
        endTurn();
    }
}

// Atualizar display do timer
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timerDisplay');
    timerElement.textContent = display;
    
    // Adicionar classe de warning quando estiver abaixo de 30 segundos
    if (gameState.timeRemaining <= 30) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

// Palavra acertada
function wordCorrect() {
    gameState.teams[gameState.currentTeam].score += 1;
    updateScores();
    selectNewWord();
}

// Passar palavra
function wordPass() {
    selectNewWord();
}

// Dica inválida
function wordInvalid() {
    gameState.teams[gameState.currentTeam].score = Math.max(0, gameState.teams[gameState.currentTeam].score - 1);
    updateScores();
    selectNewWord();
}

// Finalizar turno
function endTurn() {
    // Parar timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Incrementar contador de turnos
    gameState.turnsPlayed++;
    
    // Alternar time
    gameState.currentTeam = gameState.currentTeam === 'A' ? 'B' : 'A';
    
    // Verificar se ambos os times jogaram (rodada completa)
    if (gameState.turnsPlayed % 2 === 0) {
        showCheckRound();
    } else {
        showTurnAnnouncement();
    }
}

// Mostrar verificação de rodada
function showCheckRound() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('checkRoundScreen').classList.remove('hidden');
    
    document.getElementById('checkScoreA').textContent = gameState.teams.A.score;
    document.getElementById('checkScoreB').textContent = gameState.teams.B.score;
}

// Continuar jogo
function continueGame() {
    showTurnAnnouncement();
}

// Atualizar placar
function updateScores() {
    document.getElementById('scoreA').textContent = gameState.teams.A.score;
    document.getElementById('scoreB').textContent = gameState.teams.B.score;
}

// Mostrar feedback
function showFeedback(message, type) {
    const feedbackElement = document.getElementById('feedbackMessage');
    feedbackElement.innerHTML = `<div class="feedback ${type}">${message}</div>`;
}

// Finalizar jogo
function endGame() {
    // Parar timer se estiver rodando
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('checkRoundScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('hidden');

    const scoreA = gameState.teams.A.score;
    const scoreB = gameState.teams.B.score;

    document.getElementById('finalScoreA').textContent = scoreA;
    document.getElementById('finalScoreB').textContent = scoreB;

    const winnerBanner = document.getElementById('winnerBanner');
    if (scoreA > scoreB) {
        winnerBanner.textContent = `🏆 Time A Venceu! (${gameState.teams.A.players.join(' e ')})`;
    } else if (scoreB > scoreA) {
        winnerBanner.textContent = `🏆 Time B Venceu! (${gameState.teams.B.players.join(' e ')})`;
    } else {
        winnerBanner.textContent = '🤝 Empate! Ambos os times jogaram muito bem!';
    }
}

// Remover acentos para comparação
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Limpar timer ao sair da página
window.addEventListener('beforeunload', function() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
});
