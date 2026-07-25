import {
  CompletedGoalCard,
  GoalCard,
  Notification,
  PageHeader,
  SectionHeader,
  SpendingChartPanel,
  Tag,
} from '@screentime/cheddar-ds'
import { Screen } from '../components'
import { useApp } from '../state/AppContext'
import { spendingCategories } from '../state/data'
import { goalImage } from '../state/model'

export function SavingsScreen() {
  const { goals, completedGoals, goTab, push } = useApp()

  return (
    <Screen nav>
      <PageHeader title="Savings" align="left" showBack={false} />

      <SpendingChartPanel
        type="pie"
        title="Total savings"
        badge={<Tag label="Mar 2–Mar 29" />}
        segments={spendingCategories}
      />

      <Notification
        variant="opportunity"
        title="Watch out!"
        body="You're spending 35% more than you usually are by this point each month."
        onLinkClick={() => goTab('learn')}
      />

      <SectionHeader title="Your goals" />
      <div className="card-stack">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            name={goal.name}
            target={goal.target}
            saved={goal.saved}
            accent={goal.accent}
            image={goalImage(goal.illustration)}
            onClick={() => push('goal-detail', goal.id)}
          />
        ))}
      </div>

      <SectionHeader title="Completed goals" id="completed-goals" />
      <div className="card-carousel" aria-labelledby="completed-goals">
        {completedGoals.map((goal) => (
          <CompletedGoalCard
            key={goal.id}
            name={goal.name}
            amount={goal.target}
            accent={goal.accent}
            image={goalImage(goal.illustration)}
            onClick={() => push('goal-reached', goal.id)}
          />
        ))}
      </div>
    </Screen>
  )
}
