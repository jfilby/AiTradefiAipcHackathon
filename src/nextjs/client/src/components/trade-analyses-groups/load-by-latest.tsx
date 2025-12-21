import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getLatestTradeAnalysesGroupsQuery } from '@/apollo/trade-analyses'

interface Props {
  userProfileId: string
  instanceId?: string
  setTradeAnalysesGroups: any
  setInNewStatus: any
}

export default function LoadLatestTradeAnalysesGroups({
                          userProfileId,
                          instanceId,
                          setTradeAnalysesGroups,
                          setInNewStatus
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetTradeAnalysesGroupsQuery } =
    useQuery<any>(getLatestTradeAnalysesGroupsQuery, {
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
            fetchGetTradeAnalysesGroupsQuery({
              userProfileId: userProfileId,
              instanceId: instanceId,
              instrumentType: null
          })

    const results = data.getLatestTradeAnalysesGroups

    setTradeAnalysesGroups(results.tradeAnalysesGroups)
    setInNewStatus(results.inNewStatus)
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
