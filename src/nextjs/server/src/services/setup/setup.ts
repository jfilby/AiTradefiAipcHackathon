import { PrismaClient, UserProfile } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { AgentUserModel } from '@/serene-ai-server/models/agents/agent-user-model'
import { SereneAiSetup } from '@/serene-ai-server/services/setup/setup-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { TradingParameterTypes } from '@/types/trading-parameter-types'
import { ExchangeModel } from '@/models/instruments/exchange-model'
import { DocSourceModel } from '@/models/documents/doc-source-model'
import { InstrumentModel } from '@/models/instruments/instrument-model'
import { WindowTypeModel } from '@/models/instruments/window-type-model'
import { AgentUserService } from '@/services/agents/agent-user-service'
import { SetupAnalysesTechService } from '../analysis/setup-analyses-tech-service'

// Models
const agentUserModel = new AgentUserModel()
const chatSettingsModel = new ChatSettingsModel()
const exchangeModel = new ExchangeModel()
const docSourceModel = new DocSourceModel()
const instrumentModel = new InstrumentModel()
const windowTypeModel = new WindowTypeModel()

// Services
const agentUserService = new AgentUserService()
const sereneAiSetup = new SereneAiSetup()
const setupAnalysesTechService = new SetupAnalysesTechService()

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
    await setupAnalysesTechService.setup(prisma)
  }

  async setupBaseData(
          prisma: PrismaClient,
          adminUserProfile: UserProfile) {

    // Upserts for the Nasdaq
    const nasdaqExchange = await
            exchangeModel.upsert(
              prisma,
              undefined,  // id
              ServerOnlyTypes.nasdaqExchangeName,
              'US',
              [ServerOnlyTypes.stockType])

    for (const entry of TradingParameterTypes.nasdaqStocks) {

      const instrument = await
              instrumentModel.upsert(
                prisma,
                undefined,  // id
                nasdaqExchange.id,
                entry.symbol,
                entry.type,
                entry.name)
    }

    // Upserts for WindowType
    for (const entry of TradingParameterTypes.defaultWindowTypes) {

      const windowType = await
              windowTypeModel.upsert(
                prisma,
                undefined,  // id
                BaseDataTypes.activeStatus,
                entry.name,
                entry.fromTimeUnit,
                entry.fromTimeValue,
                entry.toTimeUnit,
                entry.toTimeValue)
    }

    // Upsert on NewsSource
    const finnHubNewsSource = await
            docSourceModel.upsert(
              prisma,
              undefined,  // id
              'FinnHub',
              null)       // description
  }
}
