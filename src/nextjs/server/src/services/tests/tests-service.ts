import { PrismaClient, UserProfile } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { Slideshow1DataService } from './slideshows/slideshow-1-data-service'
import { CreateTestAudioService } from './test-audio-service'
import { CreateTestImageService } from './test-image-service'

// Services
const slideshow1DataService = new Slideshow1DataService()
const consoleService = new ConsoleService()
const createTestAudioService = new CreateTestAudioService()
const createTestImageService = new CreateTestImageService()

// Class
export class TestsService {

  // Consts
  clName = 'TestsService'

  // Code
  async tests(prisma: PrismaClient,
              regularTestUserProfile: UserProfile,
              adminUserProfile: UserProfile) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Display test options
    console.log(`Select a test to run:`)
    console.log(`1. Get voices for audio`)
    console.log(`2. Create a test audio (text-to-speech)`)
    console.log(`3. Create a test image`)
    console.log(`4. Analysis to slides test data setup`)

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

      case '4': {
        return await slideshow1DataService.run(
                       prisma,
                       adminUserProfile.id)
      }

      default: {
        throw new CustomError(`${fnName}: invalid test option: ${selectedTest}`)
      }
    }
  }
}
