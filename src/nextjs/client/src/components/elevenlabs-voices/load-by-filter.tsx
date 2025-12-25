import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getElevenLabsVoicesQuery } from '@/apollo/elevenlabs-voices'

interface Props {
  userProfileId: string
  status: string
  addBlank: boolean
  setElevenLabsVoices: any
  setLoaded: any
}

export default function LoadElevenLabsVoicesByFilter({
                          userProfileId,
                          status,
                          addBlank,
                          setElevenLabsVoices,
                          setLoaded
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetElevenLabsVoicesQuery } =
    useQuery<any>(getElevenLabsVoicesQuery, {
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
  async function getElevenLabsVoices() {

    // Debug
    const fnName = `getElevenLabsVoices()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetElevenLabsVoicesQuery({
              userProfileId: userProfileId,
              status: status
          })

    const results = data.getElevenLabsVoices

    if (addBlank === true) {
      results.elevenLabsVoices = [
        {
          id: null,
          name: 'None',
          description: ''
        },
        ...results.elevenLabsVoices
      ]
    }

    setElevenLabsVoices(results.elevenLabsVoices)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getElevenLabsVoices()
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
