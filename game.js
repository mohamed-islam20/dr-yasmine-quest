const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

// Setup images
const playerImg = new Image(); playerImg.src = "character.png";
const doorImg = new Image();   doorImg.src = "door.png";
const chestImg = new Image();  chestImg.src = "chest.png";

let level = 0;
let player = { x: 20, y: 250, size: 24, speed: 3 };
const door = { x: 250, y: 20, size: 32 };
const chest = { x: 135, y: 135, size: 32, visible: false };

const walls = [
  { x: 0, y: 100, w: 220, h: 10 },
  { x: 80, y: 200, w: 220, h: 10 },
  { x: 50, y: 0, w: 10, h: 60 }
];

const questions = [
  { q: "* Which organ pumps blood?", a: ["Heart", "Brain"], c: 0 },
  { q: "* Normal body temperature?", a: ["37°C", "40°C"], c: 0 },
  { q: "* Powerhouse of the cell?", a: ["Mitochondria", "Nucleus"], c: 0 },
  { q: "* How many chambers in a human heart?", a: ["2", "4"], c: 1 },
  { q: "* The 'L' in LDL cholesterol stands for?", a: ["Low", "Large"], c: 0 }
];

// Input handling
const keys = {};
const move = (dir, state) => { keys[dir] = state; };

// Mobile button listeners
const btnIds = ["up", "down", "left", "right"];
btnIds.forEach(id => {
  const el = document.getElementById(`btn-${id}`);
  const keyName = "Arrow" + id.charAt(0).toUpperCase() + id.slice(1);
  el.addEventListener("touchstart", (e) => { e.preventDefault(); move(keyName, true); });
  el.addEventListener("touchend", (e) => { e.preventDefault(); move(keyName, false); });
  el.addEventListener("mousedown", () => move(keyName, true));
  el.addEventListener("mouseup", () => move(keyName, false));
});

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function checkCollision() {
  // Hit Door
  if (hit(player, door)) {
    player.x = 20; player.y = 250;
    openQuiz();
  }

  // Hit Chest (Only if 5 levels done)
  if (chest.visible && hit(player, chest)) {
    show("letterScreen");
  }

  // Wall Physics
  walls.forEach(w => {
    if (player.x < w.x + w.w && player.x + player.size > w.x &&
        player.y < w.y + w.h && player.y + player.size > w.y) {
       // Simple reset to prevent sticking
       player.x = 20; player.y = 250;
    }
  });
}

function openQuiz() {
  if (level >= questions.length) {
      chest.visible = true; // Reveal treasure after 5th question
      show("game-container");
      return;
  }
  
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
        if(level === 5) chest.visible = true;
        show("game-container");
      } else {
        alert("* Incorrect! Try again, Doctor.");
      }
    };
    box.appendChild(btn);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#444";
  walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));
  
  // Only draw door if quest isn't finished
  if (level < 5) ctx.drawImage(doorImg, door.x, door.y, door.size, door.size);
  
  // Only draw chest if 5 questions answered
  if (chest.visible) ctx.drawImage(chestImg, chest.x, chest.y, chest.size, chest.size);

  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
  
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  checkCollision();
}

// Reuse your existing startGame and gameLoop...
