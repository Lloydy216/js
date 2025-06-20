let paused = false;

const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

muteBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    muteBtn.textContent = "🔇 Mute Music";
  } else {
    bgMusic.pause();
    muteBtn.textContent = "🔊 Unmute Music";
  }
});


// Game setup
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 8;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "p" || e.key === "P") {
    paused = !paused;
    if (!paused) draw();
  }
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          document.getElementById("score").textContent = "Score: " + score;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffff00";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00ccff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        const brickColors = ["#ff0040", "#00ccff", "#ffff00", "#ff00ff", "#00ffcc"];
        ctx.fillStyle = brickColors[(r + c) % brickColors.length];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      document.getElementById("lives").textContent = "Lives: " + lives;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  if (paused) return;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
const saveScoreBtn = document.getElementById("saveScoreBtn");
const playerNameInput = document.getElementById("playerName");
const leaderboardList = document.getElementById("leaderboard");

const MAX_LEADERBOARD = 5;

function getLeaderboard() {
  return JSON.parse(localStorage.getItem("breakoutLeaderboard")) || [];
}

function saveToLeaderboard(name, score) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(MAX_LEADERBOARD);
  localStorage.setItem("breakoutLeaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  const scores = getLeaderboard();
  leaderboardList.innerHTML = scores
    .map(entry => `<li>${entry.name} - ${entry.score}</li>`)
    .join("");
  document.getElementById("leaderboard").classList.remove("hidden");
}

saveScoreBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "Anon";
  saveToLeaderboard(name, score);
  saveScoreBtn.disabled = true;
  playerNameInput.disabled = true;
});
