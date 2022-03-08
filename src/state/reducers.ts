import {combineReducers} from "redux";
import {todolistReducer} from './reducers/todolist-reducer';
import {taskReducer} from './reducers/task-reducer';
import {appReducer} from "./reducers/app-reducer";
import {authReducer} from "./reducers/auth-reducer";


export const rootReducer = combineReducers({
  todolist: todolistReducer,
  tasks: taskReducer,
  app: appReducer,
  auth: authReducer,
});