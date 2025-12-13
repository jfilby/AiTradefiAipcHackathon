import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/db'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'

// Models
const generatedAudioModel = new GeneratedAudioModel()

// Function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { generatedAudioId } = req.query

  if (typeof generatedAudioId !== 'string') {
    return res.status(400).end('Invalid generatedAudioId')
  }

  // Get GeneratedAudio record
  const generatedAudio = await
          generatedAudioModel.getById(
            prisma,
            generatedAudioId)

  // Validate
  if (generatedAudio == null) {
    return res.status(400).end(`Invalid generatedAudioId`)
  }

  // Read the audio file
  const filename =
          `${process.env.BASE_DATA_PATH}${generatedAudio.relativePath}`

  const buffer = fs.readFileSync(filename)

  // Return file data
  res.setHeader('Content-Type', 'audio/mpeg')
  res.setHeader('Content-Length', buffer.length)
  res.setHeader('Cache-Control', 'no-store')

  res.status(200).send(buffer)
}
