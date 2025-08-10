import { Chess } from 'chess.js'
import problemsData from '../assets/problems.json'

export function usePuzzles() {
  
  // Get board dimensions based on level
  const getBoardDimensions = (level) => {
    if (level <= 3) return { cols: 3, rows: 3 } // 3x3 for levels 1-3
    if (level <= 6) return { cols: 4, rows: 4 } // 4x4 for levels 4-6
    return { cols: 8, rows: 4 } // 4x8 for levels 7+
  }
  
  // Generate capture puzzle - place enemy pieces and find which ones can be captured
  const generatePuzzle = (level, mode = 'capture') => {
    // Route to appropriate puzzle generator
    if (mode === 'checkmate') {
      return generateCheckmatePuzzle(level)
    }
    return generateCapturePuzzle(level)
  }
  
  // Generate capture puzzle - place enemy pieces and find which ones can be captured
  const generateCapturePuzzle = (level) => {
    const boardDimensions = getBoardDimensions(level)
    const { cols, rows } = boardDimensions
    
    // For 3x3 board, use simpler pieces
    let pieces = ['r', 'b', 'n', 'p'] // Include knight for 3x3 boards too
    if (level > 3) pieces.push('q') // Add queen at level 4
    // if (level > 5) pieces.push('p') // Add pawn at level 6
    
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)]
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, cols)
    const ranks = ['1', '2', '3', '4'].slice(0, rows)
    
    // Place the player's piece appropriately
    let piecePosition
    if (cols === 3 && rows === 3) {
      // For 3x3, place pieces strategically
      if (pieceType === 'r') {
        // Rook works well on edges
        const positions = ['a2', 'b1', 'b3', 'c2']
        piecePosition = positions[Math.floor(Math.random() * positions.length)]
      } else if (pieceType === 'n') {
        // Knight can be placed anywhere except center (b2)
        const positions = ['a1', 'a2', 'a3', 'b1', 'b3', 'c1', 'c2', 'c3']
        piecePosition = positions[Math.floor(Math.random() * positions.length)]
      } else {
        // Bishop works from center
        piecePosition = 'b2'
      }
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
    let numEnemies = Math.min(2 + Math.floor(level / 2), allSquares.length)
    if (cols === 3 && rows === 3) {
      numEnemies = Math.min(2, allSquares.length) // Start with just 2 enemies for 3x3
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
  
  // Generate checkmate-in-one puzzle
  const generateCheckmatePuzzle = (level) => {
    // For levels 5 and above, use FEN-based puzzles
    if (level >= 5) {
      return generateFENCheckmatePuzzle(level)
    }
    // For lower levels, use the simple generated puzzles
    const boardDimensions = getBoardDimensions(level)
    const { cols, rows } = boardDimensions
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, cols)
    const ranks = ['1', '2', '3', '4'].slice(0, rows)
    
    // Start simple - just place king and one attacking piece
    let pieces = ['r', 'q'] // Start with rook and queen for simple checkmates
    if (level > 2) pieces.push('b', 'n') // Add bishop and knight for variety
    
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)]
    
    // Place the enemy king in a corner or edge (easier to checkmate)
    let kingPosition
    if (cols === 3 && rows === 3) {
      // Corner positions for 3x3
      const corners = ['a1', 'a3', 'c1', 'c3']
      kingPosition = corners[Math.floor(Math.random() * corners.length)]
    } else {
      // Edge/corner positions for larger boards
      const edgePositions = []
      // Add corners
      edgePositions.push(`${files[0]}${ranks[0]}`)
      edgePositions.push(`${files[0]}${ranks[ranks.length-1]}`)
      edgePositions.push(`${files[files.length-1]}${ranks[0]}`)
      edgePositions.push(`${files[files.length-1]}${ranks[ranks.length-1]}`)
      // Add some edge positions
      if (cols > 3) {
        edgePositions.push(`${files[Math.floor(cols/2)]}${ranks[0]}`)
        edgePositions.push(`${files[Math.floor(cols/2)]}${ranks[ranks.length-1]}`)
      }
      kingPosition = edgePositions[Math.floor(Math.random() * edgePositions.length)]
    }
    
    // Find good position for attacking piece to deliver checkmate
    let piecePosition = null
    let checkmateSquare = null
    const allSquares = []
    
    for (const file of files) {
      for (const rank of ranks) {
        const square = `${file}${rank}`
        if (square !== kingPosition) {
          allSquares.push(square)
        }
      }
    }
    
    // Try to find a position that can deliver checkmate
    for (const square of allSquares) {
      const attacks = getAttackSquares(pieceType, square, boardDimensions)
      if (attacks.includes(kingPosition)) {
        // Check if this would be checkmate (king can't escape)
        // For simplicity, place piece where it attacks the king
        // and the king has limited escape squares
        piecePosition = square
        checkmateSquare = kingPosition
        break
      }
    }
    
    // If no direct checkmate found, place piece to attack near king
    if (!piecePosition) {
      // Place piece at a strategic distance
      if (pieceType === 'r') {
        // Rook - same file or rank as king
        const kingFile = files.indexOf(kingPosition[0])
        const kingRank = ranks.indexOf(kingPosition[1])
        if (Math.random() < 0.5) {
          // Same file, different rank
          const newRank = kingRank === 0 ? ranks.length - 1 : 0
          piecePosition = `${files[kingFile]}${ranks[newRank]}`
        } else {
          // Same rank, different file
          const newFile = kingFile === 0 ? files.length - 1 : 0
          piecePosition = `${files[newFile]}${ranks[kingRank]}`
        }
      } else if (pieceType === 'q') {
        // Queen - diagonal or straight from king
        const centerFile = Math.floor(cols/2)
        const centerRank = Math.floor(rows/2)
        piecePosition = `${files[centerFile]}${ranks[centerRank]}`
      } else {
        // Bishop or Knight - place near center
        const centerFile = Math.floor(cols/2)
        const centerRank = Math.floor(rows/2)
        piecePosition = `${files[centerFile]}${ranks[centerRank]}`
      }
      checkmateSquare = kingPosition
    }
    
    // Add supporting pieces for higher levels
    const enemyPieces = []
    if (level > 3 && cols > 3) {
      // Add a few blocking pieces to make it more interesting
      const numBlockers = Math.min(level - 3, 2)
      const placedSquares = [kingPosition, piecePosition]
      
      for (let i = 0; i < numBlockers && placedSquares.length < allSquares.length; i++) {
        const availableSquares = allSquares.filter(sq => !placedSquares.includes(sq))
        if (availableSquares.length > 0) {
          const blockerSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)]
          enemyPieces.push({ square: blockerSquare, capturable: false, isBlocker: true })
          placedSquares.push(blockerSquare)
        }
      }
    }
    
    // The king is always shown as enemy piece
    enemyPieces.push({ square: kingPosition, capturable: true, isKing: true })
    
    // All squares that attack the king are valid moves
    const validMoves = getAttackSquares(pieceType, piecePosition, boardDimensions)
    const validSquares = validMoves.filter(sq => sq === kingPosition)
    
    return {
      piece: { type: pieceType, color: 'w' },
      piecePosition: piecePosition,
      enemyPieces: enemyPieces,
      validSquares: validSquares,
      solution: checkmateSquare,
      allValidMoves: validMoves,
      boardDimensions: boardDimensions,
      puzzleType: 'checkmate',
      kingPosition: kingPosition
    }
  }
  
  // Generate FEN-based checkmate puzzle
  const generateFENCheckmatePuzzle = (level) => {
    // Select a random puzzle from the problems database
    const puzzles = problemsData.problems
    const puzzleIndex = Math.floor(Math.random() * Math.min(puzzles.length, 1000)) // Use first 1000 puzzles for now
    const puzzle = puzzles[puzzleIndex]
    
    // Parse the FEN string
    const chess = new Chess(puzzle.fen)
    const board = chess.board()
    
    // Parse the solution move (e.g., "f6-g7" -> from: f6, to: g7)
    const [from, to] = puzzle.moves.split('-')
    
    // Find the piece that needs to move
    const fromSquareData = chess.get(from)
    if (!fromSquareData) {
      // Fallback to simple puzzle if parsing fails
      return generateCheckmatePuzzle(4)
    }
    
    // Get all pieces on the board
    const enemyPieces = []
    const playerPieces = []
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const file = String.fromCharCode(97 + col) // a-h
          const rank = String(8 - row) // 8-1
          const square = file + rank
          
          if (piece.color === 'w') {
            if (square === from) {
              // This is our moving piece
              playerPieces.push({ square, piece })
            } else {
              // Other white pieces are helpers
              enemyPieces.push({ 
                square, 
                capturable: false, 
                isHelper: true,
                piece: piece
              })
            }
          } else {
            // Black pieces
            if (piece.type === 'k') {
              // Black king
              enemyPieces.push({ 
                square, 
                capturable: true, 
                isKing: true,
                piece: piece
              })
            } else {
              // Other black pieces
              enemyPieces.push({ 
                square, 
                capturable: false,
                piece: piece
              })
            }
          }
        }
      }
    }
    
    // Get all legal moves for the piece
    const legalMoves = chess.moves({ square: from, verbose: true })
    const allValidMoves = legalMoves.map(m => m.to)
    
    return {
      piece: { type: fromSquareData.type, color: fromSquareData.color },
      piecePosition: from,
      enemyPieces: enemyPieces,
      validSquares: [to], // Only the checkmate square is valid
      solution: to,
      allValidMoves: allValidMoves,
      boardDimensions: { cols: 8, rows: 8 },
      puzzleType: 'checkmate',
      fenPosition: puzzle.fen,
      puzzleId: puzzle.problemid
    }
  }
  
  return {
    generatePuzzle,
    getAttackSquares,
    getBoardDimensions
  }
}