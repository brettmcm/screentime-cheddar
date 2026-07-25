/* ------------------------------------------------------------------- core */
export { ActivityItem, type ActivityItemProps } from './activity-item/ActivityItem'
export { Avatar, type AvatarProps } from './avatar/Avatar'
export { Logo, Wordmark } from './brand/Brand'
export { Button, type ButtonProps } from './button/Button'
export { Checkbox, type CheckboxProps } from './checkbox/Checkbox'
export { EmptyState, type EmptyStateProps } from './empty-state/EmptyState'
export { IconButton, type IconButtonProps } from './icon-button/IconButton'
export { InputField, type InputFieldProps } from './input-field/InputField'
export { Nav, type NavItemConfig, type NavProps } from './nav/Nav'
export { Notification, type NotificationProps } from './notification/Notification'
export { NumberPad, type NumberPadProps } from './number-pad/NumberPad'
export { PageHeader, type PageHeaderProps } from './page-header/PageHeader'
export { Radio, type RadioProps } from './radio/Radio'
export { Search, type SearchProps } from './search/Search'
export { Sheet, type SheetProps } from './sheet/Sheet'
export { Slider, type SliderProps } from './slider/Slider'
export { SwitchField, type SwitchFieldProps } from './switch-field/SwitchField'
export { Tag, type TagProps } from './tag/Tag'
export { Textarea, type TextareaProps } from './textarea/Textarea'
export { TextLink, type TextLinkProps } from './text-link/TextLink'
export { Toast, type ToastProps } from './toast/Toast'

/* ---------------------------------------------------------------- theming */
export {
  ThemeScope,
  type Appearance,
  type BrandTheme,
  type ColorScheme,
  type ThemeScopeProps,
} from './theme/ThemeScope'

/* ------------------------------------------------------------------ cards
 * Prop-driven replacements for the old `Card variant="…"` registry. Each maps
 * to a published Figma component set — see docs/figma-parity-audit.md.
 * -------------------------------------------------------------------------- */
export { AccountCard, type AccountCardProps } from './cards/AccountCard'
export { ActivityCard, type ActivityCardProps } from './cards/ActivityCard'
export { ArticleCard, type ArticleCardProps } from './cards/ArticleCard'
export { BadgeCard, type BadgeCardProps } from './cards/BadgeCard'
export {
  CompletedGoalCard,
  type CompletedGoalCardProps,
} from './cards/CompletedGoalCard'
export { GoalCard, type GoalCardProps } from './cards/GoalCard'
export {
  GoalSummaryCard,
  type GoalSummaryCardProps,
  type GoalSummaryItem,
} from './cards/GoalSummaryCard'
export {
  ProfileCard,
  type ProfileCardAction,
  type ProfileCardProps,
} from './cards/ProfileCard'
export {
  SavingsStreak,
  type SavingsStreakDay,
  type SavingsStreakProps,
} from './cards/SavingsStreak'
export { SectionHeader, type SectionHeaderProps } from './cards/SectionHeader'
export {
  SpendingChartPanel,
  type SpendingChartPanelProps,
  type SpendingSegment,
} from './cards/SpendingChartPanel'
export {
  TotalSavingsCard,
  type TotalSavingsAction,
  type TotalSavingsCardProps,
} from './cards/TotalSavingsCard'

/** Shared card vocabulary — accent ramps and money formatting. */
export type { Accent } from './cards/accent'
export { formatAmount, type AmountFormatter, type Money } from './cards/formatAmount'

