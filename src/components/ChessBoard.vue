<template>
  <div class="chess-board-container" :style="containerStyle">
    <div class="board-with-ranks">
      <!-- Left rank labels (8-1) -->
      <div class="rank-labels left">
        <div v-for="(rank, index) in rankLabels" :key="`left-${rank}`" class="rank-label">
          {{ rank }}
        </div>
      </div>
      
      <div class="chess-board" :style="boardStyle">
        <div 
          v-for="(row, rowIndex) in board" 
          :key="rowIndex"
          class="board-row"
        >
          <div 
            v-for="(square, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :class="getSquareClass(rowIndex, colIndex)"
        :data-square="getSquareNotation(rowIndex, colIndex)"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop($event, rowIndex, colIndex)"
        @dragenter.prevent
        @click="handleSquareClick($event, rowIndex, colIndex)"
        @touchend="handleSquareTouchEnd($event, rowIndex, colIndex)"
      >
        <div 
          v-if="isPieceStartPosition(rowIndex, colIndex) && playerPiece"
          class="piece-container"
          draggable="true"
          @click="handlePieceClick"
          @dragstart="handlePieceDragStart"
          @dragend="handlePieceDragEnd"
          @mousedown="handleMouseDown"
          @touchstart.passive="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <img 
            :src="getPieceImage(playerPiece)"
            :alt="playerPiece.type"
            class="chess-piece player-piece"
            draggable="false"
          />
        </div>
        <img 
          v-if="hasEnemyPiece(rowIndex, colIndex)"
          :src="getEnemyImage(rowIndex, colIndex)"
          alt="Enemy"
          class="chess-piece enemy-piece"
        />
        </div>
      </div>
    </div>
    </div>
    
    <!-- Bottom file labels (a-h) -->
    <div class="file-labels bottom">
      <div class="corner-space"></div>
      <div v-for="(file, index) in fileLabels" :key="`bottom-${file}`" class="file-label">
        {{ file }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  validSquares: {
    type: Array,
    required: true,
    default: () => []
  },
  kingPosition: {
    type: String,
    required: true,
    default: ''
  },
  piecePosition: {
    type: String,
    default: ''
  },
  isDragging: {
    type: Boolean,
    default: false
  },
  boardDimensions: {
    type: Object,
    default: () => ({ cols: 8, rows: 4 })
  },
  enemyPieces: {
    type: Array,
    default: () => []
  },
  playerPiece: {
    type: Object,
    default: null
  },
  selectedPiece: {
    type: Boolean,
    default: false
  },
  hintSquare: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['square-drop', 'piece-drag-start', 'piece-drag-end', 'piece-select', 'square-click'])

const board = computed(() => {
  const boardArray = []
  const { rows, cols } = props.boardDimensions
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      row.push(null)
    }
    boardArray.push(row)
  }
  return boardArray
})

const boardStyle = computed(() => ({
  '--board-cols': props.boardDimensions.cols,
  '--board-rows': props.boardDimensions.rows
}))

// Also apply the CSS variables to the container
const containerStyle = computed(() => ({
  '--board-cols': props.boardDimensions.cols,
  '--board-rows': props.boardDimensions.rows
}))

// Generate file labels (a-h) based on board dimensions
const fileLabels = computed(() => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  return files.slice(0, props.boardDimensions.cols)
})

// Generate rank labels (8-1 or 4-1 etc) based on board dimensions
const rankLabels = computed(() => {
  const ranks = []
  for (let i = props.boardDimensions.rows; i >= 1; i--) {
    ranks.push(i.toString())
  }
  return ranks
})

const getSquareNotation = (row, col) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, props.boardDimensions.cols)
  const { rows } = props.boardDimensions
  const rank = rows - row
  return `${files[col]}${rank}`
}

const getSquareClass = (row, col) => {
  const square = getSquareNotation(row, col)
  const isValid = props.validSquares.includes(square)
  const isStart = square === props.piecePosition
  const hasEnemy = props.enemyPieces.some(enemy => enemy.square === square)
  const isCapturableEnemy = props.enemyPieces.some(enemy => enemy.square === square && enemy.capturable)
  const isHelper = props.enemyPieces.some(enemy => enemy.square === square && enemy.isHelper)
  const isDark = (row + col) % 2 === 1
  const isActive = props.isDragging || props.selectedPiece
  const isHint = props.hintSquare === square
  
  return {
    'board-square': true,
    'square-dark': isDark,
    'square-light': !isDark,
    'square-valid': isCapturableEnemy,
    'square-invalid': hasEnemy && !isCapturableEnemy && !isHelper,
    'square-start': isStart,
    'square-enemy': hasEnemy && !isHelper,
    'square-helper': isHelper,
    'square-capturable': isCapturableEnemy,
    'square-hoverable-valid': isCapturableEnemy && isActive,
    'square-hoverable-invalid': hasEnemy && !isCapturableEnemy && !isHelper && isActive,
    'square-selected': isStart && props.selectedPiece,
    'square-dragging': isActive,
    'square-hint': isHint
  }
}

const isValidSquare = (row, col) => {
  const square = getSquareNotation(row, col)
  return props.validSquares.includes(square)
}

const hasEnemyPiece = (row, col) => {
  const square = getSquareNotation(row, col)
  return props.enemyPieces.some(enemy => enemy.square === square)
}

const isPieceStartPosition = (row, col) => {
  const square = getSquareNotation(row, col)
  const result = square === props.piecePosition
  return result
}

const getPieceImage = (piece) => {
  if (!piece) return ''
  const color = piece.color === 'w' ? 'White' : 'Black'
  const typeMap = {
    'q': 'Queen',
    'r': 'Rook',
    'b': 'Bishop',
    'n': 'Knight',
    'p': 'Pawn',
    'k': 'King'
  }
  const pieceName = typeMap[piece.type]
  const base = import.meta.env.BASE_URL
  return `${base}assets/Piece=${pieceName}, Side=${color}.png`
}

const getEnemyImage = (row, col) => {
  const square = getSquareNotation(row, col)
  const enemy = props.enemyPieces.find(e => e.square === square)
  const base = import.meta.env.BASE_URL
  
  // Check if this enemy has specific piece data from FEN
  if (enemy && enemy.piece) {
    const color = enemy.piece.color === 'w' ? 'White' : 'Black'
    const typeMap = {
      'q': 'Queen',
      'r': 'Rook',
      'b': 'Bishop',
      'n': 'Knight',
      'p': 'Pawn',
      'k': 'King'
    }
    const pieceName = typeMap[enemy.piece.type]
    return `${base}assets/Piece=${pieceName}, Side=${color}.png`
  }
  
  // Check if this enemy is the king (for simple puzzles)
  if (enemy && enemy.isKing) {
    return `${base}assets/Piece=King, Side=Black.png`
  }
  
  // Default to pawn for other enemies
  return `${base}assets/Piece=Pawn, Side=Black.png`
}

const handleDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

// Track touch state for mobile drag
let touchItem = null
let touchOffset = { x: 0, y: 0 }
let dragElement = null

// Track if we're using touch
let isTouchDevice = false

const handlePieceClick = (e) => {
  // Ignore click events if this was from a touch
  if (isTouchDevice) {
    return
  }
  e.stopPropagation() // Prevent square click
  emit('piece-select')
}

const handleSquareClick = (e, row, col) => {
  // Ignore click events if this was from a touch
  if (isTouchDevice) {
    return
  }
  const square = getSquareNotation(row, col)
  emit('square-click', square)
}

const handleSquareTouchEnd = (e, row, col) => {
  // Prevent default to avoid click events firing after touch
  e.preventDefault()
  
  // Check if we're in touch mode
  if (!isTouchDevice) {
    return
  }
  
  // Only handle if this is not from a piece drag
  if (!isTouchDrag && !e.target.closest('.piece-container')) {
    const square = getSquareNotation(row, col)
    emit('square-click', square)
  }
}

const handleMouseDown = (e) => {
  // Mark as not touch device when mouse is used
  isTouchDevice = false
}

let touchStartPos = { x: 0, y: 0 }
let isTouchDrag = false

const handleTouchStart = (e) => {
  isTouchDevice = true // Mark as touch device
  isTouchDrag = false
  
  const touch = e.touches[0]
  const target = e.currentTarget
  
  // Store the initial touch position
  touchStartPos.x = touch.clientX
  touchStartPos.y = touch.clientY
  
  const rect = target.getBoundingClientRect()
  touchOffset.x = touch.clientX - rect.left
  touchOffset.y = touch.clientY - rect.top
}

const handleTouchMove = (e) => {
  const touch = e.touches[0]
  const moveDistance = Math.abs(touch.clientX - touchStartPos.x) + Math.abs(touch.clientY - touchStartPos.y)
  
  // If moved more than 10 pixels, it's a drag
  if (!isTouchDrag && moveDistance > 10) {
    isTouchDrag = true
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    
    // Create drag element
    dragElement = target.cloneNode(true)
    dragElement.style.position = 'fixed'
    dragElement.style.zIndex = '1000'
    dragElement.style.opacity = '0.8'
    dragElement.style.pointerEvents = 'none'
    dragElement.style.width = rect.width + 'px'
    dragElement.style.height = rect.height + 'px'
    dragElement.style.left = (touch.clientX - touchOffset.x) + 'px'
    dragElement.style.top = (touch.clientY - touchOffset.y) + 'px'
    document.body.appendChild(dragElement)
    
    emit('piece-drag-start', e)
    target.style.opacity = '0.3'
  }
  
  if (dragElement && isTouchDrag) {
    e.preventDefault() // Only prevent scrolling during drag
    dragElement.style.left = (touch.clientX - touchOffset.x) + 'px'
    dragElement.style.top = (touch.clientY - touchOffset.y) + 'px'
  }
}

const handleTouchEnd = (e) => {
  // Prevent this from bubbling to square touchend
  e.stopPropagation()
  
  if (dragElement && isTouchDrag) {
    // Handle drag end
    const touch = e.changedTouches[0]
    dragElement.style.display = 'none'
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    dragElement.style.display = ''
    
    // Clean up drag element
    document.body.removeChild(dragElement)
    dragElement = null
    
    // Reset opacity
    e.currentTarget.style.opacity = '1'
    
    // Check if dropped on a valid square
    if (elementBelow && elementBelow.classList.contains('board-square')) {
      const square = elementBelow.dataset.square
      emit('square-drop', square)
    }
    
    emit('piece-drag-end', e)
  } else {
    // It was a tap, not a drag - make sure opacity is reset
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1'
    }
    // Emit piece-select for tap
    emit('piece-select')
  }
  
  isTouchDrag = false
}

const handlePieceDragStart = (e) => {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', 'dragging')
  
  // Set drag image to the piece image
  const img = e.target.querySelector('img')
  if (img) {
    e.dataTransfer.setDragImage(img, 40, 40)
  }
  
  emit('piece-drag-start', e)
}

const handlePieceDragEnd = (e) => {
  emit('piece-drag-end', e)
}

const handleDrop = (e, row, col) => {
  e.preventDefault()
  const square = getSquareNotation(row, col)
  
  // Always emit the drop event, let parent handle validation
  emit('square-drop', square)
}
</script>

<style scoped>
.chess-board-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-family: monospace;
}

.board-with-ranks {
  display: flex;
  align-items: center;
}

.file-labels {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #4a5568;
}

.file-labels.bottom {
  margin-top: 5px;
}

.file-label {
  width: min(calc(90vw / var(--board-cols, 8)), calc(70vh / var(--board-rows, 8)), 80px);
  text-align: center;
  font-size: 14px;
}

.rank-labels {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  color: #4a5568;
}

.rank-labels.left {
  margin-right: 5px;
}

.rank-label {
  height: min(calc(90vw / var(--board-cols, 8)), calc(70vh / var(--board-rows, 8)), 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.corner-space {
  width: 20px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .file-label, .rank-label {
    font-size: 12px;
  }
  
  .corner-space {
    width: 15px;
  }
  
  .file-labels.bottom {
    margin: 3px 0;
  }
  
  .rank-labels.left {
    margin: 0 3px;
  }
}

.chess-board {
  display: inline-block;
  border: 3px solid #2d3748;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transform: scale(1);
  transition: transform 0.3s;
  max-width: 90vw;
  max-height: 70vh;
}

@media (min-width: 768px) {
  .chess-board {
    border: 4px solid #2d3748;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
}

.board-row {
  display: flex;
}

.board-square {
  width: min(calc(90vw / var(--board-cols, 8)), calc(70vh / var(--board-rows, 8)), 80px);
  height: min(calc(90vw / var(--board-cols, 8)), calc(70vh / var(--board-rows, 8)), 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.2s;
}

/* Mobile responsive sizing - adapt to board dimensions */
@media (max-width: 768px) {
  .board-square {
    width: min(calc(85vw / var(--board-cols, 8)), calc(60vh / var(--board-rows, 8)), 70px);
    height: min(calc(85vw / var(--board-cols, 8)), calc(60vh / var(--board-rows, 8)), 70px);
  }
}

/* Landscape mode on mobile */
@media (orientation: landscape) and (max-height: 500px) {
  .board-square {
    /* In landscape, optimize for height */
    width: min(calc(80vw / var(--board-cols, 8)), calc(65vh / var(--board-rows, 8)), 60px);
    height: min(calc(80vw / var(--board-cols, 8)), calc(65vh / var(--board-rows, 8)), 60px);
  }
}

@media (max-width: 480px) and (orientation: portrait) {
  .board-square {
    /* For small phones in portrait, adapt to board dimensions */
    width: min(calc(85vw / var(--board-cols, 8)), calc(55vh / var(--board-rows, 8)), 65px);
    height: min(calc(85vw / var(--board-cols, 8)), calc(55vh / var(--board-rows, 8)), 65px);
  }
}

/* Desktop sizing for larger boards */
@media (min-width: 769px) {
  .board-square {
    width: min(calc(80vw / var(--board-cols, 8)), calc(65vh / var(--board-rows, 8)), 90px);
    height: min(calc(80vw / var(--board-cols, 8)), calc(65vh / var(--board-rows, 8)), 90px);
  }
}

.square-light {
  background-color: #f0d9b5;
}

.square-dark {
  background-color: #b58863;
}

.square-invalid {
  opacity: 0.7;
  cursor: pointer;
}

.square-valid {
  position: relative;
}

.square-capturable {
  position: relative;
}

.square-capturable::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid rgba(72, 187, 120, 0.6);
  border-radius: 50%;
  pointer-events: none;
  animation: pulse-green 2s infinite;
}

.square-selected {
  background-color: rgba(72, 187, 120, 0.3) !important;
  box-shadow: inset 0 0 0 3px rgba(72, 187, 120, 0.6);
}

.square-hint {
  animation: hint-pulse 1s ease-in-out infinite;
  position: relative;
}

.square-hint::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0) 70%);
  pointer-events: none;
  animation: hint-glow 1s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% {
    box-shadow: inset 0 0 0 3px rgba(255, 215, 0, 0.8);
  }
  50% {
    box-shadow: inset 0 0 0 6px rgba(255, 215, 0, 0.4);
  }
}

@keyframes hint-glow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes pulse-green {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

.square-hoverable-valid {
  cursor: pointer;
  transition: all 0.2s;
}

.square-hoverable-valid:hover {
  background-color: rgba(72, 187, 120, 0.3) !important;
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 16px rgba(72, 187, 120, 0.4);
}

.square-hoverable-invalid {
  cursor: pointer;
  transition: all 0.2s;
}

.square-hoverable-invalid:hover {
  background-color: rgba(239, 68, 68, 0.2) !important;
  transform: scale(1.02);
}

/* Show hover effects during dragging */
.square-dragging .square-hoverable-valid {
  background-color: rgba(72, 187, 120, 0.2);
}

.square-dragging .square-hoverable-invalid {
  background-color: rgba(239, 68, 68, 0.1);
}

.square-king {
  background-color: #ffd700 !important;
  animation: pulse 2s infinite;
}

.square-start {
  background-color: #a0d2ff !important;
  position: relative;
}

.start-position-marker {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #1a365d;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 3;
}

.piece-container {
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 3;
  touch-action: none; /* Important for touch events */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.piece-container:active {
  cursor: grabbing;
}

.chess-piece {
  width: 100%;
  height: 100%;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  transition: opacity 0.2s;
  pointer-events: none;
}

.player-piece {
  z-index: 3;
  cursor: grab;
  transition: transform 0.2s, opacity 0.2s;
  user-select: none;
  -webkit-user-drag: element;
}

.player-piece:hover {
  transform: scale(1.1);
}

.player-piece:active {
  cursor: grabbing;
  transform: scale(1.15);
}

.player-piece.dragging {
  opacity: 0.3;
  transform: scale(0.9);
}

.enemy-piece {
  opacity: 0.9;
}

.square-helper {
  opacity: 0.7;
}

.square-helper .chess-piece {
  opacity: 0.8;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>