import { Nav } from '@screentime/cheddar-ds'
import { useApp } from '../state/AppContext'
import type { MainTab } from '../state/model'

/** The design system calls the savings tab "wallet"; the app routes it as `savings`. */
const tabByNavKey: Record<string, MainTab> = {
  home: 'home',
  wallet: 'savings',
  learn: 'learn',
  profile: 'profile',
}

const navKeyByTab: Record<MainTab, string> = {
  home: 'home',
  savings: 'wallet',
  learn: 'learn',
  profile: 'profile',
}

export function AppNav() {
  const { activeTab, goTab, push } = useApp()

  return (
    <Nav
      className="app-nav"
      activeItem={navKeyByTab[activeTab]}
      onItemSelect={(key) => {
        const tab = tabByNavKey[key]
        if (tab) goTab(tab)
      }}
      onAddSelect={() => push('add-goal')}
      addLabel="Add goal"
    />
  )
}
