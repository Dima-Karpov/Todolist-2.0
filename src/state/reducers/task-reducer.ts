import {Dispatch} from 'redux';
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, TodolistType, UpdateTaskModelType} from '../../dal/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {AppRootStateType} from '../store';
import {addNewTodolist, killTodolist, setTodolists} from "./todolist-reducer";
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TasksStateType = {};

const slice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{todolistId: string, id: string}>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.id);
            if (index > -1)
            {
                tasks.splice(index, 1);
            }
        },
        addNewTask(state, action: PayloadAction<{task: TaskType}>) {
            state[action.payload.task.todoListId].unshift(action.payload.task);
        },
        updateCurrentTask(state, action: PayloadAction<{todolistId: string, id: string, model: UpdateDomainTaskModelType}>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.id);
            if (index > -1)
            {
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        },
        setTasks(state, action: PayloadAction<{todolistId: string, tasks: TaskType[]}>) {
            state[action.payload.todolistId] = action.payload.tasks;
        },
    },
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
    },
});


export const taskReducer = slice.reducer;
export const {
    removeTask,
    addNewTask,
    setTasks,
    updateCurrentTask,
} = slice.actions;

// thunk
export const fetchTasks = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    try
    {
        const res = await todolistApi.getTasks(todolistId);
        const tasks = res.data.items;
        dispatch(setTasks({todolistId, tasks}));
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
    }
};
export const deletTask = (todolistId: string, id: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    try
    {
        await todolistApi.deletTask(todolistId, id);
        dispatch(removeTask({todolistId, id}));

    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
    } finally
    {
        dispatch(setAppStatus({status: 'failed'}))
    }
};
export const addTask = (todolistId: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        try
        {
            const res = await todolistApi.addTask(todolistId, title);
            if (res.data.resultCode === 0)
            {
                dispatch(addNewTask({task: res.data.data.item}));
            } else
            {
                handleServerAppError(res.data, dispatch);
            }
        } catch (error)
        {
            handleServerNetworkError(error, dispatch);
        } finally
        {
            dispatch(setAppStatus({status: 'failed'}))
        }
    };
export const updateTask = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    async (
        dispatch: Dispatch,
        getState: () => AppRootStateType) => {
        dispatch(setAppStatus({status: 'loading'}))
        try
        {
            const state = getState();
            const task = state.tasks[todolistId].find(t => t.id === taskId);
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
                ...domainModel
            };
            const res = await todolistApi.updateTask(todolistId, taskId, apiModel);
            if (res.data.resultCode === 0)
            {
                dispatch(updateCurrentTask({todolistId, id: taskId, model: apiModel}));
            } else
            {
                handleServerAppError(res.data, dispatch);
            }
        } catch (error)
        {
            handleServerNetworkError(error, dispatch);
        } finally
        {
            dispatch(setAppStatus({status: 'failed'}))
        }
    };




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