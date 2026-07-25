import type { PropsWithChildren } from 'react'
import { AppNav } from './AppNav'

/**
 * The 430x932 viewport: one scrolling column with the tab bar pinned under it.
 */
export function Screen({
  children,
  nav = false,
  className = '',
}: PropsWithChildren<{ nav?: boolean; className?: string }>) {
  return (
    <div className={`app-screen ${className}`.trim()}>
      <main className="screen-scroll">{children}</main>
      {nav ? <AppNav /> : null}
    </div>
  )
}
