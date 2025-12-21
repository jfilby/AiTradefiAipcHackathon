import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getSlideshowsQuery } from '@/apollo/slideshows'

interface Props {
  userProfileId: string
  instanceId?: string
  setSlideshows: any
  setInNewStatus: any
}

export default function LoadSlideshowsByFilter({
                          userProfileId,
                          instanceId,
                          setSlideshows,
                          setInNewStatus
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetSlideshowsQuery } =
    useQuery<any>(getSlideshowsQuery, {
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
  async function getSlideshows() {

    // Debug
    const fnName = `getSlideshows()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetSlideshowsQuery({
              userProfileId: userProfileId,
              instanceId: instanceId,
              analysisId: null
          })

    const results = data.getSlideshows

    setSlideshows(results.slideshows)
    setInNewStatus(results.inNewStatus)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getSlideshows()
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
