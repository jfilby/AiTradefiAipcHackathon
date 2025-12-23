export enum NarrationTones {
  analytical = 'analytical',
  calm = 'calm',
  confident = 'confident',
  emphasize = 'emphasize',
  excited = 'excited',
  neutral = 'neutral',
  slightlyExcited = 'slightly excited',
}

export interface ElevenLabsSettings {
  stability: number
  similarityBoost: number
  style?: number
  speed?: number
}

export class ElevenLabsDefaults {
  static defaultVoiceName = 'Sarah - Mature, Reassuring, Confident'
  static defaultOutputFormat = 'mp3_44100_128'

  static stability = 0.5
  static similarityBoost = 0.8
}

export const settingsByTone: Record<NarrationTones, ElevenLabsSettings> = {
  'analytical': {
    stability: 0.70,
    similarityBoost: 0.85,
    style: 0.25,
    speed: 0.95,
  },

  'calm': {
    stability: 0.80,
    similarityBoost: 0.85,
    style: 0.15,
    speed: 0.92,
  },

  'confident': {
    stability: 0.65,
    similarityBoost: 0.90,
    style: 0.45,
    speed: 1.0,
  },

  'emphasize': {
    stability: 0.50,
    similarityBoost: 0.80,
    style: 0.70,
    speed: 1.05,
  },

  'excited': {
    stability: 0.35,
    similarityBoost: 0.75,
    style: 0.85,
    speed: 1.1,
  },

  'neutral': {
    stability: 0.75,
    similarityBoost: 0.85,
    style: 0.20,
    speed: 1.0,
  },

  'slightly excited': {
    stability: 0.55,
    similarityBoost: 0.80,
    style: 0.55,
    speed: 1.03,
  },
}
