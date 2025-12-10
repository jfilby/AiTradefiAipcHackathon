import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getAnalysisQuery } from '@/apollo/analyses'

interface Props {
  userProfileId: string
  instanceId?: string
  analysisId: string
  setAnalysis: any
  setLoaded: any
}

export default function LoadAnalysisById({
                          userProfileId,
                          instanceId,
                          analysisId,
                          setAnalysis,
                          setLoaded
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetAnalysisQuery } =
    useQuery<any>(getAnalysisQuery, {
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
  async function getAnalysis() {

    // Query
    const { data } = await
            fetchGetAnalysisQuery({
              userProfileId: userProfileId,
              analysisId: analysisId
            })

    const results = data.getAnalysisById

    setAnalysis(results.analysis)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getAnalysis()
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
