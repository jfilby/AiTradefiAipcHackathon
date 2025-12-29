import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useMutation } from '@apollo/client/react'
import { upsertAnalysisMutation } from '@/apollo/analyses'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  instanceId?: string
  analysis: any
  isEditPage: boolean
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
}

export default function SaveAnalysis({
                          userProfileId,
                          instanceId,
                          analysis,
                          isEditPage,
                          setAlertSeverity,
                          setMessage,
                          saveAction,
                          setSaveAction
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
          generationsConfigId: analysis.generationsConfigId,
          type: analysis.type,
          status: analysis.status,
          instrumentType: analysis.instrumentType,
          defaultMinScore: analysis.defaultMinScore,
          name: analysis.name,
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
    toast(`Saved`)
    setSaveAction(false)

    if (results.status === true &&
        isEditPage === true) {

      // Done (redirect to index) if published
      if (analysis.status === BaseDataTypes.activeStatus) {
         window.location.href = indexUrl
      }
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
    <>
      <Toaster />
    </>
  )
}
