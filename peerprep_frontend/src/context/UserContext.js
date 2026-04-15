import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  const isTokenExpired = (jwtToken) => {
    if (jwtToken) {
      const payload = parseJwt(jwtToken);

      const isExpired = payload.exp * 1000 < Date.now(); // convert exp to ms

      return isExpired;
    }
    return true;
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      sessionStorage.clear();
    }
  }, []);

  const login = (userData, jwtToken) => {

    const payload = parseJwt(jwtToken);

    const fullUser = {
      ...userData,
      role: payload?.role,
      userId: payload?.sub
    };

    setToken(jwtToken);
    setUser(fullUser);

    sessionStorage.setItem("token", jwtToken);
    sessionStorage.setItem("user", JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, login, logout, isTokenExpired }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}