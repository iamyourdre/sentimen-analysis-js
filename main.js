import { textCleaning } from './features/textCleaning.js';
import { slangWordRemoval, stopWordRemoval } from './features/wordRemoval.js';

const cleanedText = textCleaning('dataset/txt/sentiment_posneg.txt');
const slangWordRemoved = slangWordRemoval(cleanedText);
const stopWordRemoved = stopWordRemoval(slangWordRemoved);