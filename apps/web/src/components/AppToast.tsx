import { Toast } from '@screentime/cheddar-ds'
import { useApp } from '../state/AppContext'

export function AppToast() {
  const { toast } = useApp()
  if (!toast) return null

  // `Toast` is its own live region; the wrapper only positions it.
  return (
    <div className="app-toast">
      <Toast message={toast} />
    </div>
  )
}
