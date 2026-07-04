import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useApiKey, useRegenerateApiKey } from '../api/setting.queries'
import { CheckIcon, RefreshIcon, CopyIcon } from './icons'

// Partner-platform API key (server-backed via mock). Copy + regenerate.
export function ApiKeyCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useApiKey()
  const regenerate = useRegenerateApiKey()
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const onCopy = async () => {
    if (!data) return
    await navigator.clipboard.writeText(data.key)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text">{t('setting.partner.cardTitle')}</h2>
        <p className="text-sm text-muted">{t('setting.partner.cardSubtitle')}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-bg p-4">
        <Input
          readOnly
          label={t('setting.partner.apiKeyLabel')}
          value={data?.key ?? ''}
          className="font-mono text-xs"
          trailing={
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void onCopy()}
                title={t('setting.partner.copy')}
                aria-label={copied ? t('setting.partner.copied') : t('setting.partner.copy')}
                className={copied ? 'text-success' : ''}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => regenerate.mutate()}
                disabled={regenerate.isPending}
                title={t('setting.partner.regenerate')}
                aria-label={t('setting.partner.regenerate')}
              >
                <RefreshIcon size={14} />
              </Button>
            </div>
          }
        />
        <p className="text-xs text-muted">{t('setting.partner.warning')}</p>
      </div>
    </Card>
  )
}
