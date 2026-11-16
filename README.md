# Hangman

A word-guessing game for 2 players, played in any web browser with a mouse, a touch screen or a keyboard. Five levels take you from short picture words for young children to a challenge for adults.

**Play it here:** https://purduepeterson1986.github.io/hangman/

## How to play

1. Choose who plays each seat (a person or the computer, and how hard it plays), and a level. Then press **Start game**.
2. A hidden word appears as blanks. Each blank is one letter.
3. On your turn, guess one letter.
   - **Right:** every copy of that letter appears, and you score a point for each one.
   - **Wrong:** you lose one of your chances, and the hangman gets another piece.
   - **Solve the word:** if you know the word, tap **Solve the word** and spell it out, then press **Check my answer**. A correct answer finishes the word and scores every hidden letter, plus the bonus. A wrong answer costs one chance, the same as a wrong letter.
4. Then the turn passes to the other player, if they are still in.
5. Finish the word to score a bonus of 5 points. If you run out of chances, you are out for this word.
6. A game has 5 words. The player with the most points at the end wins.

## Levels

| Level | Name | Word length | Hint | Wrong guesses allowed |
|---|---|---|---|---|
| 1 | Tiny Words | 3 to 5 letters | A category, such as "Animal" | 8 |
| 2 | Category Words | 4 to 6 letters | None | 7 |
| 3 | Word Hunt | 5 to 7 letters | None | 6 |
| 4 | Brain Teasers | 7 to 9 letters | A category, such as "Science" | 5 |
| 5 | Adult Challenge | 8 to 13 letters | None | 4 |

Levels 1 and 2 are made for young children. The letter buttons are big and in A to Z order, and each letter is read aloud (turn on **Sound** to hear it). Levels 3 to 5 use a keyboard layout and no reading aid is needed.

## Players

- **Players:** 2. Names are optional.
- Each seat can be a **Person** or the **Computer**.
- The computer has three skill levels:
  - **Easy** guesses letters at random.
  - **Medium** looks at the letters that still fit the blanks, and picks one of its best choices.
  - **Hard** always picks the letter that fits the most possible words.
- Each player has their own chances. A wrong guess only costs the player who made it.
- The starting player changes with each word.

## Features

- Each player has their own hangman, drawn in their colour and always on screen. The hangman of the player whose turn it is is highlighted.
- A letter can be guessed by tapping its button or by typing it on a keyboard.
- Sound effects with a mute button, and a full-screen button.
- Can be installed as an app from the browser.
- Settings are remembered between visits.

## Running it yourself

No installation or build step is needed. Download the files and open `index.html` in a browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page |
| `styles.css` | Appearance and animations |
| `words.js` | The word lists for each level |
| `game.js` | Game rules, turns, solving, scoring, computer players and settings |
| `manifest.json`, `icon-192.png`, `icon-512.png` | Lets the game be installed as an app |

When `styles.css`, `words.js` or `game.js` changes, change the `?v=` tag on all three lines in `index.html` so browsers fetch the new copies.
