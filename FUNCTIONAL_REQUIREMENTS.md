# Functional Requirements — Sign Catcher

Each requirement is independent and developable on its own. Build top to bottom.

| ID | Requirement | Depends on |
| -- | ----------- | ---------- |
| FR-01 | Phaser project opens a blank game canvas (portrait, mobile size). | — |
| FR-02 | Separate scenes: Boot, Menu, Game, GameOver — switchable without errors. | FR-01 |
| FR-03 | Load all images (signs, car, background) before the game starts. | FR-02 |
| FR-04 | Sign data: each sign has image, category, one correct text, several wrong texts. | — |
| FR-05 | Question generator: pick a sign + a shuffled mix of correct/wrong descriptions. | FR-04 |
| FR-06 | Show the current road sign image at the top. | FR-03, FR-05 |
| FR-07 | Car at the bottom moves left/right (touch + arrow keys), clamped on-screen. | FR-03 |
| FR-08 | Descriptions fall from top to bottom; uncaught ones are removed at the bottom. | FR-05 |
| FR-09 | Detect when the car catches a falling description, and whether it was correct. | FR-07, FR-08 |
| FR-10 | Score: catching a correct description adds points; show score on screen. | FR-09 |
| FR-11 | Lives: start with 3; catching a wrong description loses a life; show lives. | FR-09 |
| FR-12 | Game over when lives hit 0 → show final score + restart button. | FR-10, FR-11 |
| FR-13 | Falling speed increases as score grows. | FR-08, FR-10 |
| FR-14 | More descriptions appear at once as score grows. | FR-08, FR-10 |
| FR-15 | Wrong descriptions get more misleading (same category) at higher difficulty. | FR-05, FR-10 |
| FR-16 | Main menu with title + Play button. | FR-02 |
| FR-17 | In-game HUD always shows score and lives. | FR-10, FR-11 |
| FR-18 | Pause/resume freezes and continues the game. | FR-08 |

**Playable minimum game:** FR-01 → FR-12. Then add FR-13 → FR-18 for polish.
