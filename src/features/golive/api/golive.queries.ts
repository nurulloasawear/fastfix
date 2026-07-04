import { useMutation, useQuery } from '@tanstack/react-query'
import { createStream, goLive, endStream, getStream, joinStream, watchStream } from './golive.api'
import type { GoLiveResult, JoinResult, WatchResult } from '../types/golive.types'

export const goLiveKeys = {
  all: ['golive'] as const,
  stream: (id: string) => ['golive', 'stream', id] as const,
  join: (id: string) => ['golive', 'join', id] as const,
  watch: (id: string) => ['golive', 'watch', id] as const,
}

// create → go-live is a 2-step provision. We expose them as discrete mutations so
// the page can drive its phase machine (creating → provisioning → connecting).
export function useCreateStream() {
  return useMutation({ mutationFn: (title: string) => createStream(title) })
}

export function useGoLive() {
  return useMutation<GoLiveResult, unknown, string>({ mutationFn: (id: string) => goLive(id) })
}

export function useEndStream() {
  return useMutation({ mutationFn: (id: string) => endStream(id) })
}

// ─── Watch (viewer) ──────────────────────────────────────────────────────────

// Stream metadata (title + status). Light poll so the watch page picks up the host
// going live / ending without a manual refresh.
export function useStreamMeta(id: string, enabled = true) {
  return useQuery({
    queryKey: goLiveKeys.stream(id),
    queryFn: () => getStream(id),
    enabled: enabled && id.length > 0,
    refetchInterval: 5000,
    retry: false,
  })
}

// Viewer join (WebRTC). Polls every `intervalMs` while `enabled` so the watch page
// can wait for the RealtimeKit viewer `playback.joinToken` to appear (the host may
// still be provisioning — backend returns `notLive` until then). Once a token is in
// hand we stop polling: the WebRTC connection is live and re-rendering is driven by
// RealtimeKit participant events, not by re-fetching the token.
export function useJoinStream(id: string, enabled: boolean, intervalMs = 3000) {
  return useQuery<JoinResult>({
    queryKey: goLiveKeys.join(id),
    queryFn: () => joinStream(id),
    enabled: enabled && id.length > 0,
    refetchInterval: (query) => (query.state.data?.playback.joinToken ? false : intervalMs),
    retry: false,
  })
}

// ─── Public watch (anonymous viewer) ─────────────────────────────────────────

// PUBLIC, auth-free viewer access for the shared /live/watch/{id} link. Hits POST
// /streams/{id}/watch (no Bearer needed) and returns status + title + poster + the
// RealtimeKit viewer joinToken in one shot — no separate authed metadata/join calls.
// Polls every `intervalMs` until a joinToken appears (host may still be provisioning
// or not yet live), then stops: once connected, RealtimeKit participant events drive
// re-rendering, not token re-fetching. We keep polling even when offline/scheduled so
// the page goes live automatically when the host starts.
export function useWatchStream(id: string, intervalMs = 3000) {
  return useQuery<WatchResult>({
    queryKey: goLiveKeys.watch(id),
    queryFn: () => watchStream(id),
    enabled: id.length > 0,
    refetchInterval: (query) => (query.state.data?.playback.joinToken ? false : intervalMs),
    retry: false,
  })
}
