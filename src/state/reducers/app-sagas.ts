import {CommonResponseType} from "../../dal/todolists-api";
import {call, put, takeEvery} from "redux-saga/effects";
import {authApi} from "../../dal/login-api";
import {setIsLoggedIn} from "./auth-reducer";
import {setAppInitialized} from "./app-reducer";
import {AxiosResponse} from "axios";

//sagas
function* initializeAppWorkerSaga() {
    try {
        const result: AxiosResponse<CommonResponseType<{ id: number, email: string, login: string }>> =
            yield call(authApi.me)

        if (result.data.resultCode === 0) {
            yield put(setIsLoggedIn(true));
            yield put(setAppInitialized(true));
        } else {

        }
    } catch (error) {

    } finally {
        yield put(setAppInitialized(true));
    }
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'});

export function* appWatcherSaga() {
    yield takeEvery('APP/INITIALIZE-APP', initializeAppWorkerSaga)
}