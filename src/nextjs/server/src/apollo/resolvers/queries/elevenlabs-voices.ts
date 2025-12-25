import { prisma } from '@/db'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()

// Code
export async function getElevenLabsVoices(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getElevenLabsVoices()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const elevenLabsVoices = await
          elevenLabsVoiceModel.filter(
            prisma,
            undefined,  // voiceId
            args.status)

  // Return
  return {
    status: true,
    elevenLabsVoices: elevenLabsVoices
  }
}
