import { labeling } from './features/labeling.js';
import { textCleaning } from './features/textCleaning.js';
import { slangStopWordRemoval } from './features/wordRemoval.js';
import { classify } from './features/classification.js';

// const cleanedText = textCleaning('dataset/txt/sentiment_posneg.txt');
// const slangStopWordRemoved = slangStopWordRemoval(cleanedText);
// const labeled = labeling(slangStopWordRemoved);
const classified = classify();