import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRealtimeKitSelector } from '@cloudflare/realtimekit-react'
import {
  RtkCameraToggle,
  RtkMicToggle,
  RtkScreenShareToggle,
  RtkParticipantsAudio,
} from '@cloudflare/realtimekit-react-ui'
import type RTKClient from '@cloudflare/realtimekit'

// Desktop live broadcast canvas — a two-column studio (like Shopee/TikTok Live):
//   LEFT  = flexible panel for live chat, pinned offers/products, and controls
//           (placeholders for now; wired in later waves).
//   RIGHT = a fixed PORTRAIT (9:16) video stage + the host control bar.
// The seller's webcam is shown object-cover inside the portrait frame so the stage
// is always portrait regardless of the camera's native aspect. On narrow screens the
// panel is hidden and the portrait stage fills the width.

interface Props {
  meeting: RTKClient
}

export function BroadcastStage({ meeting }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)

  const videoEnabled = useRealtimeKitSelector((m) => m.self.videoEnabled)
  const screenShareEnabled = useRealtimeKitSelector((m) => m.self.screenShareEnabled)

  // Going live = camera + mic ON immediately (RealtimeKit defaults self-media off;
  // without publishing video the meeting never produces media). The host can toggle
  // off with the controls below.
  useEffect(() => {
    // Publish the camera at its NATIVE resolution (do NOT force portrait constraints
    // on a landscape webcam — that downscales/upscales and pixelates). Portrait comes
    // from broadcasting via the phone app; the desktop webcam is a clean-quality
    // fallback shown full-frame (object-contain) below.
    void meeting.self.enableVideo().catch(() => {})
    void meeting.self.enableAudio().catch(() => {})
  }, [meeting])

  useAttachTrack(videoRef, meeting.self.videoTrack, videoEnabled)
  useAttachTrack(screenRef, meeting.self.screenShareTracks?.video, screenShareEnabled)

  return (
    <div className="flex flex-1 overflow-hidden bg-[#0b1220]">
      {/* LEFT — live commerce panel (chat / offers / controls) */}
      <BroadcastPanel />

      {/* RIGHT — portrait stage + controls */}
      <div className="flex w-full flex-col items-center justify-center gap-3 p-3 lg:w-[440px] lg:shrink-0 lg:border-l lg:border-white/10">
        <div className="relative aspect-[9/16] h-full max-h-full w-auto max-w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          {screenShareEnabled ? (
            <video ref={screenRef} autoPlay playsInline muted className="h-full w-full object-contain" />
          ) : videoEnabled ? (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full -scale-x-100 object-contain" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <p className="text-sm">Camera off</p>
            </div>
          )}

          {/* PiP self-camera while screen sharing */}
          {screenShareEnabled && videoEnabled && (
            <video ref={videoRef} autoPlay playsInline muted className="absolute bottom-3 right-3 h-28 w-20 -scale-x-100 rounded-lg border border-white/20 object-cover shadow-lg" />
          )}
        </div>

        {/* Host controlbar */}
        <div className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2">
          <RtkMicToggle meeting={meeting} />
          <RtkCameraToggle meeting={meeting} />
          <RtkScreenShareToggle meeting={meeting} />
        </div>
      </div>

      <RtkParticipantsAudio meeting={meeting} />
    </div>
  )
}

// LEFT panel — placeholder sections for the live-commerce controls we'll wire next
// (real-time chat, pinned offers/products, moderation). Desktop-only.
function BroadcastPanel() {
  const { t } = useTranslation()
  return (
    <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
      {/* Pinned offers / products */}
      <PanelSection title={t('golive.panel.offers', { defaultValue: 'Pinned offers' })} icon="tag">
        <PanelEmpty text={t('golive.panel.offersEmpty', { defaultValue: 'Pin products to feature them to buyers during the stream.' })} />
      </PanelSection>

      {/* Live chat / messages */}
      <div className="flex min-h-0 flex-1 flex-col border-t border-white/10">
        <PanelSection title={t('golive.panel.chat', { defaultValue: 'Live chat' })} icon="chat" grow>
          <PanelEmpty text={t('golive.panel.chatEmpty', { defaultValue: 'Messages from viewers will appear here.' })} />
        </PanelSection>
      </div>
    </div>
  )
}

function PanelSection({ title, icon, grow, children }: { title: string; icon: 'tag' | 'chat'; grow?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col ${grow ? 'min-h-0 flex-1' : ''} px-4 py-3`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/50">
        <Icon name={icon} />
        {title}
      </div>
      <div className={`${grow ? 'min-h-0 flex-1' : ''} flex items-center justify-center`}>{children}</div>
    </div>
  )
}

function PanelEmpty({ text }: { text: string }) {
  return <p className="max-w-xs text-center text-sm text-white/30">{text}</p>
}

function Icon({ name }: { name: 'tag' | 'chat' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {name === 'tag' ? (
        <>
          <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
          <circle cx="7" cy="7" r="1" />
        </>
      ) : (
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      )}
    </svg>
  )
}

// Binds a MediaStreamTrack to a <video> element, rebuilding the MediaStream whenever
// the track identity or the enabled flag changes.
function useAttachTrack(
  ref: React.RefObject<HTMLVideoElement | null>,
  track: MediaStreamTrack | undefined,
  enabled: boolean,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (enabled && track) {
      el.srcObject = new MediaStream([track])
    } else {
      el.srcObject = null
    }
    return () => {
      if (el) el.srcObject = null
    }
  }, [ref, track, enabled])
}
