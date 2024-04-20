// useFilter.ts
import { useContext } from 'react';
import { FilterContext } from './filterContext';

export const useFilter = () => useContext(FilterContext);
