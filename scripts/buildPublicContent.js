import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unitsDir = path.join(__dirname, '../src/models/data/units');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Read all JSON unit files
const files = fs.readdirSync(unitsDir).filter((f) => f.endsWith('.json'));
const units = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(unitsDir, file), 'utf8'));
  units.push(content);
}

// Assemble main course object
const fullContent = {
  courses: [
    {
      id: 'portuguese_a1',
      title: 'Portugiesisch A1',
      units,
    },
  ],
};

// Write output to public/content.json
fs.writeFileSync(path.join(publicDir, 'content.json'), JSON.stringify(fullContent, null, 2), 'utf8');
console.log(`[buildPublicContent] Successfully built public/content.json with ${units.length} units.`);

// Ensure audio assets from assets/audio are copied to public/audio for zero-latency static PWA serving
const assetsAudioDir = path.join(__dirname, '../assets/audio');
const publicAudioDir = path.join(publicDir, 'audio');

if (fs.existsSync(assetsAudioDir)) {
  if (!fs.existsSync(publicAudioDir)) {
    fs.mkdirSync(publicAudioDir, { recursive: true });
  }
  const audioFiles = fs.readdirSync(assetsAudioDir);
  let copiedCount = 0;
  for (const file of audioFiles) {
    const src = path.join(assetsAudioDir, file);
    const dest = path.join(publicAudioDir, file);
    const srcStat = fs.statSync(src);
    if (!fs.existsSync(dest) || srcStat.mtimeMs > fs.statSync(dest).mtimeMs) {
      fs.copyFileSync(src, dest);
      copiedCount++;
    }
  }
  if (copiedCount > 0) {
    console.log(`[buildPublicContent] Synced ${copiedCount} updated audio files to public/audio.`);
  }
}
