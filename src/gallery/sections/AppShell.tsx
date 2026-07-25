import type { ReactNode } from 'react'
import { useState } from 'react'
import type { Appearance } from '../../components'
import {
  AccountCard,
  ActivityItem,
  ArticleCard,
  Avatar,
  BadgeCard,
  Button,
  GoalCard,
  IconButton,
  Nav,
  Notification,
  NumberPad,
  PageHeader,
  ProfileCard,
  SavingsStreak,
  Search,
  SectionHeader,
  Sheet,
  Slider,
  TextLink,
  ThemeScope,
  TotalSavingsCard,
} from '../../components'
import { demoAssets } from '../../demo-assets'
import { Specimen, SpecimenGrid } from '../GallerySection'

type Screen = 'home' | 'goal' | 'add' | 'learn' | 'profile'

const screenTitles: Record<Screen, string> = {
  home: 'Home',
  goal: 'Freshman Trip',
  add: 'Add funds',
  learn: 'Learn',
  profile: 'Profile',
}

const navToScreen: Record<string, Screen> = {
  home: 'home',
  wallet: 'goal',
  learn: 'learn',
  profile: 'profile',
}

const streakDays = [
  { label: 'M', name: 'Monday', complete: true },
  { label: 'T', name: 'Tuesday', complete: true },
  { label: 'W', name: 'Wednesday', complete: true },
  { label: 'T', name: 'Thursday', complete: false, today: true },
  { label: 'F', name: 'Friday', complete: false },
  { label: 'S', name: 'Saturday', complete: false },
  { label: 'S', name: 'Sunday', complete: false },
]

/**
 * On the branded canvas a white content surface has to declare its own scheme,
 * otherwise it inherits the shell's light-on-dark foregrounds.
 */
function Island({ branded, children }: { branded: boolean; children: ReactNode }) {
  if (!branded) {
    return <div className="ds-phone-island">{children}</div>
  }

  return (
    <ThemeScope scheme="light" className="ds-phone-island">
      {children}
    </ThemeScope>
  )
}

function PhoneShell({ appearance }: { appearance: Appearance }) {
  const branded = appearance === 'brand'
  const [screen, setScreen] = useState<Screen>('home')
  const [navKey, setNavKey] = useState('home')
  const [amount, setAmount] = useState('25')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [goalClosed, setGoalClosed] = useState(false)

  const goTo = (next: Screen, key: string = next) => {
    setScreen(next)
    setNavKey(key)
  }

  return (
    <ThemeScope appearance={appearance} className="ds-phone">
      <PageHeader
        title={screenTitles[screen]}
        align={screen === 'home' ? 'left' : 'center'}
        showBack={screen !== 'home'}
        onBack={screen === 'home' ? undefined : () => goTo('home')}
        leading={
          screen === 'home' ? (
            <Avatar size="32" src={demoAssets.avatars.small} name="Jamie Kowalski" />
          ) : undefined
        }
        trailing={
          screen === 'home' ? (
            <IconButton icon="notification" variant="ghost" size="small" label="Notifications" />
          ) : undefined
        }
      />

      <div className="ds-phone-body">
        {screen === 'home' ? (
          <>
            <TotalSavingsCard
              amount={194.7}
              showLogo
              actions={[
                { label: 'Deposit', icon: 'receive', onClick: () => goTo('add') },
                { label: 'Transfer', icon: 'send', onClick: () => goTo('add') },
              ]}
            />
            <SectionHeader
              title="Goals"
              as="h3"
              trailing={<TextLink onClick={() => goTo('goal', 'wallet')}>View all</TextLink>}
            />
            <GoalCard
              name="Freshman Trip"
              target={500}
              saved={18.2}
              accent="green"
              image={demoAssets.goals.travel}
              onClick={() => goTo('goal', 'wallet')}
            />
            <GoalCard
              name="Headphones"
              target={280}
              saved={76.5}
              accent="magenta"
              image={demoAssets.goals.headphones}
              onClick={() => goTo('goal', 'wallet')}
            />
            <Island branded={branded}>
              <Notification variant="trend" showDismiss={false} />
            </Island>
          </>
        ) : null}

        {screen === 'goal' ? (
          <>
            <GoalCard
              name="Freshman Trip"
              target={500}
              saved={500}
              complete
              accent="green"
              image={demoAssets.goals.travel}
            />
            <Island branded={branded}>
              <SectionHeader title="Recent activity" as="h3" />
              <ActivityItem type="deposit" time="Today, 1:34pm" amount="$20.00" />
              <ActivityItem type="deposit" time="Today, 11:17am" amount="$45.00" />
              <ActivityItem type="withdrawal" time="Mon, 8:22am" amount="$13.75" />
            </Island>
            <Slider
              label={goalClosed ? 'Goal closed' : 'Slide to close this goal'}
              defaultValue={0}
              completeAt={950}
              snapOnComplete
              showValue={false}
              onComplete={() => setGoalClosed(true)}
            />
          </>
        ) : null}

        {screen === 'add' ? (
          <>
            <p className="ds-phone-amount">${amount === '' ? '0' : amount}</p>
            <NumberPad value={amount} onValueChange={setAmount} maxLength={6} />
            <Button
              label={`Add $${amount === '' ? '0' : amount}`}
              onClick={() => setConfirmOpen(true)}
            />
          </>
        ) : null}

        {screen === 'learn' ? (
          <Island branded={branded}>
            <Search placeholder="Search anything" />
            <ArticleCard
              size="small"
              title="How to choose your first credit card"
              readTime="5 min"
              accent="green"
              image={demoAssets.articles.creditCard}
            />
            <ArticleCard
              size="small"
              title="The importance of an emergency fund"
              readTime="5 min"
              accent="purple"
              image={demoAssets.articles.emergencyFund}
            />
          </Island>
        ) : null}

        {screen === 'profile' ? (
          <>
            <ProfileCard
              name="Jamie Kowalski"
              handle="@jamiek"
              avatarSrc={demoAssets.avatars.large}
              actions={[{ label: 'Edit', icon: 'edit' }, { label: 'Share', icon: 'send' }]}
            />
            <Island branded={branded}>
              <SavingsStreak days={streakDays} />
              <BadgeCard
                title="Finance Nerd"
                caption="8 of 10 Articles read"
                progress={80}
                icon="sparkle"
                accent="green"
              />
              <AccountCard
                name="Starter Account"
                subtitle="Checking ••••0999"
                amount={1020.22}
                meta="1 day ago"
              />
            </Island>
          </>
        ) : null}
      </div>

      <Nav
        activeItem={navKey}
        showLabels
        onItemSelect={(key) => goTo(navToScreen[key] ?? 'home', key)}
        onAddSelect={() => goTo('add', 'add')}
      />

      <Sheet
        open={confirmOpen}
        title="Confirm deposit"
        description={`$${amount === '' ? '0' : amount} moves from your linked account into savings.`}
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button
              label="Confirm"
              onClick={() => {
                setConfirmed(true)
                setConfirmOpen(false)
                goTo('home')
              }}
            />
            <Button label="Cancel" variant="secondary" onClick={() => setConfirmOpen(false)} />
          </>
        }
      />

      {confirmed ? <p className="ds-readout">Deposit confirmed</p> : null}
    </ThemeScope>
  )
}

export function AppShellBody() {
  return (
    <SpecimenGrid width="wide">
      <Specimen label="appearance = brand — the product app shell" center>
        <PhoneShell appearance="brand" />
      </Specimen>
      <Specimen label="appearance = surface — identical markup, plain surface" center>
        <PhoneShell appearance="surface" />
      </Specimen>
    </SpecimenGrid>
  )
}
