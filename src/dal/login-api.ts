import {CommonResponseType, instance} from './todolists-api';
import {AxiosResponse} from 'axios';


export const authApi = {
  me(): Promise<AxiosResponse<CommonResponseType<{id: number, email: string, login: string}>>>{
    return instance.get<{}, AxiosResponse<CommonResponseType<{id: number, email: string, login: string}>>>('auth/me')
  },
  login(dataLogin: LoginParamsType): Promise<AxiosResponse<CommonResponseType<{userId?: number}>>> {
    return instance.post<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>('auth/login', dataLogin)
  },
  logout(): Promise<AxiosResponse<CommonResponseType<{userId?: number}>>>{
    return instance.delete<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>('auth/login')
  },
};
 
export type LoginParamsType = {
  email: string,
  password: string,
  rememberMe: boolean,
  captcha?: string,
};
