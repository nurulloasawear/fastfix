import { useRef, useState } from 'react'
import { ImagePlus } from '@/features/products'

type Props = {
  title: string
  hint: string
  accept: string
  label: string
  multiple?: boolean
  onChange: (count: number) => void
}

// Presentational upload box. Reports how many files were picked to the parent;
// the parent form owns the real submit state.
export function UploadZone({ title, hint, accept, label, multiple, onChange }: Props) {
  const ref = useRef<HTMLInputElement | null>(null)
  const [names, setNames] = useState<string[]>([])

  function handle(files: FileList | null) {
    const picked = files ? Array.from(files) : []
    setNames(picked.map((f) => f.name))
    onChange(picked.length)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-text-secondary">{label}</div>
      <p className="text-xs text-muted">{hint}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-bg text-sm text-muted transition-colors hover:border-brand hover:bg-surface"
      >
        <ImagePlus size={22} />
        <span className="px-3 text-center">
          {names.length > 0 ? names.join(', ') : title}
        </span>
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  )
}
