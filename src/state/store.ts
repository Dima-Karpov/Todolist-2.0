import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistReducer} from './reducers/todolist-reducer';
import {taskReducer} from './reducers/task-reducer';
import thunk from "redux-thunk";
import {appReducer} from "./reducers/app-reducer";
import {authReducer} from "./reducers/auth-reducer";
import createSagaMiddleware from "redux-saga";
import {tasksWatcherSaga} from "./reducers/tasks-sagas";
import {appWatcherSaga,} from "./reducers/app-sagas";
import {todolistWatcherSaga} from "./reducers/todolist-sagas";
import {authWatcherSaga} from "./reducers/auth-sagas";


export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware()
export const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield appWatcherSaga()
    yield authWatcherSaga()
    yield tasksWatcherSaga()
    yield todolistWatcherSaga()
}
