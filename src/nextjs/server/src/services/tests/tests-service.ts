import { PrismaClient, UserProfile } from '@prisma/client'
import { FinnHubApiServiceTests } from '../external-data/finnhub/api-service-tests'
import { DocInsightsServiceTests } from '../analysis/documents/insights-service-test'

// Services
const finnHubApiServiceTests = new FinnHubApiServiceTests()
const docInsightsServiceTests = new DocInsightsServiceTests()

// Class
export class TestsService {

  // Consts
  clName = 'TestsService'

  // Code
  async tests(prisma: PrismaClient,
              userProfile: UserProfile) {

    // FinnHub
    await finnHubApiServiceTests.tests(prisma)

    // News insights
    await docInsightsServiceTests.test(
            prisma,
            userProfile.id
    )
  }
}
