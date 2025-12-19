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
