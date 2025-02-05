import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="post-list-container">
      <div className="post-list">
        {posts.slice(0, 12).map(post => (
          <div key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <Link to={`/post/${post.id}`}>続きを読む</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;