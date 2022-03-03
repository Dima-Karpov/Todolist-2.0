import {combineReducers} from "redux";
import {todolistReducer} from './reducers/todolist-reducer';
import {taskReducer} from './reducers/task-reducer';
import thunk from "redux-thunk";
import {appReducer} from "./reducers/app-reducer";
import {authReducer} from "./reducers/auth-reducer";
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {FieldErrorType} from "../dal/todolists-api";

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

 type AppDispatchType = typeof store.dispatch;
export type ThunkError = {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}};

export const useAppDispatch = () => useDispatch<AppDispatchType>();

//@ts-ignore
window.store = store
