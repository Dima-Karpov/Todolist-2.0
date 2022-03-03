import {AppRootStateType, ThunkError} from '../store';
import {TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistApi, FieldErrorType} from '../../dal/todolists-api';

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

import {handleServerAppError, handleServerNetworkError, handleAsuncServerNetworkError} from "../../utils/error-utils";
import {setAppStatus} from './app-reducer';
import {todolistsActions} from './todolist-reducer';

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
        return thunkAPI.rejectWithValue({});
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
        return thunkAPI.rejectWithValue({});
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const addTask = createAsyncThunk<
                                        TaskType,
                                        {todolistId: string, title: string},
                                        ThunkError
                                    >('task/addTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try
    {
        const result = await todolistApi.addTask(param.todolistId, param.title);
        if (result.data.resultCode === 0)
        {
            return result.data.data.item
        } else
        {
            handleServerAppError(result.data, thunkAPI.dispatch, false);
            return thunkAPI.rejectWithValue({errors: result.data.messages, fieldsErrors: result.data.fieldsError});
        }
    } catch (error: any)
    {
        return handleAsuncServerNetworkError(error, thunkAPI, false);
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const updateTask = createAsyncThunk('task/updateTask', async (
    param: {todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType},
    thunkAPI) => {

    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try
    {
        let state = thunkAPI.getState() as AppRootStateType;
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
        if (!task)
        {
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
        if (res.data.resultCode === 0)
        {
            return param;
        } else
        {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    } finally
    {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }
});





const slice = createSlice({
    name: 'task',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(todolistsActions.addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(todolistsActions.fetchTodolist.fulfilled, (state, action) => {
            action.payload.forEach((todolist: any) => {
                state[todolist.id] = [];
            });
        });
        builder.addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            if (action.payload)
            {
                state[action.payload.todolistId] = action.payload.tasks;
            }
        });
        builder.addCase(deletTask.fulfilled, (state, action) => {
            if (action.payload)
            {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(task => task.id === action.payload?.id);
                if (index > -1)
                {
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
            if (index > -1)
            {
                tasks[index] = {...tasks[index], ...action.payload.domainModel};
            }
        });
    },
});

export const taskReducer = slice.reducer;

export const selectTask = (state: AppRootStateType) => state.tasks;

export const tasksActions = {updateTask, addTask, fetchTasks, deletTask}

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