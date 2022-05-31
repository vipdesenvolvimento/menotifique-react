import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

function FlashPop({ children }) {
	const { enqueueSnackbar } = useSnackbar();

	const handleFlash = (text, variant) => () => {
		// variant could be success, error, warning, info, or default
		enqueueSnackbar(text, { variant });
	};

	return ( 
        <SnackbarProvider maxSnack={3} handleClickVariant={handleFlash} >
            { children }
        </SnackbarProvider>
    );
}

export default FlashPop;
