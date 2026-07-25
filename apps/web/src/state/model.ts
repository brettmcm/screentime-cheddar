import type { Accent } from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'

/** The design system's per-item accent ramp, used for goals, articles and spending. */
export type { Accent }

export type MainTab = 'home' | 'savings' | 'learn' | 'profile'

/** Screens pushed over a tab. They leave the active tab untouched. */
export type StackScreen = 'landing' | 'add-goal' | 'goal-detail' | 'goal-reached' | 'theme-settings'

export type Screen = MainTab | StackScreen

export type Brand = 'magenta' | 'blue' | 'green' | 'purple'

/**
 * How a brand is presented. `dark` is the library's `appearance="brand"` shell —
 * a saturated brand canvas carrying light cards, which is what the App Flow
 * draws. `light` is the ordinary light scheme with the same brand accents.
 * They are separate token layers, so the app picks one or the other rather
 * than setting both on the same scope.
 */
export type Mode = 'light' | 'dark'

/**
 * The `ThemeScope` props for a mode. `appearance` and `scheme` overlap and
 * `appearance` wins wherever both sit on one element, so a mode sets one or the
 * other and never both.
 */
export const themeFor = (mode: Mode) =>
  mode === 'dark' ? ({ appearance: 'brand' } as const) : ({ scheme: 'light' } as const)

/** The illustrations a goal can be given, keyed by subject rather than by file. */
export const goalIllustrations = {
  headphones: { label: 'Headphones', src: demoAssets.goals.headphones },
  sneakers: { label: 'Sneakers', src: demoAssets.goals.sneakers },
  travel: { label: 'Trip', src: demoAssets.goals.travel },
  goggles: { label: 'Ski trip', src: demoAssets.goals.goggles },
  skateboard: { label: 'Skateboard', src: demoAssets.goals.skateboard },
  camera: { label: 'Camera', src: demoAssets.goals.camera },
} as const satisfies Record<string, { label: string; src: string }>

export type GoalIllustration = keyof typeof goalIllustrations

export const goalImage = (illustration: GoalIllustration) => goalIllustrations[illustration].src

export type Goal = {
  id: string
  name: string
  target: number
  saved: number
  illustration: GoalIllustration
  accent: Accent
}

export type Activity = {
  id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  time: string
  goalId?: string
}

export type ArticleCategory = 'guide' | 'tip' | 'story'

export type Article = {
  id: string
  title: string
  description: string
  readTime: string
  category: ArticleCategory
  body: string
  accent: Accent
  /** Guides render as the flat `Card / Guide` shape and carry no artwork. */
  image?: string
}

export type SpendingCategory = {
  label: string
  amount: number
  accent: Accent
}

export type Badge = {
  id: string
  title: string
  caption: string
  progress: number
  icon: 'learn' | 'piggybank' | 'chart'
  accent: Accent
}

export type Account = {
  id: string
  name: string
  subtitle: string
  amount: number
  meta: string
}

export type StreakDay = {
  label: string
  name: string
  complete: boolean
}

export const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

/** Splits `$100.00` into `$100` and `.00` so the cents can be set smaller. */
export function splitCurrency(value: number) {
  const formatted = formatCurrency(value)
  const separator = formatted.lastIndexOf('.')
  if (separator === -1) return { dollars: formatted, cents: '' }
  return { dollars: formatted.slice(0, separator), cents: formatted.slice(separator) }
}
