const historico = document.getElementById("historico");
const resultado = document.getElementById("resultado");
const botoes = document.querySelectorAll("button");

let expressao = "";
let calculado = false;

function ultimoEhOperador() {
    return /[+\-*/.]$/.test(expressao);
}

function adicionarValor(valor) {

    if (valor === ",") valor = ".";

    if (["+", "-", "*", "/", "."].includes(valor)) {
        if (expressao === "" && valor !== "-") return;
        if (ultimoEhOperador()) return;
    }

    if (valor === ".") {
        let partes = expressao.split(/[+\-*/]/);
        let ultimoNumero = partes[partes.length - 1];
        if (ultimoNumero.includes(".")) return;
    }

    if (calculado && !isNaN(valor)) {
        expressao = "";
        historico.innerText = "";
        calculado = false;
    }

    if (valor === "%") {
    if (expressao === "") return;

    let ultimo = expressao.slice(-1);

    if (isNaN(ultimo) && ultimo !== ")") return;
}

    expressao += valor;
    resultado.innerText = expressao;
    animarBotao(valor);
}

botoes.forEach(botao => {
    botao.addEventListener("click", () => {

        const valor = botao.dataset.valor;
        const acao = botao.dataset.action;

        if (acao === "clear") {
            expressao = "";
            historico.innerText = "";
            resultado.innerText = "";
            calculado = false;
            return;
        }

        if (acao === "backspace") {
            expressao = expressao.slice(0, -1);
            resultado.innerText = expressao;
            return;
        }

        if (acao === "igualdade") {
            calcularResultado();
            return;
        }

        if (valor) {
            adicionarValor(valor);
        }

    });
});

document.addEventListener("keydown", (event) => {

    if (event.repeat) return;

    const tecla = event.key;

    if (!isNaN(tecla) || ["+", "-", "*", "/", ".", ",", "(", ")", "%"].includes(tecla)) {
        adicionarValor(tecla);
    }

    else if (tecla === "Enter") {
        calcularResultado();
    }

    else if (tecla === "Backspace") {
        expressao = expressao.slice(0, -1);
        resultado.innerText = expressao;
    }

    else if (tecla === "Escape") {
        expressao = "";
        historico.innerText = "";
        resultado.innerText = "";
        calculado = false;
    }

    animarBotao(tecla);
});

function calcularResultado() {
    try {
        let conta = expressao
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/(\d+\.?\d*)%/g, "($1/100)");

       let resultadoFinal = eval(conta);

let textoResultado;

if (Number.isInteger(resultadoFinal)) {
    textoResultado = resultadoFinal.toString();
} else {
    let limitado = resultadoFinal.toFixed(5);

    if (parseFloat(limitado) !== resultadoFinal) {
        textoResultado = parseFloat(limitado) + "...";
    } else {
        textoResultado = parseFloat(limitado).toString();
    }
}

resultado.innerText = textoResultado;
historico.innerText = expressao;

expressao = resultadoFinal.toString();
calculado = true;

    } catch {
        resultado.innerText = "Erro";
        expressao = "";
    }
}

function animarBotao(valor) {
    botoes.forEach(botao => {
        if (botao.dataset.valor === valor || botao.innerText === valor) {
            botao.classList.add("ativo");

            setTimeout(() => {
                botao.classList.remove("ativo");
            }, 150);
        }
    });
}
