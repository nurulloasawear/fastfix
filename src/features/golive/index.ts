// PUBLIC API — pages import ONLY from '@/features/golive', never deep paths.
export { goLiveMessages } from './i18n'

// Queries
export {
  goLiveKeys,
  useCreateStream,
  useGoLive,
  useEndStream,
  useStreamMeta,
  useJoinStream,
  useWatchStream,
} from './api/golive.queries'

// API (for non-hook callers / tests)
export { createStream, goLive, endStream, getStream, joinStream, watchStream } from './api/golive.api'

// Components
export { BroadcastStage } from './components/BroadcastStage'
export { Countdown } from './components/Countdown'

// Types
export type {
  StreamStatus,
  GoLiveSession,
  Playback,
  GoLiveResult,
  JoinResult,
  WatchResult,
  BroadcastPhase,
} from './types/golive.types'
