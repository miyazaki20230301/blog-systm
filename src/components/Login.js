import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ★追加: useAuth フックをインポート
import './Auth.css';

const Login = () => { // onLogin プロップスは不要になるので削除
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ★変更点: useAuth から login 関数を取得

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功: AuthContext の login 関数を呼び出す
        login(data.token, username); // ★変更点: context の login を呼び出す★

        navigate('/'); // ログイン成功後、記事一覧ページへリダイレクト
        alert('ログインに成功しました！');
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (err) {
      console.error('ログイン中にエラーが発生しました:', err);
      setError('ネットワークエラーが発生しました');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="form-title">ログイン</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
          required
          className="form-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
          className="form-input"
        />
        <button type="submit" className="form-button">ログイン</button>
        <p className="auth-link">
          アカウントをお持ちでないですか？ <Link to="/register">登録はこちら</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
