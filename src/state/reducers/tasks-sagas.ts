import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatus} from "./app-reducer";
import {CommonResponseType, GetTasksResponse, TaskType, todolistApi} from "../../dal/todolists-api";
import {AxiosResponse} from "axios";
import {addTaskAC, removeTaskAC, setTasks} from "./task-reducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/error-utils";


//sagas

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatus('loading'))
    try {
        const data: GetTasksResponse = yield call(todolistApi.getTasks, action.todolistId);
        const tasks: TaskType[] = data.items;
        yield put(setTasks(action.todolistId, tasks));
        yield put(setAppStatus('succeeded'))
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const fetchTasks = (todolistId: string) => ({type: 'TASK/FETCH-TASK', todolistId});

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatus('loading'))
    try {
        yield call(todolistApi.deletTask, action.todolistId, action.id)
        yield put(removeTaskAC(action.todolistId, action.id))
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('failed'))
    }
}

export const removeTask = (todolistId: string, id: string) => ({type: 'TASK/DELETE-TASK', todolistId, id});


export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
    debugger
    yield put(setAppStatus('loading'))
    try {
        const result: AxiosResponse<CommonResponseType<{ item: TaskType }>> =
            yield call(todolistApi.addTask, action.todolistId, action.title);

        if (result.data.resultCode === 0) {
            yield put(addTaskAC(result.data.data.item));
        } else {
            yield* handleServerAppErrorSaga(result.data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('failed'))
}
}

export const addTask = (todolistId: string, title: string) => ({type: 'TASK/ADD-NEW-TASK', todolistId, title} as const);





export function* tasksWatcherSaga() {
    debugger
    yield takeEvery('TASK/FETCH-TASK', fetchTasksWorkerSaga)
    yield takeEvery('TASK/DELETE-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASK/ADD-NEW-TASK', addTaskWorkerSaga)
}

