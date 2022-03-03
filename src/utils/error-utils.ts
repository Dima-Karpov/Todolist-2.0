import {Dispatch} from 'react';
import {setAppError, setAppStatus, SetErrorType, SetStatusType} from '../state/reducers/app-reducer';

import {CommonResponseType} from '../dal/todolists-api';
import {AxiosError} from 'axios';


export const handleServerAppError = <T>(
  data: CommonResponseType<T>,
  dispatch: Dispatch<SetErrorType | SetStatusType>,
  showError = true
) => {
  if (showError)
  {
    dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  }
  dispatch(setAppStatus({status: 'failed'}));
};

export const handleServerNetworkError = (
  error: any,
  dispatch: Dispatch<SetErrorType | SetStatusType>,
  showError = true
) => {
  if (showError)
  {
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}));
  }
  dispatch(setAppStatus({status: 'failed'}));
};

export const handleAsuncServerNetworkError = (
  error: AxiosError,
  thunkAPI: any, //BaseThunkAPI<S, E, D, extends Dispatch = Dispatch, Rejected = undefined>
  showError = true
) => {
  if (showError)
  {
    thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}));
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}));

  return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}