import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { SereneAiServerOnlyTypes } from '@/serene-ai-server/types/server-only-types'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { ChatSessionOptions } from '@/types/server-only-types'

// Models
const chatSettingsModel = new ChatSettingsModel()

// Services
const chatSessionService = new ChatSessionService()

// Class
export class InstanceChatsService {

  // Debug
  clName = 'InstanceChatsService'

  // Code
  async getInitialData(
          prisma: PrismaClient,
          chatSettingsName: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getInitialData()`

    // Debug
    console.log(`${fnName}: getting baseChatSettings with chatSettingsName: ` +
                JSON.stringify(chatSettingsName))

    // Get domainId if none specified, but chatSettingsName is specified
    var baseChatSettings: any = null

    if (chatSettingsName != null) {

      // Debug
      console.log(`${fnName}: getting ChatSettings by name..`)

      // Get ChatSettings
      baseChatSettings = await
        chatSettingsModel.getByName(
          prisma,
          chatSettingsName)

      // Debug
      console.log(`${fnName}: baseChatSettings: ` +
                  JSON.stringify(baseChatSettings))

      // Validate
      if (baseChatSettings == null) {

        throw new CustomError(`${fnName}: ChatSettings not found for name: ` +
                              `${chatSettingsName}`)
      }
    }

    // Debug
    console.log(`${fnName}: returning..`)

    // Return
    return {
      baseChatSettings: baseChatSettings
    }
  }

  async getOrCreateChatSession(
          prisma: PrismaClient,
          instanceId: string,
          userProfileId: string,
          chatSessionId: string | undefined,
          chatSettingsName: string | undefined,
          options: ChatSessionOptions) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSession()`

    console.log(`${fnName}: starting with instanceId: ${instanceId} ` +
                `userProfileId: ${userProfileId} ` +
                `chatSessionId: ${chatSessionId} ` +
                `chatSettingsName: ` + JSON.stringify(chatSettingsName))

    // Use the default ChatSettings name?
    if (chatSettingsName == null) {
      chatSettingsName = SereneAiServerOnlyTypes.defaultChatSettingsName
    }

    // Get initial data
    const initialDataResults = await
            this.getInitialData(
              prisma,
              chatSettingsName)

    var baseChatSettings = initialDataResults.baseChatSettings

    // Debug
    console.log(`${fnName}: baseChatSettings: ` + JSON.stringify(baseChatSettings))

    // Get InstanceChat and related records
    if (chatSessionId != null) {

      const chatSessionResults = await
              chatSessionService.getChatSessionById(
                prisma,
                chatSessionId,
                userProfileId)

      // Debug
      console.log(`${fnName}: returning with existing chatSession..`)

      // Formulate return var
      var chatSession = chatSessionResults.chatSession

      // Return
      return {
        status: true,
        chatSession: chatSession
      }
    }

    // If an agent is specified then create a new ChatSettings record
    var appCustom: any = null
    var chatSettings = baseChatSettings

    // Debug
    console.log(`${fnName}: baseChatSettings: ` +
                JSON.stringify(baseChatSettings))

    console.log(`${fnName}: creating chatSession..`)

    // Determine the name of the chat session
    var name = ``

    // Debug
    console.log(`${fnName}: creating ChatSession..`)

    // Create ChatSession
    const chatSessionResults = await
            chatSessionService.createChatSession(
              prisma,
              chatSettings.id,
              userProfileId,
              instanceId,
              chatSettings.isEncryptedAtRest,
              chatSettings.isJsonMode,
              null,  // prompt
              appCustom,
              name)

    // Debug
    console.log(`${fnName}: created chatSession: ` +
                JSON.stringify(chatSessionResults.chatSession))

    // Formulate return var
    var chatSession = chatSessionResults.chatSession as any

    // Return
    return {
      status: true,
      chatSession: chatSession
    }
  }
}
