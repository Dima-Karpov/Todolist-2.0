import { TaskType, todolistId1, todolistId2, TasksStateType } from "../App";
import { v1 } from 'uuid';
import { AddTodolistAT, RemoveTodolistAT } from "./todolist-reducer";

type ActionsType = 
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTitleAC>
    | AddTodolistAT
    | RemoveTodolistAT


const initialState: TasksStateType = {
    [todolistId1]: [
        { id: v1(), title: 'HTML', isDone: true },
        { id: v1(), title: 'CSS', isDone: true },
        { id: v1(), title: 'React', isDone: false },
    ],
    [todolistId2]: [
        { id: v1(), title: 'HTML', isDone: true },
        { id: v1(), title: 'CSS', isDone: true },
        { id: v1(), title: 'React', isDone: false },
    ]
};

export const taskReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'TASK/REMOVE-TASK':
            state[action.todolistId] = state[action.todolistId].filter(t => t.id !== action.id);
            return { ...state };
        case 'TASK/ADD-TASK':
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                isDone: false,
            };
            return { ...state, [action.todolistId]: [newTask, ...state[action.todolistId]] };
        case 'TASK/CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id ? { ...t, isDone: action.isDone } : t)
            }
        case 'TASK/CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id ? { ...t, title: action.title } : t)
            }
        case 'TODOLIST/ADD-TODOLIST': {
            const stateCopy = { ...state };
            stateCopy[action.id] = [];
            return stateCopy
        }
        case 'TODOLIST/REMOVE-TODOLIST': {
            const stateCopy = { ...state };
            delete stateCopy[action.id];
            return stateCopy
        }
        default:
            return state
    }

};

export const removeTaskAC = (id: string, todolistId: string) => ({ type: 'TASK/REMOVE-TASK', id, todolistId } as const);
export const addTaskAC = (title: string, todolistId: string) => ({ type: 'TASK/ADD-TASK', title, todolistId } as const);
export const changeStatusAC = (id: string, isDone: boolean, todolistId: string) => ({ type: 'TASK/CHANGE-TASK-STATUS', id, isDone, todolistId } as const);
export const changeTitleAC = (id: string, title: string, todolistId: string) => ({ type: 'TASK/CHANGE-TASK-TITLE', id, title, todolistId } as const);