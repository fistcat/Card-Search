import React, { useContext, useState } from "react";

const ListContext = React.createContext();
const ListUpdateContext = React.createContext();

export function useList() {
  return useContext(ListContext);
}

export function useListUpdate() {
  return useContext(ListUpdateContext);
}

export function ListProvider({ children }) {
  const [listValues, setListValues] = useState([]);

  return (
    <ListContext.Provider value={listValues}>
      <ListUpdateContext.Provider value={setListValues}>
        {children}
      </ListUpdateContext.Provider>
    </ListContext.Provider>
  );
}
