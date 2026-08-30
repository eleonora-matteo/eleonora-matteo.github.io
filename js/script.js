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



// /* =====================================================
   // DINO GAME START OVERLAY
// ===================================================== */


// const dinoOverlay = 
// document.getElementById("dino-start-overlay");


// const dinoFrame = 
// document.getElementById("dino-frame");



// if(dinoOverlay && dinoFrame){


    // function startDinoGame(){


        // // nasconde overlay

        // dinoOverlay.style.display="none";


        // // permette al canvas di ricevere touch

        // dinoOverlay.style.pointerEvents="none";


        // // manda comando dentro iframe

        // dinoFrame.contentWindow.postMessage(
            // "START_DINO",
            // "*"
        // );


    // }



    // // desktop

    // dinoOverlay.addEventListener(
        // "click",
        // startDinoGame
    // );



    // // mobile

    // dinoOverlay.addEventListener(
        // "touchstart",
        // startDinoGame,
        // {
            // passive:true
        // }
    // );


// }

/* =====================================================
   DINO GAME START OVERLAY
===================================================== */

const dinoOverlay =
document.getElementById("dino-start-overlay");

const dinoFrame =
document.getElementById("dino-frame");

if(dinoOverlay && dinoFrame){

    function startDinoGame(event){

        if(event){
            event.preventDefault();
        }

        dinoOverlay.style.display = "none";
        dinoOverlay.style.pointerEvents = "none";

        dinoFrame.contentWindow.postMessage(
            "START_DINO",
            "*"
        );

        dinoFrame.focus();
    }

    dinoOverlay.addEventListener(
        "pointerdown",
        startDinoGame
    );
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


});