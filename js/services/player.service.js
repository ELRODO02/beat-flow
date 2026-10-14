const audio = new Audio()

audio.preload = 'metadata'
audio.volume = 0.7

const listeners = new Map()

function emit(eventName, payload) {
  const handlers =
    listeners.get(eventName)
    || []

  handlers.forEach(
    (handler) =>
      handler(payload),
  )
}

function bindNativeEvents() {
  audio.addEventListener(
    'loadedmetadata',
    () => {
      emit('metadata', {
        duration:
          Number.isFinite(
            audio.duration,
          )
            ? audio.duration
            : 0,
      })
    },
  )

  audio.addEventListener(
    'timeupdate',
    () => {
      emit('timeupdate', {
        currentTime:
          audio.currentTime,
        duration:
          Number.isFinite(
            audio.duration,
          )
            ? audio.duration
            : 0,
      })
    },
  )

  audio.addEventListener(
    'play',
    () => emit('play'),
  )

  audio.addEventListener(
    'pause',
    () => emit('pause'),
  )

  audio.addEventListener(
    'ended',
    () => emit('ended'),
  )

  audio.addEventListener(
    'error',
    () => {
      emit(
        'error',
        audio.error,
      )
    },
  )

  audio.addEventListener(
    'volumechange',
    () => {
      emit('volumechange', {
        volume: audio.volume,
      })
    },
  )
}

bindNativeEvents()

export function onPlayerEvent(
  eventName,
  handler,
) {
  const handlers =
    listeners.get(eventName)
    || []

  handlers.push(handler)

  listeners.set(
    eventName,
    handlers,
  )
}

export function loadAudio(
  streamUrl,
) {
  audio.pause()
  audio.src = streamUrl
  audio.load()
}

export async function playAudio() {
  await audio.play()
}

export function pauseAudio() {
  audio.pause()
}

export function toggleAudio() {
  if (audio.paused) {
    return playAudio()
  }

  pauseAudio()
  return Promise.resolve()
}

export function seekAudio(
  seconds,
) {
  if (
    !Number.isFinite(seconds)
  ) {
    return
  }

  audio.currentTime =
    Math.max(
      0,
      Math.min(
        seconds,
        audio.duration || seconds,
      ),
    )
}

export function setVolume(
  volume,
) {
  const safeVolume =
    Math.max(
      0,
      Math.min(1, volume),
    )

  audio.volume = safeVolume
}

export function getPlayerSnapshot() {
  return {
    paused: audio.paused,
    currentTime:
      audio.currentTime,
    duration:
      Number.isFinite(
        audio.duration,
      )
        ? audio.duration
        : 0,
    volume:
      audio.volume,
  }
}