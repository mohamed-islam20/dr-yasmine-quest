const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

// Images
const playerImg = new Image();
playerImg.src = "character.png";

const doorImg = new Image();
doorImg.src = "door.png";

const chestImg = new Image();
chestImg.src = "chest.png";

// Player
let player = {
  x: 20,
  y: 250,
  size: 24,
  speed: 2
};

// Door
const door = {
  x: 250,
  y: 10,
  size: 32
};

// Maze walls
const walls = [
  { x: 0, y: 100, w: 200, h: 10 },
  { x: 100, y: 180, w: 200, h: 10 },
  { x: 50, y: 40, w: 10, h: 140 }
];

// Treasure (final)
const chest = {
  x: 140,
  y: 140,
  size: 28
};

const questions = [
  { q: "* Which organ pumps blood?", a: ["Heart", "Lung"], c: 0 },
  { q: "* Normal body temperature?", a: ["37°C", "45°C"], c: 0 },
  { q: "* Which organ helps you breathe?", a: ["Stomach", "Lungs"], c: 1 }
];

let level = 0;

function startGame() {
  show("game-container");
  gameLoop();
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Walls
  ctx.fillStyle = "#444";
  walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

  // Door
  ctx.drawImage(doorImg, door.x, door.y, door.size, door.size);

  // Chest
  ctx.drawImage(chestImg, chest.x, chest.y, chest.size, chest.size);

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  checkCollision();
}

function hit(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

function checkCollision() {
  // Door → quiz
  if (hit(player, door)) {
    player.x = 20;
    player.y = 250;
    openQuiz();
  }

  // Chest → letter
  if (hit(player, chest)) {
    show("letterScreen");
  }

  // Walls
  walls.forEach(w => {
    if (
      player.x < w.x + w.w &&
      player.x + player.size > w.x &&
      player.y < w.y + w.h &&
      player.y + player.size > w.y
    ) {
      player.x -= player.speed;
      player.y -= player.speed;
    }
  });
}

function openQuiz() {
  show("quiz");
  const q = questions[level];
  document.getElementById("question").innerText = q.q;
  const box = document.getElementById("answers");
  box.innerHTML = "";

  q.a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerText = `* ${ans}`;
    btn.onclick = () => {
      if (i === q.c) {
        level++;
        show("game-container");
      } else {
        alert("* But it refused...");
      }
    };
    box.appendChild(btn);
  });
}

// Controls
const keys = {};
window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));

function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
}

function gameLoop() {
  if (document.getElementById("game-container").classList.contains("active")) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

