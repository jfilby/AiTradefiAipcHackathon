import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { getVoicePreviewAudioQuery } from '@/apollo/elevenlabs-voices'

interface Props {
  elevenLabsVoiceId: string
  setAlertSeverity: any
  setMessage: any
  setGeneratedAudioId: any
  loadVoicePreviewAudio: boolean
  setLoadVoicePreviewAudio: any
}

export default function GetVoicePreviewAudio({
                          elevenLabsVoiceId,
                          setAlertSeverity,
                          setMessage,
                          setGeneratedAudioId,
                          loadVoicePreviewAudio,
                          setLoadVoicePreviewAudio
                        }: Props) {

  // GraphQL
  const [sendGetVoicePreviewAudioQuery] =
    useMutation<any>(getVoicePreviewAudioQuery, {
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
  async function getVoicePreviewAudio() {

    // Query
    var sendGetVoicePreviewAudioData: any = undefined

      await sendGetVoicePreviewAudioQuery({
        variables: {
          elevenLabsVoiceId: elevenLabsVoiceId
        }
      }).then(result => sendGetVoicePreviewAudioData = result)

    // Get results and set fields
    const results = sendGetVoicePreviewAudioData.data.getVoicePreviewAudio

    if (results.status === true) {
      setAlertSeverity('success')

      setGeneratedAudioId(results.generatedAudioId)
    } else {
      setAlertSeverity('error')
      setMessage(results.message)
    }

    // Loaded
    setLoadVoicePreviewAudio(false)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getVoicePreviewAudio()
    }

    // Loaded?
    if (loadVoicePreviewAudio === false) {
      return
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [loadVoicePreviewAudio])

  // Render
  return (
    <></>
  )
}
