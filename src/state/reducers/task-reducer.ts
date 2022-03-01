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
    try
    {
        const res = await todolistApi.addTask(param.todolistId, param.title);
        if (res.data.resultCode === 0)
        {
            return {task: res.data.data.item}
        } else
        {
            handleServerAppError(res.data, thunkAPI.dispatch);
        }
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
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
        let state: any = thunkAPI.getState();
        const task = state.tasks[param.todolistId].find((t: TaskType) => t.id === param.taskId);
        if (!task)
        {
            console.warn('task no found in the state');
            return
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
            return {todolistId: param.todolistId, id: param.taskId, model: apiModel};
        } else
        {
            handleServerAppError(res.data, thunkAPI.dispatch);
        }
    } catch (error)
    {
        handleServerNetworkError(error, thunkAPI.dispatch);
    } finally
    {
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
            if (action.payload)
            {
                state[action.payload.task.todoListId].unshift(action.payload.task);
            }
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            if (action.payload)
            {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(task => task.id === action.payload?.id);
                if (index > -1)
                {
                    tasks[index] = {...tasks[index], ...action.payload.model};
                }
            }
        });
    },
});


export const taskReducer = slice.reducer;

// thunk
// export const updateTask = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
//     async (
//         dispatch: Dispatch,
//         getState: () => AppRootStateType) => {
//         dispatch(setAppStatus({status: 'loading'}))
//         try
//         {
//             const state = getState();
//             const task = state.tasks[todolistId].find(t => t.id === taskId);
//             if (!task)
//             {
//                 console.warn('task no found in the state');
//                 return
//             };
//             const apiModel: UpdateTaskModelType = {
//                 title: task.title,
//                 description: task.description,
//                 status: task.status,
//                 priority: task.priority,
//                 startDate: task.startDate,
//                 deadline: task.deadline,
//                 ...domainModel
//             };
//             const res = await todolistApi.updateTask(todolistId, taskId, apiModel);
//             if (res.data.resultCode === 0)
//             {
//                 dispatch(updateCurrentTask({todolistId, id: taskId, model: apiModel}));
//             } else
//             {
//                 handleServerAppError(res.data, dispatch);
//             }
//         } catch (error)
//         {
//             handleServerNetworkError(error, dispatch);
//         } finally
//         {
//             dispatch(setAppStatus({status: 'failed'}))
//         }
//     };




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