import { APP_CONFIG } from '../config.js'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80'

let client = null

function getClient() {
  if (client) return client

  if (!window.audiusSdk) {
    throw new Error('Audius SDK is not loaded.')
  }

  if (
    !APP_CONFIG.audius.apiKey ||
    APP_CONFIG.audius.apiKey === 'REEMPLAZA_CON_TU_API_KEY'
  ) {
    throw new Error('Audius API Key is not configured.')
  }

  client = window.audiusSdk({
    apiKey: APP_CONFIG.audius.apiKey,
  })

  return client
}

function formatDuration(seconds = 0) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = Math.floor(safeSeconds % 60)

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function normalizeArtwork(artwork) {
  return (
    artwork?._480x480 ||
    artwork?._1000x1000 ||
    artwork?._150x150 ||
    FALLBACK_COVER
  )
}

function normalizeTrack(track) {
  return {
    id: track.id,
    title: track.title || 'Sin título',
    artist: track.user?.name || 'Artista desconocido',
    genre: track.genre || 'Unknown',
    duration: formatDuration(track.duration),
    durationSeconds: track.duration || 0,
    cover: normalizeArtwork(track.artwork),
    playCount: track.playCount || 0,
    favoriteCount: track.favoriteCount || 0,
    permalink: track.permalink || '',
  }
}

export async function getTrendingTracks() {
  const audius = getClient()

  const response = await audius.tracks.getTrendingTracks({
    time: APP_CONFIG.trending.time,
    limit: APP_CONFIG.trending.limit,
  })

  return (response.data || []).map(normalizeTrack)
}

export async function searchTracks(query) {
  const normalizedQuery = query.trim()

  if (normalizedQuery.length < APP_CONFIG.search.minLength) {
    return []
  }

  const audius = getClient()

  const response = await audius.tracks.searchTracks({
    query: normalizedQuery,
    limit: APP_CONFIG.search.limit,
    sortMethod: 'relevant',
  })

  return (response.data || []).map(normalizeTrack)
}