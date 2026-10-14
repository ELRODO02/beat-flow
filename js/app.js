import { renderHome } from './ui/home.ui.js'
import { renderSearch } from './ui/search.ui.js'
import { renderEmpty, renderError, renderLoading } from './ui/states.ui.js'

import {
  getTrackStreamUrl,
  getTrendingTracks,
  searchTracks,
} from './api/audius.api.js'

import {
  getNextTrack,
  getPreviousTrack,
  setQueue,
} from './services/queue.service.js'

import {
  getPlayerSnapshot,
  loadAudio,
  onPlayerEvent,
  playAudio,
  seekAudio,
  setVolume,
  toggleAudio,
} from './services/player.service.js'

import { createPlayerUI } from './ui/player.ui.js'

import {
  addToHistory,
  getFavorites,
  getHistory,
  getLastTrack,
  getVolume,
  isFavorite,
  saveLastTrack,
  saveVolume,
  toggleFavorite,
} from './services/storage.service.js'

import { renderLibrary } from './ui/library.ui.js'

const app = document.querySelector('#app')
const globalSearch = document.querySelector('#global-search')
const playButton = document.querySelector('#play-button')
const previousButton = document.querySelector('#previous-button')
const nextButton = document.querySelector('#next-button')
const progressRange = document.querySelector('#progress-range')
const volumeRange = document.querySelector('#volume-range')

const playerUI = createPlayerUI()

const state = {
  currentView: 'home',
  currentTrack: null,
  trendingTracks: [],
  searchResults: [],
  searchQuery: '',
  favorites: [],
  history: [],
  isPlaying: false,
}


const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80'

// Detectar imágenes que no se pudieron cargar
document.addEventListener('error', (event) => {
  const img = event.target

  if (!(img instanceof HTMLImageElement)) {
    return
  }

  // Evitar intentar cargar el respaldo repetidamente
  if (img.dataset.fallbackApplied === 'true') {
    return
  }

  img.dataset.fallbackApplied = 'true'
  img.src = FALLBACK_COVER

}, true)


async function initializeApp() {
  state.favorites = getFavorites()
  state.history = getHistory()

  const savedVolume = getVolume()
  setVolume(savedVolume)
  playerUI.renderVolume(savedVolume)

  registerNavigationEvents()
  registerGlobalEvents()
  registerPlayerEvents()

  await loadHome()
  restoreLastTrack()
}

function restoreLastTrack() {
  const track = getLastTrack()
  if (!track) {
    return
  }

  state.currentTrack = track
  playerUI.renderTrack(track)
  playerUI.renderFavorite(isFavorite(track.id))
}

async function loadHome() {
  state.currentView = 'home'
  updateNavigationStyles()
  renderLoading({
    target: app,
    message: 'Cargando rolas en tendencias...',
  })

  try {
    state.trendingTracks = await getTrendingTracks()
    renderHome({
      target: app,
      trendingTracks: state.trendingTracks,
      recentlyPlayedTracks: state.trendingTracks.slice(0, 4),
    })
  } catch (error) {
    console.error('Error al cargar tendencias:', error)
    renderError({
      target: app,
      message: 'No pudimos cargar las rolas desde Audius',
      onRetry: loadHome,
    })
  }
}

async function executeSearch(query) {
  const normalizedQuery = query.trim()
  state.currentView = 'search'
  state.searchQuery = normalizedQuery
  updateNavigationStyles()

  if (normalizedQuery.length < 2) {
    renderEmpty({
      target: app,
      title: 'Escribe una búsqueda',
      message: 'Utiliza al menos 2 caracteres para la búsqueda',
    })
    return
  }

  renderLoading({
    target: app,
    message: `Buscando "${normalizedQuery}"`,
  })

  try {
    state.searchResults = await searchTracks(normalizedQuery)

    if (state.searchResults.length === 0) {
      renderEmpty({
        target: app,
        title: 'Sin resultados',
        message: `No encontramos canciones para "${normalizedQuery}"`,
      })
      return
    }

    renderSearch({
      target: app,
      query: normalizedQuery,
      tracks: state.searchResults,
    })
  } catch (error) {
    console.error('Error al buscar:', error)
    renderError({
      target: app,
      message: 'No encontramos resultados',
      onRetry: () => executeSearch(normalizedQuery),
    })
  }
}

// También reconoce canciones de Biblioteca, no solo de Inicio y Búsqueda.
function getActiveCollection() {
  if (state.currentView === 'search') {
    return state.searchResults
  }

  if (state.currentView === 'library') {
    const known = [...state.favorites, ...state.history]
    return known.filter(
      (track, index) =>
        known.findIndex((item) => String(item.id) === String(track.id)) === index,
    )
  }

  return state.trendingTracks
}

function getAllKnownTracks() {
  return [
    ...state.trendingTracks,
    ...state.searchResults,
    ...state.favorites,
    ...state.history,
    state.currentTrack,
  ].filter(Boolean)
}

function handleFavorite(trackId) {
  const track = getAllKnownTracks().find(
    (item) => String(item.id) === String(trackId),
  )

  if (!track) {
    return
  }

  state.favorites = toggleFavorite(track)

  if (String(state.currentTrack?.id) === String(track.id)) {
    playerUI.renderFavorite(isFavorite(track.id))
  }

  if (state.currentView === 'library') {
    renderLibraryView()
  }
}

async function playTrack(trackId) {
  const tracks = getActiveCollection()
  const track = tracks.find(
    (item) => String(item.id) === String(trackId),
  )

  if (!track) {
    return
  }

  if (track.isStreamable === false) {
    alert('La canción no está disponible')
    return
  }

  setQueue(tracks, track.id)
  await loadAndPlayTrack(track)
}


async function loadAndPlayTrack(track) {
  try {
    state.currentTrack = track

    playerUI.renderTrack(track)

    playerUI.renderFavorite(
      isFavorite(track.id)
    )

    const streamUrl = getTrackStreamUrl(track.id)

    loadAudio(streamUrl)

    const started = await playAudio()

    if (!started) {
      return
    }

    // Evitar registrar una canción reemplazada
    if (
      String(state.currentTrack?.id) !==
      String(track.id)
    ) {
      return
    }

    state.history = addToHistory(track)

    saveLastTrack(track)

  } catch (error) {
    console.error(
      'Error al reproducir la canción:',
      error
    )

    alert(
      'No fue posible reproducir esta canción.'
    )
  }
}


async function playNextTrack() {
  const track = getNextTrack()
  if (!track) {
    return
  }

  await loadAndPlayTrack(track)
}

async function playPreviousTrack() {
  const snapshot = getPlayerSnapshot()
  if (snapshot.currentTime > 3) {
    seekAudio(0)
    return
  }

  const track = getPreviousTrack()
  if (!track) {
    return
  }

  await loadAndPlayTrack(track)
}

function registerPlayerEvents() {
  onPlayerEvent('play', () => {
    state.isPlaying = true
    playerUI.renderPlaying(true)
  })

  onPlayerEvent('pause', () => {
    state.isPlaying = false
    playerUI.renderPlaying(false)
  })

  onPlayerEvent('timeupdate', (payload) => {
    playerUI.renderProgress(payload)
  })

  onPlayerEvent('metadata', ({ duration }) => {
    playerUI.renderProgress({
      currentTime: 0,
      duration,
    })
  })

  onPlayerEvent('volumechange', ({ volume }) => {
    playerUI.renderVolume(volume)
  })

  onPlayerEvent('ended', playNextTrack)

  onPlayerEvent('error', (error) => {
    console.error('Audio error:', error)
    alert('No fue posible reproducir esta canción.')
  })
}

function renderLibraryView() {
  state.currentView = 'library'
  state.favorites = getFavorites()
  state.history = getHistory()

  renderLibrary({
    target: app,
    favorites: state.favorites,
    history: state.history,
  })

  updateNavigationStyles()
}

function registerNavigationEvents() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view

      if (view === 'home') {
        loadHome()
        return
      }

      if (view === 'library') {
        renderLibraryView()
        return
      }

      if (view === 'search') {
        state.currentView = 'search'
        updateNavigationStyles()
        globalSearch.focus()
        renderEmpty({
          target: app,
          title: 'Busca tu rola favorita',
          message: 'Escribe una canción o artista en el buscador',
        })
      }
    })
  })
}

function updateNavigationStyles() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle(
      'nav-item-active',
      item.dataset.view === state.currentView,
    )
  })

  document.querySelectorAll('.mobile-nav-item').forEach((item) => {
    item.classList.toggle(
      'mobile-nav-active',
      item.dataset.view === state.currentView,
    )
  })
}

function registerGlobalEvents() {
  // Delegación: botones de favoritos de las tarjetas y de reproducción.
  document.addEventListener('click', async (event) => {
    const favoriteButton = event.target.closest('.favorite-track')
    if (favoriteButton) {
      handleFavorite(favoriteButton.dataset.trackId)
      return
    }

    const playTrackButton = event.target.closest('.play-track')
    if (playTrackButton) {
      await playTrack(playTrackButton.dataset.trackId)
    }
  })

  const playerFavoriteButton = document.querySelector('#player-favorite-button')
  playerFavoriteButton?.addEventListener('click', () => {
    if (!state.currentTrack) {
      return
    }

    handleFavorite(state.currentTrack.id)
  })

  globalSearch.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    executeSearch(globalSearch.value)
  })

  playButton.addEventListener('click', async () => {
    if (!state.currentTrack) {
      return
    }

    try {
      await toggleAudio()
    } catch (error) {
      console.error('No fue posible cambiar la reproducción:', error)
    }
  })

  previousButton.addEventListener('click', playPreviousTrack)
  nextButton.addEventListener('click', playNextTrack)

  progressRange.addEventListener('input', () => {
    seekAudio(Number(progressRange.value))
  })

  volumeRange.addEventListener('input', () => {
    const volume = Number(volumeRange.value)
    setVolume(volume)
    saveVolume(volume)
  })
}

initializeApp()
