import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import NewPost from './components/NewPost';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext'; // ★追加: AuthProvider をインポート

const App = () => {
  return (
    <Router>
      {/* ★変更点: AuthProvider でアプリケーション全体を囲む★ */}
      <AuthProvider> 
        <Header /> {/* ヘッダーを組み込む */}
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/edit-post/:id" element={<NewPost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer /> {/* フッターを組み込む */}
      </AuthProvider>
    </Router>
  );
};

export default App;
