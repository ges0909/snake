const version = "1.0.1";

// Hilfsfunktion: Spielstand in Local Storage speichern
function saveScoreToLocalStorage(scoreEntry) {
  let scores = JSON.parse(localStorage.getItem("snakeScores") || "[]");
  scores.push(scoreEntry);
  // Nach Punkten absteigend sortieren und auf 10 begrenzen
  scores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  localStorage.setItem("snakeScores", JSON.stringify(scores));
}

// Hilfsfunktion: Spielstände aus Local Storage holen
function getScoreHistoryHtml() {
  let scores = JSON.parse(localStorage.getItem("snakeScores") || "[]");
  if (scores.length === 0) return "<i>Keine gespeicherten Spielstände.</i>";
  // Nach Punkten absteigend sortieren
  scores = scores.sort((a, b) => b.score - a.score);
  return scores
    .map(
      (s) => `<div>🕒 <b>${s.date}</b> &nbsp; Punkte: <b>${s.score}</b></div>`
    )
    .join("");
}

// Zeige die Spielstand-Historie im Overlay
function showScoreHistory() {
  const scoreHistoryDiv = document.getElementById("scoreHistory");
  if (scoreHistoryDiv) {
    scoreHistoryDiv.innerHTML = getScoreHistoryHtml();
  }
}

// Overlay für Spielende anzeigen (global verfügbar machen)
const gameOverOverlay = document.getElementById("gameOverOverlay");

function showGameOverOverlay() {
  if (gameOverOverlay) {
    gameOverOverlay.style.display = "flex";
    // Spielstand automatisch speichern
    const score = tailLength;
    const now = new Date();
    const dateStr = now.toLocaleDateString("de-DE");
    const timeStr = now.toLocaleTimeString("de-DE");
    const entry = { date: `${dateStr} ${timeStr}`, score };
    saveScoreToLocalStorage(entry);
    showScoreHistory();
  }
  paused = true;
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Overlay-Button: Spiel zurücksetzen
const restartBtn = document.getElementById("restartBtn");
if (restartBtn) {
  restartBtn.onclick = function () {
    gameOverOverlay.style.display = "none";
    // Spiel zurücksetzen
    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    food = { x: 15, y: 15 };
    tailLength = 1;
    lastTime = 0;
    paused = false;
    updateScore();
    requestAnimationFrame(gameLoop);
    showScoreHistory();
  };
}

let snake = [{ x: 10, y: 10 }];
let velocityX = 0;
let velocityY = 0;
let food = { x: 15, y: 15 };
let tailLength = 1;
let paused = false;
let speed = parseInt(localStorage.getItem("snakeSpeed") || "6", 10);
let lastTime = 0;

const scoreDiv = document.getElementById("score");

function gameLoop(timestamp) {
  if (!paused) {
    if (!lastTime) lastTime = timestamp;
    const interval = 1000 / speed;
    if (timestamp - lastTime > interval) {
      update();
      draw();
      updateScore();
      lastTime = timestamp;
    }
  }
  requestAnimationFrame(gameLoop);
}

function update() {
  const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };

  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y && tailLength > 1) {
      showGameOverOverlay();
      return;
    }
  }

  snake.unshift(head);
  while (snake.length > tailLength) {
    snake.pop();
  }

  if (head.x === food.x && head.y === food.y) {
    tailLength++;
    updateScore();
    generateNewFood();
  }
}

function generateNewFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

function updateScore() {
  // Punkte = Länge der Schlange
  scoreDiv.textContent = "Punkte: " + tailLength;
}

// Variable zum Ein-/Ausblenden des Logos
let showLogo = localStorage.getItem("snakeShowLogo") !== "false";

// Bergmannslogo aus index.html holen
const bergmannLogoImg = document.getElementById("bergmannLogo");

function draw() {
  ctx.fillStyle = "#e0f7ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bergmannslogo als halbtransparentes Hintergrundbild
  if (showLogo && bergmannLogoImg.complete) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.drawImage(bergmannLogoImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  // Regenbogenfarben für den Schwanz
  const rainbowColors = [
    "#ff69b4", // Pink
    "#ffb6c1", // Hellrosa
    "#ffdab9", // Pfirsich
    "#98fb98", // Mintgrün
    "#87cefa", // Hellblau
    "#dda0dd", // Flieder
    "#ffd700", // Gelb
  ];
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // Schlangenkopf lila zeichnen (oval, mit Auge und Zunge), rotiert in Bewegungsrichtung
      const headX = snake[i].x * gridSize + gridSize / 2;
      const headY = snake[i].y * gridSize + gridSize / 2;
      const headW = gridSize * 1.18; // wieder größer
      const headH = gridSize * 0.92; // wieder größer
      // Richtung bestimmen (Kopf zu nächstem Segment)
      let dx = velocityX,
        dy = velocityY;
      if (snake.length > 1 && dx === 0 && dy === 0) {
        dx = snake[0].x - snake[1].x;
        dy = snake[0].y - snake[1].y;
      }
      // Falls das Spiel steht, Standard nach unten
      if (dx === 0 && dy === 0) {
        dx = 0;
        dy = 1;
      }
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(angle + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, headW / 2, headH / 2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = "#a259e6";
      ctx.fill();
      ctx.strokeStyle = "#7c3bbd";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Auge (immer rechts oben relativ zur Schnauze)
      ctx.beginPath();
      ctx.arc(headW * 0.18, -headH * 0.13, headW * 0.09, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headW * 0.18, -headH * 0.13, headW * 0.045, 0, 2 * Math.PI);
      ctx.fillStyle = "#333";
      ctx.fill();
      // Zunge nur zeichnen, wenn die Schlange sich bewegt
      if (velocityX !== 0 || velocityY !== 0) {
        const tongueLen = headH * 0.65;
        const tongueWidth = headW * 0.13;
        ctx.beginPath();
        ctx.moveTo(0, -headH * 0.5);
        ctx.lineTo(0, -headH * 0.5 - tongueLen);
        ctx.strokeStyle = "#ff69b4";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -headH * 0.5 - tongueLen);
        ctx.lineTo(-tongueWidth / 2, -headH * 0.5 - tongueLen - tongueWidth);
        ctx.moveTo(0, -headH * 0.5 - tongueLen);
        ctx.lineTo(tongueWidth / 2, -headH * 0.5 - tongueLen - tongueWidth);
        ctx.strokeStyle = "#ff69b4";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    } else if (i === snake.length - 1) {
      // Schwanzende: kleines, lila Dreieck (spitz zulaufend)
      const tailX = snake[i].x * gridSize + gridSize / 2;
      const tailY = snake[i].y * gridSize + gridSize / 2;
      // Richtung des Schwanzes bestimmen (letztes und vorletztes Segment)
      let dx = 0,
        dy = 1; // Standard: nach unten
      if (snake.length > 1) {
        dx = tailX - (snake[i - 1].x * gridSize + gridSize / 2);
        dy = tailY - (snake[i - 1].y * gridSize + gridSize / 2);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= len;
        dy /= len;
      }
      const size = gridSize * 1.0; // größer
      ctx.save();
      ctx.translate(tailX, tailY);
      // Dreieck so drehen, dass die Spitze wirklich vom Körper weg zeigt (um 180° drehen)
      ctx.rotate(Math.atan2(dy, dx) + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.38); // Spitze nach hinten
      ctx.lineTo(-size * 0.22, size * 0.22);
      ctx.lineTo(size * 0.22, size * 0.22);
      ctx.closePath();
      ctx.fillStyle = "#a259e6";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#7c3bbd";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.restore();
    } else {
      // Regenbogenfarben für Schwanz, zyklisch
      ctx.fillStyle = rainbowColors[(i - 1) % rainbowColors.length];
      // Ovale Segmente (größer)
      const segX = snake[i].x * gridSize + gridSize / 2;
      const segY = snake[i].y * gridSize + gridSize / 2;
      const segW = gridSize * 1.15; // größer
      const segH = gridSize * 0.95; // größer
      ctx.beginPath();
      ctx.ellipse(segX, segY, segW / 2, segH / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }

  // Maus als Futter zeichnen
  const mouseX = food.x * gridSize + gridSize / 2;
  const mouseY = food.y * gridSize + gridSize / 2;
  const mouseRadius = gridSize * 0.52; // wieder größer
  // Körper
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, mouseRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#bdbdbd"; // Grau
  ctx.fill();
  ctx.strokeStyle = "#bfa100";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // Ohren
  ctx.beginPath();
  ctx.arc(
    mouseX - mouseRadius * 0.7,
    mouseY - mouseRadius * 0.7,
    mouseRadius * 0.35,
    0,
    2 * Math.PI
  );
  ctx.arc(
    mouseX + mouseRadius * 0.7,
    mouseY - mouseRadius * 0.7,
    mouseRadius * 0.35,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#bdbdbd";
  ctx.fill();
  ctx.stroke();
  // Nase
  ctx.beginPath();
  ctx.arc(
    mouseX,
    mouseY + mouseRadius * 0.95,
    mouseRadius * 0.18,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#ff69b4";
  ctx.fill();
  ctx.strokeStyle = "#d63384";
  ctx.stroke();
  // Auge
  ctx.beginPath();
  ctx.arc(
    mouseX + mouseRadius * 0.35,
    mouseY - mouseRadius * 0.15,
    mouseRadius * 0.13,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#333";
  ctx.fill();
  // Schwanz
  ctx.beginPath();
  ctx.moveTo(mouseX, mouseY + mouseRadius);
  ctx.quadraticCurveTo(
    mouseX,
    mouseY + mouseRadius * 1.7,
    mouseX + mouseRadius * 1.2,
    mouseY + mouseRadius * 1.7
  );
  ctx.strokeStyle = "#d63384";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      velocityX = 0;
      velocityY = -1;
      break;
    case "ArrowDown":
      velocityX = 0;
      velocityY = 1;
      break;
    case "ArrowLeft":
      velocityX = -1;
      velocityY = 0;
      break;
    case "ArrowRight":
      velocityX = 1;
      velocityY = 0;
      break;
    case "f":
    case "F":
      showLogo = !showLogo;
      localStorage.setItem("snakeShowLogo", showLogo.toString());
      draw(); // sofortiges Redraw
      break;
  }
});

// Pause-Button
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.onclick = function () {
  paused = !paused;
  this.textContent = paused ? "Weiter" : "Pause";
  if (!paused) requestAnimationFrame(gameLoop);
};

// Pause auch mit Leertaste (Space) auslösen
document.addEventListener("keydown", function (e) {
  // Pause mit Leertaste
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault(); // Verhindert Scrollen
    pauseBtn.click();
    return;
  }
  // Slider mit + und - steuern
  if (e.key === "+") {
    let val = parseInt(speedSlider.value, 10);
    if (val < parseInt(speedSlider.max, 10)) {
      speedSlider.value = val + 1;
      updateSpeed();
    }
  } else if (e.key === "-") {
    let val = parseInt(speedSlider.value, 10);
    if (val > parseInt(speedSlider.min, 10)) {
      speedSlider.value = val - 1;
      updateSpeed();
    }
  }
});

const speedSlider = document.getElementById("speedSlider");
const sliderValue = document.getElementById("sliderValue");

// Gespeicherte Geschwindigkeit laden
speedSlider.value = speed;

speedSlider.addEventListener("keydown", function (e) {
  e.preventDefault(); // Nur Mausbedienung erlauben
});

function updateSpeed() {
  speed = parseInt(speedSlider.value, 10);
  sliderValue.textContent = speed;
  localStorage.setItem("snakeSpeed", speed.toString());
}

speedSlider.oninput = updateSpeed;
updateSpeed();

document.getElementById("version").textContent = `v${version}`;

requestAnimationFrame(gameLoop);

// Arrow-Button-Events für Mausklicks und Tastatur
function setDirection(dir) {
  switch (dir) {
    case "up":
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "down":
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    case "left":
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "right":
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
  }
}

document.getElementById("btn-up").addEventListener("click", function () {
  setDirection("up");
});
document.getElementById("btn-down").addEventListener("click", function () {
  setDirection("down");
});
document.getElementById("btn-left").addEventListener("click", function () {
  setDirection("left");
});
document.getElementById("btn-right").addEventListener("click", function () {
  setDirection("right");
});

// Optional: Tastaturfokus für Buttons (Barrierefreiheit)
const arrowBtns = ["btn-up", "btn-down", "btn-left", "btn-right"];
arrowBtns.forEach((id) => {
  const btn = document.getElementById(id);
  btn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});
