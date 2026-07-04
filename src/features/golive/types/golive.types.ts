// Go-Live (WebRTC / RealtimeKit) types. Separate from the existing live.types.ts
// (RTMP/OBS analytics flow) — this side talks to the REAL /streams routes.

export type StreamStatus = 'scheduled' | 'live' | 'ended'

export interface GoLiveSession {
  id: string
  title: string
  status: StreamStatus
  sellerId: string
  shopName: string
}

// Normalised playback descriptor from the go-live response `playback` object.
// For the HOST, `joinToken` is the RealtimeKit publish authToken.
export interface Playback {
  transport: 'webrtc' | 'llhls'
  provider: string
  joinToken: string
  joinUrl: string
  hlsUrl: string
  posterUrl: string
}

export interface GoLiveResult {
  id: string
  playback: Playback
  providerRoomId: string
  providerBroadcastId: string
}

// Viewer-side result of POST /streams/{id}/join. `playback.hlsUrl` is the LL-HLS
// playback URL — present only once the host is actually live + publishing; empty
// otherwise (poll until it appears). `notLive` is set when the backend rejected the
// join with `stream_not_live` (host provisioned but camera not publishing yet).
export interface JoinResult {
  id: string
  playback: Playback
  controlWs: string
  poster: string
  notLive: boolean
}

// PUBLIC viewer descriptor from POST /streams/{id}/watch (NO auth). One call returns
// everything the public watch page needs: stream status + title + poster, plus the
// RealtimeKit *viewer* `playback.joinToken` (present only while live; empty otherwise,
// so the page polls until it appears). This is the anonymous-buyer analogue of the
// authed `join` flow — same WebRTC viewer token, no login required.
export interface WatchResult {
  id: string
  status: StreamStatus
  title: string
  poster: string
  playback: Playback
  notLive: boolean
}

// UI-side phase machine for the broadcast console.
export type BroadcastPhase =
  | 'idle' // nothing started yet — title entry / preview
  | 'countdown' // 3-2-1 overlay; provisioning + camera pre-warm run in parallel
  | 'creating' // POST /streams in flight
  | 'provisioning' // POST /streams/{id}/go-live in flight
  | 'connecting' // got token, RealtimeKit init/join in flight
  | 'live' // joined + publishing
  | 'ending' // POST /streams/{id}/end in flight
  | 'ended' // session finished
  | 'error'
