import type { IncomingMessage, ServerResponse } from 'node:http'
export function createChatHandler(options?: { directory?: string; password?: string; clock?: () => number; ai?: (messages: any[]) => Promise<string> }): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>
