import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListTradeAnalysesGroups from '@/components/trade-analyses-groups/list'
import LoadLatestTradeAnalyses from '@/components/trade-analyses-groups/load-by-latest'

interface Props {
  userProfile: any
  instance: any
}

export default function LatestResearchPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [tradeAnalysesGroups, setTradeAnalysesGroups] = useState<any[]>([])
  const [inNewStatus, setInNewStatus] = useState<number | undefined>(undefined)

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
            style={{ marginBottom: '1em' }}
            variant='h3'>
            Latest stock research
          </Typography>

          {inNewStatus != null &&
           inNewStatus > 0 ?
            <Typography
              style={{ marginBottom: '2em' }}
              variant='body1'>
              {inNewStatus} result groups being generated for you..
            </Typography>
          :
            <></>
          }

          <ListTradeAnalysesGroups
            instanceId={undefined}
            tradeAnalysesGroups={tradeAnalysesGroups} />
        </div>

        <LoadLatestTradeAnalyses
          userProfileId={userProfile.id}
          instanceId={undefined}
          setTradeAnalysesGroups={setTradeAnalysesGroups}
          setInNewStatus={setInNewStatus} />

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
