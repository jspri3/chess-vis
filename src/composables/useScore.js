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
    localStorage.setItem('chessScore', JSON.stringify({
      score: score.value,
      streak: streak.value,
      highScore: highScore.value
    }))
  }
  
  const loadScore = () => {
    const saved = localStorage.getItem('chessScore')
    if (saved) {
      const data = JSON.parse(saved)
      score.value = data.score || 0
      streak.value = data.streak || 0
      highScore.value = data.highScore || 0
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