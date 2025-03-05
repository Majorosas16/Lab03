const playersDiv = document.getElementById("players");
const movesDiv = document.getElementById("moves");
const resultDiv = document.getElementById("result");

function fetchGameState() {
  fetch("http://localhost:5050/result")
  .then(response => response.json())
  .then(data => {
      console.log("Estado del juego:", data); // Para depuración

      if (!data.players || data.players.length < 2) {
          playersDiv.innerText = "Waiting for players...";
          movesDiv.innerText = "";
          resultDiv.innerText = "";
          return;
      }

      // Mostrar jugadores
      playersDiv.innerHTML = `<strong>Players:</strong> ${data.players[0]} vs ${data.players[1]}`;

      // Si aún no han jugado los dos, esperar
      if (!data.moves || Object.keys(data.moves).length < 2) {
          movesDiv.innerHTML = `<em>Waiting for both players to play...</em>`;
          resultDiv.innerText = "";
          return;
      }

      // Mostrar jugadas
      movesDiv.innerHTML = `<strong>${data.players[0]}</strong>: ${data.moves[data.players[0]]} |
                            <strong>${data.players[1]}</strong>: ${data.moves[data.players[1]]}`;

      // Mostrar resultado
      resultDiv.innerHTML = `<h2 style="color:red;">Result: ${data.result}</h2>`;

      // 🔥 Esperar 5s antes de resetear
      setTimeout(() => {
          fetch("http://localhost:5050/reset", { method: "POST" });
      }, 5000);
  })
  .catch(error => console.error("Error:", error));
}

// Actualizar cada 2 segundos
setInterval(fetchGameState, 2000);
