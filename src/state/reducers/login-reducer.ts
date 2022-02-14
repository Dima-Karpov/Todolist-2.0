import {Dispatch} from 'react';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {SetErrorType, setAppStatus, SetStatusType} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';

const initialState = {

};

type InitialStateType = typeof initialState;

export const loginReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type)
  {
    default:
      return state
  }
};

// action
// export const removeTaskAC = (todolistId: string, id: string) =>
//   ({type: 'TASK/REMOVE-TASK', todolistId, id} as const);

// thunk
export const loginUser = (dataLogin: LoginParamsType) => async (dispatch: ThunkDispatch) => {
  dispatch(setAppStatus('loading'))
  try {
    const result = await authApi.login(dataLogin)
    if (result.data.resultCode === 0) {
      console.log(result.data)
      
    } else {
      handleServerAppError(result.data, dispatch);
    }

    dispatch(setAppStatus('succeeded'))
   
  } catch (error)
  {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatus('failed'))
  }
};



type ActionsType = any;

type ThunkDispatch = Dispatch<ActionsType | SetErrorType | SetStatusType>

export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}