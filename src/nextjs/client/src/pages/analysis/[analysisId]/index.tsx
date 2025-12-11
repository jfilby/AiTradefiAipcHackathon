import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import EditAnalysis from '@/components/analyses/edit'
import LoadAnalysisById from '@/components/analyses/load-by-id'
import SaveAnalysis from '@/components/analyses/save'

interface Props {
  userProfile: any
  instance: any
  analysisId: string
}

export default function EditAnalysesPage({
                          userProfile,
                          instance,
                          analysisId
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [analysis, setAnalysis] = useState<any>({
    type: BaseDataTypes.screenerType,
    status: BaseDataTypes.activeStatus,
    instrumentType: BaseDataTypes.stocksType,
    defaultMinScore: 0.75
  })

  const [loaded, setLoaded] = useState<boolean>(false)
  const [saveAction, setSaveAction] = useState<boolean>(false)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Edit analysis</title>
      </Head>

      <Layout userProfile={userProfile}>

        <div style={{ textAlign: 'left', marginBottom: '2em' }}>

          {/* <p>userProfileId: {userProfile.id}</p>
          <p>analysis: {JSON.stringify(analysis)}</p> */}

          <div style={{ width: '80%' }}>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h4'>
              Edit Analysis
            </Typography>
          </div>

          {analysis != null &&
           loaded === true ?
            <EditAnalysis
              userProfileId={userProfile.id}
              instanceId={undefined}
              alertSeverity={alertSeverity}
              setAlertSeverity={setAlertSeverity}
              message={message}
              setMessage={setMessage}
              analysis={analysis}
              setAnalysis={setAnalysis}
              setLoadAction={undefined}
              setSaveAction={setSaveAction} />
          :
            <></>
          }
        </div>

        <LoadAnalysisById
          userProfileId={userProfile.id}
          instanceId={undefined}
          analysisId={analysisId}
          setAnalysis={setAnalysis}
          setLoaded={setLoaded} />

        <SaveAnalysis
          userProfileId={userProfile.id}
          instanceId={undefined}
          analysis={analysis}
          isAdd={false}
          setAlertSeverity={setAlertSeverity}
          setMessage={setMessage}
          saveAction={saveAction}
          setSaveAction={setSaveAction}
          setEditMode={undefined}
          redirectToIndexOnSave={true} />

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
