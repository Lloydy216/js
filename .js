// Game pause state
let paused = false;

// Audio elements
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

// Toggle music mute/unmute functionality
muteBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    muteBtn.textContent = "🔇 Mute Music";
  } else {
    bgMusic.pause();
    muteBtn.textContent = "🔊 Unmute Music";
  }
});

// ===== GAME SETUP =====
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Ball properties
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;  // Ball horizontal speed
let dy = -2; // Ball vertical speed

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Paddle movement flags
let rightPressed = false;
let leftPressed = false;

// Brick grid configuration
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 8;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Game state
let score = 0;
let lives = 3;

// Initialize brick array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // status: 1 = visible, 0 = destroyed
  }
}

// ===== EVENT LISTENERS =====
// Pause game with 'P' key
document.addEventListener("keydown", function (e) {
  if (e.key === "p" || e.key === "P") {
    paused = !paused;
    if (!paused) draw();
  }
});

// Paddle movement controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Handle key press for paddle movement
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

// Handle key release for paddle movement
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Handle mouse movement for paddle control
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// ===== GAME LOGIC =====
// Check for ball collision with bricks
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy; // Reverse ball direction
          b.status = 0; // Destroy brick
          score++;
          document.getElementById("score").textContent = "Score: " + score;
          
          // Check for win condition
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// ===== DRAWING FUNCTIONS =====
// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffff00"; // Yellow ball
  ctx.fill();
  ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00ccff"; // Cyan paddle
  ctx.fill();
  ctx.closePath();
}

// Draw all visible bricks
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
        
        // Colorful brick pattern
        const brickColors = ["#ff0040", "#00ccff", "#ffff00", "#ff00ff", "#00ffcc"];
        ctx.fillStyle = brickColors[(r + c) % brickColors.length];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Main game loop - draw everything and update game state
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Ball wall collision detection
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    // Ball hits bottom - check paddle collision
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy; // Ball hits paddle
    } else {
      // Ball misses paddle - lose life
      lives--;
      document.getElementById("lives").textContent = "Lives: " + lives;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        // Reset ball position for next life
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Update paddle position based on input
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  // Pause game if needed
  if (paused) return;

  // Update ball position
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// Start the game
draw();

// ===== LEADERBOARD SYSTEM WITH SUPABASE =====
const saveScoreBtn = document.getElementById("saveScoreBtn");
const playerNameInput = document.getElementById("playerName");
const leaderboardList = document.getElementById("leaderboard");

const MAX_LEADERBOARD = 10; // Maximum number of scores to keep

// Get leaderboard from Supabase
async function getLeaderboard() {
  try {
    const { data, error } = await window.supabaseClient
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(MAX_LEADERBOARD);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Save score to Supabase leaderboard
async function saveToLeaderboard(name, score) {
  try {
    const { data, error } = await window.supabaseClient
      .from('leaderboard')
      .insert([
        { 
          username: name,  // Use username column instead of player_name
          player_name: name, // Also set player_name for compatibility
          score: score,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error saving score:', error);
      alert('Failed to save score. Please try again.');
      return;
    }
    
    console.log('Score saved successfully:', data);
    await showLeaderboard();
    saveScoreBtn.disabled = true;
    playerNameInput.disabled = true;
    
  } catch (error) {
    console.error('Error saving score:', error);
    alert('Failed to save score. Please try again.');
  }
}

// Display leaderboard on screen
async function showLeaderboard() {
  try {
    const scores = await getLeaderboard();
    leaderboardList.innerHTML = scores
      .map((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆';
        // Use username if available, otherwise fall back to player_name
        const playerName = entry.username || entry.player_name || 'Anonymous';
        return `<li>${medal} ${playerName} - ${entry.score}</li>`;
      })
      .join("");
    document.getElementById("leaderboard").classList.remove("hidden");
  } catch (error) {
    console.error('Error displaying leaderboard:', error);
  }
}

// Load leaderboard on page load
document.addEventListener('DOMContentLoaded', async () => {
  await showLeaderboard();
});

// Handle save score button click
saveScoreBtn.addEventListener("click", async () => {
  const name = playerNameInput.value.trim() || "Anon";
  if (name.length === 0) {
    alert('Please enter a name!');
    return;
  }
  
  saveScoreBtn.textContent = "💾 Saving...";
  saveScoreBtn.disabled = true;
  
  await saveToLeaderboard(name, score);
  
  saveScoreBtn.textContent = "✅ Score Saved!";
});
