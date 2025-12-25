import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getGenerationsConfigsQuery } from '@/apollo/generations-configs'

interface Props {
  userProfileId: string
  instanceId?: string
  setGenerationsConfigs: any
  setLoaded: any
}

export default function LoadGenerationsConfigByFilter({
                          userProfileId,
                          instanceId,
                          setGenerationsConfigs,
                          setLoaded
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetGenerationsConfigsQuery } =
    useQuery<any>(getGenerationsConfigsQuery, {
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
  async function getGenerationsConfigs() {

    // Debug
    const fnName = `getGenerationsConfigs()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetGenerationsConfigsQuery({
              userProfileId: userProfileId,
              instanceId: instanceId
          })

    const results = data.getGenerationsConfig

    setGenerationsConfigs(results.generationsConfigs)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getGenerationsConfigs()
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
