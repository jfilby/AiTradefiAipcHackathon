const crypto = require('crypto')
import { writeFileSync } from 'fs'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ElevenLabsTypes } from '@/shared/types/elevenlabs-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { TextToSpeechConvertRequestOutputFormat } from '@elevenlabs/elevenlabs-js/api'

// Clients
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generatedAudioModel = new GeneratedAudioModel()

// Class
export class ElevenLabsService {

  // Consts
  clName = 'ElevenLabsService'

  // Code
  async generateToken(
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.generateToken()`

    // Validate
    if (process.env.ELEVENLABS_API_KEY == null) {
      throw new CustomError(
        `${fnName}: process.env.ELEVENLABS_API_KEY == null`)
    }

    // Request a token
    const response = await fetch(
      'https://api.elevenlabs.io/v1/single-use-token/realtime_scribe',
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      })

    const data = await response.json()

    // Debug
    console.log(`${fnName}: data: ` + JSON.stringify(data))

    // Return
    return {
      status: true,
      token: data.token
    }
  }

  async generateTTS(
          voiceName: string,
          text: string,
          relativePath: string,
          outputFormat: string = ElevenLabsTypes.defaultOutputFormat) {

    // Debug
    const fnName = `${this.clName}.generateTTS()`

    // Get voice by name
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getByName(
              prisma,
              voiceName)

    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // Does a record already exist?
    var generatedAudio = await
          generatedAudioModel.getByUniqueKey(
            prisma,
            relativePath)

    if (generatedAudio != null) {

      console.log(`${fnName}: GeneratedAudio record already exists`)
      return
    }

    // TTS API call
    const stream = await client.textToSpeech.convert(
      elevenLabsVoice.voiceId,
      {
        text: text,
        modelId: 'eleven_turbo_v2',
        outputFormat: outputFormat as TextToSpeechConvertRequestOutputFormat,
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
        },
      })

    // Debug

    // Convert ReadableStream to Buffer
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))

    // Save to file
    const filename = `${process.env.BASE_DATA_PATH}${relativePath}`
    writeFileSync(filename, buffer)

    // Upsert GeneratedAudio record
    generatedAudio = await
      generatedAudioModel.upsert(
        prisma,
        undefined,  // id
        BaseDataTypes.activeStatus,
        elevenLabsVoice.id,
        outputFormat,
        text,
        relativePath)

    // Debug
    console.log(`${fnName}: saved to: ${filename}`)
  }

  async getVoices() {

    // Debug
    const fnName = `${this.clName}.getVoices()`

    // API call
    const voicesList = await client.voices.search({})

    // Print results
    console.log(`${fnName}: voices list: ` +
                JSON.stringify(voicesList.voices))

    console.log(`${fnName}: more results?: ` +
                JSON.stringify(voicesList.hasMore))
  }

  async saveVoices(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getVoices()`

    // API call
    const voicesList = await client.voices.search({})

    // Save results
    for (const voice of voicesList.voices) {

      const elevenLabsVoice = await
              elevenLabsVoiceModel.upsert(
                prisma,
                undefined,  // id
                voice.voiceId,
                BaseDataTypes.activeStatus,
                voice.name,
                voice.category,
                voice.description,
                voice.previewUrl,
                voice.highQualityBaseModelIds)
    }
  }

  async setup(prisma: PrismaClient) {

    await this.saveVoices(prisma)
  }
}
