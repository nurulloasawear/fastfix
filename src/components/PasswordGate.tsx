import { useState, type FormEvent, type ReactNode } from 'react'

// PasswordGate: a lightweight pre-launch access gate for the public deployment.
// It is NOT real security (the real auth is the seller login + backend) — it just
// keeps the public out while we're in development. The password is compared by
// SHA-256 so the plaintext never ships in the bundle, and a successful unlock is
// remembered in localStorage for 7 days. If VITE_GATE_PASSWORD_HASH is unset
// (e.g. local dev) the gate is disabled.

const HASH = import.meta.env.VITE_GATE_PASSWORD_HASH as string | undefined
const KEY = 'ozb_gate_until'
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Paths that are PUBLIC by design and must bypass the gate entirely. The live WATCH
// page is shared as a link to anonymous buyers (no login, no seller account) — gating
// it would block the whole point of a public stream link.
function isPublicPath(): boolean {
  return window.location.pathname.startsWith('/live/watch/')
}

function unlockedNow(): boolean {
  if (isPublicPath()) return true // public route → never gated
  if (!HASH) return true // no gate configured → open
  return Date.now() < Number(localStorage.getItem(KEY) || 0)
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(unlockedNow)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState(false)

  if (unlocked) return <>{children}</>

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const ok = (await sha256Hex(pw)) === HASH
    setBusy(false)
    if (ok) {
      localStorage.setItem(KEY, String(Date.now() + SEVEN_DAYS))
      setUnlocked(true)
    } else {
      setErr(true)
    }
  }

  return (
    <div style={S.screen}>
      <form onSubmit={submit} style={S.card}>
        <div style={S.brand}>OZB</div>
        <div style={S.sub}>Seller Centre · private preview</div>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value)
            setErr(false)
          }}
          placeholder="Access password"
          autoFocus
          autoComplete="current-password"
          style={{ ...S.input, ...(err ? S.inputErr : null) }}
        />
        <button type="submit" disabled={busy || !pw} style={{ ...S.btn, ...(busy || !pw ? S.btnOff : null) }}>
          {busy ? 'Checking…' : 'Enter'}
        </button>
        {err && <div style={S.err}>Wrong password — try again</div>}
        <div style={S.note}>Saved on this browser for 7 days.</div>
      </form>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  screen: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2d201c',
    fontFamily: 'Poppins, system-ui, sans-serif',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    background: '#fff',
    borderRadius: 18,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 20px 60px rgba(0,0,0,.35)',
  },
  brand: { fontSize: 34, fontWeight: 800, color: '#2d201c', letterSpacing: 1 },
  sub: { fontSize: 13, color: '#6b6b6b', marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 12,
    border: '1px solid #e3e3e3',
    padding: '0 16px',
    fontSize: 15,
    outline: 'none',
  },
  inputErr: { borderColor: '#e5484d' },
  btn: {
    height: 48,
    borderRadius: 999,
    border: 'none',
    background: '#fdd400',
    color: '#2d201c',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnOff: { opacity: 0.55, cursor: 'not-allowed' },
  err: { color: '#e5484d', fontSize: 13 },
  note: { color: '#9a9a9a', fontSize: 12, marginTop: 4 },
}
