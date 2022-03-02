import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

import {AddItemForm} from '../../components/AddItemForm';
import {Todolist} from './Todolist';

import {selectTodolsts} from '../../state/reducers/todolist-reducer';
import {todolistsActions} from '../../state/reducers/todolist-actions';
import {selectTask} from '../../state/reducers/task-reducer';
import {selectIsLoggedIn} from '../../state/reducers/auth-reducer';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import {useActions} from '../../state/hooks/useActions';


export const TodolistList: React.FC<{}> = React.memo(() => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const todolists = useSelector(selectTodolsts);
  const tasks = useSelector(selectTask);

  const {addTodolist, fetchTodolist} = useActions(todolistsActions);

  useEffect(() => {
    fetchTodolist();
  }, [fetchTodolist]);

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  };

  return (
    <>
      <Grid container style={{padding: '20px 0px'}}>
        <AddItemForm addItem={addTodolist} />
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
        })}
      </Grid>
    </>
  )
});