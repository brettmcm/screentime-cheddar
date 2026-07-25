import { Button, PageHeader, SectionHeader } from '@screentime/cheddar-ds'
import { useState } from 'react'
import { ActivityFeed, MoneySheet, Screen, type MoneySheetMode } from '../components'
import { useApp } from '../state/AppContext'
import { formatCurrency, goalImage, splitCurrency } from '../state/model'

export function GoalDetailScreen() {
  const { selectedGoalId, goalById, back } = useApp()
  const [moneyMode, setMoneyMode] = useState<MoneySheetMode>()
  const goal = goalById(selectedGoalId)

  if (!goal) {
    return (
      <Screen className="stacked-screen">
        <PageHeader title="Goal unavailable" onBack={back} />
      </Screen>
    )
  }

  const image = goalImage(goal.illustration)
  const { dollars, cents } = splitCurrency(goal.saved)

  return (
    <>
      <Screen className="stacked-screen">
        <PageHeader title={goal.name} onBack={back} />

        <div className="goal-price">
          <p className="goal-price-saved">
            <span>{dollars}</span>
            <span className="goal-price-cents">{cents}</span>
          </p>
          <p className="goal-price-target">/ {formatCurrency(goal.target)}</p>
        </div>

        <div className={`goal-hero accent-${goal.accent}`}>
          <img src={image} alt="" />
        </div>

        <div className="split-actions">
          <Button
            label="Deposit"
            icon="receive"
            showIcon
            variant="secondary"
            onClick={() => setMoneyMode('deposit')}
          />
          <Button
            label="Transfer"
            icon="send"
            showIcon
            variant="secondary"
            onClick={() => setMoneyMode('transfer')}
          />
        </div>

        <SectionHeader title="Recent activity" />
        <ActivityFeed goalId={goal.id} />
      </Screen>

      <MoneySheet
        mode={moneyMode}
        fixedGoalId={goal.id}
        onClose={() => setMoneyMode(undefined)}
      />
    </>
  )
}
