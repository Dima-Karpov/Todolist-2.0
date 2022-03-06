import {setAppError, setAppStatus, SetErrorType, SetStatusType} from '../state/reducers/app-reducer';

import {CommonResponseType} from '../dal/todolists-api';
import {Dispatch} from 'react';
import {put} from 'redux-saga/effects';


export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
}

export function* handleServerAppErrorSaga<T>(data: CommonResponseType<T>) {
    if (data.messages.length) {
        yield put(setAppError(data.messages[0]))
    } else {
        yield put(setAppError('Some error occurred'))
    }
}

export function* handleServerNetworkErrorSaga(error: any) {
    yield put(setAppError(error.message ? error.message : 'Some error occurred'))
    yield put(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
    dispatch(setAppError(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatus('failed'))
}