const express = require('express');
const cors = require('cors');
const app = express();
const port = 2000;
// Liste erlaubter Origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://dartsappv2.netlify.app',
    'http://127.0.0.1:3000'
  ];
  
  // CORS-Optionen dynamisch festlegen
  const corsOptions = {
    origin: function (origin, callback) {
      // Falls keine Origin (z.B. bei mobilen Apps oder Postman), immer zulassen
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Nicht erlaubter Origin: ' + origin));
      }
    }
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

// Fake-"Datenbank"
let games = [
  
];

// Alle Spiele abrufen
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Einzelnes Spiel abrufen
app.get('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const game = games.find(g => g.id === id);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ fehler: 'Spiel nicht gefunden' });
  }
});

// Neues Spiel hinzufügen
app.post('/api/games', (req, res) => {
  const start_score = req.body.punkte[0]
  console.log(start_score)
  const neuesSpiel = {
    id: Date.now(),
    players: [{
        name: req.body.spieler[0],
        score: start_score,
        score_voher: start_score,
        wurf1: 0,
        wurf2: 0,
        wurf3: 0,
        wurf1_feld: 0,
        wurf2_feld: 0,
        wurf3_feld: 0,
        alle_wurfe: [],
        average: 0,
        start: start_score,
        legs: req.body.plegs1

    },
    {
        name: req.body.spieler[1],
        score: start_score,
        score_voher: start_score,
        wurf1: 0,
        wurf2: 0,
        wurf3: 0,
        wurf1_feld: 0,
        wurf2_feld: 0,
        wurf3_feld: 0,
        alle_wurfe: [],
        average: 0,
        start: start_score,
        legs: req.body.plegs2

    }],
    am_zug:1,
    bereits_geworfen:0,
    max_legs: req.body.legs,
    doppelout: req.body.doppelout,

  };
  games.push(neuesSpiel);
  res.status(201).json(neuesSpiel);
  console.log(neuesSpiel)
});

app.post('/api/games/leg', (req, res) => {
  const start_score = req.body.punkte[0]
  console.log(start_score)
  const neuesSpiel = {
    id: Date.now(),
    players: [{
        name: req.body.spieler[0],
        score: start_score,
        score_voher: start_score,
        wurf1: 0,
        wurf2: 0,
        wurf3: 0,
        wurf1_feld: 0,
        wurf2_feld: 0,
        wurf3_feld: 0,
        alle_wurfe: req.body.players[0].alle_wurfe,
        average: req.body.players[0].average,
        start: start_score,
        legs: req.body.players[0].legs

    },
    {
        name: req.body.spieler[1],
        score: start_score,
        score_voher: start_score,
        wurf1: 0,
        wurf2: 0,
        wurf3: 0,
        wurf1_feld: 0,
        wurf2_feld: 0,
        wurf3_feld: 0,
        alle_wurfe: req.body.players[1].alle_wurfe,
        average: req.body.players[1].average,
        start: start_score,
        legs: req.body.players[1].legs

    }],
    am_zug: (req.body.players[1].legs+ req.body.players[0].legs )%2+1,
    bereits_geworfen:0,
    max_legs: req.body.legs,
    doppelout: req.body.doppelout
  };
  games.push(neuesSpiel);
  res.status(201).json(neuesSpiel);
  console.log("Neues game")
});

app.post('/api/game/update', (req, res) => {

    console.log(req.body.id)
    const newGame = req.body
    const updatedGames = games.map(game =>
      game.id === newGame.id ? newGame : game
    );
    games = updatedGames

    console.log(games)
    console.log(newGame)
    res.sendStatus(201)
})

app.listen(port, () => {
  console.log(`Darts-Backend läuft auf http://localhost:${port}`);
});
