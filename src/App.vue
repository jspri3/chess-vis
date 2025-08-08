<template>
  <div class="game-container">
    <div class="piece-area">
      <div v-if="gameStarted && currentPuzzle" class="puzzle-instructions">
        <h2>Capture the enemy pieces!</h2>
        <p>Drag your {{ getPieceName(currentPiece) }} to capture the highlighted enemies</p>
      </div>
      <div v-if="!gameStarted" class="start-message">
        <button v-if="!hasActiveGame" @click="startGame" class="start-button">
          Start Game
        </button>
        <div v-else class="game-options">
          <button @click="continueGame" class="start-button">
            Continue
          </button>
          <button @click="newGame" class="start-button">
            New
          </button>
        </div>
      </div>
      <div v-else class="game-controls">
        <button @click="goHome" class="home-button" title="Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"/>
          </svg>
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
        :selectedPiece="pieceSelected"
        @square-drop="handleSquareDrop"
        @piece-drag-start="handlePieceDragStart"
        @piece-drag-end="handlePieceDragEnd"
        @piece-select="handlePieceSelect"
        @square-click="handleSquareClick"
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
    
    <!-- Error feedback handled by piece animation -->
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
const pieceSelected = ref(false)
const hasActiveGame = ref(false)

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
  saveGameState()
}

const continueGame = () => {
  const savedState = localStorage.getItem('chessGameState')
  if (savedState) {
    const state = JSON.parse(savedState)
    currentLevel.value = state.level || 1
    gameStarted.value = true
    loadScore()
    nextPuzzle()
  }
}

const newGame = () => {
  // Clear all game data
  localStorage.removeItem('chessScore')
  localStorage.removeItem('chessStreak')
  localStorage.removeItem('chessGameState')
  score.value = 0
  streak.value = 0
  currentLevel.value = 1
  gameStarted.value = true
  nextPuzzle()
  saveGameState()
}

const goHome = () => {
  gameStarted.value = false
  saveGameState()
}

const saveGameState = () => {
  const state = {
    hasActiveGame: gameStarted.value,
    level: currentLevel.value,
    timestamp: Date.now()
  }
  localStorage.setItem('chessGameState', JSON.stringify(state))
}

const nextPuzzle = () => {
  currentPuzzle.value = generatePuzzle(currentLevel.value)
  currentPiece.value = currentPuzzle.value.piece
  validSquares.value = currentPuzzle.value.validSquares
  kingPosition.value = currentPuzzle.value.kingPosition
  console.log('Generated puzzle:', currentPuzzle.value)
  console.log('Enemy pieces:', currentPuzzle.value.enemyPieces)
}

// Handle piece selection for tap-to-move
const handlePieceSelect = () => {
  console.log('Piece selected')
  pieceSelected.value = !pieceSelected.value
  if (pieceSelected.value) {
    playPickup()
  }
}

const handleSquareClick = (square) => {
  console.log('Square clicked in App:', square)
  console.log('Piece selected?', pieceSelected.value)
  console.log('Current puzzle valid moves:', currentPuzzle.value?.allValidMoves)
  console.log('Current piece position:', currentPuzzle.value?.piecePosition)
  
  // Check if clicking on an enemy piece
  const isEnemySquare = currentPuzzle.value?.enemyPieces?.some(enemy => enemy.square === square)
  
  // If piece is selected, handle the move
  if (pieceSelected.value) {
    pieceSelected.value = false // Always deselect after clicking
    
    if (square === currentPuzzle.value.piecePosition) {
      // Clicking on the piece again just deselects it
      console.log('Piece deselected')
    } else if (currentPuzzle.value.allValidMoves && currentPuzzle.value.allValidMoves.includes(square)) {
      // Valid capture - make the move
      console.log('Valid capture move to:', square)
      playDrop()
      handleSuccess()
    } else if (isEnemySquare) {
      // Clicked on non-capturable enemy - show error
      console.log('Invalid enemy capture attempted:', square)
      handleError()
    } else {
      // Invalid empty square clicked
      console.log('Invalid move attempted to:', square)
      console.log('Valid moves were:', currentPuzzle.value.allValidMoves)
      handleError()
    }
  } else {
    console.log('No piece selected, ignoring square click')
  }
}

// Handle piece drag events from ChessBoard
const handlePieceDragStart = (e) => {
  console.log('Piece drag start received in App')
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
  
  // Check if dropping on an enemy piece
  const isEnemySquare = currentPuzzle.value?.enemyPieces?.some(enemy => enemy.square === square)
  
  // Check if the square is a valid move for this piece
  if (currentPuzzle.value.allValidMoves && currentPuzzle.value.allValidMoves.includes(square)) {
    console.log('Valid move!')
    playDrop()
    handleSuccess()
  } else {
    console.log('Invalid move!')
    playDrop()
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
    pieceSelected.value = false // Reset selection
    // Progress to next level every 3 correct answers
    if (streak.value > 0 && streak.value % 3 === 0) {
      currentLevel.value = Math.min(currentLevel.value + 1, 10)
    }
    saveGameState() // Save progress
    nextPuzzle()
  }, 2000)
}

const handleError = () => {
  playError()
  resetStreak()
  saveScore()
  
  // Add error animation to the piece
  const pieceElement = document.querySelector('.piece-container')
  if (pieceElement) {
    pieceElement.classList.add('error-shake')
    setTimeout(() => {
      pieceElement.classList.remove('error-shake')
    }, 500)
  }
}

onMounted(() => {
  loadScore()
  // Check for saved game state
  const savedState = localStorage.getItem('chessGameState')
  if (savedState) {
    const state = JSON.parse(savedState)
    hasActiveGame.value = state.hasActiveGame || false
    if (state.level) {
      currentLevel.value = state.level
    }
  }
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
  height: 15vh;
  min-height: 70px;
  max-height: 100px;
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
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

/* Removed separate button colors - using default purple gradient */

.game-controls {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  z-index: 10;
}

.home-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.home-button svg {
  width: 24px;
  height: 24px;
  stroke: white;
  stroke-width: 2;
  fill: none;
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
</style>