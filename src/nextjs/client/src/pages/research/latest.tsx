import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListTradeAnalyses from '@/components/trade-analyses/list'
import LoadLatestTradeAnalyses from '@/components/trade-analyses/load-by-latest'

interface Props {
  userProfile: any
  instance: any
}

export default function LatestResearchPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [tradeAnalyses, setTradeAnalyses] = useState<any[]>([])

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Latest research</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>tradeAnalyses: {JSON.stringify(tradeAnalyses)}</p> */}

          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h4'>
            Stock research
          </Typography>

          <ListTradeAnalyses
            instanceId={undefined}
            tradeAnalyses={tradeAnalyses} />
        </div>

        <LoadLatestTradeAnalyses
          userProfileId={userProfile.id}
          instanceId={undefined}
          setTradeAnalyses={setTradeAnalyses} />

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
