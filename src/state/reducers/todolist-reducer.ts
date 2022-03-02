import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {todolistApi, TodolistType} from '../../dal/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus, RequestStatusType} from './app-reducer';
import {fetchTasks} from './task-reducer';


export const fetchTodolist = createAsyncThunk('todolists/fetchTodolist', async (param, thunkAPI) => {
    try
    {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}));
        const res = await todolistApi.getTodo();
        res.data.forEach(tl => thunkAPI.dispatch(fetchTasks(tl.id)));
        return res.data;
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
});
export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (param: {todoListId: string}, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}));
        thunkAPI.dispatch(changeTodolistEntityStatus({id: param.todoListId, status: 'loading'}));
        await todolistApi.deletTodo(param.todoListId);
        return {id: param.todoListId};
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
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
        const res = await todolistApi.updateTodo(param.todolistId, param.title);
        if (res.data.resultCode === 0) {
           return {id: param.todolistId, title: param.title};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
        thunkAPI.dispatch(setAppStatus({status: 'failed'}));
        return thunkAPI.rejectWithValue({});
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
});
export const addTodolist = createAsyncThunk('todolists/addTodolist', async (param: {title: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    try
    {
        const res = await todolistApi.createTodo(param.title);
        if (res.data.resultCode === 0) {
            return {todolist: res.data.data.item};
        } else{
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        thunkAPI.dispatch(setAppStatus({status: 'failed'}));
        return thunkAPI.rejectWithValue({});
    } finally {
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
        });
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(todolist => todolist.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].title = action.payload.title;
        });

    },
});

export const todolistReducer = slice.reducer
export const {
    changeTodolistFilter,
    changeTodolistEntityStatus,
            } = slice.actions;


export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};


