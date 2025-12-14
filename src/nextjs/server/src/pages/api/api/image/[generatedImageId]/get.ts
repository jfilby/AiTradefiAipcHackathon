import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/db'
import { GeneratedImageModel } from '@/models/generated-media/generated-image-model'

// Models
const generatedImageModel = new GeneratedImageModel()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { generatedImageId } = req.query

  if (typeof generatedImageId !== 'string') {
    return res.status(400).end('Invalid generatedImageId')
  }

  // Get GeneratedImage record
  const generatedImage = await generatedImageModel.getById(
    prisma,
    generatedImageId
  )

  // Validate
  if (generatedImage == null) {
    return res.status(400).end('Invalid generatedImageId')
  }

  // Read the image file
  const filename =
    `${process.env.BASE_DATA_PATH}${generatedImage.relativePath}`

  const buffer = fs.readFileSync(filename)

  // Return file data
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', buffer.length)
  res.setHeader('Cache-Control', 'no-store')

  res.status(200).send(buffer)
}
