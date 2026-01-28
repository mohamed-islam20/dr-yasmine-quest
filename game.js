let level = 0;

const questions = [
  {
    q: "Which organ pumps blood?",
    a: ["Heart", "Lung", "Brain"],
    c: 0
  },
  {
    q: "Normal body temperature?",
    a: ["25°C", "37°C", "45°C"],
    c: 1
  },
  {
    q: "Which organ helps you breathe?",
    a: ["Stomach", "Lungs", "Kidney"],
    c: 1
  },
  {
    q: "Largest organ in body?",
    a: ["Liver", "Skin", "Brain"],
    c: 1
  },
  {
    q: "What carries oxygen?",
    a: ["Plasma", "RBC", "Platelets"],
    c: 1
  }
];

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startGame() {
  show("game");
  updateLevel();
}

function updateLevel() {
  document.getElementById("levelText").innerText =
    "Door " + (level + 1) + " / 5";
}

function openDoor() {
  show("quiz");

  const q = questions[level];

  document.getElementById("question").innerText = q.q;

  const box = document.getElementById("answers");
  box.innerHTML = "";

  q.a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = () => check(i);
    box.appendChild(btn);
  });
}

function check(i) {
  if (i === questions[level].c) {
    level++;

    if (level >= questions.length) {
      show("chest");
    } else {
      show("game");
      updateLevel();
    }

  } else {
    alert("Try again 😅");
  }
}

function openChest() {
  show("videoScreen");
  document.getElementById("finalVideo").play();
}