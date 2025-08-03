# Friss die Maus! - Ein klassisches Snake-Spiel

Ein unterhaltsames und farbenfrohes Snake-Spiel, das im Browser gespielt werden kann. Steuere die Schlange,
um die Mäuse zu fangen und werde immer länger – aber pass auf, dass du nicht gegen die Wände oder dich selbst
stößt!

## 🎮 Spielsteuerung

### Tastatur:

- **Pfeiltasten (↑, →, ↓, ←)**: Steuere die Richtung der Schlange
- **Leertaste**: Pausieren/Fortsetzen des Spiels
- **+ / -**: Geschwindigkeit ändern
- **F**: Logo ein-/ausblenden

### Touchscreen (Mobilgeräte):

- **Pfeiltasten**: Berühre die Richtungspfeile, um die Schlange zu steuern
- **Pause-Button**: Pausiert oder setzt das Spiel fort

## 🎯 Spielregeln

1. Bewege die Schlange mit den Pfeiltasten
2. Sammle die roten Mäuse, um Punkte zu sammeln
3. Werde mit jeder Maus länger
4. Vermeide es, die Wände oder dich selbst zu berühren
5. Das Spiel endet, wenn du eine Wand oder dich selbst berührst

## ⚙️ Einstellungen

- **Geschwindigkeit**: Passe die Spielgeschwindigkeit mit dem Schieberegler oder + / - an
- **Pause**: Pausiere das Spiel jederzeit mit dem Pause-Button oder der Leertaste
- **Logo**: Mit F kann das Hintergrundlogo ein-/ausgeblendet werden

## 🖼️ Bildbereitstellung

- Das Bergmannslogo wird als PNG-Datei im Ordner `src/js/snake/` bereitgestellt und nicht mehr als Base64 eingebettet.
- Bilder werden in einem eigenen Ordner gespeichert und per relativen Pfad eingebunden (Best-Practice).

## 💡 Technische Best-Practices

- **JavaScript** wurde aus der HTML-Datei ausgelagert (`src/js/snake.js`)
- **CSS**-Styles (z. B. Score) sind in `src/css/snake.css` ausgelagert
- **Bilder** werden als separate Dateien eingebunden
- Keine externen Abhängigkeiten

## 📱 Kompatibilität

Das Spiel ist für Desktop- und Mobilgeräte optimiert und in allen modernen Browsern spielbar.

## 🛠️ Technische Details

- **Sprache**: JavaScript (Vanilla JS)
- **Styling**: CSS3
- **Keine externen Abhängigkeiten**

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

---

Viel Spaß beim Spielen! 🐍🐭
