# 🔐 Messaggio Segreto — Daily Word Puzzle

[![Gioca Ora](https://img.shields.io/badge/Gioca-Online-6366f1?style=for-the-badge&logo=github)](https://un2uck1.github.io/messaggio-segreto/)
[![Licenza](https://img.shields.io/badge/Licenza-MIT-green?style=for-the-badge)](LICENSE)

Un puzzle game quotidiano, elegante e minimalista, ispirato a Wordle e ai classici crittogrammi. Ogni giorno ti aspetta una nuova frase celebre, un proverbio, una citazione cinematografica o un modo di dire in lingua italiana da sbloccare associando i giusti simboli alle rispettive lettere.

👉 **Gioca ora gratuitamente su:** **[un2uck1.github.io/messaggio-segreto](https://un2uck1.github.io/messaggio-segreto/)**

---

## 🎮 Come si Gioca

L'obiettivo è decifrare la frase segreta del giorno prima di esaurire i tentativi.

1. **Seleziona un'icona**: Clicca o tocca una tessera sul tabellone. Le tessere con la stessa icona nascondono sempre la stessa lettera.
2. **Assegna una lettera**: Usa la tastiera a schermo (o quella fisica) per proporre una lettera per l'icona selezionata.
3. **Controlla la soluzione**: Quando hai compilato tutte le tessere, premi **Controlla** per verificare le tue risposte:
   - 🟩 **Verde & Bloccata**: La lettera è corretta e rimarrà fissa sul tabellone.
   - 🟥 **Rosso**: La lettera è errata e le tessere tremeranno per segnalare l'errore.
4. **Risorse a disposizione**: Hai un massimo di **6 tentativi** per controllare la frase e **3 indizi gratuiti** (💡) che rivelano istantaneamente una lettera corretta.

---

## ✨ Caratteristiche Principali

- **Sfida Giornaliera Unica**: Un solo puzzle al giorno per tutti i giocatori, sincronizzato con la data locale (cambia a mezzanotte).
- **Esperienza Visiva Premium**:
  - Design moderno e minimale con palette di colori curate in tema scuro (default) e chiaro.
  - Tipografia fluida tramite il font *Inter*.
  - Animazioni 3D fluide stile Wordle per il flip delle tessere, ed effetti visivi (shine) al completamento delle parole.
- **PWA Ready (Installabile)**: Totalmente responsive e ottimizzato per smartphone e tablet. Aggiungilo alla schermata home del telefono per aprirlo a schermo intero come un'app nativa.
- **Web Audio Engine**: Effetti sonori dinamici sintetizzati sul momento tramite le **Web Audio API** (nessun file audio esterno da scaricare, per caricamenti istantanei).
- **Statistiche Dettagliate**: Tiene traccia delle partite giocate, vinte, striscia di vittorie consecutive (streak), record personali e la distribuzione dei tentativi.
- **Condivisione Anti-Spoiler**: Copia negli appunti una griglia visiva (es. `🟩🟩⬜⬜⬜`) per condividere i tuoi risultati sui social senza svelare la frase agli altri giocatori.

---

## 🛠️ Tecnologie Utilizzate

Il progetto è costruito interamente con tecnologie web standard (Vanilla stack) per garantire leggerezza, velocità e zero dipendenze esterne:

- **HTML5**: Struttura semantica e dialog nativi.
- **CSS3 (Custom Properties)**: Layout flessibile con CSS Variables per la gestione in tempo reale del tema Dark/Light.
- **JavaScript (ES6+)**: Logica di gioco, crittografia deterministica basata sulla data e salvataggio dello stato persistente.
- **Web Storage API**: Utilizzo di `localStorage` per salvare i progressi giornalieri in corso d'opera.
- **Google Material Symbols Rounded**: Per un'iconografia elegante, moderna e scalabile.

---

## 📂 Struttura del Progetto

```text
MessaggioSegreto/
├── index.html       # Interfaccia grafica ed elementi strutturali dell'applicazione
├── styles.css       # Fogli di stile, temi dark/light e animazioni custom
├── app.js           # Motore di gioco, generazione del cifrario e gestione dello stato
├── manifest.json    # Metadati per rendere il gioco una Progressive Web App (PWA)
├── icon-192.png     # Icona PWA ad alta risoluzione per dispositivi mobili
└── icon-512.png     # Icona PWA principale
```

---

*Realizzato con passione per gli amanti dei giochi di parole. Condividi la sfida quotidiana! 🧠🔐*
