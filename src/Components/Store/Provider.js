import React from 'react';
import Context from './Context';
import useStorage from '../../Utils/useStorage';
import { useSnackbar } from 'notistack';

const StoreProvider = ({ children }) => {
  const [token, setToken] = useStorage('token');

	const { enqueueSnackbar } = useSnackbar();

	const handleFlash = (variant) => () => {
		enqueueSnackbar("teste", { variant });
	};

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        handleFlash
      }}
    >
      
          { children }
      
    </Context.Provider>
  )
}


export default StoreProvider;