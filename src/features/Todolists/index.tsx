import React, {FC, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

import {AddItemForm, AddItemFromSubmitHelperType} from '../../components/AddItemForm';
import {Todolist} from './Todolist';

import {selectTodolsts, TodolistDomainType, todolistsActions} from '../../state/reducers/todolist-reducer';
import {selectTask} from '../../state/reducers/task-reducer';
import {selectIsLoggedIn} from '../../state/reducers/auth-reducer';

import Grid from '@mui/material/Grid';

import {useActions} from '../../state/hooks/useActions';
import {useAppDispatch} from '../../utils/redux-utils';
import {someError, emptyString} from "../../consts";
import {login} from "../../endpoints";


export const TodolistList: FC = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const todolists: TodolistDomainType[] = useSelector(selectTodolsts);
    const tasks = useSelector(selectTask);

    const {fetchTodolist} = useActions(todolistsActions);

    const addTodolistCallback = useCallback(async (param: { title: string }, helper: AddItemFromSubmitHelperType) => {

        const resultAction = await dispatch(todolistsActions.addTodolist({title: param.title}));

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {

                const errorMessage = resultAction.payload?.errors[0];
                helper.setError(errorMessage);
            } else {
                helper.setError(someError);
            }
        } else {
            helper.setTitle(emptyString);
        }
    }, [dispatch])

    useEffect(() => {
        if (!todolists.length) {
            fetchTodolist();
        }
    }, [todolists, fetchTodolist]);


    if (!isLoggedIn) {
        return <Navigate to={login}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px 0px'}}>
                <AddItemForm addItem={addTodolistCallback}/>
            </Grid>
            <Grid container spacing={7} style={{flexWrap: 'nowrap', overflowX: 'auto', paddingRight: '10px'}}>
                {todolists.length ? todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return (
                        <Grid item key={tl.id}>
                            <div
                                style={{width: '300px'}}
                            >
                                <Todolist
                                    key={tl.id}
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                />
                            </div>
                        </Grid>
                    )
                }) : <></>}
            </Grid>
        </>
    )
}