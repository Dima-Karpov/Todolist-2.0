import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistApi} from '../../dal/todolists-api';

import {setAppStatus} from './app-reducer';
import {todolistsActions} from './todolist-reducer';

import {AppRootStateType, ThunkError} from '../types';
import {handleAsuncServerNetworkError, handleAsuncServerAppError} from "../../utils/error-utils";


export const fetchTasks = createAsyncThunk<{ todolistId: string, tasks: TaskType[] },
    string,
    ThunkError>('task/fetchTasks', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistApi.getTasks(todolistId);
        const tasks = res.data.items;
        return {todolistId, tasks};
    } catch (error: any) {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }
});
export const deletTask = createAsyncThunk<{ todolistId: string, id: string },
    { todolistId: string, id: string },
    ThunkError>('task/deletTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        await todolistApi.deletTask(param.todolistId, param.id);
        return {todolistId: param.todolistId, id: param.id};
    } catch (error: any) {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const addTask = createAsyncThunk<TaskType,
    { todolistId: string, title: string },
    ThunkError>('task/addTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const result = await todolistApi.addTask(param.todolistId, param.title);
        if (result.data.resultCode === 0) {
            return result.data.data.item
        } else {
            return handleAsuncServerAppError(result.data, thunkAPI, false);
        }
    } catch (error: any) {
        return handleAsuncServerNetworkError(error, thunkAPI, false);
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    }

});
export const updateTask = createAsyncThunk<{ todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
    { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
    ThunkError>('task/updateTask', async (
    param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
    thunkAPI) => {

    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        let state = thunkAPI.getState() as AppRootStateType;
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
        if (!task) {
            return thunkAPI.rejectWithValue({errors: ['task no found in the state']});
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.domainModel
        };
        const result = await todolistApi.updateTask(param.todolistId, param.taskId, apiModel);
        if (result.data.resultCode === 0) {
            return param;
        } else {
            return handleAsuncServerAppError(result.data, thunkAPI)
        }
    } catch (error: any) {
        return handleAsuncServerNetworkError(error, thunkAPI);
    } finally {
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
        })
            .addCase(todolistsActions.fetchTodolist.fulfilled, (state, action) => {
                action.payload.forEach((todolist: any) => {
                    state[todolist.id] = [];
                });
            })
            .addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolistId] = action.payload.tasks;
                }
            })
            .addCase(deletTask.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex(task => task.id === action.payload?.id);
                    if (index > -1) {
                        tasks.splice(index, 1);
                    }
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(task => task.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel};
                }
            })
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
