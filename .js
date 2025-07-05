// ===== MOBILE DETECTION & SETUP =====
let isMobile = false;
let touchSensitivity = 1.0; // Default sensitivity multiplier

// Detect mobile device
function detectMobile() {
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             window.innerWidth <= 600;
  
  if (isMobile) {
    document.body.classList.add('is-mobile');
    document.body.classList.remove('is-desktop');
    showMobileControls();
  } else {
    document.body.classList.add('is-desktop');
    document.body.classList.remove('is-mobile');
    hideMobileControls();
  }
  
  updateControlInstructions();
}

// Show/hide mobile controls
function showMobileControls() {
  document.querySelector('.mobile-controls').classList.remove('hidden');
  document.querySelector('.desktop-controls').classList.add('hidden');
  document.getElementById('mobileControls').classList.remove('hidden');
}

function hideMobileControls() {
  document.querySelector('.mobile-controls').classList.add('hidden');
  document.querySelector('.desktop-controls').classList.remove('hidden');
  document.getElementById('mobileControls').classList.add('hidden');
}

// Update control instructions based on device
function updateControlInstructions() {
  const mobileControls = document.querySelector('.mobile-controls');
  const desktopControls = document.querySelector('.desktop-controls');
  
  if (isMobile) {
    mobileControls.classList.remove('hidden');
    desktopControls.classList.add('hidden');
  } else {
    mobileControls.classList.add('hidden');
    desktopControls.classList.remove('hidden');
  }
}

// ===== TOUCH CONTROLS =====
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

// Touch event handlers
function handleTouchStart(e) {
  if (gameState !== 'playing') return;
  
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isTouching = true;
}

function handleTouchMove(e) {
  if (gameState !== 'playing' || !isTouching) return;
  
  e.preventDefault();
  const touch = e.touches[0];
  const deltaX = (touch.clientX - touchStartX) * touchSensitivity;
  
  // Move paddle based on touch movement
  const canvasRect = canvas.getBoundingClientRect();
  const relativeX = touch.clientX - canvasRect.left;
  
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  
  // Keep paddle within bounds
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
}

function handleTouchEnd(e) {
  if (gameState !== 'playing') return;
  
  e.preventDefault();
  isTouching = false;
}

// Add touch event listeners
function setupTouchControls() {
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Prevent default touch behaviors
  canvas.addEventListener('touchcancel', (e) => e.preventDefault(), { passive: false });
}

// ===== AUDIO HANDLING =====
let audioInitialized = false;

// Initialize audio after user interaction
function initializeAudio() {
  if (audioInitialized) return;
  
  const bgMusic = document.getElementById("bgMusic");
  
  // Set audio properties
  bgMusic.volume = gameSettings.musicVolume / 100;
  bgMusic.loop = true;
  
  // Try to play audio
  const playPromise = bgMusic.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Audio started successfully');
        audioInitialized = true;
        updateMuteButton();
      })
      .catch(error => {
        console.log('Audio autoplay blocked:', error);
        // Audio will be enabled on first user interaction
      });
  }
}

// Update mute button text
function updateMuteButton() {
  const muteBtn = document.getElementById("muteBtn");
  const bgMusic = document.getElementById("bgMusic");
  
  if (bgMusic.paused) {
    muteBtn.textContent = "🔊 Unmute Music";
  } else {
    muteBtn.textContent = "🔇 Mute Music";
  }
}

// ===== GAME STATE MANAGEMENT =====
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let gameRunning = false;

// ===== GAME SETTINGS =====
let gameSettings = {
  musicVolume: 50,
  ballSpeed: 'normal',
  paddleSize: 'normal',
  touchSensitivity: 'normal'
};

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('breakoutSettings');
  if (saved) {
    gameSettings = { ...gameSettings, ...JSON.parse(saved) };
  }
  applySettings();
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('breakoutSettings', JSON.stringify(gameSettings));
}

// Apply settings to game
function applySettings() {
  // Apply music volume
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = gameSettings.musicVolume / 100;
  document.getElementById('musicVolume').value = gameSettings.musicVolume;
  document.getElementById('volumeValue').textContent = gameSettings.musicVolume + '%';
  
  // Apply ball speed
  const ballSpeedSelect = document.getElementById('ballSpeed');
  ballSpeedSelect.value = gameSettings.ballSpeed;
  
  // Apply paddle size
  const paddleSizeSelect = document.getElementById('paddleSize');
  paddleSizeSelect.value = gameSettings.paddleSize;
  
  // Apply touch sensitivity
  const touchSensitivitySelect = document.getElementById('touchSensitivity');
  touchSensitivitySelect.value = gameSettings.touchSensitivity;
  
  // Update touch sensitivity
  updateTouchSensitivity();
  
  // Update paddle width based on setting
  updatePaddleSize();
}

// Update touch sensitivity based on settings
function updateTouchSensitivity() {
  switch(gameSettings.touchSensitivity) {
    case 'low':
      touchSensitivity = 0.5;
      break;
    case 'normal':
      touchSensitivity = 1.0;
      break;
    case 'high':
      touchSensitivity = 1.5;
      break;
  }
}

// Update paddle size based on settings
function updatePaddleSize() {
  switch(gameSettings.paddleSize) {
    case 'small':
      paddleWidth = 50;
      break;
    case 'normal':
      paddleWidth = 75;
      break;
    case 'large':
      paddleWidth = 100;
      break;
  }
  // Keep paddle within bounds
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Show requested screen
  document.getElementById(screenId).classList.remove('hidden');
  
  // Update game state
  switch(screenId) {
    case 'startScreen':
      gameState = 'start';
      gameRunning = false;
      break;
    case 'gameScreen':
      gameState = 'playing';
      gameRunning = true;
      break;
    case 'pauseMenu':
      gameState = 'paused';
      gameRunning = false;
      break;
    case 'gameOverScreen':
      gameState = 'gameOver';
      gameRunning = false;
      break;
    case 'settingsScreen':
      gameState = 'settings';
      gameRunning = false;
      break;
  }
}

// ===== GAME INITIALIZATION =====
function initGame() {
  // Initialize audio on first game start
  initializeAudio();
  
  // Reset game variables
  score = 0;
  lives = 3;
  x = canvas.width / 2;
  y = canvas.height - 30;
  
  // Set ball speed based on settings
  const baseSpeed = 2;
  switch(gameSettings.ballSpeed) {
    case 'slow':
      dx = baseSpeed * 0.7;
      dy = -baseSpeed * 0.7;
      break;
    case 'normal':
      dx = baseSpeed;
      dy = -baseSpeed;
      break;
    case 'fast':
      dx = baseSpeed * 1.5;
      dy = -baseSpeed * 1.5;
      break;
  }
  
  // Reset paddle
  paddleX = (canvas.width - paddleWidth) / 2;
  
  // Reset bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
  
  // Update UI
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("lives").textContent = "Lives: " + lives;
  
  // Start game loop
  gameRunning = true;
  draw();
}

// ===== GAME PAUSE/RESUME =====
function pauseGame() {
  if (gameState === 'playing') {
    showScreen('pauseMenu');
  }
}

function resumeGame() {
  if (gameState === 'paused') {
    showScreen('gameScreen');
    gameRunning = true;
    draw();
  }
}

// ===== GAME OVER HANDLING =====
function gameOver(isWin = false) {
  gameRunning = false;
  
  const gameOverTitle = document.getElementById('gameOverTitle');
  const finalScoreElement = document.getElementById('finalScore');
  
  if (isWin) {
    gameOverTitle.textContent = '🎉 YOU WIN! 🎉';
    gameOverTitle.style.color = '#00ff00';
  } else {
    gameOverTitle.textContent = '🎯 Game Over!';
    gameOverTitle.style.color = '#ff0040';
  }
  
  finalScoreElement.textContent = `Final Score: ${score}`;
  showScreen('gameOverScreen');
}

// ===== EVENT LISTENERS =====

// Start screen buttons
document.getElementById('startGameBtn').addEventListener('click', () => {
  initializeAudio(); // Initialize audio on first click
  showScreen('gameScreen');
  initGame();
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  initializeAudio(); // Initialize audio on first click
  showScreen('settingsScreen');
});

document.getElementById('leaderboardBtn').addEventListener('click', async () => {
  initializeAudio(); // Initialize audio on first click
  showScreen('gameScreen');
  await showLeaderboard();
});

// Pause menu buttons
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('restartBtn').addEventListener('click', () => {
  showScreen('gameScreen');
  initGame();
});
document.getElementById('mainMenuBtn').addEventListener('click', () => {
  showScreen('startScreen');
});

// Game over screen buttons
document.getElementById('playAgainBtn').addEventListener('click', () => {
  showScreen('gameScreen');
  initGame();
});
document.getElementById('saveScoreMenuBtn').addEventListener('click', async () => {
  const name = prompt('Enter your name:') || 'Anonymous';
  await saveToLeaderboard(name, score);
});
document.getElementById('mainMenuFromGameOverBtn').addEventListener('click', () => {
  showScreen('startScreen');
});

// Settings screen buttons
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  // Update settings from form
  gameSettings.musicVolume = parseInt(document.getElementById('musicVolume').value);
  gameSettings.ballSpeed = document.getElementById('ballSpeed').value;
  gameSettings.paddleSize = document.getElementById('paddleSize').value;
  gameSettings.touchSensitivity = document.getElementById('touchSensitivity').value;
  
  saveSettings();
  applySettings();
  alert('Settings saved!');
});
document.getElementById('backToMenuBtn').addEventListener('click', () => {
  showScreen('startScreen');
});

// Settings form controls
document.getElementById('musicVolume').addEventListener('input', (e) => {
  const volume = e.target.value;
  document.getElementById('volumeValue').textContent = volume + '%';
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = volume / 100;
});

// Pause button in game
document.getElementById('pauseBtn').addEventListener('click', pauseGame);

// ===== ORIGINAL GAME CODE =====

// Game pause state
let paused = false;

// Audio elements
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

// Toggle music mute/unmute functionality
muteBtn.addEventListener("click", () => {
  initializeAudio(); // Initialize audio on first click
  
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      updateMuteButton();
    }).catch(error => {
      console.log('Failed to play audio:', error);
    });
  } else {
    bgMusic.pause();
    updateMuteButton();
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
let paddleWidth = 75;
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
    if (gameState === 'playing') {
      pauseGame();
    } else if (gameState === 'paused') {
      resumeGame();
    }
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
  if (gameState !== 'playing') return;
  
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
            gameOver(true);
            return;
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
  if (!gameRunning || gameState !== 'playing') return;
  
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
        gameOver(false);
        return;
      } else {
        // Reset ball position for next life
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Update paddle position based on input
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  // Update ball position
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

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

// ===== INITIALIZATION =====
// Load settings and show start screen when page loads
document.addEventListener('DOMContentLoaded', () => {
  detectMobile();
  setupTouchControls();
  loadSettings();
  showScreen('startScreen');
  
  // Initialize audio on any user interaction
  document.addEventListener('click', initializeAudio, { once: true });
  document.addEventListener('touchstart', initializeAudio, { once: true });
  document.addEventListener('keydown', initializeAudio, { once: true });
});
