import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Dispatch} from 'redux';
import {authApi} from '../../dal/login-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {IsLoggedInType, setIsLoggedIn} from './auth-reducer';


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

export const appReducer = slice.reducer
// (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'APP/SET-STATUS':
//       return {...state, status: action.status};
//     case 'APP/SET-ERROR':
//       return {...state, error: action.error};
//     case 'APP/SET-APP-INITIALIZED': 
//       return {...state, isInitialized: action.value}
//     default:
//       return state
//   }
// };

// action

export const {setAppError, setAppStatus, setAppInitialized} = slice.actions;

// export const setAppError = (error: string | null) =>
//   ({type: 'APP/SET-ERROR', error} as const);
// export const setAppStatus = (status: RequestStatusType) =>  
//   ({type: 'APP/SET-STATUS', status} as const);
// export const setAppInitialized = (value: boolean) =>  
//   ({type: 'APP/SET-APP-INITIALIZED', value} as const);

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

type InitialStateType = {
  status: RequestStatusType,
  error: string | null,
  isInitialized: boolean,
};

export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type ActionsType = SetStatusType | SetErrorType | ReturnType<typeof setAppInitialized>

export type AppThunkDispatch = Dispatch<ActionsType | IsLoggedInType >