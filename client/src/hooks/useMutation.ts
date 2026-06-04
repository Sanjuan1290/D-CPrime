import { useState } from 'react'

export type MutationState = 'idle' | 'loading' | 'success' | 'error'

export function useMutation<T>(
  fn: (data: T) => Promise<void> | void,
  options?: { onSuccess?: () => void; onError?: () => void },
) {
  const [state, setState] = useState<MutationState>('idle')

  async function mutate(data: T) {
    setState('loading')
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 400))
      await fn(data)
      setState('success')
      options?.onSuccess?.()
      window.setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      options?.onError?.()
      window.setTimeout(() => setState('idle'), 3000)
    }
  }

  return { mutate, state, isLoading: state === 'loading' }
}
