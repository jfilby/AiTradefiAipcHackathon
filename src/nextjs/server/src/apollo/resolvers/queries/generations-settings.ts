import { prisma } from '@/db'
import { GenerationsSettingsQueryService } from '@/services/generations-settings/query-service'

// Services
const generationsSettingsQueryService = new GenerationsSettingsQueryService()

// Code
export async function getGenerationsSettingsList(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getGenerationsSettingsList()`

  // Get instruments
  const results = await
          generationsSettingsQueryService.getList(
            prisma,
            args.userProfileId,
            args.status)

  // Return
  return results
}
