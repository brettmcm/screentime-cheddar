import { Logo, Wordmark } from '../../components'
import type { IconName } from '../../components/icon/Icon'
import { Icon } from '../../components/icon/Icon'
import { demoAssetList } from '../../demo-assets'
import { Specimen, SpecimenGrid } from '../GallerySection'

const typeScale = [
  { name: 'display-xlarge', token: 'var(--cds-type-display-xlarge)', sample: '$672.80' },
  { name: 'display-large', token: 'var(--cds-type-display-large)', sample: '$1,042.75' },
  { name: 'display-medium', token: 'var(--cds-type-display-medium)', sample: '$850.00' },
  { name: 'display-small', token: 'var(--cds-type-display-small)', sample: '$850.00' },
  { name: 'display-xsmall', token: 'var(--cds-type-display-xsmall)', sample: '$850.00' },
  { name: 'heading', token: 'var(--cds-type-heading)', sample: 'Your Spending' },
  { name: 'body-large', token: 'var(--cds-type-body-large)', sample: 'Deposit made' },
  {
    name: 'body-large-strong',
    token: 'var(--cds-type-body-large-strong)',
    sample: 'Deposit made',
  },
  { name: 'body-medium', token: 'var(--cds-type-body-medium)', sample: 'Today, 11:17AM' },
  {
    name: 'body-medium-strong',
    token: 'var(--cds-type-body-medium-strong)',
    sample: 'Today, 11:17AM',
  },
  { name: 'body-small', token: 'var(--cds-type-body-small)', sample: '5 min read' },
  {
    name: 'body-small-strong',
    token: 'var(--cds-type-body-small-strong)',
    sample: '5 min read',
  },
]

const rampSteps = ['100', '200', '300', '400', '500', '600']

const colorFamilies = [
  { name: 'Black', prefix: 'black', steps: rampSteps },
  { name: 'White', prefix: 'white', steps: rampSteps },
  { name: 'Green', prefix: 'green', steps: rampSteps },
  { name: 'Purple', prefix: 'purple', steps: rampSteps },
  { name: 'Magenta', prefix: 'brand', steps: rampSteps },
  { name: 'Blue', prefix: 'blue', steps: rampSteps },
  { name: 'Red (validation)', prefix: 'red', steps: rampSteps },
  { name: 'Neutral', prefix: 'neutral', steps: ['700', '800', '900'] },
]

const cheddarPrimitives = [
  '--token-color-cheddar-black-cherry',
  '--token-color-cheddar-orange',
]

/**
 * Every semantic `--cds-color-*` token. These are the ones the three theming
 * axes re-point, so this grid is the fastest way to see a token regression.
 */
const semanticTokenGroups = [
  {
    name: 'Foreground',
    tokens: [
      '--cds-color-foreground-primary',
      '--cds-color-foreground-secondary',
      '--cds-color-foreground-tertiary',
      '--cds-color-foreground-brand-primary',
      '--cds-color-foreground-brand-secondary',
      '--cds-color-foreground-brand-tertiary',
      '--cds-color-foreground-brand-highlight',
      '--cds-color-foreground-on-reverse',
      '--cds-color-foreground-on-reverse-secondary',
      '--cds-color-foreground-brand-reverse',
      '--cds-color-foreground-brand-reverse-secondary',
      '--cds-color-foreground-brand-reverse-tertiary',
      '--cds-color-foreground-danger',
      '--cds-color-foreground-success',
      '--cds-color-foreground-warning',
    ],
  },
  {
    name: 'Background',
    tokens: [
      '--cds-color-background-default',
      '--cds-color-background-surface',
      '--cds-color-background-muted',
      '--cds-color-background-overlay',
      '--cds-color-bg-brand-primary',
      '--cds-color-bg-brand-secondary',
      '--cds-color-bg-brand-tertiary',
      '--cds-color-bg-brand-shade',
      '--cds-color-bg-on-brand',
      '--cds-color-bg-danger',
    ],
  },
  {
    name: 'Border, icon and track',
    tokens: [
      '--cds-color-border-default',
      '--cds-color-border-strong',
      '--cds-color-border-focus',
      '--cds-color-border-danger',
      '--cds-color-icon-primary',
      '--cds-color-icon-secondary',
      '--cds-color-track-default',
      '--cds-color-shadow-surface',
      '--cds-color-shadow-control',
    ],
  },
]

const iconNames: IconName[] = [
  'home',
  'piggybank',
  'learn',
  'profile',
  'settings',
  'wallet',
  'message',
  'deposit',
  'withdraw',
  'x',
  'plus',
  'caret-left',
  'caret-right',
  'caret-down',
  'arrow-left',
  'arrow-up',
  'arrow-down',
  'arrow-right',
  'notification',
  'edit',
  'send',
  'transfer',
  'receive',
  'guide',
  'heart-outline',
  'heart-fill',
  'search',
  'check',
  'chart',
  'sparkle',
]

export function TypographyBody() {
  return (
    <ul className="ds-type-list">
      {typeScale.map((item) => (
        <li key={item.name} className="ds-type-row">
          <code>{item.name}</code>
          <span className="ds-type-sample" style={{ font: item.token }}>
            {item.sample}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ColorBody() {
  return (
    <>
      <div className="ds-color-list">
        {colorFamilies.map((family) => (
          <div key={family.name} className="ds-color-family">
            <p>{family.name}</p>
            <div className="ds-color-swatches">
              {family.steps.map((step) => (
                <div key={`${family.prefix}-${step}`} className="ds-color-swatch">
                  <span
                    style={{ backgroundColor: `var(--token-color-${family.prefix}-${step})` }}
                  />
                  <code>{step}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="ds-color-family">
          <p>Cheddar</p>
          <div className="ds-color-swatches">
            {cheddarPrimitives.map((token) => (
              <div key={token} className="ds-color-swatch">
                <span style={{ backgroundColor: `var(${token})` }} />
                <code>{token.replace('--token-color-cheddar-', '')}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {semanticTokenGroups.map((group) => (
        <div key={group.name} className="ds-stack">
          <p className="ds-variant-label">Semantic — {group.name}</p>
          <div className="ds-token-grid">
            {group.tokens.map((token) => (
              <div key={token} className="ds-token-swatch">
                <span style={{ background: `var(${token})` }} />
                <code>{token.replace('--cds-color-', '')}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export function IconsBody() {
  return (
    <SpecimenGrid width="tight">
      {iconNames.map((name) => (
        <Specimen key={name} label={name} center>
          <div className="ds-icon-row">
            <Icon name={name} width={24} height={24} />
            <Icon name={name} width={24} height={24} tone="brand" />
          </div>
        </Specimen>
      ))}
    </SpecimenGrid>
  )
}

export function BrandBody() {
  return (
    <SpecimenGrid>
      <Specimen label="Logo" center>
        <Logo />
      </Specimen>
      <Specimen label="Wordmark" center>
        <Wordmark />
      </Specimen>
    </SpecimenGrid>
  )
}

export function DemoAssetsBody() {
  return (
    <div className="ds-asset-grid">
      {demoAssetList.map((asset) => (
        <figure key={asset.key} className="ds-asset">
          <img src={asset.src} alt="" />
          <figcaption>
            <code>{asset.key}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
