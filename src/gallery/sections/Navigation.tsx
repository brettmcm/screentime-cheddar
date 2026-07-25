import { useState } from 'react'
import type { NavItemConfig } from '../../components'
import { Avatar, Button, IconButton, Nav, PageHeader, Sheet, Tag, TextLink } from '../../components'
import { Readout, Specimen, SpecimenGrid } from '../GallerySection'

const compactNavItems: NavItemConfig[] = [
  { key: 'home', icon: 'home', label: 'Home', href: '#section-nav' },
  { key: 'chart', icon: 'chart', label: 'Insights', href: '#section-nav' },
  { key: 'settings', icon: 'settings', label: 'Settings', href: '#section-nav' },
]

export function NavBody() {
  const [active, setActive] = useState('home')
  const [adds, setAdds] = useState(0)

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="interactive — arrow keys move focus, click selects">
          <Nav
            activeItem={active}
            onItemSelect={setActive}
            onAddSelect={() => setAdds((count) => count + 1)}
          />
        </Specimen>
        <Specimen label="showLabels">
          <Nav activeItem={active} showLabels onItemSelect={setActive} />
        </Specimen>
        <Specimen label="custom items rendered as links">
          <Nav activeItem="chart" items={compactNavItems} showLabels />
        </Specimen>
        <Specimen label="addLabel override">
          <Nav activeItem="profile" addLabel="New goal" onAddSelect={() => setAdds((n) => n + 1)} />
        </Specimen>
      </SpecimenGrid>
      <Readout>
        Selected item: {active} · Add pressed {adds} times
      </Readout>
    </>
  )
}

export function PageHeaderBody() {
  const [trail, setTrail] = useState<string[]>(['Home', 'Goals', 'Freshman Trip'])
  const current = trail[trail.length - 1] ?? 'Home'

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="align = left">
          <PageHeader title="Your goals" align="left" />
        </Specimen>
        <Specimen label="align = center">
          <PageHeader title="Add funds" align="center" />
        </Specimen>
        <Specimen label="onBack — pops the breadcrumb below">
          <PageHeader
            title={current}
            align="center"
            onBack={() => setTrail((path) => (path.length > 1 ? path.slice(0, -1) : path))}
          />
        </Specimen>
        <Specimen label="leading + trailing slots">
          <PageHeader
            title="Profile"
            leading={<Avatar size="32" name="Jamie Kowalski" />}
            trailing={<IconButton icon="settings" variant="ghost" size="small" label="Settings" />}
          />
        </Specimen>
        <Specimen label="as = h3, showBack = false">
          <PageHeader title="Section heading" as="h3" showBack={false} />
        </Specimen>
        <Specimen label="inert back control (no onBack)">
          <PageHeader title="No handler" align="left" />
        </Specimen>
      </SpecimenGrid>
      <Readout>Breadcrumb: {trail.join(' › ')}</Readout>
    </>
  )
}

export function SheetBody() {
  const [openSheet, setOpenSheet] = useState<'bottom' | 'center' | 'full' | null>(null)
  const [outcome, setOutcome] = useState('nothing yet')

  const close = () => setOpenSheet(null)

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="bottom sheet (default)">
          <Button id="open-sheet" label="Open bottom sheet" onClick={() => setOpenSheet('bottom')} />
        </Specimen>
        <Specimen label="centre dialog">
          <Button
            label="Open centre dialog"
            variant="secondary"
            onClick={() => setOpenSheet('center')}
          />
        </Specimen>
        <Specimen label="full-height sheet, scrim dismissal off">
          <Button
            label="Open full sheet"
            variant="secondary"
            onClick={() => setOpenSheet('full')}
          />
        </Specimen>
      </SpecimenGrid>
      <Readout>Last sheet outcome: {outcome}</Readout>

      <Sheet
        open={openSheet === 'bottom'}
        title="Move money"
        description="Choose where this deposit should land."
        onClose={close}
        footer={
          <>
            <Button
              label="Move $25.00"
              onClick={() => {
                setOutcome('confirmed from the bottom sheet')
                close()
              }}
            />
            <Button label="Cancel" variant="secondary" onClick={close} />
          </>
        }
      >
        <div className="ds-row">
          <Tag color="green" label="Freshman Trip" dismissible={false} />
          <Tag color="blue" label="Headphones" dismissible={false} />
        </div>
      </Sheet>

      <Sheet
        open={openSheet === 'center'}
        position="center"
        title="Delete this goal?"
        description="Anything saved moves back to your main balance."
        onClose={close}
        footer={
          <Button
            label="Delete goal"
            onClick={() => {
              setOutcome('goal deleted from the centre dialog')
              close()
            }}
          />
        }
      />

      <Sheet
        open={openSheet === 'full'}
        size="full"
        title="Everything you saved this year"
        dismissOnScrim={false}
        onClose={close}
      >
        <p>Scrim dismissal is off here — use the close button or Escape.</p>
        <TextLink onClick={close}>Close from a link</TextLink>
      </Sheet>
    </>
  )
}
