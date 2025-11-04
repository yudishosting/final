const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const port = Math.floor(Math.random() * 1000) + 4000;
const app = express();
const baseDir = __dirname;

app.use(express.static(baseDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(baseDir, 'index.html'));
});

app.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`🚀 Server running at ${url}`);

  exec(`termux-open-url ${url}`, (err) => {
    if (err) {
      console.log('⚠️ Tidak bisa buka otomatis, buka manual:', url);
    }
  });
});