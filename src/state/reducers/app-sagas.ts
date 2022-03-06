import {CommonResponseType} from "../../dal/todolists-api";
import {call, put, takeEvery} from "redux-saga/effects";
import {authApi} from "../../dal/login-api";
import {setIsLoggedIn} from "./auth-reducer";
import {setAppInitialized} from "./app-reducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/error-utils";

//sagas
export function* initializeAppWorkerSaga() {
    try {
        const data: CommonResponseType<{ id: number, email: string, login: string }> =
            yield call(authApi.me)

        if (data.resultCode === 0) {
            yield put(setIsLoggedIn(true));
            yield put(setAppInitialized(true));
        } else {
            yield* handleServerAppErrorSaga(data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppInitialized(true));
    }
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'});

export function* appWatcherSaga() {
    yield takeEvery('APP/INITIALIZE-APP', initializeAppWorkerSaga)
}