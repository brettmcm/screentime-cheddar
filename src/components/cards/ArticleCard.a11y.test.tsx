import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { ArticleCard } from './ArticleCard'

describe('ArticleCard accessibility', () => {
  it('renders the large card with a heading and a hidden decorative image', async () => {
    const { container, getByRole } = renderThemed(
      <ArticleCard title="How to build a buffer" description="Three steps" image="/hero.png" />,
    )

    expect(getByRole('heading', { level: 3, name: 'How to build a buffer' })).toBeInTheDocument()
    expect(container.querySelector('.article-card-image')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes a described hero image when it carries alt text', async () => {
    const { container, getByRole } = renderThemed(
      <ArticleCard title="How to build a buffer" image="/hero.png" imageAlt="A jar of coins" />,
    )

    expect(getByRole('img', { name: 'A jar of coins' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('turns the heading into the card link when given an href', async () => {
    const { container, getByRole } = renderThemed(
      <ArticleCard title="How to build a buffer" href="/articles/buffer" />,
    )

    const link = getByRole('link', { name: 'How to build a buffer' })
    expect(getByRole('heading', { level: 3 })).toContainElement(link)
    await expect(container).toHaveNoAxeViolations()
  })

  it('turns the heading into a button when given onClick instead of an href', async () => {
    const { container, getByRole } = renderThemed(
      <ArticleCard title="How to build a buffer" onClick={() => {}} />,
    )

    expect(getByRole('button', { name: 'How to build a buffer' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the favourite toggle as a pressed-state button', async () => {
    const { container, getByRole, user } = renderThemed(
      <ArticleCard size="small" title="Credit basics" image="/hero.png" readTime="4 min" />,
    )

    const favorite = getByRole('button', { name: 'Save to favorites' })
    expect(favorite).toHaveAttribute('aria-pressed', 'false')

    await user.click(favorite)

    expect(getByRole('button', { name: 'Remove from favorites' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the flat guide layout without violations', async () => {
    const { container } = renderThemed(
      <ArticleCard
        size="small"
        title="50/30/20 explained"
        description="A budget that fits on a napkin"
        readTime="6 min"
      />,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the customer-story layout without violations', async () => {
    const { container } = renderThemed(
      <ArticleCard
        size="large"
        title="How Mia saved $2,000"
        eyebrow="Customer story"
        tag="Saving"
        accent="green"
      />,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches the link, the favourite toggle and the action button by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <ArticleCard
        size="small"
        title="Credit basics"
        href="/articles/credit"
        readTime="4 min"
        actionLabel="Read now"
        onAction={() => {}}
      />,
    )

    await user.tab()
    expect(getByRole('link', { name: 'Credit basics' })).toHaveFocus()

    await user.tab()
    expect(getByRole('button', { name: 'Save to favorites' })).toHaveFocus()

    await user.tab()
    expect(getByRole('button', { name: 'Read now' })).toHaveFocus()

    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
