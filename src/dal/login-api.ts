import {CommonResponseType, instance} from './todolists-api';
import {AxiosResponse} from 'axios';
import {auth, me} from "../endpoints";


export const authApi = {
  login(dataLogin: LoginParamsType) {
    return instance.post<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>(auth, dataLogin)
  },
  logout(){
    return instance.delete<{}, AxiosResponse<CommonResponseType<{userId?: number}>>>(auth)
  },
  me(){
    return instance.get<{}, AxiosResponse<CommonResponseType<{id: number, email: string, login: string}>>>(me)
  },
};
 
export type LoginParamsType = {
  email: string,
  password: string,
  rememberMe: boolean,
  captcha?: string,
};
