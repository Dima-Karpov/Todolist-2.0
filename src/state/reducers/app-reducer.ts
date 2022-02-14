import {Dispatch} from 'react';


const initialState: InitialStateType = {
  status: 'idle',
  error: null,
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status};
    case 'APP/SET-ERROR':
      return {...state, error: action.error};
    default:
      return state
  }
};

// action
export const setAppError = (error: string | null) =>
  ({type: 'APP/SET-ERROR', error} as const);
export const setAppStatus = (status: RequestStatusType) =>  
  ({type: 'APP/SET-STATUS', status} as const);

// thunk

type InitialStateType = {
  status: RequestStatusType,
  error: string | null,
};

export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type ActionsType = SetStatusType | SetErrorType 

export type AppThunkDispatch = Dispatch<ActionsType>