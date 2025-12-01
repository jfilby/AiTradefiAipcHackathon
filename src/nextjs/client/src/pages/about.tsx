import Head from 'next/head'
import React from 'react'
import Typography from '@mui/material/Typography'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layouts/layout'
import LaunchedDetails from '@/components/landing-pages/launched-details'
import LaunchedHeader from '@/components/landing-pages/header'

interface Props {
  userProfile: any
}

export default function AboutPage({ userProfile }: Props) {

  // Consts
  const url = `/about`

  // Render
  return (
    <>
      <Head><title>{process.env.NEXT_PUBLIC_APP_NAME} - About</title></Head>

      <Layout userProfile={userProfile}>

        <div style={{ margin: '0 auto', width: pageBodyWidth, textAlign: 'left', verticalAlign: 'textTop' }}>

          <LaunchedHeader />

          <LaunchedDetails />

          <div>
            <Typography variant='h5'>
              Team
            </Typography>
            <Typography variant='body1'>
              The founder is Jason Filby (X:&nbsp;
              <a href='https://x.com/jasonfi'>@jasonfi</a>).
            </Typography>
          </div>
          <br />
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {})
}
