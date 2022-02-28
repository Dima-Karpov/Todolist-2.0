import React from 'react';
import { Provider } from 'react-redux';
import {  combineReducers } from 'redux';

import { v1 } from 'uuid';
import {TaskPriorities, TaskType, TaskStatuses} from '../../dal/todolists-api';
import {appReducer} from '../../state/reducers/app-reducer';
import { taskReducer } from '../../state/reducers/task-reducer';
import { todolistReducer } from '../../state/reducers/todolist-reducer';
import { authReducer } from './../../state/reducers/auth-reducer';

import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {HashRouter} from 'react-router-dom';


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
    isInitialized: boolean,
};
type AppAuthType = {
    isLoggedIn: boolean,
};
type AppRootStateType = {
    todolists: Array<TodoListType>;
    tasks: TaskStateType;
    app: AppStateType;
    auth: AppAuthType;
};



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
        status: 'idle',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
    
};

const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
});

//@ts-ignore
export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});

export const ReduxStoreProviderDecorator = (storyFn: any) => (
     <Provider store={storyBookStore}>{storyFn()}</Provider>
);

export const BrowserRouterDecorator = (storyFn: any) => (
    <HashRouter>
        {storyFn()}
    </HashRouter>
);