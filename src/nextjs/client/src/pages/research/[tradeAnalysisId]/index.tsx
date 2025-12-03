import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import LoadTradeAnalysisById from '@/components/trade-analyses/load-by-id'
import ViewTradeAnalysis from '@/components/trade-analyses/view'

interface Props {
  userProfile: any
  instance: any
  tradeAnalysisId: string
}

export default function TradeAnalysisPage({
                          userProfile,
                          instance,
                          tradeAnalysisId
                        }: Props) {

  // State
  const [tradeAnalysis, setTradeAnalysis] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Trade analysis</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h4'>
            Stock research
          </Typography>

          <ViewTradeAnalysis
            instanceId={undefined}
            tradeAnalysis={tradeAnalysis} />
        </div>

        <LoadTradeAnalysisById
          userProfileId={userProfile.id}
          tradeAnalysisId={tradeAnalysisId}
          setTradeAnalysis={setTradeAnalysis} />

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
