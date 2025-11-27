// Estado do jogo
let gameState = {
    players: [],
    roles: [],
    currentPlayerIndex: 0,
    playerScores: {} // Pontuação individual de cada jogador
};

// Definição dos papéis
const roleDefinitions = {
    assassin: {
        name: 'ASSASSINO',
        emoji: '🔪',
        color: 'assassin',
        description: 'Elimine os cidadãos sem ser descoberto pelo detetive.\nEscolhe 1 alvo para matar por noite.',
        image: 'Recursos/Spy.webp'
    },
    detective: {
        name: 'DETETIVE',
        emoji: '🕵️',
        color: 'detective',
        description: 'Descubra quem são os assassinos e proteja a cidade.\nInvestigue 1 alvo por noite.',
        image: 'Recursos/Sheriff.webp'
    },
    doctor: {
        name: 'MÉDICO',
        emoji: '⚕️',
        color: 'doctor',
        description: 'Salve uma pessoa a cada noite. Pode salvar a si mesmo apenas 1 vez.',
        image: 'Recursos/Doctor.webp'
    },
    citizen: {
        name: 'CIDADÃO',
        emoji: '👤',
        color: 'citizen',
        description: 'Ajude a cidade a identificar os assassinos através de discussões.',
        image: 'Recursos/Citizen.webp'
    },
    jester: {
        name: 'PALHAÇO',
        emoji: '🤡',
        color: 'jester',
        description: 'Seu objetivo é ser eliminado. Se conseguir, você vence!',
        image: 'Recursos/Jester.webp'
    }
};

// Adicionar jogador
function addPlayer() {
    const inputs = document.querySelectorAll('#playerInputs input');
    const playerCount = inputs.length;
    
    const newPlayerDiv = document.createElement('div');
    newPlayerDiv.className = 'player-input-group';
    newPlayerDiv.innerHTML = `
        <span>Jogador ${playerCount + 1}:</span>
        <input type="text" placeholder="Nome do jogador" data-player="${playerCount}">
        <button onclick="removePlayer(this)">Remover</button>
    `;
    
    document.getElementById('playerInputs').appendChild(newPlayerDiv);
}

// Remover jogador
function removePlayer(button) {
    const inputs = document.querySelectorAll('#playerInputs input');
    if (inputs.length > 5) {
        button.parentElement.remove();
        updatePlayerNumbers();
    } else {
        alert('Mínimo de 5 jogadores necessário!');
    }
}

// Atualizar numeração dos jogadores
function updatePlayerNumbers() {
    const groups = document.querySelectorAll('#playerInputs .player-input-group');
    groups.forEach((group, index) => {
        group.querySelector('span').textContent = `Jogador ${index + 1}:`;
        group.querySelector('input').setAttribute('data-player', index);
    });
}

// Distribuir papéis
function distributeRoles(playerCount) {
    const roles = [];
    
    // Papéis base (5 jogadores)
    roles.push('detective');  // 1 detetive
    roles.push('assassin');   // 1 assassino
    roles.push('doctor');     // 1 médico
    roles.push('citizen');    // 2 cidadãos
    roles.push('citizen');
    
    // 6 jogadores: adiciona palhaço
    if (playerCount >= 6) {
        roles.push('jester');
    }
    
    // 7 jogadores: adiciona mais 1 assassino
    if (playerCount >= 7) {
        roles.push('assassin');
    }
    
    // 8+ jogadores: adiciona cidadãos
    while (roles.length < playerCount) {
        roles.push('citizen');
    }
    
    // Embaralhar papéis
    return shuffleArray(roles);
}

// Embaralhar array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Iniciar jogo
function startGame() {
    const inputs = document.querySelectorAll('#playerInputs input');
    const players = [];
    
    // Coletar nomes dos jogadores
    inputs.forEach((input, index) => {
        const name = input.value.trim() || `Jogador ${index + 1}`;
        players.push(name);
    });
    
    if (players.length < 5) {
        alert('Mínimo de 5 jogadores necessário!');
        return;
    }
    
    // Configurar jogo
    gameState.players = players;
    gameState.roles = distributeRoles(players.length);
    gameState.currentPlayerIndex = 0;
    
    // Inicializar pontuação de cada jogador
    gameState.playerScores = {};
    players.forEach(player => {
        gameState.playerScores[player] = 0;
    });
    
    // Mostrar primeira revelação
    showRoleReveal();
}

// Mostrar revelação de papel
function showRoleReveal() {
    const playerName = gameState.players[gameState.currentPlayerIndex];
    
    // Mostrar prompt inicial
    document.getElementById('playerNamePrompt').textContent = playerName;
    document.getElementById('revealPrompt').classList.remove('hidden');
    document.getElementById('roleReveal').classList.add('hidden');
    
    // Trocar telas
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('roleScreen').classList.remove('hidden');
}

// Revelar função (após clicar no botão)
function revealRole() {
    const playerName = gameState.players[gameState.currentPlayerIndex];
    const role = gameState.roles[gameState.currentPlayerIndex];
    const roleInfo = roleDefinitions[role];
    
    document.getElementById('playerNameReveal').textContent = 
        `${playerName}, seu papel é:`;
    
    document.getElementById('roleImage').style.backgroundImage = 
        `url('${roleInfo.image}')`;
    
    document.getElementById('roleName').textContent = roleInfo.name;
    document.getElementById('roleName').className = `role-name ${roleInfo.color}`;
    
    document.getElementById('roleDescription').textContent = roleInfo.description;
    
    // Atualizar texto do botão
    const button = document.querySelector('#roleReveal .btn-primary');
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
        button.textContent = 'Próximo Jogador';
        button.onclick = nextPlayer;
    } else {
        button.textContent = 'Começar Partida';
        button.onclick = startCitySleeps;
    }
    
    // Mostrar revelação
    document.getElementById('revealPrompt').classList.add('hidden');
    document.getElementById('roleReveal').classList.remove('hidden');
}

// Próximo jogador
function nextPlayer() {
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex < gameState.players.length) {
        showRoleReveal();
    } else {
        startCitySleeps();
    }
}

// Iniciar tela "Cidade Dorme"
function startCitySleeps() {
    document.getElementById('roleScreen').classList.add('hidden');
    document.getElementById('citySleepsScreen').classList.remove('hidden');
}

// Finalizar rodada
function endRound() {
    showResultScreen();
}

// Mostrar tela de resultado
function showResultScreen() {
    const summaryContainer = document.getElementById('playersSummary');
    summaryContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const role = gameState.roles[index];
        const roleInfo = roleDefinitions[role];
        
        const item = document.createElement('div');
        item.className = 'player-summary-item';
        item.innerHTML = `
            <span>${player} - <span class="${roleInfo.color}">${roleInfo.name}</span></span>
            <span class="emoji">${roleInfo.emoji}</span>
        `;
        summaryContainer.appendChild(item);
    });
    
    // Verificar se há palhaço no jogo
    const hasJester = gameState.roles.includes('jester');
    const jesterBtn = document.getElementById('jesterBtn');
    if (jesterBtn) {
        jesterBtn.style.display = hasJester ? 'flex' : 'none';
    }
    
    // Atualizar placar
    updateScoreDisplay();
    
    // Trocar telas
    document.getElementById('citySleepsScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
}

// Conceder pontos
function awardPoints(winner) {
    // Adicionar pontos aos jogadores de acordo com a função vencedora
    gameState.players.forEach((player, index) => {
        const role = gameState.roles[index];
        
        if (winner === 'city') {
            // Cidade venceu: detetive, médico e cidadãos ganham ponto
            if (role === 'detective' || role === 'doctor' || role === 'citizen') {
                gameState.playerScores[player]++;
            }
        } else if (winner === 'assassin') {
            // Assassinos venceram
            if (role === 'assassin') {
                gameState.playerScores[player]++;
            }
        } else if (winner === 'jester') {
            // Palhaço venceu
            if (role === 'jester') {
                gameState.playerScores[player]++;
            }
        }
    });
    
    updateScoreDisplay();
}

// Atualizar display de pontuação
function updateScoreDisplay() {
    const summaryContainer = document.getElementById('scoreSummary');
    summaryContainer.innerHTML = '';
    
    // Criar lista ordenada de jogadores por pontuação
    const playerScoreArray = Object.entries(gameState.playerScores)
        .map(([player, score]) => ({ player, score }))
        .sort((a, b) => b.score - a.score);
    
    playerScoreArray.forEach(item => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <div class="label">${item.player}</div>
            <div class="value">${item.score}</div>
        `;
        summaryContainer.appendChild(scoreItem);
    });
}

// Nova rodada
function newRound() {
    // Redistribuir papéis
    gameState.roles = distributeRoles(gameState.players.length);
    gameState.currentPlayerIndex = 0;
    
    // Voltar para revelação
    document.getElementById('resultScreen').classList.add('hidden');
    showRoleReveal();
}

// Terminar jogo
function endGame() {
    // Mostrar tela final com pontuação
    const summaryContainer = document.getElementById('finalScoreSummary');
    summaryContainer.innerHTML = '';
    
    // Criar lista ordenada de jogadores por pontuação
    const playerScoreArray = Object.entries(gameState.playerScores)
        .map(([player, score]) => ({ player, score }))
        .sort((a, b) => b.score - a.score);
    
    // Encontrar a pontuação máxima
    const maxScore = Math.max(...Object.values(gameState.playerScores));
    
    playerScoreArray.forEach(item => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        
        // Adicionar troféu para o(s) vencedor(es)
        const trophy = item.score === maxScore && maxScore > 0 ? '🏆 ' : '';
        
        scoreItem.innerHTML = `
            <div class="label">${trophy}${item.player}</div>
            <div class="value">${item.score}</div>
        `;
        summaryContainer.appendChild(scoreItem);
    });
    
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('finalScreen').classList.remove('hidden');
}
