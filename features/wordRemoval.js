import fs from 'fs'
import fse from 'fs-extra';

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

    // Membuat output JSON
    const outputData = {
        text: correctedText,
        label: data.label
    };

    // Menulis output ke file baru
    const outputPath = 'output/json/result-slangWordRemoval.json';
    fse.writeJsonSync(outputPath, outputData, { spaces: 2, EOL: '\r\n' })
    
    console.log("[DONE] slangWordRemoval")
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
  
  // Membuat output JSON
  const outputData = {
    text: correctedText,
    label: data.label
  };

  // Menulis output ke file baru
  const outputPath = 'output/json/result-stopWordRemoval.json';
  fse.writeJsonSync(outputPath, outputData, { spaces: 2, EOL: '\r\n' })
  
  console.log("[DONE] stopWordRemoval")
  return outputPath;
  
}