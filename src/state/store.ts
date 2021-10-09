import { applyMiddleware, combineReducers, createStore } from "redux";
import { todolistReducer } from './todolist-reducer';
import { taskReducer } from './task-reducer';
import thunk from "redux-thunk";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    task: taskReducer,
});
export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store
