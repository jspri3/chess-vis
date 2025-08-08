import { ref } from 'vue'

export function useScore() {
  const score = ref(0)
  const streak = ref(0)
  const highScore = ref(0)
  
  const incrementScore = () => {
    score.value += 10
    streak.value += 1
    if (score.value > highScore.value) {
      highScore.value = score.value
    }
  }
  
  const resetStreak = () => {
    streak.value = 0
  }
  
  const resetScore = () => {
    score.value = 0
    streak.value = 0
  }
  
  const saveScore = () => {
    localStorage.setItem('chessScore', score.value.toString())
    localStorage.setItem('chessStreak', streak.value.toString())
    localStorage.setItem('chessHighScore', highScore.value.toString())
  }
  
  const loadScore = () => {
    const savedScore = localStorage.getItem('chessScore')
    const savedStreak = localStorage.getItem('chessStreak')
    const savedHighScore = localStorage.getItem('chessHighScore')
    
    // First check if we have the new format (separate keys)
    if (savedScore !== null && !savedScore.startsWith('{')) {
      // New format - direct numbers
      score.value = parseInt(savedScore) || 0
      streak.value = parseInt(savedStreak) || 0
      highScore.value = parseInt(savedHighScore) || 0
    } else if (savedScore) {
      try {
        // Old JSON format - parse and migrate
        const data = JSON.parse(savedScore)
        score.value = data.score || 0
        streak.value = data.streak || 0
        highScore.value = data.highScore || 0
        // Migrate to new format only once
        localStorage.setItem('chessScore', score.value.toString())
        localStorage.setItem('chessStreak', streak.value.toString())
        localStorage.setItem('chessHighScore', highScore.value.toString())
      } catch (e) {
        // If parsing fails, initialize to 0
        score.value = 0
        streak.value = 0
        highScore.value = 0
      }
    }
  }
  
  return {
    score,
    streak,
    highScore,
    incrementScore,
    resetStreak,
    resetScore,
    saveScore,
    loadScore
  }
}