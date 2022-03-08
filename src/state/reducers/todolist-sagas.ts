import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatus} from "./app-reducer";
import {AxiosResponse} from "axios";
import {CommonResponseType, todolistApi, TodolistType} from "../../dal/todolists-api";
import {
    addTodolistAC,
    changeTodolistEntityStatus,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolists
} from "./todolist-reducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/error-utils";

export function* fetchTodolistWorkerSaga() {
    try {
        yield put(setAppStatus('loading'));
        const result: AxiosResponse<TodolistType[]> = yield call(todolistApi.getTodo);
        yield put(setTodolists(result.data));

    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('succeeded'));
    }
}

export const fetchTodolist = () => ({type: 'TODOLIST/FETCH-TODOLIST'})

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolist>) {
    try {
        yield put(setAppStatus('loading'));
        yield put(changeTodolistEntityStatus(action.todoListId, 'loading'))
        yield call(todolistApi.deletTodo, action.todoListId);
        yield put(removeTodolistAC(action.todoListId));
        yield put(setAppStatus('succeeded'));
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('succeeded'));
    }
}


export const removeTodolist = (todoListId: string) => ({type: 'TODOLIST/REMOVE-CURRENT-TODOLIST', todoListId});

export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolist>) {
    yield put(setAppStatus('loading'));
    try {
        const result: AxiosResponse<CommonResponseType<{ item: TodolistType }>> =
            yield call(todolistApi.createTodo, action.title);

        if (result.data.resultCode === 0) {
            yield put(addTodolistAC(result.data.data.item))
        } else {
            yield* handleServerAppErrorSaga(result.data)
        }
        yield put(setAppStatus('succeeded'));
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('succeeded'));
    }
}

export const addTodolist = (title: string) => ({type: 'TODOLIST/ADD-NEW-TODOLIST', title});

export function* changeTodolistTitleWorkerSaga(action: ReturnType<typeof changeTodolistTitle>) {
    yield put(setAppStatus('loading'));
    try {
        const result: AxiosResponse<CommonResponseType<{ item: TodolistType }>> =
            yield call(todolistApi.updateTodo, action.todolistId, action.title);

        if (result.data.resultCode === 0) {
            yield put(changeTodolistTitleAC(action.todolistId, action.title));
        } else {
            yield*  handleServerAppErrorSaga(result.data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('succeeded'));
    }
}

export const changeTodolistTitle = (todolistId: string, title: string) => ({
    type: 'TODOLIST/CHANGE-CURRENT-TODOLIST-TITLE',
    todolistId,
    title
});


export function* todolistWatcherSaga() {
    yield takeEvery('TODOLIST/FETCH-TODOLIST', fetchTodolistWorkerSaga)
    yield takeEvery('TODOLIST/REMOVE-CURRENT-TODOLIST', removeTodolistWorkerSaga)
    yield takeEvery('TODOLIST/ADD-NEW-TODOLIST', addTodolistWorkerSaga)
    yield takeEvery('TODOLIST/CHANGE-CURRENT-TODOLIST-TITLE', changeTodolistTitleWorkerSaga)

}