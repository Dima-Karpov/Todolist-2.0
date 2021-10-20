import React, { useEffect } from 'react';
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import { Todolist } from './Todolist';
import { addTodolist, TodolistDomainType, fetchTodolist } from './state/todolist-reducer';
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
import { TasksStateType } from './state/task-reducer';



export const AppWithRedux: React.FC = React.memo(() => {

  const dispatch = useDispatch();
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolist);
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);

  const addNewTodolist = useCallback((title: string) => {
    dispatch(addTodolist(title));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTodolist())
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
          <AddItemForm addItem={addNewTodolist} />
        </Grid>
        <Grid container spacing={7}>
          {todolists.map(tl => {
            let allTodolistTasks = tasks[tl.id]
            return (
              <Grid item key={tl.id}>
                <Paper elevation={3} style={{ padding: '10px' }}>
                  <Todolist
                    key={tl.id}
                    todolistId={tl.id}
                    title={tl.title}
                    filter={tl.filter}

                    tasks={allTodolistTasks}
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
