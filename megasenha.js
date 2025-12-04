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
    "BOLO", "TORTA", "MOUSSE", "GELATINA", "SALADA", "SOPA", "CALDO",
    "MOLHO", "TEMPERO", "SAL", "AÇÚCAR", "PIMENTA", "ALHO", "CEBOLA",
    "TOMATE", "ALFACE", "CENOURA", "BATATA", "ARROZ", "FEIJÃO",
    "CARNE", "FRANGO", "PEIXE", "CAMARÃO", "OVO", "QUEIJO", "LEITE",
    "MANTEIGA", "IOGURTE", "CEREAL", "PÃO", "BISCOITO", "BOLACHA", "WAFER",
    
    // Animais
    "CACHORRO", "GATO", "ELEFANTE", "GIRAFA", "LEÃO", "TIGRE", "URSO",
    "COELHO", "PÁSSARO", "PEIXE", "BALEIA", "GOLFINHO", "TARTARUGA", "COBRA",
    "BORBOLETA", "ABELHA", "FORMIGA", "ARANHA", "CAVALO", "VACA",
    "PORCO", "OVELHA", "CABRA", "GALINHA", "PATO", "GANSO", "PERU",
    "PAPAGAIO", "CORUJA", "ÁGUIA", "FALCÃO", "GAVIÃO", "PELICANO", "FLAMINGO",
    "PINGUIM", "CANGURU", "KOALA", "PANDA", "GORILA", "MACACO", "CHIMPANZÉ",
    "ZEBRA", "RINOCERONTE", "HIPOPÓTAMO", "CROCODILO", "JACARÉ", "LAGARTO", "SAPO",
    "MOSQUITO", "MOSCA", "BARATA", "GRILO", "GAFANHOTO", "LIBÉLULA", "BESOURO",
    
    // Objetos do dia a dia
    "TELEFONE", "TECLADO", "RELÓGIO", "SAPATO", "ÓCULOS", "GUARDA-CHUVA",
    "MOCHILA", "CARTEIRA", "CHAVE", "ESCOVA", "PENTE", "TESOURA", "CANETA",
    "LÁPIS", "CADERNO", "LIVRO", "CADEIRA", "MESA", "CAMA", "TRAVESSEIRO",
    "COBERTOR", "LENÇOL", "TOALHA", "SABONETE", "SHAMPOO", "CONDICIONADOR", "CREME",
    "PERFUME", "DESODORANTE", "PASTA", "ESCOVA", "FIO-DENTAL", "ESPELHO", "PENTE",
    "GARRAFA", "COPO", "PRATO", "TIGELA", "PANELA", "FRIGIDEIRA", "COLHER",
    "GARFO", "FACA", "ABRIDOR", "SACA-ROLHAS", "RALADOR", "ESPREMEDOR", "LIQUIDIFICADOR",
    
    // Lugares
    "PRAIA", "CINEMA", "BIBLIOTECA", "MONTANHA", "JARDIM", "HOSPITAL",
    "ESCOLA", "PISCINA", "RESTAURANTE", "ACADEMIA", "PARQUE", "TEATRO",
    "MUSEU", "SHOPPING", "MERCADO", "FARMÁCIA", "PADARIA", "AÇOUGUE",
    "FLORICULTURA", "DENTISTA", "CABELEIREIRO", "AEROPORTO", "ESTÁDIO",
    "PRAÇA", "RUA", "AVENIDA", "PONTE", "TÚNEL", "BOSQUE", "CACHOEIRA",
    "LAGO", "RIO", "OCEANO", "DESERTO", "SAVANA", "FLORESTA", "SELVA",
    "FAZENDA", "SÍTIO", "RANCHO", "CASTELO", "PALÁCIO", "CATEDRAL", "IGREJA",
    "TEMPLO", "MESQUITA", "TUMBA", "CEMITÉRIO", "MEMORIAL", "MONUMENTO", "ESTÁTUA",
    
    // Profissões
    "MÉDICO", "ENFERMEIRO", "PROFESSOR", "ADVOGADO", "BOMBEIRO", "POLICIAL",
    "MECÂNICO", "ELETRICISTA", "ENCANADOR", "PINTOR", "PEDREIRO", "CARPINTEIRO",
    "MOTORISTA", "PILOTO", "COZINHEIRO", "GARÇOM", "VENDEDOR", "RECEPCIONISTA",
    "SECRETÁRIA", "CONTADOR", "ENGENHEIRO", "ARQUITETO", "DESIGNER", "PROGRAMADOR",
    "JORNALISTA", "REPÓRTER", "EDITOR", "ESCRITOR", "POETA", "AUTOR", "ILUSTRADOR",
    "FOTÓGRAFO", "CINEGRAFISTA", "DIRETOR", "PRODUTOR", "ATOR", "ATRIZ", "CANTOR",
    "MÚSICO", "DANÇARINO", "MÁGICO", "PALHAÇO", "ATLETA", "TREINADOR", "JUIZ",
    "VETERINÁRIO", "BIÓLOGO", "QUÍMICO", "FÍSICO", "ASTRÔNOMO", "GEÓLOGO", "CIENTISTA",
    
    // Instrumentos e música
    "VIOLÃO", "GUITARRA", "PIANO", "BATERIA", "FLAUTA", "SAXOFONE", "TROMPETE",
    "VIOLINO", "HARPA", "GAITA", "PANDEIRO", "TAMBOR", "TECLADO", "BAIXO",
    "ACORDEÃO", "BANJO", "CAVAQUINHO", "UKULELE", "CLARINETE", "TROMBONE", "CORNETA",
    "SINO", "APITO", "MICROFONE", "FONE", "TRIANGULO", "CHOCALHO", "CASTANHOLA",
    
    // Esportes
    "FUTEBOL", "BASQUETE", "VÔLEI", "TÊNIS", "NATAÇÃO", "CORRIDA", "CICLISMO",
    "BOXE", "JUDÔ", "KARATÊ", "ATLETISMO", "GINÁSTICA", "SURF", "SKATE",
    "GOLFE", "RUGBY", "HANDEBOL", "BEISEBOL", "HÓQUEI", "ESGRIMA",
    "ARCO-FLEXA", "TIRO", "HIPISMO", "POLO", "REMO", "CANOAGEM", "VELA",
    "MERGULHO", "ESCALADA", "RAPEL", "PARAQUEDISMO", "ASA-DELTA", "PARAPENTE", "CROSSFIT",
    "SNOWBOARD", "ESQUI", "PATINAÇÃO", "BOLICHE", "SINUCA", "BILHAR", "DARDOS",
    
    // Tecnologia
    "COMPUTADOR", "NOTEBOOK", "CELULAR", "TABLET", "MOUSE", "MONITOR",
    "IMPRESSORA", "SCANNER", "WEBCAM", "FONE", "ROTEADOR", "PENDRIVE",
    "CARREGADOR", "BATERIA", "INTERNET", "EMAIL", "APLICATIVO", "SITE",
    "SOFTWARE", "HARDWARE", "PROGRAMA", "ARQUIVO", "PASTA", "DOWNLOAD", "VÍRUS",
    "WIFI", "BLUETOOTH", "GPS", "SATÉLITE", "ANTENA", "CABO", "FILTRO",
    "MEMÓRIA", "DISCO", "NUVEM", "ZOOM", "REDE", "SENHA", "LOGIN",
    
    // Transportes
    "AVIÃO", "CARRO", "ÔNIBUS", "TREM", "METRÔ", "BICICLETA", "MOTO",
    "NAVIO", "BARCO", "LANCHA", "HELICÓPTERO", "CAMINHÃO", "VAN", "TÁXI",
    "UBER", "BALÃO", "DIRIGÍVEL", "SUBMARINO", "CANOA", "JETSKI", "IATE",
    "CARROÇA", "CHARRETE", "TRICICLO", "PATINETE", "PATINS", "CARRINHO", "SKATE",
    
    // Natureza
    "CHUVA", "ESTRELA", "SOL", "LUA", "NUVEM", "VENTO", "TROVÃO", "RAIO",
    "ARCO-ÍRIS", "NEVE", "GELO", "FLOR", "ÁRVORE", "FOLHA", "GALHO",
    "RAIZ", "SEMENTE", "FRUTO", "GRAMA", "TERRA", "PEDRA", "AREIA",
    "MONTANHA", "VALE", "COLINA", "PENHASCO", "CAVERNA", "GRUTA", "CRATERA",
    "VULCÃO", "LAVA", "MAGMA", "TERREMOTO", "TSUNAMI", "FURACÃO", "TORNADO",
    "ECLIPSE", "COMETA", "METEORO", "PLANETA", "GALÁXIA", "ASTRONAUTA", "SATÉLITE",
    
    // Casa
    "COZINHA", "SALA", "QUARTO", "BANHEIRO", "GARAGEM", "QUINTAL", "VARANDA",
    "JANELA", "PORTA", "PAREDE", "TETO", "CHÃO", "ESCADA", "ELEVADOR",
    "SOFÁ", "GELADEIRA", "FOGÃO", "MICRO-ONDAS", "MÁQUINA", "TELEVISÃO",
    "LUSTRES", "ABAJUR", "LUMINÁRIA", "CORTINA", "PERSIANA", "TAPETE", "QUADRO",
    "ESPELHO", "ARMÁRIO", "GUARDA-ROUPA", "CÔMODA", "CRIADO-MUDO", "ESTANTE", "PRATELEIRA",
    "GAVETA", "CABIDE", "GANCHO", "VARAL", "BALDE", "VASSOURA", "RODO",
    
    // Roupas e acessórios
    "CAMISA", "CALÇA", "VESTIDO", "SAIA", "SHORTS", "BLUSA", "JAQUETA",
    "CASACO", "BONÉ", "CHAPÉU", "LUVA", "CINTO", "GRAVATA", "LENÇO",
    "MEIA", "SANDÁLIA", "TÊNIS", "BOTA", "CHINELO", "SALTO",
    "PIJAMA", "ROUPÃO", "BIQUÍNI", "MAIÔ", "SUNGA", "CUECA", "CALCINHA",
    "SUTIÃ", "CAMISOLA", "REGATA", "POLO", "MOLETOM", "JEANS", "BERMUDA",
    "CACHECOL", "BANDANA", "TIARA", "PRESILHA", "COLAR", "ANEL", "BRINCO",
    
    // Arte e entretenimento
    "PINTURA", "FOTOGRAFIA", "ESCULTURA", "DESENHO", "DANÇA", "POESIA",
    "ROMANCE", "FILME", "SÉRIE", "NOVELA", "DOCUMENTÁRIO", "ANIMAÇÃO",
    "JOGO", "BRINQUEDO", "QUEBRA-CABEÇA", "BARALHO", "DADO", "DOMINÓ",
    "TEATRO", "ÓPERA", "BALLET", "MUSICAL", "COMÉDIA", "DRAMA", "SUSPENSE",
    "TERROR", "FICÇÃO", "FANTASIA", "AVENTURA", "MISTÉRIO", "BIOGRAFIA", "CONTO",
    
    // Diversos
    "FESTA", "ANIVERSÁRIO", "CASAMENTO", "FORMATURA", "NATAL", "PÁSCOA",
    "CARNAVAL", "FÉRIAS", "VIAGEM", "AVENTURA", "SURPRESA", "PRESENTE",
    "MÚSICA", "CANÇÃO", "RITMO", "MELODIA", "LETRA", "DINHEIRO",
    "MOEDA", "NOTA", "BANCO", "CARTÃO", "SENHA", "CÓDIGO",
    "AMOR", "AMIZADE", "FAMÍLIA", "PAZ", "ALEGRIA", "FELICIDADE", "TRISTEZA",
    "RAIVA", "MEDO", "CORAGEM", "ESPERANÇA", "FÉ", "SONHO", "DESEJO",
    "IDEIA", "PENSAMENTO", "MEMÓRIA", "LEMBRANÇA", "SAUDADE", "NOSTALGIA", "EMOÇÃO",
    "SENTIMENTO", "PAIXÃO", "CARINHO", "ABRAÇO", "BEIJO", "SORRISO", "LÁGRIMA",
    
    // Cores e formas
    "VERMELHO", "AZUL", "AMARELO", "VERDE", "LARANJA", "ROXO", "ROSA",
    "BRANCO", "PRETO", "CINZA", "MARROM", "BEGE", "DOURADO", "PRATEADO",
    "CÍRCULO", "QUADRADO", "TRIÂNGULO", "RETÂNGULO", "HEXÁGONO", "PENTÁGONO", "LOSANGO",
    "OVAL", "ESFERA", "CUBO", "PIRÂMIDE", "CONE", "CILINDRO", "ESTRELA",
    
    // Corpo humano
    "CABEÇA", "CABELO", "OLHO", "NARIZ", "BOCA", "ORELHA", "DENTE",
    "LÍNGUA", "PESCOÇO", "OMBRO", "BRAÇO", "COTOVELO", "MÃO", "DEDO",
    "PEITO", "BARRIGA", "COSTAS", "QUADRIL", "PERNA", "JOELHO", "PÉ",
    "CORAÇÃO", "PULMÃO", "CÉREBRO", "FÍGADO", "RIM", "ESTÔMAGO", "INTESTINO",
    
    // Ações e verbos
    "CORRER", "PULAR", "DANÇAR", "CANTAR", "GRITAR", "CHORAR", "RIR",
    "DORMIR", "ACORDAR", "COMER", "BEBER", "ANDAR", "NADAR", "VOAR",
    "ESTUDAR", "TRABALHAR", "JOGAR", "BRINCAR", "DESENHAR", "PINTAR", "ESCREVER",
    "LER", "OUVIR", "VER", "SENTIR", "PENSAR", "SONHAR", "AMAR",
    
    // Pessoas famosas (conhecidas por todos)
    "PELÉ", "RONALDO", "NEYMAR", "XUXA", "SILVIO-SANTOS", "Madonna", "MICHAEL-JACKSON",
    "EINSTEIN", "PICASSO", "SHAKESPEARE", "BEETHOVEN", "MOZART", "LEONARDO-DA-VINCI",
    "CHARLIE-CHAPLIN", "MARILYN-MONROE", "MICHAEL-JORDAN", "TIGER-WOODS", "MIKE-TYSON"
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
