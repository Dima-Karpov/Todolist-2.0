import React, {useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist';

import {useAppDispatch} from '../../state/store';
import {addTodolist, fetchTodolist, selectTodolsts} from '../../state/reducers/todolist-reducer';
import {selectTask} from '../../state/reducers/task-reducer';
import {selectIsLoggedIn} from '../../state/reducers/auth-reducer';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';


type TodolistListPropsType = {};

export const TodolistList: React.FC<TodolistListPropsType> = React.memo(() => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const todolists = useSelector(selectTodolsts);
  const tasks = useSelector(selectTask);

  const addNewTodolist = useCallback((title: string) => {
    dispatch(addTodolist({title}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTodolist())
  }, [dispatch]);
  
  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  };

  return (
    <>
      <Grid container style={{padding: '20px 0px'}}>
        <AddItemForm addItem={addNewTodolist} />
      </Grid>
      <Grid container spacing={7}>
        {todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id]
          return (
            <Grid item key={tl.id}>
              <Paper elevation={3} style={{padding: '10px'}}>
                <Todolist
                  key={tl.id}
                  todolist={tl}
                  tasks={allTodolistTasks}
                />
              </Paper>
            </Grid>
          )
        })
        }
      </Grid>
    </>
  )
});