import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import NewPost from './components/NewPost';

const App = () => {
  return (
    <Router>
      <Header /> {/* ヘッダーを組み込む */}
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/new" element={<NewPost />} />
      </Routes>
      <Footer /> {/* フッターを組み込む */}
    </Router>
  );
};

export default App;