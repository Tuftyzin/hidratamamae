// script.js

const pesoInput = document.getElementById("peso");
const metaDisplay = document.getElementById("meta");
const consumoInput = document.getElementById("consumo");
const progressoDisplay = document.getElementById("progresso");
const registrarBtn = document.getElementById("registrar");
const fecharDiaBtn = document.getElementById("fechar-dia");
const calendarioDiv = document.getElementById("calendario");
const mesDisplay = document.getElementById("mesAtual");
const mesAnteriorBtn = document.getElementById("mesAnterior");
const mesProximoBtn = document.getElementById("mesProximo");

let hoje = new Date();
let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();
let diaAtual = hoje.getDate();

function calcularMeta(peso) {
  return peso * 35;
}

function atualizarMeta() {
  const peso = parseFloat(pesoInput.value);
  if (!isNaN(peso)) {
    const meta = calcularMeta(peso);
    metaDisplay.textContent = meta.toFixed(0);
    localStorage.setItem("peso", peso);
    localStorage.setItem("metaDiaria", meta);
    atualizarProgresso();
  }
}

function obterHistorico(mes, ano) {
  const chave = `historico-${ano}-${mes}`;
  const historico = JSON.parse(localStorage.getItem(chave));
  return historico || {};
}

function salvarHistorico(mes, ano, historico) {
  const chave = `historico-${ano}-${mes}`;
  localStorage.setItem(chave, JSON.stringify(historico));
}

function atualizarProgresso() {
  const consumo = parseFloat(consumoInput.value) || 0;
  const meta = parseFloat(localStorage.getItem("metaDiaria")) || 0;
  if (meta > 0) {
    const porcentagem = (consumo / meta) * 100;
    progressoDisplay.textContent = `${porcentagem.toFixed(0)}%`;
  } else {
    progressoDisplay.textContent = "0%";
  }
}

function fecharDia() {
  const consumo = parseFloat(consumoInput.value) || 0;
  const meta = parseFloat(localStorage.getItem("metaDiaria")) || 0;
  const porcentagem = meta > 0 ? (consumo / meta) * 100 : 0;

  const historico = obterHistorico(mesAtual, anoAtual);
  historico[diaAtual] = porcentagem;
  salvarHistorico(mesAtual, anoAtual, historico);
  consumoInput.value = "";
  atualizarProgresso();
  gerarCalendario(mesAtual, anoAtual);
}

function gerarCalendario(mes, ano) {
  calendarioDiv.innerHTML = "";
  mesDisplay.textContent = new Date(ano, mes).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  diasSemana.forEach(dia => {
    const div = document.createElement("div");
    div.textContent = dia;
    div.className = "dia semana";
    calendarioDiv.appendChild(div);
  });

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const historico = obterHistorico(mes, ano);

  for (let i = 0; i < primeiroDia; i++) {
    const div = document.createElement("div");
    div.className = "dia vazio";
    calendarioDiv.appendChild(div);
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const div = document.createElement("div");
    div.className = "dia";
    const valor = historico[dia];
    if (valor === undefined) {
      div.style.backgroundColor = "white";
    } else if (valor >= 100) {
      div.style.backgroundColor = "green";
    } else if (valor >= 33) {
      div.style.backgroundColor = "yellow";
    } else {
      div.style.backgroundColor = "red";
    }
    div.textContent = dia;
    div.title = `${dia} - ${valor !== undefined ? valor.toFixed(0) + "%" : "Sem dados"}`;
    calendarioDiv.appendChild(div);
  }

  fecharDiaBtn.disabled = mes !== hoje.getMonth() || ano !== hoje.getFullYear();
}

pesoInput.addEventListener("input", atualizarMeta);
consumoInput.addEventListener("input", atualizarProgresso);
registrarBtn.addEventListener("click", atualizarProgresso);
fecharDiaBtn.addEventListener("click", fecharDia);
mesAnteriorBtn.addEventListener("click", () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  gerarCalendario(mesAtual, anoAtual);
});
mesProximoBtn.addEventListener("click", () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  gerarCalendario(mesAtual, anoAtual);
});

document.addEventListener("DOMContentLoaded", () => {
  const peso = localStorage.getItem("peso");
  if (peso) {
    pesoInput.value = peso;
    atualizarMeta();
  }
  gerarCalendario(mesAtual, anoAtual);
});
