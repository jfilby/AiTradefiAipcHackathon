import { gql } from '@apollo/client'

export const getGenerationsConfigListQuery = gql`
  query getGenerationsConfigList(
          $userProfileId: String!) {
    getGenerationsConfigList(
      userProfileId: $userProfileId) {

      status
      message
      generationsConfigList {
        id
        publiclyShared
        name
        isDefault
      }
    }
  }
`

export const getGenerationsConfigQuery = gql`
  query getGenerationsConfig(
          $userProfileId: String!,
          $instanceId: String,
          $generationsConfigId: String!) {
    getGenerationsConfig(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      generationsConfigId: $generationsConfigId) {

      status
      message
      generationsConfig {
        id
        userProfileId
        elevenLabsVoiceId
        status
        isDefault
        name
        created
        updated
      }
    }
  }
`

export const getGenerationsConfigsQuery = gql`
  query getGenerationsConfigs(
          $userProfileId: String!,
          $instanceId: String) {
    getGenerationsConfigs(
      userProfileId: $userProfileId,
      instanceId: $instanceId) {

      status
      message
      generationsConfigs {
        id
        userProfileId
        elevenLabsVoiceId
        elevenLabsVoice {
          name
        }
        status
        isDefault
        name
        created
        updated
      }
    }
  }
`

export const upsertGenerationsConfigMutation = gql`
  mutation upsertGenerationsConfig(
             $id: String,
             $userProfileId: String!,
             $elevenLabsVoiceId: String,
             $status: String!,
             $isDefault: Boolean!,
             $name: String!) {
    upsertGenerationsConfig(
      id: $id,
      userProfileId: $userProfileId,
      elevenLabsVoiceId: $elevenLabsVoiceId,
      status: $status,
      isDefault: $isDefault,
      name: $name) {

      status
      message
    }
  }
`
