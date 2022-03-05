import {takeEvery} from "redux-saga/effects";
import {loginUserWorkerSaga, logoutUserWorkerSaga} from "./auth-sagas";

const initialState = {
    isLoggedIn: false,
};

type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'LOGIN/SET-IS-LOGGED-IN':
            return {
                ...state,
                isLoggedIn: action.value
            }
        default:
            return state
    }
};

// action
export const setIsLoggedIn = (value: boolean) =>
    ({type: 'LOGIN/SET-IS-LOGGED-IN', value} as const);


export type IsLoggedInType = ReturnType<typeof setIsLoggedIn>
type ActionsType = IsLoggedInType;


export type ErrorType = {
    config: any
    isAxiosError: boolean
    request: any
    response: any
    toJSON: any
    message: string
    stack: string
}