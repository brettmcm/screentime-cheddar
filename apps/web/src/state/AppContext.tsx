import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  initialActivities,
  initialCompletedGoals,
  initialGoals,
} from './data'
import type { Activity, Brand, Goal, MainTab, Mode, Screen, StackScreen } from './model'

export type Profile = { name: string; handle: string }

type AppContextValue = {
  screen: Screen
  activeTab: MainTab
  selectedGoalId?: string
  goals: Goal[]
  completedGoals: Goal[]
  activities: Activity[]
  profile: Profile
  brand: Brand
  mode: Mode
  toast?: string
  totalSavings: number
  goTab: (tab: MainTab) => void
  push: (screen: StackScreen, goalId?: string) => void
  back: () => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
  /** Returns the id of a goal that reached its target, if this deposit finished one. */
  deposit: (goalId: string, amount: number) => string | undefined
  /** Moves money between two goals. Never routes through `deposit`. */
  transfer: (fromGoalId: string, toGoalId: string, amount: number) => string | undefined
  updateProfile: (name: string, handle: string) => void
  shareProfile: () => void
  setBrand: (brand: Brand) => void
  setMode: (mode: Mode) => void
  goalById: (id?: string) => Goal | undefined
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const TOAST_DURATION = 2200

/** Money is held in dollars, so every arithmetic result is re-rounded to cents. */
const toCents = (value: number) => Math.round(value * 100) / 100

export function AppProvider({ children }: PropsWithChildren) {
  const [screen, setScreen] = useState<Screen>('landing')
  const [activeTab, setActiveTab] = useState<MainTab>('home')
  const [selectedGoalId, setSelectedGoalId] = useState<string>()
  const [goals, setGoals] = useState(initialGoals)
  const [completedGoals, setCompletedGoals] = useState(initialCompletedGoals)
  const [activities, setActivities] = useState(initialActivities)
  const [profile, setProfile] = useState<Profile>({ name: 'Jamie K.', handle: '@jamieh' })
  const [brand, setBrandState] = useState<Brand>('magenta')
  const [mode, setModeState] = useState<Mode>('dark')
  const [toast, setToast] = useState<string>()

  const toastTimer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(undefined), TOAST_DURATION)
  }, [])

  const totalSavings = useMemo(
    () => toCents(goals.reduce((sum, goal) => sum + goal.saved, 0)),
    [goals],
  )

  const goTab = useCallback((tab: MainTab) => {
    setActiveTab(tab)
    setScreen(tab)
    setSelectedGoalId(undefined)
  }, [])

  const push = useCallback((next: StackScreen, goalId?: string) => {
    setSelectedGoalId(goalId)
    setScreen(next)
  }, [])

  /** Stack screens never change the active tab, so returning is always to that tab. */
  const back = useCallback(() => {
    setSelectedGoalId(undefined)
    setActiveTab((tab) => {
      setScreen(tab)
      return tab
    })
  }, [])

  const addActivity = useCallback((type: Activity['type'], amount: number, goalId: string) => {
    setActivities((current) => [makeActivity(type, amount, goalId), ...current])
  }, [])

  const goalById = useCallback(
    (id?: string) =>
      goals.find((goal) => goal.id === id) ?? completedGoals.find((goal) => goal.id === id),
    [goals, completedGoals],
  )

  const addGoal = useCallback(
    (goal: Omit<Goal, 'id'>) => {
      const id = `goal-${Date.now()}`
      setGoals((current) => [...current, { ...goal, id }])
      if (goal.saved > 0) addActivity('deposit', goal.saved, id)
      showToast('Goal added')
      goTab('home')
    },
    [addActivity, goTab, showToast],
  )

  const deposit = useCallback(
    (goalId: string, amount: number) => {
      const goal = goals.find((item) => item.id === goalId)
      if (!goal || amount <= 0) return undefined
      const updated = { ...goal, saved: toCents(goal.saved + amount) }
      addActivity('deposit', amount, goalId)

      if (updated.saved >= updated.target) {
        setGoals((current) => current.filter((item) => item.id !== goalId))
        setCompletedGoals((current) => [updated, ...current])
        showToast('Goal reached!')
        return goalId
      }

      setGoals((current) => current.map((item) => (item.id === goalId ? updated : item)))
      showToast('Deposit added')
      return undefined
    },
    [goals, addActivity, showToast],
  )

  const transfer = useCallback(
    (fromGoalId: string, toGoalId: string, amount: number) => {
      const from = goals.find((item) => item.id === fromGoalId)
      const to = goals.find((item) => item.id === toGoalId)
      if (!from || !to || from.id === to.id || amount <= 0) return undefined
      const moved = Math.min(amount, from.saved)
      if (moved <= 0) return undefined

      const debited = { ...from, saved: toCents(from.saved - moved) }
      const credited = { ...to, saved: toCents(to.saved + moved) }
      setActivities((current) => [
        makeActivity('deposit', moved, to.id),
        makeActivity('withdrawal', moved, from.id),
        ...current,
      ])

      if (credited.saved >= credited.target) {
        setGoals((current) =>
          current.filter((item) => item.id !== to.id).map((item) => (item.id === from.id ? debited : item)),
        )
        setCompletedGoals((current) => [credited, ...current])
        showToast('Goal reached!')
        return to.id
      }

      setGoals((current) =>
        current.map((item) => {
          if (item.id === from.id) return debited
          if (item.id === to.id) return credited
          return item
        }),
      )
      showToast(`Transferred to ${to.name}`)
      return undefined
    },
    [goals, showToast],
  )

  const updateProfile = useCallback(
    (name: string, handle: string) => {
      setProfile((current) => ({
        name: name.trim() || current.name,
        handle: handle.trim() || current.handle,
      }))
      showToast('Profile updated')
    },
    [showToast],
  )

  const shareProfile = useCallback(() => {
    const payload = { title: 'Cheddar', text: "I'm saving with Cheddar!" }
    if (navigator.share) {
      // A dismissed share sheet rejects; that is a cancellation, not a failure.
      void navigator.share(payload).catch(() => undefined)
      return
    }
    void navigator.clipboard
      ?.writeText(payload.text)
      .then(() => showToast('Copied to clipboard'))
      .catch(() => showToast('Sharing is unavailable'))
  }, [showToast])

  const setBrand = useCallback(
    (nextBrand: Brand) => {
      setBrandState(nextBrand)
      showToast(`${brandLabel(nextBrand)} theme selected`)
    },
    [showToast],
  )

  const setMode = useCallback(
    (nextMode: Mode) => {
      setModeState(nextMode)
      showToast(nextMode === 'dark' ? 'Dark mode on' : 'Light mode on')
    },
    [showToast],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      screen,
      activeTab,
      selectedGoalId,
      goals,
      completedGoals,
      activities,
      profile,
      brand,
      mode,
      toast,
      totalSavings,
      goTab,
      push,
      back,
      addGoal,
      deposit,
      transfer,
      updateProfile,
      shareProfile,
      setBrand,
      setMode,
      goalById,
      showToast,
    }),
    [
      screen,
      activeTab,
      selectedGoalId,
      goals,
      completedGoals,
      activities,
      profile,
      brand,
      mode,
      toast,
      totalSavings,
      goTab,
      push,
      back,
      addGoal,
      deposit,
      transfer,
      updateProfile,
      shareProfile,
      setBrand,
      setMode,
      goalById,
      showToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}

let activitySequence = 0

function makeActivity(type: Activity['type'], amount: number, goalId: string): Activity {
  activitySequence += 1
  return {
    id: `activity-${activitySequence}`,
    type,
    amount,
    time: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`,
    goalId,
  }
}

export const brandLabels: Record<Brand, string> = {
  magenta: 'Berry',
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
}

const brandLabel = (brand: Brand) => brandLabels[brand]
