import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getInstrumentsQuery } from '@/apollo/instruments'

interface Props {
  userProfileId: string
  instanceId?: string
  setInstruments: any
}

export default function LoadInstruments({
                          userProfileId,
                          instanceId,
                          setInstruments
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetInsturmentsQuery } =
    useQuery<any>(getInstrumentsQuery, {
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
  async function getInstruments() {

    // Query
    const { data } = await
            fetchGetInsturmentsQuery({
              userProfileId: userProfileId,
              instanceId: instanceId
          })

    const results = data.getInstruments

    setInstruments(results.instruments)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getInstruments()
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
