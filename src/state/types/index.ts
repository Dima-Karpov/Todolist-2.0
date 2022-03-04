import {FieldErrorType} from '../../dal/todolists-api';
import {rootReducer} from '../reducers';
import {store} from '../store';

//redux common types
export type AppRootStateType = ReturnType<typeof rootReducer>

export type ThunkError = {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}};
export type AppDispatchType = typeof store.dispatch;

//helper
export type ErrorType = {
  config: any
  isAxiosError: boolean
  request: any
  response: any
  toJSON: any
  message: string
  stack: string
}
