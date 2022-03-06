import {authApi, LoginParamsType} from "../../dal/login-api";
import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatus} from "./app-reducer";
import {AxiosResponse} from "axios";
import {CommonResponseType} from "../../dal/todolists-api";
import {setIsLoggedIn} from "./auth-reducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/error-utils";

export function* loginUserWorkerSaga(acton: ReturnType<typeof loginUser>) {
    yield put(setAppStatus('loading'))
    try {
        const result: AxiosResponse<CommonResponseType<{ userId?: number }>> = yield call(authApi.login, acton.dataLogin)
        if (result.data.resultCode === 0) {
            yield put(setIsLoggedIn(true));
        } else {
            yield* handleServerAppErrorSaga(result.data)
        }
        yield put(setAppStatus('succeeded'));
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('failed'));
    }
}

export const loginUser = (dataLogin: LoginParamsType) => ({type: 'AUTH/LOGIN-USER', dataLogin});

export function* logoutUserWorkerSaga() {
    yield put(setAppStatus('loading'))
    try {
        const result: AxiosResponse<CommonResponseType<{ userId?: number }>> = yield call(authApi.logout)
        if (result.data.resultCode === 0) {
            yield put(setIsLoggedIn(false));
        } else {
            yield* handleServerAppErrorSaga(result.data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    } finally {
        yield put(setAppStatus('failed'));
    }
}

export const logoutUser = () => ({type: 'AUTH/LOGOUT-USER'});

export function* authWatcherSaga() {
    yield takeEvery('AUTH/LOGIN-USER', loginUserWorkerSaga)
    yield takeEvery('AUTH/LOGOUT-USER', logoutUserWorkerSaga)
}
