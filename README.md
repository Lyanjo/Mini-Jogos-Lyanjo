# 🎮 Central de Mini Jogos

## 📁 Estrutura do Projeto

```
Jogo Impostor/
│
├── index.html          # HUD principal - Menu de seleção de jogos
├── styles.css          # CSS compartilhado entre todos os jogos
│
├── impostor.html       # Jogo do Impostor - HTML
├── impostor.js         # Jogo do Impostor - Lógica JavaScript
│
├── game.js             # [LEGADO] Arquivo antigo - pode ser removido
│
└── Recursos/           # Pasta de recursos compartilhados
    ├── Impostor.png
    ├── Verdadeiro.png
    └── Verdadeiro cfundo.png
```

## 🎯 Como Funciona

### HUD Principal (index.html)
- Tela inicial com cards de todos os mini jogos
- Cards clicáveis que redirecionam para cada jogo
- Design responsivo e animado
- Suporte para adicionar novos jogos facilmente

### Jogo do Impostor
- **Arquivo HTML:** `impostor.html`
- **Arquivo JS:** `impostor.js`
- **Recursos:** Usa imagens da pasta `Recursos/`
- **CSS:** Compartilha o `styles.css` global

## 🚀 Como Adicionar Novos Jogos

1. Crie os arquivos do jogo:
   - `nome-do-jogo.html`
   - `nome-do-jogo.js`

2. Edite o `index.html` e adicione um novo card:
```html
<div class="card-jogo disponivel" onclick="window.location.href='nome-do-jogo.html'">
    <span class="card-jogo-icone">🎲</span>
    <h2 class="card-jogo-titulo">Nome do Jogo</h2>
    <p class="card-jogo-descricao">Descrição do jogo aqui</p>
    <span class="card-jogo-badge disponivel">✓ Disponível</span>
</div>
```

3. O novo jogo pode usar o `styles.css` existente ou ter seu próprio CSS

## 📝 Notas

- O `game.js` é o arquivo legado do Jogo do Impostor (antes da reorganização)
- Pode ser removido com segurança, pois agora usamos `impostor.js`
- Todos os jogos compartilham o mesmo `styles.css` para manter consistência visual
- Os recursos na pasta `Recursos/` são compartilhados entre todos os jogos

## 🎮 Jogos Disponíveis

### ✅ Jogo do Impostor
- 3+ jogadores
- Um jogador é sorteado como impostor
- 150 palavras diferentes
- Sistema de pontuação
- Roleta para definir ordem de jogada
- Pódio final com top 3

### 🔜 Próximos Jogos
- Em desenvolvimento...
