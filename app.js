/* =====================================================================
   Messaggio Segreto — app.js  (Wordle-style edition)
   Funzionalità: dark/light toggle · Web Audio · flip animation ·
   welcome dialog · frecce-nav · streak fire · countdown live
   ===================================================================== */

/* ── CONSTANTS ── */
const MAX_ATTEMPTS  = 6;
const MAX_HINTS     = 3;
const STORAGE_PREFIX = "messaggio-segreto:v4";
const ALPHABET      = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

/* Messages shown after winning, indexed by attempts used (1–6) */
const WIN_MESSAGES = [
  "",                       // 0 – unused
  "Sei un genio! 🧠",
  "Eccezionale! ⚡",
  "Ottimo lavoro! 🎯",
  "Bene! 👏",
  "Per poco! 😅",
  "Ce l'hai fatta! 😤"
];

const SYMBOLS = [
  "lock","key","mail","fingerprint","shield","bolt","visibility","explore",
  "star","favorite","extension","flag","rocket_launch","public","language",
  "psychology","lightbulb","radio_button_checked","token","hub","diamond",
  "change_history","hexagon","deployed_code","encrypted","vpn_key","drafts",
  "send","verified","target","radar","database","terminal","memory",
  "gesture","auto_awesome"
];

const PUZZLES = [
  // ── Proverbi ──
  { category: "Proverbio", phrase: "A CAVAL DONATO NON SI GUARDA IN BOCCA" },
  { category: "Proverbio", phrase: "NON SI PUO AVERE LA BOTTE PIENA E LA MOGLIE UBRIACA" },
  { category: "Proverbio", phrase: "IL LUPO PERDE IL PELO MA NON IL VIZIO" },
  { category: "Proverbio", phrase: "NON TUTTO IL MALE VIEN PER NUOCERE" },
  { category: "Proverbio", phrase: "CHI DORME NON PIGLIA PESCI MA CHI VEGLIA LI MANGIA" },
  { category: "Proverbio", phrase: "TROPPI CUOCHI GUASTANO LA MINESTRA E IL BRODO" },
  { category: "Proverbio", phrase: "CHI LA FA L ASPETTI E CHI LA RICEVE LA RITORNI" },
  { category: "Proverbio", phrase: "MEGLIO UN UOVO OGGI CHE UNA GALLINA DOMANI" },
  { category: "Proverbio", phrase: "L ERBA DEL VICINO E SEMPRE PIU VERDE" },
  { category: "Proverbio", phrase: "CHI VA PIANO VA SANO E VA LONTANO" },
  { category: "Proverbio", phrase: "L UNIONE FA LA FORZA E LA DIVISIONE LA FA CADERE" },
  { category: "Proverbio", phrase: "IL MATTINO HA L ORO IN BOCCA PER CHI SI SVEGLIA" },
  { category: "Proverbio", phrase: "CHI SEMINA VENTO RACCOGLIE TEMPESTA" },
  // ── Cinema ──
  { category: "Cinema", phrase: "IL BUONO IL BRUTTO E IL CATTIVO DI SERGIO LEONE" },
  { category: "Cinema", phrase: "NUOVO CINEMA PARADISO DI GIUSEPPE TORNATORE" },
  { category: "Cinema", phrase: "SPERIAMO CHE SIA FEMMINA DI MARIO MONICELLI" },
  { category: "Cinema", phrase: "NON CI RESTA CHE PIANGERE CON MASSIMO TROISI" },
  { category: "Cinema", phrase: "MANGIA PREGA AMA CON GIULIA ROBERTS" },
  { category: "Cinema", phrase: "IL GRANDE LEBOWSKI NON SI PREOCCUPA DI NULLA" },
  { category: "Cinema", phrase: "CHE LA FORZA SIA CON TE IN OGNI MOMENTO" },
  { category: "Cinema", phrase: "LA VITA E COME UNA SCATOLA DI CIOCCOLATINI" },
  { category: "Cinema", phrase: "MIIII NON CI POSSO CREDERE DI ALDO GIOVANNI E GIACOMO" },
  { category: "Cinema", phrase: "RICOMINCIO DA TRE CON MASSIMO TROISI" },
  { category: "Cinema", phrase: "PERFETTI SCONOSCIUTI NASCONDONO SEGRETI NEI TELEFONINI" },
  // ── Musica ──
  { category: "Musica", phrase: "NEL BLU DIPINTO DI BLU FELICE DI STARE LASSU" },
  { category: "Musica", phrase: "AZZURRO IL POMERIGGIO E TROPPO AZZURRO E LUNGO" },
  { category: "Musica", phrase: "UNA CANZONE D AMORE PER NON PENSARE A TE" },
  { category: "Musica", phrase: "FIGLI DELLE STELLE NELLA NOTTE PIU BUIA" },
  { category: "Musica", phrase: "E DI NUOVO CAMBIA IL TEMPO E PURE LA STAGIONE" },
  { category: "Musica", phrase: "A COMPRENSIONE DI OGNI COSA SERVE PIU TEMPO" },
  { category: "Musica", phrase: "MA IL CIELO E SEMPRE PIU BLU SOPRA LE NUVOLE" },
  { category: "Musica", phrase: "CI VUOLE UN FIORE PER FARE UN TAVOLO IN LEGNO" },
  { category: "Musica", phrase: "SIAMO SOLO NOI QUELLI CHE NON HANNO VOGLIA" },
  { category: "Musica", phrase: "DIRE FARE BACIARE LETTERA O TESTAMENTO" },
  { category: "Musica", phrase: "QUESTO PICCOLO GRANDE AMORE DA SOGNO" },
  // ── Modi di dire ──
  { category: "Modo di dire", phrase: "TRA IL DIRE E IL FARE C E DI MEZZO IL MARE" },
  { category: "Modo di dire", phrase: "PRENDERE DUE PICCIONI CON UNA SOLA FAVA" },
  { category: "Modo di dire", phrase: "AVERE IL PROSCIUTTO SUGLI OCCHI PER NON VEDERE" },
  { category: "Modo di dire", phrase: "FARE ORECCHIE DA MERCANTE CON CHI PARLA TROPPO" },
  { category: "Modo di dire", phrase: "NON AVERE PELI SULLA LINGUA E DIRE LA VERITA" },
  { category: "Modo di dire", phrase: "ESSERE COME IL DIAVOLO E L ACQUA SANTA" },
  { category: "Modo di dire", phrase: "METTERE I BASTONI TRA LE RUOTE A TUTTI" },
  { category: "Modo di dire", phrase: "PIANGERE SUL LATTE VERSATO NON SERVE A NULLA" },
  { category: "Modo di dire", phrase: "SALVATO IN EXTREMIS DALLA CAMPANA DI VETRO" },
  { category: "Modo di dire", phrase: "LONTANO DAGLI OCCHI LONTANO DAL CUORE" },
  { category: "Modo di dire", phrase: "METTERE IL CARRO DAVANTI AI BUOI DEL CAMPO" },
  // ── Sport ──
  { category: "Sport", phrase: "SQUADRA CHE VINCE NON SI CAMBIA MAI" },
  { category: "Sport", phrase: "FINO AL FISCHIO FINALE DELL ARBITRO SI GIOCA" },
  { category: "Sport", phrase: "IL TALENTO SENZA ALLENAMENTO NON PORTA DA NESSUNA PARTE" },
  { category: "Sport", phrase: "LO SPORT E UNA SCUOLA DI VITA E DI RISPETTO" },
  { category: "Sport", phrase: "IL CALCIO E LA POESIA DEI POVERI DEL MONDO" },
  { category: "Sport", phrase: "CORRERE VERSO IL TRAGUARDO CON TUTTE LE FORZE" },
  { category: "Sport", phrase: "OGNI ALLENAMENTO E UN PASSO VERSO LA VITTORIA" },
  { category: "Sport", phrase: "IL VERO CAMPIONE RIALZA LA TESTA DOPO LA CADUTA" },
  // ── Cibo e cucina ──
  { category: "Cibo", phrase: "LA PIZZA METTE TUTTI D ACCORDO A TAVOLA" },
  { category: "Cibo", phrase: "UN BUON PROFUMO PORTA TUTTI IN CUCINA DI SERA" },
  { category: "Cibo", phrase: "NON SI PUO FARE UNA FRITTATA SENZA ROMPERE LE UOVA" },
  { category: "Cibo", phrase: "LA PASTA DEVE CUOCERE AL DENTE CON IL SALE" },
  { category: "Cibo", phrase: "MANGIA BENE RIDI SPESSO E AMA TANTO LA VITA" },
  { category: "Cibo", phrase: "IL SUGO DEVE CUOCERE PIANO PIANO NEL TEGAME" },
  { category: "Cibo", phrase: "LA COLAZIONE E IL PASTO PIU IMPORTANTE DEL GIORNO" },
  { category: "Cibo", phrase: "IL VINO BUONO STA NELLA BOTTE PICCOLA DEL NONNO" },
  // ── Natura e viaggi ──
  { category: "Natura", phrase: "DOPO LA TEMPESTA TORNA SEMPRE IL SERENO" },
  { category: "Natura", phrase: "ANCHE IL MARE COMINCIA DA UNA SINGOLA GOCCIA" },
  { category: "Natura", phrase: "IL MARE DI NOTTE HA UN ALTRO SUONO E PROFUMO" },
  { category: "Viaggio", phrase: "OGNI VIAGGIO INIZIA CON UN SINGOLO PASSO" },
  { category: "Viaggio", phrase: "LA STRADA MIGLIORE NON E SEMPRE QUELLA PIU VELOCE" },
  { category: "Viaggio", phrase: "ROMA NON FU COSTRUITA IN UN SOLO GIORNO DI LAVORO" },
  { category: "Natura", phrase: "IL SILENZIO DEI BOSCHI IN ALTA MONTAGNA" },
  { category: "Natura", phrase: "IL SOLE TRAMONTA DIETRO LE COLLINE DORATE" },
  // ── Vita e pensieri ──
  { category: "Vita", phrase: "IL TEMPO E UN GRANDE MAESTRO DI VITA" },
  { category: "Vita", phrase: "SBAGLIANDO SI IMPARA DAVVERO A VIVERE" },
  { category: "Vita", phrase: "LE PICCOLE COSE FANNO LA DIFFERENZA NEL TEMPO" },
  { category: "Vita", phrase: "LA SEMPLICITA E LA FORMA SUPREMA DELLA RAFFINATEZZA" },
  { category: "Vita", phrase: "IL FUTURO APPARTIENE A CHI CREDE NEI PROPRI SOGNI" },
  { category: "Vita", phrase: "NON RIMANDARE A DOMANI QUELLO CHE PUOI FARE OGGI" },
  { category: "Vita", phrase: "LE PAROLE TROVANO SEMPRE LA STRADA GIUSTA" },
  { category: "Vita", phrase: "IL CORAGGIO DI RICOMINCIARE DA ZERO OGNI GIORNO" },
  { category: "Vita", phrase: "LA PAZIENZA E LA VIRTU DEI FORTI E DEI SAGGI" },
  // ── Citazioni ──
  { category: "Citazione", phrase: "LA FANTASIA E PIU IMPORTANTE DELLA CONOSCENZA SCIENTIFICA" },
  { category: "Citazione", phrase: "IL DUBBIO E L INIZIO DELLA SAGGEZZA UMANA" },
  { category: "Citazione", phrase: "ESSERE O NON ESSERE QUESTO E IL DILEMMA" },
  { category: "Citazione", phrase: "PENSO DUNQUE SONO DICEVA IL FILOSOFO CARTESIO" },
  { category: "Citazione", phrase: "L UNICA COSA CHE SO E DI NON SAPERE NULLA" },
  { category: "Citazione", phrase: "AMORE CHE A NULLA AMATO AMAR PERDONA" },
  { category: "Citazione", phrase: "NEL MEZZO DEL CAMMIN DI NOSTRA VITA MI RITROVAI" },
  { category: "Citazione", phrase: "FATTI NON FOSTE A VIVER COME BRUTI MA PER SEGUIR VIRTUTE" },
];

/* ── DOM REFS ── */
const els = {
  dateLabel:          document.querySelector("#dateLabel"),
  puzzleNumberLabel:  document.querySelector("#puzzleNumberLabel"),
  categoryLabel:      document.querySelector("#categoryLabel"),
  nextPuzzleLabel:    document.querySelector("#nextPuzzleLabel"),
  attemptTrack:       document.querySelector("#attemptTrack"),
  statusBar:          document.querySelector("#statusBar"),
  phraseBoard:        document.querySelector("#phraseBoard"),
  selectedLabel:      document.querySelector("#selectedLabel"),
  keyboard:           document.querySelector("#keyboard"),
  hintButton:         document.querySelector("#hintButton"),
  checkButton:        document.querySelector("#checkButton"),
  clearButton:        document.querySelector("#clearButton"),
  shareButton:        document.querySelector("#shareButton"),
  helpButton:         document.querySelector("#helpButton"),
  statsButton:        document.querySelector("#statsButton"),
  themeButton:        document.querySelector("#themeButton"),
  muteButton:         document.querySelector("#muteButton"),
  hintBadge:          document.querySelector("#hintBadge"),
  progressLabel:      document.querySelector("#progressLabel"),
  resultShareButton:  document.querySelector("#resultShareButton"),
  welcomeDialog:      document.querySelector("#welcomeDialog"),
  helpDialog:         document.querySelector("#helpDialog"),
  statsDialog:        document.querySelector("#statsDialog"),
  resultDialog:       document.querySelector("#resultDialog"),
  resultTitle:        document.querySelector("#resultTitle"),
  resultMessage:      document.querySelector("#resultMessage"),
  resultSubtitle:     document.querySelector("#resultSubtitle"),
  resultSolution:     document.querySelector("#resultSolution"),
  resultProgress:     document.querySelector("#resultProgress"),
  resultEmoji:        document.querySelector("#resultEmoji"),
  resultCountdown:    document.querySelector("#resultCountdown"),
  playedStat:         document.querySelector("#playedStat"),
  winsStat:           document.querySelector("#winsStat"),
  winRateStat:        document.querySelector("#winRateStat"),
  currentStreakStat:  document.querySelector("#currentStreakStat"),
  maxStreakStat:      document.querySelector("#maxStreakStat"),
  todayStat:          document.querySelector("#todayStat"),
  streakStatLabel:    document.querySelector("#streakStatLabel"),
  distributionGrid:   document.querySelector("#distributionGrid"),
  toastContainer:     document.querySelector("#toastContainer"),
  confettiCanvas:     document.querySelector("#confettiCanvas"),
  themeColorMeta:     document.querySelector("#themeColorMeta")
};

/* ══════════════════════════════════════════
   THEME MANAGER
══════════════════════════════════════════ */
const ThemeManager = (() => {
  const STORAGE_KEY = `${STORAGE_PREFIX}:theme`;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function _getSaved() {
    return readJson(STORAGE_KEY);
  }

  function _apply(theme) {
    document.documentElement.dataset.theme = theme;
    // Update meta theme-color
    if (els.themeColorMeta) {
      els.themeColorMeta.content = theme === "dark" ? "#121213" : "#ffffff";
    }
    // Update button icon
    const iconEl = els.themeButton?.querySelector(".material-symbols-rounded");
    if (iconEl) iconEl.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }

  function init() {
    const saved = _getSaved();
    const theme = saved || (prefersDark.matches ? "dark" : "light");
    _apply(theme);
  }

  function toggle() {
    const current = document.documentElement.dataset.theme || "dark";
    const next    = current === "dark" ? "light" : "dark";
    _apply(next);
    writeJson(STORAGE_KEY, next);
    return next;
  }

  function current() {
    return document.documentElement.dataset.theme || "dark";
  }

  return { init, toggle, current };
})();

/* ══════════════════════════════════════════
   AUDIO ENGINE  (Web Audio API, no files)
══════════════════════════════════════════ */
const AudioEngine = (() => {
  const STORAGE_KEY = `${STORAGE_PREFIX}:muted`;
  let ctx = null;
  let muted = readJson(STORAGE_KEY) ?? false;

  function _getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function _tone(freq, duration, type = "sine", vol = 0.28, delay = 0) {
    if (muted) return;
    try {
      const c   = _getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.01);
    } catch { /* ignore */ }
  }

  function isMuted() { return muted; }

  function toggleMute() {
    muted = !muted;
    writeJson(STORAGE_KEY, muted);
    const iconEl = els.muteButton?.querySelector(".material-symbols-rounded");
    if (iconEl) iconEl.textContent = muted ? "volume_off" : "volume_up";
    if (!muted) _tone(880, 0.06, "sine", 0.18); // small feedback click
    return muted;
  }

  function updateMuteIcon() {
    const iconEl = els.muteButton?.querySelector(".material-symbols-rounded");
    if (iconEl) iconEl.textContent = muted ? "volume_off" : "volume_up";
    if (els.muteButton) els.muteButton.setAttribute("aria-label", muted ? "Suono disattivato" : "Suono attivo");
  }

  function playClick()   { _tone(900, 0.05, "square", 0.1); }
  function playError()   { _tone(260, 0.14, "sawtooth", 0.22); _tone(232, 0.18, "sawtooth", 0.20, 0.1); }
  function playLock()    { _tone(523, 0.12, "sine", 0.24); }
  function playHint()    { [523, 659, 784].forEach((f, i) => _tone(f, 0.22, "sine", 0.22, i * 0.09)); }
  function playWin()     { [523, 587, 659, 698, 784, 880].forEach((f, i) => _tone(f, 0.30, "sine", 0.28, i * 0.09)); }
  function playLoss()    { [330, 294, 262, 220].forEach((f, i) => _tone(f, 0.30, "sawtooth", 0.20, i * 0.14)); }

  return { init: updateMuteIcon, isMuted, toggleMute, playClick, playError, playLock, playHint, playWin, playLoss };
})();

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
ThemeManager.init();
AudioEngine.init();

const today      = new Date();
const dateKey    = formatDateKey(today);
const puzzle     = getPuzzleForDate(today);
const cipher     = buildCipher(puzzle.solution, `${dateKey}:${puzzle.phrase}`);
const storageKey = `${STORAGE_PREFIX}:day:${dateKey}`;

// Reset automatico dello stato di gioco giornaliero tramite query parameter (?reset)
if (new URLSearchParams(window.location.search).has("reset")) {
  try {
    localStorage.removeItem(storageKey);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${STORAGE_PREFIX}:day:`)) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {}
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("reset");
  window.location.replace(cleanUrl.pathname + cleanUrl.search);
}

let state        = loadState();
let countdownInterval = null;
let isAnimating  = false;

renderKeyboard();
render();
setInterval(tickDailyClock, 1000);
showWelcomeIfNeeded();

// Auto-open result dialog on load if game completed today
if (state.result) {
  setTimeout(() => {
    renderResultDialog();
    openDialog(els.resultDialog);
    startResultCountdown();
  }, 500);
}

/* ── EVENT LISTENERS ── */
els.hintButton.addEventListener("click",  () => { if (isAnimating) return; AudioEngine.playClick(); useHint(); });
els.checkButton.addEventListener("click", () => { if (isAnimating) return; AudioEngine.playClick(); checkSolution(); });
els.clearButton.addEventListener("click", () => { if (isAnimating) return; AudioEngine.playClick(); clearSelected(); });
els.shareButton.addEventListener("click", () => { if (isAnimating) return; shareResult(); });
els.resultShareButton.addEventListener("click", () => { if (isAnimating) return; shareResult(); });

els.helpButton.addEventListener("click",  () => { if (isAnimating) return; AudioEngine.playClick(); openDialog(els.helpDialog); });
els.statsButton.addEventListener("click", () => { if (isAnimating) return; AudioEngine.playClick(); renderStatsDialog(); openDialog(els.statsDialog); });
els.themeButton.addEventListener("click", () => { if (isAnimating) return; AudioEngine.playClick(); ThemeManager.toggle(); });
els.muteButton.addEventListener("click",  () => { if (isAnimating) return; AudioEngine.toggleMute(); });

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  if (isAnimating) return;
  if (document.querySelector("dialog[open]")) return;

  const key = e.key.toUpperCase();

  if (e.key === "?") { e.preventDefault(); openDialog(els.helpDialog); return; }

  if (ALPHABET.includes(key)) {
    e.preventDefault();
    AudioEngine.playClick();
    setGuess(key);
    return;
  }
  if (e.key === "Backspace" || e.key === "Delete") {
    e.preventDefault();
    clearSelected();
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    AudioEngine.playClick();
    checkSolution();
    return;
  }
  if (e.key === "ArrowRight") { e.preventDefault(); moveSelection(1);  return; }
  if (e.key === "ArrowLeft")  { e.preventDefault(); moveSelection(-1); return; }
});

/* ══════════════════════════════════════════
   PUZZLE LOGIC
══════════════════════════════════════════ */

function getPuzzleForDate(date) {
  const start    = Date.UTC(2026, 0, 1);
  const localDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = Math.floor((localDay - start) / 86400000);
  const index    = positiveModulo(dayIndex, PUZZLES.length);
  const base     = PUZZLES[index];
  return { ...base, id: dayIndex + 1, solution: normalizePhrase(base.phrase) };
}

function buildCipher(solution, seedText) {
  const uniqueLetters   = [...new Set(solution.replace(/[^A-Z]/g, "").split(""))];
  const shuffledSymbols = shuffle([...SYMBOLS], hashText(seedText));
  const symbolByLetter  = {};
  const letterBySymbol  = {};

  uniqueLetters.forEach((letter, i) => {
    const sym = shuffledSymbols[i];
    symbolByLetter[letter] = sym;
    letterBySymbol[sym]    = letter;
  });

  const phraseSymbols = solution
    .split("").filter(c => /[A-Z]/.test(c))
    .map(c => symbolByLetter[c]);

  return {
    symbolByLetter,
    letterBySymbol,
    requiredSymbols: [...new Set(phraseSymbols)],
    orderedSymbols:  phraseSymbols
  };
}

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */

function loadState() {
  const saved = readJson(storageKey);
  if (saved && saved.puzzleId === puzzle.id) {
    const loadedState = {
      guesses:        saved.guesses        || {},
      locked:         saved.locked         || {},
      hinted:         saved.hinted         || {},
      wrong:          saved.wrong          || {},
      attemptsUsed:   Number(saved.attemptsUsed)  || 0,
      hintsUsed:      Number(saved.hintsUsed)      || 0,
      result:         saved.result         || null,
      completedAt:    saved.completedAt    || null,
      selectedSymbol: saved.selectedSymbol || null,
      checks:         Array.isArray(saved.checks) ? saved.checks : [],
      message:        saved.message        || "",
      completedWords: Array.isArray(saved.completedWords) ? saved.completedWords : null
    };

    // Keep active selection valid if game is in progress
    if (!loadedState.result && (!loadedState.selectedSymbol || loadedState.locked[loadedState.selectedSymbol])) {
      loadedState.selectedSymbol = getFirstEditableSymbol(loadedState)
        || cipher.requiredSymbols.find(s => !loadedState.locked[s])
        || null;
    }

    if (loadedState.completedWords === null) {
      loadedState.completedWords = getCompletedWordIndices(loadedState);
    }
    return loadedState;
  }
  return createInitialState();
}

function createInitialState() {
  const guesses = {};
  const locked  = {};
  const hinted  = {};
  getStarterSymbols().forEach(sym => {
    guesses[sym] = cipher.letterBySymbol[sym];
    locked[sym]  = true;
    hinted[sym]  = true;
  });
  const tempState = { guesses, locked, hinted };
  const completedWords = getCompletedWordIndices(tempState);
  return {
    guesses, locked, hinted,
    wrong:          {},
    attemptsUsed:   0,
    hintsUsed:      0,
    result:         null,
    completedAt:    null,
    selectedSymbol: getFirstEditableSymbol({ guesses, locked }) || cipher.requiredSymbols[0],
    checks:         [],
    message:        "Due icone sono già aperte. Completa le altre e premi Controlla!",
    completedWords
  };
}

function getStarterSymbols() {
  const freq = new Map();
  cipher.orderedSymbols.forEach(s => freq.set(s, (freq.get(s) || 0) + 1));
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(2, cipher.requiredSymbols.length))
    .map(([s]) => s);
}

/* ══════════════════════════════════════════
   RENDER
══════════════════════════════════════════ */

function render() {
  const stats        = getStats();
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - state.attemptsUsed);
  const hintsLeft    = Math.max(0, MAX_HINTS - state.hintsUsed);
  const lockedCount  = cipher.requiredSymbols.filter(s => state.locked[s]).length;

  els.dateLabel.textContent         = formatReadableDate(today);
  els.puzzleNumberLabel.textContent = `Messaggio #${puzzle.id}`;
  els.categoryLabel.textContent     = puzzle.category;
  els.shareButton.hidden            = !state.result;

  els.hintButton.disabled  = Boolean(state.result) || hintsLeft <= 0 || lockedCount === cipher.requiredSymbols.length;
  els.checkButton.disabled = Boolean(state.result) || attemptsLeft <= 0;
  els.clearButton.disabled = !canEditSelected();

  // "ready" state: all editable tiles have a guess — nudge user to press Check
  const allFilled = !state.result && cipher.requiredSymbols.every(s => state.guesses[s]);
  els.checkButton.classList.toggle("ready", allFilled);

  // hint badge ×3 / ×2 / ×1 / ×0
  if (els.hintBadge) {
    els.hintBadge.textContent = `×${hintsLeft}`;
    els.hintBadge.classList.toggle("zero", hintsLeft === 0);
  }

  // progress counter
  const total    = cipher.requiredSymbols.length;
  const locked   = cipher.requiredSymbols.filter(s => state.locked[s]).length;
  const filled   = cipher.requiredSymbols.filter(s => state.guesses[s]).length;
  if (els.progressLabel) {
    if (state.result === "win") {
      els.progressLabel.textContent = "Completato! ✅";
      els.progressLabel.classList.add("complete");
    } else if (state.result === "loss") {
      els.progressLabel.textContent = `${locked}/${total} sbloccate`;
      els.progressLabel.classList.toggle("complete", locked === total);
    } else {
      els.progressLabel.textContent = allFilled
        ? `${filled}/${total} — premi Controlla!`
        : `${filled}/${total} compilate`;
      els.progressLabel.classList.toggle("complete", allFilled);
    }
  }

  renderCountdown();
  renderAttemptTrack();
  renderStatus();
  renderBoard();
  updateKeyboard();
  updateSelectedLabel();
  saveState();
}

function renderCountdown() {
  els.nextPuzzleLabel.textContent = `Prossimo: ${formatTimeLeftToMidnight()}`;
}

function tickDailyClock() {
  if (formatDateKey(new Date()) !== dateKey) { window.location.reload(); return; }
  renderCountdown();
  // Also update result dialog countdown if open
  if (els.resultDialog.open) updateResultCountdown();
}

function renderAttemptTrack() {
  els.attemptTrack.replaceChildren();
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const slot  = document.createElement("span");
    slot.className = "attempt-slot";
    const check = state.checks[i];
    if (check) {
      slot.classList.add(check.correct === check.total ? "win" : "fail");
      slot.title = `Tentativo ${i + 1}: ${check.correct}/${check.total}`;
    } else if (!state.result && i === state.attemptsUsed) {
      slot.classList.add("current");
      slot.title = `Tentativo ${i + 1} — in corso`;
    } else {
      slot.title = `Tentativo ${i + 1}`;
    }
    els.attemptTrack.append(slot);
  }
}

function renderStatus() {
  els.statusBar.classList.remove("success", "danger");
  if (state.result === "win") {
    els.statusBar.textContent = "Messaggio sbloccato! 🎉 La partita di oggi è chiusa.";
    els.statusBar.classList.add("success");
    return;
  }
  if (state.result === "loss") {
    els.statusBar.textContent = `Partita chiusa. La soluzione era: ${puzzle.solution}`;
    els.statusBar.classList.add("danger");
    return;
  }
  els.statusBar.textContent = state.message || "Scegli un'icona e poi una lettera.";
}

/* ── BOARD ── */

function renderBoard() {
  els.phraseBoard.replaceChildren();
  const words = puzzle.solution.split(" ");
  words.forEach((word, wi) => {
    const wordEl = document.createElement("span");
    wordEl.className = "word";
    word.split("").forEach(char => {
      if (!/[A-Z]/.test(char)) { wordEl.append(createPunctuation(char)); return; }
      wordEl.append(createTile(cipher.symbolByLetter[char]));
    });
    els.phraseBoard.append(wordEl);
    if (wi < words.length - 1) {
      const spacer = document.createElement("span");
      spacer.setAttribute("aria-hidden", "true");
      spacer.className = "word-space";
      els.phraseBoard.append(spacer);
    }
  });
  // board glow when all tiles filled
  const allFilled = !state.result && cipher.requiredSymbols.every(s => state.guesses[s]);
  els.phraseBoard.classList.toggle("board-ready", allFilled);

  // word-complete glow: fire unlock animation on newly completed words
  els.phraseBoard.querySelectorAll(".word").forEach((wordEl, wi) => {
    const tiles = [...wordEl.querySelectorAll(".tile")];
    if (!tiles.length) return;
    const complete = tiles.every(t => state.locked[t.dataset.symbol]);
    if (complete) {
      wordEl.classList.add("word-complete");
      if (!state.completedWords.includes(wi)) {
        wordEl.classList.add("word-complete-anim");
        wordEl.addEventListener("animationend", () => wordEl.classList.remove("word-complete-anim"), { once: true });
        state.completedWords.push(wi);
      }
    } else {
      wordEl.classList.remove("word-complete", "word-complete-anim");
      const idx = state.completedWords.indexOf(wi);
      if (idx > -1) {
        state.completedWords.splice(idx, 1);
      }
    }
  });
}

function createTile(symbol) {
  const guess  = state.guesses[symbol] || "";
  const label  = getSymbolLabel(symbol);
  const tile   = document.createElement("button");
  tile.type       = "button";
  tile.className  = "tile";
  tile.dataset.symbol = symbol;
  tile.setAttribute("aria-label", `${label}${guess ? `, lettera ${guess}` : ""}`);

  if (symbol === state.selectedSymbol && !state.result) tile.classList.add("selected");
  if (state.locked[symbol]) tile.classList.add("locked");
  if (state.hinted[symbol] && !state.locked[symbol]) tile.classList.add("hinted");
  if (state.wrong[symbol])  tile.classList.add("wrong");

  const symEl  = document.createElement("span");
  symEl.className  = "symbol material-symbols-rounded";
  symEl.setAttribute("aria-hidden", "true");
  symEl.textContent = symbol;

  const guessEl  = document.createElement("span");
  guessEl.className  = guess ? "guess" : "guess empty-guess";
  guessEl.textContent = guess || "·";

  tile.append(symEl, guessEl);
  tile.addEventListener("click", () => {
    if (isAnimating) return;
    AudioEngine.playClick();
    selectSymbol(symbol);
  });
  return tile;
}

function createPunctuation(char) {
  const el = document.createElement("span");
  el.className   = "punctuation";
  el.textContent = char;
  return el;
}

/* ── KEYBOARD ── */

function renderKeyboard() {
  els.keyboard.replaceChildren();
  KEYBOARD_ROWS.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";
    row.split("").forEach(letter => {
      const key = document.createElement("button");
      key.type         = "button";
      key.className    = "key";
      key.textContent  = letter;
      key.dataset.letter = letter;
      key.addEventListener("click", () => {
        if (isAnimating) return;
        AudioEngine.playClick();
        // visual key flash
        key.classList.remove("flash");
        void key.offsetWidth;
        key.classList.add("flash");
        key.addEventListener("animationend", () => key.classList.remove("flash"), { once: true });
        setGuess(letter);
      });
      rowEl.append(key);
    });
    els.keyboard.append(rowEl);
  });
}

function updateKeyboard() {
  const entries  = Object.entries(state.guesses);
  const lockedL  = new Set(entries.filter(([s]) => state.locked[s]).map(([, l]) => l));
  const usedL    = new Set(entries.map(([, l]) => l));

  els.keyboard.querySelectorAll(".key").forEach(key => {
    const letter = key.dataset.letter;
    key.classList.toggle("used",   usedL.has(letter) && !lockedL.has(letter));
    key.classList.toggle("locked", lockedL.has(letter));
    key.disabled = Boolean(state.result) || !state.selectedSymbol || state.locked[state.selectedSymbol];
  });
}

/* ══════════════════════════════════════════
   GAME ACTIONS
══════════════════════════════════════════ */

function selectSymbol(symbol) {
  state.selectedSymbol = symbol;
  if (state.result) {
    state.message = state.result === "win" ? "Puzzle completato! 🎉" : "La soluzione è visibile.";
  } else if (state.locked[symbol]) {
    state.message = `${getSymbolLabel(symbol)} è già bloccata.`;
  } else {
    state.message = `${getSymbolLabel(symbol)} selezionata — scegli una lettera.`;
  }
  render();
  // Pop animation on selected tile
  const tileEl = els.phraseBoard.querySelector(`[data-symbol="${symbol}"]`);
  if (tileEl) popTile(tileEl);
}

function moveSelection(direction) {
  const editable = cipher.requiredSymbols.filter(s => !state.locked[s]);
  if (!editable.length) return;
  const cur = state.selectedSymbol;
  const idx = editable.indexOf(cur);
  const next = editable[(idx + direction + editable.length) % editable.length];
  if (next) selectSymbol(next);
}

function setGuess(letter) {
  if (!state.selectedSymbol) {
    state.selectedSymbol = getFirstEditableSymbol(state)
      || cipher.requiredSymbols.find(s => !state.locked[s])
      || null;
  }

  if (!canEditSelected()) {
    const msg = state.result ? "La partita è chiusa." : "Scegli un'icona non ancora bloccata.";
    showToast(msg, "info");
    state.message = msg;
    render();
    return;
  }

  const lockedConflict = Object.keys(state.locked).find(
    s => s !== state.selectedSymbol && state.guesses[s] === letter
  );
  if (lockedConflict) {
    const msg = `La lettera ${letter} è già confermata su un'altra icona.`;
    showToast(msg, "error");
    AudioEngine.playError();
    state.message = msg;
    render();
    return;
  }

  // Remove letter from other unlocked tiles
  Object.keys(state.guesses).forEach(s => {
    if (!state.locked[s] && s !== state.selectedSymbol && state.guesses[s] === letter) {
      delete state.guesses[s];
      delete state.wrong[s];
    }
  });

  state.guesses[state.selectedSymbol] = letter;
  delete state.wrong[state.selectedSymbol];
  state.message = `${getSymbolLabel(state.selectedSymbol)} → ${letter}`;
  state.selectedSymbol = getNextEditableSymbol(state.selectedSymbol)
    || getFirstEditableSymbol(state)
    || cipher.requiredSymbols.find(s => !state.locked[s])
    || null;
  render();
}

function clearSelected() {
  if (!canEditSelected()) return;
  delete state.guesses[state.selectedSymbol];
  delete state.wrong[state.selectedSymbol];
  state.message = `${getSymbolLabel(state.selectedSymbol)} cancellata.`;
  render();
}

/* ── CHECK with flip animation ── */

function checkSolution() {
  if (state.result || isAnimating) return;

  const missing = cipher.requiredSymbols.filter(s => !state.guesses[s]);
  if (missing.length > 0) {
    state.selectedSymbol = missing[0];
    const noun = missing.length === 1 ? "icona" : "icone";
    const msg  = `Mancano ancora ${missing.length} ${noun}.`;
    showToast(msg, "info");
    AudioEngine.playError();
    state.message = msg;
    render();
    return;
  }

  // Compute results before animation
  const newlyLocked = new Set();
  const wrongSet    = new Set();
  let correctCount  = 0;

  cipher.requiredSymbols.forEach(sym => {
    if (state.guesses[sym] === cipher.letterBySymbol[sym]) {
      newlyLocked.add(sym);
      correctCount++;
    } else {
      wrongSet.add(sym);
    }
  });

  // Enable animation flag and block interactions
  isAnimating = true;
  document.body.classList.add("is-animating");
  els.checkButton.disabled = true;
  els.hintButton.disabled  = true;
  els.clearButton.disabled = true;

  // Run flip animation, then apply state
  const tiles = [...els.phraseBoard.querySelectorAll(".tile")];
  const STAGGER = 80;
  const HALF    = 140;

  const promises = tiles.map((tile, i) => flipTile(tile, () => {
    const sym = tile.dataset.symbol;
    tile.classList.remove("selected", "wrong");
    if (newlyLocked.has(sym)) {
      tile.classList.add("locked");
      if (state.hinted[sym]) tile.classList.add("hinted");
    } else if (wrongSet.has(sym)) {
      tile.classList.add("wrong");
    }
  }, i * STAGGER, HALF));

  Promise.all(promises).then(() => {
    isAnimating = false;
    document.body.classList.remove("is-animating");

    // Update state
    state.attemptsUsed++;
    state.wrong = {};
    wrongSet.forEach(s => { state.wrong[s] = true; });
    newlyLocked.forEach(s => { state.locked[s] = true; });
    state.checks.push({ correct: correctCount, total: cipher.requiredSymbols.length });

    if (wrongSet.size === 0) {
      AudioEngine.playWin();
      finishGame("win");
    } else if (state.attemptsUsed >= MAX_ATTEMPTS) {
      AudioEngine.playLoss();
      revealSolution();
      finishGame("loss");
    } else {
      AudioEngine.playError();
      // Shake wrong tiles
      tiles.forEach(tile => {
        if (wrongSet.has(tile.dataset.symbol)) shakeTile(tile);
      });
      const n    = wrongSet.size;
      const noun = n === 1 ? "errore" : "errori";
      const msg  = `${n} ${noun} — le lettere giuste sono bloccate.`;
      showToast(msg, "error");
      state.selectedSymbol = [...wrongSet][0];
      state.message = msg;
      render();
    }
  });
}

function useHint() {
  if (state.result || state.hintsUsed >= MAX_HINTS) return;

  const selectedUseful = state.selectedSymbol
    && !state.locked[state.selectedSymbol]
    && state.guesses[state.selectedSymbol] !== cipher.letterBySymbol[state.selectedSymbol];

  const candidates = cipher.requiredSymbols.filter(
    s => !state.locked[s] && state.guesses[s] !== cipher.letterBySymbol[s]
  );

  const sym = selectedUseful ? state.selectedSymbol : candidates[0];
  if (!sym) { showToast("Nessun simbolo da sbloccare.", "info"); return; }

  state.guesses[sym] = cipher.letterBySymbol[sym];
  state.locked[sym]  = true;
  state.hinted[sym]  = true;
  delete state.wrong[sym];
  state.hintsUsed++;
  state.selectedSymbol = getFirstEditableSymbol(state)
    || cipher.requiredSymbols.find(s => !state.locked[s])
    || null;

  AudioEngine.playHint();

  const hintsLeft = MAX_HINTS - state.hintsUsed;
  const msg = isSolved()
    ? "Frase completa! Premi Controlla per registrare."
    : `Indizio: ${getSymbolLabel(sym)} = ${cipher.letterBySymbol[sym]}  (rimasti: ${hintsLeft})`;
  showToast(msg, "info");
  state.message = msg;
  render();
}

function finishGame(result) {
  state.result      = result;
  state.completedAt = new Date().toISOString();
  state.selectedSymbol = null;
  state.message = result === "win" ? "Messaggio sbloccato! 🎉" : "Tentativi esauriti.";
  recordResult(result === "win");
  render();
  setTimeout(() => {
    renderResultDialog();
    openDialog(els.resultDialog);
    startResultCountdown();
    if (result === "win") launchConfetti();
  }, 450);
}

function revealSolution() {
  cipher.requiredSymbols.forEach(s => {
    state.guesses[s] = cipher.letterBySymbol[s];
    state.locked[s]  = true;
  });
}

function isSolved() {
  return cipher.requiredSymbols.every(s => state.guesses[s] === cipher.letterBySymbol[s]);
}

function canEditSelected() {
  return Boolean(state.selectedSymbol && !state.result && !state.locked[state.selectedSymbol]);
}

/* ══════════════════════════════════════════
   LABELS
══════════════════════════════════════════ */

function updateSelectedLabel() {
  if (state.result) {
    els.selectedLabel.textContent = state.result === "win" ? "Messaggio sbloccato! 🎉" : "Soluzione mostrata.";
    return;
  }
  if (!state.selectedSymbol) {
    els.selectedLabel.textContent = "Tutto compilato — premi Controlla!";
    return;
  }
  const guess = state.guesses[state.selectedSymbol];
  if (state.locked[state.selectedSymbol]) {
    els.selectedLabel.textContent = `${getSymbolLabel(state.selectedSymbol)} già bloccata: ${guess}`;
    return;
  }
  els.selectedLabel.textContent = guess
    ? `${getSymbolLabel(state.selectedSymbol)} → ${guess}`
    : `${getSymbolLabel(state.selectedSymbol)} selezionata`;
}

function getSymbolLabel(sym) {
  const i = cipher.requiredSymbols.indexOf(sym);
  return i >= 0 ? `Icona ${i + 1}` : "Icona";
}

function getFirstEditableSymbol(src) {
  return cipher.requiredSymbols.find(s => !src.locked[s] && !src.guesses[s]);
}

function getNextEditableSymbol(current) {
  const syms = cipher.requiredSymbols;
  const si   = syms.indexOf(current);
  for (let off = 1; off <= syms.length; off++) {
    const s = syms[(si + off) % syms.length];
    if (!state.locked[s] && !state.guesses[s]) return s;
  }
  return syms.find(s => !state.locked[s]) || null;
}

/* ══════════════════════════════════════════
   STORAGE
══════════════════════════════════════════ */

function getCompletedWordIndices(stateToCheck) {
  const words = puzzle.solution.split(" ");
  const completed = [];
  words.forEach((word, wi) => {
    const chars = word.split("").filter(c => /[A-Z]/.test(c));
    if (chars.length > 0) {
      const allLocked = chars.every(char => {
        const sym = cipher.symbolByLetter[char];
        return stateToCheck.locked[sym];
      });
      if (allLocked) completed.push(wi);
    }
  });
  return completed;
}

function saveState() {
  writeJson(storageKey, {
    puzzleId:       puzzle.id,
    guesses:        state.guesses,
    locked:         state.locked,
    hinted:         state.hinted,
    wrong:          state.wrong,
    attemptsUsed:   state.attemptsUsed,
    hintsUsed:      state.hintsUsed,
    result:         state.result,
    completedAt:    state.completedAt,
    selectedSymbol: state.selectedSymbol,
    checks:         state.checks,
    message:        state.message,
    completedWords: state.completedWords
  });
}

function getStats() {
  return {
    played: 0, wins: 0, currentStreak: 0, maxStreak: 0,
    lastCompletedDate: null, lastWinDate: null, distribution: {},
    ...readJson(`${STORAGE_PREFIX}:stats`)
  };
}

function recordResult(didWin) {
  const statsKey = `${STORAGE_PREFIX}:stats`;
  const stats    = getStats();
  if (stats.lastCompletedDate === dateKey) return;
  stats.played++;
  stats.lastCompletedDate = dateKey;
  if (didWin) {
    const prev = previousDateKey(dateKey);
    stats.wins++;
    stats.currentStreak = stats.lastWinDate === prev ? stats.currentStreak + 1 : 1;
    stats.maxStreak     = Math.max(stats.maxStreak, stats.currentStreak);
    stats.lastWinDate   = dateKey;
    const n = Math.max(1, Math.min(MAX_ATTEMPTS, state.attemptsUsed));
    stats.distribution[n] = (stats.distribution[n] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }
  writeJson(statsKey, stats);
}

/* ══════════════════════════════════════════
   DIALOGS
══════════════════════════════════════════ */

function showWelcomeIfNeeded() {
  const key = `${STORAGE_PREFIX}:welcomed`;
  if (!readJson(key)) {
    setTimeout(() => openDialog(els.welcomeDialog), 300);
    writeJson(key, true);
  }
}

function renderStatsDialog() {
  const stats   = getStats();
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  els.playedStat.textContent        = stats.played;
  els.winsStat.textContent          = stats.wins;
  els.winRateStat.textContent       = `${winRate}%`;
  els.currentStreakStat.textContent  = stats.currentStreak;
  els.maxStreakStat.textContent      = stats.maxStreak;

  // Streak fire
  if (els.streakStatLabel) {
    els.streakStatLabel.textContent = stats.currentStreak >= 3 ? "Serie 🔥" : "Serie";
  }

  els.todayStat.textContent = state.result === "win" ? "✅" : state.result === "loss" ? "❌" : "⏳";

  renderDistribution(stats.distribution);
}

function renderDistribution(distribution) {
  els.distributionGrid.replaceChildren();
  const maxVal = Math.max(1, ...Object.values(distribution).map(Number));
  const currentAttempt = state.result === "win" ? state.attemptsUsed : null;

  for (let n = 1; n <= MAX_ATTEMPTS; n++) {
    const val = Number(distribution[n]) || 0;
    const row = document.createElement("div");
    row.className = "distribution-row";
    if (n === currentAttempt) row.classList.add("current-row");

    const label = document.createElement("span");
    label.textContent = n;

    const bar  = document.createElement("span");
    bar.className = "distribution-bar";

    const fill = document.createElement("span");
    fill.className  = "distribution-fill";
    fill.style.width = "0%";
    bar.append(fill);

    const count = document.createElement("span");
    count.textContent = val;

    row.append(label, bar, count);
    els.distributionGrid.append(row);

    // animate fill
    requestAnimationFrame(() => {
      fill.style.width = `${Math.max(10, (val / maxVal) * 100)}%`;
    });
  }
}

function renderResultDialog() {
  const won = state.result === "win";
  els.resultEmoji.textContent   = won ? "🎉" : "😔";
  els.resultTitle.textContent   = won ? "Messaggio sbloccato!" : "Messaggio chiuso";

  // Personalized win message
  if (won) {
    const n = Math.min(6, Math.max(1, state.attemptsUsed));
    els.resultMessage.textContent = WIN_MESSAGES[n];
  } else {
    els.resultMessage.textContent = "Riprova domani con un nuovo messaggio.";
  }

  els.resultSubtitle.textContent = won
    ? `Risolto in ${state.attemptsUsed}/${MAX_ATTEMPTS} tentativ${state.attemptsUsed === 1 ? "o" : "i"} con ${state.hintsUsed} indiz${state.hintsUsed === 1 ? "io" : "i"}.`
    : `Tentativi esauriti. La soluzione era:`;

  els.resultSolution.textContent = puzzle.solution;
  els.resultProgress.textContent = buildShareText({ includeUrl: false });
  updateResultCountdown();
}

function startResultCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateResultCountdown, 1000);
}

function updateResultCountdown() {
  if (els.resultCountdown) {
    els.resultCountdown.textContent = formatTimeLeftToMidnight();
  }
}

async function shareResult() {
  const text = buildShareText({ includeUrl: true });
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copiato negli appunti! 📋", "success");
    state.message = "Risultato copiato.";
  } catch {
    showToast("Pronto da condividere.", "info");
    state.message = "Risultato pronto.";
  }
  render();
  if (state.result) renderResultDialog();
}

function buildShareText({ includeUrl } = {}) {
  const score     = state.result === "win" ? `${state.attemptsUsed}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  const hintLabel = state.hintsUsed ? `, ${state.hintsUsed} indizi` : "";
  const lines = [
    `🔐 Messaggio Segreto #${puzzle.id} — ${score}`,
    `${puzzle.category}${hintLabel}`,
    ...buildShareRows()
  ];
  if (includeUrl) lines.push(window.location.href);
  return lines.join("\n");
}

function buildShareRows() {
  if (!state.checks.length) {
    return [progressBar(
      cipher.requiredSymbols.filter(s => state.locked[s]).length,
      cipher.requiredSymbols.length
    )];
  }
  return state.checks.map(c => progressBar(c.correct, c.total));
}

function progressBar(correct, total) {
  const slots  = 8;
  const filled = Math.round((correct / total) * slots);
  return `${"🟩".repeat(filled)}${"⬜".repeat(slots - filled)}`;
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */

function showToast(message, type = "default", ms = 2800) {
  const toast = document.createElement("div");
  toast.className = `toast${type !== "default" ? ` toast-${type}` : ""}`;
  toast.setAttribute("role", "alert");

  const icons = { success: "check_circle", error: "error", info: "info" };
  if (icons[type]) {
    const icon = document.createElement("span");
    icon.className   = "material-symbols-rounded";
    icon.textContent = icons[type];
    icon.setAttribute("aria-hidden", "true");
    toast.append(icon);
  }

  const txt = document.createElement("span");
  txt.textContent = message;
  toast.append(txt);
  els.toastContainer.append(toast);

  setTimeout(() => {
    toast.classList.add("toast-out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, ms);
}

/* ══════════════════════════════════════════
   TILE ANIMATIONS
══════════════════════════════════════════ */

/**
 * Flip tile: scaleY 1→0, run callback at midpoint, then 0→1.
 * @param {HTMLElement} tile
 * @param {Function}    callback  Applied at the midpoint of the flip
 * @param {number}      delay     Start delay (ms)
 * @param {number}      half      Duration of each half (ms)
 */
function flipTile(tile, callback, delay = 0, half = 140) {
  return new Promise(resolve => {
    setTimeout(() => {
      tile.classList.add("flip-down");
      tile.addEventListener("animationend", () => {
        tile.classList.remove("flip-down");
        callback(tile);
        tile.classList.add("flip-up");
        tile.addEventListener("animationend", () => {
          tile.classList.remove("flip-up");
          resolve();
        }, { once: true });
      }, { once: true });
    }, delay);
  });
}

function popTile(tile) {
  tile.classList.remove("pop");
  void tile.offsetWidth; // reflow to restart animation
  tile.classList.add("pop");
  tile.addEventListener("animationend", () => tile.classList.remove("pop"), { once: true });
}

function shakeTile(tile) {
  tile.classList.remove("shaking");
  void tile.offsetWidth;
  tile.classList.add("shaking");
  tile.addEventListener("animationend", () => tile.classList.remove("shaking"), { once: true });
}

/* ══════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════ */

function launchConfetti() {
  const canvas = els.confettiCanvas;
  if (!canvas) return;
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ["#6366f1","#818cf8","#22c55e","#f59e0b","#ef4444","#a78bfa","#34d399","#fb923c"];
  const P = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5,
    r: Math.random() * 6 + 4,
    d: Math.random() * 6 + 2,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    t: Math.random() * 10 - 5,
    ta: 0,
    ts: Math.random() * 0.08 + 0.04
  }));

  let frame = 0;
  const MAX = 240;
  let raf;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    P.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth  = p.r;
      ctx.strokeStyle = p.c;
      ctx.moveTo(p.x + p.t + p.r / 3, p.y);
      ctx.lineTo(p.x + p.t, p.y + p.t + p.r / 3);
      ctx.stroke();
      p.ta += p.ts;
      p.y  += Math.cos(frame * 0.022) + p.d * 0.65;
      p.x  += Math.sin(frame * 0.022) * 0.8;
      p.t   = Math.sin(p.ta) * 14;
    });
    frame++;
    if (frame < MAX) { raf = requestAnimationFrame(draw); }
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  draw();
}

/* ══════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════ */

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function previousDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
}

function formatReadableDate(date) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long", day: "2-digit", month: "long"
  }).format(date);
}

function formatTimeLeftToMidnight() {
  const now  = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const ms   = Math.max(0, next - now);
  const hh   = Math.floor(ms / 3600000);
  const mm   = Math.floor((ms % 3600000) / 60000);
  const ss   = Math.floor((ms % 60000) / 1000);
  return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

function normalizePhrase(phrase) {
  return phrase.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ").trim().toUpperCase();
}

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function shuffle(items, seed) {
  let v = seed || 1;
  for (let i = items.length - 1; i > 0; i--) {
    v ^= v >>> 15; v = Math.imul(v, 1 | v);
    v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
    const j = Math.floor(((v ^ (v >>> 14)) >>> 0) / 4294967296 * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function positiveModulo(value, mod) { return ((value % mod) + mod) % mod; }

function readJson(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing */ }
}
