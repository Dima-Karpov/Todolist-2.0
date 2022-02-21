import React, {useEffect} from 'react';
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
import {RequestStatusType} from '../state/reducers/app-reducer';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Todolists/Login/Login';
import {CircularProgressWithLabel} from '../features/Progress';


export const App: React.FC = (): JSX.Element => {
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);
  const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
  const [progress, setProgress] = React.useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 500);
    return () => {
      clearInterval(timer);
    };
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
            <Button color="inherit">Login</Button>
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





