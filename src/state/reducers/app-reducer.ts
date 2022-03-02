import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authApi} from '../../dal/login-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setIsLoggedIn} from './auth-reducer';

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

export const initializeApp = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppInitialized({isInitialized: false}))
  try {
    const result = await authApi.me()
    if (result.data.resultCode === 0) {
      thunkAPI.dispatch(setIsLoggedIn({isLoggedIn: true}));
    } else {
      handleServerAppError(result.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
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

export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';