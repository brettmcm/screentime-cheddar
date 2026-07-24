import { useState } from 'react'
import { ActivityItem, Avatar, Button, EmptyState, Notification, Toast } from '../../components'
import { demoAssets } from '../../demo-assets'
import { Readout, Specimen, SpecimenGrid } from '../GallerySection'

export function ActivityBody() {
  const [selected, setSelected] = useState('none')

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="type = deposit (defaults)">
          <ActivityItem type="deposit" />
        </Specimen>
        <Specimen label="type = withdrawal">
          <ActivityItem type="withdrawal" time="Mon, 8:22am" amount="$13.75" />
        </Specimen>
        <Specimen label="title, subtitle and icon overrides">
          <ActivityItem
            type="deposit"
            title="Birthday money"
            subtitle="From Grandma · Today"
            icon="sparkle"
            amount="$50.00"
          />
        </Specimen>
        <Specimen label="interactive (button)">
          <ActivityItem
            type="deposit"
            title="Allowance"
            amount="$20.00"
            onClick={() => setSelected('Allowance')}
          />
        </Specimen>
        <Specimen label="interactive (link)">
          <ActivityItem
            type="withdrawal"
            title="Bus pass"
            amount="$8.00"
            href="#section-activity"
          />
        </Specimen>
        <Specimen label="list composition">
          <div className="ds-stack">
            <ActivityItem type="deposit" time="Today, 1:34pm" amount="$20.00" />
            <ActivityItem type="deposit" time="Today, 11:17am" amount="$45.00" />
            <ActivityItem type="withdrawal" time="Mon, 8:22am" amount="$13.75" />
          </div>
        </Specimen>
      </SpecimenGrid>
      <Readout>Last activity selected: {selected}</Readout>
    </>
  )
}

export function NotificationBody() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="variant = default">
          <Notification variant="default" />
        </Specimen>
        <Specimen label="variant = trend">
          <Notification variant="trend" />
        </Specimen>
        <Specimen label="variant = opportunity">
          <Notification variant="opportunity" />
        </Specimen>
        <Specimen label="custom copy, icon and link">
          <Notification
            title="Goal reached"
            body="Your Freshman Trip goal is fully funded — nice work."
            icon="check"
            linkLabel="See the goal"
            href="#section-notification"
          />
        </Specimen>
        <Specimen label="image illustration, no dismiss">
          <Notification
            title="New badge"
            body="You unlocked Stack Master this week."
            image={demoAssets.celebration.goalReached}
            showDismiss={false}
          />
        </Specimen>
        <Specimen label="dismissible (controlled)">
          {dismissed ? (
            <Button label="Restore notification" size="small" onClick={() => setDismissed(false)} />
          ) : (
            <Notification
              variant="opportunity"
              dismissLabel="Dismiss spending alert"
              onDismiss={() => setDismissed(true)}
            />
          )}
        </Specimen>
      </SpecimenGrid>
    </>
  )
}

export function StatusBody() {
  return (
    <SpecimenGrid>
      <Specimen label="Toast — default">
        <Toast />
      </Specimen>
      <Specimen label="Toast — custom message">
        <Toast message="Saved to your wallet" />
      </Specimen>
      <Specimen label="EmptyState — variant = error (defaults)">
        <EmptyState variant="error" />
      </Specimen>
      <Specimen label="EmptyState — custom copy">
        <EmptyState
          title="No goals yet"
          description="Add your first goal to start tracking progress."
        />
      </Specimen>
    </SpecimenGrid>
  )
}

export function AvatarBody() {
  return (
    <SpecimenGrid width="tight">
      {(['40', '32', '24'] as const).map((size) => (
        <Specimen key={size} label={`size = ${size} (bundled artwork)`} center>
          <Avatar size={size} />
        </Specimen>
      ))}
      <Specimen label="src + name" center>
        <Avatar size="40" src={demoAssets.avatars.large} name="Jamie Kowalski" />
      </Specimen>
      <Specimen label="initials derived from name" center>
        <Avatar size="40" name="Ravi Patel" />
      </Specimen>
      <Specimen label="explicit initials, numeric size" center>
        <Avatar size={32} initials="CD" name="Cheddar Demo" />
      </Specimen>
      <Specimen label="decorative (no name or alt)" center>
        <Avatar size="24" src={demoAssets.avatars.small} />
      </Specimen>
    </SpecimenGrid>
  )
}
