import { ElevenLabsService } from '@/services/elevenlabs/service'

// Services
const elevenLabsService = new ElevenLabsService()

// Code
export async function createElevenLabsToken(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `createElevenLabsToken()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          elevenLabsService.generateToken(
            args.userProfileId)

  // Return
  return results
}
