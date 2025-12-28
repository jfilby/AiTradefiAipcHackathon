export class ElevenLabsClientService {

  fadeOutAndStop(
    audio: any,
    duration = 200): Promise<void> {

    return new Promise(resolve => {

      if (!audio) return resolve()

      const startVolume = audio.volume
      const steps = duration / 20
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        audio.volume = Math.max(
          0,
          startVolume * (1 - currentStep / steps)
        )

        if (currentStep >= steps) {
          clearInterval(interval)
          audio.pause()
          audio.currentTime = 0
          audio.volume = startVolume
          resolve()
        }
      }, 20)
    })
  }
}
