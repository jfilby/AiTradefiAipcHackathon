import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListSlideshows from '@/components/slideshows/list'
import LoadSlideshowsByFilter from '@/components/slideshows/load-by-filter'

interface Props {
  userProfile: any
  instance: any
}

export default function SlideshowsPage({
                          userProfile,
                          instance
                        }: Props) {

  // State
  const [slideshows, setSlideshows] = useState<any>(undefined)
  const [inNewStatus, setInNewStatus] = useState<number | undefined>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Slideshows</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p> */}

          <div>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h4'>
              Slideshows
            </Typography>
          </div>

          {inNewStatus != null &&
           inNewStatus > 0 ?
            <Typography
              style={{ marginBottom: '2em' }}
              variant='body1'>
              {inNewStatus} slideshows being generated for you..
            </Typography>
          :
            <></>
          }

          <ListSlideshows
            userProfileId={userProfile.id}
            instanceId={undefined}
            slideshows={slideshows} />
        </div>

        <LoadSlideshowsByFilter
          userProfileId={userProfile.id}
          setSlideshows={setSlideshows}
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
