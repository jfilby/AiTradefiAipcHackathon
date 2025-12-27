import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import ListSlideshows from '@/components/slideshows/list'
import LoadSlideshowsByFilter from '@/components/slideshows/load-by-filter'
import LoadLatestTradeAnalyses from '@/components/trade-analyses-groups/load-by-latest'

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
  const [slideshowsInNewStatus, setSlideshowsInNewStatus] = useState<number | undefined>(undefined)

  const [tradeAnalysesGroups, setTradeAnalysesGroups] = useState<any>(undefined)
  const [tradeAnalysesGroupsInNewStatus, setTradeAnalysesGroupsInNewStatus] = useState<number | undefined>(undefined)

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
              style={{ marginBottom: '1em' }}
              variant='h3'>
              Slideshows
            </Typography>
          </div>

          {slideshowsInNewStatus != null &&
           slideshowsInNewStatus > 0 ?
            <Typography
              style={{ marginBottom: '2em' }}
              variant='body1'>
              {slideshowsInNewStatus} slideshows being generated for you..
            </Typography>
          :
            <></>
          }

          {tradeAnalysesGroupsInNewStatus != null &&
           tradeAnalysesGroupsInNewStatus > 0 ?
            <Typography
              style={{ marginBottom: '2em' }}
              variant='body1'>
              {tradeAnalysesGroupsInNewStatus} results being generated for you..
            </Typography>
          :
            <></>
          }

          <ListSlideshows
            userProfileId={userProfile.id}
            instanceId={undefined}
            slideshows={slideshows}
            readonly={false} />
        </div>

        <LoadSlideshowsByFilter
          userProfileId={userProfile.id}
          setSlideshows={setSlideshows}
          setInNewStatus={setSlideshowsInNewStatus} />

        <LoadLatestTradeAnalyses
          userProfileId={userProfile.id}
          instanceId={undefined}
          setTradeAnalysesGroups={setTradeAnalysesGroups}
          setInNewStatus={setTradeAnalysesGroupsInNewStatus} />

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
