import React, {useCallback, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {TodolistList} from '../features/Todolists/TodolistList';
import {Snackbars} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Login} from '../features/Todolists/Login/Login';
import {CircularProgressWithLabel} from '../features/Progress';

import {AppRootStateType} from '../state/store';
import {loguotUser} from '../state/reducers/auth-reducer';
import {RequestStatusType, initializeApp} from '../state/reducers/app-reducer';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';



export const App: React.FC = (): JSX.Element => {
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
  const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
  const [progress, setProgress] = React.useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    dispatch(initializeApp())
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(loguotUser());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
        <CircularProgressWithLabel value={progress} />
      </div>
    )
  };

  return (
    <>
      <BrowserRouter>

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
            {isLoggedIn &&  <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
          </Toolbar>
          {status === 'loading' ? <LinearProgress /> : <></>}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={'/'} element={<TodolistList />} />
            <Route path={'/login'} element={<Login />} />
          </Routes>
        </Container>
      </BrowserRouter>

    </>
  );
};
