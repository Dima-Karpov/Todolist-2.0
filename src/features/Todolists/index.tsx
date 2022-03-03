import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

import {AddItemForm, AddItemFromSubmitHelperType} from '../../components/AddItemForm';
import {Todolist} from './Todolist';

import {selectTodolsts, todolistsActions} from '../../state/reducers/todolist-reducer';
import {selectTask} from '../../state/reducers/task-reducer';
import {selectIsLoggedIn} from '../../state/reducers/auth-reducer';

import Grid from '@mui/material/Grid';

import {useActions} from '../../state/hooks/useActions';
import {useAppDispatch} from '../../utils/redux-utils';


export const TodolistList: React.FC<{}> = React.memo(() => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const todolists = useSelector(selectTodolsts);
  const tasks = useSelector(selectTask);

  const {fetchTodolist} = useActions(todolistsActions);

  const addTodolistCallback = useCallback(async (param: {title: string}, helper: AddItemFromSubmitHelperType) => {

    let thunk = todolistsActions.addTodolist({title: param.title});
    const resultAction = await dispatch(thunk);

    if (todolistsActions.addTodolist.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {

        const errorMessage = resultAction.payload?.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError('Some error uccured');
      }
    } else {
      helper.setTitle('');
    }
  }, [])

  useEffect(() => {
    fetchTodolist();
  }, [fetchTodolist]);

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  };

  return (
    <>
      <Grid container style={{padding: '20px 0px'}}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={7} style={{flexWrap: 'nowrap', overflowX: 'auto', paddingRight: '10px'}}>
        {todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id]
          return (
            <Grid item key={tl.id}>
              <div style={{width: '300px'}}>
                <Todolist
                  key={tl.id}
                  todolist={tl}
                  tasks={allTodolistTasks}
                />
              </div>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
});