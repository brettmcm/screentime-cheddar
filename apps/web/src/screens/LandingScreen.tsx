import { Button, Wordmark } from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { Screen } from '../components'
import { useApp } from '../state/AppContext'

export function LandingScreen() {
  const { goTab } = useApp()

  return (
    <Screen className="landing-screen">
      <div className="landing-brand">
        <Wordmark />
      </div>
      <h1>
        Save. Unlock.
        <br />
        Repeat
      </h1>
      <div className="landing-hero">
        <img src={demoAssets.brand.hero} alt="" />
      </div>
      <p>Let&rsquo;s get started on your personal savings journey.</p>
      <div className="landing-actions">
        <Button label="Sign in" variant="secondary" onClick={() => goTab('home')} />
        <Button label="Sign up" onClick={() => goTab('home')} />
      </div>
    </Screen>
  )
}
