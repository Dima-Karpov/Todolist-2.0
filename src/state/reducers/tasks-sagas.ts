import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatus} from "./app-reducer";
import {
    CommonResponseType,
    GetTasksResponse,
    TaskType,
    todolistApi,
    UpdateTaskModelType
} from "../../dal/todolists-api";
import {AxiosResponse} from "axios";
import {addTaskAC, removeTaskAC, setTasks, UpdateDomainTaskModelType, updateTaskAC} from "./task-reducer";
import {AppRootStateType} from "../store";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


//sagas

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    debugger
    yield put(setAppStatus('loading'))
    try {
        const result: AxiosResponse<GetTasksResponse> = yield call(todolistApi.getTasks, action.todolistId);
        const tasks: TaskType[] = result.data.items;
        yield put(setTasks(action.todolistId, tasks));
        yield put(setAppStatus('succeeded'))
    } catch (error) {

    }
}

export const fetchTasks = (todolistId: string) => ({type: 'TASK/FETCH-TASK', todolistId});

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatus('loading'))
    try {
        yield call(todolistApi.deletTask, action.todolistId, action.id)
        yield put(removeTaskAC(action.todolistId, action.id))
    } catch (error) {

    } finally {
        yield put(setAppStatus('failed'))
    }
}

export const removeTask = (todolistId: string, id: string) => ({type: 'TASK/DELETE-TASK', todolistId, id});


export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
    yield put(setAppStatus('loading'))
    try {
        const result: AxiosResponse<CommonResponseType<{ item: TaskType }>> =
            yield call(todolistApi.addTask, action.todolistId, action.title);

        if (result.data.resultCode === 0) {
            yield put(addTaskAC(result.data.data.item));
        } else {
        }
    } catch (error) {

    } finally {
        yield put(setAppStatus('failed'))
    }
}

export const addTask = (todolistId: string, title: string) => ({type: 'TASK/ADD-TASK', todolistId, title});





export function* tasksWatcherSaga() {
    yield takeEvery('TASK/FETCH-TASK', fetchTasksWorkerSaga)
    yield takeEvery('TASK/DELETE-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASK/ADD-TASK', addTaskWorkerSaga)
}

