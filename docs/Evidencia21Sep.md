# Juan Rodolfo Mosqueda Lozano

# Evidencia de codigo hecho en clase 

# 21/09/2026


Codigo  agregado a app.js
``` js
import {
  recentlyPlayedTracks,
  trendingTracks,
} from './data/mock.data.js'

import {
  renderHome,
} from './ui/home.ui.js'

// Import nueva
import { renderSearch } from './ui/search.ui.js'
import { renderEmpty,renderError,renderLoading } from './ui/states.ui.js'



const app =document.querySelector('#app')

const playerTitle=document.querySelector('#player-title')
const playerArtist=document.querySelector('#player-artist')
const playerCover=document.querySelector('#player-cover')
const playButton=document.querySelector('#play-button')
const globalSearch=document.querySelector('#global-search')
const allTracks=[
  ...trendingTracks,
  ...recentlyPlayedTracks,
]

const state={
  currentView: 'home',
  currentTrack: null,
  trendingTracks:[],
  isPlaying: false,
  // parametros
  searchResults:[],
  searchQuery:''
}

async function initializeApp() {
  //renderCurrentView()
  registerNavigationEvents()
  registerGlobalEvents()
  //updatePlayer()
  //updateNavigationStyles()
  await loadHome()
}
async function loadHome(){
  state.currentView='home'
  renderLoading({
    target:app,
    message:'Cargando rolas en tendencias...'
  })
  updateNavigationStyles()
  try{
    state.trendingTracks=await getTrendingTracks()
    if(state.trendingTracks.length===0){
      renderEmpty({
        target:app,
        title:'No hay tendencias disponibles',
        message:'Audius no tiene tendencias disponibles'
      })
    }
    renderHome({
      target:app,
      trendingTracks:state.trendingTracks,
      recentlyPlayedTracks:state.trendingTracks.slice(0,4)
    })
    if(!state.currentTrack){
      state.currentTrack=state.trendingTracks[0]
      updatePlayer()
    }
  }catch(error){
    console.error(error)
    renderError({
      target:app,
      message:'No pudimos cargar las rolas desde audius',
      onRetry:loadHome
    })
  }
}

async function executeSearch(query){
  const normalizeQuery=query.trim()
  state.currentView='search'
  state.searchQuery=normalizeQuery
  updateNavigationStyles()
  if(normalizeQuery.length<2){
    renderEmpty({
      target:app,
      title:'Escribe una busqueda',
      message:'Utiliza al menos 2 caracteres para la busqueda'
    })
    return
  }
  renderLoading({
    target:app,
    message:`Buscando "${normalizeQuery}"`
  })
  try{
    state.searchResults=await searchTracks(normalizeQuery)
    if(state.searchResults.length===0){
      renderEmpty({
        target:app,
        title:'Sin resultados',
        message:`No encontramos canciones para "${normalizeQuery}"`
      })
      return
    }
    renderSearch({
      target:app,
      query:normalizeQuery,
      tracks:state.searchResults
    })
  }catch(error){
    console.error(error)
    renderError({
      target:app,
      message:'No encontramos resultados',
      onRetry:()=>executeSearch(normalizeQuery)
    })
  }
}

function renderLibraryPlaceholder(){
  state.currentView='library'
  updateNavigationStyles()
  renderEmpty({
    target:app,
    title:'Proximamente...',
    message:'Canciones favoritas, historial y preferencias'
  })
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
  document.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click',() => {
          const view=button.dataset.view
          if(view==='home'){
            loadHome()
            return
          }
          if(view==='library'){
            renderLibraryPlaceholder()
            return
          }
          if(view==='search'){
            state.currentView='search'
            updateNavigationStyles()
            globalSearch.focus()
            renderEmpty({
              target:app,
              title:'Busca tu rola favorita',
              message:'Escribe una cancion o artista en el buscador'
            })
            return
          }
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
  document.addEventListener('click',(event) => {
      const playTrackButton =event.target.closest('.play-track')
      if (!playTrackButton) {
        return
      }
      selectTrack(playTrackButton.dataset.trackId)
    },
  )

  globalSearch.addEventListener('keydown',(event)=>{
    if(event.key!=='Enter'){
      return
    }
    event.preventDefault()
    executeSearch(globalSearch.value)
  })

  playButton.addEventListener(
    'click',
    async () => {
  if (!state.currentTrack) {
    return
    }
  try {
    await toggleAudio()
      } catch (error) {
    console.error(
       'No fue posible cambiar la reproduccion:',
         error,
     )
   }
  },
)


function getVisibleTracks(){
  return[...state.trendingTracks,...state.searchResults]
}

function selectTrack(trackId) {
  const track=getVisibleTracks().find((item)=>item.id===trackId)

  if (!track) {
    return
  }

  state.currentTrack = track
  state.isPlaying = true
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
```

state.js
``` js
export function renderLoading({
  target,
  message = 'Cargando música...',
}) {
  target.innerHTML = `
    <section class="grid min-h-[50vh] place-items-center" aria-live="polite">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
        <p class="mt-4 text-sm text-zinc-400">${message}</p>
      </div>
    </section>
  `
}

export function renderEmpty({
  target,
  title = 'Sin resultados',
  message = 'No encontramos contenido para mostrar.',
}) {
  target.innerHTML = `
    <section class="grid min-h-[45vh] place-items-center">
      <div class="max-w-lg text-center">
        <div class="text-5xl">♫</div>
        <h2 class="mt-4 text-2xl font-bold">${title}</h2>
        <p class="mt-3 leading-7 text-zinc-400">${message}</p>
      </div>
    </section>
  `
}

export function renderError({
  target,
  message = 'No fue posible cargar la información.',
  onRetry,
}) {
  target.innerHTML = `
    <section class="grid min-h-[45vh] place-items-center" role="alert">
      <div class="max-w-lg rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div class="text-4xl">!</div>
        <h2 class="mt-4 text-2xl font-bold">Ocurrió un problema</h2>
        <p class="mt-3 leading-7 text-zinc-400">${message}</p>
        <button id="retry-button" type="button" class="mt-6 rounded-full bg-white px-5 py-2.5 font-semibold text-black">
          Reintentar
        </button>
      </div>
    </section>
  `

  document
    .querySelector('#retry-button')
    ?.addEventListener('click', onRetry)
}
```
