import {
  recentlyPlayedTracks,
  trendingTracks,
} from './data/mock.data.js'

import {
  renderHome,
} from './ui/home.ui.js'

const app =
  document.querySelector('#app')

const playerTitle =
  document.querySelector('#player-title')

const playerArtist =
  document.querySelector('#player-artist')

const playerCover =
  document.querySelector('#player-cover')

const playButton =
  document.querySelector('#play-button')

const globalSearch =
  document.querySelector('#global-search')

const allTracks = [
  ...trendingTracks,
  ...recentlyPlayedTracks,
]

const state = {
  currentView: 'home',
  currentTrack: trendingTracks[0],
  isPlaying: false,
}

function initializeApp() {
  renderCurrentView()
  registerNavigationEvents()
  registerGlobalEvents()
  updatePlayer()
  updateNavigationStyles()
}

function renderCurrentView() {
  if (state.currentView === 'home') {
    renderHome({
      target: app,
      trendingTracks,
      recentlyPlayedTracks,
    })

    return
  }

  renderPlaceholderView(state.currentView)
}

function renderPlaceholderView(view) {
  const content = {
    search: {
      eyebrow: 'Sesión 2',
      title: 'Buscar música',
      description:
        'En la siguiente sesión esta vista se conectará con una API musical real.',
    },

    library: {
      eyebrow: 'Sesión 4',
      title: 'Tu biblioteca',
      description:
        'Más adelante aparecerán favoritos, historial y preferencias.',
    },
  }

  const selected = content[view]

  if (!selected) {
    return
  }

  app.innerHTML = `
    <section class="grid min-h-[60vh] place-items-center">
      <div
        class="max-w-xl rounded-3xl border border-white/10
               bg-zinc-900/60 p-8 text-center"
      >
        <p
          class="text-xs font-semibold uppercase
                 tracking-[0.2em] text-violet-400"
        >
          ${selected.eyebrow}
        </p>

        <h1 class="mt-3 text-4xl font-bold">
          ${selected.title}
        </h1>

        <p class="mt-4 leading-7 text-zinc-400">
          ${selected.description}
        </p>

        <button
          id="back-home"
          type="button"
          class="mt-6 rounded-full bg-white px-5 py-2.5
                 text-sm font-bold text-black"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  `

  document
    .querySelector('#back-home')
    ?.addEventListener(
      'click',
      () => navigateTo('home'),
    )
}

function registerNavigationEvents() {
  document
    .querySelectorAll('[data-view]')
    .forEach((button) => {
      button.addEventListener(
        'click',
        () => {
          navigateTo(button.dataset.view)
        },
      )
    })
}

function navigateTo(view) {
  state.currentView = view
  renderCurrentView()
  updateNavigationStyles()
}

function updateNavigationStyles() {
  document
    .querySelectorAll('.nav-item')
    .forEach((item) => {
      const isActive =
        item.dataset.view === state.currentView

      item.classList.toggle(
        'nav-item-active',
        isActive,
      )
    })

  document
    .querySelectorAll('.mobile-nav-item')
    .forEach((item) => {
      const isActive =
        item.dataset.view === state.currentView

      item.classList.toggle(
        'mobile-nav-active',
        isActive,
      )
    })
}

function registerGlobalEvents() {
  document.addEventListener(
    'click',
    (event) => {
      const playTrackButton =
        event.target.closest('.play-track')

      if (!playTrackButton) {
        return
      }

      selectTrack(
        playTrackButton.dataset.trackId,
      )
    },
  )

  playButton.addEventListener(
    'click',
    togglePlayState,
  )

  globalSearch.addEventListener(
    'focus',
    () => {
      if (state.currentView !== 'search') {
        navigateTo('search')
      }
    },
  )
}

function selectTrack(trackId) {
  const selectedTrack =
    allTracks.find(
      (track) =>
        track.id === trackId,
    )

  if (!selectedTrack) {
    return
  }

  state.currentTrack = selectedTrack
  state.isPlaying = true

  updatePlayer()
}

function togglePlayState() {
  state.isPlaying = !state.isPlaying
  updatePlayer()
}

function updatePlayer() {
  const track = state.currentTrack

  if (!track) {
    return
  }

  playerTitle.textContent = track.title
  playerArtist.textContent = track.artist
  playerCover.src = track.cover
  playerCover.alt = `Portada de ${track.title}`

  playButton.textContent =
    state.isPlaying
      ? '❚❚'
      : '▶'

  playButton.setAttribute(
    'aria-label',
    state.isPlaying
      ? 'Pausar'
      : 'Reproducir',
  )
}

initializeApp()