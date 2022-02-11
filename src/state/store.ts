import { applyMiddleware, combineReducers, createStore } from "redux";
import { todolistReducer } from './reducers/todolist-reducer';
import { taskReducer } from './reducers/task-reducer';
import thunk from "redux-thunk";
import {appReducer} from "./reducers/app-reducer";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
});
export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store
