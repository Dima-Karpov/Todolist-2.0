import { Dispatch } from 'react';
import { v1 } from 'uuid';
import { todolistApi, TodolistType } from '../dal/todolists-api';
import { fetchTasks } from './task-reducer';

export const todolistId1 = v1();
export const todolistId2 = v1();

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
};

const initialState: TodolistDomainType[] = [];

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'TODOLIST/REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'TODOLIST/ADD-TODOLIST':
            const newTodolist: TodolistDomainType = {
                id: action.id,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0,
            }
            return [newTodolist, ...state]
        case 'TODOLIST/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? { ...tl, title: action.title } : tl)
        case 'TODOLIST/CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? { ...tl, filter: action.filter } : tl)
        case 'TODOLIST/SET-TODOLISTS':
            return action.todolist.map(tl => {
                return {...tl, filter: 'all'}
            })
        default:
            return state
    }

};


// action
export const removeTodolistAC = (id: string) => ({ type: 'TODOLIST/REMOVE-TODOLIST', id } as const);
export const addTodolistAC = (title: string) => ({ type: 'TODOLIST/ADD-TODOLIST', title, id: v1() } as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({ type: 'TODOLIST/CHANGE-TODOLIST-TITLE', id, title } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({ type: 'TODOLIST/CHANGE-TODOLIST-FILTER', id, filter } as const);
export const setTodolists = (todolist: TodolistType[]) => ({ type: 'TODOLIST/SET-TODOLISTS', todolist } as const);

// thunk
export const fetchTodolist = () => async (dispatch: ThunkDispatch | any) => {
    try{
        // status
        const res = await todolistApi.getTodo()
        dispatch(setTodolists(res.data));
        res.data.forEach(tl => dispatch(fetchTasks(tl.id)))
         // status
        return res.data;
    } catch(e: any){

    }
};
export const removeTodolist = (todolistId: string) => async (dispatch: ThunkDispatch) => {
    try {
        // statys
        const res = await todolistApi.deletTodo(todolistId)
        // status
    } catch {

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
    | SetTodolistasAT

type ThunkDispatch = Dispatch<ActionsType>