let queue = []
let currentIndex = -1

export function setQueue(
  tracks,
  selectedTrackId = null,
) {
  queue = [...tracks]

  if (queue.length === 0) {
    currentIndex = -1
    return
  }

  if (!selectedTrackId) {
    currentIndex = 0
    return
  }

  const index =
    queue.findIndex(
      (track) =>
        track.id ===
        selectedTrackId,
    )

  currentIndex =
    index >= 0
      ? index
      : 0
}

export function getCurrentTrack() {
  return queue[currentIndex]
    || null
}

export function getNextTrack() {
  if (queue.length === 0) {
    return null
  }

  currentIndex =
    (currentIndex + 1)
    % queue.length

  return getCurrentTrack()
}

export function getPreviousTrack() {
  if (queue.length === 0) {
    return null
  }

  currentIndex =
    currentIndex - 1

  if (currentIndex < 0) {
    currentIndex =
      queue.length - 1
  }

  return getCurrentTrack()
}

export function getQueueSnapshot() {
  return {
    tracks: [...queue],
    currentIndex,
    currentTrack:
      getCurrentTrack(),
  }
}