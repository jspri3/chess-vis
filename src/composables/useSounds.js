import { ref } from 'vue'

export function useSounds() {
  const audioContext = ref(null)
  const isMuted = ref(false)
  const isInitialized = ref(false)
  
  const initAudio = async () => {
    if (!audioContext.value) {
      try {
        audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
        
        // Resume context if it's in suspended state (common on mobile)
        if (audioContext.value.state === 'suspended') {
          await audioContext.value.resume()
        }
        
        isInitialized.value = true
        
        // Play a silent sound to fully initialize on mobile
        const oscillator = audioContext.value.createOscillator()
        const gainNode = audioContext.value.createGain()
        gainNode.gain.value = 0
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.value.destination)
        oscillator.start()
        oscillator.stop(audioContext.value.currentTime + 0.001)
      } catch (error) {
        console.warn('Audio initialization failed:', error)
      }
    } else if (audioContext.value.state === 'suspended') {
      // Try to resume if context exists but is suspended
      try {
        await audioContext.value.resume()
      } catch (error) {
        console.warn('Audio resume failed:', error)
      }
    }
  }
  
  const playTone = async (frequency, duration, type = 'sine') => {
    if (isMuted.value) return
    
    await initAudio()
    const ctx = audioContext.value
    if (!ctx) return
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
  
  const playSuccess = async () => {
    await playTone(523, 0.1)
    setTimeout(() => playTone(659, 0.1), 100)
    setTimeout(() => playTone(784, 0.2), 200)
  }
  
  const playError = async () => {
    await playTone(200, 0.3, 'sawtooth')
  }
  
  const playPickup = async () => {
    await playTone(400, 0.05)
  }
  
  const playDrop = async () => {
    await playTone(300, 0.05)
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
    isMuted,
    initAudio,
    isInitialized
  }
}