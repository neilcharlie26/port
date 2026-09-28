export function createAI(options?: { apiKey?: string; model?: string; fetcher?: typeof fetch }): (messages: any[]) => Promise<string>
