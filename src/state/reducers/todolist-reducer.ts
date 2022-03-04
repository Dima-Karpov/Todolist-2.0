import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';

import {RequestStatusType, todolistApi, TodolistType} from '../../dal/todolists-api';
import {handleAsuncServerNetworkError, handleAsuncServerAppError} from "../../utils/error-utils";

import {setAppStatus} from "./app-reducer";
import {tasksActions} from './task-reducer';
import {AppRootStateType, ThunkError} from '../types';

export const fetchTodolist = createAsyncThunk<
    TodolistType[],
    undefined,
    ThunkError
>('todolists/fetchTodolist', async (param, thunkAPI) => {
    try
    {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}));
        const res = await todolistApi.getTodo();
        res.data.forEach(tl => thunkAPI.dispatch(tasksActions.fetchTasks(tl.id)));
        return res.data;
    } catch (error: any)
    {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
});
export const removeTodolist = createAsyncThunk<
    {id: string},
    {todoListId: string},
    ThunkError
>('todolists/removeTodolist', async (param: {todoListId: string}, thunkAPI) => {
    try
    {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}));
        thunkAPI.dispatch(changeTodolistEntityStatus({id: param.todoListId, status: 'loading'}));
        await todolistApi.deletTodo(param.todoListId);
        return {id: param.todoListId};
    } catch (error: any)
    {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
});
export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle',
    async (param: {todolistId: string, title: string}, thunkAPI) => {

        thunkAPI.dispatch(setAppStatus({status: 'loading'}));
        try
        {
            const result = await todolistApi.updateTodo(param.todolistId, param.title);
            if (result.data.resultCode === 0)
            {
                return {id: param.todolistId, title: param.title};
            } else
            {
                return handleAsuncServerAppError(result.data, thunkAPI)
            }
        } catch (error: any)
        {
            return handleAsuncServerNetworkError(error, thunkAPI);
        } finally
        {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
        }
    });
export const addTodolist = createAsyncThunk<
    {todolist: TodolistType},
    {title: string},
    ThunkError
>('todolists/addTodolist', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    try
    {
        const result = await todolistApi.createTodo(param.title);
        if (result.data.resultCode === 0)
        {
            return {todolist: result.data.data.item};
        } else
        {
            return handleAsuncServerAppError(result.data, thunkAPI, false)
        }
    } catch (error: any)
    {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
});

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolist.fulfilled, (state, action) => {
            return action.payload.map(todolist => ({...todolist, filter: 'all', entityStatus: 'idle'}));
        })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todolist => todolist.id === action.payload.id);
                if (index > -1)
                {
                    state.splice(index, 1);
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todolist => todolist.id === action.payload.id)
                state[index].title = action.payload.title;
            })

    },
});

export const todolistReducer = slice.reducer
export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions;

export const selectTodolsts = (state: AppRootStateType) => state.todolist;

export const todolistsActions = {addTodolist, changeTodolistTitle, removeTodolist, fetchTodolist, ...slice.actions}

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};


