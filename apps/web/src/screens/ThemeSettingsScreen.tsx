import { Button, Icon, PageHeader, ThemeScope } from '@screentime/cheddar-ds'
import { useId, type ReactNode } from 'react'
import { Screen } from '../components'
import { brandLabels, useApp } from '../state/AppContext'
import { themeFor, type Brand, type Mode } from '../state/model'

const brands: { name: Brand; description: string }[] = [
  { name: 'magenta', description: 'Deep burgundy · Magenta accents' },
  { name: 'blue', description: 'Deep cobalt · Cyan accents' },
  { name: 'green', description: 'Deep forest · Lime accents' },
  { name: 'purple', description: 'Deep violet · Lavender accents' },
]

const modes: { name: Mode; label: string; description: string }[] = [
  { name: 'dark', label: 'Dark', description: 'Saturated brand canvas' },
  { name: 'light', label: 'Light', description: 'Bright canvas, same accents' },
]

/** The three steps a swatch row shows: canvas, accent, and the pale tint. */
const swatchSteps = ['100', '400', '600'] as const

export function ThemeSettingsScreen() {
  const { brand, mode, setBrand, setMode, back } = useApp()

  return (
    <Screen className="stacked-screen theme-screen">
      <PageHeader title="Theme Settings" align="center" onBack={back} />
      <p className="settings-copy">Choose a color theme for your entire Cheddar experience.</p>

      <fieldset className="theme-options">
        <legend className="sr-only">Color theme</legend>
        {brands.map((option) => (
          // Each card previews the brand it offers, in the mode now in force.
          <ThemeScope key={option.name} {...themeFor(mode)} brand={option.name} as="div">
            <ThemeOption
              group="brand"
              label={brandLabels[option.name]}
              description={option.description}
              selected={brand === option.name}
              onSelect={() => setBrand(option.name)}
              visual={
                <span className="theme-swatches" aria-hidden="true">
                  {swatchSteps.map((step) => (
                    <span key={step} style={{ background: `var(--cds-color-brand-${step})` }} />
                  ))}
                </span>
              }
            />
          </ThemeScope>
        ))}
      </fieldset>

      <fieldset className="theme-options">
        <legend className="settings-legend">Appearance</legend>
        {modes.map((option) => (
          <ThemeOption
            key={option.name}
            group="mode"
            label={option.label}
            description={option.description}
            selected={mode === option.name}
            onSelect={() => setMode(option.name)}
            visual={
              <ThemeScope
                {...themeFor(option.name)}
                brand={brand}
                className="theme-mode-chip"
                aria-hidden="true"
              >
                <span />
              </ThemeScope>
            }
          />
        ))}
      </fieldset>

      <p className="settings-legend">Preview</p>
      {/* Canvas and card together, so the mode reads as more than an accent swap. */}
      <ThemeScope {...themeFor(mode)} brand={brand} className="theme-preview">
        <span className="panel theme-preview-card">
          <span className="theme-preview-row">
            <span className="theme-preview-avatar" />
            <span className="theme-preview-lines">
              <span />
              <span />
            </span>
          </span>
          <span className="theme-preview-track">
            <span />
          </span>
          <span className="theme-preview-actions">
            <Button label="Deposit" variant="secondary" size="small" />
            <Button label="Save" size="small" />
          </span>
        </span>
      </ThemeScope>
    </Screen>
  )
}

/**
 * A whole card acting as one radio. The input carries the label outright rather
 * than inheriting it from the wrapping element, which would otherwise fold the
 * description into the spoken name.
 */
function ThemeOption({
  group,
  label,
  description,
  selected,
  onSelect,
  visual,
}: {
  group: string
  label: string
  description: string
  selected: boolean
  onSelect: () => void
  visual: ReactNode
}) {
  const descriptionId = useId()

  return (
    <label className={`theme-option${selected ? ' is-selected' : ''}`}>
      <input
        type="radio"
        name={group}
        className="sr-only"
        checked={selected}
        onChange={onSelect}
        aria-label={label}
        aria-describedby={descriptionId}
      />
      {visual}
      <span className="theme-option-text">
        <strong>{label}</strong>
        <span id={descriptionId}>{description}</span>
      </span>
      <span className="theme-option-check" aria-hidden="true">
        {selected ? <Icon name="check" width={14} /> : null}
      </span>
    </label>
  )
}
