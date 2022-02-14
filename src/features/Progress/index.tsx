import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type CircularProgressWithLabelPropsType = {
  value: number
};

export const CircularProgressWithLabel: React.FC<CircularProgressWithLabelPropsType> = (props) => {
  const {value = 0} = props
  return (
    <Box sx={{position: 'relative', display: 'inline-flex'}}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${ Math.round(value) }%`}
        </Typography>
      </Box>
    </Box>
  );
}

