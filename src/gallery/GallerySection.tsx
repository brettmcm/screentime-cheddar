import type { ReactNode } from 'react'
import type { Appearance } from '../components'
import { ThemeScope } from '../components'
import { classNames } from '../components/utils/classNames'
import { useGalleryTheme } from './galleryTheme'

export type GallerySectionProps = {
  /**
   * Screenshot handle. Renders as both `id="section-{id}"` and
   * `data-gallery-section="{id}"`, which is what tests/visual targets.
   */
  id: string
  title: string
  note?: string
  /** Pins the surface treatment instead of following the gallery control. */
  appearance?: Appearance
  children: ReactNode
}

export function GallerySection({ id, title, note, appearance, children }: GallerySectionProps) {
  const theme = useGalleryTheme()

  return (
    <section id={`section-${id}`} data-gallery-section={id} className="ds-section">
      <div className="ds-section-heading">
        <h2>{title}</h2>
        {note ? <p className="ds-section-note">{note}</p> : null}
      </div>
      <ThemeScope appearance={appearance ?? theme.appearance} className="ds-specimen">
        {children}
      </ThemeScope>
    </section>
  )
}

export type SpecimenGridProps = {
  width?: 'default' | 'tight' | 'wide'
  children: ReactNode
}

export function SpecimenGrid({ width = 'default', children }: SpecimenGridProps) {
  return (
    <div
      className={classNames(
        'ds-variant-grid',
        width === 'tight' && 'ds-variant-grid-tight',
        width === 'wide' && 'ds-variant-grid-wide',
      )}
    >
      {children}
    </div>
  )
}

export type SpecimenProps = {
  label: string
  center?: boolean
  /** Spans every column of the enclosing grid. */
  full?: boolean
  children: ReactNode
}

export function Specimen({ label, center = false, full = false, children }: SpecimenProps) {
  return (
    <article
      // Deliberately not `.panel`: `[data-appearance="brand"]` resets panels to
      // dark-on-light text, but `.ds-variant-card.panel` is transparent, so the
      // label would sit black-on-brand.
      className={classNames(
        'ds-variant-card',
        center && 'ds-center',
        full && 'ds-card-small-row',
      )}
    >
      <p className="ds-variant-label">{label}</p>
      {children}
    </article>
  )
}

/** Live state read-out, so an interactive specimen shows what it just did. */
export function Readout({ children }: { children: ReactNode }) {
  return (
    <p className="ds-readout" role="status">
      {children}
    </p>
  )
}
