// FR-05: Question generator.
//
// This file does NOT draw anything either. It turns the raw sign DATA from
// FR-04 into one ready-to-use "question": pick a sign, then build a shuffled
// mix of correct + wrong descriptions, each tagged so later code (FR-09) knows
// whether catching it was right or wrong.

import { SIGNS } from './signs.js';

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
export function generateQuestion(wrongCount = 2) {
  // 1. Pick which sign this question is about.
  const sign = pickRandom(SIGNS);

  // 2. Tag the one correct description.
  const correctOption = { text: sign.correct, isCorrect: true };

  // 3. Take some wrong descriptions (shuffled so we don't always grab the same
  //    ones), then tag each as incorrect. slice() takes the first wrongCount.
  const wrongOptions = shuffle(sign.wrong)
    .slice(0, wrongCount)
    .map((text) => ({ text, isCorrect: false }));

  // 4. Combine correct + wrong, then shuffle the whole set so the correct one
  //    isn't always in the same position.
  const options = shuffle([correctOption, ...wrongOptions]);

  // 5. Return the finished question.
  return { sign, options };
}
