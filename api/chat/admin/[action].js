import { createCloudChatHandler } from '../../../server/cloud-chat.mjs'

// Vercel's standalone API routing needs an explicit directory for nested routes.
export default createCloudChatHandler()
