// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <Link to="/">miyazakiのブログ</Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">記事一覧</Link></li>
            
            <li><Link to="/new">新規投稿</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
