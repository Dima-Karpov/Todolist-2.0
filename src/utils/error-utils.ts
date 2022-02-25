import {setAppError, setAppStatus, SetErrorType, SetStatusType} from '../state/reducers/app-reducer';

import {CommonResponseType} from '../dal/todolists-api';
import {Dispatch} from 'react';


export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
  if (data.messages.length) {
    dispatch(setAppError({error: data.messages[0]}))
  } else {
    dispatch(setAppError({error: 'Some error occurred'}))
  }
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
  dispatch(setAppError(error.message ? {error: error.message} : {error: 'Some error occurred'}))
  dispatch(setAppStatus({status: 'failed'}))
}