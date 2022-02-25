import {Dispatch} from 'react';
import {setAppError, setAppStatus, SetErrorType, SetStatusType} from '../state/reducers/app-reducer';

import {CommonResponseType} from '../dal/todolists-api';


export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
  if (data.messages.length) {
    dispatch(setAppError({error: data.messages[0]}));
  } else {
    dispatch(setAppError({error: 'Some error occurred'}));
  }
};

export const handleServerNetworkError = (error: any, dispatch: Dispatch<SetErrorType | SetStatusType>) => {
  dispatch(setAppError({error: error.message ?  error.message : 'Some error occurred'}));
  dispatch(setAppStatus({status: 'failed'}));
};