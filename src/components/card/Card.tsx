import { useState } from 'react'
import { ActivityItem } from '../activity-item/ActivityItem'
import { Avatar } from '../avatar/Avatar'
import { Logo } from '../brand/Brand'
import chromeBook from '../../assets/chrome-illustrations/book.png'
import chromeCamera from '../../assets/chrome-illustrations/camera.png'
import chromeCoin2 from '../../assets/chrome-illustrations/coin-2.png'
import chromeParty from '../../assets/chrome-illustrations/party.png'
import chromePieChart from '../../assets/chrome-illustrations/pie-chart.png'
import chromePiggyBank from '../../assets/chrome-illustrations/piggy-bank.png'
import chromeSkateboard from '../../assets/chrome-illustrations/skateboard.png'
import chromeWallet from '../../assets/chrome-illustrations/wallet.png'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { Button } from '../button/Button'

export type CardVariant =
  | 'article-large'
  | 'guide'
  | 'activity'
  | 'activity-feed'
  | 'total-savings'
  | 'customer-article-credit-card'
  | 'customer-article-friends'
  | 'article-small-credit'
  | 'article-small-expenses'
  | 'article-small-fifty-thirty'
  | 'article-small-emergency'
  | 'profile'
  | 'goal-finished'
  | 'goal-finished-variant-2'
  | 'goal-finished-variant-3'
  | 'badge-finance-nerd'
  | 'badge-double-down'
  | 'badge-stack-master'
  | 'account'
  | 'goal-summary'
  | 'goal-headphones'
  | 'goal-sneakers'
  | 'goal-ski-trip'
  | 'goal-reached'

export type CardProps = {
  variant?: CardVariant
  items?: ActivityEntry[]
}

type GenericTone = 'brand' | 'green' | 'purple' | 'blue'

type GenericCardContent = {
  kind: 'generic'
  eyebrow: string
  title: string
  description: string
  amount?: string
  footnote?: string
  chip?: string
  tone: GenericTone
}

type ActivityType = 'deposit' | 'withdrawal'

export type ActivityEntry = {
  id: string
  type: ActivityType
  time: string
  amount: string
}

type GoalIllustration = 'headphones' | 'sneakers' | 'trip' | 'camera'

type GoalCardContent = {
  kind: 'goal-progress'
  title: string
  total: string
  saved: string
  left?: string
  progress: number
  tileTone: GenericTone
  accentTone: GenericTone
  illustration: GoalIllustration
}

type ActivityCardContent = {
  kind: 'activity-feed'
}

type FeatureKind = 'article-large' | 'guide' | 'total-savings' | 'profile' | 'article-small'
type ArticleSmallIllustration = 'coin-2' | 'party' | 'pie-chart' | 'wallet'

type FeatureCardContent = {
  kind: 'feature'
  type: FeatureKind
  title: string
  description?: string
  amount?: string
  readTime?: string
  illustration?: ArticleSmallIllustration
  tone?: GenericTone
}

type BadgeCardContent = {
  kind: 'badge'
  title: string
  progress: number
  progressLabel: string
  tone: 'brand' | 'green' | 'purple'
}

type GoalFinishedIllustration = 'skateboard' | 'camera' | 'book'

type GoalFinishedCardContent = {
  kind: 'goal-finished'
  title: string
  amount: string
  tone: 'brand' | 'blue' | 'purple'
  illustration: GoalFinishedIllustration
}

type AccountCardContent = {
  kind: 'account'
  title: string
  subtitle: string
  amount: string
  updatedAt: string
}

type GoalSummaryCardContent = {
  kind: 'goal-summary'
  rows: { label: string; amount: string }[]
  total: string
}

type CardContent =
  | GenericCardContent
  | GoalCardContent
  | ActivityCardContent
  | FeatureCardContent
  | BadgeCardContent
  | GoalFinishedCardContent
  | AccountCardContent
  | GoalSummaryCardContent

const cardVariants: Record<CardVariant, CardContent> = {
  'article-large': {
    kind: 'feature',
    type: 'article-large',
    title: 'How to decide what to save for',
    description: 'With so much noise, figure out what is actually worth saving and what you can let go.',
  },
  guide: {
    kind: 'feature',
    type: 'guide',
    title: 'Savings 101',
    description: 'Learn how to get started with simple savings techniques.',
  },
  activity: {
    kind: 'generic',
    eyebrow: 'Activity',
    title: 'Weekly spending recap',
    description: 'Groceries and transport were below your average this week.',
    amount: '$312.45',
    footnote: 'Updated 2h ago',
    tone: 'purple',
  },
  'total-savings': {
    kind: 'feature',
    type: 'total-savings',
    title: 'Total savings',
    amount: '$194.70',
  },
  'customer-article-credit-card': {
    kind: 'generic',
    eyebrow: 'Customer Story',
    title: 'Paying down credit card debt',
    description: 'How Maya consolidated spending and rebuilt momentum.',
    chip: 'Credit Card',
    tone: 'brand',
  },
  'customer-article-friends': {
    kind: 'generic',
    eyebrow: 'Customer Story',
    title: 'Splitting expenses with friends',
    description: 'A practical approach to shared costs without friction.',
    chip: 'Friends',
    tone: 'blue',
  },
  'article-small-credit': {
    kind: 'feature',
    type: 'article-small',
    title: 'How to choose your first credit card',
    readTime: '5 min',
    illustration: 'coin-2',
    tone: 'green',
  },
  'article-small-expenses': {
    kind: 'feature',
    type: 'article-small',
    title: 'Cut expenses without cutting joy',
    readTime: '5 min',
    illustration: 'party',
    tone: 'brand',
  },
  'article-small-fifty-thirty': {
    kind: 'feature',
    type: 'article-small',
    title: 'Save more with the 50/30/20 rule',
    readTime: '5 min',
    illustration: 'pie-chart',
    tone: 'blue',
  },
  'article-small-emergency': {
    kind: 'feature',
    type: 'article-small',
    title: 'The importance of an emergency fund',
    readTime: '5 min',
    illustration: 'wallet',
    tone: 'purple',
  },
  profile: {
    kind: 'feature',
    type: 'profile',
    title: 'Jamie K.',
    description: '@jamieh',
  },
  'goal-finished': {
    kind: 'goal-finished',
    title: 'Skateboard',
    amount: '$120.00',
    tone: 'brand',
    illustration: 'skateboard',
  },
  'goal-finished-variant-2': {
    kind: 'goal-finished',
    title: 'Camera',
    amount: '$260.00',
    tone: 'blue',
    illustration: 'camera',
  },
  'goal-finished-variant-3': {
    kind: 'goal-finished',
    title: 'Art Book',
    amount: '$80.00',
    tone: 'purple',
    illustration: 'book',
  },
  'badge-finance-nerd': {
    kind: 'badge',
    title: 'Finance Nerd',
    progress: 30,
    progressLabel: '8 of 10 Articles read',
    tone: 'brand',
  },
  'badge-double-down': {
    kind: 'badge',
    title: 'Double Down',
    progress: 62,
    progressLabel: '5 of 8 Goals completed',
    tone: 'green',
  },
  'badge-stack-master': {
    kind: 'badge',
    title: 'Stack Master',
    progress: 84,
    progressLabel: '11 of 12 Weeks complete',
    tone: 'purple',
  },
  account: {
    kind: 'account',
    title: 'Starter Account',
    subtitle: 'Checking ••••0999',
    amount: '$1,020.22',
    updatedAt: '1 day ago',
  },
  'goal-summary': {
    kind: 'goal-summary',
    rows: [
      { label: 'Headphones', amount: '$76.50' },
      { label: 'Sneakers', amount: '$100.00' },
      { label: 'Ski Trip', amount: '$18.20' },
    ],
    total: '$194.70',
  },
  'activity-feed': {
    kind: 'activity-feed',
  },
  'goal-headphones': {
    kind: 'goal-progress',
    title: 'Headphones',
    total: '$280.00',
    saved: '$76.50',
    left: '$203.50',
    progress: 27,
    tileTone: 'brand',
    accentTone: 'brand',
    illustration: 'headphones',
  },
  'goal-sneakers': {
    kind: 'goal-progress',
    title: 'Sneakers',
    total: '$120.00',
    saved: '$100.00',
    left: '$20.00',
    progress: 84,
    tileTone: 'purple',
    accentTone: 'purple',
    illustration: 'sneakers',
  },
  'goal-ski-trip': {
    kind: 'goal-progress',
    title: 'Freshman Trip',
    total: '$500.00',
    saved: '$18.20',
    left: '$481.80',
    progress: 6,
    tileTone: 'green',
    accentTone: 'green',
    illustration: 'trip',
  },
  'goal-reached': {
    kind: 'goal-progress',
    title: 'Camera',
    total: '$500.00',
    saved: 'Goal reached!',
    progress: 100,
    tileTone: 'blue',
    accentTone: 'blue',
    illustration: 'camera',
  },
}

const articleSmallIllustrations: Record<ArticleSmallIllustration, string> = {
  'coin-2': chromeCoin2,
  party: chromeParty,
  'pie-chart': chromePieChart,
  wallet: chromeWallet,
}

const goalFinishedIllustrations: Record<GoalFinishedIllustration, string> = {
  skateboard: chromeSkateboard,
  camera: chromeCamera,
  book: chromeBook,
}

const goalProgressIcons: Record<GoalIllustration, IconName> = {
  camera: 'chart',
  trip: 'learn',
  sneakers: 'piggybank',
  headphones: 'profile',
}

const defaultActivityItems: ActivityEntry[] = [
  { id: 'activity-1', type: 'deposit', time: 'Today, 1:34pm', amount: '$20.00' },
  { id: 'activity-2', type: 'deposit', time: 'Today, 11:17am', amount: '$45.00' },
  { id: 'activity-3', type: 'withdrawal', time: 'Mon, 8:22am', amount: '$13.75' },
  { id: 'activity-4', type: 'deposit', time: 'Sat, 11:00am', amount: '$16.00' },
  { id: 'activity-5', type: 'withdrawal', time: 'Thu, 1:15pm', amount: '$7.00' },
  { id: 'activity-6', type: 'deposit', time: 'Wed, 9:02am', amount: '$25.00' },
  { id: 'activity-7', type: 'deposit', time: 'Tue, 4:15pm', amount: '$32.00' },
]

export function Card({ variant = 'article-large', items = defaultActivityItems }: CardProps) {
  const card = cardVariants[variant]

  switch (card.kind) {
    case 'activity-feed':
      return <ActivityFeedCard items={items} />
    case 'goal-progress':
      return <GoalProgressCard card={card} />
    case 'feature':
      return <FeatureCard card={card} />
    case 'goal-finished':
      return <GoalFinishedCard card={card} />
    case 'badge':
      return <BadgeCard card={card} />
    case 'account':
      return <AccountCard card={card} />
    case 'goal-summary':
      return <GoalSummaryCard card={card} />
    case 'generic':
      return <GenericCard card={card} />
  }
}

function ActivityFeedCard({ items }: { items: ActivityEntry[] }) {
  return (
    <article className="activity-card">
      <div className="activity-card-content">
        {items.map(({ id, ...rest }) => (
          <ActivityItem key={id} {...rest} />
        ))}
      </div>
    </article>
  )
}

function GoalProgressCard({ card }: { card: GoalCardContent }) {
  return (
    <article className="goal-card">
      <div className={classNames('goal-illustration', `goal-illustration-${card.tileTone}`)}>
        <Icon
          aria-hidden="true"
          name={goalProgressIcons[card.illustration]}
          width={30}
          height={30}
        />
      </div>
      <div className="goal-content">
        <div className="goal-line">
          <strong>{card.title}</strong>
          <strong>{card.total}</strong>
        </div>
        <div className="goal-track" aria-hidden="true">
          <span className={`goal-track-fill-${card.accentTone}`} style={{ width: `${card.progress}%` }} />
        </div>
        <div className="goal-line goal-subtle">
          <span>{card.saved}</span>
          {card.left ? <span>{card.left}</span> : null}
        </div>
      </div>
    </article>
  )
}

function FeatureCard({ card }: { card: FeatureCardContent }) {
  return (
    <article className={classNames('card-feature', `card-feature-${card.type}`)}>
      {card.type === 'article-large' ? <FeatureArticleLarge card={card} /> : null}
      {card.type === 'guide' ? <FeatureGuide card={card} /> : null}
      {card.type === 'total-savings' ? <FeatureTotalSavings card={card} /> : null}
      {card.type === 'profile' ? <FeatureProfile card={card} /> : null}
      {card.type === 'article-small' ? <FeatureArticleSmall card={card} /> : null}
    </article>
  )
}

function FeatureArticleLarge({ card }: { card: FeatureCardContent }) {
  return (
    <>
      <div className="card-feature-hero">
        <img src={chromePiggyBank} alt="" className="card-feature-hero-image" aria-hidden="true" />
      </div>
      <h3 className="card-feature-title">{card.title}</h3>
      <p className="card-feature-description">{card.description}</p>
      <Button label="Read more" size="large" className="card-feature-action" />
    </>
  )
}

function FeatureGuide({ card }: { card: FeatureCardContent }) {
  return (
    <>
      <h3 className="card-feature-guide-title">{card.title}</h3>
      <p className="card-feature-guide-description">{card.description}</p>
      <div className="card-feature-guide-footer">
        <span>20 min</span>
        <Icon aria-hidden="true" name="heart-outline" width={16} height={16} />
      </div>
    </>
  )
}

function FeatureTotalSavings({ card }: { card: FeatureCardContent }) {
  return (
    <>
      <div className="card-feature-header">
        <p className="card-feature-kicker">{card.title}</p>
        <span className="card-feature-sparkle" aria-hidden="true">
          <Icon name="sparkle" width={20} height={20} />
        </span>
      </div>
      <p className="card-feature-amount">{card.amount}</p>
      <div className="card-feature-actions">
        <Button
          label="Deposit"
          icon="receive"
          variant="secondary"
          size="large"
          className="card-feature-action-secondary"
        />
        <Button
          label="Transfer"
          icon="send"
          variant="secondary"
          size="large"
          className="card-feature-action-secondary"
        />
      </div>
    </>
  )
}

function FeatureProfile({ card }: { card: FeatureCardContent }) {
  return (
    <>
      <div className="card-feature-profile-icon" aria-hidden="true">
        <Avatar size="40" />
      </div>
      <h3 className="card-feature-profile-title">{card.title}</h3>
      <p className="card-feature-profile-handle">{card.description}</p>
      <div className="card-feature-actions">
        <Button
          label="Edit"
          variant="secondary"
          size="large"
          className="card-feature-action-secondary"
        />
        <Button
          label="Share"
          variant="secondary"
          size="large"
          className="card-feature-action-secondary"
        />
      </div>
    </>
  )
}

function FeatureArticleSmall({ card }: { card: FeatureCardContent }) {
  const [isSaved, setIsSaved] = useState(false)
  const illustration = card.illustration ? articleSmallIllustrations[card.illustration] : undefined

  return (
    <>
      <div className={`card-feature-small-hero card-feature-small-hero-${card.tone}`}>
        {illustration ? (
          <img src={illustration} alt="" className="card-feature-small-image" aria-hidden="true" />
        ) : null}
      </div>
      <div className="card-feature-small-body">
        <h3 className="card-feature-small-title">{card.title}</h3>
        <div className="card-feature-small-footer">
          <span>{card.readTime}</span>
          <button
            type="button"
            className="card-feature-small-favorite"
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            onClick={() => {
              setIsSaved((previous) => !previous)
            }}
          >
            <Icon
              aria-hidden="true"
              name={isSaved ? 'heart-fill' : 'heart-outline'}
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>
    </>
  )
}

function GoalFinishedCard({ card }: { card: GoalFinishedCardContent }) {
  const illustration = goalFinishedIllustrations[card.illustration]
  return (
    <article className="card-goal-finished">
      <div className={`card-goal-finished-hero card-goal-finished-hero-${card.tone}`}>
        <img src={illustration} alt="" className="card-goal-finished-image" aria-hidden="true" />
      </div>
      <div className="card-goal-finished-body">
        <p className="card-goal-finished-title">{card.title}</p>
        <p className="card-goal-finished-amount">{card.amount}</p>
      </div>
    </article>
  )
}

function BadgeCard({ card }: { card: BadgeCardContent }) {
  return (
    <article className="card-badge">
      <div className={`card-badge-icon card-badge-icon-${card.tone}`}>
        <Icon aria-hidden="true" name="sparkle" width={24} height={24} />
      </div>
      <div className="card-badge-content">
        <p className="card-badge-title">{card.title}</p>
        <div className="card-badge-progress" aria-hidden="true">
          <span
            className={`card-badge-progress-fill card-badge-progress-fill-${card.tone}`}
            style={{ width: `${card.progress}%` }}
          />
        </div>
        <p className="card-badge-label">{card.progressLabel}</p>
      </div>
    </article>
  )
}

function AccountCard({ card }: { card: AccountCardContent }) {
  return (
    <article className="card-account">
      <span className="card-account-icon" aria-hidden="true">
        <Logo />
      </span>
      <div className="card-account-copy">
        <p className="card-account-title">{card.title}</p>
        <p className="card-account-subtitle">{card.subtitle}</p>
      </div>
      <div className="card-account-balance">
        <p className="card-account-amount">{card.amount}</p>
        <p className="card-account-updated">{card.updatedAt}</p>
      </div>
    </article>
  )
}

function GoalSummaryCard({ card }: { card: GoalSummaryCardContent }) {
  return (
    <article className="card-goal-summary">
      <ul className="card-goal-summary-list">
        {card.rows.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <strong>{row.amount}</strong>
          </li>
        ))}
      </ul>
      <div className="card-goal-summary-total">
        <strong>Total savings</strong>
        <strong>{card.total}</strong>
      </div>
    </article>
  )
}

function GenericCard({ card }: { card: GenericCardContent }) {
  return (
    <article className={`card card-${card.tone}`}>
      {card.chip ? <span className="card-chip">{card.chip}</span> : null}
      <p className="card-eyebrow">{card.eyebrow}</p>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-description">{card.description}</p>
      {card.amount ? <p className="card-amount">{card.amount}</p> : null}
      {card.footnote ? <p className="card-footnote">{card.footnote}</p> : null}
    </article>
  )
}
