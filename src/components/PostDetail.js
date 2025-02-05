import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(response => response.json())
      .then(data => {
        const foundPost = data.find(p => p.id === parseInt(id));
        setPost(foundPost);
      });
  }, [id]);

  if (!post) return <p>記事が見つかりませんでした。</p>;

  return (
    <div className="detail-container">
      <article className="detail-article">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">{post.date}</p>
        <div className="post-content">{post.content}</div>
      </article>
    </div>
  );
};

export default PostDetail;