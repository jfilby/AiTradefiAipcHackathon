import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getAnalysesQuery } from '@/apollo/analyses'

interface Props {
  userProfileId: string
  instanceId?: string
  setAnalyses: any
}

export default function LoadAnalysesByFilter({
                          userProfileId,
                          instanceId,
                          setAnalyses
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetAnalysesQuery } =
    useQuery<any>(getAnalysesQuery, {
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
  async function getAnalyses() {

    // Debug
    const fnName = `getAnalyses()`

    console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetAnalysesQuery({
              userProfileId: userProfileId,
              instanceId: instanceId,
              instrumentType: null
          })

    const results = data.getAnalyses

    setAnalyses(results.analyses)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getAnalyses()
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
