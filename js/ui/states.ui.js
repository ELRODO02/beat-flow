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