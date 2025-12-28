import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { io } from 'socket.io-client'
import { Alert, Button, Checkbox, FormControlLabel, TextareaAutosize } from '@mui/material'
import ChatSessionMessages from '../../../deployed/serene-ai-client/components/chat/view/messages'
import { getChatMessagesQuery } from '@/apollo/instance-chats'
import { ElevenLabsClientService } from '@/services/elevenlabs/service'
import CreateElevenLabsToken from '../elevenlabs/create-token'
import SaveSpeakPreference from '../elevenlabs/save-speak-user-preference'
import StreamMicComponent from '../elevenlabs/stream-mic'

// Get/create a Socket.io object. This needs to be done outside of the
// function, which would otherwise constantly retry the object creation,
// causing mass reconnects. Possibly only on dev, even so, this is the best
// place to create the Socket.io object.
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_URL}`)

// Page function interface
interface Props {
  userProfileId: string
  generationsConfigId: string
  chatSession: any
  chatSpeakPreference: boolean | null
  showInputTip: boolean | undefined
  setShowInputTip: any
  showNextTip: boolean | undefined
  setShowNextTip: any
  setChatRawJson: any
}

export default function ViewInstanceChatSession({
  userProfileId,  // should be fromChatParticipantId (or both)
  generationsConfigId,
  chatSession,
  chatSpeakPreference,
  showInputTip,
  setShowInputTip,
  showNextTip,
  setShowNextTip,
  setChatRawJson
}: Props) {

  // Consts
  const chatSessionId = chatSession.id
  const chatSessionToken = chatSession.token

  // Services
  const elevenLabsClientService = new ElevenLabsClientService()

  // Refs
  const myMessageInput = useRef<any>(null)

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState(undefined)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [chatParticipant, setChatParticipant] = useState<any>(undefined)
  const [myTurn, setMyTurn] = useState(true)
  const [myMessage, setMyMessage] = useState('')
  const [lastMyMessage, setLastMyMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [chatHeight, setChatHeight] = useState(getChatBoxHeight())

  const [elevenlabsToken, setElevenlabsToken] = useState<string | undefined>(undefined)
  const [speak, setSpeak] = useState<boolean>(chatSpeakPreference != null ? chatSpeakPreference : true)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // GraphQL
  const { refetch: fetchChatMessages } =
    useQuery<any>(getChatMessagesQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  function getChatBoxHeight() {

    var height = 58

    // Alert
    if (alertSeverity != null &&
        message != null) {

      height -= 6
    }

    /* Quick responses
    if (myTurn === true && messages.length === 0) {
      height -= 6
    } */

    return `${height}vh`
  }

  async function getChatMessages() {

    // Get project
    const { data } = await
      fetchChatMessages({
        chatSessionId: chatSession.id,
        userProfileId: userProfileId
      })

    const results = data.getChatMessages

    if (results != null) {

      // Deserialize contents
      var thisMessages: any[] = []

      for (const message of results.chatMessages) {

        var thisMessage = message
        thisMessage.contents = JSON.parse(message.message)

        thisMessages.push(thisMessage)
      }

      setMessages(thisMessages)
    }
  }

  const handleJoinChatSession = () => {

    // console.log(`Sending joinChatSession message..`)

    socket.emit('joinChatSession', {
      chatSessionId,
      chatSessionToken,
      userProfileId
    })
  }

  const handleSendMessage = (inputMessage = '') => {

    // Stop further input until a reply is given
    setMyTurn(false)

    // Whitespace trimmed message
    var prepMyMessage: string

    if (inputMessage !== '') {
      prepMyMessage = inputMessage.trim()
    } else {
      prepMyMessage = myMessage.trim()
    }

    // Emit a 'message' event to the server
    socket.emit('message', {
      generationsConfigId: generationsConfigId,
      sentByAi: false,
      chatSessionId: chatSessionId,
      chatParticipantId: chatParticipant.id,
      userProfileId: userProfileId,
      name: chatParticipant.name,
      contents: [{
        type: '',
        text: prepMyMessage
      }]
    })

    setLastMyMessage(prepMyMessage)
    setMyMessage('')  // Clear the message input field after sending the message
  }

  const handleSendMessageAndTextboxFocus = (inputMessage = '') => {
    handleSendMessage(inputMessage)
    myMessageInput.current.focus()
  }

  function setTipsVisible() {

    if (showInputTip != null) {

      if (messages.length === 0) {
        setShowInputTip(true)
      } else if (showInputTip === true &&
        messages.length > 0) {

        setShowInputTip(false)
      }
    }

    if (messages.length > 0 &&
      showNextTip === false) {
      setShowNextTip(true)
    }
  }

  // Handle received messages from the server
  useEffect(() => {
    const handleMessage = (newMessage: any) => {

      if (!newMessage) return

      if (newMessage.contents?.[0]?.type === 'error') {
        setAlertSeverity('error')
        setMessage(newMessage.contents[0].text)

        // Revert last message safely using functional update
        setMessages(prevMessages => prevMessages.slice(0, prevMessages.length - 1))

        // Reset input
        setMyMessage(lastMyMessage)

        // Allow user to try again
        setMyTurn(true)
      } else {
        setAlertSeverity(undefined)

        // Append new message safely
        setMessages(prevMessages => prevMessages.concat(newMessage))

        if (newMessage.sentByAi === true) {
          setMyTurn(true)
        }
      }

      // Update raw JSON if present
      if (newMessage.rawJson != null) {
        setChatRawJson(newMessage.rawJson)
      }
    }

    socket.on('message', handleMessage)

    // Cleanup listener on unmount
    return () => {
      socket.off('message', handleMessage)
    }
  }, [lastMyMessage, setChatRawJson])  // include deps you use inside the effect

  useEffect(() => {
    const handler = (data: ArrayBuffer) => {

      // Fade out and stop any existing audio
      if (audioRef != null) {

        elevenLabsClientService.fadeOutAndStop(
          audioRef.current)
      }

      // Get blob with data
      const blob = new Blob([data], { type: 'audio/mpeg' })

      // Play segment's audio
      const play = async () => {
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(URL.createObjectURL(blob))
          audioRef.current = audio

          audio.addEventListener('ended', () => resolve(), { once: true })
          audio.addEventListener('error', (e) => reject(e), { once: true })

          audio.play().catch(reject)
        })
      }

      // Async call
      const result = play()
        .catch(console.error)
    }

    socket.on('audio (mp3)', handler)

    // Cleanup to remove listener when component unmounts
    return () => {
      socket.off('audio (mp3)', handler)
    }
  }, [])  // attach once

  // chatSessionJoined
  useEffect(() => {
    const handleJoined = (chatSessionId: string) => {
      setIsAuthorized(true)
      // Additional logic if needed
    }

    socket.on('chatSessionJoined', handleJoined)

    return () => {
      socket.off('chatSessionJoined', handleJoined)
    }
  }, [])  // attach once

  // authorizationFailed
  useEffect(() => {
    const handleFailed = () => {
      setIsAuthorized(false)
      // Additional logic if needed
    }

    socket.on('authorizationFailed', handleFailed)

    return () => {
      socket.off('authorizationFailed', handleFailed)
    }
  }, [])  // attach once

  /* Note: wrap these in useEffects if uncommented (see others)
  socket.on('connection', (socket) => {
    // console.log(socket.id)
    console.log('connected')
  })

  socket.on('disconnect', () => {
    console.log(socket.id)  // undefined
  })

  socket.on('data', () => {
    console.log(socket.id)  // undefined
  }) */

  // Effects
  // Startup
  useEffect(() => {

    const fetchData = async () => {

      // Get chat messages
      await getChatMessages()
    }

    // Find and set the chatParticipant
    for (const thisChatParticipant of chatSession.chatParticipants) {

      if (thisChatParticipant.userProfileId === userProfileId) {
        setChatParticipant(thisChatParticipant)
        // console.log(`chatParticipant: ${JSON.stringify(thisChatParticipant)}`)
      }
    }

    // Get async results
    const result = fetchData()
      .catch(console.error)

    // Join chat session
    handleJoinChatSession()

    // Autofocus
    if (myMessageInput.current) {
      myMessageInput.current.focus()
    }
  }, [])

  useEffect(() => {
    setChatHeight(getChatBoxHeight())
    setTipsVisible()
  }, [alertSeverity, messages])

  // Render
  return (
    <>
      <div style={{
        border: '1px solid #888',
        padding: '0.5em',
        height: chatHeight,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>

        {/* <p>chatSession: {JSON.stringify(chatSession)}</p> */}

        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatSessionMessages
            messages={messages}
            myTurn={myTurn}
            userProfileId={userProfileId} />
        </div>

        <>
          {alertSeverity && message ?
            <Alert
              severity={alertSeverity}
              style={{ marginBottom: '2em' }}>
              {message}
            </Alert>
            :
            <></>
          }
        </>

        <div style={{ flexShrink: 0 }}>
          <TextareaAutosize
            autoComplete='off'
            autoFocus
            minRows={2}
            onChange={(e) => setMyMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && myTurn === false) {
                e.preventDefault()
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Enter' && myTurn === true) {

                if (e.shiftKey || e.ctrlKey) {
                  setMyMessage(myMessage + '\n')
                } else {
                  handleSendMessage()
                }
              }
            }}
            ref={myMessageInput}
            style={{ border: '1px solid #ccc', marginRight: '0.5em', verticalAlign: 'top', width: '80%' }}
            value={myMessage} />

          <div>
            <div style={{ display: 'inline-block' }}>
              <StreamMicComponent
                token={elevenlabsToken}
                text={myMessage}
                setText={setMyMessage}
                myMessageInput={myMessageInput}
                setToken={setElevenlabsToken} />
            </div>

            <div style={{ display: 'inline-block', marginLeft: '1em' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={speak}
                    onChange={(e) => setSpeak(e.target.checked)}
                    size='small' />
                }
                label='Speak'
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} />
            </div>

            <Button
              disabled={!myTurn}
              onClick={(e) => { handleSendMessage() }}
              style={{ display: 'inline-block', verticalAlign: 'top' }}>
              Send
            </Button>
          </div>
        </div>
      </div>

      <CreateElevenLabsToken
        userProfileId={userProfileId}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        token={elevenlabsToken}
        setToken={setElevenlabsToken} />

      <SaveSpeakPreference
        userProfileId={userProfileId}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        speak={speak} />
    </>
  )
}
