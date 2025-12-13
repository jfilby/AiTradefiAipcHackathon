import { gql } from '@apollo/client'

export const getSlideshowQuery = gql`
  query getSlideshowById(
          $userProfileId: String!,
          $instanceId: String,
          $slideshowId: String!) {
    getSlideshowById(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      slideshowId: $slideshowId) {

      status
      message
      slideshow {
        id
        userProfileId
        tradeAnalysisId
        status
        slides {
          id
          status
          title
          text
          audioPath
          imagePath
        }
      }
    }
  }
`

export const getSlideshowsQuery = gql`
  query getSlideshows(
          $userProfileId: String!,
          $instanceId: String,
          $analysisId: String) {
    getSlideshows(
      userProfileId: $userProfileId,
      instanceId: $instanceId,
      analysisId: $analysisId) {

      status
      message
      slideshows {
        id
        userProfileId
        tradeAnalysisId
        status
        slides {
          id
          status
          title
          text
          audioPath
          imagePath
        }
      }
    }
  }
`
