<template>
  <div class="game-container">
    <div class="piece-area">
      <div v-if="gameStarted && currentPuzzle" class="puzzle-instructions">
        <h2>Capture the enemy pieces!</h2>
        <p>Drag your {{ getPieceName(currentPiece) }} to capture the highlighted enemies</p>
      </div>
      <div v-if="!gameStarted" class="start-message">
        <button @click="startGame" class="start-button">
          Start Game
        </button>
      </div>
    </div>
    
    <div class="board-area">
      <ChessBoard 
        v-if="gameStarted"
        :validSquares="validSquares"
        :kingPosition="kingPosition"
        :piecePosition="currentPuzzle?.piecePosition || ''"
        :boardDimensions="currentPuzzle?.boardDimensions || { cols: 3, rows: 3 }"
        :enemyPieces="currentPuzzle?.enemyPieces || []"
        :playerPiece="currentPiece"
        @square-drop="handleSquareDrop"
        @piece-drag-start="handlePieceDragStart"
        @piece-drag-end="handlePieceDragEnd"
        :isDragging="isDragging"
      />
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
    
    <transition name="shake">
      <div v-if="showError" class="error-feedback"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Chess } from 'chess.js'
import confetti from 'canvas-confetti'
import ChessBoard from './components/ChessBoard.vue'
import { usePuzzles } from './composables/usePuzzles'
import { useScore } from './composables/useScore'
import { useSounds } from './composables/useSounds'

const { getPuzzle, generatePuzzle } = usePuzzles()
const { score, streak, incrementScore, resetStreak, loadScore, saveScore } = useScore()
const { playSuccess, playError, playPickup, playDrop } = useSounds()

const gameStarted = ref(false)
const currentPiece = ref(null)
const validSquares = ref([])
const kingPosition = ref('')
const isDragging = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const currentLevel = ref(1)
const currentPuzzle = ref(null)

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

const startGame = () => {
  gameStarted.value = true
  loadScore()
  nextPuzzle()
}

const nextPuzzle = () => {
  currentPuzzle.value = generatePuzzle(currentLevel.value)
  currentPiece.value = currentPuzzle.value.piece
  validSquares.value = currentPuzzle.value.validSquares
  kingPosition.value = currentPuzzle.value.kingPosition
  console.log('Generated puzzle:', currentPuzzle.value)
  console.log('Enemy pieces:', currentPuzzle.value.enemyPieces)
}

// Handle piece drag events from ChessBoard
const handlePieceDragStart = (e) => {
  console.log('Piece drag start received in App')
  isDragging.value = true
  playPickup()
  // Add dragging class to original piece
  if (e.target) {
    e.target.classList.add('dragging')
    e.target.style.opacity = '0.3'
  }
}

const handlePieceDragEnd = (e) => {
  console.log('Piece drag end received in App')
  isDragging.value = false
  // Remove dragging class from piece
  if (e.target) {
    e.target.classList.remove('dragging')
    e.target.style.opacity = '1'
  }
}

// Legacy drag handlers for backward compatibility
const handleDragStart = (e) => {
  console.log('Legacy drag start (should not be called)')
  handlePieceDragStart(e)
}

const handleDragEnd = (e) => {
  console.log('Legacy drag end (should not be called)')
  handlePieceDragEnd(e)
}

const handleSquareDrop = (square) => {
  console.log('Square drop triggered on:', square)
  console.log('Valid moves:', currentPuzzle.value.allValidMoves)
  playDrop()
  
  // Check if the square is a valid move for this piece
  if (currentPuzzle.value.allValidMoves && currentPuzzle.value.allValidMoves.includes(square)) {
    console.log('Valid move!')
    handleSuccess()
  } else {
    console.log('Invalid move!')
    handleError()
  }
}

const handleSuccess = () => {
  showSuccess.value = true
  playSuccess()
  incrementScore()
  saveScore()
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98']
  })
  
  setTimeout(() => {
    showSuccess.value = false
    // Progress to next level every 3 correct answers
    if (streak.value > 0 && streak.value % 3 === 0) {
      currentLevel.value = Math.min(currentLevel.value + 1, 10)
    }
    nextPuzzle()
  }, 2000)
}

const handleError = () => {
  showError.value = true
  playError()
  resetStreak()
  saveScore()
  
  setTimeout(() => {
    showError.value = false
  }, 1000)
}

onMounted(() => {
  loadScore()
  // Add event listeners for drag on board pieces
  document.addEventListener('dragstart', handleDragStart)
  document.addEventListener('dragend', handleDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('dragstart', handleDragStart)
  document.removeEventListener('dragend', handleDragEnd)
})
</script>

<style scoped>
.game-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.piece-area {
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 4px solid #4a5568;
  position: relative;
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
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  overflow: auto;
}

.score-area {
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 4px solid #4a5568;
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
}

.score, .streak, .level, .piece-info {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.piece-info {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  font-size: 28px;
}

.start-message {
  text-align: center;
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
  font-size: 32px;
  margin-bottom: 10px;
  color: #764ba2;
}

.puzzle-instructions p {
  font-size: 20px;
  color: #4a5568;
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

.error-feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 8px solid #f56565;
  border-radius: 20px;
  animation: shake 0.5s;
  z-index: 1000;
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

@keyframes shake {
  0%, 100% {
    transform: translate(-50%, -50%) translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translate(-50%, -50%) translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translate(-50%, -50%) translateX(10px);
  }
}

.feedback-enter-active, .feedback-leave-active {
  transition: opacity 0.3s;
}

.feedback-enter-from, .feedback-leave-to {
  opacity: 0;
}
</style>