import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {FieldErrorType} from '../../dal/todolists-api';
import {AppRootStateType} from '../store';

const initialState = {
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk<
                                      undefined,
                                      {dataLogin: LoginParamsType},
                                      {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}}
                                        >('auth/loginUser', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const result = await authApi.login(param.dataLogin)
    if (result.data.resultCode === 0) {
      return;
    } else {
      handleServerAppError(result.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({errors: result.data.messages, fieldsErrors: result.data.fieldsError});
    }
  } catch (e: any) {
    let error: AxiosError<any> = e;
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined});
  } finally {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}));
  }

});
export const loguotUser = createAsyncThunk('auth/loguotUser', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const result = await authApi.logout();
    if (result.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
      return;
    } else {
      handleServerAppError(result.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (e: any) {
    let error: AxiosError<any> = e;
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}));
  }

});

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>){
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    });
    builder.addCase(loguotUser.fulfilled, (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    });
  },
})

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;

export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}