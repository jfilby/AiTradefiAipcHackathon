import { PrismaClient, UserProfile } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { CreateTestAudioService } from './test-audio-service'
import { CreateTestImageService } from './test-image-service'

// Services
const consoleService = new ConsoleService()
const createTestAudioService = new CreateTestAudioService()
const createTestImageService = new CreateTestImageService()

// Class
export class TestsService {

  // Consts
  clName = 'TestsService'

  // Code
  async tests(prisma: PrismaClient,
              userProfile: UserProfile) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Display test options
    console.log(`Select a test to run:`)
    console.log(`1. Get voices for audio`)
    console.log(`2. Create a test audio (text-to-speech)`)
    console.log(`3. Create a test image`)

    // Prompt for test to run
    const selectedTest = await
            consoleService.askQuestion('> ')

    // Run selected test
    switch (selectedTest) {

      case '1': {
        return await createTestAudioService.getVoices()
      }

      case '2': {
        return await createTestAudioService.testTTS(prisma)
      }

      case '3': {
        return await createTestImageService.test()
      }

      default: {
        throw new CustomError(`${fnName}: invalid test option: ${selectedTest}`)
      }
    }
  }
}
