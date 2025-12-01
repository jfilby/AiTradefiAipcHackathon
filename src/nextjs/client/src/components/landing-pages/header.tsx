import React from 'react'
import { Typography } from '@mui/material'

interface Props {
}

export default function LaunchedHeader({}: Props) {

  // Render
  return (
    <>
      <h1 style={{ display: 'flex' }}>
        {/* <Bot1Svg width={40} height={45} /> */}
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>

      <Typography variant='body2' style={{ marginTop: '-1em', marginBottom: '2em' }}>
        {process.env.NEXT_PUBLIC_TAG_LINE}
      </Typography>
    </>
  )
}
