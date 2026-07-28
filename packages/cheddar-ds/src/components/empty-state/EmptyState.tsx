type EmptyStateVariant = 'error'

export type EmptyStateProps = {
  variant?: EmptyStateVariant
  title?: string
  description?: string
}

const defaults: Record<EmptyStateVariant, { title: string; description: string }> = {
  error: {
    title: 'Something went wrong',
    description: 'Refresh or try again',
  },
}

export function EmptyState({
  variant = 'error',
  title,
  description,
}: EmptyStateProps) {
  const fallback = defaults[variant]
  return (
    <div className={`empty-state empty-state-${variant}`} role="status">
      <p className="empty-state-title">{title ?? fallback.title}</p>
      <p className="empty-state-description">{description ?? fallback.description}</p>
    </div>
  )
}
