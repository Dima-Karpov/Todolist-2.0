import {Dispatch} from 'react';
import {v1} from 'uuid';
import {todolistApi, TodolistType} from '../dal/todolists-api';
import {SetErrorType, setAppStatus, SetStatusType, RequestStatusType} from './app-reducer';
import {fetchTasks} from './task-reducer';

export const todolistId1 = v1();
export const todolistId2 = v1();

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};

const initialState: TodolistDomainType[] = [];

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type)
    {
        case 'TODOLIST/REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'TODOLIST/ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'TODOLIST/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'TODOLIST/CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case 'TODOLIST/SET-TODOLISTS':
            return action.todolist.map(tl => {
                return {...tl, filter: 'all', entityStatus: 'idle'}
            })
        default:
            return state
    }
};


// action
export const removeTodolistAC = (id: string) =>
    ({type: 'TODOLIST/REMOVE-TODOLIST', id} as const);
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'TODOLIST/ADD-TODOLIST', todolist} as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'TODOLIST/CHANGE-TODOLIST-TITLE', id, title} as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'TODOLIST/CHANGE-TODOLIST-FILTER', id, filter} as const);
export const setTodolists = (todolist: TodolistType[]) =>
    ({type: 'TODOLIST/SET-TODOLISTS', todolist} as const);
export const changeTodolistEntityStatus = (id: string, status: RequestStatusType) =>
    ({type: 'TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS', id, status} as const);

// thunk
export const fetchTodolist = () => async (dispatch: ThunkDispatch | any) => {
    try
    {
        dispatch(setAppStatus('loading'));
        const res = await todolistApi.getTodo();
        dispatch(setTodolists(res.data));
        res.data.forEach(tl => dispatch(fetchTasks(tl.id)));
        dispatch(setAppStatus('succeeded'));
        return res.data;
    } catch (e: any)
    {

    }
};
export const removeTodolist = (todoListId: string) => async (dispatch: ThunkDispatch) => {
    try
    {
        dispatch(setAppStatus('loading'));
        dispatch(changeTodolistEntityStatus(todoListId, 'loading'))
        await todolistApi.deletTodo(todoListId);
        dispatch(removeTodolistAC(todoListId));
        dispatch(setAppStatus('succeeded'));
    } catch (e: any)
    {

    }
};
export const addTodolist = (title: string) => async (dispatch: ThunkDispatch) => {
    try
    {
        dispatch(setAppStatus('loading'));
        const res = await todolistApi.createTodo(title);
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatus('succeeded'));
    } catch (e: any)
    {

    }
};
export const changeTodolistTitle = (todolistId: string, title: string) =>
    async (dispatch: ThunkDispatch) => {
        try
        {
            dispatch(setAppStatus('loading'));
            todolistApi.updateTodo(todolistId, title);
            dispatch(changeTodolistTitleAC(todolistId, title));
            dispatch(setAppStatus('succeeded'));
        } catch (e: any)
        {

        }
    }

export type AddTodolistAT = | ReturnType<typeof addTodolistAC>
export type RemoveTodolistAT = | ReturnType<typeof removeTodolistAC>
export type SetTodolistasAT = | ReturnType<typeof setTodolists>
type ActionsType =
    RemoveTodolistAT
    | AddTodolistAT
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatus>
    | SetTodolistasAT

type ThunkDispatch = Dispatch<ActionsType | SetErrorType | SetStatusType>