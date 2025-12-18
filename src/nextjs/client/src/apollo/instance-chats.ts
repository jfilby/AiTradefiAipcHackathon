import { gql } from '@apollo/client'

export const getChatMessagesQuery = gql`
  query getChatMessages(
          $chatSessionId: String,
          $userProfileId: String!,
          $lastMessageId: String) {
    getChatMessages(
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId,
      lastMessageId: $lastMessageId) {

      status
      message
      chatMessages {
        id
        name
        message
        created
        updated
      }
    }
  }
`

export const getOrCreateInstanceChatSessionMutation = gql`
  mutation getOrCreateInstanceChatSession(
             $instanceId: String,
             $chatSessionId: String,
             $userProfileId: String!,
             $chatSettingsName: String) {
    getOrCreateInstanceChatSession(
      instanceId: $instanceId,
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId,
      chatSettingsName: $chatSettingsName) {

      status
      message
      chatSession {
        id
        status
        chatParticipants {
          id
          userProfileId
        }
      }
    }
  }
`
