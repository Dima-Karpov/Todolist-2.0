import React from 'react';
import {TodolistList} from '../features/Todolists/TodolistList';
import {Snackbars} from '../components/ErrorSnackbar/ErrorSnackbar';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {AppRootStateType} from '../state/store';
import {useSelector} from 'react-redux';
import {RequestStatusType} from '../state/app-reducer';


export const App: React.FC = () => {
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);

  return (
    <>
      <AppBar position="static">
        <Snackbars />
        <Toolbar style={{justifyContent: 'space-between'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Todolist
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
        {status === 'loading' ? <LinearProgress /> : <></>}
      </AppBar>
      <Container>
        <TodolistList />
      </Container>
    </ >
  );
};





