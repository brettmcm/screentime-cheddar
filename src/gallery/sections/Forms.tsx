import { useState } from 'react'
import {
  Checkbox,
  InputField,
  NumberPad,
  Radio,
  Search,
  Slider,
  SwitchField,
  Textarea,
} from '../../components'
import { Readout, Specimen, SpecimenGrid } from '../GallerySection'

export function FormFieldsBody() {
  const [name, setName] = useState('Jamie Kowalski')
  const [account, setAccount] = useState('Savings')
  const [notes, setNotes] = useState('Bought groceries on the way home — split with roommate.')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('How to')

  return (
    <>
      <SpecimenGrid>
        <Specimen label="InputField — default">
          {/* The focus specimen the screenshot suite tabs to. */}
          <InputField
            id="focus-input"
            label="Full name"
            description="As it appears on your card"
            value={name}
            onValueChange={setName}
          />
        </Specimen>
        <Specimen label="InputField — placeholder">
          <InputField label="Nickname" value="" placeholder="Add a nickname" />
        </Specimen>
        <Specimen label="InputField — native attributes">
          <InputField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue="jamie@example.com"
            description="type, name, autoComplete, inputMode and required all pass through"
          />
        </Specimen>
        <Specimen label="InputField — dropdown">
          <InputField
            label="Move money into"
            dropdown
            options={['Checking', 'Savings', 'Travel fund']}
            value={account}
            onValueChange={setAccount}
          />
        </Specimen>
        <Specimen label="InputField — error (string)">
          <InputField
            label="Routing number"
            defaultValue="0000"
            error="Enter the nine digits printed on your cheque."
          />
        </Specimen>
        <Specimen label="InputField — invalid without a message">
          <InputField label="Sort code" defaultValue="99" invalid />
        </Specimen>
        <Specimen label="InputField — disabled">
          <InputField label="Account number" defaultValue="••••0999" disabled />
        </Specimen>
        <Specimen label="InputField — readOnly">
          <InputField label="Member since" defaultValue="March 2024" readOnly />
        </Specimen>
        <Specimen label="InputField — showLabel = false">
          <InputField label="Amount" showLabel={false} defaultValue="$25.00" />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid>
        <Specimen label="Textarea — default">
          <Textarea
            label="Notes"
            description="Add context for this transaction"
            value={notes}
            onValueChange={setNotes}
            rows={3}
          />
        </Specimen>
        <Specimen label="Textarea — error">
          <Textarea label="Notes" defaultValue="" error="Tell us what this was for." rows={3} />
        </Specimen>
        <Specimen label="Textarea — disabled">
          <Textarea label="Notes" defaultValue="Locked while the transfer settles." disabled rows={3} />
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid>
        <Specimen label="Search — placeholder">
          <Search value={query} onValueChange={setQuery} />
        </Specimen>
        <Specimen label="Search — active">
          <Search value={activeQuery} onValueChange={setActiveQuery} />
        </Specimen>
        <Specimen label="Search — description">
          <Search defaultValue="" description="Searches articles and goals" />
        </Specimen>
        <Specimen label="Search — error">
          <Search defaultValue="!!" error="Search needs at least three characters." />
        </Specimen>
        <Specimen label="Search — disabled">
          <Search defaultValue="Offline" disabled />
        </Specimen>
      </SpecimenGrid>
    </>
  )
}

export function SelectionControlsBody() {
  const [subscribe, setSubscribe] = useState(true)
  const [autoInvest, setAutoInvest] = useState(false)
  const [goal, setGoal] = useState('vacation')
  const [notifications, setNotifications] = useState(true)
  const [roundUps, setRoundUps] = useState(false)

  return (
    <>
      <SpecimenGrid>
        <Specimen label="Checkbox — checked">
          <Checkbox
            label="Subscribe"
            description="Send me weekly insights"
            checked={subscribe}
            onCheckedChange={setSubscribe}
          />
        </Specimen>
        <Specimen label="Checkbox — unchecked">
          <Checkbox
            label="Auto-invest"
            description="Move spare change to savings"
            checked={autoInvest}
            onCheckedChange={setAutoInvest}
          />
        </Specimen>
        <Specimen label="Checkbox — error">
          <Checkbox label="I accept the terms" error="You have to accept to continue." />
        </Specimen>
        <Specimen label="Checkbox — disabled">
          <div className="ds-stack">
            <Checkbox label="Unavailable" disabled />
            <Checkbox label="Locked on" defaultChecked disabled />
          </div>
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid>
        <Specimen label="Radio — group" full>
          <div className="ds-stack">
            {[
              { value: 'vacation', label: 'Vacation', description: 'Save toward your next trip' },
              { value: 'emergency', label: 'Emergency', description: 'Build a safety net' },
              { value: 'gear', label: 'New gear', description: 'Headphones, a board, a camera' },
            ].map((option) => (
              <Radio
                key={option.value}
                name="gallery-goal"
                label={option.label}
                description={option.description}
                checked={goal === option.value}
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    setGoal(option.value)
                  }
                }}
              />
            ))}
          </div>
        </Specimen>
        <Specimen label="Radio — error">
          <Radio name="gallery-consent" label="Use my data" error="Pick one to continue." />
        </Specimen>
        <Specimen label="Radio — disabled">
          <div className="ds-stack">
            <Radio name="gallery-disabled" label="Unavailable" disabled />
            <Radio name="gallery-disabled-on" label="Locked on" defaultChecked disabled />
          </div>
        </Specimen>
      </SpecimenGrid>

      <SpecimenGrid>
        <Specimen label="SwitchField — on">
          <SwitchField
            label="Notifications"
            description="Get a push when a deposit clears"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </Specimen>
        <Specimen label="SwitchField — off">
          <SwitchField
            label="Round-ups"
            description="Round purchases to the nearest dollar"
            checked={roundUps}
            onCheckedChange={setRoundUps}
          />
        </Specimen>
        <Specimen label="SwitchField — error">
          <SwitchField label="Share activity" error="Turn this on to invite friends." />
        </Specimen>
        <Specimen label="SwitchField — disabled / showLabel = false">
          <div className="ds-stack">
            <SwitchField label="Locked" description="Ask an adult to change this" disabled />
            <SwitchField label="Compact switch" showLabel={false} defaultChecked />
          </div>
        </Specimen>
      </SpecimenGrid>

      <Readout>
        Goal = {goal} · notifications {notifications ? 'on' : 'off'} · round-ups{' '}
        {roundUps ? 'on' : 'off'}
      </Readout>
    </>
  )
}

export function SliderBody() {
  const [value, setValue] = useState(420)
  const [completions, setCompletions] = useState(0)

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="default — controlled, reports every change">
          <Slider value={value} onValueChange={setValue} onComplete={() => setCompletions((n) => n + 1)} />
        </Specimen>
        <Specimen label="completeAt = 800 with snapOnComplete">
          <Slider
            label="Slide to confirm"
            defaultValue={0}
            completeAt={800}
            snapOnComplete
            showValue={false}
            onComplete={() => setCompletions((n) => n + 1)}
          />
        </Specimen>
        <Specimen label="formatValue — percent, step 5">
          <Slider
            label="Share of paycheck"
            min={0}
            max={100}
            step={5}
            defaultValue={35}
            formatValue={(percent) => `${percent}%`}
          />
        </Specimen>
        <Specimen label="disabled">
          <Slider label="Locked target" defaultValue={620} disabled />
        </Specimen>
      </SpecimenGrid>
      <Readout>
        Value ${value.toFixed(2)} · completed {completions} times
      </Readout>
    </>
  )
}

export function NumberPadBody() {
  const [amount, setAmount] = useState('42.50')
  const [lastKey, setLastKey] = useState('—')

  return (
    <>
      <SpecimenGrid width="wide">
        <Specimen label="drives a visible amount">
          <div className="ds-stack">
            <p className="ds-phone-amount">${amount === '' ? '0' : amount}</p>
            <NumberPad
              value={amount}
              onValueChange={setAmount}
              onKeyPress={setLastKey}
              maxLength={7}
            />
          </div>
        </Specimen>
        <Specimen label="allowDecimal = false, maxLength = 3">
          <NumberPad defaultValue="12" allowDecimal={false} maxLength={3} />
        </Specimen>
        <Specimen label="disabled">
          <NumberPad defaultValue="7.00" disabled />
        </Specimen>
      </SpecimenGrid>
      <Readout>Last key pressed: {lastKey}</Readout>
    </>
  )
}
