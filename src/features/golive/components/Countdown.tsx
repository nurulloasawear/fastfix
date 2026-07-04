import { useEffect, useRef, useState } from 'react'

// Shopee-style "get ready" countdown. While 3→2→1 ticks, the parent provisions the
// stream and warms the camera in parallel, so going live feels instant at zero. We
// also show the seller their own camera preview (mirror check) behind the ring.
interface Props {
  stream: MediaStream | null // pre-warmed local camera, shown as a mirror preview
  statusText?: string
  from?: number // start number (default 3)
  onComplete: () => void
}

export function Countdown({ stream, statusText, from = 3, onComplete }: Props) {
  const [n, setN] = useState(from)
  const videoRef = useRef<HTMLVideoElement>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  useEffect(() => {
    if (n <= 0) {
      if (!doneRef.current) {
        doneRef.current = true
        onComplete()
      }
      return
    }
    const t = setTimeout(() => setN((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [n, onComplete])

  const R = 54
  const C = 2 * Math.PI * R
  const pct = Math.max(0, n) / from

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
      {stream && (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-50" />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex flex-col items-center gap-5">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span key={n} className="animate-[pop_0.3s_ease-out] text-6xl font-bold text-white">{Math.max(1, n)}</span>
          </div>
        </div>
        {statusText && <p className="text-sm font-medium text-white/85">{statusText}</p>}
      </div>

      <style>{`@keyframes pop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1)}}`}</style>
    </div>
  )
}
