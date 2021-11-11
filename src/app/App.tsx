import React from 'react';
import { TodolistList } from '../features/Todolists/TodolistList';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';


export const App: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar style={ { justifyContent: 'space-between' } }>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={ { mr: 2 } }
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
            Todolist
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container>
          <TodolistList />
      </Container>
    </ >
  );
};





