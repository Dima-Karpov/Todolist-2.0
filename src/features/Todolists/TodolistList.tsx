import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';

import {AppRootStateType} from '../../state/store';
import {addTodolist, fetchTodolist, TodolistDomainType} from '../../state/reducers/todolist-reducer';
import {TasksStateType} from '../../state/reducers/task-reducer';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';



type TodolistListPropsType = {}
export const TodolistList: React.FC<TodolistListPropsType> = React.memo(props => {

  const dispatch = useDispatch();
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolist);
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

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