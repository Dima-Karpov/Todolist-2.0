import axios, { AxiosResponse } from 'axios';

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '9e8978ae-0246-4c6d-84c4-bc28bfa5ba72',
    },
})

export const todolistApi = {
    getTodo() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodo(title: string) {
        return instance.post<{ title: string }, AxiosResponse<CommonResponseType<{ item: TodolistType }>>>('todo-lists', { title })
    },
    deletTodo(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodo(todoListId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<CommonResponseType<{ item: TodolistType }>>>(`todo-lists/${todoListId}`, { title })
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<CommonResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, { title })
    },
    deletTask(todolistId: string, taskId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<{},
            AxiosResponse<CommonResponseType<TaskType>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
};



export type CommonResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldError: string[]
    data: T
};
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
};
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
};
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
};
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
};
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    // entityStatus: RequestStatusType
};
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
};
export type RequestStatusType = 'loading' | 'idle' | 'succeeded' | 'failed';