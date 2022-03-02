import React, {useCallback} from 'react';
import './index.css';

import {FilterValuesType, TodolistDomainType, todolistsActions} from "../../../state/reducers/todolist-reducer";
import {tasksActions} from '../../../state/reducers/task-reducer';

import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import {Task} from "./Task";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import {useActions} from '../../../state/hooks/useActions';
import {TaskStatuses, TaskType} from "../../../dal/todolists-api";
import {PropTypes} from '@mui/material';
import Button from '@mui/material/Button';


type TodolistPropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
};


export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
  const {todolist, tasks, } = props;

  const {changeTodolistTitle, removeTodolist, changeTodolistFilter} = useActions(todolistsActions);
  const {addTask} = useActions(tasksActions);

  const onAllClickHandler = useCallback(() => {
    changeTodolistFilter({id: todolist.id, filter: 'all'})
  }, [changeTodolistFilter, todolist.id]);

  const onActiveClickHandler = useCallback(() => {
    changeTodolistFilter({id: todolist.id, filter: 'active'})
  }, [changeTodolistFilter, todolist.id]);

  const onCompletedClickHandler = useCallback(() => {
    changeTodolistFilter({id: todolist.id, filter: 'completed'})
  }, [changeTodolistFilter, todolist.id]);


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

  const renderFilterButton = (
    buttonFilter: FilterValuesType,
    onClick: () => void,
    text: string,
    outlined?: boolean
  ) => {
    const additionalOption = outlined ? 'outlined' : 'contained';

    return (
      <Button
        variant={todolist.filter === buttonFilter ? additionalOption : 'text'}
        color={'primary'}
        onClick={onClick}>
        {text}
      </Button>
    )
  }


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
        {renderFilterButton('all', onAllClickHandler, 'All', true)}
        {renderFilterButton('active', onActiveClickHandler, 'Active')}
        {renderFilterButton('completed', onCompletedClickHandler, 'Completed')}
      </div>
    </div>
  )
});


