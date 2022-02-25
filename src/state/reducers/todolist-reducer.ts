import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {todolistApi, TodolistType} from '../../dal/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus, RequestStatusType} from './app-reducer';
import {fetchTasks} from './task-reducer';

export const todolistId1 = v1();
export const todolistId2 = v1();

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};

const initialState: TodolistDomainType[] = [];


const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        killTodolist(state, action: PayloadAction<{id: string}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id);
            if(index > -1){
                state.slice(index, 1);
            }
        },
        addNewTodolist(state, action: PayloadAction<{todolist: TodolistType}>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        },
        changeTodolistsTitle(state, action: PayloadAction<{id: string, title: string}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].title = action.payload.title;
        },
        changeTodolistFilter(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].filter = action.payload.filter;
        },
        setTodolists(state, action: PayloadAction<{todolists: TodolistType[]}>) {
            return action.payload.todolists.map(todolist => ({...todolist, filter: 'all', entityStatus: 'idle'}));
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].entityStatus = action.payload.status;
        },
    },
});

export const todolistReducer = slice.reducer
export const {
    killTodolist,
    addNewTodolist,
    changeTodolistsTitle,
    changeTodolistFilter,
    setTodolists,
    changeTodolistEntityStatus,
} = slice.actions;


// thunk
export const fetchTodolist = () => async (dispatch: Dispatch | any) => {
    try
    {
        dispatch(setAppStatus({status: 'loading'}));
        const res = await todolistApi.getTodo();
        dispatch(setTodolists({todolists: res.data}));
        res.data.forEach(tl => dispatch(fetchTasks(tl.id)));
        dispatch(setAppStatus({status: 'succeeded'}));
        return res.data;
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
    } finally
    {
        dispatch(setAppStatus({status: 'succeeded'}));
    }
};
export const removeTodolist = (todoListId: string) => async (dispatch: Dispatch) => {
    try
    {
        dispatch(setAppStatus({status: 'loading'}));
        dispatch(changeTodolistEntityStatus({id: todoListId, status: 'loading'}))
        await todolistApi.deletTodo(todoListId);
        dispatch(killTodolist({id: todoListId}));
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
        dispatch(setAppStatus({status: 'failed'}));
    } finally
    {
        dispatch(setAppStatus({status: 'succeeded'}));
    }
};
export const addTodolist = (title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}));
    try
    {
        const res = await todolistApi.createTodo(title);
        if (res.data.resultCode === 0)
        {
            dispatch(addNewTodolist({todolist: res.data.data.item}))
        } else
        {
            handleServerAppError(res.data, dispatch);
        }
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
        dispatch(setAppStatus({status: 'failed'}));
    } finally
    {
        dispatch(setAppStatus({status: 'succeeded'}));
    }
};
export const changeTodolistTitle = (todolistId: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatus({status: 'loading'}));
        try
        {
            const res = await todolistApi.updateTodo(todolistId, title);
            if (res.data.resultCode === 0)
            {
                dispatch(changeTodolistsTitle({id: todolistId,  title}));
            } else
            {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setAppStatus({status: 'succeeded'}));
        } catch (error)
        {
            handleServerNetworkError(error, dispatch);
            dispatch(setAppStatus({status: 'failed'}));
        } finally
        {
            dispatch(setAppStatus({status: 'succeeded'}));
        }
    }

export type AddTodolistAT = | ReturnType<typeof addNewTodolist>
export type RemoveTodolistAT = | ReturnType<typeof killTodolist>
export type SetTodolistasAT = | ReturnType<typeof setTodolists>

