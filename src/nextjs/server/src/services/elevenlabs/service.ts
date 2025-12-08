import { writeFileSync } from 'fs'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

// Clients
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})

// Class
export class ElevenLabsService {

  // Consts
  clName = 'ElevenLabsService'

  // Code
  async generateTTS(
          voiceId: string = 'Rachel',
          text: string) {

    const stream = await client.textToSpeech.convert(
      voiceId,
      {
        text: text,
        modelId: 'eleven_turbo_v2',
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
        },
      })

    // Convert ReadableStream to Buffer
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))

    writeFileSync('output.mp3', buffer)
    console.log('Saved output.mp3')
  }
}
