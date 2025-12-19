import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { upsertSpeakPreferenceMutation } from '@/apollo/eleven-labs'

interface Props {
  userProfileId: string
  setAlertSeverity: any
  setMessage: any
  speak: boolean
}

export default function SaveSpeakPreference({
                          userProfileId,
                          setAlertSeverity,
                          setMessage,
                          speak
                        }: Props) {

  // GraphQL
  const [sendUpsertSpeakPreferenceMutation] =
    useMutation<any>(upsertSpeakPreferenceMutation, {
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
  async function saveSpeakPreference() {

    // Query
    var sendUpsertSpeakPreferenceData: any = undefined

      await sendUpsertSpeakPreferenceMutation({
        variables: {
          userProfileId: userProfileId,
          enabled: speak
        }
      }).then(result => sendUpsertSpeakPreferenceData = result)

    // Get results and set fields
    const results = sendUpsertSpeakPreferenceData.data.upsertSpeakPreference

    if (results.status === true) {
      setAlertSeverity('success')
    } else {
      setAlertSeverity('error')
      setMessage(results.message)
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await saveSpeakPreference()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [speak])

  // Render
  return (
    <></>
  )
}
