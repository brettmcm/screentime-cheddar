import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Sheet } from './Sheet'

/** The scrim owns the dismiss and key handling, so tests need a handle on it. */
function scrim() {
  const element = screen.getByRole('dialog').parentElement
  if (!element) {
    throw new Error('expected the dialog to be mounted inside a scrim')
  }
  return element
}

function SheetHarness({ onClose, ...props }: { onClose?: () => void; title?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <Sheet
        {...props}
        open={open}
        onClose={() => {
          setOpen(false)
          onClose?.()
        }}
      >
        <button type="button">Inside</button>
      </Sheet>
    </>
  )
}

function InitialFocusHarness() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Sheet open title="Add money" initialFocusRef={inputRef}>
      <button type="button">First</button>
      <input ref={inputRef} aria-label="Amount" />
    </Sheet>
  )
}

describe('Sheet', () => {
  describe('open state', () => {
    it('renders nothing while closed', () => {
      renderThemed(<Sheet open={false} title="Add money" />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders a modal dialog while open', () => {
      renderThemed(<Sheet open title="Add money" />)

      const dialog = screen.getByRole('dialog', { name: 'Add money' })
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('portals the dialog into the document body', () => {
      const { container } = renderThemed(<Sheet open title="Add money" />)

      expect(container.querySelector('[role="dialog"]')).toBeNull()
      expect(scrim().parentElement).toBe(document.body)
    })

    it('locks page scrolling while open', () => {
      const { unmount } = renderThemed(<Sheet open title="Add money" />)

      expect(document.body.style.overflow).toBe('hidden')

      unmount()
      expect(document.body.style.overflow).toBe('')
    })

    it('renders its children, description and footer', () => {
      renderThemed(
        <Sheet open title="Add money" description="Move money into a goal" footer={<span>Footer</span>}>
          <span>Body</span>
        </Sheet>,
      )

      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Move money into a goal')
    })
  })

  describe('labelling', () => {
    it('labels the dialog with its title', () => {
      renderThemed(<Sheet open title="Add money" />)

      expect(screen.getByRole('dialog', { name: 'Add money' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Add money' })).toBeInTheDocument()
    })

    it('falls back to a generic name when there is no title', () => {
      renderThemed(<Sheet open />)

      expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument()
    })

    it('uses an explicit aria-label when there is no title', () => {
      renderThemed(<Sheet open aria-label="Confirm transfer" />)

      expect(screen.getByRole('dialog', { name: 'Confirm transfer' })).toBeInTheDocument()
    })
  })

  describe('dismissing', () => {
    it('calls onClose from the close control', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(<Sheet open title="Add money" onClose={onClose} />)

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onClose).toHaveBeenCalledOnce()
    })

    it('renames the close control with closeLabel', () => {
      renderThemed(<Sheet open title="Add money" closeLabel="Not now" />)

      expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument()
    })

    it('removes the close control when showClose is false', () => {
      renderThemed(<Sheet open title="Add money" showClose={false} />)

      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    it('calls onClose on Escape', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(<Sheet open title="Add money" onClose={onClose} />)

      await user.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalledOnce()
    })

    it('ignores Escape when dismissOnEscape is false', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(
        <Sheet open title="Add money" dismissOnEscape={false} onClose={onClose} />,
      )

      await user.keyboard('{Escape}')

      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when the scrim itself is clicked', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(<Sheet open title="Add money" onClose={onClose} />)

      await user.click(scrim())

      expect(onClose).toHaveBeenCalledOnce()
    })

    it('ignores clicks that land inside the sheet', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(
        <Sheet open title="Add money" onClose={onClose}>
          <span>Body</span>
        </Sheet>,
      )

      await user.click(screen.getByText('Body'))

      expect(onClose).not.toHaveBeenCalled()
    })

    it('ignores a drag that starts in the sheet and ends on the scrim', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(
        <Sheet open title="Add money" onClose={onClose}>
          <span>Body</span>
        </Sheet>,
      )

      await user.pointer([
        { target: screen.getByText('Body'), keys: '[MouseLeft>]' },
        { target: scrim() },
        { keys: '[/MouseLeft]', target: scrim() },
      ])

      expect(onClose).not.toHaveBeenCalled()
    })

    it('ignores the scrim when dismissOnScrim is false', async () => {
      const onClose = vi.fn()
      const { user } = renderThemed(
        <Sheet open title="Add money" dismissOnScrim={false} onClose={onClose} />,
      )

      await user.click(scrim())

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('focus management', () => {
    it('moves focus to the first tabbable control on open', async () => {
      const { user } = renderThemed(<SheetHarness />)

      await user.click(screen.getByRole('button', { name: 'Open sheet' }))

      expect(await screen.findByRole('button', { name: 'Close' })).toHaveFocus()
    })

    it('honours initialFocusRef', () => {
      renderThemed(<InitialFocusHarness />)

      expect(screen.getByLabelText('Amount')).toHaveFocus()
    })

    it('focuses the sheet itself when it holds nothing tabbable', () => {
      renderThemed(<Sheet open showClose={false} aria-label="Empty" />)

      expect(screen.getByRole('dialog')).toHaveFocus()
    })

    it('restores focus to the opener on close', async () => {
      const { user } = renderThemed(<SheetHarness />)

      const opener = screen.getByRole('button', { name: 'Open sheet' })
      await user.click(opener)
      await user.click(await screen.findByRole('button', { name: 'Close' }))

      expect(opener).toHaveFocus()
    })

    it('wraps Tab from the last control back to the first', async () => {
      const { user } = renderThemed(
        <Sheet open title="Add money">
          <button type="button">Inside</button>
        </Sheet>,
      )

      const close = screen.getByRole('button', { name: 'Close' })
      const inside = screen.getByRole('button', { name: 'Inside' })

      inside.focus()
      await user.tab()

      expect(close).toHaveFocus()
    })

    it('wraps Shift+Tab from the first control back to the last', async () => {
      const { user } = renderThemed(
        <Sheet open title="Add money">
          <button type="button">Inside</button>
        </Sheet>,
      )

      screen.getByRole('button', { name: 'Close' }).focus()
      await user.tab({ shift: true })

      expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus()
    })

    it('keeps focus on the sheet when there is nothing tabbable to move to', async () => {
      const { user } = renderThemed(<Sheet open showClose={false} aria-label="Empty" />)

      await user.tab()

      expect(screen.getByRole('dialog')).toHaveFocus()
    })
  })

  describe('layout props', () => {
    it.each([
      ['bottom', 'sheet-bottom'],
      ['center', 'sheet-center'],
    ] as const)('applies the %s position', (position, expected) => {
      renderThemed(<Sheet open aria-label="Sheet" position={position} />)

      expect(screen.getByRole('dialog')).toHaveClass(expected)
    })

    it('applies the full size', () => {
      renderThemed(<Sheet open aria-label="Sheet" size="full" />)

      expect(screen.getByRole('dialog')).toHaveClass('sheet-full')
    })

    it('honours an id override', () => {
      renderThemed(<Sheet open aria-label="Sheet" id="transfer-sheet" />)

      expect(screen.getByRole('dialog')).toHaveAttribute('id', 'transfer-sheet')
    })
  })
})
