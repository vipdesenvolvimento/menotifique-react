import React from 'react';
import { Card, CardActions, CardContent, Typography, Stack } from '@mui/material';
import Icon from '@mui/material/Icon';
function CardUra({
    children,
    id,
    tag,
    description,
    date_init,
    date_end,
    active
}) {

  return (

    <Card sx={{ minWidth: 400 }} >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {description} <Icon color={(active ? 'success' : 'error')}>circle</Icon>
        </Typography>
        <Typography variant="body2" color="text.secondary">
            <Stack spacing={2} direction="column">
              <p>Tag {tag + ' '}</p>
                <p>{date_init}</p>
                <p>{date_end}</p>
            </Stack>
        </Typography>
      </CardContent>
      <CardActions>
        {children}
      </CardActions>
    </Card>
  );
}

export default CardUra;
