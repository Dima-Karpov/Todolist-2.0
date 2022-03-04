import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {setAppStatus} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';

import {handleAsuncServerAppError, handleAsuncServerNetworkError} from '../../utils/error-utils';
import {AppRootStateType, ThunkError} from '../types';

const initialState = {
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk<
  undefined,
  {dataLogin: LoginParamsType},
  ThunkError
>('auth/loginUser', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try
  {
    const result = await authApi.login(param.dataLogin)
    if (result.data.resultCode === 0)
    {
      return;
    } else
    {
      return handleAsuncServerAppError(result.data, thunkAPI);
    }
  } catch (error: any)
  {
    return handleAsuncServerNetworkError(error, thunkAPI);
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}));
  }

});
export const loguotUser = createAsyncThunk<
  undefined,
  undefined,
  ThunkError
>('auth/loguotUser', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try
  {
    const result = await authApi.logout();
    if (result.data.resultCode === 0)
    {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
      return;
    } else
    {
      return handleAsuncServerAppError(result.data, thunkAPI);
    }
  } catch (error: any)
  {
    return handleAsuncServerNetworkError(error, thunkAPI);
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}));
  }

});

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    })
      .addCase(loguotUser.fulfilled, (state) => {
        state.isLoggedIn = !state.isLoggedIn;
      })
  },
})

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;

export const authActions = {loginUser, loguotUser, ...slice.reducer}

