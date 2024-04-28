
import React, { createContext, useState, ReactNode } from 'react';

interface FilterContextType {
  filter: { category: string  };
  setFilter: React.Dispatch<React.SetStateAction<{ category: string }>>;
}

const Value: FilterContextType = {
  filter: { category: '' },
  setFilter: () => {},
};

export const FilterContext = createContext<FilterContextType>(Value);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState({ category: '' });

  return <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>;
};
