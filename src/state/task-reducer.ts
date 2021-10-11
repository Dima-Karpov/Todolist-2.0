import { v1 } from 'uuid';
import { Dispatch } from 'react';
import { TaskPriorities, TaskStatuses, TaskType, todolistApi } from '../dal/todolists-api';
import { AddTodolistAT, RemoveTodolistAT, SetTodolistasAT } from "./todolist-reducer";

const initialState: TasksStateType = {};

export const taskReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'TASK/REMOVE-TASK':
            state[action.todolistId] = state[action.todolistId].filter(t => t.id !== action.id);
            return { ...state };
        case 'TASK/ADD-TASK':
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                todoListId: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                description: '',
            };
            return { ...state, [action.todolistId]: [newTask, ...state[action.todolistId]] };
        case 'TASK/CHANGE-TASK-STATUS':
             return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.id ? { ...t, ...action.model } : t)
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
        case 'TODOLIST/SET-TODOLISTS': {
            const copyState = { ...state }
            action.todolist.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState
        }
        case 'TASK/SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }

};

// action
export const removeTaskAC = (todolistId: string, id: string) => ({ type: 'TASK/REMOVE-TASK', todolistId, id } as const);
export const addTaskAC = (title: string, todolistId: string) => ({ type: 'TASK/ADD-TASK', title, todolistId } as const);
export const changeStatusAC = (id: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({ type: 'TASK/CHANGE-TASK-STATUS', id, model, todolistId } as const);
export const changeTitleAC = (id: string, title: string, todolistId: string) =>
    ({ type: 'TASK/CHANGE-TASK-TITLE', id, title, todolistId } as const);
export const setTasks = (todolistId: string, tasks: TaskType[]) => ({type: 'TASK/SET-TASKS', todolistId, tasks} as const);

// thunk

export const fetchTasks = (todolistId: string) => async (dispatch: ThunkDispatch ) => {
    try{
        // status
        const res = await todolistApi.getTasks(todolistId);
        const tasks = res.data.items;
        dispatch(setTasks(todolistId, tasks));
        // status
    } catch(e: any){

    }
}
export const deletTask = (todolistId: string, id: string) => async (dispatch: ThunkDispatch) => {
    try{
        // status
        await todolistApi.deletTask(todolistId, id)
        dispatch(removeTaskAC(todolistId, id))
        // status
    } catch{

    }
}
export const addTask = () => {}



type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTitleAC>
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistasAT
    | ReturnType<typeof setTasks>

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

type ThunkDispatch = Dispatch<ActionsType>