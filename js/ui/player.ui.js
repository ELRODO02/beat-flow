function formatTime(seconds = 0) {
  if (!Number.isFinite(seconds)) {
    return '0:00'
  }

  const minutes =
    Math.floor(seconds / 60)

  const remaining =
    Math.floor(seconds % 60)

  return `${minutes}:${String(
    remaining,
  ).padStart(2, '0')}`
}

export function createPlayerUI() {
  const cover =
    document.querySelector(
      '#player-cover',
    )

  const title =
    document.querySelector(
      '#player-title',
    )

  const artist =
    document.querySelector(
      '#player-artist',
    )

  const playButton =
    document.querySelector(
      '#play-button',
    )

  const currentTime =
    document.querySelector(
      '#current-time',
    )

  const durationTime =
    document.querySelector(
      '#duration-time',
    )

  const progress =
    document.querySelector(
      '#progress-range',
    )

  const volume =
    document.querySelector(
      '#volume-range',
    )

  function renderTrack(track) {
    if (!track) {
      return
    }

    cover.src = track.cover
    cover.alt =
      `Portada de ${track.title}`

    title.textContent =
      track.title

    artist.textContent =
      track.artist
  }

  function renderPlaying(
    isPlaying,
  ) {
    playButton.textContent =
      isPlaying
        ? '❚❚'
        : '▶'

    playButton.setAttribute(
      'aria-label',
      isPlaying
        ? 'Pausar'
        : 'Reproducir',
    )
  }

  function renderProgress({
    currentTime: current,
    duration,
  }) {
    const safeDuration =
      duration > 0
        ? duration
        : 0

    currentTime.textContent =
      formatTime(current)

    durationTime.textContent =
      formatTime(safeDuration)

    progress.max =
      String(safeDuration || 100)

    progress.value =
      String(current || 0)
  }

  function renderVolume(value) {
    volume.value =
      String(value)
  }

  return {
    renderTrack,
    renderPlaying,
    renderProgress,
    renderVolume,
  }
}