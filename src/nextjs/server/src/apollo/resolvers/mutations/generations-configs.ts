import { prisma } from '@/db'
import { GenerationsConfigMutateService } from '@/services/generations-configs/mutation-service'

// Services
const generationsConfigMutateService = new GenerationsConfigMutateService()

// Code
export async function upsertGenerationsConfig(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `upsertGenerationsConfig()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          generationsConfigMutateService.upsert(
            prisma,
            args.id,
            args.userProfileId,
            args.status,
            args.name,
            args.elevenLabsVoiceId)

  // Return
  return results
}
