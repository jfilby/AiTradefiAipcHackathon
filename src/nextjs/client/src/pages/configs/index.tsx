import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Button, Typography } from '@mui/material'
import ListConfigs from '@/components/configs/list'
import LoadConfigsByFilter from '@/components/configs/load-by-filter'

interface Props {
  userProfile: any
  instance: any
}

export default function ConfigsPage({
                          userProfile,
                          instance
                        }: Props) {

  // Consts
  const createUrl = `/configs/create`

  // State
  const [generationsConfigs, setGenerationsConfigs] = useState<any>(undefined)
  const [loaded, setLoaded] = useState<boolean>(false)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Configs</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p> */}

          <div style={{ display: 'inline-block', width: '80%' }}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h3'>
              Configs
            </Typography>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'right', width: '20%' }}>
            <Button
              onClick={(e) => window.location.href = createUrl}
              variant='contained'>
              Create
            </Button>
          </div>

          <ListConfigs
            userProfileId={userProfile.id}
            instanceId={undefined}
            generationsConfigs={generationsConfigs} />
        </div>

        <LoadConfigsByFilter
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
