import {setAppError, setAppStatus} from '../state/reducers/app-reducer';

import {CommonResponseType} from '../dal/todolists-api';
import {AxiosError} from 'axios';

//BaseThunkAPI<S, E, D, extends Dispatch = Dispatch, Rejected = undefined>
type ThunkAPIType = {
  dispatch: (action: any) => any,
  rejectWithValue: Function,
};

export const handleAsuncServerAppError = <T>(
  data: CommonResponseType<T>,
  thunkAPI: ThunkAPIType, 
  showError = true
) => {
  if (showError)
  {
    thunkAPI.dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}));
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsError})
};

export const handleAsuncServerNetworkError = (
  error: AxiosError,
  thunkAPI: ThunkAPIType, 
  showError = true
) => {
  if (showError)
  {
    thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}));
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}));

  return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}