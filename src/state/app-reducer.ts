import {Dispatch} from 'react';
import {TaskPriorities, TaskStatuses, TaskType, todolistApi} from '../dal/todolists-api';

type InitialStateType = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
};


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type)
  {
    case 'APP/SET-STATUS':
      return {...state, status: action.status};
    case 'APP/SET-ERROR':
      return {...state, error: action.error};
    default:
      return state
  }
};

// action
export const removeTaskAC = (todolistId: string, id: string) =>
  ({type: 'TASK/REMOVE-TASK', todolistId, id} as const);


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



type ActionsType = any

type ThunkDispatch = Dispatch<ActionsType>