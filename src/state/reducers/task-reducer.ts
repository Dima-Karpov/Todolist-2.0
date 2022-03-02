import {AppRootStateType} from '../store';
import {TaskPriorities, TaskStatuses, TaskType} from '../../dal/todolists-api';
import {createSlice} from '@reduxjs/toolkit';

import {tasksActions} from './tasks-actions';
import {todolistsActions} from './todolist-actions';



const slice = createSlice({
    name: 'task',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(todolistsActions.addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(todolistsActions.fetchTodolist.fulfilled, (state, action) => {
            action.payload.forEach((todolist: any) => {
                state[todolist.id] = [];
            });
        });
        builder.addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(tasksActions.fetchTasks.fulfilled, (state, action) => {
            if (action.payload)
            {
                state[action.payload.todolistId] = action.payload.tasks;
            }
        });
        builder.addCase(tasksActions.deletTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(task => task.id === action.payload?.id);
                if (index > -1) {
                    tasks.splice(index, 1);
                }
            }
        });
        builder.addCase(tasksActions.addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(tasksActions.updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(task => task.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel};
            }
        });
    },
});

export const taskReducer = slice.reducer;

export const selectTask = (state: AppRootStateType) => state.tasks;

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