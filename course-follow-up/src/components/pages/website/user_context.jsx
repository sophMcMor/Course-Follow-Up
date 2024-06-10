// UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [idUsuario, setIdUsuario] = useState(null);

  return (
    <UserContext.Provider value={{ idUsuario, setIdUsuario }}>
      {children}
    </UserContext.Provider>
  );
};