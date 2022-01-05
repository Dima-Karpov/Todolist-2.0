import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { v1 } from 'uuid';
import {appReducer} from '../../state/app-reducer';
import { taskReducer } from '../../state/task-reducer';
import { todolistReducer } from '../../state/todolist-reducer';

type TaskType = {
    id: string
    title: string
    isDone: boolean
};
type FilterValueTpe = 'all' | 'active' | 'completed';
type TodoListType = {
    id: string
    title: string
    filter: FilterValueTpe
};
type TaskStateType = {
    [key: string]: TaskType[]
};

type AppStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
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
        { id: 'todolistId1', title: 'Learn Programming', filter: 'all' },
        { id: 'todolistId2', title: 'Learn English', filter: 'all' },
    ],
    tasks: {
        ['todolistId1']: [
            { id: v1(), title: 'HTML', isDone: true },
            { id: v1(), title: 'CSS', isDone: true },
            { id: v1(), title: 'React', isDone: false },
        ],
        ['todolistId2']: [
            { id: v1(), title: 'HTML', isDone: true },
            { id: v1(), title: 'CSS', isDone: true },
            { id: v1(), title: 'React', isDone: false },
        ]
    },
    app: {
        error: null,
        status: 'idle'
    },
};
//@ts-ignore
export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
     <Provider store={storyBookStore}>{storyFn()}</Provider>
);