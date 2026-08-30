/* =====================================================
   WEDDING WEBSITE JAVASCRIPT
   Eleonora & Matteo
===================================================== */


/* =====================================================
   LANGUAGE SWITCH ITA / ENG
===================================================== */


let currentLanguage = "it";


const languageButton =
document.getElementById("language-switch");



function changeLanguage(language) {
    const elements =
    document.querySelectorAll("[data-it]");
    elements.forEach(function(element){
        if(language === "it") {
            element.innerHTML =
            element.getAttribute("data-it");
        } else {
            element.innerHTML =
            element.getAttribute("data-en");
        }
    });
}




if(languageButton){


    languageButton.addEventListener(
    "click",
    function(){


        if(currentLanguage === "it"){

            currentLanguage = "en";

        } else {

            currentLanguage = "it";

        }


        changeLanguage(currentLanguage);


    });


}








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


const rsvpForm =
document.getElementById("rsvp-form");


const successMessage =
document.getElementById("rsvp-success");


const summary =
document.getElementById("rsvp-summary");




if(rsvpForm){

    rsvpForm.addEventListener(
    "submit",
    function(event){

        /*
        ==============================
        EMAIL VALIDATION
        ==============================
        */

        const emailInput =
        rsvpForm.querySelector(
        'input[name="entry.983820881"]'
        );

        const email =
        emailInput.value.trim();

        if(!email.includes("@")){
            event.preventDefault();
            alert(
                currentLanguage === "it"
                ?
                "Inserisci un indirizzo email valido."
                :
                "Please enter a valid email address."
            );

            emailInput.focus();
            return false;
        }

        /*
        ==============================
        SAVE USER INPUT BEFORE RESET
        ==============================
        */
        const formData = {


            nome:
            rsvpForm.querySelector(
            'input[name="entry.117939672"]'
            ).value,

            cognome:
            rsvpForm.querySelector(
            'input[name="entry.1658100118"]'
            ).value,

            email:
            email,

            allergie:
            rsvpForm.querySelector(
            'textarea[name="entry.791230968"]'
            ).value,

            bambini:
            rsvpForm.querySelector(
            'input[name="entry.1921284157"]'
            ).value,

            canzone:
            rsvpForm.querySelector(
            'input[name="entry.1662388832"]'
            ).value
        };


        /*
        ==============================
        SHOW CONFIRMATION
        ==============================
        */


        setTimeout(function(){



            // nasconde il form

            rsvpForm.style.display = "none";




            // crea riepilogo


            if(summary){


                summary.innerHTML = `


                <div class="summary-box">


                <p>
                <strong>
                ${currentLanguage === "it" ? "Nome" : "First name"}:
                </strong>
                ${formData.nome}
                </p>



                <p>
                <strong>
                ${currentLanguage === "it" ? "Cognome" : "Last name"}:
                </strong>
                ${formData.cognome}
                </p>



                <p>
                <strong>
                Email:
                </strong>
                ${formData.email}
                </p>



                <p>
                <strong>
                ${currentLanguage === "it" ? "Allergie & Intolleranze" : "Allergies & Intolerances"}:
                </strong>
                ${formData.allergie}
                </p>



                <p>
                <strong>
                ${currentLanguage === "it" ? "Bambini" : "Children"}:
                </strong>
                ${formData.bambini || 
                (currentLanguage === "it" ? "Nessuno" : "None")}
                </p>



                <p>
                <strong>
                ${currentLanguage === "it" ? "Canzone DJ" : "DJ Song"}:
                </strong>
                ${formData.canzone || 
                (currentLanguage === "it" ? "Nessuna" : "None")}
                </p>


                </div>


                `;


            }







            if(successMessage){


                successMessage.style.display="block";


                successMessage.scrollIntoView({

                    behavior:"smooth"

                });


            }





        },1500);




    });



}









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



/* =====================================================
   INITIAL LOAD
===================================================== */


document.addEventListener(
"DOMContentLoaded",
function(){


    changeLanguage("it");

    if(successMessage){
        successMessage.style.display="none";
    }

	// Load ranking when website opens
	// console.log("Sto caricando la classifica");
	loadDinoRanking();

});