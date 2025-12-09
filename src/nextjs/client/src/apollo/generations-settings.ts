import { gql } from '@apollo/client'

export const getGenerationsSettingsListQuery = gql`
  query getGenerationsSettingsList(
          $userProfileId: String!) {
    getGenerationsSettingsList(
      userProfileId: $userProfileId) {

      status
      message
      generationsSettingsList {
        id
        publiclyShared
        name
      }
    }
  }
`
