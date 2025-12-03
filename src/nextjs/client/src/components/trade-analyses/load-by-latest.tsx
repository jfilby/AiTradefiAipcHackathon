import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getLatestTradeAnalysesQuery } from '@/apollo/trade-analyses'

interface Props {
  userProfileId: string
  instanceId?: string
  setTradeAnalyses: any
}

export default function LoadLatestTradeAnalyses({
                          userProfileId,
                          instanceId,
                          setTradeAnalyses
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetTradeAnalysesQuery } =
    useQuery<any>(getLatestTradeAnalysesQuery, {
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
  async function getLatestTradeAnalyses() {

    // Query
    const { data } = await
            fetchGetTradeAnalysesQuery({
              userProfileId: userProfileId,
              instanceId: instanceId,
              instrumentType: null
          })

    const results = data.getLatestTradeAnalyses

    setTradeAnalyses(results.tradeAnalyses)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getLatestTradeAnalyses()
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
