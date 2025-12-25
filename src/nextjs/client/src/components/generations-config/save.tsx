import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { upsertGenerationsConfigMutation } from '@/apollo/generations-configs'

interface Props {
  userProfileId: string
  instanceId?: string
  generationsConfig: any
  isAdd: boolean
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
  setEditMode: any
  redirectToIndexOnSave: boolean
}

export default function SaveGenerationsConfig({
                          userProfileId,
                          instanceId,
                          generationsConfig,
                          isAdd,
                          setAlertSeverity,
                          setMessage,
                          saveAction,
                          setSaveAction,
                          setEditMode,
                          redirectToIndexOnSave
                        }: Props) {

  // Consts
  const indexUrl = `/analyses`

  // GraphQL
  const [sendUpsertGenerationsConfigMutation] =
    useMutation<any>(upsertGenerationsConfigMutation, {
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
  async function upsertGenerationsConfig() {

    // Query
    var sendUpsertGenerationsConfigData: any = undefined

      await sendUpsertGenerationsConfigMutation({
        variables: {
          id: generationsConfig.id,
          userProfileId: userProfileId,
          type: generationsConfig.type,
          status: generationsConfig.status,
          instrumentType: generationsConfig.instrumentType,
          defaultMinScore: generationsConfig.defaultMinScore,
          name: generationsConfig.name,
          description: generationsConfig.description,
          prompt: generationsConfig.prompt
        }
      }).then(result => sendUpsertGenerationsConfigData = result)

    // Get results and set fields
    const results = sendUpsertGenerationsConfigData.data.upsertGenerationsConfig

    if (results.status === true) {
      setAlertSeverity('success')
    } else {
      setAlertSeverity('error')
    }

    setMessage(results.message)

    // Done
    setSaveAction(false)

    if (results.status === true &&
        redirectToIndexOnSave === true) {
      // setEditMode(false)

      window.location.href = indexUrl
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await upsertGenerationsConfig()
    }

    // Return early if no save action requested
    if (saveAction !== true) {
      return
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [saveAction])

  // Render
  return (
    <></>
  )
}
