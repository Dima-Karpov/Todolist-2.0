const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status};
        case 'APP/SET-ERROR':
            return {...state, error: action.error};
        case 'APP/SET-APP-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
};

// action
export const setAppError = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const);
export const setAppStatus = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const);
export const setAppInitialized = (value: boolean) =>
    ({type: 'APP/SET-APP-INITIALIZED', value} as const);


type InitialStateType = {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean,
};

export type SetErrorType = ReturnType<typeof setAppError>
export type SetStatusType = ReturnType<typeof setAppStatus>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type ActionsType = SetStatusType | SetErrorType | ReturnType<typeof setAppInitialized>

