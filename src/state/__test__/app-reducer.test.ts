import {appReducer, setError, setStatus} from './../app-reducer';

type InitialStateType = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

let startState: InitialStateType;

beforeEach(() => {
  startState = {
    error: null,
    status: 'idle',
  }
});

test('correct error message should be set', () => {
  const endState = appReducer(startState, setError('some error'));

  expect(endState.error).toBe('some error');
});

test('correct status message should be set', () => {
  const endState = appReducer(startState, setStatus('loading'));

  expect(endState.status).toBe('loading');
});