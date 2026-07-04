// First-visit intro modal for Seller Missions — two-column layout.
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

type Props = {
  onSkip: () => void
  onStart: () => void
}

export function MissionsIntroModal({ onSkip, onStart }: Props) {
  const { t } = useTranslation()

  return (
    <Modal
      open
      onClose={onSkip}
      title={t('shop.missions.introTitle')}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onSkip}>
            {t('shop.missions.introSkip')}
          </Button>
          <Button onClick={onStart}>{t('shop.missions.introStart')}</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6 py-2">
        {/* Progressive learning */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warning-bg">
            <TrophyIllo />
          </div>
          <p className="text-sm font-semibold text-text">
            {t('shop.missions.introProgressive')}
          </p>
          <p className="text-xs text-muted">{t('shop.missions.introProgressiveDesc')}</p>
        </div>

        {/* Attractive rewards */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
            <StarsIllo />
          </div>
          <p className="text-sm font-semibold text-text">
            {t('shop.missions.introRewards')}
          </p>
          <p className="text-xs text-muted">{t('shop.missions.introRewardsDesc')}</p>
        </div>
      </div>
    </Modal>
  )
}

// Inline SVG illustrations ─────────────────────────────────────────────────────
function TrophyIllo() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none" aria-hidden="true">
      <rect x="28" y="60" width="24" height="8" rx="3" fill="#c4a882" />
      <rect x="32" y="50" width="16" height="12" rx="2" fill="#e8b89a" />
      <path d="M10 18 Q6 36 20 48 Q38 53 40 42 Q42 53 60 48 Q74 36 70 18 Z" fill="#ffd700" />
      <circle cx="40" cy="30" r="10" fill="#fff176" />
      <path d="M37 29 l2.5 5 4-8" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="10" r="3" fill="#f5c842" />
      <circle cx="62" cy="8" r="2.5" fill="#ffd700" />
      <circle cx="70" cy="28" r="3" fill="#f5c842" />
    </svg>
  )
}

function StarsIllo() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none" aria-hidden="true">
      <polygon
        points="40,10 46,28 65,28 50,39 56,58 40,47 24,58 30,39 15,28 34,28"
        fill="#ffd700"
      />
      <polygon points="70,15 72,21 78,21 73,25 75,31 70,27 65,31 67,25 62,21 68,21" fill="#f5c842" />
      <polygon points="12,45 14,50 19,50 15,53 17,58 12,55 7,58 9,53 5,50 10,50" fill="#f5c842" />
      <circle cx="65" cy="50" r="3" fill="#ffd700" opacity=".7" />
      <circle cx="15" cy="20" r="2.5" fill="#ffd700" opacity=".6" />
    </svg>
  )
}
