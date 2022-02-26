import {appReducer, setAppError, setAppStatus} from '../reducers/app-reducer';

type InitialStateType = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
  isInitialized: boolean,
};

let startState: InitialStateType;

beforeEach(() => {
  startState = {
    error: null,
    status: 'idle',
    isInitialized: false,
  }
});

test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppError({error: 'some error'}));

  expect(endState.error).toBe('some error');
});

test('correct status message should be set', () => {
  const endState = appReducer(startState, setAppStatus({status: 'loading'}));

  expect(endState.status).toBe('loading');
});