import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Button, Typography } from '@mui/material'
import ListAnalyses from '@/components/analyses/list'
import LoadAnalysesByFilter from '@/components/analyses/load-by-filter'

interface Props {
  userProfile: any
  instance: any
}

export default function AnalysesPage({
                          userProfile,
                          instance
                        }: Props) {

  // Consts
  const createUrl = `/analyses/create`

  // State
  const [analyses, setAnalyses] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Analyses</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p> */}

          <div style={{ display: 'inline-block', width: '80%' }}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h4'>
              Stock research
            </Typography>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'right', width: '20%' }}>
            <Button
              onClick={(e) => window.location.href = createUrl}
              variant='contained'>
              Create
            </Button>
          </div>

          <ListAnalyses
            instanceId={undefined}
            analyses={analyses} />
        </div>

        <LoadAnalysesByFilter
          userProfileId={userProfile.id}
          setAnalyses={setAnalyses} />

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
