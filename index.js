const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let players = {}; // { nombre: null }
let moves = {};   // { nombre: "rock", "paper" o "scissors" }
let timeoutId = null; // Temporizador de 10 segundos
let lastResult = ""; // Último resultado mostrado

// Obtener jugadores registrados
app.get("/users", (req, res) => {
  res.json({ players: Object.keys(players) });
});

// Registro de jugadores
app.post("/register", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  if (Object.keys(players).length >= 2) {
    return res.status(400).json({ message: "El juego ya tiene dos jugadores" });
  }

  players[name] = null;
  res.json({ message: `Jugador ${name} registrado`, players: Object.keys(players) });

  // Cuando hay 2 jugadores, comienza el temporizador
  if (Object.keys(players).length === 2) {
    startCountdown();
  }
});

// Registrar jugada
app.post("/play", (req, res) => {
  const { name, move } = req.body;
  
  if (!players.hasOwnProperty(name)) {
    return res.status(400).json({ message: "Debes registrarte antes de jugar" });
  }

  moves[name] = move;

  // Si al menos un jugador ya jugó, detenemos el temporizador
  if (Object.keys(moves).length === 1) {
    clearTimeout(timeoutId);
    timeoutId = null; // Evitar que se ejecute
  }

  if (Object.keys(moves).length === 2) {
    return determineWinner(res);
  }

  res.json({ message: `Has jugado: ${move}. Esperando al oponente...` });
});

// Iniciar el temporizador de inactividad
function startCountdown() {
  timeoutId = setTimeout(() => {
    const playerNames = Object.keys(players);
    const [p1, p2] = playerNames;
    
    if (!moves[p1] && !moves[p2]) {
      return resetGame("Ambos jugadores perdieron por inactividad.");
    } else if (!moves[p1]) {
      return resetGame(`${p2} gana porque ${p1} no jugó a tiempo.`);
    } else if (!moves[p2]) {
      return resetGame(`${p1} gana porque ${p2} no jugó a tiempo.`);
    }
  }, 10000); // 10 segundos
}

// Determinar el ganador
function determineWinner(res) {
  const playerNames = Object.keys(players);
  const [p1, p2] = playerNames;
  const result = getWinner(moves[p1], moves[p2]);

  lastResult = result === "draw" ? "Empate" : `${result} gana`;
  
  res.json({
    players: playerNames,
    moves,
    result: lastResult
  });

  resetGame(lastResult);
}

// Lógica de piedra, papel o tijeras
function getWinner(move1, move2) {
  if (move1 === move2) return "draw";
  if (
    (move1 === "rock" && move2 === "scissors") ||
    (move1 === "scissors" && move2 === "paper") ||
    (move1 === "paper" && move2 === "rock")
  ) {
    return "Jugador 1";
  }
  return "Jugador 2";
}

// Resetear juego
function resetGame(message) {
  console.log(message);
  lastResult = message; // Guardar resultado
  players = {};
  moves = {};
  timeoutId = null;
}

// Endpoint para obtener resultados
app.get("/result", (req, res) => {
  res.json({ players: Object.keys(players), moves, result: lastResult });
});

// Endpoint para resetear manualmente el juego
app.post("/reset", (req, res) => {
  resetGame("Juego reiniciado");
  res.json({ message: "Juego reiniciado" });
});

app.listen(5050, () => console.log("Servidor corriendo en http://localhost:5050"));
