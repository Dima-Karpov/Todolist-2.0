import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {authApi} from '../../dal/login-api';
import {setIsLoggedIn} from './auth-reducer';

import {handleAsuncServerNetworkError, handleAsuncServerAppError} from '../../utils/error-utils';
import {AppRootStateType, ThunkError} from '../types';

type InitialStateType = {
  status: RequestStatusType,
  error: string | null,
  isInitialized: boolean,
};

const initialState: InitialStateType = {
  error: null,
  status: 'idle',
  isInitialized: false,
};

export const initializeApp = createAsyncThunk<
 undefined,
 undefined,
 ThunkError
>('app/initializeApp', async (param, thunkAPI) => {
  // thunkAPI.dispatch(setAppInitialized({isInitialized: false}))
  try {
    const result = await authApi.me()
    if (result.data.resultCode === 0) {
      thunkAPI.dispatch(setIsLoggedIn({isLoggedIn: true}));
    } else {
      return handleAsuncServerAppError(result.data, thunkAPI);
    }
  } catch (error: any) {
    return handleAsuncServerNetworkError(error, thunkAPI);
  }

});

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppError(state, action: PayloadAction<{error: string | null}>) {
      state.error = action.payload.error;
    },
    setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
      state.status = action.payload.status;
    },
    setAppInitialized(state, action: PayloadAction<{isInitialized: boolean}>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});
export const appReducer = slice.reducer;
export const {setAppError, setAppStatus, setAppInitialized} = slice.actions;

export const selectStatus = (state: AppRootStateType) => state.app.status;
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;

export const appActions = {initializeApp, ...slice.actions};

export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';