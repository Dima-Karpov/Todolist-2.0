import {initializeAppWorkerSaga} from "../reducers/app-sagas"
import {authApi} from "../../dal/login-api";
import {call, put} from "redux-saga/effects";
import {CommonResponseType} from "../../dal/todolists-api";
import {setIsLoggedIn} from "../reducers/auth-reducer";
import {setAppInitialized} from "../reducers/app-reducer";

let fakeMeResponse: CommonResponseType<{ id: number, email: string, login: string }>;

beforeEach(() => {
    fakeMeResponse = {
        resultCode: 0,
        data: {id: 1, email: '', login: ''},
        messages: [],
        fieldError: []
    }
});


test('initializeAppWorkerSaga login success', () => {
    const generator = initializeAppWorkerSaga();
    let result = generator.next();

    expect(result.value).toEqual(call(authApi.me));

    result = generator.next(fakeMeResponse);
    expect(result.value).toEqual(put(setIsLoggedIn(true)))

    result = generator.next()
    expect(result.value).toEqual(put(setAppInitialized(true)))
})
test('initializeAppWorkerSaga login unsuccess', () => {
    const generator = initializeAppWorkerSaga();
    let result = generator.next();

    expect(result.value).toEqual(call(authApi.me));

    fakeMeResponse.resultCode = 1;
    result = generator.next(fakeMeResponse);
    expect(result.value).toEqual(put(setAppInitialized(true)))
    result = generator.next();
    expect(result.done).toBeTruthy()
})

