import React, { createContext, useState, useCallback, useMemo } from "react";

export const RefreshMatchesContext = createContext();

export const RefreshMatchesProvider = ({ children }) => {
  const [refreshMatches, setRefreshMatches] = useState(0);

  return (
    <RefreshMatchesContext.Provider
      value={{ refreshMatches, setRefreshMatches }}
    >
      {children}
    </RefreshMatchesContext.Provider>
  );
};
