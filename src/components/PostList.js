import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css'; // スタイルシートはそのまま

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 検索入力フィールドの現在の値
  // ★変更点1: 実際にAPIリクエストに使う検索キーワードの状態を追加★
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(true);    // ロード状態
  const [error, setError] = useState(null);       // エラー状態

  // ★変更点2: デバウンス処理のuseEffectを削除しました★
  // (以前のコードにあった最初のuseEffect)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 実際にAPIリクエストに使うのは submittedSearchTerm
        const url = submittedSearchTerm 
          ? `http://localhost:5001/posts?q=${encodeURIComponent(submittedSearchTerm)}`
          : 'http://localhost:5001/posts';

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`記事の読み込みに失敗しました: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("記事の取得に失敗しました:", err);
        setError('記事の読み込み中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    // ★変更点3: submittedSearchTerm が変更されたらAPIを呼び出す★
    fetchPosts();
  }, [submittedSearchTerm]); // submittedSearchTerm が変更されたら再実行

  // 検索入力フィールドの変更ハンドラ (入力値をリアルタイムで更新)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ★変更点4: 検索ボタンクリックハンドラを追加★
  const handleSearchButtonClick = () => {
    // 検索ボタンが押されたときに、入力フィールドの値を submittedSearchTerm にセット
    setSubmittedSearchTerm(searchTerm);
  };

  // エンターキーが押されたときにも検索をトリガー
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  if (loading) {
    return <div className="post-list-container"><p>記事を読み込み中...</p></div>;
  }

  if (error) {
    return <div className="post-list-container"><p>エラー: {error}</p></div>;
  }

  return (
    <div className="post-list-container">
      {/* 検索バーとボタンの追加 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="記事を検索..."
          value={searchTerm} // 入力フィールドの値はリアルタイムに更新
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress} // Enterキーのイベントハンドラを追加
          className="search-input"
        />
        {/* ★変更点5: 検索ボタンを追加★ */}
        <button onClick={handleSearchButtonClick} className="search-button">検索</button>
      </div>

      <div className="post-list">
        {posts.length === 0 && !loading && !error ? (
          <p>記事が見つかりませんでした。</p>
        ) : (
          posts.slice(0, 12).map(post => ( // ここは元のまま、表示件数を制限
            <div key={post.id} className="post-item">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Link to={`/post/${post.id}`}>続きを読む</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
