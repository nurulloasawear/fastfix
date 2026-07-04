import { useCallback, useEffect, useRef, useState } from 'react'
import { env } from '@/config/env'
import { getAuthToken } from '@/lib/authToken'

// Seller-side live control-plane client — the web analogue of the mobile
// useLiveControl. Connects to the backend WS at /api/v1/live/{id}/ws?token=<jwt>
// (the seller is authed) and surfaces the live comment feed + viewer count so the
// control room shows REAL buyer chat instead of a static "No comments" panel. The
// seller can also post as the host. stream_ended is terminal (host ended elsewhere).
export type LiveChatLine = { id: string; userId: string; name?: string; body: string }

const WS_BASE = env.apiBaseUrl.replace(/^http/i, 'ws') // https→wss, http→ws

export function useLiveChat(streamId: string, enabled: boolean, onEnded?: () => void) {
  const [chat, setChat] = useState<LiveChatLine[]>([])
  const [viewerCount, setViewerCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const endedCb = useRef(onEnded)
  endedCb.current = onEnded
  const endedFired = useRef(false)

  useEffect(() => {
    if (!enabled || !streamId) return
    let alive = true
    let ws: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      const token = getAuthToken()
      if (!token || !alive) return
      ws = new WebSocket(`${WS_BASE}/live/${streamId}/ws?token=${encodeURIComponent(token)}`)
      wsRef.current = ws
      ws.onopen = () => setConnected(true)
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(String(e.data))
          const d = msg.data ?? {}
          switch (msg.type) {
            case 'viewer_count':
            case 'presence':
              if (typeof d.count === 'number') setViewerCount(d.count)
              break
            case 'chat':
              setChat((c) => [...c.slice(-99), { id: d.id, userId: d.user_id, name: d.name, body: d.body }])
              break
            case 'stream_ended':
              if (!endedFired.current) {
                endedFired.current = true
                alive = false
                if (retry) {
                  clearTimeout(retry)
                  retry = null
                }
                endedCb.current?.()
                ws?.close()
              }
              break
          }
        } catch {
          /* ignore malformed frame */
        }
      }
      ws.onclose = () => {
        setConnected(false)
        if (alive && !retry) retry = setTimeout(() => { retry = null; connect() }, 2500)
      }
    }
    connect()

    return () => {
      alive = false
      if (retry) clearTimeout(retry)
      ws?.close()
      wsRef.current = null
    }
  }, [streamId, enabled])

  const sendChat = useCallback((body: string) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN && body.trim()) {
      ws.send(JSON.stringify({ type: 'chat', body: body.trim() }))
    }
  }, [])

  return { chat, viewerCount, connected, sendChat }
}
