import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Dispatch} from 'redux';
import {authApi} from '../../dal/login-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {IsLoggedInType, setIsLoggedIn} from './auth-reducer';

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
    setAppInitialized(state, action: PayloadAction<{value: boolean}>) {
      state.isInitialized = action.payload.value;
    },

  },
})

export const appReducer = slice.reducer;
export const {setAppError, setAppStatus, setAppInitialized} = slice.actions;

// thunk
export const initializeApp = () => async (dispatch: Dispatch) => {
    dispatch(setAppInitialized({value: false}))
    try
    {
      const result = await authApi.me()
      if (result.data.resultCode === 0) {
        dispatch(setIsLoggedIn({value: true}));
        dispatch(setAppInitialized({value: true}));
      } else {
        handleServerAppError(result.data, dispatch);
      }
    } catch (error){
      handleServerNetworkError(error, dispatch);
    } finally{
      dispatch(setAppInitialized({value: true}));
    }
  };



export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';