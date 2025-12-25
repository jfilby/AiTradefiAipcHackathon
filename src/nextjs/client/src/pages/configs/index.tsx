import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import ListGenerationsConfigs from '@/components/generations-config/list'
import LoadGenerationsConfigByFilter from '@/components/generations-config/load-by-filter'

interface Props {
  userProfile: any
  instance: any
  slideshowId: string
}

export default function SettingsPage({
                          userProfile,
                          instance,
                          slideshowId
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [generationsConfigs, setGenerationsConfigs] = useState<any>(undefined)
  const [loaded, setLoaded] = useState<boolean>(false)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Settings</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>generationsConfig: {JSON.stringify(generationsConfig)}</p> */}

          {generationsConfigs != null ?
            <ListGenerationsConfigs
              userProfileId={userProfile.id}
              instanceId={undefined}
              generationsConfigs={generationsConfigs} />
          :
            <></>
          }
        </div>

        <LoadGenerationsConfigByFilter
          userProfileId={userProfile.id}
          setGenerationsConfigs={setGenerationsConfigs}
          setLoaded={setLoaded} />

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
