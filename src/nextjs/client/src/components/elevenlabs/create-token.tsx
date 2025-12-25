import { useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { createElevenLabsTokenMutation } from '@/apollo/elevenlabs'

interface Props {
  userProfileId: string
  setAlertSeverity: any
  setMessage: any
  token: string | undefined
  setToken: any
}

export default function CreateElevenLabsToken({
                          userProfileId,
                          setAlertSeverity,
                          setMessage,
                          token,
                          setToken
                        }: Props) {

  // GraphQL
  const [sendCreateElevenLabsTokenMutation] =
    useMutation<any>(createElevenLabsTokenMutation, {
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
  async function createToken() {

    // Query
    var sendCreateElevenLabsTokenData: any = undefined

      await sendCreateElevenLabsTokenMutation({
        variables: {
          userProfileId: userProfileId
        }
      }).then(result => sendCreateElevenLabsTokenData = result)

    // Get results and set fields
    const results = sendCreateElevenLabsTokenData.data.createElevenLabsToken

    if (results.status === true) {
      setAlertSeverity(undefined)
    } else {
      setAlertSeverity('error')
      setMessage(results.message)
    }

    // Done
    setToken(results.token)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await createToken()
    }

    // Return early if the token is already defined
    if (token != null) {
      return
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [token])

  // Render
  return (
    <></>
  )
}
