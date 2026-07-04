import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RealtimeKitProvider, useRealtimeKitClient } from '@cloudflare/realtimekit-react'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'
import {
  useStream,
  useStreamStats,
  useStartStream,
  useEndStream,
  useNotifyFollowers,
  ProductsPanelModal,
  ObsSetupGuide,
  RefreshIcon,
  ShareIcon,
  BellIcon,
  EyeIcon,
  TagIcon,
} from '@/features/live'
import { BroadcastStage } from '@/features/golive'
import { useLiveChat } from '@/features/golive/useLiveChat'
import { ApiError } from '@/lib/apiError'
import { QRCodeSVG } from 'qrcode.react'

type Panel = 'products' | 'promotion' | null

// Local phase for the WebRTC handoff: provisioning RealtimeKit → connecting the SDK
// → publishing. Kept separate from the stream's persisted status (which the BE flips
// to 'live'); 'broadcasting' means the host camera/mic is actually publishing here.
type LivePhase = 'idle' | 'provisioning' | 'connecting' | 'broadcasting' | 'ending'

export function GoLivePreviewPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: stream, refetch: refetchStream } = useStream(id)
  const { data: stats } = useStreamStats(id, stream?.status === 'live')
  const startMutation = useStartStream()
  const endMutation = useEndStream()
  const notifyMutation = useNotifyFollowers()

  const [meeting, initMeeting] = useRealtimeKitClient()
  const [phase, setPhase] = useState<LivePhase>('idle')
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const [panel, setPanel] = useState<Panel>(null)
  const [copied, setCopied] = useState<'url' | 'key' | null>(null)

  // We're broadcasting once the SDK has joined; the persisted status flips to 'live'
  // server-side. Either signal counts as "live" for UI gating.
  const isLive = phase === 'broadcasting' || stream?.status === 'live'
  const busy = phase === 'provisioning' || phase === 'connecting'
  const promotionCount = 0 // [PENDING BACKEND] replace with real count

  function handleCopy(value: string, field: 'url' | 'key') {
    void navigator.clipboard.writeText(value)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  // "Go Live": provision RealtimeKit (server mints host publish token) → init the SDK
  // with that token → join + publish camera/mic. Mounts <BroadcastStage/> below.
  const handleGoLive = useCallback(async () => {
    if (busy || isLive || !id) return
    setErrorCode(null)
    try {
      setPhase('provisioning')
      const result = await startMutation.mutateAsync(id)
      const authToken = result.playback.joinToken
      if (!authToken) {
        // Provider not configured / no token → surface instead of handing the SDK an empty token.
        setPhase('idle')
        setErrorCode('no_token')
        return
      }
      setPhase('connecting')
      const m = await initMeeting({ authToken, defaults: { audio: true, video: true } })
      if (!m) {
        setPhase('idle')
        setErrorCode('init_failed')
        return
      }
      await m.joinRoom()
      setPhase('broadcasting')
    } catch (err) {
      setPhase('idle')
      setErrorCode(err instanceof ApiError ? err.code : 'internal_error')
    }
  }, [busy, isLive, id, startMutation, initMeeting])

  // "End live": leave the media room (stops publishing) then tell the BE to end
  // (status=ended + provider teardown).
  const handleEndLive = useCallback(async () => {
    if (phase === 'ending') return
    setPhase('ending')
    try {
      if (meeting) await meeting.leaveRoom()
    } catch {
      // best-effort: still end server-side even if leave fails.
    }
    try {
      if (id) await endMutation.mutateAsync(id)
    } catch (err) {
      setErrorCode(err instanceof ApiError ? err.code : 'internal_error')
    }
    navigate('/live/analytics')
  }, [phase, meeting, id, endMutation, navigate])

  // Safety net: if the seller navigates away mid-broadcast, leave the room so we
  // don't leak a publishing connection.
  useEffect(() => {
    return () => {
      if (meeting) void meeting.leaveRoom().catch(() => {})
    }
  }, [meeting])

  // Real live comment feed (the control room's left panel). Connects to the live WS
  // while the stream is live; reflects an end started elsewhere (e.g. the phone host)
  // by refetching so the UI drops out of the live state.
  const { chat, viewerCount, sendChat } = useLiveChat(id, isLive, () => void refetchStream())
  const [draft, setDraft] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.length])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2">
        <h1 className="flex-1 truncate text-sm font-semibold text-text">
          {stream?.title ?? '…'}
        </h1>
        <Button variant="ghost" size="sm" onClick={() => void navigator.clipboard.writeText(`https://ozb.ac/live/${id}`)}>
          <ShareIcon size={14} />
          {t('live.preview.shareLink')}
        </Button>
        {/* Open the viewer watch page in a NEW tab so the seller can verify their own
            broadcast plays back while still publishing here. */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/live/watch/${id}`, '_blank', 'noopener')}
        >
          {t('golive.watch.watch')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={notifyMutation.isPending}
          onClick={() => notifyMutation.mutate(id)}
          className="border-error text-error-text hover:bg-error-bg"
        >
          <BellIcon size={13} />
          {t('live.preview.notifyFollowers')}
        </Button>
        {!isLive && (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => navigate('/live/create')}>
            {t('live.preview.back')}
          </Button>
        )}
        {isLive ? (
          <Button
            size="sm"
            disabled={phase === 'ending'}
            onClick={() => void handleEndLive()}
            className="bg-error-text border-error-text text-white hover:opacity-90"
          >
            {phase === 'ending' ? t('live.preview.ending') : t('live.preview.endLive')}
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => void handleGoLive()}
            className="bg-error-text border-error-text text-white hover:opacity-90"
          >
            {busy
              ? phase === 'provisioning'
                ? t('live.preview.provisioning')
                : t('live.preview.connecting')
              : t('live.preview.goLive')}
          </Button>
        )}
      </div>

      {/* Main three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left tool box */}
        <div className="flex w-20 flex-col items-center gap-2 border-r border-border bg-surface py-4">
          <p className="mb-1 text-center text-[10px] font-semibold uppercase text-muted">
            {t('live.preview.toolBox')}
          </p>
          <button
            type="button"
            onClick={() => setPanel(panel === 'products' ? null : 'products')}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${
              panel === 'products' ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:bg-bg'
            }`}
          >
            <div className="relative">
              <EyeIcon size={22} />
              {(stream?.products.length ?? 0) > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                  {stream?.products.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{t('live.preview.products')}</span>
          </button>
          <button
            type="button"
            onClick={() => setPanel(panel === 'promotion' ? null : 'promotion')}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${
              panel === 'promotion' ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:bg-bg'
            }`}
          >
            <TagIcon size={22} />
            <span className="text-[10px] font-medium">{t('live.preview.promotion')}</span>
            {promotionCount > 0 && (
              <span className="text-[9px] text-muted">
                {t('live.preview.configured', { count: promotionCount })}
              </span>
            )}
          </button>
        </div>

        {/* LEFT: the real live comment feed from buyers (control-room chat). */}
        <div className="flex flex-1 flex-col bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-text">{t('live.preview.comments')}</span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <EyeIcon size={13} />
              {viewerCount}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
            {chat.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border-strong">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-muted">
                  {isLive ? t('live.preview.noComments') : t('live.preview.commentsDisabled')}
                </p>
              </div>
            ) : (
              chat.map((m) => (
                <div key={m.id} className="text-sm leading-snug">
                  <span className="font-semibold text-brand">{m.name || t('live.preview.viewer')}</span>{' '}
                  <span className="text-text">{m.body}</span>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex items-center gap-1 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (draft.trim()) {
                sendChat(draft)
                setDraft('')
              }
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!isLive}
              placeholder={t('live.preview.chatPlaceholder')}
              maxLength={200}
              className="h-8 flex-1 rounded-lg border border-border-strong bg-bg px-2.5 text-xs text-text outline-none focus:border-brand disabled:opacity-40"
            />
            <Button type="submit" size="sm" disabled={!isLive || !draft.trim()}>
              {t('live.preview.send')}
            </Button>
          </form>
        </div>

        {/* RIGHT: portrait phone preview — EXACTLY what buyers see on their mobile.
            Phone broadcast (QR) is the primary path → portrait iframe of the watch
            page; the web-webcam path mounts BroadcastStage; pre-live shows the QR. */}
        <div className="relative flex w-[460px] shrink-0 items-center justify-center border-l border-border bg-[#0f172a] p-4">
          {phase === 'broadcasting' && meeting ? (
            <PhoneFrame>
              <RealtimeKitProvider value={meeting} fallback={<CenterSpinner />}>
                <BroadcastStage meeting={meeting} />
              </RealtimeKitProvider>
            </PhoneFrame>
          ) : busy ? (
            <div className="flex flex-col items-center gap-3 text-white/70">
              <Spinner className="!h-7 !w-7 !border-white/20 !border-t-white" />
              <p className="text-sm">
                {phase === 'provisioning' ? t('live.preview.provisioning') : t('live.preview.connecting')}
              </p>
            </div>
          ) : isLive ? (
            <PhoneFrame>
              <iframe
                title="live-preview"
                src={`/live/watch/${id}`}
                className="absolute inset-0 h-full w-full border-0 bg-black"
                allow="autoplay; fullscreen"
              />
            </PhoneFrame>
          ) : (
            <div className="flex h-full w-full flex-col gap-6 overflow-auto">
              <PhoneHandoff
                deepLink={`ozb://live/go-live?id=${id}&title=${encodeURIComponent(stream?.title ?? '')}`}
              />
              <ObsSetupGuide
                rtmpUrl={stream?.rtmpUrl ?? 'rtmp://live-ingest.ozb.ac/live/'}
                streamKey={stream?.streamKey ?? '(key pending…)'}
                copied={copied}
                onCopy={handleCopy}
              />
            </div>
          )}
          {errorCode && (
            <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-error-bg px-3 py-2 text-sm text-error-text">
              {t([`live.preview.errors.${errorCode}`, 'live.preview.errors.generic'])}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void refetchStream()}
            className="absolute bottom-6 right-6 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <RefreshIcon size={13} />
            {t('live.preview.refresh')}
          </Button>
        </div>
      </div>

      {/* Bottom: real-time stats */}
      <div className="border-t border-border bg-surface">
        <p className="border-b border-border px-4 py-2 text-xs font-semibold text-text-secondary">
          {t('live.preview.realtimeData')}
        </p>
        <div className="grid grid-cols-3 divide-x divide-border">
          <StatCard label={t('live.preview.viewers')} value={stats?.viewers ?? 0} className="rounded-none border-0 shadow-none" />
          <StatCard label={t('live.preview.likes')} value={stats?.likes ?? 0} className="rounded-none border-0 shadow-none" />
          <StatCard label={t('live.preview.shares')} value={stats?.shares ?? 0} className="rounded-none border-0 shadow-none" />
        </div>
      </div>

      {panel === 'products' && stream && (
        <ProductsPanelModal
          streamId={id}
          products={stream.products}
          onClose={() => setPanel(null)}
        />
      )}
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

// A 9:16 phone-shaped frame for the live preview, so the seller sees the broadcast in
// the exact portrait aspect buyers get on mobile (not a letterboxed landscape box).
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[9/16] h-full max-h-full max-w-full overflow-hidden rounded-[1.75rem] border-[6px] border-black bg-black shadow-2xl">
      {children}
    </div>
  )
}

// Phone handoff: the recommended way to broadcast — scan the QR with your phone to
// open the OZB app's host screen for THIS stream, then tap Go Live. The phone is the
// camera (native portrait, full quality); this desktop is the control room.
function PhoneHandoff({ deepLink }: { deepLink: string }) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
      <span className="rounded-full bg-brand/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
        {t('live.preview.phone.recommended', { defaultValue: 'Recommended' })}
      </span>
      <h3 className="mt-3 text-base font-semibold text-white">
        {t('live.preview.phone.title', { defaultValue: 'Broadcast from your phone' })}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-white/55">
        {t('live.preview.phone.subtitle', {
          defaultValue: 'Scan to open the OZB app for this stream, then tap Go Live. Manage products, offers and comments here.',
        })}
      </p>
      <div className="mt-5 rounded-xl bg-white p-3">
        <QRCodeSVG value={deepLink} size={184} level="M" />
      </div>
      <div className="mt-4 flex flex-col items-center gap-1 text-xs text-white/40">
        <span>{t('live.preview.phone.step1', { defaultValue: '1. Open the camera on your phone' })}</span>
        <span>{t('live.preview.phone.step2', { defaultValue: '2. Scan the code → OZB app opens' })}</span>
        <span>{t('live.preview.phone.step3', { defaultValue: '3. Tap Go Live' })}</span>
      </div>
    </div>
  )
}
