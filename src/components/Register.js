import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // 認証フォーム用のCSS (後で作成)

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // 登録成功後、ログインページへリダイレクト
        setTimeout(() => navigate('/login'), 1500); 
      } else {
        setError(data.error || 'ユーザー登録に失敗しました');
      }
    } catch (err) {
      console.error('ユーザー登録中にエラーが発生しました:', err);
      setError('ネットワークエラーが発生しました');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="form-title">ユーザー登録</h1>
        {message && <p className="success-message">{message}</p>}
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
        <button type="submit" className="form-button">登録</button>
        <p className="auth-link">
          すでにアカウントをお持ちですか？ <Link to="/login">ログインはこちら</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
