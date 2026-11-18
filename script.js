// Pulisce l'indirizzo se resta #contatti nell'anteprima
if (location.hash) {
  history.replaceState(null, "", location.pathname);
}

// Segnala al CSS che il JavaScript funziona (serve per le animazioni)
document.documentElement.classList.add("js");

// ===== 1. "TORNA DOVE ERI" =====
const tornaBtn = document.getElementById("torna");
let posizionePrecedente = null;

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  const target = link.getAttribute("href");
  if (target === "#") return;
  link.addEventListener("click", function (e) {
    const meta = document.querySelector(target);
    if (!meta) return;
    e.preventDefault();
    posizionePrecedente = window.scrollY;
    meta.scrollIntoView({ behavior: "smooth", block: "start" });
    if (tornaBtn) tornaBtn.hidden = false;
  });
});

if (tornaBtn) {
  tornaBtn.addEventListener("click", function () {
    if (posizionePrecedente !== null) {
      window.scrollTo({ top: posizionePrecedente, behavior: "smooth" });
    }
    tornaBtn.hidden = true;
  });
}

// ===== 2. ANIMAZIONI ALLO SCORRIMENTO (si ripetono) =====
const stileAnimazioni = document.createElement("style");
stileAnimazioni.textContent =
  ".anima{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease;}" +
  ".anima.entra{opacity:1;transform:none;}" +
  "@media (prefers-reduced-motion:reduce){.anima{opacity:1;transform:none;transition:none;}}";
document.head.appendChild(stileAnimazioni);

const daAnimare = Array.from(document.querySelectorAll("section > *")).filter(function (el) {
  return !el.closest("dialog");
});

if ("IntersectionObserver" in window) {
  const osservatore = new IntersectionObserver(function (voci) {
    voci.forEach(function (voce) {
      voce.target.classList.toggle("entra", voce.isIntersecting);
    });
  }, { threshold: 0.15 });
  daAnimare.forEach(function (el) {
    el.classList.add("anima");
    osservatore.observe(el);
  });
}

// ===== 3. CALCOLATORE =====
const bottoneCalcola = document.getElementById("calcola");
const campoRisultato = document.getElementById("risultato");

if (bottoneCalcola && campoRisultato) {
  bottoneCalcola.addEventListener("click", function () {
    const richieste = parseFloat(document.getElementById("richieste").value);
    const costo = parseFloat(document.getElementById("costo").value);
    const percentuale = parseFloat(document.getElementById("percentuale").value);

    if (isNaN(richieste) || isNaN(costo) || isNaN(percentuale)) {
      campoRisultato.textContent = "Compila tutti e tre i campi per vedere la stima.";
      return;
    }
    const mese = richieste * costo * (percentuale / 100);
    const formato = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    campoRisultato.textContent =
      "Potresti perdere circa " + formato.format(mese) + " al mese, cioè " + formato.format(mese * 12) + " all'anno.";
  });
}

// ===== 4. ASSISTENTE DI ESEMPIO =====
const chat = document.getElementById("chat");

function aggiungiMessaggio(classe, testo) {
  const p = document.createElement("p");
  p.className = "msg " + classe;
  p.textContent = testo;
  chat.appendChild(p);
}

if (chat) {
  document.querySelectorAll(".domanda").forEach(function (bottone) {
    bottone.addEventListener("click", function () {
      aggiungiMessaggio("msg-utente", bottone.textContent);
      setTimeout(function () {
        aggiungiMessaggio("msg-assistente", bottone.dataset.risposta);
      }, 500);
    });
  });
}

// ===== 5. I MIEI LAVORI: puntini sotto le schermate =====
const schermate = document.getElementById("schermate");
const puntini = document.querySelectorAll("#puntini span");

if (schermate && puntini.length) {
  schermate.addEventListener("scroll", function () {
    const n = Math.round(schermate.scrollLeft / schermate.clientWidth);
    puntini.forEach(function (p, i) { p.classList.toggle("attivo", i === n); });
  });
}

// ===== 6. FINESTRA PRIVACY =====
document.addEventListener("click", function (e) {
  const finestra = document.getElementById("privacy-finestra");
  if (!finestra) return;

  if (e.target.closest("#apri-privacy")) {
    e.preventDefault();
    finestra.showModal();
  } else if (e.target.closest("#chiudi-privacy") || e.target === finestra) {
    finestra.close();
  }
});
