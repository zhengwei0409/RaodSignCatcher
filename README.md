# Sign Catcher: Malaysian Road Sign Challenge

A **serious game** that teaches players to recognise Malaysian road signs and
their correct meanings. Players must catch the text descriptions that correctly
describe the road sign shown on screen by steering a car — turning rote
memorisation into a fast,
engaging arcade experience.

> **Serious game**: a game designed for a primary purpose other than pure
> entertainment — here, road-safety education.

---

## Table of Contents

- [Overview](#overview)
- [Educational Goal](#educational-goal)
- [Gameplay](#gameplay)
- [Scoring & Lives](#scoring--lives)
- [Difficulty Progression](#difficulty-progression)
- [Road Sign Categories](#road-sign-categories)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Status](#project-status)

---

## Overview

A Malaysian road sign is displayed at the top of the screen. Several short text
descriptions fall downward, some **correct** and some **incorrect**. The player
controls a **car** that moves left and right along the bottom
of the screen, catching only the descriptions that accurately describe the sign.

The game ends when the player loses all lives, after which a final score is
shown to reflect how well the player knows Malaysian road signs.

## Educational Goal

- Help players learn Malaysian road signs and their correct meanings.
- Reinforce learning through repetition and quick decision-making.
- Suitable for players of all ages.

## Gameplay

1. A road sign appears at the top of the screen.
2. Multiple short text descriptions fall from the top toward the bottom.
3. The player moves the **car left and right** to position it.
4. Catch the descriptions that **correctly** match the displayed sign.
5. Avoid the descriptions that are **incorrect**.

## Scoring & Lives

| Action                          | Result          |
| ------------------------------- | --------------- |
| Catch a **correct** description | Gain points     |
| Catch an **incorrect** description | Lose a life  |

The game ends when all lives are lost, and the final score is displayed.

## Difficulty Progression

As the player progresses, the game becomes harder by:

- **Speeding up** the falling descriptions.
- Introducing **more misleading** incorrect options.
- Showing **more descriptions on screen** at once.

### Difficulty Curve

Difficulty rises gradually so the player stays challenged but not overwhelmed
(a state game designers call **flow**):

```
Difficulty
   ^
   |                                          ___/
   |                                  ___/----
   |                          ___/----
   |                  ___/----
   |          ___/----
   |  ___/----
   +-------------------------------------------------> Level
     1      2       3       4       5       6
```

```mermaid
xychart-beta
    title "Difficulty Curve"
    x-axis "Level" [1, 2, 3, 4, 5, 6]
    y-axis "Difficulty" 0 --> 10
    line [2, 3, 4, 6, 8, 10]
```

> The curve climbs steadily, never with a sudden jump — a sharp spike would
> frustrate players, while a flat line would bore them.

## Road Sign Categories

The game covers a wide range of Malaysian road signs, including:

- **Warning signs** — alert drivers to hazards ahead.
- **Prohibitory signs** — indicate actions that are not allowed.
- **Informatory signs** — provide useful information (directions, facilities, etc.).

## Tech Stack

| Layer     | Choice                          |
| --------- | ------------------------------- |
| Engine    | [Phaser](https://phaser.io/)    |
| Platform  | Mobile (Android)                |
| Form      | Android game                    |

## Getting Started

> ⚠️ Development has not started yet. These steps are placeholders and will be
> filled in once the project is set up.

```bash
# 1. Install dependencies
# TODO

# 2. Run the development build
# TODO

# 3. Build the Android package
# TODO
```

## Project Status

🚧 **Planning / Design phase.** The game concept and design are defined; code
implementation has not begun.
