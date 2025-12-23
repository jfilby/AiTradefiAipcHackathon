import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getSlideshowShowcaseQuery } from '@/apollo/slideshows'

interface Props {
  setSlideshows: any
}

export default function LoadSlideshowShowcaseByFilter({
                          setSlideshows
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetSlideshowShowcaseQuery } =
    useQuery<any>(getSlideshowShowcaseQuery, {
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
  async function getSlideshowShowcase() {

    // Debug
    const fnName = `getSlideshowShowcase()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetSlideshowShowcaseQuery({})

    const results = data.getSlideshowShowcase

    setSlideshows(results.slideshows)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getSlideshowShowcase()
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
