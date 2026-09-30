import { createCloudChatHandler } from '../../server/cloud-chat.mjs'

export const config = { maxDuration: 60 }
export default createCloudChatHandler()
