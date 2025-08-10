<template>
  <div class="game-container">
    <div class="piece-area">
      <div v-if="gameStarted && currentPuzzle" class="puzzle-instructions">
        <h2>{{ getPuzzleTitle() }}</h2>
        <p>{{ getPuzzleDescription() }}</p>
      </div>
      <div v-if="!gameStarted" class="start-message">
        <div class="start-controls">
          <button @click="openLeaderboard" class="icon-button leaderboard-button" title="Leaderboard">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button v-if="!hasActiveGame" @click="startGame" class="start-button">
            Start Game
          </button>
          <div v-else class="game-options">
            <button @click="continueGame" class="start-button">
              {{ isMobile && hasActiveGame ? 'Start' : 'Start Game' }}
            </button>
            <button @click="newGame" class="start-button">
              New
            </button>
          </div>
          <button @click="openSettings" class="icon-button settings-button" title="Settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="game-controls">
        <button @click="goHome" class="control-button home-button" title="Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="board-area">
      <div v-if="gameStarted" class="board-container">
        <ChessBoard 
          :validSquares="validSquares"
          :kingPosition="kingPosition"
          :piecePosition="currentPuzzle?.piecePosition || ''"
          :boardDimensions="currentPuzzle?.boardDimensions || { cols: 3, rows: 3 }"
          :enemyPieces="currentPuzzle?.enemyPieces || []"
          :playerPiece="currentPiece"
          :selectedPiece="pieceSelected"
          :hintSquare="showHint ? currentPuzzle?.solution : null"
          @square-drop="handleSquareDrop"
          @piece-drag-start="handlePieceDragStart"
          @piece-drag-end="handlePieceDragEnd"
          @piece-select="handlePieceSelect"
          @square-click="handleSquareClick"
          :isDragging="isDragging"
        />
        <div class="board-controls">
          <button @click="useHint" class="board-control-button hint-button" title="Hint" :disabled="hintUsed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L10 13L12 12L14 14L15 12L17 13L18 11M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Hint</span>
          </button>
          <button @click="skipPuzzle" class="board-control-button skip-button" title="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Next</span>
          </button>
        </div>
      </div>
      <div v-else class="start-board">
        <div class="start-screen-content">
          <div class="decorative-board">
            <div v-for="row in 4" :key="row" class="board-row">
              <div 
                v-for="col in 4" 
                :key="`${row}-${col}`"
                :class="['decorative-square', (row + col) % 2 === 0 ? 'light' : 'dark']"
              ></div>
            </div>
          </div>
          <div class="dancing-pieces-overlay">
            <img 
              v-for="(piece, index) in startScreenPieces" 
              :key="index"
              :src="piece.src"
              :class="['dancing-piece', piece.animation]"
              :style="{ animationDelay: piece.delay }"
              alt="Chess piece"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="score-area">
      <div class="score">Score: {{ score }}</div>
      <div class="streak">Streak: {{ streak }}</div>
      <div class="level">Level: {{ currentLevel }}</div>
      <div v-if="currentPiece" class="piece-info">{{ getPieceName(currentPiece) }}</div>
    </div>
    
    <transition name="feedback">
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-message">Great Job!</div>
      </div>
    </transition>
    
    <!-- Error feedback handled by piece animation -->
    
    <!-- Settings Modal -->
    <transition name="modal">
      <div v-if="showSettings" class="modal-overlay" @click.self="showSettings = false">
        <div class="modal-content">
          <h2>Settings</h2>
          
          <div class="setting-group">
            <label>Puzzle Type</label>
            <select v-model="tempPuzzleType" class="puzzle-select">
              <option value="auto">Auto (based on level)</option>
              <option value="capture">Capture Pieces</option>
              <option value="check">Check the King</option>
              <option value="mate1">Checkmate in 1</option>
              <option value="mate2">Checkmate in 2</option>
              <option value="mate3">Checkmate in 3</option>
            </select>
          </div>
          
          <div class="setting-group">
            <label>Level ({{ tempLevel }})</label>
            <input type="range" v-model.number="tempLevel" min="1" max="10" class="level-slider">
            <div class="level-labels">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          
          <div class="setting-group">
            <label>Puzzles per Level ({{ puzzlesPerLevel }})</label>
            <input type="range" v-model.number="puzzlesPerLevel" min="1" max="10" class="level-slider">
            <div class="level-labels">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          
          <div class="modal-buttons">
            <button @click="applySettings" class="modal-button apply">Apply</button>
            <button @click="showSettings = false" class="modal-button cancel">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Leaderboard Modal -->
    <transition name="modal">
      <div v-if="showLeaderboard" class="modal-overlay" @click.self="showLeaderboard = false">
        <div class="modal-content leaderboard-modal">
          <h2>🏆 Leaderboard</h2>
          
          <div class="leaderboard-stats">
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-label">Highest Score</div>
              <div class="stat-value">{{ highScore }}</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-label">Longest Streak</div>
              <div class="stat-value">{{ longestStreak }}</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-label">Current Score</div>
              <div class="stat-value">{{ score }}</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-label">Current Streak</div>
              <div class="stat-value">{{ streak }}</div>
            </div>
          </div>
          
          <div class="modal-buttons">
            <button @click="showLeaderboard = false" class="modal-button apply">Close</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Chess } from 'chess.js'
import confetti from 'canvas-confetti'
import ChessBoard from './components/ChessBoard.vue'
import { usePuzzles } from './composables/usePuzzles'
import { useScore } from './composables/useScore'
import { useSounds } from './composables/useSounds'

const { getPuzzle, generatePuzzle } = usePuzzles()
const { score, streak, incrementScore, resetStreak, loadScore, saveScore } = useScore()
const { playSuccess, playError, playPickup, playDrop, initAudio } = useSounds()

const gameStarted = ref(false)
const currentPiece = ref(null)
const validSquares = ref([])
const kingPosition = ref('')
const isDragging = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const currentLevel = ref(1)
const currentPuzzle = ref(null)
const pieceSelected = ref(false)
const hasActiveGame = ref(false)
const showNewButton = ref(false)
const isMobile = ref(false)
const puzzleType = ref('capture') // 'capture', 'check', 'mate1', 'mate2', 'mate3'
const showSettings = ref(false)
const tempLevel = ref(1)
const tempPuzzleType = ref('capture')
const puzzlesPerLevel = ref(3)
const showLeaderboard = ref(false)
const highScore = ref(0)
const longestStreak = ref(0)
const hintUsed = ref(false)
const showHint = ref(false)

// Start screen animated pieces
const startScreenPieces = ref([
  { src: `${import.meta.env.BASE_URL}assets/Piece=King, Side=White.png`, animation: 'bounce', delay: '0s' },
  { src: `${import.meta.env.BASE_URL}assets/Piece=Queen, Side=Black.png`, animation: 'spin', delay: '0.2s' },
  { src: `${import.meta.env.BASE_URL}assets/Piece=Rook, Side=White.png`, animation: 'slide', delay: '0.4s' },
  { src: `${import.meta.env.BASE_URL}assets/Piece=Bishop, Side=Black.png`, animation: 'bounce', delay: '0.6s' },
  { src: `${import.meta.env.BASE_URL}assets/Piece=Knight, Side=White.png`, animation: 'spin', delay: '0.8s' },
  { src: `${import.meta.env.BASE_URL}assets/Piece=Pawn, Side=Black.png`, animation: 'slide', delay: '1s' }
])

const getPieceName = (piece) => {
  if (!piece) return ''
  const names = {
    'q': 'Queen',
    'r': 'Rook', 
    'b': 'Bishop',
    'n': 'Knight',
    'p': 'Pawn'
  }
  return names[piece.type] || ''
}

const getPuzzleTitle = () => {
  if (!currentPuzzle.value) return ''
  const type = currentPuzzle.value.puzzleType
  if (type === 'capture') return 'Capture the enemy pieces!'
  if (type === 'check') return 'Check the King!'
  if (type === 'checkmate' || type === 'mate1') return 'Checkmate in 1!'
  if (type === 'mate2') return 'Checkmate in 2!'
  if (type === 'mate3') return 'Checkmate in 3!'
  return 'Make your move!'
}

const getPuzzleDescription = () => {
  if (!currentPuzzle.value || !currentPiece.value) return ''
  const type = currentPuzzle.value.puzzleType
  const pieceName = getPieceName(currentPiece.value)
  
  if (type === 'capture') {
    return `Drag your ${pieceName} to capture the highlighted enemies`
  }
  if (type === 'check') {
    return `Use your ${pieceName} to check the king`
  }
  if (type === 'checkmate' || type === 'mate1') {
    return `Use your ${pieceName} to deliver checkmate`
  }
  if (type === 'mate2') {
    return `Find the first move in a 2-move checkmate sequence`
  }
  if (type === 'mate3') {
    return `Find the first move in a 3-move checkmate sequence`
  }
  return `Move your ${pieceName}`
}

const getPieceImage = (piece) => {
  if (!piece) return ''
  const color = piece.color === 'w' ? 'White' : 'Black'
  const typeMap = {
    'q': 'Queen',
    'r': 'Rook',
    'b': 'Bishop',
    'n': 'Knight',
    'p': 'Pawn'
  }
  const pieceName = typeMap[piece.type]
  // Use Vite's base URL
  const base = import.meta.env.BASE_URL
  return `${base}assets/Piece=${pieceName}, Side=${color}.png`
}

const startGame = async () => {
  // Initialize audio on user interaction (required for mobile)
  await initAudio()
  
  // Don't modify scores - just start/continue the game
  gameStarted.value = true
  // Don't reload scores if they're already loaded
  // The scores should persist from onMounted
  
  // Load saved level if not already loaded
  const savedState = localStorage.getItem('chessGameState')
  if (savedState) {
    const state = JSON.parse(savedState)
    if (state.level && currentLevel.value === 1) {
      currentLevel.value = state.level
    }
  }
  nextPuzzle()
  saveGameState()
}

const continueGame = async () => {
  // Same as startGame - just continue playing
  await startGame()
}

const newGame = async () => {
  // Initialize audio on user interaction (required for mobile)
  await initAudio()
  
  // Clear all game data
  localStorage.removeItem('chessScore')
  localStorage.removeItem('chessStreak')
  localStorage.removeItem('chessHighScore')
  localStorage.removeItem('chessGameState')
  score.value = 0
  streak.value = 0
  currentLevel.value = 1
  saveScore() // Save the cleared scores
  gameStarted.value = true
  nextPuzzle()
  saveGameState()
}

const goHome = () => {
  gameStarted.value = false
  saveGameState()
  // Update hasActiveGame based on current progress
  if (score.value > 0 || currentLevel.value > 1) {
    hasActiveGame.value = true
  } else {
    hasActiveGame.value = false
  }
}

const saveGameState = () => {
  const state = {
    hasActiveGame: gameStarted.value,
    level: currentLevel.value,
    timestamp: Date.now()
  }
  localStorage.setItem('chessGameState', JSON.stringify(state))
}

const saveSettings = () => {
  const settings = {
    puzzleType: puzzleType.value,
    currentLevel: currentLevel.value,
    puzzlesPerLevel: puzzlesPerLevel.value
  }
  localStorage.setItem('chessSettings', JSON.stringify(settings))
}

const openSettings = () => {
  tempLevel.value = currentLevel.value
  tempPuzzleType.value = puzzleType.value
  showSettings.value = true
}

const openLeaderboard = () => {
  // Load high scores
  const savedHighScore = localStorage.getItem('chessHighScore')
  const savedLongestStreak = localStorage.getItem('chessLongestStreak')
  highScore.value = savedHighScore ? parseInt(savedHighScore) : 0
  longestStreak.value = savedLongestStreak ? parseInt(savedLongestStreak) : 0
  showLeaderboard.value = true
}

const applySettings = () => {
  currentLevel.value = tempLevel.value
  puzzleType.value = tempPuzzleType.value
  saveSettings()
  saveGameState()
  showSettings.value = false
  // Generate new puzzle with updated settings if game is active
  if (gameStarted.value) {
    nextPuzzle()
  }
}

const loadSettings = () => {
  const savedSettings = localStorage.getItem('chessSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    puzzleType.value = settings.puzzleType || 'capture'
    tempPuzzleType.value = settings.puzzleType || 'capture'
    puzzlesPerLevel.value = settings.puzzlesPerLevel || 3
    if (settings.currentLevel) {
      currentLevel.value = settings.currentLevel
      tempLevel.value = settings.currentLevel
    }
  }
}

const skipPuzzle = () => {
  // Reset hint state
  hintUsed.value = false
  showHint.value = false
  pieceSelected.value = false
  nextPuzzle()
}

const useHint = () => {
  if (!hintUsed.value && currentPuzzle.value?.solution) {
    hintUsed.value = true
    showHint.value = true
    // Hide hint after 3 seconds
    setTimeout(() => {
      showHint.value = false
    }, 3000)
  }
}

const nextPuzzle = () => {
  // Reset hint state for new puzzle
  hintUsed.value = false
  showHint.value = false
  
  // Determine puzzle type based on level if not manually set
  let mode = puzzleType.value
  if (mode === 'auto') {
    // Auto progression based on level
    if (currentLevel.value <= 2) mode = 'capture'
    else if (currentLevel.value <= 4) mode = 'check'
    else if (currentLevel.value <= 6) mode = 'mate1'
    else if (currentLevel.value <= 8) mode = 'mate2'
    else mode = 'mate3'
  }
  
  currentPuzzle.value = generatePuzzle(currentLevel.value, mode)
  currentPiece.value = currentPuzzle.value.piece
  validSquares.value = currentPuzzle.value.validSquares
  kingPosition.value = currentPuzzle.value.kingPosition
}

// Handle piece selection for tap-to-move
const handlePieceSelect = () => {
  pieceSelected.value = !pieceSelected.value
  if (pieceSelected.value) {
    playPickup()
  }
}

const handleSquareClick = (square) => {
  
  // Check if clicking on an enemy piece
  const isEnemySquare = currentPuzzle.value?.enemyPieces?.some(enemy => enemy.square === square)
  
  // If piece is selected, handle the move
  if (pieceSelected.value) {
    pieceSelected.value = false // Always deselect after clicking
    
    if (square === currentPuzzle.value.piecePosition) {
      // Clicking on the piece again just deselects it
    } else if (isValidMove(square)) {
      // Valid move for this puzzle type
      playDrop()
      handleSuccess()
    } else if (isEnemySquare) {
      // Clicked on non-capturable enemy - show error
      handleError()
    } else {
      // Invalid empty square clicked
      handleError()
    }
  }
}

// Handle piece drag events from ChessBoard
const handlePieceDragStart = (e) => {
  isDragging.value = true
  pieceSelected.value = false // Cancel selection on drag
  playPickup()
  // Add dragging class to original piece
  if (e.target) {
    e.target.classList.add('dragging')
    e.target.style.opacity = '0.3'
  }
}

const handlePieceDragEnd = (e) => {
  isDragging.value = false
  // Remove dragging class from piece
  if (e.target) {
    e.target.classList.remove('dragging')
    e.target.style.opacity = '1'
  }
}

// Legacy drag handlers for backward compatibility
const handleDragStart = (e) => {
  handlePieceDragStart(e)
}

const handleDragEnd = (e) => {
  handlePieceDragEnd(e)
}

const handleSquareDrop = (square) => {
  
  // Check if the move is valid for this puzzle type
  if (isValidMove(square)) {
    playDrop()
    handleSuccess()
  } else {
    playDrop()
    handleError()
  }
}

// Check if a move is valid based on puzzle type
const isValidMove = (square) => {
  if (!currentPuzzle.value) return false
  
  const puzzleType = currentPuzzle.value.puzzleType
  
  if (puzzleType === 'capture') {
    // For capture puzzles, any capturable enemy is valid
    return currentPuzzle.value.validSquares && currentPuzzle.value.validSquares.includes(square)
  } else if (puzzleType === 'checkmate' || puzzleType === 'mate1' || puzzleType === 'mate2' || puzzleType === 'mate3') {
    // For checkmate puzzles, only the solution move is valid
    return currentPuzzle.value.solution === square
  } else if (puzzleType === 'check') {
    // For check puzzles, any move that gives check is valid
    return currentPuzzle.value.validSquares && currentPuzzle.value.validSquares.includes(square)
  }
  
  return false
}

const handleSuccess = () => {
  showSuccess.value = true
  playSuccess()
  incrementScore()
  saveScore()
  
  // Update high scores
  const savedHighScore = localStorage.getItem('chessHighScore') || 0
  const savedLongestStreak = localStorage.getItem('chessLongestStreak') || 0
  
  if (score.value > savedHighScore) {
    localStorage.setItem('chessHighScore', score.value.toString())
  }
  if (streak.value > savedLongestStreak) {
    localStorage.setItem('chessLongestStreak', streak.value.toString())
  }
  
  // Update showNewButton since we now have progress
  if (score.value > 0 || currentLevel.value > 1) {
    showNewButton.value = true
  }
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98']
  })
  
  setTimeout(() => {
    showSuccess.value = false
    pieceSelected.value = false // Reset selection
    // Progress to next level based on puzzlesPerLevel setting
    if (streak.value > 0 && streak.value % puzzlesPerLevel.value === 0) {
      currentLevel.value = Math.min(currentLevel.value + 1, 10)
    }
    saveGameState() // Save progress
    nextPuzzle()
  }, 1000) // Reduced from 2000ms to 1000ms
}

const handleError = () => {
  playError()
  resetStreak()
  saveScore()
  
  // Add error animation to the piece only if piece exists
  if (pieceSelected.value || isDragging.value) {
    const pieceElement = document.querySelector('.piece-container')
    if (pieceElement) {
      pieceElement.classList.add('error-shake')
      setTimeout(() => {
        pieceElement.classList.remove('error-shake')
      }, 500)
    }
  }
}

// Check if device is mobile based on screen width
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  // Check mobile status
  checkMobile()
  
  // Load settings
  loadSettings()
  
  // Load saved level first
  const savedState = localStorage.getItem('chessGameState')
  if (savedState) {
    const state = JSON.parse(savedState)
    if (state.level) {
      currentLevel.value = state.level
    }
  }
  
  // Then load score
  loadScore()
  
  // Use nextTick to ensure score is loaded before checking
  nextTick(() => {
    // Check if there's an active game with progress
    if (score.value > 0 || currentLevel.value > 1) {
      hasActiveGame.value = true
    } else {
      hasActiveGame.value = false
    }
  })
  
  // Add event listeners for drag on board pieces
  document.addEventListener('dragstart', handleDragStart)
  document.addEventListener('dragend', handleDragEnd)
  
  // Add resize listener for mobile detection
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  document.removeEventListener('dragstart', handleDragStart)
  document.removeEventListener('dragend', handleDragEnd)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  padding-bottom: 0; /* Ensure no extra padding */
}

.piece-area {
  flex: 0 0 auto;
  height: auto;
  min-height: 100px;
  max-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 2px solid #4a5568;
  position: relative;
  padding: 15px 10px;
}

/* Landscape mode - reduce header height */
@media (orientation: landscape) and (max-height: 500px) {
  .piece-area {
    height: 15vh;
    min-height: 40px;
    max-height: 60px;
    padding: 3px;
  }
}

@media (min-width: 768px) {
  .piece-area {
    height: 15vh;
    min-height: 80px;
    max-height: 150px;
    padding: 10px;
    border-bottom: 4px solid #4a5568;
  }
}

.draggable-piece {
  cursor: grab;
  transition: transform 0.2s;
}

.draggable-piece:hover {
  transform: scale(1.05);
}

.draggable-piece:active {
  cursor: grabbing;
}

.chess-piece-large {
  width: 180px;
  height: 180px;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
}

.board-area {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  min-height: 0;
  position: relative;
}

/* Landscape mode adjustments */
@media (orientation: landscape) and (max-height: 500px) {
  .board-area {
    padding: 0;
    align-items: center;
  }
}

@media (min-width: 768px) {
  .board-area {
    padding: 0;
  }
}

.score-area {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.98);
  border-top: 2px solid #4a5568;
  font-size: 15px;
  font-weight: bold;
  color: #2d3748;
  padding: 12px 10px;
  min-height: 65px;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

/* Landscape mode - more compact score area */
@media (orientation: landscape) and (max-height: 500px) {
  .score-area {
    min-height: 55px;
    padding: 8px 10px;
    font-size: 13px;
    flex: 0 0 auto;
  }
}

@media (min-width: 768px) {
  .score-area {
    font-size: 24px;
    gap: 40px;
    padding: 10px;
    border-top: 4px solid #4a5568;
  }
}

.score, .streak, .level, .piece-info {
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  font-size: 15px;
  white-space: nowrap;
  font-weight: 600;
}

/* Landscape mode - smaller score items */
@media (orientation: landscape) and (max-height: 500px) {
  .score, .streak, .level, .piece-info {
    padding: 8px 12px;
    border-radius: 14px;
    font-size: 13px;
  }
}

@media (min-width: 768px) {
  .score, .streak, .level, .piece-info {
    padding: 10px 20px;
    border-radius: 20px;
    font-size: inherit;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
}

.piece-info {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

@media (min-width: 768px) {
  .piece-info {
    font-size: 28px;
  }
}

.start-message {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.start-button {
  padding: 20px 40px;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.start-button:hover {
  transform: scale(1.05);
}

.game-options {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.game-options .start-button {
  min-width: 120px;
}

/* Removed separate button colors - using default purple gradient */

.game-controls {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

/* Desktop - move buttons more to the right */
@media (min-width: 768px) {
  .game-controls {
    left: 60px;
  }
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.board-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 0 10px;
}

.board-control-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.board-control-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.board-control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.board-control-button svg {
  width: 20px;
  height: 20px;
  stroke: white;
  stroke-width: 2;
  fill: none;
}

.board-control-button span {
  font-size: 16px;
}

@media (max-width: 768px) {
  .board-control-button {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .board-control-button svg {
    width: 18px;
    height: 18px;
  }
  
  .board-control-button span {
    font-size: 14px;
  }
}

.control-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button svg {
  width: 24px;
  height: 24px;
  stroke: white;
  stroke-width: 2;
  fill: none;
}

.home-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hint-button, .board-control-button.hint-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.hint-button:disabled, .board-control-button.hint-button:disabled {
  background: linear-gradient(135deg, #a8a8a8 0%, #666666 100%);
}

.skip-button, .board-control-button.skip-button {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* Removed new-game-small styles as button is not used in game mode */

.dancing-pieces-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  z-index: 10;
}

.dancing-piece {
  width: 70px;
  height: 70px;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));
}

.dancing-piece.bounce {
  animation: bounce-dance 2s ease-in-out infinite;
}

.dancing-piece.spin {
  animation: spin-dance 3s linear infinite;
}

.dancing-piece.slide {
  animation: slide-dance 2.5s ease-in-out infinite;
}

@keyframes bounce-dance {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin-dance {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slide-dance {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.puzzle-instructions {
  text-align: center;
  color: #2d3748;
}

.puzzle-instructions h2 {
  font-size: 16px;
  margin: 2px 0;
  color: #764ba2;
}

.puzzle-instructions p {
  font-size: 12px;
  margin: 0;
  color: #4a5568;
}

/* Landscape mode - even smaller text */
@media (orientation: landscape) and (max-height: 500px) {
  .puzzle-instructions h2 {
    font-size: 14px;
    margin: 1px 0;
  }
  
  .puzzle-instructions p {
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .puzzle-instructions h2 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .puzzle-instructions p {
    font-size: 20px;
  }
}

/* Global dragging styles */
:global(.dragging) {
  opacity: 0.3 !important;
}

/* Start screen board */
.start-board {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.start-screen-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.decorative-board {
  border: 4px solid #2d3748;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  opacity: 0.5;
}

.decorative-board .board-row {
  display: flex;
}

.decorative-square {
  width: 80px;
  height: 80px;
}

.decorative-square.light {
  background-color: #f0d9b5;
}

.decorative-square.dark {
  background-color: #b58863;
}

.success-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.success-message {
  font-size: 72px;
  font-weight: bold;
  color: #48bb78;
  text-shadow: 4px 4px 8px rgba(0,0,0,0.2);
  animation: bounce 1s ease-in-out;
}

/* Error shake animation for piece */
:global(.error-shake) {
  animation: piece-shake 0.5s !important;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)) !important;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

@keyframes piece-shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* Mobile optimizations for dancing pieces */
@media (max-width: 768px) {
  .dancing-piece {
    width: 50px;
    height: 50px;
  }
  
  .dancing-pieces-overlay {
    gap: 15px;
    max-width: 280px;
  }
}

.feedback-enter-active, .feedback-leave-active {
  transition: opacity 0.3s;
}

.feedback-enter-from, .feedback-leave-to {
  opacity: 0;
}

/* Button group */
.button-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* Icon buttons */
.icon-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.leaderboard-button {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

/* Settings Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #2d3748;
  text-align: center;
  font-size: 28px;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #4a5568;
  font-size: 18px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f7fafc;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.radio-option:hover {
  background: #edf2f7;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-option span {
  font-size: 16px;
  color: #2d3748;
  font-weight: normal;
}

.puzzle-select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #f7fafc;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s;
}

.puzzle-select:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.puzzle-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.level-slider {
  width: 100%;
  margin: 15px 0;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #e2e8f0;
  outline: none;
}

.level-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

.level-slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

.level-labels {
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 14px;
  margin-top: 5px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.modal-button {
  flex: 1;
  padding: 12px 24px;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.modal-button.apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-button.cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.modal-button:hover {
  transform: scale(1.05);
}

/* Modal transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Leaderboard Modal Styles */
.leaderboard-modal h2 {
  font-size: 32px;
  margin-bottom: 30px;
}

.leaderboard-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.stat-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

@media (max-width: 480px) {
  .leaderboard-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    font-size: 28px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}

</style>