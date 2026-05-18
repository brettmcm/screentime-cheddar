import { useEffect, useState } from 'react'
import {
  ActivityItem,
  Avatar,
  Button,
  Card,
  Checkbox,
  EmptyState,
  IconButton,
  InputField,
  Logo,
  Nav,
  Notification,
  PageHeader,
  Radio,
  Search,
  Slider,
  SwitchField,
  Tag,
  Textarea,
  Toast,
  Wordmark,
} from './components'
import { Icon } from './components/icon/Icon'
import { runA11yTokenChecks } from './a11y/contrast'

if (import.meta.env.DEV) {
  runA11yTokenChecks()
}

const typeScale = [
  { name: 'display-xlarge', token: 'var(--cds-type-display-xlarge)', sample: '$672.80' },
  { name: 'display-large', token: 'var(--cds-type-display-large)', sample: '$1,042.75' },
  { name: 'display-medium', token: 'var(--cds-type-display-medium)', sample: '$850.00' },
  { name: 'display-small', token: 'var(--cds-type-display-small)', sample: '$850.00' },
  { name: 'display-xsmall', token: 'var(--cds-type-display-xsmall)', sample: '$850.00' },
  { name: 'heading', token: 'var(--cds-type-heading)', sample: 'Your Spending' },
  { name: 'body-large', token: 'var(--cds-type-body-large)', sample: 'Deposit made' },
  {
    name: 'body-large-strong',
    token: 'var(--cds-type-body-large-strong)',
    sample: 'Deposit made',
  },
  { name: 'body-medium', token: 'var(--cds-type-body-medium)', sample: 'Today, 11:17AM' },
  {
    name: 'body-medium-strong',
    token: 'var(--cds-type-body-medium-strong)',
    sample: 'Today, 11:17AM',
  },
]

const colorFamilies = [
  { name: 'Black', prefix: 'black', steps: ['100', '200', '300', '400', '500', '600'] },
  { name: 'White', prefix: 'white', steps: ['100', '200', '300', '400', '500'] },
  { name: 'Green', prefix: 'green', steps: ['100', '200', '300', '400', '500', '600'] },
  { name: 'Purple', prefix: 'purple', steps: ['100', '200', '300', '400', '500', '600'] },
  { name: 'Magenta', prefix: 'brand', steps: ['100', '200', '300', '400', '500', '600'] },
  { name: 'Blue', prefix: 'blue', steps: ['100', '200', '300', '400', '500', '600'] },
]

const cardVariants = [
  'account',
  'activity',
  'activity-feed',
  'article-large',
  'badge-double-down',
  'badge-finance-nerd',
  'badge-stack-master',
  'customer-article-credit-card',
  'customer-article-friends',
  'goal-finished',
  'goal-finished-variant-2',
  'goal-finished-variant-3',
  'goal-headphones',
  'goal-reached',
  'goal-ski-trip',
  'goal-sneakers',
  'goal-summary',
  'guide',
  'profile',
  'total-savings',
] as const

const smallArticleCardVariants = [
  'article-small-credit',
  'article-small-expenses',
  'article-small-fifty-thirty',
  'article-small-emergency',
] as const

const iconShowcase = [
  { name: 'home', label: 'home' },
  { name: 'wallet', label: 'wallet' },
  { name: 'learn', label: 'learn' },
  { name: 'profile', label: 'profile' },
  { name: 'search', label: 'search' },
  { name: 'notification', label: 'notification' },
  { name: 'caret-left', label: 'caret-left' },
  { name: 'caret-right', label: 'caret-right' },
  { name: 'caret-down', label: 'caret-down' },
  { name: 'x', label: 'x' },
  { name: 'plus', label: 'plus' },
  { name: 'sparkle', label: 'sparkle' },
] as const

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [inputValue, setInputValue] = useState('Value')
  const [inputDropdownValue, setInputDropdownValue] = useState('Value')
  const [notesValue, setNotesValue] = useState(
    'Bought groceries on the way home - split with roommate.',
  )
  const [searchValue, setSearchValue] = useState('')
  const [activeSearchValue, setActiveSearchValue] = useState('How to')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [roundUpsEnabled, setRoundUpsEnabled] = useState(false)
  const [subscribeChecked, setSubscribeChecked] = useState(true)
  const [autoInvestChecked, setAutoInvestChecked] = useState(false)
  const [goalChoice, setGoalChoice] = useState<'vacation' | 'emergency'>('vacation')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <main className="app-shell ds-page">
      <header className="brand-hero ds-page-header">
        <Wordmark />
        <div className="brand-hero-actions">
          <Button
            label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            variant="secondary"
            size="small"
            aria-pressed={isDark}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          />
        </div>
      </header>

      <section className="ds-section">
        <h1>Design System Overview</h1>
        <p>
          Foundations are listed first from the Figma library (Type + Color), followed by
          component examples in alphabetical order with variant labels.
        </p>
      </section>

      <section className="ds-section">
        <h2>Foundations</h2>
        <div className="ds-foundation-grid">
          <section className="panel ds-subsection">
            <h3>Type</h3>
            <ul className="ds-type-list">
              {typeScale.map((item) => (
                <li key={item.name} className="ds-type-row">
                  <code>{item.name}</code>
                  <span className="ds-type-sample" style={{ font: item.token }}>
                    {item.sample}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel ds-subsection">
            <h3>Color</h3>
            <div className="ds-color-list">
              {colorFamilies.map((family) => (
                <div key={family.name} className="ds-color-family">
                  <p>{family.name}</p>
                  <div className="ds-color-swatches">
                    {family.steps.map((step) => (
                      <div key={`${family.prefix}-${step}`} className="ds-color-swatch">
                        <span
                          style={{
                            backgroundColor: `var(--token-color-${family.prefix}-${step})`,
                          }}
                        />
                        <code>{step}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="ds-section">
        <h2>ActivityItem</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Type = Deposit</p>
            <ActivityItem type="deposit" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Type = Withdrawal</p>
            <ActivityItem type="withdrawal" time="Mon, 8:22am" amount="$13.75" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Avatar</h2>
        <div className="ds-variant-grid ds-variant-grid-tight">
          {(['40', '32', '24'] as const).map((size) => (
            <article key={size} className="panel ds-variant-card ds-center">
              <p className="ds-variant-label">Size = {size}</p>
              <Avatar size={size} />
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <h2>Brand</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Logo</p>
            <Logo />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Wordmark</p>
            <Wordmark />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Button</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Primary / Large / Default</p>
            <Button label="Save" variant="primary" size="large" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Primary / Large / Disabled</p>
            <Button label="Save" variant="primary" size="large" disabled />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Secondary / Large / Default</p>
            <Button label="Share" variant="secondary" size="large" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Secondary / Large / Disabled</p>
            <Button label="Share" variant="secondary" size="large" disabled />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Primary / Medium / Default</p>
            <Button label="Add Funds" variant="primary" size="medium" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Secondary / Medium / Default</p>
            <Button label="Details" variant="secondary" size="medium" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Primary / Small / Default</p>
            <Button label="Done" variant="primary" size="small" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Secondary / Small / Default</p>
            <Button label="Skip" variant="secondary" size="small" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Card</h2>
        <div className="ds-variant-grid ds-card-grid">
          {cardVariants.map((variant) => (
            <article key={variant} className="panel ds-variant-card">
              <p className="ds-variant-label">Variant = {variant}</p>
              <Card variant={variant} />
            </article>
          ))}
          <article className="panel ds-variant-card ds-card-small-row">
            <p className="ds-variant-label">Article Small variants (single row)</p>
            <div className="ds-card-inline-row">
              {smallArticleCardVariants.map((variant) => (
                <Card key={variant} variant={variant} />
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Checkbox</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = True</p>
            <Checkbox
              label="Subscribe"
              description="Send me weekly insights"
              checked={subscribeChecked}
              onCheckedChange={setSubscribeChecked}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = False</p>
            <Checkbox
              label="Auto-invest"
              description="Move spare change to savings"
              checked={autoInvestChecked}
              onCheckedChange={setAutoInvestChecked}
            />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>EmptyState</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = error</p>
            <EmptyState variant="error" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Icon</h2>
        <div className="ds-variant-grid ds-variant-grid-tight">
          {iconShowcase.map((icon) => (
            <article key={icon.name} className="panel ds-variant-card ds-center">
              <p className="ds-variant-label">Icon = {icon.label}</p>
              <div className="ds-icon-row">
                <Icon name={icon.name} width={24} height={24} />
                <Icon name={icon.name} width={24} height={24} tone="brand" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <h2>IconButton</h2>
        <div className="ds-variant-grid ds-variant-grid-tight">
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Primary / Medium / Default</p>
            <IconButton variant="primary" size="medium" icon="x" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Primary / Medium / Disabled</p>
            <IconButton variant="primary" size="medium" icon="x" disabled />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Outline / Medium / Default</p>
            <IconButton variant="outline" size="medium" icon="x" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Neutral / Medium / Default</p>
            <IconButton variant="neutral" size="medium" icon="x" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Primary / Small / Default</p>
            <IconButton variant="primary" size="small" icon="plus" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Outline / Small / Default</p>
            <IconButton variant="outline" size="small" icon="plus" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Neutral / Small / Default</p>
            <IconButton variant="neutral" size="small" icon="plus" />
          </article>
          <article className="panel ds-variant-card ds-center">
            <p className="ds-variant-label">Ghost / Medium / Default</p>
            <IconButton variant="ghost" size="medium" icon="home" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>InputField</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">State = Default</p>
            <InputField
              label="Label"
              value={inputValue}
              description="Description"
              onValueChange={setInputValue}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">State = Placeholder</p>
            <InputField
              label="Label"
              value=""
              description="Description"
              onValueChange={setInputValue}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Dropdown = True</p>
            <InputField
              label="Label"
              value={inputDropdownValue}
              description="Description"
              dropdown
              onValueChange={setInputDropdownValue}
            />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Nav</h2>
        <div className="ds-variant-grid ds-variant-grid-wide">
          {(['home', 'wallet', 'learn', 'profile'] as const).map((activeItem) => (
            <article key={activeItem} className="panel ds-variant-card ds-center">
              <p className="ds-variant-label">Active item = {activeItem}</p>
              <Nav activeItem={activeItem} />
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <h2>Notification</h2>
        <div className="ds-variant-grid ds-variant-grid-wide">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = default</p>
            <Notification variant="default" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = trend</p>
            <Notification variant="trend" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = opportunity</p>
            <Notification variant="opportunity" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>PageHeader</h2>
        <div className="ds-variant-grid ds-variant-grid-wide">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = left</p>
            <PageHeader title="Header" variant="left" />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Variant = center</p>
            <PageHeader title="Header" variant="center" />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Radio</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = True</p>
            <Radio
              name="goal"
              label="Vacation"
              description="Save toward your next trip"
              checked={goalChoice === 'vacation'}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  setGoalChoice('vacation')
                }
              }}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = False</p>
            <Radio
              name="goal"
              label="Emergency"
              description="Build a safety net"
              checked={goalChoice === 'emergency'}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  setGoalChoice('emergency')
                }
              }}
            />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Search</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">State = Placeholder</p>
            <Search
              value={searchValue}
              placeholder="Search anything"
              onValueChange={setSearchValue}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">State = Active</p>
            <Search value={activeSearchValue} onValueChange={setActiveSearchValue} />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Slider</h2>
        <div className="ds-variant-grid ds-variant-grid-wide">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Default</p>
            <Slider />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Custom value</p>
            <Slider label="Emergency fund target" value={760} />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>SwitchField</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = True</p>
            <SwitchField
              label="Notifications"
              description="Get a push when a deposit clears"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Selected = False</p>
            <SwitchField
              label="Round-ups"
              description="Round purchases to the nearest dollar"
              checked={roundUpsEnabled}
              onCheckedChange={setRoundUpsEnabled}
            />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Tag</h2>
        <div className="ds-variant-grid ds-variant-grid-tight">
          {(
            [
              { color: 'green', label: 'Travel' },
              { color: 'blue', label: 'Entertainment' },
              { color: 'magenta', label: 'Food' },
              { color: 'purple', label: 'Clothes' },
            ] as const
          ).map(({ color, label }) => (
            <article key={color} className="panel ds-variant-card ds-center">
              <p className="ds-variant-label">Color = {color}</p>
              <Tag color={color} label={label} />
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <h2>Textarea</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">State = Default</p>
            <Textarea
              label="Notes"
              value={notesValue}
              description="Add context for this transaction"
              onValueChange={setNotesValue}
            />
          </article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Toast</h2>
        <div className="ds-variant-grid">
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Default</p>
            <Toast />
          </article>
          <article className="panel ds-variant-card">
            <p className="ds-variant-label">Custom message</p>
            <Toast message="Saved to your wallet" />
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
