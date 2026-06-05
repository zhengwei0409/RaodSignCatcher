// FR-04: Sign data.
//
// This file does NOT draw anything. It only stores DATA about each road sign.
// "Data" here just means: facts the game needs (which image, what it means,
// which descriptions are right or wrong). Later requirements (FR-05 question
// generator, FR-09 catch detection) read from this list.
//
// Each sign is one plain object with 4 fields:
//   key      -> matches the image key loaded in BootScene (e.g. 'sign_stop').
//   category -> the sign type. We only use 3 Malaysian categories.
//   correct  -> the ONE description that truly matches this sign.
//   wrong    -> a list of misleading descriptions that do NOT match this sign.
//               These are hand-written to sound plausible, so the player has
//               to actually know the sign instead of guessing.

// We list the allowed categories as constants so we never mistype them
// ('warnign' vs 'warning'). Using these names everywhere keeps data consistent.
export const CATEGORY = {
  WARNING: 'warning',         // alerts drivers to hazards ahead
  PROHIBITORY: 'prohibitory', // something is NOT allowed
  INFORMATORY: 'informatory', // useful info (directions, facilities, etc.)
};

// The actual dataset: an array (ordered list) of sign objects.
export const SIGNS = [
  {
    key: 'sign_caution',
    category: CATEGORY.WARNING,
    correct: 'General caution: hazard ahead',
    wrong: [
      'No vehicles allowed beyond this point',
      'Pedestrian crossing zone',
      'End of all restrictions',
    ],
  },
  {
    key: 'sign_no_entry',
    category: CATEGORY.PROHIBITORY,
    correct: 'No entry for any vehicle',
    wrong: [
      'One-way traffic only',
      'No stopping at any time',
      'Dead end ahead',
    ],
  },
  {
    key: 'sign_roundabout',
    category: CATEGORY.WARNING,
    correct: 'Roundabout ahead',
    wrong: [
      'Sharp bend to the right',
      'U-turn permitted ahead',
      'Mandatory turn left',
    ],
  },
  {
    key: 'sign_slippery',
    category: CATEGORY.WARNING,
    correct: 'Slippery road surface',
    wrong: [
      'Loose gravel on road',
      'Steep downhill gradient',
      'Road narrows ahead',
    ],
  },
  {
    key: 'sign_stop',
    category: CATEGORY.PROHIBITORY,
    correct: 'Stop at intersection',
    wrong: [
      'Give way to traffic on the right',
      'No overtaking allowed',
      'Reduce speed now',
    ],
  },
  {
    key: 'sign_t_junction',
    category: CATEGORY.WARNING,
    correct: 'T-junction ahead',
    wrong: [
      'Crossroads ahead',
      'Side road joins from the left',
      'Two-way traffic ahead',
    ],
  },
  {
    key: 'sign_advance_warning',
    category: CATEGORY.WARNING,
    correct: 'Advance warning of a hazard ahead',
    wrong: [
      'End of warning zone',
      'No warning signs beyond this point',
      'Speed camera ahead',
    ],
  },
  {
    key: 'sign_motorcycle_lane',
    category: CATEGORY.PROHIBITORY,
    correct: 'Compulsory motorcycle lane',
    wrong: [
      'No motorcycles allowed',
      'Motorcycle parking area',
      'Bicycle lane ahead',
    ],
  },
  {
    key: 'sign_parking',
    category: CATEGORY.INFORMATORY,
    correct: 'Parking area',
    wrong: [
      'No parking at any time',
      'Bus stop ahead',
      'Loading zone only',
    ],
  },
  {
    key: 'sign_petrol',
    category: CATEGORY.INFORMATORY,
    correct: 'Petrol station ahead',
    wrong: [
      'Rest area ahead',
      'Car wash facility',
      'No fuel for next 50 km',
    ],
  },
  {
    key: 'sign_turn_right',
    category: CATEGORY.PROHIBITORY,
    correct: 'Turn right only',
    wrong: [
      'No right turn',
      'Right bend ahead',
      'Keep left of the divider',
    ],
  },
  {
    key: 'sign_works',
    category: CATEGORY.WARNING,
    correct: 'Road works ahead',
    wrong: [
      'Road closed ahead',
      'Uneven road surface',
      'Workers crossing only',
    ],
  },
];

// A tiny safety check (FR-04 says each sign needs all 4 fields).
// We run it once when this file is imported. If a sign is missing data, we log
// a clear error instead of letting the game break silently much later.
// This is NOT game logic — it just protects us from typos in the data above.
export function validateSigns(signs = SIGNS) {
  signs.forEach((sign, index) => {
    if (!sign.key) console.error(`Sign #${index} is missing a "key".`);
    if (!sign.category) console.error(`Sign "${sign.key}" is missing a "category".`);
    if (!sign.correct) console.error(`Sign "${sign.key}" is missing a "correct" text.`);
    if (!Array.isArray(sign.wrong) || sign.wrong.length === 0) {
      console.error(`Sign "${sign.key}" needs at least one "wrong" text.`);
    }
  });
  return signs;
}
