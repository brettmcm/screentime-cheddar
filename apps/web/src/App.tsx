import { ThemeScope } from '@screentime/cheddar-ds'
import { useEffect } from 'react'
import { AppToast } from './components'
import {
  AddGoalScreen,
  GoalDetailScreen,
  GoalReachedScreen,
  HomeScreen,
  LandingScreen,
  LearnScreen,
  ProfileScreen,
  SavingsScreen,
  ThemeSettingsScreen,
} from './screens'
import { AppProvider, useApp } from './state/AppContext'
import { themeFor, type Brand, type Mode, type Screen } from './state/model'
import './app.css'

const screens: Record<Screen, () => React.JSX.Element | null> = {
  landing: LandingScreen,
  home: HomeScreen,
  savings: SavingsScreen,
  learn: LearnScreen,
  profile: ProfileScreen,
  'add-goal': AddGoalScreen,
  'goal-detail': GoalDetailScreen,
  'goal-reached': GoalReachedScreen,
  'theme-settings': ThemeSettingsScreen,
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

function AppContent() {
  const { screen, brand, mode } = useApp()
  const CurrentScreen = screens[screen]
  useDocumentTheme(brand, mode)

  return (
    <div className="web-stage">
      <ThemeScope {...themeFor(mode)} brand={brand} className="app-frame">
        <CurrentScreen />
        <AppToast />
      </ThemeScope>
    </div>
  )
}

/**
 * `Sheet` renders through a portal into `document.body`, which sits outside the
 * frame's ThemeScope and would otherwise fall back to the default light magenta
 * theme. Token layers are attribute selectors, so mirroring them onto the
 * document element gives portalled overlays the same theme as the frame.
 */
function useDocumentTheme(brand: Brand, mode: Mode) {
  useEffect(() => {
    const root = document.documentElement
    const theme = themeFor(mode)
    const attributes: Record<string, string> = {
      'data-brand': brand,
      ...('appearance' in theme ? { 'data-appearance': theme.appearance } : {}),
      ...('scheme' in theme ? { 'data-theme': theme.scheme } : {}),
    }
    for (const [name, value] of Object.entries(attributes)) root.setAttribute(name, value)
    return () => {
      for (const name of Object.keys(attributes)) root.removeAttribute(name)
    }
  }, [brand, mode])
}
