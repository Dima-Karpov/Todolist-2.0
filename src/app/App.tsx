import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {TodolistList} from '../features/Todolists';
import {Snackbars} from '../components/ErrorSnackbar';
import {Login} from '../features/Todolists/Login';
import {CircularProgressWithLabel} from '../features/Progress';

import {authActions, selectIsLoggedIn} from '../state/reducers/auth-reducer';
import {appActions, selectIsInitialized, selectStatus} from '../state/reducers/app-reducer';

import {home, login} from "../endpoints";
import {useActions} from '../state/hooks/useActions';
import {useProgress} from "../hooks/useProgress";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';


export const App: React.FC = (): JSX.Element => {
  const status = useSelector(selectStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isInitialized = useSelector(selectIsInitialized);
  
  const {initializeApp} = useActions(appActions);
  const {logoutUser} = useActions(authActions);

  const {progress} = useProgress();

  useEffect(() => {
    if(!isInitialized){
      initializeApp();
     }
  }, [initializeApp, isInitialized]);

  if (!isInitialized)
  {
    return (
      <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
        <CircularProgressWithLabel value={progress} />
      </div>
    )
  }

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
          {isLoggedIn && <Button color="inherit" onClick={logoutUser}>Log out</Button>}
        </Toolbar>
        {status === 'loading' ? <LinearProgress /> : <></>}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={home} element={<TodolistList />} />
          <Route path={login} element={<Login />} />
        </Routes>
      </Container>
    </>
  );
};
