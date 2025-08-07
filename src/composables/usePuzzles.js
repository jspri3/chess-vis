import { Chess } from 'chess.js'

export function usePuzzles() {
  
  const puzzleTemplates = {
    1: [
      {
        fen: '7k/8/8/8/8/8/Q7/7K w - - 0 1',
        piece: { type: 'q', color: 'w' },
        solution: 'a7',
        kingPosition: 'h8'
      },
      {
        fen: '3k4/8/8/8/8/8/R7/7K w - - 0 1',
        piece: { type: 'r', color: 'w' },
        solution: 'd2',
        kingPosition: 'd4'
      },
      {
        fen: 'k7/8/8/8/8/8/Q7/7K w - - 0 1',
        piece: { type: 'q', color: 'w' },
        solution: 'a7',
        kingPosition: 'a8'
      }
    ],
    2: [
      {
        fen: '4k3/8/8/8/8/8/4R3/7K w - - 0 1',
        piece: { type: 'r', color: 'w' },
        solution: 'e2',
        kingPosition: 'e4'
      },
      {
        fen: '7k/8/8/8/8/8/6B1/7K w - - 0 1',
        piece: { type: 'b', color: 'w' },
        solution: 'e4',
        kingPosition: 'h8'
      }
    ],
    3: [
      {
        fen: '4k3/8/8/8/8/8/2N5/7K w - - 0 1',
        piece: { type: 'n', color: 'w' },
        solution: 'd4',
        kingPosition: 'e4'
      },
      {
        fen: '7k/8/8/8/8/8/5B2/7K w - - 0 1',
        piece: { type: 'b', color: 'w' },
        solution: 'd4',
        kingPosition: 'h8'
      }
    ]
  }
  
  const generatePuzzle = (level) => {
    const templates = puzzleTemplates[level] || puzzleTemplates[1]
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    const chess = new Chess()
    
    const validSquares = []
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = [1, 2, 3, 4]
    
    const numSquares = level === 1 ? 6 : level === 2 ? 7 : 8
    
    const allSquares = []
    for (const file of files) {
      for (const rank of ranks) {
        const square = `${file}${rank}`
        if (square !== template.kingPosition) {
          allSquares.push(square)
        }
      }
    }
    
    if (!allSquares.includes(template.solution)) {
      allSquares.push(template.solution)
    }
    
    const shuffled = allSquares.sort(() => Math.random() - 0.5)
    
    if (!shuffled.includes(template.solution)) {
      shuffled[0] = template.solution
    }
    
    for (let i = 0; i < Math.min(numSquares, shuffled.length); i++) {
      validSquares.push(shuffled[i])
    }
    
    return {
      piece: template.piece,
      validSquares,
      solution: template.solution,
      kingPosition: template.kingPosition,
      fen: template.fen
    }
  }
  
  const getPuzzle = (level, index) => {
    const templates = puzzleTemplates[level] || puzzleTemplates[1]
    if (index >= 0 && index < templates.length) {
      return templates[index]
    }
    return templates[0]
  }
  
  return {
    generatePuzzle,
    getPuzzle
  }
}