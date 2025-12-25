import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getGenerationsConfigQuery } from '@/apollo/generations-configs'

interface Props {
  userProfileId: string
  instanceId?: string
  generationsConfigId: string
  setGenerationsConfig: any
  setLoaded: any
}

export default function LoadGenerationsConfigByFilter({
                          userProfileId,
                          instanceId,
                          generationsConfigId,
                          setGenerationsConfig,
                          setLoaded
                        }: Props) {

  // GraphQL
  const { refetch: fetchGetGenerationsConfigQuery } =
    useQuery<any>(getGenerationsConfigQuery, {
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
  async function getGenerationsConfig() {

    // Debug
    const fnName = `getGenerationsConfig()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Query
    const { data } = await
            fetchGetGenerationsConfigQuery({
              userProfileId: userProfileId,
              instanceId: instanceId,
              generationsConfigId: generationsConfigId
          })

    const results = data.getGenerationsConfig

    setGenerationsConfig(results.generationsConfig)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getGenerationsConfig()
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
