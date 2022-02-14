import {CommonResponseType, instance} from './todolists-api';
import {AxiosResponse} from 'axios';



export const authApi = {
  login(dataLogin: LoginParamsType) {
    return instance.post<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>('auth/login', dataLogin)
  },
};

export type LoginParamsType = {
  email: string,
  password: string,
  rememberMe: boolean,
  captcha?: string,
};
