
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DATA_FILE = './posts.json';

app.use(cors());
app.use(bodyParser.json());

// 記事一覧取得
app.get('/posts', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: 'データ読み込みエラー' });
    res.json(JSON.parse(data));
  });
});

// 新規記事投稿
app.post('/posts', (req, res) => {
  const newPost = req.body;
  fs.readFile(DATA_FILE, (err, data) => {
    const posts = err ? [] : JSON.parse(data);
    newPost.id = Date.now();
    newPost.date = new Date().toISOString().split('T')[0];
    posts.unshift(newPost);

    fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '保存エラー' });
      res.status(201).json(newPost);
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

