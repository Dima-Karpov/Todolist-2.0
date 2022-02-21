import {CommonResponseType, instance} from './todolists-api';
import {AxiosResponse} from 'axios';


export const authApi = {
  login(dataLogin: LoginParamsType) {
    return instance.post<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>('auth/login', dataLogin)
  },
  logout(){
    return instance.delete<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>('auth/login')
  },
  me(){
    return instance.get<{}, AxiosResponse<CommonResponseType<{id: number, email: string, login: string}>>>('auth/me')
  },
};
 
export type LoginParamsType = {
  email: string,
  password: string,
  rememberMe: boolean,
  captcha?: string,
};
