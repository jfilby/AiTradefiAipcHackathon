import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import LoadInstrumentById from '@/components/instruments/load-by-id'
import ViewInstrument from '@/components/instruments/view'

interface Props {
  userProfile: any
  instance: any
  instrumentId: string
}

export default function InstrumentsPage({
                          userProfile,
                          instance,
                          instrumentId
                        }: Props) {

  // State
  const [instrument, setInstrument] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Stocks</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h4'>
            Stocks
          </Typography>

          <ViewInstrument
            instanceId={undefined}
            instrument={instrument} />
        </div>

        <LoadInstrumentById
          userProfileId={userProfile.id}
          instrumentId={instrumentId}
          setInstrument={setInstrument} />

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
