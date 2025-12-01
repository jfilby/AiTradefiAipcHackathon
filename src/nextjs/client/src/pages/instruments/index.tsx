import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListInstruments from '@/components/instruments/list'
import LoadInstruments from '@/components/instruments/load-by-filter'

interface Props {
  userProfile: any
  instance: any
}

export default function InstrumentsPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [instruments, setInstruments] = useState<any[]>([])

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

          <ListInstruments
            instanceId={undefined}
            instruments={instruments} />
        </div>

        <LoadInstruments
          userProfileId={userProfile.id}
          instanceId={undefined}
          setInstruments={setInstruments} />

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
