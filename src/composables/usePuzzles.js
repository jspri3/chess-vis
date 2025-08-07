import { Chess } from 'chess.js'

export function usePuzzles() {
  
  // Get board dimensions based on level
  const getBoardDimensions = (level) => {
    if (level <= 3) return { cols: 3, rows: 3 } // 3x3 for levels 1-3
    if (level <= 6) return { cols: 4, rows: 4 } // 4x4 for levels 4-6
    return { cols: 8, rows: 4 } // 4x8 for levels 7+
  }
  
  // Generate capture puzzle - place enemy pieces and find which ones can be captured
  const generatePuzzle = (level) => {
    const boardDimensions = getBoardDimensions(level)
    const { cols, rows } = boardDimensions
    
    // For 3x3 board, use simpler pieces
    let pieces = ['r', 'b', 'n'] // Start with rook, bishop, knight
    if (level > 2) pieces.push('q') // Add queen at level 3
    if (level > 4) pieces.push('p') // Add pawn at level 5
    
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)]
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, cols)
    const ranks = ['1', '2', '3', '4'].slice(0, rows)
    
    // Place the player's piece in center for 3x3, or randomly for larger boards
    let piecePosition
    if (cols === 3 && rows === 3) {
      piecePosition = 'b2' // Center of 3x3 board
    } else if (cols === 4 && rows === 4) {
      // Place near center for 4x4
      const centerPositions = ['b2', 'b3', 'c2', 'c3']
      piecePosition = centerPositions[Math.floor(Math.random() * centerPositions.length)]
    } else {
      // For 4x8, place in middle area
      const file = files[Math.floor(cols/2) + Math.floor(Math.random() * 3) - 1]
      const rank = ranks[Math.floor(rows/2) + Math.floor(Math.random() * 2) - 1]
      piecePosition = `${file}${rank}`
    }
    
    // Get all squares the piece can attack from its position
    const attackableSquares = getAttackSquares(pieceType, piecePosition, boardDimensions)
    
    // Place enemy pieces - some capturable, some not
    const enemyPieces = []
    const allSquares = []
    
    for (const file of files) {
      for (const rank of ranks) {
        const square = `${file}${rank}`
        if (square !== piecePosition) {
          allSquares.push(square)
        }
      }
    }
    
    // Shuffle squares
    allSquares.sort(() => Math.random() - 0.5)
    
    // Determine number of enemy pieces based on level
    let numEnemies = Math.min(3 + Math.floor(level / 2), allSquares.length)
    if (cols === 3 && rows === 3) {
      numEnemies = Math.min(3, allSquares.length)
    }
    
    // Place enemy pieces
    const validTargets = []
    const placedEnemies = []
    
    // Ensure at least one capturable piece
    const capturableSquares = attackableSquares.filter(sq => allSquares.includes(sq))
    if (capturableSquares.length > 0) {
      const targetSquare = capturableSquares[Math.floor(Math.random() * capturableSquares.length)]
      validTargets.push(targetSquare)
      placedEnemies.push(targetSquare)
      enemyPieces.push({ square: targetSquare, capturable: true })
    }
    
    // Add more enemy pieces
    for (let i = placedEnemies.length; i < numEnemies && i < allSquares.length; i++) {
      const square = allSquares[i]
      if (!placedEnemies.includes(square)) {
        const isCapturable = attackableSquares.includes(square)
        enemyPieces.push({ square, capturable: isCapturable })
        if (isCapturable) {
          validTargets.push(square)
        }
        placedEnemies.push(square)
      }
    }
    
    // Pick one capturable piece as the solution
    const solution = validTargets.length > 0 ? validTargets[Math.floor(Math.random() * validTargets.length)] : null
    
    return {
      piece: { type: pieceType, color: 'w' },
      piecePosition: piecePosition,
      enemyPieces: enemyPieces,
      validSquares: validTargets, // All squares with capturable enemies
      solution: solution,
      allValidMoves: validTargets, // Same as validSquares for capture puzzles
      boardDimensions: boardDimensions,
      puzzleType: 'capture'
    }
  }
  
  // Get squares a piece can attack
  const getAttackSquares = (pieceType, fromSquare, boardDimensions) => {
    const { cols, rows } = boardDimensions
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, cols)
    const ranks = ['1', '2', '3', '4'].slice(0, rows)
    const attacks = []
    
    const fileIndex = files.indexOf(fromSquare[0])
    const rankIndex = ranks.indexOf(fromSquare[1])
    
    switch(pieceType) {
      case 'p': // Pawn - diagonal captures only
        if (rankIndex < ranks.length - 1) {
          if (fileIndex > 0) {
            attacks.push(`${files[fileIndex - 1]}${ranks[rankIndex + 1]}`)
          }
          if (fileIndex < files.length - 1) {
            attacks.push(`${files[fileIndex + 1]}${ranks[rankIndex + 1]}`)
          }
        }
        break
        
      case 'r': // Rook - horizontal and vertical
        // Horizontal
        for (let i = 0; i < files.length; i++) {
          if (i !== fileIndex) {
            attacks.push(`${files[i]}${fromSquare[1]}`)
          }
        }
        // Vertical
        for (let i = 0; i < ranks.length; i++) {
          if (i !== rankIndex) {
            attacks.push(`${fromSquare[0]}${ranks[i]}`)
          }
        }
        break
        
      case 'b': // Bishop - diagonals
        for (let i = 1; i < Math.max(files.length, ranks.length); i++) {
          // Up-right
          if (fileIndex + i < files.length && rankIndex + i < ranks.length) {
            attacks.push(`${files[fileIndex + i]}${ranks[rankIndex + i]}`)
          }
          // Up-left
          if (fileIndex - i >= 0 && rankIndex + i < ranks.length) {
            attacks.push(`${files[fileIndex - i]}${ranks[rankIndex + i]}`)
          }
          // Down-right
          if (fileIndex + i < files.length && rankIndex - i >= 0) {
            attacks.push(`${files[fileIndex + i]}${ranks[rankIndex - i]}`)
          }
          // Down-left
          if (fileIndex - i >= 0 && rankIndex - i >= 0) {
            attacks.push(`${files[fileIndex - i]}${ranks[rankIndex - i]}`)
          }
        }
        break
        
      case 'n': // Knight - L shape
        const knightMoves = [
          [2, 1], [2, -1], [-2, 1], [-2, -1],
          [1, 2], [1, -2], [-1, 2], [-1, -2]
        ]
        for (const [df, dr] of knightMoves) {
          const newFile = fileIndex + df
          const newRank = rankIndex + dr
          if (newFile >= 0 && newFile < files.length && newRank >= 0 && newRank < ranks.length) {
            attacks.push(`${files[newFile]}${ranks[newRank]}`)
          }
        }
        break
        
      case 'q': // Queen - combination of rook and bishop
        // Horizontal
        for (let i = 0; i < files.length; i++) {
          if (i !== fileIndex) {
            attacks.push(`${files[i]}${fromSquare[1]}`)
          }
        }
        // Vertical
        for (let i = 0; i < ranks.length; i++) {
          if (i !== rankIndex) {
            attacks.push(`${fromSquare[0]}${ranks[i]}`)
          }
        }
        // Diagonals
        for (let i = 1; i < Math.max(files.length, ranks.length); i++) {
          if (fileIndex + i < files.length && rankIndex + i < ranks.length) {
            attacks.push(`${files[fileIndex + i]}${ranks[rankIndex + i]}`)
          }
          if (fileIndex - i >= 0 && rankIndex + i < ranks.length) {
            attacks.push(`${files[fileIndex - i]}${ranks[rankIndex + i]}`)
          }
          if (fileIndex + i < files.length && rankIndex - i >= 0) {
            attacks.push(`${files[fileIndex + i]}${ranks[rankIndex - i]}`)
          }
          if (fileIndex - i >= 0 && rankIndex - i >= 0) {
            attacks.push(`${files[fileIndex - i]}${ranks[rankIndex - i]}`)
          }
        }
        break
    }
    
    return attacks
  }
  
  return {
    generatePuzzle,
    getAttackSquares,
    getBoardDimensions
  }
}