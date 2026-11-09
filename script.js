// As cartas ficam no JavaScript para funcionar ao abrir index.html diretamente.
const cartas = [
    { nome: "Guerreiro", forca: 7, mana: 3, arcano: 4, tipo: "GUERREIRO", simbolo: "⚔", imagem: "imagem guerreiro/images.jpg" }, // Seiya / Cavaleiro
    { nome: "Monge", forca: 4, mana: 7, arcano: 5, tipo: "MAGO ESPIRITUAL", simbolo: "✦", imagem: "imagem guerreiro/monge imagem.jpg" }, // Mestre Kame
    { nome: "Tanque", forca: 6, mana: 4, arcano: 3, tipo: "GUARDIÃO", simbolo: "🛡", imagem: "imagem guerreiro/tanque imagem.webp" }, // Hulk
    { nome: "Guarda", forca: 5, mana: 3, arcano: 4, tipo: "PROTETOR", simbolo: "🎖", imagem: "imagem guerreiro/Guardião imagem.jpg" }, // Lupin III
    { nome: "Ladrão", forca: 3, mana: 5, arcano: 6, tipo: "LÂMINA SOMBRIA", simbolo: "🗡", imagem: "imagem guerreiro/images Ladrão.jpg" }, // Goku
    { nome: "Dragão", forca: 10, mana: 6, arcano: 8, tipo: "DRAGÃO MÍSTICO", simbolo: "🐉", imagem: "imagem guerreiro/dragão.jpg"} // Shenlong
];

let pontosJogador = 0;
let pontosBot = 0;
let empates = 0;

function criarArte(carta) {
    // Se a propriedade imagem existir, renderiza a tag img ocupando o espaço do símbolo
    if (carta.imagem) {
        return `
            <div class="arte-carta">
                <img src="${carta.imagem}" alt="Ilustração de ${carta.nome}" 
                     style="width: 100%; height: 100%; object-fit: cover; display: block;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="placeholder-arte" style="display:none;">
                    <span class="simbolo">${carta.simbolo}</span>
                    <small>ESPAÇO PARA ILUSTRAÇÃO 2D</small>
                </div>
            </div>
        `;
    } else {
        // Fallback caso a carta não possua nenhuma propriedade de imagem definida
        return `
            <div class="arte-carta">
                <div class="placeholder-arte" style="display:flex;">
                    <span class="simbolo">${carta.simbolo}</span>
                    <small>ESPAÇO PARA ILUSTRAÇÃO 2D</small>
                </div>
            </div>
        `;
    }
}

function mostrarCartas() {
    const areaCartas = document.getElementById("cartas");
    areaCartas.innerHTML = "";

    cartas.forEach(function(carta, indice) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "carta";
        botao.innerHTML = `
            <div class="carta-nome">${carta.nome}</div>
            ${criarArte(carta)}
            <div class="atributos">
                <p class="atributo">FORÇA <strong>${carta.forca}</strong></p>
                <p class="atributo">MANA <strong>${carta.mana}</strong></p>
                <p class="atributo">ARCANO <strong>${carta.arcano}</strong></p>
            </div>
            <p class="tipo-carta">${carta.tipo}</p>
        `;
        botao.addEventListener("click", function() {
            jogar(indice);
        });
        areaCartas.appendChild(botao);
    });
}

function descobrirAtributoPrincipal(carta) {
    const atributos = [
        { nome: "Mana", valor: carta.mana },
        { nome: "Força", valor: carta.forca },
        { nome: "Arcano", valor: carta.arcano }
    ];
    atributos.sort(function(a, b) { return b.valor - a.valor; });
    return atributos[0];
}

function verificarVantagem(atributoJogador, atributoBot) {
    if (atributoJogador === atributoBot) return "igual";

    if (
        (atributoJogador === "Mana" && atributoBot === "Força") ||
        (atributoJogador === "Força" && atributoBot === "Arcano") ||
        (atributoJogador === "Arcano" && atributoBot === "Mana")
    ) {
        return "jogador";
    }
    return "bot";
}

function mostrarCartaNaArena(carta, atributoPrincipal) {
    return `
        <h3>${carta.nome}</h3>
        <p>Força: ${carta.forca}</p>
        <p>Mana: ${carta.mana}</p>
        <p>Arcano: ${carta.arcano}</p>
        <p><strong>Principal: ${atributoPrincipal.nome} (${atributoPrincipal.valor})</strong></p>
    `;
}

function jogar(indiceJogador) {
    const cartaJogador = cartas[indiceJogador];
    let indiceBot;

    do {
        indiceBot = Math.floor(Math.random() * cartas.length);
    } while (indiceBot === indiceJogador);

    const cartaBot = cartas[indiceBot];
    const atributoJogador = descobrirAtributoPrincipal(cartaJogador);
    const atributoBot = descobrirAtributoPrincipal(cartaBot);

    const areaJogador = document.getElementById("cartaJogador");
    const areaBot = document.getElementById("cartaBot");
    areaJogador.className = "carta-arena";
    areaBot.className = "carta-arena";
    areaJogador.innerHTML = mostrarCartaNaArena(cartaJogador, atributoJogador);
    areaBot.innerHTML = mostrarCartaNaArena(cartaBot, atributoBot);

    let mensagem;

    if (atributoJogador.nome === atributoBot.nome) {
        if (atributoJogador.valor > atributoBot.valor) {
            pontosJogador++;
            mensagem = "VITÓRIA! Seu atributo " + atributoJogador.nome + " teve o maior valor.";
        } else if (atributoBot.valor > atributoJogador.valor) {
            pontosBot++;
            mensagem = "DERROTA! O atributo " + atributoBot.nome + " do robô teve o maior valor.";
        } else {
            empates++;
            mensagem = "EMPATE! Os atributos principais têm o mesmo valor.";
        }
    } else {
        const vencedor = verificarVantagem(atributoJogador.nome, atributoBot.nome);
        if (vencedor === "jogador") {
            pontosJogador++;
            mensagem = "VITÓRIA! " + atributoJogador.nome + " vence " + atributoBot.nome + ".";
        } else {
            pontosBot++;
            mensagem = "DERROTA! " + atributoBot.nome + " vence " + atributoJogador.nome + ".";
        }
    }

    document.getElementById("resultado").textContent = mensagem;
    atualizarPlacar();
}

function atualizarPlacar() {
    document.getElementById("pontosJogador").textContent = pontosJogador;
    document.getElementById("pontosBot").textContent = pontosBot;
    document.getElementById("empates").textContent = empates;
}

function reiniciarPlacar() {
    pontosJogador = 0;
    pontosBot = 0;
    empates = 0;
    atualizarPlacar();

    const areaJogador = document.getElementById("cartaJogador");
    const areaBot = document.getElementById("cartaBot");
    areaJogador.className = "carta-arena vazia";
    areaBot.className = "carta-arena vazia";
    areaJogador.innerHTML = '<span class="selo-vazio">?</span><p>Aguardando escolha</p>';
    areaBot.innerHTML = '<span class="selo-vazio">?</span><p>Aguardando desafio</p>';
    document.getElementById("resultado").textContent = "Placar reiniciado. Escolha uma carta!";
}

document.getElementById("reiniciar").addEventListener("click", reiniciarPlacar);
mostrarCartas();
