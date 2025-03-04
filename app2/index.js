// document.getElementById("get-btn").addEventListener("click", getUsers);

// function getUsers() {
//   fetch("http://localhost:5050/users")
//     .then((response) => response.json())
//     .then((data) => console.log("get response", data))
//     .catch((error) => console.error("Error:", error));
// }


document.getElementById("register-btn").addEventListener("click", registerPlayer);
document.getElementById("rock-btn").addEventListener("click", () => sendMove("rock"));
document.getElementById("paper-btn").addEventListener("click", () => sendMove("paper"));
document.getElementById("scissors-btn").addEventListener("click", () => sendMove("scissors"));

let playerName = "";

async function registerPlayer() {
  const name = document.getElementById("name-input").value;
  if (!name) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  const response = await fetch("http://localhost:5050/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  console.log(data.message);

  if (data.players) {
    playerName = name;
    document.getElementById("status").innerText = `Registrado como: ${playerName}`;
  }
}

async function sendMove(move) {
  if (!playerName) {
    alert("Debes registrarte antes de jugar.");
    return;
  }

  const response = await fetch("http://localhost:5050/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName, move }),
  });

  const data = await response.json();
  console.log(data.message);
  document.getElementById("status").innerText = data.message;
}
