import {Dispatch} from 'redux';
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from '../../dal/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {AppRootStateType} from '../store';
import {addNewTodolist, killTodolist, setTodolists} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk('task/fethcTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    try
    {
        const res = await todolistApi.getTasks(todolistId);
        const tasks = res.data.items;
        return {todolistId, tasks};
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }
});
export const deletTask = createAsyncThunk('task/deletTask', async (param: {todolistId: string, id: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try
    {
        await todolistApi.deletTask(param.todolistId, param.id);
        return {todolistId: param.todolistId, id: param.id};
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const addTask = createAsyncThunk('task/addTask', async (param: {todolistId: string, title: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistApi.addTask(param.todolistId, param.title);
        if (res.data.resultCode === 0) {
            return res.data.data.item
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const updateTask = createAsyncThunk('task/updateTask', async (
    param: {todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType},
    thunkAPI) => {

    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        let state = thunkAPI.getState() as AppRootStateType;
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
        if (!task) {
            return thunkAPI.rejectWithValue('task no found in the state');
        };
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.domainModel
        };
        const res = await todolistApi.updateTask(param.todolistId, param.taskId, apiModel);
        if (res.data.resultCode === 0) {
            return param;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }
});

const slice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewTodolist, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach((todolist: any) => {
                state[todolist.id] = [];
            });
        });
        builder.addCase(killTodolist, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            if (action.payload)
            {
                state[action.payload.todolistId] = action.payload.tasks;
            }
        });
        builder.addCase(deletTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(task => task.id === action.payload?.id);
                if (index > -1) {
                    tasks.splice(index, 1);
                }
            }
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel};
            }
        });
    },
});

export const taskReducer = slice.reducer;

export type TasksStateType = {
    [key: string]: TaskType[]
};
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
};


export type ErrorType = {
    config: any
    isAxiosError: boolean
    request: any
    response: any
    toJSON: any
    message: string
    stack: string
}