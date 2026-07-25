import { describe, expect, it } from 'vitest'
import { ArticleCard } from '../components/cards/ArticleCard'
import { GoalCard } from '../components/cards/GoalCard'
import { SectionHeader } from '../components/cards/SectionHeader'
import { TotalSavingsCard } from '../components/cards/TotalSavingsCard'
import { Nav } from '../components/nav/Nav'
import { PageHeader } from '../components/page-header/PageHeader'
import { APPEARANCES, THEME_MATRIX, renderThemed } from '../test/render'

/**
 * One page-like composition, run across the whole theming surface.
 *
 * axe is the slow part of this suite, so the matrix is deliberately spent on a
 * single representative tree rather than on every component: theming only
 * repaints tokens, and the structural rules axe checks here (landmarks,
 * heading order, names, roles) are the same in every brand and scheme. What
 * genuinely varies per theme is colour, and that is covered numerically in
 * contrast.a11y.test.ts because jsdom cannot resolve `color-mix()`.
 */
function SavingsScreen() {
  return (
    <>
      <PageHeader title="Savings" onBack={() => {}} />
      <main>
        <TotalSavingsCard
          amount={1284.5}
          actions={[
            { label: 'Add money', icon: 'deposit', onClick: () => {} },
            { label: 'Withdraw', icon: 'withdraw', onClick: () => {} },
          ]}
        />
        <SectionHeader title="Your goals" actionLabel="View all" actionHref="/goals" />
        <GoalCard name="Headphones" target={200} saved={50} href="/goals/headphones" />
        <GoalCard name="Ski trip" target={500} saved={18.2} accent="green" href="/goals/ski" />
        <ArticleCard
          size="small"
          title="How to build a buffer"
          description="Three steps to a starter fund"
          readTime="4 min"
          href="/articles/buffer"
        />
      </main>
      <Nav activeItem="wallet" />
    </>
  )
}

describe('a composed screen across the theme matrix', () => {
  it('puts every part of the screen inside a landmark, in heading order', async () => {
    const { container, getByRole } = renderThemed(<SavingsScreen />)

    expect(getByRole('banner')).toBeInTheDocument()
    expect(getByRole('main')).toBeInTheDocument()
    expect(getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(
      [...container.querySelectorAll('h1, h2, h3')].map((heading) => heading.tagName),
    ).toEqual(['H1', 'H2', 'H3'])
    await expect(container).toHaveNoAxeViolations()
  })

  it.each(THEME_MATRIX)('has no axe violations in $id', async ({ brand, scheme }) => {
    const { container } = renderThemed(<SavingsScreen />, { brand, scheme })

    await expect(container).toHaveNoAxeViolations()
  })

  it.each(APPEARANCES)('has no axe violations in the %s appearance', async (appearance) => {
    const { container } = renderThemed(<SavingsScreen />, { appearance })

    await expect(container).toHaveNoAxeViolations()
  })

  it.each(APPEARANCES)(
    'has no axe violations in the %s appearance on a non-default brand',
    async (appearance) => {
      const { container } = renderThemed(<SavingsScreen />, { appearance, brand: 'green' })

      await expect(container).toHaveNoAxeViolations()
    },
  )
})
