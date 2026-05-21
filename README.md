# Messaggio Segreto

Puzzle giornaliero web in cui ogni icona nasconde una lettera. Il giocatore non deve conoscere la crittografia: seleziona un'icona, prova una lettera, usa pochi indizi e sblocca la frase del giorno.

Il gioco salva la partita del giorno nel browser, mostra il countdown al prossimo puzzle, blocca la partita dopo vittoria/sconfitta e genera un risultato condivisibile senza spoiler. Le icone del cifrario usano Google Material Symbols.

## Avvio

Apri `index.html` direttamente nel browser, oppure servi la cartella in locale:

```bash
python -m http.server 5173 --bind 127.0.0.1
```

Poi visita:

```text
http://127.0.0.1:5173/
```

## File principali

- `index.html`: struttura dell'app
- `styles.css`: layout responsive e stile visuale
- `app.js`: logica daily, salvataggio locale, statistiche, recap e condivisione
