import { Slider } from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { useRef, useState } from 'react'
import { Screen } from '../components'
import { useApp } from '../state/AppContext'
import { formatCurrency } from '../state/model'

const UNLOCK_MAX = 100

export function GoalReachedScreen() {
  const { selectedGoalId, goalById, goTab } = useApp()
  const goal = goalById(selectedGoalId)
  const [unlockValue, setUnlockValue] = useState(0)
  /**
   * The slider re-arms `onComplete` whenever the value falls back under the
   * threshold, so the latch lives here: unlocking is a one-way transition. The
   * ref guards a second call in the same tick; the state disables the control so
   * there is nothing left to drag while the transition plays out.
   */
  const unlocked = useRef(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  if (!goal) return null

  return (
    <Screen className="celebration-screen">
      <h1>Goal Reached</h1>
      <div className="celebration-hero">
        <img src={demoAssets.celebration.goalReached} alt="" />
      </div>
      <p>
        You saved {formatCurrency(goal.target)} for {goal.name}
      </p>
      <Slider
        label="Slide to continue"
        min={0}
        max={UNLOCK_MAX}
        value={isUnlocked ? UNLOCK_MAX : unlockValue}
        disabled={isUnlocked}
        showValue={false}
        snapOnComplete
        onValueChange={setUnlockValue}
        onComplete={() => {
          if (unlocked.current) return
          unlocked.current = true
          setIsUnlocked(true)
          window.setTimeout(() => goTab('home'), 250)
        }}
      />
    </Screen>
  )
}
