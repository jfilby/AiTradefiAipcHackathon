import * as fs from 'node:fs'
import { CustomError } from '@/serene-core-server/types/errors'
import { GetTechService } from '../tech/get-tech-service'
import { GoogleGeminiImageService } from '@/serene-ai-server/services/llm-apis/google-gemini/image-api'

// Services
const getTechService = new GetTechService()
const googleGeminiImageService = new GoogleGeminiImageService()

// Class
export class CreateTestImageService {

  // Consts
  clName = 'CreateTestImageService'

  // Code
  async test() {

    // Debug
    const fnName = `${this.clName}.test()`

    // Prompt
    const prompt =
            `An NVDA symbol logo surrounded by dollars and question marks`

    // Get Tech
    const tech = await
            getTechService.getImageTech(prisma)

    // Generate an image
    const response = await
            googleGeminiImageService.generate(
              prompt,
              tech)

    // Validate
    if (response?.candidates == null) {
      throw new CustomError(`${fnName}: response.candidates == null`)
    }

    if (response.candidates.length < 1) {
      throw new CustomError(`${fnName}: no candidates`)
    }

    if (response?.candidates[0].content?.parts == null) {
      throw new CustomError(
        `${fnName}: response.candidates[0].content?.parts == null`)
    }

    // Save the image
    for (const part of response.candidates[0].content.parts) {

      if (part.text) {
        console.log(part.text)

      } else if (part.inlineData) {

        // Get image data
        const buffer = Buffer.from(
          part.inlineData.data as string,
          'base64')

        // Determine filename
        const filename =
                `${process.env.BASE_DATA_PATH}/images/nvda-test/logo.png`

        // Save image
        fs.writeFileSync(filename, buffer)
        console.log(`Image saved as: ${filename}`)
      }
    }
  }
}
