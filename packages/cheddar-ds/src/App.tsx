import { useEffect, useState } from 'react'
import { Button, TextLink, Wordmark } from './components'
import { runA11yTokenChecks } from './a11y/contrast'
import { GallerySection } from './gallery/GallerySection'
import type { GalleryTheme } from './gallery/galleryTheme'
import {
  GalleryThemeContext,
  appearanceOptions,
  brandOptions,
  defaultGalleryTheme,
  galleryThemeSearch,
  readGalleryTheme,
  schemeOptions,
} from './gallery/galleryTheme'
import { gallerySections } from './gallery/sections'
import './gallery/gallery.css'

if (import.meta.env.DEV) {
  runA11yTokenChecks()
}

function prefersDarkScheme() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
}

function App() {
  const [theme, setTheme] = useState<GalleryTheme>(() =>
    readGalleryTheme(typeof window === 'undefined' ? '' : window.location.search, {
      ...defaultGalleryTheme,
      scheme: prefersDarkScheme() ? 'dark' : 'light',
    }),
  )

  // brand and scheme go on <html> so the whole page — including the
  // documentation chrome — re-themes. `appearance` is applied per section
  // instead (see GallerySection): it is a canvas treatment for product
  // surfaces, and on the root it would paint white chrome text onto white
  // panels. The URL carries all three so a screenshot run can pin the theme.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.brand = theme.brand
    root.dataset.theme = theme.scheme
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${galleryThemeSearch(theme)}${window.location.hash}`,
    )
  }, [theme])

  return (
    <GalleryThemeContext value={theme}>
      <main className="app-shell ds-page">
        {/* Deliberately not sticky: a sticky header overlaps the top of every
            locator screenshot the visual suite takes. */}
        <header className="brand-hero">
          <Wordmark />
        </header>

        <section className="ds-section">
          <h1>Design System Overview</h1>
          <p>
            Foundations first (type, colour, theming), then the app-shell composition, then one
            section per component with a specimen for every documented variant and state. Every
            section carries a stable <code>id</code> and <code>data-gallery-section</code>{' '}
            attribute — <code>tests/visual</code> screenshots them one at a time.
          </p>

          <div className="ds-controls" id="gallery-controls" data-gallery-section="controls">
            <div className="ds-control-row">
              <span className="ds-control-legend">brand</span>
              {brandOptions.map((brand) => (
                <Button
                  key={brand}
                  label={brand}
                  size="small"
                  variant={theme.brand === brand ? 'primary' : 'secondary'}
                  aria-pressed={theme.brand === brand}
                  onClick={() => setTheme((current) => ({ ...current, brand }))}
                />
              ))}
            </div>
            <div className="ds-control-row">
              <span className="ds-control-legend">scheme</span>
              {schemeOptions.map((scheme) => (
                <Button
                  key={scheme}
                  label={scheme}
                  size="small"
                  variant={theme.scheme === scheme ? 'primary' : 'secondary'}
                  aria-pressed={theme.scheme === scheme}
                  onClick={() => setTheme((current) => ({ ...current, scheme }))}
                />
              ))}
            </div>
            <div className="ds-control-row">
              <span className="ds-control-legend">appearance</span>
              {appearanceOptions.map((appearance) => (
                <Button
                  key={appearance}
                  label={appearance}
                  size="small"
                  variant={theme.appearance === appearance ? 'primary' : 'secondary'}
                  aria-pressed={theme.appearance === appearance}
                  onClick={() => setTheme((current) => ({ ...current, appearance }))}
                />
              ))}
            </div>
          </div>

          <nav className="ds-toc" aria-label="Sections">
            {gallerySections.map(({ id, title }) => (
              <TextLink key={id} href={`#section-${id}`} size="small" icon={null}>
                {title}
              </TextLink>
            ))}
          </nav>
        </section>

        {gallerySections.map(({ id, title, note, appearance, Body }) => (
          <GallerySection key={id} id={id} title={title} note={note} appearance={appearance}>
            <Body />
          </GallerySection>
        ))}
      </main>
    </GalleryThemeContext>
  )
}

export default App
