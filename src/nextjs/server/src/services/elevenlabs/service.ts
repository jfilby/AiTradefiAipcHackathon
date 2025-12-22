import fs from 'fs'
import path from 'path'
import { writeFileSync } from 'fs'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { TextToSpeechConvertRequestOutputFormat } from '@elevenlabs/elevenlabs-js/api'
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { UserPreferenceModel } from '@/serene-core-server/models/users/user-preference-model'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ElevenLabsTypes } from '@/shared/types/elevenlabs-types'
import { UserPreferenceCategories, UserPreferenceKeys } from '@/types/server-only-types'
import { ElevenLabsVoiceModel } from '@/models/generated-media/elevenlabs-voice-model'
import { GeneratedAudioModel } from '@/models/generated-media/generated-audio-model'

// Clients
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})

// Models
const elevenLabsVoiceModel = new ElevenLabsVoiceModel()
const generatedAudioModel = new GeneratedAudioModel()
const userPreferenceModel = new UserPreferenceModel()

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

  async generateTtsBuffer(
          voiceId: string,
          text: string,
          outputFormat: string = ElevenLabsTypes.defaultOutputFormat) {

    // Debug
    const fnName = `${this.clName}.generateTtsBuffer()`

    // TTS API call
    const stream = await client.textToSpeech.convert(
      voiceId,
      {
        text: text,
        modelId: 'eleven_turbo_v2',
        outputFormat: outputFormat as TextToSpeechConvertRequestOutputFormat,
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
        },
      })

    // Convert ReadableStream to Buffer
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))

    // Return
    return buffer
  }

  async generateTts(
          prisma: PrismaClient,
          voiceName: string,
          text: string,
          outputFormat: string = ElevenLabsTypes.defaultOutputFormat) {

    // Debug
    const fnName = `${this.clName}.generateTts()`

    // Get voice by name
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getByName(
              prisma,
              voiceName)

    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // TTS
    const buffer = await
            this.generateTtsBuffer(
              elevenLabsVoice.voiceId,
              text,
              outputFormat) 

    // Return
    return {
      outputFormat: outputFormat,
      elevenLabsVoiceId: elevenLabsVoice.id,
      data: buffer
    }
  }

  async generateTtsAndSave(
          prisma: PrismaClient,
          voiceName: string,
          text: string,
          relativePath: string) {

    // Debug
    const fnName = `${this.clName}.generateTtsAndSave()`

    // Does a record already exist?
    var generatedAudio = await
          generatedAudioModel.getByUniqueKey(
            prisma,
            relativePath)

    if (generatedAudio != null) {

      console.log(`${fnName}: GeneratedAudio record already exists`)
      return {
        generatedAudio
      }
    }

    // Generate TTS
    const ttsResults = await
            this.generateTts(
              prisma,
              voiceName,
              text)

    // Determine filename
    const filename = `${process.env.BASE_DATA_PATH}${relativePath}`

    // Create required paths if needed
    const dir = path.dirname(filename)
    fs.mkdirSync(dir, { recursive: true })

    // Save to file
    writeFileSync(filename, ttsResults.data)

    // Upsert GeneratedAudio record
    generatedAudio = await
      generatedAudioModel.upsert(
        prisma,
        undefined,  // id
        BaseDataTypes.activeStatus,
        ttsResults.elevenLabsVoiceId,
        ttsResults.outputFormat,
        text,
        relativePath)

    // Debug
    console.log(`${fnName}: saved to: ${filename}`)

    // Return
    return generatedAudio
  }

  async generateTtsBufferIfEnabled(
          prisma: PrismaClient,
          userProfileId: string,
          voiceName: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.generateTtsBufferIfEnabled()`

    // Get speak preference
    const speakPreference = await
            this.getSpeakPreference(
              prisma,
              userProfileId)

    if (speakPreference == null ||
        speakPreference === false) {

      return undefined
    }

    // Get voice by name
    const elevenLabsVoice = await
            elevenLabsVoiceModel.getByName(
              prisma,
              voiceName)

    if (elevenLabsVoice == null) {
      throw new CustomError(`${fnName}: elevenLabsVoice == null`)
    }

    // TTS
    const buffer = await
            this.generateTtsBuffer(
              elevenLabsVoice.voiceId,
              text)

    // Return
    return buffer
  }

  async generateTtsFromChatMessagesIfEnabled(
          prisma: PrismaClient,
          userProfileId: string,
          textReplyData: any) {

    // Messages to text
    var text = ''

    for (const message of textReplyData.contents) {

      if (text.length > 0) {
        text += '\n'
      }

      text += message.text
    }

    // Generate TTS if enabled
    const buffer = await
            this.generateTtsBufferIfEnabled(
              prisma,
              userProfileId,
              ElevenLabsTypes.defaultVoiceName,
              text)

    // Return
    return buffer
  }

  async getSpeakPreference(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getSpeakPreference()`

    // Get UserPreference
    const userPreference = await
            userPreferenceModel.getByUniqueKey(
              prisma,
              userProfileId,
              UserPreferenceKeys.chatSpeakKey)

    // Debug
    console.log(`${fnName}: userPreference: ` + JSON.stringify(userPreference))

    // Validate
    if (userPreference == null) {
      return null
    }

    // If found
    return JSON.parse(userPreference.value)
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
    const fnName = `${this.clName}.saveVoices()`

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

  async upsertSpeakPreference(
          prisma: PrismaClient,
          userProfileId: string,
          enabled: boolean) {

    // Debug
    const fnName = `${this.clName}.upsertSpeakPreference()`

    // Validate
    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    if (enabled == null) {
      throw new CustomError(`${fnName}: enabled == null`)
    }

    // Upsert
    await userPreferenceModel.upsert(
            prisma,
            undefined,  // id
            userProfileId,
            UserPreferenceCategories.audioCategory,
            UserPreferenceKeys.chatSpeakKey,
            JSON.stringify(enabled),
            null)       // values

    // Return
    return {
      status: true
    }
  }
}
