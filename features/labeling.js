import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

export function labeling(inputPath) {
  const removedDupPath = removeDuplication(inputPath);

  // Membaca leksikon InSet
  const insetNeg = JSON.parse(fs.readFileSync('lexicon/inset/_json_inset-neg.txt', 'utf8'));
  const insetPos = JSON.parse(fs.readFileSync('lexicon/inset/_json_inset-pos.txt', 'utf8'));

  // Membaca leksikon sentiwords_id
  const senti = JSON.parse(fs.readFileSync('lexicon/sentistrength_id/_json_sentiwords_id.txt', 'utf8'));

  // Membaca input file
  const data = fse.readJSONSync(removedDupPath, { throws: false });
  const tweets = data.text;

  // Ambil nama file dari inputPath dan buat outputPath secara dinamis
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const outputInset = `output/json/${fileName}-lb-inset.json`;
  const outputSenti = `output/json/${fileName}-lb-senti.json`;

  // Menulis hasil klasifikasi label untuk setiap kalimat berdasarkan nilai compound dari insetNeg dan insetPos
  const labeledInset = tweets.map(tweet => (
    isPositiveInset(tweet, insetNeg, insetPos) ? 'pos' : 'neg'
  ));

  const labeledSenti = tweets.map(tweet => (
    isPositiveSenti(tweet, senti) ? 'pos' : 'neg'
  ));

  fse.writeJsonSync(outputInset, labeledInset, { spaces: 2, EOL: '\r\n' });
  fse.writeJsonSync(outputSenti, labeledSenti, { spaces: 2, EOL: '\r\n' });

  console.log("[DONE] labeling");

  return { outputInset, outputSenti };
}

export function removeDuplication(inputPath) {
  // Membaca input file
  const data = fse.readJSONSync(inputPath, { throws: false });
  // console.log('before:', data.text.length);

  // Menghapus duplikasi kalimat dan label dengan indeks yang sama
  const uniqueData = data.text.reduce((acc, line, index) => {
    if (!acc.map.has(line)) {
      acc.map.set(line, true);
      acc.text.push(line);
      acc.label.push(data.label[index]);
    }
    return acc;
  }, { map: new Map(), text: [], label: [] });

  const newtext = uniqueData.text;
  const newlabels = uniqueData.label;
  // console.log('after:', newtext.length);

  // console.log(data.text.slice(0, 2));
  // console.log(newtext.slice(0, 2));

  // Ambil nama file dari inputPath dan buat outputPath secara dinamis
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = `output/json/${fileName}-dup.json`;

  // Menulis output ke file baru
  fse.writeJsonSync(outputPath, {
    text: newtext,
    label: newlabels
  }, { spaces: 2, EOL: '\r\n' });

  console.log("[DONE] removeDuplication");
  return outputPath;
}

function calculateSentimentScore(tweet, lexicon) {
  const words = tweet.split(/\s+/);
  let score = 0;
  words.forEach(word => {
    if (lexicon[word]) {
      score += lexicon[word];
    }
  });
  return score;
}

function isPositiveInset(tweet, insetNeg, insetPos) {
  const scoreNeg = calculateSentimentScore(tweet, insetNeg);
  const scorePos = calculateSentimentScore(tweet, insetPos);
  return scorePos + scoreNeg > 0;
}

function isPositiveSenti(tweet, senti) {
  const score = calculateSentimentScore(tweet, senti);
  return score > 0;
}