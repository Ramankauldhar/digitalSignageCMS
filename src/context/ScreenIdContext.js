// context/ScreenIdContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const ScreenIdContext = createContext();

// Create a custom hook to use the context
export const useScreenId = () => useContext(ScreenIdContext);

// Create a Provider component
export const ScreenIdProvider = ({ children }) => {
  const [screenId, setScreenId] = useState(() => {
    // Load the stored screenId from localStorage (if exists)
    return localStorage.getItem('screenId') || null;
  });

  // Function to update the screenId
  const updateScreenId = (id) => {
    setScreenId(id);
    localStorage.setItem('screenId', id); // Persist screenId
  };

  // Re-initialize WebSocket when screenId is restored
  useEffect(() => {
    if (screenId) {
      console.log(`Restoring Screen ID: ${screenId}`);
    }
  }, [screenId]);

  return (
    <ScreenIdContext.Provider value={{ screenId, updateScreenId }}>
      {children}
    </ScreenIdContext.Provider>
  );
};
