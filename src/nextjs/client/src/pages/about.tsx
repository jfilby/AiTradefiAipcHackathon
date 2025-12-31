import Head from 'next/head'
import React from 'react'
import { Link, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layouts/layout'
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

          <div style={{ marginBottom: '5em' }}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h3'>
              AI Partner Catalyst Hackathon
            </Typography>
            <Typography variant='body1'>
              This project was developed for the{' '}
              <Link href='https://ai-partner-catalyst.devpost.com/'>AI Partner Catalyst Hackathon</Link>{' '}
              with a focus on the ElevenLabs track.
              <br/>
              <br/>
              See AiTradefi's{' '}
              <Link href='https://devpost.com/software/aitradefi'>project page</Link>{' '}
              or watch the{' '}
              <Link href='https://youtu.be/QxWF89SPePE'>demo video</Link>.
            </Typography>
          </div>

          <div>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h3'>
              Team
            </Typography>
            <Typography variant='body1'>
              The founder is Jason Filby (X:&nbsp;
              <Link href='https://x.com/jasonfi'>@jasonfi</Link>).
            </Typography>
          </div>
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
