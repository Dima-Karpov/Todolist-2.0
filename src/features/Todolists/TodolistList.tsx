import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {AppRootStateType} from '../../state/store';
import {addTodolist, fetchTodolist, TodolistDomainType} from '../../state/todolist-reducer';
import {TasksStateType} from '../../state/task-reducer';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

type TodolistListPropsType = {}
export const TodolistList: React.FC<TodolistListPropsType> = React.memo(props => {

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