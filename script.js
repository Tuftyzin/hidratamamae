let meta = 0;
let consumo = 0;

function calcularMeta() {
  const peso = parseFloat(document.getElementById("peso").value);
  if (isNaN(peso) || peso <= 0) {
    alert("Digite um peso válido!");
    return;
  }

  meta = peso * 35; // ml por kg
  consumo = 0;

  document.getElementById("metaAgua").textContent = `${(meta / 1000).toFixed(2)} L`;
  atualizarProgresso();

  document.getElementById("resultado").classList.remove("hidden");
  salvarEstado();
}

function adicionarAgua(ml) {
  consumo += ml;
  atualizarProgresso();
  salvarEstado();
}

function atualizarProgresso() {
  document.getElementById("consumoAtual").textContent = `${(consumo / 1000).toFixed(2)} L`;
  const porcentagem = ((consumo / meta) * 100).toFixed(1);
  document.getElementById("porcentagem").textContent = isNaN(porcentagem) ? 0 : porcentagem;
}

function resetarConsumo() {
  if (confirm("Tem certeza que deseja resetar o consumo de hoje?")) {
    consumo = 0;
    atualizarProgresso();
    salvarEstado();
  }
}

function ativarNotificacoes() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      alert("Notificações ativadas! Você receberá lembretes a cada 2 horas.");
      setInterval(() => {
        new Notification("Hora de beber água! 💧");
      }, 2 * 60 * 60 * 1000); // 2 horas
    } else {
      alert("Você precisa permitir notificações no navegador.");
    }
  });
}

function salvarEstado() {
  const estado = {
    meta,
    consumo
  };
  localStorage.setItem("hidrataMamae", JSON.stringify(estado));
}

function carregarEstado() {
  const dados = localStorage.getItem("hidrataMamae");
  if (dados) {
    const { meta: m, consumo: c } = JSON.parse(dados);
    meta = m;
    consumo = c;
    if (meta > 0) {
      document.getElementById("metaAgua").textContent = `${(meta / 1000).toFixed(2)} L`;
      atualizarProgresso();
      document.getElementById("resultado").classList.remove("hidden");
    }
  }
}

window.onload = carregarEstado;
