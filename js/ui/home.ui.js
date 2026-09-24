function createTrackCard(track) {
  return `
    <article
      class="track-card group rounded-2xl border border-white/5
             bg-zinc-900/80 p-3 transition duration-300
             hover:-translate-y-1 hover:border-violet-500/40"
    >
      <div class="relative overflow-hidden rounded-xl">
        <img
          src="${track.cover}"
          alt="Portada de ${track.title}"
          class="track-card-image aspect-square w-full object-cover"
          loading="lazy"
        >

        <button
          type="button"
          class="play-track absolute bottom-3 right-3 grid h-11 w-11
                 place-items-center rounded-full bg-white text-black
                 opacity-0 shadow-xl transition
                 group-hover:opacity-100 focus:opacity-100"
          data-track-id="${track.id}"
          aria-label="Seleccionar ${track.title}"
        >
          ▶
        </button>

        <div
          class="absolute left-3 top-3 rounded-full bg-black/60
                 px-2.5 py-1 text-[10px] font-semibold uppercase"
        >
          ${track.genre}
        </div>
      </div>

      <div class="mt-3">
        <h3 class="truncate font-semibold">${track.title}</h3>
        <p class="mt-1 truncate text-sm text-zinc-500">${track.artist}</p>
      </div>
    </article>
  `
}

function createRecentlyPlayedRow(track) {
  return `
    <article
      class="grid grid-cols-[auto_1fr_auto_auto]
             items-center gap-3 rounded-2xl px-3 py-2
             transition hover:bg-zinc-900"
    >
      <img
        src="${track.cover}"
        alt="Portada de ${track.title}"
        class="h-12 w-12 rounded-xl object-cover"
        loading="lazy"
      >

      <div class="min-w-0">
        <p class="truncate text-sm font-semibold">${track.title}</p>
        <p class="truncate text-xs text-zinc-500">${track.artist}</p>
      </div>

      <span class="hidden text-xs text-zinc-600 sm:block">
        ${track.duration}
      </span>

      <button
        type="button"
        class="play-track grid h-9 w-9 place-items-center
               rounded-full bg-zinc-800 text-white"
        data-track-id="${track.id}"
        aria-label="Seleccionar ${track.title}"
      >
        ▶
      </button>
    </article>
  `
}

export function renderHome({
  target,
  trendingTracks,
  recentlyPlayedTracks,
}) {
  target.innerHTML = `
    <section>
      <div
        class="relative overflow-hidden rounded-3xl border border-white/10
               bg-gradient-to-br from-violet-950 via-zinc-900
               to-cyan-950 px-6 py-8 md:px-10 md:py-12"
      >
        <div
          class="absolute -right-20 -top-20 h-72 w-72
                 rounded-full bg-violet-500/20 blur-3xl"
        ></div>

        <div class="relative max-w-2xl">
          <span
            class="inline-flex rounded-full border border-violet-400/30
                   bg-violet-400/10 px-3 py-1 text-xs font-semibold
                   text-violet-300"
          >
            BeatFlow · v0.2.0
          </span>

          <h1
            class="mt-5 text-4xl font-black tracking-tight
                   sm:text-5xl md:text-6xl"
          >
            Música para
            <span class="text-gradient-brand">
              cada momento
            </span>
          </h1>

          <p
            class="mt-4 max-w-xl text-sm leading-7 text-zinc-300
                   sm:text-base"
          >
            Descubre música, explora tendencias y construye
            tu experiencia musical.
          </p>

          <button
            id="explore-button"
            type="button"
            class="mt-6 rounded-full bg-white px-6 py-3
                   text-sm font-bold text-black"
          >
            Explorar ahora
          </button>
        </div>
      </div>
    </section>

    <section class="mt-9">
      <div class="mb-4 flex items-end justify-between gap-4">
        <div>
          <p
            class="text-xs font-semibold uppercase
                   tracking-[0.2em] text-violet-400"
          >
            Descubre
          </p>

          <h2 class="mt-1 text-2xl font-bold">
            Tendencias esta semana
          </h2>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-3
               sm:grid-cols-3 xl:grid-cols-6"
      >
        ${trendingTracks.map(createTrackCard).join('')}
      </div>
    </section>

    <section class="mt-10">
      <div class="mb-4">
        <p
          class="text-xs font-semibold uppercase
                 tracking-[0.2em] text-cyan-400"
        >
          Regresa
        </p>

        <h2 class="mt-1 text-2xl font-bold">
          Escuchados recientemente
        </h2>
      </div>

      <div
        class="divide-y divide-white/5 rounded-3xl
               border border-white/10 bg-zinc-900/40 p-2"
      >
        ${
          recentlyPlayedTracks
            .map(createRecentlyPlayedRow)
            .join('')
        }
      </div>
    </section>
  `
}