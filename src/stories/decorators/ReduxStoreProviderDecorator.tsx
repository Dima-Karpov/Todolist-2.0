import React from 'react';
import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux';

import { v1 } from 'uuid';
import {TaskPriorities, TaskType, TaskStatuses} from '../../dal/todolists-api';
import {appReducer} from '../../state/reducers/app-reducer';
import { taskReducer } from '../../state/reducers/task-reducer';
import { todolistReducer } from '../../state/reducers/todolist-reducer';


type FilterValueTpe = 'all' | 'active' | 'completed';
type TodoListType = {
    id: string
    title: string
    filter: FilterValueTpe
    entityStatus: StatusType
    addedDate: string
    order: number
};
type TaskStateType = {
    [key: string]: TaskType[]
};
type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppStateType = {
    status: StatusType,
    error: string | null,
};
type AppRootStateType = {
    todolists: Array<TodoListType>;
    tasks: TaskStateType;
    app: AppStateType;
};

const rootReducer = combineReducers({
    tasks: taskReducer,
    todolists: todolistReducer,
    app: appReducer,
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        { id: 'todolistId1', title: 'Learn Programming', filter: 'all',
         entityStatus: 'idle', addedDate: '', order: 0 },
        { id: 'todolistId2', title: 'Learn English', filter: 'all', 
        entityStatus: 'loading', addedDate: '', order: 0 },
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML', status: TaskStatuses.Completed, todoListId: 'todolistId1', 
            description: '', startDate: '', deadline: '', addedDate: '', order: 0 , 
            priority: TaskPriorities.Low },
           
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'HTML', status: TaskStatuses.Completed, todoListId: 'todolistId1', 
            description: '', startDate: '', deadline: '', addedDate: '', order: 0 , 
            priority: TaskPriorities.Low },
           
        ],
       
    },
    app: {
        error: null,
        status: 'idle'
    },
};
//@ts-ignore
export const storyBookStore = createStore(
    rootReducer, 
    initialGlobalState as AppRootStateType, 
    );

export const ReduxStoreProviderDecorator = (storyFn: any) => (
     <Provider store={storyBookStore}>{storyFn()}</Provider>
);