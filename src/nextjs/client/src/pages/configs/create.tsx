import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import EditConfig from '@/components/configs/edit'
import SaveConfig from '@/components/configs/save'

interface Props {
  userProfile: any
  instance: any
}

export default function CreateConfigPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [generationsConfig, setGenerationsConfig] = useState<any>({
    status: BaseDataTypes.activeStatus
  })

  const [saveAction, setSaveAction] = useState<boolean>(false)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Create config</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p> */}

          <div style={{ width: '100%' }}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h3'>
              Create Config
            </Typography>
          </div>

          <EditConfig
            userProfileId={userProfile.id}
            instanceId={undefined}
            alertSeverity={alertSeverity}
            setAlertSeverity={setAlertSeverity}
            message={message}
            setMessage={setMessage}
            generationsConfig={generationsConfig}
            setGenerationsConfig={setGenerationsConfig}
            setSaveAction={setSaveAction} />
        </div>
      </Layout>

      <SaveConfig
        userProfileId={userProfile.id}
        instanceId={undefined}
        generationsConfig={generationsConfig}
        isAdd={true}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setEditMode={undefined}
        redirectToIndexOnSave={true} />

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
