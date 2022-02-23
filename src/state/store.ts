import {combineReducers} from "redux";
import {todolistReducer} from './reducers/todolist-reducer';
import {taskReducer} from './reducers/task-reducer';
import thunk from "redux-thunk";
import {appReducer} from "./reducers/app-reducer";
import {authReducer} from "./reducers/auth-reducer";
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
});
// export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});

//@ts-ignore
window.store = store
