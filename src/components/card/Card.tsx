/**
 * @deprecated `Card` is a demo artifact: a single component whose `variant`
 * prop selects one of 24 hardcoded product cards. It cannot carry real app
 * data. Use the prop-driven components in `../cards` instead:
 *
 * | Old variant                  | Replacement                        |
 * | ---------------------------- | ---------------------------------- |
 * | `article-large`, `guide`,    | `ArticleCard`                      |
 * | `customer-article-*`,        |                                    |
 * | `article-small-*`            |                                    |
 * | `total-savings`              | `TotalSavingsCard`                 |
 * | `goal-*` (progress)          | `GoalCard`                         |
 * | `goal-finished*`             | `CompletedGoalCard`                |
 * | `badge-*`                    | `BadgeCard`                        |
 * | `account`                    | `AccountCard`                      |
 * | `goal-summary`               | `GoalSummaryCard`                  |
 * | `profile`                    | `ProfileCard`                      |
 * | `activity`, `activity-feed`  | compose `ActivityItem` yourself    |
 *
 * This file is kept as the demo-data adapter: the literal copy below is the
 * only thing it still owns. Every variant delegates to its replacement,
 * except `activity` and `activity-feed`, whose layouts have no prop-driven
 * equivalent and stay local (also deprecated).
 */
import type { ReactNode } from 'react'
import { ActivityItem } from '../activity-item/ActivityItem'
import type { AccountCardProps } from '../cards/AccountCard'
import { AccountCard } from '../cards/AccountCard'
import type { ArticleCardProps } from '../cards/ArticleCard'
import { ArticleCard } from '../cards/ArticleCard'
import type { BadgeCardProps } from '../cards/BadgeCard'
import { BadgeCard } from '../cards/BadgeCard'
import type { CompletedGoalCardProps } from '../cards/CompletedGoalCard'
import { CompletedGoalCard } from '../cards/CompletedGoalCard'
import type { GoalCardProps } from '../cards/GoalCard'
import { GoalCard } from '../cards/GoalCard'
import type { GoalSummaryCardProps } from '../cards/GoalSummaryCard'
import { GoalSummaryCard } from '../cards/GoalSummaryCard'
import type { ProfileCardProps } from '../cards/ProfileCard'
import { ProfileCard } from '../cards/ProfileCard'
import type { TotalSavingsCardProps } from '../cards/TotalSavingsCard'
import { TotalSavingsCard } from '../cards/TotalSavingsCard'
import { Icon } from '../icon/Icon'

/** @deprecated Pick the component that matches the shape you need — see the file header. */
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
  /**
   * @deprecated Selects one of 24 hardcoded demo cards. Use the matching
   * component from `../cards` and pass your own data instead.
   */
  variant?: CardVariant
  /**
   * @deprecated Only used by `variant="activity-feed"`. Compose
   * `ActivityItem` directly, or pass `children`.
   */
  items?: ActivityEntry[]
  /**
   * @deprecated The image for the card. Every replacement component takes
   * `image` / `imageAlt` props.
   */
  illustration?: string
  /**
   * Rendered in place of `items` by `variant="activity-feed"` — the
   * `contents` slot of Figma's `Recent activity list`.
   */
  children?: ReactNode
}

/** @deprecated Use `ActivityItemProps` and compose the list yourself. */
export type ActivityEntry = {
  id: string
  type: 'deposit' | 'withdrawal'
  time: string
  amount: string
}

type GenericTone = 'brand' | 'green' | 'purple' | 'blue'

/** The `activity` variant has no prop-driven equivalent; it stays local. */
type GenericCardContent = {
  eyebrow: string
  title: string
  description: string
  amount?: string
  footnote?: string
  chip?: string
  tone: GenericTone
}

type CardContent =
  | { kind: 'article'; props: Omit<ArticleCardProps, 'image'> }
  | { kind: 'total-savings'; props: TotalSavingsCardProps }
  | { kind: 'profile'; props: ProfileCardProps }
  | { kind: 'goal'; props: Omit<GoalCardProps, 'image'> }
  | { kind: 'completed-goal'; props: Omit<CompletedGoalCardProps, 'image'> }
  | { kind: 'badge'; props: BadgeCardProps }
  | { kind: 'account'; props: AccountCardProps }
  | { kind: 'goal-summary'; props: GoalSummaryCardProps }
  | { kind: 'generic'; props: GenericCardContent }
  | { kind: 'activity-feed' }

const cardVariants: Record<CardVariant, CardContent> = {
  'article-large': {
    kind: 'article',
    props: {
      size: 'large',
      showMedia: true,
      title: 'How to decide what to save for',
      description:
        'With so much noise, figure out what is actually worth saving and what you can let go.',
      actionLabel: 'Read more',
    },
  },
  guide: {
    kind: 'article',
    props: {
      size: 'small',
      showMedia: false,
      title: 'Savings 101',
      description: 'Learn how to get started with simple savings techniques.',
      readTime: '20 min',
      showFavorite: true,
    },
  },
  activity: {
    kind: 'generic',
    props: {
      eyebrow: 'Activity',
      title: 'Weekly spending recap',
      description: 'Groceries and transport were below your average this week.',
      amount: '$312.45',
      footnote: 'Updated 2h ago',
      tone: 'purple',
    },
  },
  'total-savings': {
    kind: 'total-savings',
    props: {
      label: 'Total savings',
      amount: '$194.70',
      badge: (
        <span className="total-savings-card-badge">
          <Icon name="sparkle" width={20} height={20} aria-hidden="true" />
        </span>
      ),
      actions: [
        { label: 'Deposit', icon: 'receive' },
        { label: 'Transfer', icon: 'send' },
      ],
    },
  },
  'customer-article-credit-card': {
    kind: 'article',
    props: {
      size: 'large',
      showMedia: false,
      eyebrow: 'Customer Story',
      title: 'Paying down credit card debt',
      description: 'How Maya consolidated spending and rebuilt momentum.',
      tag: 'Credit Card',
      accent: 'magenta',
    },
  },
  'customer-article-friends': {
    kind: 'article',
    props: {
      size: 'large',
      showMedia: false,
      eyebrow: 'Customer Story',
      title: 'Splitting expenses with friends',
      description: 'A practical approach to shared costs without friction.',
      tag: 'Friends',
      accent: 'blue',
    },
  },
  'article-small-credit': {
    kind: 'article',
    props: {
      size: 'small',
      showMedia: true,
      title: 'How to choose your first credit card',
      readTime: '5 min',
      accent: 'green',
    },
  },
  'article-small-expenses': {
    kind: 'article',
    props: {
      size: 'small',
      showMedia: true,
      title: 'Cut expenses without cutting joy',
      readTime: '5 min',
      accent: 'magenta',
    },
  },
  'article-small-fifty-thirty': {
    kind: 'article',
    props: {
      size: 'small',
      showMedia: true,
      title: 'Save more with the 50/30/20 rule',
      readTime: '5 min',
      accent: 'blue',
    },
  },
  'article-small-emergency': {
    kind: 'article',
    props: {
      size: 'small',
      showMedia: true,
      title: 'The importance of an emergency fund',
      readTime: '5 min',
      accent: 'purple',
    },
  },
  profile: {
    kind: 'profile',
    props: {
      name: 'Jamie K.',
      handle: '@jamieh',
      actions: [{ label: 'Edit' }, { label: 'Share' }],
    },
  },
  'goal-finished': {
    kind: 'completed-goal',
    props: { name: 'Skateboard', amount: '$120.00', accent: 'magenta' },
  },
  'goal-finished-variant-2': {
    kind: 'completed-goal',
    props: { name: 'Camera', amount: '$260.00', accent: 'blue' },
  },
  'goal-finished-variant-3': {
    kind: 'completed-goal',
    props: { name: 'Art Book', amount: '$80.00', accent: 'purple' },
  },
  'badge-finance-nerd': {
    kind: 'badge',
    // The legacy `tone="brand"` badge was styled from the green ramp, so the
    // accent here keeps the rendered colour rather than the tone's name.
    props: {
      title: 'Finance Nerd',
      caption: '8 of 10 Articles read',
      progress: 30,
      icon: 'sparkle',
      accent: 'green',
    },
  },
  'badge-double-down': {
    kind: 'badge',
    props: {
      title: 'Double Down',
      caption: '5 of 8 Goals completed',
      progress: 62,
      icon: 'sparkle',
      accent: 'green',
    },
  },
  'badge-stack-master': {
    kind: 'badge',
    props: {
      title: 'Stack Master',
      caption: '11 of 12 Weeks complete',
      progress: 84,
      icon: 'sparkle',
      accent: 'purple',
    },
  },
  account: {
    kind: 'account',
    props: {
      name: 'Starter Account',
      subtitle: 'Checking ••••0999',
      amount: '$1,020.22',
      meta: '1 day ago',
    },
  },
  'goal-summary': {
    kind: 'goal-summary',
    props: {
      items: [
        { label: 'Headphones', amount: '$76.50' },
        { label: 'Sneakers', amount: '$100.00' },
        { label: 'Ski Trip', amount: '$18.20' },
      ],
      total: '$194.70',
    },
  },
  'activity-feed': {
    kind: 'activity-feed',
  },
  'goal-headphones': {
    kind: 'goal',
    props: {
      name: 'Headphones',
      target: '$280.00',
      saved: '$76.50',
      remaining: '$203.50',
      progress: 27,
      icon: 'profile',
      accent: 'magenta',
    },
  },
  'goal-sneakers': {
    kind: 'goal',
    props: {
      name: 'Sneakers',
      target: '$120.00',
      saved: '$100.00',
      remaining: '$20.00',
      progress: 84,
      icon: 'piggybank',
      accent: 'purple',
    },
  },
  'goal-ski-trip': {
    kind: 'goal',
    props: {
      name: 'Freshman Trip',
      target: '$500.00',
      saved: '$18.20',
      remaining: '$481.80',
      progress: 6,
      icon: 'learn',
      accent: 'green',
    },
  },
  'goal-reached': {
    kind: 'goal',
    props: {
      name: 'Camera',
      target: '$500.00',
      saved: '$500.00',
      progress: 100,
      complete: true,
      completeLabel: 'Goal reached!',
      icon: 'chart',
      accent: 'blue',
    },
  },
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

/**
 * @deprecated Renders one of 24 hardcoded demo cards. Use the prop-driven
 * component listed for your variant in the file header instead.
 */
export function Card({
  variant = 'article-large',
  items = defaultActivityItems,
  illustration,
  children,
}: CardProps) {
  const card = cardVariants[variant]

  switch (card.kind) {
    case 'article':
      return <ArticleCard {...card.props} image={illustration} />
    case 'total-savings':
      return <TotalSavingsCard {...card.props} />
    case 'profile':
      return <ProfileCard {...card.props} />
    case 'goal':
      return <GoalCard {...card.props} image={illustration} />
    case 'completed-goal':
      return <CompletedGoalCard {...card.props} image={illustration} />
    case 'badge':
      return <BadgeCard {...card.props} />
    case 'account':
      return <AccountCard {...card.props} />
    case 'goal-summary':
      return <GoalSummaryCard {...card.props} />
    case 'generic':
      return <GenericCard card={card.props} />
    case 'activity-feed':
      return <ActivityFeedCard items={items}>{children}</ActivityFeedCard>
  }
}

/**
 * @deprecated Figma's `Recent activity list` is a plain list of
 * `ActivityItem`s in a surface — compose it yourself.
 */
function ActivityFeedCard({ items, children }: { items: ActivityEntry[]; children?: ReactNode }) {
  return (
    <article className="activity-card">
      <div className="activity-card-content">
        {children ??
          items.map(({ id, ...rest }) => <ActivityItem key={id} {...rest} />)}
      </div>
    </article>
  )
}

/** @deprecated The `activity` variant's layout, kept for backward compatibility. */
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
