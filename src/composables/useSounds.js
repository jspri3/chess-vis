import { ref } from 'vue'

export function useSounds() {
  const audioContext = ref(null)
  const isMuted = ref(false)
  
  const initAudio = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }
  
  const playTone = (frequency, duration, type = 'sine') => {
    if (isMuted.value) return
    
    initAudio()
    const ctx = audioContext.value
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }
  
  const playSuccess = () => {
    playTone(523, 0.1)
    setTimeout(() => playTone(659, 0.1), 100)
    setTimeout(() => playTone(784, 0.2), 200)
  }
  
  const playError = () => {
    playTone(200, 0.3, 'sawtooth')
  }
  
  const playPickup = () => {
    playTone(400, 0.05)
  }
  
  const playDrop = () => {
    playTone(300, 0.05)
  }
  
  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }
  
  return {
    playSuccess,
    playError,
    playPickup,
    playDrop,
    toggleMute,
    isMuted
  }
}