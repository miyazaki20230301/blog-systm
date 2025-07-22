import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ★追加: useAuth フックをインポート
import './NewPost.css';

const NewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth(); // ★変更点: useAuth から getAuthHeaders 関数を取得
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 編集モードの場合、既存の記事データを読み込む
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      const fetchPostForEdit = async () => {
        try {
          // 記事詳細の取得には認証は不要なので、ヘッダーは追加しない
          const response = await fetch(`http://localhost:5001/posts/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('編集対象の記事が見つかりませんでした。');
            }
            throw new Error(`記事の読み込みに失敗しました: ${response.statusText}`);
          }
          const data = await response.json();
          setTitle(data.title || '');
          setContent(data.content || '');
        } catch (err) {
          console.error("編集記事の取得に失敗しました:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPostForEdit();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const description = content.substring(0, 50) + (content.length > 50 ? '...' : '');

    const postData = { title, content, description };
    let method = 'POST';
    let url = 'http://localhost:5001/posts';

    if (id) {
      method = 'PUT';
      url = `http://localhost:5001/posts/${id}`;
    }

    try {
      const response = await fetch(url, {
        method: method,
        // ★変更点: 認証ヘッダーを既存のヘッダーとマージして追加★
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders() // getAuthHeaders() から認証ヘッダーを取得して追加
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        // 認証エラーの場合の特別なハンドリング
        if (response.status === 401 || response.status === 403) {
          throw new Error('認証が必要です。ログインしてください。');
        }
        throw new Error(`記事の${id ? '更新' : '作成'}に失敗しました: ${response.statusText}`);
      }

      navigate('/');
      alert(`記事が${id ? '更新' : '作成'}されました！`);
    } catch (err) {
      console.error(`記事の${id ? '更新' : '作成'}中にエラーが発生しました:`, err);
      setError(err.message);
      alert(`記事の${id ? '更新' : '作成'}に失敗しました: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <p>記事データを読み込み中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  return (
    <div className="new-post-container">
      <form onSubmit={handleSubmit} className="new-post-form">
        <h1 className="form-title">{id ? '記事編集' : '新規記事作成'}</h1>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="タイトル"
          required
          className="form-input"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="本文"
          required
          className="form-textarea"
        ></textarea>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? '処理中...' : (id ? '更新' : '保存')}
        </button>
      </form>
    </div>
  );
};

export default NewPost;
