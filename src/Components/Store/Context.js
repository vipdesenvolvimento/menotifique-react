import { createContext } from 'react';

const StoreContext = createContext({
  token: null,
  setToken: () => {},
  ceps: null,
  setCeps: () => {},
});

export default StoreContext;