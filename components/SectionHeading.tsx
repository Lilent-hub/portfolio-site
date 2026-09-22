export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
}: {
  eyebrow: string
  title: string
  lede?: string
  align?: 'left' | 'center'
}) {
  const center = align === 'center'
  return (
    <div className={`mb-10 flex flex-col gap-3 sm:mb-14 ${center ? 'items-center text-center' : ''}`}>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      <span className="section-rule" aria-hidden />
      {lede && <p className="max-w-xl text-base text-muted sm:text-lg">{lede}</p>}
    </div>
  )
}
