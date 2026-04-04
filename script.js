// ─── SIDEBAR TOGGLE ───
function toggleMenu() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  const btn = document.getElementById('menuBtn');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
  btn.classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('menuBtn').classList.remove('open');
}

// ─── THEME TOGGLE ───
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}

// ─── MUSIC PLAYER MOCK ───
let playing = false;
function togglePlay() {
  playing = !playing;
  const disc = document.getElementById('disc');
  const btn = document.querySelector('.np-ctrl');
  if (disc) disc.classList.toggle('playing', playing);
  if (btn) btn.textContent = playing ? '⏸' : '▶';
}

// ─── CLOCK ───
function updateClock() {
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };
  const t = now.toLocaleTimeString('id-ID', opts);
  const el = document.getElementById('clock');
  const lt = document.getElementById('localtime');
  if (el) el.textContent = 'WIB ' + t;
  if (lt) lt.textContent = 'WIB ' + t;
}
updateClock();
setInterval(updateClock, 1000);

// ─── UPTIME ───
function updateUptime() {
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    const el = document.getElementById('uptime');
    if (el) el.textContent = h + ':' + m + ':' + sec;
  }, 1000);
}
updateUptime();

// ─── PING SIMULATION ───
setInterval(() => {
  const ping = Math.floor(Math.random() * 30) + 10;
  const el = document.getElementById('ping');
  if (el) {
    el.textContent = ping + ' ms';
    el.style.color = ping < 30 ? '#00ff88' : ping < 60 ? '#ffaa00' : '#ff3c6e';
  }
}, 3000);

// ─── ACTIVE NAV ITEM ───
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.getAttribute('data-page') === currentPage ||
        (currentPage === '' && item.getAttribute('data-page') === 'index.html')) {
      item.classList.add('active');
    }
  });

  // ─── ANIMATE PROGRESS BARS ───
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const target = bar.getAttribute('data-width');
      if (target) bar.style.width = target;
    });
  }, 300);

  // ─── LOAD DAILY QUOTE ───
  loadDailyQuote();

  // ─── LOAD MEME ───
  if (document.getElementById('memeImg')) loadMeme();
});

// ─── DAILY QUOTE ───
const fallbackQuotes = [
  { content: "Hidup bukan tentang menemukan dirimu sendiri. Hidup tentang menciptakan dirimu sendiri.", author: "George Bernard Shaw" },
  { content: "Sukses bukan kunci kebahagiaan. Kebahagiaan adalah kunci sukses.", author: "Albert Schweitzer" },
  { content: "Jangan berhenti saat kamu lelah. Berhentilah saat kamu selesai.", author: "Unknown" },
  { content: "Setiap ahli pernah menjadi pemula. Jangan takut untuk memulai.", author: "Helen Hayes" },
  { content: "Hal-hal besar tidak dilakukan oleh impuls, tapi oleh serangkaian hal-hal kecil yang disatukan.", author: "Vincent Van Gogh" },
  { content: "Keberanian bukan berarti tidak ada rasa takut, tapi melakukan sesuatu meskipun takut.", author: "Ambrose Redmoon" },
  { content: "Kamu tidak perlu menjadi luar biasa untuk memulai, tapi kamu harus memulai untuk menjadi luar biasa.", author: "Zig Ziglar" },
];

async function loadDailyQuote() {
  const quoteEl = document.getElementById('quoteText');
  const authorEl = document.getElementById('quoteAuthor');
  if (!quoteEl || !authorEl) return;

  try {
    const res = await fetch('https://api.quotable.io/random?maxLength=120');
    if (!res.ok) throw new Error();
    const data = await res.json();
    quoteEl.innerHTML = `"${data.content}"`;
    authorEl.textContent = `— ${data.author}`;
  } catch (_) {
    const fallback = fallbackQuotes[new Date().getDay() % fallbackQuotes.length];
    quoteEl.innerHTML = `"${fallback.content}"`;
    authorEl.textContent = `— ${fallback.author}`;
  }
}

// ─── DAILY MEME ───
async function loadMeme() {
  const imgEl = document.getElementById('memeImg');
  const titleEl = document.getElementById('memeTitle');
  const srcEl = document.getElementById('memeSource');
  const loadingEl = document.getElementById('memeLoading');

  if (!imgEl) return;

  try {
    const res = await fetch('https://meme-api.com/gimme');
    if (!res.ok) throw new Error();
    const data = await res.json();

    if (loadingEl) loadingEl.style.display = 'none';
    imgEl.src = data.url;
    imgEl.style.display = 'block';
    if (titleEl) titleEl.textContent = data.title;
    if (srcEl) srcEl.textContent = 'r/' + data.subreddit;
  } catch (_) {
    if (loadingEl) loadingEl.textContent = '⚠ Gagal memuat meme. Coba refresh!';
  }
}
