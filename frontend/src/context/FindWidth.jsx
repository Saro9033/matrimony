import React, { createContext, useState, useEffect } from 'react';

export const FindWidthContext = createContext();

export const FindWidthProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <FindWidthContext.Provider value={width}>
      {children}
    </FindWidthContext.Provider>
  );
};
