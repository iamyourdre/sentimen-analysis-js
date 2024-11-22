import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

export function slangStopWordRemoval(inputPath) {
  const slangWordRemovedPath = slangWordRemoval(inputPath);
  const stopWordRemovedPath = stopWordRemoval(slangWordRemovedPath);
  console.log("[DONE] slangStopWordRemoval");
  return stopWordRemovedPath;
}

export function slangWordRemoval(inputPath) {
  // Membaca input file
  const data = fse.readJSONSync(inputPath, { throws: false });
  // Menggunakan kamus kata gaul Salsabila 
  const dictPath = fs.readFileSync("dictionary/nasalsabila_kamus-alay/_json_colloquial-indonesian-lexicon.txt", 'utf8');
  // Rekonstruksi data sebagai 'dict'
  const dict = JSON.parse(dictPath);

  // Mengganti setiap kata yang ditemukan di input file dan menggantinya dengan kata pengganti di kamus
  const correctedText = data.text.map(line => {
    return line.split(' ').map(word => dict[word] || word).join(' ');
  });

  // Ambil nama file dari inputPath dan buat outputPath secara dinamis
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = `output/json/${fileName}-slang.json`;

  // Menulis output ke file baru
  fse.writeJsonSync(outputPath, {
    text: correctedText,
    label: data.label
  }, { spaces: 2, EOL: '\r\n' });

  console.log("[DONE] slangWordRemoval");
  return outputPath;
}

export function stopWordRemoval(inputPath) {
  // Membaca input file
  const data = fse.readJSONSync(inputPath, { throws: false });
  // Menggunakan kamus Wahid ID-Stopwords
  const dictPath = fs.readFileSync("dictionary/masdevid_id-stopwords/id.stopwords.02.01.2016.txt", 'utf8');
  // Rekonstruksi data sebagai array stopwords
  const stopwords = dictPath.split('\n').map(word => word.trim());

  // Menghapus stopword yang ditemukan di setiap baris
  const correctedText = data.text.map(line => {
    return line.split(' ').filter(word => !stopwords.includes(word)).join(' ');
  });

  // Ambil nama file dari inputPath dan buat outputPath secara dinamis
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = `output/json/${fileName}-stop.json`;

  // Menulis output ke file baru
  fse.writeJsonSync(outputPath, {
    text: correctedText,
    label: data.label
  }, { spaces: 2, EOL: '\r\n' });

  console.log("[DONE] stopWordRemoval");
  return outputPath;
}