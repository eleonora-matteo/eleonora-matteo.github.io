# Installazione

1. Sostituisci il tuo script.js con script.js e il tuo index.html con index.html. I file allegati sono stati modificati solo nella sezione RSVP GOOGLE FORM e nel blocco form/iframe RSVP. Tutto il resto è conservato, compresi i fine riga originali.
2. In script.js sostituisci `INCOLLA_URL_EXEC` in `RSVP_API_URL` con l'URL reale della Web App, che deve terminare con /exec. L'URL non era presente nella richiesta.
3. Nel tuo Apps Script mantieni tutto il codice attuale, applicando le tre modifiche sotto.
4. Apps Script → Esegui clearGuestsCache se hai modificato gli invitati. Poi Distribuisci → Gestisci deployment → Modifica (matita) → Versione: Nuova versione → Distribuisci. Mantieni Esegui come: Me e Accesso: Chiunque. Se crei un deployment nuovo aggiorna anche RSVP_API_URL.
5. Verifica dal sito pubblicato: Nicolò cercando nicolo; Maria Luisa cercando lu; un nome con più cognomi; un unico cognome disponibile; cognome già confermato; modifica del nome; cambio lingua; errore di rete. Esegui una risposta di prova e controlla che sia realmente nel foglio prima di aprire il sito agli invitati. Non è stata effettuata alcuna submission ai tuoi servizi durante lo sviluppo.

# Modifiche precise ad Apps Script

## 1. Lettura invitati aggiornata nel controllo finale

Sostituisci `function getGuests() {` con:

```javascript
function getGuests(fresh) {
```

Nella stessa funzione sostituisci:

```javascript
if (cached) return JSON.parse(cached);
```

con:

```javascript
if (!fresh && cached) return JSON.parse(cached);
```

## 2. Controllo finale

Sostituisci interamente checkGuest con:

```javascript
function checkGuest(name, surname) {
  if (!normalize(name) || !normalize(surname)) {
    return { invited: false, responded: false };
  }
  const key = guestKey(name, surname);
  const invited = getGuests(true).some(function (g) {
    return guestKey(g.nome, g.cognome) === key;
  });
  return {
    invited: invited,
    responded: invited && getRespondedKeys().has(key)
  };
}
```

## 3. Non ignorare una configurazione errata delle risposte

In getRespondedKeys sostituisci:

```javascript
if (!sheet) return new Set();
```

con:

```javascript
if (!sheet) throw new Error("Scheda risposte non trovata: " + RESPONSES_SHEET);
```

Sposta il controllo `if (values.length < 2) return new Set();` DOPO la lettura e la verifica delle intestazioni. Sostituisci:

```javascript
if (nameCol === -1 || surnameCol === -1) return new Set();
```

con:

```javascript
if (nameCol === -1 || surnameCol === -1) {
  throw new Error("Intestazioni Nome e Cognome mancanti nella scheda risposte");
}
if (values.length < 2) return new Set();
```

Controlla che GUESTS_SHEET = "Invitati", RESPONSES_SHEET = "Risposte del modulo 1" e le intestazioni Nome e Cognome corrispondano al file reale. Mantieni gli altri metodi, compresi doGet, searchNames, listSurnames e normalize. Non servono JSONP o modifiche al Google Form per questo flusso.

# Limiti del flusso richiesto

Questa implementazione segue il controllo Apps Script seguito da POST diretto no-cors a Google Form. La risposta del POST è opaca: il completamento di fetch non certifica l'accettazione da parte di Google. Il riepilogo e il messaggio di successo esistenti compaiono dopo il completamento della richiesta, ma non sono una ricevuta verificata. Se la rete fallisce dopo l'inizio del POST, il bottone rimane bloccato e viene chiesto di contattare gli sposi, perché riprovare automaticamente potrebbe duplicare la risposta.

Il controllo finale legge gli invitati senza cache e le risposte aggiornate, ma controllo e scrittura non sono atomici: due dispositivi possono superare entrambi il controllo prima che il Form scriva la risposta. Disabilitare il pulsante evita il doppio clic nella stessa pagina, non questa concorrenza. Inoltre il Google Form pubblico può ricevere POST diretti che aggirano il sito. Quindi questa soluzione filtra il flusso normale del sito, ma NON garantisce che solo gli invitati possano scrivere nel Google Form.

Per rendere vincolante la lista e impedire doppioni tra dispositivi serve spostare l'invio nel backend: Apps Script deve validare e registrare la risposta sotto LockService con una chiave univoca persistente; il browser deve ricevere un esito leggibile. Questo modifica il requisito del POST diretto a Google Form. Un semplice lock sul solo check non risolve il problema.

La lista nomi/cognomi è consultabile pubblicamente attraverso la Web App. Nome e cognome non verificano l'identità della persona; per quello serve un codice invito privato.

# Verifiche eseguite

- node --check sul JavaScript completo.
- Confronto dei byte prima e dopo la sezione RSVP: carousel, countdown, lingua, Dino game e sezioni successive conservati.
- Form con campi nascosti anche disabilitati: nessun required invisibile blocca l'invio.
- Nessuna chiamata reale allo Sheet/Form: URL /exec non fornito; integrazione e layout nel browser da verificare sul sito reale.
