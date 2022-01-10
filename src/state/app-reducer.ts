import {Dispatch} from 'react';
import { todolistApi} from '../dal/todolists-api';



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
export const setError = (error: string | null) =>
  ({type: 'APP/SET-ERROR', error} as const);
export const setStatus = (status: RequestStatusType) =>  
  ({type: 'APP/SET-STATUS', status} as const);



// thunk
export const fetchTasks = (todolistId: string) => async (dispatch: ThunkDispatch) => {
  try
  {
    // status
    const res = await todolistApi.getTasks(todolistId);
    const tasks = res.data.items;
    // status
  } catch (e: any)
  {

  }
};

type InitialStateType = {
  status: RequestStatusType,
  error: string | null,
};

export type SetErrorType = ReturnType<typeof setStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type ActionsType = ReturnType<typeof setError> | SetErrorType 

type ThunkDispatch = Dispatch<ActionsType>