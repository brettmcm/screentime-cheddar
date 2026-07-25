import {
  AccountCard,
  BadgeCard,
  Button,
  GoalSummaryCard,
  IconButton,
  InputField,
  ProfileCard,
  PageHeader,
  SavingsStreak,
  SectionHeader,
  Sheet,
} from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { useState } from 'react'
import { Screen } from '../components'
import { useApp } from '../state/AppContext'
import { accounts, staticBadges, stackMasterTarget, streakDays } from '../state/data'
import { formatCurrency } from '../state/model'

export function ProfileScreen() {
  const { profile, totalSavings, goals, push, showToast, updateProfile, shareProfile } = useApp()
  const [editing, setEditing] = useState(false)

  return (
    <>
      <Screen nav>
        <PageHeader
          title="Profile"
          align="left"
          showBack={false}
          trailing={
            <span className="header-actions">
              <IconButton
                icon="settings"
                variant="ghost"
                size="small"
                label="Theme settings"
                onClick={() => push('theme-settings')}
              />
              <IconButton
                icon="notification"
                variant="ghost"
                size="small"
                label="Notifications"
                onClick={() => showToast("You're all caught up")}
              />
            </span>
          }
        />

        <ProfileCard
          name={profile.name}
          handle={profile.handle}
          avatarSrc={demoAssets.avatars.large}
          actions={[
            { label: 'Edit', icon: 'edit', onClick: () => setEditing(true) },
            { label: 'Share', icon: 'send', onClick: shareProfile },
          ]}
        />

        <SavingsStreak title="Savings Streak" days={streakDays} />

        <SectionHeader title="Badges" />
        <div className="card-stack">
          {staticBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              title={badge.title}
              caption={badge.caption}
              progress={badge.progress}
              icon={badge.icon}
              accent={badge.accent}
            />
          ))}
          <BadgeCard
            title="Stack Master"
            caption={`${formatCurrency(totalSavings)} of ${formatCurrency(stackMasterTarget)} total savings`}
            progress={Math.min(100, (totalSavings / stackMasterTarget) * 100)}
            icon="chart"
            accent="magenta"
          />
        </div>

        <SectionHeader title="Accounts" />
        <div className="card-stack">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              name={account.name}
              subtitle={account.subtitle}
              amount={account.amount}
              meta={account.meta}
              icon="wallet"
            />
          ))}
        </div>

        <SectionHeader title="Goal summary" />
        <GoalSummaryCard
          items={goals.map((goal) => ({ id: goal.id, label: goal.name, amount: goal.saved }))}
          totalLabel="Total savings"
          total={totalSavings}
        />
      </Screen>

      <EditProfileSheet open={editing} onClose={() => setEditing(false)} onSave={updateProfile} />
    </>
  )
}

function EditProfileSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (name: string, handle: string) => void
}) {
  const { profile } = useApp()
  const [name, setName] = useState(profile.name)
  const [handle, setHandle] = useState(profile.handle)

  const save = () => {
    onSave(name, handle)
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Edit Profile"
      footer={<Button label="Save changes" onClick={save} />}
    >
      <InputField label="Display name" value={name} onValueChange={setName} autoComplete="name" />
      <InputField label="Handle" value={handle} onValueChange={setHandle} autoComplete="nickname" />
    </Sheet>
  )
}
