import React, {useCallback} from 'react';
import './index.css';

import {useAppDispatch} from '../../../state/store';
import {changeTodolistFilter, TodolistDomainType} from "../../../state/reducers/todolist-reducer";

import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import {Task} from "./Task";

import {TaskStatuses, TaskType} from "../../../dal/todolists-api";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import {useActions} from '../../../state/hooks/useActions';
import {tasksActions} from '../../../state/reducers/tasks-actions';
import {todolistsActions} from '../../../state/reducers/todolist-actions';


type TodolistPropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
};


export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {todolist, tasks, } = props;
  const dispatch = useAppDispatch();

  const {changeTodolistTitle, removeTodolist} = useActions(todolistsActions);
  const {addTask} = useActions(tasksActions);

  const onAllClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({id: todolist.id, filter: 'all'})), [dispatch, todolist.id]);

  const onActiveClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({id: todolist.id, filter: 'active'})), [dispatch, todolist.id]);

  const onCompletedClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({id: todolist.id, filter: 'completed'})), [dispatch, todolist.id]);


  const addNewTask = useCallback((param: {title: string}) => {
    addTask({todolistId: todolist.id, title: param.title});
  }, [addTask, todolist.id]);

  const getTasksForTodoList = useCallback(() => {
    switch (todolist.filter)
    {
      case 'completed':
        return tasks.filter(t => t.status === TaskStatuses.New)
      case 'active':
        return tasks.filter(t => t.status === TaskStatuses.Completed)
      default:
        return tasks
    }
  }, [todolist.filter, tasks]);

  const replaceNewTitleTodolsit = useCallback((newTitle: string) => {
    changeTodolistTitle({todolistId: todolist.id, title: newTitle});
  }, [changeTodolistTitle, todolist.id]);

  const deleteTodolsit = useCallback(() => {
    removeTodolist({todoListId: todolist.id});
  }, [removeTodolist, todolist.id]);


  let newTasks = getTasksForTodoList();

  const сurrentTasks = newTasks.map(t => <Task
    key={t.id} task={t} todolistId={todolist.id} />);


  return (
    <div>
      <h3>
        <EditableSpan title={todolist.title} onChange={replaceNewTitleTodolsit} />
        <IconButton
          color={'success'}
          size="medium"
          onClick={deleteTodolsit}
          disabled={todolist.entityStatus === 'loading'}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </h3>

      <AddItemForm addItem={addNewTask} disabled={todolist.entityStatus === 'loading'} />

      <div>
        {сurrentTasks}
      </div>

      <div className='block-button'>
        <Button
          variant={todolist.filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}>
          All
        </Button>
        <Button
          style={{marginLeft: "5px"}}
          color={'primary'}
          variant={todolist.filter === 'active' ? 'contained' : 'text'}
          onClick={onActiveClickHandler}>
          Active
        </Button>
        <Button
          style={{marginLeft: "5px"}}
          color={'primary'}
          variant={todolist.filter === 'completed' ? 'contained' : 'text'}
          onClick={onCompletedClickHandler}>
          Completed
        </Button>
      </div>
    </div>
  )
});


