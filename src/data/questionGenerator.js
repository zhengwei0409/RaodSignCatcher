// FR-05: Question generator.
//
// This file does NOT draw anything either. It turns the raw sign DATA from
// FR-04 into one ready-to-use "question": pick a sign, then build a shuffled
// mix of correct + wrong descriptions, each tagged so later code (FR-09) knows
// whether catching it was right or wrong.

import { SIGNS } from './signs.js';

// FR-15: build harder, more misleading wrong options. Instead of a sign's own
// hand-written wrongs, use the CORRECT descriptions of OTHER signs in the SAME
// category — those sound the most similar and are hardest to tell apart.
// Falls back to the sign's own wrong texts if there aren't enough same-category
// ones. Returns an array of wrong text strings.
function buildHardWrongTexts(sign, wrongCount) {
  const sameCategory = SIGNS
    .filter((s) => s.category === sign.category && s.key !== sign.key)
    .map((s) => s.correct);

  // Top up with the sign's own wrongs if same-category isn't enough.
  const pool = shuffle([...sameCategory, ...sign.wrong]);
  return pool.slice(0, wrongCount);
}

// --- Helper 1: pick a random item from an array. -------------------------
// Math.random() gives a decimal from 0 up to (but not including) 1.
// Multiply by the length and floor() it to get a valid index 0..length-1.
function pickRandom(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// --- Helper 2: shuffle an array (Fisher-Yates algorithm). ----------------
// Why we can't just use sort(): we need a FAIR shuffle where every order is
// equally likely. Fisher-Yates does exactly that.
//
// How it works: walk from the LAST item to the first. At each spot i, pick a
// random earlier-or-equal index j, and swap the two items. By the end, every
// item has been moved to a random place.
//
// We copy the array first ([...array]) so we never modify the caller's data.
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]; // swap copy[i] and copy[j]
  }
  return copy;
}

// --- The main function. ---------------------------------------------------
// generateQuestion() builds ONE question.
//
// wrongCount lets us control difficulty later (FR-14/FR-15 can ask for more
// wrong options). It defaults to 2 so callers don't have to pass anything yet.
export function generateQuestion(wrongCount = 2, hard = false) {
  // 1. Pick which sign this question is about.
  const sign = pickRandom(SIGNS);

  // 2. Tag the one correct description.
  const correctOption = { text: sign.correct, isCorrect: true };

  // 3. Pick wrong descriptions. In hard mode (FR-15) they come from
  //    same-category signs (more misleading); otherwise the sign's own wrongs.
  const wrongTexts = hard
    ? buildHardWrongTexts(sign, wrongCount)
    : shuffle(sign.wrong).slice(0, wrongCount);
  const wrongOptions = wrongTexts.map((text) => ({ text, isCorrect: false }));

  // 4. Combine correct + wrong, then shuffle the whole set so the correct one
  //    isn't always in the same position.
  const options = shuffle([correctOption, ...wrongOptions]);

  // 5. Return the finished question.
  return { sign, options };
}

// FR-15: rebuild the shuffled options for an EXISTING sign at hard difficulty,
// without changing the sign itself (so the displayed image stays the same).
export function buildOptions(sign, wrongCount = 2, hard = false) {
  const correctOption = { text: sign.correct, isCorrect: true };
  const wrongTexts = hard
    ? buildHardWrongTexts(sign, wrongCount)
    : shuffle(sign.wrong).slice(0, wrongCount);
  const wrongOptions = wrongTexts.map((text) => ({ text, isCorrect: false }));
  return shuffle([correctOption, ...wrongOptions]);
}
