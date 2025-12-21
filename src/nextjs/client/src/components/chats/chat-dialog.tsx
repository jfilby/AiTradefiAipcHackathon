import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Button, Dialog } from '@mui/material'
import { DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { getOrCreateInstanceChatSessionMutation } from '@/apollo/instance-chats'
import ViewInstanceChatSession from './session'

interface Props {
  userProfileId: string
  setAlertSeverity: any
  setMessage: any
  open: boolean
  setOpen: any
  analysis: any
  chatSession: string | undefined
  setChatSession: any
  setChatRawJson: any
}

export default function ChatDialog({
                          userProfileId,
                          setAlertSeverity,
                          setMessage,
                          open,
                          setOpen,
                          analysis,
                          chatSession,
                          setChatSession,
                          setChatRawJson
                        }: Props) {

  // State
  const [chatSpeakPreference, setChatSpeakPreference] = useState(true)

  // GraphQL
  const [sendGetOrCreateInstanceChatSessionMutation] =
    useMutation<any>(getOrCreateInstanceChatSessionMutation, {
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
  async function getChatSession() {

    // Debug
    const fnName = `getChatSession()`

    // console.log(`${fnName}: loading chat session..`)

    // Query
    var sendGetOrCreateInstanceChatSessionData: any = undefined

      await sendGetOrCreateInstanceChatSessionMutation({
        variables: {
          userProfileId: userProfileId,
          chatSettingsName: BaseDataTypes.aiTradefiChatSettingsName,
          appCustom: JSON.stringify(analysis)
        }
      }).then(result => sendGetOrCreateInstanceChatSessionData = result)

    // Get results and set fields
    const results = sendGetOrCreateInstanceChatSessionData.data.getOrCreateInstanceChatSession

    if (results.status === true) {
      setAlertSeverity('success')
      setChatSession(results.chatSession)
      setChatSpeakPreference(results.chatSpeakPreference)
    } else {
      setAlertSeverity('error')
    }

    setMessage(results.message)
  }

  const handleClose = () => {
    setOpen(false)
    setChatSession(undefined)
  }

  // Effects
  useEffect(() => {

    // Skip if dialog not opened or chatSessionId already set
    if (open === false ||
        chatSession != null) {

      return
    }

    // Load ChatSession
    getChatSession()

  }, [chatSession, open])

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='chat-title'
      aria-describedby='chat-description'
      maxWidth='md'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            // width: '90vw',
            // maxWidth: 1200,
            height: '75vh',
          },
        },
      }}>
      <DialogTitle id='chat-title'>
        Chat
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em', textAlign: 'left' }}>

          {/* <p>chatSession: {JSON.stringify(chatSession)}</p> */}

          {chatSession != null ?
            <ViewInstanceChatSession
              userProfileId={userProfileId}
              chatSession={chatSession}
              chatSpeakPreference={chatSpeakPreference}
              showInputTip={undefined}
              setShowInputTip={undefined}
              showNextTip={undefined}
              setShowNextTip={undefined}
              setChatRawJson={setChatRawJson} />
          :
            <></>
          }
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
