import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import socket from '../socket'
import useBoardStore from '../store/BoardStore'
import { useGameStore } from '../store/GameStore'
import { useModalStore } from '../store/ModalStore'
import { usePointStore } from '../store/PointsStore'
import useTurnStore from '../store/TurnStore'
import useNeoHandStore from '../store/NeoHandStore'
import useSoundStore from '../store/SoundStore'
import { Volume2, VolumeOff } from 'lucide-react'
import { useServerHealth } from '../hooks/useServerHealth'
import { trackEvent, trackServerOfflineSeenOnce, trackSiteVisitedOnce } from '../lib/analytics'

export default function DefaultLayout() {
  const navigate = useNavigate()
  const { isWaking, isOnline, isOffline, retryCount } = useServerHealth()

  const dotClass = isOnline ? 'bg-green-500' : isWaking ? 'bg-amber-400 animate-pulse' : isOffline ? 'bg-red-500' : 'bg-gray-300 animate-pulse'
  const label = isOnline ? 'Server online' : isWaking ? `Starting up… (${retryCount}/30)` : isOffline ? 'Server offline' : 'Checking server…'
  const [resetBoardStore] = useBoardStore((state) => [state.resetStore])
  const [resetGameStore] = useGameStore((state) => [state.resetStore])
  const [resetPointsStore] = usePointStore((state) => [state.resetStore])
  const [resetTurnStore] = useTurnStore((state) => [state.resetStore])
  const [resetModalStore] = useModalStore((state) => [state.resetStore])
  const [resetNeoHandStore] = useNeoHandStore((state) => [state.resetStore])
  const [muted, toggleMute] = useSoundStore((state) => [state.muted, state.toggleMute])

  const resetAllStores = () => {
    resetBoardStore()
    resetGameStore()
    resetPointsStore()
    resetTurnStore()
    resetModalStore()
    resetNeoHandStore()
  }

  useEffect(() => {
    trackSiteVisitedOnce()
  }, [])

  useEffect(() => {
    if (isOffline) {
      trackServerOfflineSeenOnce(retryCount)
    }
  }, [isOffline, retryCount])

  const handleToggleMute = () => {
    const nextMuted = !muted
    trackEvent('sfx_toggled', { muted: nextMuted })
    toggleMute()
  }

  const handleTitleClick = () => {
    socket.disconnect()
    resetAllStores()
    navigate('/')
  }

  return (
    <div className="min-h-full min-[480px]:h-full overflow-x-hidden overflow-y-auto min-[480px]:overflow-y-hidden relative">
      <div role="status" aria-live="polite" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center justify-center sm:justify-start gap-2 bg-white border border-gray-200 shadow-md rounded-full px-3 py-1.5 max-w-[calc(100vw-2rem)] sm:max-w-none">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <span className="text-xs text-gray-600 whitespace-nowrap truncate">{label}</span>
      </div>
      <button
        onClick={handleToggleMute}
        className="absolute top-4 right-6 z-50 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        title={muted
          ? 'Unmute'
          : 'Mute'}
      >
        {muted
          ? <VolumeOff size={24} />
          : <Volume2 size={24} />}
      </button>
      <div className="flex flex-col justify-center items-center mt-2 min-[480px]:h-full w-full">
        <h1 className="font-light z-50 text-2xl min-[480px]:text-5xl xl:text-6xl 2xl:text-7xl font-title">
          <button onClick={handleTitleClick} className="hover:cursor-pointer bg-transparent border-none p-0 font-[inherit] text-[inherit]">
            Queen's Blood
          </button>
        </h1>
        <Outlet />
      </div>
      <footer className="fixed left-1/2 -translate-x-1/2 bottom-16 sm:bottom-4 z-40 flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur">
        <span>Made by</span>
        <a
          href="https://x.com/philipe_marques"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-gray-700 hover:text-gray-900"
        >
          @philipe_marques
        </a>
        <span aria-hidden="true">&middot;</span>
        <a
          href="mailto:contact@phmarques.com"
          className="font-medium text-gray-700 hover:text-gray-900"
        >
          contact@phmarques.com
        </a>
        <span aria-hidden="true">&middot;</span>
        <a
          href="https://github.com/xRiku/react-queens-blood"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-gray-700 hover:text-gray-900"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}
