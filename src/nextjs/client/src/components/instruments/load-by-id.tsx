import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getInstrumentQuery } from '@/apollo/instruments'

interface Props {
  userProfileId: string
  instrumentId: string
  setInstrument: any
}

export default function LoadInstrumentById({
                          userProfileId,
                          instrumentId,
                          setInstrument
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetInstrumentQuery } =
    useQuery<any>(getInstrumentQuery, {
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
  async function getInstrument() {

    // Query
    const { data } = await
            fetchGetInstrumentQuery({
              userProfileId: userProfileId,
              instrumentId: instrumentId
            })

    const results = data.getInstrument

    setInstrument(results.instrument)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getInstrument()
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
