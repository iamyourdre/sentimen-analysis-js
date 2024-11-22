import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

export function textCleaning(inputPath) {
    // Membuka file input file dan baca baris per baris
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const inputStreamLines = fileContent.split('\n').map(line => line.trim());

    const text = [];
    const label = [];

    inputStreamLines.forEach(line => {
        const parts = line.split('\t');
        text.push(parts[0]);
        label.push(parts[1]);
    });

    // Ambil nama file dari inputPath dan buat outputPath secara dinamis
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = `output/json/${fileName}-clean.json`;

    // Buat file output
    fse.writeJsonSync(outputPath, { text, label }, { spaces: 2, EOL: '\r\n' });

    // Baca konten dari file output
    let data = fse.readJSONSync(outputPath, { throws: false });

    // Pembersihan data teks dengan RegEx
    data.text = data.text.map(line => {
        // Tahap-1: Non-ascii
        let res = line.replace(/[^\x00-\x7F]+/g, ' ');
        // Tahap-2: URLs
        res = res.replace(/http[s]?\:\/\/.[a-zA-Z0-9\.\/\_?=%&#\-\+!]+/g, ' ');
        res = res.replace(/pic.twitter.com?.[a-zA-Z0-9\.\/\_?=%&#\-\+!]+/g, ' ');
        // Tahap-3: mentions
        res = res.replace(/\@([\w]+)/g, ' ');

        // Tahap-4_alt-2: konversi tagar ke kalimat (pemisahan string berdasarkan huruf kapital)
        res = res.replace(/((?<=[a-z])[A-Z]|[A-Z](?=[a-z]))/g, ' $1');
        
        // Tahap-5: simbol
        res = res.replace(/[!$%^&*@#()_+|~=`{}\[\]%\-:";\'<>?,.\/]/g, ' ');
        // Tahap-6: angka
        res = res.replace(/[0-9]+/g, '');
        // Tahap-7: koreksi duplikasi tiga karakter beruntun atau lebih (contoh. yukkk)
        res = res.replace(/([a-zA-Z])\1\1/g, '$1');
        // Tahap-8: spasi ganda (atau lebih) menjadi satu spasi
        res = res.replace(/ +/g, ' ');
        // Tahap-9: spasi di awal dan akhir kalimat
        res = res.replace(/^[ ]|[ ]$/g, '');
        // Tahap-10: konversi ke karakter huruf kecil
        res = res.toLowerCase();
        
        return res;
    });

    // Tulis kembali hasil yang sudah dibersihkan ke file output
    fse.writeJSONSync(outputPath, data, { spaces: 2, EOL: '\r\n' });

    console.log("[DONE] textCleaning");
    return outputPath;
}