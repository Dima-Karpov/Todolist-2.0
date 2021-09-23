import { TodolistType, todolistId1, todolistId2, FilterValuesType } from "../App";
import { v1 } from 'uuid';

type ActionsType = ReturnType<typeof removeTodolist>
    | ReturnType<typeof addTodolist>
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>


const initialState: TodolistType[] = [
    { id: todolistId1, title: 'Learn Programming', filter: 'all' },
    { id: todolistId2, title: 'Learn English', filter: 'all' },
]

export const todolistReducer = (state: TodolistType[] = initialState, action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            const newTodolist: TodolistType = {
                id: v1(),
                title: action.title,
                filter: 'all'
            }
            return [newTodolist, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId ? { ...tl, title: action.title } : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId ? { ...tl, filter: action.filter } : tl)

        default:
            return state
    }

};

export const removeTodolist = (todolistId: string) => ({ type: 'REMOVE-TODOLIST', todolistId } as const);
export const addTodolist = (title: string) => ({ type: 'ADD-TODOLIST', title } as const);
export const changeTodolistTitle = (todolistId: string, title: string) => ({ type: 'CHANGE-TODOLIST-TITLE', todolistId, title } as const);
export const changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => ({ type: 'CHANGE-TODOLIST-FILTER', todolistId, filter } as const);