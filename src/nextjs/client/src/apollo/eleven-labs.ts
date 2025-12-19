import { gql } from '@apollo/client'

export const createElevenLabsTokenMutation = gql`
  mutation createElevenLabsToken(
             $userProfileId: String!)
  {
    createElevenLabsToken(
      userProfileId: $userProfileId) {

      status
      message
      token
    }
  }
`

export const upsertSpeakPreferenceMutation = gql`
  mutation upsertSpeakPreference(
             $userProfileId: String!,
             $enabled: Boolean!)
  {
    upsertSpeakPreference(
      userProfileId: $userProfileId,
      enabled: $enabled) {

      status
      message
    }
  }
`
