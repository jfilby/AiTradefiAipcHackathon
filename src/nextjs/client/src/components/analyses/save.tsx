import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { upsertAnalysisMutation } from '@/apollo/analyses'

interface Props {
  userProfileId: string
  instanceId?: string
  analysis: any
  isAdd: boolean
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
  setEditMode: any
  redirectToIndexOnSave: boolean
}

export default function SaveAnalysis({
                          userProfileId,
                          instanceId,
                          analysis,
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
  const [sendUpsertAnalysisMutation] =
    useMutation<any>(upsertAnalysisMutation, {
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
  async function upsertAnalysis() {

    // Query
    var sendUpsertAnalysisData: any = undefined

      await sendUpsertAnalysisMutation({
        variables: {
          id: analysis.id,
          userProfileId: userProfileId,
          type: analysis.type,
          status: analysis.status,
          instrumentType: analysis.instrumentType,
          defaultMinScore: analysis.defaultMinScore,
          name: analysis.name,
          version: analysis.version,
          description: analysis.description,
          prompt: analysis.prompt
        }
      }).then(result => sendUpsertAnalysisData = result)

    // Get results and set fields
    const results = sendUpsertAnalysisData.data.upsertAnalysis

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
      await upsertAnalysis()
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
