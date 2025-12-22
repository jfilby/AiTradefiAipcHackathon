import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import LoadTradeAnalysisById from '@/components/trade-analyses/load-by-id'
import TradeAnalysisCard from '@/components/trade-analyses/card'

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
            style={{ marginBottom: '1em' }}
            variant='h3'>
            Stock research
          </Typography>

          <TradeAnalysisCard
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
