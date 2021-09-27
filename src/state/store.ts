import { combineReducers, createStore } from "redux";
import { todolistReducer } from './todolist-reducer';
import { taskReducer } from './task-reducer';

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    task: taskReducer,
});
export const store = createStore(rootReducer);

//@ts-ignore
window.store = store
