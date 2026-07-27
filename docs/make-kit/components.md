# Components

Every component and its props type is exported from the package root:

```tsx
import { GoalCard, type GoalCardProps } from '@screentime/cheddar-ds'
```

Never re-implement one of these by hand, and never restyle their internals — see
`styles.md`.

## Actions

| Component | Key props | Use for |
| --- | --- | --- |
| `Button` | `label` (required), `variant` `primary`\|`secondary`, `size` `large`\|`medium`\|`small`, `icon`, `showIcon` | Any committing action. Label is a prop, not children. |
| `IconButton` | `icon`, `label` (accessible name), `variant` `primary`\|`neutral`\|`outline`\|`ghost`, `size` `medium`\|`small` | Icon-only affordance in chrome. Always pass `label`. |
| `TextLink` | `children`, `href`, `icon` (default `caret-right`), `iconPosition`, `size` | Inline navigation, and the "View all ›" pattern beside a `SectionHeader`. |

`Button` defaults to `variant="primary"` `size="large"`. Use `secondary` for the lesser of
two actions; never two primaries side by side. `TextLink` renders an `<a>` when given
`href` and a `<button>` otherwise — pass `onClick` for in-page state changes.

## Forms

All of `InputField`, `Textarea`, `Search`, `Checkbox`, `Radio`, `SwitchField` share one
shape: a required `label` (except `Search`, where it is the accessible name), optional
`description`, an `error` prop that takes `true` or the message string, controlled
`value`/`checked` plus `onValueChange`/`onCheckedChange`, uncontrolled `defaultValue`/
`defaultChecked`, and pass-through of native attributes (`name`, `required`, `autoComplete`,
`disabled`, `placeholder`). Error messages are wired to the control with `aria-describedby`
and set `aria-invalid` for you.

```tsx
<InputField label="Goal name" value={name} onValueChange={setName} error={nameError} />
<InputField label="Account" dropdown options={['Checking', 'Savings']} />
<Checkbox label="Round up my purchases" checked={roundUp} onCheckedChange={setRoundUp} />
```

- `InputField` renders a `<select>` when you pass `dropdown` with `options`.
- `SwitchField` is the settings-row toggle; use it, not a `Checkbox`, for on/off preferences.
- `Radio` needs a shared `name` across the group.
- `Slider` is a value slider *and* the slide-to-confirm control: `onComplete` fires once at
  `completeAt` (default `max`), with `snapOnComplete` to lock it. Do not watch `value` to
  detect completion.
- `NumberPad` is the amount keypad: `value`, `onValueChange`, `maxLength`, `allowDecimal`.
  Never build a keypad out of `Button`s.

## Navigation and chrome

| Component | Key props | Notes |
| --- | --- | --- |
| `Nav` | `activeItem`, `items`, `onItemSelect(key)`, `onAddSelect()`, `showLabels`, `addLabel` | Bottom tab bar. Defaults to five items (`home`, `wallet`, `add`, `learn`, `profile`). Every item is a real control — never overlay your own hit areas. It does not position itself: wrap it in a sticky, width-constrained container (see `styles.md`). |
| `PageHeader` | `title`, `align` `left`\|`center`, `as` `h1`\|`h2`\|`h3`, `onBack`, `showBack`, `leading`, `trailing` | Screen header. Pass `onBack` to make the back control live. |
| `SectionHeader` | `title`, `as`, `actionLabel` + `onAction`/`actionHref`, `trailing`, `id` | The heading above every list. Pair with `TextLink` in `trailing` for "View all". |
| `Sheet` | `open` (required), `onClose`, `title`, `description`, `children`, `footer`, `position` `bottom`\|`center`, `size` `auto`\|`full` | Bottom sheet and modal. Fully controlled — you own `open`. Put confirm/cancel `Button`s in `footer`. |

## Content

| Component | Key props | Use for |
| --- | --- | --- |
| `ActivityItem` | `type` `deposit`\|`withdrawal`, `time`, `amount`, `title`, `subtitle`, `icon`, `onClick`/`href` | One transaction row. `type` derives the label and arrow. |
| `Avatar` | `size` `40`\|`32`\|`24`, `src`, `name`, `initials`, `alt` | Falls back `src` → initials → bundled artwork. Pass `name` for the accessible name. |
| `Tag` | `label`, `color` `green`\|`blue`\|`magenta`\|`purple`, `dismissible`, `onDismiss` | Short status or category label. |
| `Toast` | `message` | Transient confirmation. |
| `Notification` | `variant` `default`\|`trend`\|`opportunity`, `title`, `body`, `linkLabel`, `onLinkClick`/`href`, `image`, `icon`, `showDismiss` | In-feed insight card. Each variant brings its own illustration; pass `image` to substitute artwork. |
| `EmptyState` | `variant` (`error` only), `title`, `description` | Empty and error states. |
| `Icon` | `name` (required), `tone` `mono`\|`brand`, `title` | Standalone glyph. |
| `Logo`, `Wordmark` | none | Cheddar brand marks. |

## Cards and panels

There is no `Card` component — it was removed. Pick the card that matches the shape. All
content arrives through props.

| Component | Required props | Renders |
| --- | --- | --- |
| `TotalSavingsCard` | `amount` | Home hero: label, balance in display type, action row (`actions`), optional `badge`/`showLogo`. |
| `GoalCard` | `name`, `target`, `saved` | Goal progress row with illustration tile, progress bar, saved/remaining. `progress` and `remaining` derive from `saved`/`target`. `complete` shows the reached state. |
| `CompletedGoalCard` | `name`, `amount` | Finished-goal carousel tile. |
| `GoalSummaryCard` | `items` | Per-goal breakdown with a total row; `total` sums the items when omitted. |
| `ArticleCard` | `title` | All four article shapes — see below. |
| `AccountCard` | `name`, `amount` | Linked account row with balance and freshness (`meta`). |
| `BadgeCard` | `title` | Achievement badge with `progress` and `caption`. |
| `ProfileCard` | `name` | Profile header: avatar, `handle`, `actions`. |
| `SavingsStreak` | `days` | Week of day circles. Each day needs `label` (letter) and `name` (spoken day). |
| `SpendingChartPanel` | `segments` | Spending breakdown as `type` `bar`\|`pie`\|`segmented`, plus legend. |
| `ActivityCard` | — | Surface behind a run of `ActivityItem` children. |

`ArticleCard` covers four Figma shapes through props:

- Large article: `size="large"` with an `image`
- Small article: `size="small"` with an `image`
- Customer story: `size="small"` with `image` and `media="photo"`
- Guide tile: `size="small"` with `showMedia={false}`, a `description`, and a `readTime`

`size="large"` always draws its media frame; `showMedia={false}` is ignored there.

## Money and accents

Money props take `string | number` (`Money`). Pass a **number** and the card formats it as
USD; pass a string only when the copy is pre-formatted or non-currency. Override formatting
per call with `formatAmount`.

```tsx
<GoalCard name="Headphones" target={280} saved={76.5} accent="magenta" />
```

`accent` is `magenta` | `blue` | `green` | `purple` and defaults to `magenta`. Accents are
deliberately independent of the active brand so items in a list stay distinguishable — cycle
them across a list rather than repeating one.

## Icons

`IconName` is a closed set. Never invent a name; if none fits, use the closest or omit the
icon.

`home`, `piggybank`, `learn`, `profile`, `settings`, `wallet`, `message`, `deposit`,
`withdraw`, `x`, `plus`, `caret-left`, `caret-right`, `caret-down`, `arrow-left`,
`arrow-up`, `arrow-down`, `arrow-right`, `notification`, `edit`, `send`, `transfer`,
`receive`, `guide`, `heart-outline`, `heart-fill`, `search`, `check`, `chart`, `sparkle`

## Imagery

Use the bundled demo artwork. **Never use Unsplash, placeholder services, or invented image
URLs.**

```tsx
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'

<GoalCard name="Freshman Trip" target={500} saved={18.2} image={demoAssets.goals.travel} />
```

- `goals`: `headphones`, `sneakers`, `skiTrip`, `goggles`, `skateboard`, `camera`, `travel`
- `articles`: `piggyBank`, `investing`, `creditCard`, `emergencyFund`, `expenses`,
  `budgeting`, `learning`, `customerStory`, `communityStory`
- `celebration`: `goalReached`, `party`, `cake`, `sparkle`, `sparkleCluster`
- `avatars`: `small`, `medium`, `large`
- `brand`: `hero`, `coin`, `coinDisc`
- `misc`: `wallet`, `pieChart`, `book`, `globe`, `question`

## Composing a screen

The Cheddar screen pattern is: `ThemeScope appearance="brand"` painting the canvas →
`PageHeader` → a scrolling body of cards separated by `SectionHeader`s → `Nav` pinned at the
bottom by a container of yours, with `Sheet` for confirmations.

```tsx
import {
  ActivityItem, Avatar, Button, GoalCard, IconButton, Nav, PageHeader,
  SectionHeader, Sheet, TextLink, ThemeScope, TotalSavingsCard,
} from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'

<ThemeScope appearance="brand" className="cds-app-canvas">
  <PageHeader
    title="Home"
    align="left"
    leading={<Avatar size="32" src={demoAssets.avatars.small} name="Jamie Kowalski" />}
    trailing={<IconButton icon="notification" variant="ghost" size="small" label="Notifications" />}
  />

  <TotalSavingsCard
    amount={194.7}
    showLogo
    actions={[
      { label: 'Deposit', icon: 'receive', onClick: openDeposit },
      { label: 'Transfer', icon: 'send', onClick: openTransfer },
    ]}
  />

  <SectionHeader
    title="Goals"
    as="h3"
    trailing={<TextLink onClick={viewAllGoals}>View all</TextLink>}
  />
  <GoalCard
    name="Freshman Trip"
    target={500}
    saved={18.2}
    accent="green"
    image={demoAssets.goals.travel}
    onClick={openGoal}
  />

  <div style={{ position: 'sticky', bottom: 0, maxWidth: 430, margin: '0 auto',
                padding: 'var(--cds-size-padding-s)',
                background: 'var(--cds-color-background-default)' }}>
    <Nav activeItem="home" showLabels onItemSelect={goTo} onAddSelect={openAddFunds} />
  </div>

  <Sheet
    open={confirmOpen}
    title="Confirm deposit"
    description="$25 moves from your linked account into savings."
    onClose={() => setConfirmOpen(false)}
    footer={
      <>
        <Button label="Confirm" onClick={confirm} />
        <Button label="Cancel" variant="secondary" onClick={() => setConfirmOpen(false)} />
      </>
    }
  />
</ThemeScope>
```

Grouping content onto your own light panel inside `appearance="brand"` requires the island
wrapper — see `styles.md`.

## Accessibility contracts

- `Button` needs `label`; `IconButton` needs `label` even though it is optional in types.
- `Avatar` needs `name` (or `alt`) so it has an accessible name.
- Each `SavingsStreak` day needs `name` — the visible letter is ambiguous.
- `Nav` items are all in the tab order already. Do not add a hit-area overlay; it will
  swallow their events.
- Interactive `GoalCard` and `BadgeCard` fold their progress into the control's accessible
  name (`"Headphones, $50.00 of $200.00, 25% saved"`). Pass `aria-label` to override.
- Use the `error` prop for validation rather than rendering your own message text; it wires
  up `aria-describedby` and `aria-invalid`.
- `Sheet` manages focus, Escape, and scrim dismissal. Do not add your own key handlers.
