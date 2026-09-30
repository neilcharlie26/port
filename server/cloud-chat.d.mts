import type { IncomingMessage, ServerResponse } from 'node:http'
export function createCloudChatHandler(options?: { store?: any; password?: string; clock?: () => number; ai?: (messages: any[]) => Promise<string> }): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>
