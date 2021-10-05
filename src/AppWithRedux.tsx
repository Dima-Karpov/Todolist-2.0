import React from 'react';
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import { Todolist } from './Todolist';
import { addTodolistAC } from './state/todolist-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from './state/store';
import { useCallback } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';



export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
};

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TasksStateType = {
  [key: string]: TaskType[]
};

export const AppWithRedux: React.FC = React.memo(() => {


  const dispatch = useDispatch();
  const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolist);

  const addTodolist = useCallback((title: string) => {
    dispatch( addTodolistAC(title));
  }, [dispatch]);

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolist
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container style={{ padding: '20px 0px' }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={7}>
          {todolists.map(tl => {
            return (
              <Grid item key={tl.id}>
                <Paper elevation={3} style={{ padding: '10px' }}>
                  <Todolist
                    key={tl.id}
                    todolistId={tl.id}
                    title={tl.title}
                    filter={tl.filter}
                  />
                </Paper>
              </Grid>
            )
          })
          }
        </Grid>
      </Container>
    </ >
  );
});