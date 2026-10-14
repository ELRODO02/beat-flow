const STORAGE_KEYS = {
  favorites: 'beatflow:favorites',
  history: 'beatflow:history',
  volume: 'beatflow:volume',
  lastTrack: 'beatflow:last-track',
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error(`Error reading ${key}:`, error)
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value),
    )
  } catch (error) {
    console.error(`Error writing ${key}:`, error)
  }
}

export function getFavorites() {
  return readJson(STORAGE_KEYS.favorites, [])
}

export function isFavorite(trackId) {
  return getFavorites()
    .some((track) => track.id === trackId)
}

export function toggleFavorite(track) {
  const favorites = getFavorites()

  const exists =
    favorites.some(
      (item) => item.id === track.id,
    )

  const nextFavorites =
    exists
      ? favorites.filter(
          (item) => item.id !== track.id,
        )
      : [track, ...favorites]

  writeJson(
    STORAGE_KEYS.favorites,
    nextFavorites,
  )

  return nextFavorites
}

export function getHistory() {
  return readJson(STORAGE_KEYS.history, [])
}

export function addToHistory(track) {
  const history = getHistory()

  const withoutDuplicate =
    history.filter(
      (item) => item.id !== track.id,
    )

  const nextHistory = [
    {
      ...track,
      playedAt: new Date().toISOString(),
    },
    ...withoutDuplicate,
  ].slice(0, 20)

  writeJson(
    STORAGE_KEYS.history,
    nextHistory,
  )

  return nextHistory
}

export function saveVolume(volume) {
  localStorage.setItem(
    STORAGE_KEYS.volume,
    String(volume),
  )
}

export function getVolume() {
  const value =
    localStorage.getItem(
      STORAGE_KEYS.volume,
    )

  if (value === null) {
    return 0.7
  }

  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    return 0.7
  }

  return Math.min(
    1,
    Math.max(0, parsed),
  )
}

export function saveLastTrack(track) {
  writeJson(
    STORAGE_KEYS.lastTrack,
    track,
  )
}

export function getLastTrack() {
  return readJson(
    STORAGE_KEYS.lastTrack,
    null,
  )
}

export function clearLibrary() {
  localStorage.removeItem(STORAGE_KEYS.favorites)
  localStorage.removeItem(STORAGE_KEYS.history)
  localStorage.removeItem(STORAGE_KEYS.lastTrack)
}