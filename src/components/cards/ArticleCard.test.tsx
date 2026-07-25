import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { ArticleCard } from './ArticleCard'

function ControlledFavorite({ onFavoriteChange }: { onFavoriteChange: (value: boolean) => void }) {
  const [favorite, setFavorite] = useState(false)
  return (
    <ArticleCard
      size="small"
      title="Budgeting basics"
      favorite={favorite}
      onFavoriteChange={(next) => {
        setFavorite(next)
        onFavoriteChange(next)
      }}
    />
  )
}

describe('ArticleCard', () => {
  it('renders the title as a heading', () => {
    renderThemed(<ArticleCard title="Budgeting basics" />)

    expect(screen.getByRole('heading', { name: 'Budgeting basics' })).toBeInTheDocument()
  })

  it('renders the eyebrow, tag, description and read time', () => {
    renderThemed(
      <ArticleCard
        title="Budgeting basics"
        eyebrow="Customer story"
        tag="Guide"
        description="Where to start when you have never budgeted."
        readTime="4 min read"
      />,
    )

    expect(screen.getByText('Customer story')).toBeInTheDocument()
    expect(screen.getByText('Guide')).toBeInTheDocument()
    expect(screen.getByText('Where to start when you have never budgeted.')).toBeInTheDocument()
    expect(screen.getByText('4 min read')).toBeInTheDocument()
  })

  describe('media frame', () => {
    it('renders the image with its alt text', () => {
      renderThemed(
        <ArticleCard
          title="Budgeting basics"
          image="https://example.test/article.png"
          imageAlt="A notebook"
        />,
      )

      expect(screen.getByRole('img', { name: 'A notebook' })).toBeInTheDocument()
    })

    it('uses the flat layout when there is no image', () => {
      const { container } = renderThemed(<ArticleCard title="Budgeting basics" />)

      expect(container.querySelector('.article-card')).toHaveClass('article-card-flat')
      expect(container.querySelector('.article-card-frame')).toBeNull()
    })

    it('keeps the media frame when showMedia is forced on', () => {
      const { container } = renderThemed(<ArticleCard title="Budgeting basics" showMedia />)

      expect(container.querySelector('.article-card-frame')).toBeInTheDocument()
    })
  })

  describe('title link', () => {
    it('renders the title as plain text without href or onClick', () => {
      renderThemed(<ArticleCard title="Budgeting basics" />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders the title as a link when href is given', () => {
      renderThemed(<ArticleCard title="Budgeting basics" href="#learn/budgeting" />)

      expect(screen.getByRole('link', { name: 'Budgeting basics' })).toHaveAttribute(
        'href',
        '#learn/budgeting',
      )
    })

    it('renders the title as a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(<ArticleCard title="Budgeting basics" onClick={onClick} />)

      await user.click(screen.getByRole('button', { name: 'Budgeting basics' }))

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('action button', () => {
    it('renders no action without actionLabel', () => {
      renderThemed(<ArticleCard title="Budgeting basics" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('calls onAction when the action is clicked', async () => {
      const onAction = vi.fn()
      const { user } = renderThemed(
        <ArticleCard title="Budgeting basics" actionLabel="Read now" onAction={onAction} />,
      )

      await user.click(screen.getByRole('button', { name: 'Read now' }))

      expect(onAction).toHaveBeenCalledOnce()
    })
  })

  describe('favourite toggle', () => {
    it('shows the toggle on small cards by default', () => {
      renderThemed(<ArticleCard size="small" title="Budgeting basics" />)

      expect(screen.getByRole('button', { name: 'Save to favorites' })).toBeInTheDocument()
    })

    it('hides the toggle on large cards by default', () => {
      renderThemed(<ArticleCard size="large" title="Budgeting basics" />)

      expect(screen.queryByRole('button', { name: 'Save to favorites' })).not.toBeInTheDocument()
    })

    it('reports the pressed state', () => {
      renderThemed(<ArticleCard size="small" title="Budgeting basics" />)

      expect(screen.getByRole('button', { name: 'Save to favorites' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('toggles on and renames itself when uncontrolled', async () => {
      const onFavoriteChange = vi.fn()
      const { user } = renderThemed(
        <ArticleCard size="small" title="Budgeting basics" onFavoriteChange={onFavoriteChange} />,
      )

      await user.click(screen.getByRole('button', { name: 'Save to favorites' }))

      expect(onFavoriteChange).toHaveBeenCalledExactlyOnceWith(true)
      expect(screen.getByRole('button', { name: 'Remove from favorites' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    it('starts pressed when defaultFavorite is set', () => {
      renderThemed(<ArticleCard size="small" title="Budgeting basics" defaultFavorite />)

      expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument()
    })

    it('never moves a controlled toggle the owner does not change', async () => {
      const onFavoriteChange = vi.fn()
      const { user } = renderThemed(
        <ArticleCard
          size="small"
          title="Budgeting basics"
          favorite={false}
          onFavoriteChange={onFavoriteChange}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Save to favorites' }))

      expect(onFavoriteChange).toHaveBeenCalledExactlyOnceWith(true)
      expect(screen.getByRole('button', { name: 'Save to favorites' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('follows a controlled toggle the owner does change', async () => {
      const onFavoriteChange = vi.fn()
      const { user } = renderThemed(<ControlledFavorite onFavoriteChange={onFavoriteChange} />)

      await user.click(screen.getByRole('button', { name: 'Save to favorites' }))

      expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument()
    })

    it('can be forced on for a large card', () => {
      renderThemed(<ArticleCard size="large" title="Budgeting basics" showFavorite />)

      expect(screen.getByRole('button', { name: 'Save to favorites' })).toBeInTheDocument()
    })
  })

  it.each([
    ['large', 'article-card-large'],
    ['small', 'article-card-small'],
  ] as const)('applies the %s size class', (size, expected) => {
    const { container } = renderThemed(<ArticleCard size={size} title="Budgeting basics" />)

    expect(container.querySelector('.article-card')).toHaveClass(expected)
  })
})
