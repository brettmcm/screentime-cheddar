import { useId } from 'react'

export function useFieldId(prefix: string, override?: string) {
  const reactId = useId()
  return override ?? `${prefix}-${reactId}`
}
