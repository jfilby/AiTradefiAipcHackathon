import { PrismaClient, UserProfile } from '@prisma/client'
import { FinnHubApiServiceTests } from '../external-data/finnhub/api-service-tests'

// Services
const finnHubApiServiceTests = new FinnHubApiServiceTests()

// Class
export class TestsService {

  // Consts
  clName = 'TestsService'

  // Code
  async tests(prisma: PrismaClient,
              userProfile: UserProfile) {

    // FinnHub
    await finnHubApiServiceTests.tests(prisma)
  }
}
