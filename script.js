const pesoInput = document.getElementById("peso");
const calcularBtn = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const progresso = document.getElementById("progresso");
const registrarBtn = document.getElementById("registrar");
const fecharDiaBtn = document.getElementById("fechar-dia");

const historico = JSON.parse(localStorage.getItem("historicoHidrataMamae")) || {};
const dataAtual = new Date().toISOString().split("T")[0];

registrarBtn.addEventListener("click", () => {
  const valor = parseFloat(prompt("Quantos ml de água você tomou agora?"));
  if (!isNaN(valor)) {
    let total = parseFloat(localStorage.getItem("consumoHoje")) || 0;
    total += valor;
    localStorage.setItem("consumoHoje", total.toString());
    atualizarProgresso();
  }
});

calcularBtn.addEventListener("click", () => {
  const peso = parseFloat(pesoInput.value);
  if (!isNaN(peso)) {
    const agua = peso * 35;
    resultado.textContent = `Você deve tomar cerca de ${agua.toFixed(0)} ml de água por dia.`;
    localStorage.setItem("peso", peso);
    localStorage.setItem("metaDiaria", agua);
    atualizarProgresso();
    renderizarCalendario();
  }
});

fecharDiaBtn.addEventListener("click", () => {
  const meta = parseFloat(localStorage.getItem("metaDiaria")) || 0;
  const consumo = parseFloat(localStorage.getItem("consumoHoje")) || 0;
  if (meta > 0) {
    const percentual = (consumo / meta) * 100;
    historico[dataAtual] = percentual;
    localStorage.setItem("historicoHidrataMamae", JSON.stringify(historico));
    localStorage.setItem("consumoHoje", "0");
    atualizarProgresso();
    renderizarCalendario();
    alert(`Dia fechado! Você atingiu ${percentual.toFixed(1)}% da meta.`);
  } else {
    alert("Defina o peso primeiro para calcular a meta.");
  }
});

function atualizarProgresso() {
  const meta = parseFloat(localStorage.getItem("metaDiaria")) || 0;
  const atual = parseFloat(localStorage.getItem("consumoHoje")) || 0;
  if (meta > 0) {
    const porcentagem = Math.min((atual / meta) * 100, 100);
    progresso.style.width = `${porcentagem}%`;
    progresso.textContent = `${porcentagem.toFixed(0)}%`;
  } else {
    progresso.style.width = "0%";
    progresso.textContent = "0%";
  }
}

function renderizarCalendario() {
  const calendario = document.getElementById("calendario");
  calendario.innerHTML = "";

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes, dia).toISOString().split("T")[0];
    const valor = historico[data] ?? null;

    const div = document.createElement("div");
    div.className = "dia";
    div.textContent = dia;

    if (valor === null) {
      div.title = `${dia} - Sem registro`;
      div.style.backgroundColor = "#ffffff"; // branco
    } else {
      div.title = `${dia} - ${valor.toFixed(0)}% da meta`;

      if (valor >= 100) {
        div.style.backgroundColor = "#4caf50"; // verde
      } else if (valor >= 33 && valor <= 66) {
        div.style.backgroundColor = "#ffeb3b"; // amarelo
      } else {
        div.style.backgroundColor = "#f44336"; // vermelho
      }
    }

    calendario.appendChild(div);
  }
}

// Inicialização
window.onload = () => {
  const peso = localStorage.getItem("peso");
  if (peso) {
    pesoInput.value = peso;
    calcularBtn.click();
  }
  atualizarProgresso();
  renderizarCalendario();
};
