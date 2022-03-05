import React, {useCallback, useEffect} from 'react';
import './index.css';

import {useDispatch} from 'react-redux';

import {updateTask} from "../../../state/reducers/task-reducer";
import {changeTodolistFilterAC, TodolistDomainType} from "../../../state/reducers/todolist-reducer";

import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";

import {TaskStatuses, TaskType} from "../../../dal/todolists-api";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {addTask, fetchTasks, removeTask} from "../../../state/reducers/tasks-sagas";
import {changeTodolistTitle, removeTodolist} from '../../../state/reducers/todolist-sagas';


type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: TaskType[]
};

export const Todolist: React.FC<TodolistPropsType> = React.memo((props) => {
    const {todolist, tasks,} = props;
    const dispatch = useDispatch();

    const onAllClickHandler = useCallback(
        () => dispatch(changeTodolistFilterAC(todolist.id, 'all')), [dispatch, todolist.id]);
    const onActiveClickHandler = useCallback(
        () => dispatch(changeTodolistFilterAC(todolist.id, 'active')), [dispatch, todolist.id]);
    const onCompletedClickHandler = useCallback(
        () => dispatch(changeTodolistFilterAC(todolist.id, 'completed')), [dispatch, todolist.id]);

    const deleteUnnecessaryTodolsit = useCallback(() => {
        dispatch(removeTodolist(todolist.id));
    }, [dispatch, todolist.id]);
    const replaceNewTitleTodolsit = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitle(todolist.id, newTitle));
    }, [dispatch, todolist.id]);


    const killTask = useCallback((todolistId: string, id: string) => {
        dispatch(removeTask(todolistId, id))
    }, [dispatch]);

    const onChangeTitleHandler = useCallback((todolistId: string, taskId: string, newTitle: string) =>
        dispatch(updateTask(todolistId, taskId, {title: newTitle})), [dispatch]);

    const onChangeStatusHandler = useCallback((todolistId: string, taskId: string, status: TaskStatuses) =>
        dispatch(updateTask(todolistId, taskId, {status})), [dispatch]);

    const addTasks = useCallback((todolistId: string, title: string) => {
        dispatch(addTask(todolistId, title));
    }, [dispatch]);

    const addNewTask = useCallback((title: string) => {
        addTasks(todolist.id, title);
    }, [addTasks, todolist.id]);

    const getTasksForTodoList = useCallback(() => {
        switch (todolist.filter) {
            case 'completed':
                return tasks.filter(t => t.status === TaskStatuses.New)
            case 'active':
                return tasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return tasks
        }
    }, [todolist.filter, tasks]);

    useEffect(() => {
        dispatch(fetchTasks(todolist.id))
    }, [dispatch])


    let newTasks = getTasksForTodoList();
    const сurrentTasks = newTasks.map(t => <Task
        key={t.id} task={t} todolistId={todolist.id}
        onChangeTitleHandler={onChangeTitleHandler}
        removeTask={killTask}
        onChangeStatusHandler={onChangeStatusHandler}/>);


    return (
        <div>
            <h3>
                <EditableSpan title={todolist.title} onChange={replaceNewTitleTodolsit}/>
                <IconButton
                    color={'success'}
                    size="medium" onClick={deleteUnnecessaryTodolsit}
                    disabled={todolist.entityStatus === 'loading'}
                >
                    <DeleteIcon fontSize="inherit"/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addNewTask} disabled={todolist.entityStatus === 'loading'}/>

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


