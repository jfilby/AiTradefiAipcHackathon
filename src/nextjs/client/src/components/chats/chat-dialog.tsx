import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { getOrCreateInstanceChatSessionMutation } from '@/apollo/instance-chats'
import ViewInstanceChatSession from './session'

interface Props {
  userProfileId: string
  setAlertSeverity: any
  setMessage: any
  open: boolean
  setOpen: any
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

    // Query
    var sendGetOrCreateInstanceChatSessionData: any = undefined

      await sendGetOrCreateInstanceChatSessionMutation({
        variables: {
          userProfileId: userProfileId,
          chatSettingsName: BaseDataTypes.aiTradefiChatSettingsName
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
