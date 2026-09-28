# Website admin chat

Click the small lock button at the very bottom of the footer to open **Admin login**,
or add `#admin` to the website URL.
The password is the `ADMIN_PASSWORD` value in `.env.local`. Keep this file private.
Run `npm run chat:setup` to generate a password if one has not been configured.
Changing the password requires a server restart; existing login sessions end on restart.

## How it works

Visitors choose **Talk to admin**, optionally enter their name, and request a chat.
The assistant pauses and shares the last 30 messages with the admin inbox.
Typing **talk to Neil** requests the admin directly, with a saved assistant reply:
“Directing you to Neil.” The assistant then pauses.
After 15 minutes without a visitor or admin message in a waiting/active conversation,
the assistant returns with an explanation and answers subsequent questions using the
Groq AI. Polling and refreshing do not reset this timer.
Expiry is checked on the server when the next request arrives (open chats poll every
2.5 seconds), including after a restart or return visit. The notice is saved once.
Typing **talk to Neil** or clicking **Talk to Neil** pauses it again. An admin reply
also takes over the conversation. All messages remain in the same saved history.
Replies appear automatically while the chat is open. Visitors can leave messages
while you are away. No online presence or instant availability is promised.
Conversations stay open. Admin replies pause the assistant again; after another
15 minutes without messages, the assistant resumes automatically. Previously closed
conversations also return to assistant mode with their history intact.
Conversations resume after closing the tab or browser using a private persistent
visitor cookie, renewed for one year whenever the visitor accesses the chat.
Assistant-only history is saved in this browser's local storage until the visitor
explicitly starts a new assistant conversation. Admin history stays on the server.
If loading saved history fails, the visitor can retry before sending more messages.
Each browser/device has its own conversation. Clearing site data, using private
browsing, changing browsers or domains, or cookie expiry can lose access to that
visitor conversation. Account-based recovery is not implemented.

## Inbox, seen indicators and attachments

## Live AI setup

Add `GROQ_API_KEY` to `.env.local` (or the hosting server environment), optionally
set `GROQ_MODEL` (default: `openai/gpt-oss-20b`), then restart the server.
The key stays on the server. Never use a `VITE_` prefix or commit your private env file.
AI replies use the Groq Chat Completions API with recent conversation context and
portfolio facts, both before and after human handoff. Text from the last 24 messages
is sent to Groq for reply generation. Images and linked files are not sent or fetched;
the AI is told it cannot see their contents. Human handoff messages remain fixed notices.
When the key is missing or the provider fails, the UI shows an error and Retry AI reply;
it does not substitute canned portfolio answers. Admin replies remain available.

## Inbox features

The admin inbox lists conversations on the left, with search, unread counts and an
Unread filter. On phones, select a chat and use the back arrow to return to the list.
Opening the list alone does not mark messages read. Read receipts update when the
latest message is visible in an open conversation in a foreground tab. Admin replies
show **Seen by client** or **Not seen yet**; visitors see **Seen by Neil**.
Read state survives restarts and does not reset the 15-minute inactivity timer.
Typing indicators appear for both participants and in the admin conversation list.
They clear after sending, leaving the composer, or a short pause. Stale indicators
expire after five seconds on the server. Typing does not reset the inactivity timer
or save draft text to the server.

Both participants can send PNG, JPEG, GIF and WebP images strictly smaller than
5 MB (5,000,000 bytes). Images are saved privately under `CHAT_DATA_DIR/images` and
only served to the conversation's visitor or an authenticated admin. Include this
folder in backups. Other files must be shared as HTTP/HTTPS links; they are not
uploaded to this server. The server does not fetch those external links.

## Hosting requirements

Development and Vite preview include the chat API. For production:

1. Use Node.js 24 or newer. Run `npm install` and `npm run build`.
2. Set `ADMIN_PASSWORD` (12+ characters), `NODE_ENV=production`, and optionally `PORT`.
3. Run `npm start` behind an HTTPS reverse proxy which preserves the Host header.
4. Set `CHAT_DATA_DIR` to a persistent, private folder. Back it up and limit access.

The default storage is `.chat-data/conversations.json`. It survives server restarts.
Use one server process with persistent disk. Multiple replicas or ephemeral hosting
require a shared database before use. Static-only hosting cannot run the chat API;
uploading `dist` alone is insufficient. Production cookies require HTTPS.
Do not place the data directory inside `dist` or any publicly served directory.

Admin sessions expire after eight hours. Login attempts and writes are rate limited.
Each visitor can access only the conversation associated with their private cookie.
Only authenticated admins can list conversations and send admin replies.
