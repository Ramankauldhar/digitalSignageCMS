// context/ScreenIdContext.js
import React, { createContext, useState, useContext } from 'react';

// Create Context
const ScreenIdContext = createContext();

// Create a custom hook to use the context
export const useScreenId = () => useContext(ScreenIdContext);

// Create a Provider component
export const ScreenIdProvider = ({ children }) => {
  const [screenId, setScreenId] = useState(null);  // Initial state is null

  const updateScreenId = (id) => {
    setScreenId(id);
  };

  return (
    <ScreenIdContext.Provider value={{ screenId, updateScreenId }}>
      {children}
    </ScreenIdContext.Provider>
  );
};
