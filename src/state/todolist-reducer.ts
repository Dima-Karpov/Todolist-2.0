import { TodolistType, todolistId1, todolistId2, FilterValuesType } from "../App";
import { v1 } from 'uuid';

export type AddTodolistAT = | ReturnType<typeof addTodolist>
export type RemoveTodolistAT = | ReturnType<typeof removeTodolist>
type ActionsType =
    RemoveTodolistAT
    | AddTodolistAT
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>


const initialState: TodolistType[] = [
    { id: todolistId1, title: 'Learn Programming', filter: 'all' },
    { id: todolistId2, title: 'Learn English', filter: 'all' },
]

export const todolistReducer = (state: TodolistType[] = initialState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'TODOLIST/REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'TODOLIST/ADD-TODOLIST':
            const newTodolist: TodolistType = {
                id: action.id,
                title: action.title,
                filter: 'all'
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

export const removeTodolist = (id: string) => ({ type: 'TODOLIST/REMOVE-TODOLIST', id } as const);
export const addTodolist = (title: string) => ({ type: 'TODOLIST/ADD-TODOLIST', title, id: v1() } as const);
export const changeTodolistTitle = (id: string, title: string) => ({ type: 'TODOLIST/CHANGE-TODOLIST-TITLE', id, title } as const);
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => ({ type: 'TODOLIST/CHANGE-TODOLIST-FILTER', id, filter } as const);