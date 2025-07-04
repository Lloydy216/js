// ===== PARTICLE SYSTEM =====
class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Gravity
    this.life--;
    this.alpha = this.life / this.maxLife;
    this.size *= 0.98; // Shrink over time
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.particleCanvas = document.getElementById('particleCanvas');
    this.particleCtx = this.particleCanvas.getContext('2d');
    this.particleLevel = 'normal';
  }

  setParticleLevel(level) {
    this.particleLevel = level;
  }

  createExplosion(x, y, color, count = 10) {
    const baseCount = this.particleLevel === 'low' ? 5 : this.particleLevel === 'high' ? 20 : 10;
    const particleCount = Math.floor(baseCount * (count / 10));
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = 30 + Math.random() * 30;
      const size = 2 + Math.random() * 3;
      
      this.particles.push(new Particle(x, y, vx, vy, color, life, size));
    }
  }

  createTrail(x, y, color) {
    if (this.particleLevel === 'low') return;
    
    const life = 10 + Math.random() * 10;
    const size = 1 + Math.random() * 2;
    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2;
    
    this.particles.push(new Particle(x, y, vx, vy, color, life, size));
  }

  update() {
    this.particles = this.particles.filter(particle => {
      particle.update();
      return !particle.isDead();
    });
  }

  draw() {
    this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
    
    this.particles.forEach(particle => {
      particle.draw(this.particleCtx);
    });
  }
}

// ===== POWER-UP SYSTEM =====
class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.speed = 1;
    this.active = false;
    this.duration = 0;
    this.maxDuration = 0;
    
    this.setupPowerUp();
  }

  setupPowerUp() {
    switch(this.type) {
      case 'life':
        this.duration = 0; // Permanent
        this.maxDuration = 0;
        break;
      case 'extend':
        this.duration = 10000; // 10 seconds
        this.maxDuration = 10000;
        break;
      case 'shrink':
        this.duration = 8000; // 8 seconds
        this.maxDuration = 8000;
        break;
      case 'multiball':
        this.duration = 15000; // 15 seconds
        this.maxDuration = 15000;
        break;
      case 'speed':
        this.duration = 12000; // 12 seconds
        this.maxDuration = 12000;
        break;
    }
  }

  update() {
    this.y += this.speed;
    
    if (this.active && this.duration > 0) {
      this.duration -= 16; // Assuming 60fps
      if (this.duration <= 0) {
        this.deactivate();
      }
    }
  }

  draw(ctx) {
    if (this.active) return; // Don't draw if active power-up
    
    ctx.save();
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw power-up icon
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.getIcon(), this.x + this.width/2, this.y + this.height/2 + 4);
    ctx.restore();
  }

  getColor() {
    switch(this.type) {
      case 'life': return '#ff0040';
      case 'extend': return '#00ff00';
      case 'shrink': return '#ff8800';
      case 'multiball': return '#ffff00';
      case 'speed': return '#00ffff';
      default: return '#ffffff';
    }
  }

  getIcon() {
    switch(this.type) {
      case 'life': return '❤️';
      case 'extend': return '⬆️';
      case 'shrink': return '⬇️';
      case 'multiball': return '⚽';
      case 'speed': return '⚡';
      default: return '?';
    }
  }

  activate() {
    this.active = true;
    this.applyEffect();
    this.updateDisplay();
  }

  deactivate() {
    this.active = false;
    this.removeEffect();
    this.updateDisplay();
  }

  applyEffect() {
    switch(this.type) {
      case 'life':
        lives++;
        document.getElementById("lives").textContent = "Lives: " + lives;
        break;
      case 'extend':
        paddleWidth = Math.min(paddleWidth * 1.5, 150);
        break;
      case 'shrink':
        paddleWidth = Math.max(paddleWidth * 0.7, 30);
        break;
      case 'multiball':
        createMultiBall();
        break;
      case 'speed':
        dx *= 1.5;
        dy *= 1.5;
        break;
    }
  }

  removeEffect() {
    switch(this.type) {
      case 'extend':
        paddleWidth = 75; // Reset to normal
        break;
      case 'shrink':
        paddleWidth = 75; // Reset to normal
        break;
      case 'speed':
        dx = dx / 1.5;
        dy = dy / 1.5;
        break;
    }
  }

  updateDisplay() {
    const slot = document.getElementById('powerUpSlot1');
    if (this.active) {
      slot.textContent = this.getIcon();
      slot.classList.add('active');
      if (this.duration > 0) {
        slot.classList.add('timer');
        const progress = (this.duration / this.maxDuration) * 100;
        slot.style.setProperty('--timer-width', progress + '%');
      }
    } else {
      slot.textContent = '';
      slot.classList.remove('active', 'timer');
    }
  }

  isColliding(ballX, ballY, ballRadius) {
    return ballX > this.x && ballX < this.x + this.width &&
           ballY > this.y && ballY < this.y + this.height;
  }
}

// ===== GAME VARIABLES =====
let particleSystem;
let powerUps = [];
let balls = [];
let activePowerUps = [];

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
let audioLoaded = false;

// Initialize audio after user interaction
function initializeAudio() {
  if (audioInitialized) return;
  
  const bgMusic = document.getElementById("bgMusic");
  
  // Set audio properties
  bgMusic.volume = gameSettings.musicVolume / 100;
  bgMusic.loop = true;
  
  // Add event listeners for audio loading
  bgMusic.addEventListener('canplaythrough', () => {
    console.log('Audio file loaded successfully');
    audioLoaded = true;
  });
  
  bgMusic.addEventListener('error', (e) => {
    console.error('Audio loading error:', e);
    alert('Failed to load audio file. Please check if boss.ogg exists in the same folder.');
  });
  
  // Try to load the audio file
  bgMusic.load();
  
  // Try to play audio after a short delay to ensure it's loaded
  setTimeout(() => {
    if (audioLoaded) {
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
            // Show a message to the user
            console.log('Audio will be enabled on first user interaction');
          });
      }
    } else {
      console.log('Audio not loaded yet, will try on next interaction');
    }
  }, 100);
}

// Force play audio (called on user interaction)
function forcePlayAudio() {
  if (audioInitialized) return;
  
  const bgMusic = document.getElementById("bgMusic");
  
  if (bgMusic.readyState >= 2) { // HAVE_CURRENT_DATA or higher
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio started successfully on user interaction');
          audioInitialized = true;
          updateMuteButton();
          // Hide the audio status indicator
          const audioStatus = document.getElementById('audioStatus');
          if (audioStatus) {
            audioStatus.classList.add('hidden');
          }
        })
        .catch(error => {
          console.error('Failed to play audio even after user interaction:', error);
        });
    }
  } else {
    console.log('Audio not ready yet, trying to load...');
    bgMusic.load();
    setTimeout(forcePlayAudio, 100);
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
  touchSensitivity: 'normal',
  particleEffects: 'normal'
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
  
  // Apply particle effects
  const particleEffectsSelect = document.getElementById('particleEffects');
  particleEffectsSelect.value = gameSettings.particleEffects;
  
  // Update systems
  updateTouchSensitivity();
  updatePaddleSize();
  if (particleSystem) {
    particleSystem.setParticleLevel(gameSettings.particleEffects);
  }
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

// ===== POWER-UP FUNCTIONS =====
function createPowerUp(x, y) {
  const types = ['life', 'extend', 'shrink', 'multiball', 'speed'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  // 20% chance to create a power-up
  if (Math.random() < 0.2) {
    powerUps.push(new PowerUp(randomType, x, y));
  }
}

function createMultiBall() {
  const currentBall = { x: x, y: y, dx: dx, dy: dy };
  
  // Create 2 additional balls
  for (let i = 0; i < 2; i++) {
    const angle = (Math.PI * 2 * i) / 3;
    const speed = Math.sqrt(dx * dx + dy * dy);
    const newDx = Math.cos(angle) * speed;
    const newDy = Math.sin(angle) * speed;
    
    balls.push({
      x: currentBall.x,
      y: currentBall.y,
      dx: newDx,
      dy: newDy,
      radius: ballRadius
    });
  }
}

// ======= Update initGame to load current level =======
function initGame() {
  // Initialize systems
  particleSystem = new ParticleSystem();
  particleSystem.setParticleLevel(gameSettings.particleEffects);
  
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
  
  // Reset power-ups and balls
  powerUps = [];
  balls = [];
  activePowerUps = [];
  
  // Update UI
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("lives").textContent = "Lives: " + lives;
  // Remove level UI update
  document.querySelectorAll('.power-up-slot').forEach(slot => {
    slot.textContent = '';
    slot.classList.remove('active', 'timer');
  });
  
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
  forcePlayAudio(); // Use forcePlayAudio instead
  showScreen('gameScreen');
  initGame();
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  forcePlayAudio(); // Use forcePlayAudio instead
  showScreen('settingsScreen');
});

document.getElementById('leaderboardBtn').addEventListener('click', async () => {
  forcePlayAudio(); // Use forcePlayAudio instead
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
document.getElementById('clearLeaderboardBtn').addEventListener('click', clearLeaderboard);
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  // Update settings from form
  gameSettings.musicVolume = parseInt(document.getElementById('musicVolume').value);
  gameSettings.ballSpeed = document.getElementById('ballSpeed').value;
  gameSettings.paddleSize = document.getElementById('paddleSize').value;
  gameSettings.touchSensitivity = document.getElementById('touchSensitivity').value;
  gameSettings.particleEffects = document.getElementById('particleEffects').value;
  
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
  forcePlayAudio(); // Use forcePlayAudio instead
  
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

// Initialize brick array
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Game state
let score = 0;
let lives = 3;

// Initialize brick array


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
  let bricksLeft = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        bricksLeft++;
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy; // Reverse ball direction
          b.status = 0; // Destroy brick
          score++;
          document.getElementById("score").textContent = "Score: " + score;
          
          // Create particle explosion
          if (particleSystem) {
            const brickColors = ["#ff0040", "#00ccff", "#ffff00", "#ff00ff", "#00ffcc"];
            const color = brickColors[(r + c) % brickColors.length];
            particleSystem.createExplosion(b.x + brickWidth/2, b.y + brickHeight/2, color, 15);
          }
          
          // Create power-up
          createPowerUp(b.x + brickWidth/2, b.y + brickHeight/2);
        }
      }
    }
  }
  // If no bricks left, go to next level or win
  if (bricksLeft === 0) {
    setTimeout(() => {
      alert('YOU WIN, CONGRATS!');
      document.location.reload();
    }, 500);
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
  
  // Create ball trail
  if (particleSystem) {
    particleSystem.createTrail(x, y, "#ffff00");
  }
}

// Draw all balls
function drawBalls() {
  // Draw main ball
  drawBall();
  
  // Draw additional balls
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffff00";
    ctx.fill();
    ctx.closePath();
    
    // Create trail for each ball
    if (particleSystem) {
      particleSystem.createTrail(ball.x, ball.y, "#ffff00");
    }
  });
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

// Draw power-ups
function drawPowerUps() {
  powerUps.forEach(powerUp => {
    powerUp.draw(ctx);
  });
}

// Update power-ups
function updatePowerUps() {
  powerUps = powerUps.filter(powerUp => {
    powerUp.update();
    
    // Check collision with main ball
    if (powerUp.isColliding(x, y, ballRadius)) {
      powerUp.activate();
      return false; // Remove from array
    }
    
    // Check collision with additional balls
    balls.forEach(ball => {
      if (powerUp.isColliding(ball.x, ball.y, ball.radius)) {
        powerUp.activate();
        return false;
      }
    });
    
    // Remove if fallen off screen
    return powerUp.y < canvas.height + 50;
  });
}

// Update all balls
function updateBalls() {
  // Update main ball
  x += dx;
  y += dy;
  
  // Update additional balls
  balls.forEach(ball => {
    ball.x += ball.dx;
    ball.y += ball.dy;
  });
  
  // Remove balls that fall off screen
  balls = balls.filter(ball => ball.y < canvas.height + ballRadius);
}

// Main game loop - draw everything and update game state
function draw() {
  if (!gameRunning || gameState !== 'playing') return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBalls();
  drawPaddle();
  drawPowerUps();
  collisionDetection();
  updatePowerUps();
  updateBalls();

  // Ball wall collision detection
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    // Ball hits bottom - check paddle collision
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy; // Ball hits paddle
      
      // Create paddle hit particles
      if (particleSystem) {
        particleSystem.createExplosion(x, canvas.height - paddleHeight, "#00ccff", 8);
      }
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
        balls = []; // Remove additional balls
      }
    }
  }

  // Update paddle position based on input
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  // Update particle system
  if (particleSystem) {
    particleSystem.update();
    particleSystem.draw();
  }

  // Update ball position
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
    
    // Ensure leaderboard is visible
    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.classList.remove("hidden");
    leaderboardContainer.style.display = "block";
    
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

// Clear leaderboard function
async function clearLeaderboard() {
  if (!confirm('Are you sure you want to clear all scores from the leaderboard? This action cannot be undone.')) {
    return;
  }
  
  try {
    // First, let's see what's in the leaderboard
    const { data: currentScores, error: fetchError } = await window.supabaseClient
      .from('leaderboard')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching current scores:', fetchError);
      alert('Failed to fetch current scores. Please try again.');
      return;
    }
    
    console.log('Current scores:', currentScores);
    
    // Delete all records
    const { error } = await window.supabaseClient
      .from('leaderboard')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (error) {
      console.error('Error clearing leaderboard:', error);
      alert('Failed to clear leaderboard. Please try again.');
      return;
    }
    
    console.log('Leaderboard cleared successfully');
    alert('Leaderboard cleared successfully!');
    
    // Refresh the leaderboard display
    await showLeaderboard();
    
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    alert('Failed to clear leaderboard. Please try again.');
  }
}

// ===== INITIALIZATION =====
// Load settings and show start screen when page loads
document.addEventListener('DOMContentLoaded', () => {
  detectMobile();
  setupTouchControls();
  loadSettings();
  showScreen('startScreen');
  
  // Initialize audio on any user interaction
  document.addEventListener('click', forcePlayAudio, { once: true });
  document.addEventListener('touchstart', forcePlayAudio, { once: true });
  document.addEventListener('keydown', forcePlayAudio, { once: true });
});
