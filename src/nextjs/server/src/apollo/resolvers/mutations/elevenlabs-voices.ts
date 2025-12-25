import { prisma } from '@/db'
import { ElevenLabsVoiceService } from '@/services/elevenlabs/voice-service'

// Services
const elevenLabsVoiceService = new ElevenLabsVoiceService()

// Code
export async function getVoicePreviewAudio(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getVoicePreviewAudio()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          elevenLabsVoiceService.generateVoicePreviewAudio(
            prisma,
            args.elevenLabsVoiceId)

  // Return
  return results
}
