import {
  ArticleCard,
  Avatar,
  GoalCard,
  Notification,
  PageHeader,
  SectionHeader,
  SpendingChartPanel,
  TextLink,
  TotalSavingsCard,
} from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { useState } from 'react'
import { ActivityFeed, MoneySheet, Screen, type MoneySheetMode } from '../components'
import { useApp } from '../state/AppContext'
import { featuredArticle, spendingCategories } from '../state/data'
import { goalImage } from '../state/model'

export function HomeScreen() {
  const { profile, totalSavings, goals, goTab, push } = useApp()
  const [moneyMode, setMoneyMode] = useState<MoneySheetMode>()
  const [showTrend, setShowTrend] = useState(true)

  return (
    <>
      <Screen nav>
        <PageHeader
          title={`Hi, ${profile.name.split(' ')[0]}`}
          align="left"
          showBack={false}
          trailing={<Avatar size="32" src={demoAssets.avatars.medium} name={profile.name} />}
        />

        <TotalSavingsCard
          amount={totalSavings}
          showLogo
          actions={[
            { label: 'Deposit', icon: 'receive', onClick: () => setMoneyMode('deposit') },
            { label: 'Transfer', icon: 'send', onClick: () => setMoneyMode('transfer') },
          ]}
        />

        <SectionHeader
          title="Recent spending"
          trailing={<TextLink onClick={() => goTab('savings')}>View all</TextLink>}
        />
        <SpendingChartPanel type="segmented" segments={spendingCategories} />

        {showTrend ? (
          <Notification
            variant="trend"
            onDismiss={() => setShowTrend(false)}
            onLinkClick={() => goTab('learn')}
          />
        ) : null}

        <SectionHeader
          title="Goals"
          trailing={<TextLink onClick={() => goTab('savings')}>View all</TextLink>}
        />
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

        <ArticleCard
          size="large"
          title={featuredArticle.title}
          description={featuredArticle.description}
          image={featuredArticle.image}
          actionLabel={featuredArticle.actionLabel}
          onAction={() => goTab('learn')}
        />

        <SectionHeader
          title="Recent activity"
          trailing={<TextLink onClick={() => goTab('savings')}>View all</TextLink>}
        />
        <ActivityFeed limit={5} />
      </Screen>

      <MoneySheet mode={moneyMode} onClose={() => setMoneyMode(undefined)} />
    </>
  )
}
