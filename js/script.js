/* =====================================================
   WEDDING WEBSITE JAVASCRIPT
   Eleonora & Matteo
===================================================== */


/* =====================================================
   LANGUAGE SWITCH ITA / ENG
===================================================== */

let currentLanguage = "it";

try {
    const savedLanguage = localStorage.getItem("wedding-language");

    if (savedLanguage === "it" || savedLanguage === "en") {
        currentLanguage = savedLanguage;
    }
} catch (error) {
    // Mantiene l'italiano se lo storage non è disponibile.
}

function changeLanguage(language) {
    currentLanguage = language === "en" ? "en" : "it";

    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-it][data-en]").forEach(function (element) {
        element.innerHTML = element.getAttribute(
            "data-" + currentLanguage
        );
    });

    try {
        localStorage.setItem("wedding-language", currentLanguage);
    } catch (error) {
        // Il cambio lingua funziona anche senza storage.
    }
}

function initializeLanguage() {
    changeLanguage(currentLanguage);

    const languageButton = document.getElementById("language-switch");

    if (languageButton) {
        languageButton.addEventListener("click", function () {
            changeLanguage(currentLanguage === "it" ? "en" : "it");
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguage);
} else {
    initializeLanguage();
}


/* =====================================================
   HERO 4 - CARD CAROUSEL
===================================================== */

document.querySelectorAll(".hero4").forEach(function (carousel) {
    const track = carousel.querySelector(".hero4-track");
    const cards = Array.from(track.querySelectorAll(".card"));
    const dotsContainer = carousel.querySelector(".hero4-dots");
    const previousButton = carousel.querySelector(".hero4-prev");
    const nextButton = carousel.querySelector(".hero4-next");

    if (!cards.length || !dotsContainer) return;

    const dots = cards.map(function (card, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero4-dot";
        dot.setAttribute(
            "aria-label",
            "Slide " + (index + 1) + " of " + cards.length
        );

        dot.addEventListener("click", function () {
            goTo(index);
        });

        dotsContainer.appendChild(dot);
        return dot;
    });

    function cardCenter(card) {
        return card.getBoundingClientRect().left -
            track.getBoundingClientRect().left +
            track.scrollLeft +
            card.offsetWidth / 2;
    }

    function currentIndex() {
        const viewportCenter = track.scrollLeft + track.clientWidth / 2;

        return cards.reduce(function (best, card, index) {
            return Math.abs(cardCenter(card) - viewportCenter) <
                Math.abs(cardCenter(cards[best]) - viewportCenter)
                ? index
                : best;
        }, 0);
    }

    function updateControls() {
        const index = currentIndex();

        dots.forEach(function (dot, i) {
            if (i === index) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        previousButton.disabled = index === 0;
        nextButton.disabled = index === cards.length - 1;
    }

    function goTo(index) {
        const target = Math.max(0, Math.min(cards.length - 1, index));

        track.scrollTo({
            left: cardCenter(cards[target]) - track.clientWidth / 2,
            behavior: "smooth"
        });
    }

    previousButton.addEventListener("click", function () {
        goTo(currentIndex() - 1);
    });

    nextButton.addEventListener("click", function () {
        goTo(currentIndex() + 1);
    });

    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    updateControls();
});


/* =====================================================
   HERO 5 - STORY CAROUSEL
===================================================== */

document.querySelectorAll(".hero5").forEach(function(carousel){

    const track =
        carousel.querySelector(".hero5-track");

    const previousButton =
        carousel.querySelector(".hero5-prev");

    const nextButton =
        carousel.querySelector(".hero5-next");

    if(!track){
        return;
    }

    function getScrollAmount(){

        const firstItem =
            track.querySelector(".timeline-item");

        if(!firstItem){
            return track.clientWidth;
        }

        const gap =
            parseFloat(
                window.getComputedStyle(track).gap
            ) || 0;

        return firstItem.offsetWidth + gap;
    }

    if(nextButton){

        nextButton.addEventListener(
            "click",
            function(){

                track.scrollBy({
                    left:getScrollAmount(),
                    behavior:"smooth"
                });

            }
        );

    }

    if(previousButton){

        previousButton.addEventListener(
            "click",
            function(){

                track.scrollBy({
                    left:-getScrollAmount(),
                    behavior:"smooth"
                });

            }
        );

    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton =
document.getElementById("menu-toggle");

const navLinks =
document.getElementById("nav-links");

if(menuButton){

    menuButton.addEventListener(
    "click",
    function(){

        navLinks.classList.toggle("active");

    });

}

document
.querySelectorAll(".nav-links a")
.forEach(function(item){

    item.addEventListener(
    "click",
    function(){

        if(navLinks){
            navLinks.classList.remove("active");
        }

    });

});


/* =====================================================
   RSVP GOOGLE FORM
===================================================== */

// Utilizzata anche nella sezione INITIAL LOAD.
const successMessage =
    document.getElementById("rsvp-success");

// Inserire l'URL reale del deployment Apps Script.
const RSVP_API_URL = "https://script.google.com/macros/s/AKfycbwKhX-iI-P1U-Sog-TKjptLEYJWXKBD3aURyGg_zSFl8EGce0Nc1piWO2K1iuajfoGI/exec";

(() => {
    const form = document.getElementById("rsvp-form");
    if (!form) return;

    const name = form.elements["entry.117939672"];
    const surname = form.elements["entry.1658100118"];

    const surnameStage =
        document.getElementById("rsvp-surname-stage");

    const details =
        document.getElementById("rsvp-details");

    const status =
        document.getElementById("rsvp-status");

    const button =
        form.querySelector('[type="submit"]');

    let selectedName = "";
    let selectedSurname = "";
    let generation = 0;
    let busy = false;
    let sent = false;
    let timer;
    let surnameItems = [];
    let submittedData;

    const tr = (it, en) =>
        currentLanguage === "en" ? en : it;

    const norm = value =>
        value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

    const escapeHTML = value =>
        String(value).replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character])
        );

    /* ---------- Messaggi bilingui ---------- */

    function say(it, en) {
        status.dataset.it = it || "";
        status.dataset.en = en || "";
        status.textContent = it ? tr(it, en) : "";
    }

    /* ---------- Richieste ad Apps Script ---------- */

    async function api(action, params = {}) {
        const validURL =
            /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/;

        if (!validURL.test(RSVP_API_URL)) {
            throw new Error("configuration");
        }

        const url = new URL(RSVP_API_URL);

        url.search = new URLSearchParams({
            action,
            ...params,
            _: String(Date.now())
        });

        const controller = new AbortController();

        const timeout = setTimeout(
            () => controller.abort(),
            20000
        );

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                cache: "no-store",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error("network");
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            return result;
        } finally {
            clearTimeout(timeout);
        }
    }

    /* ---------- Elenchi suggerimenti ---------- */

    function clearList(input) {
        const list = document.getElementById(
            input.getAttribute("aria-controls")
        );

        list.replaceChildren();
        list.hidden = true;

        input.setAttribute("aria-expanded", "false");
    }

    function showList(input, items, choose) {
        const list = document.getElementById(
            input.getAttribute("aria-controls")
        );

        clearList(input);

        items.forEach(item => {
            const option = document.createElement("button");

            option.type = "button";
            option.disabled = !!item.responded;

            option.style.cssText =
                "display:block;" +
                "width:100%;" +
                "text-align:left;" +
                "margin:3px 0;";

            option.textContent =
                item.text +
                (
                    item.responded
                        ? tr(
                            " — già confermato",
                            " — already confirmed"
                        )
                        : ""
                );

            if (item.responded) {
                option.dataset.it =
                    escapeHTML(item.text) + " — già confermato";

                option.dataset.en =
                    escapeHTML(item.text) + " — already confirmed";
            }

            option.addEventListener("click", () => {
                choose(item);
                clearList(input);
            });

            list.append(option);
        });

        list.hidden = !items.length;

        input.setAttribute(
            "aria-expanded",
            String(!!items.length)
        );
    }

    /* ---------- Campi progressivi ---------- */

    function resetDetails() {
        selectedSurname = "";

        details.hidden = true;
        details.disabled = true;

        details
            .querySelectorAll("input, textarea")
            .forEach(element => {
                element.value = "";
            });
    }

    function selectSurname(item) {
        if (item.responded) return;

        selectedSurname = item.text;
        surname.value = item.text;

        details.hidden = false;
        details.disabled = false;

        say();
    }

    function displaySurnames() {
        const query = norm(surname.value);

        const filtered = surnameItems.filter(item =>
            norm(item.text).includes(query)
        );

        showList(surname, filtered, selectSurname);
    }

    async function selectName(item) {
        const version = ++generation;

        selectedName = item.text;
        name.value = item.text;

        surname.value = "";

        surnameStage.hidden = false;
        surnameStage.disabled = false;
        surname.disabled = true;

        resetDetails();

        say(
            "Caricamento cognomi…",
            "Loading surnames…"
        );

        try {
            const result = await api("surnames", {
                name: selectedName
            });

            if (version !== generation) return;

            surnameItems = result.surnames.map(guest => ({
                text: guest.cognome,
                responded: guest.responded
            }));

            surname.disabled = false;

            say();

            if (
                surnameItems.length === 1 &&
                !surnameItems[0].responded
            ) {
                selectSurname(surnameItems[0]);
            } else {
                surname.focus();
                displaySurnames();
            }
        } catch (_) {
            if (version !== generation) return;

            say(
                "Impossibile caricare i cognomi. " +
                "Seleziona nuovamente il nome per riprovare.",

                "Unable to load surnames. " +
                "Select your first name again to retry."
            );
        }
    }

    /* ---------- Ricerca nome ---------- */

    name.addEventListener("input", () => {
        const version = ++generation;

        clearTimeout(timer);

        clearList(name);
        clearList(surname);

        selectedName = "";
        surname.value = "";
        surnameItems = [];

        surnameStage.hidden = true;
        surnameStage.disabled = true;

        resetDetails();
        say();

        if (!norm(name.value)) return;

        timer = setTimeout(async () => {
            say("Ricerca…", "Searching…");

            try {
                const result = await api("names", {
                    q: name.value
                });

                if (version !== generation) return;

                const items = result.names.map(text => ({
                    text
                }));

                showList(name, items, selectName);

                if (result.names.length) {
                    say();
                } else {
                    say(
                        "Nessun nome trovato. " +
                        "Contatta gli sposi se hai bisogno di aiuto.",

                        "No first name found. " +
                        "Contact the couple if you need help."
                    );
                }
            } catch (_) {
                if (version !== generation) return;

                say(
                    "Lista invitati non disponibile. " +
                    "Riprova tra poco.",

                    "Guest list unavailable. " +
                    "Please try again shortly."
                );
            }
        }, 250);
    });

    /* ---------- Ricerca cognome ---------- */

    surname.addEventListener(
        "focus",
        displaySurnames
    );

    surname.addEventListener("input", () => {
        resetDetails();
        displaySurnames();
    });

    /* ---------- Tastiera e chiusura suggerimenti ---------- */

    [name, surname].forEach(input => {
        input.addEventListener("keydown", event => {
            const list = document.getElementById(
                input.getAttribute("aria-controls")
            );

            if (event.key === "Escape") {
                clearList(input);
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();

                list
                    .querySelector("button:not(:disabled)")
                    ?.focus();
            }

            if (
                event.key === "Enter" &&
                !list.hidden
            ) {
                event.preventDefault();
            }
        });
    });

    document.addEventListener("click", event => {
        if (
            !event.target.closest("[data-rsvp-suggest]")
        ) {
            clearList(name);
            clearList(surname);
        }
    });

    /* ---------- Riscaldamento Apps Script ---------- */

    name.addEventListener(
        "focus",
        () => {
            api("ping").catch(() => {});
        },
        { once: true }
    );

    /* ---------- Riepilogo con escape HTML ---------- */

    function renderSummary() {
        if (!submittedData) return;

        const labels = [
            ["Nome", "First name"],
            ["Cognome", "Last name"],
            ["Email", "Email"],
            [
                "Allergie & Intolleranze",
                "Allergies & Dietary restrictions"
            ],
            ["Bambini", "Children"],
            ["Canzone DJ", "DJ song suggestion"]
        ];

        const summary =
            document.getElementById("rsvp-summary");

        if (!summary) return;

        summary.innerHTML =
            '<div class="summary-box">' +
            labels.map((label, index) => {
                const value =
                    submittedData[index] ||
                    tr("Nessuno/a", "None");

                return (
                    "<p><strong>" +
                    escapeHTML(tr(...label)) +
                    ":</strong> " +
                    escapeHTML(value) +
                    "</p>"
                );
            }).join("") +
            "</div>";
    }

    // Aggiorna il riepilogo anche dopo un cambio lingua.
    new MutationObserver(() => {
        renderSummary();
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

    /* ---------- Controllo finale e invio ---------- */

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (busy || sent) return;

        if (
            !selectedName ||
            !selectedSurname ||
            name.value !== selectedName ||
            surname.value !== selectedSurname ||
            !form.reportValidity()
        ) {
            say(
                "Seleziona nome e cognome dagli elenchi.",
                "Select your first and last names from the suggestions."
            );

            return;
        }

        busy = true;
        button.disabled = true;

        // Acquisire i valori prima di disabilitare i campi.
        const data = new FormData(form);

        const snapshot = [
            name.value,
            surname.value
        ];

        name.disabled = true;
        surname.disabled = true;
        details.disabled = true;

        say(
            "Controllo e invio in corso…",
            "Checking and sending…"
        );

        let posting = false;

        try {
            const check = await api("check", {
                name: snapshot[0],
                surname: snapshot[1]
            });

            if (!check.invited || check.responded) {
                say(
                    check.responded
                        ? "Hai già confermato la tua presenza."
                        : "Nome e cognome non presenti nella lista invitati.",

                    check.responded
                        ? "Your RSVP has already been recorded."
                        : "First and last names are not on the guest list."
                );

                return;
            }

            posting = true;

            await fetch(form.action, {
                method: "POST",
                mode: "no-cors",
                body: new URLSearchParams(data),
                credentials: "omit"
            });

            sent = true;

            submittedData = [
                "117939672",
                "1658100118",
                "983820881",
                "791230968",
                "1921284157",
                "1662388832"
            ].map(id => data.get("entry." + id));

            renderSummary();

            form.style.display = "none";

            const success =
                document.getElementById("rsvp-success");

            if (success) {
                success.style.display = "block";

                success.scrollIntoView({
                    behavior: "smooth"
                });
            }
        } catch (_) {
            /*
             * Un errore dopo l'inizio del POST non dimostra
             * che Google non abbia ricevuto la risposta.
             */
            if (posting) {
                sent = true;

                say(
                    "Esito dell’invio non verificabile. " +
                    "Contatta gli sposi prima di riprovare.",

                    "Delivery could not be verified. " +
                    "Contact the couple before trying again."
                );
            } else {
                say(
                    "Controllo non disponibile: " +
                    "nessun invio effettuato. Riprova tra poco.",

                    "Verification unavailable: " +
                    "nothing was sent. Please try again shortly."
                );
            }
        } finally {
            busy = false;

            if (!sent) {
                name.disabled = false;
                surname.disabled = false;
                details.disabled = false;
                button.disabled = false;
            }
        }
    });
})();


/* =====================================================
   SCROLL ANIMATION
===================================================== */

// change this line in TRUE to activate animation
const ENABLE_SCROLL_ANIMATIONS=false;

const animatedElements=document.querySelectorAll(".card,.timeline-item");

if(ENABLE_SCROLL_ANIMATIONS){
const observer=new IntersectionObserver((entries)=>{
entries.forEach(function(entry){
if(entry.isIntersecting){
entry.target.classList.add("visible");
}
});
},{threshold:0.1});

animatedElements.forEach(function(element){
observer.observe(element);
});
}else{
animatedElements.forEach(function(element){
element.classList.add("visible");
});
}


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(function(anchor){

    anchor.addEventListener(
    "click",
    function(event){

        event.preventDefault();

        const target =
        document.querySelector(
        this.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({
                behavior:"smooth"
            });

        }

    });

});


/* =====================================================
   WEDDING COUNTDOWN
===================================================== */

const countdown =
document.getElementById("countdown");

const weddingDate =
new Date("July 17, 2027 18:00:00").getTime();

function updateCountdown(){

    if(!countdown){
        return;
    }

    const now =
    new Date().getTime();

    const distance =
    weddingDate - now;

    if(distance <= 0){

        countdown.innerHTML =
        currentLanguage === "it"
        ?
        "❤️ Oggi è il grande giorno!"
        :
        "❤️ Today is the big day!";

        return;

    }

    const days =
    Math.floor(
        distance /
        (1000 * 60 * 60 * 24)
    );

    const hours =
    Math.floor(
        (distance %
        (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );

    const minutes =
    Math.floor(
        (distance %
        (1000 * 60 * 60))
        /
        (1000 * 60)
    );

    const seconds =
    Math.floor(
        (distance %
        (1000 * 60))
        /
        1000
    );

    countdown.innerHTML = `

    <div class="count-box">
        <strong>${days}</strong>
        <span>
        ${currentLanguage === "it" ? "giorni" : "days"}
        </span>
    </div>

    <div class="count-box">
        <strong>${hours}</strong>
        <span>
        ${currentLanguage === "it" ? "ore" : "hours"}
        </span>
    </div>

    <div class="count-box">
        <strong>${minutes}</strong>
        <span>
        ${currentLanguage === "it" ? "minuti" : "minutes"}
        </span>
    </div>

    <div class="count-box">
        <strong>${seconds}</strong>
        <span>
        ${currentLanguage === "it" ? "secondi" : "seconds"}
        </span>
    </div>

    `;

}

updateCountdown();

setInterval(
updateCountdown,
1000
);


/* =====================================================
   DINO GAME
===================================================== */

const dinoOverlay = document.getElementById("dino-start-overlay");
const dinoFrame = document.getElementById("dino-frame");
const dinoStartButton = document.getElementById("dino-start-button");
const dinoPlayerNameInput = document.getElementById("dino-player-name");
const dinoOverlayTitle = document.getElementById("dino-overlay-title");
const dinoLastScore = document.getElementById("dino-last-score");

let dinoPlayerName = "";


/* =====================================================
   START GAME
===================================================== */

function startDinoGame() {
    if (!dinoOverlay || !dinoFrame || !dinoPlayerNameInput) {
        return;
    }

    const name = dinoPlayerNameInput.value.trim();

    if (!name) {
        alert(
            currentLanguage === "it"
                ? "Inserisci il tuo nome!"
                : "Enter your name!"
        );
        dinoPlayerNameInput.focus();
        return;
    }

    // Remember player name for following games
    dinoPlayerName = name;

    // Hide overlay
    dinoOverlay.style.display = "none";
    dinoOverlay.style.pointerEvents = "none";

    // Start game inside iframe
    dinoFrame.contentWindow.postMessage("START_DINO", "*");
    dinoFrame.focus();
}

if (dinoStartButton) {
    dinoStartButton.addEventListener("click", startDinoGame);
}

// Allow ENTER to start
if (dinoPlayerNameInput) {
    dinoPlayerNameInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            startDinoGame();
        }
    });
}


/* =====================================================
   GOOGLE FORM SCORE SUBMISSION
===================================================== */

const DINO_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSde7V_k-3jT_FVm2gC3SYl51NntnSe0wo7EBxZf-FO7Kiqk3A/formResponse";

async function submitDinoScore(playerName, playerScore) {
    const formData = new FormData();

    formData.append("entry.1489140571", playerName);
    formData.append("entry.1007767509", String(playerScore));

    try {
        await fetch(DINO_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        console.log(
            "Dino score submitted:",
            playerName,
            playerScore
        );
    }
    catch (error) {
        console.error(
            "Unable to submit Dino score:",
            error
        );
    }
}


/* =====================================================
   RECEIVE GAME OVER FROM IFRAME
===================================================== */

window.addEventListener("message", function(event) {

    // Only accept messages from our Dino iframe
    if (!dinoFrame || event.source !== dinoFrame.contentWindow) {
        return;
    }

    if (!event.data || event.data.type !== "DINO_GAME_OVER") {
        return;
    }

    const finalScore = Number(event.data.score);

    if (Number.isNaN(finalScore)) {
        return;
    }

    console.log(
        "Dino Game Over:",
        dinoPlayerName,
        finalScore
    );

    // Save attempt to Google Form
    if (dinoPlayerName) {
        submitDinoScore(dinoPlayerName, finalScore);
    }

    // Refresh ranking after Google Sheet receives the result
    setTimeout(loadDinoRanking, 2000);
    setTimeout(loadDinoRanking, 5000);

    // Show replay overlay
    setTimeout(function() {

        if (!dinoOverlay) {
            return;
        }

        dinoOverlay.style.display = "flex";
        dinoOverlay.style.pointerEvents = "auto";

        if (dinoOverlayTitle) {

            dinoOverlayTitle.setAttribute(
                "data-it",
                "🦖<br>Vuoi riprovare?"
            );

            dinoOverlayTitle.setAttribute(
                "data-en",
                "🦖<br>Play again?"
            );

            dinoOverlayTitle.innerHTML =
                currentLanguage === "it"
                    ? dinoOverlayTitle.getAttribute("data-it")
                    : dinoOverlayTitle.getAttribute("data-en");

        }

        if (dinoLastScore) {
            dinoLastScore.style.display = "block";

            dinoLastScore.setAttribute(
                "data-it",
                "Punteggio: " + finalScore
            );

            dinoLastScore.setAttribute(
                "data-en",
                "Score: " + finalScore
            );

            dinoLastScore.textContent =
                currentLanguage === "it"
                    ? dinoLastScore.getAttribute("data-it")
                    : dinoLastScore.getAttribute("data-en");

        }

        if (dinoStartButton) {

            dinoStartButton.setAttribute(
                "data-it",
                "GIOCA ANCORA"
            );

            dinoStartButton.setAttribute(
                "data-en",
                "PLAY AGAIN"
            );

            dinoStartButton.textContent =
                currentLanguage === "it"
                    ? dinoStartButton.getAttribute("data-it")
                    : dinoStartButton.getAttribute("data-en");

        }

        // Keep previous name, but allow the user to change it
        if (dinoPlayerNameInput) {
            dinoPlayerNameInput.value = dinoPlayerName;
        }

    }, 1200);
});


/* =====================================================
   DINO TOP 5 RANKING
===================================================== */

// const DINO_RANKING_CSV =
// "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwen7zrouubMprOAUcrm-w2Vdu9pYEVgj4OueWpdpYmmW8_xWc0CArjhjsCvxiRXO0Aif_W-FevMpP/pub?gid=948850152&single=true&output=csv";

const DINO_RANKING_URL =
"https://docs.google.com/spreadsheets/d/1oSqPw6XsKwarTSjQ2BkQqpHE17BgkzYtOg3puY342LM/gviz/tq?tqx=out:json&gid=948850152";

async function loadDinoRanking() {

    // console.log("loadDinoRanking avviata");

    const rankingContainer =
        document.getElementById("dino-ranking");

    if (!rankingContainer) {
        return;
    }

    try {

        // console.log("Prima del fetch");

        // const response = await fetch(DINO_RANKING_URL);
        const response = await fetch(
            DINO_RANKING_URL + "&_=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        // console.log("Fetch completato", response.status);

        if (!response.ok) {
            throw new Error("Unable to load ranking");
        }

        const text = await response.text();

        // console.log("Testo ricevuto:", text);

        // Google gviz returns JSON wrapped in a function call
        const jsonText = text.substring(
            text.indexOf("{"),
            text.lastIndexOf("}") + 1
        );

        const data = JSON.parse(jsonText);

        // console.log("JSON interpretato:", data);
        // console.log("Righe ricevute:", data.table.rows);

        const scores = [];

        data.table.rows.forEach(row => {

            if (!row.c) {
                return;
            }

            /*
              Assuming:
              column B = player name
              column C = score
            */

            const playerName =
                row.c[1] && row.c[1].v
                    ? String(row.c[1].v).trim()
                    : "";

            const score =
                row.c[2] && row.c[2].v !== null
                    ? Number(row.c[2].v)
                    : NaN;

            if (!playerName || Number.isNaN(score)) {
                return;
            }

            scores.push({
                name: playerName,
                score: score
            });

        });

        scores.sort(
            (a, b) => b.score - a.score
        );

        const topFive =
            scores.slice(0, 5);

        if (topFive.length === 0) {

            rankingContainer.innerHTML = `
                <div class="ranking-loading"
                     data-it="Nessun punteggio ancora."
                     data-en="No scores yet.">
                    ${currentLanguage === "it"
                        ? "Nessun punteggio ancora."
                        : "No scores yet."}
                </div>
            `;

            return;
        }

        rankingContainer.innerHTML =
            topFive
                .map((player, index) => {

                    return `
                        <div class="ranking-row">

                            <div class="ranking-position">
                                ${index + 1}
                            </div>

                            <div class="ranking-name">
                                ${escapeRankingHTML(player.name)}
                            </div>

                            <div class="ranking-score">
                                ${player.score}
                            </div>

                        </div>
                    `;

                })
                .join("");

    }
    catch (error) {

        console.error(
            "Error loading Dino ranking:",
            error
        );

        rankingContainer.innerHTML = `
            <div class="ranking-loading"
                 data-it="Classifica non disponibile."
                 data-en="Ranking unavailable.">
                ${currentLanguage === "it"
                    ? "Classifica non disponibile."
                    : "Ranking unavailable."}
            </div>
        `;

    }

}

function escapeRankingHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* Carosello foto dentro la tile Podere Calvanella */

document.querySelectorAll(".photo-carousel").forEach(function (carousel) {
    const track = carousel.querySelector(".photo-carousel-track");
    const slides = Array.from(
        track.querySelectorAll(".photo-carousel-slide")
    );

    const previous = carousel.querySelector(".hero4-prev");
    const next = carousel.querySelector(".hero4-next");
    const dotsContainer = carousel.querySelector(".hero4-dots");

    if (!slides.length) return;

    let selected = 0;

    const dots = slides.map(function (slide, index) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "hero4-dot";
        dot.setAttribute(
            "aria-label",
            "Photo " + (index + 1) + " / " + slides.length
        );

        dot.addEventListener("click", function () {
            goTo(index);
        });

        dotsContainer.appendChild(dot);
        return dot;
    });

    function updateControls() {
        dots.forEach(function (dot, index) {
            if (index === selected) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        previous.disabled = selected === 0;
        next.disabled = selected === slides.length - 1;
    }

    function goTo(index) {
        selected = Math.max(
            0,
            Math.min(slides.length - 1, index)
        );

        track.scrollTo({
            left: selected * track.clientWidth,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });

        updateControls();
    }

    previous.addEventListener("click", function () {
        goTo(selected - 1);
    });

    next.addEventListener("click", function () {
        goTo(selected + 1);
    });

    track.addEventListener("keydown", function (event) {
        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {
            event.preventDefault();

            goTo(
                selected +
                (event.key === "ArrowRight" ? 1 : -1)
            );
        }
    });

    track.addEventListener("scroll", function () {
        if (!track.clientWidth) return;

        selected = Math.max(
            0,
            Math.min(
                slides.length - 1,
                Math.round(track.scrollLeft / track.clientWidth)
            )
        );

        updateControls();
    }, { passive: true });

    new ResizeObserver(function () {
        track.scrollTo({
            left: selected * track.clientWidth,
            behavior: "instant"
        });
    }).observe(track);

    updateControls();
});


/* Arrotonda le foto senza cambiarne le dimensioni */

document.querySelectorAll("img.split-section-image, .hero3-picture img").forEach(function (img) {
    function roundPhoto() {
        if (!img.naturalWidth || !img.naturalHeight) return;

        const width = img.clientWidth;
        const height = img.clientHeight;

        if (!width || !height) return;

        const scale = Math.min(
            width / img.naturalWidth,
            height / img.naturalHeight
        );

        const horizontalSpace =
            Math.max(0, (width - img.naturalWidth * scale) / 2);

        const verticalSpace =
            Math.max(0, (height - img.naturalHeight * scale) / 2);

        img.style.clipPath =
            `inset(${verticalSpace}px ${horizontalSpace}px round 20px)`;
    }

    img.addEventListener("load", roundPhoto);
    new ResizeObserver(roundPhoto).observe(img);

    roundPhoto();
});


/* =====================================================
   INITIAL LOAD
===================================================== */

// document.addEventListener(
// "DOMContentLoaded",
// function(){

    // changeLanguage("it");

    // if(successMessage){
        // successMessage.style.display="none";
    // }

    // // Load ranking when website opens
    // // console.log("Sto caricando la classifica");
    // loadDinoRanking();

// });

document.addEventListener("DOMContentLoaded", function () {

    if (successMessage) {
        successMessage.style.display = "none";
    }

    const heroTitle = document.querySelector(".hero3 h1");
    const welcomeBox = document.querySelector(".hero3-welcome");
    const heroPicture = document.querySelector(".hero3-picture");

    if (heroTitle && welcomeBox && heroPicture) {
        function matchPictureWidth() {
            const reference = window.innerWidth <= 600
                ? welcomeBox
                : heroTitle;

            heroPicture.style.setProperty(
                "--hero3-title-width",
                `${reference.getBoundingClientRect().width}px`
            );
        }

        new ResizeObserver(matchPictureWidth).observe(heroTitle);
        new ResizeObserver(matchPictureWidth).observe(welcomeBox);
        window.addEventListener("resize", matchPictureWidth);
        document.fonts.ready.then(matchPictureWidth);
        matchPictureWidth();
    }

    loadDinoRanking();
});