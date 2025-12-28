import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

// Class
export class ElevenLabsApiKeyService {

  // Consts
  clName = 'ElevenLabsApiKeyService'

  // Code
  async check() {

    // Check each key
    for (let i = 1; i <= 10; i++) {

      const apiKey = process.env[`ELEVENLABS_API_KEY_${i}`]

      if (apiKey == null ||
          apiKey.length === 0) {

        return
      }

      await this.checkApiKey(apiKey)
    }
  }

  async checkApiKey(apiKey: string) {

    // Debug
    const fnName = `${this.clName}.checkApiKey()`

    console.log(`${fnName}: checking api key: ${apiKey}`)

    // Client
    const client = new ElevenLabsClient({
      apiKey: apiKey
    })
    
    // Get subscription
    var subscription: any = undefined

    try {
      subscription = await client.user.subscription.get()
    } catch(e) {
      console.log(`${fnName}: can't check subscription for key`)
      return
    }

    // Debug
    console.log(`${fnName}: subscription: ` + JSON.stringify(subscription))
  }
}
