import { prisma } from '@/db'
import { SlideshowsQueryService } from '@/services/slideshows/view/query-service'

// Services
const slideshowsQueryService = new SlideshowsQueryService()

// Code
export async function getSlideshowById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getSlideshowById()`

  // Get instruments
  const results = await
          slideshowsQueryService.getById(
            prisma,
            args.userProfileId,
            args.slideshowId,
            true)  // includeSlides

  // Return
  return results
}

export async function getSlideshows(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getSlideshows()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instruments
  const results = await
          slideshowsQueryService.getLatest(
            prisma,
            args.userProfileId ?? undefined,
            args.analysisId ?? undefined)

  // Return
  return results
}
