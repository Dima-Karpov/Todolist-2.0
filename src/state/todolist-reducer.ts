import { v1 } from 'uuid';
import { TodolistType } from '../dal/todolists-api';

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

        default:
            return state
    }

};

export const removeTodolistAC = (id: string) => ({ type: 'TODOLIST/REMOVE-TODOLIST', id } as const);
export const addTodolistAC = (title: string) => ({ type: 'TODOLIST/ADD-TODOLIST', title, id: v1() } as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({ type: 'TODOLIST/CHANGE-TODOLIST-TITLE', id, title } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({ type: 'TODOLIST/CHANGE-TODOLIST-FILTER', id, filter } as const);



export type AddTodolistAT = | ReturnType<typeof addTodolistAC>
export type RemoveTodolistAT = | ReturnType<typeof removeTodolistAC>
type ActionsType =
    RemoveTodolistAT
    | AddTodolistAT
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>