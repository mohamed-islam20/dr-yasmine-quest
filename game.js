const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

let level = 0;
let player = { x: 140, y: 250, size: 20, speed: 4 };
let door = { x: 135, y: 20, size: 30 };

const questions = [
  { q: "* Which organ pumps blood?", a: ["Heart", "Lung"], c: 0 },
  { q: "* Normal body temperature?", a: ["37°C", "45°C"], c: 0 },
  { q: "* Which organ helps you breathe?", a: ["Stomach", "Lungs"], c: 1 },
  { q: "* Largest organ in body?", a: ["Liver", "Skin"], c: 1 },
  { q: "* What carries oxygen?", a: ["RBC", "Plasma"], c: 0 }
];

function startGame() {
  show("game-container");
  gameLoop();
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Door
  ctx.fillStyle = "#fff";
  ctx.fillRect(door.x, door.y, door.size, door.size);
  ctx.fillStyle = "#000";
  ctx.fillText("EXIT", door.x + 2, door.y + 18);

  // Draw Player (Heart/Soul)
  ctx.fillStyle = "#ff0000"; // Red Soul
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y + 10, 10, 0, Math.PI * 2);
  ctx.fill();

  checkCollision();
}

function checkCollision() {
  if (player.y < door.y + door.size && player.x > door.x && player.x < door.x + door.size) {
    player.y = 250; // Reset player position
    openQuiz();
  }
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
      if(i === q.c) {
        level++;
        if(level >= questions.length) show("videoScreen");
        else show("game-container");
      } else { alert("But it refused..."); }
    };
    box.appendChild(btn);
  });
}

// Controls
const keys = {};
window.addEventListener("keydown", (e) => keys[e.id] = true);
document.querySelectorAll('.ctrl-btn').forEach(btn => {
  btn.ontouchstart = () => keys[btn.id] = true;
  btn.ontouchend = () => keys[btn.id] = false;
});

function update() {
  if (keys["up"] && player.y > 0) player.y -= player.speed;
  if (keys["down"] && player.y < canvas.height - player.size) player.y += player.speed;
  if (keys["left"] && player.x > 0) player.x -= player.speed;
  if (keys["right"] && player.x < canvas.width - player.size) player.x += player.speed;
}

function gameLoop() {
  if (document.getElementById("game-container").classList.contains("active")) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}
