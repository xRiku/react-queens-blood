import { useQuery } from '@tanstack/react-query'

const SERVER_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? window.location.origin : 'http://localhost:4000')

async function fetchHealth() {
  const res = await fetch(`${SERVER_URL}/health`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error('not ok')
  return res.json()
}

export function useServerHealth() {
  const { status, failureCount } = useQuery({
    queryKey: ['server-health'],
    queryFn: fetchHealth,
    retry: 30,
    retryDelay: 5000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })

  return {
    isChecking: status === 'pending' && failureCount === 0,
    isWaking: status === 'pending' && failureCount > 0,
    isOnline: status === 'success',
    isOffline: status === 'error',
    retryCount: failureCount,
  }
}
