import { Button, InputField, NumberPad, PageHeader } from '@screentime/cheddar-ds'
import { useState } from 'react'
import { Screen } from '../components'
import { useApp } from '../state/AppContext'
import { goalIllustrations, type Accent, type GoalIllustration } from '../state/model'

/** Each illustration carries the accent ramp the new goal's cards will use. */
const choices: { illustration: GoalIllustration; accent: Accent }[] = [
  { illustration: 'headphones', accent: 'magenta' },
  { illustration: 'sneakers', accent: 'purple' },
  { illustration: 'travel', accent: 'green' },
  { illustration: 'camera', accent: 'blue' },
]

const MAX_AMOUNT_LENGTH = 9

export function AddGoalScreen() {
  const { addGoal, back } = useApp()
  const [step, setStep] = useState<'details' | 'amount'>('details')
  const [name, setName] = useState('')
  const [illustration, setIllustration] = useState<GoalIllustration>('headphones')
  const [target, setTarget] = useState('')
  const [starting, setStarting] = useState('')
  const [activeField, setActiveField] = useState<'target' | 'starting'>('target')

  const accent = choices.find((choice) => choice.illustration === illustration)?.accent ?? 'magenta'

  const submit = () =>
    addGoal({
      name: name.trim(),
      target: Number(target),
      saved: Math.min(Number(starting || 0), Number(target)),
      illustration,
      accent,
    })

  return (
    <Screen className="stacked-screen">
      <PageHeader
        title="Add Goal"
        align="center"
        onBack={() => (step === 'details' ? back() : setStep('details'))}
      />

      {step === 'details' ? (
        <div className="form-step">
          <InputField
            label="Goal name"
            value={name}
            onValueChange={setName}
            description="e.g. New Shoes, Birthday Trip"
          />

          <fieldset className="illustration-picker">
            <legend>Choose an illustration</legend>
            <div>
              {choices.map((choice) => (
                <button
                  key={choice.illustration}
                  type="button"
                  className={illustration === choice.illustration ? 'selected' : ''}
                  aria-pressed={illustration === choice.illustration}
                  onClick={() => setIllustration(choice.illustration)}
                >
                  <img src={goalIllustrations[choice.illustration].src} alt="" />
                  <span className="sr-only">{goalIllustrations[choice.illustration].label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <Button
            label="Next: Set amount"
            disabled={!name.trim()}
            onClick={() => setStep('amount')}
          />
        </div>
      ) : (
        <div className="form-step amount-step">
          <button
            type="button"
            className={`amount-readout ${activeField === 'target' ? 'is-active' : ''}`}
            aria-pressed={activeField === 'target'}
            onClick={() => setActiveField('target')}
          >
            <span>Goal amount</span>
            <strong>${target || '0'}</strong>
          </button>

          <button
            type="button"
            className={`amount-readout ${activeField === 'starting' ? 'is-active' : ''}`}
            aria-pressed={activeField === 'starting'}
            onClick={() => setActiveField('starting')}
          >
            <span>Starting saved amount (optional)</span>
            <strong>${starting || '0'}</strong>
          </button>

          <NumberPad
            value={activeField === 'target' ? target : starting}
            onValueChange={activeField === 'target' ? setTarget : setStarting}
            maxLength={MAX_AMOUNT_LENGTH}
            label={activeField === 'target' ? 'Goal amount' : 'Starting saved amount'}
          />

          <Button label={`Add Goal: ${name}`} disabled={Number(target) <= 0} onClick={submit} />
        </div>
      )}
    </Screen>
  )
}
