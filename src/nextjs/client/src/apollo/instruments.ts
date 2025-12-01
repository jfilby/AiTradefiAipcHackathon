import { gql } from '@apollo/client'

export const getInstrumentsQuery = gql`
  query getInstruments(
          $userProfileId: String!,
          $instanceId: String!) {
    getInstruments(
      userProfileId: $userProfileId,
      instanceId: $instanceId) {

      status
      message
      instruments {
        id
        name
        type
        created
        updated
      }
    }
  }
`
