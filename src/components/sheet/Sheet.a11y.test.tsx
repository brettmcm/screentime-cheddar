import { useRef, useState } from 'react'
import type { RunOptions } from 'axe-core'
import { describe, expect, it } from 'vitest'
import { Button } from '../button/Button'
import { InputField } from '../input-field/InputField'
import { renderThemed } from '../../test/render'
import { Sheet } from './Sheet'

/**
 * The sheet portals to `document.body`, so axe has to run against the body
 * rather than the render container. Passing a rules object replaces the
 * defaults in `src/test/axe.ts` wholesale, so the two defaults are repeated
 * here alongside the page-level rules: a portalled dialog is a fragment, not a
 * page, so it has no `main` landmark and no level-one heading by design.
 */
const DIALOG_AXE_OPTIONS: RunOptions = {
  rules: {
    // jsdom does not cascade custom properties — contrast lives in
    // src/a11y/contrast.a11y.test.ts and the Playwright suite.
    'color-contrast': { enabled: false },
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
  },
}

function SheetHarness({ title = 'Add money' }: { title?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button label="Open sheet" onClick={() => setOpen(true)} />
      <Sheet
        open={open}
        title={title}
        description="Move money into this goal."
        onClose={() => setOpen(false)}
        footer={<Button label="Confirm" />}
      >
        <InputField label="Amount" />
      </Sheet>
    </>
  )
}

function InitialFocusHarness() {
  const amountRef = useRef<HTMLInputElement>(null)

  return (
    <Sheet open title="Add money" initialFocusRef={amountRef} onClose={() => {}}>
      <InputField label="Amount" ref={amountRef} />
    </Sheet>
  )
}

describe('Sheet accessibility', () => {
  it('renders nothing at all while closed', () => {
    renderThemed(<Sheet open={false} title="Add money" />)

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('exposes a modal dialog named by its title', async () => {
    const { getByRole } = renderThemed(<Sheet open title="Add money" onClose={() => {}} />)

    const dialog = getByRole('dialog', { name: 'Add money' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(document.body).toHaveNoAxeViolations(DIALOG_AXE_OPTIONS)
  })

  it('falls back to aria-label for the accessible name when there is no title', async () => {
    const { getByRole } = renderThemed(
      <Sheet open aria-label="Confirm transfer" onClose={() => {}}>
        <p>Are you sure?</p>
      </Sheet>,
    )

    expect(getByRole('dialog', { name: 'Confirm transfer' })).toHaveAttribute('aria-modal', 'true')
    await expect(document.body).toHaveNoAxeViolations(DIALOG_AXE_OPTIONS)
  })

  it('always has an accessible name, even with neither a title nor a label', async () => {
    const { getByRole } = renderThemed(
      <Sheet open showClose={false} onClose={() => {}}>
        <p>Loading…</p>
      </Sheet>,
    )

    expect(getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument()
    await expect(document.body).toHaveNoAxeViolations(DIALOG_AXE_OPTIONS)
  })

  it('describes the dialog with its description', async () => {
    const { getByRole } = renderThemed(
      <Sheet open title="Add money" description="Move money into this goal." onClose={() => {}} />,
    )

    expect(getByRole('dialog', { name: 'Add money' })).toHaveAccessibleDescription(
      'Move money into this goal.',
    )
    await expect(document.body).toHaveNoAxeViolations(DIALOG_AXE_OPTIONS)
  })

  it.each(['bottom', 'center'] as const)(
    'stays free of violations in the %s position with a body and a footer',
    async (position) => {
      renderThemed(
        <Sheet
          open
          position={position}
          size="full"
          title="Add money"
          onClose={() => {}}
          footer={<Button label="Confirm" />}
        >
          <InputField label="Amount" />
        </Sheet>,
      )

      await expect(document.body).toHaveNoAxeViolations(DIALOG_AXE_OPTIONS)
    },
  )

  it('moves focus to the first control inside the sheet when it opens', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    await user.click(getByRole('button', { name: 'Open sheet' }))

    expect(getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('honours initialFocusRef when the caller nominates a control', () => {
    const { getByRole } = renderThemed(<InitialFocusHarness />)

    expect(getByRole('textbox', { name: 'Amount' })).toHaveFocus()
  })

  it('focuses the dialog itself when it holds no tabbable content', () => {
    const { getByRole } = renderThemed(
      <Sheet open title="Saving…" showClose={false} onClose={() => {}}>
        <p>Hold tight.</p>
      </Sheet>,
    )

    expect(getByRole('dialog', { name: 'Saving…' })).toHaveFocus()
  })

  it('traps Tab inside the sheet, wrapping from the last control to the first', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    await user.click(getByRole('button', { name: 'Open sheet' }))

    const close = getByRole('button', { name: 'Close' })
    const amount = getByRole('textbox', { name: 'Amount' })
    const confirm = getByRole('button', { name: 'Confirm' })

    expect(close).toHaveFocus()
    await user.tab()
    expect(amount).toHaveFocus()
    await user.tab()
    expect(confirm).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('traps Shift+Tab inside the sheet, wrapping from the first control to the last', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    await user.click(getByRole('button', { name: 'Open sheet' }))
    expect(getByRole('button', { name: 'Close' })).toHaveFocus()

    await user.tab({ shift: true })
    expect(getByRole('button', { name: 'Confirm' })).toHaveFocus()
  })

  it('never puts a positive tabIndex in the tab order', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    await user.click(getByRole('button', { name: 'Open sheet' }))

    const dialog = getByRole('dialog', { name: 'Add money' })
    expect(dialog.tabIndex).toBe(-1)
    expect(
      [...dialog.querySelectorAll<HTMLElement>('[tabindex]')].filter((el) => el.tabIndex > 0),
    ).toHaveLength(0)
  })

  it('restores focus to the trigger when the sheet closes', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    const trigger = getByRole('button', { name: 'Open sheet' })
    await user.click(trigger)
    expect(getByRole('button', { name: 'Close' })).toHaveFocus()

    await user.click(getByRole('button', { name: 'Close' }))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(trigger).toHaveFocus()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const { getByRole, user } = renderThemed(<SheetHarness />)

    const trigger = getByRole('button', { name: 'Open sheet' })
    await user.click(trigger)

    await user.keyboard('{Escape}')

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(trigger).toHaveFocus()
  })
})
