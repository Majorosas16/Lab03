const express = require("express");
const path = require("path"); // Manejar rutas de archivos.
const cors = require("cors"); // Permite que pueda tener varias pestañas abiertas del mismo localhost

//(Cross-Origin Resource Sharing) es un middleware que permite a los navegadores web realizar solicitudes HTTP desde un dominio diferente al dominio del servidor.
const app = express();
app.use(cors()); //Habilita el cors
app.use(express.json());

//"Todos los archivos dentro de la carpeta 'app1' se vuelven accesibles bajo la ruta '/app1' o '/app2'".
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let players = [];
let moves = {};  //El movimiento de cada jugador quedará guardado en el objeto
let timeoutId = null; //por el momento el temporizador no está activo
let lastResult = ""; 

// GET: Obtener jugadores registrados
app.get("/users", (req, res) => {
  res.json({ players: Object.keys(players), moves, winner: lastResult });
});

// POST: Registro de por medio del input
app.post("/register", (req, res) => {
  const { name } = req.body;
  if (!name) { //Verifica que antes de darle al btn registrar haya un nombre
    return res.status(400).json({ message: "Ops, el nombre es obligatorio" });
  }
//objects.keys() devuelve un array de keys en las propiedades de "players  "
  if (Object.keys(players).length >= 2) {
    return res.status(400).json({ message: "Ops, solo 2 jugadores" });
  }

  players[name] = null; //Este jugador se ha registrado, pero aún no sabemos qué jugada ha elegido

  res.json({ message: `¡Jugador ${name} registrado!`, players: Object.keys(players) });

  // Cuando hay 2 jugadores, comienza el temporizador o la function startCountdown()
  if (Object.keys(players).length === 2) {
    countdown();
  }
});

// POST: El juego
app.post("/play", (req, res) => {
  const { name, move } = req.body;
  
  if (!players.hasOwnProperty(name)) {
    return res.status(400).json({ message: "Debes registrarte" });
  }

  moves[name] = move; //Se guarda la jugada del jugador con base a su nombre

  // Resetea temporizador si ambos jugadores han jugado.
  if (Object.keys(moves).length === 1) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
//Verifica si ambos jugadores han realizado sus jugadas.
  if (Object.keys(moves).length === 2) {
    resultsGame(req, res);
    return;
  }

  res.json({ message: `Elegiste: ${move}. Espera tu oponente` });
});

//POST: Reiniciar juego
app.post("/reset", (req, res) => {
  resetGame("Nuevo juego iniciado");
  res.json({ message: "Juego reiniciado" });
});

// Contador 10s en partida
function countdown() {
  timeoutId = setTimeout(() => {
    const playerNames = Object.keys(players);
    const [p1, p2] = playerNames; //desestructuración de arrays, le asigna a p1 y p2 el nombre dependiendo de la posición en el array
    
    //Innactividad
    if (!moves[p1] && !moves[p2]) {
      return resetGame("Ambos jugadores perdieron por inactividad.");
    } else if (!moves[p1]) {
      return resetGame(`${p2} gana porque ${p1} no jugó a tiempo.`);
    } else if (!moves[p2]) {
      return resetGame(`${p1} gana porque ${p2} no jugó a tiempo.`);
    }
  }, 10000); 
}

// Reglas del juego. Envia respuesta al cliente en un JSON
function resultsGame(req, res) {
  const { name } = req.body;
  const playerNames = Object.keys(players);
  const [p1, p2] = playerNames;
  const winPlayer = gameRules(moves[p1], moves[p2], name);

  if (winPlayer === "empate") {
    lastResult = "Empate";
  } else {
    lastResult = `${winPlayer} gana`;
  }
  
  //Winner JSON
  res.json({
    players: playerNames,
    moves,
    winner: lastResult
  });

  resetGame(lastResult);
}

// Reglas
function gameRules(move1, move2, name) {
  if (move1 === move2) return "empate";
  if ((move1 === "rock" && move2 === "scissors") || (move1 === "scissors" && move2 === "paper") || (move1 === "paper" && move2 === "rock")){

    return `Jugador ${name}`;
  }
  return `Jugador ${name}`;
}

// Resetea juego despues de jugar o si se acaba el tiempo
function resetGame(message) {
  console.log(message);

  lastResult = message;
  players = {};
  moves = {};
  timeoutId = null;
}

app.listen(5050, () => console.log("All good in: http://localhost:5050"));
