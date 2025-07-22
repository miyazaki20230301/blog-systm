import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ★追加: useAuth フックをインポート
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth(); // ★変更点: useAuth から getAuthHeaders 関数を取得
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 記事詳細の取得には認証は不要なので、ヘッダーは追加しない
        const response = await fetch(`http://localhost:5001/posts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('記事が見つかりませんでした。');
          } else {
            setError(`記事の読み込みに失敗しました: ${response.statusText}`);
          }
          setPost(null);
          return;
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('ネットワークエラーが発生しました。');
        console.error("記事の取得に失敗しました:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 記事削除ハンドラ
  const handleDelete = async () => {
    if (window.confirm('本当にこの記事を削除しますか？')) {
      try {
        const response = await fetch(`http://localhost:5001/posts/${id}`, {
          method: 'DELETE',
          // ★変更点: 認証ヘッダーを既存のヘッダーとマージして追加★
          headers: {
            ...getAuthHeaders() // getAuthHeaders() から認証ヘッダーを取得して追加
          }
        });

        if (!response.ok) {
          // 認証エラーの場合の特別なハンドリング
          if (response.status === 401 || response.status === 403) {
            throw new Error('認証が必要です。ログインしてください。');
          }
          throw new Error(`記事の削除に失敗しました: ${response.statusText}`);
        }

        navigate('/');
        alert('記事が削除されました。');
      } catch (err) {
        console.error("記事の削除中にエラーが発生しました:", err);
        alert(`記事の削除に失敗しました: ${err.message}`);
      }
    }
  };

  // 記事編集ハンドラ
  const handleEdit = () => {
    navigate(`/edit-post/${id}`); 
  };

  if (loading) {
    return <p>記事を読み込み中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  if (!post) {
    return <p>記事が見つかりませんでした。</p>;
  }

  return (
    <div className="detail-container">
      <article className="detail-article">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">{post.date}</p>
        <div className="post-content">{post.content}</div>
        <div className="post-actions">
          <button onClick={handleEdit} className="edit-button">編集</button>
          <button onClick={handleDelete} className="delete-button">削除</button>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
