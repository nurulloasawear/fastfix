// Go-Live (WebRTC) — wired to the REAL backend stream routes, NOT the MSW
// seller-scoped /sellers/me/... mocks used by the existing live analytics feature.
//
// Backend contract (internal/stream/stream.go, mounted at /api/v1/streams):
//   POST /streams                 → create {title}            → {id, room, status}
//   POST /streams/{id}/go-live    → host provision (SELLER)   → {playback, provider_room_id, ...}
//   POST /streams/{id}/end        → tear down                 → {id, status:"ended"}
//   GET  /streams/{id}            → metadata
//
// The RealtimeKit host authToken is `playback.join_token` (transport:"webrtc",
// provider:"realtimekit"). Legacy LiveKit keys (room/livekit_url/token/can_publish)
// are ignored — we are on the RealtimeKit path only.
import { apiClient } from '@/lib/axios'
import { ApiError } from '@/lib/apiError'
import type {
  GoLiveSession,
  GoLiveResult,
  JoinResult,
  Playback,
  StreamStatus,
  WatchResult,
} from '../types/golive.types'

const PATHS = {
  streams: '/streams',
  stream: (id: string) => `/streams/${id}`,
  goLive: (id: string) => `/streams/${id}/go-live`,
  end: (id: string) => `/streams/${id}/end`,
  join: (id: string) => `/streams/${id}/join`,
  watch: (id: string) => `/streams/${id}/watch`,
}

// ─── Raw BE shapes (snake_case) ──────────────────────────────────────────────

type RawPlayback = {
  transport?: 'webrtc' | 'llhls'
  provider?: string
  join_token?: string
  join_url?: string
  hls_url?: string
  poster_url?: string
}

type RawCreate = { id: string; room: string; status: string }

type RawGoLive = {
  id: string
  playback?: RawPlayback
  provider_room_id?: string
  provider_broadcast_id?: string
}

type RawStream = {
  id: string
  title: string
  status: string
  seller_id: string
  shop_name: string
}

type RawJoin = {
  id: string
  playback?: RawPlayback
  control_ws?: string
  poster?: string
}

// PUBLIC watch response. Mirrors join but is self-contained: it also carries the
// stream status + title so the anonymous page renders offline/ended/live without a
// second (authed) metadata call.
type RawWatch = {
  id: string
  status?: string
  title?: string
  playback?: RawPlayback
  poster?: string
}

// ─── Adapters ────────────────────────────────────────────────────────────────

function adaptPlayback(raw: RawPlayback | undefined): Playback {
  return {
    transport: raw?.transport ?? 'webrtc',
    provider: raw?.provider ?? '',
    joinToken: raw?.join_token ?? '',
    joinUrl: raw?.join_url ?? '',
    hlsUrl: raw?.hls_url ?? '',
    posterUrl: raw?.poster_url ?? '',
  }
}

// ─── API functions ───────────────────────────────────────────────────────────

export async function createStream(title: string): Promise<{ id: string; room: string; status: string }> {
  const { data } = await apiClient.post<RawCreate>(PATHS.streams, { title })
  return { id: data.id, room: data.room, status: data.status }
}

export async function goLive(id: string): Promise<GoLiveResult> {
  const { data } = await apiClient.post<RawGoLive>(PATHS.goLive(id), {})
  return {
    id: data.id,
    playback: adaptPlayback(data.playback),
    providerRoomId: data.provider_room_id ?? '',
    providerBroadcastId: data.provider_broadcast_id ?? '',
  }
}

export async function endStream(id: string): Promise<void> {
  await apiClient.post(PATHS.end(id), {})
}

// Viewer join. The host's publish token is never returned here — only the viewer
// playback descriptor (LL-HLS `hls_url` once publishing, or a webrtc viewer token).
// The backend rejects with 400 `stream_not_live` until the host is actually live; we
// map that to `notLive: true` (instead of throwing) so the watch page can keep polling.
export async function joinStream(id: string): Promise<JoinResult> {
  try {
    const { data } = await apiClient.post<RawJoin>(PATHS.join(id), {})
    return {
      id: data.id,
      playback: adaptPlayback(data.playback),
      controlWs: data.control_ws ?? '',
      poster: data.poster ?? '',
      notLive: false,
    }
  } catch (err) {
    if (err instanceof ApiError && err.code === 'stream_not_live') {
      return {
        id,
        playback: adaptPlayback(undefined),
        controlWs: '',
        poster: '',
        notLive: true,
      }
    }
    throw err
  }
}

// PUBLIC viewer access. POST /streams/{id}/watch needs NO auth — apiClient only adds
// a Bearer header when a token happens to exist, so this works for a logged-out buyer.
// One call returns status + title + poster + the RealtimeKit viewer joinToken. While
// the host is provisioning the backend answers `stream_not_live` (400) — we map that
// to `notLive: true` (and surface whatever status it gave) so the page keeps polling
// instead of throwing. A 404 (`session_not_found`) still throws → not-found state.
export async function watchStream(id: string): Promise<WatchResult> {
  try {
    const { data } = await apiClient.post<RawWatch>(PATHS.watch(id), {})
    return {
      id: data.id || id,
      status: (data.status as StreamStatus) ?? 'live',
      title: data.title ?? '',
      poster: data.poster ?? data.playback?.poster_url ?? '',
      playback: adaptPlayback(data.playback),
      notLive: false,
    }
  } catch (err) {
    if (err instanceof ApiError && err.code === 'stream_not_live') {
      return {
        id,
        // Backend says it's not live yet; treat as scheduled until a token appears.
        status: 'scheduled',
        title: '',
        poster: '',
        playback: adaptPlayback(undefined),
        notLive: true,
      }
    }
    throw err
  }
}

export async function getStream(id: string): Promise<GoLiveSession> {
  const { data } = await apiClient.get<RawStream>(PATHS.stream(id))
  return {
    id: data.id,
    title: data.title,
    status: data.status as GoLiveSession['status'],
    sellerId: data.seller_id,
    shopName: data.shop_name,
  }
}
