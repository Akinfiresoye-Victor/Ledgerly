import React, { createContext, useContext, useState, useEffect } from "react";
import authApi from "../../api/auth";
import { mockUser } from "../../mocks/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : mockUser;
    } catch {
      return mockUser;
    }
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access") || "mock_jwt_access_token");
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refresh") || "mock_jwt_refresh_token");
  const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem("pending_email") || "you@example.com");

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access", accessToken);
    } else {
      localStorage.removeItem("access");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refresh", refreshToken);
    } else {
      localStorage.removeItem("refresh");
    }
  }, [refreshToken]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const { access, refresh, user: userData } = res.data;
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData || mockUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || "Failed to log in";
      return { success: false, error: message };
    }
  };

  const signup = async (payload) => {
    try {
      const res = await authApi.register(payload);
      setPendingEmail(payload.email);
      localStorage.setItem("pending_email", payload.email);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || "Failed to register";
      return { success: false, error: message };
    }
  };

  const verifyOtp = async (code) => {
    try {
      const res = await authApi.verifyOtp({ email: pendingEmail, code });
      const { access, refresh, user: userData } = res.data;
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData || mockUser);
      localStorage.removeItem("pending_email");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || "Invalid OTP code";
      return { success: false, error: message };
    }
  };

  const resendOtp = async () => {
    try {
      await authApi.resendOtp({ email: pendingEmail });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!accessToken,
        pendingEmail,
        setPendingEmail,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
