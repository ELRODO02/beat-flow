# Juan Rodolfo Mosqueda Lozano 
# 13/09/2026
# Evidencia Sesión 1

Durante esta sesión se creó y organizó la estructura inicial del proyecto BeatFlow, separando los archivos por su función. Se agregaron las carpetas css para los estilos, js/data para los datos de prueba y js/ui para los componentes de la interfaz, además del archivo principal app.js. También se incluyeron los archivos index.html, .gitignore y README.md.

Se avanzó en el desarrollo de index.html, creando la interfaz principal de la aplicación de música. Se implementó una barra lateral de navegación con las opciones Inicio, Buscar y Biblioteca, accesos a Favoritos y Escuchados recientes, así como un reproductor inferior con portada, nombre de la canción, artista, controles de reproducción, barra de progreso y volumen. También se agregó una navegación inferior para dispositivos móviles y se utilizó Tailwind CSS junto con los archivos de estilos propios para comenzar a desarrollar un diseño adaptable a diferentes tamaños de pantalla.

Codigo realizado de index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beatflow-</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="stylesheet" href="./css/theme.css">
</head>
<body class="bg-zinc-950 text-white antialiased">
    <div class="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
        <aside class="border-r border-white/10 bg-zinc-950 lg:fixed lg:inset-y-0 lg:w-[250px] lg:flex-col">
            <div class="flex h-full flex-col px-5 py-6">
                <a href="#" class="mb-8 flex items-center gap-3" aria-label="Beatflow">
                    <div class="brand-logo">B</div>
                    <div>
                        <p class="text-xl font-bold">
                            Beat <span class="text-violet-400">Flow</span>
                        </p>
                        <p class="text-xs text-zinc-500">
                            La musica te da el flow
                        </p>
                    </div>
                </a>
        <nav class="space-y-2" aria-label="Navegcacion principal">
            <button class="nav-item nav-active" type="button" data-view="home">
                <span class="text-xl">🏠</span>
                <span class="text-[11px]">Inicio</span>
            </button>
            <button class="nav-item" type="button" data-view="search">
                <span class="text-xl">🔍</span>
                <span class="text-[11px]">Buscar</span>
            </button>
            <button class="nav-item" type="button" data-view="library">
                <span class="text-xl">📚</span>
                <span class="text-[11px]">Biblioteca</span>
            </button>
        </nav>
        <div class="mt-8">
            <p class="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.2rem] text-zinc-680">TU musica</p>
            <div class="space-y-2">
                <button class="secondary-nav-item" type="button">
                    <span>❤️</span>
                    <span>Favoritos</span>
                </button>
                <button class="secondary-nav-item" type="button">
                    <span>⏱️</span>
                    <span>Escuchados recientes</span>
                </button>
            </div>
        </div>
            </div>
        </aside>
        <div class="lg:col-start-2">

        </div>
        <footer class="fixed inset-x-0 bottom-[68px] z-40 border-t border-white/10 bg-zinc-950/10 backdrop-blur lg:bottom-0 lg:left-[250px]" >

    <div class="grid min-h-[82px] grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 md:grid-cols-[1fr_1fr_1fr] md:px-6">

      <div class="flex min-w-0 items-center gap-3">
        <img
          id="player-cover" src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=160&q=80" alt="Portada actual" class="h-14 w-14 rounded-xl object-cover">

        <div class="min-w-0">
          <p id="player-title" class="truncate text-sm font-semibold">
            Neon Pulse
          </p>

          <p id="player-artist" class="truncate text-xs text-zinc-500">
            Nova Waves
          </p>
        </div>

        <button type="button" class="hidden text-xl text-zinc-500 sm:block" aria-label="Agregar a favoritos">
          ♡
        </button>
      </div>

      <div class="flex items-center justify-center gap-3 md:flex-col md:gap-2">
        <div class="flex items-center gap-3">
          <button type="button" aria-label="Anterior">◀</button>

          <button id="play-button" type="button" class="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:scale-105" aria-label="Reproducir">
            ▶
          </button>

          <button type="button" aria-label="Siguiente">▶</button>
        </div>

        <div class="hidden w-full max-w-md items-center gap-3 text-xs text-zinc-500 md:flex">
          <span>1:24</span>

          <div class="progress-track">
            <div class="progress-value w-[42%]"></div>
          </div>

          <span>3:56</span>
        </div>
      </div>

      <div class="hidden items-center justify-end gap-3 md:flex">
        <span>🔊</span>

        <div class="progress-track w-28">
          <div class="progress-value w-[65%]"></div>
        </div>
      </div>

    </div>
        </footer>
        <nav class="fixed inset-x-0 bottom-0 z-50 grid h-[68px] grid-cols-3 border-t border-white/10 bg-zinc-950 lg:hidden" aria-label="Navegcacion movil">
            <button class="mobile-nav-item mobile-nav-active" type="button" data-view="home">
                <span class="text-xl">🏠</span>
                <span class="text-[11px]">Inicio</span>
            </button>
            <button class="mobile-nav-item" type="button" data-view="search">
                <span class="text-xl">🔍</span>
                <span class="text-[11px]">Buscar</span>
            </button>
            <button class="mobile-nav-item" type="button" data-view="library">
                <span class="text-xl">📚</span>
                <span class="text-[11px]">Biblioteca</span>
            </button>
        </nav>

        <script type="module" src="./js/app.js"></script>
        
    </div>
</body>
</html>

```
Variables que queremos que ignore git
```gitignore
# macOS
.DS_Store

# Windows
Thumbs.db
Desktop.ini

# VS Code
.vscode/

# Logs
*.log

# Environment variables
.env
.env.*

# Temporary files
*.tmp
*.temp
```
