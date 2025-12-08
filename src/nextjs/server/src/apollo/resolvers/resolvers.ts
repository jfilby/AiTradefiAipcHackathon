// Serene Core query imports
import { isAdminUser } from '@/serene-core-server/apollo/resolvers/queries/access'
// import { getOrCreateChatSession } from '@/serene-ai-server/apollo/resolvers/mutations/chats'
// import { getTipsByUserProfileIdAndTags, tipGotItExists } from '@/serene-core-server/apollo/resolvers/queries/tips'

// Serene Core mutations imports
// import { getChatMessages, getChatSessions } from '@/serene-ai-server/apollo/resolvers/queries/chats'
import { createBlankUser, createUserByEmail, getOrCreateSignedOutUser, getOrCreateUserByEmail } from '@/serene-core-server/apollo/resolvers/mutations/users'
import { validateProfileCompleted } from '@/serene-core-server/apollo/resolvers/queries/profile'
// import { deleteTipGotIt, upsertTipGotIt } from '@/serene-core-server/apollo/resolvers/mutations/tips'
import { userById, verifySignedInUserProfileId } from '@/serene-core-server/apollo/resolvers/queries/users'
import { getUserPreferences } from '@/serene-core-server/apollo/resolvers/queries/user-preferences'
import { upsertUserPreference } from '@/serene-core-server/apollo/resolvers/mutations/user-preferences'

// Concept queries imports
import { getAnalyses, getAnalysisById } from './queries/analyses'
// import { filterInstances, filterProjectInstances, instanceById } from './queries/instances'
import { getInstrumentById, getInstruments } from './queries/instruments'
import { getLatestTradeAnalysesGroups, getTradeAnalysesGroupById, getTradeAnalysisById } from './queries/trade-analyses-group'

// Concept mutations imports
import { loadServerStartData } from './mutations/server-data-start'
import { signUpForWaitlist } from './mutations/sign-ups'
// import { upsertInstance } from './mutations/instances'

// Code
const Query = {

  // Serene Core
  // ---

  // Chats
  // getChatMessages,
  // getChatParticipants,
  // getChatSession,

  // Profile
  validateProfileCompleted,

  // Quotas
  // getResourceQuotaUsage,

  // Tech
  // getTechs,

  // Tips
  // getTipsByUserProfileIdAndTags,
  // tipGotItExists,

  // Users
  isAdminUser,
  userById,
  verifySignedInUserProfileId,

  // User preferences
  getUserPreferences,

  // AiTradefi
  // ---

  // Analyses
  getAnalysisById,
  getAnalyses,

  // Instances
  // filterInstances,
  // filterProjectInstances,
  // instanceById,
  // instanceSharedGroups,
  // instancesSharedPublicly,

  // Instruments
  getInstrumentById,
  getInstruments,

  // Trade analyses
  getLatestTradeAnalysesGroups,
  getTradeAnalysesGroupById,
  getTradeAnalysisById
}

const Mutation = {

  // Serene Core
  // ---

  // Chats
  // getOrCreateChatSession,

  // Tips
  // deleteTipGotIt,
  // upsertTipGotIt,

  // Users
  createBlankUser,
  createUserByEmail,
  getOrCreateSignedOutUser,
  getOrCreateUserByEmail,

  // User preferences
  upsertUserPreference,

  // AiTradefi
  // ---

  // Instances
  // upsertInstance,

  // General
  loadServerStartData,
  signUpForWaitlist
}

const resolvers = { Query, Mutation }

export default resolvers
