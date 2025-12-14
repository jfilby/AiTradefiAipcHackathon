import Head from 'next/head'
import { useEffect, useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
// import EditSlide from '@/components/slide/edit'
import LoadSlideshowById from '@/components/slideshows/load-by-id'
import PlaySlide from '@/components/slides/play'
// import SaveSlide from '@/components/slide/save'

interface Props {
  userProfile: any
  instance: any
  slideshowId: string
}

export default function ViewSlideshowPage({
                          userProfile,
                          instance,
                          slideshowId
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [slideshow, setSlideshow] = useState<any>(undefined)
  const [slide, setSlide] = useState<any>(undefined)
  const [firstSlide, setFirstSlide] = useState<any>(undefined)

  const [loaded, setLoaded] = useState<boolean>(false)
  const [saveAction, setSaveAction] = useState<boolean>(false)

  // Effects
  useEffect (() => {

    if (slideshow != null &&
        slideshow.slides.length > 0) {

      setFirstSlide(slideshow.slides[0])
      setSlide(slideshow.slides[0])

    } else {
      setFirstSlide(undefined)
      setSlide(undefined)
    }

  }, [slideshow])

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Slide</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p>
          <p>slideshow: {JSON.stringify(slideshow)}</p> */}

          {slide != null &&
           loaded === true ?
            <PlaySlide
              userProfileId={userProfile.id}
              instanceId={undefined}
              slideshow={slideshow}
              slide={slide}
              setSlide={setSlide} />
          :
            <></>
          }
        </div>

        <LoadSlideshowById
          userProfileId={userProfile.id}
          slideshowId={slideshowId}
          setSlideshow={setSlideshow}
          setLoaded={setLoaded} />

        {/* <SaveSlide
          userProfileId={userProfile.id}
          instanceId={undefined}
          slide={slide}
          isAdd={false}
          setAlertSeverity={setAlertSeverity}
          setMessage={setMessage}
          saveAction={saveAction}
          setSaveAction={setSaveAction}
          setEditMode={undefined}
          redirectToIndexOnSave={true} /> */}

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
