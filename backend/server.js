const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;
const DATA_FILE = './posts.json';
const USERS_FILE = './users.json'; // ★追加: ユーザーデータファイル

app.use(cors());
app.use(bodyParser.json());

// --- 認証関連のヘルパー関数とミドルウェア ---

// ユーザーデータを読み込む関数
const readUsers = (callback) => {
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') { // ファイルが存在しない場合
        return callback(null, []); // 空の配列を返す
      }
      return callback(err);
    }
    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      callback(parseErr);
    }
  });
};

// ユーザーデータを書き込む関数
const writeUsers = (users, callback) => {
  fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), callback);
};

// 簡易認証ミドルウェア
// (今回はAuthorizationヘッダーにユーザー名が入っているかをチェックするだけ)
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: '認証情報がありません' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>" の <token> 部分を取得

  // 今回はトークンとしてユーザー名をそのまま使用
  // 実際のアプリではJWTなどのトークンを検証する
  if (token) {
    req.user = { username: token }; // リクエストにユーザー情報を追加
    next(); // 次のミドルウェアまたはルートハンドラへ
  } else {
    res.status(403).json({ error: '認証に失敗しました' });
  }
};

// --- 認証関連のAPIエンドポイント ---

// ユーザー登録
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
  }

  readUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'ユーザーデータ読み込みエラー' });

    if (users.find(user => user.username === username)) {
      return res.status(409).json({ error: 'このユーザー名はすでに使用されています' });
    }

    // ★重要: 簡易的な実装のためパスワードは平文で保存されます。本番環境では必ずハッシュ化してください。
    const newUser = { username, password }; 
    users.push(newUser);

    writeUsers(users, (err) => {
      if (err) return res.status(500).json({ error: 'ユーザー登録エラー' });
      res.status(201).json({ message: 'ユーザー登録が完了しました' });
    });
  });
});

// ユーザーログイン
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
  }

  readUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'ユーザーデータ読み込みエラー' });

    const user = users.find(u => u.username === username && u.password === password); // パスワードを直接比較
    
    if (user) {
      // ログイン成功: ユーザー名をトークンとして返す (簡易実装)
      res.json({ message: 'ログイン成功', token: user.username });
    } else {
      res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
    }
  });
});

// --- 既存のAPIエンドポイント (認証ミドルウェアを適用) ---

// 記事一覧取得 (検索機能を追加)
// このエンドポイントは認証不要
app.get('/posts', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]); 
      }
      return res.status(500).json({ error: 'データ読み込みエラー' });
    }

    let posts = JSON.parse(data);
    const searchTerm = req.query.q;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      posts = posts.filter(post => 
        (post.title && post.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (post.content && post.content.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (post.description && post.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    res.json(posts);
  });
});

// 特定のIDの記事を取得
// このエンドポイントは認証不要
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: '記事が見つかりませんでした' });
      }
      return res.status(500).json({ error: 'データ読み込みエラー' });
    }

    const posts = JSON.parse(data);
    const foundPost = posts.find(post => post.id === postId);

    if (!foundPost) {
      return res.status(404).json({ error: '記事が見つかりませんでした' });
    }

    res.json(foundPost);
  });
});

// 新規記事投稿 (★認証ミドルウェアを適用★)
app.post('/posts', authenticate, (req, res) => { // authenticate を追加
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

// 記事の更新 (★認証ミドルウェアを適用★)
app.put('/posts/:id', authenticate, (req, res) => { // authenticate を追加
  const postId = parseInt(req.params.id);
  const updatedPostData = req.body;

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: 'データ読み込みエラー' });

    let posts = JSON.parse(data);
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: '記事が見つかりません' });
    }

    posts[postIndex] = { 
      ...posts[postIndex],
      ...updatedPostData,
      id: postId,
      date: posts[postIndex].date
    };

    fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '保存エラー' });
      res.json(posts[postIndex]);
    });
  });
});

// 記事の削除 (★認証ミドルウェアを適用★)
app.delete('/posts/:id', authenticate, (req, res) => { // authenticate を追加
  const postId = parseInt(req.params.id);

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: 'データ読み込みエラー' });

    let posts = JSON.parse(data);
    const initialLength = posts.length;
    posts = posts.filter(post => post.id !== postId);

    if (posts.length === initialLength) {
      return res.status(404).json({ error: '記事が見つかりません' });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '保存エラー' });
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
