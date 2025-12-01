import { gql } from '@apollo/client'

export const getInstrumentQuery = gql`
  query getInstrumentById(
          $userProfileId: String!,
          $instanceId: String!,
          $instrumentId: String!) {
    getInstrumentById(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      instrumentId: $instrumentId) {

      status
      message
      instrument {
        id
        name
        type
        created
        updated
      }
    }
  }
`

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
