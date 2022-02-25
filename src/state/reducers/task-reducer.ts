import {Dispatch} from 'react';
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from '../../dal/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {SetErrorType, setAppStatus, SetStatusType} from './app-reducer';
import {AppRootStateType} from '../store';
import {addNewTodolist, AddTodolistAT, killTodolist, RemoveTodolistAT, SetTodolistasAT, setTodolists} from "./todolist-reducer";

const initialState: TasksStateType = {};

export const taskReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
    switch (action.type)
    {
        case 'TASK/REMOVE-TASK':
            state[action.todolistId] = state[action.todolistId].filter(t => t.id !== action.id);
            return {...state};
        case 'TASK/ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]};
        case 'TASK/CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.id ? {...t, ...action.model} : t)
            }
        case 'TASK/CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id ? {...t, title: action.title} : t)
            }
        case 'TASK/UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id ? {...t, ...action.model} : t)
            }
        case addNewTodolist.type:
            return {...state, [action.payload.todolist.id]: []}
        case killTodolist.type: {
            const stateCopy = {...state};
            delete stateCopy[action.payload.id];
            return stateCopy
        }
        case setTodolists.type: {
            const copyState = {...state}
            action.payload.todolist.forEach((tl: any) => {
                copyState[tl.id] = [];
            })
            return copyState
        }
        case 'TASK/SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
};

// action
export const removeTaskAC = (todolistId: string, id: string) =>
    ({type: 'TASK/REMOVE-TASK', todolistId, id} as const);
export const addTaskAC = (task: TaskType) =>
    ({type: 'TASK/ADD-TASK', task} as const);
export const changeStatusAC = (id: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'TASK/CHANGE-TASK-STATUS', id, model, todolistId} as const);
export const changeTitleAC = (id: string, title: string, todolistId: string) =>
    ({type: 'TASK/CHANGE-TASK-TITLE', id, title, todolistId} as const);
export const setTasks = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'TASK/SET-TASKS', todolistId, tasks} as const);
export const updateTaskAC = (todolistId: string, id: string, model: UpdateDomainTaskModelType) =>
    ({type: 'TASK/UPDATE-TASK', todolistId, id, model} as const);

// thunk
export const fetchTasks = (todolistId: string) => async (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    try
    {
        const res = await todolistApi.getTasks(todolistId);
        const tasks = res.data.items;
        dispatch(setTasks(todolistId, tasks));
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
    }
};
export const deletTask = (todolistId: string, id: string) => async (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    try
    {
        await todolistApi.deletTask(todolistId, id);
        dispatch(removeTaskAC(todolistId, id));
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error)
    {
        handleServerNetworkError(error, dispatch);
    } finally
    {
        dispatch(setAppStatus({status: 'failed'}))
    }
};
export const addTask = (todolistId: string, title: string) =>
    async (dispatch: ThunkDispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        try
        {
            const res = await todolistApi.addTask(todolistId, title);
            if (res.data.resultCode === 0)
            {
                dispatch(addTaskAC(res.data.data.item));
            } else
            {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setAppStatus({status: 'succeeded'}))
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
        dispatch: ThunkDispatch,
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
                dispatch(updateTaskAC(todolistId, taskId, apiModel));
            } else
            {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setAppStatus({status: 'succeeded'}))
        } catch (error)
        {
            handleServerNetworkError(error, dispatch);
        } finally
        {
            dispatch(setAppStatus({status: 'failed'}))
        }
    };


type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTitleAC>
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistasAT
    | ReturnType<typeof setTasks>
    | ReturnType<typeof updateTaskAC>

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

type ThunkDispatch = Dispatch<ActionsType | SetErrorType | SetStatusType>

export type ErrorType = {
    config: any
    isAxiosError: boolean
    request: any
    response: any
    toJSON: any
    message: string
    stack: string
}