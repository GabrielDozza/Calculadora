const historico = document.getElementById("historico");
const resultado = document.getElementById("resultado");
const botoes = document.querySelectorAll("button");

let expressao = "";
let calculado = false;

function ultimoEhOperador() {
    return /[+\-*/.]$/.test(expressao);
}

function expressaoValida() {
    return !/[+\-*/.]$/.test(expressao);
}

function adicionarValor(valor) {

    if (valor === ",") valor = ".";

    // Não deixar começar errado
    if (expressao === "" && ["+", "*", "/", ")", "%"].includes(valor)) return;

    // Se já calculou
    if (calculado) {
        if (/[0-9.(]/.test(valor)) {
            expressao = "";
            historico.innerText = "";
        }
        calculado = false;
    }

   // Controle de operadores (exceto "-")
    if (["+", "*", "/", "."].includes(valor)) {
    if (ultimoEhOperador()) return;
    }


    if (valor === "-") {

    
    if (expressao === "") {
        expressao += valor;
        resultado.classList.remove("pequeno");
        resultado.innerText = expressao;
        animarBotao(valor);
        return;
    }

    let ultimo = expressao.slice(-1);

    
    if (/[+\-*/(]$/.test(ultimo)) {
        expressao += valor;
        resultado.classList.remove("pequeno");
        resultado.innerText = expressao;
        animarBotao(valor);
        return;
    }

    // ❌ impedir "--"
    if (ultimo === "-") return;
    }

    // Evitar múltiplos pontos
    if (valor === ".") {
        let partes = expressao.split(/[+\-*/]/);
        let ultimoNumero = partes[partes.length - 1];
        if (ultimoNumero.includes(".")) return;
    }

    // Controle de %
    if (valor === "%") {
        if (expressao === "") return;
        let ultimo = expressao.slice(-1);
        if (isNaN(ultimo) && ultimo !== ")") return;
    }

    // Controle de parênteses
    if (valor === ")") {
        let abertas = (expressao.match(/\(/g) || []).length;
        let fechadas = (expressao.match(/\)/g) || []).length;
        if (fechadas >= abertas) return;
    }

    // Multiplicação automática
    if (
        expressao !== "" &&
        (
            (valor === "(" && /[0-9)]$/.test(expressao)) ||
            (!isNaN(valor) && /\)$/.test(expressao))
        )
    ) {
        expressao += "*";
    }

    expressao += valor;

    resultado.classList.remove("pequeno");
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
            resultado.classList.remove("pequeno");
            resultado.innerText = "0";
            calculado = false;
            return;
        }

        if (acao === "backspace") {
            expressao = expressao.slice(0, -1);
            resultado.classList.remove("pequeno");
            resultado.innerText = expressao || "0";
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
        resultado.classList.remove("pequeno");
        resultado.innerText = expressao || "0";
    }

    else if (tecla === "Escape") {
        expressao = "";
        historico.innerText = "";
        resultado.classList.remove("pequeno");
        resultado.innerText = "0";
        calculado = false;
    }

    animarBotao(tecla);
});

function calcularResultado() {

    if (expressao === "" || !expressaoValida()) {
        resultado.classList.remove("pequeno");
        resultado.innerText = "Conta incompleta";
        resultado.classList.add("pequeno");
        return;
    }

    try {
        let conta = expressao
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/(\d+\.?\d*)%/g, "($1/100)");

        let resultadoFinal = eval(conta);

        // Divisão por zero
        if (!isFinite(resultadoFinal)) {
            resultado.innerText = "Não pode dividir por zero";
            resultado.classList.add("pequeno");
            expressao = "";
            return;
        }

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

        historico.innerText = expressao;

        resultado.classList.remove("pequeno");
        resultado.innerText = textoResultado;

        expressao = resultadoFinal.toString();
        calculado = true;

    } catch {
        resultado.innerText = "Erro";
        resultado.classList.add("pequeno");
        expressao = "";

        setTimeout(() => {
            resultado.classList.remove("pequeno");
            resultado.innerText = "0";
        }, 1500);
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