import React from 'react'
import { Button, Typography } from '@mui/material'

interface Props {
  authSession: any
}

// Put into its own component to make loading without flashing signed-out/
// signed-in details
export default function GettingStartedDetails({
                          authSession
                        }: Props) {

  // Render
  return (
    <>
      <div style={{ marginBottom: '2em' }}/>
      <h1>Save your work by signing-up</h1>

      <div style={{ marginBottom: '2em' }}>
        {authSession == null ?
          <>
            <Button
              onClick={(e: any) => window.location.href = `account/auth/sign-up`}
              variant='contained'>
              Sign-up
            </Button>
            <Button
              style={{ marginLeft: '1em' }}
              onClick={(e: any) => window.location.href = `account/auth/sign-in`}
              variant='contained'>
              Sign-in
            </Button>
          </>
        :
          <></>
        }

        {authSession != null ?
          <Button
            style={{ marginLeft: '1em' }}
            onClick={(e: any) => window.location.href = `/projects`}
            variant='contained'>
            My projects
          </Button>
        :
          <></>
        }
        {/* <Button
          style={{ marginLeft: '1em' }}
          onClick={(e: any) => window.location.href = `/account/subscription`}
          variant='contained'>
          Pricing
        </Button> */}
      </div>

      {/* {authSession == null ?
        <Typography
          style={{ marginBottom: '1em' }}
          variant='body1'>
          You need to sign-in to access your projects.
        </Typography>
      :
        <></>
      } */}
    </>
  )
}
