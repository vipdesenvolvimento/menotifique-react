import React from 'react'
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';

const FlashMessage = (props) => {
    return (
        <>
            <Stack sx={{ width: '100%', mt: 3 }} spacing={2} />
            <Alert variant="outlined" severity={props.type} {...props}>
                {props.children}
            </Alert>
        </>
    )
}


export default FlashMessage