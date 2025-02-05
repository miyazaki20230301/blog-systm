import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPost.css';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, description: content.substring(0, 50) + '...' })
    })
      .then(() => navigate('/'));
  };

  return (
    <div className="new-post-container">
      <form onSubmit={handleSubmit} className="new-post-form">
        <h1 className="form-title">新規記事作成</h1>
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
        <button type="submit" className="form-button">保存</button>
      </form>
    </div>
  );
};

export default NewPost;
