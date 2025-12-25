import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import LoadGenerationsConfigById from '@/components/generations-config/load-by-id'
import SaveGenerationsConfig from '@/components/generations-config/save'
import EditGenerationsConfig from '@/components/generations-config/edit'

interface Props {
  userProfile: any
  instance: any
  generationsConfigId: string
}

export default function SettingsPage({
                          userProfile,
                          instance,
                          generationsConfigId
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [generationsConfig, setGenerationsConfig] = useState<any>(undefined)

  const [loaded, setLoaded] = useState<boolean>(false)
  const [saveAction, setSaveAction] = useState<boolean>(false)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Config</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>generationsConfig: {JSON.stringify(generationsConfig)}</p> */}

          {generationsConfig != null ?
            <EditGenerationsConfig
              userProfileId={userProfile.id}
              instanceId={undefined}
              alertSeverity={undefined}
              setAlertSeverity={undefined}
              message={undefined}
              setMessage={undefined}
              generationsConfig={generationsConfig}
              setGenerationsConfig={setGenerationsConfig}
              setSaveAction={setSaveAction} />
          :
            <></>
          }
        </div>

        <LoadGenerationsConfigById
          userProfileId={userProfile.id}
          generationsConfigId={generationsConfigId}
          setGenerationsConfig={setGenerationsConfig}
          setLoaded={setLoaded} />

        <SaveGenerationsConfig
          userProfileId={userProfile.id}
          instanceId={undefined}
          generationsConfig={generationsConfig}
          isAdd={false}
          setAlertSeverity={setAlertSeverity}
          setMessage={setMessage}
          saveAction={saveAction}
          setSaveAction={setSaveAction}
          setEditMode={undefined}
          redirectToIndexOnSave={true} />

      </Layout>
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
