let playerName = "";

document.getElementById("register-btn").addEventListener("click", registerPlayer);
document.getElementById("rock-btn").addEventListener("click", () => play("rock"));
document.getElementById("paper-btn").addEventListener("click", () => play("paper"));
document.getElementById("scissors-btn").addEventListener("click", () => play("scissors"));

function registerPlayer() {
  playerName = document.getElementById("name-input").value.trim();

  if (!playerName) {
    document.getElementById("status").innerText = "Debes ingresar un nombre.";
    return;
  }

  fetch("http://localhost:5050/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("status").innerText = data.message;
      if (data.message.includes("registrado")) {
        enableButtons(true);
        startCountdown();
      }
    })
    .catch(error => console.error("Error:", error));
}

function play(move) {
  if (!playerName) {
    document.getElementById("status").innerText = "Debes registrarte primero.";
    return;
  }

  fetch("http://localhost:5050/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName, move })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("status").innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
}

function enableButtons(enabled) {
  document.getElementById("rock-btn").disabled = !enabled;
  document.getElementById("paper-btn").disabled = !enabled;
  document.getElementById("scissors-btn").disabled = !enabled;
}

function startCountdown() {
  let timeLeft = 10;
  const timerDisplay = document.getElementById("status");
  
  const timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerDisplay.innerText = "¡Tiempo agotado!";
      enableButtons(false);
    } else {
      timerDisplay.innerText = `Tiempo restante: ${timeLeft} segundos`;
      timeLeft--;
    }
  }, 1000);
}

// Deshabilita los botones al inicio
enableButtons(false);
