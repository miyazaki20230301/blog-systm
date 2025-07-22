// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate をインポート
import { useAuth } from '../context/AuthContext'; // ★追加: useAuth フックをインポート
import './Header.css';

function Header() {
  const { isLoggedIn, username, logout } = useAuth(); // ★変更点: useAuth から認証状態を取得
  const navigate = useNavigate(); // ナビゲーション用のフック

  const handleLogout = () => {
    logout(); // ログアウト処理を実行
    navigate('/'); // ログアウト後、記事一覧ページへリダイレクト
    alert('ログアウトしました。'); // ユーザーへの通知
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <Link to="/">miyazakiのブログ</Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">記事一覧</Link></li>
            {isLoggedIn ? ( // ★変更点: ログイン状態によって表示を切り替える★
              <>
                <li><Link to="/new">新規投稿</Link></li>
                <li><span>ようこそ、{username}さん！</span></li> {/* ログイン中のユーザー名を表示 */}
                <li><button onClick={handleLogout} className="logout-button">ログアウト</button></li>
              </>
            ) : (
              <>
                <li><Link to="/register">登録</Link></li>
                <li><Link to="/login">ログイン</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
