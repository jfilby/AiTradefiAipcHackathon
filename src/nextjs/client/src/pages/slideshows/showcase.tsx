import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListSlideshows from '@/components/slideshows/list'
import LoadSlideshowShowcaseByFilter from '@/components/slideshows/load-by-showcase'

interface Props {
  userProfile: any
  instance: any
}

export default function SlideshowShowcasePage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [slideshows, setSlideshows] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Slideshow showcase</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p>
          <p>slideshows: {JSON.stringify(slideshows)}</p> */}

          <div>
            <Typography
              style={{ marginBottom: '1em' }}
              variant='h3'>
              Slideshow showcase
            </Typography>
          </div>

          <ListSlideshows
            userProfileId={userProfile.id}
            instanceId={undefined}
            slideshows={slideshows}
            readonly={true} />
        </div>

        <LoadSlideshowShowcaseByFilter
          setSlideshows={setSlideshows} />

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
