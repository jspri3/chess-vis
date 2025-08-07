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
          v-if="isKingPosition(rowIndex, colIndex)"
          :src="getKingImage()"
          alt="King"
          class="chess-piece"
        />
        <div 
          v-if="isValidSquare(rowIndex, colIndex) && isDragging"
          class="drop-indicator"
        ></div>
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
  isDragging: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['square-drop'])

const board = computed(() => {
  const boardArray = []
  for (let i = 0; i < 4; i++) {
    const row = []
    for (let j = 0; j < 8; j++) {
      row.push(null)
    }
    boardArray.push(row)
  }
  return boardArray
})

const getSquareNotation = (row, col) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const rank = 4 - row
  return `${files[col]}${rank}`
}

const getSquareClass = (row, col) => {
  const square = getSquareNotation(row, col)
  const isValid = props.validSquares.includes(square)
  const isKing = square === props.kingPosition
  const isDark = (row + col) % 2 === 1
  
  return {
    'board-square': true,
    'square-dark': isDark,
    'square-light': !isDark,
    'square-valid': isValid && !isKing,
    'square-invalid': !isValid && !isKing,
    'square-king': isKing,
    'square-hoverable': isValid && props.isDragging
  }
}

const isValidSquare = (row, col) => {
  const square = getSquareNotation(row, col)
  return props.validSquares.includes(square) && square !== props.kingPosition
}

const isKingPosition = (row, col) => {
  const square = getSquareNotation(row, col)
  return square === props.kingPosition
}

const getKingImage = () => {
  const base = import.meta.env.BASE_URL
  return `${base}assets/Piece=King, Side=Black.png`
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
  width: 90px;
  height: 90px;
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

.square-valid::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background-color: rgba(72, 187, 120, 0.5);
  border-radius: 50%;
  pointer-events: none;
}

.square-hoverable:hover {
  background-color: rgba(72, 187, 120, 0.3) !important;
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.square-king {
  background-color: #ffd700 !important;
  animation: pulse 2s infinite;
}

.chess-piece {
  width: 70px;
  height: 70px;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.drop-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 4px dashed #48bb78;
  border-radius: 50%;
  animation: rotate 2s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>