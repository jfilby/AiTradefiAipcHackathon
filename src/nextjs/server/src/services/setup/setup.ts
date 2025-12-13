const fs = require('fs').promises
const path = require('path')
import { PrismaClient, UserProfile } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { AgentUserModel } from '@/serene-ai-server/models/agents/agent-user-model'
import { SereneAiSetup } from '@/serene-ai-server/services/setup/setup-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { DocSourceModel } from '@/models/documents/doc-source-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { WindowTypeModel } from '@/models/instruments/window-type-model'
import { AgentUserService } from '@/services/agents/agent-user-service'
import { ElevenLabsService } from '../elevenlabs/service'
import { GenerationsSettingsSetupService } from '../generations-settings/setup-service'
import { SetupAnalysesTechService } from '../analysis/setup-tech-service'
import { YFinanceUtilsService } from '../external-data/yfinance/utils-service'

// Models
const agentUserModel = new AgentUserModel()
const chatSettingsModel = new ChatSettingsModel()
const exchangeModel = new ExchangeModel()
const docSourceModel = new DocSourceModel()
const instrumentModel = new InstrumentModel()
const windowTypeModel = new WindowTypeModel()

// Services
const agentUserService = new AgentUserService()
const elevenLabsService = new ElevenLabsService()
const generationsSettingsSetupService = new GenerationsSettingsSetupService()
const sereneAiSetup = new SereneAiSetup()
const setupAnalysesTechService = new SetupAnalysesTechService()
const yFinanceUtilsService = new YFinanceUtilsService()

// Class
export class SetupService {

  // Consts
  clName = 'SetupService'

  // Services
  async chatSettingsSetup(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.chatSettingsSetup()`

    // Debug
    console.log(`${fnName}: upserting ChatSettings record with ` +
                `userProfileId: ${userProfileId}`)

    // Upsert AgentUser records
    await agentUserService.setup(prisma)

    // Upsert ChatSetting records
    for (const chatSetting of ServerOnlyTypes.chatSettings) {

      // Get the tech and agent for the chat settings
      const agentUser = await
              agentUserModel.getByUniqueRefId(
                prisma,
                chatSetting.agentUniqueRef)

      // Validate
      if (agentUser == null) {
        throw new CustomError(`${fnName}: agentUser == null`)
      }

      // Upsert ChatSettings
      await chatSettingsModel.upsert(
              prisma,
              undefined,  // id
              null,       // baseChatSettingsId
              BaseDataTypes.activeStatus,
              true,       // isEncryptedAtRest
              chatSetting.isJsonMode,
              true,       // isPinned
              chatSetting.name,
              agentUser.id,
              null,       // prompt
              null,       // appCustom
              userProfileId)
    }
  }

  async setup(prisma: PrismaClient,
              adminUserProfile: UserProfile) {

    // Chat settings setup
    await this.chatSettingsSetup(
            prisma,
            adminUserProfile.id)

    // Serene AI setup
    await sereneAiSetup.setup(
            prisma,
            adminUserProfile.id)

    // Setup base data
    await this.setupBaseData(
            prisma,
            adminUserProfile)

    // Setup analysis tech
    await setupAnalysesTechService.setup(
            prisma,
            adminUserProfile.id)

    // Setup generations settings
    await generationsSettingsSetupService.setup(
            prisma,
            adminUserProfile.id)

    // Setup ElevenLabs
    await elevenLabsService.setup(prisma)
  }

  async setupBaseData(
          prisma: PrismaClient,
          adminUserProfile: UserProfile) {

    // Create data paths
    await fs.mkdir(
            `${process.env.BASE_DATA_PATH}/audio/nvda-test`,
            { recursive: true })

    await fs.mkdir(
            `${process.env.BASE_DATA_PATH}/images/nvda-test`,
            { recursive: true })

    // Exchange upserts
    for (const exchangeName of ServerOnlyTypes.exchangeNames) {

      const exchange = await
              exchangeModel.upsert(
                prisma,
                undefined,  // id
                exchangeName,
                'US',
                [BaseDataTypes.stocksType],
                yFinanceUtilsService.getExhangeSuffix(exchangeName))
    }

    // Get NASDAQ exchange
    const nasdaqExchange = await
            exchangeModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.nasdaqExchangeName)

    // Upsert on NewsSource
    const finnHubNewsSource = await
            docSourceModel.upsert(
              prisma,
              undefined,  // id
              'FinnHub',
              null)       // description
  }
}
