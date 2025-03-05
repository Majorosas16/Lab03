// document.getElementById("get-btn").addEventListener("click", getUsers);

// function getUsers() {
//   fetch("http://localhost:5050/users")
//     .then((response) => response.json())
//     .then((data) => console.log("get response", data))
//     .catch((error) => console.error("Error:", error));
// }

let playerName = ""; // 👈 Mover la declaración arriba

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
      console.log("Respuesta del servidor:", data); // Ver log en consola
      document.getElementById("status").innerText = data.message;
      if (data.message.includes("registrado")) {
        enableButtons(true); // Habilita los botones después del registro
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
      console.log("Respuesta del servidor (play):", data); // Log de depuración
      document.getElementById("status").innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
}

function enableButtons(enabled) {
  document.getElementById("rock-btn").disabled = !enabled;
  document.getElementById("paper-btn").disabled = !enabled;
  document.getElementById("scissors-btn").disabled = !enabled;
}

// Deshabilitar los botones al inicio
enableButtons(false);
