# Snowman

A word-guessing game for 1 or 2 players, played in any web browser with a mouse, a touch screen or a keyboard. Five levels take you from short picture words for young children to a challenge for adults.

**Play it here:** https://purduepeterson1986.github.io/hangman/

## How to play

1. Choose who plays each seat (a person or the computer, and how hard it plays), and a level. Then press **Start game**.
2. A hidden word appears as blanks. Each blank is one letter.
3. On your turn, guess one letter.
   - **Right:** every copy of that letter appears, and you score a point for each one. You then get another turn, with the clock reset, to guess again or solve the word.
   - **Wrong:** you lose one of your chances, and the snowman gets another piece.
   - **Solve the word:** if you know the word, tap **Solve the word** and spell it out, then press **Check my answer**. A correct answer finishes the word and scores every hidden letter, plus the bonus. A wrong answer costs one chance, the same as a wrong letter.
4. Then the turn passes to the other player, if they are still in. If the turn timer is on, you have 30 or 15 seconds (your choice) to guess a letter or press **Solve the word**. If time runs out first, it counts as a miss and you lose your turn.
5. Finish the word to score a bonus of 5 points. If you run out of chances, your snowman melts and you are out for this word.
6. A game has 5 words. The player with the most points at the end wins.

## Levels

| Level | Name | Word length | Hint | Wrong guesses allowed |
|---|---|---|---|---|
| 1 | Easy | 3 to 5 letters | A category, such as "Animal" | 8 |
| 2 | Medium | 4 to 6 letters | None | 7 |
| 3 | Tricky | 5 to 7 letters | None | 6 |
| 4 | Hard | 7 to 9 letters | None | 5 |
| 5 | Expert | 8 to 13 letters | None | 4 |

All levels use the same big letter buttons, in A to Z order. Levels 1 and 2 are made for young children, so each letter is also read aloud (turn on **Sound** to hear it).

## Players

- **Players:** 1 or 2. Names are optional. With 1 player, only one snowman is shown and the turn timer still runs.
- **Turn timer:** 30 seconds, 15 seconds, or off, set before the game. When on, the countdown shows to the right of the snowmen. Pressing **Solve the word** stops the clock for that turn.
- Each seat can be a **Person** or the **Computer**.
- The computer has three skill levels:
  - **Easy** guesses letters at random.
  - **Medium** looks at the letters that still fit the blanks, and picks one of its best choices.
  - **Hard** always picks the letter that fits the most possible words.
- Each player has their own chances. A wrong guess only costs the player who made it.
- The starting player changes with each word.

## Features

- Each player has their own snowman, drawn in their color and always on screen. The snowman of the player whose turn it is is highlighted.
- A letter can be guessed by tapping its button or by typing it on a keyboard.
- Sound effects with a mute button, and a full-screen button.
- Can be installed as an app from the browser.
- Settings are remembered between visits.

## Word lists

The words come from [WordNet 3.1](https://wordnet.princeton.edu/), a free English word database from Princeton University, used under the WordNet license. WordNet's word hierarchy gives the noun categories (for example, "dog" is an animal). Verbs and adjectives are labelled "Action" and "Describing word" instead. A few words were hand-checked and some were removed. The list of words is in `words.js`.

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
