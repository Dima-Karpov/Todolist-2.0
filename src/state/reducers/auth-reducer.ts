import {Dispatch} from 'redux';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {authApi, LoginParamsType} from '../../dal/login-api';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {FieldErrorType} from '../../dal/todolists-api';

const initialState = {
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk<
                                      {isLoggedIn: boolean},
                                      {dataLogin: LoginParamsType},
                                      {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}}
                                        >('auth/loginUser', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const result = await authApi.login(param.dataLogin)
    if (result.data.resultCode === 0) {
      return {isLoggedIn: true};
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

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>){
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
})

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;

export const loguotUser = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  try
  {
    const result = await authApi.logout()
    if (result.data.resultCode === 0)
    {
      dispatch(setIsLoggedIn({isLoggedIn: false}));
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


export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}