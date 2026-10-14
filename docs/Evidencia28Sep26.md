 #  Evidencia 28Sep26
# Juan Rodolfo Mosqueda Lozano 

En esta sesión se agregó el reproductor de audio de BeatFlow, incluyendo los botones de anterior y siguiente, la barra de progreso y el control de volumen. También se implementó la reproducción de canciones desde Audius, el cambio automático entre pistas y la actualización de la interfaz con la información de la canción actual.

Codigo agregado a app.js
```js
// const de sesion 3
const previousButton=document.querySelector('#previous-button')
const nextButton=document.querySelector('#next-button')
const progressRange=document.querySelector('#progress-range')
const volumeRange=document.querySelector('#volume-range')
const playerUI=createPlayerUI()

registerPlayerEvents()
  setVolume(Number(volumeRange.value))


   renderHome({
      target:app,
      trendingTracks:state.trendingTracks,
      recentlyPlayedTracks:state.trendingTracks.slice(0,4)
    })

    function getActiveCollection(){
  if(state.currentView==='search'&&state.searchResults.length>0){
    return state.searchResults
  }
  return state.trendingTracks
}

async function playTrack(trackId){
  const tracks=getActiveCollection()
  const track=tracks.find((item)=>item.id===trackId)
  if(!track){
    return
  }
  if(track.isStreamable===false){
    alert('La cancion no está disponible')
    return
  }
  setQueue(tracks,track.id)
  await loadAndPlay(track)
}

async function loadAndPlayTrack(track){
  try{
    state.currentTrack=track
    playerUI.renderTrack(track)
    const streamUrl=getTrackStreamUrl(track.id)
    loadAudio(streamUrl)
    await playAudio()
  }catch(error){
    alert(`No es posible reproducir la cancion ${error}`)
  }
}

async function playNextTrack(){
  const track=getNextTrack()
  if(!track){
    return
  }
  await loadAndPlayTrack(track)
}

async function playPreviousTrack(){
  const snapshot=getPlayerSnapshot()
  if(snapshot.currentTime>3){
    seekAudio(0)
    return
  }
  const track=getPreviousTrack()
  if(!track){
    return
  }
  await loadAndPlayTrack(track)
}

function registerPlayerEvents(){
  onPlayerEvent('play',()=>{
    state.isPlaying=true
    playerUI.renderPlaying(true)
  })
  onPlayerEvent('pause',()=>{
    state.isPlaying=false
    playerUI.renderPlaying(false)
  })
  onPlayerEvent('timeupdate',(payload)=>{
    playerUI.renderProgress(payload)
  })
  onPlayerEvent('metadata',({duration})=>{
    playerUI.renderProgress({
      currentTime:0,
      duration
    })
  })
  onPlayerEvent('volumechange',({volume})=>{
    playerUI.renderVolume(volume)
  })
  onPlayerEvent('ended',playNextTrack)
  onPlayerEvent('error',(error)=>{
    console.error('Audio error:',error)
  })
}

previousButton.addEventListener('click',playPreviousTrack)
  nextButton.addEventListener('click',playNextTrack)

  progressRange.addEventListener('input',()=>{
    seekAudio(Number(progressRange.value))
  })

  volumeRange.addEventListener('input',()=>{
    Number(volumeRange.value)
  })
  ```