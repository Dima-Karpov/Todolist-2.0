import {Dispatch} from 'redux';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value;
    },
  },
})

export const authReducer = slice.reducer;

// action
export const {setIsLoggedIn} = slice.actions;

// thunk
export const loginUser = (dataLogin: LoginParamsType) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'} ))
  try
  {
    const result = await authApi.login(dataLogin)
    if (result.data.resultCode === 0)
    {
      dispatch(setIsLoggedIn({value: true}));
    } else
    {
      handleServerAppError(result.data, dispatch);
    }
    dispatch(setAppStatus({status: 'succeeded'}));
  } catch (error)
  {
    handleServerNetworkError(error, dispatch);
  } finally
  {
    dispatch(setAppStatus({status: 'failed'}));
  }
};
export const loguotUser = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  try
  {
    const result = await authApi.logout()
    if (result.data.resultCode === 0)
    {
      dispatch(setIsLoggedIn({value: false}));
    } else
    {
      handleServerAppError(result.data, dispatch);
    }
    dispatch(setAppStatus({status: 'succeeded'}));
  } catch (error)
  {
    handleServerNetworkError(error, dispatch);
  } finally
  {
    dispatch(setAppStatus({status: 'failed'}));
  }
};

export type IsLoggedInType = ReturnType<typeof setIsLoggedIn>

export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}