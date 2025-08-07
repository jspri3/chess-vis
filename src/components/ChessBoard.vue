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
      >
        <img 
          v-if="isPieceStartPosition(rowIndex, colIndex) && playerPiece"
          :src="getPieceImage(playerPiece)"
          :alt="playerPiece.type"
          class="chess-piece player-piece"
          :draggable="true"
        />
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
  }
})

const emit = defineEmits(['square-drop'])

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
    'square-hoverable': isCapturableEnemy && props.isDragging
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
  return square === props.piecePosition
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

const handleDrop = (e, row, col) => {
  e.preventDefault()
  const square = getSquareNotation(row, col)
  if (props.validSquares.includes(square)) {
    emit('square-drop', square)
  }
}
</script>

<style scoped>
.chess-board {
  display: inline-block;
  border: 4px solid #2d3748;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.board-row {
  display: flex;
}

.board-square {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.2s;
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

.chess-piece {
  width: 70px;
  height: 70px;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.player-piece {
  z-index: 3;
  cursor: grab;
  transition: transform 0.2s;
}

.player-piece:hover {
  transform: scale(1.1);
}

.player-piece:active {
  cursor: grabbing;
  transform: scale(1.15);
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