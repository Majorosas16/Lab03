// document.getElementById("get-btn").addEventListener("click", getUsers);

// function getUsers() {
//   fetch("http://localhost:5050/users")
//     .then((response) => response.json())
//     .then((data) => console.log("get response", data))
//     .catch((error) => console.error("Error:", error));
// }
const playersDiv = document.getElementById("players");
const movesDiv = document.getElementById("moves");
const resultDiv = document.getElementById("result");

function fetchGameState() {
  fetch("http://localhost:5050/result")
  .then(response => response.json())
  .then(data => {
      if (!data.players || data.players.length < 2) {
          playersDiv.innerText = "Esperando jugadores...";
          movesDiv.innerText = "";
          resultDiv.innerText = "";
          return;
      }

      playersDiv.innerText = `Jugadores: ${data.players[0]} vs ${data.players[1]}`;

      if (!data.moves || Object.keys(data.moves).length < 2) {
          movesDiv.innerText = "Esperando a que ambos jueguen...";
          resultDiv.innerText = "";
          return;
      }

      movesDiv.innerText = `${data.players[0]}: ${data.moves[data.players[0]]}  |  
                            ${data.players[1]}: ${data.moves[data.players[1]]}`;

      resultDiv.innerText = `Resultado: ${data.result}`;

      // Reiniciar juego después de 5 segundos
      setTimeout(() => {
          fetch("http://localhost:5050/reset", { method: "POST" })
              .then(() => {
                  playersDiv.innerText = "Esperando jugadores...";
                  movesDiv.innerText = "";
                  resultDiv.innerText = "";
              });
      }, 5000);
  })
  .catch((error) => console.error("Error:", error));

}

// Actualizar cada 2 segundos
setInterval(fetchGameState, 2000);

