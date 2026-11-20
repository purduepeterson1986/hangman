# Snowman

A word-guessing game for 1 or 2 players, played in any web browser with a mouse, a touch screen or a keyboard. Five levels take you from short picture words for young children to a challenge for adults.

**Play it here:** https://purduepeterson1986.github.io/hangman/

## How to play

1. Choose who plays each seat (a person or the computer, and how hard it plays), and a level. Then press **Start game**.
2. A hidden word appears as blanks. Each blank is one letter.
3. On your turn, guess one letter.
   - **Right:** every copy of that letter appears, and you score a point for each one. You then get another turn, with the clock reset, to guess again or solve the word.
   - **Wrong:** the creature walks one stepping stone closer to the hero.
   - **Solve the word:** if you know the word, tap **Solve the word** and spell it out, then press **Check my answer**. A correct answer finishes the word and scores every hidden letter, plus the bonus. A wrong answer costs one chance, the same as a wrong letter.
4. Then the turn passes to the other player. If the turn timer is on, you have 30 or 15 seconds (your choice) to guess a letter or press **Solve the word**. If time runs out first, it counts as a miss and you lose your turn.
5. Finish the word to score a bonus of 5 points, and the hero beats the creature with his own weapon. The path is shared by both players. If the creature reaches the hero before the word is finished, it bonks him on the head, the word is over, nobody gets the bonus, and points already earned stay.
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

- **Players:** 1 or 2. Names are optional. With 1 player the turn timer still runs.
- **Play mode** (2 players): **Against each other**, where the player who finds a letter or solves the word gets the points, or **Together**, where both players get every point at the same time and win as a team.
- **Turn timer:** 30 seconds, 15 seconds, or off, set before the game. When on, the countdown shows in the top-right corner of the scene. Pressing **Solve the word** stops the clock for that turn.
- Each seat can be a **Person** or the **Computer**.
- The computer has three skill levels:
  - **Easy** guesses letters at random.
  - **Medium** looks at the letters that still fit the blanks, and picks one of its best choices.
  - **Hard** always picks the letter that fits the most possible words.
- The path is shared by both players. Any wrong guess, time-out or wrong answer moves the creature one stone closer for everyone.
- The starting player changes with each word.

## Features

- A path scene across the screen: a hero on the left, 8 stepping stones (green, then yellow, then a red last stone) and a creature on the right. The stones still ahead of the creature always equal the chances left; on harder levels it starts part of the way along.
- Each game pairs a hero with a creature at random. Heroes: **Legolas** (shoots an arrow), **Gimli** (throws his axe), **Gandalf** (casts a bolt of light from his staff) and a **hobbit** (Frodo, Sam, Merry or Pippin, who runs in with a sword). Creatures: the **spider**, an **orc**, two **goblins** and a **warg**. A beaten creature slides back to where it started, flips onto its back and kicks its legs. Below it are the word, the category and the **Solve the word** button. The border of the player whose turn it is pulses.
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
| `scene.js` | The path scene: the heroes, the creatures and the stepping stones (drawings from Hobbit Land) |
| `game.js` | Game rules, turns, solving, scoring, computer players and settings |
| `manifest.json`, `icon-192.png`, `icon-512.png` | Lets the game be installed as an app |

When `styles.css`, `words.js`, `scene.js` or `game.js` changes, change the `?v=` tag on all four lines in `index.html` so browsers fetch the new copies.
