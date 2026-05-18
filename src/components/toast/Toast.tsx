export type ToastProps = {
  message?: string
}

export function Toast({ message = 'Action completed successfully' }: ToastProps) {
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
