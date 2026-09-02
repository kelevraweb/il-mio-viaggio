# Il mio Viaggio

Diario di viaggio, spazio di consapevolezza e laboratorio di vita: un compagno che ti conosce una domanda alla volta, tiene il ritratto, i desideri, il mantra e i centimetri. Voce trascritta in tempo reale, quattro paesaggi dietro un finestrino di treno, musica generata dal vivo.

I dati restano **nel browser di chi usa la pagina**. Nessun server li vede.

## Struttura

- `il-mio-viaggio.src.html` — il sorgente (l'unico file da modificare)
- `assets/` — i quattro video in loop e il finestrino
- `build.py` — genera `index.html` (sito) e `il-mio-viaggio.html` (artifact Claude, con gli asset incorporati)
- `api/chat.js` — proxy serverless verso l'API Anthropic (per Vercel)

```bash
python3 build.py
```

## Pubblicare

**GitHub Pages** (statico): il sito funziona tutto, ma per il *dialogo* ogni persona deve mettere una propria chiave API di Anthropic in Impostazioni (in fondo a *Il patto*). La chiave resta nel suo browser.

**Vercel** (consigliato se vuoi che il dialogo funzioni per tutti): importa il repository, imposta la variabile d'ambiente `ANTHROPIC_API_KEY` e, per non lasciare la chiave aperta a chiunque abbia il link, `ACCESS_CODE` (un codice che la pagina chiede una volta sola). Il proxy `api/chat` fa il resto; le richieste vengono addebitate all'account di chi ha messo la chiave.

**Artifact Claude**: pubblica `il-mio-viaggio.html`; dentro Claude il dialogo passa dall'account di chi apre la pagina.
