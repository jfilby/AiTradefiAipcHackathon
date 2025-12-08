import { gql } from '@apollo/client'

export const getAnalysisQuery = gql`
  query getAnalysisById(
          $userProfileId: String!,
          $instanceId: String,
          $analysisId: String!) {
    getAnalysisById(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      analysisId: $analysisId) {

      status
      message
      analysis {
        id
        type
        status
        instrumentType
        defaultMinScore
        name
        version
        description
        prompt
        created
        updated
      }
    }
  }
`

export const getAnalysesQuery = gql`
  query getAnalyses(
          $userProfileId: String!,
          $instanceId: String,
          $instrumentType: String) {
    getAnalyses(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      instrumentType: $instrumentType) {

      status
      message
      analyses {
        id
        type
        status
        instrumentType
        defaultMinScore
        name
        version
        description
        prompt
        created
        updated
      }
    }
  }
`
