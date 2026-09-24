function createSearchRow(track) {
  return `
    <article class="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl p-3 transition hover:bg-zinc-900">
      <img
        src="${track.cover}"
        alt="Portada de ${track.title}"
        class="h-16 w-16 rounded-xl object-cover"
        loading="lazy"
      >

      <div class="min-w-0">
        <h3 class="truncate font-semibold">${track.title}</h3>
        <p class="mt-1 truncate text-sm text-zinc-500">${track.artist} · ${track.genre}</p>
        <p class="mt-1 text-xs text-zinc-600">${track.duration}</p>
      </div>

      <button
        type="button"
        class="play-track grid h-11 w-11 place-items-center rounded-full bg-white text-black"
        data-track-id="${track.id}"
        aria-label="Seleccionar ${track.title}"
      >▶</button>
    </article>
  `
}

export function renderSearch({ target, query, tracks }) {
  target.innerHTML = `
    <section>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Buscar</p>
      <h1 class="mt-2 text-3xl font-bold">Resultados para “${query}”</h1>
      <p class="mt-2 text-sm text-zinc-500">${tracks.length} resultado(s)</p>

      <div class="mt-6 divide-y divide-white/5 rounded-3xl border border-white/10 bg-zinc-900/40 p-2">
        ${tracks.map(createSearchRow).join('')}
      </div>
    </section>
  `
}