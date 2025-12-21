export const typeDefs = `#graphql

  # Serene Core (types)
  # ---

  type ChatMessage {
    id: String!
    name: String!
    message: String!
    created: String!
    updated: String
  }

  type ChatMessageResults {
    status: Boolean!
    message: String
    chatMessages: [ChatMessage]
  }

  type ChatParticipant {
    id: String!
    userProfileId: String!
    name: String
  }

  type ChatParticipantResults {
    status: Boolean!
    message: String
    chatParticipants: [ChatParticipant]
  }

  type ChatSession {
    id: String!
    status: String!
    updated: String!
    chatParticipants: [ChatParticipant]
  }

  type ChatSessionResults {
    status: Boolean!
    message: String
    chatSession: ChatSession

    chatSpeakPreference: Boolean
  }

  type Comment {
    id: String!
    url: String!
    text: String!
  }

  type ExistsResults {
    status: Boolean!
    message: String
    exists: Boolean
  }

  type Instance {
    id: String!
    userProfile: UserProfile!
    parentId: String
    instanceType: String
    projectType: String
    status: String!
    name: String!

    parent: Instance
  }

  type StatusAndMessage {
    status: Boolean!
    message: String
  }

  type StatusAndMessageAndId {
    status: Boolean!
    message: String
    id: String
  }

  type Tip {
    id: String!
    name: String!
    tags: [String]
  }

  type TipsResults {
    status: Boolean!
    message: String
    tips: [Tip]
  }

  type User {
    id: String!
    name: String
  }

  type UserPreference {
    category: String!
    key: String!
    value: String
    values: [String]
  }

  type UserProfile {
    id: String!
    userId: String
    user: User
    isAdmin: Boolean!
  }

  # AiTradefi (types)
  # ---

  type Analysis {
    id: String!
    type: String!
    status: String!
    instrumentType: String!
    defaultMinScore: Float!
    name: String!
    description: String
    prompt: String
    created: String!
    updated: String!
  }

  type AnalysisResults {
    status: Boolean!
    message: String
    analysis: Analysis
  }

  type AnalysesResults {
    status: Boolean!
    message: String
    analyses: [Analysis]
  }

  type Exchange {
    id: String!
    name: String!
  }

  type GenerationsSettingsListItem {
    id: String!
    publiclyShared: Boolean!
    name: String!
  }

  type GenerationsSettingsListResults {
    status: Boolean!
    message: String
    generationsSettingsList: [GenerationsSettingsListItem]
  }

  type Instrument {
    id: String!
    exchange: Exchange!
    name: String!
    type: String!
    created: String!
  }

  type InstrumentResults {
    status: Boolean!
    message: String
    instrument: Instrument
  }

  type InstrumentsResults {
    status: Boolean!
    message: String
    instruments: [Instrument]
  }

  type ServerStartData {
    status: Boolean!
    message: String
    instance: Instance
    chatSession: ChatSession
  }

  type Slide {
    id: String!
    status: String!
    title: String!
    text: String
    slideNo: Int!
    generatedAudioId: String
    generatedImageId: String

    isTextSlide: Boolean!
    annualFinancials: String
    quarterlyFinancials: String
    dailyChart: String
  }

  type Slideshow {
    id: String!
    userProfileId: String!
    tradeAnalysisId: String!
    status: String!

    slides: [Slide]
  }

  type SlideshowResults {
    status: Boolean!
    message: String
    slideshow: Slideshow
  }

  type SlideshowsResults {
    status: Boolean!
    message: String
    slideshows: [Slideshow]

    inNewStatus: Int
  }

  type TokenResults {
    status: Boolean!
    message: String
    token: String
  }

  type TradeAnalysesGroup {
    id: String
    analysis: Analysis!
    day: String!
    ofTradeAnalyses: [TradeAnalysis]
  }

  type TradeAnalysis {
    id: String
    tradeAnalysesGroupId: String!
    instrument: Instrument!
    score: Float!
    thesis: String!
    created: String
    updated: String
  }

  type TradeAnalysisResults {
    status: Boolean!
    message: String
    tradeAnalysis: TradeAnalysis
  }

  type TradeAnalysesGroupResults {
    status: Boolean!
    message: String
    tradeAnalysesGroup: TradeAnalysesGroup
  }

  type TradeAnalysesGroupsResults {
    status: Boolean!
    message: String
    tradeAnalysesGroups: [TradeAnalysesGroup]

    inNewStatus: Int
  }

  type UpsertInstanceResults {
    status: Boolean!
    message: String
    instanceId: String
  }

  # Queries
  # ---

  type Query {

    # Serene Core
    # ---

    # Chats
    getChatMessages(
      chatSessionId: String,
      userProfileId: String!,
      lastMessageId: String): ChatMessageResults!

    getChatParticipants(
      chatSessionId: String,
      userProfileId: String!): ChatParticipantResults!

    getChatSession(
      chatSessionId: String,
      userProfileId: String!): ChatSessionResults!

    getChatSessions(
      status: String,
      userProfileId: String!): [ChatSession]

    # Profile
    validateProfileCompleted(
      forAction: String!,
      userProfileId: String!): StatusAndMessage!

    # Tips
    getTipsByUserProfileIdAndTags(
      userProfileId: String!,
      tags: [String]): TipsResults!

    tipGotItExists(
      name: String!,
      userProfileId: String!): ExistsResults!

    # Users
    isAdminUser(userProfileId: String!): StatusAndMessage!
    userById(userProfileId: String!): UserProfile
    verifySignedInUserProfileId(userProfileId: String!): Boolean

    # User preferences
    getUserPreferences(
      userProfileId: String!,
      category: String!,
      keys: [String]): [UserPreference]

    # AiTradefi
    # ---

    # Analyses
    getAnalysisById(
      userProfileId: String!,
      instanceId: String,
      analysisId: String!): AnalysisResults!
    getAnalyses(
      userProfileId: String!,
      instanceId: String,
      instrumentType: String): AnalysesResults!

    # Generations settings
    getGenerationsSettingsList(
      userProfileId: String!): GenerationsSettingsListResults!

    # Instances
    filterInstances(
      instanceType: String,
      projectType: String,
      parentId: String,
      status: String,
      userProfileId: String!): [Instance]

    filterProjectInstances(
      parentId: String,
      userProfileId: String!
      instanceType: String,
      projectType: String,
      status: String): [Instance]

    instanceById(
      id: String!,
      userProfileId: String!,
      includeParent: Boolean,
      includeInstanceRefs: Boolean,
      includeStats: Boolean): Instance

    # instanceSharedGroups(
    #   id: String!,
    #   userProfileId: String!): [InstanceSharedGroups]
    #
    # instancesSharedPublicly: [InstanceSharedGroups]

    # Instruments
    getInstrumentById(instrumentId: String): InstrumentResults
    getInstruments(type: String): InstrumentsResults

    # Slideshows
    getSlideshowById(
      userProfileId: String!,
      instanceId: String,
      slideshowId: String!): SlideshowResults!
    getSlideshows(
      userProfileId: String!,
      instanceId: String,
      analysisId: String): SlideshowsResults!

    # Trade analyses
    getTradeAnalysisById(
      userProfileId: String!,
      instanceId: String,
      tradeAnalysisId: String!): TradeAnalysisResults!

    getTradeAnalysesGroupById(
      userProfileId: String!,
      instanceId: String,
      tradeAnalysesGroupId: String): TradeAnalysesGroupResults!

    getLatestTradeAnalysesGroups(
      userProfileId: String!,
      instanceId: String,
      instrumentType: String): TradeAnalysesGroupsResults!
  }

  type Mutation {

    # Serene Core
    # ---

    # Analysis
    upsertAnalysis(
      id: String,
      userProfileId: String!,
      type: String!,
      status: String!,
      instrumentType: String!
      defaultMinScore: Float!,
      name: String!,
      description: String!,
      prompt: String!): StatusAndMessage!

    # Users
    createBlankUser: UserProfile!
    createUserByEmail(email: String!): UserProfile!
    deactivateUserProfileCurrentIFile(id: String!): Boolean
    getOrCreateSignedOutUser(
      signedOutId: String,
      defaultUserPreferences: String): UserProfile!
    getOrCreateUserByEmail(
      email: String!,
      defaultUserPreferences: String): UserProfile!
  
    # Tips
    deleteTipGotIt(
      name: String,
      userProfileId: String!): StatusAndMessage!

    upsertTipGotIt(
      name: String!,
      userProfileId: String!): StatusAndMessage!

    # User preferences
    upsertUserPreference(
      userProfileId: String!,
      category: String!,
      key: String!,
      value: String,
      values: [String]): Boolean

    # AiTradefi
    # ---

    # ElevenLabs
    createElevenLabsToken(
      userProfileId: String!): TokenResults!

    upsertSpeakPreference(
      userProfileId: String!,
      enabled: Boolean!): StatusAndMessage!

    # Instance chats
    getOrCreateInstanceChatSession(
      instanceId: String,
      chatSessionId: String,
      userProfileId: String!,
      chatSettingsName: String): ChatSessionResults!

    # Start
    loadServerStartData(
      userProfileId: String!,
      instanceId: String,
      loadChatSession: Boolean,
      chatSessionId: String,
      chatSettingsName: String): ServerStartData!

    # Sign-ups
    signUpForWaitlist(email: String!): StatusAndMessage!
  }
`
