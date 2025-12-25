import { prisma } from '@/db'
import { GenerationsConfigQueryService } from '@/services/generations-configs/query-service'

// Services
const generationsConfigQueryService = new GenerationsConfigQueryService()

// Code
export async function getGenerationsConfig(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getGenerationsConfig()`

  // Get instruments
  const results = await
          generationsConfigQueryService.getById(
            prisma,
            args.userProfileId,
            args.id)

  // Return
  return results
}

export async function getGenerationsConfigs(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getGenerationsConfigs()`

  // Get instruments
  const results = await
          generationsConfigQueryService.getByFilter(
            prisma,
            args.userProfileId,
            args.status)

  // Return
  return results
}

export async function getGenerationsConfigList(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getGenerationsConfigList()`

  // Get instruments
  const results = await
          generationsConfigQueryService.getList(
            prisma,
            args.userProfileId,
            args.status)

  // Return
  return results
}
