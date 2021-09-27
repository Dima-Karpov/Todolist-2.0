import React, { useReducer } from 'react';
import { v1 } from 'uuid';
import { AddItemForm } from './components/AddItemForm/AddItermForm';
import { Todolist } from './Todolist';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { changeTodolistFilterAC, todolistReducer, changeTodolistTitleAC, addTodolistAC, removeTodolistAC } from './state/todolist-reducer';
import { taskReducer, removeTaskAC, addTaskAC, changeStatusAC, changeTitleAC } from './state/task-reducer';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TasksStateType = {
  [key: string]: TaskType[]
};
export const todolistId1 = v1();
export const todolistId2 = v1();

export const AppWithResucers: React.FC = React.memo(() => {

  const [todolists, dispatchTodolistReducer] = useReducer(todolistReducer,
    [
      { id: todolistId1, title: 'Learn Programming', filter: 'all' },
      { id: todolistId2, title: 'Learn English', filter: 'all' },
    ]);

  const [tasks, dispatchTaskReducer] = useReducer(taskReducer,
    {
      [todolistId1]: [
        { id: v1(), title: 'HTML', isDone: true },
        { id: v1(), title: 'CSS', isDone: true },
        { id: v1(), title: 'React', isDone: false },
      ],
      [todolistId2]: [
        { id: v1(), title: 'HTML', isDone: true },
        { id: v1(), title: 'CSS', isDone: true },
        { id: v1(), title: 'React', isDone: false },
      ],
    });

  const removeTask = (id: string, todolistId: string) => {
    dispatchTaskReducer(removeTaskAC(id, todolistId));
  };

  const addTask = (title: string, todolistId: string) => {
    dispatchTaskReducer(addTaskAC(title, todolistId));
  };
  const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
    dispatchTaskReducer(changeStatusAC(taskId, isDone, todolistId));
  };
  const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
    dispatchTaskReducer(changeTitleAC(taskId, title, todolistId));
  };

  const changeFilter = (value: FilterValuesType, todolistId: string) => {
    dispatchTodolistReducer(changeTodolistFilterAC(todolistId, value));
  };

  const removeTodolist = (todolistId: string) => {
    const action = removeTodolistAC(todolistId);
    dispatchTodolistReducer(action);
    dispatchTaskReducer(action);
  };
  const addTodolist = (title: string) => {
    const action = addTodolistAC(title);
    dispatchTodolistReducer(action);
    dispatchTaskReducer(action);
  };
  const changeTodolistTitle = (todolistId: string, title: string) => {
    dispatchTodolistReducer(changeTodolistTitleAC(todolistId, title))
  };

  const todoListComponents = todolists.map(tl => {
    let tasksForTodolist = tasks[tl.id];
    if (tl.filter === 'completed') {
      tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
    }
    if (tl.filter === 'active') {
      tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
    }
    return (
      <Grid item key={tl.id}>
        <Paper elevation={3} style={{ padding: '10px' }}>
          <Todolist
            key={tl.id}
            todolistId={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            changeTaskStatus={changeStatus}
            changeTaskTitle={changeTaskTitle}
            filter={tl.filter}
            removeTodolist={removeTodolist}
            changeTodolistTitle={changeTodolistTitle}
          />
        </Paper>
      </Grid>

    )
  })

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
          {todoListComponents}
        </Grid>
      </Container>
    </ >
  );
});
