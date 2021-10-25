import React, { useCallback } from "react";
import { AddItemForm } from "./components/AddItemForm/AddItemForm";
import { EditableSpan } from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { Task } from './Task'

import { changeTitleAC, changeStatusAC, deletTask, addTask, updateTask } from "./state/task-reducer";
import { changeTodolistFilterAC, removeTodolist, changeTodolistTitle, FilterValuesType } from "./state/todolist-reducer";
import { TaskStatuses, TaskType } from "./dal/todolists-api";

type TodolistPropsType = {
  todolistId: string
  title: string
  filter: FilterValuesType

  tasks: TaskType[]
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {title, todolistId, filter, tasks, } = props;

  const dispatch = useDispatch();

  const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'all')), [dispatch, todolistId]);
  const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'active')), [dispatch, todolistId]);
  const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todolistId, 'completed')), [dispatch, todolistId]);

  const deleteUnnecessaryTodolsit = useCallback(() => {
    dispatch(removeTodolist(todolistId));
  }, [dispatch, todolistId]);
  const replaceNewTitleTodolsit = useCallback((newTitle: string) => {
    dispatch(changeTodolistTitle(todolistId, newTitle));
  }, [dispatch, todolistId]);



  const removeTask = useCallback((todolistId: string, id: string) => {
    dispatch(deletTask(todolistId, id))
  }, [dispatch]);

  const onChangeTitleHandler = useCallback((todolistId: string, taskId: string, newTitle: string) =>
    dispatch(updateTask(todolistId, taskId, { title: newTitle })), [dispatch]);

  const onChangeStatusHandler = useCallback((todolistId: string, taskId: string, status: TaskStatuses) =>
    dispatch(updateTask(todolistId, taskId, { status })), [dispatch]);

  const addTasks = useCallback((todolistId: string, title: string) => {
    dispatch(addTask(todolistId, title));
  }, [dispatch]);

  const addNewTask = useCallback((title: string) => {
    addTasks(todolistId, title);
  }, [addTasks, todolistId]);

  const getTasksForTodoList = useCallback(() => {
    switch (filter)
    {
      case 'completed':
        return tasks.filter(t => t.status === TaskStatuses.New)
      case 'active':
        return tasks.filter(t => t.status === TaskStatuses.Completed)
      default:
        return tasks
    }
  }, [filter, tasks]);


  let newTasks = getTasksForTodoList();
  const сurrentTasks = newTasks.map(t => <Task
    key={t.id} task={t} todolistId={todolistId}
    onChangeTitleHandler={onChangeTitleHandler}
    removeTask={removeTask}
    onChangeStatusHandler={onChangeStatusHandler} />);


  return (
    <div>
      <h3>
        <EditableSpan title={title} onChange={replaceNewTitleTodolsit} />
        <IconButton color={'success'} size="medium" onClick={deleteUnnecessaryTodolsit}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </h3>

      <AddItemForm addItem={addNewTask} />

      <div>
        {сurrentTasks}
      </div>

      <div>
        <Button variant={filter === 'all' ? 'outlined' : 'text'} onClick={onAllClickHandler}>All</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
        <Button style={{ marginLeft: "5px" }} color={'primary'} variant={filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
      </div>
    </div>
  )
});


