import type { ReactNode } from 'react'
import type { BrandTheme } from '../../components'
import { Button, Tag, ThemeScope } from '../../components'
import { Icon } from '../../components/icon/Icon'
import { brandOptions } from '../galleryTheme'
import { Specimen, SpecimenGrid } from '../GallerySection'

const rampSteps = ['100', '200', '300', '400', '500', '600'] as const

function ThemeTile({ caption, tag }: { caption: string; tag?: ReactNode }) {
  return (
    <>
      <p className="ds-theme-tile-caption">{caption}</p>
      <div className="ds-theme-ramp">
        {rampSteps.map((step) => (
          <span key={step} style={{ background: `var(--cds-color-brand-${step})` }} />
        ))}
      </div>
      <div className="ds-theme-controls">
        <Button label="Save" variant="primary" size="small" />
        <Icon name="sparkle" width={24} height={24} tone="brand" />
        {tag}
      </div>
    </>
  )
}

export function ThemingBody() {
  return (
    <>
      <SpecimenGrid width="wide">
        {brandOptions.map((brand: BrandTheme) => (
          <Specimen key={brand} label={`brand = ${brand}`}>
            <div className="ds-theme-pair">
              {(['light', 'dark'] as const).map((scheme) => (
                <ThemeScope key={scheme} brand={brand} scheme={scheme} className="ds-theme-tile">
                  <ThemeTile
                    caption={`scheme = ${scheme}`}
                    tag={<Tag color={brand} label={brand} dismissible={false} />}
                  />
                </ThemeScope>
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="appearance = surface vs appearance = brand (same markup)">
          <div className="ds-theme-pair">
            <ThemeScope appearance="surface" className="ds-theme-tile">
              <ThemeTile caption="appearance = surface" />
            </ThemeScope>
            <ThemeScope appearance="brand" className="ds-theme-tile">
              <ThemeTile caption="appearance = brand" />
            </ThemeScope>
          </div>
        </Specimen>
        <Specimen label="appearance = brand across all four brands">
          <div className="ds-theme-pair">
            {brandOptions.map((brand: BrandTheme) => (
              <ThemeScope
                key={brand}
                brand={brand}
                appearance="brand"
                className="ds-theme-tile"
              >
                <ThemeTile caption={brand} />
              </ThemeScope>
            ))}
          </div>
        </Specimen>
      </SpecimenGrid>

      <Specimen label="Nesting — a light green frame inside a branded purple shell" full>
        <ThemeScope brand="purple" appearance="brand" className="ds-theme-nested">
          <div className="ds-theme-controls">
            <Button label="Purple / brand canvas" variant="primary" size="small" />
            <Icon name="sparkle" width={24} height={24} tone="brand" />
          </div>
          <ThemeScope brand="green" scheme="light" as="section" className="ds-theme-tile">
            <ThemeTile
              caption="green / light (nested island)"
              tag={<Tag color="green" label="Nested" dismissible={false} />}
            />
          </ThemeScope>
        </ThemeScope>
      </Specimen>
    </>
  )
}
