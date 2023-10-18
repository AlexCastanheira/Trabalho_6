let numJogadores;
let times = [];
let partidas = [];
let resultados = [];

function criarTimes() {
  numJogadores = parseInt(document.getElementById("numJogadores").value);
  if (numJogadores < 2 || numJogadores > 20) {
    alert("Número de jogadores deve estar entre 2 e 20.");
    return;
  }

  const inputNomes = document.getElementById("inputNomes");
  inputNomes.innerHTML = "";

  for (let i = 1; i <= numJogadores; i++) {
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome do time " + i;
    inputNomes.appendChild(inputNome);
  }

  const nomesTimes = document.getElementById("nomesTimes");
  nomesTimes.style.display = "block";
  document.getElementById("partidas").style.display = "none";
  document.getElementById("resultado").style.display = "none";
}

function iniciarPartida() {
  const inputNomes = document.getElementById("inputNomes");
  const nomesTimes = document.getElementById("nomesTimes");
  const partidasDiv = document.getElementById("partidas");
  const mostrarResultadoBtn = document.getElementById("mostrarResultado");

  times = [];
  partidas = [];
  resultados = [];

  for (let i = 0; i < numJogadores; i++) {
    const inputNome = inputNomes.children[i];
    if (!inputNome.value.trim()) {
      alert("Por favor, preencha todos os nomes dos times.");
      return;
    }
    times.push({ nome: inputNome.value, pontos: 0 });
  }

  inputNomes.innerHTML = "";
  nomesTimes.style.display = "none";
  partidasDiv.style.display = "block";

  criarTabelaPartidas();
}

function criarTabelaPartidas() {
  const tabelaPartidas = document.getElementById("tabelaPartidas");
  tabelaPartidas.innerHTML = "";
  let nPartidas = 0;

  for (let i = 0; i < numJogadores; i++) {
    for (let j = i + 1; j < numJogadores; j++) {
      const partida = {
        timeA: times[i].nome,
        timeB: times[j].nome,
        resultado: ""
      };
      partidas.push(partida);
      nPartidas++;
      const row = tabelaPartidas.insertRow();
      const cell1 = row.insertCell(0);
      cell1.textContent = times[i].nome + " X " + times[j].nome;
      const resultadoCell = row.insertCell(1);

      const radioVencedorA = document.createElement("input");
      radioVencedorA.type = "radio";
      radioVencedorA.name = "resultado_" + i + "_" + j;
      radioVencedorA.value = "A";
      resultadoCell.appendChild(radioVencedorA);
      resultadoCell.appendChild(document.createTextNode(" Vencedor " + times[i].nome + " "));

      const radioEmpate = document.createElement("input");
      radioEmpate.type = "radio";
      radioEmpate.name = "resultado_" + i + "_" + j;
      radioEmpate.value = "Empate";
      resultadoCell.appendChild(radioEmpate);
      resultadoCell.appendChild(document.createTextNode(" Empate "));

      const radioVencedorB = document.createElement("input");
      radioVencedorB.type = "radio";
      radioVencedorB.name = "resultado_" + i + "_" + j;
      radioVencedorB.value = "B";
      resultadoCell.appendChild(radioVencedorB);
      resultadoCell.appendChild(document.createTextNode(" Vencedor " + times[j].nome + " "));


      // Adicione um evento de clique para verificar se todos os botões de rádio foram selecionados
      radioVencedorA.addEventListener("click", () => verificarBotoesSelecionados(nPartidas));
      radioEmpate.addEventListener("click", () => verificarBotoesSelecionados(nPartidas));
      radioVencedorB.addEventListener("click", () => verificarBotoesSelecionados(nPartidas));
    }
  }
  verificarBotoesSelecionados(nPartidas);

}


function verificarBotoesSelecionados(nPartidas) {
  const radios = document.querySelectorAll("input[type='radio']");
  const mostrarResultadoBtn = document.getElementById("mostrarResultado");
  const selecionados = Array.from(radios).filter((radio) => radio.checked);

  if (selecionados.length === nPartidas) {
    mostrarResultadoBtn.style.display = "block";
  } else {
    mostrarResultadoBtn.style.display = "none";
  }
}

function mostrarResultado() {
  const tabelaResultado = document.getElementById("tabelaResultado");
  if (!tabelaResultado) {
    
    console.error("Elemento tabelaResultado não encontrado.");
    return;
  }

  tabelaResultado.innerHTML = "";

  times.forEach((time) => {
    time.pontos = 0;
  });

  for (let i = 0; i < numJogadores; i++) {
    for (let j = i + 1; j < numJogadores; j++) {
      const partidaIndex = i * numJogadores + j;
      const radioResultado = document.querySelector(
        "input[name='resultado_" + i + "_" + j + "']:checked"
      );

      if (radioResultado) {
        const resultado = radioResultado.value;
        resultados[partidaIndex] = resultado;

        if (resultado === "A") {
          times[i].pontos += 3;
        } else if (resultado === "Empate") {
          times[i].pontos += 1;
          times[j].pontos += 1;
        } else if (resultado === "B") {
          times[j].pontos += 3;
        }
      }
    }
  }

  times.sort((a, b) => b.pontos - a.pontos); 

  if (tabelaResultado) {
    times.forEach((time) => {
      const row = tabelaResultado.insertRow();
      row.insertCell(0).textContent = time.nome;
      row.insertCell(1).textContent = time.pontos;
    });
  }

  const mostrarResultadoBtn = document.getElementById("mostrarResultado");
  mostrarResultadoBtn.disabled = true;

  document.getElementById("resultado").style.display = "block";
}




function registrarResultado(i, j, resultado) {
  const partidaIndex = i * numJogadores + j;
  partidas[partidaIndex].resultado = resultado;

  if (resultado === "A") {
    times[i].pontos += 3;
  } else if (resultado === "Empate") {
    times[i].pontos += 1;
    times[j].pontos += 1;
  } else if (resultado === "B") {
    times[j].pontos += 3;
  }

  verificarBotoesSelecionados();
}

function salvarPartida() {
  const partidaSalva = {
    numJogadores: numJogadores,
    times: times,
    partidas: partidas,
    resultados: resultados
  };
  localStorage.setItem("partidaSalva", JSON.stringify(partidaSalva));
  alert("Partida salva no LocalStorage.");
}


function carregarPartida() {
  const partidaSalva = JSON.parse(localStorage.getItem("partidaSalva"));
  if (!partidaSalva) {
    alert("Nenhuma partida salva encontrada.");
    return;
  }

  numJogadores = partidaSalva.numJogadores;
  times = partidaSalva.times;
  partidas = partidaSalva.partidas;
  resultados = partidaSalva.resultados;

  

  const inputNomes = document.getElementById("inputNomes");
  inputNomes.innerHTML = "";
  for (let i = 0; i < numJogadores; i++) {
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = times[i].nome;
    inputNomes.appendChild(inputNome);
  }

 
  criarTabelaPartidas();
  mostrarResultado();
  document.getElementById("nomesTimes").style.display = "none";
  document.getElementById("partidas").style.display = "block";
  alert("Partida carregada do LocalStorage.");
  
}



function limparLocalStorage() {
  localStorage.removeItem("partidaSalva");
  alert("LocalStorage limpo.");
}

function novaPartida() {
  location.reload();
}
