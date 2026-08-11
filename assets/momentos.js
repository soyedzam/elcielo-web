/* EL CIELO EN MI CIUDAD · momentos — grid de los 22 videos de la comunidad
   + reproductor en modal (teatro). Patrón portado 1:1 de La Nave
   (lanave.comunidadmasalto.org/galeria-videos.html): mismo dato,
   mismo comportamiento — YouTube-nocookie solo se embebe al abrir uno. */

const grid = document.getElementById("js-mom-grid");
const theater = document.getElementById("js-mom-theater");
const frame = document.getElementById("js-mom-frame");
const cap = document.getElementById("js-mom-cap");
const count = document.getElementById("js-mom-count");
let videos = [];
let idx = 0;

const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

function tarjeta(v, i) {
  const li = document.createElement("li");
  li.className = "mom-card-wrap" + (v.destacado ? " mom-big" : "");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mom-card";
  btn.setAttribute("aria-label", "Reproducir: " + v.titulo);
  const img = document.createElement("img");
  img.src = thumb(v.id);
  img.alt = "";
  img.loading = i < 3 ? "eager" : "lazy";
  img.decoding = "async";
  const play = document.createElement("span");
  play.className = "mom-play";
  play.setAttribute("aria-hidden", "true");
  play.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#F7F4EE"><path d="M8 5v14l11-7z"/></svg>';
  const copyEl = document.createElement("span");
  copyEl.className = "mom-copy";
  const tEl = document.createElement("span");
  tEl.className = "mom-t";
  tEl.textContent = v.titulo;
  copyEl.appendChild(tEl);
  btn.append(img, play, copyEl);
  btn.addEventListener("click", () => abrir(i));
  li.appendChild(btn);
  return li;
}

function bloquear(si) {
  document.documentElement.classList.toggle("mom-lock", si);
}

function pinta(i) {
  idx = (i + videos.length) % videos.length;
  const v = videos[idx];
  frame.innerHTML = "";
  const f = document.createElement("iframe");
  f.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
  f.title = v.titulo;
  f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
  f.setAttribute("allowfullscreen", "");
  frame.appendChild(f);
  cap.textContent = v.titulo;
  count.textContent = (idx + 1) + " / " + videos.length;
  history.replaceState(null, "", "#" + v.id);
}

function abrir(i) {
  pinta(i);
  theater.classList.add("abierto");
  theater.setAttribute("aria-hidden", "false");
  bloquear(true);
}

function cerrar() {
  theater.classList.remove("abierto");
  theater.setAttribute("aria-hidden", "true");
  frame.innerHTML = "";
  bloquear(false);
  if (location.hash) history.replaceState(null, "", location.pathname);
}

document.getElementById("js-mom-cerrar").addEventListener("click", cerrar);
document.getElementById("js-mom-prev").addEventListener("click", () => pinta(idx - 1));
document.getElementById("js-mom-next").addEventListener("click", () => pinta(idx + 1));
theater.addEventListener("click", (e) => { if (e.target === theater) cerrar(); });
document.addEventListener("keydown", (e) => {
  if (!theater.classList.contains("abierto")) return;
  if (e.key === "Escape") cerrar();
  else if (e.key === "ArrowLeft") pinta(idx - 1);
  else if (e.key === "ArrowRight") pinta(idx + 1);
});

fetch("assets/videos.json")
  .then((r) => r.json())
  .then((data) => {
    videos = Array.isArray(data.videos) ? data.videos : [];
    const frag = document.createDocumentFragment();
    videos.forEach((v, i) => frag.appendChild(tarjeta(v, i)));
    grid.appendChild(frag);
    const h = location.hash.replace("#", "");
    if (h) {
      const j = videos.findIndex((v) => v.id === h);
      if (j >= 0) abrir(j);
    }
  })
  .catch(() => {
    grid.innerHTML = "<li style='color:var(--lx-amber-light)'>No se pudieron cargar los videos.</li>";
  });
