import { useState } from 'react'
import type { ButtonProps, TagProps } from '../../components'
import { Button, IconButton, Tag, TextLink } from '../../components'
import { Readout, Specimen, SpecimenGrid } from '../GallerySection'

const buttonVariants: ButtonProps['variant'][] = ['primary', 'secondary']
const buttonSizes: ButtonProps['size'][] = ['large', 'medium', 'small']
const iconButtonVariants = ['primary', 'neutral', 'outline', 'ghost'] as const
const tagColors: TagProps['color'][] = ['green', 'blue', 'magenta', 'purple']

export function ButtonsBody() {
  return (
    <>
      <SpecimenGrid>
        {buttonVariants.map((variant) =>
          buttonSizes.map((size) => (
            <Specimen key={`${variant}-${size}`} label={`${variant} / ${size}`}>
              <div className="ds-row">
                {/* The focus specimen the screenshot suite tabs to. */}
                <Button
                  id={variant === 'primary' && size === 'large' ? 'focus-button' : undefined}
                  label="Save"
                  variant={variant}
                  size={size}
                />
                <Button label="Disabled" variant={variant} size={size} disabled />
              </div>
            </Specimen>
          )),
        )}
      </SpecimenGrid>

      <SpecimenGrid>
        <Specimen label="icon">
          <Button label="Transfer" icon="send" />
        </Specimen>
        <Specimen label="showIcon (per-size default glyph)">
          <div className="ds-row">
            <Button label="Large" showIcon />
            <Button label="Small" size="small" showIcon />
          </div>
        </Specimen>
        <Specimen label="native attribute passthrough (aria-pressed)">
          <Button label="Pressed" aria-pressed="true" variant="secondary" />
        </Specimen>
      </SpecimenGrid>
    </>
  )
}

export function IconButtonsBody() {
  return (
    <SpecimenGrid width="tight">
      {iconButtonVariants.map((variant) => (
        <Specimen key={variant} label={`${variant} / medium + small`} center>
          <div className="ds-icon-row">
            <IconButton variant={variant} size="medium" icon="x" label="Close" />
            <IconButton variant={variant} size="small" icon="plus" label="Add" />
            <IconButton variant={variant} size="medium" icon="x" label="Close" disabled />
          </div>
        </Specimen>
      ))}
    </SpecimenGrid>
  )
}

export function TextLinkBody() {
  const [clicks, setClicks] = useState(0)

  return (
    <>
      <SpecimenGrid width="tight">
        <Specimen label="medium (default, trailing caret)">
          <TextLink href="#section-text-link">View all</TextLink>
        </Specimen>
        <Specimen label="small">
          <TextLink href="#section-text-link" size="small">
            View all
          </TextLink>
        </Specimen>
        <Specimen label="iconPosition = leading">
          <TextLink href="#section-text-link" icon="caret-left" iconPosition="leading">
            Back to Learn
          </TextLink>
        </Specimen>
        <Specimen label="icon = null">
          <TextLink href="#section-text-link" icon={null}>
            Terms and conditions
          </TextLink>
        </Specimen>
        <Specimen label="button (no href)">
          <TextLink onClick={() => setClicks((count) => count + 1)}>Show more</TextLink>
        </Specimen>
        <Specimen label="disabled (button only)">
          <TextLink disabled>Show more</TextLink>
        </Specimen>
      </SpecimenGrid>
      <Readout>Button link pressed {clicks} times</Readout>
    </>
  )
}

export function TagsBody() {
  const [visible, setVisible] = useState(true)

  return (
    <>
      <SpecimenGrid width="tight">
        {tagColors.map((color) => (
          <Specimen key={color} label={`color = ${color}`} center>
            <div className="ds-row">
              <Tag color={color} label="Travel" />
              <Tag color={color} label="Fixed" dismissible={false} />
            </div>
          </Specimen>
        ))}
        <Specimen label="controlled visibility" center>
          <div className="ds-row">
            <Tag
              color="magenta"
              label="Dismiss me"
              visible={visible}
              onVisibleChange={setVisible}
            />
            {visible ? null : (
              <Button label="Restore tag" size="small" onClick={() => setVisible(true)} />
            )}
          </div>
        </Specimen>
      </SpecimenGrid>
    </>
  )
}
