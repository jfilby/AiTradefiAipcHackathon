import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Chat, Publish, Unpublished } from '@mui/icons-material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import EditAnalysis from '@/components/analyses/edit'
import SaveAnalysis from '@/components/analyses/save'
import ChatDialog from '@/components/chats/chat-dialog'
import PublishDialog from '@/components/analyses/publish-dialog'
import UnpublishDialog from '@/components/analyses/unpublish-dialog'

interface Props {
  userProfile: any
  instance: any
}

export default function CreateAnalysesPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [analysis, setAnalysis] = useState<any>({
    type: BaseDataTypes.screenerType,
    status: BaseDataTypes.newStatus,
    instrumentType: BaseDataTypes.stocksType,
    defaultMinScore: 0.75
  })

  const [saveAction, setSaveAction] = useState<boolean>(false)

  const [showChat, setShowChat] = useState<boolean>(false)
  const [chatSession, setChatSession] = useState<string | undefined>(undefined)
  const [chatRawJson, setChatRawJson] = useState<any>(undefined)
  const [analysisRefreshed, setAnalysisRefreshed] = useState<boolean>(false)

  const [publishOpen, setPublishOpen] = useState<boolean>(false)
  const [unpublishOpen, setUnpublishOpen] = useState<boolean>(false)

  // Effects
  useEffect(() => {

    // Skip if not set
    if (chatRawJson == null) {
      return
    }

    // Update the Analysis data from chat JSON
    if (chatRawJson.name != null) {
      analysis.name = chatRawJson.name
    }

    if (chatRawJson.description != null) {
      analysis.description = chatRawJson.description
    }

    if (chatRawJson.prompt != null) {
      analysis.prompt = chatRawJson.prompt
    }

    // Put new field values into effect
    setAnalysis(analysis)
    setAnalysisRefreshed(true)

  }, [chatRawJson])

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Create analysis</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p> */}

          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Typography
                style={{ marginBottom: '0.5em' }}
                variant='h3'>
                Create Analysis
              </Typography>
            </div>

            <div style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>

              {analysis.status === BaseDataTypes.activeStatus ?
                <div style={{ display: 'inline-block' }}>
                  <LabeledIconButton
                    icon={Unpublished}
                    label='Unpublish'
                    onClick={() => setUnpublishOpen(true)} />
                </div>
              :
                <div style={{ display: 'inline-block' }}>
                  <LabeledIconButton
                    icon={Publish}
                    label='Publish'
                    onClick={() => setPublishOpen(true)} />
                </div>
              }

              <div style={{ display: 'inline-block' }}>
                <LabeledIconButton
                  icon={Chat}
                  label='Chat'
                  onClick={() => setShowChat(true)}
                  style={{ marginLeft: '1em' }} />
              </div>
            </div>
          </div>

          <EditAnalysis
            userProfileId={userProfile.id}
            instanceId={undefined}
            alertSeverity={alertSeverity}
            setAlertSeverity={setAlertSeverity}
            message={message}
            setMessage={setMessage}
            analysis={analysis}
            setAnalysis={setAnalysis}
            setLoadAction={undefined}
            setSaveAction={setSaveAction}
            analysisRefreshed={analysisRefreshed}
            setAnalysisRefreshed={setAnalysisRefreshed} />
        </div>
      </Layout>

      <ChatDialog
        userProfileId={userProfile.id}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        open={showChat}
        setOpen={setShowChat}
        analysis={analysis}
        chatSession={chatSession}
        setChatSession={setChatSession}
        setChatRawJson={setChatRawJson} />

      <SaveAnalysis
        userProfileId={userProfile.id}
        instanceId={undefined}
        analysis={analysis}
        isEditPage={false}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction} />

      <PublishDialog
        open={publishOpen}
        setOpen={setPublishOpen}
        analysis={analysis}
        setAnalysis={setAnalysis}
        setSaveAction={setSaveAction} />

      <UnpublishDialog
        open={unpublishOpen}
        setOpen={setUnpublishOpen}
        analysis={analysis}
        setAnalysis={setAnalysis}
        setSaveAction={setSaveAction} />

    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {
             verifyAdminUsersOnly: false,
             verifyLoggedInUsersOnly: false
           })
}
