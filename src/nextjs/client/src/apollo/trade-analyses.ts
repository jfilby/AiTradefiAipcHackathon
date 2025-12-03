import { gql } from '@apollo/client'

export const getTradeAnalysisQuery = gql`
  query getTradeAnalysisById(
          $userProfileId: String!,
          $instanceId: String,
          $tradeAnalysisId: String!) {
    getTradeAnalysisById(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      tradeAnalysisId: $tradeAnalysisId) {

      status
      message
      tradeAnalysis {
        id
        analysis {
          name
        }
        instrument {
          exchange {
            name
          }
          name
        }
        score
        thesis
        created
        updated
      }
    }
  }
`

export const getLatestTradeAnalysesGroupsQuery = gql`
  query getLatestTradeAnalysesGroups(
          $userProfileId: String!,
          $instanceId: String,
          $instrumentType: String) {
    getLatestTradeAnalysesGroups(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      instrumentType: $instrumentType) {

      status
      message
      tradeAnalysesGroups {
        id
        analysis {
          name
        }
        day
        ofTradeAnalyses {
          instrument {
            exchange {
              name
            }
            name
          }
          score
          thesis
        }
      }
    }
  }
`
