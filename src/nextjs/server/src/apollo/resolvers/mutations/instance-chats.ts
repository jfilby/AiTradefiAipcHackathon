import { prisma } from '@/db'
import { ChatParticipantModel } from '@/serene-core-server/models/chat/chat-participant-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSessionOptions } from '@/types/server-only-types'
import { InstanceChatsService } from '@/services/instance-chats/common/service'


// Models
const chatParticipantModel = new ChatParticipantModel()


// Services
// const chatSessionTurnService = new ChatSessionTurnService()
const instanceChatsService = new InstanceChatsService()
const usersService = new UsersService()


// Code
export async function getOrCreateInstanceChatSession(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `getOrCreateInstanceChatSession()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Validate
  if (args.chatSettingsName == null ||
      args.chatSettingsName === '') {

    throw new CustomError(`${fnName}: args.chatSettingsName not specified`)
  }

  // Define ChatSessionsOptions
  const chatSessionOptions: ChatSessionOptions = {}

  // Get/create transaction
  var results: any

  await prisma.$transaction(async (transactionPrisma: any) => {

    try {
      results = await
        instanceChatsService.getOrCreateChatSession(
          transactionPrisma,
          args.instanceId,
          args.userProfileId,
          args.chatSessionId,
          args.chatSettingsName,
          chatSessionOptions)
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          status: false,
          message: error.message
        }
      } else {
        return {
          status: false,
          message: `Unexpected error: ${error}`
        }
      }
    }
  })

  // Debug
  console.log(`${fnName}: results: ${JSON.stringify(results)}`)

  // Return
  return results
}
