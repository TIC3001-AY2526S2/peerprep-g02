import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

let ydoc = null
let provider = null

export function initCollab(sessionId, userInfo) {
  // Take down existing
  if (provider) provider.destroy()
  if (ydoc) ydoc.destroy()

  ydoc = new Y.Doc()
  provider = new WebsocketProvider(
    import.meta.env.VITE_COLLAB_WS_URL || 'ws://localhost:1234',
    sessionId,   // unique room ID
    ydoc
  )

  provider.awareness.setLocalStateField('user', {
    name: userInfo.username,
    color: userInfo.color ?? '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
  })

  return { ydoc, provider }
}

export function getCollab() {
  return { ydoc, provider }
}

export function destroyCollab() {
  provider?.destroy()
  ydoc?.destroy()
  ydoc = null
  provider = null
}