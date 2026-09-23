import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unitsDir = path.join(__dirname, '../src/models/data/units');
const AUDIO_DIR = path.join(__dirname, '../assets/audio');
const MANIFEST_PATH = path.join(AUDIO_DIR, 'audio_manifest.json');
const PUBLIC_AUDIO_DIR = path.join(__dirname, '../public/audio');

// 1. Ordner sicherstellen
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
  fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
}

// 2. Manifest laden (speichert welcher Text & Sprache zu welcher Datei gehört)
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

// Alle Dateien im Ordner finden, die auf .json enden.
const unitFiles = fs.readdirSync(unitsDir).filter((file) => file.endsWith('.json'));
const loadedUnits = [];
for (const file of unitFiles) {
  const filePath = path.join(unitsDir, file);
  const unitData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  loadedUnits.push(unitData);
}

// Aufgabenliste zusammenstellen
const downloadTasks = [];
const requiredFiles = new Set();

function scheduleAudio(text, filename, lang = 'pt-PT') {
  if (!text || !text.trim()) return;
  const fileNameWithExt = `${filename}.mp3`;
  requiredFiles.add(fileNameWithExt);

  // Prüfe: Existiert die Datei UND entspricht Text + Sprache (pt-PT) dem Manifest?
  const existingMeta = manifest[fileNameWithExt];
  const isManifestValid =
    existingMeta &&
    typeof existingMeta === 'object'
      ? existingMeta.text === text && existingMeta.lang === lang
      : existingMeta === text && lang === 'pt-PT' && false; // Force re-download to guarantee pt-PT European Portuguese

  const filePath = path.join(AUDIO_DIR, fileNameWithExt);
  if (fs.existsSync(filePath) && isManifestValid) {
    return;
  }

  downloadTasks.push({ text: text.trim(), filename, fileNameWithExt, lang, filePath });
}

// Alle Units durchsuchen
for (const unit of loadedUnits) {
  if (unit.levels) {
    for (const level of unit.levels) {
      if (level.exercises) {
        for (const exercise of level.exercises) {
          if (exercise.type === 'translate_to_pt') {
            scheduleAudio(exercise.correctAnswer, exercise.id, 'pt-PT');
          } else if (exercise.type === 'translate_to_de') {
            scheduleAudio(exercise.question, exercise.id, 'pt-PT');
          } else if (exercise.type === 'multiple_choice') {
            if (exercise.audioText) {
              scheduleAudio(exercise.audioText, exercise.id, 'pt-PT');
            }
            const optionsLang = exercise.optionsLanguage === 'de' ? 'de' : 'pt-PT';
            scheduleAudio(exercise.correctAnswer, `${exercise.id}_answer`, optionsLang);

            if (exercise.options) {
              for (let i = 0; i < exercise.options.length; i++) {
                scheduleAudio(exercise.options[i], `${exercise.id}_opt_${i}`, optionsLang);
              }
            }
          }

          if (exercise.vocabulary) {
            for (let v = 0; v < exercise.vocabulary.length; v++) {
              const vocab = exercise.vocabulary[v];
              const textToSpeak = vocab.audio || vocab.text;
              scheduleAudio(textToSpeak, `${exercise.id}_vocab_${v}`, 'pt-PT');
            }
          }
        }
      }
    }
  }
}

// Download eines einzelnen Audios mit Retries
function downloadSingle(task, retries = 3) {
  return new Promise((resolve) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(task.text)}&tl=${task.lang}&client=tw-ob`;

    const attempt = (remaining) => {
      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), 300);
            } else {
              console.warn(`[Audio] Warning HTTP ${res.statusCode} for "${task.text}"`);
              resolve(false);
            }
            return;
          }

          const fileStream = fs.createWriteStream(task.filePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            manifest[task.fileNameWithExt] = { text: task.text, lang: task.lang };
            resolve(true);
          });
          fileStream.on('error', (err) => {
            console.error(`[Audio] File error:`, err);
            resolve(false);
          });
        })
        .on('error', (err) => {
          if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), 300);
          } else {
            console.error(`[Audio] Network error for "${task.text}":`, err.message);
            resolve(false);
          }
        });
    };

    attempt(retries);
  });
}

// Concurrent Runner mit Queue
async function run() {
  console.log(`--- 🎧 Audio Generierung gestartet (Europäisches Portugiesisch pt-PT) ---`);
  console.log(`Zu verarbeitende Dateien: ${downloadTasks.length}`);

  const CONCURRENCY = 4;
  let completed = 0;
  let index = 0;

  async function worker() {
    while (index < downloadTasks.length) {
      const current = downloadTasks[index++];
      await downloadSingle(current);
      completed++;
      if (completed % 100 === 0 || completed === downloadTasks.length) {
        console.log(`[Audio PT-PT] Fortschritt: ${completed} / ${downloadTasks.length}`);
      }
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  // Veraltete MP3s löschen
  console.log('--- 🧹 Räume ungenutzte Audio-Dateien auf ---');
  const existingFiles = fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.mp3'));
  let deletedCount = 0;
  for (const file of existingFiles) {
    if (!requiredFiles.has(file)) {
      try {
        fs.unlinkSync(path.join(AUDIO_DIR, file));
        delete manifest[file];
        deletedCount++;
      } catch (e) {
        // ignore
      }
    }
  }

  // Manifest speichern
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  // Synchronisation zu public/audio
  console.log('--- 🚀 Synchronisiere zu public/audio ---');
  const finalAudioFiles = fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.mp3'));
  let copied = 0;
  for (const file of finalAudioFiles) {
    const src = path.join(AUDIO_DIR, file);
    const dest = path.join(PUBLIC_AUDIO_DIR, file);
    fs.copyFileSync(src, dest);
    copied++;
  }

  console.log(`--- ✅ Fertig! ${downloadTasks.length} Dateien in pt-PT erneuert, ${copied} nach public/audio kopiert. ---`);
  process.exit(0);
}

run();
