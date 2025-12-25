import { gql } from '@apollo/client'

export const getElevenLabsVoicesQuery = gql`
  query getElevenLabsVoices(
          $userProfileId: String!) {
    getElevenLabsVoices(
      userProfileId: $userProfileId) {

      status
      message
      elevenLabsVoices {
        id
        status
        name
        description
      }
    }
  }
`
