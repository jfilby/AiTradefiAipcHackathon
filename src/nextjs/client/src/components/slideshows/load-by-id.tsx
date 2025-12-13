import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getSlideshowQuery } from '@/apollo/slideshows'

interface Props {
  userProfileId: string
  instanceId?: string
  slideshowId: string
  setSlideshow: any
  setLoaded: any
}

export default function LoadSlideshowById({
                          userProfileId,
                          instanceId,
                          slideshowId,
                          setSlideshow,
                          setLoaded
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetSlideshowQuery } =
    useQuery<any>(getSlideshowQuery, {
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
  async function getSlideshow() {

    // Query
    const { data } = await
            fetchGetSlideshowQuery({
              userProfileId: userProfileId,
              slideshowId: slideshowId
            })

    const results = data.getSlideshowById

    setSlideshow(results.slideshow)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getSlideshow()
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
