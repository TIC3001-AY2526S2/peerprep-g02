import { createContext, useContext, useState } from "react";

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

  const login = (userData, jwtToken) => {
    setToken(jwtToken);

    const payload = parseJwt(jwtToken);

    setUser({...userData}, {"role": payload?.role, "userId": payload?.sub});

    sessionStorage.setItem("token", jwtToken);
    sessionStorage.setItem("user", JSON.stringify(userData));

  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, isTokenExpired }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}