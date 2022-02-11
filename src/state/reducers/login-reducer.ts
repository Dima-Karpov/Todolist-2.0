import {Dispatch} from 'react';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setAppError, SetErrorType, setAppStatus, SetStatusType} from './app-reducer';
import {AppRootStateType} from '../store';

const initialState = {

};

type InitialStateType = typeof initialState;

export const loginReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type)
  {
    default:
      return state
  }
};

// action
// export const removeTaskAC = (todolistId: string, id: string) =>
//   ({type: 'TASK/REMOVE-TASK', todolistId, id} as const);

// thunk
export const fetchTasks = () => async (dispatch: ThunkDispatch) => {
  dispatch(setAppStatus('loading'))
  try
  {
   
  } catch (error)
  {
    handleServerNetworkError(error, dispatch);
  }
};



type ActionsType = any;

type ThunkDispatch = Dispatch<ActionsType | SetErrorType | SetStatusType>

export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}