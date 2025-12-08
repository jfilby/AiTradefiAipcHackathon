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

export const upsertAnalysisMutation = gql`
  mutation upsertAnalysis(
             $id: String,
             $userProfileId: String!,
             $type: String!,
             $status: String!,
             $instrumentType: String!
             $defaultMinScore: Float!,
             $name: String!,
             $version: String!,
             $description: String!,
             $prompt: String!)
  {
    upsertAnalysis(
      id: $id,
      userProfileId: $userProfileId,
      type: $type,
      status: $status,
      instrumentType: $instrumentType,
      defaultMinScore: $defaultMinScore,
      name: $name,
      version: $version,
      description: $description,
      prompt: $prompt) {

      status
      message
    }
  }

`
