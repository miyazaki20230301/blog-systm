import React, { createContext, useState, useEffect, useContext } from 'react';

// 認証コンテキストを作成
export const AuthContext = createContext(null);

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  // ログイン状態とユーザー名（トークンとして使用）を管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  // コンポーネントがマウントされたときにローカルストレージから認証情報を読み込む
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // ログイン処理
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
    setIsLoggedIn(true);
    setUsername(user);
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
  };

  // コンテキストプロバイダーが提供する値
  const authContextValue = {
    isLoggedIn,
    username,
    login,
    logout,
    // APIリクエストにAuthorizationヘッダーを付与するためのヘルパー関数
    getAuthHeaders: () => {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 認証コンテキストを使用するためのカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};
