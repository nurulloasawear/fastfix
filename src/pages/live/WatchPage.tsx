import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react'
import { RtkParticipantsAudio } from '@cloudflare/realtimekit-react-ui'
import type RTKClient from '@cloudflare/realtimekit'
import type { RTKParticipant } from '@cloudflare/realtimekit'
import { Spinner } from '@/components/ui/Spinner'
import { useWatchStream } from '@/features/golive'
import { ApiError } from '@/lib/apiError'

// Live-stream WATCH page (viewer side) — PUBLIC + WebRTC / sub-second, NOT HLS.
//
// This page is reachable WITHOUT auth (top-level public route, exempt from the
// PasswordGate): an anonymous, logged-out, non-seller buyer opens the shared
// /live/watch/{id} link and watches the seller's stream. No login, no seller account.
//
// RealtimeKit runs an HLS livestream in parallel, but it never yields a playback URL
// and HLS isn't the realtime path anyway. Viewers watch over WebRTC: we join the same
// RealtimeKit room as the host, but as a receive-only viewer participant.
//
// CRITICAL SDK DETAIL — `participants.active`, NOT `participants.joined`:
//   In the RealtimeKit/Dyte web SDK a participant's `videoTrack`/`audioTrack` are only
//   *media-subscribed* (i.e. actually flowing over WebRTC) for participants in the
//   `meeting.participants.active` map — "participants whose media is subscribed to /
//   are supposed to be on the screen". `participants.joined` is just the roster: a
//   joined participant can have `videoTrack === null` forever because their media was
//   never subscribed. Filtering `joined` for a `videoTrack` (the old bug) therefore
//   never finds the host → "Waiting for stream" with videoWidth=0. We must read the
//   host from `active`, and pin them so they stay subscribed regardless of view mode.
//
// Flow:
//   1. POST /streams/{id}/watch  → PUBLIC (no auth). Returns status + title + poster +
//      playback.join_token (RealtimeKit *viewer* authToken, off-stage webinar/livestream
//      viewer preset — receive-only, publishes nothing). Not 'live' →
//      ended/scheduled/offline. Polls until a token appears (host may be provisioning).
//   2. initMeeting({ authToken, defaults:{ audio:false, video:false } }) → joinRoom().
//   3. Find the broadcasting host in `participants.active` (the media-subscribed set),
//      PIN them so the SDK keeps their media subscribed, then render their video via
//      `registerVideoElement` (which tracks track/layer changes for us) + their audio.
//      Re-render on active-map join/leave + per-participant videoUpdate events.
//
// Sound: we OPTIMISTICALLY attempt UNMUTED autoplay the moment the host's video
// attaches (a fresh user-gesture navigation is often enough for the browser to allow
// it). If the browser rejects unmuted autoplay we fall back to MUTED playback and show
// a centered "Tap for sound" overlay that unmutes on ANY tap anywhere on the video.

export function WatchPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()

  // ONE public, auth-free call drives the whole page: status + title + poster + the
  // RealtimeKit viewer joinToken. apiClient sends a Bearer only if a token exists, so
  // this works for a logged-out buyer.
  const watch = useWatchStream(id)
  const status = watch.data?.status
  const joinToken = watch.data?.playback.joinToken ?? ''
  const poster = watch.data?.poster || watch.data?.playback.posterUrl || ''

  if (watch.isError) {
    const notFound = watch.error instanceof ApiError && watch.error.status === 404
    return (
      <OfflineState
        title={t(notFound ? 'golive.watch.notFoundTitle' : 'golive.watch.offlineTitle')}
        subtitle={t(notFound ? 'golive.watch.notFoundSubtitle' : 'golive.watch.offlineSubtitle')}
      />
    )
  }

  if (watch.isLoading || !status) {
    return <FullScreen><Spinner className="!h-8 !w-8 !border-white/20 !border-t-white" /></FullScreen>
  }

  if (status === 'ended') {
    return <OfflineState title={t('golive.watch.endedTitle')} subtitle={t('golive.watch.endedSubtitle')} />
  }
  if (status === 'scheduled') {
    return <OfflineState title={t('golive.watch.scheduledTitle')} subtitle={t('golive.watch.scheduledSubtitle')} />
  }

  // status === 'live'
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black">
      <TitleBar title={watch.data?.title ?? ''} t={t} />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        {joinToken ? (
          // key={joinToken} → if the token is re-minted, the player remounts clean.
          <WebRtcViewer key={joinToken} authToken={joinToken} poster={poster} t={t} />
        ) : (
          <StateOverlay poster={poster} label={t('golive.watch.connecting')} t={t} />
        )}
      </div>
    </div>
  )
}

// ─── WebRTC viewer ────────────────────────────────────────────────────────────

type ViewerPhase = 'connecting' | 'waiting' | 'live' | 'ended'

function WebRtcViewer({
  authToken,
  poster,
  t,
}: {
  authToken: string
  poster: string
  t: (k: string) => string
}) {
  const [meeting, initMeeting] = useRealtimeKitClient()
  const [phase, setPhase] = useState<ViewerPhase>('connecting')

  // Init + join the RealtimeKit room as a receive-only viewer. We publish nothing
  // (audio:false, video:false) — the `livestream_viewer` preset can't publish anyway.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const m = await initMeeting({
          authToken,
          defaults: { audio: false, video: false },
        })
        if (!m || cancelled) return
        // Debug hook: expose the live meeting for headless inspection. Harmless.
        ;(window as unknown as { __rtk?: RTKClient }).__rtk = m
        await m.joinRoom()
        if (!cancelled) setPhase('waiting')
      } catch {
        if (!cancelled) setPhase('ended')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authToken, initMeeting])

  // Leave the room on unmount so we don't leak a viewer connection.
  useEffect(() => {
    return () => {
      if (meeting) void meeting.leaveRoom().catch(() => {})
    }
  }, [meeting])

  if (!meeting || phase === 'connecting') {
    return <StateOverlay poster={poster} label={t('golive.watch.connecting')} t={t} />
  }

  return (
    <RealtimeKitProvider value={meeting} fallback={<StateOverlay poster={poster} label={t('golive.watch.connecting')} t={t} />}>
      <HostStage meeting={meeting} poster={poster} phase={phase} setPhase={setPhase} t={t} />
      {/* Pulls in the host's remote audio track (subject to autoplay policy). */}
      <RtkParticipantsAudio meeting={meeting} />
    </RealtimeKitProvider>
  )
}

// Renders the broadcasting host's media. Tracks the active host participant via
// RealtimeKit join/leave/videoUpdate events and attaches their video + audio.
function HostStage({
  meeting,
  poster,
  phase,
  setPhase,
  t,
}: {
  meeting: RTKClient
  poster: string
  phase: ViewerPhase
  setPhase: (p: ViewerPhase) => void
  t: (k: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [host, setHost] = useState<RTKParticipant | null>(null)
  // Start optimistically UNMUTED; if the browser blocks unmuted autoplay we flip this
  // to muted and surface the "Tap for sound" overlay (needsSound).
  const [muted, setMuted] = useState(false)
  const [needsSound, setNeedsSound] = useState(false)
  // Guards the one-time unmuted-autoplay attempt per host video so it doesn't re-fire
  // on every effect re-run / track-layer change.
  const triedUnmutedRef = useRef(false)

  // Subscribe to participant churn on the ACTIVE map — the set whose media is actually
  // subscribed over WebRTC. On any active join/leave/videoUpdate we recompute who the
  // broadcasting host is, then PIN them so the SDK keeps their media subscribed (a pin
  // guarantees presence in `active` regardless of view mode / active-speaker churn).
  // We seed from `joined` too: a participant can be in the roster a beat before they
  // land in `active`, and pinning them pulls their media in.
  useEffect(() => {
    const participants = meeting.participants

    // The host candidate is whoever is broadcasting. Prefer the active map (media
    // subscribed, real track); fall back to the joined roster to find someone to pin.
    const recompute = () => {
      const next = pickHost(participants.active) ?? pickHost(participants.joined)
      // Pin the chosen host so their media stays subscribed in `active`.
      if (next && !next.isPinned) void next.pin().catch(() => {})
      // Only surface a host once their media is actually flowing (real videoTrack).
      setHost(next && next.videoEnabled && next.videoTrack ? next : null)
    }

    // Wire videoUpdate on a single participant; returns its unsubscriber.
    const bind = (p: RTKParticipant) => {
      p.on('videoUpdate', recompute)
      return () => p.off('videoUpdate', recompute)
    }

    // Bind every participant we know about (active + joined) and the ones added later.
    const unbinders = new Map<string, () => void>()
    const bindOnce = (p: RTKParticipant) => {
      if (!unbinders.has(p.id)) unbinders.set(p.id, bind(p))
    }
    for (const p of participants.joined.toArray()) bindOnce(p)
    for (const p of participants.active.toArray()) bindOnce(p)

    const onJoin = (p: RTKParticipant) => {
      bindOnce(p)
      recompute()
    }
    const onLeave = (p: RTKParticipant) => {
      const off = unbinders.get(p.id)
      if (off) {
        off()
        unbinders.delete(p.id)
      }
      recompute()
    }

    // Listen on BOTH maps: `active` drives media; `joined` catches the host before
    // they become active (so we can pin and pull their media in).
    participants.active.on('participantJoined', onJoin)
    participants.active.on('participantLeft', onLeave)
    participants.joined.on('participantJoined', onJoin)
    participants.joined.on('participantLeft', onLeave)

    recompute()

    return () => {
      participants.active.off('participantJoined', onJoin)
      participants.active.off('participantLeft', onLeave)
      participants.joined.off('participantJoined', onJoin)
      participants.joined.off('participantLeft', onLeave)
      for (const off of unbinders.values()) off()
      unbinders.clear()
    }
  }, [meeting])

  // Drive the phase from whether we currently have a broadcasting host.
  useEffect(() => {
    if (phase === 'ended') return
    setPhase(host ? 'live' : 'waiting')
  }, [host, phase, setPhase])

  // Attach the host's video to the <video> element. For a REMOTE participant the SDK's
  // `registerVideoElement` is the correct path: it wires the element to the live track
  // and keeps it updated across track-identity / simulcast-layer changes (which a
  // one-shot `srcObject = new MediaStream([videoTrack])` would miss). We also set
  // `srcObject` directly as a belt-and-braces fallback for the current track.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (host?.videoTrack) {
      v.srcObject = new MediaStream([host.videoTrack])
      host.registerVideoElement(v)
      // Once per host video: try to play UNMUTED right away. Many browsers honour this
      // for a fresh user-gesture navigation. If it rejects (autoplay policy), fall back
      // to muted playback and reveal the "Tap for sound" overlay.
      if (!triedUnmutedRef.current) {
        triedUnmutedRef.current = true
        v.muted = false
        v.play().then(
          () => {
            setMuted(false)
            setNeedsSound(false)
          },
          () => {
            v.muted = true
            setMuted(true)
            setNeedsSound(true)
            void v.play().catch(() => {})
          },
        )
      }
    } else {
      v.srcObject = null
    }
    return () => {
      host?.deregisterVideoElement(v)
      v.srcObject = null
    }
  }, [host, host?.videoTrack])

  useEffect(() => {
    const a = audioRef.current
    if (a) {
      a.srcObject = host?.audioTrack ? new MediaStream([host.audioTrack]) : null
      a.muted = muted
      if (host?.audioTrack) void a.play().catch(() => {})
    }
    return () => {
      if (a) a.srcObject = null
    }
  }, [host, host?.audioTrack, muted])

  // Apply a mute state to both sinks; on unmute, (re)start playback under the gesture.
  function applyMuted(next: boolean) {
    setMuted(next)
    const v = videoRef.current
    const a = audioRef.current
    if (v) {
      v.muted = next
      if (!next) void v.play().catch(() => {})
    }
    if (a) {
      a.muted = next
      if (!next) void a.play().catch(() => {})
    }
  }

  // "Tap for sound": fired by the overlay or by tapping anywhere on the video. Always
  // unmutes and hides the overlay — this runs inside a real user gesture so play() is
  // guaranteed to be allowed unmuted.
  function enableSound() {
    setNeedsSound(false)
    applyMuted(false)
  }

  // Corner toggle (mute ↔ unmute).
  function toggleMute() {
    if (muted) setNeedsSound(false)
    applyMuted(!muted)
  }

  const showVideo = phase === 'live' && host?.videoEnabled

  return (
    <>
      {/* Host video. We try unmuted autoplay first; if blocked we fall back to muted +
          the tap-for-sound overlay. v.muted is driven imperatively in the effects/handlers. */}
      <video
        ref={videoRef}
        poster={poster || undefined}
        autoPlay
        playsInline
        muted={muted}
        controls={false}
        className={`h-full w-full bg-black object-cover ${showVideo ? '' : 'invisible'}`}
      />
      {/* Dedicated audio sink for the host track (belt-and-braces with RtkParticipantsAudio). */}
      <audio ref={audioRef} autoPlay muted={muted} className="hidden" />

      {/* Waiting for the host to start publishing video. */}
      {!showVideo && (
        <StateOverlay poster={poster} label={t('golive.watch.waiting')} hint={t('golive.watch.waitingHint')} t={t} />
      )}

      {/* Tap-for-sound overlay — only when unmuted autoplay was blocked. Covers the whole
          video so a tap ANYWHERE unmutes, then it disappears. */}
      {showVideo && needsSound && (
        <button
          type="button"
          onClick={enableSound}
          aria-label={t('golive.watch.tapToUnmute')}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur transition-transform duration-200 hover:scale-105">
            <SpeakerOffIcon size={28} />
          </span>
          <span className="rounded-full bg-black/40 px-4 py-1.5 text-sm font-semibold text-white">
            {t('golive.watch.tapToUnmute')}
          </span>
        </button>
      )}

      {/* Corner mute / unmute toggle — always available once sound is enabled. */}
      {showVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={t(muted ? 'golive.watch.unmute' : 'golive.watch.mute')}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
          {t(muted ? 'golive.watch.unmute' : 'golive.watch.mute')}
        </button>
      )}
    </>
  )
}

// Picks the broadcasting host from a participant map (use `active` for media, `joined`
// to find someone to pin): the participant that is publishing video and is NOT the
// server-side recorder ("Dyte Recorder" / a recorder preset). There's exactly one
// publisher in a livestream, so we take the first match (preferring `isHost`).
function pickHost(map: RTKClient['participants']['active']): RTKParticipant | null {
  const candidates = map.toArray().filter(isBroadcaster)
  if (candidates.length === 0) return null
  return candidates.find((p) => p.isHost) ?? candidates[0]
}

function isBroadcaster(p: RTKParticipant): boolean {
  if (isRecorder(p)) return false
  // A real camera publisher: video enabled with a live track.
  return p.videoEnabled && !!p.videoTrack
}

// RealtimeKit/Dyte's server-side recorder joins as a participant. Skip it — it never
// publishes media but we guard by name + preset to be safe.
function isRecorder(p: RTKParticipant): boolean {
  const name = (p.name ?? '').toLowerCase()
  const preset = (p.presetName ?? '').toLowerCase()
  return (
    name.includes('recorder') ||
    preset.includes('recorder') ||
    preset.includes('livestream_host_recorder')
  )
}

// ─── States ─────────────────────────────────────────────────────────────────

function TitleBar({ title, t }: { title: string; t: (k: string) => string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 bg-black px-4 py-3">
      <span className="flex items-center gap-1.5 rounded-full bg-error px-3 py-1 text-xs font-bold text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        {t('golive.watch.liveBadge')}
      </span>
      <h1 className="flex-1 truncate text-sm font-semibold text-white">{title || '…'}</h1>
    </div>
  )
}

// Poster-backed overlay used for connecting / waiting states.
function StateOverlay({
  poster,
  label,
  hint,
  t: _t,
}: {
  poster: string
  label: string
  hint?: string
  t: (k: string) => string
}) {
  return (
    <div className="absolute inset-0">
      {poster && <img src={poster} alt="" className="h-full w-full object-cover opacity-40" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 text-center">
        <Spinner className="!h-8 !w-8 !border-white/20 !border-t-white" />
        <div>
          <p className="text-base font-semibold text-white">{label}</p>
          {hint && <p className="mt-1 text-sm text-white/60">{hint}</p>}
        </div>
      </div>
    </div>
  )
}

function OfflineState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <FullScreen>
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
            <path d="m2 2 20 20M6.34 6.34A10 10 0 0 0 12 22a10 10 0 0 0 5.66-1.76M9.88 4.12A10 10 0 0 1 22 12a9.9 9.9 0 0 1-1.6 5.4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
      </div>
    </FullScreen>
  )
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen items-center justify-center bg-black">{children}</div>
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpeakerOnIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SpeakerOffIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  )
}
