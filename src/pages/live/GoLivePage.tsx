import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RealtimeKitProvider, useRealtimeKitClient } from '@cloudflare/realtimekit-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import {
  useCreateStream,
  useGoLive,
  useEndStream,
  BroadcastStage,
  Countdown,
  type BroadcastPhase,
} from '@/features/golive'

// Seller "Go Live" console (WebRTC / RealtimeKit).
//
// Flow: enter title → POST /streams (create) → POST /streams/{id}/go-live
// (provision host) → playback.join_token → RealtimeKit init+join → publish camera/mic
// + optional screen-share. "End live" → POST /streams/{id}/end.
//
// VIDEO ONLY for this phase — no chat/pins/commerce (that lands later over control_ws).
//
// SDK joins a meeting with the authToken alone (no per-meeting URL). The host preset
// (set server-side by IssueHostToken) is on-stage / publish-capable.

export function GoLivePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [meeting, initMeeting] = useRealtimeKitClient()
  const [phase, setPhase] = useState<BroadcastPhase>('idle')
  const [title, setTitle] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // streamId is needed by "End live" even after we hand off to the SDK.
  const streamIdRef = useRef('')
  // Provisioning (create + go-live) runs in PARALLEL with the 3-2-1 countdown; the
  // resulting auth token is awaited at count 0. The pre-warmed camera both shows a
  // mirror preview and pops the OS permission prompt during the countdown (not after).
  const provisionRef = useRef<Promise<string | undefined> | null>(null)
  const prewarmRef = useRef<MediaStream | null>(null)
  const [prewarmStream, setPrewarmStream] = useState<MediaStream | null>(null)

  const createMutation = useCreateStream()
  const goLiveMutation = useGoLive()
  const endMutation = useEndStream()

  // Click "Go Live" → start the countdown AND kick off provisioning + camera warm-up
  // in parallel. Nothing blocks the countdown; the token is consumed at count 0.
  const startBroadcast = useCallback(() => {
    setErrorMsg('')
    setPhase('countdown')

    provisionRef.current = (async () => {
      const created = await createMutation.mutateAsync(title.trim())
      streamIdRef.current = created.id
      const result = await goLiveMutation.mutateAsync(created.id)
      return result.playback.joinToken
    })()

    // Pre-warm the camera so the browser permission dialog + warm-up happen during
    // the countdown. Best-effort — if denied/unavailable the SDK re-prompts on join.
    navigator.mediaDevices
      ?.getUserMedia?.({ video: true, audio: true })
      .then((s) => {
        prewarmRef.current = s
        setPrewarmStream(s)
      })
      .catch(() => {})
  }, [title, createMutation, goLiveMutation])

  // Fired when the countdown hits 0: await the (parallel) provisioning, release the
  // preview camera so the SDK can acquire it cleanly (permission already granted →
  // fast), then init + join.
  const goLiveNow = useCallback(async () => {
    try {
      setPhase('connecting')
      prewarmRef.current?.getTracks().forEach((tr) => tr.stop())
      prewarmRef.current = null
      setPrewarmStream(null)

      const authToken = await provisionRef.current
      if (!authToken) {
        setPhase('error')
        setErrorMsg(t('golive.errors.noToken'))
        return
      }
      const m = await initMeeting({ authToken, defaults: { audio: true, video: true } })
      if (!m) {
        setPhase('error')
        setErrorMsg(t('golive.errors.initFailed'))
        return
      }
      await m.joinRoom()
      setPhase('live')
    } catch (err) {
      setPhase('error')
      setErrorMsg(messageOf(err) ?? t('golive.errors.generic'))
    }
  }, [initMeeting, t])

  const endBroadcast = useCallback(async () => {
    setPhase('ending')
    try {
      // Leave the media room first (stops publishing), then tell the backend to end.
      if (meeting) await meeting.leaveRoom()
    } catch {
      // best-effort: even if leave fails, still end the session server-side.
    }
    try {
      if (streamIdRef.current) await endMutation.mutateAsync(streamIdRef.current)
    } catch (err) {
      setErrorMsg(messageOf(err) ?? '')
    }
    setPhase('ended')
  }, [meeting, endMutation])

  // Safety net: if the seller closes/navigates away mid-broadcast, leave the room so
  // we don't leak a publishing connection. (We can't reliably await the /end POST in
  // unload, so this only tears down the local media side.)
  useEffect(() => {
    return () => {
      if (meeting) void meeting.leaveRoom().catch(() => {})
      // Release the pre-warm camera if the seller bailed mid-countdown.
      prewarmRef.current?.getTracks().forEach((tr) => tr.stop())
      prewarmRef.current = null
    }
  }, [meeting])

  const busy =
    phase === 'creating' || phase === 'provisioning' || phase === 'connecting'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2">
        <h1 className="flex-1 truncate text-sm font-semibold text-text">
          {phase === 'live' || phase === 'ending'
            ? title || t('golive.untitled')
            : t('golive.title')}
        </h1>
        {phase === 'live' && (
          <span className="flex items-center gap-1.5 rounded-full bg-error px-3 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            {t('golive.liveBadge')}
          </span>
        )}
        {/* Open the viewer watch page in a NEW tab so the seller can verify their own
            broadcast plays back while still publishing here. */}
        {phase === 'live' && streamIdRef.current && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/live/watch/${streamIdRef.current}`, '_blank', 'noopener')}
          >
            {t('golive.watch.watch')}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => navigate('/live')}>
          {t('golive.back')}
        </Button>
        {(phase === 'live' || phase === 'ending') && (
          <Button
            variant="destructive"
            size="sm"
            disabled={phase === 'ending'}
            onClick={() => void endBroadcast()}
          >
            {phase === 'ending' ? t('golive.ending') : t('golive.endLive')}
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {phase === 'live' || phase === 'ending' ? (
          meeting ? (
            <RealtimeKitProvider value={meeting} fallback={<CenterSpinner />}>
              <BroadcastStage meeting={meeting} />
            </RealtimeKitProvider>
          ) : (
            <CenterSpinner />
          )
        ) : phase === 'countdown' ? (
          <Countdown
            stream={prewarmStream}
            statusText={t('golive.preparing', { defaultValue: 'Get ready — going live…' })}
            onComplete={() => void goLiveNow()}
          />
        ) : phase === 'connecting' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#0b1220] text-white">
            <Spinner className="!h-7 !w-7 !border-white/20 !border-t-white" />
            <p className="text-sm text-white/80">{t('golive.goingLive', { defaultValue: 'Going live…' })}</p>
          </div>
        ) : phase === 'ended' ? (
          <EndedView onDone={() => navigate('/live')} t={t} />
        ) : (
          <SetupView
            title={title}
            onTitle={setTitle}
            onStart={() => void startBroadcast()}
            busy={busy}
            phase={phase}
            errorMsg={errorMsg}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

// ─── Setup (pre-live) ────────────────────────────────────────────────────────

function SetupView({
  title,
  onTitle,
  onStart,
  busy,
  phase,
  errorMsg,
  t,
}: {
  title: string
  onTitle: (v: string) => void
  onStart: () => void
  busy: boolean
  phase: BroadcastPhase
  errorMsg: string
  t: (k: string) => string
}) {
  const phaseLabel =
    phase === 'creating'
      ? t('golive.phase.creating')
      : phase === 'provisioning'
        ? t('golive.phase.provisioning')
        : phase === 'connecting'
          ? t('golive.phase.connecting')
          : ''

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-5 px-6">
      <div>
        <h2 className="text-lg font-semibold text-text">{t('golive.setupTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('golive.setupSubtitle')}</p>
      </div>

      <Input
        label={t('golive.titleLabel')}
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder={t('golive.titlePlaceholder')}
        disabled={busy}
        maxLength={120}
      />

      {phase === 'error' && errorMsg && (
        <p className="rounded-lg bg-error-bg px-3 py-2 text-sm text-error-text">{errorMsg}</p>
      )}

      <Button
        size="lg"
        disabled={busy || title.trim().length === 0}
        onClick={onStart}
        className="bg-error text-white hover:opacity-90"
      >
        {busy ? (
          <>
            <Spinner className="!h-4 !w-4 !border-white/40 !border-t-white" />
            {phaseLabel}
          </>
        ) : (
          t('golive.goLive')
        )}
      </Button>

      <p className="text-center text-xs text-muted">{t('golive.permissionsHint')}</p>
    </div>
  )
}

function EndedView({ onDone, t }: { onDone: () => void; t: (k: string) => string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text">{t('golive.endedTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('golive.endedSubtitle')}</p>
      </div>
      <Button size="md" onClick={onDone}>
        {t('golive.endedDone')}
      </Button>
    </div>
  )
}

function CenterSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#0f172a]">
      <Spinner className="!h-7 !w-7 !border-white/20 !border-t-white" />
    </div>
  )
}

// Pull a human message off an unknown error (ApiError has .message; fall back to any).
function messageOf(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return undefined
}
