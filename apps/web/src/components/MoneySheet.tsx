import { Button, GoalCard, NumberPad, Radio, Sheet } from '@screentime/cheddar-ds'
import { useState } from 'react'
import { useApp } from '../state/AppContext'
import { formatCurrency, goalImage, type Goal } from '../state/model'

export type MoneySheetMode = 'deposit' | 'transfer'

const titles: Record<MoneySheetMode, string> = {
  deposit: 'Deposit',
  transfer: 'Transfer',
}

/** Amounts never exceed `$9,999,999`, which is nine typed characters. */
const MAX_AMOUNT_LENGTH = 9

/**
 * Moves money into or between goals. Transfer debits a source goal and credits a
 * destination; it is not a deposit with extra copy.
 */
type MoneySheetProps = {
  mode?: MoneySheetMode
  fixedGoalId?: string
  onClose: () => void
}

/**
 * Each opening starts from a blank form. `Sheet` unmounts when it closes, so
 * keying the form on what it is editing resets it without an effect.
 */
export function MoneySheet({ mode, fixedGoalId, onClose }: MoneySheetProps) {
  return (
    <MoneySheetForm
      key={`${mode ?? 'closed'}:${fixedGoalId ?? ''}`}
      mode={mode}
      fixedGoalId={fixedGoalId}
      onClose={onClose}
    />
  )
}

function MoneySheetForm({ mode, fixedGoalId, onClose }: MoneySheetProps) {
  const { goals, deposit, transfer, push } = useApp()
  // A goal screen fixes one end of the move: the source to send from for a
  // transfer, the destination to top up for a deposit. The other end is chosen.
  const [sourceId, setSourceId] = useState(mode === 'transfer' ? (fixedGoalId ?? '') : '')
  const [targetId, setTargetId] = useState(mode === 'deposit' ? (fixedGoalId ?? '') : '')
  const [amount, setAmount] = useState('')

  const source = goals.find((goal) => goal.id === sourceId)
  const target = goals.find((goal) => goal.id === targetId)
  const typedAmount = Number(amount || 0)

  const valid = isValid()

  function isValid() {
    if (!(typedAmount > 0)) return false
    if (mode === 'deposit') return target !== undefined
    if (mode === 'transfer') {
      return (
        source !== undefined &&
        target !== undefined &&
        source.id !== target.id &&
        typedAmount <= source.saved
      )
    }
    return false
  }

  const submit = () => {
    if (!mode || !valid) return
    let completedGoalId: string | undefined

    if (mode === 'deposit' && target) {
      completedGoalId = deposit(target.id, typedAmount)
    } else if (mode === 'transfer' && source && target) {
      completedGoalId = transfer(source.id, target.id, typedAmount)
    }

    onClose()
    if (completedGoalId) {
      const reachedId = completedGoalId
      window.setTimeout(() => push('goal-reached', reachedId), 200)
    }
  }

  const fixedGoal = fixedGoalId ? goals.find((goal) => goal.id === fixedGoalId) : undefined

  return (
    <Sheet
      open={mode !== undefined}
      onClose={onClose}
      title={mode ? titles[mode] : undefined}
      footer={
        <Button
          label={mode ? `Confirm ${mode}` : 'Confirm'}
          disabled={!valid}
          onClick={submit}
        />
      }
    >
      {fixedGoal && mode !== 'transfer' ? (
        <GoalCard
          name={fixedGoal.name}
          target={fixedGoal.target}
          saved={fixedGoal.saved}
          accent={fixedGoal.accent}
          image={goalImage(fixedGoal.illustration)}
        />
      ) : null}

      {mode === 'transfer' ? (
        <GoalPicker
          legend="From"
          name="transfer-source"
          goals={goals}
          selectedId={sourceId}
          onSelect={setSourceId}
        />
      ) : null}

      {(mode === 'deposit' && !fixedGoal) || mode === 'transfer' ? (
        <GoalPicker
          legend={mode === 'transfer' ? 'To' : 'Goal'}
          name={`${mode}-target`}
          goals={mode === 'transfer' ? goals.filter((goal) => goal.id !== sourceId) : goals}
          selectedId={targetId}
          onSelect={setTargetId}
        />
      ) : null}

      <p className="amount-readout">
        <strong>${amount || '0'}</strong>
        <span>Enter amount</span>
      </p>

      <NumberPad
        value={amount}
        onValueChange={setAmount}
        maxLength={MAX_AMOUNT_LENGTH}
        label="Amount"
      />
    </Sheet>
  )
}

function GoalPicker({
  legend,
  name,
  goals,
  selectedId,
  onSelect,
}: {
  legend: string
  name: string
  goals: Goal[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <fieldset className="goal-picker">
      <legend>{legend}</legend>
      {goals.map((goal) => (
        <Radio
          key={goal.id}
          name={name}
          label={goal.name}
          description={`${formatCurrency(goal.saved)} saved`}
          checked={selectedId === goal.id}
          onCheckedChange={(checked) => checked && onSelect(goal.id)}
        />
      ))}
    </fieldset>
  )
}
