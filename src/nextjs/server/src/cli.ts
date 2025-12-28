// Load the env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })

// Requires/imports
import { prisma } from './db'
import { TechProviderMutateService } from '@/serene-core-server/services/tech/tech-provider-mutate-service'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ServerTestTypes } from './types/server-test-types'
import { ElevenLabsApiKeyService } from './services/elevenlabs/api-key-service'
import { FinnHubApiServiceTests } from './services/external-data/finnhub/api-service-tests'
import { SetupAnalysesService } from './services/analysis/setup-service'
import { SetupService } from './services/setup/setup'
import { SlideshowShowcaseService } from './services/slideshows/setup/showcase-service'
import { TestsService } from './services/tests/tests-service'

// Main
(async () => {

  // Debug
  const fnName = 'cli.ts'

  // Consts
  const elevenLabsCheckCommand = 'elevenlabs-check'
  const loadAnalysesCommand = 'load-analyses'
  const loadSlideshowToShowcaseCommand = 'load-slideshow-to-showcase'
  const loadTechProviderApiKeysCommand = 'load-tech-provider-api-keys'
  const setupCommand = 'setup'
  const testsCommand = 'tests'

  const commands = [
          elevenLabsCheckCommand,
          loadAnalysesCommand,
          loadSlideshowToShowcaseCommand,
          loadTechProviderApiKeysCommand,
          setupCommand,
          testsCommand
        ]

  // Test to run
  const command = process.argv[2]

  console.log(`${fnName}: comand to run: ${command}`)

  // Services
  const elevenLabsApiKeyService = new ElevenLabsApiKeyService()
  const setupAnalysesService = new SetupAnalysesService()
  const setupService = new SetupService()
  const finnHubApiServiceTests = new FinnHubApiServiceTests()
  const slideshowShowcaseService = new SlideshowShowcaseService()
  const techProviderMutateService = new TechProviderMutateService()
  const testsService = new TestsService()
  const usersService = new UsersService()

  // Get/create an admin user
  const adminUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.adminUserEmail,
            undefined)  // defaultUserPreferences

  // Get/create a regular (non-admin) user
  const regularTestUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.regularTestUserEmail,
            undefined)  // defaultUserPreferences

  // Run the chosen command
  switch (command) {

    case elevenLabsCheckCommand: {

      await elevenLabsApiKeyService.check()

      break
    }

    case loadAnalysesCommand: {

      await setupAnalysesService.setup(
              prisma,
              adminUserProfile.id)

      break
    }

    case loadSlideshowToShowcaseCommand: {

      await slideshowShowcaseService.setup(prisma)

      break
    }

    case loadTechProviderApiKeysCommand: {

      await techProviderMutateService.cliLoadJsonStr(prisma)

      break
    }

    case setupCommand: {

      await setupService.setup(
              prisma,
              adminUserProfile)

      break
    }

    case testsCommand: {

      await testsService.tests(
              prisma,
              regularTestUserProfile,
              adminUserProfile)

      break
    }

    default: {

      console.log(`${fnName}: invalid command, selection is: ` +
                  JSON.stringify(commands))

      await prisma.$disconnect()
      process.exit(1)
    }
  }

  // Done
  await prisma.$disconnect()
  process.exit(0)
})()
