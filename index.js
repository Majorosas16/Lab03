const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); // Habilita peticiones desde el front
app.use(express.json());

app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let players = {}; // { nombre: jugada }
let moves = {};   // { nombre: "rock", "paper" o "scissors" }

app.post("/register", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  if (Object.keys(players).length >= 2) {
    return res.status(400).json({ message: "El juego ya tiene dos jugadores" });
  }

  players[name] = null; // Jugador registrado pero sin jugar
  res.json({ message: `Jugador ${name} registrado`, players: Object.keys(players) });
});

app.post("/play", (req, res) => {
  const { name, move } = req.body;
  if (!players.hasOwnProperty(name)) {
    return res.status(400).json({ message: "Debes registrarte antes de jugar" });
  }

  moves[name] = move;

  if (Object.keys(moves).length === 2) {
    res.json({ message: "Esperando al otro jugador..." });
  } else {
    res.json({ message: `Has jugado: ${move}. Esperando al oponente...` });
  }
});

app.get("/result", (req, res) => {
  const playerNames = Object.keys(moves);

  if (playerNames.length < 2) {
    return res.json({ message: "Esperando a ambos jugadores..." });
  }

  const [p1, p2] = playerNames;
  const result = determineWinner(moves[p1], moves[p2]);

  const finalResult = result === "draw" ? "Empate" : `${result} gana`;

  res.json({
    players: playerNames,
    moves,
    result: finalResult,
  });

  setTimeout(() => {
    players = {};
    moves = {};
  }, 5000); // Reiniciar el juego después de 5 segundos
});

function determineWinner(move1, move2) {
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

app.listen(5050, () => console.log("Servidor corriendo en http://localhost:5050"));
