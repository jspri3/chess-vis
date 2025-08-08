<template>
  <div class="chess-board">
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
      >
        <div 
          v-if="isPieceStartPosition(rowIndex, colIndex) && playerPiece"
          class="piece-container"
          draggable="true"
          @click="handlePieceClick"
          @dragstart="handlePieceDragStart"
          @dragend="handlePieceDragEnd"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
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
          :src="getEnemyImage()"
          alt="Enemy"
          class="chess-piece enemy-piece"
        />
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
  const isDark = (row + col) % 2 === 1
  
  return {
    'board-square': true,
    'square-dark': isDark,
    'square-light': !isDark,
    'square-valid': isCapturableEnemy,
    'square-invalid': hasEnemy && !isCapturableEnemy,
    'square-start': isStart,
    'square-enemy': hasEnemy,
    'square-capturable': isCapturableEnemy,
    'square-hoverable': isCapturableEnemy && (props.isDragging || props.selectedPiece),
    'square-selected': isStart && props.selectedPiece
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
  if (result) {
    console.log('Piece is at position:', square)
  }
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

const getEnemyImage = () => {
  const base = import.meta.env.BASE_URL
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

const handlePieceClick = (e) => {
  console.log('Piece clicked!', e.target)
  e.stopPropagation() // Prevent square click
  emit('piece-select')
}

const handleSquareClick = (e, row, col) => {
  const square = getSquareNotation(row, col)
  console.log('Square clicked:', square)
  emit('square-click', square)
}

const handleMouseDown = (e) => {
  console.log('Mouse down on piece', e.target)
}

let touchStartPos = { x: 0, y: 0 }
let isTouchDrag = false

const handleTouchStart = (e) => {
  console.log('Touch start on piece')
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
  console.log('Touch end, isTouchDrag:', isTouchDrag)
  
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
      console.log('Dropped on square:', square)
      emit('square-drop', square)
    }
    
    emit('piece-drag-end', e)
  } else {
    // It was a tap, not a drag
    console.log('Touch was a tap, selecting piece')
    e.currentTarget.style.opacity = '1'
    emit('piece-select')
  }
  
  isTouchDrag = false
}

const handlePieceDragStart = (e) => {
  console.log('Piece drag start in ChessBoard', e)
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
  console.log('Piece drag end in ChessBoard')
  emit('piece-drag-end', e)
}

const handleDrop = (e, row, col) => {
  e.preventDefault()
  const square = getSquareNotation(row, col)
  console.log('Drop event on square:', square)
  console.log('Valid squares:', props.validSquares)
  console.log('Is valid drop?', props.validSquares.includes(square))
  
  // Always emit the drop event, let parent handle validation
  emit('square-drop', square)
}
</script>

<style scoped>
.chess-board {
  display: inline-block;
  border: 4px solid #2d3748;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transform: scale(1);
  transition: transform 0.3s;
}

.board-row {
  display: flex;
}

.board-square {
  width: min(15vw, 15vh, 120px);
  height: min(15vw, 15vh, 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.2s;
}

/* Mobile responsive sizing */
@media (max-width: 768px) {
  .board-square {
    width: min(25vw, 12vh, 80px);
    height: min(25vw, 12vh, 80px);
  }
}

@media (max-width: 480px) {
  .board-square {
    width: min(28vw, 10vh, 70px);
    height: min(28vw, 10vh, 70px);
  }
}

.square-light {
  background-color: #f0d9b5;
}

.square-dark {
  background-color: #b58863;
}

.square-invalid {
  opacity: 0.3;
  pointer-events: none;
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
  width: 40px;
  height: 40px;
  border: 3px solid rgba(239, 68, 68, 0.8);
  border-radius: 50%;
  pointer-events: none;
  animation: pulse-red 1.5s infinite;
}

.square-selected {
  background-color: rgba(72, 187, 120, 0.3) !important;
  box-shadow: inset 0 0 0 3px rgba(72, 187, 120, 0.6);
}

@keyframes pulse-red {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.4;
  }
}

.square-hoverable:hover {
  background-color: rgba(239, 68, 68, 0.2) !important;
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  cursor: pointer;
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>