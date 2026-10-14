function createTrackRow(
  track,
  {
    showFavorite = false,
  } = {},
) {
  return `
    <article
      class="grid grid-cols-[auto_1fr_auto]
             items-center gap-4 rounded-2xl
             p-3 transition hover:bg-zinc-900"
    >
      <img
        src="${track.cover}"
        alt="Portada de ${track.title}"
        class="h-14 w-14 rounded-xl object-cover"
        loading="lazy"
      >

      <div class="min-w-0">
        <h3 class="truncate font-semibold">
          ${track.title}
        </h3>

        <p class="mt-1 truncate text-sm text-zinc-500">
          ${track.artist}
        </p>
      </div>

      <div class="flex items-center gap-2">
        ${
          showFavorite
            ? `
              <button
                type="button"
                class="favorite-track grid h-10 w-10
                       place-items-center rounded-full
                       bg-zinc-800"
                data-track-id="${track.id}"
                aria-label="Quitar ${track.title} de favoritos"
              >
                ♥
              </button>
            `
            : ''
        }

        <button
          type="button"
          class="play-track grid h-10 w-10
                 place-items-center rounded-full
                 bg-white text-black"
          data-track-id="${track.id}"
          aria-label="Reproducir ${track.title}"
        >
          ▶
        </button>
      </div>
    </article>
  `
}

export function renderLibrary({
  target,
  favorites,
  history,
}) {
  target.innerHTML = `
    <section>
      <p
        class="text-xs font-semibold uppercase
               tracking-[0.2em] text-violet-400"
      >
        Tu música
      </p>

      <h1 class="mt-2 text-3xl font-bold">
        Biblioteca
      </h1>

      <p class="mt-2 text-zinc-500">
        Tu música guardada en este navegador.
      </p>

      <section class="mt-8">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">Favoritos</h2>
          <span class="text-sm text-zinc-500">
            ${favorites.length}
          </span>
        </div>

        <div
          class="mt-4 divide-y divide-white/5
                 rounded-3xl border border-white/10
                 bg-zinc-900/40 p-2"
        >
          ${
            favorites.length
              ? favorites
                  .map((track) =>
                    createTrackRow(
                      track,
                      { showFavorite: true },
                    ),
                  )
                  .join('')
              : `
                <p class="p-8 text-center text-zinc-500">
                  Todavía no tienes canciones favoritas.
                </p>
              `
          }
        </div>
      </section>

      <section class="mt-10">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">
            Escuchados recientemente
          </h2>

          <span class="text-sm text-zinc-500">
            ${history.length}
          </span>
        </div>

        <div
          class="mt-4 divide-y divide-white/5
                 rounded-3xl border border-white/10
                 bg-zinc-900/40 p-2"
        >
          ${
            history.length
              ? history
                  .map((track) =>
                    createTrackRow(track),
                  )
                  .join('')
              : `
                <p class="p-8 text-center text-zinc-500">
                  Reproduce canciones para construir tu historial.
                </p>
              `
          }
        </div>
      </section>
    </section>
  `
}