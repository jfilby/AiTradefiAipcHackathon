import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getTradeAnalysisQuery } from '@/apollo/trade-analyses'

interface Props {
  userProfileId: string
  tradeAnalysisId: string
  setTradeAnalysis: any
}

export default function LoadTradeAnalysisById({
                          userProfileId,
                          tradeAnalysisId,
                          setTradeAnalysis
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetTradeAnalysisQuery } =
    useQuery<any>(getTradeAnalysisQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getTradeAnalysis() {

    // Query
    const { data } = await
            fetchGetTradeAnalysisQuery({
              userProfileId: userProfileId,
              tradeAnalysisId: tradeAnalysisId
            })

    const results = data.getTradeAnalysis

    setTradeAnalysis(results.tradeAnalysis)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getTradeAnalysis()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <></>
  )
}
