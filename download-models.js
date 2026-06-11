const fs = require('fs');
const https = require('https');
const path = require('path');

const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const modelsUrl = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
const files = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

files.forEach(file => {
  const dest = path.join(modelsDir, file);
  const fileUrl = modelsUrl + file;
  https.get(fileUrl, response => {
    response.pipe(fs.createWriteStream(dest));
    console.log(`Downloaded ${file}`);
  }).on('error', err => {
    console.error(`Error downloading ${file}: ${err.message}`);
  });
});
