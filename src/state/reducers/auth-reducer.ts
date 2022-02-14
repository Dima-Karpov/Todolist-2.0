import {Dispatch} from 'react';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {SetErrorType, setAppStatus, SetStatusType} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';

const initialState = {
  isLoggedIn: false,
};

type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN/SET-IS-LOGGED-IN':
      return {
        ...state,
        isLoggedIn: action.value
      }
    default:
      return state
  }
};

// action
export const setIsLoggedIn = (value: boolean) =>
  ({type: 'LOGIN/SET-IS-LOGGED-IN', value} as const);

// thunk
export const loginUser = (dataLogin: LoginParamsType) => async (dispatch: ThunkDispatch) => {
  dispatch(setAppStatus('loading'))
  try {
    const result = await authApi.login(dataLogin)
    if (result.data.resultCode === 0) {
      setIsLoggedIn(true);
    } else {
      handleServerAppError(result.data, dispatch);
    }
    dispatch(setAppStatus('succeeded'));
  } catch (error)
  {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatus('failed'));
  }
};



type ActionsType = ReturnType<typeof setIsLoggedIn>

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