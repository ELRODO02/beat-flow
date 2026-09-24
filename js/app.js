import {
  getTrendingTracks,
  searchTracks,
} from './api/audius.api.js'

import { renderHome } from './ui/home.ui.js'
import { renderSearch } from './ui/search.ui.js'
import {
  renderEmpty,
  renderError,
  renderLoading,
} from './ui/states.ui.js'

const app = document.querySelector('#app')
const globalSearch = document.querySelector('#global-search')
const playerTitle = document.querySelector('#player-title')
const playerArtist = document.querySelector('#player-artist')
const playerCover = document.querySelector('#player-cover')
const playButton = document.querySelector('#play-button')

const state = {
  currentView: 'home',
  currentTrack: null,
  trendingTracks: [],
  searchResults: [],
  searchQuery: '',
  isPlaying: false,
}

async function initializeApp() {
  registerNavigationEvents()
  registerGlobalEvents()
  await loadHome()
}

async function loadHome() {
  state.currentView = 'home'
  renderLoading({ target: app, message: 'Cargando tendencias...' })
  updateNavigationStyles()

  try {
    state.trendingTracks = await getTrendingTracks()

    if (state.trendingTracks.length === 0) {
      renderEmpty({
        target: app,
        title: 'No hay tendencias disponibles',
        message: 'Audius no devolvió canciones en este momento.',
      })
      return
    }

    renderHome({
      target: app,
      trendingTracks: state.trendingTracks,
      recentlyPlayedTracks: state.trendingTracks.slice(0, 4),
    })

    if (!state.currentTrack) {
      state.currentTrack = state.trendingTracks[0]
      updatePlayer()
    }
  } catch (error) {
    console.error(error)
    renderError({
      target: app,
      message: 'No pudimos obtener las tendencias de Audius. Verifica tu API Key y la conexión.',
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
      message: 'Utiliza al menos 2 caracteres para buscar canciones.',
    })
    return
  }

  renderLoading({
    target: app,
    message: `Buscando “${normalizedQuery}”...`,
  })

  try {
    state.searchResults = await searchTracks(normalizedQuery)

    if (state.searchResults.length === 0) {
      renderEmpty({
        target: app,
        title: 'Sin resultados',
        message: `No encontramos canciones para “${normalizedQuery}”.`,
      })
      return
    }

    renderSearch({
      target: app,
      query: normalizedQuery,
      tracks: state.searchResults,
    })
  } catch (error) {
    console.error(error)
    renderError({
      target: app,
      message: 'La búsqueda no pudo completarse.',
      onRetry: () => executeSearch(normalizedQuery),
    })
  }
}

function renderLibraryPlaceholder() {
  state.currentView = 'library'
  updateNavigationStyles()

  renderEmpty({
    target: app,
    title: 'Tu biblioteca llegará en la Sesión 4',
    message: 'Aquí aparecerán favoritos, historial y preferencias.',
  })
}

function registerNavigationEvents() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view

      if (view === 'home') {
        loadHome()
        return
      }

      if (view === 'search') {
        state.currentView = 'search'
        updateNavigationStyles()
        globalSearch.focus()
        renderEmpty({
          target: app,
          title: 'Busca música',
          message: 'Escribe una canción o artista en el buscador.',
        })
        return
      }

      if (view === 'library') {
        renderLibraryPlaceholder()
      }
    })
  })
}

function registerGlobalEvents() {
  globalSearch.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    executeSearch(globalSearch.value)
  })

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.play-track')
    if (!button) return
    selectTrack(button.dataset.trackId)
  })

  playButton.addEventListener('click', () => {
    state.isPlaying = !state.isPlaying
    updatePlayer()
  })
}

function getVisibleTracks() {
  return [...state.trendingTracks, ...state.searchResults]
}

function selectTrack(trackId) {
  const track = getVisibleTracks().find((item) => item.id === trackId)
  if (!track) return

  state.currentTrack = track
  state.isPlaying = true
  updatePlayer()
}

function updatePlayer() {
  const track = state.currentTrack
  if (!track) return

  playerTitle.textContent = track.title
  playerArtist.textContent = track.artist
  playerCover.src = track.cover
  playerCover.alt = `Portada de ${track.title}`
  playButton.textContent = state.isPlaying ? '❚❚' : '▶'
  playButton.setAttribute('aria-label', state.isPlaying ? 'Pausar' : 'Reproducir')
}

function updateNavigationStyles() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('nav-item-active', item.dataset.view === state.currentView)
  })

  document.querySelectorAll('.mobile-nav-item').forEach((item) => {
    item.classList.toggle('mobile-nav-active', item.dataset.view === state.currentView)
  })
}

initializeApp()