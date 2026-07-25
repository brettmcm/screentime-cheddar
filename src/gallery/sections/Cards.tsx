import { useState } from 'react'
import type { GoalSummaryItem, SavingsStreakDay, SpendingSegment } from '../../components'
import {
  AccountCard,
  ArticleCard,
  BadgeCard,
  CompletedGoalCard,
  GoalCard,
  GoalSummaryCard,
  ProfileCard,
  SavingsStreak,
  SectionHeader,
  SpendingChartPanel,
  Tag,
  TextLink,
  TotalSavingsCard,
} from '../../components'
import { Icon } from '../../components/icon/Icon'
import { demoAssets } from '../../demo-assets'
import { Readout, Specimen, SpecimenGrid } from '../GallerySection'

const goalSummaryItems: GoalSummaryItem[] = [
  { id: 'headphones', label: 'Headphones', amount: 76.5 },
  { id: 'sneakers', label: 'Sneakers', amount: 100 },
  { id: 'ski-trip', label: 'Ski Trip', amount: 18.2 },
]

const spendingSegments: SpendingSegment[] = [
  { id: 'food', label: 'Food', amount: 128.4, accent: 'magenta' },
  { id: 'travel', label: 'Travel', amount: 86.15, accent: 'blue' },
  { id: 'clothes', label: 'Clothes', amount: 54.2, accent: 'green' },
  { id: 'other', label: 'Other', amount: 43.7, accent: 'purple' },
]

const streakDays: SavingsStreakDay[] = [
  { label: 'M', name: 'Monday', complete: true },
  { label: 'T', name: 'Tuesday', complete: true },
  { label: 'W', name: 'Wednesday', complete: true },
  { label: 'T', name: 'Thursday', complete: false, today: true },
  { label: 'F', name: 'Friday', complete: false },
  { label: 'S', name: 'Saturday', complete: false },
  { label: 'S', name: 'Sunday', complete: false },
]

export function CardsBody() {
  const [opened, setOpened] = useState('nothing yet')

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="TotalSavingsCard — actions + badge">
          <TotalSavingsCard
            amount={194.7}
            actions={[
              { label: 'Deposit', icon: 'receive', onClick: () => setOpened('Deposit action') },
              { label: 'Transfer', icon: 'send', onClick: () => setOpened('Transfer action') },
            ]}
            badge={
              <span className="total-savings-card-badge">
                <Icon name="sparkle" width={20} height={20} aria-hidden="true" />
              </span>
            }
          />
        </Specimen>
        <Specimen label="TotalSavingsCard — showLogo, custom label and formatter">
          <TotalSavingsCard
            label="Saved this year"
            amount={1042.75}
            showLogo
            formatAmount={(value) =>
              new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
            }
          />
        </Specimen>
        <Specimen label="TotalSavingsCard — string amount, no actions">
          <TotalSavingsCard amount="$0.00" />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="GoalCard — derived progress and remainder">
          <GoalCard
            name="Headphones"
            target={280}
            saved={76.5}
            accent="magenta"
            image={demoAssets.goals.headphones}
            imageAlt="Headphones"
          />
        </Specimen>
        <Specimen label="GoalCard — interactive (button)">
          <GoalCard
            name="Sneakers"
            target={120}
            saved={100}
            accent="purple"
            image={demoAssets.goals.sneakers}
            onClick={() => setOpened('Sneakers goal')}
          />
        </Specimen>
        <Specimen label="GoalCard — complete">
          <GoalCard
            name="Camera"
            target={500}
            saved={500}
            complete
            accent="blue"
            image={demoAssets.goals.camera}
          />
        </Specimen>
        <Specimen label="GoalCard — icon fallback, explicit progress, link">
          <GoalCard
            name="Freshman Trip"
            target="$500.00"
            saved="$18.20"
            remaining="$481.80"
            progress={6}
            icon="learn"
            accent="green"
            href="#section-cards"
          />
        </Specimen>
      </SpecimenGrid>

      <Specimen label="CompletedGoalCard — the completed-goals carousel" full>
        <div className="ds-carousel">
          <CompletedGoalCard
            name="Skateboard"
            amount={120}
            accent="magenta"
            image={demoAssets.goals.skateboard}
          />
          <CompletedGoalCard
            name="Camera"
            amount={260}
            accent="blue"
            image={demoAssets.goals.camera}
          />
          <CompletedGoalCard
            name="Art Book"
            amount={80}
            accent="purple"
            image={demoAssets.articles.learning}
          />
          <CompletedGoalCard
            name="Ski Trip"
            amount={480}
            accent="green"
            image={demoAssets.goals.skiTrip}
            onClick={() => setOpened('Ski Trip recap')}
          />
        </div>
      </Specimen>

      <SpecimenGrid width="wide">
        <Specimen label="ArticleCard — large with media and an action">
          <ArticleCard
            size="large"
            title="How to decide what to save for"
            description="With so much noise, figure out what is actually worth saving and what you can let go."
            image={demoAssets.articles.piggyBank}
            actionLabel="Read more"
            onAction={() => setOpened('Article: what to save for')}
          />
        </Specimen>
        <Specimen label="ArticleCard — small with media and favourite toggle">
          <ArticleCard
            size="small"
            title="Save more with the 50/30/20 rule"
            readTime="5 min"
            accent="blue"
            image={demoAssets.articles.budgeting}
            defaultFavorite
          />
        </Specimen>
        <Specimen label="ArticleCard — guide (small, no media)">
          <ArticleCard
            size="small"
            title="Savings 101"
            description="Learn how to get started with simple savings techniques."
            readTime="20 min"
            accent="green"
            href="#section-cards"
          />
        </Specimen>
        <Specimen label="ArticleCard — customer story (small, photo in the brand shape)">
          <ArticleCard
            size="small"
            media="photo"
            title="How to choose your first credit card"
            readTime="5 min"
            accent="green"
            image={demoAssets.articles.customerStory}
          />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="BadgeCard — progress, icon tile">
          <BadgeCard
            title="Finance Nerd"
            caption="8 of 10 Articles read"
            progress={80}
            icon="sparkle"
            accent="green"
          />
        </Specimen>
        <Specimen label="BadgeCard — image tile, interactive">
          <BadgeCard
            title="Stack Master"
            caption="$194.70 of $500.00 total savings"
            progress={39}
            image={demoAssets.brand.coinDisc}
            accent="purple"
            onClick={() => setOpened('Stack Master badge')}
          />
        </Specimen>
        <Specimen label="BadgeCard — no progress bar">
          <BadgeCard title="Double Down" caption="1 of 2 goals this month" icon="check" accent="blue" />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="AccountCard — logo fallback tile">
          <AccountCard
            name="Starter Account"
            subtitle="Checking ••••0999"
            amount={1020.22}
            meta="1 day ago"
          />
        </Specimen>
        <Specimen label="AccountCard — image tile, interactive">
          <AccountCard
            name="Family Transfer"
            subtitle="Savings ••••4417"
            amount={318.4}
            meta="Just now"
            accent="blue"
            image={demoAssets.misc.wallet}
            onClick={() => setOpened('Family Transfer account')}
          />
        </Specimen>
        <Specimen label="GoalSummaryCard — total derived from the items">
          <GoalSummaryCard title="Where your savings sit" items={goalSummaryItems} />
        </Specimen>
        <Specimen label="GoalSummaryCard — explicit total, pre-formatted amounts">
          <GoalSummaryCard
            items={[
              { label: 'Emergency fund', amount: '$1,200.00' },
              { label: 'Spring break', amount: '$340.00' },
            ]}
            totalLabel="Everything"
            total="$1,540.00"
          />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="ProfileCard — photo avatar and actions">
          <ProfileCard
            name="Jamie Kowalski"
            handle="@jamiek"
            avatarSrc={demoAssets.avatars.large}
            actions={[
              { label: 'Edit', icon: 'edit', onClick: () => setOpened('Edit profile') },
              { label: 'Share', icon: 'send', onClick: () => setOpened('Share profile') },
            ]}
          />
        </Specimen>
        <Specimen label="ProfileCard — initials fallback and children">
          <ProfileCard name="Ravi Patel" handle="@ravip" avatarSize="40">
            <Tag color="green" label="Streak: 12 weeks" dismissible={false} />
          </ProfileCard>
        </Specimen>
      </SpecimenGrid>

      <Readout>Last card interaction: {opened}</Readout>
    </>
  )
}

export function PanelsBody() {
  const [viewedAll, setViewedAll] = useState(0)

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="SpendingChartPanel — bar (default)">
          <SpendingChartPanel
            title="Your spending"
            segments={spendingSegments}
            badge={<Tag color="magenta" label="This month" dismissible={false} />}
          />
        </Specimen>
        <Specimen label="SpendingChartPanel — pie">
          <SpendingChartPanel type="pie" title="Savings split" segments={spendingSegments} />
        </Specimen>
        <Specimen label="SpendingChartPanel — segmented">
          {/* Whole dollars: cents are what push a narrow column past the width
            * its own share earns it. */}
          <SpendingChartPanel
            type="segmented"
            segments={[
              { id: 'travel', label: 'Travel', amount: 212, accent: 'green' },
              { id: 'entertainment', label: 'Entertainment', amount: 56, accent: 'blue' },
              { id: 'food', label: 'Food', amount: 29, accent: 'magenta' },
              { id: 'clothes', label: 'Clothes', amount: 16, accent: 'purple' },
            ]}
            formatAmount={(value) => `$${Math.round(value)}`}
          />
        </Specimen>
        <Specimen label="SpendingChartPanel — segmented, lopsided split">
          <SpendingChartPanel
            type="segmented"
            segments={[
              { label: 'Rent', amount: 1450 },
              { label: 'Transit', amount: 62 },
              { label: 'Coffee', amount: 9 },
            ]}
            formatAmount={(value) => `$${Math.round(value)}`}
          />
        </Specimen>
        <Specimen label="SpendingChartPanel — empty">
          <SpendingChartPanel
            title="Your spending"
            segments={[]}
            emptyLabel="Nothing spent this week"
          />
        </Specimen>
        <Specimen label="SpendingChartPanel — custom colours and explicit total">
          <SpendingChartPanel
            title="Round-ups"
            total="$62.00"
            segments={[
              { label: 'Coffee', amount: 32, color: 'var(--token-color-cheddar-orange)' },
              { label: 'Transit', amount: 30, color: 'var(--token-color-neutral-700)' },
            ]}
          />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="SavingsStreak — mid-week">
          <SavingsStreak days={streakDays} />
        </Specimen>
        <Specimen label="SavingsStreak — custom title, all complete">
          <SavingsStreak
            title="Perfect week"
            days={streakDays.map((day) => ({ ...day, complete: true, today: false }))}
          />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid width="wide">
        <Specimen label="SectionHeader — action as a button">
          <SectionHeader
            title="Goals"
            actionLabel="View all"
            onAction={() => setViewedAll((count) => count + 1)}
          />
        </Specimen>
        <Specimen label="SectionHeader — action as a link, h3">
          <SectionHeader title="Articles" as="h3" actionLabel="View all" actionHref="#section-panels" />
        </Specimen>
        <Specimen label="SectionHeader — trailing slot (TextLink)">
          <SectionHeader
            title="Accounts"
            trailing={<TextLink onClick={() => setViewedAll((count) => count + 1)}>Manage</TextLink>}
          />
        </Specimen>
        <Specimen label="SectionHeader — title only">
          <SectionHeader title="Recent activity" />
        </Specimen>
      </SpecimenGrid>

      <Readout>Section actions pressed {viewedAll} times</Readout>
    </>
  )
}
