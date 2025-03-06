const playersDiv = document.getElementById("players");
const movesDiv = document.getElementById("moves");
const resultDiv = document.getElementById("result");

function fetchGameState() {
  fetch("http://localhost:5050/users")
    .then(response => response.json())
    .then(data => {
      console.log("Estado del juego:", data);

      if (!data.players || data.players.length < 2) {
        playersDiv.innerText = "Esperando el registro de jugadores...";
        movesDiv.innerText = "";
        resultDiv.innerText = "";
        return;
      }

      // Muestra los jugadores registrados
      playersDiv.innerHTML = `<strong>Jugadores:</strong> ${data.players[0]} vs ${data.players[1]}`;

      // Muestra un loading luego de que los jugadores se registran
      if (!data.moves || Object.keys(data.moves).length < 2) {
        movesDiv.innerHTML = `<em>Esperando las jugadas de los jugadores...</em>`;
        resultDiv.innerText = "";
        return;
      }

      // Muestra el nombre y lo que eligió cada jugador (se supone)
      movesDiv.innerHTML = `<strong>${data.players[0]}</strong>: ${data.moves[data.players[0]]} |
                            <strong>${data.players[1]}</strong>: ${data.moves[data.players[1]]}`;

      resultDiv.innerHTML = `<h2 style="color:red;">Result: ${data.winner}</h2>`;

      // Reinicio luego de 5 segundos atravez de un POST
      setTimeout(() => {
        fetch("http://localhost:5050/reset", { method: "POST" })
          .then(() => {
            playersDiv.innerText = "Waiting for players...";
            movesDiv.innerText = "";
            resultDiv.innerText = "";
          });
      }, 5000);
    })
    .catch(error => console.error("Error:", error));
}

// Actualizar cada 2 segundos, si no no aparece nada en el display
setInterval(fetchGameState, 2000);
