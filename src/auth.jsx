import React, { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import base_url from "./utils/API";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setIsAuth(true);
  };
  
  const clearTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      const accessToken = localStorage.getItem('token')
      console.log(refreshToken);
      if (refreshToken && accessToken) {
        await axios.post(`${base_url}/auth_user/logout/`, {
          refresh_token: refreshToken
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }
      localStorage.clear("refresh_token", "token")
      setIsAuth(false);
      console.log("logged out");
    } catch (error) {
      console.log("failed logging out", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ isAuth, storeTokenInLS, clearTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provide");
  }
  return authContextValue;
};
